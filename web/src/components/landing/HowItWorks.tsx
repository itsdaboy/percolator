"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

const steps = [
  {
    number: "01",
    title: "Deploy",
    description:
      "Deposit any SPL token as collateral to create a new perpetual futures market. No governance. No gatekeepers.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    file: "deploy.rs",
  },
  {
    number: "02",
    title: "Collateralize",
    description:
      "Your token becomes the unit of account. It backs the inverted perp market, locking value into your ecosystem.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    file: "collateral.rs",
  },
  {
    number: "03",
    title: "Trade",
    description:
      "Go long or short on the inverted perpetual. Fully on-chain execution with sub-second finality on Solana.",
    icon: "M2 17l4-4 4 4 6-8 6 4",
    file: "trade.rs",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { threshold: 0.15 });

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      {/* Blueprint dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(74,158,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--base)_75%)]" />

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
            How It Works
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] tracking-tight transition-all duration-600"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-30px)",
              transitionDelay: "100ms",
            }}
          >
            Three steps to a perpetual market
          </h2>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-[32px] left-[16.66%] right-[16.66%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-[var(--blue)]/20 via-[var(--cyan)]/10 to-[var(--blue)]/20" />
            <div
              className="absolute inset-0 animate-flow-line"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(74,158,255,0.5), transparent)",
                backgroundSize: "30% 100%",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
              }}
            >
              {/* Timeline node */}
              <div className="flex justify-center mb-6">
                <div className="w-4 h-4 rounded-full border-2 border-[var(--blue)]/40 bg-[var(--base)] relative">
                  <div
                    className="absolute inset-1 rounded-full bg-[var(--blue)] transition-all duration-700"
                    style={{
                      transform: inView ? "scale(1)" : "scale(0)",
                      opacity: inView ? 1 : 0,
                      transitionDelay: `${i * 150 + 300}ms`,
                    }}
                  />
                </div>
              </div>

              {/* Terminal card */}
              <div className="rounded-lg border border-white/[0.06] bg-[var(--panel)] overflow-hidden hover:border-[var(--blue)]/20 transition-all duration-300 group">
                {/* Terminal header bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.01]">
                  <span className="w-2 h-2 rounded-full bg-[var(--red)]/40" />
                  <span className="w-2 h-2 rounded-full bg-[var(--yellow)]/40" />
                  <span className="w-2 h-2 rounded-full bg-[var(--green)]/40" />
                  <span className="ml-auto text-[9px] mono text-[var(--text-muted)]">
                    {step.file}
                  </span>
                </div>

                <div className="p-6">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-[var(--blue)]/[0.06] border border-[var(--blue)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--blue)]/[0.1] group-hover:border-[var(--blue)]/20 transition-all">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-[var(--blue)]"
                    >
                      <path
                        d={step.icon}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--text-1)] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-2)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
