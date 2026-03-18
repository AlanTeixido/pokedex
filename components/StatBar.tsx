"use client";
import { useEffect, useState } from "react";
import { STAT_COLORS, STAT_LABELS, STAT_MAX } from "@/lib/typeColors";

interface StatBarProps {
  statName: string;
  value: number;
  delay?: number;
}

export function StatBar({ statName, value, delay = 0 }: StatBarProps) {
  const [animated, setAnimated] = useState(false);
  const color = STAT_COLORS[statName] ?? "#8b9ab8";
  const label = STAT_LABELS[statName] ?? statName;
  const pct = Math.min((value / STAT_MAX) * 100, 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const getStatRating = (val: number) => {
    if (val >= 150) return "text-emerald-400";
    if (val >= 100) return "text-green-400";
    if (val >= 70)  return "text-yellow-400";
    if (val >= 50)  return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs font-semibold w-16 text-right shrink-0"
        style={{ color: "#8b9ab8", letterSpacing: "0.04em" }}
      >
        {label}
      </span>

      <span
        className={`text-sm font-bold w-8 text-right shrink-0 ${getStatRating(value)}`}
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {value}
      </span>

      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: animated ? `${pct}%` : "0%",
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: animated ? `0 0 8px ${color}66` : "none",
            transition: `width 0.9s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
