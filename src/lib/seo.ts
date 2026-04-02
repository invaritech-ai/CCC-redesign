export const CANONICAL_BASE_URL = "https://www.chinacoastcommunity.org.hk";

export const DEFAULT_SITE_TITLE =
    "China Coast Community | Caring for Hong Kong's English-Speaking Elders";

export const DEFAULT_SITE_DESCRIPTION =
    "Since 1978, China Coast Community has cared for Hong Kong's English-speaking elders. Support the redevelopment of a safer, modern home where every senior is valued.";

export const DEFAULT_SITE_URL = `${CANONICAL_BASE_URL}/`;

// Bump when replacing the share image; keep `?v=` in index.html og/twitter meta in sync.
const DEFAULT_OG_IMAGE_VERSION = "2026-04";

export const DEFAULT_OG_IMAGE_URL = `${CANONICAL_BASE_URL}/og-image-ccc.jpg?v=${DEFAULT_OG_IMAGE_VERSION}`;

export const DEFAULT_OG_IMAGE_ALT =
    "China Coast Community social sharing image featuring the CCC name and redevelopment message.";

export const DEFAULT_OG_IMAGE_WIDTH = "1200";
export const DEFAULT_OG_IMAGE_HEIGHT = "630";

const PAGE_SLUG_PUBLIC_PATHS: Record<string, string> = {
    team: "/who-we-are/team",
    volunteer: "/get-involved/volunteer",
    "support/donate": "/donate",
    updates: "/news",
};

interface SeoOptions {
    title?: string;
    description?: string;
    url?: string;
    type?: string;
    image?: string;
    imageAlt?: string;
    robots?: string;
}

const updateMetaTag = (
    name: string,
    content: string,
    isProperty = false
) => {
    const attribute = isProperty ? "property" : "name";
    let element = document.querySelector(
        `meta[${attribute}="${name}"]`
    ) as HTMLMetaElement | null;

    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
    }

    element.content = content;
};

const removeMetaTag = (name: string, isProperty = false) => {
    const attribute = isProperty ? "property" : "name";
    document
        .querySelectorAll(`meta[${attribute}="${name}"]`)
        .forEach((element) => element.remove());
};

const updateCanonicalLink = (href: string) => {
    let canonicalLink = document.querySelector(
        'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = href;
};

const updateRobotsMeta = (robots?: string) => {
    if (!robots) {
        removeMetaTag("robots");
        removeMetaTag("googlebot");
        return;
    }

    updateMetaTag("robots", robots);
    updateMetaTag("googlebot", robots);
};

export const getPublicPathForPageSlug = (pageSlug: string) => {
    if (!pageSlug || pageSlug === "/") {
        return "/";
    }

    if (PAGE_SLUG_PUBLIC_PATHS[pageSlug]) {
        return PAGE_SLUG_PUBLIC_PATHS[pageSlug];
    }

    return pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`;
};

export const getCanonicalUrl = (path: string) => {
    const normalizedPath = !path || path === "/"
        ? "/"
        : `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;

    return normalizedPath === "/"
        ? DEFAULT_SITE_URL
        : `${CANONICAL_BASE_URL}${normalizedPath}`;
};

export const applySeo = ({
    title = DEFAULT_SITE_TITLE,
    description = DEFAULT_SITE_DESCRIPTION,
    url = DEFAULT_SITE_URL,
    type = "website",
    image = DEFAULT_OG_IMAGE_URL,
    imageAlt = DEFAULT_OG_IMAGE_ALT,
    robots,
}: SeoOptions = {}) => {
    document.title = title;

    updateMetaTag("description", description);

    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:site_name", "China Coast Community", true);
    updateMetaTag("og:locale", "en_HK", true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:image:secure_url", image, true);
    const imageLower = image.split("?")[0].toLowerCase();
    const ogMime = imageLower.endsWith(".png")
        ? "image/png"
        : imageLower.endsWith(".webp")
          ? "image/webp"
          : imageLower.endsWith(".gif")
            ? "image/gif"
            : "image/jpeg";
    updateMetaTag("og:image:type", ogMime, true);
    updateMetaTag("og:image:alt", imageAlt, true);
    updateMetaTag("og:image:width", DEFAULT_OG_IMAGE_WIDTH, true);
    updateMetaTag("og:image:height", DEFAULT_OG_IMAGE_HEIGHT, true);

    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:image:alt", imageAlt);

    updateRobotsMeta(robots);
    updateCanonicalLink(url);
};
