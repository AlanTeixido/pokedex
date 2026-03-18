"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Pokemon } from "@/lib/types";
import { fetchPokemon, formatPokemonId, formatName, getPokemonSpriteUrl } from "@/lib/api";
import { getPrimaryTypeColor } from "@/lib/typeColors";
import { TypeBadge } from "./TypeBadge";
import { useFavorites } from "./FavoritesProvider";

function getBaseTotal(pokemon: Pokemon): number {
  return pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
}

function ListRow({ name, index }: { name: string; index: number }) {
  const { data, error } = useSWR<Pokemon>(`pokemon-${name}`, () => fetchPokemon(name));
  const { isFavorite, toggleFavorite } = useFavorites();

  if (error) return null;

  if (!data) {
    return (
      <div
        className="flex items-center gap-4 px-4 py-3 rounded-xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="skeleton w-8 h-3 rounded" />
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="skeleton flex-1 h-3 rounded" />
        <div className="skeleton w-20 h-5 rounded-full" />
        <div className="skeleton w-12 h-3 rounded" />
      </div>
    );
  }

  const primaryColor = getPrimaryTypeColor(data.types);
  const spriteUrl = getPokemonSpriteUrl(data.id);
  const total = getBaseTotal(data);
  const favorited = isFavorite(data.name);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
    >
      <Link href={`/pokemon/${data.name}`} className="group block">
        <div
          className="flex items-center gap-3 sm:gap-4 px-4 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: "var(--bg-card)",
            border: `1px solid var(--border-subtle)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card-hover)";
            (e.currentTarget as HTMLDivElement).style.borderColor = `${primaryColor.hex}33`;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${primaryColor.glow}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          {/* ID */}
          <span
            className="w-14 text-xs font-bold font-display text-right flex-shrink-0"
            style={{ color: primaryColor.hex, opacity: 0.75 }}
          >
            {formatPokemonId(data.id)}
          </span>

          {/* Sprite */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={spriteUrl}
              alt={data.name}
              width={40}
              height={40}
              className="object-contain group-hover:scale-110 transition-transform duration-200"
              style={{ imageRendering: "pixelated" }}
              unoptimized
            />
          </div>

          {/* Name */}
          <span
            className="flex-1 text-sm font-semibold tracking-wide min-w-0 truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {formatName(data.name)}
          </span>

          {/* Types */}
          <div className="hidden sm:flex gap-1 flex-shrink-0">
            {data.types.map(({ type }) => (
              <TypeBadge key={type.name} type={type.name} size="sm" />
            ))}
          </div>

          {/* Base stat total */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="w-16 h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--border-medium)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((total / 720) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${primaryColor.hex}, ${primaryColor.hex}bb)`,
                }}
              />
            </div>
            <span
              className="text-xs font-bold w-8 text-right"
              style={{ color: "var(--text-secondary)" }}
            >
              {total}
            </span>
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(data.name);
            }}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: favorited ? "rgba(239,68,68,0.12)" : "transparent",
              color: favorited ? "#ef4444" : "var(--text-muted)",
            }}
            aria-label={favorited ? "Remove from favourites" : "Add to favourites"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

interface ListViewProps {
  names: string[];
}

export function ListView({ names }: ListViewProps) {
  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-6xl opacity-30">🔍</div>
        <p className="text-xl font-display" style={{ color: "var(--text-muted)" }}>
          No Pokémon found
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Header row */}
      <div
        className="flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-xl"
        style={{
          background: "var(--bg-filter)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <span className="w-14 text-right text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>#</span>
        <span className="w-10 text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}></span>
        <span className="flex-1 text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Name</span>
        <span className="hidden sm:block w-24 text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Types</span>
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>BST</span>
        <span className="w-7" />
      </div>
      {names.map((name, i) => (
        <ListRow key={name} name={name} index={i} />
      ))}
    </div>
  );
}
