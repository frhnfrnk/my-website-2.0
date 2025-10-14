/**
 * Refined Mobile Navigation
 * Premium FAB design with elegant animations
 * Consistent with desktop SideNav aesthetic
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Briefcase, User, Mail, Code } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#hero", icon: <Home className="w-5 h-5" strokeWidth={1.5} /> },
  { label: "Work", href: "#projects", icon: <Briefcase className="w-5 h-5" strokeWidth={1.5} /> },
  { label: "About", href: "#about", icon: <User className="w-5 h-5" strokeWidth={1.5} /> },
  {
    label: "Experience",
    href: "#experience",
    icon: <Code className="w-5 h-5" strokeWidth={1.5} />,
  },
  { label: "Contact", href: "#contact", icon: <Mail className="w-5 h-5" strokeWidth={1.5} /> },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 lg:hidden">
      {/* Menu Items - Stacked Above FAB */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-20 right-0 flex flex-col gap-2 min-w-[160px]"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center gap-3 px-4 py-3
                  bg-white/40 dark:bg-white/5
                  backdrop-blur-xl
                  border border-white/60 dark:border-white/10
                  rounded-2xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                  ring-1 ring-black/[0.02] dark:ring-white/[0.02]
                  text-neutral-800 dark:text-neutral-200
                  hover:bg-white/60 dark:hover:bg-white/10
                  hover:border-[#8B5CF6]/20
                  active:scale-95
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20"
                >
                  {item.icon}
                  <span className="text-sm font-medium tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium FAB Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 flex items-center justify-center
        bg-white/40 dark:bg-white/5
        backdrop-blur-xl
        border border-white/60 dark:border-white/10
        rounded-full
        shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        ring-1 ring-black/[0.02] dark:ring-white/[0.02]
        text-neutral-800 dark:text-neutral-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20
        active:scale-95
        transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Accent ring on open */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 pointer-events-none"
          initial={{ borderColor: "rgba(139, 92, 246, 0)" }}
          animate={{
            borderColor: isOpen
              ? "rgba(139, 92, 246, 0.2)"
              : "rgba(139, 92, 246, 0)",
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      {/* Premium Backdrop with Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>

      {/* Ambient glow on open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 -z-20 rounded-full blur-2xl"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
