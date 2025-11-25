import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState, useMemo } from "react";
import { getAllReports, getPageContent, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Download } from "lucide-react";
import { getImageUrl, getImageUrlFromString } from "@/lib/sanityImage";
import type { SanityReport, SanityFormBuilder, SanityPageContent } from "@/lib/sanity.types";
import { SearchAndFilter } from "@/components/SearchAndFilter";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [displayCount, setDisplayCount] = useState(12);

    useEffect(() => {
        const fetchData = async () => {
            const [reportsData, content, form] = await Promise.all([
                getAllReports(),
                getPageContent("who-we-are/publications/annual-reports"),
                getFormByPage("who-we-are/publications/annual-reports"),
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
        
        const canonicalUrl = `https://chinacoastcommunity.org/who-we-are/publications/annual-reports`;

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

    // Get unique years from reports
    const availableYears = useMemo(() => {
        const years = reports
            .map((report) => report.year)
            .filter((year): year is number => year !== undefined && year !== null)
            .sort((a, b) => b - a);
        return Array.from(new Set(years));
    }, [reports]);

    // Filter reports based on search and year
    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            // Year filter
            if (selectedYear !== "all" && report.year?.toString() !== selectedYear) {
                return false;
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = report.title?.toLowerCase().includes(query);
                const matchesDescription = report.description?.toLowerCase().includes(query);
                const matchesYear = report.year?.toString().includes(query);
                return matchesTitle || matchesDescription || matchesYear;
            }

            return true;
        });
    }, [reports, searchQuery, selectedYear]);

    // Get displayed reports (paginated)
    const displayedReports = useMemo(() => {
        return filteredReports.slice(0, displayCount);
    }, [filteredReports, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount((prev) => prev + 12);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedYear("all");
        setDisplayCount(12);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setDisplayCount(12);
    }, [searchQuery, selectedYear]);

    const yearFilterOptions = availableYears.map((year) => ({
        label: year.toString(),
        value: year.toString(),
    }));

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
                            <>
                                <SearchAndFilter
                                    searchValue={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    filters={[
                                        {
                                            label: "Year",
                                            key: "year",
                                            options: yearFilterOptions,
                                            value: selectedYear,
                                            onChange: setSelectedYear,
                                        },
                                    ]}
                                    onClearFilters={handleClearFilters}
                                    displayedCount={displayedReports.length}
                                    totalCount={filteredReports.length}
                                />

                                {displayedReports.length > 0 ? (
                                    <>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 max-w-7xl mx-auto">
                                            {displayedReports.map((report) => (
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
                                                            className="w-full h-32 md:h-24 object-cover"
                                                            width="800"
                                                            height="400"
                                                        />
                                                    )}
                                                    <div className="p-4 md:p-3">
                                                        <div className="flex items-center gap-2 mb-1.5 md:mb-1">
                                                            <FileText className="h-4 w-4 text-primary" />
                                                            <span className="text-xs font-semibold text-muted-foreground">
                                                                {report.year}
                                                            </span>
                                                        </div>
                                                        <h2 className="text-lg font-semibold mb-1.5 md:mb-1 leading-tight line-clamp-2">
                                                            {report.title}
                                                        </h2>
                                                        {report.description && (
                                                            <p className="text-sm text-muted-foreground mb-2 md:mb-1.5 line-clamp-2">
                                                                {report.description}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-col sm:flex-row gap-3 mt-3">
                                                            {report.slug?.current && (
                                                                <Link
                                                                    to={`/who-we-are/publications/annual-reports/${report.slug.current}`}
                                                                    className="inline-flex items-center text-primary hover:underline text-base font-semibold py-2"
                                                                >
                                                                    View details{" "}
                                                                    <ArrowRight
                                                                        className="ml-2 h-5 w-5"
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
                                                                    className="inline-flex items-center text-primary hover:underline text-base font-semibold py-2 sm:ml-auto"
                                                                >
                                                                    <Download
                                                                        className="h-5 w-5 mr-2"
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

                                        {displayedReports.length < filteredReports.length && (
                                            <div className="text-center mt-8">
                                                <Button
                                                    onClick={handleLoadMore}
                                                    variant="outline"
                                                    className="min-w-[150px]"
                                                >
                                                    Load More
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="max-w-4xl mx-auto text-center py-12">
                                        <p className="text-lg text-muted-foreground">
                                            No reports found matching your filters.
                                        </p>
                                    </div>
                                )}
                            </>
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
