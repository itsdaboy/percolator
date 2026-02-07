"use client";

import Link from "next/link";
import { useMarketStore } from "@/stores/marketStore";
import { formatUsd } from "@/lib/format";
import { WalletButton } from "@/components/wallet/WalletButton";
import { TerminalClock } from "@/components/common/TerminalClock";
import { usePriceFlash } from "@/hooks/usePriceFlash";

function BloombergField({
  label,
  value,
  color,
  suffix,
}: {
  label: string;
  value: string;
  color?: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="bb-label">{label}</span>
      <span className={`text-[12px] terminal-mono font-bold ${color ?? "text-[var(--text-1)]"}`}>
        {value}
      </span>
      {suffix && (
        <span className="text-[8px] terminal-mono text-[var(--text-muted)]">{suffix}</span>
      )}
    </div>
  );
}

export function TopBar() {
  const priceUsd = useMarketStore((s) => s.oraclePriceUsd);
  const engine = useMarketStore((s) => s.engine);
  const oracleTimestamp = useMarketStore((s) => s.oracleTimestamp);
  const loading = useMarketStore((s) => s.loading);
  const error = useMarketStore((s) => s.error);
  const flash = usePriceFlash(priceUsd);

  const staleness =
    oracleTimestamp > 0 ? Math.floor(Date.now() / 1000) - oracleTimestamp : Infinity;
  const dotClass =
    staleness < 10
      ? "bg-[var(--green)]"
      : staleness < 30
        ? "bg-[var(--yellow)]"
        : "bg-[var(--red)]";

  const bpsPerSlot = engine ? Number(engine.fundingRateBpsPerSlotLast) : 0;
  const hourlyPct = (bpsPerSlot * 9000) / 10000;
  const fundingPositive = hourlyPct >= 0;
  const totalOI = engine ? Number(engine.totalOpenInterest) / 1e9 : 0;
  const vault = engine ? Number(engine.vault) / 1e9 : 0;
  const isConnected = priceUsd > 0 || engine !== null;

  return (
    <header className="shrink-0">
      {/* Row 1: Primary Data Bar */}
      <div className="flex items-center h-9 bg-[var(--panel)] border-b border-[var(--frame-color)]">
        {/* Back + Market */}
        <div className="flex items-center gap-2.5 px-3 h-full shrink-0 border-r border-[var(--frame-color)]">
          <Link
            href="/"
            className="p-1 rounded hover:bg-white/[0.04] transition-colors group"
            title="Back to home"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--text-3)] group-hover:text-[var(--text-1)] transition-colors"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-[3px] h-[14px] bg-[var(--blue)] animate-terminal-blink" />
            <span className="font-bold text-[13px] terminal-mono text-[var(--text-1)] tracking-tight">
              SOL-PERP
            </span>
            <span className="text-[7px] font-bold tracking-[0.2em] uppercase bg-[var(--blue)]/10 text-[var(--blue)] border border-[var(--blue)]/20 px-1.5 py-0 terminal-mono">
              PERPETUAL
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${priceUsd > 0 ? dotClass : "bg-[var(--red)]"} ${priceUsd > 0 ? "animate-heartbeat" : "animate-pulse"} shadow-[0_0_4px_currentColor]`}
            />
            <span
              className={`text-[14px] font-bold terminal-mono text-[var(--text-1)] ${flash === "up" ? "flash-green" : flash === "down" ? "flash-red" : ""}`}
            >
              {priceUsd > 0 ? formatUsd(priceUsd, 2) : "----.--"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 px-4 flex-1 overflow-hidden">
          {isConnected ? (
            <>
              <BloombergField label="MARK" value={priceUsd > 0 ? formatUsd(priceUsd, 2) : "-"} />
              <div className="bb-separator" />
              <BloombergField
                label="FUNDING/HR"
                value={`${fundingPositive ? "+" : ""}${hourlyPct.toFixed(4)}%`}
                color={fundingPositive ? "text-[var(--green)]" : "text-[var(--red)]"}
              />
              <div className="bb-separator" />
              <BloombergField label="OI" value={totalOI.toFixed(2)} suffix="SOL" />
              <div className="bb-separator" />
              <BloombergField label="VAULT" value={vault > 0 ? vault.toFixed(2) : "-"} suffix="SOL" />
            </>
          ) : (
            <div className="flex items-center gap-2">
              {loading && (
                <svg width="12" height="12" viewBox="0 0 24 24" className="animate-spin" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              )}
              <span
                className={`text-[11px] terminal-mono font-medium ${error ? "text-[var(--red)]" : "text-[var(--text-3)]"}`}
              >
                {error || "CONNECTING TO SOLANA DEVNET..."}
              </span>
            </div>
          )}
        </div>

        {/* Right: Token + Network + Wallet */}
        <div className="flex items-center gap-2 px-3 h-full shrink-0">
          <span className="flex items-center gap-1 text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 bg-[var(--yellow)]/10 text-[var(--yellow)] border border-[var(--yellow)]/20 terminal-mono">
            <span className="w-1.5 h-1.5 bg-[var(--yellow)] animate-terminal-blink" />
            DEVNET
          </span>

          <WalletButton />
        </div>
      </div>

      {/* Row 2: Status Ticker Strip */}
      <div className="h-5 shrink-0 border-b border-[var(--frame-color)] bg-[var(--base)] overflow-hidden flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-heartbeat" />
            <span className="text-[8px] terminal-mono text-[var(--text-muted)]">
              RPC CONNECTED
            </span>
          </div>
          <div className="bb-separator" />
          <span className="text-[8px] terminal-mono text-[var(--text-muted)]">
            ORACLE: {staleness < Infinity ? `${staleness}s AGO` : "N/A"}
          </span>
          <div className="bb-separator" />
          <TerminalClock />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[7px] terminal-mono text-[var(--text-muted)]">
            PROGRAM: 2SSn...qNBy
          </span>
          <div className="bb-separator" />
          <span className="text-[7px] terminal-mono text-[var(--text-muted)]">
            SLAB: A7wQ...H3jd
          </span>
        </div>
      </div>
    </header>
  );
}
