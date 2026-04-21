import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    getGalleryBySlug,
    getGalleriesExcludingSlug,
    getGalleryAdjacentByCreatedAt,
    type RelatedListRow,
} from "@/lib/sanity.queries";
import { ImageGallery } from "@/components/ImageGallery";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityGallery } from "@/lib/sanity.types";
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

const GalleryDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [gallery, setGallery] = useState<SanityGallery | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedFallback, setRelatedFallback] = useState<RelatedListRow[]>(
        []
    );
    const [adjacent, setAdjacent] = useState<{
        prev: { to: string; label: string } | null;
        next: { to: string; label: string } | null;
    }>({ prev: null, next: null });

    useEffect(() => {
        const fetchGallery = async () => {
            if (slug) {
                const data = await getGalleryBySlug(slug);
                setGallery(data);
            }
            setLoading(false);
        };
        fetchGallery();
    }, [slug]);

    useEffect(() => {
        if (!slug || loading || !gallery) return;
        let cancelled = false;
        (async () => {
            const rows = await getGalleriesExcludingSlug(slug, 10);
            if (!cancelled) setRelatedFallback(rows);
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, loading, gallery]);

    useEffect(() => {
        if (!slug || loading || !gallery) return;
        let cancelled = false;
        (async () => {
            const n = await getGalleryAdjacentByCreatedAt(slug);
            if (cancelled) return;
            const olderSlug = getSlugValue(n.older?.slug);
            const newerSlug = getSlugValue(n.newer?.slug);
            setAdjacent({
                prev:
                    olderSlug && n.older?.title
                        ? {
                              to: `/news/media-and-press/galleries/${olderSlug}`,
                              label: n.older.title,
                          }
                        : null,
                next:
                    newerSlug && n.newer?.title
                        ? {
                              to: `/news/media-and-press/galleries/${newerSlug}`,
                              label: n.newer.title,
                          }
                        : null,
            });
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, loading, gallery]);

    const breadcrumbItems = useMemo(() => {
        if (!gallery?.title) return [];
        return [
            { label: "Home", href: "/" },
            { label: "Media and press", href: "/news/media-and-press" },
            { label: gallery.title },
        ];
    }, [gallery?.title]);

    const relatedNavLinks = useMemo((): InternalNavLink[] => {
        if (!slug) return [];
        const raw: InternalNavLink[] = [
            { title: "Media and press", to: "/news/media-and-press" },
            {
                title: "Photo galleries archive",
                to: "/news/media-and-press/galleries/archive",
            },
            { title: "Latest news", to: "/news" },
        ];
        for (const row of relatedFallback) {
            const s = getSlugValue(row.slug);
            if (!s || s === slug) continue;
            raw.push({
                title: row.title,
                to: `/news/media-and-press/galleries/${s}`,
            });
        }
        return mergeDedupeInternalLinks(raw, 8);
    }, [slug, relatedFallback]);

    useEffect(() => {
        const canonicalPath = slug
            ? `/news/media-and-press/galleries/${slug}`
            : "/news/media-and-press";

        if (!gallery && !loading) {
            applySeo({
                title: "Gallery Not Found | China Coast Community",
                description: "The gallery you are looking for does not exist.",
                url: getCanonicalUrl(canonicalPath),
                robots: "noindex, nofollow",
            });
            return () => applySeo();
        }

        if (!gallery) {
            return;
        }

        applySeo({
            title: `${gallery.title || "Gallery"} | Media and Press | China Coast Community`,
            description:
                gallery.description ||
                `View photos from ${gallery.title || "this gallery"}.`,
            url: getCanonicalUrl(canonicalPath),
            type: "article",
        });

        return () => applySeo();
    }, [gallery, loading, slug]);

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

    if (!gallery) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main id="main-content" className="flex-1">
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Gallery Not Found
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    The gallery you're looking for doesn't exist.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    // Convert Sanity gallery images to ImageGallery format
    const galleryImages =
        gallery.images?.map((img) => {
            const imageUrl = img.image
                ? getImageUrl(img.image, {
                      width: 1920,
                      height: 1080,
                      format: "webp",
                  })
                : "";
            return {
                src: imageUrl || "",
                alt: img.alt || img.caption || gallery.title || "Gallery image",
            };
        }) || [];

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
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {gallery.title}
                            </h1>
                            {gallery.description && (
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    {gallery.description}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {galleryImages.length > 0 ? (
                    <ImageGallery
                        images={galleryImages}
                        title={gallery.title}
                    />
                ) : (
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    No images available in this gallery.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <section className="py-12 border-t border-border bg-muted/20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-10">
                            <DetailAdjacentLinks
                                prev={adjacent.prev}
                                next={adjacent.next}
                            />
                            <RelatedContentLinks links={relatedNavLinks} />
                            <SupportCtaLinks />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default GalleryDetail;

