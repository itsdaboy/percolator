"use client";

import { useState, useEffect } from "react";
import { PositionTable } from "./PositionTable";
import { LPInfoPanel } from "@/components/depth/LPInfoPanel";

type Tab = "positions" | "lps";

export function BottomPanel() {
  const [tab, setTab] = useState<Tab>("positions");
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLastUpdate(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "positions", label: "POSITIONS" },
    { key: "lps", label: "LIQUIDITY" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden relative z-10 bg-[var(--panel)]">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-2 shrink-0 border-b border-[var(--frame-color)]">
        <div className="flex items-center gap-0">
          {tabs.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 text-[9px] font-bold terminal-mono tracking-[0.1em] transition-all relative ${
                  active
                    ? "text-[var(--text-1)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-3)]"
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--blue)]" />
                )}
              </button>
            );
          })}
        </div>
        <span className="text-[7px] terminal-mono text-[var(--text-muted)] tracking-wider">
          LAST UPDATE {lastUpdate}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "positions" && <PositionTable />}
        {tab === "lps" && <LPInfoPanel />}
      </div>
    </div>
  );
}
