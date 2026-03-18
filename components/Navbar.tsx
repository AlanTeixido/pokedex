"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/",        label: "Pokédex" },
  { href: "/compare", label: "Compare" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className="relative"
        style={{
          background: "var(--navbar-bg)",
          borderBottom: "1px solid var(--navbar-border)",
          backdropFilter: "blur(16px)",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-4">
            <Link
              href="https://alanteixido.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-black text-sm transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  boxShadow: "0 0 16px rgba(99,102,241,0.4)",
                  letterSpacing: "0.02em",
                  color: "#fff",
                }}
              >
                AT.
              </div>
              <span
                className="hidden sm:block text-xs font-medium tracking-widest uppercase transition-colors group-hover:text-[var(--text-primary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                Alan Teixidó
              </span>
            </Link>

            <div
              className="hidden sm:block w-px h-5"
              style={{ background: "var(--border-medium)" }}
            />

            <Link
              href="/"
              className="flex items-center gap-2 font-display font-bold text-lg tracking-wider"
            >
              <span
                style={{
                  background: "linear-gradient(135deg,#a78bfa,#6366f1,#38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                POKÉDEX
              </span>
            </Link>
          </div>

          {/* Right side: Nav Links + Theme Toggle */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200"
                  style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(99,102,241,0.15)" }}
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <motion.button
              onClick={toggle}
              whileTap={{ scale: 0.9 }}
              className="ml-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: isLight
                  ? "rgba(99,102,241,0.12)"
                  : "rgba(255,255,255,0.06)",
                border: isLight
                  ? "1px solid rgba(99,102,241,0.2)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: isLight ? "#6366f1" : "#8b9ab8",
              }}
              aria-label="Toggle theme"
            >
              {isLight ? (
                /* Moon icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                /* Sun icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </motion.button>
          </div>
        </nav>
      </div>
    </header>
  );
}
