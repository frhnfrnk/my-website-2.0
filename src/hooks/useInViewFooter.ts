import { useState, useEffect, RefObject } from "react";

/**
 * Hook to detect if footer is in viewport using IntersectionObserver
 * @param footerRef - React ref to the footer element
 * @param rootMargin - Margin around the root (default: "0px")
 * @returns boolean indicating if footer is visible in viewport
 */
export function useInViewFooter(
  footerRef: RefObject<HTMLElement | null>,
  rootMargin = "0px"
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: 0.01, // Trigger as soon as 1% is visible
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [footerRef, rootMargin]);

  return isInView;
}
