"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TradingTerminal } from "@/components/layout/TradingTerminal";
import { useMarketData } from "@/hooks/useMarketData";
import { useOraclePrice } from "@/hooks/useOraclePrice";
import { WalletModal } from "@/components/wallet/WalletModal";

function TradeContent() {
  useMarketData();
  useOraclePrice();

  const searchParams = useSearchParams();
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    if (searchParams.get("connect") === "true") {
      setShowConnect(true);
    }
  }, [searchParams]);

  return (
    <>
      <TradingTerminal />
      {showConnect && <WalletModal onClose={() => setShowConnect(false)} />}
    </>
  );
}

export default function TradePage() {
  return (
    <Suspense>
      <TradeContent />
    </Suspense>
  );
}
