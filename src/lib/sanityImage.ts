import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "./sanity";

// Create a builder instance configured to use API endpoint (not CDN)
// Since sanityClient has useCdn: false, images will be served from api.sanity.io
// This prevents third-party cookies from cdn.sanity.io
const builder = imageUrlBuilder(sanityClient);

/**
 * Build a Sanity image URL using the official image URL builder
 * This uses the API endpoint instead of CDN to avoid third-party cookies
 *
 * @param source - Image reference from Sanity (can be asset object or reference)
 * @returns Image URL builder instance for chaining transformations
 */
export const urlFor = (source: SanityImageSource | null | undefined) => {
    if (!source) return null;

    // Build URL using API endpoint
    // The builder respects the useCdn: false setting in sanityClient
    return builder.image(source);
};

/**
 * Get a Sanity image URL string with optional transformations
 *
 * @param source - Image reference from Sanity (can be asset object or reference)
 * @param options - Optional image transformation options
 * @returns Image URL string or null if source is invalid
 */
export const getImageUrl = (
    source: SanityImageSource | null | undefined,
    options?: {
        width?: number;
        height?: number;
        format?: "webp" | "jpg" | "png";
        quality?: number;
        fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
        crop?: { left: number; top: number; right: number; bottom: number };
    }
): string | null => {
    if (!source) return null;

    const url = urlFor(source);
    if (!url) return null;

    // Apply transformations if provided
    if (options) {
        let imageUrl = url;

        if (options.width) {
            imageUrl = imageUrl.width(options.width);
        }

        if (options.height) {
            imageUrl = imageUrl.height(options.height);
        }

        if (options.format) {
            imageUrl = imageUrl.format(options.format);
        }

        if (options.quality) {
            imageUrl = imageUrl.quality(options.quality);
        }

        if (options.fit) {
            imageUrl = imageUrl.fit(options.fit);
        }

        if (options.crop) {
            imageUrl = imageUrl.rect(
                options.crop.left,
                options.crop.top,
                options.crop.right - options.crop.left,
                options.crop.bottom - options.crop.top
            );
        }

        return imageUrl.url();
    }

    return url.url();
};

/**
 * Get image URL from legacy format (when queries return imageUrl string)
 * This is a fallback for backward compatibility during migration
 */
export const getImageUrlFromString = (
    url: string | undefined | null
): string | null => {
    if (!url) return null;

    // Replace CDN domain with API domain to avoid cookies
    // This handles legacy queries that return imageUrl strings
    return url.replace(/cdn\.sanity\.io/g, "api.sanity.io");
};
