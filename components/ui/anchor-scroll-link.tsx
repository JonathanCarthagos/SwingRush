"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

export type AnchorScrollLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * The location-detail desktop layout renders a second copy of the
 * ticket-info/volunteer sections (see location-detail-page.tsx), so an
 * in-page hash link can match a hidden mobile node first. This resolves the
 * click to whichever same-id node is actually visible before scrolling.
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
