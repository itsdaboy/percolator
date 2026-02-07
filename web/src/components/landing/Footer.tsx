"use client";

import { useState } from "react";
import Link from "next/link";

const TOKEN = "8PzFWyLpCVEmbZmVJcaRTU5r69XKJx1rd7YGpWvnpump";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const copyToken = () => {
    navigator.clipboard.writeText(TOKEN);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <footer className="relative pt-24 pb-10">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--blue)]/20 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6">
        {/* CTA */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-6 tracking-tight">
            Start Trading Now
          </h2>
          <p className="text-[var(--text-2)] text-sm mb-8 max-w-[400px] mx-auto">
            Connect your wallet and experience permissionless perpetual futures on Solana.
          </p>
          <Link
            href="/trade"
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-lg bg-[var(--blue)] hover:bg-[var(--blue-dim)] text-white text-sm font-semibold transition-all glow-btn shadow-[0_0_30px_rgba(74,158,255,0.2)] hover:shadow-[0_0_40px_rgba(74,158,255,0.35)]"
          >
            Launch Terminal
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Token */}
        <div className="text-center mb-14">
          <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[var(--text-3)] mb-3">
            Official Token
          </div>
          <button
            onClick={copyToken}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)]" />
            <code className="text-[12px] mono text-[var(--text-2)] group-hover:text-[var(--text-1)] transition-colors">
              {TOKEN}
            </code>
            <span className="text-[10px] font-semibold text-[var(--blue)]">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>

        {/* Links row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          {/* Text Logo */}
          <span className="text-[15px] font-bold tracking-tight accent-text">
            Percolator
          </span>

          {/* Nav */}
          <div className="flex items-center gap-6 text-[12px] font-medium text-[var(--text-3)]">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-1)] transition-colors">
              Docs
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-1)] transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-1)] transition-colors">
              Twitter
            </a>
            <a
              href={`https://pump.fun/coin/${TOKEN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--blue)] hover:text-[var(--text-1)] transition-colors"
            >
              pump.fun
            </a>
          </div>

          {/* Solana */}
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px]">
            <svg width="14" height="12" viewBox="0 0 508 454" fill="currentColor">
              <path d="M81.5 372.5L126.8 418.8C130 422 134.4 423.8 139 423.8H502.1C509 423.8 512.4 415.4 507.4 410.5L462.1 364.2C458.9 361 454.5 359.2 449.9 359.2H86.8C79.9 359.2 76.5 367.6 81.5 372.5Z" />
              <path d="M81.5 44.8L126.8 90.1C130 93.3 134.4 95.1 139 95.1H502.1C509 95.1 512.4 86.7 507.4 81.8L462.1 35.5C458.9 32.3 454.5 30.5 449.9 30.5H86.8C79.9 30.5 76.5 38.9 81.5 44.8Z" />
              <path d="M462.1 208L417.2 162.1C414 158.9 409.6 157.1 405 157.1H41.9C35 157.1 31.6 165.5 36.6 170.5L81.5 216.4C84.7 219.6 89.1 221.4 93.7 221.4H456.8C463.7 221.4 467.1 213 462.1 208Z" />
            </svg>
            <span>Solana</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.04] pt-6 text-center">
          <p className="text-[11px] text-[var(--text-muted)]">
            Sub-second finality. Negligible fees. Maximum composability.
          </p>
        </div>
      </div>
    </footer>
  );
}
