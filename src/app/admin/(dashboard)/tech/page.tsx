/**
 * Tech Stack Management Page
 * CRUD operations for technologies
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { techAPI, showSuccessToast, showErrorToast } from "@/lib/admin-api";
import { TechFormDialog } from "@/components/admin/TechFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";

const CATEGORIES = [
  "language",
  "frontend",
  "backend",
  "database",
  "devops",
  "tool",
  "other",
] as const;

interface Tech {
  key: string;
  name: string;
  category: (typeof CATEGORIES)[number];
  website?: string;
  order?: number;
}

export default function TechPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<Tech | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch tech
  const { data, isLoading } = useQuery({
    queryKey: ["admin-tech", categoryFilter],
    queryFn: () =>
      techAPI.getAll(
        categoryFilter === "all" ? undefined : { category: categoryFilter }
      ),
  });

  // Safely extract tech list - handle both undefined and nested data
  const techList: Tech[] = Array.isArray(data) ? (data as Tech[]) : [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (key: string) => techAPI.delete(key),
    onSuccess: () => {
      showSuccessToast("Tech deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-tech"] });
      setDeleteKey(null);
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to delete tech");
    },
  });

  const handleEdit = (tech: Tech) => {
    setSelectedTech(tech);
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setSelectedTech(null);
    setShowFormDialog(true);
  };

  const handleCloseDialog = () => {
    setShowFormDialog(false);
    setSelectedTech(null);
  };

  // Filter tech list
  const filteredTech = techList.filter((tech) =>
    tech.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      language: "bg-blue-500/10 text-blue-500",
      frontend: "bg-green-500/10 text-green-500",
      backend: "bg-orange-500/10 text-orange-500",
      database: "bg-purple-500/10 text-purple-500",
      devops: "bg-red-500/10 text-red-500",
      tool: "bg-yellow-500/10 text-yellow-500",
      other: "bg-gray-500/10 text-gray-500",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tech Stack</h1>
          <p className="text-muted-foreground mt-1">
            Manage technologies and tools
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tech
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{techList.length}</div>
          </CardContent>
        </Card>
        {CATEGORIES.slice(0, 3).map((cat) => {
          const count = techList.filter((t) => t.category === cat).length;
          return (
            <Card key={cat}>
              <CardHeader>
                <CardTitle className="text-sm capitalize">{cat}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading technologies...
            </div>
          ) : filteredTech.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {search
                ? "No technologies found"
                : "No technologies yet. Add one!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTech.map((tech) => (
                  <TableRow key={tech.key}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {tech.key}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(tech.category)}>
                        {tech.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tech.website ? (
                        <a
                          href={tech.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Link
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tech.order ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(tech)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteKey(tech.key)}
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
      <TechFormDialog
        open={showFormDialog}
        onClose={handleCloseDialog}
        tech={selectedTech}
      />

      <ConfirmDialog
        open={!!deleteKey}
        onClose={() => setDeleteKey(null)}
        onConfirm={() => deleteKey && deleteMutation.mutate(deleteKey)}
        loading={deleteMutation.isPending}
        title="Delete Technology"
        description="Are you sure you want to delete this technology? This action cannot be undone."
      />
    </div>
  );
}
