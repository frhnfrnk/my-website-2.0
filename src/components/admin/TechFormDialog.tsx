/**
 * Tech Form Dialog
 * Create/Edit technology with validation
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { techAPI, showSuccessToast, showErrorToast } from "@/lib/admin-api";

const CATEGORIES = [
  "language",
  "frontend",
  "backend",
  "database",
  "devops",
  "tool",
  "other",
] as const;

const techSchema = z.object({
  key: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Use lowercase, numbers, and hyphens only"),
  name: z.string().min(1, "Name is required"),
  category: z.enum(CATEGORIES),
  website: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
});

type TechFormData = z.infer<typeof techSchema>;

interface TechFormDialogProps {
  open: boolean;
  onClose: () => void;
  tech?: {
    key: string;
    name: string;
    category: (typeof CATEGORIES)[number];
    website?: string;
    order?: number;
  } | null;
}

export function TechFormDialog({ open, onClose, tech }: TechFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!tech;

  const form = useForm<TechFormData>({
    resolver: zodResolver(techSchema),
    defaultValues: {
      key: "",
      name: "",
      category: "other",
      website: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (tech) {
      form.reset({
        key: tech.key,
        name: tech.name,
        category: tech.category,
        website: tech.website || "",
        order: tech.order || 0,
      });
    } else {
      form.reset({
        key: "",
        name: "",
        category: "other",
        website: "",
        order: 0,
      });
    }
  }, [tech, form]);

  const createMutation = useMutation({
    mutationFn: (data: unknown) => techAPI.create(data),
    onSuccess: () => {
      showSuccessToast("Technology created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-tech"] });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to create technology");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, data }: { key: string; data: unknown }) =>
      techAPI.update(key, data),
    onSuccess: () => {
      showSuccessToast("Technology updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-tech"] });
      onClose();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to update technology");
    },
  });

  const onSubmit = (data: TechFormData) => {
    const formattedData = {
      key: data.key,
      name: data.name,
      category: data.category,
      website: data.website || undefined,
      order: data.order,
    };

    if (isEdit) {
      updateMutation.mutate({ key: tech.key, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  const handleNameChange = (value: string) => {
    if (!isEdit) {
      const key = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("key", key);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Technology" : "Add New Technology"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="React"
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Key */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="react" disabled={isEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="capitalize"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://react.dev" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

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
