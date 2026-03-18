"use client";
import { useState } from "react";
import { PokemonMove } from "@/lib/types";
import { TypeBadge } from "./TypeBadge";
import { formatName } from "@/lib/api";

interface MovesListProps {
  moves: PokemonMove[];
}

export function MovesList({ moves }: MovesListProps) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("");

  // Get latest version move data
  const processedMoves = moves
    .map((m) => {
      const latest = m.version_group_details
        .filter((d) => d.move_learn_method.name === "level-up")
        .sort((a, b) => (b.level_learned_at ?? 0) - (a.level_learned_at ?? 0))[0];
      return {
        name: m.move.name,
        url: m.move.url,
        level: latest?.level_learned_at ?? null,
        method: m.version_group_details[0]?.move_learn_method.name ?? "unknown",
      };
    })
    .filter((m) => m.name.includes(filter.toLowerCase().trim()) || filter === "")
    .sort((a, b) => {
      if (a.level !== null && b.level !== null) return a.level - b.level;
      if (a.level !== null) return -1;
      if (b.level !== null) return 1;
      return a.name.localeCompare(b.name);
    });

  const displayed = showAll ? processedMoves : processedMoves.slice(0, 20);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Search */}
      <div
        className="p-4"
        style={{ background: "rgba(13,18,32,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter moves…"
          className="w-full sm:w-64 px-3 py-2 rounded-lg text-sm outline-none transition-all"
          style={{
            background: "rgba(17,24,39,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0f4ff",
          }}
          onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.4)")}
          onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
        />
      </div>

      {/* Table */}
      <div style={{ background: "rgba(13,18,32,0.4)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <th className="px-4 py-2.5 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                Move
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                Method
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                Lv.
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((move, i) => (
              <tr
                key={move.name}
                className="transition-colors hover:bg-white/5"
                style={{ borderBottom: i < displayed.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <td className="px-4 py-2.5">
                  <span className="font-medium capitalize" style={{ color: "#f0f4ff" }}>
                    {formatName(move.name)}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="text-xs capitalize"
                    style={{ color: move.method === "level-up" ? "#a78bfa" : "#8b9ab8" }}
                  >
                    {formatName(move.method)}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  {move.level !== null ? (
                    <span className="text-xs font-bold" style={{ color: "#6366f1" }}>
                      {move.level === 0 ? "—" : move.level}
                    </span>
                  ) : (
                    <span style={{ color: "#4a5568" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {processedMoves.length > 20 && (
          <div className="p-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-sm font-medium transition-colors"
              style={{ color: "#6366f1" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
            >
              {showAll
                ? "Show less"
                : `Show all ${processedMoves.length} moves`}
            </button>
          </div>
        )}

        {processedMoves.length === 0 && (
          <div className="p-8 text-center" style={{ color: "#4a5568" }}>
            No moves match "{filter}"
          </div>
        )}
      </div>
    </div>
  );
}
