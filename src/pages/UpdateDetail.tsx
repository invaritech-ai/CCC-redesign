import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    getUpdateBySlug,
    getCaseStudyBySlug,
    getUpdatesExcludingSlug,
    type RelatedListRow,
} from "@/lib/sanity.queries";
import { Calendar, User, Building2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getImageUrl, getImageUrlFromString } from "@/lib/sanityImage";
import type {
    SanityUpdate,
    SanityCaseStudy,
    SanityPortableTextBlock,
    SanityImageBlock,
} from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl, serializeJsonLd } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/seo/PageBreadcrumbs";
import {
    RelatedContentLinks,
    SupportCtaLinks,
} from "@/components/seo/RelatedContentLinks";
import {
    disambiguateTitleWithSlugYear,
    getSlugValue,
    getUpdateDetailPath,
    mergeDedupeInternalLinks,
    toInternalPath,
    type InternalNavLink,
} from "@/lib/internalNav";

// Simple portable text renderer
const PortableText = ({ blocks }: { blocks: SanityPortableTextBlock[] }) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className="prose prose-lg max-w-none">
            {blocks.map((block, index: number) => {
                if (block._type === "block") {
                    const text =
                        block.children?.map((child) => child.text).join("") ||
                        "";

                    // Handle different block styles
                    switch (block.style) {
                        case "h1":
                            return (
                                <h1
                                    key={index}
                                    className="text-4xl font-bold mb-4 mt-8"
                                >
                                    {text}
                                </h1>
                            );
                        case "h2":
                            return (
                                <h2
                                    key={index}
                                    className="text-3xl font-bold mb-3 mt-6"
                                >
                                    {text}
                                </h2>
                            );
                        case "h3":
                            return (
                                <h3
                                    key={index}
                                    className="text-2xl font-semibold mb-2 mt-4"
                                >
                                    {text}
                                </h3>
                            );
                        case "h4":
                            return (
                                <h4
                                    key={index}
                                    className="text-xl font-semibold mb-2 mt-4"
                                >
                                    {text}
                                </h4>
                            );
                        case "blockquote":
                            return (
                                <blockquote
                                    key={index}
                                    className="border-l-4 border-primary pl-4 italic my-4"
                                >
                                    {text}
                                </blockquote>
                            );
                        default:
                            return (
                                <p key={index} className="mb-4 leading-relaxed">
                                    {text}
                                </p>
                            );
                    }
                }

                if (
                    block._type === "image" &&
                    "asset" in block &&
                    block.asset
                ) {
                    const imageBlock = block as SanityImageBlock;
                    const imageUrl = getImageUrlFromString(
                        imageBlock.asset.url
                    );
                    if (!imageUrl) return null;
                    return (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={imageBlock.alt || ""}
                            className="w-full rounded-lg my-6"
                        />
                    );
                }

                return null;
            })}
        </div>
    );
};

const extractPortableTextText = (blocks?: SanityPortableTextBlock[]) => {
    if (!blocks?.length) {
        return "";
    }

    return blocks
        .filter((block): block is Extract<SanityPortableTextBlock, { _type: "block" }> => block._type === "block")
        .flatMap((block) => block.children ?? [])
        .map((child) => child.text ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
};

const UpdateDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const [update, setUpdate] = useState<SanityUpdate | null>(null);
    const [caseStudy, setCaseStudy] = useState<SanityCaseStudy | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCaseStudy, setIsCaseStudy] = useState(false);
    const [relatedFallback, setRelatedFallback] = useState<RelatedListRow[]>(
        []
    );

    useEffect(() => {
        const fetchContent = async () => {
            if (slug) {
                // Try fetching as update first
                const updateData = await getUpdateBySlug(slug);
                if (updateData) {
                    setUpdate(updateData);
                    setIsCaseStudy(false);
                } else {
                    // If not found as update, try as case study
                    const caseStudyData = await getCaseStudyBySlug(slug);
                    if (caseStudyData) {
                        setCaseStudy(caseStudyData);
                        setIsCaseStudy(true);
                    }
                }
            }
            setLoading(false);
        };
        fetchContent();
    }, [slug]);

    const content = isCaseStudy ? caseStudy : update;

    useEffect(() => {
        if (!slug || loading || !content) return;
        let cancelled = false;
        (async () => {
            const rows = await getUpdatesExcludingSlug(slug, 10);
            if (!cancelled) setRelatedFallback(rows);
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, loading, content, update, caseStudy, isCaseStudy]);
    const contentTitle = isCaseStudy ? caseStudy?.title : update?.title;
    const contentImage = isCaseStudy 
        ? (caseStudy?.images && caseStudy.images.length > 0 ? caseStudy.images[0].image : undefined)
        : update?.image;
    const contentDate = isCaseStudy 
        ? (caseStudy?.date ? new Date(caseStudy.date).toISOString() : undefined)
        : update?.publishedAt;
    const contentFeatured = isCaseStudy ? caseStudy?.featured : update?.featured;
    const canonicalDetailPath = slug
        ? isCaseStudy || update?.type === "story"
            ? `/news/stories/${slug}`
            : `/news/${slug}`
        : location.pathname;

    const breadcrumbItems = useMemo(() => {
        if (!contentTitle) return [];
        const hub =
            isCaseStudy || update?.type === "story"
                ? { label: "Stories", href: "/news/stories" as const }
                : { label: "News", href: "/news" as const };
        return [
            { label: "Home", href: "/" },
            hub,
            { label: contentTitle },
        ];
    }, [contentTitle, isCaseStudy, update?.type]);

    const relatedNavLinks = useMemo((): InternalNavLink[] => {
        if (!slug) return [];
        const raw: InternalNavLink[] = [];
        if (isCaseStudy || update?.type === "story") {
            raw.push({ title: "All stories", to: "/news/stories" });
        } else {
            raw.push({ title: "Latest news", to: "/news" });
        }
        if (update?.relatedEvent) {
            const es = getSlugValue(update.relatedEvent.slug);
            if (es) {
                raw.push({
                    title: update.relatedEvent.title
                        ? `Related event: ${update.relatedEvent.title}`
                        : "Related event",
                    to: `/care-community/activities-and-events/${es}`,
                });
            }
        }
        for (const rl of update?.relatedLinks ?? []) {
            if (!rl?.url) continue;
            const path = toInternalPath(rl.url);
            if (!path) continue;
            raw.push({ title: rl.title || path, to: path });
        }
        for (const row of relatedFallback) {
            const s = getSlugValue(row.slug);
            if (!s || s === slug) continue;
            raw.push({
                title: row.title,
                to: getUpdateDetailPath(s, { type: row.type }),
            });
        }
        return mergeDedupeInternalLinks(raw, 8);
    }, [slug, isCaseStudy, update, relatedFallback]);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!content) {
            applySeo({
                title: "Content Not Found | China Coast Community",
                description: "The content you are looking for doesn't exist.",
                url: getCanonicalUrl(location.pathname),
                robots: "noindex, nofollow",
            });

            return () => applySeo();
        }

        const description = (
            isCaseStudy
                ? extractPortableTextText(caseStudy?.description) ||
                  extractPortableTextText(caseStudy?.outcomes) ||
                  `${caseStudy?.title ?? "Story"} from China Coast Community.`
                : update?.excerpt ||
                  extractPortableTextText(update?.body) ||
                  `${update?.title ?? "Update"} from China Coast Community.`
        ).slice(0, 160);

        applySeo({
            title: `${disambiguateTitleWithSlugYear(
                contentTitle ?? "",
                slug
            )} | China Coast Community`,
            description,
            url: getCanonicalUrl(canonicalDetailPath),
            type: "article",
        });

        return () => applySeo();
    }, [
        canonicalDetailPath,
        caseStudy,
        content,
        contentTitle,
        isCaseStudy,
        loading,
        location.pathname,
        slug,
        update,
    ]);

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

    if (slug && content && location.pathname !== canonicalDetailPath) {
        return <Navigate to={canonicalDetailPath} replace />;
    }

    if (!content) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main id="main-content" className="flex-1">
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {isCaseStudy ? "Case Study" : "Update"} Not Found
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    The {isCaseStudy ? "case study" : "update"} you're looking for doesn't exist.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    const updateSchema = {
        "@context": "https://schema.org",
        "@type": isCaseStudy ? "Article" : "NewsArticle",
        headline: contentTitle,
        description: isCaseStudy
            ? extractPortableTextText(caseStudy?.description).slice(0, 200)
            : (update?.excerpt || extractPortableTextText(update?.body)).slice(0, 200),
        datePublished: contentDate
            ? new Date(contentDate).toISOString()
            : undefined,
        author:
            !isCaseStudy && update?.author
                ? {
                      "@type": "Person",
                      name: update.author,
                  }
                : undefined,
        image: contentImage
            ? getImageUrl(contentImage, { width: 1200, format: "webp" })
            : undefined,
        url: getCanonicalUrl(canonicalDetailPath),
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd(updateSchema),
                    }}
                />
                {breadcrumbItems.length > 0 && (
                    <div className="border-b bg-muted/40">
                        <div className="container mx-auto px-4 py-3">
                            <PageBreadcrumbs items={breadcrumbItems} />
                        </div>
                    </div>
                )}
                <section 
                    className={`relative bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center ${
                        contentImage ? 'bg-cover bg-center' : ''
                    }`}
                    style={contentImage ? {
                        backgroundImage: `url(${getImageUrl(contentImage, {
                            width: 1920,
                            height: 1080,
                            format: "webp",
                        })})`
                    } : undefined}
                >
                    {/* Dark overlay */}
                    {contentImage && (
                        <div className="absolute inset-0 bg-black/60"></div>
                    )}
                    
                    {/* Content */}
                    <div className="container mx-auto px-4 w-full relative z-10">
                        <div className="max-w-4xl md:mx-auto md:text-center">
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {contentFeatured && (
                                    <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                                        Featured
                                    </Badge>
                                )}
                                {isCaseStudy && (
                                    <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                                        Case Study
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {contentTitle}
                            </h1>
                            <div className="flex flex-wrap justify-center gap-4 text-lg md:text-xl opacity-90">
                                {contentDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        <span>
                                            {format(
                                                new Date(contentDate),
                                                "PPP"
                                            )}
                                        </span>
                                    </div>
                                )}
                                {!isCaseStudy && update?.author && (
                                    <div className="flex items-center gap-2">
                                        <User
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        <span>{update.author}</span>
                                    </div>
                                )}
                                {isCaseStudy && caseStudy?.client && (
                                    <div className="flex items-center gap-2">
                                        <Building2
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        <span>{caseStudy.client}</span>
                                    </div>
                                )}
                                {!isCaseStudy && update?.type && (
                                    <Badge
                                        variant="outline"
                                        className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 capitalize"
                                    >
                                        {update.type}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            {isCaseStudy ? (
                                <>
                                    {caseStudy?.description && (
                                        <PortableText blocks={caseStudy.description} />
                                    )}

                                    {caseStudy?.images && caseStudy.images.length > 0 && (
                                        <div className="mt-8 space-y-6">
                                            {caseStudy.images.map((imgItem, index) => {
                                                if (!imgItem.image) return null;
                                                const imageUrl = getImageUrl(imgItem.image, {
                                                    width: 1200,
                                                    height: 800,
                                                    format: "webp",
                                                });
                                                return imageUrl ? (
                                                    <img
                                                        key={index}
                                                        src={imageUrl}
                                                        alt={`${caseStudy.title} - Image ${index + 1}`}
                                                        className="w-full rounded-lg"
                                                    />
                                                ) : null;
                                            })}
                                        </div>
                                    )}

                                    {caseStudy?.outcomes && (
                                        <div className="mt-8">
                                            <h2 className="text-2xl font-bold mb-4">Outcomes</h2>
                                            <PortableText blocks={caseStudy.outcomes} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {update?.excerpt && (
                                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed italic">
                                            {update.excerpt}
                                        </p>
                                    )}

                                    {update?.body && (
                                        <PortableText blocks={update.body} />
                                    )}

                                    {update?.tags && update.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-8">
                                            {update.tags.map(
                                                (tag: string, index: number) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="mt-12 space-y-10 pt-8 border-t border-border">
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

export default UpdateDetail;
