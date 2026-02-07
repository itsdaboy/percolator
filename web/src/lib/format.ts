/**
 * Display formatting utilities.
 */

/** Convert lamports to SOL (1 SOL = 1e9 lamports). */
export function lamportsToSol(lamports: bigint): number {
  return Number(lamports) / 1e9;
}

/** Convert e6 price to human-readable number. */
export function e6ToNumber(e6: bigint): number {
  return Number(e6) / 1e6;
}

/** Format e6 price as USD string. */
export function formatUsd(value: number, decimals = 2): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Format SOL amount. */
export function formatSol(lamports: bigint, decimals = 4): string {
  const sol = lamportsToSol(lamports);
  return `${sol.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} SOL`;
}

/** Format basis points as percentage. */
export function bpsToPercent(bps: bigint | number): string {
  const n = typeof bps === "bigint" ? Number(bps) : bps;
  return `${(n / 100).toFixed(2)}%`;
}

/** Format funding rate in bps/slot to bps/hr (1 slot ≈ 0.4s, ~9000 slots/hr). */
export function fundingBpsPerSlotToHourly(bpsPerSlot: bigint): string {
  const hourly = Number(bpsPerSlot) * 9000;
  const sign = hourly >= 0 ? "+" : "";
  return `${sign}${(hourly / 100).toFixed(4)}%/hr`;
}

/** Shorten a pubkey for display. */
export function shortenPubkey(pubkey: string, chars = 4): string {
  if (pubkey.length <= chars * 2 + 2) return pubkey;
  return `${pubkey.slice(0, chars)}...${pubkey.slice(-chars)}`;
}

/** Format PnL with color indicator. */
export function formatPnl(pnl: bigint): { text: string; positive: boolean } {
  const sol = lamportsToSol(pnl);
  const positive = pnl >= 0n;
  const sign = positive ? "+" : "";
  return {
    text: `${sign}${sol.toFixed(4)} SOL`,
    positive,
  };
}

/** Format leverage as "Nx". */
export function formatLeverage(leverage: number): string {
  if (!isFinite(leverage)) return "-";
  return `${leverage.toFixed(2)}x`;
}
