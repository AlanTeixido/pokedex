"use client";
import { SWRConfig } from "swr";
import { ThemeProvider } from "./ThemeProvider";
import { FavoritesProvider } from "./FavoritesProvider";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
        errorRetryCount: 3,
      }}
    >
      <ThemeProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
