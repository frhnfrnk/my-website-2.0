"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { techStack } from "@/lib/data";

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isDark, setIsDark] = useState(false);

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

  return (
    <section
      id="tech"
      ref={ref}
      className="py-32 px-6 border-t"
      style={{
        borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#eaeaea",
        background: isDark
          ? "linear-gradient(to bottom, #0B0C10 0%, #111214 50%, #0B0C10 100%)"
          : "linear-gradient(to bottom, #ffffff 0%, rgba(139, 92, 246, 0.02) 50%, #ffffff 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2
            className="text-sm uppercase tracking-wider mb-6 font-medium"
            style={{
              color: isDark
                ? "rgba(139, 92, 246, 0.7)"
                : "rgba(139, 92, 246, 0.8)",
            }}
          >
            Technologies
          </h2>
          <h3
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
          >
            Tech Stack
          </h3>
        </motion.div>

        {/* Tech Grid with Stagger Animation */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.06,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {techStack.map((tech) => (
            <TechCard key={tech.name} tech={tech} isDark={isDark} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TechCard({
  tech,
  isDark,
}: {
  tech: { name: string; category: string };
  isDark: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Category color mapping (brand purple accent)
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Frontend: isDark ? "#8B5CF6" : "#8B5CF6",
      Backend: isDark ? "#c4a7ff" : "#7C3AED",
      Database: isDark ? "#a78bfa" : "#6D28D9",
      Web3: isDark ? "#8B5CF6" : "#8B5CF6",
      Language: isDark ? "#c4a7ff" : "#7C3AED",
      Styling: isDark ? "#a78bfa" : "#6D28D9",
      API: isDark ? "#8B5CF6" : "#8B5CF6",
      Tools: isDark ? "#c4a7ff" : "#7C3AED",
    };
    return colors[category] || "#8B5CF6";
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl p-6 transition-all duration-300"
      style={{
        background: isDark
          ? isHovered
            ? "rgba(255, 255, 255, 0.04)"
            : "rgba(255, 255, 255, 0.02)"
          : isHovered
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(255, 255, 255, 0.6)",
        border: `1px solid ${
          isDark
            ? isHovered
              ? "rgba(139, 92, 246, 0.3)"
              : "rgba(255, 255, 255, 0.06)"
            : isHovered
            ? "rgba(139, 92, 246, 0.2)"
            : "rgba(0, 0, 0, 0.06)"
        }`,
        backdropFilter: "blur(12px)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isDark
          ? isHovered
            ? "0 12px 40px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.05) inset"
            : "0 4px 16px rgba(0, 0, 0, 0.2)"
          : isHovered
          ? "0 12px 40px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.03) inset"
          : "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Glow Effect on Hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: isDark
              ? "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.08), transparent 70%)"
              : "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.04), transparent 70%)",
          }}
        />
      )}

      <div className="relative flex flex-col items-center text-center">
        {/* Icon Container with Category Color */}
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: isDark
              ? isHovered
                ? "rgba(139, 92, 246, 0.15)"
                : "rgba(139, 92, 246, 0.08)"
              : isHovered
              ? "rgba(139, 92, 246, 0.12)"
              : "rgba(139, 92, 246, 0.06)",
            border: `1px solid ${
              isDark
                ? isHovered
                  ? "rgba(139, 92, 246, 0.3)"
                  : "rgba(139, 92, 246, 0.15)"
                : isHovered
                ? "rgba(139, 92, 246, 0.2)"
                : "rgba(139, 92, 246, 0.1)"
            }`,
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? [0, -5, 5, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            rotate: { duration: 0.5 },
          }}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: getCategoryColor(tech.category) }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </motion.div>

        {/* Tech Name */}
        <h4
          className="font-semibold text-base mb-2 tracking-tight"
          style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
        >
          {tech.name}
        </h4>

        {/* Category Badge */}
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            color: getCategoryColor(tech.category),
            background: isDark
              ? "rgba(139, 92, 246, 0.1)"
              : "rgba(139, 92, 246, 0.08)",
            border: `1px solid ${
              isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)"
            }`,
          }}
        >
          {tech.category}
        </span>
      </div>
    </motion.div>
  );
}
