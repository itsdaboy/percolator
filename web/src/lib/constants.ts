import { PublicKey } from "@solana/web3.js";

// Devnet market addresses from devnet-market.json
export const PROGRAM_ID = new PublicKey("2SSnp35m7FQ7cRLNKGdW5UzjYFF6RBUNq7d3m5mqNByp");
export const MATCHER_PROGRAM_ID = new PublicKey("4HcGCsyjAqnFua5ccuXyt8KRRQzKFbGTJkVChpS7Yfzy");
export const SLAB_PUBKEY = new PublicKey("A7wQtRT9DhFqYho8wTVqQCDc7kYPTUXGPATiyVbZKVFs");
export const MINT = new PublicKey("So11111111111111111111111111111111111111112");
export const VAULT = new PublicKey("63juJmvm1XHCHveWv9WdanxqJX6tD6DLFTZD7dvH12dc");
export const VAULT_PDA = new PublicKey("4C6cZFwwDnEyL81YZPY9xBUnnBuM9gWHcvjpHa71y3V6");
export const ORACLE_PUBKEY = new PublicKey("99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR");

export const LP = {
  index: 0,
  pda: new PublicKey("7YgxweQCVnBDfnP7hBdrBLV5NXpSLPS9mx6fgaGnH3jd"),
  matcherContext: new PublicKey("5n3jT6iy9TK3XNMQarC1sK26zS8ofjLG3dvE9iDEFYhK"),
} as const;

export const VAMM_LP = {
  index: 4,
  pda: new PublicKey("CwfVwVayiuVxXmagcP8Rha7eow29NUtHzFNdzikCzA8h"),
  matcherContext: new PublicKey("BUWfYszAAUuGkGiaMT9ahnkHeHFQ5MbC7STQdhS28cZF"),
} as const;

export const ORACLE_TYPE = "chainlink" as const;
export const INVERTED = true;

// RPC endpoint — configurable via env var, falls back to public devnet
export const DEVNET_RPC =
  process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

// Staleness threshold: if lastCrankSlot is > CRANK_STALE_SLOTS behind current slot, prepend crank
export const CRANK_STALE_SLOTS = 150;
