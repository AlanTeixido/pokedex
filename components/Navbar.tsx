"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/",        label: "Pokédex" },
  { href: "/compare", label: "Compare" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className="relative"
        style={{
          background: "linear-gradient(180deg,rgba(8,11,20,0.98) 0%,rgba(8,11,20,0.92) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
                }}
              >
                AT.
              </div>
              <span className="hidden sm:block text-xs text-[#8b9ab8] font-medium tracking-widest uppercase transition-colors group-hover:text-white">
                Alan Teixidó
              </span>
            </Link>

            <div
              className="hidden sm:block w-px h-5"
              style={{ background: "rgba(255,255,255,0.1)" }}
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

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200"
                  style={{
                    color: isActive ? "#f0f4ff" : "#8b9ab8",
                  }}
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
          </div>
        </nav>
      </div>
    </header>
  );
}
