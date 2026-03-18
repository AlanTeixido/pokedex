import { getDefensiveMatchups } from "@/lib/typeMatchups";
import { TYPE_COLORS } from "@/lib/typeColors";
import { formatName } from "@/lib/api";

interface WeaknessChartProps {
  types: string[];
}

interface MultiplierBadgeProps {
  type: string;
  multiplier: number;
}

function MultiplierBadge({ type, multiplier }: MultiplierBadgeProps) {
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.normal;
  const label = multiplier === 0 ? "0×" : multiplier < 1 ? `${multiplier}×` : `${multiplier}×`;
  return (
    <div
      className="flex flex-col items-center gap-1.5"
      title={`${formatName(type)}: ${label}`}
    >
      <span
        className="px-2.5 py-1 rounded-lg text-xs font-bold"
        style={{
          background: `${color.hex}22`,
          border: `1px solid ${color.hex}44`,
          color: color.hex,
        }}
      >
        {formatName(type)}
      </span>
      <span className="text-xs font-bold" style={{ color: multiplier >= 2 ? "#FF5959" : multiplier === 0 ? "#4a5568" : "#7AC74C" }}>
        {label}
      </span>
    </div>
  );
}

export function WeaknessChart({ types }: WeaknessChartProps) {
  const { weaknesses, resistances, immunities } = getDefensiveMatchups(types);

  return (
    <div
      className="p-5 rounded-2xl space-y-5"
      style={{ background: "rgba(13,18,32,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {weaknesses.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FF5959" }}>
            Weak to
          </h4>
          <div className="flex flex-wrap gap-3">
            {weaknesses.map(({ type, multiplier }) => (
              <MultiplierBadge key={type} type={type} multiplier={multiplier} />
            ))}
          </div>
        </div>
      )}

      {resistances.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#7AC74C" }}>
            Resistant to
          </h4>
          <div className="flex flex-wrap gap-3">
            {resistances.map(({ type, multiplier }) => (
              <MultiplierBadge key={type} type={type} multiplier={multiplier} />
            ))}
          </div>
        </div>
      )}

      {immunities.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4a5568" }}>
            Immune to
          </h4>
          <div className="flex flex-wrap gap-3">
            {immunities.map(({ type }) => (
              <MultiplierBadge key={type} type={type} multiplier={0} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
