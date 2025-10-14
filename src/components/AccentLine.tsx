"use client";

import { motion } from "framer-motion";

interface AccentLineProps {
  delay?: number;
  accentColor?: string;
  width?: number; // in pixels
  height?: number; // in pixels
  isDark: boolean;
}

export default function AccentLine({
  delay = 0.15,
  accentColor = "#8B5CF6",
  width = 64,
  height = 2,
  isDark,
}: AccentLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="relative mx-auto"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transformOrigin: "center",
      }}
    >
      {/* Main accent line */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
            : `linear-gradient(90deg, transparent, ${accentColor}CC, transparent)`,
        }}
      />

      {/* Subtle glow effect */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`
            : `linear-gradient(90deg, transparent, ${accentColor}30, transparent)`,
          filter: "blur(4px)",
        }}
      />
    </motion.div>
  );
}
