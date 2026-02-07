"use client";

import { useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

const features = [
  {
    title: "Permissionless Markets",
    description:
      "Any team can deploy their token as collateral to create a new perpetual futures market. No governance, no gatekeepers.",
    icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9 9 0 0 1 3 12c0-1.47.353-2.856.978-4.082",
    tag: "OPEN",
  },
  {
    title: "Inverted Perpetuals",
    description:
      "Unique pricing mechanism where positions are denominated in the collateral token. Your token IS the unit of account.",
    icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
    tag: "NOVEL",
  },
  {
    title: "On-Chain Settlement",
    description:
      "Every trade, liquidation, and funding payment is fully on-chain. No off-chain orderbook, no centralized sequencer.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    tag: "VERIFIED",
  },
  {
    title: "Keeper Network",
    description:
      "Permissionless crank system for funding rate updates. Anyone can run a keeper and earn fees for keeping the market fresh.",
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z",
    tag: "ACTIVE",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      {/* Diagonal scan lines background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,229,255,0.5) 0px, transparent 1px, transparent 60px)",
        }}
      />
      {/* Asymmetric glow */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[400px] rounded-full bg-[var(--violet)]/[0.025] blur-[150px] pointer-events-none" />

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
            Features
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] tracking-tight"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-30px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms",
            }}
          >
            Purpose-built for DeFi
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: { title: string; description: string; icon: string; tag: string };
  index: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    );
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onMouseLeave = () => {
    setHovering(false);
    setTransform("");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onMouseLeave}
      className="relative rounded-xl border border-white/[0.06] bg-[var(--panel)] p-8 group overflow-hidden"
      style={{
        transform: hovering ? transform : undefined,
        transition: hovering ? "transform 0.1s ease-out" : "transform 0.4s ease-out, opacity 0.6s ease-out",
        opacity: inView ? 1 : 0,
        ...(inView ? {} : { transform: "translateY(30px)" }),
        transitionDelay: hovering ? "0ms" : `${index * 120}ms`,
      }}
    >
      {/* Mouse-following glow */}
      {hovering && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, rgba(74,158,255,0.06), transparent 70%)`,
          }}
        />
      )}
      {/* Shimmer border on hover */}
      {hovering && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, rgba(74,158,255,0.15), transparent 70%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
            borderRadius: "inherit",
          }}
        />
      )}

      <div className="relative z-10">
        {/* Icon with animated border on hover */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-11 h-11 rounded-lg border border-white/[0.06] flex items-center justify-center relative overflow-hidden group-hover:border-transparent transition-colors">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--blue), var(--cyan), var(--violet), var(--blue))",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: "1px",
                borderRadius: "0.5rem",
                animation: "spin 3s linear infinite",
              }}
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[var(--text-3)] group-hover:text-[var(--blue)] transition-colors relative z-10"
            >
              <path
                d={feature.icon}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[8px] mono uppercase tracking-[0.15em] font-bold text-[var(--text-muted)] group-hover:text-[var(--blue)]/80 transition-colors">
            {feature.tag}
          </span>
        </div>

        <h3 className="text-[15px] font-semibold text-[var(--text-1)] mb-2 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}
