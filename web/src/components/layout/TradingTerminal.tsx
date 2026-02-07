"use client";

import {
  Panel,
  Group,
  Separator,
} from "react-resizable-panels";
import { TopBar } from "./TopBar";
import { OrderEntry } from "@/components/trading/OrderEntry";
import { BottomPanel } from "@/components/positions/BottomPanel";
import { AccountPanel } from "@/components/account/AccountPanel";
import { PriceChart } from "@/components/chart/PriceChart";
import { Orderbook } from "@/components/orderbook/Orderbook";
import { Toast } from "@/components/common/Toast";
import { ScreenFlash } from "@/components/common/ScreenFlash";
import { PanelFrame } from "@/components/common/PanelFrame";

function ResizeHandle({
  orientation,
}: {
  orientation: "horizontal" | "vertical";
}) {
  return (
    <Separator
      className={`${
        orientation === "horizontal" ? "w-[1px]" : "h-[1px]"
      } bg-[var(--frame-color)] hover:bg-[var(--blue)]/40 active:bg-[var(--blue)]/60 transition-colors relative`}
    >
      {/* Center grip dots */}
      <div
        className={`absolute ${
          orientation === "horizontal"
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[2px]"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-[2px]"
        }`}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-[1px] h-[1px] bg-[var(--text-muted)] rounded-full"
          />
        ))}
      </div>
    </Separator>
  );
}

export function TradingTerminal() {
  return (
    <div className="relative flex flex-col h-screen bg-[var(--base)] overflow-hidden crt-noise crt-scanlines trade-scanline">
      {/* Fine grid (20px) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,158,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.025) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Major grid (100px) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,158,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.05) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <TopBar />

        <Group orientation="horizontal" className="flex-1 min-h-0">
          {/* Main area: chart + positions */}
          <Panel id="main" defaultSize="75%" minSize="50%">
            <Group orientation="vertical">
              <Panel id="chart" defaultSize="65%" minSize="30%">
                <PanelFrame label="CHART">
                  <div className="w-full h-full overflow-hidden relative">
                    <PriceChart />
                  </div>
                </PanelFrame>
              </Panel>

              <ResizeHandle orientation="vertical" />

              <Panel id="positions" defaultSize="35%" minSize="15%">
                <PanelFrame label="POSITIONS">
                  <BottomPanel />
                </PanelFrame>
              </Panel>
            </Group>
          </Panel>

          <ResizeHandle orientation="horizontal" />

          {/* Sidebar */}
          <Panel id="sidebar" defaultSize="25%" minSize="15%" maxSize="40%">
            <Group orientation="vertical">
              <Panel id="orderbook" defaultSize="40%" minSize="20%">
                <PanelFrame label="DEPTH">
                  <div className="h-full overflow-hidden border-l border-[var(--frame-color)] bg-[var(--panel)]">
                    <Orderbook />
                  </div>
                </PanelFrame>
              </Panel>

              <ResizeHandle orientation="vertical" />

              <Panel id="order-entry" defaultSize="60%" minSize="30%">
                <PanelFrame label="ORDER">
                  <div className="h-full flex flex-col border-l border-[var(--frame-color)] bg-[var(--panel)]">
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <OrderEntry />
                    </div>
                    <div className="shrink-0 border-t border-[var(--frame-color)]">
                      <AccountPanel />
                    </div>
                  </div>
                </PanelFrame>
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>

      <Toast />
      <ScreenFlash />
    </div>
  );
}
