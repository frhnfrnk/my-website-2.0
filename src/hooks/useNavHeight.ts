"use client";

import { useEffect, RefObject } from "react";

/**
 * Custom hook to track navbar height and set CSS variable
 * Uses ResizeObserver for dynamic height tracking
 *
 * @param navRef - Ref to the navbar element
 * @param enabled - Whether to enable height tracking (default: true)
 */
export function useNavHeight(
  navRef: RefObject<HTMLElement | null>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled || !navRef.current) return;

    const updateNavHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        // Set CSS variable on root for global access
        document.documentElement.style.setProperty("--nav-h", `${height}px`);
      }
    };

    // Initial measurement
    updateNavHeight();

    // Create ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(() => {
      updateNavHeight();
    });

    // Observe the navbar element
    resizeObserver.observe(navRef.current);

    // Also update on window resize (fallback)
    window.addEventListener("resize", updateNavHeight);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateNavHeight);
    };
  }, [navRef, enabled]);
}
