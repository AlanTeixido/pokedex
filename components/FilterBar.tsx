"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_TYPES, GENERATIONS } from "@/lib/constants";
import { TYPE_COLORS } from "@/lib/typeColors";
import { formatName } from "@/lib/api";

type ViewMode = "grid" | "list";

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
  showFavorites: boolean;
  onFavorites: (v: boolean) => void;
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
}

export function FilterBar({
  search, onSearch,
  selectedType, onType,
  selectedGen, onGen,
  sort, onSort,
  total, filtered,
  showFavorites, onFavorites,
  viewMode, onViewMode,
}: FilterBarProps) {
  const selectStyle: React.CSSProperties = {
    background: "var(--bg-input)",
    border: "1px solid var(--border-input)",
    color: "var(--text-primary)",
    borderRadius: "0.75rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
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
          style={{ color: "var(--text-muted)" }}
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
            background: "var(--bg-input)",
            border: "1px solid var(--border-input)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(99,102,241,0.5)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid var(--border-input)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "var(--text-secondary)", background: "var(--border-medium)" }}
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

        {/* Favourites toggle */}
        <motion.button
          onClick={() => onFavorites(!showFavorites)}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background: showFavorites ? "rgba(239,68,68,0.12)" : "var(--bg-input)",
            border: showFavorites ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border-input)",
            color: showFavorites ? "#ef4444" : "var(--text-secondary)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={showFavorites ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Favourites
        </motion.button>

        {/* View mode toggle */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border-input)" }}
        >
          <button
            onClick={() => onViewMode("grid")}
            className="flex items-center justify-center w-9 h-9 transition-all duration-200"
            style={{
              background: viewMode === "grid" ? "rgba(99,102,241,0.15)" : "var(--bg-input)",
              color: viewMode === "grid" ? "#a78bfa" : "var(--text-secondary)",
            }}
            aria-label="Grid view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="0" y="0" width="7" height="7" rx="1.5" />
              <rect x="9" y="0" width="7" height="7" rx="1.5" />
              <rect x="0" y="9" width="7" height="7" rx="1.5" />
              <rect x="9" y="9" width="7" height="7" rx="1.5" />
            </svg>
          </button>
          <button
            onClick={() => onViewMode("list")}
            className="flex items-center justify-center w-9 h-9 transition-all duration-200"
            style={{
              background: viewMode === "list" ? "rgba(99,102,241,0.15)" : "var(--bg-input)",
              color: viewMode === "list" ? "#a78bfa" : "var(--text-secondary)",
            }}
            aria-label="List view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="0" y="1" width="16" height="2.5" rx="1.25" />
              <rect x="0" y="6.75" width="16" height="2.5" rx="1.25" />
              <rect x="0" y="12.5" width="16" height="2.5" rx="1.25" />
            </svg>
          </button>
        </div>

        {/* Active filter chips */}
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
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.toLocaleString()} / {total.toLocaleString()} Pokémon
        </span>
      </div>
    </div>
  );
}
