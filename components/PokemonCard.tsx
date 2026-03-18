"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Pokemon } from "@/lib/types";
import { TypeBadge } from "./TypeBadge";
import { getPrimaryTypeColor } from "@/lib/typeColors";
import { formatPokemonId, formatName, getPokemonAnimatedUrl, getPokemonSpriteUrl } from "@/lib/api";

interface PokemonCardProps {
  pokemon: Pokemon;
  index?: number;
}

export function PokemonCard({ pokemon, index = 0 }: PokemonCardProps) {
  const [imgError, setImgError] = useState(false);
  const primaryColor = getPrimaryTypeColor(pokemon.types);
  const animatedUrl = getPokemonAnimatedUrl(pokemon.id);
  const staticUrl = getPokemonSpriteUrl(pokemon.id);

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
            background: `linear-gradient(145deg, rgba(17,24,39,0.95) 0%, ${primaryColor.darkBg}88 100%)`,
            border: `1px solid ${primaryColor.hex}22`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.04)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              `0 8px 40px ${primaryColor.glow}, 0 0 0 1px ${primaryColor.hex}33`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              `0 0 0 1px rgba(255,255,255,0.04)`;
          }}
        >
          {/* ID badge */}
          <div
            className="self-start text-xs font-bold font-display"
            style={{ color: primaryColor.hex, opacity: 0.8, letterSpacing: "0.06em" }}
          >
            {formatPokemonId(pokemon.id)}
          </div>

          {/* Sprite */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Glow disc */}
            <div
              className="absolute inset-2 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
              style={{ background: primaryColor.hex }}
            />
            {!imgError ? (
              // Try animated sprite
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
            style={{ color: "#f0f4ff", letterSpacing: "0.04em" }}
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
