"use client";

import { useMarketStore } from "@/stores/marketStore";
import { AccountKind } from "@percolator/protocol";
import { useUiStore } from "@/stores/uiStore";

export function LPInfoPanel() {
  const accounts = useMarketStore((s) => s.accounts);
  const selectedLpIdx = useUiStore((s) => s.selectedLpIdx);
  const setSelectedLpIdx = useUiStore((s) => s.setSelectedLpIdx);

  const lpAccounts = accounts.filter((a) => a.account.kind === AccountKind.LP);

  if (lpAccounts.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-[11px] font-medium text-slate-500">
          No LP accounts found
        </span>
      </div>
    );
  }

  return (
    <table className="w-full text-left">
      <thead className="sticky top-0 z-10 bg-gray-900">
        <tr>
          {["LP", "Capital", "Position", "Side", ""].map((col, i) => (
            <th
              key={col || "active"}
              className={`px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500 ${
                i >= 1 && i <= 3 ? "text-right" : ""
              } ${i === 4 ? "text-center" : ""}`}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lpAccounts.map(({ idx, account }) => {
          const isSelected = idx === selectedLpIdx;
          const capital = Number(account.capital) / 1e9;
          const posSize = Math.abs(Number(account.positionSize) / 1e9);
          const side =
            account.positionSize > 0n
              ? "Long"
              : account.positionSize < 0n
              ? "Short"
              : "-";

          return (
            <tr
              key={idx}
              onClick={() => setSelectedLpIdx(idx)}
              className={`cursor-pointer transition-all border-b border-slate-800/50 ${
                isSelected
                  ? "bg-blue-500/[0.06]"
                  : "hover:bg-slate-800/30"
              }`}
            >
              <td className="px-4 py-2.5">
                <span className="text-[12px] font-semibold text-slate-100">
                  LP #{idx}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right">
                <span className="text-[12px] tabular font-medium text-slate-300">
                  {capital.toFixed(2)} SOL
                </span>
              </td>
              <td className="px-4 py-2.5 text-right">
                <span className="text-[12px] tabular font-medium text-slate-300">
                  {posSize.toFixed(4)}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right">
                <span
                  className={`text-[12px] tabular font-semibold ${
                    account.positionSize > 0n
                      ? "text-green-400"
                      : account.positionSize < 0n
                      ? "text-red-400"
                      : "text-slate-500"
                  }`}
                >
                  {side}
                </span>
              </td>
              <td className="px-4 py-2.5 text-center">
                {isSelected && (
                  <span className="inline-block w-[6px] h-[6px] rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
