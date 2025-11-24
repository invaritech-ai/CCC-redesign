import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedEvents, getRecentUpdate } from "@/lib/sanity.queries";
import { format } from "date-fns";
import type { SanityEvent, SanityUpdate } from "@/lib/sanity.types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

interface Notice {
    _id: string;
    date: string;
    type: string;
    title: string;
    description: string;
    featured?: boolean;
    slug?: string;
    link?: string;
}

export const NoticeboardSection = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchNotices = async () => {
            const [events, update] = await Promise.all([
                getFeaturedEvents(),
                getRecentUpdate(),
            ]);

            const noticesList: Notice[] = [];

            // Add recent update if available
            if (update) {
                noticesList.push({
                    _id: update._id,
                    date: format(new Date(update.publishedAt), "MMMM yyyy"),
                    type: update.type || "Update",
                    title: update.title,
                    description: update.excerpt || "",
                    featured: update.featured,
                    slug: update.slug?.current,
                    link: `/news/${update.slug?.current}`,
                });
            }

            // Add upcoming events
            events.forEach((event: SanityEvent) => {
                noticesList.push({
                    _id: event._id,
                    date: format(new Date(event.date), "MMMM yyyy"),
                    type: "Event",
                    title: event.title,
                    description: event.description || "",
                    featured: event.featured,
                    slug: event.slug?.current,
                    link: `/care-community/activities-and-events/${event.slug?.current}`,
                });
            });

            // Sort by date (most recent first)
            noticesList.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime();
            });

            setNotices(noticesList.slice(0, 10)); // Increase limit for carousel
            setLoading(false);
        };
        fetchNotices();
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
        if (!api || notices.length <= 1 || isPaused) {
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
    }, [api, notices.length, isPaused]);

    if (loading) {
        return (
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                            Noticeboard
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Stay updated on our redevelopment progress,
                            community events, and ways you can help
                        </p>
                    </div>
                    <p className="text-center text-muted-foreground">
                        Loading...
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                        Noticeboard
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Stay updated on our redevelopment progress, community
                        events, and ways you can help
                    </p>
                </div>

                {notices.length > 0 ? (
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
                                {notices.map((notice) => (
                                    <CarouselItem key={notice._id}>
                                        <Card
                                            className={`p-6 md:p-8 hover:shadow-lg transition-shadow ${
                                                notice.featured
                                                    ? "bg-primary/5"
                                                    : ""
                                            }`}
                                        >
                                            {notice.featured && (
                                                <Badge
                                                    variant="default"
                                                    className="mb-4"
                                                >
                                                    Featured
                                                </Badge>
                                            )}
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Calendar
                                                            className="h-6 w-6 md:h-8 md:w-8 text-primary"
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span className="text-sm md:text-base text-muted-foreground">
                                                            {notice.date}
                                                        </span>
                                                        <Badge
                                                            variant="neutral"
                                                            className="text-xs md:text-sm"
                                                        >
                                                            {notice.type}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 md:mb-4">
                                                        {notice.title}
                                                    </h3>
                                                    <p className="text-muted-foreground mb-4 md:mb-6 text-base md:text-lg">
                                                        {notice.description}
                                                    </p>
                                                    {notice.link && (
                                                        <Button
                                                            variant="link"
                                                            className="p-0 h-auto text-base md:text-lg"
                                                            asChild
                                                        >
                                                            <Link
                                                                to={notice.link}
                                                                aria-label={`Read more about ${notice.title}`}
                                                            >
                                                                Read more{" "}
                                                                <ArrowRight
                                                                    className="ml-1 h-4 w-4 md:h-5 md:w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {notices.length > 1 && (
                                <>
                                    <CarouselPrevious className="h-10 w-10 md:h-12 md:w-12" />
                                    <CarouselNext className="h-10 w-10 md:h-12 md:w-12" />
                                </>
                            )}
                        </Carousel>

                        {/* Dots indicator */}
                        {notices.length > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {notices.map((_, index) => (
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
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>
                            No notices available at this time. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
