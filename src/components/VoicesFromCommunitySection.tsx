import { Quote, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getStoriesByCategory } from "@/lib/sanity.queries";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityUpdate } from "@/lib/sanity.types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

export const VoicesFromCommunitySection = () => {
    const [stories, setStories] = useState<SanityUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchStories = async () => {
            const data = await getStoriesByCategory(6);
            setStories(data);
            setLoading(false);
        };
        fetchStories();
    }, []);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    // Auto-scroll functionality with pause on hover
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!api || stories.length <= 1 || isPaused) {
            return;
        }

        const interval = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext();
            } else {
                api.scrollTo(0); // Loop back to start
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [api, stories.length, isPaused]);

    if (loading) {
        return (
            <section className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                            Voices from Our Community
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Stories and experiences from our community members
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-8 md:p-12">
                            <p className="text-muted-foreground text-center">
                                Loading...
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
        );
    }

    if (stories.length === 0) {
        return (
            <section className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                            Voices from Our Community
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Stories and experiences from our community members
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-8 md:p-12">
                            <p className="text-muted-foreground text-center">
                                No stories available at this time. Check back soon!
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                        Voices from Our Community
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Stories and experiences from our community members
                    </p>
                </div>

                <div
                    className="max-w-3xl mx-auto relative px-12 md:px-16"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {stories.map((story) => (
                                <CarouselItem key={story._id}>
                                    <Card className="p-8 md:p-12 relative overflow-hidden">
                                        {/* Background decoration */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                                        <div className="relative z-10">
                                            {/* Quote icon */}
                                            <div className="mb-6">
                                                <Quote
                                                    className="h-12 w-12 text-primary/20"
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            {/* Story title */}
                                            <h3 className="text-2xl md:text-3xl text-foreground mb-4 font-semibold">
                                                {story.title}
                                            </h3>

                                            {/* Story excerpt */}
                                            {story.excerpt && (
                                                <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                                                    {story.excerpt}
                                                </p>
                                            )}

                                            {/* Story info */}
                                            <div className="flex items-center gap-4 pt-6 border-t">
                                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    {story.image ? (
                                                        <img
                                                            src={
                                                                getImageUrl(
                                                                    story.image,
                                                                    {
                                                                        width: 64,
                                                                        height: 64,
                                                                        format: "webp",
                                                                    }
                                                                ) || ""
                                                            }
                                                            alt={story.title}
                                                            className="h-full w-full rounded-full object-cover"
                                                            width="64"
                                                            height="64"
                                                        />
                                                    ) : (
                                                        <User
                                                            className="h-8 w-8 text-primary"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    {story.author && (
                                                        <p className="font-semibold text-foreground text-lg">
                                                            {story.author}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-muted-foreground">
                                                        {story.publishedAt &&
                                                            format(
                                                                new Date(
                                                                    story.publishedAt
                                                                ),
                                                                "PPP"
                                                            )}
                                                        {story.type &&
                                                            ` • ${story.type}`}
                                                    </p>
                                                    {story.slug?.current && (
                                                        <Link
                                                            to={`/news/${story.slug.current}`}
                                                            className="text-primary hover:underline text-sm mt-2 inline-block"
                                                        >
                                                            Read full story →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {stories.length > 1 && (
                            <>
                                <CarouselPrevious className="h-10 w-10 md:h-12 md:w-12" />
                                <CarouselNext className="h-10 w-10 md:h-12 md:w-12" />
                            </>
                        )}
                    </Carousel>

                    {/* Dots indicator */}
                    {stories.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {stories.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => api?.scrollTo(index)}
                                    className={`h-6 w-6 rounded-full transition-all p-2 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                                        index === current
                                            ? "bg-primary"
                                            : "bg-primary/30"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            index === current
                                                ? "bg-white"
                                                : "bg-primary"
                                        }`}
                                        aria-hidden="true"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};







