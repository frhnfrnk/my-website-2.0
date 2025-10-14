/**
 * API Route: /api/sections
 * GET: Get section content (hero/about/contact)
 * PATCH: Update section content (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Section } from "@/lib/models";
import { SectionUpdateSchema } from "@/lib/validation/schemas";
import { isAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  isRateLimited,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getSectionTags } from "@/lib/tags";

/**
 * GET /api/sections?key=hero
 * Get section content by key
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      // Return all sections if no key specified
      const sections = await Section.find().lean();
      return NextResponse.json(
        { data: sections },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
          },
        }
      );
    }

    // Validate key
    if (!["hero", "about", "contact"].includes(key)) {
      return NextResponse.json(
        { error: "Invalid section key. Must be hero, about, or contact" },
        { status: 400 }
      );
    }

    const section = await Section.findOne({ key }).lean();

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: section },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/sections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/sections
 * Update section content (admin only)
 * Body must include { key: 'hero'|'about'|'contact', ...updates }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Check admin authorization
    if (!(await isAdmin(request))) {
      return unauthorizedResponse();
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      return rateLimitResponse();
    }

    await connectDB();

    // Parse and validate body
    const body = await request.json();
    const validation = SectionUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { key, ...updates } = validation.data;

    if (!key) {
      return NextResponse.json(
        { error: "Section key is required" },
        { status: 400 }
      );
    }

    // Update or create section (upsert)
    const section = await Section.findOneAndUpdate(
      { key },
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );

    // Revalidate cache
    getSectionTags(key).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({
      data: section,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/sections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
