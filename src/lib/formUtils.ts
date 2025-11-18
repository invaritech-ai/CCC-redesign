/**
 * Maps route pathname to pageSlug format used in Sanity formBuilder
 * @param pathname - The route pathname (e.g., "/about", "/support/donate")
 * @returns The pageSlug string (e.g., "about", "support/donate", "" for home)
 */
export const getPageSlugFromPath = (pathname: string): string => {
  // Remove leading slash
  const slug = pathname.replace(/^\//, "");
  
  // Return empty string for home page
  if (slug === "") {
    return "";
  }
  
  return slug;
};

