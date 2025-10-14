/**
 * Middleware to protect admin routes
 * Checks authentication before allowing access to /admin/**
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page without any checks
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // For other admin routes, check for session token
  if (pathname.startsWith("/admin")) {
    const token =
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-next-auth.session-token");

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only protect admin routes, explicitly exclude login
export const config = {
  matcher: ["/admin/:path*"],
};
