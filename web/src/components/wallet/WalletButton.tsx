"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { WalletModal } from "./WalletModal";
import { shortenPubkey } from "@/lib/format";

export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const balance = useWalletBalance();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!connected || !publicKey) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
        >
          Connect Wallet
        </button>
        {showModal && <WalletModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  const addr = publicKey.toBase58();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
      >
        {/* Identicon */}
        <div
          className="w-5 h-5 rounded-full"
          style={{
            background: `linear-gradient(135deg, hsl(${
              addr.charCodeAt(0) * 7
            }, 60%, 50%), hsl(${addr.charCodeAt(4) * 7}, 60%, 40%))`,
          }}
        />
        <span className="text-xs font-medium text-slate-200 font-mono">
          {shortenPubkey(addr)}
        </span>
        {balance !== null && (
          <span className="text-[10px] text-slate-400 tabular">
            {balance.toFixed(2)} SOL
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-xl shadow-black/40 z-50 overflow-hidden">
          <button
            onClick={() => {
              navigator.clipboard.writeText(addr);
              setShowDropdown(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy Address
          </button>
          <a
            href={`https://explorer.solana.com/address/${addr}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowDropdown(false)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Explorer
          </a>
          <div className="border-t border-slate-800" />
          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-slate-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
