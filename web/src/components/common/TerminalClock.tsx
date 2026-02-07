"use client";
import { useState, useEffect } from "react";

export function TerminalClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toISOString().slice(11, 19));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className="text-[8px] terminal-mono text-[var(--text-muted)] tabular">
      {time} <span className="text-[var(--text-muted)]">UTC</span>
    </span>
  );
}
