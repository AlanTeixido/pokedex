"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import {
  fetchPokemon, getPokemonOfficialArtUrl,
  formatName, formatPokemonId,
} from "@/lib/api";
import { getPrimaryTypeColor } from "@/lib/typeColors";
import { TypeBadge } from "./TypeBadge";
import { Pokemon } from "@/lib/types";
import { TOTAL_POKEMON } from "@/lib/constants";

function getRandomId() {
  return Math.floor(Math.random() * TOTAL_POKEMON) + 1;
}

/* ─── Sparkle particle ───────────────────────────────────────────────────── */
interface SparkleProps {
  color: string;
  style: React.CSSProperties;
  delay: number;
  duration: number;
  size: number;
}

function Sparkle({ color, style, delay, duration, size }: SparkleProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{
        scale:   [0, 1.4, 0, 1.2, 0],
        opacity: [0, 0.9, 0, 0.7, 0],
        rotate:  [0, 45, 90, 135, 180],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─── Sparkles cluster around the card ─────────────────────────────────── */
const SPARKLE_POSITIONS = [
  { left: "8%",  top: "12%", delay: 0.0, duration: 2.8, size: 5 },
  { left: "88%", top: "20%", delay: 0.6, duration: 3.2, size: 4 },
  { left: "12%", top: "68%", delay: 1.1, duration: 2.6, size: 6 },
  { left: "85%", top: "72%", delay: 0.3, duration: 3.0, size: 4 },
  { left: "50%", top: "4%",  delay: 0.9, duration: 2.4, size: 5 },
  { left: "92%", top: "46%", delay: 1.5, duration: 3.4, size: 3 },
  { left: "4%",  top: "40%", delay: 0.5, duration: 2.9, size: 3 },
  { left: "60%", top: "90%", delay: 1.8, duration: 2.7, size: 4 },
];

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface HeroSectionProps {
  search: string;
  onSearch: (v: string) => void;
}

const TITLE_LETTERS = ["P", "O", "K", "É", "D", "E", "X"];
// Slightly varying opacity per letter for a depth effect
const LETTER_DEPTHS = [1, 0.82, 0.88, 1, 0.85, 0.90, 0.96];

const letterVariants = {
  hidden:  { opacity: 0, y: 36, skewY: 8 },
  visible: (i: number) => ({
    opacity: LETTER_DEPTHS[i] ?? 1,
    y: 0,
    skewY: 0,
    transition: {
      delay: 0.25 + i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export function HeroSection({ search, onSearch }: HeroSectionProps) {
  const [featuredId] = useState<number>(getRandomId);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { data: pokemon } = useSWR<Pokemon>(
    `pokemon-${featuredId}`,
    () => fetchPokemon(featuredId)
  );

  const primaryColor = pokemon
    ? getPrimaryTypeColor(pokemon.types)
    : { hex: "#6366f1", glow: "rgba(99,102,241,0.3)", darkBg: "", label: "" };
  const artUrl = pokemon ? getPokemonOfficialArtUrl(pokemon.id) : null;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value),
    [onSearch]
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{
        /* Dark mesh gradient — multiple overlapping radial gradients */
        background: [
          "radial-gradient(ellipse at 15% 60%, rgba(99,102,241,0.12) 0%, transparent 50%)",
          "radial-gradient(ellipse at 85% 15%, rgba(139,92,246,0.09) 0%, transparent 45%)",
          "radial-gradient(ellipse at 50% 110%, rgba(56,189,248,0.07) 0%, transparent 55%)",
          "radial-gradient(ellipse at 70% 80%, rgba(99,102,241,0.06) 0%, transparent 40%)",
          "var(--bg-secondary)",
        ].join(", "),
        paddingTop: "3.5rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Gradient fade into main content */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bg-primary))",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

          {/* ─── Left: text + search ─────────────────────────────────────── */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                color: "#a78bfa",
                boxShadow: "0 0 20px rgba(99,102,241,0.1)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: "#a78bfa" }} />
              {TOTAL_POKEMON} Pokémon · Gen I–IX
            </motion.div>

            {/* Staggered letter title with depth + glow */}
            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 tracking-wider"
              style={{
                lineHeight: 1.05,
                filter: "drop-shadow(0 0 28px rgba(99,102,241,0.55)) drop-shadow(0 0 60px rgba(167,139,250,0.25))",
              }}
            >
              {TITLE_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block hero-title-letter"
                  style={{
                    background: "linear-gradient(135deg,#f0f4ff 0%,#c4b5fd 25%,#a78bfa 45%,#6366f1 65%,#38bdf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-9"
              style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
            >
              Explore every Pokémon from every generation. Search, filter, compare and discover.
            </motion.p>

            {/* Hero search bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.45 }}
              className="relative max-w-md mx-auto lg:mx-0"
            >
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search Pokémon by name or ID…"
                className="w-full pl-12 pr-12 py-4 rounded-2xl text-sm font-medium outline-none"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-input)",
                  color: "var(--text-primary)",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `1px solid ${primaryColor.hex}99`;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor.hex}18, 0 4px 32px rgba(0,0,0,0.2)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid var(--border-input)";
                  e.currentTarget.style.boxShadow = "0 4px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)";
                }}
              />
              {search && (
                <button
                  onClick={() => onSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ color: "var(--text-secondary)", background: "var(--border-medium)" }}
                >
                  ×
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* ─── Right: featured Pokémon card ───────────────────────────── */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.75, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {pokemon && artUrl ? (
              <Link href={`/pokemon/${pokemon.name}`} className="group block">
                {/* Shimmer border wrapper */}
                <div
                  className="featured-shimmer-border"
                  style={{
                    "--shimmer-c1": primaryColor.hex,
                    "--shimmer-c2": "#a78bfa",
                  } as React.CSSProperties}
                >
                  <div
                    className="relative flex flex-col items-center justify-center p-7 cursor-pointer overflow-hidden"
                    style={{
                      width: 300,
                      height: 360,
                      borderRadius: "22.5px",
                      background: `linear-gradient(155deg, var(--bg-card) 0%, ${primaryColor.hex}18 50%, ${primaryColor.hex}28 100%)`,
                      boxShadow: [
                        `0 0 0 1px ${primaryColor.hex}15`,
                        `0 12px 48px ${primaryColor.hex}28`,
                        `0 32px 80px ${primaryColor.hex}14`,
                        `0 0 120px ${primaryColor.hex}08`,
                      ].join(", "),
                    }}
                  >
                    {/* Sparkle particles */}
                    {SPARKLE_POSITIONS.map((s, i) => (
                      <Sparkle
                        key={i}
                        color={primaryColor.hex}
                        style={{ left: s.left, top: s.top }}
                        delay={s.delay}
                        duration={s.duration}
                        size={s.size}
                      />
                    ))}

                    {/* Big blurred circle behind sprite matching type color */}
                    <div
                      className="absolute rounded-full transition-opacity duration-500"
                      style={{
                        width: 220,
                        height: 220,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -58%)",
                        background: `radial-gradient(circle, ${primaryColor.hex}55 0%, ${primaryColor.hex}22 50%, transparent 75%)`,
                        filter: "blur(20px)",
                        opacity: imgLoaded ? 0.9 : 0.4,
                      }}
                    />

                    {/* Outer ring glow on hover */}
                    <div
                      className="absolute inset-[-1px] rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                      style={{ boxShadow: `0 0 60px ${primaryColor.hex}55, 0 0 120px ${primaryColor.hex}28` }}
                    />

                    {/* Official artwork */}
                    <div className="relative z-10 flex items-center justify-center animate-float" style={{ width: 192, height: 192 }}>
                      <Image
                        src={artUrl}
                        alt={pokemon.name}
                        width={192}
                        height={192}
                        className="object-contain drop-shadow-2xl group-hover:scale-108 transition-transform duration-500"
                        style={{
                          opacity: imgLoaded ? 1 : 0,
                          transition: "opacity 0.4s ease",
                          filter: `drop-shadow(0 8px 24px ${primaryColor.hex}60)`,
                        }}
                        onLoad={() => setImgLoaded(true)}
                        priority
                        unoptimized
                      />
                      {!imgLoaded && (
                        <div className="absolute inset-0 skeleton rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="relative z-10 text-center mt-2">
                      <div
                        className="text-xs font-bold font-display mb-1"
                        style={{ color: primaryColor.hex, opacity: 0.85, letterSpacing: "0.08em" }}
                      >
                        {formatPokemonId(pokemon.id)}
                      </div>
                      <div
                        className="text-lg font-bold tracking-wide mb-2.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatName(pokemon.name)}
                      </div>
                      <div className="flex gap-2 justify-center">
                        {pokemon.types.map(({ type }) => (
                          <TypeBadge key={type.name} type={type.name} size="sm" />
                        ))}
                      </div>
                    </div>

                    {/* "Featured" label */}
                    <div
                      className="absolute top-3.5 right-3.5 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase"
                      style={{
                        background: `${primaryColor.hex}22`,
                        border: `1px solid ${primaryColor.hex}50`,
                        color: primaryColor.hex,
                        boxShadow: `0 0 12px ${primaryColor.hex}30`,
                      }}
                    >
                      Featured
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                className="skeleton"
                style={{
                  width: 303,
                  height: 363,
                  borderRadius: 24,
                  border: "1px solid var(--border-subtle)",
                }}
              />
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
