import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Pokédex · Built by Alan Teixidó",
  description:
    "A production-grade Pokédex app. Browse, search and compare all Pokémon with rich stats, evolutions and type matchups.",
  authors: [{ name: "Alan Teixidó", url: "https://alanteixido.dev/" }],
  openGraph: {
    title: "Pokédex · Built by Alan Teixidó",
    description: "Browse, search and compare all 1025 Pokémon.",
    type: "website",
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
      </body>
    </html>
  );
}
