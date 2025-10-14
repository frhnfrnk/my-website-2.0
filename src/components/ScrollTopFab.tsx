"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useInViewFooter } from "@/hooks/useInViewFooter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollTopFabProps {
  /**
   * Scroll position in pixels to trigger visibility
   * @default 600
   */
  threshold?: number;
  /**
   * Bottom offset in pixels when footer is visible
   * @default 24
   */
  footerOffset?: number;
  /**
   * Accent color for focus ring
   * @default "#8B5CF6"
   */
  accentColor?: string;
  /**
   * Show tooltip on hover/focus
   * @default true
   */
  showTooltip?: boolean;
}

export default function ScrollTopFab({
  threshold = 600,
  footerOffset = 24,
  accentColor = "#8B5CF6",
  showTooltip = true,
}: ScrollTopFabProps) {
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  const isVisible = useScrollTop(threshold);
  const isFooterInView = useInViewFooter(footerRef);
  const prefersReducedMotion = useReducedMotion();

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Find footer element
  useEffect(() => {
    footerRef.current = document.querySelector("footer");
  }, []);

  const scrollToTop = () => {
    if (prefersReducedMotion) {
      // Instant scroll for reduced motion
      window.scrollTo({ top: 0 });
    } else {
      // Smooth scroll
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  };

  // Calculate dynamic bottom position
  const getBottomPosition = () => {
    const baseBottom = "max(1rem, env(safe-area-inset-bottom))";
    if (isFooterInView) {
      return `calc(${baseBottom} + ${footerOffset}px)`;
    }
    return baseBottom;
  };

  // Animation variants
  const fabVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          transition: {
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={fabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={scrollToTop}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="fixed z-50 rounded-full p-0 transition-all duration-200 focus:outline-none"
          style={{
            right: "1rem",
            bottom: getBottomPosition(),
            width: "48px",
            height: "48px",
            backgroundColor: isDark ? "#ffffff" : "#171717",
            boxShadow: isHovered
              ? isDark
                ? "0 8px 24px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)"
                : "0 8px 24px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.12)"
              : isDark
              ? "0 4px 12px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.15)"
              : "0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)",
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
            opacity: isFooterInView ? 0.9 : 1,
          }}
          aria-label="Scroll to top"
        >
          {/* Focus ring */}
          {isFocused && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                outline: `2px solid ${accentColor}`,
                outlineOffset: "4px",
                opacity: 0.4,
              }}
            />
          )}

          {/* Arrow icon */}
          <div className="flex items-center justify-center w-full h-full">
            <svg
              className="w-5 h-5 transition-transform duration-200"
              style={{
                color: isDark ? "#171717" : "#ffffff",
                transform: isHovered ? "translateY(-1px)" : "translateY(0)",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>

          {/* Tooltip */}
          {showTooltip && (isHovered || isFocused) && (
            <div
              className="absolute right-full mr-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.8)",
                color: isDark ? "#ffffff" : "#ffffff",
                backdropFilter: "blur(8px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            >
              Back to top
            </div>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
