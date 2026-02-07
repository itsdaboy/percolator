"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, TransactionInstruction } from "@solana/web3.js";
import {
  encodeCloseAccount,
  ACCOUNTS_CLOSE_ACCOUNT,
  buildAccountMetas,
  WELL_KNOWN,
  parseErrorFromLogs,
} from "@percolator/protocol";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  PROGRAM_ID,
  SLAB_PUBKEY,
  MINT,
  VAULT,
  VAULT_PDA,
  ORACLE_PUBKEY,
} from "@/lib/constants";
import { useUiStore } from "@/stores/uiStore";

export function useCloseAccount() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const addToast = useUiStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);

  const closeAccount = useCallback(
    async (userIdx: number) => {
      if (!publicKey) {
        addToast({ type: "error", message: "Connect your wallet first." });
        return;
      }

      setLoading(true);
      try {
        const userAta = await getAssociatedTokenAddress(MINT, publicKey);

        const ixData = encodeCloseAccount({ userIdx });

        const keys = buildAccountMetas(ACCOUNTS_CLOSE_ACCOUNT, [
          publicKey,
          SLAB_PUBKEY,
          VAULT,
          userAta,
          VAULT_PDA,
          WELL_KNOWN.tokenProgram,
          WELL_KNOWN.clock,
          ORACLE_PUBKEY,
        ]);

        const tx = new Transaction().add(
          new TransactionInstruction({
            programId: PROGRAM_ID,
            keys,
            data: ixData,
          })
        );

        const sig = await sendTransaction(tx, connection);
        await connection.confirmTransaction(sig, "confirmed");

        addToast({
          type: "success",
          message: "Account closed successfully.",
          txSignature: sig,
        });
      } catch (err: any) {
        const logs = err?.logs as string[] | undefined;
        const parsed = logs ? parseErrorFromLogs(logs) : null;
        addToast({
          type: "error",
          message: parsed?.hint ?? err?.message ?? "Close account failed",
        });
      } finally {
        setLoading(false);
      }
    },
    [publicKey, connection, sendTransaction, addToast]
  );

  return { closeAccount, loading };
}
