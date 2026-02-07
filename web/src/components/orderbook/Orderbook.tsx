"use client";

import { useMemo } from "react";
import { useMarketStore } from "@/stores/marketStore";
import { useUiStore } from "@/stores/uiStore";
import { computeDepthLevels } from "@/lib/depth";
import { DepthRow } from "./DepthRow";
import { formatUsd } from "@/lib/format";

export function Orderbook() {
  const oraclePriceUsd = useMarketStore((s) => s.oraclePriceUsd);
  const accounts = useMarketStore((s) => s.accounts);
  const engine = useMarketStore((s) => s.engine);
  const collapsed = useUiStore((s) => s.orderbookCollapsed);
  const setCollapsed = useUiStore((s) => s.setOrderbookCollapsed);

  const { bids, asks } = useMemo(
    () => computeDepthLevels(accounts, oraclePriceUsd),
    [accounts, oraclePriceUsd]
  );

  const maxTotal = useMemo(() => {
    const maxBid = bids.length > 0 ? bids[bids.length - 1].total : 0;
    const maxAsk = asks.length > 0 ? asks[0].total : 0;
    return Math.max(maxBid, maxAsk);
  }, [bids, asks]);

  const totalOI = engine ? Number(engine.totalOpenInterest) / 1e9 : 0;
  const vault = engine ? Number(engine.vault) / 1e9 : 0;

  const bestBid = bids.length > 0 ? bids[0].price : 0;
  const bestAsk = asks.length > 0 ? asks[asks.length - 1].price : 0;
  const spread = bestBid > 0 && bestAsk > 0 ? bestAsk - bestBid : 0;
  const spreadPct = bestBid > 0 ? (spread / bestBid) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--frame-color)]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-heartbeat" />
          <span className="bb-label">DEPTH</span>
        </div>
        <div className="flex items-center gap-2">
          {spread > 0 && (
            <span className="text-[8px] terminal-mono font-bold text-[var(--amber)]">
              SPD {spreadPct.toFixed(2)}%
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 hover:bg-white/[0.04] transition-colors"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-[var(--text-muted)] transition-transform duration-200 ${
                collapsed ? "rotate-180" : ""
              }`}
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {collapsed ? (
        <div className="flex items-center justify-center py-2.5 px-3">
          <span className="text-sm font-bold terminal-mono tabular text-[var(--text-1)] glow-text">
            {oraclePriceUsd > 0 ? formatUsd(oraclePriceUsd, 2) : "-.--"}
          </span>
          <span className="text-[8px] terminal-mono text-[var(--text-muted)] ml-2">MARK</span>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="flex items-center h-5 px-3 text-[7px] font-bold terminal-mono uppercase tracking-[0.15em] text-[var(--text-muted)] border-b border-[var(--frame-color)]">
            <span className="flex-1">PRICE</span>
            <span className="flex-1 text-right">SIZE</span>
            <span className="flex-1 text-right">TOTAL</span>
          </div>

          {/* Asks */}
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col justify-end">
            {asks.map((level, i) => (
              <DepthRow key={`ask-${i}`} level={level} maxTotal={maxTotal} side="ask" />
            ))}
          </div>

          {/* Mark price */}
          <div className="flex items-center justify-center py-1.5 px-3 bg-white/[0.02] border-y border-[var(--frame-color)]">
            <span className="text-[14px] font-bold terminal-mono tabular text-[var(--text-1)] glow-text">
              {oraclePriceUsd > 0 ? formatUsd(oraclePriceUsd, 2) : "-.--"}
            </span>
          </div>

          {/* Bids */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {bids.map((level, i) => (
              <DepthRow key={`bid-${i}`} level={level} maxTotal={maxTotal} side="bid" />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-[var(--frame-color)] text-[8px] terminal-mono font-bold text-[var(--text-muted)]">
            <span>VAULT {vault.toFixed(2)}</span>
            <span>OI {totalOI.toFixed(2)}</span>
            <span>{bids.length + asks.length} LVL</span>
          </div>
        </>
      )}
    </div>
  );
}
