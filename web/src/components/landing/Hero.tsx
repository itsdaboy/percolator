"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

const TOKEN = "8PzFWyLpCVEmbZmVJcaRTU5r69XKJx1rd7YGpWvnpump";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const copyToken = () => {
    navigator.clipboard.writeText(TOKEN);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const scrollToApply = () => {
    document.getElementById("list-token")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
  };

  // Deterministic particles for SSR
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${(i * 3.33) % 100}%`,
        top: `${(i * 7.77) % 100}%`,
        delay: `${(i * 0.4) % 10}s`,
        duration: `${8 + (i % 5) * 3}s`,
        opacity: 0.15 + (i % 4) * 0.08,
      })),
    []
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated grid background with pulse */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,158,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            animation: "grid-pulse 6s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--base)_80%)]" />
      </div>

      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-[2px] h-[2px] rounded-full bg-[var(--blue)] animate-particle"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Floating gradient orbs with parallax */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
      >
        <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] rounded-full bg-[var(--blue)]/[0.03] blur-[150px] animate-orb" />
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-[var(--cyan)]/[0.02] blur-[130px] animate-orb-reverse" />
        <div
          className="absolute top-[50%] right-[30%] w-[400px] h-[300px] rounded-full bg-[var(--violet)]/[0.015] blur-[120px] animate-orb"
          style={{ animationDelay: "5s" }}
        />
      </div>

      {/* Central glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full animate-hero-glow"
          style={{
            background:
              "radial-gradient(ellipse, rgba(74,158,255,0.08) 0%, rgba(0,229,255,0.03) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Content with parallax */}
      <div
        className="relative z-10 max-w-[1000px] mx-auto px-6 text-center pt-20 pb-16"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
          opacity: Math.max(0, 1 - scrollY / 600),
        }}
      >
        {/* Status badge */}
        <div className="animate-fade-in-up mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]" />
              </span>
              <span className="font-medium text-[var(--text-2)]">Live on Solana Devnet</span>
            </span>
            <span className="w-px h-3.5 bg-white/[0.08]" />
            <span className="mono font-semibold text-[var(--blue)]">$PERCOLATOR</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="animate-fade-in-up delay-100 mb-4">
          <span className="text-[11px] sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-[var(--blue)]/80">
            The base for SOV perp launches
          </span>
        </div>

        {/* Headline with blinking cursor */}
        <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95] mb-6 animate-fade-in-up delay-100">
          <span className="text-[var(--text-1)]">The Perpetual</span>
          <br />
          <span className="accent-text">Machine</span>
          <span
            className="text-[var(--cyan)] ml-1 inline-block"
            style={{
              animation: "blink 1s step-end 3, cursor-fade-out 4s ease-out forwards",
            }}
          >
            |
          </span>
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-[var(--text-2)] max-w-[640px] mx-auto mb-4 leading-relaxed animate-fade-in-up delay-200">
          Permissionless perpetual futures on Solana.
          <br className="hidden sm:block" />
          Any token. Instant market. Fully on-chain.
        </p>

        {/* Toly reference */}
        <p className="text-[13px] text-[var(--text-3)] max-w-[500px] mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          Bringing Toly&apos;s vision to life &mdash; building on top of{" "}
          <a
            href="https://github.com/aeyakovenko"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--blue)] hover:text-[var(--text-1)] transition-colors underline underline-offset-2 decoration-[var(--blue)]/30"
          >
            Toly&apos;s GitHub
          </a>
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up delay-300">
          <Link
            href="/trade"
            onClick={handleRipple}
            className="relative overflow-hidden flex items-center gap-2.5 px-8 py-3 rounded-lg bg-[var(--blue)] hover:bg-[var(--blue-dim)] text-white text-sm font-semibold transition-all glow-btn shadow-[0_0_30px_rgba(74,158,255,0.2)] hover:shadow-[0_0_40px_rgba(74,158,255,0.35)] active:scale-[0.97]"
          >
            {ripple && (
              <span
                className="absolute rounded-full bg-white/20 animate-ripple pointer-events-none"
                style={{
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                  width: 40,
                  height: 40,
                }}
              />
            )}
            Launch Terminal
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <button
            onClick={scrollToApply}
            className="px-8 py-3 rounded-lg border border-white/[0.08] hover:border-[var(--blue)]/30 bg-white/[0.02] hover:bg-white/[0.04] text-[var(--text-2)] hover:text-[var(--text-1)] text-sm font-medium transition-all backdrop-blur-sm active:scale-[0.97]"
          >
            List Your Token
          </button>
        </div>

        {/* View Token link */}
        <div className="animate-fade-in-up delay-400 mb-8">
          <a
            href={`https://pump.fun/coin/${TOKEN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] font-medium text-[var(--text-3)] hover:text-[var(--blue)] transition-colors"
          >
            View on pump.fun
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>

        {/* Token address */}
        <div className="animate-fade-in-up delay-500">
          <button
            onClick={copyToken}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm transition-all group"
          >
            <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-[var(--text-3)]">
              CA
            </span>
            <code className="text-[11px] mono text-[var(--text-2)] group-hover:text-[var(--text-1)] transition-colors">
              {TOKEN}
            </code>
            <span className="text-[10px] font-semibold text-[var(--blue)]">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>

        {/* Stats strip */}
        <div className="mt-14 flex items-center justify-center gap-10 animate-fade-in delay-600">
          <Metric label="Finality" value="~400ms" />
          <span className="w-px h-10 bg-white/[0.06]" />
          <Metric label="Settlement" value="On-Chain" />
          <span className="w-px h-10 bg-white/[0.06]" />
          <Metric label="Markets" value="Permissionless" />
          <span className="hidden sm:block w-px h-10 bg-white/[0.06]" />
          <div className="hidden sm:block">
            <Metric label="Token" value="$PERCOLATOR" accent />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-800">
        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-3)]">Scroll</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[var(--text-3)] animate-float"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--base)] to-transparent" />
    </section>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`text-sm font-semibold tabular ${accent ? "text-[var(--blue)]" : "text-[var(--text-1)]"}`}
      >
        {value}
      </span>
      <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-3)] font-medium">
        {label}
      </span>
    </div>
  );
}
