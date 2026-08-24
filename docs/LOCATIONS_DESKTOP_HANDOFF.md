# Locations desktop handoff

## Reference

- Figma file: `98BC7yEVdl4GKwe66XBvv1`
- Locations frame: `1764:6681`
- Pixel-perfect reference viewport: `1680px`
- Global desktop breakpoint: `1280px`

## Responsive contract

- Mobile below `768px` is locked.
- Tablet from `768px` through `1279px` is locked.
- The desktop composition is additive from `1280px` upward.
- Desktop values interpolate fluidly from `1280px` to the `1680px` Figma frame.

## Desktop composition

- The black content area uses `62px` gutters in the base frame.
- Content starts at `y=174px`, below the fixed `96px` Navbar.
- The grid uses a `749px` left column, `169.97px` gap, and `637px` right column at `1680px`.
- The left title and introduction use native CSS sticky positioning. They remain inside the black section and stop before the global Footer.
- The right column renders every published Location in CMS order. Its natural height determines where the Footer begins.
- With the 14 reference Locations, the black area is approximately `2497px` high and the global Footer remains `739px` high.

## Type and row measurements

- Page title: `100px / 84.502px` at `1680px`.
- Introduction: `30px / 1.3`, tracking `0.03em`, with a `24px` gap below the title.
- City: `75px / 78.717px`.
- Date and CTA: `24px / 1.3`, tracking `0.03em`.
- List divider: `1.874px` white.
- Row padding: `18.742px`; title/meta gap: `7.497px`.

## Data and shared components

- `locationsPage` remains the singleton source for title, introduction, empty state, and SEO.
- The `location` collection remains the source for city, dates, CTA, slug, and `sortOrder`.
- Each row links to its existing `/locations/[slug]` route.
- Navbar and Footer remain global shared components; the Locations desktop Navbar is red from the initial viewport.
- Sanity Live remains scoped to the existing `locations` layout.
