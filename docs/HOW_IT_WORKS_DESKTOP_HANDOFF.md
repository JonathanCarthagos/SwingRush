# How It Works desktop handoff

## References

- Full desktop page: Figma node `1754:6111` at 1680 px.
- Hero reference: Figma node `1756:6321`.
- Product decision: the desktop Hero follows the approved Home Hero in height, video and centered composition (`100svh`), but displays only the “HOW IT WORKS” heading—without CTA or scroll cue.

## Responsive contract

- Mobile: below 768 px.
- Tablet: 768–1279 px.
- Desktop: 1280 px and above.
- The existing mobile and tablet How It Works layouts are locked. Desktop changes are additive behind `min-width: 1280px`.

## Content and component ownership

- Navbar and Footer are shared components mounted by `app/(site)/layout.tsx`.
- The Footer has exactly one global instance for every public route.
- Mobile accordion and desktop editorial rows use the same `howItWorksPage` singleton content.
- No collection, schema, query or public component contract was added for this layout.
- The repeated desktop photo is a presentation asset exported from Figma and stored at `public/images/how-it-works-arena.jpg`.

## Desktop geometry at 1680 px

- Hero: `100svh`.
- Arena CTA: 600 px high.
- Editorial container: 1556 px content area with 62 px gutters.
- Introduction: 768 px wide, 30 px type, 1.3 line-height.
- Rows: 75 px display titles, 3:2 media, 28 px media/copy gap and 82 px between rows.
- Footer: shared desktop component, 739 px high.

## Validation baseline

- Responsive checks: 375, 480, 768, 1024, 1279, 1280, 1440 and 1680 px.
- Required: no horizontal overflow, one Footer per public route, drawer closes with Escape, accordion remains interactive below 1280 px, video is replaced by the poster under reduced motion.
- Required commands: `npm run lint`, `npm run build` and `git diff --check`.
