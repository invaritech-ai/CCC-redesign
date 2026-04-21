import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "..", "dist");

const checks = [
    { route: "/", file: "index.html", expectedCanonical: "https://www.chinacoastcommunity.org.hk/" },
    {
        route: "/who-we-are/about",
        file: "who-we-are/about/index.html",
        expectedCanonical: "https://www.chinacoastcommunity.org.hk/who-we-are/about",
    },
    {
        route: "/news",
        file: "news/index.html",
        expectedCanonical: "https://www.chinacoastcommunity.org.hk/news",
    },
    {
        route: "/care-community/activities-and-events",
        file: "care-community/activities-and-events/index.html",
        expectedCanonical:
            "https://www.chinacoastcommunity.org.hk/care-community/activities-and-events",
    },
    {
        route: "/care-community/activities-and-events/archive",
        file: "care-community/activities-and-events/archive/index.html",
        expectedCanonical:
            "https://www.chinacoastcommunity.org.hk/care-community/activities-and-events/archive",
    },
    {
        route: "/news/media-and-press/galleries/archive",
        file: "news/media-and-press/galleries/archive/index.html",
        expectedCanonical:
            "https://www.chinacoastcommunity.org.hk/news/media-and-press/galleries/archive",
    },
    {
        route: "/news/media-and-press/press-releases/archive",
        file: "news/media-and-press/press-releases/archive/index.html",
        expectedCanonical:
            "https://www.chinacoastcommunity.org.hk/news/media-and-press/press-releases/archive",
    },
    {
        route: "/404",
        file: "404.html",
        expectedCanonical: "https://www.chinacoastcommunity.org.hk/404",
        expectedRobots: "noindex, nofollow",
    },
];

const toHtmlPath = (route) =>
    route === "/" ? "index.html" : `${route.replace(/^\/+/, "")}/index.html`;

const mustContain = (html, regex, message) => {
    if (!regex.test(html)) {
        throw new Error(message);
    }
};

const main = async () => {
    for (const check of checks) {
        const filePath = path.join(distDir, check.file);
        const html = await fs.readFile(filePath, "utf-8");

        mustContain(html, /<title>.+<\/title>/i, `${check.route}: missing <title>`);
        mustContain(
            html,
            /<meta name="description" content="[^"]+"/i,
            `${check.route}: missing meta description`
        );
        mustContain(
            html,
            /<meta property="og:title" content="[^"]+"/i,
            `${check.route}: missing og:title`
        );
        mustContain(
            html,
            /<meta name="twitter:title" content="[^"]+"/i,
            `${check.route}: missing twitter:title`
        );
        mustContain(
            html,
            new RegExp(
                `<link rel="canonical" href="${check.expectedCanonical.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                )}"`,
                "i"
            ),
            `${check.route}: canonical mismatch`
        );

        if (check.expectedRobots) {
            mustContain(
                html,
                new RegExp(
                    `<meta name="robots" content="${check.expectedRobots}"`,
                    "i"
                ),
                `${check.route}: missing expected robots directive`
            );
        }
    }

    const manifestPath = path.join(distDir, "seo-prerender-routes.json");
    const manifestRaw = await fs.readFile(manifestPath, "utf-8");
    const routeManifest = JSON.parse(manifestRaw);
    if (!Array.isArray(routeManifest) || routeManifest.length === 0) {
        throw new Error("seo-prerender-routes.json is missing route entries");
    }

    for (const route of routeManifest.slice(0, 10)) {
        const htmlPath = path.join(distDir, toHtmlPath(route));
        const html = await fs.readFile(htmlPath, "utf-8");
        mustContain(
            html,
            /<link rel="canonical" href="https:\/\/www\.chinacoastcommunity\.org\.hk/i,
            `${route}: missing canonical in generated prerender file`
        );
    }

    console.log("SEO HTML verification checks passed.");
};

main().catch((error) => {
    console.error("SEO HTML verification failed:", error.message);
    process.exit(1);
});
