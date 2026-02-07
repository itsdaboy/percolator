"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, TransactionInstruction } from "@solana/web3.js";
import {
  encodeTradeCpi,
  ACCOUNTS_TRADE_CPI,
  buildAccountMetas,
  WELL_KNOWN,
  parseErrorFromLogs,
  parseAccount,
} from "@percolator/protocol";
import {
  PROGRAM_ID,
  SLAB_PUBKEY,
  ORACLE_PUBKEY,
  MATCHER_PROGRAM_ID,
  CRANK_STALE_SLOTS,
} from "@/lib/constants";
import { useMarketStore } from "@/stores/marketStore";
import { useUiStore } from "@/stores/uiStore";
import { useKeeperCrank } from "./useKeeperCrank";
import { USER_ERROR_MESSAGES } from "@/lib/pnl";

export function useTrade() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const engine = useMarketStore((s) => s.engine);
  const slabData = useMarketStore((s) => s.slabData);
  const currentSlot = useMarketStore((s) => s.currentSlot);
  const addToast = useUiStore((s) => s.addToast);
  const { buildCrankIx } = useKeeperCrank();
  const [loading, setLoading] = useState(false);

  const trade = useCallback(
    async (lpIdx: number, userIdx: number, size: bigint) => {
      if (!publicKey || !slabData) {
        addToast({ type: "error", message: "Connect wallet and wait for market data." });
        return;
      }

      setLoading(true);
      try {
        const tx = new Transaction();

        // Check crank freshness — if stale, prepend crank instruction
        if (engine && currentSlot > 0n) {
          const staleness = currentSlot - engine.lastCrankSlot;
          if (staleness > BigInt(CRANK_STALE_SLOTS)) {
            const crankIx = buildCrankIx();
            if (crankIx) tx.add(crankIx);
          }
        }

        // Read LP account from slab to get owner and matcher info
        const lpAccount = parseAccount(slabData, lpIdx);
        const lpOwnerPk = lpAccount.owner;
        const matcherContext = lpAccount.matcherContext;

        // Derive LP PDA
        const { deriveLpPda } = await import("@percolator/protocol");
        const [lpPda] = deriveLpPda(PROGRAM_ID, SLAB_PUBKEY, lpIdx);

        // Build trade CPI instruction
        const ixData = encodeTradeCpi({ lpIdx, userIdx, size });

        const keys = buildAccountMetas(ACCOUNTS_TRADE_CPI, [
          publicKey,
          lpOwnerPk,
          SLAB_PUBKEY,
          WELL_KNOWN.clock,
          ORACLE_PUBKEY,
          MATCHER_PROGRAM_ID,
          matcherContext,
          lpPda,
        ]);

        tx.add(
          new TransactionInstruction({
            programId: PROGRAM_ID,
            keys,
            data: ixData,
          })
        );

        const sig = await sendTransaction(tx, connection);
        await connection.confirmTransaction(sig, "confirmed");

        const direction = size > 0n ? "Long" : "Short";
        addToast({
          type: "success",
          message: `${direction} trade executed!`,
          txSignature: sig,
        });
      } catch (err: any) {
        const logs = err?.logs as string[] | undefined;
        const parsed = logs ? parseErrorFromLogs(logs) : null;
        const userMsg = parsed
          ? USER_ERROR_MESSAGES[parsed.code] ?? parsed.hint ?? parsed.name
          : err?.message ?? "Trade failed";
        addToast({ type: "error", message: userMsg });
      } finally {
        setLoading(false);
      }
    },
    [publicKey, connection, sendTransaction, slabData, engine, currentSlot, buildCrankIx, addToast]
  );

  return { trade, loading };
}
