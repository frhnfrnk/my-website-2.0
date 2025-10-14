"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { socialLinks } from "@/lib/data";
import { toast } from "@/lib/toast";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isDark, setIsDark] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.email);
      toast("Email copied to clipboard!", "success");
    } catch {
      toast("Failed to copy email", "error");
    }
  };

  const mailtoLink = `mailto:${socialLinks.email}?subject=${encodeURIComponent(
    "Project Inquiry – Farhan Portfolio"
  )}&body=${encodeURIComponent(
    "Hi Farhan,\n\nI'd love to discuss a potential project with you.\n\n"
  )}`;

  // Animation variants with reduced motion support
  const getVariants = (delay = 0) => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
  });

  const socialIconsVariants = {
    hidden: {},
    visible: prefersReducedMotion
      ? {}
      : {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.6,
          },
        },
  };

  const iconVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 px-6"
      style={{
        background: isDark
          ? "linear-gradient(to bottom, #0B0C10 0%, #111214 50%, #0B0C10 100%)"
          : "linear-gradient(to bottom, #ffffff 0%, rgba(139, 92, 246, 0.02) 50%, #ffffff 100%)",
      }}
    >
      {/* Hairline divider at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.1) 80%, transparent)"
            : "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05) 20%, rgba(0, 0, 0, 0.05) 80%, transparent)",
        }}
      />

      {/* Dark mode subtle radial gradient */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 800px 600px at 50% 50%, rgba(139, 92, 246, 0.04), transparent 70%)",
            mixBlendMode: "normal",
          }}
        />
      )}

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Heading */}
        <motion.div
          variants={getVariants(0)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2
            className="text-sm uppercase tracking-wider mb-6 font-medium"
            style={{
              color: isDark
                ? "rgba(139, 92, 246, 0.7)"
                : "rgba(139, 92, 246, 0.8)",
            }}
          >
            Get In Touch
          </h2>
          <h3
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
          >
            Let&apos;s work together
          </h3>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={getVariants(0.15)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-lg max-w-2xl mx-auto mb-12"
          style={{
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#6b6b6b",
          }}
        >
          I&apos;m always interested in hearing about new projects and
          opportunities. Whether you have a question or just want to say hi,
          feel free to reach out.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={getVariants(0.3)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {/* Primary: Send Email */}
          <a
            href={mailtoLink}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: isDark ? "#ffffff" : "#0f0f0f",
              color: isDark ? "#0a0a0a" : "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = isDark
                ? "0 12px 40px rgba(255, 255, 255, 0.15)"
                : "0 12px 40px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label="Send email to Farhan Franaka"
          >
            Send Email
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>

          {/* Secondary: Copy Email */}
          <button
            onClick={copyEmail}
            className="group relative inline-flex items-center gap-2 px-6 py-4 rounded-full text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.04)",
              color: isDark ? "#ffffff" : "#0f0f0f",
              border: `1px solid ${
                isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
              }`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.06)";
              e.currentTarget.style.borderColor = isDark
                ? "rgba(139, 92, 246, 0.3)"
                : "rgba(139, 92, 246, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)";
            }}
            aria-label="Copy email address to clipboard"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Email
          </button>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          variants={socialIconsVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex items-center justify-center gap-6"
        >
          <SocialIcon
            href={socialLinks.github}
            label="GitHub"
            isDark={isDark}
            variants={iconVariants}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </SocialIcon>

          <SocialIcon
            href={socialLinks.linkedin}
            label="LinkedIn"
            isDark={isDark}
            variants={iconVariants}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialIcon>

          <SocialIcon
            href={socialLinks.twitter}
            label="Twitter"
            isDark={isDark}
            variants={iconVariants}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialIcon>
        </motion.div>
      </div>
    </section>
  );
}

// Social Icon Component
function SocialIcon({
  href,
  label,
  isDark,
  children,
  variants,
}: {
  href: string;
  label: string;
  isDark: boolean;
  children: React.ReactNode;
  variants: {
    hidden: { opacity: number; scale?: number };
    visible: {
      opacity: number;
      scale?: number;
      transition?: {
        duration: number;
        ease: [number, number, number, number];
      };
    };
  };
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variants={variants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group transition-all duration-300 rounded-xl p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        color: isHovered
          ? "#8B5CF6"
          : isDark
          ? "rgba(255, 255, 255, 0.6)"
          : "#6b6b6b",
        backgroundColor: isHovered
          ? isDark
            ? "rgba(139, 92, 246, 0.1)"
            : "rgba(139, 92, 246, 0.08)"
          : "transparent",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
      aria-label={`Visit ${label} profile`}
      title={label}
    >
      {children}

      {/* Tooltip */}
      <span
        className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.8)",
          color: isDark ? "#ffffff" : "#ffffff",
          backdropFilter: "blur(8px)",
        }}
      >
        {label}
      </span>
    </motion.a>
  );
}
