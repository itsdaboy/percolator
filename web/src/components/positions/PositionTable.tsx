"use client";

import { useUserPosition } from "@/hooks/useUserPosition";
import { PositionRow } from "./PositionRow";

export function PositionTable() {
  const { position, loading } = useUserPosition();
  const hasPosition = position && position.side !== "none";

  return (
    <div className="w-full">
      <table className="w-full text-left">
        <thead className="sticky top-0 z-10 bg-[var(--panel)]">
          <tr>
            {["MARKET", "SIDE", "SIZE", "ENTRY", "MARK", "PNL", "LEV", "LIQ", ""].map(
              (col, i) => (
                <th
                  key={col || "actions"}
                  className={`px-4 py-2 text-[7px] font-bold terminal-mono uppercase tracking-[0.15em] text-[var(--text-muted)] border-b border-[var(--frame-color)] ${
                    i >= 2 ? "text-right" : ""
                  }`}
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {hasPosition ? (
            <PositionRow position={position} />
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="w-2 h-4 bg-[var(--blue)]/50 animate-terminal-blink" />
                  <span className="text-[10px] terminal-mono font-bold text-[var(--text-muted)]">
                    {loading ? "LOADING POSITIONS..." : "NO OPEN POSITIONS"}
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
