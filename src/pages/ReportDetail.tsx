import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    getReportBySlug,
    getReportsExcludingSlug,
    getReportAdjacentByYear,
    type RelatedListRow,
} from "@/lib/sanity.queries";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl, getImageUrlFromString } from "@/lib/sanityImage";
import type { SanityReport } from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl, serializeJsonLd } from "@/lib/seo";
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

const ReportDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [report, setReport] = useState<SanityReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedFallback, setRelatedFallback] = useState<RelatedListRow[]>(
        []
    );
    const [adjacent, setAdjacent] = useState<{
        prev: { to: string; label: string } | null;
        next: { to: string; label: string } | null;
    }>({ prev: null, next: null });

    useEffect(() => {
        const fetchReport = async () => {
            if (slug) {
                try {
                    const data = await getReportBySlug(slug);
                    setReport(data);
                    if (!data) {
                        console.warn(`Report not found for slug: ${slug}`);
                    }
                } catch (error) {
                    console.error("Error fetching report:", error);
                    setReport(null);
                }
            } else {
                console.warn("No slug provided in URL");
            }
            setLoading(false);
        };
        fetchReport();
    }, [slug]);

    useEffect(() => {
        if (!slug || loading || !report) return;
        let cancelled = false;
        (async () => {
            const rows = await getReportsExcludingSlug(slug, 10);
            if (!cancelled) setRelatedFallback(rows);
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, loading, report]);

    useEffect(() => {
        if (!slug || loading || !report) return;
        let cancelled = false;
        (async () => {
            const n = await getReportAdjacentByYear(slug);
            if (cancelled) return;
            const olderSlug = getSlugValue(n.older?.slug);
            const newerSlug = getSlugValue(n.newer?.slug);
            setAdjacent({
                prev:
                    olderSlug && n.older?.title
                        ? {
                              to: `/who-we-are/publications/annual-reports/${olderSlug}`,
                              label: n.older.title,
                          }
                        : null,
                next:
                    newerSlug && n.newer?.title
                        ? {
                              to: `/who-we-are/publications/annual-reports/${newerSlug}`,
                              label: n.newer.title,
                          }
                        : null,
            });
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, loading, report]);

    const breadcrumbItems = useMemo(() => {
        if (!report?.title) return [];
        return [
            { label: "Home", href: "/" },
            {
                label: "Annual reports",
                href: "/who-we-are/publications/annual-reports",
            },
            { label: report.title },
        ];
    }, [report?.title]);

    const relatedNavLinks = useMemo((): InternalNavLink[] => {
        if (!slug) return [];
        const fixed: InternalNavLink[] = [
            {
                title: "All annual reports",
                to: "/who-we-are/publications/annual-reports",
            },
            { title: "Who we are", to: "/who-we-are/about" },
        ];
        for (const row of relatedFallback) {
            const s = getSlugValue(row.slug);
            if (!s || s === slug) continue;
            fixed.push({
                title: row.title,
                to: `/who-we-are/publications/annual-reports/${s}`,
            });
        }
        return mergeDedupeInternalLinks(fixed, 8);
    }, [slug, relatedFallback]);

    useEffect(() => {
        if (loading) {
            return;
        }

        const canonicalUrl = getCanonicalUrl(
            slug
                ? `/who-we-are/publications/annual-reports/${slug}`
                : "/who-we-are/publications/annual-reports"
        );

        if (!report) {
            applySeo({
                title: "Report Not Found | China Coast Community",
                description: "The report you are looking for doesn't exist.",
                url: canonicalUrl,
                robots: "noindex, nofollow",
            });

            return () => applySeo();
        }

        applySeo({
            title: `${report.title} | China Coast Community`,
            description:
                report.summary?.trim().slice(0, 160) ||
                report.description?.trim().slice(0, 160) ||
                `Annual report from China Coast Community: ${report.title}.`,
            url: canonicalUrl,
            type: "article",
        });

        return () => applySeo();
    }, [loading, report, slug]);

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

    if (!report) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main id="main-content" className="flex-1">
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Report Not Found
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    The report you're looking for doesn't exist.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    const reportSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: report.title,
        description:
            report.summary || report.description || `Annual report ${report.title}`,
        datePublished: report.year
            ? new Date(`${report.year}-01-01`).toISOString()
            : undefined,
        author: report.author
            ? {
                  "@type": "Person",
                  name: report.author,
              }
            : undefined,
        image: report.image
            ? getImageUrl(report.image, { width: 1200, format: "webp" })
            : undefined,
        url: getCanonicalUrl(
            `/who-we-are/publications/annual-reports/${slug}`
        ),
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd(reportSchema),
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
                        report.image ? 'bg-cover bg-center' : ''
                    }`}
                    style={report.image ? {
                        backgroundImage: `url(${getImageUrl(report.image, {
                            width: 1920,
                            height: 1080,
                            format: "webp",
                        })})`
                    } : undefined}
                >
                    {/* Dark overlay */}
                    {report.image && (
                        <div className="absolute inset-0 bg-black/60"></div>
                    )}
                    
                    {/* Content */}
                    <div className="container mx-auto px-4 w-full relative z-10">
                        <div className="max-w-4xl md:mx-auto md:text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <FileText className="h-6 w-6 md:h-8 md:w-8" />
                                <span className="text-xl md:text-2xl font-semibold opacity-90">
                                    {report.year}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {report.title}
                            </h1>
                            {report.author && (
                                <p className="text-lg md:text-xl opacity-90">
                                    By {report.author}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">

                            {report.description && (
                                <div className="prose prose-lg max-w-none mb-8">
                                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {report.description}
                                    </p>
                                </div>
                            )}

                            {report.pdf && (
                                <div className="mt-8 space-y-4">
                                    {/* Download Button */}
                                    <div className="flex justify-center md:justify-start">
                                        <Button asChild size="lg">
                                            <a
                                                href={
                                                    getImageUrlFromString(
                                                        report.pdf.url
                                                    ) || report.pdf.url
                                                }
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Download
                                                    className="mr-2 h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                                Download PDF Report
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Embedded PDF Viewer */}
                                    <div className="w-full border rounded-lg overflow-hidden shadow-lg bg-card">
                                        <iframe
                                            src={
                                                (getImageUrlFromString(
                                                    report.pdf.url
                                                ) || report.pdf.url) + "#view=FitH"
                                            }
                                            title={`${report.title} PDF Viewer`}
                                            className="w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]"
                                            aria-label={`PDF viewer for ${report.title}`}
                                        />
                                    </div>

                                    {/* Fallback message for browsers that don't support PDF viewing */}
                                    <p className="text-sm text-muted-foreground text-center">
                                        Having trouble viewing the PDF?{" "}
                                        <a
                                            href={
                                                getImageUrlFromString(
                                                    report.pdf.url
                                                ) || report.pdf.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Open in a new tab
                                        </a>{" "}
                                        or{" "}
                                        <a
                                            href={
                                                getImageUrlFromString(
                                                    report.pdf.url
                                                ) || report.pdf.url
                                            }
                                            download
                                            className="text-primary hover:underline"
                                        >
                                            download it
                                        </a>
                                        .
                                    </p>
                                </div>
                            )}

                            {report.summary && (
                                <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
                                    <h2 className="text-xl font-semibold mb-3">
                                        Summary
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {report.summary}
                                    </p>
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

export default ReportDetail;
