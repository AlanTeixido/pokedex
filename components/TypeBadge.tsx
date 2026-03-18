import { getTypeColor } from "@/lib/typeColors";
import { formatName } from "@/lib/api";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md" | "lg";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const color = getTypeColor(type);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wider uppercase ${sizeClasses[size]}`}
      style={{
        background: `${color.hex}22`,
        color: color.hex,
        border: `1px solid ${color.hex}44`,
        letterSpacing: "0.08em",
      }}
    >
      {formatName(type)}
    </span>
  );
}
