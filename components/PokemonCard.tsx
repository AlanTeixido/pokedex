"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Pokemon } from "@/lib/types";
import { TypeBadge } from "./TypeBadge";
import { getPrimaryTypeColor } from "@/lib/typeColors";
import { formatPokemonId, formatName, getPokemonAnimatedUrl, getPokemonSpriteUrl } from "@/lib/api";
import { useFavorites } from "./FavoritesProvider";

interface PokemonCardProps {
  pokemon: Pokemon;
  index?: number;
}

export function PokemonCard({ pokemon, index = 0 }: PokemonCardProps) {
  const [imgError, setImgError] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const primaryColor = getPrimaryTypeColor(pokemon.types);
  const animatedUrl = getPokemonAnimatedUrl(pokemon.id);
  const staticUrl = getPokemonSpriteUrl(pokemon.id);
  const favorited = isFavorite(pokemon.name);

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.name);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 350);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.6) }}
      whileHover={{ y: -8, scale: 1.03 }}
    >
      <Link href={`/pokemon/${pokemon.name}`} className="block group">
        <div
          className="relative overflow-hidden rounded-2xl flex flex-col items-center cursor-pointer pokeball-decor"
          style={{
            /* Radial gradient from type color at low opacity */
            background: `radial-gradient(ellipse at 50% 0%, ${primaryColor.hex}12 0%, transparent 65%), var(--bg-card)`,
            border: `1px solid ${primaryColor.hex}28`,
            boxShadow: `0 1px 3px rgba(0,0,0,0.3), 0 0 0 0.5px ${primaryColor.hex}18`,
            transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = `0 16px 48px ${primaryColor.glow}, 0 0 0 1px ${primaryColor.hex}44, 0 4px 12px rgba(0,0,0,0.4)`;
            el.style.borderColor = `${primaryColor.hex}50`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = `0 1px 3px rgba(0,0,0,0.3), 0 0 0 0.5px ${primaryColor.hex}18`;
            el.style.borderColor = `${primaryColor.hex}28`;
          }}
        >
          {/* Colored top stripe */}
          <div
            className="absolute top-0 left-0 right-0 rounded-t-2xl"
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${primaryColor.hex}, ${primaryColor.hex}aa, transparent)`,
            }}
          />

          {/* Favorites button */}
          <button
            onClick={handleFavorite}
            className={`absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${heartAnim ? "heart-pop" : ""}`}
            style={{
              background: favorited ? "rgba(239,68,68,0.15)" : "rgba(128,128,128,0.08)",
              border: favorited ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border-subtle)",
              color: favorited ? "#ef4444" : "var(--text-muted)",
            }}
            aria-label={favorited ? "Remove from favourites" : "Add to favourites"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Content area with padding */}
          <div className="w-full flex flex-col items-center gap-2 px-4 pt-5 pb-4">
            {/* ID badge */}
            <div
              className="self-start text-xs font-bold font-display"
              style={{ color: primaryColor.hex, opacity: 0.85, letterSpacing: "0.07em" }}
            >
              {formatPokemonId(pokemon.id)}
            </div>

            {/* Sprite — bigger */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Glow disc */}
              <div
                className="absolute inset-1 rounded-full blur-2xl opacity-25 group-hover:opacity-50 transition-opacity duration-300"
                style={{ background: primaryColor.hex }}
              />
              {!imgError ? (
                <Image
                  src={animatedUrl}
                  alt={pokemon.name}
                  width={112}
                  height={112}
                  className="relative z-10 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ imageRendering: "pixelated" }}
                  onError={() => setImgError(true)}
                  unoptimized
                />
              ) : (
                <Image
                  src={staticUrl}
                  alt={pokemon.name}
                  width={112}
                  height={112}
                  className="relative z-10 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ imageRendering: "pixelated" }}
                  unoptimized
                />
              )}
            </div>

            {/* Name */}
            <h3
              className="text-sm font-bold tracking-wide capitalize text-center leading-tight"
              style={{ color: "var(--text-primary)", letterSpacing: "0.04em" }}
            >
              {formatName(pokemon.name)}
            </h3>

            {/* Types */}
            <div className="flex gap-1.5 flex-wrap justify-center">
              {pokemon.types.map(({ type }) => (
                <TypeBadge key={type.name} type={type.name} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
