import { CheckCircle2, Award, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-elderly-walking.jpg";
import { DonateNowButton } from "./DonateNowButton";

export const HeroSection = () => {
    return (
        <section className="relative py-16 md:min-h-screen md:flex md:items-center bg-secondary/30">
            <div className="container mx-auto px-4 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <Badge
                            variant="neutral"
                            className="gap-1.5 px-3 py-1.5 bg-muted-foreground text-background"
                        >
                            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                            Currently Closed for Redevelopment
                        </Badge>

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
                                <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
                                <span className="text-foreground font-medium">
                                    Section 88 Charity
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-success" aria-hidden="true" />
                                <span className="text-foreground font-medium">
                                    45+ Years Serving HK
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-success" aria-hidden="true" />
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
                                <Link to="/future">
                                    Learn more about Redevelopment
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={heroImage}
                                alt="Caring elderly community - two people walking together in a peaceful garden"
                                className="w-full h-full object-cover"
                                fetchpriority="high"
                                width="800"
                                height="600"
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
        </section>
    );
};
