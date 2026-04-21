import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    getEventCount,
    getEventsOrderedSlice,
} from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight, UserRound } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityEvent } from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl } from "@/lib/seo";
import { CrawlPagination } from "@/components/seo/CrawlPagination";

const HUB_FIRST = 12;
const PAGE_SIZE = 12;

const EventsArchive = () => {
    const [searchParams] = useSearchParams();
    const [events, setEvents] = useState<SanityEvent[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const currentPage = useMemo(() => {
        const raw = parseInt(searchParams.get("page") || "1", 10);
        return Number.isFinite(raw) && raw >= 1 ? raw : 1;
    }, [searchParams]);

    const archiveTotal = Math.max(0, totalCount - HUB_FIRST);
    const totalPages = Math.max(1, Math.ceil(archiveTotal / PAGE_SIZE) || 1);
    const safePage = Math.min(currentPage, totalPages);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            const total = await getEventCount();
            if (cancelled) return;
            const arch = Math.max(0, total - HUB_FIRST);
            const pages = Math.max(1, Math.ceil(arch / PAGE_SIZE) || 1);
            const page = Math.min(Math.max(1, currentPage), pages);
            const start = HUB_FIRST + (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const slice =
                arch === 0
                    ? []
                    : await getEventsOrderedSlice(start, end);
            if (!cancelled) {
                setTotalCount(total);
                setEvents(slice);
                setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [currentPage]);

    useEffect(() => {
        const path = "/care-community/activities-and-events/archive";
        const qs =
            safePage > 1 ? `?page=${safePage}` : "";
        applySeo({
            title: `Past events archive${safePage > 1 ? ` (page ${safePage})` : ""} | China Coast Community`,
            description:
                "Browse past community activities and events at China Coast Community.",
            url: getCanonicalUrl(`${path}${qs}`),
        });
        return () => applySeo();
    }, [safePage]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                <section className="bg-primary text-primary-foreground py-12 md:py-16">
                    <div className="container mx-auto px-4 w-full">
                        <div className="max-w-4xl">
                            <nav
                                className="text-sm opacity-90 mb-4"
                                aria-label="Breadcrumb"
                            >
                                <ol className="flex flex-wrap gap-x-2 gap-y-1 list-none pl-0 m-0">
                                    <li>
                                        <Link
                                            to="/"
                                            className="underline underline-offset-2"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li aria-hidden="true">/</li>
                                    <li>
                                        <Link
                                            to="/care-community/activities-and-events"
                                            className="underline underline-offset-2"
                                        >
                                            Activities &amp; events
                                        </Link>
                                    </li>
                                    <li aria-hidden="true">/</li>
                                    <li className="font-medium">
                                        Past events archive
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                Past events archive
                            </h1>
                            <p className="text-lg opacity-90 max-w-2xl">
                                Older activities and events, newest first. For
                                the latest listings, see the main{" "}
                                <Link
                                    to="/care-community/activities-and-events"
                                    className="underline underline-offset-2 font-medium"
                                >
                                    activities &amp; events
                                </Link>{" "}
                                page.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground">
                                Loading archive…
                            </p>
                        ) : archiveTotal === 0 ? (
                            <div className="max-w-2xl mx-auto text-center space-y-4">
                                <p className="text-muted-foreground">
                                    All published events are shown on the main
                                    activities page.
                                </p>
                                <ButtonLink to="/care-community/activities-and-events">
                                    Back to activities &amp; events
                                </ButtonLink>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 w-full max-w-7xl mx-auto">
                                    {events.map((event) => (
                                        <Card
                                            key={event._id}
                                            className="overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {event.image && (
                                                <img
                                                    src={
                                                        getImageUrl(
                                                            event.image,
                                                            {
                                                                width: 800,
                                                                height: 400,
                                                                format: "webp",
                                                            }
                                                        ) || ""
                                                    }
                                                    alt={event.title}
                                                    className="w-full h-32 md:h-24 object-cover"
                                                    width={800}
                                                    height={400}
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
                                                                "PPP"
                                                            )}{" "}
                                                            at{" "}
                                                            {event.time ??
                                                                format(
                                                                    new Date(
                                                                        event.date
                                                                    ),
                                                                    "p"
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
                                                                {
                                                                    event.location
                                                                }
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
                                                                {
                                                                    event
                                                                        .organizer
                                                                        .name
                                                                }
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
                                <div className="mt-12 max-w-4xl mx-auto">
                                    <CrawlPagination
                                        basePath="/care-community/activities-and-events/archive"
                                        currentPage={safePage}
                                        totalPages={totalPages}
                                        ariaLabel="Past events pages"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

function ButtonLink({
    to,
    children,
}: {
    to: string;
    children: ReactNode;
}) {
    return (
        <Link
            to={to}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 min-h-[44px]"
        >
            {children}
        </Link>
    );
}

export default EventsArchive;
