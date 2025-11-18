import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Type definitions for Sanity CMS documents
 * These match the schema definitions in sanity/schemas/
 */

export interface SanitySlug {
    current: string;
    _type: "slug";
}

export interface SanityAsset {
    _id: string;
    _type: string;
    url?: string;
    metadata?: {
        dimensions?: {
            width?: number;
            height?: number;
        };
    };
}

export interface SanityImageAsset extends SanityAsset {
    _type: "sanity.imageAsset";
}

export interface SanityFileAsset extends SanityAsset {
    _type: "sanity.fileAsset";
    originalFilename?: string;
}

export interface SanityBlock {
    _type: "block";
    style?: string;
    listItem?: "bullet" | "number";
    level?: number;
    children?: Array<{
        text: string;
        _type: string;
        marks?: string[];
    }>;
    markDefs?: Array<{
        _key: string;
        _type: string;
        href?: string;
    }>;
}

export interface SanityImageBlock {
    _type: "image";
    asset: SanityImageAsset;
    alt?: string;
}

export type SanityPortableTextBlock = SanityBlock | SanityImageBlock;

// Update / Story
export interface SanityUpdate {
    _id: string;
    title: string;
    slug?: SanitySlug;
    type?: string;
    publishedAt: string;
    author?: string;
    excerpt?: string;
    body?: SanityPortableTextBlock[];
    tags?: string[];
    categories?: string[];
    image?: SanityImageSource;
    featured?: boolean;
    relatedEvent?: {
        _id: string;
        title: string;
        slug?: SanitySlug;
        date?: string;
    };
    relatedLinks?: Array<{
        title?: string;
        url?: string;
    }>;
}

// Event
export interface SanityEvent {
    _id: string;
    title: string;
    slug?: SanitySlug;
    date: string;
    time?: string;
    description?: string;
    location?: string;
    registrationLink?: string;
    category?: string;
    organizer?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    image?: SanityImageSource;
    featured?: boolean;
}

// Report
export interface SanityReport {
    _id: string;
    title: string;
    slug?: SanitySlug;
    year?: number;
    summary?: string;
    description?: string;
    author?: string;
    relatedTopics?: string[];
    pdf?: SanityFileAsset;
    image?: SanityImageSource;
}

// Partner
export interface SanityPartner {
    _id: string;
    name: string;
    description?: string;
    logo?: SanityImageSource;
    website?: string;
    partnershipType?: string;
    contactInfo?: {
        email?: string;
        phone?: string;
        address?: string;
    };
    order?: number;
}

// Testimonial
export interface SanityTestimonial {
    _id: string;
    quote: string;
    name: string;
    role?: string;
    company?: string;
    detail?: string;
    date?: string;
    image?: SanityImageSource;
    featured?: boolean;
}

// Gallery Image
export interface SanityGalleryImage {
    image?: SanityImageSource;
    caption?: string;
    alt?: string;
}

// Gallery
export interface SanityGallery {
    _id: string;
    title: string;
    slug?: SanitySlug;
    description?: string;
    images?: SanityGalleryImage[];
    categories?: string[];
    featured?: boolean;
}

// Case Study Image
export interface SanityCaseStudyImage {
    image?: SanityImageSource;
}

// Case Study
export interface SanityCaseStudy {
    _id: string;
    title: string;
    slug?: SanitySlug;
    description?: SanityPortableTextBlock[];
    images?: SanityCaseStudyImage[];
    outcomes?: SanityPortableTextBlock[];
    client?: string;
    date?: string;
    featured?: boolean;
}

// Team Member
export interface SanityTeamMember {
    _id: string;
    name: string;
    role?: string;
    bio?: SanityPortableTextBlock[];
    contactInfo?: {
        email?: string;
        phone?: string;
    };
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    photo?: SanityImageSource;
    order?: number;
}

// Resource
export interface SanityResource {
    _id: string;
    title: string;
    slug?: SanitySlug;
    description?: string;
    category?: string;
    file?: SanityFileAsset;
    featured?: boolean;
}

// FAQ
export interface SanityFAQ {
    _id: string;
    question: string;
    answer: SanityPortableTextBlock[];
    category?: string;
    order?: number;
}

// Press Release
export interface SanityPressRelease {
    _id: string;
    title: string;
    slug?: SanitySlug;
    date?: string;
    content?: SanityPortableTextBlock[];
    mediaLinks?: Array<{
        title?: string;
        url?: string;
    }>;
    featured?: boolean;
}

// Form Field
export interface SanityFormField {
    fieldName: string;
    fieldType: "text" | "textarea" | "boolean" | "upload";
    required?: boolean;
    placeholder?: string;
    order?: number;
}

// Form Builder
export interface SanityFormBuilder {
    _id: string;
    formName: string;
    formDescription?: string;
    pageSlug: string;
    googleSheetUrl: string;
    fields?: SanityFormField[];
}

// Page Content
export interface SanityPageContent {
    _id: string;
    pageSlug: string;
    heading: string;
    subheading?: string;
    content?: SanityPortableTextBlock[];
    badgeText?: string;
}
