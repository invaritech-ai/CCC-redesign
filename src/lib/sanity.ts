import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';
const useCdn = import.meta.env.PROD; // Use CDN in production

if (!projectId) {
  console.warn('Sanity project ID is not configured. Please set VITE_SANITY_PROJECT_ID in your .env.local file.');
}

export const sanityClient = createClient({
  projectId: projectId || '',
  dataset,
  apiVersion,
  useCdn,
  // Set to false if you want to ensure fresh data in development
});

// Helper function to check if Sanity is configured
export const isSanityConfigured = () => {
  return !!projectId;
};

