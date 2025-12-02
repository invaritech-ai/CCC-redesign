import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local in local development
if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "development") {
    config({ path: resolve(process.cwd(), ".env.local") });
}

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

// Use CDN for better performance and caching
const useCdn = true;

export const sanityServerClient = createClient({
    projectId: projectId || "",
    dataset,
    apiVersion,
    useCdn,
});

// Helper function to check if Sanity is configured
export const isSanityConfiguredServer = () => {
    return !!projectId;
};



