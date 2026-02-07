"use client";

import { create } from "zustand";
import type {
  SlabHeader,
  MarketConfig,
  EngineState,
  RiskParams,
  Account,
} from "@percolator/protocol";
import {
  parseHeader,
  parseConfig,
  parseEngine,
  parseParams,
  parseAllAccounts,
} from "@percolator/protocol";

export interface MarketStore {
  // Raw slab data
  slabData: Buffer | null;

  // Parsed state
  header: SlabHeader | null;
  config: MarketConfig | null;
  engine: EngineState | null;
  params: RiskParams | null;
  accounts: { idx: number; account: Account }[];

  // Oracle
  oraclePriceUsd: number;
  oraclePriceE6Inverted: bigint;
  oracleDecimals: number;
  oracleTimestamp: number;
  oracleStale: boolean;

  // Current slot from the connection
  currentSlot: bigint;

  // Loading state
  loading: boolean;
  error: string | null;

  // Actions
  updateFromSlab: (data: Buffer) => void;
  setOraclePrice: (priceUsd: number, decimals: number, timestamp: number) => void;
  setCurrentSlot: (slot: bigint) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMarketStore = create<MarketStore>((set) => ({
  slabData: null,
  header: null,
  config: null,
  engine: null,
  params: null,
  accounts: [],
  oraclePriceUsd: 0,
  oraclePriceE6Inverted: 0n,
  oracleDecimals: 0,
  oracleTimestamp: 0,
  oracleStale: true,
  currentSlot: 0n,
  loading: true,
  error: null,

  updateFromSlab: (data: Buffer) => {
    try {
      const header = parseHeader(data);
      const config = parseConfig(data);
      const engine = parseEngine(data);
      const params = parseParams(data);
      const accounts = parseAllAccounts(data);
      set({
        slabData: data,
        header,
        config,
        engine,
        params,
        accounts,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  setOraclePrice: (priceUsd, decimals, timestamp) => {
    const e6Inverted = priceUsd > 0 ? BigInt(Math.round(1_000_000 / priceUsd)) : 0n;
    const now = Math.floor(Date.now() / 1000);
    set({
      oraclePriceUsd: priceUsd,
      oraclePriceE6Inverted: e6Inverted,
      oracleDecimals: decimals,
      oracleTimestamp: timestamp,
      oracleStale: now - timestamp > 60,
    });
  },

  setCurrentSlot: (slot) => set({ currentSlot: slot }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
