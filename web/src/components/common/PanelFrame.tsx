"use client";

export function PanelFrame({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative h-full ${className ?? ""}`}>
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--frame-color)] z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--frame-color)] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--frame-color)] z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--frame-color)] z-20 pointer-events-none" />

      {/* Panel label badge */}
      {label && (
        <div className="absolute top-0 left-3 z-20 -translate-y-1/2 pointer-events-none">
          <span className="px-1.5 py-px text-[7px] font-bold tracking-[0.2em] uppercase bg-[var(--base)] text-[var(--frame-color)] border border-[var(--frame-color)] animate-label-slide terminal-mono">
            {label}
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
