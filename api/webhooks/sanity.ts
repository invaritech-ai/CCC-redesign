import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

/**
 * Verify Sanity webhook signature
 */
function verifySignature(
    body: string,
    signature: string | undefined,
    secret: string
): boolean {
    if (!signature) {
        return false;
    }

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.warn(
                "[Sanity Webhook] SANITY_WEBHOOK_SECRET not configured. Skipping signature verification."
            );
        } else {
            // Verify webhook signature if secret is configured
            // Note: Sanity webhooks send signature in x-sanity-signature header
            // The signature is HMAC-SHA256 of the raw request body
            const signature = req.headers["x-sanity-signature"] as string | undefined;
            
            // For Vercel, we need to reconstruct the raw body
            // Since Vercel parses JSON automatically, we stringify it back
            const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

            if (!verifySignature(rawBody, signature, webhookSecret)) {
                console.error("[Sanity Webhook] Invalid signature");
                return res.status(401).json({ error: "Invalid signature" });
            }
        }

        const event = req.body;

        // Log the webhook event for debugging
        console.log("[Sanity Webhook] Received event:", {
            type: event._type,
            id: event._id,
            action: event.action || "unknown",
        });

        // Trigger Vercel cache revalidation for sitemap
        // Note: This requires Vercel's revalidation API or you can use
        // Vercel's webhook integration in the dashboard
        const getBaseUrl = (): string => {
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
        const sitemapUrl = `${getBaseUrl()}/api/sitemap.xml`;

        try {
            // Option 1: Use Vercel's revalidate API (if available)
            // This requires VERCEL_REVALIDATE_SECRET environment variable
            const revalidateSecret = process.env.VERCEL_REVALIDATE_SECRET;
            if (revalidateSecret) {
                // Trigger revalidation by calling the sitemap endpoint
                // Vercel will handle cache invalidation automatically
                await fetch(sitemapUrl, {
                    method: "GET",
                    headers: {
                        "Cache-Control": "no-cache",
                    },
                });
            }

            // Option 2: If using Vercel's webhook integration,
            // you can trigger a deployment rebuild
            // This would be configured in Vercel dashboard
        } catch (revalidateError) {
            console.error(
                "[Sanity Webhook] Error triggering revalidation:",
                revalidateError
            );
            // Don't fail the webhook if revalidation fails
        }

        return res.status(200).json({
            success: true,
            message: "Webhook processed successfully",
        });
    } catch (error) {
        console.error("[Sanity Webhook] Error processing webhook:", error);
        return res.status(500).json({
            error: "Failed to process webhook",
        });
    }
}

