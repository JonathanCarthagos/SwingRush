<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project rules

- During the current home-page phase, do not attach Sanity live/visual editing globally in `app/layout.tsx`.
- Keep Sanity runtime integrations scoped to `locations` and `studio` until the team explicitly decides to expand CMS usage across the rest of the site.
- If full-site Sanity support is needed later, reintroduce it intentionally from this rule rather than by accident.
- The Home mobile experience below 768px is client-approved and locked. Do not change its base styles, DOM structure, content, navigation/drawer behavior, or spacing without explicit client approval.
- Home responsive work must be additive: use tablet variants from 768px through 1279px and desktop variants from 1280px upward. Every Home change must include visual regression checks at 375px and 480px.
- Public-site breakpoints are global: mobile is below 768px, tablet is 768px through 1279px, and desktop begins at 1280px. Do not introduce page-specific desktop breakpoints.
- The existing How It Works mobile and tablet layouts below 1280px are locked. Desktop work on that page must be additive from 1280px upward unless the client explicitly approves a lower-breakpoint change.
- The existing Challenges accordion below 1280px is locked. Desktop navigation and content work must remain additive from 1280px upward unless the client explicitly approves a mobile or tablet change.
- The existing Locations layout below 1280px is locked. Desktop work on the Locations index must remain additive from 1280px upward unless the client explicitly approves a mobile or tablet change.
- On 2026-10-13 the client approved a tablet pass (768px through 1279px) on Home, Challenges, How It Works and Locations after reviewing an iPad in portrait and landscape. Tablet now uses its own compositions: Home cards alternate media and copy side by side, the Challenges accordion scales with the viewport, page and city heroes are capped by height in landscape, and waitlist columns are centred. Mobile below 768px stays locked, and further tablet changes still need explicit client approval.
- Above the 1680px Figma frame the whole site scales with the viewport: `app/globals.css` grows the root font size at 35% of the viewport's growth rate, so every rem scales up from the 1680px layout without blowing it up (client-approved 2026-10-13). Write new sizes in rem, or in vw/svh when they must follow the screen, so they take part in that scale; fixed px values stay at their 1680px size. Up to 1680px nothing changes.
