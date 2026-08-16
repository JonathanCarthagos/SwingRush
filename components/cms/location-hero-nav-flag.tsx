"use client";

import { useLayoutEffect } from "react";

/**
 * Signals the global nav that this route has a video hero, without fetching
 * Sanity in the root layout.
 */
export function LocationHeroNavFlag() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.locationHero = "true";

    return () => {
      delete root.dataset.locationHero;
    };
  }, []);

  return null;
}
