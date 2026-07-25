# Optional setup phase

> Original work, MIT. Written for sitesmith — not derived from any third-party skill.

**This phase is skipped by default.** Run it only when the target directory has no working frontend
stack. If a framework, a bundler or a styling system is already present, that decision is already
made — adopt it and move on to `01-brief-and-dials.md`.

## Contents

- [Decision gate](#decision-gate)
- [What a working stack means](#what-a-working-stack-means)
- [Scaffolding](#scaffolding)
- [Optional additions](#optional-additions)
- [Never do this](#never-do-this)

## Decision gate

Run these checks before proposing anything. Any single match means **skip this file entirely**.

```bash
ls package.json 2>/dev/null            # a Node project already exists
ls next.config.* nuxt.config.* vite.config.* astro.config.* 2>/dev/null
ls composer.json 2>/dev/null           # PHP/WordPress project
ls tailwind.config.* 2>/dev/null
ls index.html 2>/dev/null              # a static site already exists
```

Also read `CLAUDE.md`, `AGENTS.md` and `README.md` if present. A project that documents its stack
has chosen its stack.

If nothing matches, the directory is genuinely empty and setup is appropriate. Say so in one line
and state what you are about to install before you install it.

## What a working stack means

A stack is sufficient when all four are true. Do not add tooling beyond this without being asked.

1. Something renders HTML.
2. Styles are authored in one system, not three.
3. There is a dev server with hot reload.
4. There is a production build that emits static assets.

## Scaffolding

Match the scaffold to the brief, not to habit.

| The brief is | Scaffold | Command |
| --- | --- | --- |
| A marketing site, portfolio or landing page | Vite + React + Tailwind | `npm create vite@latest . -- --template react-ts` |
| A site that needs routing, SSR or SEO depth | Next.js | `npx create-next-app@latest .` |
| A content site, blog or documentation | Astro | `npm create astro@latest .` |
| One page, no framework needed | Plain HTML + CSS | Create `index.html` and `styles.css` by hand |
| A prototype to be pasted elsewhere | Single self-contained HTML file | No install at all |

Adding Tailwind to a Vite scaffold:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Tailwind v4 is configured through the Vite plugin and a single `@import "tailwindcss";` in your CSS
entry point. It does **not** use `tailwind.config.js` or a PostCSS plugin entry the way v3 did — if
you find yourself editing `postcss.config.js` for Tailwind v4, stop and check the version.

Verify the scaffold before writing any design code:

```bash
npm run dev     # must serve without errors
npm run build   # must complete without errors
```

A scaffold that does not build is not a scaffold.

## Optional additions

Add these only when the design read calls for them.

| Need | Package | Note |
| --- | --- | --- |
| Motion beyond CSS transitions | `motion` | Import from `motion/react`. The old `framer-motion` name still resolves but is legacy |
| Accessible unstyled primitives | `@radix-ui/react-*` | Install per primitive, not the whole set |
| Owned, editable components | `npx shadcn@latest init` | You own the output. Never ship it at default styling |
| Icons | `@phosphor-icons/react` or `lucide-react` | One family only. Decide once |

Every one of these is a dependency you are asking someone to maintain. If CSS can do it, use CSS.

## Never do this

- **Never install a framework into a project that has one.** Migrating stacks is a separate project
  with its own budget and risk. It is not a side effect of a design task.
- **Never add a second styling system.** Tailwind beside styled-components beside CSS modules is
  how a codebase becomes unmaintainable.
- **Never add a global state library** to build a static page.
- **Never install a paid or key-gated service** as part of setup. If a component source or asset
  API needs an account, name it as an option and let the user decide. Do not ask for, store, or
  write API keys into config on the user's behalf.
- **Never leave the scaffold's placeholder content** in the delivered result — the default logo, the
  starter copy, the example route.
