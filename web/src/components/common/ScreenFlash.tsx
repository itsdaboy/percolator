"use client";
import { useEffect, useState, useRef } from "react";
import { useUiStore } from "@/stores/uiStore";

export function ScreenFlash() {
  const toasts = useUiStore((s) => s.toasts);
  const [flash, setFlash] = useState<"success" | "error" | null>(null);
  const lastCountRef = useRef(0);

  useEffect(() => {
    if (toasts.length > lastCountRef.current) {
      const latest = toasts[toasts.length - 1];
      setFlash(latest.type === "error" ? "error" : "success");
      const timer = setTimeout(() => setFlash(null), 400);
      lastCountRef.current = toasts.length;
      return () => clearTimeout(timer);
    }
    lastCountRef.current = toasts.length;
  }, [toasts]);

  if (!flash) return null;

  const color = flash === "success" ? "var(--green)" : "var(--red)";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] animate-fade-in"
      style={{
        boxShadow: `inset 0 0 60px -20px ${color}`,
        animation: "fade-in 0.1s ease-out, fade-in 0.3s ease-in reverse forwards 0.1s",
      }}
    />
  );
}
