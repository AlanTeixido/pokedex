import { Metadata } from "next";
import { fetchPokemon } from "@/lib/api";
import { formatName, getPokemonOfficialArtUrl } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  try {
    const pokemon = await fetchPokemon(name);
    const displayName = formatName(pokemon.name);
    const types = pokemon.types.map((t) => t.type.name).join(" / ");
    const artUrl = getPokemonOfficialArtUrl(pokemon.id);
    const title = `${displayName} | Pokédex`;
    const description = `${displayName} (#${String(pokemon.id).padStart(4, "0")}) is a ${types}-type Pokémon. View base stats, evolution chain, moves, abilities and type matchups.`;

    return {
      title,
      description,
      alternates: {
        canonical: `https://pokedex.alanteixido.dev/pokemon/${pokemon.name}`,
      },
      openGraph: {
        title,
        description,
        url: `https://pokedex.alanteixido.dev/pokemon/${pokemon.name}`,
        type: "website",
        images: [{ url: artUrl, width: 475, height: 475, alt: displayName }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [artUrl],
      },
    };
  } catch {
    return {
      title: "Pokémon | Pokédex",
      description: "View Pokémon stats, evolution chain, moves and more.",
    };
  }
}

export default function PokemonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
