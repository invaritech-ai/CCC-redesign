type RefreshPayload = {
    source: string;
    action?: string;
    type?: string;
    id?: string;
};

export const getBaseUrl = (): string => {
    if (process.env.VERCEL_ENV === "production") {
        return "https://www.chinacoastcommunity.org.hk";
    }
    if (process.env.VERCEL_URL) {
        return process.env.VERCEL_URL.startsWith("http")
            ? process.env.VERCEL_URL
            : `https://${process.env.VERCEL_URL}`;
    }
    return "https://www.chinacoastcommunity.org.hk";
};

export const warmSitemapCache = async () => {
    const sitemapUrl = `${getBaseUrl()}/api/sitemap.xml`;
    const response = await fetch(sitemapUrl, {
        method: "GET",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    if (!response.ok) {
        throw new Error(
            `Sitemap warm-up failed with status ${response.status}`
        );
    }
};

export const triggerSeoRebuild = async (payload: RefreshPayload) => {
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!deployHookUrl) {
        return { skipped: true, reason: "VERCEL_DEPLOY_HOOK_URL not configured" };
    }

    const response = await fetch(deployHookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            trigger: "sanity-seo-refresh",
            ...payload,
        }),
    });

    if (!response.ok) {
        throw new Error(`Deploy hook failed with status ${response.status}`);
    }

    return { skipped: false };
};
