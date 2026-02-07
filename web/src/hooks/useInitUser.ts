"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, TransactionInstruction } from "@solana/web3.js";
import {
  encodeInitUser,
  ACCOUNTS_INIT_USER,
  buildAccountMetas,
  WELL_KNOWN,
  parseErrorFromLogs,
} from "@percolator/protocol";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PROGRAM_ID, SLAB_PUBKEY, MINT, VAULT } from "@/lib/constants";
import { useMarketStore } from "@/stores/marketStore";
import { useUiStore } from "@/stores/uiStore";

export function useInitUser() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const params = useMarketStore((s) => s.params);
  const addToast = useUiStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);

  const initUser = useCallback(async () => {
    if (!publicKey) {
      addToast({ type: "error", message: "Connect your wallet first." });
      return;
    }

    setLoading(true);
    try {
      const feePayment = params?.newAccountFee ?? 0n;
      const ixData = encodeInitUser({ feePayment });

      const userAta = await getAssociatedTokenAddress(MINT, publicKey);

      const keys = buildAccountMetas(ACCOUNTS_INIT_USER, [
        publicKey,
        SLAB_PUBKEY,
        userAta,
        VAULT,
        WELL_KNOWN.tokenProgram,
      ]);

      const ix = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys,
        data: ixData,
      });

      const tx = new Transaction().add(ix);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      addToast({
        type: "success",
        message: "Account initialized!",
        txSignature: sig,
      });
    } catch (err: any) {
      const logs = err?.logs as string[] | undefined;
      const parsed = logs ? parseErrorFromLogs(logs) : null;
      addToast({
        type: "error",
        message: parsed?.hint ?? err?.message ?? "Failed to initialize account",
      });
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection, sendTransaction, params, addToast]);

  return { initUser, loading };
}
