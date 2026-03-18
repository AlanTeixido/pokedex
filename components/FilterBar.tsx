"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_TYPES, GENERATIONS } from "@/lib/constants";
import { TYPE_COLORS } from "@/lib/typeColors";
import { formatName } from "@/lib/api";

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  selectedType: string;
  onType: (v: string) => void;
  selectedGen: number;
  onGen: (v: number) => void;
  sort: string;
  onSort: (v: string) => void;
  total: number;
  filtered: number;
}

export function FilterBar({
  search, onSearch,
  selectedType, onType,
  selectedGen, onGen,
  sort, onSort,
  total, filtered,
}: FilterBarProps) {
  const selectStyle = {
    background: "rgba(17,24,39,0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0f4ff",
    borderRadius: "0.75rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%238b9ab8'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2rem",
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "#4a5568" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search Pokémon by name..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
          style={{
            background: "rgba(17,24,39,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0f4ff",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(99,102,241,0.5)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "#8b9ab8", background: "rgba(255,255,255,0.06)" }}
          >
            ×
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <div className="relative">
          <select value={selectedType} onChange={(e) => onType(e.target.value)} style={selectStyle}>
            <option value="">All Types</option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>{formatName(t)}</option>
            ))}
          </select>
          {selectedType && (
            <div
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
              style={{ background: TYPE_COLORS[selectedType]?.hex }}
            />
          )}
        </div>

        {/* Generation Filter */}
        <select value={selectedGen} onChange={(e) => onGen(Number(e.target.value))} style={selectStyle}>
          <option value={0}>All Generations</option>
          {GENERATIONS.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select value={sort} onChange={(e) => onSort(e.target.value)} style={selectStyle}>
          <option value="id">Sort: ID</option>
          <option value="name">Sort: Name</option>
        </select>

        {/* Active filters chips */}
        <AnimatePresence>
          {selectedType && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onType("")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: `${TYPE_COLORS[selectedType]?.hex}22`,
                border: `1px solid ${TYPE_COLORS[selectedType]?.hex}44`,
                color: TYPE_COLORS[selectedType]?.hex,
              }}
            >
              {formatName(selectedType)} ×
            </motion.button>
          )}
          {selectedGen > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onGen(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#a78bfa",
              }}
            >
              {GENERATIONS.find((g) => g.id === selectedGen)?.name} ×
            </motion.button>
          )}
        </AnimatePresence>

        {/* Result count */}
        <span className="ml-auto text-xs" style={{ color: "#4a5568" }}>
          {filtered.toLocaleString()} / {total.toLocaleString()} Pokémon
        </span>
      </div>
    </div>
  );
}
