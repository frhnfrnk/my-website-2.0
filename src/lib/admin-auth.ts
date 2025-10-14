/**
 * Admin Authentication Helper
 * Simplified version for admin dashboard
 */

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Check if user is authenticated admin (Server Component)
 */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return session;
}

/**
 * Require admin session or throw
 */
export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
