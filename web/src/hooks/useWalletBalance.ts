"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function useWalletBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    let cancelled = false;

    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (!cancelled) {
          setBalance(lamports / 1e9);
        }
      } catch {
        // Silently ignore errors
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 15_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connection, publicKey]);

  return balance;
}
