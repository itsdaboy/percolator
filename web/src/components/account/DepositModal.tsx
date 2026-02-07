"use client";

import { useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import { useDeposit } from "@/hooks/useDeposit";
import { Spinner } from "@/components/common/Spinner";

export function DepositModal({ userIdx }: { userIdx: number }) {
  const open = useUiStore((s) => s.depositModalOpen);
  const setOpen = useUiStore((s) => s.setDepositModalOpen);
  const { deposit, loading } = useDeposit();
  const [amount, setAmount] = useState("");

  if (!open) return null;
  const lamports = BigInt(Math.round(parseFloat(amount || "0") * 1e9));
  const valid = lamports > 0n;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-[360px] rounded-xl p-6 bg-gray-900 border border-slate-700 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold text-slate-100">Deposit SOL</h3>
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 text-lg leading-none">&times;</button>
        </div>
        <div className="flex items-center h-11 rounded-lg px-4 mb-3 bg-slate-800 border border-slate-700 focus-within:border-blue-500/50 transition-all">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" min="0" autoFocus className="flex-1 bg-transparent text-base font-semibold tabular text-slate-100 placeholder:text-slate-600 focus:outline-none" />
          <span className="text-[10px] font-bold text-slate-500 ml-2">SOL</span>
        </div>
        <div className="flex gap-1.5 mb-5">
          {[0.1, 0.5, 1, 5].map((v) => (
            <button key={v} onClick={() => setAmount(String(v))} className="flex-1 h-7 text-[10px] tabular font-semibold rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 transition-all">{v}</button>
          ))}
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => setOpen(false)} className="flex-1 h-10 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-all">Cancel</button>
          <button onClick={async () => { await deposit(userIdx, lamports); setOpen(false); setAmount(""); }} disabled={!valid || loading} className="flex-1 h-10 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-30 bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/20">
            {loading ? <Spinner size={12} /> : "Deposit"}
          </button>
        </div>
      </div>
    </div>
  );
}
