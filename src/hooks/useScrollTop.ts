import { useState, useEffect } from "react";

/**
 * Hook to track if user has scrolled past a threshold
 * @param threshold - Scroll position in pixels to trigger visibility (default: 600)
 * @returns boolean indicating if user has scrolled past threshold
 */
export function useScrollTop(threshold = 600): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold;
      setIsVisible(scrolled);
    };

    // Check on mount
    handleScroll();

    // Throttle scroll events for performance
    let rafId: number | null = null;
    const throttledScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [threshold]);

  return isVisible;
}
