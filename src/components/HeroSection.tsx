import {
    CheckCircle2,
    Award,
    Users,
    ArrowRight,
    Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import heroImageWebP from "@/assets/hero-elderly-walking.webp";
import heroImageJPG from "@/assets/hero-elderly-walking.jpg";
import { DonateNowButton } from "./DonateNowButton";

export const HeroSection = () => {
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
                                A Caring Home for Hong Kong's English-Speaking
                                Elderly
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

                    {/* Right Image */}
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <picture>
                                <source
                                    srcSet={heroImageWebP}
                                    type="image/webp"
                                />
                                <img
                                    src={heroImageJPG}
                                    alt="Caring elderly community - two people walking together in a peaceful garden"
                                    className="w-full h-full object-cover"
                                    fetchPriority="high"
                                    width="800"
                                    height="600"
                                />
                            </picture>
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
        </section>
    );
};
