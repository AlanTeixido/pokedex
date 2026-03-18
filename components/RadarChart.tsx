"use client";
import { STAT_LABELS } from "@/lib/typeColors";

interface StatEntry {
  name: string;
  value: number;
}

interface RadarChartProps {
  stats1: StatEntry[];
  stats2?: StatEntry[];
  color1?: string;
  color2?: string;
  size?: number;
}

const STAT_ORDER = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
const MAX_STAT = 255;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function buildPolygonPoints(
  stats: StatEntry[],
  cx: number,
  cy: number,
  maxR: number
): string {
  return STAT_ORDER.map((key, i) => {
    const stat = stats.find((s) => s.name === key);
    const val = stat?.value ?? 0;
    const pct = val / MAX_STAT;
    const angle = (360 / STAT_ORDER.length) * i;
    const { x, y } = polarToCartesian(cx, cy, maxR * pct, angle);
    return `${x},${y}`;
  }).join(" ");
}

export function RadarChart({
  stats1,
  stats2,
  color1 = "#6366f1",
  color2 = "#F95587",
  size = 280,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = STAT_ORDER.length;
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
    >
      {/* Background rings */}
      {rings.map((r) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const angle = (360 / n) * i;
          const { x, y } = polarToCartesian(cx, cy, maxR * r, angle);
          return `${x},${y}`;
        }).join(" ");
        return (
          <polygon
            key={r}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {STAT_ORDER.map((_, i) => {
        const angle = (360 / n) * i;
        const { x, y } = polarToCartesian(cx, cy, maxR, angle);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={x} y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        );
      })}

      {/* Stat labels */}
      {STAT_ORDER.map((key, i) => {
        const angle = (360 / n) * i;
        const { x, y } = polarToCartesian(cx, cy, maxR + 22, angle);
        const label = STAT_LABELS[key] ?? key;
        return (
          <text
            key={key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fontWeight={600}
            fill="rgba(139,154,184,0.9)"
            fontFamily="Exo 2, sans-serif"
          >
            {label}
          </text>
        );
      })}

      {/* Pokemon 2 polygon (behind) */}
      {stats2 && (
        <polygon
          points={buildPolygonPoints(stats2, cx, cy, maxR)}
          fill={`${color2}28`}
          stroke={color2}
          strokeWidth={2}
          strokeLinejoin="round"
          style={{ transition: "all 0.6s ease" }}
        />
      )}

      {/* Pokemon 1 polygon (front) */}
      <polygon
        points={buildPolygonPoints(stats1, cx, cy, maxR)}
        fill={`${color1}28`}
        stroke={color1}
        strokeWidth={2}
        strokeLinejoin="round"
        style={{ transition: "all 0.6s ease" }}
      />

      {/* Stat dots pokemon 1 */}
      {STAT_ORDER.map((key, i) => {
        const stat = stats1.find((s) => s.name === key);
        const val = stat?.value ?? 0;
        const pct = val / MAX_STAT;
        const angle = (360 / n) * i;
        const { x, y } = polarToCartesian(cx, cy, maxR * pct, angle);
        return (
          <circle
            key={`dot1-${key}`}
            cx={x} cy={y} r={4}
            fill={color1}
            stroke="rgba(8,11,20,0.8)"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Stat dots pokemon 2 */}
      {stats2 && STAT_ORDER.map((key, i) => {
        const stat = stats2.find((s) => s.name === key);
        const val = stat?.value ?? 0;
        const pct = val / MAX_STAT;
        const angle = (360 / n) * i;
        const { x, y } = polarToCartesian(cx, cy, maxR * pct, angle);
        return (
          <circle
            key={`dot2-${key}`}
            cx={x} cy={y} r={4}
            fill={color2}
            stroke="rgba(8,11,20,0.8)"
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}
