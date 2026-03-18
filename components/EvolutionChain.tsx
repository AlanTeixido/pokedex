"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EvolutionChainLink } from "@/lib/types";
import { formatName, getEvolutionTriggerText, getPokemonSpriteUrl } from "@/lib/api";

function getIdFromUrl(url: string): number {
  return parseInt(url.split("/").filter(Boolean).pop() ?? "1");
}

/* ─── Trigger badge ──────────────────────────────────────────────────────── */
function TriggerBadge({ text }: { text: string }) {
  // Try to detect level triggers for a numeric badge
  const levelMatch = text.match(/^Lv\. (\d+)$/);
  if (levelMatch) {
    return (
      <div
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black"
        style={{
          background: "rgba(99,102,241,0.18)",
          border: "1px solid rgba(99,102,241,0.35)",
          color: "#a78bfa",
        }}
      >
        <span style={{ color: "#6366f1", fontSize: "8px" }}>LV</span>
        {levelMatch[1]}
      </div>
    );
  }

  return (
    <div
      className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-center max-w-[80px] leading-tight"
      style={{
        background: "rgba(99,102,241,0.12)",
        border: "1px solid rgba(99,102,241,0.25)",
        color: "#8b9ab8",
      }}
    >
      {text}
    </div>
  );
}

/* ─── Single evolution node ──────────────────────────────────────────────── */
interface EvoNodeProps {
  link: EvolutionChainLink;
  currentName?: string;
  primaryTypeHex?: string;
}

function EvoNode({ link, currentName, primaryTypeHex }: EvoNodeProps) {
  const id = getIdFromUrl(link.species.url);
  const isActive = link.species.name === currentName;
  const glowHex = isActive ? (primaryTypeHex ?? "#6366f1") : null;

  return (
    <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-start">
      {/* Current species card */}
      <Link href={`/pokemon/${link.species.name}`} className="group flex flex-col items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.08, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-200"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${glowHex}22, ${glowHex}12)`
              : "rgba(17,24,39,0.8)",
            border: isActive
              ? `1.5px solid ${glowHex}55`
              : "1px solid rgba(255,255,255,0.08)",
            boxShadow: isActive
              ? `0 0 24px ${glowHex}55, 0 0 48px ${glowHex}22, inset 0 0 16px ${glowHex}10`
              : "none",
          }}
        >
          {/* Active pulse ring */}
          {isActive && (
            <div
              className="absolute inset-0 rounded-2xl animate-pulse-glow"
              style={{
                border: `1px solid ${glowHex}33`,
                boxShadow: `0 0 12px ${glowHex}33`,
              }}
            />
          )}
          <Image
            src={getPokemonSpriteUrl(id)}
            alt={link.species.name}
            width={96}
            height={96}
            className="relative z-10 object-contain group-hover:drop-shadow-lg transition-all duration-200"
            style={{ imageRendering: "pixelated" }}
            unoptimized
          />
        </motion.div>

        <div className="text-center">
          <span
            className="block text-xs font-bold capitalize transition-colors group-hover:text-white"
            style={{ color: isActive ? (glowHex ?? "#a78bfa") : "#8b9ab8" }}
          >
            {formatName(link.species.name)}
          </span>
          <span className="text-[10px]" style={{ color: "#4a5568" }}>
            #{String(id).padStart(4, "0")}
          </span>
        </div>
      </Link>

      {/* Evolutions */}
      {link.evolves_to.map((evo) => {
        const trigger = getEvolutionTriggerText(evo.evolution_details);
        return (
          <div key={evo.species.name} className="flex flex-col sm:flex-row items-center gap-3">
            {/* Arrow + trigger */}
            <div className="flex flex-col items-center gap-1.5 px-3">
              {/* Arrow */}
              <svg
                className="w-5 h-5 rotate-90 sm:rotate-0 flex-shrink-0"
                style={{ color: "#4a5568" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>

              {trigger && <TriggerBadge text={trigger} />}
            </div>

            {/* Recursive node */}
            <EvoNode link={evo} currentName={currentName} primaryTypeHex={primaryTypeHex} />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Public component ───────────────────────────────────────────────────── */
interface EvolutionChainDisplayProps {
  chain: EvolutionChainLink;
  currentName?: string;
  primaryTypeHex?: string;
}

export function EvolutionChainDisplay({ chain, currentName, primaryTypeHex }: EvolutionChainDisplayProps) {
  return (
    <div
      className="p-6 rounded-2xl"
      style={{
        background: "rgba(13,18,32,0.6)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        <EvoNode link={chain} currentName={currentName} primaryTypeHex={primaryTypeHex} />
      </div>
    </div>
  );
}
