import {
    CheckCircle2,
    Award,
    Users,
    ArrowRight,
    Building2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DonateNowButton } from "./DonateNowButton";

const MAX_TILT_DEG = 5;
const GLARE_OFFSET_PERCENT = 40;

export const HeroSection = () => {
    const tiltRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);
    const [tiltInteractive, setTiltInteractive] = useState(false);

    useEffect(() => {
        const desktopMq = window.matchMedia(
            "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        );
        const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => {
            setTiltInteractive(desktopMq.matches && !motionMq.matches);
        };
        sync();
        desktopMq.addEventListener("change", sync);
        motionMq.addEventListener("change", sync);
        return () => {
            desktopMq.removeEventListener("change", sync);
            motionMq.removeEventListener("change", sync);
        };
    }, []);

    const resetTiltStyles = useCallback(() => {
        const el = tiltRef.current;
        if (!el) return;
        el.style.removeProperty("--hero-tilt-rx");
        el.style.removeProperty("--hero-tilt-ry");
        el.style.removeProperty("--hero-tilt-s");
        el.style.removeProperty("--hero-glare-x");
        el.style.removeProperty("--hero-glare-y");
    }, []);

    useEffect(() => {
        if (!tiltInteractive) {
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            pendingPointerRef.current = null;
            resetTiltStyles();
        }
    }, [tiltInteractive, resetTiltStyles]);

    const flushPointer = useCallback(() => {
        rafRef.current = null;
        const el = tiltRef.current;
        const p = pendingPointerRef.current;
        if (!el || !p || !tiltInteractive) return;

        const rect = el.getBoundingClientRect();
        const nx = (p.x - rect.left) / rect.width - 0.5;
        const ny = (p.y - rect.top) / rect.height - 0.5;
        const rx = `${-ny * 2 * MAX_TILT_DEG}deg`;
        const ry = `${nx * 2 * MAX_TILT_DEG}deg`;
        el.style.setProperty("--hero-tilt-rx", rx);
        el.style.setProperty("--hero-tilt-ry", ry);
        el.style.setProperty(
            "--hero-glare-x",
            `${50 + nx * GLARE_OFFSET_PERCENT}%`,
        );
        el.style.setProperty(
            "--hero-glare-y",
            `${50 + ny * GLARE_OFFSET_PERCENT}%`,
        );
    }, [tiltInteractive]);

    const onHeroTiltPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!tiltInteractive) return;
        pendingPointerRef.current = { x: e.clientX, y: e.clientY };
        if (rafRef.current == null) {
            rafRef.current = requestAnimationFrame(flushPointer);
        }
    };

    const onHeroTiltPointerEnter = () => {
        if (!tiltInteractive) return;
        tiltRef.current?.style.setProperty("--hero-tilt-s", "1.01");
    };

    const onHeroTiltPointerLeave = () => {
        pendingPointerRef.current = null;
        if (rafRef.current != null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        resetTiltStyles();
    };

    return (
        <section className="relative py-12 md:py-16 md:min-h-[calc(100vh-180px)] md:flex md:items-center bg-secondary/30">
            <div className="container mx-auto px-4 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 bg-muted-foreground/90 text-background rounded-lg border-2 border-background/20 shadow-md">
                            <Building2
                                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                                aria-hidden="true"
                            />
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse" />
                                <span className="text-sm sm:text-base font-semibold">
                                    Our residential care home is currently under
                                    redevelopment
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                                A Licensed Care Home in Hong Kong for
                                English-Speaking Elderly of Every Nationality
                                and Ethnicity
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Your support helps us create a safe, modern home
                                to reopen stronger. Together, we're building a
                                compassionate community where every senior is
                                valued and cared for with dignity.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    className="h-5 w-5 text-success"
                                    aria-hidden="true"
                                />
                                <span className="text-foreground font-medium">
                                    Section 88 Charity
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award
                                    className="h-5 w-5 text-success"
                                    aria-hidden="true"
                                />
                                <span className="text-foreground font-medium">
                                    45+ Years Serving HK
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users
                                    className="h-5 w-5 text-success"
                                    aria-hidden="true"
                                />
                                <span className="text-foreground font-medium">
                                    80+ Community Members
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <DonateNowButton size="lg" />
                            <Button
                                variant="outline"
                                size="lg"
                                className="gap-2"
                                asChild
                            >
                                <Link to="/redevelopment">
                                    Learn more about Redevelopment
                                    <ArrowRight
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Image — desktop: subtle tilt + glare (see index.css) */}
                    <div className="hero-tilt-perspective relative">
                        <div
                            ref={tiltRef}
                            className="hero-tilt-card relative"
                            onMouseMove={onHeroTiltPointerMove}
                            onMouseEnter={onHeroTiltPointerEnter}
                            onMouseLeave={onHeroTiltPointerLeave}
                        >
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                                <picture>
                                    <source
                                        srcSet="/hero-image-custom.webp"
                                        type="image/webp"
                                    />
                                    <img
                                        src="/hero-image-custom.png"
                                        alt="Caring elderly community - two people walking together in a peaceful garden"
                                        className="w-full h-full object-cover"
                                        fetchPriority="high"
                                        width="800"
                                        height="600"
                                    />
                                </picture>
                                <div
                                    className="hero-tilt-glare"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border hidden md:block">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Creating a compassionate community since
                                </p>
                                <p className="text-3xl font-bold text-foreground">
                                    1978
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
