"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { projects } from "@/lib/data";

export default function Projects() {
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
      id="projects"
      ref={ref}
      className="py-32 px-6 border-t"
      style={{
        borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#eaeaea",
        background: isDark
          ? "linear-gradient(to bottom, #0B0C10 0%, #111214 100%)"
          : "#ffffff",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2
            className="text-sm uppercase tracking-wider mb-6 font-medium"
            style={{
              color: isDark
                ? "rgba(139, 92, 246, 0.7)"
                : "rgba(139, 92, 246, 0.8)",
            }}
          >
            Selected Work
          </h2>
          <h3
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
          >
            Projects
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={project.featured ? "md:col-span-2" : ""}
            >
              <ProjectCard project={project} isDark={isDark} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  isDark,
}: {
  project: (typeof projects)[0];
  isDark: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${
          isDark
            ? isHovered
              ? "rgba(139, 92, 246, 0.3)"
              : "rgba(255, 255, 255, 0.06)"
            : isHovered
            ? "rgba(139, 92, 246, 0.3)"
            : "#eaeaea"
        }`,
        background: isDark
          ? "rgba(255, 255, 255, 0.02)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        boxShadow: isDark
          ? isHovered
            ? "0 8px 32px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.1) inset"
            : "0 4px 16px rgba(0, 0, 0, 0.4)"
          : isHovered
          ? "0 8px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.05) inset"
          : "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div
          className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
          style={{
            background: isDark
              ? "rgba(139, 92, 246, 0.15)"
              : "rgba(139, 92, 246, 0.1)",
            border: `1px solid ${
              isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)"
            }`,
            color: isDark ? "#c4a7ff" : "#8B5CF6",
            boxShadow: isDark
              ? "0 0 20px rgba(139, 92, 246, 0.2)"
              : "0 2px 8px rgba(139, 92, 246, 0.15)",
          }}
        >
          ✨ Featured
        </div>
      )}

      {/* Project Image Placeholder */}
      <div
        className="aspect-video relative overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.02) 100%)"
            : "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.12) 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: isHovered ? 0 : 12,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-20 h-20 rounded-2xl"
            style={{
              border: `1px solid ${
                isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)"
              }`,
              background: isDark
                ? "rgba(139, 92, 246, 0.05)"
                : "rgba(255, 255, 255, 0.5)",
              boxShadow: isDark
                ? "0 0 30px rgba(139, 92, 246, 0.2)"
                : "0 4px 16px rgba(139, 92, 246, 0.1)",
            }}
          />
        </div>

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isDark
              ? "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)"
              : "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="p-6"
        style={{
          background: isDark
            ? "rgba(255, 255, 255, 0.01)"
            : "rgba(255, 255, 255, 0.5)",
        }}
      >
        <h4
          className="text-xl font-semibold mb-2 transition-colors duration-300"
          style={{
            color: isHovered ? "#8B5CF6" : isDark ? "#ffffff" : "#0f0f0f",
          }}
        >
          {project.title}
        </h4>
        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "#6b6b6b" }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{
                background: isDark
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(139, 92, 246, 0.08)",
                color: isDark ? "#c4a7ff" : "#8B5CF6",
                border: `1px solid ${
                  isDark
                    ? "rgba(139, 92, 246, 0.2)"
                    : "rgba(139, 92, 246, 0.15)"
                }`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links with enhanced CTA */}
        <div
          className="flex items-center gap-6 pt-5"
          style={{
            borderTop: `1px solid ${
              isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"
            }`,
          }}
        >
          <ProjectLink
            href={project.link}
            isDark={isDark}
            primary
            icon={
              <motion.svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: isHovered ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </motion.svg>
            }
          >
            View Project
          </ProjectLink>
          <ProjectLink href={project.github} isDark={isDark}>
            GitHub
          </ProjectLink>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectLink({
  href,
  isDark,
  primary,
  children,
  icon,
}: {
  href: string;
  isDark: boolean;
  primary?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ x: primary ? 2 : 0 }}
      className="text-sm font-medium transition-all duration-200 flex items-center gap-1.5 relative group"
      style={{
        color: primary
          ? "#8B5CF6"
          : isDark
          ? "rgba(255, 255, 255, 0.5)"
          : "#6b6b6b",
      }}
    >
      {children}
      {icon}

      {/* Underline animation */}
      <motion.span
        className="absolute -bottom-1 left-0 h-px bg-current"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? "100%" : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.a>
  );
}
