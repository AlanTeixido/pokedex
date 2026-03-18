export interface TypeColor {
  hex: string;
  glow: string;
  darkBg: string;
  label: string;
}

export const TYPE_COLORS: Record<string, TypeColor> = {
  normal:   { hex: "#A8A77A", glow: "rgba(168,167,122,0.45)", darkBg: "#3d3d2e", label: "Normal" },
  fire:     { hex: "#EE8130", glow: "rgba(238,129,48,0.5)",   darkBg: "#4a2a10", label: "Fire" },
  water:    { hex: "#6390F0", glow: "rgba(99,144,240,0.5)",   darkBg: "#1a2d5a", label: "Water" },
  electric: { hex: "#F7D02C", glow: "rgba(247,208,44,0.5)",   darkBg: "#4a3d08", label: "Electric" },
  grass:    { hex: "#7AC74C", glow: "rgba(122,199,76,0.5)",   darkBg: "#1f3d10", label: "Grass" },
  ice:      { hex: "#96D9D6", glow: "rgba(150,217,214,0.45)", darkBg: "#1a3d3c", label: "Ice" },
  fighting: { hex: "#C22E28", glow: "rgba(194,46,40,0.5)",    darkBg: "#3d0c0a", label: "Fighting" },
  poison:   { hex: "#A33EA1", glow: "rgba(163,62,161,0.5)",   darkBg: "#2d1030", label: "Poison" },
  ground:   { hex: "#E2BF65", glow: "rgba(226,191,101,0.5)",  darkBg: "#3d2e10", label: "Ground" },
  flying:   { hex: "#A98FF3", glow: "rgba(169,143,243,0.5)",  darkBg: "#271d4a", label: "Flying" },
  psychic:  { hex: "#F95587", glow: "rgba(249,85,135,0.5)",   darkBg: "#4a1025", label: "Psychic" },
  bug:      { hex: "#A6B91A", glow: "rgba(166,185,26,0.45)",  darkBg: "#2a3008", label: "Bug" },
  rock:     { hex: "#B6A136", glow: "rgba(182,161,54,0.45)",  darkBg: "#30280a", label: "Rock" },
  ghost:    { hex: "#735797", glow: "rgba(115,87,151,0.5)",   darkBg: "#1d1530", label: "Ghost" },
  dragon:   { hex: "#6F35FC", glow: "rgba(111,53,252,0.5)",   darkBg: "#1c0a4a", label: "Dragon" },
  dark:     { hex: "#705746", glow: "rgba(112,87,70,0.45)",   darkBg: "#1e1510", label: "Dark" },
  steel:    { hex: "#B7B7CE", glow: "rgba(183,183,206,0.4)",  darkBg: "#25253a", label: "Steel" },
  fairy:    { hex: "#D685AD", glow: "rgba(214,133,173,0.5)",  darkBg: "#3d1a2a", label: "Fairy" },
};

export const STAT_COLORS: Record<string, string> = {
  hp:               "#FF5959",
  attack:           "#F5AC78",
  defense:          "#FAE078",
  "special-attack": "#9DB7F5",
  "special-defense":"#A7DB8D",
  speed:            "#FA92B2",
};

export const STAT_LABELS: Record<string, string> = {
  hp:               "HP",
  attack:           "ATK",
  defense:          "DEF",
  "special-attack": "Sp.Atk",
  "special-defense":"Sp.Def",
  speed:            "SPD",
};

export const STAT_MAX = 255;

export function getTypeColor(type: string): TypeColor {
  return TYPE_COLORS[type] ?? TYPE_COLORS.normal;
}

export function getPrimaryTypeColor(types: { type: { name: string } }[]): TypeColor {
  const primary = types[0]?.type?.name ?? "normal";
  return getTypeColor(primary);
}
