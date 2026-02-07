"use client";

export function GlowDivider() {
  return (
    <div className="relative py-12 flex items-center justify-center overflow-hidden">
      {/* Horizontal gradient line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--blue)]/30 to-transparent" />
      {/* Animated shimmer */}
      <div
        className="absolute left-0 right-0 h-[2px] animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(74,158,255,0.6), rgba(0,229,255,0.4), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
      {/* Central diamond marker */}
      <div className="relative w-3 h-3 rotate-45 border border-[var(--blue)]/40 bg-[var(--base)]">
        <div className="absolute inset-0 bg-[var(--blue)]/20 animate-pulse-glow" />
      </div>
    </div>
  );
}
