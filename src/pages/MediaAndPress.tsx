import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import {
    getAllGalleries,
    getAllPressReleases,
    getPageContent,
    getFormByPage,
} from "@/lib/sanity.queries";
import { GalleryCard } from "@/components/GalleryCard";
import { PressReleaseCard } from "@/components/PressReleaseCard";
import type {
    SanityGallery,
    SanityPressRelease,
    SanityFormBuilder,
    SanityPageContent,
} from "@/lib/sanity.types";

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

const MediaAndPress = () => {
    const [galleries, setGalleries] = useState<SanityGallery[]>([]);
    const [pressReleases, setPressReleases] = useState<SanityPressRelease[]>(
        []
    );
    const [pageContent, setPageContent] = useState<SanityPageContent | null>(
        null
    );
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [galleriesData, pressReleasesData, content, form] =
                await Promise.all([
                    getAllGalleries(),
                    getAllPressReleases(),
                    getPageContent("news/media-and-press"),
                    getFormByPage("news/media-and-press"),
                ]);
            setGalleries(galleriesData);
            setPressReleases(pressReleasesData);
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
            : `Media and Press | ${baseTitle}`;

        const description =
            pageContent.subheading ||
            "Media coverage, press releases, and photo galleries from China Coast Community.";

        const canonicalUrl = `https://chinacoastcommunity.org/news/media-and-press`;

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
                        heroImage={pageContent.heroImage}
                        bottomImages={pageContent.bottomImages}
                    />
                ) : (
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Media and Press
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    Media coverage, press releases, and photo
                                    galleries from China Coast Community.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Galleries Section */}
                {galleries.length > 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                                Photo Galleries
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 max-w-7xl mx-auto">
                                {galleries.map((gallery) => (
                                    <GalleryCard
                                        key={gallery._id}
                                        gallery={gallery}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Press Releases Section */}
                {pressReleases.length > 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                                Press Releases
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 max-w-7xl mx-auto">
                                {pressReleases.map((pressRelease) => (
                                    <PressReleaseCard
                                        key={pressRelease._id}
                                        pressRelease={pressRelease}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Empty States */}
                {!loading && galleries.length === 0 && pressReleases.length === 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    No galleries or press releases available at
                                    this time. Check back soon!
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {formConfig && <DynamicForm formConfig={formConfig} />}
            </main>

            <Footer />
        </div>
    );
};

export default MediaAndPress;

