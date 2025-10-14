/**
 * Theme Utility Functions
 * Handles theme detection, storage, and SSR-safe initialization
 */

export type Theme = "light" | "dark";

// Get initial theme from localStorage or system preference
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") return stored;

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
  }

  return "light";
}

// Save theme to localStorage
export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.error("Error saving theme to localStorage:", error);
  }
}

// Apply theme to document (SSR-safe)
export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
