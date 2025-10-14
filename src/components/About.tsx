"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isDark, setIsDark] = useState(false);

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

    return () => observer.disconnect();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section id="about" ref={ref} className="py-32 px-6 relative">
      {/* Radial gradient hairline divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-3xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ delay: 0 }}
        >
          <p
            className="text-xs uppercase tracking-wider mb-6 font-medium"
            style={{ color: isDark ? "rgba(255, 255, 255, 0.5)" : "#6b6b6b" }}
          >
            About Me
          </p>
        </motion.div>

        {/* Main Heading with custom accent */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-12 leading-tight"
            style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
          >
            I build interfaces that{" "}
            <span className="text-gradient-about">feel effortless.</span>
          </h2>
        </motion.div>

        {/* Paragraph 1: Mission */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "#6b6b6b" }}
          >
            I&apos;m a frontend engineer obsessed with the details—the kind that
            make interfaces feel alive. Every pixel, interaction, and transition
            is a chance to create something memorable. I don&apos;t just ship
            features; I craft experiences that people actually enjoy using.
          </p>
        </motion.div>

        {/* Paragraph 2: Values */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: isDark ? "rgba(255, 255, 255, 0.6)" : "#6b6b6b" }}
          >
            Driven by curiosity. I spend my time exploring Web3 protocols,
            contributing to open-source tools, and teaching what I learn. I
            believe the best work comes from sharing knowledge and staying
            uncomfortable with what you know.
          </p>
        </motion.div>

        {/* Optional bottom micro-divider */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
