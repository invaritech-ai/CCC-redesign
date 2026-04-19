import type { VercelRequest, VercelResponse } from "@vercel/node";
import { triggerSeoRebuild, warmSitemapCache } from "./lib/seo-refresh.js";

const isAuthorized = (req: VercelRequest) => {
    const secret = process.env.VERCEL_REVALIDATE_SECRET;
    if (!secret) {
        return false;
    }

    const headerSecret = req.headers["x-revalidate-secret"];
    const querySecret = req.query.secret;

    if (typeof headerSecret === "string" && headerSecret === secret) {
        return true;
    }

    if (typeof querySecret === "string" && querySecret === secret) {
        return true;
    }

    return false;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        await warmSitemapCache();
        const rebuildResult = await triggerSeoRebuild({
            source: "manual-revalidate-endpoint",
            action: "triggered",
        });

        return res.status(200).json({
            success: true,
            message: "SEO revalidation completed.",
            rebuild: rebuildResult,
        });
    } catch (error) {
        console.error("[SEO Revalidate] Failed:", error);
        return res.status(500).json({
            success: false,
            error: "SEO revalidation failed",
        });
    }
}
