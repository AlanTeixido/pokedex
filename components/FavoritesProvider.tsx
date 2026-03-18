"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("poke-favorites");
      if (stored) setFavorites(new Set(JSON.parse(stored) as string[]));
    } catch {
      // ignore parse errors
    }
  }, []);

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      try {
        localStorage.setItem("poke-favorites", JSON.stringify([...next]));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const isFavorite = (name: string) => favorites.has(name);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
