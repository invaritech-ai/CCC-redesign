import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    getPressReleaseBySlug,
    getPressReleasesExcludingSlug,
    getPressReleaseAdjacentByDate,
    type RelatedListRow,
} from "@/lib/sanity.queries";
import { Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PortableText } from "@/components/PortableText";
import type { SanityPressRelease } from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/seo/PageBreadcrumbs";
import {
    RelatedContentLinks,
    SupportCtaLinks,
} from "@/components/seo/RelatedContentLinks";
import { DetailAdjacentLinks } from "@/components/seo/DetailAdjacentLinks";
import {
    getSlugValue,
    mergeDedupeInternalLinks,
    type InternalNavLink,
} from "@/lib/internalNav";

const PressReleaseDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [pressRelease, setPressRelease] = useState<SanityPressRelease | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [relatedFallback, setRelatedFallback] = useState<RelatedListRow[]>(
        []
    );
    const [adjacent, setAdjacent] = useState<{
        prev: { to: string; label: string } | null;
        next: { to: string; label: string } | null;
    }>({ prev: null, next: null });

    useEffect(() => {
        const fetchPressRelease = async () => {
            if (slug) {
                const data = await getPressReleaseBySlug(slug);
                setPressRelease(data);
            }
            setLoading(false);
        };
        fetchPressRelease();
    }, [slug]);

    useEffect(() => {
        if (!slug || loading || !pressRelease) return;
        let cancelled = false;
        (async () => {
            const rows = await getPressReleasesExcludingSlug(slug, 10);
            if (!cancelled) setRelatedFallback(rows);
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, loading, pressRelease]);

    useEffect(() => {
        if (!slug || loading || !pressRelease) return;
        let cancelled = false;
        (async () => {
            const n = await getPressReleaseAdjacentByDate(slug);
            if (cancelled) return;
            const olderSlug = getSlugValue(n.older?.slug);
            const newerSlug = getSlugValue(n.newer?.slug);
            setAdjacent({
                prev:
                    olderSlug && n.older?.title
                        ? {
                              to: `/news/media-and-press/press-releases/${olderSlug}`,
                              label: n.older.title,
                          }
                        : null,
                next:
                    newerSlug && n.newer?.title
                        ? {
                              to: `/news/media-and-press/press-releases/${newerSlug}`,
                              label: n.newer.title,
                          }
                        : null,
            });
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, loading, pressRelease]);

    const breadcrumbItems = useMemo(() => {
        if (!pressRelease?.title) return [];
        return [
            { label: "Home", href: "/" },
            { label: "Media and press", href: "/news/media-and-press" },
            { label: pressRelease.title },
        ];
    }, [pressRelease?.title]);

    const relatedNavLinks = useMemo((): InternalNavLink[] => {
        if (!slug) return [];
        const raw: InternalNavLink[] = [
            { title: "Media and press", to: "/news/media-and-press" },
            {
                title: "Press releases archive",
                to: "/news/media-and-press/press-releases/archive",
            },
            { title: "Latest news", to: "/news" },
        ];
        for (const row of relatedFallback) {
            const s = getSlugValue(row.slug);
            if (!s || s === slug) continue;
            raw.push({
                title: row.title,
                to: `/news/media-and-press/press-releases/${s}`,
            });
        }
        return mergeDedupeInternalLinks(raw, 8);
    }, [slug, relatedFallback]);

    useEffect(() => {
        const canonicalPath = slug
            ? `/news/media-and-press/press-releases/${slug}`
            : "/news/media-and-press";

        if (!pressRelease && !loading) {
            applySeo({
                title: "Press Release Not Found | China Coast Community",
                description:
                    "The press release you are looking for does not exist.",
                url: getCanonicalUrl(canonicalPath),
                robots: "noindex, nofollow",
            });
            return () => applySeo();
        }

        if (!pressRelease) {
            return;
        }

        const pageTitle = pressRelease.title
            ? `${pressRelease.title} | Media and Press | China Coast Community`
            : "Press Release | Media and Press | China Coast Community";

        // Extract description from content
        const contentText =
            pressRelease.content
                ?.find((block) => block._type === "block" && block.children)
                ?.children?.map((child: { text?: string }) => child.text || "")
                .join("")
                .trim() || "";

        const description =
            contentText.length > 160
                ? contentText.substring(0, 160) + "..."
                : contentText || "Press release from China Coast Community.";

        applySeo({
            title: pageTitle,
            description,
            url: getCanonicalUrl(canonicalPath),
            type: "article",
        });

        return () => applySeo();
    }, [pressRelease, loading, slug]);

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

    if (!pressRelease) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main id="main-content" className="flex-1">
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Press Release Not Found
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    The press release you're looking for doesn't
                                    exist.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    const releaseDate = pressRelease.date
        ? format(new Date(pressRelease.date), "PPP")
        : null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                {breadcrumbItems.length > 0 && (
                    <div className="border-b bg-muted/40">
                        <div className="container mx-auto px-4 py-3">
                            <PageBreadcrumbs items={breadcrumbItems} />
                        </div>
                    </div>
                )}
                <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                    <div className="container mx-auto px-4 w-full">
                        <div className="max-w-4xl md:mx-auto md:text-center">
                            {pressRelease.featured && (
                                <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 md:mx-auto">
                                    Featured
                                </Badge>
                            )}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {pressRelease.title}
                            </h1>
                            {releaseDate && (
                                <div className="flex items-center justify-center gap-2 text-lg md:text-xl opacity-90">
                                    <Calendar
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    <span>{releaseDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            {pressRelease.content && (
                                <PortableText blocks={pressRelease.content} />
                            )}

                            {pressRelease.mediaLinks &&
                                pressRelease.mediaLinks.length > 0 && (
                                    <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
                                        <h2 className="text-xl font-semibold mb-4">
                                            Media Links
                                        </h2>
                                        <div className="space-y-3">
                                            {pressRelease.mediaLinks.map(
                                                (link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-primary hover:underline group"
                                                    >
                                                        <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                        <span className="font-medium">
                                                            {link.title || link.url}
                                                        </span>
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            <div className="mt-12 space-y-10 pt-8 border-t border-border">
                                <DetailAdjacentLinks
                                    prev={adjacent.prev}
                                    next={adjacent.next}
                                />
                                <RelatedContentLinks links={relatedNavLinks} />
                                <SupportCtaLinks />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PressReleaseDetail;

