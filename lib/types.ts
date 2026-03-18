export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface PokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: { name: string; url: string };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: { name: string };
    version_group: { name: string };
  }[];
}

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: { front_default: string | null };
    home: { front_default: string | null; front_shiny: string | null };
  };
  versions: {
    "generation-v": {
      "black-white": {
        animated: {
          front_default: string | null;
          back_default: string | null;
          front_shiny: string | null;
          back_shiny: string | null;
        };
      };
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: { name: string; url: string };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  genera: { genus: string; language: { name: string } }[];
  evolution_chain: { url: string };
  generation: { name: string; url: string };
  habitat: { name: string } | null;
  is_legendary: boolean;
  is_mythical: boolean;
  color: { name: string };
}

export interface EvolutionDetail {
  min_level: number | null;
  item: { name: string } | null;
  trigger: { name: string };
  held_item: { name: string } | null;
  known_move: { name: string } | null;
  min_happiness: number | null;
  time_of_day: string;
  location: { name: string } | null;
  min_beauty: number | null;
  needs_overworld_rain: boolean;
  turn_upside_down: boolean;
}

export interface EvolutionChainLink {
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

export interface AbilityDetail {
  id: number;
  name: string;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: { name: string };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version_group: { name: string };
  }[];
}

export interface TypeDamageRelations {
  double_damage_from: { name: string; url: string }[];
  double_damage_to: { name: string; url: string }[];
  half_damage_from: { name: string; url: string }[];
  half_damage_to: { name: string; url: string }[];
  no_damage_from: { name: string; url: string }[];
  no_damage_to: { name: string; url: string }[];
}

export interface TypeDetail {
  id: number;
  name: string;
  damage_relations: TypeDamageRelations;
}

export interface MoveDetail {
  id: number;
  name: string;
  type: { name: string };
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  damage_class: { name: string };
  effect_entries: { short_effect: string; language: { name: string } }[];
}

export type SortOption = "id" | "name" | "hp" | "attack" | "defense" | "speed";
export type GenerationId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
