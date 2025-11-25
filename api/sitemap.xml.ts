import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sanityServerClient, isSanityConfiguredServer } from "./lib/index.js";

// Get base URL from environment or use default
// VERCEL_URL is provided by Vercel and includes protocol (e.g., "chinacoastcommunity.org")
// For production, always use the canonical domain
const getBaseUrl = (): string => {
    if (process.env.VERCEL_ENV === "production") {
        return "https://chinacoastcommunity.org";
    }
    // For preview/deployment URLs, use VERCEL_URL if available
    if (process.env.VERCEL_URL) {
        return process.env.VERCEL_URL.startsWith("http")
            ? process.env.VERCEL_URL
            : `https://${process.env.VERCEL_URL}`;
    }
    return "https://chinacoastcommunity.org";
};

const BASE_URL = getBaseUrl();

interface SitemapEntry {
    loc: string;
    lastmod?: string;
    changefreq?:
        | "always"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "never";
    priority?: number;
}

/**
 * Format date for sitemap XML (ISO 8601 format)
 */
function formatDate(date: string | undefined): string | undefined {
    if (!date) return undefined;
    try {
        return new Date(date).toISOString().split("T")[0];
    } catch {
        return undefined;
    }
}

/**
 * Generate sitemap XML from entries
 */
function generateSitemapXML(entries: SitemapEntry[]): string {
    const urlEntries = entries
        .map((entry) => {
            const urlParts = [`<loc>${entry.loc}</loc>`];
            if (entry.lastmod) {
                urlParts.push(`<lastmod>${entry.lastmod}</lastmod>`);
            }
            if (entry.changefreq) {
                urlParts.push(`<changefreq>${entry.changefreq}</changefreq>`);
            }
            if (entry.priority !== undefined) {
                urlParts.push(`<priority>${entry.priority}</priority>`);
            }
            return `<url>${urlParts.join("")}</url>`;
        })
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Get URL path for update based on type
 */
function getUpdatePath(update: { slug: string; type: string }): string {
    if (update.type === "story") {
        return `/news/stories/${update.slug}`;
    }
    return `/news/${update.slug}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const entries: SitemapEntry[] = [];

        // Static routes
        const staticRoutes: SitemapEntry[] = [
            { loc: `${BASE_URL}/`, changefreq: "daily", priority: 1.0 },
            {
                loc: `${BASE_URL}/who-we-are/about`,
                changefreq: "monthly",
                priority: 0.8,
            },
            {
                loc: `${BASE_URL}/redevelopment`,
                changefreq: "monthly",
                priority: 0.8,
            },
            {
                loc: `${BASE_URL}/contact`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/care-community/community-members-programme`,
                changefreq: "monthly",
                priority: 0.8,
            },
            {
                loc: `${BASE_URL}/get-involved/volunteer`,
                changefreq: "monthly",
                priority: 0.8,
            },
            { loc: `${BASE_URL}/donate`, changefreq: "monthly", priority: 0.9 },
            {
                loc: `${BASE_URL}/who-we-are/publications/annual-reports`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/reports`,
                changefreq: "monthly",
                priority: 0.7,
            },
            { loc: `${BASE_URL}/news`, changefreq: "daily", priority: 0.8 },
            {
                loc: `${BASE_URL}/news/noticeboard`,
                changefreq: "daily",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/news/stories`,
                changefreq: "daily",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/news/blog`,
                changefreq: "daily",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/news/media-and-press`,
                changefreq: "weekly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/care-community/activities-and-events`,
                changefreq: "weekly",
                priority: 0.8,
            },
            { loc: `${BASE_URL}/privacy`, changefreq: "yearly", priority: 0.3 },
            // CMS Pages
            {
                loc: `${BASE_URL}/who-we-are/history`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/who-we-are/mission-values`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/who-we-are/board-governance`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/who-we-are/team`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/care-community/life-at-ccc`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/care-community/care-and-attention-home`,
                changefreq: "monthly",
                priority: 0.7,
            },
            {
                loc: `${BASE_URL}/care-community/faqs`,
                changefreq: "monthly",
                priority: 0.7,
            },
        ];

        entries.push(...staticRoutes);

        // Fetch dynamic content from Sanity
        if (isSanityConfiguredServer()) {
            try {
                const [
                    updates,
                    events,
                    reports,
                    galleries,
                    pressReleases,
                    caseStudies,
                    pageContent,
                ] = await Promise.all([
                    // Updates
                    sanityServerClient.fetch(
                        `*[_type == "update"] {
                        _id,
                        "slug": slug.current,
                        type,
                        publishedAt,
                        _updatedAt
                    }`
                    ),
                    // Events
                    sanityServerClient.fetch(
                        `*[_type == "event"] {
                        _id,
                        "slug": slug.current,
                        date,
                        _updatedAt
                    }`
                    ),
                    // Reports
                    sanityServerClient.fetch(
                        `*[_type == "report"] {
                        _id,
                        "slug": slug.current,
                        year,
                        _updatedAt
                    }`
                    ),
                    // Galleries
                    sanityServerClient.fetch(
                        `*[_type == "gallery"] {
                        _id,
                        "slug": slug.current,
                        _updatedAt
                    }`
                    ),
                    // Press Releases
                    sanityServerClient.fetch(
                        `*[_type == "pressRelease"] {
                        _id,
                        "slug": slug.current,
                        date,
                        _updatedAt
                    }`
                    ),
                    // Case Studies
                    sanityServerClient.fetch(
                        `*[_type == "caseStudy"] {
                        _id,
                        "slug": slug.current,
                        date,
                        _updatedAt
                    }`
                    ),
                    // Page Content
                    sanityServerClient.fetch(
                        `*[_type == "pageContent"] {
                        _id,
                        pageSlug,
                        _updatedAt
                    }`
                    ),
                ]);

                // Add updates (news articles, stories, etc.)
                if (Array.isArray(updates)) {
                    updates.forEach((update: any) => {
                        if (update.slug) {
                            entries.push({
                                loc: `${BASE_URL}${getUpdatePath(update)}`,
                                lastmod: formatDate(
                                    update._updatedAt || update.publishedAt
                                ),
                                changefreq: "weekly",
                                priority: 0.6,
                            });
                        }
                    });
                }

                // Add case studies (stories)
                if (Array.isArray(caseStudies)) {
                    caseStudies.forEach((caseStudy: any) => {
                        if (caseStudy.slug) {
                            entries.push({
                                loc: `${BASE_URL}/news/stories/${caseStudy.slug}`,
                                lastmod: formatDate(
                                    caseStudy._updatedAt || caseStudy.date
                                ),
                                changefreq: "monthly",
                                priority: 0.6,
                            });
                        }
                    });
                }

                // Add events
                if (Array.isArray(events)) {
                    events.forEach((event: any) => {
                        if (event.slug) {
                            entries.push({
                                loc: `${BASE_URL}/care-community/activities-and-events/${event.slug}`,
                                lastmod: formatDate(
                                    event._updatedAt || event.date
                                ),
                                changefreq: "weekly",
                                priority: 0.7,
                            });
                        }
                    });
                }

                // Add reports
                if (Array.isArray(reports)) {
                    reports.forEach((report: any) => {
                        if (report.slug) {
                            entries.push({
                                loc: `${BASE_URL}/who-we-are/publications/annual-reports/${report.slug}`,
                                lastmod: formatDate(report._updatedAt),
                                changefreq: "yearly",
                                priority: 0.6,
                            });
                            // Also add shorter alias
                            entries.push({
                                loc: `${BASE_URL}/reports/${report.slug}`,
                                lastmod: formatDate(report._updatedAt),
                                changefreq: "yearly",
                                priority: 0.6,
                            });
                        }
                    });
                }

                // Add galleries
                if (Array.isArray(galleries)) {
                    galleries.forEach((gallery: any) => {
                        if (gallery.slug) {
                            entries.push({
                                loc: `${BASE_URL}/news/media-and-press/galleries/${gallery.slug}`,
                                lastmod: formatDate(gallery._updatedAt),
                                changefreq: "monthly",
                                priority: 0.5,
                            });
                        }
                    });
                }

                // Add press releases
                if (Array.isArray(pressReleases)) {
                    pressReleases.forEach((pressRelease: any) => {
                        if (pressRelease.slug) {
                            entries.push({
                                loc: `${BASE_URL}/news/media-and-press/press-releases/${pressRelease.slug}`,
                                lastmod: formatDate(
                                    pressRelease._updatedAt || pressRelease.date
                                ),
                                changefreq: "monthly",
                                priority: 0.6,
                            });
                        }
                    });
                }

                // Add CMS pages (pageContent)
                if (Array.isArray(pageContent)) {
                    pageContent.forEach((page: any) => {
                        if (page.pageSlug) {
                            entries.push({
                                loc: `${BASE_URL}/${page.pageSlug}`,
                                lastmod: formatDate(page._updatedAt),
                                changefreq: "monthly",
                                priority: 0.7,
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(
                    "[Sitemap] Error fetching Sanity content:",
                    error
                );
                // Continue with static routes only if Sanity fails
            }
        }

        // Generate XML
        const xml = generateSitemapXML(entries);

        // Set headers
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.setHeader(
            "Cache-Control",
            "public, s-maxage=3600, stale-while-revalidate=86400"
        );

        return res.status(200).send(xml);
    } catch (error) {
        console.error("[Sitemap] Error generating sitemap:", error);
        return res.status(500).json({ error: "Failed to generate sitemap" });
    }
}
