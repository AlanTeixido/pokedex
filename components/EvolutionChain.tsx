"use client";
import Image from "next/image";
import Link from "next/link";
import { EvolutionChainLink } from "@/lib/types";
import { formatName, getEvolutionTriggerText, getPokemonSpriteUrl } from "@/lib/api";
import { getPrimaryTypeColor } from "@/lib/typeColors";

function getIdFromUrl(url: string): number {
  return parseInt(url.split("/").filter(Boolean).pop() ?? "1");
}

interface EvoNodeProps {
  link: EvolutionChainLink;
  currentName?: string;
}

function EvoNode({ link, currentName }: EvoNodeProps) {
  const id = getIdFromUrl(link.species.url);
  const isActive = link.species.name === currentName;

  return (
    <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-start">
      {/* Current species */}
      <Link href={`/pokemon/${link.species.name}`} className="group flex flex-col items-center gap-2">
        <div
          className="relative w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
          style={{
            background: isActive
              ? "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))"
              : "rgba(17,24,39,0.8)",
            border: isActive
              ? "1px solid rgba(99,102,241,0.4)"
              : "1px solid rgba(255,255,255,0.07)",
            boxShadow: isActive ? "0 0 16px rgba(99,102,241,0.25)" : "none",
          }}
        >
          <Image
            src={getPokemonSpriteUrl(id)}
            alt={link.species.name}
            width={64}
            height={64}
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
            unoptimized
          />
        </div>
        <span
          className="text-xs font-semibold text-center capitalize"
          style={{ color: isActive ? "#a78bfa" : "#8b9ab8" }}
        >
          {formatName(link.species.name)}
        </span>
        <span className="text-[10px]" style={{ color: "#4a5568" }}>
          #{String(id).padStart(4, "0")}
        </span>
      </Link>

      {/* Evolutions */}
      {link.evolves_to.map((evo) => {
        const trigger = getEvolutionTriggerText(evo.evolution_details);
        return (
          <div key={evo.species.name} className="flex flex-col sm:flex-row items-center gap-2">
            {/* Arrow */}
            <div className="flex flex-col items-center gap-1 px-2 sm:px-4">
              <svg className="w-5 h-5 text-[#4a5568] rotate-90 sm:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {trigger && (
                <span
                  className="text-[9px] font-semibold text-center max-w-16 leading-tight"
                  style={{ color: "#6366f1" }}
                >
                  {trigger}
                </span>
              )}
            </div>

            {/* Recursive */}
            <EvoNode link={evo} currentName={currentName} />
          </div>
        );
      })}
    </div>
  );
}

interface EvolutionChainDisplayProps {
  chain: EvolutionChainLink;
  currentName?: string;
}

export function EvolutionChainDisplay({ chain, currentName }: EvolutionChainDisplayProps) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(13,18,32,0.6)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2">
        <EvoNode link={chain} currentName={currentName} />
      </div>
    </div>
  );
}
