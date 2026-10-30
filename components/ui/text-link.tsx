"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { AnchorScrollLink } from "@/components/ui/anchor-scroll-link";
import { cn } from "@/lib/utils";

const hoverLineClassName =
  "pointer-events-none absolute bottom-[-0.18em] left-0 h-px w-full origin-right scale-x-0 bg-current [transition:scale_600ms_cubic-bezier(0.215,0.61,0.355,1)] group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 motion-reduce:transition-none";

// Navbar: line toggles on hover/focus with no draw animation.
const instantHoverLineClassName =
  "pointer-events-none absolute bottom-[-0.18em] left-0 h-px w-full bg-current opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100";

// Always visible. No hover motion. Used only by the home story Learn More links.
const persistentLineClassName =
  "pointer-events-none absolute bottom-[-0.18em] left-0 h-px w-full bg-current";

function underlineLineClassName({
  persistentUnderline,
  instantHoverUnderline,
}: {
  persistentUnderline: boolean;
  instantHoverUnderline: boolean;
}) {
  if (persistentUnderline) return persistentLineClassName;
  if (instantHoverUnderline) return instantHoverLineClassName;
  return hoverLineClassName;
}

function TextLinkLabel({
  children,
  persistentUnderline,
  instantHoverUnderline,
}: {
  children: React.ReactNode;
  persistentUnderline: boolean;
  instantHoverUnderline: boolean;
}) {
  return (
    <span className="relative">
      {children}
      <span
        aria-hidden="true"
        className={underlineLineClassName({
          persistentUnderline,
          instantHoverUnderline,
        })}
      />
    </span>
  );
}

export function TextLink({
  className,
  children,
  href,
  persistentUnderline = false,
  instantHoverUnderline = false,
  ...props
}: ComponentProps<typeof Link> & {
  persistentUnderline?: boolean;
  instantHoverUnderline?: boolean;
}) {
  const classes = cn("group", className);
  const label = (
    <TextLinkLabel
      persistentUnderline={persistentUnderline}
      instantHoverUnderline={instantHoverUnderline}
    >
      {children}
    </TextLinkLabel>
  );

  if (typeof href === "string" && href.startsWith("#")) {
    return (
      <AnchorScrollLink href={href} className={classes}>
        {label}
      </AnchorScrollLink>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {label}
    </Link>
  );
}
