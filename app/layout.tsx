import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Pokédex | Built by Alan Teixidó",
  description:
    "Full-featured Pokédex with 1025 Pokémon. Search by name, filter by type and generation, view stats, evolution chains, and compare Pokémon side by side.",
  keywords: ["pokédex", "pokémon", "pokeapi", "stats", "evolution"],
  authors: [{ name: "Alan Teixidó", url: "https://alanteixido.dev/" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://pokedex.alanteixido.dev",
  },
  openGraph: {
    title: "Pokédex | Built by Alan Teixidó",
    description:
      "Full-featured Pokédex with 1025 Pokémon. Search by name, filter by type and generation, view stats, evolution chains, and compare Pokémon side by side.",
    url: "https://pokedex.alanteixido.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokédex | Built by Alan Teixidó",
    description:
      "Full-featured Pokédex with 1025 Pokémon. Search by name, filter by type and generation, view stats, evolution chains, and compare Pokémon side by side.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
