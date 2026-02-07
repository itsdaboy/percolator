import type { Account } from "@percolator/protocol";
import { AccountKind } from "@percolator/protocol";

export interface DepthLevel {
  price: number;
  size: number;
  total: number;
}

/**
 * Generate synthetic bid/ask depth levels around the mark price.
 * Uses LP liquidity and user positions to approximate available depth.
 */
export function computeDepthLevels(
  accounts: { idx: number; account: Account }[],
  oraclePriceUsd: number,
  levels = 10,
  stepPct = 0.5
): { bids: DepthLevel[]; asks: DepthLevel[] } {
  if (oraclePriceUsd <= 0 || accounts.length === 0) {
    return { bids: [], asks: [] };
  }

  // Sum LP capital and user positions for depth estimation
  let totalLpCapital = 0;
  let totalLongSize = 0;
  let totalShortSize = 0;

  for (const { account } of accounts) {
    const capital = Number(account.capital) / 1e9;
    if (account.kind === AccountKind.LP) {
      totalLpCapital += capital;
    } else if (capital > 0) {
      const posSize = Number(account.positionSize) / 1e9;
      // positionSize > 0 = long, < 0 = short
      if (posSize > 0) {
        totalLongSize += posSize;
      } else {
        totalShortSize += Math.abs(posSize);
      }
    }
  }

  // Distribute LP capital across levels
  const capitalPerLevel = totalLpCapital > 0 ? totalLpCapital / levels : 0;

  const bids: DepthLevel[] = [];
  const asks: DepthLevel[] = [];

  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 1; i <= levels; i++) {
    const offset = (stepPct / 100) * i;

    // Bid levels (below mark)
    const bidPrice = oraclePriceUsd * (1 - offset);
    const bidSize = capitalPerLevel * (1 + (levels - i) * 0.1) + totalLongSize / levels;
    bidTotal += bidSize;
    bids.push({
      price: Math.round(bidPrice * 100) / 100,
      size: Math.round(bidSize * 1000) / 1000,
      total: Math.round(bidTotal * 1000) / 1000,
    });

    // Ask levels (above mark)
    const askPrice = oraclePriceUsd * (1 + offset);
    const askSize = capitalPerLevel * (1 + (levels - i) * 0.1) + totalShortSize / levels;
    askTotal += askSize;
    asks.push({
      price: Math.round(askPrice * 100) / 100,
      size: Math.round(askSize * 1000) / 1000,
      total: Math.round(askTotal * 1000) / 1000,
    });
  }

  // Asks reversed so highest price is at top
  asks.reverse();

  return { bids, asks };
}
