/**
 * Admin API Client
 * Functions to interact with backend API from admin dashboard
 */

import { toast } from "sonner";

const API_BASE = "/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Base fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// Projects API
// ============================================

export const projectsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    stack?: string;
  }) => fetchAPI("/projects", { params }),

  getBySlug: (slug: string) => fetchAPI(`/projects/${slug}`),

  create: (data: unknown) =>
    fetchAPI("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: unknown) =>
    fetchAPI(`/projects/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (slug: string) =>
    fetchAPI(`/projects/${slug}`, {
      method: "DELETE",
    }),
};

// ============================================
// Experience API
// ============================================

export const experienceAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    fetchAPI("/experience", { params }),

  getBySlug: (slug: string) => fetchAPI(`/experience/${slug}`),

  create: (data: unknown) =>
    fetchAPI("/experience", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: unknown) =>
    fetchAPI(`/experience/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (slug: string) =>
    fetchAPI(`/experience/${slug}`, {
      method: "DELETE",
    }),
};

// ============================================
// Tech Stack API
// ============================================

export const techAPI = {
  getAll: (params?: { category?: string }): Promise<unknown[]> =>
    fetchAPI<unknown[]>("/tech", { params }),

  create: (data: unknown): Promise<unknown> =>
    fetchAPI<unknown>("/tech", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (key: string, data: unknown): Promise<unknown> =>
    fetchAPI<unknown>("/tech", {
      method: "PATCH",
      params: { key },
      body: JSON.stringify(data),
    }),

  delete: (key: string): Promise<unknown> =>
    fetchAPI<unknown>("/tech", {
      method: "DELETE",
      params: { key },
    }),
};

// ============================================
// Sections API
// ============================================

export const sectionsAPI = {
  getAll: () => fetchAPI("/sections"),

  getByKey: (key: string) => fetchAPI("/sections", { params: { key } }),

  update: (data: unknown) =>
    fetchAPI("/sections", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ============================================
// Contact Messages API
// ============================================

export const messagesAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    fetchAPI("/contact", { params }),
};

// ============================================
// Toast Helpers
// ============================================

export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showLoadingToast(message: string) {
  return toast.loading(message);
}
