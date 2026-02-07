"use client";

export function WaveDivider() {
  return (
    <div className="relative py-16 overflow-hidden">
      <svg
        className="w-full h-16 text-[var(--blue)]"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 40 Q150 10 300 40 T600 40 T900 40 T1200 40"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.15"
        />
        <path
          d="M0 50 Q150 20 300 50 T600 50 T900 50 T1200 50"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeOpacity="0.08"
        />
        <path
          d="M0 30 Q200 55 400 30 T800 30 T1200 30"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeOpacity="0.05"
        />
      </svg>
      {/* Traveling dots */}
      <div
        className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[var(--blue)]/40 animate-travel-dot blur-[1px]"
      />
      <div
        className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-[var(--cyan)]/30 animate-travel-dot"
        style={{ animationDelay: "3s" }}
      />
    </div>
  );
}
