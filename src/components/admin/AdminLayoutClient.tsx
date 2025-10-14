/**
 * Admin Layout Client Component
 * Client-side wrapper for admin dashboard
 */

"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminQueryProvider } from "@/components/admin/AdminQueryProvider";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  return (
    <Providers>
      <AdminQueryProvider>
        <Toaster position="top-right" richColors />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64">
              {/* Header */}
              <AdminHeader user={user} />

              {/* Content */}
              <main className="flex-1 p-8">{children}</main>
            </div>
          </div>
        </div>
      </AdminQueryProvider>
    </Providers>
  );
}
