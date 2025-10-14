"use client";

import IconSidebar, { type HoverVariant } from "./IconSidebar";
import { Home, Briefcase, User, Award, Mail } from "lucide-react";

const sidebarNavItems = [
  {
    href: "/#hero",
    label: "HOME",
    icon: Home,
    ariaLabel: "Navigate to home section",
  },
  {
    href: "/#projects",
    label: "WORK",
    icon: Briefcase,
    ariaLabel: "Navigate to projects section",
  },
  {
    href: "/#about",
    label: "ABOUT",
    icon: User,
    ariaLabel: "Navigate to about section",
  },
  {
    href: "/#experience",
    label: "EXPERIENCE",
    icon: Award,
    ariaLabel: "Navigate to experience section",
  },
  {
    href: "/#contact",
    label: "CONTACT",
    icon: Mail,
    ariaLabel: "Navigate to contact section",
  },
];

interface IconSidebarWrapperProps {
  variant?: HoverVariant;
  showThemeToggle?: boolean;
}

export default function IconSidebarWrapper({
  variant = "soft-press",
  showThemeToggle = true,
}: IconSidebarWrapperProps = {}) {
  return (
    <IconSidebar
      items={sidebarNavItems}
      hoverVariant={variant}
      showThemeToggle={showThemeToggle}
    />
  );
}
