# Pokédex — Built by Alan Teixidó

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel" alt="Vercel" />
  <a href="https://pokedex.alanteixido.dev">
    <img src="https://img.shields.io/badge/Live-pokedex.alanteixido.dev-6366f1?style=flat-square" alt="Live" />
  </a>
</p>

A production-grade, portfolio-worthy Pokédex built with **Next.js 16 App Router**, **TypeScript**, and **Tailwind CSS v4**. Browse all 1 025 Pokémon across nine generations with a cinematic dark/light theme, smooth Framer Motion animations, and a full suite of filters and tools.

---

> **Screenshot** — replace the placeholder below with an actual screenshot of the app.
>
> ![App Screenshot](https://pokedex.alanteixido.dev/og-image.png)

---

## Features

| Feature | Details |
|---|---|
| **Browse 1 025 Pokémon** | Server-side pre-fetched list embedded in HTML — zero cold-start empty grid |
| **Search** | Hero search bar and FilterBar search synced — filter by name or Pokédex ID |
| **Type & Generation filters** | Dropdown filters for all 18 types and all 9 generations |
| **Sort** | Sort by ID (default) or alphabetically by name |
| **Detail page** | Base stats with animated bars, abilities, weaknesses, type matchups |
| **Evolution chain** | Full evolution tree with triggers (level, item, trade, friendship…) |
| **Moves table** | Paginated move list with level, power, accuracy and type |
| **Compare** | Side-by-side comparison with a radar chart for any two Pokémon |
| **Favourites** | Heart button on every card — persisted in `localStorage` |
| **Light / Dark mode** | Sun/moon toggle in Navbar — warm off-white light theme, cinematic dark theme |
| **List / Grid view** | Toggle between card grid and compact list (ID · sprite · name · types · BST) |
| **PWA** | Installable on mobile and desktop — `manifest.json`, `theme-color`, app shortcuts |
| **SEO** | Dynamic `<title>` and Open Graph tags for every Pokémon page, sitemap, robots.txt |
| **Vercel Analytics** | Page-view tracking via `@vercel/analytics` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router, ISR, Server Components |
| Language | [TypeScript 5](https://www.typescriptlang.org/) — strict mode |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first config, custom design tokens |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Data fetching | [SWR v2](https://swr.vercel.app/) — client cache, deduplication |
| Data source | [PokéAPI](https://pokeapi.co/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/AlanTeixido/pokedex.git
cd pokedex

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → http://localhost:3000

# 4. (Optional) Build for production and preview
npm run build
npm start
```

No environment variables required — the app fetches public data from PokéAPI.

---

## Project Structure

```
app/
  layout.tsx           Root layout (Navbar, Footer, theme, PWA meta)
  page.tsx             Server Component — pre-fetches Pokémon list (ISR 24 h)
  globals.css          Tailwind v4 config, CSS tokens, animations
  pokemon/[name]/      Dynamic detail page (client) + SEO layout (server)
  compare/             Compare page (client + Suspense boundary)
  sitemap.ts           Dynamic sitemap for all 1 025 Pokémon
components/
  HomePageClient.tsx   All home-page interactivity (search, filter, SWR)
  HeroSection.tsx      Animated hero with random featured Pokémon
  PokemonCard.tsx      Grid card with sprite, types, favourites button
  ListView.tsx         Compact list row (ID · sprite · name · types · BST)
  FilterBar.tsx        Search, dropdowns, favourites toggle, view toggle
  ThemeProvider.tsx    Dark/light context + localStorage persistence
  FavoritesProvider.tsx  Favourites Set context + localStorage persistence
lib/
  api.ts               PokeAPI fetch helpers + formatter utilities
  typeColors.ts        Type → hex/glow/darkBg colour map
  typeMatchups.ts      Static effectiveness chart
  constants.ts         Generations, types, page size
```

---

## Live Demo

**[pokedex.alanteixido.dev](https://pokedex.alanteixido.dev)**

---

## Author

**Alan Teixidó** — [alanteixido.dev](https://alanteixido.dev)
