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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.6) }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <Link href={`/pokemon/${pokemon.name}`} className="block group">
        <div
          className="relative overflow-hidden rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 pokeball-decor"
          style={{
            background: `linear-gradient(145deg, var(--bg-card) 0%, ${primaryColor.darkBg}66 100%)`,
            border: `1px solid ${primaryColor.hex}22`,
            boxShadow: `0 0 0 1px var(--border-subtle)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              `0 8px 40px ${primaryColor.glow}, 0 0 0 1px ${primaryColor.hex}33`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              `0 0 0 1px var(--border-subtle)`;
          }}
        >
          {/* Favorites button */}
          <button
            onClick={handleFavorite}
            className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${heartAnim ? "heart-pop" : ""}`}
            style={{
              background: favorited ? "rgba(239,68,68,0.15)" : "rgba(128,128,128,0.1)",
              border: favorited ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border-subtle)",
              color: favorited ? "#ef4444" : "var(--text-muted)",
            }}
            aria-label={favorited ? "Remove from favourites" : "Add to favourites"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* ID badge */}
          <div
            className="self-start text-xs font-bold font-display"
            style={{ color: primaryColor.hex, opacity: 0.8, letterSpacing: "0.06em" }}
          >
            {formatPokemonId(pokemon.id)}
          </div>

          {/* Sprite */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div
              className="absolute inset-2 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
              style={{ background: primaryColor.hex }}
            />
            {!imgError ? (
              <Image
                src={animatedUrl}
                alt={pokemon.name}
                width={96}
                height={96}
                className="relative z-10 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "pixelated" }}
                onError={() => setImgError(true)}
                unoptimized
              />
            ) : (
              <Image
                src={staticUrl}
                alt={pokemon.name}
                width={96}
                height={96}
                className="relative z-10 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "pixelated" }}
                unoptimized
              />
            )}
          </div>

          {/* Name */}
          <h3
            className="text-sm font-bold tracking-wide capitalize text-center"
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
      </Link>
    </motion.div>
  );
}
