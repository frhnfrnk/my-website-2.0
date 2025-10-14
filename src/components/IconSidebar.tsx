"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const ThemeToggleV3 = dynamic(() => import("./ThemeToggleV3"), {
  ssr: false,
});
export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  ariaLabel?: string;
}

export type HoverVariant = "soft-press" | "squircle-morph" | "cursor-parallax";

export interface IconSidebarProps {
  items: SidebarItem[];
  position?: "left" | "right";
  className?: string;
  hoverVariant?: HoverVariant;
  showThemeToggle?: boolean;
}

export default function IconSidebar({
  items,
  position = "right",
  className = "",
  hoverVariant = "cursor-parallax",
  showThemeToggle = false,
}: IconSidebarProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const positionClasses =
    position === "left" ? "left-6 right-auto" : "right-6 left-auto";

  return (
    <motion.nav
      initial={{ opacity: 0, x: position === "right" ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`themed-transition fixed ${positionClasses} top-1/2 -translate-y-1/2 z-50 hidden lg:block ${className}`}
      aria-label="Icon navigation"
    >
      <div className="flex flex-col gap-6">
        {/* Theme Toggle at top */}
        {showThemeToggle && <ThemeToggleV3 />}

        {/* Navigation items */}
        <ul className="flex flex-col gap-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <SidebarItem
                key={item.href}
                item={item}
                icon={Icon}
                active={active}
                isHovered={hoveredIndex === index}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                variant={hoverVariant}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}

// Separate component for each sidebar item
interface SidebarItemProps {
  item: SidebarItem;
  icon: LucideIcon;
  active: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  variant: HoverVariant;
  prefersReducedMotion: boolean;
}

function SidebarItem({
  item,
  icon: Icon,
  active,
  isHovered,
  onHoverStart,
  onHoverEnd,
  variant,
  prefersReducedMotion,
}: SidebarItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Parallax motion values
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const translateX = useSpring(useMotionValue(0), {
    stiffness: 220,
    damping: 18,
  });
  const translateY = useSpring(useMotionValue(0), {
    stiffness: 220,
    damping: 18,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (variant !== "cursor-parallax" || prefersReducedMotion || !ref.current)
      return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    // Micro movements (max 2px) and subtle tilt (max 1.5deg)
    translateX.set(offsetX * 2);
    translateY.set(offsetY * 2);
    rotateY.set(offsetX * 1.5);
    rotateX.set(-offsetY * 1.5);
  };

  const handleMouseLeave = () => {
    onHoverEnd();
    if (variant === "cursor-parallax") {
      translateX.set(0);
      translateY.set(0);
      rotateX.set(0);
      rotateY.set(0);
    }
  };

  // Variant A: Soft-Press + Halo (default)
  const softPressClasses = `
    group relative after:absolute after:inset-y-0 after:-left-4 after:w-6 after:content-['']
  `;

  const softPressTileClasses = `
    flex size-14 items-center justify-center rounded-2xl
    shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_8px_20px_rgba(0,0,0,.06)]
    dark:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_20px_rgba(0,0,0,.4)]
    transition-all duration-200 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--icon]/30
    focus-visible:ring-offset-2 focus-visible:ring-offset-background
    ${
      active
        ? "bg-[--tile-active] ring-1 ring-black/5 dark:ring-white/10 scale-[1.02]"
        : "bg-[--tile] hover:bg-[--tile-hover] hover:scale-[0.985] hover:-translate-y-[1px] hover:ring-1 hover:ring-[--icon]/15 hover:shadow-[0_10px_24px_rgba(0,0,0,.08)] dark:hover:shadow-[0_10px_24px_rgba(0,0,0,.6)]"
    }
  `;

  const softPressIconClasses = `
    transition-all duration-200
    ${
      active
        ? "text-[--icon-strong]"
        : "text-[--icon] group-hover:text-[--icon-strong] group-hover:-translate-y-[1px] group-focus:text-[--icon-strong]"
    }
  `;

  // Variant B: Squircle Morph
  const squircleMorphClasses = `
    group relative after:absolute after:inset-y-0 after:-left-4 after:w-6 after:content-['']
  `;

  const squircleMorphTileClasses = `
    flex size-14 items-center justify-center
    shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_8px_20px_rgba(0,0,0,.06)]
    dark:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_20px_rgba(0,0,0,.4)]
    transition-all duration-200 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--icon]/30
    focus-visible:ring-offset-2 focus-visible:ring-offset-background
    ${
      active
        ? "rounded-[22px] bg-[--tile-active] ring-1 ring-black/5 dark:ring-white/10"
        : "rounded-[18px] hover:rounded-[22px] bg-[--tile] hover:bg-[--tile-hover] hover:bg-gradient-to-b hover:from-white/6 hover:to-black/0 dark:hover:from-white/4"
    }
  `;

  // Variant C: Cursor Parallax (uses Framer Motion)
  if (variant === "cursor-parallax" && !prefersReducedMotion) {
    return (
      <li className="group relative after:absolute after:inset-y-0 after:-left-4 after:w-6 after:content-['']">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1000,
          }}
        >
          <motion.a
            ref={ref}
            href={item.href}
            aria-label={item.ariaLabel || item.label}
            className={`
              flex size-14 items-center justify-center rounded-2xl
              shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_8px_20px_rgba(0,0,0,.06)]
              dark:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_20px_rgba(0,0,0,.4)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--icon]/30
              focus-visible:ring-offset-2 focus-visible:ring-offset-background
              ${
                active
                  ? "bg-[--tile-active] ring-1 ring-black/5 dark:ring-white/10"
                  : "bg-[--tile]"
              }
            `}
            style={
              {
                "--tile": active
                  ? "var(--tile-active-color, #E7E2D6)"
                  : "var(--tile-color, #F2EFE6)",
                "--tile-hover": "var(--tile-hover-color, #ECE8DD)",
              } as React.CSSProperties
            }
            whileHover={{
              scale: 0.985,
              y: -1,
              backgroundColor: "var(--tile-hover-color, #ECE8DD)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={onHoverStart}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                x: translateX,
                y: translateY,
              }}
            >
              <Icon
                size={21}
                className={`
                  transition-colors duration-200
                  ${
                    active
                      ? "text-[--icon-strong]"
                      : "text-[--icon] group-hover:text-[--icon-strong]"
                  }
                `}
                strokeWidth={active ? 2.2 : 2}
                style={
                  {
                    "--icon": "var(--icon-color, #8B857C)",
                    "--icon-strong": "var(--icon-strong-color, #111111)",
                  } as React.CSSProperties
                }
              />
            </motion.div>
          </motion.a>
        </motion.div>

        {/* Label Pill - LEFT side */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div
                className="px-3 py-1 text-sm font-medium rounded-xl bg-[--pill] text-[--pill-fg] border border-black/5 dark:border-white/10 shadow-sm whitespace-nowrap"
                style={
                  {
                    "--pill": "var(--pill-color, #EFECE3)",
                    "--pill-fg": "var(--pill-fg-color, #1A1A1A)",
                  } as React.CSSProperties
                }
              >
                {item.label}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }

  // Variant A (default) or B (squircle-morph) - CSS-based
  const containerClasses =
    variant === "squircle-morph" ? squircleMorphClasses : softPressClasses;
  const tileClasses =
    variant === "squircle-morph"
      ? squircleMorphTileClasses
      : softPressTileClasses;
  const iconClasses =
    variant === "soft-press"
      ? softPressIconClasses
      : "transition-all duration-200";

  return (
    <li className={containerClasses}>
      <Link
        href={item.href}
        aria-label={item.ariaLabel || item.label}
        className={tileClasses}
        style={
          {
            "--tile": active
              ? "var(--tile-active-color, #E7E2D6)"
              : "var(--tile-color, #F2EFE6)",
            "--tile-hover": "var(--tile-hover-color, #ECE8DD)",
            "--icon": "var(--icon-color, #8B857C)",
          } as React.CSSProperties
        }
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <Icon
          size={21}
          className={iconClasses}
          strokeWidth={active ? 2.2 : 2}
          style={
            {
              color: active
                ? "var(--icon-strong-color, #111111)"
                : "var(--icon-color, #8B857C)",
              "--icon": "var(--icon-color, #8B857C)",
              "--icon-strong": "var(--icon-strong-color, #111111)",
            } as React.CSSProperties
          }
        />
      </Link>

      {/* Label Pill - LEFT side */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div
              className="px-3 py-1 text-sm font-medium rounded-xl bg-[--pill] text-[--pill-fg] border border-black/5 dark:border-white/10 shadow-sm whitespace-nowrap"
              style={
                {
                  "--pill": "var(--pill-color, #EFECE3)",
                  "--pill-fg": "var(--pill-fg-color, #1A1A1A)",
                } as React.CSSProperties
              }
            >
              {item.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
