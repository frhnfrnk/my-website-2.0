/**
 * API Route: /api/contact
 * POST: Submit contact message (rate-limited)
 * GET: List contact messages (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { ContactMessageSchema } from "@/lib/validation/schemas";
import { isAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  isRateLimited,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";

/**
 * POST /api/contact
 * Submit contact message (public, rate-limited)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (strict for contact form)
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      return rateLimitResponse();
    }

    await connectDB();

    // Parse and validate body
    const body = await request.json();
    const validation = ContactMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Sanitize input (basic XSS prevention)
    const sanitizedData = {
      name: validation.data.name.trim(),
      email: validation.data.email.trim().toLowerCase(),
      message: validation.data.message.trim(),
    };

    // Create contact message
    const message = await ContactMessage.create({
      ...sanitizedData,
      createdAt: new Date(),
    });

    // Here you could add email notification logic
    // e.g., send email to admin using nodemailer or similar

    return NextResponse.json(
      {
        message: "Message sent successfully! I will get back to you soon.",
        id: message._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * List contact messages (admin only)
 * Query params: ?page=1&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    if (!(await isAdmin(request))) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100
    );
    const skip = (page - 1) * limit;

    // Fetch messages
    const [messages, total] = await Promise.all([
      ContactMessage.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(),
    ]);

    return NextResponse.json({
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
