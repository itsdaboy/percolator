const TOKEN = "8PzFWyLpCVEmbZmVJcaRTU5r69XKJx1rd7YGpWvnpump";

export function TokenBanner() {
  const items = Array(8).fill(null);

  return (
    <div className="relative overflow-hidden py-3.5 border-y border-white/[0.03] bg-white/[0.008]">
      <div className="animate-ticker flex whitespace-nowrap">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-6 mx-6 shrink-0">
            <span className="text-[9px] font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">
              Percolator Protocol
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--blue)]/20" />
            <span className="text-[9px] mono text-[var(--text-muted)]">
              {TOKEN}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--blue)]/20" />
            <span className="text-[9px] mono font-semibold text-[var(--blue)]/30">
              $PERCOLATOR
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--blue)]/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
