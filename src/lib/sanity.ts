import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01";
// const useCdn = import.meta.env.PROD; // Use CDN in production
// Disable CDN to avoid third-party cookies for better privacy compliance
// CDN is mainly beneficial for high-traffic sites with frequent content updates
// For a community website, direct API access is sufficient and more privacy-friendly
const useCdn = false;

if (!projectId) {
    console.warn(
        "Sanity project ID is not configured. Please set VITE_SANITY_PROJECT_ID in your .env.local file."
    );
}

export const sanityClient = createClient({
    projectId: projectId || "",
    dataset,
    apiVersion,
    useCdn,
    // Set to false if you want to ensure fresh data in development
    // Note: Sanity CDN may set third-party cookies (sanitySession) for session management
    // These cookies are set by Sanity's CDN, not our application code
    // To minimize cookie usage, consider using Sanity's API directly (useCdn: false) in production
    // or configure SameSite attributes at the CDN level if you have access to Sanity project settings
});

// Helper function to check if Sanity is configured
export const isSanityConfigured = () => {
    return !!projectId;
};
