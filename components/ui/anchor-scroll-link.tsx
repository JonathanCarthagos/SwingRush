"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

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
      target.scrollIntoView({ block: "start" });
    }
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
