import { PublicKey } from "@solana/web3.js";
import type {
  SlabHeader,
  MarketConfig,
  EngineState,
  RiskParams,
  Account,
  InsuranceFund,
} from "./solana/slab";

/**
 * Full parsed market state from a slab account.
 */
export interface MarketState {
  header: SlabHeader;
  config: MarketConfig;
  engine: EngineState;
  params: RiskParams;
  accounts: { idx: number; account: Account }[];
}

/**
 * Devnet market configuration (from devnet-market.json).
 */
export interface MarketAddresses {
  programId: PublicKey;
  matcherProgramId: PublicKey;
  slab: PublicKey;
  mint: PublicKey;
  vault: PublicKey;
  vaultPda: PublicKey;
  oracle: PublicKey;
  oracleType: "chainlink" | "pyth";
  inverted: boolean;
  lp: {
    index: number;
    pda: PublicKey;
    matcherContext: PublicKey;
  };
  vammLp?: {
    index: number;
    pda: PublicKey;
    matcherContext: PublicKey;
  };
}

/**
 * User-friendly position view.
 */
export interface PositionView {
  accountIdx: number;
  side: "long" | "short" | "none";
  size: bigint;
  sizeAbs: bigint;
  entryPriceE6: bigint;
  markPriceE6: bigint;
  unrealizedPnl: bigint;
  capital: bigint;
  effectiveCapital: bigint;
  marginRatio: number;
  leverage: number;
  liquidationPriceE6: bigint | null;
}

/**
 * Oracle price data.
 */
export interface OracleData {
  priceUsd: number;
  priceE6Inverted: bigint;
  decimals: number;
  timestamp: number;
  stale: boolean;
}

export type {
  SlabHeader,
  MarketConfig,
  EngineState,
  RiskParams,
  Account,
  InsuranceFund,
};
export { AccountKind } from "./solana/slab";
