"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { AnchorScrollLink } from "@/components/ui/anchor-scroll-link";
import { cn } from "@/lib/utils";

const lineClassName =
  "pointer-events-none absolute bottom-[-0.18em] left-0 h-px w-full origin-right scale-x-0 bg-current [transition:scale_600ms_cubic-bezier(0.215,0.61,0.355,1)] group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 motion-reduce:transition-none";

function TextLinkLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative">
      {children}
      <span aria-hidden="true" className={lineClassName} />
    </span>
  );
}

export function TextLink({
  className,
  children,
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const classes = cn("group", className);

  if (typeof href === "string" && href.startsWith("#")) {
    return (
      <AnchorScrollLink href={href} className={classes}>
        <TextLinkLabel>{children}</TextLinkLabel>
      </AnchorScrollLink>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      <TextLinkLabel>{children}</TextLinkLabel>
    </Link>
  );
}
