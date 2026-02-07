"use client";

import { Spinner } from "@/components/common/Spinner";

export function TradeButton({
  direction,
  onClick,
  loading,
  disabled,
}: {
  direction: "long" | "short";
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}) {
  const isLong = direction === "long";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full h-11 font-bold text-[11px] terminal-mono tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed overflow-hidden ${
        isLong
          ? disabled
            ? "bg-[var(--green)]/5 text-[var(--green)]/30 border border-[var(--green)]/10"
            : "bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/20 hover:bg-[var(--green)]/15 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          : disabled
          ? "bg-[var(--red)]/5 text-[var(--red)]/30 border border-[var(--red)]/10"
          : "bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 hover:bg-[var(--red)]/15 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
      }`}
    >
      {/* Shimmer overlay when loading */}
      {loading && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${isLong ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)"}, transparent)`,
            animation: "shimmer-line 1.5s ease-in-out infinite",
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <Spinner size={12} />
            EXECUTING...
          </>
        ) : isLong ? (
          "BUY / LONG"
        ) : (
          "SELL / SHORT"
        )}
      </span>
    </button>
  );
}
