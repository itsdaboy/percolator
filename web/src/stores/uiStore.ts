"use client";

import { create } from "zustand";

export type TradeDirection = "long" | "short";
export type ChartType = "line" | "candle";
export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1D";

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  txSignature?: string;
}

export interface UiStore {
  // Chart type
  chartType: ChartType;
  setChartType: (type: ChartType) => void;

  // Timeframe
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;

  // Trade direction
  tradeDirection: TradeDirection;
  setTradeDirection: (dir: TradeDirection) => void;

  // Selected LP index for trading
  selectedLpIdx: number;
  setSelectedLpIdx: (idx: number) => void;

  // Modal states
  depositModalOpen: boolean;
  setDepositModalOpen: (open: boolean) => void;
  withdrawModalOpen: boolean;
  setWithdrawModalOpen: (open: boolean) => void;

  // Orderbook
  orderbookCollapsed: boolean;
  setOrderbookCollapsed: (v: boolean) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

let toastId = 0;

export const useUiStore = create<UiStore>((set) => ({
  chartType: "candle",
  setChartType: (type) => set({ chartType: type }),

  timeframe: "1h",
  setTimeframe: (tf) => set({ timeframe: tf }),

  tradeDirection: "long",
  setTradeDirection: (dir) => set({ tradeDirection: dir }),

  selectedLpIdx: 4, // Default to vAMM LP
  setSelectedLpIdx: (idx) => set({ selectedLpIdx: idx }),

  depositModalOpen: false,
  setDepositModalOpen: (open) => set({ depositModalOpen: open }),
  withdrawModalOpen: false,
  setWithdrawModalOpen: (open) => set({ withdrawModalOpen: open }),

  orderbookCollapsed: false,
  setOrderbookCollapsed: (v) => set({ orderbookCollapsed: v }),

  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: String(++toastId) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
