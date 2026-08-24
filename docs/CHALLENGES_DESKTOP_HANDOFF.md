# Challenges desktop handoff

## Reference

- Full desktop page: Figma node `1760:6323` at 1680 px.
- Mobile and tablet below 1280 px keep the approved split-flap accordion.
- Desktop uses a split-flap tablist with one active challenge panel in the right column.

## Responsive contract

- Mobile: below 768 px.
- Tablet: 768–1279 px.
- Desktop: 1280 px and above.
- Desktop changes are additive and must not alter the existing accordion branch.

## Desktop behavior

- Navbar is brand red from the top of `/challenges` on desktop only.
- Header uses 62 px gutters, a 100 px display heading and 30 px introduction at the 1680 px frame.
- Split-flap tabs and the active panel share the same top alignment. The board animates once on entry and does not restart when the active challenge changes.
- Clicking a row swaps the lateral panel without scrolling or changing the URL. Pointer changes use a short directional transition; keyboard changes are immediate.
- Published CMS images are rendered in the Figma media frame. Missing CMS images use the same local fallback already used by mobile and tablet.
- The global Footer is inherited from `app/(site)/layout.tsx`.

## Validation baseline

- Widths: 375, 480, 768, 1024, 1279, 1280, 1440 and 1680 px.
- Desktop heights: 768, 900 and 1080 px.
- Required: no horizontal overflow, one Footer, keyboard-visible focus, correct tab semantics, reduced-motion fallback and unchanged accordion below 1280 px.
- Required commands: `npm run lint`, production build and `git diff --check`.
