---
title: React with Vite, no framework routing
read: at run order step 3, after stack detection, before the first file is written
---

**Tokens live in one stylesheet imported once from the entry module**, the file that
calls `createRoot`, above every component import. A token block inside a CSS module gets
its class name hashed and its properties scoped to the element that class lands on, so a
component above it cannot read them. In dev, Vite injects each imported stylesheet as its
own tag in import order; the build concatenates them. An order that looks right while you
work can invert once built.

**Read the CSS strategy off the project instead of choosing one.** A `tailwind.config`
file or an `@import "tailwindcss"` line means Tailwind, and tokens belong in its theme
layer. Any `*.module.css` means CSS modules, and every new file follows that name.
Neither means plain stylesheets. Never add a second strategy alongside the first.

**There is no routing.** `index.html` at the project root is the real entry, not a
template and never something to move into `public/`. It loads one module that mounts into
one element. If the plan needs a second route, check `package.json` for a router already
installed; if there is none, say so in the report rather than installing one uninvited.

**Fonts are self-hosted files imported through the bundler and preloaded from the head of
`index.html`.** A face reached by `@import` inside a component stylesheet is discovered
only after the module graph loads, and that is the layout shift. Files under `public/`
ship unhashed, so a cached copy goes stale silently.

**Verify needs `npm run dev`, port 5173.** Vite takes 5174 when 5173 is busy, and a
render run pointed at 5173 then captures whatever else is there. Read the port off the
startup output every time. Anything only the build changes needs `npm run build` then
`npm run preview` on 4173 before the matrix counts.

**Recorded here.** Tailwind's content globs skip extensions they do not list, so classes
vanish in the build while dev stays correct. StrictMode mounts twice in dev only, so an
effect that measures the DOM reports doubled values that preview will not show. An asset
referenced as a bare string path rather than an import is never copied into `dist` and
404s only after deploy.
