"use client";

import { useMarketStore } from "@/stores/marketStore";
import { formatUsd } from "@/lib/format";

export function OraclePrice() {
  const priceUsd = useMarketStore((s) => s.oraclePriceUsd);
  const stale = useMarketStore((s) => s.oracleStale);
  const timestamp = useMarketStore((s) => s.oracleTimestamp);

  const staleness = timestamp > 0
    ? Math.floor(Date.now() / 1000) - timestamp
    : Infinity;

  const dotColor =
    staleness < 10 ? "bg-green-500" :
    staleness < 30 ? "bg-yellow-400" :
    "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="text-xl font-mono font-bold font-tabular">
        {priceUsd > 0 ? formatUsd(priceUsd, 2) : "-.--"}
      </span>
      {stale && (
        <span className="text-[10px] text-red-400">STALE</span>
      )}
    </div>
  );
}
