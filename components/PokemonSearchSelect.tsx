"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetchAllPokemonList, formatName, getPokemonSpriteUrl } from "@/lib/api";

interface PokemonEntry { name: string; id: number }

interface PokemonSearchSelectProps {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  accentColor?: string;
}

export function PokemonSearchSelect({
  value,
  onChange,
  placeholder = "Search Pokémon…",
  accentColor = "#6366f1",
}: PokemonSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: allPokemon } = useSWR<PokemonEntry[]>("all-pokemon-list", fetchAllPokemonList);

  const filtered = allPokemon
    ? allPokemon
        .filter((p) =>
          query ? p.name.includes(query.toLowerCase()) || String(p.id).includes(query) : true
        )
        .slice(0, 40)
    : [];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedEntry = allPokemon?.find((p) => p.name === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
        style={{
          background: "rgba(17,24,39,0.8)",
          border: open ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.1)",
          boxShadow: open ? `0 0 0 3px ${accentColor}18` : "none",
        }}
      >
        {selectedEntry ? (
          <>
            <Image
              src={getPokemonSpriteUrl(selectedEntry.id)}
              alt={selectedEntry.name}
              width={40}
              height={40}
              className="object-contain"
              style={{ imageRendering: "pixelated" }}
              unoptimized
            />
            <div>
              <div className="text-sm font-bold capitalize" style={{ color: "#f0f4ff" }}>
                {formatName(selectedEntry.name)}
              </div>
              <div className="text-xs" style={{ color: "#4a5568" }}>
                #{String(selectedEntry.id).padStart(4, "0")}
              </div>
            </div>
          </>
        ) : (
          <span className="text-sm" style={{ color: "#4a5568" }}>{placeholder}</span>
        )}
        <svg
          className="ml-auto w-4 h-4 shrink-0"
          style={{ color: "#4a5568", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
            style={{
              background: "rgba(13,18,32,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Search input */}
            <div className="p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "rgba(17,24,39,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f0f4ff",
                }}
              />
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-64">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-sm" style={{ color: "#4a5568" }}>
                  No Pokémon found
                </div>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => { onChange(p.name); setOpen(false); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                    style={value === p.name ? { background: `${accentColor}15` } : {}}
                  >
                    <Image
                      src={getPokemonSpriteUrl(p.id)}
                      alt={p.name}
                      width={32}
                      height={32}
                      className="object-contain"
                      style={{ imageRendering: "pixelated" }}
                      unoptimized
                    />
                    <span className="text-sm capitalize" style={{ color: "#f0f4ff" }}>
                      {formatName(p.name)}
                    </span>
                    <span className="ml-auto text-xs" style={{ color: "#4a5568" }}>
                      #{String(p.id).padStart(4, "0")}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
