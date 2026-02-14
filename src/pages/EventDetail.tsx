import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventBySlug, getFormByPage } from "@/lib/sanity.queries";
import { Calendar, MapPin, ExternalLink, UserRound, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/sanityImage";
import { DynamicForm } from "@/components/DynamicForm";
import type { SanityEvent, SanityFormBuilder } from "@/lib/sanity.types";

const EventDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<SanityEvent | null>(null);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (slug) {
                const fullPath = `care-community/activities-and-events/${slug}`;
                const [eventData, formData] = await Promise.all([
                    getEventBySlug(slug),
                    getFormByPage(fullPath),
                ]);
                setEvent(eventData);
                setFormConfig(formData);
            }
            setLoading(false);
        };
        fetchEvent();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main id="main-content" className="flex-1">
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Event Not Found
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    The event you're looking for doesn't exist.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                <section 
                    className={`relative bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center ${
                        event.image ? 'bg-cover bg-center' : ''
                    }`}
                    style={event.image ? {
                        backgroundImage: `url(${getImageUrl(event.image, {
                            width: 1920,
                            height: 1080,
                            format: "webp",
                        })})`
                    } : undefined}
                >
                    {/* Dark overlay */}
                    {event.image && (
                        <div className="absolute inset-0 bg-black/60"></div>
                    )}
                    
                    {/* Content */}
                    <div className="container mx-auto px-4 w-full relative z-10">
                        <div className="max-w-4xl md:mx-auto md:text-center">
                            {event.featured && (
                                <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 md:mx-auto">
                                    Featured Event
                                </Badge>
                            )}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap justify-center gap-4 text-lg md:text-xl opacity-90">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {format(new Date(event.date), "PPP 'at' p")}
                                    </span>
                                </div>
                                {event.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">

                            {event.description && (
                                <div className="prose prose-lg max-w-none mb-8">
                                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {event.description}
                                    </p>
                                </div>
                            )}

                            {(event.organizer?.name || event.organizer?.email || event.organizer?.phone) && (
                                <div className="mb-8 p-4 rounded-lg border bg-muted/30">
                                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <UserRound className="h-5 w-5" aria-hidden="true" />
                                        Organizer
                                    </h2>
                                    <div className="space-y-2 text-muted-foreground">
                                        {event.organizer?.name && (
                                            <p className="font-medium text-foreground">{event.organizer.name}</p>
                                        )}
                                        {event.organizer?.email && (
                                            <a
                                                href={`mailto:${event.organizer.email}`}
                                                className="flex items-center gap-2 text-primary hover:underline"
                                            >
                                                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                                                {event.organizer.email}
                                            </a>
                                        )}
                                        {event.organizer?.phone && (
                                            <a
                                                href={`tel:${event.organizer.phone}`}
                                                className="flex items-center gap-2 text-primary hover:underline"
                                            >
                                                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                                                {event.organizer.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {event.registrationLink && (
                                <Button asChild className="mt-6">
                                    <a
                                        href={event.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Register Now{" "}
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            )}

                            {event.category && (
                                <div className="mt-8">
                                    <Badge variant="outline">
                                        {event.category}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {formConfig && <DynamicForm formConfig={formConfig} />}
            </main>

            <Footer />
        </div>
    );
};

export default EventDetail;
