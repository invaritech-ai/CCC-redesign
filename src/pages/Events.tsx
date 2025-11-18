import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getLatestEvents, getPageContent, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityEvent, SanityFormBuilder, SanityPageContent } from "@/lib/sanity.types";

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, isProperty = false) => {
  const attribute = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const Events = () => {
    const [events, setEvents] = useState<SanityEvent[]>([]);
    const [pageContent, setPageContent] = useState<SanityPageContent | null>(null);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [eventsData, content, form] = await Promise.all([
                getLatestEvents(10),
                getPageContent("events"),
                getFormByPage("events"),
            ]);
            setEvents(eventsData);
            setPageContent(content);
            setFormConfig(form);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Update SEO meta tags when pageContent is loaded
    useEffect(() => {
        if (!pageContent) return;

        const baseTitle = "China Coast Community";
        const pageTitle = pageContent.heading 
            ? `${pageContent.heading} | ${baseTitle}`
            : `Community Events | ${baseTitle}`;
        
        const description = pageContent.subheading || 
            "Upcoming events and activities for our community members.";
        
        const canonicalUrl = `https://chinacoastcommunity.org/events`;

        // Update title
        document.title = pageTitle;

        // Update meta description
        updateMetaTag("description", description);

        // Update Open Graph tags
        updateMetaTag("og:title", pageTitle, true);
        updateMetaTag("og:description", description, true);
        updateMetaTag("og:url", canonicalUrl, true);
        updateMetaTag("og:type", "website", true);

        // Update canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.rel = "canonical";
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = canonicalUrl;

        // Cleanup function to restore default meta tags when component unmounts
        return () => {
            document.title = "China Coast Community - Caring for Hong Kong's English-Speaking Elderly";
            updateMetaTag("description", "A caring home for Hong Kong's English-speaking elderly since 1978. Supporting our redevelopment to create a safe, modern community where every senior is valued.");
            updateMetaTag("og:title", "China Coast Community - Caring for Hong Kong's English-Speaking Elderly", true);
            updateMetaTag("og:description", "A caring home for Hong Kong's English-speaking elderly since 1978. Supporting our redevelopment.", true);
            updateMetaTag("og:url", "https://chinacoastcommunity.org/", true);
            if (canonicalLink) {
                canonicalLink.href = "https://chinacoastcommunity.org/";
            }
        };
    }, [pageContent]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                {pageContent ? (
                    <PageContent
                        heading={pageContent.heading}
                        subheading={pageContent.subheading}
                        content={pageContent.content}
                        badgeText={pageContent.badgeText}
                    />
                ) : (
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Community Events
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    Upcoming events and activities for our community
                                    members.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

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
