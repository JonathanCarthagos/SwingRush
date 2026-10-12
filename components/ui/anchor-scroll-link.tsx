"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { getLenis } from "@/lib/smooth-scroll";

export type AnchorScrollLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * In-page hash link that scrolls to the first visible node with the target id,
 * so a hidden duplicate (e.g. a breakpoint-only copy) can never win the match.
 */
export function AnchorScrollLink({
  href,
  onClick,
  ...props
}: AnchorScrollLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (!href?.startsWith("#") || href.length < 2) return;

    const id = href.slice(1);
    const target = Array.from(
      document.querySelectorAll<HTMLElement>(`[id="${id}"]`),
    ).find((el) => el.getClientRects().length > 0);

    if (target) {
      event.preventDefault();
      const lenis = getLenis();
      if (lenis) {
        // Lenis already stops at the target's scroll-margin-top, like scrollIntoView does.
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ block: "start" });
      }
    }
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
