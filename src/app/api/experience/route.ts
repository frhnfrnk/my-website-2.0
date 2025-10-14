/**
 * API Route: /api/experience
 * GET: List all experience entries
 * POST: Create new experience (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Experience } from "@/lib/models";
import {
  ExperienceSchema,
  ExperienceQuerySchema,
} from "@/lib/validation/schemas";
import { isAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  isRateLimited,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getExperienceTags } from "@/lib/tags";

/**
 * GET /api/experience
 * Query params: ?page=1&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const queryValidation = ExperienceQuerySchema.safeParse({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: queryValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const { page, limit } = queryValidation.data;

    // Pagination
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? Math.min(parseInt(limit, 10), 50) : 20;
    const skip = (pageNum - 1) * limitNum;

    // Fetch experience entries
    const [experiences, total] = await Promise.all([
      Experience.find()
        .sort({ order: 1, "period.from": -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Experience.countDocuments(),
    ]);

    return NextResponse.json(
      {
        data: experiences,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/experience error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experience
 * Create new experience (admin only)
 */
export async function POST(request: NextRequest) {
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
    const validation = ExperienceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await Experience.findOne({ slug: validation.data.slug });
    if (existing) {
      return NextResponse.json(
        { error: "Experience with this slug already exists" },
        { status: 409 }
      );
    }

    // Create experience
    const experience = await Experience.create({
      ...validation.data,
      updatedAt: new Date(),
    });

    // Revalidate cache
    getExperienceTags(experience.slug).forEach((tag) => revalidateTag(tag));

    return NextResponse.json(
      { data: experience, message: "Experience created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/experience error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
