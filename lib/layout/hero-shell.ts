/**
 * Shared nav-offset class strings. Values match the header in `nav.tsx`:
 * mobile uses `nav-offset`, tablet ramps 3.375rem → 6rem, desktop locks to 6rem
 * (`h-24` / `pt-24` / `mt-24` / `top-24` / `scroll-mt-24`).
 *
 * Keep each token as a complete Tailwind class. Do not interpolate them —
 * the scanner only sees literals.
 */

/** Tablet header height, also used as padding, margin, and scroll-margin. */
export const NAV_BAR_TABLET_HEIGHT_CLASS =
  "min-[768px]:h-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)]";

export const NAV_BAR_TABLET_PADDING_TOP_CLASS =
  "min-[768px]:pt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)]";

export const NAV_BAR_TABLET_MARGIN_TOP_CLASS =
  "min-[768px]:mt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)]";

export const NAV_BAR_TABLET_SCROLL_MARGIN_CLASS =
  "min-[768px]:scroll-mt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)]";

/**
 * Location video hero reads this variable for its tablet height.
 * Underscores are Tailwind's encoding of spaces inside an arbitrary value.
 */
export const LOCATION_HERO_NAV_VAR_CLASS =
  "min-[768px]:[--location-hero-nav:clamp(3.375rem,calc(-0.5625rem_+_8.203125vw),6rem)]";

/** Pages under the solid header (waitlist, privacy, terms). */
export const SOLID_NAV_MAIN_CLASS = `flex-1 overflow-x-hidden bg-black pt-nav-offset ${NAV_BAR_TABLET_PADDING_TOP_CLASS} min-[1280px]:pt-24`;

/** 404 adds a flex column and white text; it does not clip overflow. */
export const SOLID_NAV_NOT_FOUND_CLASS = `flex flex-1 bg-black pt-nav-offset text-white ${NAV_BAR_TABLET_PADDING_TOP_CLASS} min-[1280px]:pt-24`;

/** In-page anchors on city detail, which also offset through the tablet ramp. */
export const SCROLL_MARGIN_NAV_TABLET_CLASS = `scroll-mt-nav-offset ${NAV_BAR_TABLET_SCROLL_MARGIN_CLASS} min-[1280px]:scroll-mt-24`;

/** Home's first band skips the tablet ramp and locks at the desktop nav. */
export const SCROLL_MARGIN_NAV_DESKTOP_CLASS =
  "scroll-mt-nav-offset min-[1280px]:scroll-mt-24";

/** Static image heroes (challenges, how it works, locations index). */
export const PAGE_HERO_FRAME_CLASS = [
  "relative mt-nav-offset flex h-[16.75rem] items-center justify-center overflow-hidden bg-brand px-4 text-center text-white",
  NAV_BAR_TABLET_MARGIN_TOP_CLASS,
  "min-[768px]:h-[clamp(20rem,min(calc(100vw*658/1680),45svh),41.125rem)]",
  "min-[1280px]:mt-24 min-[1280px]:h-[clamp(20rem,calc(100vw*658/1680),41.125rem)]",
].join(" ");

/** City sales and waitlist routes. The landmark lives on the route, not the section. */
export const LOCATION_ROUTE_MAIN_CLASS =
  "flex-1 overflow-x-hidden bg-black text-white";
