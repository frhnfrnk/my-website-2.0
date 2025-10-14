"use client";

import { useState, useEffect, useRef } from "react";

interface HeroBackgroundProps {
  variant?: "spotlight" | "orbs";
  isDark: boolean;
}

export default function HeroBackground({
  variant = "spotlight",
  isDark,
}: HeroBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    };

    if (variant === "spotlight") {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [variant]);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      {/* Noise Overlay - Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      {variant === "spotlight" ? (
        <>
          {/* Spotlight Follow Cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${
                mousePosition.x
              }% ${mousePosition.y}%, ${
                isDark ? "rgba(139, 92, 246, 0.06)" : "rgba(139, 92, 246, 0.04)"
              }, transparent 40%)`,
              willChange: "background",
            }}
          />

          {/* Subtle grid dots - fade in center */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDark
                ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)"
                : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, black 100%)",
            }}
          />
        </>
      ) : (
        <>
          {/* Radial Orbs - Left side (Lilac) */}
          <div
            className="absolute -left-40 top-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Radial Orbs - Right side (Cyan) */}
          <div
            className="absolute -right-40 bottom-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(0, 163, 255, 0.06) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(0, 163, 255, 0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Subtle grid dots - fade in center */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDark
                ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)"
                : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, black 100%)",
            }}
          />
        </>
      )}

      {/* Dark mode specific gradient */}
      {isDark && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0C0E11 0%, #0A0B0E 50%, #0C0E11 100%)",
            zIndex: -1,
          }}
        />
      )}
    </div>
  );
}
