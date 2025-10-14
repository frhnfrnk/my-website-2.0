/**
 * Admin Dashboard Layout
 * Sidebar + Header + Main Content Area
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard",
  description: "Portfolio Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>;
}
