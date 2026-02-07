"use client";

import { useState, useRef } from "react";
import { useInView } from "@/hooks/useInView";

interface FormData {
  tokenName: string;
  tokenAddress: string;
  marketCap: string;
  description: string;
  email: string;
  twitter: string;
}

const INITIAL: FormData = {
  tokenName: "",
  tokenAddress: "",
  marketCap: "",
  description: "",
  email: "",
  twitter: "",
};

export function ApplyForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { threshold: 0.1 });

  const update = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.tokenName.trim()) e.tokenName = "Required";
    if (!form.tokenAddress.trim()) e.tokenAddress = "Required";
    if (
      form.tokenAddress.trim() &&
      (form.tokenAddress.trim().length < 32 || form.tokenAddress.trim().length > 44)
    ) {
      e.tokenAddress = "Invalid Solana address";
    }
    if (!form.email.trim() && !form.twitter.trim()) {
      e.email = "Provide email or Twitter";
      e.twitter = "Provide email or Twitter";
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Invalid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const filledCount = Object.values(form).filter((v) => v.trim() !== "").length;
  const filledPct = Math.round((filledCount / 6) * 100);

  if (submitted) {
    return (
      <section id="list-token" className="py-28 relative scroll-mt-20">
        <div className="max-w-[600px] mx-auto px-6">
          <div className="rounded-2xl border border-[var(--green)]/20 bg-[var(--panel)] p-10 text-center relative overflow-hidden">
            {/* Check icon */}
            <div className="w-14 h-14 rounded-full border-2 border-[var(--green)]/30 bg-[var(--green)]/10 flex items-center justify-center mx-auto mb-5 animate-scale-in">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-1)] mb-3 tracking-tight">
              Application Received
            </h3>
            <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-6">
              Thank you for your application. We will review your token and be in touch shortly.
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-3)]">
              <span>Questions?</span>
              <a
                href="https://twitter.com/peraborator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--blue)] hover:text-[var(--text-1)] transition-colors font-medium"
              >
                @percolator
              </a>
              <span className="w-px h-3 bg-white/[0.06]" />
              <a
                href="mailto:apply@percolator.trade"
                className="text-[var(--blue)] hover:text-[var(--text-1)] transition-colors font-medium"
              >
                apply@percolator.trade
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="list-token" className="py-28 relative scroll-mt-20 overflow-hidden">
      {/* Constellation dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: "10%", y: "20%", size: 2, opacity: 0.15 },
          { x: "85%", y: "15%", size: 1.5, opacity: 0.1 },
          { x: "70%", y: "80%", size: 2, opacity: 0.12 },
          { x: "20%", y: "70%", size: 1.5, opacity: 0.08 },
          { x: "50%", y: "10%", size: 1, opacity: 0.1 },
          { x: "90%", y: "50%", size: 1.5, opacity: 0.06 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[var(--blue)] animate-float-slow"
            style={{
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <line x1="10%" y1="20%" x2="50%" y2="10%" stroke="var(--blue)" strokeWidth="0.5" />
          <line x1="50%" y1="10%" x2="85%" y2="15%" stroke="var(--blue)" strokeWidth="0.5" />
          <line x1="20%" y1="70%" x2="70%" y2="80%" stroke="var(--blue)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[var(--blue)]/[0.04] blur-[120px] pointer-events-none" />

      <div className="max-w-[700px] mx-auto px-6 relative">
        {/* Outer glow ring */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--blue)]/10 via-transparent to-transparent pointer-events-none" />

        <div
          className="rounded-2xl border border-white/[0.08] bg-[var(--panel)]/80 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(74,158,255,0.05)]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header inside card */}
          <div className="p-8 pb-0">
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--blue)] mb-3">
              Apply
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] tracking-tight mb-3">
              List Your Token
            </h2>
            <p className="text-[14px] text-[var(--text-2)] leading-relaxed">
              Submit your token for a Percolator perpetual futures market.
            </p>
          </div>

          {/* Progress bar */}
          <div className="px-8 pt-6">
            <div className="h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${filledPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[9px] text-[var(--text-muted)]">
              <span>
                {filledCount}/6 fields
              </span>
              <span>{filledPct === 100 ? "Ready to submit" : "Fill in details"}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-px">
            <div className="rounded-lg overflow-hidden border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
                <Field
                  label="Token Name"
                  placeholder="e.g. Percolator"
                  value={form.tokenName}
                  onChange={(v) => update("tokenName", v)}
                  error={errors.tokenName}
                />
                <Field
                  label="Token Address (CA)"
                  placeholder="Solana mint address"
                  value={form.tokenAddress}
                  onChange={(v) => update("tokenAddress", v)}
                  error={errors.tokenAddress}
                  mono
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
                <Field
                  label="Market Cap (approx)"
                  placeholder="e.g. $500K"
                  value={form.marketCap}
                  onChange={(v) => update("marketCap", v)}
                  error={errors.marketCap}
                />
                <Field
                  label="Short Description"
                  placeholder="What does your token do?"
                  value={form.description}
                  onChange={(v) => update("description", v)}
                  error={errors.description}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
                <Field
                  label="Email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  error={errors.email}
                  type="email"
                />
                <Field
                  label="Twitter / X"
                  placeholder="@handle"
                  value={form.twitter}
                  onChange={(v) => update("twitter", v)}
                  error={errors.twitter}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-5">
              <span className="text-[11px] text-[var(--text-muted)]">
                At least one contact method required
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[var(--blue)] hover:bg-[var(--blue-dim)] text-white text-[13px] font-semibold transition-all glow-btn shadow-[0_0_30px_rgba(74,158,255,0.15)] hover:shadow-[0_0_40px_rgba(74,158,255,0.3)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={filledPct < 30}
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>

        {/* Contact info */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-[var(--text-3)]">
          <span>Reach us directly:</span>
          <a
            href="https://twitter.com/percolator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--blue)] hover:text-[var(--text-1)] transition-colors font-medium"
          >
            @percolator
          </a>
          <span className="w-px h-3 bg-white/[0.06]" />
          <a
            href="mailto:apply@percolator.trade"
            className="text-[var(--blue)] hover:text-[var(--text-1)] transition-colors font-medium"
          >
            apply@percolator.trade
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  mono,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  mono?: boolean;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`bg-[var(--base)] p-4 relative transition-all duration-300 ${focused ? "bg-[var(--card)]" : ""}`}
    >
      {/* Focus glow line */}
      <div
        className="absolute bottom-0 left-4 right-4 h-[1px] transition-all duration-300"
        style={{
          background: focused
            ? "linear-gradient(90deg, transparent, var(--blue), transparent)"
            : "transparent",
          opacity: focused ? 0.5 : 0,
        }}
      />
      <label
        className="block text-[9px] uppercase tracking-[0.15em] font-semibold text-[var(--text-3)] mb-2 transition-colors duration-300"
        style={{ color: focused ? "var(--blue)" : undefined }}
      >
        {label}
        {error && (
          <span className="text-[var(--red)] ml-2 normal-case tracking-normal">{error}</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`w-full bg-transparent text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-muted)] outline-none transition-colors ${mono ? "mono" : ""} ${error ? "text-[var(--red)]" : ""}`}
      />
    </div>
  );
}
