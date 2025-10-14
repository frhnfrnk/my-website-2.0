"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  ariaLabel?: string;
}

export interface IconSidebarProps {
  items: SidebarItem[];
  position?: "left" | "right";
  className?: string;
}

/**
 * IconSidebar - CSS-only version (no Framer Motion)
 * Lighter weight alternative using pure CSS transitions
 */
export default function IconSidebarCSS({
  items,
  position = "right",
  className = "",
}: IconSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const positionClasses =
    position === "left" ? "left-6 right-auto" : "right-6 left-auto";

  return (
    <nav
      className={`fixed ${positionClasses} top-1/2 -translate-y-1/2 z-50 hidden lg:block ${className}`}
      aria-label="Icon navigation"
      style={{
        animation: "icon-sidebar-fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <li
              key={item.href}
              className="group relative after:absolute after:inset-y-0 after:-left-4 after:w-6 after:content-['']"
            >
              <Link
                href={item.href}
                aria-label={item.ariaLabel || item.label}
                className={`
                  flex size-14 items-center justify-center rounded-2xl
                  shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_8px_20px_rgba(0,0,0,.08)]
                  dark:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_20px_rgba(0,0,0,.4)]
                  transition-all duration-200 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--icon]/30
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${
                    active
                      ? "bg-[--tile-active] ring-1 ring-black/5 dark:ring-white/10 scale-[1.02]"
                      : "bg-[--tile] hover:bg-[--tile-hover] hover:scale-[1.03]"
                  }
                `}
                style={
                  {
                    "--tile": active
                      ? "var(--tile-active-color, #E7E2D6)"
                      : "var(--tile-color, #F2EFE6)",
                    "--tile-hover": "var(--tile-hover-color, #ECE8DD)",
                    "--tile-active": "var(--tile-active-color, #E7E2D6)",
                  } as React.CSSProperties
                }
              >
                <Icon
                  size={21}
                  className={`
                    transition-all duration-200
                    ${
                      active
                        ? "text-[--icon-strong]"
                        : "text-[--icon] group-hover:text-[--icon-strong] group-focus:text-[--icon-strong]"
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
              </Link>

              {/* Label Pill - CSS only animation, positioned to LEFT */}
              <span
                className={`
                  absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none
                  opacity-0 translate-x-1 transition-all duration-220 ease-out
                  group-hover:opacity-100 group-hover:translate-x-0 
                  group-focus-within:opacity-100 group-focus-within:translate-x-0
                `}
              >
                <span
                  className="px-3 py-1 text-sm font-medium rounded-xl bg-[--pill] text-[--pill-fg] border border-black/5 dark:border-white/10 shadow-sm whitespace-nowrap"
                  style={
                    {
                      "--pill": "var(--pill-color, #EFECE3)",
                      "--pill-fg": "var(--pill-fg-color, #1A1A1A)",
                    } as React.CSSProperties
                  }
                >
                  {item.label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        @keyframes icon-sidebar-fade-in {
          from {
            opacity: 0;
            transform: translate(
              ${position === "right" ? "20px" : "-20px"},
              -50%
            );
          }
          to {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          nav {
            animation: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
