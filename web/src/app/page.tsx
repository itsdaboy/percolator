"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TokenBanner } from "@/components/landing/TokenBanner";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { GlowDivider } from "@/components/landing/GlowDivider";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { WaveDivider } from "@/components/landing/WaveDivider";
import { ApplyForm } from "@/components/landing/ApplyForm";
import { Footer } from "@/components/landing/Footer";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60]">
      <div
        className="h-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)]"
        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--base)]">
      {/* Global background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute top-[40%] left-[5%] w-[500px] h-[500px] rounded-full bg-[var(--blue)]/[0.015] blur-[180px] animate-orb" />
        <div className="absolute top-[60%] right-[5%] w-[400px] h-[400px] rounded-full bg-[var(--cyan)]/[0.01] blur-[160px] animate-orb-reverse" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(74,158,255,0.3) 0px, transparent 1px, transparent 120px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <ScrollProgress />
        <Navbar />
        <Hero />
        <TokenBanner />
        <HowItWorks />
        <GlowDivider />
        <Stats />
        <Features />
        <WaveDivider />
        <ApplyForm />
        <Footer />
      </div>
    </main>
  );
}
