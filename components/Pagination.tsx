"use client";
import { motion } from "framer-motion";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export function Pagination({ page, totalPages, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const btnBase =
    "w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-200";

  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#8b9ab8",
        }}
      >
        ‹
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[#4a5568]">
            ···
          </span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPage(p as number)}
            className={btnBase}
            style={
              page === p
                ? {
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    border: "1px solid transparent",
                    color: "#fff",
                    boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#8b9ab8",
                  }
            }
          >
            {p}
          </motion.button>
        )
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#8b9ab8",
        }}
      >
        ›
      </button>
    </div>
  );
}
