import {
  SOLID_NAV_MAIN_CLASS,
  SOLID_NAV_NOT_FOUND_CLASS,
} from "@/lib/layout/hero-shell";
import { cn } from "@/lib/utils";

const SITE_MAIN_CLASS = {
  /** Waitlist, privacy, and terms. */
  solidNav: SOLID_NAV_MAIN_CLASS,
  /** 404. Same offset as `solidNav`, plus a flex column and white text. */
  solidNavNotFound: SOLID_NAV_NOT_FOUND_CLASS,
} as const;

export type SiteMainVariant = keyof typeof SITE_MAIN_CLASS;

export interface SiteMainProps extends React.ComponentProps<"main"> {
  variant: SiteMainVariant;
}

/**
 * Landmark for pages that clear the solid header.
 * Home, Challenges, How It Works, and the locations index keep their own
 * `<main>` in `page.tsx` — those class lists are not the same string.
 * City routes declare `<main>` in `locations/[slug]/page.tsx`.
 */
export function SiteMain({
  variant,
  className,
  children,
  ...props
}: SiteMainProps) {
  return (
    <main
      id="main"
      className={cn(SITE_MAIN_CLASS[variant], className)}
      {...props}
    >
      {children}
    </main>
  );
}
