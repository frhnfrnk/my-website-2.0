/**
 * Zod Validation Schemas
 * Used for validating API request bodies
 */

import { z } from "zod";

// ============================================
// Project Validation
// ============================================

export const ProjectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  description: z.string().min(1),
  stack: z.array(z.string()).min(1),
  cover: z.string().url().optional().or(z.literal("")),
  links: z.object({
    demo: z.string().url().optional().or(z.literal("")),
    repo: z.string().url().optional().or(z.literal("")),
  }),
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  publishedAt: z.string().datetime().optional(),
});

export const ProjectUpdateSchema = ProjectSchema.partial();

// ============================================
// Experience Validation
// ============================================

export const ExperienceSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  period: z.object({
    from: z.string().regex(/^\d{4}-\d{2}$/, "Period format must be YYYY-MM"),
    to: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Period format must be YYYY-MM")
      .optional(),
  }),
  location: z.string().max(200).optional().or(z.literal("")),
  bullets: z.array(z.string()).min(1),
  stack: z.array(z.string()).min(1),
  link: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
});

export const ExperienceUpdateSchema = ExperienceSchema.partial();

// ============================================
// Tech Validation
// ============================================

export const TechSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Key must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1).max(100),
  category: z.enum([
    "language",
    "frontend",
    "backend",
    "database",
    "devops",
    "tool",
    "other",
  ]),
  website: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
});

export const TechUpdateSchema = TechSchema.partial();

// ============================================
// Section Validation
// ============================================

export const SectionSchema = z.object({
  key: z.enum(["hero", "about", "contact"]),
  title: z.string().max(200).optional().or(z.literal("")),
  subtitle: z.string().max(500).optional().or(z.literal("")),
  body: z.string().optional().or(z.literal("")),
});

export const SectionUpdateSchema = SectionSchema.partial().refine(
  (data) => data.key !== undefined,
  { message: "Key is required for section updates" }
);

// ============================================
// Contact Message Validation
// ============================================

export const ContactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(2000),
});

// ============================================
// User/Admin Validation
// ============================================

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["admin"]).default("admin"),
});

// ============================================
// Query Parameter Validation
// ============================================

export const ProjectQuerySchema = z.object({
  featured: z.enum(["true", "false"]).optional(),
  stack: z.string().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export const ExperienceQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export const TechQuerySchema = z.object({
  category: z
    .enum([
      "language",
      "frontend",
      "backend",
      "database",
      "devops",
      "tool",
      "other",
    ])
    .optional(),
});
