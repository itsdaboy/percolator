"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";

const TOKEN = "8PzFWyLpCVEmbZmVJcaRTU5r69XKJx1rd7YGpWvnpump";

const stats = [
  { label: "Market Access", display: "Permissionless", numericValue: null, suffix: "", prefix: "", accent: "blue" },
  { label: "On-Chain Settlement", display: "100%", numericValue: 100, suffix: "%", prefix: "", accent: "cyan" },
  { label: "Block Time", display: "~400ms", numericValue: 400, suffix: "ms", prefix: "~", accent: "violet" },
  { label: "Gatekeepers", display: "0", numericValue: 0, suffix: "", prefix: "", accent: "green" },
];

function CountUp({
  target,
  suffix,
  prefix,
  inView,
  duration = 2000,
}: {
  target: number;
  suffix: string;
  prefix: string;
  inView: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || target === 0) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span>
      {prefix}
      {target === 0 ? "0" : count}
      {suffix}
    </span>
  );
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { threshold: 0.2 });

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      {/* Radial pulse rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border border-[var(--blue)]/[0.04]"
            style={{
              width: `${ring * 300}px`,
              height: `${ring * 300}px`,
              top: `${-ring * 150}px`,
              left: `${-ring * 150}px`,
              animation: `ring-pulse 4s ease-in-out ${ring * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1100px] mx-auto px-6 relative">
        {/* Header */}
        <div className="mb-14">
          <div
            className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--blue)] mb-3 transition-all duration-500"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-20px)",
            }}
          >
            Protocol
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] tracking-tight"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-30px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms",
            }}
          >
            Built different
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative rounded-lg border border-white/[0.06] bg-[var(--panel)] p-8 text-center overflow-hidden group hover:border-white/[0.12] transition-all duration-500"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
                transitionDelay: `${i * 100}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Colored top border accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] bg-[var(--${stat.accent})]`}
                style={{
                  transform: inView ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100 + 200}ms`,
                }}
              />
              {/* Background glow on hover */}
              <div
                className={`absolute inset-0 bg-[var(--${stat.accent})]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[var(--text-3)] mb-3">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-[var(--text-1)] mono tabular">
                  {stat.numericValue !== null ? (
                    <CountUp
                      target={stat.numericValue}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      inView={inView}
                    />
                  ) : (
                    stat.display
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Token */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[var(--text-3)]">
          <span>Powered by</span>
          <a
            href={`https://pump.fun/coin/${TOKEN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mono font-semibold text-[var(--blue)] hover:text-[var(--text-1)] transition-colors"
          >
            $PERCOLATOR
          </a>
        </div>
      </div>
    </section>
  );
}
