"use client";

import Lenis, { type LenisOptions } from "lenis";
import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";

export interface SmoothScrollLayoutProps {
  children: React.ReactNode;
  enabled?: boolean;
  options?: LenisOptions;
}

const DEFAULT_LENIS_OPTIONS = {
  anchors: true,
  lerp: 0.09,
  smoothWheel: true,
} satisfies LenisOptions;

export function SmoothScrollLayout({
  children,
  enabled = true,
  options,
}: SmoothScrollLayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || shouldReduceMotion) return;

    const lenis = new Lenis({
      ...DEFAULT_LENIS_OPTIONS,
      ...options,
    });

    let frameId = 0;

    function raf(time: number) {
      // Lenis owns the smoothed scroll value; this RAF keeps it synced with browser frames.
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [enabled, options, shouldReduceMotion]);

  return <>{children}</>;
}
