"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TOKEN = "8PzFWyLpCVEmbZmVJcaRTU5r69XKJx1rd7YGpWvnpump";
const TOKEN_SHORT = TOKEN.slice(0, 4) + "..." + TOKEN.slice(-4);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyToken = () => {
    navigator.clipboard.writeText(TOKEN);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#06080f]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Text Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-[17px] font-bold tracking-tight accent-text">
            Percolator
          </span>
          <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-[var(--yellow)]/10 text-[var(--yellow)] border border-[var(--yellow)]/20">
            Devnet
          </span>
        </div>

        {/* Center: Token address */}
        <button
          onClick={copyToken}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shadow-[0_0_4px_var(--green)]" />
          <span className="text-[11px] mono text-[var(--text-2)] group-hover:text-[var(--text-1)] transition-colors">
            $PERCOLATOR
          </span>
          <span className="text-[10px] mono text-[var(--text-3)]">
            {copied ? "Copied!" : TOKEN_SHORT}
          </span>
        </button>

        {/* Right */}
        <div className="flex items-center gap-5">
          <a
            href={`https://pump.fun/coin/${TOKEN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-[12px] font-medium text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
          >
            Token
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-[12px] font-medium text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
          >
            Docs
          </a>
          <Link
            href="/trade"
            className="px-4 py-1.5 rounded-md bg-[var(--blue)] hover:bg-[var(--blue-dim)] text-white text-[12px] font-semibold transition-all glow-btn shadow-[0_0_20px_rgba(74,158,255,0.15)]"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
