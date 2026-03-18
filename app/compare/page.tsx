"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Pokemon } from "@/lib/types";
import { fetchPokemon, getPokemonOfficialArtUrl, formatName, formatPokemonId } from "@/lib/api";
import { getPrimaryTypeColor, STAT_LABELS, STAT_COLORS } from "@/lib/typeColors";
import { TypeBadge } from "@/components/TypeBadge";
import { RadarChart } from "@/components/RadarChart";
import { PokemonSearchSelect } from "@/components/PokemonSearchSelect";

const STAT_ORDER = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

interface StatCompareRowProps {
  label: string;
  val1: number;
  val2: number;
  statName: string;
}

function StatCompareRow({ label, val1, val2, statName }: StatCompareRowProps) {
  const maxVal = Math.max(val1, val2, 1);
  const color = STAT_COLORS[statName] ?? "#8b9ab8";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2">
      {/* Bar 1 (right-aligned) */}
      <div className="flex items-center gap-2 justify-end">
        <span className="text-sm font-bold" style={{ color: val1 > val2 ? "#7AC74C" : val1 < val2 ? "#FF5959" : "#f0f4ff" }}>
          {val1}
        </span>
        <div className="flex-1 max-w-28 h-2 rounded-full overflow-hidden flex justify-end" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(val1 / maxVal) * 100}%` }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="h-full rounded-full"
            style={{ background: color, boxShadow: `0 0 6px ${color}66` }}
          />
        </div>
      </div>

      {/* Label */}
      <span className="text-xs font-bold tracking-wider text-center min-w-14" style={{ color: "#4a5568" }}>
        {label}
      </span>

      {/* Bar 2 (left-aligned) */}
      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-28 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(val2 / maxVal) * 100}%` }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.05 }}
            className="h-full rounded-full"
            style={{ background: color, boxShadow: `0 0 6px ${color}66` }}
          />
        </div>
        <span className="text-sm font-bold" style={{ color: val2 > val1 ? "#7AC74C" : val2 < val1 ? "#FF5959" : "#f0f4ff" }}>
          {val2}
        </span>
      </div>
    </div>
  );
}

interface PokemonPanel {
  pokemon: Pokemon | null;
  color: string;
  name: string;
  onSelect: (name: string) => void;
}

function PokemonSidePanel({ pokemon, color, name, onSelect }: PokemonPanel) {
  const primaryColor = pokemon ? getPrimaryTypeColor(pokemon.types) : null;

  return (
    <div className="flex flex-col gap-4">
      <PokemonSearchSelect
        value={name}
        onChange={onSelect}
        placeholder="Select a Pokémon…"
        accentColor={color}
      />

      {pokemon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl flex flex-col items-center gap-3"
          style={{
            background: `linear-gradient(145deg, rgba(17,24,39,0.9), ${primaryColor?.darkBg ?? "#111827"}88)`,
            border: `1px solid ${primaryColor?.hex ?? color}22`,
          }}
        >
          <Image
            src={getPokemonOfficialArtUrl(pokemon.id)}
            alt={pokemon.name}
            width={160}
            height={160}
            className="object-contain drop-shadow-xl animate-float"
            priority
          />
          <div className="text-center">
            <div
              className="text-xs font-bold font-display mb-1"
              style={{ color: primaryColor?.hex ?? color }}
            >
              {formatPokemonId(pokemon.id)}
            </div>
            <h3 className="text-xl font-display font-black capitalize" style={{ color: "#f0f4ff" }}>
              {formatName(pokemon.name)}
            </h3>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {pokemon.types.map(({ type }) => (
              <TypeBadge key={type.name} type={type.name} size="sm" />
            ))}
          </div>
          <Link
            href={`/pokemon/${pokemon.name}`}
            className="text-xs transition-colors"
            style={{ color: "#4a5568" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#8b9ab8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5568")}
          >
            View details →
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [name1, setName1] = useState(searchParams.get("p1") ?? "");
  const [name2, setName2] = useState(searchParams.get("p2") ?? "");

  const { data: p1 } = useSWR<Pokemon>(
    name1 ? `pokemon-${name1}` : null,
    () => fetchPokemon(name1)
  );
  const { data: p2 } = useSWR<Pokemon>(
    name2 ? `pokemon-${name2}` : null,
    () => fetchPokemon(name2)
  );

  const color1 = p1 ? getPrimaryTypeColor(p1.types).hex : "#6366f1";
  const color2 = p2 ? getPrimaryTypeColor(p2.types).hex : "#F95587";

  const stats1 = p1?.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })) ?? [];
  const stats2 = p2?.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })) ?? [];

  const total1 = stats1.reduce((a, s) => a + s.value, 0);
  const total2 = stats2.reduce((a, s) => a + s.value, 0);

  const handleSelect1 = (n: string) => {
    setName1(n);
    router.replace(`/compare?p1=${n}${name2 ? `&p2=${name2}` : ""}`, { scroll: false });
  };
  const handleSelect2 = (n: string) => {
    setName2(n);
    router.replace(`/compare?p1=${name1}&p2=${n}`, { scroll: false });
  };

  return (
    <div className="min-h-screen page-enter" style={{ background: "var(--bg-primary)" }}>
      {/* Hero orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ height: "40vh" }}>
        <div
          className="absolute left-1/4 top-0 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: color1, transform: "translateY(-40%)" }}
        />
        <div
          className="absolute right-1/4 top-0 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: color2, transform: "translateY(-40%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a78bfa",
            }}
          >
            Battle Stats
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl font-black tracking-wider"
            style={{
              background: `linear-gradient(135deg, ${color1}, ${color2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            COMPARE
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#8b9ab8" }}>
            Select two Pokémon to compare their stats side by side
          </p>
        </div>

        {/* Selector row */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <PokemonSidePanel pokemon={p1 ?? null} color={color1} name={name1} onSelect={handleSelect1} />
          <PokemonSidePanel pokemon={p2 ?? null} color={color2} name={name2} onSelect={handleSelect2} />
        </div>

        {/* Comparison content */}
        {p1 && p2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Radar chart */}
            <div
              className="p-6 rounded-2xl flex flex-col items-center gap-4"
              style={{ background: "rgba(13,18,32,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4a5568" }}>
                Stats Radar
              </h2>

              {/* Legend */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: color1 }} />
                  <span className="capitalize font-medium" style={{ color: "#f0f4ff" }}>
                    {formatName(p1.name)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: color2 }} />
                  <span className="capitalize font-medium" style={{ color: "#f0f4ff" }}>
                    {formatName(p2.name)}
                  </span>
                </div>
              </div>

              <RadarChart
                stats1={stats1}
                stats2={stats2}
                color1={color1}
                color2={color2}
                size={300}
              />
            </div>

            {/* Stat comparison rows */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: "rgba(13,18,32,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#4a5568" }}>
                Base Stats
              </h2>

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-right">
                  <span className="text-sm font-bold capitalize" style={{ color: color1 }}>
                    {formatName(p1.name)}
                  </span>
                </div>
                <div className="min-w-14" />
                <div>
                  <span className="text-sm font-bold capitalize" style={{ color: color2 }}>
                    {formatName(p2.name)}
                  </span>
                </div>
              </div>

              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {STAT_ORDER.map((key) => {
                  const s1 = stats1.find((s) => s.name === key);
                  const s2 = stats2.find((s) => s.name === key);
                  return (
                    <StatCompareRow
                      key={key}
                      statName={key}
                      label={STAT_LABELS[key] ?? key}
                      val1={s1?.value ?? 0}
                      val2={s2?.value ?? 0}
                    />
                  );
                })}
              </div>

              {/* Totals */}
              <div
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-4 mt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-right">
                  <span
                    className="text-xl font-black font-display"
                    style={{ color: total1 > total2 ? "#7AC74C" : total1 < total2 ? "#FF5959" : "#f0f4ff" }}
                  >
                    {total1}
                  </span>
                </div>
                <span className="text-xs font-bold tracking-widest text-center min-w-14" style={{ color: "#4a5568" }}>
                  TOTAL
                </span>
                <div>
                  <span
                    className="text-xl font-black font-display"
                    style={{ color: total2 > total1 ? "#7AC74C" : total2 < total1 ? "#FF5959" : "#f0f4ff" }}
                  >
                    {total2}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick info comparison */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Height", v1: `${p1.height / 10}m`, v2: `${p2.height / 10}m` },
                { label: "Weight", v1: `${p1.weight / 10}kg`, v2: `${p2.weight / 10}kg` },
                { label: "Base Exp.", v1: p1.base_experience, v2: p2.base_experience },
                { label: "Abilities", v1: p1.abilities.length, v2: p2.abilities.length },
              ].map(({ label, v1, v2 }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl grid grid-cols-3 items-center gap-2 text-center"
                  style={{ background: "rgba(17,24,39,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span className="font-bold" style={{ color: color1 }}>{v1}</span>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4a5568" }}>{label}</span>
                  <span className="font-bold" style={{ color: color2 }}>{v2}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {(!p1 || !p2) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">⚔️</div>
            <p className="font-display text-lg" style={{ color: "#4a5568" }}>
              Select two Pokémon above to compare
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(99,102,241,0.3)", borderTopColor: "#6366f1" }}
          />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
