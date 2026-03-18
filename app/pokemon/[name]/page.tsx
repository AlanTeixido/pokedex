"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { Pokemon, PokemonSpecies, EvolutionChain } from "@/lib/types";
import {
  fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain,
  getPokemonOfficialArtUrl, getPokemonAnimatedUrl, getPokemonSpriteUrl,
  formatPokemonId, formatName, formatHeight, formatWeight,
  extractEvolutionChainId,
} from "@/lib/api";
import { getPrimaryTypeColor } from "@/lib/typeColors";
import { TypeBadge } from "@/components/TypeBadge";
import { StatBar } from "@/components/StatBar";
import { AbilityAccordion } from "@/components/AbilityAccordion";
import { EvolutionChainDisplay } from "@/components/EvolutionChain";
import { MovesList } from "@/components/MovesList";
import { WeaknessChart } from "@/components/WeaknessChart";

type SpriteView = "official" | "front" | "back";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-4"
      style={{ color: "#4a5568", letterSpacing: "0.12em" }}
    >
      {children}
    </h2>
  );
}

function DetailCard({ children, className = "", accentHex }: { children: React.ReactNode; className?: string; accentHex?: string }) {
  return (
    <div
      className={`p-5 rounded-2xl ${className}`}
      style={{
        background: "rgba(13,18,32,0.6)",
        border: `1px solid ${accentHex ? `${accentHex}18` : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {children}
    </div>
  );
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const name = params.name as string;

  const [spriteView, setSpriteView] = useState<SpriteView>("official");
  const [shiny, setShiny] = useState(false);

  // Fetch pokemon data
  const { data: pokemon, isLoading } = useSWR<Pokemon>(
    name ? `pokemon-${name}` : null,
    () => fetchPokemon(name)
  );

  // Fetch species
  const { data: species } = useSWR<PokemonSpecies>(
    pokemon ? `species-${pokemon.name}` : null,
    () => fetchPokemonSpecies(pokemon!.name)
  );

  // Fetch evolution chain
  const { data: evolutionChain } = useSWR<EvolutionChain>(
    species ? `evo-${extractEvolutionChainId(species.evolution_chain.url)}` : null,
    () => fetchEvolutionChain(extractEvolutionChainId(species!.evolution_chain.url))
  );

  const primaryColor = pokemon ? getPrimaryTypeColor(pokemon.types) : null;

  const flavorText = species?.flavor_text_entries
    .find((e) => e.language.name === "en")
    ?.flavor_text.replace(/[\n\f]/g, " ") ?? "";

  const genus = species?.genera.find((g) => g.language.name === "en")?.genus ?? "";

  const getSpriteSrc = () => {
    if (!pokemon) return "";
    if (spriteView === "official") return getPokemonOfficialArtUrl(pokemon.id, shiny);
    if (spriteView === "front") {
      return shiny
        ? (pokemon.sprites.front_shiny ?? getPokemonSpriteUrl(pokemon.id))
        : getPokemonAnimatedUrl(pokemon.id);
    }
    return shiny
      ? (pokemon.sprites.back_shiny ?? getPokemonSpriteUrl(pokemon.id))
      : (pokemon.sprites.back_default ?? getPokemonSpriteUrl(pokemon.id));
  };

  const totalBaseStats = pokemon?.stats.reduce((sum, s) => sum + s.base_stat, 0) ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(99,102,241,0.3)", borderTopColor: "#6366f1" }}
          />
          <p className="font-display text-sm tracking-widest" style={{ color: "#4a5568" }}>
            Loading Pokémon…
          </p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">404</p>
          <p className="font-display text-xl mb-6" style={{ color: "#4a5568" }}>
            Pokémon not found
          </p>
          <Link href="/" className="text-sm" style={{ color: "#6366f1" }}>
            ← Back to Pokédex
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen page-enter"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Hero gradient — full-width type colour wash */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ height: "60vh", maxHeight: 640 }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${primaryColor?.hex ?? "#6366f1"} 0%, transparent 68%)`,
          }}
        />
        {/* Softer secondary layer for depth */}
        <div
          className="absolute inset-0 opacity-8"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${primaryColor?.hex ?? "#6366f1"} 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + nav row */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm transition-colors group"
            style={{ color: "#4a5568" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#8b9ab8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5568")}
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Pokédex
          </Link>

          <div className="flex items-center gap-2">
            {pokemon.id > 1 && (
              <Link
                href={`/pokemon/${String(pokemon.id - 1)}`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.05)", color: "#8b9ab8", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                ← #{pokemon.id - 1}
              </Link>
            )}
            {pokemon.id < 1025 && (
              <Link
                href={`/pokemon/${String(pokemon.id + 1)}`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.05)", color: "#8b9ab8", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                #{pokemon.id + 1} →
              </Link>
            )}
          </div>
        </div>

        {/* Hero section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Sprite */}
          <div className="flex flex-col items-center gap-4">
            {/* Sprite Controls */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {(["official", "front", "back"] as SpriteView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSpriteView(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                  style={
                    spriteView === v
                      ? {
                          background: `${primaryColor?.hex}22`,
                          border: `1px solid ${primaryColor?.hex}44`,
                          color: primaryColor?.hex,
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#8b9ab8",
                        }
                  }
                >
                  {v === "official" ? "Artwork" : v === "front" ? "Front" : "Back"}
                </button>
              ))}

              <button
                onClick={() => setShiny((s) => !s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={
                  shiny
                    ? {
                        background: "rgba(247,208,44,0.15)",
                        border: "1px solid rgba(247,208,44,0.3)",
                        color: "#F7D02C",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#8b9ab8",
                      }
                }
              >
                ✨ Shiny
              </button>
            </div>

            {/* Main sprite */}
            <div className="relative">
              {/* Outer soft halo */}
              <div
                className="absolute inset-[-24px] rounded-full blur-[56px] opacity-15"
                style={{ background: primaryColor?.hex ?? "#6366f1" }}
              />
              {/* Inner pulsing glow disc */}
              <div
                className="absolute inset-4 rounded-full blur-2xl opacity-35 animate-pulse-glow"
                style={{ background: primaryColor?.hex ?? "#6366f1" }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${spriteView}-${shiny}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Image
                    src={getSpriteSrc()}
                    alt={pokemon.name}
                    width={spriteView === "official" ? 320 : 192}
                    height={spriteView === "official" ? 320 : 192}
                    className="relative z-10 object-contain animate-float drop-shadow-2xl"
                    style={{
                      imageRendering: spriteView !== "official" ? "pixelated" : "auto",
                      maxWidth: spriteView === "official" ? 320 : 192,
                    }}
                    priority
                    unoptimized={spriteView !== "official"}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getPokemonSpriteUrl(pokemon.id);
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Compare CTA */}
            <Link
              href={`/compare?p1=${pokemon.name}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a78bfa",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare
            </Link>
          </div>

          {/* Right: Info */}
          <div className="space-y-5">
            {/* Name & ID */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="font-display text-sm font-bold"
                  style={{ color: primaryColor?.hex ?? "#6366f1" }}
                >
                  {formatPokemonId(pokemon.id)}
                </span>
                {species?.is_legendary && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(247,208,44,0.15)", color: "#F7D02C", border: "1px solid rgba(247,208,44,0.25)" }}>
                    LEGENDARY
                  </span>
                )}
                {species?.is_mythical && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(214,133,173,0.15)", color: "#D685AD", border: "1px solid rgba(214,133,173,0.25)" }}>
                    MYTHICAL
                  </span>
                )}
              </div>
              <h1
                className="font-display text-4xl sm:text-5xl font-black capitalize tracking-wide mb-1"
                style={{ color: "#f0f4ff" }}
              >
                {formatName(pokemon.name)}
              </h1>
              {genus && (
                <p className="text-sm" style={{ color: "#8b9ab8" }}>{genus}</p>
              )}
            </div>

            {/* Types */}
            <div className="flex gap-2 flex-wrap">
              {pokemon.types.map(({ type }) => (
                <TypeBadge key={type.name} type={type.name} size="lg" />
              ))}
            </div>

            {/* Flavor text */}
            {flavorText && (
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: "#8b9ab8", borderLeft: `3px solid ${primaryColor?.hex}44`, paddingLeft: "0.75rem" }}
              >
                {flavorText}
              </p>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Height", value: formatHeight(pokemon.height) },
                { label: "Weight", value: formatWeight(pokemon.weight) },
                { label: "Base Exp.", value: pokemon.base_experience ?? "—" },
                { label: "Generation", value: species?.generation.name.replace("generation-", "Gen ").toUpperCase() ?? "—" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3 rounded-xl text-center"
                  style={{ background: "rgba(17,24,39,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="text-xs mb-1" style={{ color: "#4a5568" }}>{label}</div>
                  <div className="text-sm font-semibold" style={{ color: "#f0f4ff" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Base Stats */}
          <div>
            <SectionTitle>Base Stats</SectionTitle>
            <DetailCard accentHex={primaryColor?.hex}>
              <div className="space-y-3">
                {pokemon.stats.map((s, i) => (
                  <StatBar
                    key={s.stat.name}
                    statName={s.stat.name}
                    value={s.base_stat}
                    delay={i * 80}
                  />
                ))}
                <div
                  className="flex items-center gap-3 pt-2 mt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-xs font-semibold w-16 text-right" style={{ color: "#8b9ab8" }}>TOTAL</span>
                  <span
                    className="text-sm font-black"
                    style={{ color: "#f0f4ff", fontFamily: "Orbitron, sans-serif" }}
                  >
                    {totalBaseStats}
                  </span>
                </div>
              </div>
            </DetailCard>
          </div>

          {/* Weaknesses */}
          <div>
            <SectionTitle>Type Matchups</SectionTitle>
            <WeaknessChart types={pokemon.types.map((t) => t.type.name)} />
          </div>
        </div>

        {/* Abilities */}
        <div className="mb-8">
          <SectionTitle>Abilities</SectionTitle>
          <div className="space-y-2">
            {pokemon.abilities.map(({ ability, is_hidden }) => (
              <AbilityAccordion key={ability.name} name={ability.name} isHidden={is_hidden} />
            ))}
          </div>
        </div>

        {/* Evolution Chain */}
        {evolutionChain && (
          <div className="mb-8">
            <SectionTitle>Evolution Chain</SectionTitle>
            <EvolutionChainDisplay
              chain={evolutionChain.chain}
              currentName={pokemon.name}
              primaryTypeHex={primaryColor?.hex}
            />
          </div>
        )}

        {/* Moves */}
        <div className="mb-8">
          <SectionTitle>Moves ({pokemon.moves.length})</SectionTitle>
          <MovesList moves={pokemon.moves} />
        </div>
      </div>
    </motion.div>
  );
}
