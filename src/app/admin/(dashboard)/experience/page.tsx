/**
 * Experience Management Page
 * CRUD operations for work experience
 */

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  experienceAPI,
  showSuccessToast,
  showErrorToast,
} from "@/lib/admin-api";
import { ExperienceFormDialog } from "@/components/admin/ExperienceFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";

interface Experience {
  slug: string;
  company: string;
  role: string;
  period: {
    from: string;
    to: string;
  };
  location: string;
  bullets: string[];
  stack: string[];
  link?: string;
  order?: number;
}

export default function ExperiencePage() {
  const [search, setSearch] = useState("");
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch experiences
  const { data, isLoading } = useQuery({
    queryKey: ["admin-experience"],
    queryFn: () => experienceAPI.getAll(),
  });

  // Safely extract experiences list - handle both undefined and nested data
  const experiences: Experience[] = Array.isArray(data?.data) ? data.data : [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (slug: string) => experienceAPI.delete(slug),
    onSuccess: () => {
      showSuccessToast("Experience deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      setDeleteSlug(null);
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to delete experience");
    },
  });

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setSelectedExperience(null);
    setShowFormDialog(true);
  };

  const handleCloseDialog = () => {
    setShowFormDialog(false);
    setSelectedExperience(null);
  };

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.company.toLowerCase().includes(search.toLowerCase()) ||
      exp.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground mt-1">
            Manage work experience and positions
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{experiences.length}</div>
          <p className="text-muted-foreground text-sm">Total Experiences</p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading experiences...
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {search
                ? "No experiences found"
                : "No experiences yet. Create one!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Stack</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperiences.map((exp) => (
                  <TableRow key={exp.slug}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {exp.company}
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{exp.role}</TableCell>
                    <TableCell className="text-sm">
                      {exp.period.from} - {exp.period.to}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {exp.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {exp.stack.slice(0, 3).map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {exp.stack.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{exp.stack.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(exp)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteSlug(exp.slug)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ExperienceFormDialog
        open={showFormDialog}
        onClose={handleCloseDialog}
        experience={selectedExperience}
      />

      <ConfirmDialog
        open={!!deleteSlug}
        onClose={() => setDeleteSlug(null)}
        onConfirm={() => deleteSlug && deleteMutation.mutate(deleteSlug)}
        loading={deleteMutation.isPending}
        title="Delete Experience"
        description="Are you sure you want to delete this experience? This action cannot be undone."
      />
    </div>
  );
}
