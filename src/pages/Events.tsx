import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState, useMemo } from "react";
import { getAllEvents, getPageContent, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, UserRound } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityEvent, SanityFormBuilder, SanityPageContent } from "@/lib/sanity.types";
import { SearchAndFilter } from "@/components/SearchAndFilter";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [displayCount, setDisplayCount] = useState(12);

    useEffect(() => {
        const fetchData = async () => {
            const [eventsData, content, form] = await Promise.all([
                getAllEvents(),
                getPageContent("care-community/activities-and-events"),
                getFormByPage("care-community/activities-and-events"),
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
        
        const canonicalUrl = `https://www.chinacoastcommunity.org.hk/care-community/activities-and-events`;

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
            updateMetaTag("og:url", "https://www.chinacoastcommunity.org.hk/", true);
            if (canonicalLink) {
                canonicalLink.href = "https://www.chinacoastcommunity.org.hk/";
            }
        };
    }, [pageContent]);

    // Get unique categories from events
    const availableCategories = useMemo(() => {
        const categories = events
            .map((event) => event.category)
            .filter((cat): cat is string => cat !== undefined && cat !== null);
        return Array.from(new Set(categories)).sort();
    }, [events]);

    // Filter events based on search, category, and date
    const filteredEvents = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        return events.filter((event) => {
            // Category filter
            if (selectedCategory !== "all" && event.category !== selectedCategory) {
                return false;
            }

            // Date filter
            if (dateFilter !== "all") {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0); // Reset time to start of day
                if (dateFilter === "upcoming" && eventDate < now) {
                    return false;
                }
                if (dateFilter === "past" && eventDate >= now) {
                    return false;
                }
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = event.title?.toLowerCase().includes(query);
                const matchesDescription = event.description?.toLowerCase().includes(query);
                const matchesLocation = event.location?.toLowerCase().includes(query);
                return matchesTitle || matchesDescription || matchesLocation;
            }

            return true;
        });
    }, [events, searchQuery, selectedCategory, dateFilter]);

    // Get displayed events (paginated)
    const displayedEvents = useMemo(() => {
        return filteredEvents.slice(0, displayCount);
    }, [filteredEvents, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount((prev) => prev + 12);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setDateFilter("all");
        setDisplayCount(12);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setDisplayCount(12);
    }, [searchQuery, selectedCategory, dateFilter]);

    const categoryFilterOptions = availableCategories.map((category) => ({
        label: category,
        value: category,
    }));

    const dateFilterOptions = [
        { label: "All Events", value: "all" },
        { label: "Upcoming", value: "upcoming" },
        { label: "Past", value: "past" },
    ];

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
                            <div className="max-w-4xl mx-auto">
                                <SearchAndFilter
                                    searchValue={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    filters={[
                                        {
                                            label: "Category",
                                            key: "category",
                                            options: categoryFilterOptions,
                                            value: selectedCategory,
                                            onChange: setSelectedCategory,
                                        },
                                        {
                                            label: "Date",
                                            key: "date",
                                            options: dateFilterOptions,
                                            value: dateFilter,
                                            onChange: setDateFilter,
                                        },
                                    ]}
                                    onClearFilters={handleClearFilters}
                                    displayedCount={displayedEvents.length}
                                    totalCount={filteredEvents.length}
                                />

                                {displayedEvents.length > 0 ? (
                                    <>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 w-full">
                                            {displayedEvents.map((event) => (
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
                                                            className="w-full h-32 md:h-24 object-cover"
                                                            width="800"
                                                            height="400"
                                                        />
                                                    )}
                                                    <div className="p-4 md:p-3">
                                                        {event.featured && (
                                                            <Badge
                                                                variant="default"
                                                                className="mb-1.5 md:mb-1 text-xs"
                                                            >
                                                                Featured
                                                            </Badge>
                                                        )}
                                                        <h2 className="text-lg font-semibold mb-1.5 md:mb-1 leading-tight line-clamp-2">
                                                            {event.title}
                                                        </h2>
                                                        <div className="space-y-1 mb-1.5 md:mb-1 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar
                                                                    className="h-3 w-3"
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="line-clamp-1">
                                                                    {format(
                                                                        new Date(
                                                                            event.date
                                                                        ),
                                                                        "PPP 'at' p"
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {event.location && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <MapPin
                                                                        className="h-3 w-3"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span className="line-clamp-1">
                                                                        {event.location}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {event.organizer?.name && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <UserRound
                                                                        className="h-3 w-3 shrink-0"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span className="line-clamp-1">
                                                                        {event.organizer.name}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {event.description && (
                                                            <p className="text-sm text-muted-foreground mb-1.5 md:mb-1 line-clamp-2">
                                                                {event.description}
                                                            </p>
                                                        )}
                                                        <Link
                                                            to={`/care-community/activities-and-events/${event.slug?.current}`}
                                                            className="inline-flex items-center text-primary hover:underline text-base font-semibold py-2 mt-3"
                                                            aria-label={`Learn more about ${event.title}`}
                                                        >
                                                            Learn more{" "}
                                                            <ArrowRight
                                                                className="ml-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>

                                        {displayedEvents.length < filteredEvents.length && (
                                            <div className="text-center mt-8">
                                                <Button
                                                    onClick={handleLoadMore}
                                                    variant="outline"
                                                    className="min-w-[150px]"
                                                >
                                                    Load More
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-lg text-muted-foreground">
                                            No events found matching your filters.
                                        </p>
                                    </div>
                                )}
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
