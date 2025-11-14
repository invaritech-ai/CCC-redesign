import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCookieBanner } from "@/hooks/use-cookie-banner";
import { X } from "lucide-react";

/**
 * Cookie Information Banner Component
 * 
 * Displays an informational banner about Sanity CDN cookies.
 * Optimized for users 55+ with large text, high contrast, and mobile-responsive design.
 * 
 * Features:
 * - Bottom-fixed banner (not modal)
 * - Large, clear text (18px+)
 * - High contrast colors
 * - Single "I Understand" button (44x44px minimum touch target)
 * - Mobile-first responsive design (stacked on mobile, horizontal on desktop)
 * - Smooth slide-up animation
 * - Accessible (ARIA labels, keyboard navigation)
 */
export const CookieBanner = () => {
  const { isVisible, acknowledge } = useCookieBanner();
  const bannerRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isVisible && bannerRef.current) {
      // Focus the banner for screen readers
      bannerRef.current.focus();
    }
  }, [isVisible]);

  // Handle Escape key to acknowledge (optional, but good UX)
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        acknowledge();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isVisible, acknowledge]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      role="region"
      aria-label="Cookie information notice"
      tabIndex={-1}
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom fade-in duration-300"
    >
      <div className="bg-background border-t-2 border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            {/* Text Content */}
            <div className="flex-1">
              <p className="text-lg leading-relaxed text-foreground">
                We use cookies from Sanity CDN to deliver images and cached content
                to improve your experience. These cookies do not store personal
                information.{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded transition-colors"
                  aria-label="Learn more about our privacy policy and cookie usage"
                >
                  Learn more
                </Link>
              </p>
            </div>

            {/* Button */}
            <div className="flex-shrink-0">
              <Button
                onClick={acknowledge}
                size="lg"
                className="w-full sm:w-auto min-h-[44px] px-8 py-3 text-base font-semibold shadow-md"
                aria-label="I understand and acknowledge the cookie notice"
              >
                I Understand
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

