# SwingRush

Production-ready Next.js boilerplate for a premium 5-page marketing site with Sanity CMS, Framer Motion, and Resend-powered RSVP forms.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (mobile-first)
- **cva + clsx + tailwind-merge** (design system variants)
- **Framer Motion** (animations — ready to wire)
- **Sanity v3** (embedded Studio, Live Preview, Visual Editing)
- **Resend** (RSVP transactional emails)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in Sanity and Resend credentials in `.env.local`.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/studio](http://localhost:3000/studio) for Sanity Studio.

## Project Structure

```
app/                    # Pages, layouts, API routes
components/ui/          # Design system atoms (Button, Logo, etc.)
components/sections/    # Page-specific section organisms (Nav, Footer, etc.)
sanity/                 # Schemas, desk structure, Sanity client
lib/                    # Shared utilities (cn helper)
types/                  # Global TypeScript interfaces
```

## Componentization Status

| Component | Location | Status |
|---|---|---|
| `Nav` | `components/sections/nav.tsx` | ✅ Wired in `app/layout.tsx` — official global navbar |
| `Footer` | `components/sections/footer.tsx` | ⚠️ Built, not yet wired into any page |
| `Button` | `components/ui/button.tsx` | ✅ Design-system atom (cva variants) |
| `LogoLockup` / `LogoMark` | `components/ui/logo-*.tsx` | ✅ Design-system atoms |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/locations` | Locations index |
| `/locations/[slug]` | Dynamic city page (Sanity-driven) |
| `/challenges` | Challenges |
| `/how-it-works` | How it works |
| `/studio` | Embedded Sanity Studio |
| `POST /api/rsvp` | RSVP form handler |

## Sanity Setup

1. Create a Sanity project at [sanity.io](https://www.sanity.io).
2. Add your project ID and dataset to `.env.local`.
3. Create a read token with viewer permissions for Live Preview.
4. Add your local URL (`http://localhost:3000`) to Sanity CORS origins.

## RSVP API

Send a `POST` request to `/api/rsvp` with JSON:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "citySlug": "austin",
  "guestCount": 2,
  "message": "Looking forward to it!"
}
```

## Next Steps

Componentization has started with `Nav`, `Button`, and the logo atoms already extracted and following the `components/ui/` vs `components/sections/` convention. Next up: wire `Footer` into the layout, and continue mapping design tokens and full design system variants from Figma into `tailwind.config.ts` and `components/ui/`.
