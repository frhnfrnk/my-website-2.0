/**
 * Revalidation Tags for Next.js Cache
 * Used with revalidateTag() to invalidate cache after mutations
 */

export const CACHE_TAGS = {
  PROJECTS: "projects",
  PROJECT_DETAIL: (slug: string) => `project-${slug}` as const,
  EXPERIENCE: "experience",
  EXPERIENCE_DETAIL: (slug: string) => `experience-${slug}` as const,
  TECH: "tech",
  SECTIONS: "sections",
  SECTION_DETAIL: (key: string) => `section-${key}` as const,
  CONTACT: "contact",
};

/**
 * Helper to generate all related tags for revalidation
 */
export function getProjectTags(slug?: string): string[] {
  const tags = [CACHE_TAGS.PROJECTS];
  if (slug) {
    tags.push(CACHE_TAGS.PROJECT_DETAIL(slug));
  }
  return tags;
}

export function getExperienceTags(slug?: string): string[] {
  const tags = [CACHE_TAGS.EXPERIENCE];
  if (slug) {
    tags.push(CACHE_TAGS.EXPERIENCE_DETAIL(slug));
  }
  return tags;
}

export function getSectionTags(key?: string): string[] {
  const tags = [CACHE_TAGS.SECTIONS];
  if (key) {
    tags.push(CACHE_TAGS.SECTION_DETAIL(key));
  }
  return tags;
}
