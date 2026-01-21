import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
    siteKey: string;
    onVerify: (token: string) => void;
    onError?: () => void;
    theme?: "light" | "dark" | "auto";
    size?: "normal" | "compact";
}

declare global {
    interface Window {
        turnstile?: {
            render: (
                element: HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    "error-callback"?: () => void;
                    theme?: "light" | "dark" | "auto";
                    size?: "normal" | "compact";
                }
            ) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

export const Turnstile = ({
    siteKey,
    onVerify,
    onError,
    theme = "auto",
    size = "normal",
}: TurnstileProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load Turnstile script
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);

        return () => {
            // Cleanup: remove script and widget
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!isLoaded || !containerRef.current || !window.turnstile) {
            return;
        }

        // Render Turnstile widget
        try {
            const widgetId = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: onVerify,
                "error-callback": onError,
                theme,
                size,
            });
            widgetIdRef.current = widgetId;
        } catch (error) {
            console.error("[Turnstile] Failed to render:", error);
            if (onError) {
                onError();
            }
        }
    }, [isLoaded, siteKey, onVerify, onError, theme, size]);

    return <div ref={containerRef} className="turnstile-container" />;
};
