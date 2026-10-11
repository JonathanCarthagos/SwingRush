"use client";

import { useEffect, useSyncExternalStore, ViewTransition } from "react";

const noopSubscribe = () => () => {};
const getIsEmbedded = () => window.self !== window.top;
const getServerIsEmbedded = () => false;

/**
 * Page push transition, used from `template.tsx` files (which remount when
 * their child segment changes). Animations live in globals.css
 * (`.page-in` / `.page-out`).
 *
 * Inside an iframe (Sanity Presentation preview) the transition is switched
 * off: only the props change, so nothing remounts and hydration stays stable.
 */
export function PageTransition({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const embedded = useSyncExternalStore(
    noopSubscribe,
    getIsEmbedded,
    getServerIsEmbedded,
  );

  // The nav animates through its own `site-nav` snapshot, so CSS needs to know
  // about the embedded case too (see `html[data-embedded]` in globals.css).
  useEffect(() => {
    if (!embedded) return;
    const root = document.documentElement;
    root.dataset.embedded = "";
    return () => {
      delete root.dataset.embedded;
    };
  }, [embedded]);

  return (
    <ViewTransition
      enter={embedded ? "none" : "page-in"}
      exit={embedded ? "none" : "page-out"}
      default="none"
    >
      <div className="flex min-h-full flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
