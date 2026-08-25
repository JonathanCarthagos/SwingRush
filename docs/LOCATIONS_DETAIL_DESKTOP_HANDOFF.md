# Location detail desktop handoff

## Reference

- Figma file: `98BC7yEVdl4GKwe66XBvv1`
- Location detail (complete template, New York City content) frame: `1772:12799`
- Pixel-perfect reference viewport: `1680px`
- Global desktop breakpoint: `1280px`

## Responsive contract

- Mobile below `768px` is locked, unchanged.
- There is no tablet design for this page — 768–1279px keeps rendering the same mobile-capped column it always has (`max-w-[25.125rem]`, centered). This is a pre-existing gap, not something this pass fixed; treat it as locked too until a tablet Figma frame is provided.
- The desktop composition is additive from `1280px` upward via `min-[1280px]:` classes only. No `min-[768px]:` class was touched.

## Desktop composition (complete cities, e.g. New York)

- **Hero** (`components/sections/location-video-hero.tsx`): the existing video/poster background is shared between mobile and desktop (one instance, no duplicate media). Height goes from `20.4rem` (mobile) to `41.125rem` (~658px at 1680px reference); the media's top offset changes from `3.625rem` to `6rem` (`top-24`) to clear the 96px desktop nav bar. A city-name title overlay (`text-[12.5rem]`, Owners TRIAL XNarrow Black Italic) is centered on the video, `hidden` below 1280px, `flex` from 1280px up — mirrors the Home/How-It-Works hero pattern (one shared section, two responsive title variants) rather than duplicating the whole hero.
- **Meta block** (`DesktopLocationMeta` in `components/sections/location-detail-page.tsx`): dates/venue + the "Join Waitlist"-style pill CTA (`content.primaryAction`) + intro paragraph, capped to a `48rem` (768px-equivalent) column. No city heading here — that lives in the hero overlay instead, matching the Figma composition.
- **Features** (`DesktopLocationFeatures`/`DesktopFeatureRow`): two-column alternating rows built from `content.features` (same CMS field as mobile, currently empty for New York). Row order alternates copy-left/image-right, image-left/copy-right, copy-left/image-right, per the Figma reference — implemented as `index % 2` on a `grid-cols-2` row with CSS `order`, not a fixed 3-row layout, so it generalizes to any feature count.
- **Schedule / Ticket Info / Important Information** (`DesktopLocationSchedule`, `DesktopLocationTicketInfo`, `DesktopLocationImportantInformation`): each is a two-column row — display heading left, content right — built from the same `content.schedule`/`content.ticketInfo`/`content.importantInformation` shapes the mobile version already uses. No CMS schema, query, or type changes were made; `LocationDetailPageContent` already covered every field the desktop layout needed.
- Container: `mx-auto max-w-[105rem] px-desktop-gutter`, the same tokens already used by the Locations index and Challenges desktop work (1680px reference minus 2×62px gutters = 1556px content width, matching the Figma frame's own content column).
- Typography/spacing use plain literal Tailwind values matching the 1680px Figma measurements directly (`text-[4.6875rem]` for 75px headings, `text-[1.5rem]` for 24px body, etc.) rather than new fluid `clamp()` tokens — this matches the established convention in `how-it-works-accordion-section.tsx` and `challenges-page-section.tsx` (fixed sizes, fluid only via the flexible grid/container), not the Locations-index page (which is the one exception that added `clamp()` tokens for its variable-height sticky layout).

## Anchor scroll fix

The desktop tree renders a second copy of the ticket-info/volunteer sections, so `id="ticket-info"`/`id="volunteer"` exist twice in the DOM (once per breakpoint tree; only one is ever visible). A native `href="#ticket-info"` would always resolve to the first (mobile) match, which is invisible/zero-height at desktop. `components/ui/anchor-scroll-link.tsx` is a small client component used only on the CMS-driven action links that point at these anchors (`primaryAction`, ticket release actions, the volunteer action) — on click it finds whichever same-id node is actually rendered (`getClientRects().length > 0`) and scrolls to that one instead. Mobile markup and ids were not touched.

## Coming Soon desktop (placeholder — no Figma frame)

The other 13 cities render `LocationComingSoon` instead of the full template. There is no dedicated Figma frame for its desktop state. Per product decision, it got a minimal desktop-additive treatment reusing the same tokens as the Locations index desktop work (`location-city-desktop`, `location-meta-desktop`, `desktop-gutter`): city heading, date range, "Event details are coming soon.", "View All Locations" link, centered in a `min-h-dvh` column. **Replace this with a real layout once a Figma frame for the Coming Soon desktop state exists** — it was intentionally kept simple since nothing in Figma specifies it.

## Validation baseline

- Widths: 375, 480, 768, 1024, 1279, 1280, 1440, 1680px, for both a complete city (`/locations/new-york-city`) and a coming-soon city (e.g. `/locations/boston`).
- Required: no horizontal overflow (`document.documentElement.scrollWidth === clientWidth`), one Footer per route, mobile/tablet pixel-identical to before this change, nav still fades in over the hero at desktop (`data-nav-hero`/`data-nav-hero-boundary` + `data-location-hero`, unchanged), reduced-motion still swaps to the poster image, `#ticket-info`/`#volunteer` anchors scroll to the visible section at every breakpoint.
- Required commands: `npm run lint`, `npm run build`, `git diff --check`.
