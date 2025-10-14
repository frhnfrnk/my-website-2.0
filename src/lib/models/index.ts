/**
 * Mongoose Models for Portfolio Backend
 */

import mongoose, { Schema, Model } from "mongoose";

// ============================================
// TypeScript Interfaces
// ============================================

export interface IProject {
  slug: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  cover?: string;
  links: {
    demo?: string;
    repo?: string;
  };
  featured?: boolean;
  order?: number;
  publishedAt: Date;
  updatedAt: Date;
}

export interface IExperience {
  slug: string;
  company: string;
  role: string;
  period: {
    from: string; // e.g., "2023-01"
    to?: string; // e.g., "2024-06" or undefined if current
  };
  location?: string;
  bullets: string[];
  stack: string[];
  link?: string;
  order?: number;
  updatedAt: Date;
}

export interface ITech {
  key: string; // unique identifier, e.g., "nextjs"
  name: string; // display name, e.g., "Next.js"
  category:
    | "language"
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "tool"
    | "other";
  website?: string;
  order?: number;
}

export interface ISection {
  key: "hero" | "about" | "contact";
  title?: string;
  subtitle?: string;
  body?: string;
  updatedAt: Date;
}

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface IUser {
  email: string;
  passwordHash: string;
  role: "admin";
  createdAt: Date;
}

// ============================================
// Mongoose Schemas
// ============================================

const ProjectSchema = new Schema<IProject>({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  stack: { type: [String], required: true },
  cover: { type: String },
  links: {
    demo: { type: String },
    repo: { type: String },
  },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  publishedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ExperienceSchema = new Schema<IExperience>({
  slug: { type: String, required: true, unique: true, index: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  period: {
    from: { type: String, required: true },
    to: { type: String },
  },
  location: { type: String },
  bullets: { type: [String], required: true },
  stack: { type: [String], required: true },
  link: { type: String },
  order: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const TechSchema = new Schema<ITech>({
  key: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "language",
      "frontend",
      "backend",
      "database",
      "devops",
      "tool",
      "other",
    ],
  },
  website: { type: String },
  order: { type: Number, default: 0 },
});

const SectionSchema = new Schema<ISection>({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ["hero", "about", "contact"],
    index: true,
  },
  title: { type: String },
  subtitle: { type: String },
  body: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const ContactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, default: "admin", enum: ["admin"] },
  createdAt: { type: Date, default: Date.now },
});

// ============================================
// Export Models (prevent recompilation in dev)
// ============================================

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export const Experience: Model<IExperience> =
  mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);

export const Tech: Model<ITech> =
  mongoose.models.Tech || mongoose.model<ITech>("Tech", TechSchema);

export const Section: Model<ISection> =
  mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
