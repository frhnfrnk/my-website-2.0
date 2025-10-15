/**
 * Admin API Client
 * Functions to interact with backend API from admin dashboard
 */

import { toast } from "sonner";

const API_BASE = "/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// API Response Types
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SingleResponse<T> {
  data: T;
  message?: string;
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
  }) => fetchAPI<PaginatedResponse<unknown>>("/projects", { params }),

  getBySlug: (slug: string) =>
    fetchAPI<SingleResponse<unknown>>(`/projects/${slug}`),

  create: (data: unknown) =>
    fetchAPI<SingleResponse<unknown>>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: unknown) =>
    fetchAPI<SingleResponse<unknown>>(`/projects/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (slug: string) =>
    fetchAPI<{ message: string }>(`/projects/${slug}`, {
      method: "DELETE",
    }),
};

// ============================================
// Experience API
// ============================================

export const experienceAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    fetchAPI<PaginatedResponse<unknown>>("/experience", { params }),

  getBySlug: (slug: string) =>
    fetchAPI<SingleResponse<unknown>>(`/experience/${slug}`),

  create: (data: unknown) =>
    fetchAPI<SingleResponse<unknown>>("/experience", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: unknown) =>
    fetchAPI<SingleResponse<unknown>>(`/experience/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (slug: string) =>
    fetchAPI<{ message: string }>(`/experience/${slug}`, {
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
  getAll: () => fetchAPI<{ data: unknown[] }>("/sections"),

  getByKey: (key: string) =>
    fetchAPI<SingleResponse<unknown>>("/sections", { params: { key } }),

  update: (data: unknown) =>
    fetchAPI<SingleResponse<unknown>>("/sections", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ============================================
// Contact Messages API
// ============================================

export const messagesAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    fetchAPI<PaginatedResponse<unknown>>("/contact", { params }),
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
