---
title: Next.js, App Router assumed
read: at run order step 3, after stack detection, before the first file is written
---

**Tokens live in one global stylesheet the root layout imports.** `app/globals.css`,
imported once in `app/layout.tsx`. A CSS module scopes its values to itself, so a Server
Component that renders without that module renders without the tokens. If Tailwind is
installed the tokens belong to its theme layer and classes reference them; two systems
naming the same value is drift you debug later.

**Routes are directories.** `app/<segment>/page.tsx` is a route and `layout.tsx` wraps
everything under it. Look for a `pages/` directory first: if the routes are there this is
the Pages Router, the wrapper is `_app.tsx`, the head is `next/head`, and nothing below
about layouts or metadata applies.

**Server is the default and a client boundary is a decision.** Put `"use client"` on the
leaf that needs state or an event handler, never on a layout. It is inherited, so a
layout marked client ships every route beneath it to the browser and its `metadata`
export is dropped with no error.

**Fonts come from `next/font`,** called at module scope in the layout and applied as a
class. It self-hosts the file and emits a metric-matched fallback. A `<link>` to a font
host skips both and buys a layout shift on first paint.

**Verify against `npx next dev` on http://localhost:3000.** Request every route once
before `verify.mjs` runs: dev compiles on first request, and an unwarmed capture is a
screenshot of the compiler. `next/image` only serves optimised bytes from a running
server, so the asset manifest records `/_next/image?url=` request URLs, not the paths
under `public/`.

**Failure modes recorded here.** A date, a random value or anything read off `window`
renders on the server and again on the client, mismatches, and React discards the server
HTML silently: the page looks right and the markup you inspected is gone. `next/image`
without `width` and `height`, or with `fill` inside a parent of no height, collapses to
nothing. A remote host missing from `images.remotePatterns` in `next.config` returns 400
for every image on the route. The dev server tolerates what `next build` refuses, so run
the build once before calling a page finished.
