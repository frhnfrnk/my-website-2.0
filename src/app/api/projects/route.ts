/**
 * API Route: /api/projects
 * GET: List projects (with filtering, pagination)
 * POST: Create new project (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models";
import { ProjectSchema, ProjectQuerySchema } from "@/lib/validation/schemas";
import { isAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  isRateLimited,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getProjectTags } from "@/lib/tags";

/**
 * GET /api/projects
 * Query params: ?featured=true&stack=nextjs&page=1&limit=6
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const queryValidation = ProjectQuerySchema.safeParse({
      featured: searchParams.get("featured") || undefined,
      stack: searchParams.get("stack") || undefined,
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

    const { featured, stack, page, limit } = queryValidation.data;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (featured === "true") {
      filter.featured = true;
    }

    if (stack) {
      filter.stack = { $in: [stack] };
    }

    // Pagination
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? Math.min(parseInt(limit, 10), 50) : 10;
    const skip = (pageNum - 1) * limitNum;

    // Fetch projects
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ order: 1, publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        data: projects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create new project (admin only)
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
    const validation = ProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await Project.findOne({ slug: validation.data.slug });
    if (existing) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 409 }
      );
    }

    // Create project
    const project = await Project.create({
      ...validation.data,
      publishedAt: validation.data.publishedAt
        ? new Date(validation.data.publishedAt)
        : new Date(),
      updatedAt: new Date(),
    });

    // Revalidate cache
    getProjectTags(project.slug).forEach((tag) => revalidateTag(tag));

    return NextResponse.json(
      { data: project, message: "Project created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
