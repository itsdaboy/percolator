"use client";

import { useEffect } from "react";
import { useUiStore } from "@/stores/uiStore";

export function Toast() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          txSignature={toast.txSignature}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  type,
  message,
  txSignature,
  onClose,
}: {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  txSignature?: string;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 6000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const prefix =
    type === "success" ? "[OK]" : type === "error" ? "[ERR]" : "[INFO]";

  const prefixColor =
    type === "success"
      ? "text-[var(--green)]"
      : type === "error"
      ? "text-[var(--red)]"
      : "text-[var(--blue)]";

  const borderColor =
    type === "success"
      ? "border-[var(--green)]/20"
      : type === "error"
      ? "border-[var(--red)]/20"
      : "border-[var(--blue)]/20";

  return (
    <div
      className={`max-w-[360px] px-3 py-2.5 animate-slide-up bg-[var(--panel)] border ${borderColor} shadow-lg shadow-black/20`}
    >
      <div className="flex items-start gap-2">
        <span className={`text-[10px] terminal-mono font-bold ${prefixColor} shrink-0`}>
          {prefix}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] leading-relaxed terminal-mono font-bold text-[var(--text-2)]">
            {message}
          </p>
          {txSignature && (
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[8px] terminal-mono font-bold mt-1 block truncate text-[var(--blue)] hover:text-[var(--text-1)] transition-colors"
            >
              TX {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
            </a>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="text-[10px] terminal-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-1)] transition-colors shrink-0"
        >
          [X]
        </button>
      </div>
    </div>
  );
}
