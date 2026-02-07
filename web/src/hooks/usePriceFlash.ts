"use client";
import { useRef, useState, useEffect } from "react";

export function usePriceFlash(price: number) {
  const prevRef = useRef(price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (price !== prevRef.current && price > 0 && prevRef.current > 0) {
      setFlash(price > prevRef.current ? "up" : "down");
      prevRef.current = price;
      const timer = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(timer);
    }
    prevRef.current = price;
  }, [price]);

  return flash;
}
