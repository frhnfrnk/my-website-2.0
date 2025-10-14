/**
 * Experience Form Dialog
 * Create/Edit work experience with validation
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
import {
  experienceAPI,
  showSuccessToast,
  showErrorToast,
} from "@/lib/admin-api";

const experienceSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Use lowercase, numbers, and hyphens only"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  periodFrom: z.string().min(1, "Start date is required"),
  periodTo: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  bullets: z.string().min(1, "At least one bullet point is required"),
  stack: z.string().min(1, "At least one tech is required"),
  link: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceFormDialogProps {
  open: boolean;
  onClose: () => void;
  experience?: {
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
  } | null;
}

export function ExperienceFormDialog({
  open,
  onClose,
  experience,
}: ExperienceFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!experience;

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      slug: "",
      company: "",
      role: "",
      periodFrom: "",
      periodTo: "",
      location: "",
      bullets: "",
      stack: "",
      link: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (experience) {
      form.reset({
        slug: experience.slug,
        company: experience.company,
        role: experience.role,
        periodFrom: experience.period.from,
        periodTo: experience.period.to,
        location: experience.location,
        bullets: experience.bullets.join("\n"),
        stack: experience.stack.join(", "),
        link: experience.link || "",
        order: experience.order || 0,
      });
    } else {
      form.reset({
        slug: "",
        company: "",
        role: "",
        periodFrom: "",
        periodTo: "",
        location: "",
        bullets: "",
        stack: "",
        link: "",
        order: 0,
      });
    }
  }, [experience, form]);

  const createMutation = useMutation({
    mutationFn: (data: unknown) => experienceAPI.create(data),
    onSuccess: () => {
      showSuccessToast("Experience created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to create experience");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: unknown }) =>
      experienceAPI.update(slug, data),
    onSuccess: () => {
      showSuccessToast("Experience updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      onClose();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to update experience");
    },
  });

  const onSubmit = (data: ExperienceFormData) => {
    const formattedData = {
      slug: data.slug,
      company: data.company,
      role: data.role,
      period: {
        from: data.periodFrom,
        to: data.periodTo,
      },
      location: data.location,
      bullets: data.bullets
        .split("\n")
        .filter(Boolean)
        .map((s) => s.trim()),
      stack: data.stack.split(",").map((s) => s.trim()),
      link: data.link || undefined,
      order: data.order,
    };

    if (isEdit) {
      updateMutation.mutate({ slug: experience.slug, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  const handleCompanyChange = (value: string) => {
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
            {isEdit ? "Edit Experience" : "Add New Experience"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Company */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Company Name"
                      onChange={(e) => {
                        field.onChange(e);
                        handleCompanyChange(e.target.value);
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
                      placeholder="company-name"
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Senior Full Stack Developer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Period From */}
              <FormField
                control={form.control}
                name="periodFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jan 2022" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Period To */}
              <FormField
                control={form.control}
                name="periodTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Present" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jakarta, Indonesia" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bullets */}
            <FormField
              control={form.control}
              name="bullets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities (one per line) *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Led development of..."
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
                  <FormLabel>Tech Stack (comma-separated) *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="React, Node.js, PostgreSQL"
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

            <div className="grid grid-cols-2 gap-4">
              {/* Link */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://company.com" />
                    </FormControl>
                    <FormMessage />
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
