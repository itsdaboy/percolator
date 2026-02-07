/**
 * Parse Chainlink oracle account data on Solana devnet.
 * Chainlink stores price data in a specific layout.
 * - decimals at byte offset 138 (u8)
 * - answer (latest round) at byte offset 216 (i128, 16 bytes LE)
 * - updatedAt at byte offset 232 (u32)
 */

export interface ChainlinkPrice {
  /** Human-readable price (e.g., 143.50 for SOL/USD). */
  price: number;
  /** Raw answer from oracle. */
  rawAnswer: bigint;
  /** Decimal places of the oracle. */
  decimals: number;
  /** Last update timestamp (unix seconds). */
  updatedAt: number;
}

export function parseChainlinkAccount(data: Buffer): ChainlinkPrice {
  if (data.length < 248) {
    throw new Error(`Chainlink account too short: ${data.length} bytes`);
  }

  const decimals = data.readUInt8(138);

  // Read i128 LE at offset 216
  const lo = data.readBigUInt64LE(216);
  const hi = data.readBigUInt64LE(224);
  let rawAnswer = (hi << 64n) | lo;
  const SIGN_BIT = 1n << 127n;
  if (rawAnswer >= SIGN_BIT) {
    rawAnswer = rawAnswer - (1n << 128n);
  }

  const updatedAt = data.readUInt32LE(232);

  const price = Number(rawAnswer) / Math.pow(10, decimals);

  return { price, rawAnswer, decimals, updatedAt };
}
