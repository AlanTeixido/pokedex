import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain, AbilityDetail, TypeDetail, MoveDetail } from "./types";
import { POKEMON_API_BASE, TOTAL_POKEMON } from "./constants";

const cache = new Map<string, unknown>();

async function fetchCached<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data as T;
}

export async function fetchAllPokemonList(): Promise<{ name: string; id: number }[]> {
  const data = await fetchCached<PokemonListResponse>(
    `${POKEMON_API_BASE}/pokemon?limit=${TOTAL_POKEMON}&offset=0`
  );
  return data.results.map((p) => ({
    name: p.name,
    id: parseInt(p.url.split("/").filter(Boolean).pop() ?? "0"),
  }));
}

export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  return fetchCached<Pokemon>(`${POKEMON_API_BASE}/pokemon/${nameOrId}`);
}

export async function fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  return fetchCached<PokemonSpecies>(`${POKEMON_API_BASE}/pokemon-species/${nameOrId}`);
}

export async function fetchEvolutionChain(id: number): Promise<EvolutionChain> {
  return fetchCached<EvolutionChain>(`${POKEMON_API_BASE}/evolution-chain/${id}`);
}

export async function fetchAbility(nameOrId: string | number): Promise<AbilityDetail> {
  return fetchCached<AbilityDetail>(`${POKEMON_API_BASE}/ability/${nameOrId}`);
}

export async function fetchType(name: string): Promise<TypeDetail> {
  return fetchCached<TypeDetail>(`${POKEMON_API_BASE}/type/${name}`);
}

export async function fetchMove(nameOrId: string | number): Promise<MoveDetail> {
  return fetchCached<MoveDetail>(`${POKEMON_API_BASE}/move/${nameOrId}`);
}

export async function fetchPokemonByType(type: string): Promise<string[]> {
  const data = await fetchCached<{
    pokemon: { pokemon: { name: string; url: string } }[];
  }>(`${POKEMON_API_BASE}/type/${type}`);
  return data.pokemon.map((p) => p.pokemon.name);
}

export function getPokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonAnimatedUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
}

export function getPokemonOfficialArtUrl(id: number, shiny = false): string {
  const base = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
  return shiny ? `${base}/shiny/${id}.png` : `${base}/${id}.png`;
}

export function extractEvolutionChainId(url: string): number {
  return parseInt(url.split("/").filter(Boolean).pop() ?? "1");
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

export function formatName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatHeight(height: number): string {
  const meters = height / 10;
  const feet = Math.floor(meters * 3.28084);
  const inches = Math.round((meters * 3.28084 - feet) * 12);
  return `${meters.toFixed(1)}m (${feet}'${inches}")`;
}

export function formatWeight(weight: number): string {
  const kg = weight / 10;
  const lbs = (kg * 2.20462).toFixed(1);
  return `${kg.toFixed(1)}kg (${lbs}lbs)`;
}

export function getEvolutionTriggerText(details: import("./types").EvolutionDetail[]): string {
  if (!details || details.length === 0) return "";
  const d = details[0];
  if (d.trigger.name === "level-up") {
    if (d.min_level) return `Lv. ${d.min_level}`;
    if (d.min_happiness) return `Friendship`;
    if (d.location) return `Level up at ${formatName(d.location.name)}`;
    if (d.time_of_day) return `Level up (${d.time_of_day})`;
    return "Level up";
  }
  if (d.trigger.name === "use-item" && d.item) return formatName(d.item.name);
  if (d.trigger.name === "trade") {
    if (d.held_item) return `Trade w/ ${formatName(d.held_item.name)}`;
    return "Trade";
  }
  return formatName(d.trigger.name);
}
