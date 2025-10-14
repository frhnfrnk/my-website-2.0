/**
 * API Route: /api/tech
 * GET: List tech stack (with category filter)
 * POST: Create new tech (admin only)
 * PATCH: Update tech (admin only)
 * DELETE: Delete tech (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Tech } from "@/lib/models";
import {
  TechSchema,
  TechUpdateSchema,
  TechQuerySchema,
} from "@/lib/validation/schemas";
import { isAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  isRateLimited,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { CACHE_TAGS } from "@/lib/tags";

/**
 * GET /api/tech
 * Query params: ?category=frontend
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const queryValidation = TechQuerySchema.safeParse({
      category: searchParams.get("category") || undefined,
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

    const { category } = queryValidation.data;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (category) {
      filter.category = category;
    }

    // Fetch tech stack
    const techStack = await Tech.find(filter)
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json(
      { data: techStack },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/tech error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tech
 * Create new tech (admin only)
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
    const validation = TechSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if key already exists
    const existing = await Tech.findOne({ key: validation.data.key });
    if (existing) {
      return NextResponse.json(
        { error: "Tech with this key already exists" },
        { status: 409 }
      );
    }

    // Create tech
    const tech = await Tech.create(validation.data);

    // Revalidate cache
    revalidateTag(CACHE_TAGS.TECH);

    return NextResponse.json(
      { data: tech, message: "Tech created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tech error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tech?key=nextjs
 * Update tech (admin only)
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

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Key parameter is required" },
        { status: 400 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validation = TechUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Update tech
    const tech = await Tech.findOneAndUpdate({ key }, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!tech) {
      return NextResponse.json({ error: "Tech not found" }, { status: 404 });
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.TECH);

    return NextResponse.json({
      data: tech,
      message: "Tech updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/tech error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tech?key=nextjs
 * Delete tech (admin only)
 */
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Key parameter is required" },
        { status: 400 }
      );
    }

    const tech = await Tech.findOneAndDelete({ key });

    if (!tech) {
      return NextResponse.json({ error: "Tech not found" }, { status: 404 });
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.TECH);

    return NextResponse.json({
      message: "Tech deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/tech error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
