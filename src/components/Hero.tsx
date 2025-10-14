"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import HeroBackground from "./HeroBackground";
import AccentLine from "./AccentLine";

export default function Hero() {
  const [isDark, setIsDark] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Animation variants with reduced motion support
  const getVariants = (delay = 0, yOffset = 16) => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: yOffset },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
  });

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #0B0C10 0%, #0C0E11 100%)"
          : "#ffffff",
      }}
    >
      {/* Premium Background Effects */}
      <HeroBackground variant="spotlight" isDark={isDark} />

      <div className="max-w-[880px] mx-auto text-center relative z-10">
        {/* Headline - Name with strong presence */}
        <motion.div
          variants={getVariants(0, 20)}
          initial="hidden"
          animate="visible"
        >
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
            style={{
              fontWeight: 900,
              color: isDark ? "#F3F4F6" : "#0B0C10",
              letterSpacing: "-0.02em",
            }}
          >
            Farhan Franaka
          </h1>
        </motion.div>

        {/* Accent Line - Premium divider with glow */}
        <div className="mb-8">
          <AccentLine
            delay={0.15}
            accentColor="#8B5CF6"
            width={64}
            height={2}
            isDark={isDark}
          />
        </div>

        {/* Subheadline - Role/Title */}
        <motion.div
          variants={getVariants(0.25, 16)}
          initial="hidden"
          animate="visible"
        >
          <p
            className="text-xl md:text-2xl font-semibold tracking-tight mb-4"
            style={{
              color: isDark ? "rgb(212, 212, 212)" : "rgb(64, 64, 64)",
            }}
          >
            Frontend Engineer & Web Developer
          </p>
        </motion.div>

        {/* Value Line - Short compelling statement */}
        <motion.div
          variants={getVariants(0.35, 14)}
          initial="hidden"
          animate="visible"
        >
          <p
            className="text-base md:text-lg max-w-[640px] mx-auto mb-12 leading-relaxed"
            style={{
              color: isDark ? "rgb(163, 163, 163)" : "rgb(82, 82, 82)",
            }}
          >
            I build interfaces where clarity meets precision.
          </p>
        </motion.div>

        {/* CTAs - Side by side */}
        <motion.div
          variants={getVariants(0.45, 12)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Primary CTA */}
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: isDark ? "#ffffff" : "#0B0C10",
              color: isDark ? "#0B0C10" : "#ffffff",
              boxShadow: isDark
                ? "0 4px 16px rgba(255, 255, 255, 0.1)"
                : "0 4px 16px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = isDark
                ? "0 8px 24px rgba(255, 255, 255, 0.15)"
                : "0 8px 24px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = isDark
                ? "0 4px 16px rgba(255, 255, 255, 0.1)"
                : "0 4px 16px rgba(0, 0, 0, 0.08)";
            }}
            aria-label="View my projects"
          >
            See Projects
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          {/* Secondary CTA */}
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.04)",
              color: isDark ? "#F3F4F6" : "#0B0C10",
              border: `1px solid ${
                isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
              }`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(139, 92, 246, 0.08)"
                : "rgba(139, 92, 246, 0.06)";
              e.currentTarget.style.borderColor = isDark
                ? "rgba(139, 92, 246, 0.25)"
                : "rgba(139, 92, 246, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)";
            }}
            aria-label="Get in touch with me"
          >
            Contact Me
          </a>
        </motion.div>

        {/* Compact Badges - Credibility indicators */}
        <motion.div
          variants={getVariants(0.55, 10)}
          initial="hidden"
          animate="visible"
        >
          <div
            className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium"
            style={{
              color: isDark
                ? "rgba(163, 163, 163, 0.7)"
                : "rgba(115, 115, 115, 0.7)",
            }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: "#8B5CF6" }}
              />
              Next.js
            </span>
            <span
              style={{
                color: isDark
                  ? "rgba(163, 163, 163, 0.3)"
                  : "rgba(115, 115, 115, 0.3)",
              }}
            >
              •
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: "#8B5CF6" }}
              />
              Tailwind
            </span>
            <span
              style={{
                color: isDark
                  ? "rgba(163, 163, 163, 0.3)"
                  : "rgba(115, 115, 115, 0.3)",
              }}
            >
              •
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: "#8B5CF6" }}
              />
              Web3-ready
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
