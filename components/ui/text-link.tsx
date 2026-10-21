"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { AnchorScrollLink } from "@/components/ui/anchor-scroll-link";
import { cn } from "@/lib/utils";

const hoverLineClassName =
  "pointer-events-none absolute bottom-[-0.18em] left-0 h-px w-full origin-right scale-x-0 bg-current [transition:scale_600ms_cubic-bezier(0.215,0.61,0.355,1)] group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 motion-reduce:transition-none";

// Always visible. No hover motion. Used only by the home story Learn More links.
const persistentLineClassName =
  "pointer-events-none absolute bottom-[-0.18em] left-0 h-px w-full bg-current";

function TextLinkLabel({
  children,
  persistentUnderline,
}: {
  children: React.ReactNode;
  persistentUnderline: boolean;
}) {
  return (
    <span className="relative">
      {children}
      <span
        aria-hidden="true"
        className={persistentUnderline ? persistentLineClassName : hoverLineClassName}
      />
    </span>
  );
}

export function TextLink({
  className,
  children,
  href,
  persistentUnderline = false,
  ...props
}: ComponentProps<typeof Link> & { persistentUnderline?: boolean }) {
  const classes = cn("group", className);

  if (typeof href === "string" && href.startsWith("#")) {
    return (
      <AnchorScrollLink href={href} className={classes}>
        <TextLinkLabel persistentUnderline={persistentUnderline}>
          {children}
        </TextLinkLabel>
      </AnchorScrollLink>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      <TextLinkLabel persistentUnderline={persistentUnderline}>{children}</TextLinkLabel>
    </Link>
  );
}
