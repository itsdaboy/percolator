"use client";

import { useEffect, useRef } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { ORACLE_PUBKEY } from "@/lib/constants";
import { parseChainlinkAccount } from "@/lib/chainlink";
import { useMarketStore } from "@/stores/marketStore";

/**
 * Subscribe to the Chainlink oracle account for live SOL/USD price.
 * Oracle account is only 248 bytes — much lighter than the slab.
 */
export function useOraclePrice() {
  const { connection } = useConnection();
  const setOraclePrice = useMarketStore((s) => s.setOraclePrice);
  const setCurrentSlot = useMarketStore((s) => s.setCurrentSlot);
  const retryCount = useRef(0);
  const hasData = useRef(false);

  useEffect(() => {
    let subId: number | undefined;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    function parseAndSet(data: Buffer) {
      try {
        const parsed = parseChainlinkAccount(data);
        setOraclePrice(parsed.price, parsed.decimals, parsed.updatedAt);
        hasData.current = true;
        retryCount.current = 0;
      } catch (err) {
        console.warn(`[useOraclePrice] parse error: ${(err as Error).message}`);
      }
    }

    async function fetchOracle() {
      try {
        const info = await connection.getAccountInfo(ORACLE_PUBKEY);
        if (cancelled || !info) return;
        parseAndSet(Buffer.from(info.data));

        // Also update current slot
        const slot = await connection.getSlot();
        if (!cancelled) setCurrentSlot(BigInt(slot));
      } catch (err) {
        if (cancelled) return;
        retryCount.current++;
        console.warn(`[useOraclePrice] fetch failed (attempt ${retryCount.current}): ${(err as Error).message}`);
      }
    }

    function schedulePoll() {
      if (cancelled) return;
      // Oracle is tiny (248B), poll faster than slab
      const base = 3000;
      const backoff = Math.min(base * Math.pow(1.5, retryCount.current), 20000);
      pollTimer = setTimeout(async () => {
        await fetchOracle();
        schedulePoll();
      }, backoff);
    }

    // Initial fetch
    fetchOracle().then(schedulePoll);

    // WebSocket subscription
    try {
      subId = connection.onAccountChange(
        ORACLE_PUBKEY,
        (accountInfo) => {
          if (!cancelled) {
            parseAndSet(Buffer.from(accountInfo.data));
          }
        },
        "confirmed"
      );
    } catch {
      // Polling handles it
    }

    return () => {
      cancelled = true;
      if (subId !== undefined) {
        connection.removeAccountChangeListener(subId);
      }
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [connection, setOraclePrice, setCurrentSlot]);
}
