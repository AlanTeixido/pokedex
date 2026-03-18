"use client";
import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { FilterBar } from "@/components/FilterBar";
import { PokemonGrid } from "@/components/PokemonGrid";
import { Pagination } from "@/components/Pagination";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { fetchAllPokemonList, fetchPokemonByType } from "@/lib/api";
import { GENERATIONS, PAGE_SIZE, TOTAL_POKEMON } from "@/lib/constants";

type SortOption = "id" | "name";

interface PokemonEntry {
  name: string;
  id: number;
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGen, setSelectedGen] = useState(0);
  const [sort, setSort] = useState<SortOption>("id");
  const [page, setPage] = useState(1);

  // Fetch all pokemon list
  const { data: allPokemon, isLoading: listLoading } = useSWR<PokemonEntry[]>(
    "all-pokemon-list",
    fetchAllPokemonList
  );

  // Fetch type filter list
  const { data: typeList } = useSWR<string[]>(
    selectedType ? `type-${selectedType}` : null,
    () => fetchPokemonByType(selectedType)
  );

  const typeSet = useMemo(
    () => (typeList ? new Set(typeList) : null),
    [typeList]
  );

  const genRange = useMemo(
    () => GENERATIONS.find((g) => g.id === selectedGen)?.range ?? null,
    [selectedGen]
  );

  const filteredPokemon = useMemo(() => {
    if (!allPokemon) return [];

    let list = allPokemon;

    // Gen filter (by ID range)
    if (genRange) {
      list = list.filter((p) => p.id >= genRange[0] && p.id <= genRange[1]);
    }

    // Type filter
    if (typeSet) {
      list = list.filter((p) => typeSet.has(p.name));
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.includes(q) ||
          String(p.id).includes(q) ||
          String(p.id).padStart(4, "0").includes(q)
      );
    }

    // Sort
    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => a.id - b.id);
    }

    return list;
  }, [allPokemon, genRange, typeSet, search, sort]);

  const totalPages = Math.ceil(filteredPokemon.length / PAGE_SIZE);
  const currentPagePokemon = useMemo(
    () => filteredPokemon.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p) => p.name),
    [filteredPokemon, page]
  );

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);
  const handleType   = useCallback((v: string) => { setSelectedType(v); setPage(1); }, []);
  const handleGen    = useCallback((v: number) => { setSelectedGen(v); setPage(1); }, []);
  const handleSort   = useCallback((v: string) => { setSort(v as SortOption); setPage(1); }, []);

  return (
    <div className="min-h-screen hex-bg">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg,rgba(13,18,32,0.9) 0%,transparent 100%)",
          paddingTop: "3rem",
          paddingBottom: "2.5rem",
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(99,102,241,0.08)", transform: "translateY(-50%)" }}
        />
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(139,92,246,0.06)", transform: "translateY(-50%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a78bfa",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{ background: "#a78bfa" }}
              />
              {TOTAL_POKEMON} Pokémon · Gen I–IX
            </div>

            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-wider"
              style={{
                background: "linear-gradient(135deg,#f0f4ff 0%,#a78bfa 50%,#38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              POKÉDEX
            </h1>

            <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "#8b9ab8" }}>
              Explore every Pokémon from every generation. Search, filter, compare and discover.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <div
            className="p-5 rounded-2xl"
            style={{
              background: "rgba(13,18,32,0.8)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
            }}
          >
            <FilterBar
              search={search}          onSearch={handleSearch}
              selectedType={selectedType} onType={handleType}
              selectedGen={selectedGen}   onGen={handleGen}
              sort={sort}               onSort={handleSort}
              total={allPokemon?.length ?? TOTAL_POKEMON}
              filtered={filteredPokemon.length}
            />
          </div>
        </motion.div>

        {/* Type loading state */}
        {selectedType && !typeSet && (
          <div className="mb-6 flex items-center gap-2" style={{ color: "#8b9ab8" }}>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading {selectedType} type Pokémon…</span>
          </div>
        )}

        {/* Grid */}
        {listLoading ? (
          <SkeletonGrid count={20} />
        ) : (
          <>
            <PokemonGrid names={currentPagePokemon} />
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
