"use client";

import { useRef, useEffect, useState } from "react";
import type { PositionView } from "@percolator/protocol";
import { formatLeverage, formatPnl } from "@/lib/format";
import { invertedE6ToSolUsd } from "@/lib/pnl";
import { useTrade } from "@/hooks/useTrade";
import { useUiStore } from "@/stores/uiStore";
import { Spinner } from "@/components/common/Spinner";

export function PositionRow({ position }: { position: PositionView }) {
  const selectedLpIdx = useUiStore((s) => s.selectedLpIdx);
  const { trade, loading } = useTrade();
  const pnl = formatPnl(position.unrealizedPnl);

  const entryUsd = invertedE6ToSolUsd(position.entryPriceE6);
  const markUsd = invertedE6ToSolUsd(position.markPriceE6);
  const liqUsd = position.liquidationPriceE6
    ? invertedE6ToSolUsd(position.liquidationPriceE6)
    : null;

  const isLong = position.side === "long";

  // PnL flash tracking
  const prevPnlRef = useRef(pnl.text);
  const [pnlFlash, setPnlFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (pnl.text !== prevPnlRef.current) {
      const prev = parseFloat(prevPnlRef.current.replace(/[^0-9.-]/g, ""));
      const curr = parseFloat(pnl.text.replace(/[^0-9.-]/g, ""));
      if (!isNaN(prev) && !isNaN(curr) && prev !== curr) {
        setPnlFlash(curr > prev ? "up" : "down");
        const timer = setTimeout(() => setPnlFlash(null), 600);
        prevPnlRef.current = pnl.text;
        return () => clearTimeout(timer);
      }
      prevPnlRef.current = pnl.text;
    }
  }, [pnl.text]);

  const handleClose = () => {
    trade(selectedLpIdx, position.accountIdx, -position.size);
  };

  return (
    <tr className="transition-colors duration-150 border-b border-[var(--frame-color)] hover:bg-white/[0.02]">
      <td className="px-4 py-2.5">
        <span className="text-[11px] font-bold terminal-mono text-[var(--text-1)]">
          SOL-PERP
        </span>
      </td>
      <td className="px-4 py-2.5">
        <span
          className={`text-[9px] font-bold terminal-mono tracking-wider px-2 py-0.5 border ${
            isLong
              ? "text-[var(--green)] bg-[var(--green)]/5 border-[var(--green)]/20"
              : "text-[var(--red)] bg-[var(--red)]/5 border-[var(--red)]/20"
          }`}
        >
          {isLong ? "LONG" : "SHORT"}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <span className="text-[11px] terminal-mono tabular font-bold text-[var(--text-2)]">
          {(Number(position.sizeAbs) / 1e9).toFixed(4)}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <span className="text-[11px] terminal-mono tabular font-bold text-[var(--text-2)]">
          ${entryUsd.toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <span className="text-[11px] terminal-mono tabular font-bold text-[var(--text-2)]">
          ${markUsd.toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <span
          className={`text-[11px] terminal-mono tabular font-bold ${
            pnl.positive ? "text-[var(--green)]" : "text-[var(--red)]"
          } ${pnlFlash === "up" ? "flash-green" : pnlFlash === "down" ? "flash-red" : ""}`}
        >
          {pnl.text}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <span className="text-[11px] terminal-mono tabular font-bold text-[var(--text-2)]">
          {formatLeverage(position.leverage)}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <span className="text-[11px] terminal-mono tabular font-bold text-[var(--amber)]">
          {liqUsd ? `$${liqUsd.toFixed(2)}` : "-"}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <button
          onClick={handleClose}
          disabled={loading || position.side === "none"}
          className="px-2.5 py-1 text-[9px] font-bold terminal-mono tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[var(--red)]/5 text-[var(--red)] border border-[var(--red)]/15 hover:bg-[var(--red)]/10"
        >
          {loading ? <Spinner size={10} /> : "CLOSE"}
        </button>
      </td>
    </tr>
  );
}
