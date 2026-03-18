export function SkeletonCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col items-center gap-3"
      style={{
        background: "rgba(17,24,39,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ID */}
      <div className="skeleton h-3 w-12 self-start" />
      {/* Sprite */}
      <div className="skeleton w-24 h-24 rounded-full" />
      {/* Name */}
      <div className="skeleton h-4 w-28" />
      {/* Types */}
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
