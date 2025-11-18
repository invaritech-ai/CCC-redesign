import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01";

// Use CDN for better performance and caching
// Sanity's CDN uses necessary cookies (sanitySession) for performance optimization
// These cookies do not store personal information and are essential for the service
const useCdn = true;

export const sanityClient = createClient({
    projectId: projectId || "",
    dataset,
    apiVersion,
    useCdn,
});

// Helper function to check if Sanity is configured
export const isSanityConfigured = () => {
    return !!projectId;
};
