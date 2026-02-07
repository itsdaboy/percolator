"use client";
import { useEffect, useState, type RefObject } from "react";

export function useInView(
  ref: RefObject<HTMLElement | null>,
  options?: { threshold?: number; rootMargin?: string }
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      {
        threshold: options?.threshold ?? 0.2,
        rootMargin: options?.rootMargin ?? "0px",
      }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, options?.threshold, options?.rootMargin]);

  return inView;
}
