"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { fetchPokemon, getPokemonOfficialArtUrl, formatName, formatPokemonId } from "@/lib/api";
import { getPrimaryTypeColor } from "@/lib/typeColors";
import { TypeBadge } from "./TypeBadge";
import { Pokemon } from "@/lib/types";
import { TOTAL_POKEMON } from "@/lib/constants";

// Pick a stable random Pokémon per session
function getRandomId() {
  return Math.floor(Math.random() * TOTAL_POKEMON) + 1;
}

interface HeroSectionProps {
  search: string;
  onSearch: (v: string) => void;
}

export function HeroSection({ search, onSearch }: HeroSectionProps) {
  const [featuredId] = useState<number>(getRandomId);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { data: pokemon } = useSWR<Pokemon>(
    `pokemon-${featuredId}`,
    () => fetchPokemon(featuredId)
  );

  const primaryColor = pokemon ? getPrimaryTypeColor(pokemon.types) : { hex: "#6366f1", glow: "rgba(99,102,241,0.3)" };
  const artUrl = pokemon ? getPokemonOfficialArtUrl(pokemon.id) : null;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value),
    [onSearch]
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg,var(--bg-secondary) 0%,var(--bg-primary) 100%)",
        paddingTop: "3rem",
        paddingBottom: "2.5rem",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${primaryColor.hex}12`, transform: "translateY(-50%)" }}
      />
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(139,92,246,0.06)", transform: "translateY(-50%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

          {/* Left: text + search */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a78bfa",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{ background: "#a78bfa" }}
              />
              {TOTAL_POKEMON} Pokémon · Gen I–IX
            </div>

            {/* Glitch / shimmer title */}
            <h1 className="hero-title font-display text-5xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-wider">
              POKÉDEX
            </h1>

            <p className="text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8" style={{ color: "var(--text-secondary)" }}>
              Explore every Pokémon from every generation. Search, filter, compare and discover.
            </p>

            {/* Hero search bar */}
            <div className="relative max-w-md mx-auto lg:mx-0">
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
                  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `1px solid ${primaryColor.hex}88`;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor.hex}18, 0 4px 24px rgba(0,0,0,0.12)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid var(--border-input)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.12)";
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
            </div>
          </motion.div>

          {/* Right: featured Pokémon card */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {pokemon && artUrl ? (
              <Link href={`/pokemon/${pokemon.name}`} className="group block">
                <div
                  className="relative w-52 h-60 rounded-3xl flex flex-col items-center justify-center p-5 cursor-pointer overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, var(--bg-card) 0%, ${primaryColor.hex}18 100%)`,
                    border: `1px solid ${primaryColor.hex}30`,
                    boxShadow: `0 0 40px ${primaryColor.glow}, 0 0 0 1px ${primaryColor.hex}20`,
                  }}
                >
                  {/* Glow disc */}
                  <div
                    className="absolute w-36 h-36 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{ background: primaryColor.hex }}
                  />

                  {/* Official artwork */}
                  <div className="relative z-10 w-36 h-36 flex items-center justify-center animate-float">
                    <Image
                      src={artUrl}
                      alt={pokemon.name}
                      width={144}
                      height={144}
                      className="object-contain drop-shadow-2xl"
                      style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
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
                      className="text-xs font-bold font-display mb-0.5"
                      style={{ color: primaryColor.hex, opacity: 0.8 }}
                    >
                      {formatPokemonId(pokemon.id)}
                    </div>
                    <div
                      className="text-sm font-bold tracking-wide mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatName(pokemon.name)}
                    </div>
                    <div className="flex gap-1 justify-center">
                      {pokemon.types.map(({ type }) => (
                        <TypeBadge key={type.name} type={type.name} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* "Featured" label */}
                  <div
                    className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${primaryColor.hex}22`,
                      border: `1px solid ${primaryColor.hex}40`,
                      color: primaryColor.hex,
                    }}
                  >
                    Featured
                  </div>
                </div>
              </Link>
            ) : (
              /* skeleton */
              <div
                className="w-52 h-60 rounded-3xl skeleton"
                style={{ border: "1px solid var(--border-subtle)" }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
