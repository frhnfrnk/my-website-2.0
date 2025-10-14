/**
 * API Route: /api/projects/[slug]
 * GET: Get single project by slug
 * PATCH: Update project (admin only)
 * DELETE: Delete project (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models";
import { ProjectUpdateSchema } from "@/lib/validation/schemas";
import { isAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  isRateLimited,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getProjectTags } from "@/lib/tags";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * GET /api/projects/[slug]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const project = await Project.findOne({ slug }).lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: project },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/projects/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[slug]
 * Update project (admin only)
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
    const validation = ProjectUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Update project
    const project = await Project.findOneAndUpdate(
      { slug },
      { ...validation.data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Revalidate cache
    getProjectTags(slug).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({
      data: project,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/projects/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[slug]
 * Delete project (admin only)
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

    const project = await Project.findOneAndDelete({ slug });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Revalidate cache
    getProjectTags(slug).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/projects/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
