"use client";

export function HealthMeter({
  marginRatio,
  maintenanceMarginBps,
  initialMarginBps,
}: {
  marginRatio: number;
  maintenanceMarginBps: number;
  initialMarginBps: number;
}) {
  const maintenancePct = maintenanceMarginBps / 10000;
  const initialPct = initialMarginBps / 10000;

  // Map margin ratio to a 0-100 bar width
  // 0 = liquidation, maintenancePct = danger zone, initialPct = warning, 2x initial = healthy
  const maxRatio = initialPct * 3;
  const pct = Math.min(100, Math.max(0, (marginRatio / maxRatio) * 100));

  const color =
    marginRatio <= maintenancePct
      ? "bg-red-500"
      : marginRatio <= initialPct
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Margin Health</span>
        <span className="font-mono font-tabular">
          {isFinite(marginRatio) ? `${(marginRatio * 100).toFixed(1)}%` : "-"}
        </span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-slate-500">
        <span>Liq</span>
        <span>Maint ({(maintenancePct * 100).toFixed(0)}%)</span>
        <span>Initial ({(initialPct * 100).toFixed(0)}%)</span>
      </div>
    </div>
  );
}
