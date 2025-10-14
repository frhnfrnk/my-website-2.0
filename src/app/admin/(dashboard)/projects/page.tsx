/**
 * Admin Projects Page
 * CRUD interface for managing projects
 */

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";
import { projectsAPI, showSuccessToast, showErrorToast } from "@/lib/admin-api";
import { ProjectFormDialog } from "@/components/admin/ProjectFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { format } from "date-fns";

interface Project {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  featured?: boolean;
  publishedAt: string;
  links: {
    demo?: string;
    repo?: string;
  };
}

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const queryClient = useQueryClient();

  // Fetch projects
  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects", search],
    queryFn: () => projectsAPI.getAll({ limit: 100 }),
  });

  const projects = data?.data || [];

  // Filter projects by search
  const filteredProjects = projects.filter(
    (project: Project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.summary.toLowerCase().includes(search.toLowerCase()) ||
      project.stack.some((tech: string) =>
        tech.toLowerCase().includes(search.toLowerCase())
      )
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (slug: string) => projectsAPI.delete(slug),
    onSuccess: () => {
      showSuccessToast("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setDeleteProject(null);
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to delete project");
    },
  });

  const handleCreate = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeleteProject(project);
  };

  const confirmDelete = () => {
    if (deleteProject) {
      deleteMutation.mutate(deleteProject.slug);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No projects found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Stack</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project: Project) => (
                    <TableRow key={project._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {project.summary}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.stack.slice(0, 3).map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.stack.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.stack.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {project.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(project.publishedAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {project.links.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.links.repo && (
                            <a
                              href={project.links.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(project)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(project)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ProjectFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        project={selectedProject}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteProject?.title}"? This action cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
