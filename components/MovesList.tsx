"use client";
import { useState } from "react";
import useSWR from "swr";
import { PokemonMove, MoveDetail } from "@/lib/types";
import { TypeBadge } from "./TypeBadge";
import { formatName, fetchMove } from "@/lib/api";

/* ─── Category icon ───────────────────────────────────────────────────────── */
function CategoryIcon({ name }: { name: string }) {
  if (name === "physical") {
    return (
      <span
        title="Physical"
        className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded"
        style={{ background: "rgba(238,129,48,0.15)", color: "#EE8130" }}
      >
        ⚔️ Phys
      </span>
    );
  }
  if (name === "special") {
    return (
      <span
        title="Special"
        className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded"
        style={{ background: "rgba(99,144,240,0.15)", color: "#6390F0" }}
      >
        ✨ Spec
      </span>
    );
  }
  return (
    <span
      title="Status"
      className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded"
      style={{ background: "rgba(183,183,206,0.15)", color: "#B7B7CE" }}
    >
      🔄 Stat
    </span>
  );
}

/* ─── Skeleton cells for detail columns ─────────────────────────────────── */
function SkeletonCells() {
  return (
    <>
      <td className="px-3 py-2.5">
        <div className="skeleton h-5 w-14 rounded-full" />
      </td>
      <td className="px-3 py-2.5">
        <div className="skeleton h-5 w-16 rounded" />
      </td>
      <td className="px-3 py-2.5 text-center">
        <div className="skeleton h-4 w-7 mx-auto rounded" />
      </td>
      <td className="px-3 py-2.5 text-center">
        <div className="skeleton h-4 w-9 mx-auto rounded" />
      </td>
    </>
  );
}

/* ─── Per-row detail cells — lazy SWR fetch ─────────────────────────────── */
function MoveDetailCells({ moveName }: { moveName: string }) {
  const { data } = useSWR<MoveDetail>(
    `move-detail-${moveName}`,
    () => fetchMove(moveName)
  );

  if (!data) return <SkeletonCells />;

  return (
    <>
      <td className="px-3 py-2.5">
        <TypeBadge type={data.type.name} size="sm" />
      </td>
      <td className="px-3 py-2.5">
        <CategoryIcon name={data.damage_class.name} />
      </td>
      <td
        className="px-3 py-2.5 text-center text-xs font-bold tabular-nums"
        style={{ color: data.power ? "#f0f4ff" : "#4a5568" }}
      >
        {data.power ?? "—"}
      </td>
      <td
        className="px-3 py-2.5 text-center text-xs font-bold tabular-nums"
        style={{ color: data.accuracy ? "#a78bfa" : "#4a5568" }}
      >
        {data.accuracy ? `${data.accuracy}%` : "—"}
      </td>
    </>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
interface MovesListProps {
  moves: PokemonMove[];
}

export function MovesList({ moves }: MovesListProps) {
  const [showAll, setShowAll]           = useState(false);
  const [filter, setFilter]             = useState("");
  const [detailsEnabled, setDetails]    = useState(false);

  const processedMoves = moves
    .map((m) => {
      const latest = m.version_group_details
        .filter((d) => d.move_learn_method.name === "level-up")
        .sort((a, b) => (b.level_learned_at ?? 0) - (a.level_learned_at ?? 0))[0];
      return {
        name: m.move.name,
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
      {/* Toolbar */}
      <div
        className="p-4 flex flex-wrap items-center gap-3"
        style={{ background: "rgba(13,18,32,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter moves…"
          className="w-full sm:w-56 px-3 py-2 rounded-lg text-sm outline-none transition-all"
          style={{
            background: "rgba(17,24,39,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0f4ff",
          }}
          onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.4)")}
          onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
        />

        {/* Load Details toggle */}
        <button
          onClick={() => setDetails((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
          style={
            detailsEnabled
              ? { background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#a78bfa" }
              : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8b9ab8" }
          }
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {detailsEnabled ? "Hide Details" : "Load Details"}
        </button>

        {detailsEnabled && (
          <span className="text-xs" style={{ color: "#4a5568" }}>
            Fetching type · category · power · accuracy for {displayed.length} moves
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(13,18,32,0.4)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th className="px-4 py-2.5 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                  Move
                </th>
                {detailsEnabled && (
                  <>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                      Type
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                      Cat.
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                      Pwr
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a5568" }}>
                      Acc
                    </th>
                  </>
                )}
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
                  style={{
                    borderBottom:
                      i < displayed.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <td className="px-4 py-2.5">
                    <span className="font-medium capitalize" style={{ color: "#f0f4ff" }}>
                      {formatName(move.name)}
                    </span>
                  </td>

                  {/* Detail cells — rendered only when toggle is on */}
                  {detailsEnabled && <MoveDetailCells moveName={move.name} />}

                  <td className="px-4 py-2.5">
                    <span
                      className="text-xs capitalize px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          move.method === "level-up"
                            ? "rgba(99,102,241,0.12)"
                            : "rgba(139,139,139,0.1)",
                        color: move.method === "level-up" ? "#a78bfa" : "#8b9ab8",
                      }}
                    >
                      {formatName(move.method)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {move.level !== null ? (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
                        style={{
                          background: "rgba(99,102,241,0.12)",
                          color: "#6366f1",
                        }}
                      >
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
        </div>

        {processedMoves.length > 20 && (
          <div
            className="p-4 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-sm font-medium transition-colors"
              style={{ color: "#6366f1" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
            >
              {showAll ? "Show less" : `Show all ${processedMoves.length} moves`}
            </button>
          </div>
        )}

        {processedMoves.length === 0 && (
          <div className="p-8 text-center" style={{ color: "#4a5568" }}>
            No moves match &ldquo;{filter}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
