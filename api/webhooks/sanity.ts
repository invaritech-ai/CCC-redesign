import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { triggerSeoRebuild, warmSitemapCache } from "../lib/seo-refresh.js";

export const config = {
    api: {
        bodyParser: false,
    },
};

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

    if (signature.length !== expectedSignature.length) {
        return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

async function readRawBody(req: VercelRequest): Promise<string> {
    if (typeof req.body === "string") {
        return req.body;
    }

    if (Buffer.isBuffer(req.body)) {
        return req.body.toString("utf8");
    }

    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const rawBody = await readRawBody(req);
        if (!rawBody) {
            return res.status(400).json({ error: "Empty webhook payload" });
        }

        const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            if (process.env.VERCEL_ENV === "production") {
                console.error(
                    "[Sanity Webhook] SANITY_WEBHOOK_SECRET must be configured in production."
                );
                return res.status(500).json({
                    error: "Webhook secret not configured",
                });
            }

            console.warn(
                "[Sanity Webhook] SANITY_WEBHOOK_SECRET not configured. Allowing webhook only in non-production environments."
            );
        } else {
            const sharedSecret = req.headers["x-webhook-secret"] as
                | string
                | undefined;

            if (sharedSecret && sharedSecret === webhookSecret) {
                // Shared secret header auth passed.
            } else {
                const signature = req.headers["x-sanity-signature"] as
                    | string
                    | undefined;
                if (
                    !verifySignature(
                        rawBody,
                        signature,
                        webhookSecret
                    )
                ) {
                    console.error("[Sanity Webhook] Invalid signature");
                    return res.status(401).json({ error: "Invalid signature" });
                }
            }
        }

        let event: Record<string, unknown>;
        try {
            event = JSON.parse(rawBody);
        } catch {
            return res.status(400).json({ error: "Invalid JSON payload" });
        }

        // Log the webhook event for debugging
        console.log("[Sanity Webhook] Received event:", {
            type: event["_type"],
            id: event["_id"],
            action: event["action"] || "unknown",
        });

        // Trigger sitemap cache warm-up and optional rebuild so prerendered SEO HTML stays fresh.
        try {
            await warmSitemapCache();
        } catch (warmError) {
            console.error(
                "[Sanity Webhook] Error warming sitemap cache:",
                warmError
            );
        }

        try {
            await triggerSeoRebuild({
                source: "sanity-webhook",
                action: String(event["action"] || "unknown"),
                type: String(event["_type"] || "unknown"),
                id: String(event["_id"] || ""),
            });
        } catch (rebuildError) {
            console.error(
                "[Sanity Webhook] Error triggering SEO rebuild:",
                rebuildError
            );
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

