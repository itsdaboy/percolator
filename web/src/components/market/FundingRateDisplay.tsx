"use client";

import { useMarketStore } from "@/stores/marketStore";

export function FundingRateDisplay() {
  const engine = useMarketStore((s) => s.engine);

  if (!engine) return <span className="text-slate-500">-</span>;

  const bpsPerSlot = Number(engine.fundingRateBpsPerSlotLast);
  // ~9000 slots/hr on Solana
  const hourlyBps = bpsPerSlot * 9000;
  const hourlyPct = hourlyBps / 10000;

  const isPositive = hourlyPct >= 0;
  const color = isPositive ? "text-green-400" : "text-red-400";

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-slate-500 uppercase">Funding</span>
      <span className={`font-mono text-sm font-tabular ${color}`}>
        {isPositive ? "+" : ""}
        {hourlyPct.toFixed(4)}%/hr
      </span>
    </div>
  );
}
