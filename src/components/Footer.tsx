"use client";

import { useState, useEffect } from "react";

export default function Footer() {
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
    <footer className="relative">
      {/* Hairline divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.1) 80%, transparent)"
            : "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05) 20%, rgba(0, 0, 0, 0.05) 80%, transparent)",
        }}
      />

      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
          {/* Copyright */}
          <p
            className="text-sm"
            style={{
              color: isDark
                ? "rgba(163, 163, 163, 1)"
                : "rgba(115, 115, 115, 1)",
            }}
          >
            © {new Date().getFullYear()} Farhan Franaka. All rights reserved.
          </p>

          {/* Tech Stack */}
          <p
            className="text-sm flex items-center gap-2"
            style={{
              color: isDark
                ? "rgba(163, 163, 163, 1)"
                : "rgba(115, 115, 115, 1)",
            }}
          >
            Built with
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-all duration-200 hover:underline hover:underline-offset-4"
              style={{
                color: isDark
                  ? "rgba(163, 163, 163, 1)"
                  : "rgba(115, 115, 115, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#8B5CF6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark
                  ? "rgba(163, 163, 163, 1)"
                  : "rgba(115, 115, 115, 1)";
              }}
              aria-label="Next.js framework website"
            >
              Next.js
            </a>
            &
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-all duration-200 hover:underline hover:underline-offset-4"
              style={{
                color: isDark
                  ? "rgba(163, 163, 163, 1)"
                  : "rgba(115, 115, 115, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#8B5CF6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark
                  ? "rgba(163, 163, 163, 1)"
                  : "rgba(115, 115, 115, 1)";
              }}
              aria-label="Tailwind CSS framework website"
            >
              Tailwind CSS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
