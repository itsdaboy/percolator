"use client";

import { useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUiStore } from "@/stores/uiStore";
import { useMarketStore } from "@/stores/marketStore";
import { useUserPosition } from "@/hooks/useUserPosition";
import { useTrade } from "@/hooks/useTrade";
import { TradeButton } from "./TradeButton";
import { computeNotional } from "@percolator/protocol";
import { bpsToPercent } from "@/lib/format";
import { invertedE6ToSolUsd } from "@/lib/pnl";

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[8px] terminal-mono font-bold tracking-[0.15em] text-[var(--text-muted)]">{label}</span>
      <span className={`text-[10px] terminal-mono font-bold ${highlight ? "text-[var(--amber)]" : "text-[var(--text-2)]"}`}>{value}</span>
    </div>
  );
}

export function OrderEntry() {
  const { connected } = useWallet();
  const tradeDirection = useUiStore((s) => s.tradeDirection);
  const setTradeDirection = useUiStore((s) => s.setTradeDirection);
  const selectedLpIdx = useUiStore((s) => s.selectedLpIdx);
  const params = useMarketStore((s) => s.params);
  const oraclePriceE6 = useMarketStore((s) => s.oraclePriceE6Inverted);
  const { userIdx } = useUserPosition();
  const { trade, loading } = useTrade();

  const [sizeInput, setSizeInput] = useState("");
  const [leverage, setLeverage] = useState(10);

  const sizeLamports = useMemo(() => {
    const num = parseFloat(sizeInput);
    if (isNaN(num) || num <= 0) return 0n;
    return BigInt(Math.round(num * 1e9));
  }, [sizeInput]);

  const signedSize = tradeDirection === "long" ? sizeLamports : -sizeLamports;
  const notional =
    sizeLamports > 0n && oraclePriceE6 > 0n
      ? computeNotional(sizeLamports, oraclePriceE6)
      : 0n;
  const initialMarginBps = params?.initialMarginBps ?? 1000n;
  const marginRequired =
    notional > 0n ? (notional * initialMarginBps) / 10000n : 0n;
  const canTrade = connected && userIdx !== null && sizeLamports > 0n;
  const isLong = tradeDirection === "long";

  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Market / Limit tabs */}
      <div className="flex gap-0 border-b border-[var(--frame-color)]">
        <button className="px-3 py-1.5 text-[9px] font-bold terminal-mono tracking-[0.1em] border-b-2 border-[var(--blue)] text-[var(--blue)] bg-[var(--blue)]/5">
          MARKET
        </button>
        <button className="px-3 py-1.5 text-[9px] font-bold terminal-mono tracking-[0.1em] text-[var(--text-muted)] border-b-2 border-transparent" disabled>
          LIMIT
        </button>
      </div>

      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 gap-px bg-[var(--frame-color)]">
        <button
          onClick={() => setTradeDirection("long")}
          className={`h-8 text-[10px] font-bold terminal-mono tracking-wider transition-all ${
            isLong
              ? "bg-[var(--green)]/15 text-[var(--green)] border-b-2 border-[var(--green)]"
              : "bg-[var(--panel)] text-[var(--text-muted)] hover:text-[var(--text-3)]"
          }`}
        >
          BUY / LONG
        </button>
        <button
          onClick={() => setTradeDirection("short")}
          className={`h-8 text-[10px] font-bold terminal-mono tracking-wider transition-all ${
            !isLong
              ? "bg-[var(--red)]/15 text-[var(--red)] border-b-2 border-[var(--red)]"
              : "bg-[var(--panel)] text-[var(--text-muted)] hover:text-[var(--text-3)]"
          }`}
        >
          SELL / SHORT
        </button>
      </div>

      {/* Size */}
      <div>
        <label className="bb-label mb-1.5 block">SIZE</label>
        <div className="flex items-center h-9 px-3 bg-[var(--base)] border border-[var(--frame-color)] focus-within:border-[var(--blue)]/50 transition-colors">
          <span className="text-[8px] terminal-mono text-[var(--text-muted)] mr-2">QTY</span>
          <input
            type="number"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="0.000"
            step="0.01"
            min="0"
            className="flex-1 bg-transparent text-[13px] terminal-mono font-bold text-[var(--text-1)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <span className="text-[9px] terminal-mono font-bold text-[var(--blue)]">SOL</span>
        </div>
      </div>

      {/* Quick size */}
      <div className="flex gap-px">
        {[0.1, 0.5, 1, 5, 10].map((amt) => (
          <button
            key={amt}
            onClick={() => setSizeInput(String(amt))}
            className="flex-1 h-6 text-[9px] terminal-mono font-bold bg-[var(--base)] border border-[var(--frame-color)] text-[var(--text-3)] hover:bg-[var(--blue)]/5 hover:text-[var(--text-2)] hover:border-[var(--blue)]/30 transition-all"
          >
            {amt}
          </button>
        ))}
      </div>

      {/* Leverage */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="bb-label">LEVERAGE</label>
          <div className="flex items-center gap-1">
            <span className="text-[14px] terminal-mono font-bold text-[var(--amber)]">{leverage}</span>
            <span className="text-[9px] terminal-mono text-[var(--text-muted)]">x</span>
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full mb-1.5"
        />
        <div className="flex justify-between px-[7px] mb-2">
          {[1, 10, 20, 30, 40, 50].map((v) => (
            <span key={v} className="text-[6px] terminal-mono text-[var(--text-muted)]">{v}</span>
          ))}
        </div>
        <div className="flex gap-px">
          {[1, 5, 10, 25, 50].map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`flex-1 h-6 text-[9px] terminal-mono font-bold transition-all ${
                leverage === lev
                  ? "bg-[var(--amber)]/15 text-[var(--amber)] border border-[var(--amber)]/30"
                  : "bg-[var(--base)] border border-[var(--frame-color)] text-[var(--text-3)] hover:text-[var(--text-2)]"
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1.5 py-2 px-3 bg-[var(--base)] border border-[var(--frame-color)]">
        <SummaryRow label="ENTRY" value={oraclePriceE6 > 0n ? `$${invertedE6ToSolUsd(oraclePriceE6).toFixed(2)}` : "-"} />
        <SummaryRow label="MARGIN" value={marginRequired > 0n ? `${(Number(marginRequired) / 1e9).toFixed(4)} SOL` : "-"} />
        <SummaryRow label="FEE" value={params ? bpsToPercent(params.tradingFeeBps) : "-"} />
        <div className="h-px bg-[var(--frame-color)] my-1" />
        <SummaryRow label="NOTIONAL" value={notional > 0n ? `${(Number(notional) / 1e9).toFixed(4)} SOL` : "-"} highlight />
      </div>

      {/* Trade button */}
      <TradeButton
        direction={tradeDirection}
        loading={loading}
        disabled={!canTrade}
        onClick={() => {
          if (userIdx !== null && signedSize !== 0n) {
            trade(selectedLpIdx, userIdx, signedSize);
          }
        }}
      />

      {!connected && (
        <p className="text-[9px] text-center terminal-mono text-[var(--text-muted)]">
          CONNECT WALLET TO TRADE
        </p>
      )}
      {connected && userIdx === null && (
        <p className="text-[9px] text-center terminal-mono text-[var(--yellow)]">
          INITIALIZE ACCOUNT TO START TRADING
        </p>
      )}
    </div>
  );
}
