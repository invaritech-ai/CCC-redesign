import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

loadDotenv({ path: path.join(projectRoot, ".env.local") });

const CANONICAL_BASE_URL = "https://www.chinacoastcommunity.org.hk";
const DEFAULT_SITE_TITLE =
    "China Coast Community | Caring for Hong Kong's English-Speaking Elders";
const DEFAULT_SITE_DESCRIPTION =
    "Since 1978, China Coast Community has cared for Hong Kong's English-speaking elders. Support the redevelopment of a safer, modern home where every senior is valued.";
const DEFAULT_OG_IMAGE_URL = `${CANONICAL_BASE_URL}/og-image-ccc-2026-04-02.jpg`;
const DEFAULT_OG_IMAGE_ALT =
    "China Coast Community social sharing image featuring the CCC name and redevelopment message.";
const DEFAULT_TWITTER_CARD = "summary_large_image";

const PAGE_SLUG_PUBLIC_PATHS = {
    team: "/who-we-are/team",
    volunteer: "/get-involved/volunteer",
    "support/donate": "/donate",
    updates: "/news",
};

const STATIC_ROUTE_SEO = [
    {
        path: "/",
        title: DEFAULT_SITE_TITLE,
        description: DEFAULT_SITE_DESCRIPTION,
    },
    {
        path: "/who-we-are/about",
        title: "About China Coast Community | China Coast Community",
        description:
            "Learn about China Coast Community's 45+ year mission supporting Hong Kong's English-speaking elders through compassionate care and community programs.",
    },
    {
        path: "/redevelopment",
        title: "Redevelopment at 63 Cumberland Road | China Coast Community",
        description:
            "Follow China Coast Community's redevelopment journey to build a safer, modern home for Hong Kong's English-speaking elders.",
    },
    {
        path: "/contact",
        title: "Contact China Coast Community | China Coast Community",
        description:
            "Get in touch with China Coast Community for care enquiries, volunteering, donations, and community support services.",
    },
    {
        path: "/privacy",
        title: "Privacy Policy | China Coast Community",
        description:
            "Read how China Coast Community handles privacy, cookies, and personal data across our website and services.",
    },
    {
        path: "/who-we-are/board-governance",
        title: "Board & Governance | China Coast Community",
        description:
            "Meet the volunteer committees and governance structure guiding China Coast Community's mission and redevelopment oversight.",
    },
    {
        path: "/care-community/activities-and-events",
        title: "Activities & Events | China Coast Community",
        description:
            "Discover upcoming community activities and events hosted by China Coast Community for English-speaking elders in Hong Kong.",
    },
    {
        path: "/care-community/activities-and-events/archive",
        title: "Past events archive | China Coast Community",
        description:
            "Browse past community activities and events at China Coast Community.",
    },
    {
        path: "/care-community/faqs",
        title: "Frequently Asked Questions | China Coast Community",
        description:
            "Find answers about China Coast Community's services, programs, community activities, and redevelopment updates.",
    },
    {
        path: "/who-we-are/publications/annual-reports",
        title: "Annual Reports | China Coast Community",
        description:
            "Browse China Coast Community annual reports and impact publications.",
    },
    {
        path: "/news",
        title: "Latest News | China Coast Community",
        description:
            "Read the latest news, announcements, and updates from China Coast Community.",
    },
    {
        path: "/news/stories",
        title: "Stories | China Coast Community",
        description:
            "Read stories from China Coast Community and our English-speaking elder community in Hong Kong.",
    },
    {
        path: "/news/blog",
        title: "Blog | China Coast Community",
        description:
            "Explore blog posts and articles from China Coast Community.",
    },
    {
        path: "/news/noticeboard",
        title: "Noticeboard | China Coast Community",
        description:
            "See community notices and updates from China Coast Community.",
    },
    {
        path: "/news/media-and-press",
        title: "Media and Press | China Coast Community",
        description:
            "View media coverage, press releases, and galleries from China Coast Community.",
    },
    {
        path: "/news/media-and-press/galleries/archive",
        title: "Photo galleries archive | China Coast Community",
        description:
            "Browse photo galleries from China Coast Community events and activities.",
    },
    {
        path: "/news/media-and-press/press-releases/archive",
        title: "Press releases archive | China Coast Community",
        description:
            "Browse press releases and announcements from China Coast Community.",
    },
];

const getCanonicalUrl = (pathValue) => {
    const normalizedPath =
        !pathValue || pathValue === "/"
            ? "/"
            : `/${pathValue.replace(/^\/+/, "").replace(/\/+$/, "")}`;

    return normalizedPath === "/"
        ? `${CANONICAL_BASE_URL}/`
        : `${CANONICAL_BASE_URL}${normalizedPath}`;
};

const normalizeRoutePath = (pathValue) => {
    if (!pathValue || pathValue === "/") {
        return "/";
    }

    const normalized = `/${String(pathValue).replace(/^\/+/, "").replace(/\/+$/, "")}`;
    if (normalized.includes("..") || normalized.includes("\\")) {
        throw new Error(`Unsafe route path "${pathValue}"`);
    }

    if (!/^\/[a-zA-Z0-9/_-]*$/.test(normalized)) {
        throw new Error(`Invalid route path "${pathValue}"`);
    }

    return normalized;
};

const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const portableTextToPlainText = (blocks) => {
    if (!Array.isArray(blocks)) {
        return "";
    }
    return blocks
        .filter((block) => block?._type === "block" && Array.isArray(block.children))
        .flatMap((block) => block.children)
        .map((child) => child?.text ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
};

const getPublicPathForPageSlug = (pageSlug) => {
    if (!pageSlug || pageSlug === "/") {
        return "/";
    }
    if (PAGE_SLUG_PUBLIC_PATHS[pageSlug]) {
        return PAGE_SLUG_PUBLIC_PATHS[pageSlug];
    }
    return pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`;
};

const upsertMetaTag = (html, attribute, key, content) => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matcher = new RegExp(
        `<meta[^>]*${attribute}=["']${escapedKey}["'][^>]*>`,
        "i"
    );
    const replacement = `<meta ${attribute}="${escapeHtml(
        key
    )}" content="${escapeHtml(content)}" />`;
    if (matcher.test(html)) {
        return html.replace(matcher, replacement);
    }

    return html.replace("</head>", `    ${replacement}\n  </head>`);
};

const upsertCanonicalTag = (html, canonicalUrl) => {
    const matcher = /<link[^>]*rel=["']canonical["'][^>]*>/i;
    const replacement = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
    if (matcher.test(html)) {
        return html.replace(matcher, replacement);
    }
    return html.replace("</head>", `    ${replacement}\n  </head>`);
};

const upsertTitleTag = (html, title) => {
    const escapedTitle = escapeHtml(title);
    if (/<title>.*<\/title>/i.test(html)) {
        return html.replace(/<title>.*<\/title>/i, `<title>${escapedTitle}</title>`);
    }
    return html.replace("</head>", `    <title>${escapedTitle}</title>\n  </head>`);
};

const applyRouteSeoToHtml = (indexHtml, routeSeo) => {
    const title = routeSeo.title ?? DEFAULT_SITE_TITLE;
    const description = routeSeo.description ?? DEFAULT_SITE_DESCRIPTION;
    const canonicalUrl = getCanonicalUrl(routeSeo.path);
    const image = routeSeo.image ?? DEFAULT_OG_IMAGE_URL;
    const imageAlt = routeSeo.imageAlt ?? DEFAULT_OG_IMAGE_ALT;
    const robots = routeSeo.robots;
    let html = indexHtml;

    html = upsertTitleTag(html, title);
    html = upsertMetaTag(html, "name", "description", description);
    html = upsertMetaTag(html, "property", "og:title", title);
    html = upsertMetaTag(html, "property", "og:description", description);
    html = upsertMetaTag(html, "property", "og:type", routeSeo.type ?? "website");
    html = upsertMetaTag(html, "property", "og:url", canonicalUrl);
    html = upsertMetaTag(html, "property", "og:image", image);
    html = upsertMetaTag(html, "property", "og:image:secure_url", image);
    html = upsertMetaTag(html, "property", "og:image:alt", imageAlt);
    html = upsertMetaTag(html, "name", "twitter:card", DEFAULT_TWITTER_CARD);
    html = upsertMetaTag(html, "name", "twitter:title", title);
    html = upsertMetaTag(html, "name", "twitter:description", description);
    html = upsertMetaTag(html, "name", "twitter:image", image);
    html = upsertMetaTag(html, "name", "twitter:image:alt", imageAlt);
    html = upsertCanonicalTag(html, canonicalUrl);

    if (robots) {
        html = upsertMetaTag(html, "name", "robots", robots);
        html = upsertMetaTag(html, "name", "googlebot", robots);
    }

    return html;
};

const getSanityClient = () => {
    const projectId =
        process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
    const dataset =
        process.env.VITE_SANITY_DATASET ||
        process.env.SANITY_DATASET ||
        "production";
    const apiVersion =
        process.env.VITE_SANITY_API_VERSION ||
        process.env.SANITY_API_VERSION ||
        "2024-01-01";

    if (!projectId) {
        return null;
    }

    return createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: true,
    });
};

const buildDynamicRouteSeo = async () => {
    const client = getSanityClient();
    if (!client) {
        return [];
    }

    let updates = [];
    let events = [];
    let reports = [];
    let galleries = [];
    let pressReleases = [];
    let pageContent = [];

    try {
        [updates, events, reports, galleries, pressReleases, pageContent] =
            await Promise.all([
                client.fetch(
                    `*[_type == "update" && defined(slug.current)]{
                        "slug": slug.current,
                        title,
                        excerpt,
                        type
                    }`
                ),
                client.fetch(
                    `*[_type == "event" && defined(slug.current)]{
                        "slug": slug.current,
                        title,
                        description
                    }`
                ),
                client.fetch(
                    `*[_type == "report" && defined(slug.current)]{
                        "slug": slug.current,
                        title,
                        description,
                        summary
                    }`
                ),
                client.fetch(
                    `*[_type == "gallery" && defined(slug.current)]{
                        "slug": slug.current,
                        title,
                        description
                    }`
                ),
                client.fetch(
                    `*[_type == "pressRelease" && defined(slug.current)]{
                        "slug": slug.current,
                        title,
                        content
                    }`
                ),
                client.fetch(
                    `*[_type == "pageContent" && defined(pageSlug)]{
                        pageSlug,
                        heading,
                        subheading
                    }`
                ),
            ]);
    } catch (error) {
        console.warn(
            "[seo-prerender] Unable to fetch dynamic Sanity routes. Continuing with static routes only."
        );
        return [];
    }

    const routeEntries = [];

    updates.forEach((update) => {
        const detailPath =
            update.type === "story"
                ? `/news/stories/${update.slug}`
                : `/news/${update.slug}`;
        routeEntries.push({
            path: detailPath,
            title: `${update.title} | China Coast Community`,
            description:
                update.excerpt?.slice(0, 160) ||
                `Read the latest update from China Coast Community.`,
            type: "article",
        });
    });

    events.forEach((event) => {
        routeEntries.push({
            path: `/care-community/activities-and-events/${event.slug}`,
            title: `${event.title} | China Coast Community`,
            description:
                event.description?.slice(0, 160) ||
                `Event details for ${event.title} at China Coast Community.`,
            type: "article",
        });
    });

    reports.forEach((report) => {
        routeEntries.push({
            path: `/who-we-are/publications/annual-reports/${report.slug}`,
            title: `${report.title} | China Coast Community`,
            description:
                report.summary?.slice(0, 160) ||
                report.description?.slice(0, 160) ||
                `Read the annual report ${report.title}.`,
            type: "article",
        });
    });

    galleries.forEach((gallery) => {
        routeEntries.push({
            path: `/news/media-and-press/galleries/${gallery.slug}`,
            title: `${gallery.title} | China Coast Community`,
            description:
                gallery.description?.slice(0, 160) ||
                `Explore gallery highlights from China Coast Community.`,
            type: "article",
        });
    });

    pressReleases.forEach((pressRelease) => {
        routeEntries.push({
            path: `/news/media-and-press/press-releases/${pressRelease.slug}`,
            title: `${pressRelease.title} | China Coast Community`,
            description:
                portableTextToPlainText(pressRelease.content).slice(0, 160) ||
                `Read this press release from China Coast Community.`,
            type: "article",
        });
    });

    pageContent.forEach((page) => {
        const publicPath = getPublicPathForPageSlug(page.pageSlug);
        const isAlreadyStatic = STATIC_ROUTE_SEO.some(
            (entry) => entry.path === publicPath
        );
        if (isAlreadyStatic) {
            return;
        }

        routeEntries.push({
            path: publicPath,
            title: page.heading
                ? `${page.heading} | China Coast Community`
                : `China Coast Community | Caring for Hong Kong's English-Speaking Elders`,
            description:
                page.subheading?.slice(0, 160) ||
                DEFAULT_SITE_DESCRIPTION,
        });
    });

    return routeEntries;
};

const writeRouteHtml = async (routePath, html) => {
    const safeRoutePath = normalizeRoutePath(routePath);

    if (safeRoutePath === "/") {
        await fs.writeFile(path.join(distDir, "index.html"), html, "utf-8");
        return;
    }

    const outputDir = path.join(distDir, safeRoutePath.replace(/^\/+/, ""));
    const resolvedOutputDir = path.resolve(outputDir);
    const resolvedDistDir = path.resolve(distDir);
    if (!resolvedOutputDir.startsWith(resolvedDistDir + path.sep)) {
        throw new Error(`Refusing to write outside dist directory: ${safeRoutePath}`);
    }

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, "index.html"), html, "utf-8");
};

const generate404Html = async (indexHtml) => {
    const html = applyRouteSeoToHtml(indexHtml, {
        path: "/404",
        title: "Page Not Found | China Coast Community",
        description: "The page you requested could not be found.",
        robots: "noindex, nofollow",
    });
    await fs.writeFile(path.join(distDir, "404.html"), html, "utf-8");
};

const run = async () => {
    const indexPath = path.join(distDir, "index.html");
    const indexHtml = await fs.readFile(indexPath, "utf-8");
    const dynamicRoutes = await buildDynamicRouteSeo();

    const mergedRouteMap = new Map();
    [...STATIC_ROUTE_SEO, ...dynamicRoutes].forEach((routeEntry) => {
        try {
            const safePath = normalizeRoutePath(routeEntry.path);
            mergedRouteMap.set(safePath, {
                ...routeEntry,
                path: safePath,
            });
        } catch (error) {
            console.warn(
                `[seo-prerender] Skipping unsafe route path "${routeEntry.path}".`
            );
        }
    });

    for (const routeEntry of mergedRouteMap.values()) {
        const html = applyRouteSeoToHtml(indexHtml, routeEntry);
        await writeRouteHtml(routeEntry.path, html);
    }

    await fs.writeFile(
        path.join(distDir, "seo-prerender-routes.json"),
        JSON.stringify(Array.from(mergedRouteMap.keys()), null, 2),
        "utf-8"
    );

    await generate404Html(indexHtml);
    console.log(
        `[seo-prerender] Generated metadata HTML for ${mergedRouteMap.size} routes + 404.html`
    );
};

run().catch((error) => {
    console.error("[seo-prerender] Failed:", error);
    process.exit(1);
});
