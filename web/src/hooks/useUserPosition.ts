"use client";

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMarketStore } from "@/stores/marketStore";
import { AccountKind } from "@percolator/protocol";
import {
  computeUnrealizedPnl,
  computeEffectiveCapital,
  computeMarginRatio,
  computeNotional,
  computeLeverage,
  computeLiquidationPrice,
} from "@percolator/protocol";
import type { PositionView, Account } from "@percolator/protocol";

/**
 * Find the connected wallet's user account and compute position data.
 */
export function useUserPosition(): {
  userIdx: number | null;
  position: PositionView | null;
  account: Account | null;
  loading: boolean;
} {
  const { publicKey } = useWallet();
  const accounts = useMarketStore((s) => s.accounts);
  const params = useMarketStore((s) => s.params);
  const oraclePriceE6 = useMarketStore((s) => s.oraclePriceE6Inverted);
  const loading = useMarketStore((s) => s.loading);

  return useMemo(() => {
    if (!publicKey || accounts.length === 0) {
      return { userIdx: null, position: null, account: null, loading };
    }

    const walletStr = publicKey.toBase58();
    const userEntry = accounts.find(
      (a) =>
        a.account.kind === AccountKind.User &&
        a.account.owner.toBase58() === walletStr
    );

    if (!userEntry) {
      return { userIdx: null, position: null, account: null, loading: false };
    }

    const { idx, account } = userEntry;
    const markPriceE6 = oraclePriceE6 > 0n ? oraclePriceE6 : account.entryPrice > 0n ? account.entryPrice : 0n;

    const unrealizedPnl = computeUnrealizedPnl(
      account.positionSize,
      account.entryPrice,
      markPriceE6
    );

    const effectiveCapital = computeEffectiveCapital(
      account.capital,
      unrealizedPnl
    );

    const notional = computeNotional(account.positionSize, markPriceE6);
    const marginRatio = computeMarginRatio(effectiveCapital, notional);
    const leverage = computeLeverage(
      account.positionSize,
      markPriceE6,
      effectiveCapital
    );

    const maintenanceMarginBps = params?.maintenanceMarginBps ?? 500n;
    const liquidationPriceE6 = computeLiquidationPrice(
      account.positionSize,
      account.entryPrice,
      account.capital,
      maintenanceMarginBps
    );

    const sizeAbs =
      account.positionSize < 0n
        ? -account.positionSize
        : account.positionSize;

    const position: PositionView = {
      accountIdx: idx,
      side:
        account.positionSize > 0n
          ? "long"
          : account.positionSize < 0n
          ? "short"
          : "none",
      size: account.positionSize,
      sizeAbs,
      entryPriceE6: account.entryPrice,
      markPriceE6,
      unrealizedPnl,
      capital: account.capital,
      effectiveCapital,
      marginRatio,
      leverage,
      liquidationPriceE6,
    };

    return { userIdx: idx, position, account, loading: false };
  }, [publicKey, accounts, params, oraclePriceE6, loading]);
}
