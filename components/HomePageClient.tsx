"use client";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { HeroSection } from "@/components/HeroSection";
import { FilterBar } from "@/components/FilterBar";
import { PokemonGrid } from "@/components/PokemonGrid";
import { ListView } from "@/components/ListView";
import { Pagination } from "@/components/Pagination";
import { fetchAllPokemonList, fetchPokemonByType } from "@/lib/api";
import { GENERATIONS, PAGE_SIZE, TOTAL_POKEMON } from "@/lib/constants";
import { useFavorites } from "@/components/FavoritesProvider";

type SortOption = "id" | "name";
type ViewMode = "grid" | "list";

export interface PokemonEntry {
  name: string;
  id: number;
}

interface HomePageClientProps {
  initialPokemon: PokemonEntry[];
}

export function HomePageClient({ initialPokemon }: HomePageClientProps) {
  const [search, setSearch]             = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGen, setSelectedGen]   = useState(0);
  const [sort, setSort]                 = useState<SortOption>("id");
  const [page, setPage]                 = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode]         = useState<ViewMode>("grid");

  const { favorites } = useFavorites();

  // initialPokemon is server-fetched — use it as fallbackData so SWR never
  // shows an empty state, even if background revalidation is in-flight.
  const { data: allPokemon } = useSWR<PokemonEntry[]>(
    "all-pokemon-list",
    fetchAllPokemonList,
    { fallbackData: initialPokemon }
  );

  // Type filter
  const { data: typeList, isLoading: typeLoading } = useSWR<string[]>(
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

    if (genRange) {
      list = list.filter((p) => p.id >= genRange[0] && p.id <= genRange[1]);
    }

    if (typeSet) {
      list = list.filter((p) => typeSet.has(p.name));
    }

    if (showFavorites) {
      list = list.filter((p) => favorites.has(p.name));
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.includes(q) ||
          String(p.id).includes(q) ||
          String(p.id).padStart(4, "0").includes(q)
      );
    }

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => a.id - b.id);
    }

    return list;
  }, [allPokemon, genRange, typeSet, showFavorites, favorites, search, sort]);

  const totalPages = Math.ceil(filteredPokemon.length / PAGE_SIZE);
  const currentPagePokemon = useMemo(
    () =>
      filteredPokemon
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map((p) => p.name),
    [filteredPokemon, page]
  );

  const handleSearch    = useCallback((v: string) => { setSearch(v);             setPage(1); }, []);
  const handleType      = useCallback((v: string) => { setSelectedType(v);       setPage(1); }, []);
  const handleGen       = useCallback((v: number) => { setSelectedGen(v);        setPage(1); }, []);
  const handleSort      = useCallback((v: string) => { setSort(v as SortOption); setPage(1); }, []);
  const handleFavorites = useCallback((v: boolean) => { setShowFavorites(v);     setPage(1); }, []);

  return (
    <div className="min-h-screen hex-bg">
      {/* Enhanced Hero */}
      <HeroSection search={search} onSearch={handleSearch} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">

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
              background: "var(--bg-filter)",
              border: "1px solid var(--border-subtle)",
              backdropFilter: "blur(12px)",
            }}
          >
            <FilterBar
              search={search}               onSearch={handleSearch}
              selectedType={selectedType}   onType={handleType}
              selectedGen={selectedGen}     onGen={handleGen}
              sort={sort}                   onSort={handleSort}
              total={allPokemon?.length ?? TOTAL_POKEMON}
              filtered={filteredPokemon.length}
              showFavorites={showFavorites} onFavorites={handleFavorites}
              viewMode={viewMode}           onViewMode={setViewMode}
            />
          </div>
        </motion.div>

        {/* Type loading indicator */}
        {selectedType && typeLoading && (
          <div className="mb-6 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading {selectedType} type Pokémon…</span>
          </div>
        )}

        {/* Pokémon list / grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === "grid" ? (
              <PokemonGrid names={currentPagePokemon} />
            ) : (
              <ListView names={currentPagePokemon} />
            )}
          </motion.div>
        </AnimatePresence>

        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>
    </div>
  );
}
