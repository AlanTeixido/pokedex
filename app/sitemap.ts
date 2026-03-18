import { MetadataRoute } from "next";

const BASE_URL = "https://pokedex.alanteixido.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0",
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();

  const pokemonEntries: MetadataRoute.Sitemap = data.results.map(
    (p: { name: string }) => ({
      url: `${BASE_URL}/pokemon/${p.name}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/compare`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...pokemonEntries,
  ];
}
