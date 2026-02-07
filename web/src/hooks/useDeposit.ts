"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import {
  encodeDepositCollateral,
  ACCOUNTS_DEPOSIT_COLLATERAL,
  buildAccountMetas,
  WELL_KNOWN,
  parseErrorFromLogs,
} from "@percolator/protocol";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";
import { PROGRAM_ID, SLAB_PUBKEY, MINT, VAULT } from "@/lib/constants";
import { useUiStore } from "@/stores/uiStore";

export function useDeposit() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const addToast = useUiStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);

  const deposit = useCallback(
    async (userIdx: number, amountLamports: bigint) => {
      if (!publicKey) {
        addToast({ type: "error", message: "Connect your wallet first." });
        return;
      }

      setLoading(true);
      try {
        const tx = new Transaction();

        const userAta = await getAssociatedTokenAddress(MINT, publicKey);

        // Check if WSOL ATA exists; if not, create it
        const ataInfo = await connection.getAccountInfo(userAta);
        if (!ataInfo) {
          tx.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userAta,
              publicKey,
              NATIVE_MINT
            )
          );
        }

        // Wrap SOL: transfer lamports to ATA then sync
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: userAta,
            lamports: amountLamports,
          }),
          createSyncNativeInstruction(userAta)
        );

        // Deposit instruction
        const ixData = encodeDepositCollateral({
          userIdx,
          amount: amountLamports,
        });

        const keys = buildAccountMetas(ACCOUNTS_DEPOSIT_COLLATERAL, [
          publicKey,
          SLAB_PUBKEY,
          userAta,
          VAULT,
          WELL_KNOWN.tokenProgram,
          WELL_KNOWN.clock,
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

        addToast({
          type: "success",
          message: `Deposited ${Number(amountLamports) / 1e9} SOL`,
          txSignature: sig,
        });
      } catch (err: any) {
        const logs = err?.logs as string[] | undefined;
        const parsed = logs ? parseErrorFromLogs(logs) : null;
        addToast({
          type: "error",
          message: parsed?.hint ?? err?.message ?? "Deposit failed",
        });
      } finally {
        setLoading(false);
      }
    },
    [publicKey, connection, sendTransaction, addToast]
  );

  return { deposit, loading };
}
