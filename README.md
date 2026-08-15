# ComptaZen — Frontend

Next.js 16 (App Router, Turbopack) marketing site for ComptaZen, implementing
the "Quiet Precision" visual direction: near-black background (with a full
light-theme counterpart), a single copper accent, Archivo + IBM Plex Sans /
Mono type pairing, and a GSAP-driven general-ledger table animation
(chaos → reconciled order, power4.out) as the homepage's signature moment.
(Switched from the initial "Calm Ledger" direction — see
`Three ledger design directions/` for the full 1a/1b/1c comparison.)

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **next-intl** for i18n — English (bare paths) and French (`/fr` prefix),
  see [Internationalization](#internationalization) below
- **next-themes** for the light/dark toggle — class-based, persisted,
  see [Light / dark theme](#light--dark-theme) below
- **Radix UI primitives** + a hand-built shadcn-style `Button` (the shadcn
  CLI's `init` step calls out to `ui.shadcn.com` and couldn't run in the
  build sandbox this was authored in — the resulting component is
  functionally identical, just written by hand instead of scaffolded)
- **GSAP** for the ledger hero animation
- **Motion** installed and ready for component-level micro-interactions
  (nav, future modals/drawers) — not yet used beyond what's in `nav.tsx`
- **next/font/google** (Archivo + IBM Plex Sans + IBM Plex Mono) —
  self-hosted automatically by Next.js at build time

## Pages

`/` `/services` `/how-it-works` `/about` `/contact` — each also available
under `/fr/...` (e.g. `/fr/services`).

## Internationalization

Routing is handled by `next-intl` with a `src/app/[locale]/` segment
(config in `src/i18n/routing.ts`, `navigation.ts`, `request.ts`,
middleware in `src/proxy.ts`). English is the default locale and keeps
bare paths (`/services`); French gets a `/fr` prefix (`/fr/services`) —
this was chosen specifically so already-shared English URLs don't change.

All copy lives in `messages/en.json` and `messages/fr.json` (same key
structure in both — verified structurally identical). Structural-only
data (nav link order, service slugs, etc.) stays in `src/lib/site-data.ts`
and is looked up by key at render time via `useTranslations` (client) /
`getTranslations` (server). The nav's EN/FR switch
(`src/components/nav.tsx`) swaps the locale while staying on the same
page.

Every route is statically prerendered for both locales at build time —
each page/layout calls `setRequestLocale(locale)` before rendering
(required by next-intl alongside `generateStaticParams` for static
output rather than per-request dynamic rendering).

To add a new locale: add it to `locales` in `src/i18n/routing.ts`, add a
matching `messages/<locale>.json`, done.

## Light / dark theme

Toggle in the nav (`src/components/theme-toggle.tsx`), backed by
`next-themes` (`src/components/theme-provider.tsx`, class-based —
`.dark` / `.light` on `<html>`, `attribute="class"`). Defaults to dark
and persists the user's choice.

All colors are CSS custom properties (`--color-*`) defined once in
`src/app/globals.css` under `.dark` and `.light` blocks; every component
reads `var(--color-*)` rather than hardcoded hex, so the whole site
retheme automatically follows the class on `<html>`. The light theme's
accent color (`#935a2e`) was chosen to keep ~5:1 WCAG contrast against
the light background (deepened from the dark theme's `#c97a46`, which
wouldn't pass contrast on a light surface).

## Before this goes live

1. **Contact form has no backend yet.** `src/components/contact-form.tsx`
   currently simulates a successful submit client-side. Wire it to a real
   handler — an API route that emails/stores the lead, or a form service
   (Formspree, Resend, etc.) — before launch.
2. **About page needs the founder's real name and bio** — currently a
   placeholder in both `messages/en.json` and `messages/fr.json`.
3. **Verify the Revenu Québec authorized-representative question** before
   the Quebec GST/QST service copy implies more than "calculation, tracking,
   and archiving" — flagged inline in `messages/en.json` / `fr.json` under
   the `quebec-gst-qst-compliance` service entry.
4. **Google Fonts couldn't be fetched in this build sandbox** (network
   proxy blocks `fonts.googleapis.com` here, but allows the npm registry).
   This is sandbox-specific — a normal `next build` on Vercel, in Docker
   on a normal machine, or in CI with unrestricted egress fetches
   Archivo/IBM Plex with no issue. If a build ever fails on font-fetching
   in some other restricted environment, swap to `next/font/local` with
   downloaded font files.

## Local development

```bash
npm install
npm run dev
```

## Run with Docker

```bash
docker compose up --build
```

Serves the production build at http://localhost:3002 (host port 3002 → container port 3000; change the left side of the `ports:` mapping in `docker-compose.yml` if you need a different host port). `docker-compose.yml`
builds the multi-stage `Dockerfile` (deps → build → minimal non-root
runtime, using `output: "standalone"` in `next.config.ts` so the final
image doesn't need `node_modules`). Rebuild after dependency changes with
`docker compose build`; run detached with `docker compose up -d --build`.

Note: this was authored and syntax/config-validated in a sandbox with no
route to Docker Hub (`docker pull` itself was blocked — a sandbox network
restriction, same category as the Google Fonts issue above), so the image
build itself couldn't be run end-to-end here. What *was* verified in this
sandbox: `docker compose config` parses cleanly, `npm ci` installs from
the committed lockfile with no drift, `next build` with `output:
"standalone"` produces a working `.next/standalone/server.js` with all
locale routes prerendered statically, and running that server.js directly
(with `public/` and `.next/static/` copied in, exactly as the
Dockerfile's runner stage does) serves both `/en` and `/fr` variants of
all five routes with 200s. The only untested step is the
`FROM node:22-alpine` image pull itself, which needs a normal Docker Hub
connection — should build cleanly on your machine or in CI.

## Deploy

Designed to deploy on Vercel with zero configuration — connect the repo (or
run `vercel` from this directory) and it builds out of the box. The
Dockerfile above is an alternative for self-hosting (a VPS, Kubernetes,
Fly.io, Railway, etc.) instead of Vercel.
