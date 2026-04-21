import { CANONICAL_BASE_URL } from "@/lib/seo";
import { getPublicPathForPageSlug } from "@/lib/seo";

export type BreadcrumbItem = { label: string; href?: string };

export function getSlugValue(
    slug?: { current?: string } | string | null
): string | undefined {
    if (!slug) return undefined;
    if (typeof slug === "string") return slug;
    return slug.current ?? undefined;
}

/** Path for an update or case study detail URL. */
export function getUpdateDetailPath(
    slug: string | undefined,
    opts: { isCaseStudy?: boolean; type?: string | null }
): string {
    if (!slug) return "/news";
    if (opts.isCaseStudy || opts.type === "story") {
        return `/news/stories/${slug}`;
    }
    return `/news/${slug}`;
}

export function isInternalSiteUrl(href: string): boolean {
    const trimmed = href.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
    try {
        const u = new URL(trimmed, CANONICAL_BASE_URL);
        const base = new URL(CANONICAL_BASE_URL);
        return u.hostname === base.hostname;
    } catch {
        return false;
    }
}

/** Returns pathname + search for same-site URLs; otherwise null. */
export function toInternalPath(href: string): string | null {
    if (!isInternalSiteUrl(href)) return null;
    const trimmed = href.trim();
    if (trimmed.startsWith("/")) {
        return trimmed.split("#")[0] || "/";
    }
    try {
        const u = new URL(trimmed);
        return `${u.pathname}${u.search}` || "/";
    } catch {
        return null;
    }
}

export function buildCmsPageBreadcrumbs(
    pageSlug: string,
    pageTitle: string
): BreadcrumbItem[] {
    const path = getPublicPathForPageSlug(pageSlug);
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
    const parts = path.split("/").filter(Boolean);

    if (parts[0] === "who-we-are") {
        items.push({ label: "Who we are", href: "/who-we-are/about" });
    } else if (parts[0] === "care-community") {
        items.push({
            label: "Care community",
            href: "/care-community/community-members-programme",
        });
    } else if (parts[0] === "donate") {
        items.push({ label: "Donate", href: "/donate" });
    } else if (parts[0] === "get-involved") {
        items.push({
            label: "Get involved",
            href: "/get-involved/volunteer",
        });
    }

    items.push({ label: pageTitle });
    return items;
}

/** Disambiguate duplicate titles when slug encodes a year (e.g. recurring events). */
export function disambiguateTitleWithSlugYear(
    title: string,
    slug: string | undefined
): string {
    if (!slug) return title;
    const m = slug.match(/-(20\d{2})$/);
    if (!m) return title;
    const year = m[1];
    if (title.includes(year)) return title;
    return `${title} (${year})`;
}

export type InternalNavLink = { title: string; to: string };

/** Dedupe by `to`, preserve order, cap list length. */
export function mergeDedupeInternalLinks(
    links: InternalNavLink[],
    max: number = 8
): InternalNavLink[] {
    const seen = new Set<string>();
    const out: InternalNavLink[] = [];
    for (const l of links) {
        if (!l.to || seen.has(l.to)) continue;
        seen.add(l.to);
        out.push(l);
        if (out.length >= max) break;
    }
    return out;
}
