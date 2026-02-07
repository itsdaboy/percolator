"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import type { Wallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

export function WalletModal({ onClose }: { onClose: () => void }) {
  const { wallets, select } = useWallet();

  const detected = wallets.filter(
    (w) =>
      w.readyState === WalletReadyState.Installed ||
      w.readyState === WalletReadyState.Loadable
  );
  const uninstalled = wallets.filter(
    (w) =>
      w.readyState === WalletReadyState.NotDetected ||
      w.readyState === WalletReadyState.Unsupported
  );

  const handleSelect = (wallet: Wallet) => {
    select(wallet.adapter.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-4 space-y-2">
          {detected.length > 0 && (
            <>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 px-2 mb-2">
                Detected
              </p>
              {detected.map((wallet) => (
                <button
                  key={wallet.adapter.name}
                  onClick={() => handleSelect(wallet)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    width={28}
                    height={28}
                    className="rounded-lg"
                  />
                  <span className="text-sm font-medium text-white">
                    {wallet.adapter.name}
                  </span>
                </button>
              ))}
            </>
          )}

          {uninstalled.length > 0 && (
            <>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 px-2 mt-4 mb-2">
                More wallets
              </p>
              {uninstalled.slice(0, 4).map((wallet) => (
                <a
                  key={wallet.adapter.name}
                  href={wallet.adapter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors opacity-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    width={28}
                    height={28}
                    className="rounded-lg"
                  />
                  <span className="text-sm font-medium text-slate-400">
                    {wallet.adapter.name}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-600">
                    Install
                  </span>
                </a>
              ))}
            </>
          )}

          {detected.length === 0 && uninstalled.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-6">
              No wallets found. Please install a Solana wallet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
