import { sanityClient, isSanityConfigured } from "./sanity";

// GROQ queries for fetching content from Sanity

/**
 * Fetch featured events (upcoming, limit 2)
 */
export const getFeaturedEvents = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "event" && date >= now()] | order(date asc) [0...2] {
    _id,
    title,
    slug,
    date,
    time,
    description,
    location,
    registrationLink,
    category,
    organizer,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch recent updates (limit 1)
 */
export const getRecentUpdate = async () => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "update"] | order(publishedAt desc) [0] {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    tags,
    categories,
    "image": image.asset,
    featured
  }`;

    try {
        const updates = await sanityClient.fetch(query);
        return updates[0] || null;
    } catch (error) {
        return null;
    }
};

/**
 * Fetch featured update/story
 */
export const getFeaturedUpdate = async () => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "update" && featured == true] | order(publishedAt desc) [0] {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    tags,
    categories,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return null;
    }
};

/**
 * Fetch multiple featured updates/stories
 */
export const getFeaturedUpdates = async (limit: number = 10) => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "update" && featured == true] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    tags,
    categories,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { limit });
    } catch (error) {
        return [];
    }
};

/**
 * Fetch latest updates with limit
 */
export const getLatestUpdates = async (limit: number = 10) => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "update"] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    tags,
    categories,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { limit });
    } catch (error) {
        return [];
    }
};

/**
 * Fetch latest events with limit
 */
export const getLatestEvents = async (limit: number = 10) => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "event"] | order(date desc) [0...$limit] {
    _id,
    title,
    slug,
    date,
    time,
    description,
    location,
    registrationLink,
    category,
    organizer,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { limit });
    } catch (error) {
        return [];
    }
};

/**
 * Fetch latest testimonials with limit
 */
export const getLatestTestimonials = async (limit: number = 10) => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "testimonial"] | order(_createdAt desc) [0...$limit] {
    _id,
    quote,
    name,
    role,
    company,
    detail,
    date,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { limit });
    } catch (error) {
        return [];
    }
};

/**
 * Fetch all events
 */
export const getAllEvents = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "event"] | order(date desc) {
    _id,
    title,
    slug,
    date,
    time,
    description,
    location,
    registrationLink,
    category,
    organizer,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch event by slug
 */
export const getEventBySlug = async (slug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    time,
    description,
    location,
    registrationLink,
    category,
    organizer,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { slug });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch all updates
 */
export const getAllUpdates = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "update"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    tags,
    categories,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch all initiatives (updates with type "initiative")
 */
export const getInitiatives = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "update" && type == "initiative"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    tags,
    categories,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch stories by category (updates with category "stories")
 */
export const getStoriesByCategory = async (limit: number = 6) => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "update" && "stories" in categories] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    tags,
    categories,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { limit });
    } catch (error) {
        return [];
    }
};

/**
 * Fetch update by slug
 */
export const getUpdateBySlug = async (slug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "update" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    type,
    publishedAt,
    author,
    excerpt,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          _type,
          url,
          metadata {
            dimensions
          }
        }
      }
    },
    tags,
    categories,
    relatedEvent->{
      _id,
      title,
      slug,
      date
    },
    relatedLinks,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { slug });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch all reports
 */
export const getAllReports = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "report"] | order(year desc) {
    _id,
    title,
    slug,
    year,
    summary,
    description,
    author,
    relatedTopics,
    "pdf": pdf.asset->{
      _id,
      _type,
      url,
      originalFilename
    },
    "image": image.asset
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        console.error("Error fetching all reports:", error);
        return [];
    }
};

/**
 * Fetch report by slug
 */
export const getReportBySlug = async (slug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "report" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    year,
    summary,
    description,
    author,
    relatedTopics,
    "pdf": pdf.asset->{
      _id,
      _type,
      url,
      originalFilename
    },
    "image": image.asset
  }`;

    try {
        const result = await sanityClient.fetch(query, { slug });
        return result;
    } catch (error) {
        console.error("Error fetching report by slug:", error);
        return null;
    }
};

/**
 * Fetch all partners
 */
export const getAllPartners = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "partner"] | order(order asc) {
    _id,
    name,
    description,
    "logo": logo.asset,
    website,
    partnershipType,
    contactInfo,
    order
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch featured testimonial
 */
export const getFeaturedTestimonial = async () => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "testimonial" && featured == true] | order(_createdAt desc) [0] {
    _id,
    quote,
    name,
    role,
    company,
    detail,
    date,
    "image": image.asset,
    featured
  }`;

    try {
        const testimonials = await sanityClient.fetch(query);
        return testimonials || null;
    } catch (error) {
        return null;
    }
};

/**
 * Fetch all testimonials
 */
export const getAllTestimonials = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    quote,
    name,
    role,
    company,
    detail,
    date,
    "image": image.asset,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch all team members
 */
export const getAllTeamMembers = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    contactInfo,
    socialLinks,
    "photo": photo.asset,
    order
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch team member by ID
 */
export const getTeamMemberById = async (id: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "teamMember" && _id == $id][0] {
    _id,
    name,
    role,
    bio,
    contactInfo,
    socialLinks,
    "photo": photo.asset,
    order
  }`;

    try {
        return await sanityClient.fetch(query, { id });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch all FAQs
 */
export const getAllFAQs = async (category?: string) => {
    if (!isSanityConfigured()) return [];

    const filter = category
        ? `*[_type == "faq" && category == $category]`
        : `*[_type == "faq"]`;

    const query = `${filter} | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`;

    try {
        return await sanityClient.fetch(query, category ? { category } : {});
    } catch (error) {
        return [];
    }
};

/**
 * Fetch all resources
 */
export const getAllResources = async (category?: string) => {
    if (!isSanityConfigured()) return [];

    const filter = category
        ? `*[_type == "resource" && category == $category]`
        : `*[_type == "resource"]`;

    const query = `${filter} | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    category,
    "file": file.asset->{
      _id,
      _type,
      url,
      originalFilename,
      size,
      mimeType
    },
    featured
  }`;

    try {
        return await sanityClient.fetch(query, category ? { category } : {});
    } catch (error) {
        return [];
    }
};

/**
 * Fetch resource by slug
 */
export const getResourceBySlug = async (slug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "resource" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    category,
    "file": file.asset,
    "fileName": file.asset->originalFilename,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { slug });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch all galleries
 */
export const getAllGalleries = async (category?: string) => {
    if (!isSanityConfigured()) return [];

    const filter = category
        ? `*[_type == "gallery" && $category in categories]`
        : `*[_type == "gallery"]`;

    const query = `${filter} | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    images[]{
      "image": image.asset,
      caption,
      alt
    },
    categories,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, category ? { category } : {});
    } catch (error) {
        return [];
    }
};

/**
 * Fetch gallery by slug
 */
export const getGalleryBySlug = async (slug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "gallery" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    images[]{
      "image": image.asset,
      caption,
      alt
    },
    categories,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { slug });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch all case studies
 */
export const getAllCaseStudies = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "caseStudy"] | order(date desc) {
    _id,
    title,
    slug,
    description,
    images[]{
      "image": asset
    },
    outcomes,
    client,
    date,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch case study by slug
 */
export const getCaseStudyBySlug = async (slug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    images[]{
      "image": asset
    },
    outcomes,
    client,
    date,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { slug });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch all press releases
 */
export const getAllPressReleases = async () => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "pressRelease"] | order(date desc) {
    _id,
    title,
    slug,
    date,
    content,
    mediaLinks,
    featured
  }`;

    try {
        return await sanityClient.fetch(query);
    } catch (error) {
        return [];
    }
};

/**
 * Fetch press release by slug
 */
export const getPressReleaseBySlug = async (slug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "pressRelease" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    content,
    mediaLinks,
    featured
  }`;

    try {
        return await sanityClient.fetch(query, { slug });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch page content by page slug
 */
export const getPageContent = async (pageSlug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "pageContent" && pageSlug == $pageSlug][0] {
    _id,
    pageSlug,
    heading,
    subheading,
    content[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          _type,
          url,
          metadata {
            dimensions
          }
        }
      },
      markDefs[]{
        ...,
        _type == "link" => {
          ...,
          href
        }
      }
    },
    badgeText,
    "heroImage": heroImage.asset,
    bottomImages[]{
      "image": image.asset,
      alt
    }
  }`;

    try {
        return await sanityClient.fetch(query, { pageSlug });
    } catch (error) {
        return null;
    }
};

/**
 * Fetch form builder configuration by page slug
 */
export const getFormByPage = async (pageSlug: string) => {
    if (!isSanityConfigured()) return null;

    const query = `*[_type == "formBuilder" && pageSlug == $pageSlug][0] {
    _id,
    formName,
    formDescription,
    pageSlug,
    googleSheetUrl,
    fields[]{
      fieldName,
      fieldType,
      required,
      placeholder,
      order
    } | order(order asc)
  }`;

    try {
        return await sanityClient.fetch(query, { pageSlug });
    } catch (error) {
        return null;
    }
};

/** Minimal row for internal “related” links on detail pages */
export type RelatedListRow = {
    _id: string;
    title: string;
    slug: { current?: string };
    type?: string;
};

/**
 * Updates excluding one slug, newest first (for internal link fallbacks).
 */
export const getUpdatesExcludingSlug = async (
    excludeSlug: string,
    limit: number = 6
): Promise<RelatedListRow[]> => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "update" && slug.current != $excludeSlug] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    type
  }`;

    try {
        return (await sanityClient.fetch(query, { excludeSlug, limit })) ?? [];
    } catch {
        return [];
    }
};

/**
 * Events excluding one slug, newest first.
 */
export const getEventsExcludingSlug = async (
    excludeSlug: string,
    limit: number = 6
): Promise<RelatedListRow[]> => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "event" && slug.current != $excludeSlug] | order(date desc) [0...$limit] {
    _id,
    title,
    slug
  }`;

    try {
        return (await sanityClient.fetch(query, { excludeSlug, limit })) ?? [];
    } catch {
        return [];
    }
};

/** Events ordered by date desc, for hub/archive slices (GROQ end index is exclusive). */
export const getEventsOrderedSlice = async (
    startIdx: number,
    endIdx: number
) => {
    if (!isSanityConfigured() || endIdx <= startIdx) return [];

    const query = `*[_type == "event"] | order(date desc) [$startIdx...$endIdx] {
    _id,
    title,
    slug,
    date,
    time,
    description,
    location,
    registrationLink,
    category,
    organizer,
    "image": image.asset,
    featured
  }`;

    try {
        return (await sanityClient.fetch(query, { startIdx, endIdx })) ?? [];
    } catch {
        return [];
    }
};

export const getEventCount = async (): Promise<number> => {
    if (!isSanityConfigured()) return 0;
    try {
        const n = await sanityClient.fetch(`count(*[_type == "event"])`);
        return typeof n === "number" ? n : 0;
    } catch {
        return 0;
    }
};

export type AdjacentNeighbor = { title: string; slug: { current?: string } } | null;

/**
 * Adjacent events by calendar date (newer = more recent date).
 */
export const getEventAdjacentByDate = async (
    slug: string
): Promise<{ newer: AdjacentNeighbor; older: AdjacentNeighbor }> => {
    if (!isSanityConfigured()) {
        return { newer: null, older: null };
    }

    const currentQuery = `*[_type == "event" && slug.current == $slug][0]{ date }`;
    try {
        const row = await sanityClient.fetch<{ date?: string }>(currentQuery, {
            slug,
        });
        const date = row?.date;
        if (!date) return { newer: null, older: null };

        const newerQuery = `*[_type == "event" && date > $date] | order(date asc) [0] {
          title, slug
        }`;
        const olderQuery = `*[_type == "event" && date < $date] | order(date desc) [0] {
          title, slug
        }`;

        const [newer, older] = await Promise.all([
            sanityClient.fetch<AdjacentNeighbor>(newerQuery, { date }),
            sanityClient.fetch<AdjacentNeighbor>(olderQuery, { date }),
        ]);
        return { newer: newer ?? null, older: older ?? null };
    } catch {
        return { newer: null, older: null };
    }
};

/**
 * Adjacent reports by year (newer = higher year).
 */
export const getReportAdjacentByYear = async (
    slug: string
): Promise<{ newer: AdjacentNeighbor; older: AdjacentNeighbor }> => {
    if (!isSanityConfigured()) {
        return { newer: null, older: null };
    }

    const currentQuery = `*[_type == "report" && slug.current == $slug][0]{ year }`;
    try {
        const row = await sanityClient.fetch<{ year?: number }>(currentQuery, {
            slug,
        });
        const year = row?.year;
        if (year === undefined || year === null) {
            return { newer: null, older: null };
        }

        const newerQuery = `*[_type == "report" && year > $year] | order(year asc) [0] {
          title, slug
        }`;
        const olderQuery = `*[_type == "report" && year < $year] | order(year desc) [0] {
          title, slug
        }`;

        const [newer, older] = await Promise.all([
            sanityClient.fetch<AdjacentNeighbor>(newerQuery, { year }),
            sanityClient.fetch<AdjacentNeighbor>(olderQuery, { year }),
        ]);
        return { newer: newer ?? null, older: older ?? null };
    } catch {
        return { newer: null, older: null };
    }
};

/**
 * Adjacent press releases by date.
 */
export const getPressReleaseAdjacentByDate = async (
    slug: string
): Promise<{ newer: AdjacentNeighbor; older: AdjacentNeighbor }> => {
    if (!isSanityConfigured()) {
        return { newer: null, older: null };
    }

    const currentQuery = `*[_type == "pressRelease" && slug.current == $slug][0]{ date }`;
    try {
        const row = await sanityClient.fetch<{ date?: string }>(currentQuery, {
            slug,
        });
        const date = row?.date;
        if (!date) return { newer: null, older: null };

        const newerQuery = `*[_type == "pressRelease" && date > $date] | order(date asc) [0] {
          title, slug
        }`;
        const olderQuery = `*[_type == "pressRelease" && date < $date] | order(date desc) [0] {
          title, slug
        }`;

        const [newer, older] = await Promise.all([
            sanityClient.fetch<AdjacentNeighbor>(newerQuery, { date }),
            sanityClient.fetch<AdjacentNeighbor>(olderQuery, { date }),
        ]);
        return { newer: newer ?? null, older: older ?? null };
    } catch {
        return { newer: null, older: null };
    }
};

/**
 * Adjacent galleries by creation time.
 */
export const getGalleryAdjacentByCreatedAt = async (
    slug: string
): Promise<{ newer: AdjacentNeighbor; older: AdjacentNeighbor }> => {
    if (!isSanityConfigured()) {
        return { newer: null, older: null };
    }

    const currentQuery = `*[_type == "gallery" && slug.current == $slug][0]{ _createdAt }`;
    try {
        const row = await sanityClient.fetch<{ _createdAt?: string }>(
            currentQuery,
            { slug }
        );
        const createdAt = row?._createdAt;
        if (!createdAt) return { newer: null, older: null };

        const newerQuery = `*[_type == "gallery" && _createdAt > $createdAt] | order(_createdAt asc) [0] {
          title, slug
        }`;
        const olderQuery = `*[_type == "gallery" && _createdAt < $createdAt] | order(_createdAt desc) [0] {
          title, slug
        }`;

        const [newer, older] = await Promise.all([
            sanityClient.fetch<AdjacentNeighbor>(newerQuery, { createdAt }),
            sanityClient.fetch<AdjacentNeighbor>(olderQuery, { createdAt }),
        ]);
        return { newer: newer ?? null, older: older ?? null };
    } catch {
        return { newer: null, older: null };
    }
};

/** Galleries slice for archive pagination (newest first). */
export const getGalleriesOrderedSlice = async (
    startIdx: number,
    endIdx: number
) => {
    if (!isSanityConfigured() || endIdx <= startIdx) return [];

    const query = `*[_type == "gallery"] | order(_createdAt desc) [$startIdx...$endIdx] {
    _id,
    title,
    slug,
    description,
    images[]{
      "image": image.asset,
      caption,
      alt
    },
    categories,
    featured
  }`;

    try {
        return (await sanityClient.fetch(query, { startIdx, endIdx })) ?? [];
    } catch {
        return [];
    }
};

/** Press releases slice for archive pagination (newest first). */
export const getPressReleasesOrderedSlice = async (
    startIdx: number,
    endIdx: number
) => {
    if (!isSanityConfigured() || endIdx <= startIdx) return [];

    const query = `*[_type == "pressRelease"] | order(date desc) [$startIdx...$endIdx] {
    _id,
    title,
    slug,
    date,
    content,
    mediaLinks,
    featured
  }`;

    try {
        return (await sanityClient.fetch(query, { startIdx, endIdx })) ?? [];
    } catch {
        return [];
    }
};

export const getGalleryCount = async (): Promise<number> => {
    if (!isSanityConfigured()) return 0;
    try {
        const n = await sanityClient.fetch(`count(*[_type == "gallery"])`);
        return typeof n === "number" ? n : 0;
    } catch {
        return 0;
    }
};

export const getPressReleaseCount = async (): Promise<number> => {
    if (!isSanityConfigured()) return 0;
    try {
        const n = await sanityClient.fetch(`count(*[_type == "pressRelease"])`);
        return typeof n === "number" ? n : 0;
    } catch {
        return 0;
    }
};

/**
 * Reports excluding one slug, newest first by year.
 */
export const getReportsExcludingSlug = async (
    excludeSlug: string,
    limit: number = 6
): Promise<RelatedListRow[]> => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "report" && slug.current != $excludeSlug] | order(year desc) [0...$limit] {
    _id,
    title,
    slug
  }`;

    try {
        return (await sanityClient.fetch(query, { excludeSlug, limit })) ?? [];
    } catch {
        return [];
    }
};

/**
 * Press releases excluding one slug.
 */
export const getPressReleasesExcludingSlug = async (
    excludeSlug: string,
    limit: number = 6
): Promise<RelatedListRow[]> => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "pressRelease" && slug.current != $excludeSlug] | order(date desc) [0...$limit] {
    _id,
    title,
    slug
  }`;

    try {
        return (await sanityClient.fetch(query, { excludeSlug, limit })) ?? [];
    } catch {
        return [];
    }
};

/**
 * Galleries excluding one slug.
 */
export const getGalleriesExcludingSlug = async (
    excludeSlug: string,
    limit: number = 6
): Promise<RelatedListRow[]> => {
    if (!isSanityConfigured()) return [];

    const query = `*[_type == "gallery" && slug.current != $excludeSlug] | order(_createdAt desc) [0...$limit] {
    _id,
    title,
    slug
  }`;

    try {
        return (await sanityClient.fetch(query, { excludeSlug, limit })) ?? [];
    } catch {
        return [];
    }
};

/**
 * Fetch all content for sitemap generation
 * Returns all content types with slugs and update dates
 */
export const getAllContentForSitemap = async () => {
    if (!isSanityConfigured()) {
        return {
            updates: [],
            events: [],
            reports: [],
            galleries: [],
            pressReleases: [],
            caseStudies: [],
            pageContent: [],
        };
    }

    try {
        const [
            updates,
            events,
            reports,
            galleries,
            pressReleases,
            caseStudies,
            pageContent,
        ] = await Promise.all([
            // Updates
            sanityClient.fetch(
                `*[_type == "update"] {
                _id,
                "slug": slug.current,
                type,
                publishedAt,
                _updatedAt
            }`
            ),
            // Events
            sanityClient.fetch(
                `*[_type == "event"] {
                _id,
                "slug": slug.current,
                date,
                _updatedAt
            }`
            ),
            // Reports
            sanityClient.fetch(
                `*[_type == "report"] {
                _id,
                "slug": slug.current,
                year,
                _updatedAt
            }`
            ),
            // Galleries
            sanityClient.fetch(
                `*[_type == "gallery"] {
                _id,
                "slug": slug.current,
                _updatedAt
            }`
            ),
            // Press Releases
            sanityClient.fetch(
                `*[_type == "pressRelease"] {
                _id,
                "slug": slug.current,
                date,
                _updatedAt
            }`
            ),
            // Case Studies
            sanityClient.fetch(
                `*[_type == "caseStudy"] {
                _id,
                "slug": slug.current,
                date,
                _updatedAt
            }`
            ),
            // Page Content
            sanityClient.fetch(
                `*[_type == "pageContent"] {
                _id,
                pageSlug,
                _updatedAt
            }`
            ),
        ]);

        return {
            updates: updates || [],
            events: events || [],
            reports: reports || [],
            galleries: galleries || [],
            pressReleases: pressReleases || [],
            caseStudies: caseStudies || [],
            pageContent: pageContent || [],
        };
    } catch (error) {
        console.error("[Sitemap] Error fetching content:", error);
        return {
            updates: [],
            events: [],
            reports: [],
            galleries: [],
            pressReleases: [],
            caseStudies: [],
            pageContent: [],
        };
    }
};
