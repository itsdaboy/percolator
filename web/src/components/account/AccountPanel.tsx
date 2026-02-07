"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useUserPosition } from "@/hooks/useUserPosition";
import { useInitUser } from "@/hooks/useInitUser";
import { useUiStore } from "@/stores/uiStore";
import { useMarketStore } from "@/stores/marketStore";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { Spinner } from "@/components/common/Spinner";
import { formatPnl } from "@/lib/format";

export function AccountPanel() {
  const { connected } = useWallet();
  const { userIdx, position, account, loading } = useUserPosition();
  const { initUser, loading: initLoading } = useInitUser();
  const params = useMarketStore((s) => s.params);
  const setDepositOpen = useUiStore((s) => s.setDepositModalOpen);
  const setWithdrawOpen = useUiStore((s) => s.setWithdrawModalOpen);

  if (!connected)
    return (
      <div className="p-4 text-center">
        <p className="text-[9px] terminal-mono font-bold text-[var(--text-muted)]">
          CONNECT WALLET TO VIEW ACCOUNT
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="p-4 flex justify-center">
        <Spinner size={14} />
      </div>
    );

  if (userIdx === null) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-[8px] terminal-mono font-bold text-[var(--text-muted)]">
          NO ACCOUNT FOUND
        </p>
        <button
          onClick={initUser}
          disabled={initLoading}
          className="w-full h-8 bg-[var(--blue)]/10 text-[var(--blue)] border border-[var(--blue)]/20 hover:bg-[var(--blue)]/15 text-[10px] font-bold terminal-mono tracking-wider disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
        >
          {initLoading ? <Spinner size={12} /> : "INITIALIZE ACCOUNT"}
        </button>
      </div>
    );
  }

  const capital = account ? Number(account.capital) / 1e9 : 0;
  const pnl = position ? formatPnl(position.unrealizedPnl) : null;
  const effCapital = position
    ? Number(position.effectiveCapital) / 1e9
    : capital;
  const maintenancePct = params
    ? Number(params.maintenanceMarginBps) / 10000
    : 0.05;
  const initialPct = params
    ? Number(params.initialMarginBps) / 10000
    : 0.1;
  const marginRatio = position?.marginRatio ?? Infinity;
  const maxRatio = initialPct * 3;
  const healthPct = isFinite(marginRatio)
    ? Math.min(100, Math.max(0, (marginRatio / maxRatio) * 100))
    : 100;
  const healthColor =
    marginRatio <= maintenancePct
      ? "bg-[var(--red)]"
      : marginRatio <= initialPct
      ? "bg-[var(--yellow)]"
      : "bg-[var(--green)]";

  // Tick mark positions for health bar
  const liqTickPct = 0;
  const maintTickPct = Math.min(100, (maintenancePct / maxRatio) * 100);
  const initTickPct = Math.min(100, (initialPct / maxRatio) * 100);

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="bb-label">ACCOUNT</span>
        <span className="text-[8px] terminal-mono text-[var(--text-muted)]">
          IDX {userIdx}
        </span>
      </div>

      <div className="space-y-1.5">
        <InfoRow label="COLLATERAL" value={`${capital.toFixed(4)} SOL`} />
        {position && position.side !== "none" && pnl && (
          <>
            <InfoRow
              label="UNREALIZED PNL"
              value={pnl.text}
              valueClass={
                pnl.positive
                  ? "text-[var(--green)]"
                  : "text-[var(--red)]"
              }
            />
            <InfoRow
              label="EFF. CAPITAL"
              value={`${effCapital.toFixed(4)} SOL`}
            />
          </>
        )}
      </div>

      {/* Margin health bar with tick marks */}
      {position && position.side !== "none" && (
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="bb-label">MARGIN HEALTH</span>
            <span className="text-[9px] terminal-mono tabular font-bold text-[var(--text-2)]">
              {isFinite(marginRatio)
                ? `${(marginRatio * 100).toFixed(1)}%`
                : "-"}
            </span>
          </div>
          <div className="relative">
            <div className="h-1 bg-[var(--frame-color)] overflow-hidden">
              <div
                className={`h-full ${healthColor} transition-all duration-500`}
                style={{ width: `${healthPct}%` }}
              />
            </div>
            {/* Tick marks */}
            <div className="relative h-3 mt-0.5">
              {[
                { pct: liqTickPct, label: "LIQ" },
                { pct: maintTickPct, label: "MAINT" },
                { pct: initTickPct, label: "INIT" },
              ].map(({ pct, label }) => (
                <div
                  key={label}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
                >
                  <div className="w-px h-1 bg-[var(--text-muted)]" />
                  <span className="text-[6px] terminal-mono text-[var(--text-muted)] mt-px">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1.5 pt-1">
        <button
          onClick={() => setDepositOpen(true)}
          className="flex-1 h-7 text-[9px] font-bold terminal-mono tracking-wider bg-[var(--green)]/5 text-[var(--green)] border border-[var(--green)]/15 hover:bg-[var(--green)]/10 transition-all"
        >
          DEPOSIT
        </button>
        <button
          onClick={() => setWithdrawOpen(true)}
          className="flex-1 h-7 text-[9px] font-bold terminal-mono tracking-wider bg-[var(--base)] text-[var(--text-3)] border border-[var(--frame-color)] hover:bg-white/[0.03] transition-all"
        >
          WITHDRAW
        </button>
      </div>
      <DepositModal userIdx={userIdx} />
      <WithdrawModal userIdx={userIdx} />
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[8px] terminal-mono font-bold tracking-[0.15em] text-[var(--text-muted)]">
        {label}
      </span>
      <span
        className={`text-[10px] terminal-mono tabular font-bold ${
          valueClass ?? "text-[var(--text-2)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
