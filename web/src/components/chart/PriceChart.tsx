"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMarketStore } from "@/stores/marketStore";
import { useUiStore } from "@/stores/uiStore";
import { formatUsd } from "@/lib/format";
import type { ChartType, Timeframe } from "@/stores/uiStore";

interface PricePoint {
  time: number;
  value: number;
}

interface OHLCPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1D"];

function timeframeToDays(tf: Timeframe): number {
  switch (tf) {
    case "1m":
    case "5m":
    case "15m":
    case "1h":
      return 1;
    case "4h":
      return 7;
    case "1D":
      return 30;
  }
}

async function fetchOHLC(days: number): Promise<OHLCPoint[]> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/solana/ohlc?vs_currency=usd&days=${days}`
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data: [number, number, number, number, number][] = await res.json();
    return data.map(([ms, open, high, low, close]) => ({
      time: Math.floor(ms / 1000),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    }));
  } catch (err) {
    console.warn("[PriceChart] Failed to fetch OHLC:", (err as Error).message);
    return [];
  }
}

function ohlcToLine(ohlc: OHLCPoint[]): PricePoint[] {
  return ohlc.map((c) => ({ time: c.time, value: c.close }));
}

export function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const ohlcDataRef = useRef<OHLCPoint[]>([]);
  const lineDataRef = useRef<PricePoint[]>([]);
  const historyLoaded = useRef<string | null>(null);
  const currentChartType = useRef<ChartType>("candle");
  const oraclePriceUsd = useMarketStore((s) => s.oraclePriceUsd);
  const error = useMarketStore((s) => s.error);
  const loading = useMarketStore((s) => s.loading);
  const oracleTimestamp = useMarketStore((s) => s.oracleTimestamp);
  const chartType = useUiStore((s) => s.chartType);
  const setChartType = useUiStore((s) => s.setChartType);
  const timeframe = useUiStore((s) => s.timeframe);
  const setTimeframe = useUiStore((s) => s.setTimeframe);

  const lwcRef = useRef<any>(null);

  const oracleStaleness =
    oracleTimestamp > 0 ? Math.floor(Date.now() / 1000) - oracleTimestamp : Infinity;

  const getChartOptions = useCallback((lwc: any) => {
    return {
      layout: {
        background: { type: lwc.ColorType.Solid, color: "#050810" },
        textColor: "#475569",
        fontSize: 10,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      },
      grid: {
        vertLines: { color: "rgba(74,158,255,0.04)", style: lwc.LineStyle.Dotted },
        horzLines: { color: "rgba(74,158,255,0.04)", style: lwc.LineStyle.Dotted },
      },
      rightPriceScale: {
        borderColor: "rgba(74,158,255,0.15)",
        scaleMargins: { top: 0.08, bottom: 0.08 },
      },
      timeScale: {
        borderColor: "rgba(74,158,255,0.15)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
        horzLine: {
          color: "#ff8c0060",
          labelBackgroundColor: "#ff8c00",
          style: lwc.LineStyle.Dashed,
          width: 1 as 1,
        },
        vertLine: {
          color: "#ff8c0060",
          labelBackgroundColor: "#ff8c00",
          style: lwc.LineStyle.Dashed,
          width: 1 as 1,
        },
      },
      watermark: {
        visible: true,
        fontSize: 48,
        horzAlign: "center" as const,
        vertAlign: "center" as const,
        color: "rgba(74,158,255,0.03)",
        text: "PERCOLATOR",
      },
    };
  }, []);

  const addSeries = useCallback((chart: any, type: ChartType) => {
    if (type === "candle") {
      return chart.addCandlestickSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e80",
        wickDownColor: "#ef444480",
        priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      });
    }
    return chart.addAreaSeries({
      topColor: "rgba(59, 130, 246, 0.12)",
      bottomColor: "rgba(59, 130, 246, 0.0)",
      lineColor: "#3b82f6",
      lineWidth: 2,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: "#3b82f6",
      crosshairMarkerBackgroundColor: "#050810",
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      lastValueVisible: true,
      priceLineVisible: true,
      priceLineColor: "#3b82f630",
      priceLineStyle: 2,
    });
  }, []);

  // Create chart + load historical data
  useEffect(() => {
    if (!containerRef.current) return;

    let chart: any;
    let disposed = false;

    (async () => {
      const lwc = await import("lightweight-charts");
      lwcRef.current = lwc;

      if (!containerRef.current || disposed) return;

      chart = lwc.createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        ...getChartOptions(lwc),
      });

      chartRef.current = chart;

      // Load historical OHLC data
      const days = timeframeToDays(timeframe);
      const tfKey = `${days}d`;
      if (historyLoaded.current !== tfKey) {
        const ohlc = await fetchOHLC(days);
        if (disposed) return;
        if (ohlc.length > 0) {
          const map = new Map<number, OHLCPoint>();
          for (const c of ohlc) map.set(c.time, c);
          ohlcDataRef.current = Array.from(map.values()).sort(
            (a, b) => a.time - b.time
          );
          lineDataRef.current = ohlcToLine(ohlcDataRef.current);
          historyLoaded.current = tfKey;
        }
      }

      // Add initial series
      const series = addSeries(chart, currentChartType.current);
      seriesRef.current = series;

      if (currentChartType.current === "candle" && ohlcDataRef.current.length > 0) {
        series.setData(ohlcDataRef.current);
      } else if (lineDataRef.current.length > 0) {
        series.setData(lineDataRef.current);
      }
      chart.timeScale().fitContent();

      const observer = new ResizeObserver((entries) => {
        if (!disposed) {
          const { width, height } = entries[0].contentRect;
          chart.applyOptions({ width, height });
        }
      });
      observer.observe(containerRef.current);

      return () => observer.disconnect();
    })();

    return () => {
      disposed = true;
      if (chart) chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [getChartOptions, addSeries, timeframe]);

  // Toggle chart type
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;
    if (chartType === currentChartType.current) return;

    const chart = chartRef.current;
    chart.removeSeries(seriesRef.current);

    const series = addSeries(chart, chartType);
    seriesRef.current = series;
    currentChartType.current = chartType;

    if (chartType === "candle" && ohlcDataRef.current.length > 0) {
      series.setData(ohlcDataRef.current);
    } else if (lineDataRef.current.length > 0) {
      series.setData(lineDataRef.current);
    }
    chart.timeScale().fitContent();
  }, [chartType, addSeries]);

  // Append live oracle data
  useEffect(() => {
    if (oraclePriceUsd <= 0) return;

    const now = Math.floor(Date.now() / 1000);
    const bucket = now - (now % 60);

    const ohlc = ohlcDataRef.current;
    if (ohlc.length > 0 && ohlc[ohlc.length - 1].time >= bucket) {
      const last = ohlc[ohlc.length - 1];
      last.high = Math.max(last.high, oraclePriceUsd);
      last.low = Math.min(last.low, oraclePriceUsd);
      last.close = oraclePriceUsd;
    } else {
      ohlc.push({
        time: bucket,
        open: oraclePriceUsd,
        high: oraclePriceUsd,
        low: oraclePriceUsd,
        close: oraclePriceUsd,
      });
    }

    const line = lineDataRef.current;
    if (line.length > 0 && line[line.length - 1].time >= now) {
      line[line.length - 1].value = oraclePriceUsd;
    } else {
      line.push({ time: now, value: oraclePriceUsd });
    }

    if (ohlc.length > 7200) ohlc.splice(0, ohlc.length - 7200);
    if (line.length > 7200) line.splice(0, line.length - 7200);

    if (seriesRef.current) {
      if (currentChartType.current === "candle" && ohlc.length > 0) {
        seriesRef.current.update(ohlc[ohlc.length - 1]);
      } else if (line.length > 0) {
        seriesRef.current.update(line[line.length - 1]);
      }
    }
  }, [oraclePriceUsd]);

  // Compute H/L from loaded data
  const ohlc = ohlcDataRef.current;
  const lastCandle = ohlc.length > 0 ? ohlc[ohlc.length - 1] : null;

  return (
    <div className="relative w-full h-full min-h-[200px] bg-[#050810]">
      <div ref={containerRef} className="w-full h-full" />

      {/* Top-left: Timeframes + chart type */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1">
        <div className="flex overflow-hidden border border-[var(--frame-color)] bg-[#050810]/90 backdrop-blur-sm">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 text-[9px] font-bold terminal-mono transition-colors ${
                timeframe === tf
                  ? "bg-[var(--blue)]/15 text-[var(--blue)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-3)]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-[var(--frame-color)]" />

        <div className="flex overflow-hidden border border-[var(--frame-color)] bg-[#050810]/90 backdrop-blur-sm">
          <button
            onClick={() => setChartType("line")}
            className={`px-2.5 py-1 text-[9px] font-bold terminal-mono transition-colors ${
              chartType === "line"
                ? "bg-[var(--blue)]/15 text-[var(--blue)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-3)]"
            }`}
          >
            LINE
          </button>
          <button
            onClick={() => setChartType("candle")}
            className={`px-2.5 py-1 text-[9px] font-bold terminal-mono transition-colors ${
              chartType === "candle"
                ? "bg-[var(--blue)]/15 text-[var(--blue)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-3)]"
            }`}
          >
            OHLC
          </button>
        </div>
      </div>

      {/* Top-right: Price HUD */}
      {oraclePriceUsd > 0 && (
        <div className="absolute top-3 right-3 z-10 border border-[var(--frame-color)] bg-[#050810]/90 backdrop-blur-sm px-3 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[7px] terminal-mono font-bold text-[var(--text-muted)] tracking-wider">LAST</span>
            <span className="text-[16px] terminal-mono font-bold text-[var(--text-1)]">
              {formatUsd(oraclePriceUsd, 2)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[7px] terminal-mono text-[var(--text-muted)]">
              ORACLE {oracleStaleness < Infinity ? `${oracleStaleness}s` : "N/A"}
            </span>
          </div>
        </div>
      )}

      {/* Bottom-left: O/H/L data */}
      {lastCandle && oraclePriceUsd > 0 && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3">
          {[
            { label: "O", value: lastCandle.open },
            { label: "H", value: lastCandle.high },
            { label: "L", value: lastCandle.low },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-1">
              <span className="text-[7px] terminal-mono font-bold text-[var(--text-muted)]">{label}</span>
              <span className="text-[10px] terminal-mono font-bold text-[var(--text-3)]">
                {value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Loading / no data state */}
      {oraclePriceUsd <= 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-[var(--blue)] animate-terminal-blink" />
              {loading && (
                <div
                  className="w-32 h-[2px] bg-[var(--frame-color)] overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-transparent via-[var(--blue)] to-transparent"
                    style={{ animation: "shimmer-line 2s ease-in-out infinite" }}
                  />
                </div>
              )}
            </div>
            <span className="text-[10px] terminal-mono font-bold text-[var(--text-muted)]">
              {error
                ? "RPC CONNECTION ISSUE — RETRYING..."
                : loading
                ? "CONNECTING TO SOLANA DEVNET..."
                : "WAITING FOR ORACLE DATA..."}
            </span>
            {error && (
              <span className="text-[8px] max-w-[300px] text-center leading-relaxed terminal-mono text-[var(--text-muted)]">
                The public devnet RPC is rate-limited. Set NEXT_PUBLIC_RPC_URL
                in .env.local for reliable data.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
