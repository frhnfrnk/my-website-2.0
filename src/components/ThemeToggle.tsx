"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { prefersReducedMotion } from "@/utils/theme";
import { useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const reducedMotion = prefersReducedMotion();

  const handleToggle = () => {
    toggleTheme();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 600);
  };

  // Animation configuration
  const iconTransition = {
    duration: reducedMotion ? 0 : 0.22,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  const buttonVariants = {
    hover: reducedMotion ? {} : { scale: 1.05 },
    tap: reducedMotion ? {} : { scale: 0.95 },
  };

  return (
    <motion.button
      onClick={handleToggle}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-pressed={theme === "dark"}
      className={`
        relative w-8 h-8 rounded-full 
        flex items-center justify-center
        bg-foreground/5 dark:bg-white/10
        border border-border/30 dark:border-white/20
        hover:bg-foreground/10 dark:hover:bg-white/15
        transition-all duration-200
        ${isPressed ? "halo-glow" : ""}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.svg
            key="sun"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={iconTransition}
            className="w-4 h-4"
            style={{ color: "#0f0f0f" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={iconTransition}
            className="w-4 h-4"
            style={{ color: "#ffffff" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
