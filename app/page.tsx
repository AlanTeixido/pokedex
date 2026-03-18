import { HomePageClient } from "@/components/HomePageClient";
import { fetchAllPokemonList } from "@/lib/api";

// Revalidate the Pokémon list once per day (ISR).
// The full list is embedded in the page HTML so the client never needs
// a cold-start round-trip to PokeAPI — fixing the production empty-grid bug.
export const revalidate = 86400;

export default async function HomePage() {
  let initialPokemon: { name: string; id: number }[] = [];

  try {
    initialPokemon = await fetchAllPokemonList();
  } catch (err) {
    // If the build-time fetch fails, fall back to an empty array.
    // The client-side SWR in HomePageClient will retry automatically.
    console.error("[HomePage] Failed to pre-fetch Pokémon list:", err);
  }

  return <HomePageClient initialPokemon={initialPokemon} />;
}
