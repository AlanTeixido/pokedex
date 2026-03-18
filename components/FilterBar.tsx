"use client";
import { useState, useRef, useEffect } from "react";
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

const pillSelect: React.CSSProperties = {
  background: "var(--bg-input)",
  border: "1px solid var(--border-input)",
  color: "var(--text-primary)",
  borderRadius: "9999px",
  padding: "0.5rem 2rem 0.5rem 0.875rem",
  fontSize: "0.8125rem",
  fontWeight: 500,
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M5 7L0.5 2.5h9z' fill='%238b9ab8'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.625rem center",
  letterSpacing: "0.01em",
};

export function FilterBar({
  search, onSearch,
  selectedType, onType,
  selectedGen, onGen,
  sort, onSort,
  total, filtered,
  showFavorites, onFavorites,
  viewMode, onViewMode,
}: FilterBarProps) {
  const [typeOpen, setTypeOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!typeOpen) return;
    function handleClick(e: MouseEvent) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [typeOpen]);

  const activeTypeColor = selectedType ? TYPE_COLORS[selectedType]?.hex : null;

  return (
    <div className="space-y-3.5">
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
          className="w-full pl-11 pr-4 py-3 text-sm transition-all duration-200 outline-none"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-input)",
            color: "var(--text-primary)",
            borderRadius: "9999px",
            fontWeight: 500,
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
      <div className="flex flex-wrap items-center gap-2.5">

        {/* ── Custom Type Dropdown ── */}
        <div className="relative" ref={typeDropdownRef}>
          <button
            onClick={() => setTypeOpen((v) => !v)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold transition-all duration-200"
            style={{
              background: activeTypeColor ? `${activeTypeColor}14` : "var(--bg-input)",
              border: activeTypeColor ? `1px solid ${activeTypeColor}45` : "1px solid var(--border-input)",
              color: activeTypeColor ? activeTypeColor : "var(--text-primary)",
              borderRadius: "9999px",
              fontSize: "0.8125rem",
              fontWeight: 500,
            }}
          >
            {activeTypeColor ? (
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: activeTypeColor, boxShadow: `0 0 6px ${activeTypeColor}` }}
              />
            ) : null}
            <span>{selectedType ? formatName(selectedType) : "All Types"}</span>
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
              style={{ opacity: 0.5, flexShrink: 0, transform: typeOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
            >
              <path d="M5 7L0.5 2.5h9z" />
            </svg>
          </button>

          <AnimatePresence>
            {typeOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full mt-2 left-0 z-50 rounded-2xl overflow-hidden"
                style={{
                  minWidth: 160,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="p-1.5 max-h-64 overflow-y-auto">
                  {/* All Types option */}
                  <button
                    onClick={() => { onType(""); setTypeOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150"
                    style={{
                      background: !selectedType ? "rgba(99,102,241,0.12)" : "transparent",
                      color: !selectedType ? "#a78bfa" : "var(--text-secondary)",
                      fontSize: "0.8125rem",
                      fontWeight: !selectedType ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedType) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedType) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--border-medium)" }}
                    />
                    All Types
                  </button>

                  {ALL_TYPES.map((t) => {
                    const tColor = TYPE_COLORS[t]?.hex ?? "#888";
                    const isActive = selectedType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => { onType(t); setTypeOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150"
                        style={{
                          background: isActive ? `${tColor}18` : "transparent",
                          color: isActive ? tColor : "var(--text-secondary)",
                          fontSize: "0.8125rem",
                          fontWeight: isActive ? 600 : 400,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = `${tColor}0e`;
                          (e.currentTarget as HTMLButtonElement).style.color = tColor;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = isActive ? `${tColor}18` : "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color = isActive ? tColor : "var(--text-secondary)";
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            background: tColor,
                            boxShadow: isActive ? `0 0 8px ${tColor}` : "none",
                          }}
                        />
                        {formatName(t)}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generation Filter */}
        <select
          value={selectedGen}
          onChange={(e) => onGen(Number(e.target.value))}
          style={{
            ...pillSelect,
            ...(selectedGen > 0 ? {
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "#a78bfa",
            } : {}),
          }}
        >
          <option value={0}>All Generations</option>
          {GENERATIONS.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select value={sort} onChange={(e) => onSort(e.target.value)} style={pillSelect}>
          <option value="id">Sort: ID</option>
          <option value="name">Sort: Name</option>
        </select>

        {/* Favourites toggle */}
        <motion.button
          onClick={() => onFavorites(!showFavorites)}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all duration-200"
          style={{
            background: showFavorites ? "rgba(239,68,68,0.12)" : "var(--bg-input)",
            border: showFavorites ? "1px solid rgba(239,68,68,0.35)" : "1px solid var(--border-input)",
            color: showFavorites ? "#ef4444" : "var(--text-secondary)",
            borderRadius: "9999px",
            fontSize: "0.8125rem",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={showFavorites ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Favourites
        </motion.button>

        {/* View mode toggle */}
        <div
          className="flex rounded-full overflow-hidden"
          style={{ border: "1px solid var(--border-input)" }}
        >
          <button
            onClick={() => onViewMode("grid")}
            className="flex items-center justify-center w-9 h-9 transition-all duration-200"
            style={{
              background: viewMode === "grid" ? "rgba(99,102,241,0.18)" : "var(--bg-input)",
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
              background: viewMode === "list" ? "rgba(99,102,241,0.18)" : "var(--bg-input)",
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
                background: `${TYPE_COLORS[selectedType]?.hex}20`,
                border: `1px solid ${TYPE_COLORS[selectedType]?.hex}45`,
                color: TYPE_COLORS[selectedType]?.hex,
                boxShadow: `0 0 12px ${TYPE_COLORS[selectedType]?.hex}20`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: TYPE_COLORS[selectedType]?.hex }}
              />
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
                border: "1px solid rgba(99,102,241,0.35)",
                color: "#a78bfa",
                boxShadow: "0 0 12px rgba(99,102,241,0.15)",
              }}
            >
              {GENERATIONS.find((g) => g.id === selectedGen)?.name} ×
            </motion.button>
          )}
        </AnimatePresence>

        {/* Result count */}
        <span className="ml-auto text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {filtered.toLocaleString()} / {total.toLocaleString()} Pokémon
        </span>
      </div>
    </div>
  );
}
