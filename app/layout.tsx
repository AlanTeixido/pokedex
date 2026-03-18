import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pokédex",
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
  // suppressHydrationWarning: the anti-FOUC script mutates the class list
  // before React hydrates, so the server-rendered "dark" class may differ
  // from what the browser sees. This is the recommended pattern for theme
  // toggles in Next.js App Router.
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply theme class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className="min-h-screen flex flex-col"
        style={{ background: "var(--bg-primary)" }}
      >
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
