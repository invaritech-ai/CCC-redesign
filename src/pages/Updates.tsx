import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getLatestUpdates, getPageContent, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityUpdate, SanityFormBuilder, SanityPageContent } from "@/lib/sanity.types";

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

const Updates = () => {
    const [updates, setUpdates] = useState<SanityUpdate[]>([]);
    const [pageContent, setPageContent] = useState<SanityPageContent | null>(null);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [updatesData, content, form] = await Promise.all([
                getLatestUpdates(10),
                getPageContent("updates"),
                getFormByPage("updates"),
            ]);
            setUpdates(updatesData);
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
            : `Updates | ${baseTitle}`;
        
        const description = pageContent.subheading || 
            "Latest news, announcements, and updates from China Coast Community.";
        
        const canonicalUrl = `https://chinacoastcommunity.org/updates`;

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
                    <section className="bg-primary text-primary-foreground py-20">
                        <div className="container mx-auto px-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Updates
                            </h1>
                            <p className="text-xl max-w-3xl opacity-90">
                                Latest news, announcements, and updates from China
                                Coast Community.
                            </p>
                        </div>
                    </section>
                )}

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Loading updates...
                                </p>
                            </div>
                        ) : updates.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {updates.map((update) => (
                                    <Card
                                        key={update._id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {update.image && (
                                            <img
                                                src={
                                                    getImageUrl(update.image, {
                                                        width: 800,
                                                        height: 400,
                                                        format: "webp",
                                                    }) || ""
                                                }
                                                alt={update.title}
                                                className="w-full h-48 object-cover"
                                                width="800"
                                                height="400"
                                            />
                                        )}
                                        <div className="p-6">
                                            {update.featured && (
                                                <Badge
                                                    variant="default"
                                                    className="mb-3"
                                                >
                                                    Featured
                                                </Badge>
                                            )}
                                            <h2 className="text-xl font-semibold mb-2">
                                                {update.title}
                                            </h2>
                                            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                                                <Calendar
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                                <span>
                                                    {format(
                                                        new Date(
                                                            update.publishedAt
                                                        ),
                                                        "PPP"
                                                    )}
                                                </span>
                                            </div>
                                            {update.excerpt && (
                                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                                    {update.excerpt}
                                                </p>
                                            )}
                                            <Link
                                                to={`/updates/${update.slug?.current}`}
                                                className="inline-flex items-center text-primary hover:underline"
                                                aria-label={`Read more about ${update.title}`}
                                            >
                                                Read more{" "}
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
                                    No updates available at this time. Check
                                    back soon!
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

export default Updates;
