import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { VoicesFromCommunitySection } from "@/components/VoicesFromCommunitySection";
import { useEffect, useState } from "react";
import { getPageContent, getFormByPage } from "@/lib/sanity.queries";
import type { SanityPageContent, SanityFormBuilder } from "@/lib/sanity.types";
import {
    applySeo,
    getCanonicalUrl,
    getPublicPathForPageSlug,
} from "@/lib/seo";

interface CMSPageProps {
    slug: string;
    publicPath?: string;
};

const CMSPage = ({ slug, publicPath }: CMSPageProps) => {
    const [pageContent, setPageContent] = useState<SanityPageContent | null>(
        null
    );
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [content, form] = await Promise.all([
                    getPageContent(slug),
                    getFormByPage(slug),
                ]);

                setPageContent(content);
                setFormConfig(form);

                // Debug logging in development
                if (process.env.NODE_ENV === "development") {
                    console.log("[CMSPage] Slug:", slug);
                    console.log("[CMSPage] Page content found:", !!content);
                    console.log("[CMSPage] Form config found:", !!form);
                    if (form) {
                        console.log("[CMSPage] Form name:", form.formName);
                        console.log(
                            "[CMSPage] Form fields:",
                            form.fields?.length || 0
                        );
                    }
                }
            } catch (error) {
                console.error("[CMSPage] Error fetching page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Update SEO meta tags when pageContent is loaded
    useEffect(() => {
        if (!pageContent) return;

        const baseTitle = "China Coast Community";
        const pageTitle = pageContent.heading
            ? `${pageContent.heading} | ${baseTitle}`
            : `${
                  slug.charAt(0).toUpperCase() +
                  slug.slice(1).replace(/-/g, " ")
              } | ${baseTitle}`;

        const description =
            pageContent.subheading ||
            "China Coast Community - Caring for Hong Kong's English-Speaking Elderly";

        applySeo({
            title: pageTitle,
            description,
            url: getCanonicalUrl(
                publicPath ?? getPublicPathForPageSlug(slug)
            ),
        });

        return () => applySeo();
    }, [pageContent, publicPath, slug]);

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
                        pageSlug={slug}
                    />
                ) : (
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {slug
                                        .split("-")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1)
                                        )
                                        .join(" ")}
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    Content coming soon.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {slug === "care-community/life-at-ccc" && (
                    <VoicesFromCommunitySection />
                )}

                {formConfig && <DynamicForm formConfig={formConfig} />}
            </main>

            <Footer />
        </div>
    );
};

export default CMSPage;
