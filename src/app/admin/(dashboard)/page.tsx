/**
 * Admin Dashboard Home / Overview
 * Shows statistics and quick links
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Code2, Mail } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Project, Experience, Tech, ContactMessage } from "@/lib/models";

async function getStats() {
  await connectDB();

  const [projectsCount, experienceCount, techCount, messagesCount] =
    await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Tech.countDocuments(),
      ContactMessage.countDocuments(),
    ]);

  return {
    projects: projectsCount,
    experience: experienceCount,
    tech: techCount,
    messages: messagesCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: Briefcase,
      href: "/admin/projects",
    },
    {
      title: "Experience",
      value: stats.experience,
      icon: Code2,
      href: "/admin/experience",
    },
    {
      title: "Tech Stack",
      value: stats.tech,
      icon: Code2,
      href: "/admin/tech",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: Mail,
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {card.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/projects"
            className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="font-semibold">Manage Projects</h3>
            <p className="text-sm text-gray-500">
              Create, edit, or delete projects
            </p>
          </a>
          <a
            href="/admin/sections"
            className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="font-semibold">Edit Sections</h3>
            <p className="text-sm text-gray-500">
              Update hero, about, contact content
            </p>
          </a>
          <a
            href="/admin/messages"
            className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="font-semibold">View Messages</h3>
            <p className="text-sm text-gray-500">
              Check contact form submissions
            </p>
          </a>
          <a
            href="/admin/tech"
            className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="font-semibold">Tech Stack</h3>
            <p className="text-sm text-gray-500">
              Manage your technology skills
            </p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
