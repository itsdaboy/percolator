/**
 * Client-side PnL helpers that bridge oracle price to the on-chain inverted representation.
 */

const E6 = 1_000_000n;

/**
 * Convert SOL/USD price to inverted e6 format (1/SOL * 1e6).
 * Example: SOL = $143.50 → inverted = 1/143.50 * 1e6 ≈ 6969
 */
export function solUsdToInvertedE6(solUsd: number): bigint {
  if (solUsd <= 0) return 0n;
  return BigInt(Math.round(1_000_000 / solUsd));
}

/**
 * Convert inverted e6 price back to SOL/USD.
 * Example: 6969 → 1e6/6969 ≈ $143.50
 */
export function invertedE6ToSolUsd(invertedE6: bigint): number {
  if (invertedE6 <= 0n) return 0;
  return 1_000_000 / Number(invertedE6);
}

/**
 * Map program error codes to user-friendly messages.
 */
export const USER_ERROR_MESSAGES: Record<number, string> = {
  6: "Oracle price is outdated. Try again shortly.",
  13: "Not enough collateral. Deposit more SOL.",
  14: "This trade exceeds your margin limit.",
  22: "Risk-reduction mode: only closing trades allowed.",
  17: "PnL not warmed up yet. Please wait.",
  19: "Account not found. Initialize your account first.",
};
