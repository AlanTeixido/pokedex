"use client";
import useSWR from "swr";
import { Pokemon } from "@/lib/types";
import { fetchPokemon } from "@/lib/api";
import { PokemonCard } from "./PokemonCard";

interface PokemonGridProps {
  names: string[];
}

function PokemonCardLoader({ name, index }: { name: string; index: number }) {
  const { data, error } = useSWR<Pokemon>(
    `pokemon-${name}`,
    () => fetchPokemon(name)
  );

  if (error) return null;
  if (!data) return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col items-center gap-3"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="skeleton h-3 w-12 self-start" />
      <div className="skeleton w-24 h-24 rounded-full" />
      <div className="skeleton h-4 w-28" />
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
    </div>
  );

  return <PokemonCard pokemon={data} index={index} />;
}

export function PokemonGrid({ names }: PokemonGridProps) {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {names.map((name, i) => (
        <PokemonCardLoader key={name} name={name} index={i} />
      ))}
    </div>
  );
}
