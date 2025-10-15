/**
 * Project Form Dialog
 * Create/Edit project with validation
 */

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectsAPI, showSuccessToast, showErrorToast } from "@/lib/admin-api";

const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Use lowercase, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required").max(500),
  description: z.string().min(1, "Description is required"),
  stack: z.string().min(1, "At least one tech is required"),
  cover: z.string().url().optional().or(z.literal("")),
  demoLink: z.string().url().optional().or(z.literal("")),
  repoLink: z.string().url().optional().or(z.literal("")),
  featured: z.boolean(),
  order: z.number().int().min(0).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  project?: {
    slug: string;
    title: string;
    summary: string;
    description?: string;
    stack: string[];
    cover?: string;
    links: {
      demo?: string;
      repo?: string;
    };
    featured?: boolean;
    order?: number;
  } | null;
}

export function ProjectFormDialog({
  open,
  onClose,
  project,
}: ProjectFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!project;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      description: "",
      stack: "",
      cover: "",
      demoLink: "",
      repoLink: "",
      featured: false,
      order: 0,
    },
  });

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      form.reset({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        description: project.description,
        stack: project.stack.join(", "),
        cover: project.cover || "",
        demoLink: project.links.demo || "",
        repoLink: project.links.repo || "",
        featured: project.featured || false,
        order: project.order || 0,
      });
    } else {
      form.reset({
        slug: "",
        title: "",
        summary: "",
        description: "",
        stack: "",
        cover: "",
        demoLink: "",
        repoLink: "",
        featured: false,
        order: 0,
      });
    }
  }, [project, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: unknown) => projectsAPI.create(data),
    onSuccess: () => {
      showSuccessToast("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to create project");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: unknown }) =>
      projectsAPI.update(slug, data),
    onSuccess: () => {
      showSuccessToast("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onClose();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to update project");
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    const formattedData = {
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      description: data.description,
      stack: data.stack.split(",").map((s) => s.trim()),
      cover: data.cover || undefined,
      links: {
        demo: data.demoLink || undefined,
        repo: data.repoLink || undefined,
      },
      featured: data.featured,
      order: data.order,
    };

    if (isEdit) {
      updateMutation.mutate({ slug: project.slug, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    if (!isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="AI SaaS Platform"
                      onChange={(e) => {
                        field.onChange(e);
                        handleTitleChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ai-saas-platform"
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief description (max 500 chars)"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Full project description..."
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stack */}
            <FormField
              control={form.control}
              name="stack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack * (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Next.js, TypeScript, MongoDB"
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {field.value
                      .split(",")
                      .filter(Boolean)
                      .map((tech, i) => (
                        <Badge key={i} variant="secondary">
                          {tech.trim()}
                        </Badge>
                      ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Demo Link */}
              <FormField
                control={form.control}
                name="demoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://demo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Repo Link */}
              <FormField
                control={form.control}
                name="repoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://github.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Featured */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                      />
                      <FormLabel className="!mt-0">Featured Project</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Order */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
