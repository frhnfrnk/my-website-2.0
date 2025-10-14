/**
 * API Client Functions
 * Server-side fetch functions for Next.js Server Components
 * Use these in your page.tsx or layout.tsx files
 */

import { CACHE_TAGS } from "./tags";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ============================================
// Projects API
// ============================================

export async function getProjects(params?: {
  featured?: boolean;
  stack?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.featured) searchParams.set("featured", "true");
  if (params?.stack) searchParams.set("stack", params.stack);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const url = `${API_BASE_URL}/api/projects?${searchParams.toString()}`;

  const res = await fetch(url, {
    next: {
      tags: [CACHE_TAGS.PROJECTS],
      revalidate: 60, // Revalidate every 60 seconds
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export async function getProjectBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/api/projects/${slug}`, {
    next: {
      tags: [CACHE_TAGS.PROJECT_DETAIL(slug)],
      revalidate: 300, // 5 minutes
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

// ============================================
// Experience API
// ============================================

export async function getExperience(params?: {
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const url = `${API_BASE_URL}/api/experience?${searchParams.toString()}`;

  const res = await fetch(url, {
    next: {
      tags: [CACHE_TAGS.EXPERIENCE],
      revalidate: 120, // 2 minutes
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch experience");
  }

  return res.json();
}

export async function getExperienceBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/api/experience/${slug}`, {
    next: {
      tags: [CACHE_TAGS.EXPERIENCE_DETAIL(slug)],
      revalidate: 300,
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

// ============================================
// Tech Stack API
// ============================================

export async function getTechStack(category?: string) {
  const searchParams = new URLSearchParams();
  if (category) searchParams.set("category", category);

  const url = `${API_BASE_URL}/api/tech?${searchParams.toString()}`;

  const res = await fetch(url, {
    next: {
      tags: [CACHE_TAGS.TECH],
      revalidate: 600, // 10 minutes
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tech stack");
  }

  return res.json();
}

// ============================================
// Sections API
// ============================================

export async function getSection(key: "hero" | "about" | "contact") {
  const res = await fetch(`${API_BASE_URL}/api/sections?key=${key}`, {
    next: {
      tags: [CACHE_TAGS.SECTION_DETAIL(key)],
      revalidate: 300,
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function getAllSections() {
  const res = await fetch(`${API_BASE_URL}/api/sections`, {
    next: {
      tags: [CACHE_TAGS.SECTIONS],
      revalidate: 300,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sections");
  }

  return res.json();
}

// ============================================
// Contact API (Client-side only)
// ============================================

export async function submitContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to send message");
  }

  return result;
}

// ============================================
// Example Usage in Server Component
// ============================================

/*
// app/page.tsx
import { getProjects, getTechStack, getSection } from '@/lib/api-client';

export default async function HomePage() {
  // Fetch data in parallel
  const [projectsData, techData, heroData] = await Promise.all([
    getProjects({ featured: true, limit: 6 }),
    getTechStack(),
    getSection('hero'),
  ]);

  return (
    <div>
      <Hero data={heroData.data} />
      <Projects data={projectsData.data} />
      <TechStack data={techData.data} />
    </div>
  );
}

// app/projects/page.tsx
import { getProjects } from '@/lib/api-client';

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { page?: string; stack?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const stack = searchParams.stack;

  const { data, pagination } = await getProjects({ page, stack });

  return (
    <div>
      <ProjectsList projects={data} />
      <Pagination {...pagination} />
    </div>
  );
}
*/
