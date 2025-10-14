/**
 * API Route: /api/experience/[slug]
 * GET: Get single experience by slug
 * PATCH: Update experience (admin only)
 * DELETE: Delete experience (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Experience } from "@/lib/models";
import { ExperienceUpdateSchema } from "@/lib/validation/schemas";
import { isAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  isRateLimited,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getExperienceTags } from "@/lib/tags";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * GET /api/experience/[slug]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const experience = await Experience.findOne({ slug }).lean();

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: experience },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/experience/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/experience/[slug]
 * Update experience (admin only)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const { slug } = await context.params;

    // Parse and validate body
    const body = await request.json();
    const validation = ExperienceUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Update experience
    const experience = await Experience.findOneAndUpdate(
      { slug },
      { ...validation.data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    // Revalidate cache
    getExperienceTags(slug).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({
      data: experience,
      message: "Experience updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/experience/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/experience/[slug]
 * Delete experience (admin only)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const { slug } = await context.params;

    const experience = await Experience.findOneAndDelete({ slug });

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    // Revalidate cache
    getExperienceTags(slug).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/experience/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
