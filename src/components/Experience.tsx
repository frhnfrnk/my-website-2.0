"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { experiences } from "@/lib/data";

export default function Experience() {
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
      id="experience"
      ref={ref}
      className="py-32 px-6 border-t"
      style={{
        borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#eaeaea",
        background: isDark ? "#0B0C10" : "#ffffff",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2
            className="text-sm uppercase tracking-wider mb-6 font-medium"
            style={{
              color: isDark
                ? "rgba(139, 92, 246, 0.7)"
                : "rgba(139, 92, 246, 0.8)",
            }}
          >
            Career Path
          </h2>
          <h3
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
          >
            Experience
          </h3>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.3) 20%, rgba(139, 92, 246, 0.3) 80%, transparent)"
                : "linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.2) 20%, rgba(139, 92, 246, 0.2) 80%, transparent)",
            }}
          />

          {/* Experience Items */}
          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                index={index}
                isInView={isInView}
                isDark={isDark}
                isLast={index === experiences.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  experience,
  index,
  isInView,
  isDark,
  isLast,
}: {
  experience: (typeof experiences)[0];
  index: number;
  isInView: boolean;
  isDark: boolean;
  isLast: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Staggered animation variants
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.15 + 0.2,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative pl-10 group"
    >
      {/* Timeline Dot with Animation */}
      <motion.div
        className="absolute -left-[9px] top-1 rounded-full"
        style={{
          width: isHovered ? "18px" : "16px",
          height: isHovered ? "18px" : "16px",
          background: isDark
            ? "linear-gradient(135deg, #8B5CF6 0%, #9F7AEA 100%)"
            : "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
          boxShadow: isDark
            ? isHovered
              ? "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)"
              : "0 0 12px rgba(139, 92, 246, 0.3)"
            : isHovered
            ? "0 0 16px rgba(139, 92, 246, 0.4), 0 0 32px rgba(139, 92, 246, 0.15)"
            : "0 0 8px rgba(139, 92, 246, 0.25)",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Content Container with Glassmorphism */}
      <motion.div
        variants={contentVariants}
        className="rounded-2xl p-6 transition-all duration-300"
        style={{
          background: isDark
            ? isHovered
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(255, 255, 255, 0.01)"
            : isHovered
            ? "rgba(139, 92, 246, 0.02)"
            : "rgba(255, 255, 255, 0.5)",
          border: `1px solid ${
            isDark
              ? isHovered
                ? "rgba(139, 92, 246, 0.2)"
                : "rgba(255, 255, 255, 0.04)"
              : isHovered
              ? "rgba(139, 92, 246, 0.15)"
              : "rgba(0, 0, 0, 0.06)"
          }`,
          backdropFilter: "blur(12px)",
          boxShadow: isDark
            ? isHovered
              ? "0 8px 32px rgba(139, 92, 246, 0.08), 0 0 0 1px rgba(139, 92, 246, 0.05) inset"
              : "0 4px 16px rgba(0, 0, 0, 0.2)"
            : isHovered
            ? "0 8px 32px rgba(139, 92, 246, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.03) inset"
            : "0 2px 8px rgba(0, 0, 0, 0.03)",
        }}
      >
        {/* Header: Role, Company, Period */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
          <div className="flex-1">
            {/* Role - Bold & Prominent */}
            <h4
              className="text-xl md:text-2xl font-bold mb-1.5 tracking-tight"
              style={{
                color: isDark ? "#ffffff" : "#0f0f0f",
                letterSpacing: "-0.02em",
              }}
            >
              {experience.title}
            </h4>

            {/* Company - Italic & Accent */}
            <p
              className="text-base font-medium italic"
              style={{
                color: "#8B5CF6",
                letterSpacing: "0.01em",
              }}
            >
              {experience.company}
            </p>
          </div>

          {/* Period Badge */}
          <div
            className="px-3 py-1.5 rounded-full text-xs font-medium shrink-0"
            style={{
              background: isDark
                ? "rgba(139, 92, 246, 0.1)"
                : "rgba(139, 92, 246, 0.08)",
              color: isDark ? "#c4a7ff" : "#8B5CF6",
              border: `1px solid ${
                isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)"
              }`,
            }}
          >
            {experience.period}
          </div>
        </div>

        {/* Description */}
        <motion.p
          className="text-base leading-relaxed mb-5"
          style={{
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#6b6b6b",
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.15 + 0.3 }}
        >
          {experience.description}
        </motion.p>

        {/* Achievements with Stagger */}
        <motion.ul
          className="space-y-2.5 mb-5"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: index * 0.15 + 0.4,
              },
            },
          }}
        >
          {experience.achievements.map((achievement, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="flex items-start gap-3 text-sm"
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.6)" : "#6b6b6b",
              }}
            >
              {/* Checkmark Icon with Accent */}
              <svg
                className="shrink-0 mt-0.5"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={{ color: "#8B5CF6" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="leading-relaxed">{achievement}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Personal Impact - Human Touch */}
        <motion.div
          className="pt-4"
          style={{
            borderTop: `1px solid ${
              isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"
            }`,
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.15 + 0.6 }}
        >
          <p
            className="text-sm italic leading-relaxed"
            style={{
              color: isDark
                ? "rgba(139, 92, 246, 0.7)"
                : "rgba(139, 92, 246, 0.8)",
            }}
          >
            &ldquo;{experience.impact}&rdquo;
          </p>
        </motion.div>
      </motion.div>

      {/* Rhythmic Divider (except last item) */}
      {!isLast && (
        <motion.div
          className="mt-8 ml-10"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isInView ? { scaleX: 1, opacity: 0.3 } : { scaleX: 0, opacity: 0 }
          }
          transition={{ delay: index * 0.15 + 0.5, duration: 0.4 }}
          style={{
            height: "1px",
            width: "40px",
            background: isDark
              ? "rgba(139, 92, 246, 0.3)"
              : "rgba(139, 92, 246, 0.2)",
            transformOrigin: "left",
          }}
        />
      )}
    </motion.div>
  );
}
