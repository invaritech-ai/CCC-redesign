import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getAllReports, getPageContent, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Download } from "lucide-react";
import { getImageUrl, getImageUrlFromString } from "@/lib/sanityImage";
import type { SanityReport, SanityFormBuilder, SanityPageContent } from "@/lib/sanity.types";

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

const Reports = () => {
    const [reports, setReports] = useState<SanityReport[]>([]);
    const [pageContent, setPageContent] = useState<SanityPageContent | null>(null);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [reportsData, content, form] = await Promise.all([
                getAllReports(),
                getPageContent("reports"),
                getFormByPage("reports"),
            ]);
            setReports(reportsData);
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
            : `Annual Reports | ${baseTitle}`;
        
        const description = pageContent.subheading || 
            "Transparency and impact reports from China Coast Community.";
        
        const canonicalUrl = `https://chinacoastcommunity.org/reports`;

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
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Annual Reports
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    Transparency and impact reports from China Coast
                                    Community.
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
                                    Loading reports...
                                </p>
                            </div>
                        ) : reports.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {reports.map((report) => (
                                    <Card
                                        key={report._id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {report.image && (
                                            <img
                                                src={
                                                    getImageUrl(report.image, {
                                                        width: 800,
                                                        height: 400,
                                                        format: "webp",
                                                    }) || ""
                                                }
                                                alt={report.title}
                                                className="w-full h-48 object-cover"
                                                width="800"
                                                height="400"
                                            />
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <span className="text-sm font-semibold text-muted-foreground">
                                                    {report.year}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-semibold mb-2">
                                                {report.title}
                                            </h2>
                                            {report.description && (
                                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                                    {report.description}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                {report.slug?.current && (
                                                    <Link
                                                        to={`/reports/${report.slug.current}`}
                                                        className="inline-flex items-center text-primary hover:underline text-sm"
                                                    >
                                                        View details{" "}
                                                        <ArrowRight
                                                            className="ml-1 h-4 w-4"
                                                            aria-hidden="true"
                                                        />
                                                    </Link>
                                                )}
                                                {report.pdf && (
                                                    <a
                                                        href={
                                                            getImageUrlFromString(
                                                                report.pdf.url
                                                            ) || report.pdf.url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-primary hover:underline text-sm ml-auto"
                                                    >
                                                        <Download
                                                            className="h-4 w-4 mr-1"
                                                            aria-hidden="true"
                                                        />
                                                        Download PDF
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    No reports available at this time. Check
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

export default Reports;
