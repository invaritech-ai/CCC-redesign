import { sanityClient, isSanityConfigured } from './sanity';

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
    description,
    location,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching events:', error);
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
    publishedAt,
    excerpt,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    const updates = await sanityClient.fetch(query);
    return updates[0] || null;
  } catch (error) {
    console.error('Error fetching recent update:', error);
    return null;
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
    description,
    location,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching all events:', error);
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
    description,
    location,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching event by slug:', error);
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
    publishedAt,
    excerpt,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching updates:', error);
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
    publishedAt,
    excerpt,
    body,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching update by slug:', error);
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
    description,
    "pdfUrl": pdf.asset->url,
    "imageUrl": image.asset->url
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching reports:', error);
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
    description,
    "pdfUrl": pdf.asset->url,
    "imageUrl": image.asset->url
  }`;
  
  try {
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching report by slug:', error);
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
    "logoUrl": logo.asset->url,
    website,
    order
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching partners:', error);
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
    detail,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    const testimonials = await sanityClient.fetch(query);
    return testimonials || null;
  } catch (error) {
    console.error('Error fetching featured testimonial:', error);
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
    detail,
    "imageUrl": image.asset->url,
    featured
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

