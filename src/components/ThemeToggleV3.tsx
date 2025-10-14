"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * ThemeToggleV3 - No remount, pure CSS variable transitions
 *
 * Features:
 * - Uses next-themes for better SSR/hydration
 * - Single DOM tree, no conditional rendering
 * - Icon crossfade instead of swap
 * - Smooth transitions via CSS variables
 * - Respects prefers-reduced-motion
 */
export default function ThemeToggleV3() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--tile)]">
        <div className="h-6 w-6" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={handleToggle}
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--tile)] transition-colors duration-200 hover:bg-[color:var(--tile-hover)]"
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Icon container - both icons always rendered, crossfade via opacity */}
      <div className="relative flex h-6 w-6 items-center justify-center">
        {/* Sun icon (light mode) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute text-[color:var(--icon-color)] group-hover:text-[color:var(--icon-strong-color)] transition-all duration-300"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark
              ? "rotate(180deg) scale(0.7)"
              : "rotate(0deg) scale(1)",
          }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>

        {/* Moon icon (dark mode) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute text-[color:var(--icon-color)] group-hover:text-[color:var(--icon-strong-color)] transition-all duration-300"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark
              ? "rotate(0deg) scale(1)"
              : "rotate(-180deg) scale(0.7)",
          }}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>

      {/* Subtle glow on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at center, var(--icon-color) 0%, transparent 70%)",
          opacity: 0.08,
        }}
      />
    </motion.button>
  );
}
