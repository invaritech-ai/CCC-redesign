import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGalleryBySlug } from "@/lib/sanity.queries";
import { ImageGallery } from "@/components/ImageGallery";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityGallery } from "@/lib/sanity.types";

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? "property" : "name";
    let element = document.querySelector(
        `meta[${attribute}="${name}"]`
    ) as HTMLMetaElement;

    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
    }

    element.content = content;
};

const GalleryDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [gallery, setGallery] = useState<SanityGallery | null>(null);
    const [loading, setLoading] = useState(true);

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

    // Update SEO meta tags when gallery is loaded
    useEffect(() => {
        if (!gallery) return;

        const baseTitle = "China Coast Community";
        const pageTitle = gallery.title
            ? `${gallery.title} | Media and Press | ${baseTitle}`
            : `Gallery | Media and Press | ${baseTitle}`;

        const description =
            gallery.description ||
            `View photos from ${gallery.title || "this gallery"}.`;

        const canonicalUrl = `https://chinacoastcommunity.org/news/media-and-press/galleries/${slug}`;

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
        let canonicalLink = document.querySelector(
            'link[rel="canonical"]'
        ) as HTMLLinkElement;
        if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.rel = "canonical";
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = canonicalUrl;

        // Cleanup function to restore default meta tags when component unmounts
        return () => {
            document.title =
                "China Coast Community - Caring for Hong Kong's English-Speaking Elderly";
            updateMetaTag(
                "description",
                "A caring home for Hong Kong's English-speaking elderly since 1978. Supporting our redevelopment to create a safe, modern community where every senior is valued."
            );
            updateMetaTag(
                "og:title",
                "China Coast Community - Caring for Hong Kong's English-Speaking Elderly",
                true
            );
            updateMetaTag(
                "og:description",
                "A caring home for Hong Kong's English-speaking elderly since 1978. Supporting our redevelopment.",
                true
            );
            updateMetaTag("og:url", "https://chinacoastcommunity.org/", true);
            if (canonicalLink) {
                canonicalLink.href = "https://chinacoastcommunity.org/";
            }
        };
    }, [gallery, slug]);

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
            </main>

            <Footer />
        </div>
    );
};

export default GalleryDetail;

