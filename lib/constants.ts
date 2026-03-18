export const POKEMON_API_BASE = "https://pokeapi.co/api/v2";
export const TOTAL_POKEMON = 1025;
export const PAGE_SIZE = 20;

export const GENERATIONS: { id: number; name: string; range: [number, number] }[] = [
  { id: 1, name: "Gen I",   range: [1, 151] },
  { id: 2, name: "Gen II",  range: [152, 251] },
  { id: 3, name: "Gen III", range: [252, 386] },
  { id: 4, name: "Gen IV",  range: [387, 493] },
  { id: 5, name: "Gen V",   range: [494, 649] },
  { id: 6, name: "Gen VI",  range: [650, 721] },
  { id: 7, name: "Gen VII", range: [722, 809] },
  { id: 8, name: "Gen VIII",range: [810, 905] },
  { id: 9, name: "Gen IX",  range: [906, 1025] },
];

export const ALL_TYPES = [
  "normal","fire","water","electric","grass","ice",
  "fighting","poison","ground","flying","psychic","bug",
  "rock","ghost","dragon","dark","steel","fairy",
];
