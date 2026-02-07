"use client";

import type { DepthLevel } from "@/lib/depth";

export function DepthRow({
  level,
  maxTotal,
  side,
}: {
  level: DepthLevel;
  maxTotal: number;
  side: "bid" | "ask";
}) {
  const barPct = maxTotal > 0 ? (level.total / maxTotal) * 100 : 0;
  const barColor = side === "bid" ? "bg-[var(--green)]/8" : "bg-[var(--red)]/8";
  const edgeColor = side === "bid" ? "bg-[var(--green)]/40" : "bg-[var(--red)]/40";
  const priceColor = side === "bid" ? "text-[var(--green)]" : "text-[var(--red)]";

  return (
    <div className="relative flex items-center h-[22px] px-3 text-[10px] terminal-mono tabular hover:bg-white/[0.03] transition-colors">
      {/* Background bar with transition */}
      <div
        className={`absolute inset-y-0 right-0 ${barColor} transition-[width] duration-300 ease-out`}
        style={{ width: `${barPct}%` }}
      />
      {/* Leading edge line */}
      <div
        className={`absolute top-0 bottom-0 w-[1px] ${edgeColor} transition-[right] duration-300 ease-out`}
        style={{ right: `${barPct}%` }}
      />

      {/* Data */}
      <span className={`relative z-10 flex-1 font-bold ${priceColor}`}>
        {level.price.toFixed(2)}
      </span>
      <span className="relative z-10 flex-1 text-right text-[var(--text-2)]">
        {level.size.toFixed(3)}
      </span>
      <span className="relative z-10 flex-1 text-right text-[var(--text-muted)]">
        {level.total.toFixed(3)}
      </span>
    </div>
  );
}
