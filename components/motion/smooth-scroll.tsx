"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { getLenis, setLenis } from "@/lib/smooth-scroll";

// Desktop with a mouse or trackpad only. Phones and tablets keep their native momentum scrolling.
const SMOOTH_SCROLL_QUERY =
  "(min-width: 1280px) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Smooth wheel scrolling for the public site on desktop. Renders nothing.
 * Off inside iframes (Sanity Presentation) and when the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (window.self !== window.top) return;

    const smoothQuery = window.matchMedia(SMOOTH_SCROLL_QUERY);
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let lenis: Lenis | null = null;

    const sync = () => {
      const shouldRun = smoothQuery.matches && !reducedQuery.matches;

      if (shouldRun && !lenis) {
        lenis = new Lenis({
          autoRaf: true,
          duration: 1.1,
          // Exponential ease-out: a quick response to the wheel that settles gently.
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          smoothWheel: true,
          syncTouch: false,
          anchors: false,
        });
        setLenis(lenis);
      } else if (!shouldRun && lenis) {
        lenis.destroy();
        lenis = null;
        setLenis(null);
      }
    };

    sync();
    smoothQuery.addEventListener("change", sync);
    reducedQuery.addEventListener("change", sync);

    return () => {
      smoothQuery.removeEventListener("change", sync);
      reducedQuery.removeEventListener("change", sync);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  // A new route starts at the top instantly, so the reset never fights the page transition.
  // The first run is the initial load, which must keep its scroll position and any #hash target.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (window.location.hash) return;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
