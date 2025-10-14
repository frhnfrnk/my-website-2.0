/**
 * Sections Editor Page
 * Edit hero, about, and contact sections
 */

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sectionsAPI, showSuccessToast, showErrorToast } from "@/lib/admin-api";
import { Save, Loader2 } from "lucide-react";

const SECTION_KEYS = ["hero", "about", "contact"] as const;

interface Section {
  key: string;
  title: string;
  subtitle?: string;
  body?: string;
}

export default function SectionsPage() {
  const queryClient = useQueryClient();

  // Fetch all sections
  const { data: sections = [], isLoading } = useQuery<Section[]>({
    queryKey: ["admin-sections"],
    queryFn: async () => {
      const results = await Promise.all(
        SECTION_KEYS.map((key) => sectionsAPI.getByKey(key))
      );
      return results as Section[];
    },
  });

  // Individual section states
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    body: "",
  });
  const [aboutData, setAboutData] = useState({
    title: "",
    subtitle: "",
    body: "",
  });
  const [contactData, setContactData] = useState({
    title: "",
    subtitle: "",
    body: "",
  });

  // Update form data when sections are loaded
  useState(() => {
    if (sections.length > 0) {
      const hero = sections.find((s) => s.key === "hero");
      const about = sections.find((s) => s.key === "about");
      const contact = sections.find((s) => s.key === "contact");

      if (hero) {
        setHeroData({
          title: hero.title,
          subtitle: hero.subtitle || "",
          body: hero.body || "",
        });
      }
      if (about) {
        setAboutData({
          title: about.title,
          subtitle: about.subtitle || "",
          body: about.body || "",
        });
      }
      if (contact) {
        setContactData({
          title: contact.title,
          subtitle: contact.subtitle || "",
          body: contact.body || "",
        });
      }
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: unknown) => sectionsAPI.update(data),
    onSuccess: () => {
      showSuccessToast("Section updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-sections"] });
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to update section");
    },
  });

  const handleSave = (
    key: string,
    data: { title: string; subtitle: string; body: string }
  ) => {
    const payload = {
      key,
      title: data.title,
      subtitle: data.subtitle || undefined,
      body: data.body || undefined,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Sections</h1>
        <p className="text-muted-foreground mt-1">
          Edit hero, about, and contact section content
        </p>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={heroData.title}
              onChange={(e) =>
                setHeroData({ ...heroData, title: e.target.value })
              }
              placeholder="Hi, I'm John Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Input
              value={heroData.subtitle}
              onChange={(e) =>
                setHeroData({ ...heroData, subtitle: e.target.value })
              }
              placeholder="Full Stack Developer"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Body</label>
            <Textarea
              value={heroData.body}
              onChange={(e) =>
                setHeroData({ ...heroData, body: e.target.value })
              }
              placeholder="Brief introduction..."
              rows={4}
            />
          </div>
          <Button
            onClick={() => handleSave("hero", heroData)}
            disabled={updateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Hero
          </Button>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={aboutData.title}
              onChange={(e) =>
                setAboutData({ ...aboutData, title: e.target.value })
              }
              placeholder="About Me"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Input
              value={aboutData.subtitle}
              onChange={(e) =>
                setAboutData({ ...aboutData, subtitle: e.target.value })
              }
              placeholder="Who am I?"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Body</label>
            <Textarea
              value={aboutData.body}
              onChange={(e) =>
                setAboutData({ ...aboutData, body: e.target.value })
              }
              placeholder="Tell your story..."
              rows={8}
            />
          </div>
          <Button
            onClick={() => handleSave("about", aboutData)}
            disabled={updateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save About
          </Button>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={contactData.title}
              onChange={(e) =>
                setContactData({ ...contactData, title: e.target.value })
              }
              placeholder="Get In Touch"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Input
              value={contactData.subtitle}
              onChange={(e) =>
                setContactData({ ...contactData, subtitle: e.target.value })
              }
              placeholder="Let's work together"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Body</label>
            <Textarea
              value={contactData.body}
              onChange={(e) =>
                setContactData({ ...contactData, body: e.target.value })
              }
              placeholder="Contact information..."
              rows={4}
            />
          </div>
          <Button
            onClick={() => handleSave("contact", contactData)}
            disabled={updateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Contact
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
