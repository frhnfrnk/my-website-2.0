"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useNavHeight } from "@/hooks/useNavHeight";

// Dynamic import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(() => import("./ThemeToggle"), {
  ssr: false,
  loading: () => <div className="w-8 h-8" />,
});

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Track navbar height and set CSS variable
  useNavHeight(navRef);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const navItems = [
    { name: "Work", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-1/2 -translate-x-1/2 z-[100] px-7 py-3.5 rounded-full transition-all duration-300 isolation-isolate ${
        isScrolled ? "glass glass-border shadow-premium" : "glass glass-border"
      }`}
      style={{
        top: "max(1.5rem, env(safe-area-inset-top, 1.5rem))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: isDark
          ? "rgba(11, 12, 16, 0.7)"
          : "rgba(255, 255, 255, 0.7)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center gap-8">
        {/* Logo */}
        <a
          href="#hero"
          className="font-semibold text-sm tracking-tight hover:text-accent transition-colors duration-200"
          style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
        >
          FF
        </a>

        {/* Divider */}
        <div
          className="w-px h-4 transition-colors duration-200"
          style={{
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          }}
        />

        {/* Nav Items */}
        <ul className="flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="relative text-sm transition-colors duration-200 group"
                style={{
                  color: isDark ? "rgba(255, 255, 255, 0.5)" : "#6b6b6b",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "#ffffff" : "#0f0f0f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark
                    ? "rgba(255, 255, 255, 0.5)"
                    : "#6b6b6b";
                }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-200 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div
          className="w-px h-4 transition-colors duration-200"
          style={{
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          }}
        />

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}
