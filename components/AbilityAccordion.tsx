"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { AbilityDetail } from "@/lib/types";
import { fetchAbility, formatName } from "@/lib/api";

interface AbilityAccordionProps {
  name: string;
  isHidden: boolean;
}

function AbilityContent({ name }: { name: string }) {
  const { data, isLoading } = useSWR<AbilityDetail>(
    `ability-${name}`,
    () => fetchAbility(name)
  );

  if (isLoading) return (
    <div className="py-2 space-y-1.5">
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-4/5" />
    </div>
  );

  const effectEntry = data?.effect_entries.find((e) => e.language.name === "en");
  const shortEffect = effectEntry?.short_effect ?? "No description available.";

  return (
    <p className="text-sm leading-relaxed" style={{ color: "#8b9ab8" }}>
      {shortEffect}
    </p>
  );
}

export function AbilityAccordion({ name, isHidden }: AbilityAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5"
        style={{ background: "rgba(17,24,39,0.6)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: "#f0f4ff" }}>
            {formatName(name)}
          </span>
          {isHidden && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "rgba(99,102,241,0.15)",
                color: "#a78bfa",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              Hidden
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "#4a5568" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="px-4 py-3"
              style={{ background: "rgba(13,18,32,0.5)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <AbilityContent name={name} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
