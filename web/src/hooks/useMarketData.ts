"use client";

import { useEffect, useRef } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { SLAB_PUBKEY } from "@/lib/constants";
import { useMarketStore } from "@/stores/marketStore";

/**
 * Subscribe to the slab account for real-time market data.
 * The slab is ~989KB — uses longer intervals and exponential backoff.
 * Initial fetch is delayed 1.5s to let the oracle fetch go first (avoids rate-limit).
 */
export function useMarketData() {
  const { connection } = useConnection();
  const updateFromSlab = useMarketStore((s) => s.updateFromSlab);
  const setLoading = useMarketStore((s) => s.setLoading);
  const setError = useMarketStore((s) => s.setError);
  const retryCount = useRef(0);
  const hasData = useRef(false);

  useEffect(() => {
    let subId: number | undefined;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function fetchSlab() {
      try {
        const info = await connection.getAccountInfo(SLAB_PUBKEY);
        if (cancelled) return;
        if (!info) {
          setError("Slab account not found on devnet");
          return;
        }
        updateFromSlab(Buffer.from(info.data));
        hasData.current = true;
        retryCount.current = 0;
      } catch (err) {
        if (cancelled) return;
        retryCount.current++;
        const msg = (err as Error).message || "Unknown error";
        console.warn(`[useMarketData] fetch #${retryCount.current} failed: ${msg}`);
        if (!hasData.current) {
          setError(`Slab fetch failed — retrying... (${msg.slice(0, 60)})`);
        }
      }
    }

    function schedulePoll() {
      if (cancelled) return;
      const base = hasData.current ? 6000 : 4000;
      const backoff = Math.min(base * Math.pow(1.5, retryCount.current), 30000);
      pollTimer = setTimeout(async () => {
        await fetchSlab();
        schedulePoll();
      }, backoff);
    }

    // Delay initial slab fetch by 1.5s — let oracle go first (smaller, faster)
    setLoading(true);
    const startDelay = setTimeout(() => {
      if (!cancelled) {
        fetchSlab().then(schedulePoll);
      }
    }, 1500);

    // WebSocket subscription
    try {
      subId = connection.onAccountChange(
        SLAB_PUBKEY,
        (accountInfo) => {
          if (!cancelled) {
            updateFromSlab(Buffer.from(accountInfo.data));
            hasData.current = true;
            retryCount.current = 0;
          }
        },
        "confirmed"
      );
    } catch {
      // Polling handles it
    }

    return () => {
      cancelled = true;
      clearTimeout(startDelay);
      if (subId !== undefined) {
        connection.removeAccountChangeListener(subId);
      }
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [connection, updateFromSlab, setLoading, setError]);
}
