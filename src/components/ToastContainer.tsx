"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToasts } from "@/lib/toast";
import { useEffect, useState } from "react";

export default function ToastContainer() {
  const toasts = useToasts();
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
    <div
      className="fixed z-[200] pointer-events-none"
      style={{
        top: "calc(var(--nav-h, 64px) + 2rem)",
        right: "1.5rem",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-3 pointer-events-auto rounded-2xl px-4 py-3 shadow-lg"
            style={{
              background: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(255, 255, 255, 0.95)",
              border: `1px solid ${
                isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"
              }`,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: isDark
                ? "0 8px 32px rgba(0, 0, 0, 0.5)"
                : "0 8px 32px rgba(0, 0, 0, 0.12)",
              minWidth: "280px",
              maxWidth: "400px",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              {toast.type === "success" && (
                <div
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Message */}
              <p
                className="text-sm font-medium"
                style={{
                  color: isDark ? "#ffffff" : "#0f0f0f",
                }}
              >
                {toast.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
