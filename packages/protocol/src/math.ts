/**
 * Math utilities for PnL, margin, leverage, and liquidation price calculations.
 * All prices are in e6 (inverted) format matching on-chain representation.
 * Capital, PnL, and sizes are in native lamport units.
 */

const E6 = 1_000_000n;

/**
 * Compute unrealized PnL for a position.
 * PnL = positionSize * (markPrice - entryPrice) / 1e6
 * For inverted markets (on-chain price = 1/SOL): a long position profits when
 * the inverted price decreases (i.e., SOL/USD goes up).
 */
export function computeUnrealizedPnl(
  positionSize: bigint,
  entryPriceE6: bigint,
  markPriceE6: bigint
): bigint {
  if (positionSize === 0n) return 0n;
  // PnL = size * (mark - entry) / 1e6
  return (positionSize * (markPriceE6 - entryPriceE6)) / E6;
}

/**
 * Compute effective capital (capital + unrealized PnL, floored at 0).
 * This is what the protocol uses for margin checks.
 */
export function computeEffectiveCapital(
  capital: bigint,
  unrealizedPnl: bigint
): bigint {
  const eff = capital + unrealizedPnl;
  return eff > 0n ? eff : 0n;
}

/**
 * Compute margin ratio = effectiveCapital / notional.
 * Returns a number (0-1+). Higher = healthier.
 */
export function computeMarginRatio(
  effectiveCapital: bigint,
  notional: bigint
): number {
  if (notional === 0n) return Infinity;
  return Number(effectiveCapital * 10000n / notional) / 10000;
}

/**
 * Compute notional value of a position.
 * notional = abs(positionSize) * markPrice / 1e6
 */
export function computeNotional(
  positionSize: bigint,
  markPriceE6: bigint
): bigint {
  const absSize = positionSize < 0n ? -positionSize : positionSize;
  return (absSize * markPriceE6) / E6;
}

/**
 * Compute leverage = notional / effectiveCapital.
 */
export function computeLeverage(
  positionSize: bigint,
  markPriceE6: bigint,
  effectiveCapital: bigint
): number {
  if (effectiveCapital <= 0n) return Infinity;
  const notional = computeNotional(positionSize, markPriceE6);
  if (notional === 0n) return 0;
  return Number(notional * 100n / effectiveCapital) / 100;
}

/**
 * Compute approximate liquidation price.
 * Liquidation occurs when margin ratio drops to maintenance margin.
 *
 * For a long position (size > 0) in an inverted market:
 *   effectiveCapital = capital + size * (liqPrice - entry) / 1e6
 *   notional = size * liqPrice / 1e6
 *   margin = effectiveCapital / notional = maintenanceMarginBps / 10000
 *
 * Solving for liqPrice:
 *   liqPrice = (capital * 1e6 - size * entry) / (size * (1 - mm))
 *   where mm = maintenanceMarginBps / 10000
 *
 * Returns null if no liquidation price exists (e.g., fully collateralized).
 */
export function computeLiquidationPrice(
  positionSize: bigint,
  entryPriceE6: bigint,
  capital: bigint,
  maintenanceMarginBps: bigint
): bigint | null {
  if (positionSize === 0n) return null;

  // mm = maintenanceMarginBps / 10000
  // We work in scaled integers to avoid floating point
  const mmScaled = maintenanceMarginBps; // in bps (e.g., 500 = 5%)
  const bpsBase = 10000n;

  // For long (size > 0):
  //   liqPrice = (capital * 1e6 + size * entry) / (size + size * mm / 10000)
  //   Simplified: liqPrice = (capital * 1e6 + size * entry) / (size * (10000 + mm) / 10000)
  //   = (capital * 1e6 + size * entry) * 10000 / (size * (10000 + mm))
  //
  // For short (size < 0), flip the sign logic:
  //   liqPrice = (capital * 1e6 + size * entry) * 10000 / (size * (10000 - mm))

  if (positionSize > 0n) {
    // Long position in inverted market
    const numerator = (capital * E6 + positionSize * entryPriceE6) * bpsBase;
    const denominator = positionSize * (bpsBase + mmScaled);
    if (denominator === 0n) return null;
    const liqPrice = numerator / denominator;
    return liqPrice > 0n ? liqPrice : null;
  } else {
    // Short position in inverted market
    const absSize = -positionSize;
    const numerator = (capital * E6 - absSize * entryPriceE6) * bpsBase;
    const denominator = -positionSize * (bpsBase - mmScaled);
    if (denominator === 0n) return null;
    const liqPrice = numerator / denominator;
    return liqPrice > 0n ? liqPrice : null;
  }
}
