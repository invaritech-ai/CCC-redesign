import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getAllUpdates, getAllCaseStudies, getPageContent, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/sanityImage";
import { UPDATE_TYPES, type SanityUpdate, type SanityCaseStudy, type SanityFormBuilder, type SanityPageContent } from "@/lib/sanity.types";
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

interface UpdatesProps {
    defaultType?: string | string[];
    title?: string;
    pageSlug?: string;
}

// Unified type for display that combines updates and case studies
type UnifiedItem = (SanityUpdate & { contentType: 'update' }) | (SanityCaseStudy & { contentType: 'caseStudy'; publishedAt: string; excerpt?: string; image?: any });

const Updates = ({ defaultType, title, pageSlug = "updates" }: UpdatesProps) => {
    const location = useLocation();
    const [updates, setUpdates] = useState<SanityUpdate[]>([]);
    const [caseStudies, setCaseStudies] = useState<SanityCaseStudy[]>([]);
    const [pageContent, setPageContent] = useState<SanityPageContent | null>(null);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(12);

    // Check if we're on the stories page
    const isStoriesPage = defaultType === "story" || pageSlug === "news/stories";

    useEffect(() => {
        const fetchData = async () => {
            const promises = [
                getAllUpdates(),
                getPageContent(pageSlug),
                getFormByPage(pageSlug),
            ];
            
            // Fetch case studies if we're on the stories page
            if (isStoriesPage) {
                promises.push(getAllCaseStudies());
            }

            const results = await Promise.all(promises);
            setUpdates(results[0] as SanityUpdate[]);
            setPageContent(results[1] as SanityPageContent | null);
            setFormConfig(results[2] as SanityFormBuilder | null);
            if (isStoriesPage && results[3]) {
                setCaseStudies(results[3] as SanityCaseStudy[]);
            }
            setLoading(false);
        };
        fetchData();
    }, [pageSlug, isStoriesPage]);

    // Update SEO meta tags when pageContent is loaded
    useEffect(() => {
        if (!pageContent) return;

        const baseTitle = "China Coast Community";
        // Use provided title prop or fallback to CMS heading or default
        const displayTitle = title || pageContent.heading || "Updates";
        const pageTitle = `${displayTitle} | ${baseTitle}`;
        
        const description = pageContent.subheading || 
            "Latest news, announcements, and updates from China Coast Community.";
        
        // Use the actual route path for canonical URL
        const canonicalUrl = `https://chinacoastcommunity.org${location.pathname}`;

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
    }, [pageContent, title, location.pathname]);

    // Normalize case studies to match update format for unified display
    const normalizedCaseStudies = useMemo(() => {
        return caseStudies.map((caseStudy): UnifiedItem => {
            // Extract first image from images array
            const firstImage = caseStudy.images && caseStudy.images.length > 0 
                ? caseStudy.images[0].image 
                : undefined;
            
            // Extract excerpt from description (first block of text)
            let excerpt: string | undefined;
            if (caseStudy.description && Array.isArray(caseStudy.description) && caseStudy.description.length > 0) {
                const firstBlock = caseStudy.description[0];
                if (firstBlock._type === "block" && firstBlock.children) {
                    excerpt = firstBlock.children
                        .map((child: any) => child.text || "")
                        .join("")
                        .substring(0, 150); // Limit excerpt length
                }
            }

            // Convert date to publishedAt format
            const publishedAt = caseStudy.date 
                ? new Date(caseStudy.date).toISOString()
                : new Date().toISOString();

            return {
                ...caseStudy,
                contentType: 'caseStudy' as const,
                publishedAt,
                excerpt,
                image: firstImage,
            };
        });
    }, [caseStudies]);

    // Combine updates and case studies into unified array
    const unifiedItems = useMemo(() => {
        const updateItems: UnifiedItem[] = updates.map(update => ({
            ...update,
            contentType: 'update' as const,
        }));
        
        if (isStoriesPage) {
            return [...updateItems, ...normalizedCaseStudies].sort((a, b) => {
                const dateA = new Date(a.publishedAt).getTime();
                const dateB = new Date(b.publishedAt).getTime();
                return dateB - dateA; // Most recent first
            });
        }
        
        return updateItems;
    }, [updates, normalizedCaseStudies, isStoriesPage]);

    // Get unique types, categories, and tags from unified items
    const availableCategories = useMemo(() => {
        const categories = unifiedItems
            .flatMap((item) => item.categories || [])
            .filter((cat): cat is string => cat !== undefined && cat !== null);
        return Array.from(new Set(categories)).sort();
    }, [unifiedItems]);

    const availableTags = useMemo(() => {
        const tags = unifiedItems
            .flatMap((item) => item.tags || [])
            .filter((tag): tag is string => tag !== undefined && tag !== null);
        return Array.from(new Set(tags)).sort();
    }, [unifiedItems]);

    // Filter unified items based on search, type, categories, and tags
    const filteredItems = useMemo(() => {
        return unifiedItems.filter((item) => {
            // Default Type Pre-filter (if prop is provided)
            if (defaultType) {
                const types = Array.isArray(defaultType) ? defaultType : [defaultType];
                // For case studies, include them if we're on stories page
                if (item.contentType === 'caseStudy') {
                    // Case studies are always included on stories page
                    if (!isStoriesPage) return false;
                } else {
                    // For updates, check type match
                    if (!item.type || !types.includes(item.type.toLowerCase())) {
                        return false;
                    }
                }
            }

            // User selected Type filter (only if no defaultType is set)
            if (!defaultType && selectedType !== "all") {
                if (item.contentType === 'caseStudy') {
                    // Case studies don't have a type field, skip type filter for them
                    // But if user explicitly filters, we might want to exclude them
                    // For now, include case studies when type filter is set (they're still stories)
                } else if (item.type !== selectedType) {
                    return false;
                }
            }

            // Categories filter (must match at least one selected category)
            if (selectedCategories.length > 0) {
                const itemCategories = item.categories || [];
                const hasMatchingCategory = selectedCategories.some((cat) =>
                    itemCategories.includes(cat)
                );
                if (!hasMatchingCategory) {
                    return false;
                }
            }

            // Tags filter (must match at least one selected tag)
            if (selectedTags.length > 0) {
                const itemTags = item.tags || [];
                const hasMatchingTag = selectedTags.some((tag) => itemTags.includes(tag));
                if (!hasMatchingTag) {
                    return false;
                }
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = item.title?.toLowerCase().includes(query);
                const matchesExcerpt = item.excerpt?.toLowerCase().includes(query);
                const matchesTags = item.tags?.some((tag) =>
                    tag.toLowerCase().includes(query)
                );
                // For case studies, also search in client field
                if (item.contentType === 'caseStudy') {
                    const matchesClient = item.client?.toLowerCase().includes(query);
                    return matchesTitle || matchesExcerpt || matchesTags || matchesClient;
                }
                return matchesTitle || matchesExcerpt || matchesTags;
            }

            return true;
        });
    }, [unifiedItems, searchQuery, selectedType, selectedCategories, selectedTags, defaultType, isStoriesPage]);

    // Get displayed items (paginated)
    const displayedItems = useMemo(() => {
        return filteredItems.slice(0, displayCount);
    }, [filteredItems, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount((prev) => prev + 12);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedType("all");
        setSelectedCategories([]);
        setSelectedTags([]);
        setDisplayCount(12);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setDisplayCount(12);
    }, [searchQuery, selectedType, selectedCategories, selectedTags, defaultType]);

    const typeFilterOptions = UPDATE_TYPES.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));

    const categoryFilterOptions = availableCategories.map((category) => ({
        label: category,
        value: category,
    }));

    const tagFilterOptions = availableTags.map((tag) => ({
        label: tag,
        value: tag,
    }));

    // For multi-select filters, we'll use a simplified approach with chips
    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                {pageContent ? (
                    <PageContent
                        heading={title || pageContent.heading}
                        subheading={pageContent.subheading}
                        content={pageContent.content}
                        badgeText={pageContent.badgeText}
                    />
                ) : (
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {title || "Updates"}
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    Latest news, announcements, and updates from China
                                    Coast Community.
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
                                    Loading updates...
                                </p>
                            </div>
                        ) : unifiedItems.length > 0 ? (
                            <>
                                <SearchAndFilter
                                    searchValue={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    filters={
                                        // Only show Type filter if no defaultType is provided
                                        !defaultType ? [
                                            {
                                                label: "Type",
                                                key: "type",
                                                options: typeFilterOptions,
                                                value: selectedType,
                                                onChange: setSelectedType,
                                            },
                                        ] : []
                                    }
                                    onClearFilters={handleClearFilters}
                                    displayedCount={displayedItems.length}
                                    totalCount={filteredItems.length}
                                />



                                {/* Multi-select filters for categories and tags */}
                                {(availableCategories.length > 0 || availableTags.length > 0) && (
                                    <div className="mb-6 space-y-4">
                                        {availableCategories.length > 0 && (
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Categories:
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {availableCategories.map((category) => (
                                                        <Badge
                                                            key={category}
                                                            variant={
                                                                selectedCategories.includes(category)
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className="cursor-pointer"
                                                            onClick={() => handleCategoryToggle(category)}
                                                        >
                                                            {category}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {availableTags.length > 0 && (
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Tags:
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {availableTags.map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant={
                                                                selectedTags.includes(tag)
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className="cursor-pointer"
                                                            onClick={() => handleTagToggle(tag)}
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {displayedItems.length > 0 ? (
                                    <>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 max-w-7xl mx-auto">
                                            {displayedItems.map((item) => (
                                                <Card
                                                    key={item._id}
                                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                                >
                                                    {item.image && (
                                                        <img
                                                            src={
                                                                getImageUrl(item.image, {
                                                                    width: 800,
                                                                    height: 400,
                                                                    format: "webp",
                                                                }) || ""
                                                            }
                                                            alt={item.title}
                                                            className="w-full h-32 md:h-24 object-cover"
                                                            width="800"
                                                            height="400"
                                                        />
                                                    )}
                                                    <div className="p-4 md:p-3">
                                                        <div className="flex flex-wrap gap-1 mb-1.5 md:mb-1">
                                                            {item.featured && (
                                                                <Badge
                                                                    variant="default"
                                                                    className="text-xs"
                                                                >
                                                                    Featured
                                                                </Badge>
                                                            )}
                                                            {item.contentType === 'caseStudy' && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    Case Study
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h2 className="text-lg font-semibold mb-1.5 md:mb-1 leading-tight line-clamp-2">
                                                            {item.title}
                                                        </h2>
                                                        <div className="flex items-center gap-1.5 mb-1.5 md:mb-1 text-xs text-muted-foreground">
                                                            <Calendar
                                                                className="h-3 w-3"
                                                                aria-hidden="true"
                                                            />
                                                            <span>
                                                                {format(
                                                                    new Date(
                                                                        item.publishedAt
                                                                    ),
                                                                    "PPP"
                                                                )}
                                                            </span>
                                                        </div>
                                                        {item.contentType === 'caseStudy' && item.client && (
                                                            <p className="text-xs text-muted-foreground mb-1.5 md:mb-1">
                                                                Client: {item.client}
                                                            </p>
                                                        )}
                                                        {item.excerpt && (
                                                            <p className="text-sm text-muted-foreground mb-1.5 md:mb-1 line-clamp-2">
                                                                {item.excerpt}
                                                            </p>
                                                        )}
                                                        <Link
                                                            to={
                                                                item.contentType === 'caseStudy' || isStoriesPage
                                                                    ? `/news/stories/${item.slug?.current}`
                                                                    : `/news/${item.slug?.current}`
                                                            }
                                                            className="inline-flex items-center text-primary hover:underline text-base font-semibold py-2 mt-3"
                                                            aria-label={`Read more about ${item.title}`}
                                                        >
                                                            Read more{" "}
                                                            <ArrowRight
                                                                className="ml-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>

                                        {displayedItems.length < filteredItems.length && (
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
                                    <div className="max-w-4xl mx-auto text-center py-12 space-y-4">
                                        <p className="text-xl font-semibold text-foreground">
                                            No {title?.toLowerCase() || "updates"} found
                                        </p>
                                        {(searchQuery || selectedCategories.length > 0 || selectedTags.length > 0 || (!defaultType && selectedType !== "all")) ? (
                                            <>
                                                <p className="text-lg text-muted-foreground">
                                                    We couldn't find any results matching your current search or filters.
                                                </p>
                                                <div className="pt-4">
                                                    <Button
                                                        onClick={handleClearFilters}
                                                        variant="outline"
                                                        className="min-w-[150px]"
                                                    >
                                                        Clear All Filters
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-lg text-muted-foreground">
                                                Check back soon for new {title?.toLowerCase() || "updates"}!
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="max-w-4xl mx-auto text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    No {title?.toLowerCase() || "updates"} available at this time. Check
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
