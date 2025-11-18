import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getLatestEvents, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityEvent, SanityFormBuilder } from "@/lib/sanity.types";

const Events = () => {
    const [events, setEvents] = useState<SanityEvent[]>([]);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [eventsData, form] = await Promise.all([
                getLatestEvents(10),
                getFormByPage("events"),
            ]);
            setEvents(eventsData);
            setFormConfig(form);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1">
                <section className="bg-primary text-primary-foreground py-20">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Community Events
                        </h1>
                        <p className="text-xl max-w-3xl opacity-90">
                            Upcoming events and activities for our community
                            members.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Loading events...
                                </p>
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {events.map((event) => (
                                    <Card
                                        key={event._id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {event.image && (
                                            <img
                                                src={
                                                    getImageUrl(event.image, {
                                                        width: 800,
                                                        height: 400,
                                                        format: "webp",
                                                    }) || ""
                                                }
                                                alt={event.title}
                                                className="w-full h-48 object-cover"
                                                width="800"
                                                height="400"
                                            />
                                        )}
                                        <div className="p-6">
                                            {event.featured && (
                                                <Badge
                                                    variant="default"
                                                    className="mb-3"
                                                >
                                                    Featured
                                                </Badge>
                                            )}
                                            <h2 className="text-xl font-semibold mb-2">
                                                {event.title}
                                            </h2>
                                            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                event.date
                                                            ),
                                                            "PPP 'at' p"
                                                        )}
                                                    </span>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />
                                                        <span>
                                                            {event.location}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {event.description && (
                                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                                    {event.description}
                                                </p>
                                            )}
                                            <Link
                                                to={`/events/${event.slug?.current}`}
                                                className="inline-flex items-center text-primary hover:underline"
                                                aria-label={`Learn more about ${event.title}`}
                                            >
                                                Learn more{" "}
                                                <ArrowRight
                                                    className="ml-1 h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    No events scheduled at this time. Check back
                                    soon!
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {formConfig && <DynamicForm formConfig={formConfig} />}
            </main>

            <Footer />
        </div>
    );
};

export default Events;
