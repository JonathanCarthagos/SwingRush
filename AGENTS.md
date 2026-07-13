<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project rules

- During the current home-page phase, do not attach Sanity live/visual editing globally in `app/layout.tsx`.
- Keep Sanity runtime integrations scoped to `locations` and `studio` until the team explicitly decides to expand CMS usage across the rest of the site.
- If full-site Sanity support is needed later, reintroduce it intentionally from this rule rather than by accident.
