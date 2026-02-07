"use client";

import { useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TransactionInstruction } from "@solana/web3.js";
import {
  encodeKeeperCrank,
  ACCOUNTS_KEEPER_CRANK,
  buildAccountMetas,
  WELL_KNOWN,
} from "@percolator/protocol";
import { PROGRAM_ID, SLAB_PUBKEY, ORACLE_PUBKEY } from "@/lib/constants";

/**
 * Build a KeeperCrank instruction. Used to prepend to trade TXs when crank is stale.
 */
export function useKeeperCrank() {
  const { publicKey } = useWallet();

  const buildCrankIx = useCallback((): TransactionInstruction | null => {
    if (!publicKey) return null;

    const ixData = encodeKeeperCrank({
      callerIdx: 65535, // permissionless
      allowPanic: false,
    });

    const keys = buildAccountMetas(ACCOUNTS_KEEPER_CRANK, [
      publicKey,
      SLAB_PUBKEY,
      WELL_KNOWN.clock,
      ORACLE_PUBKEY,
    ]);

    return new TransactionInstruction({
      programId: PROGRAM_ID,
      keys,
      data: ixData,
    });
  }, [publicKey]);

  return { buildCrankIx };
}
