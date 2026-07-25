---
name: sitesmith
description: "Design, build, redesign, audit and polish websites and web apps that do not look AI-generated. Use for landing pages, marketing sites, product and e-commerce pages, SaaS sites, dashboards, web apps, local business sites, portfolios and editorial sites, and for improving existing React, Next.js, Astro, Vue, Tailwind, shadcn or plain HTML/CSS projects. Triggers on: build a website, make a landing page, design a page, redesign this, make it look better, fix the design, improve the UI, this looks generic, choose colours or fonts, pick a style, add animations, make it responsive, add dark mode, accessibility pass, hero section, pricing table, dashboard layout, product page, component styling, design system, design review, UI audit."
license: MIT
---

# sitesmith

A website is not done when the code compiles. It is done when it has been rendered, looked at,
measured, and corrected. This skill enforces that loop.

Nothing here fires automatically. Read the brief, then pull only what fits. A rule applied in the
wrong context is its own kind of slop.

---

## 1. Route before you build

First action, always. Pick one row. It decides which reference you open and which rules govern.

| The situation | Mode | Open first |
| --- | --- | --- |
| Empty directory, no frontend stack | **SETUP** → then NEW | [10-setup.md](references/10-setup.md) — optional, gated |
| "Build a landing page / site / portfolio" | **NEW** | Step 2 below |
| Existing code, "redesign / improve / make it better" | **REDESIGN** | [06-redesign-audit.md](references/06-redesign-audit.md) — audit before touching anything |
| "Build a pricing table / modal / nav" | **COMPONENT** | [09-block-library.md](references/09-block-library.md) |
| "Review this UI / is it accessible?" | **AUDIT** | [07-ux-rules.md](references/07-ux-rules.md) + [05-ai-tells.md](references/05-ai-tells.md) |
| Dashboard, data table, admin, multi-step product UI | **PRODUCT UI** | [07-ux-rules.md](references/07-ux-rules.md) is primary; dials are secondary |

Marketing pages and portfolios are governed by the dials. Product UI is governed by the UX rules.
Do not mix the two governance models — that is how a dashboard ends up with a cinematic hero and a
landing page ends up looking like a settings panel.

## 2. The build process

Twelve steps. Steps 10–12 are not optional when a browser is available. Skipping them is the single
biggest cause of work that looks fine in a diff and broken on screen.

**1. Understand the goal.** What is this page for, who reads it, what should they do next, and what
does the business actually sell? Extract brand, existing content, and the one action that matters.
If two readings of the brief lead to materially different pages, ask **one** question. Otherwise
infer and proceed.

**2. Inspect what exists.** Before writing anything: the framework, the styling system, the design
tokens, the component library, `CLAUDE.md` / `AGENTS.md` / `README`, and the existing assets. An
established stack is a decision already made. Adopt it.

**3. Commit to a direction.** State a one-line **design read** before any code:

> *"Reading this as: \<page kind> for \<audience>, with a \<vibe> language, leaning toward \<design
> system or aesthetic family>."*

Then set three dials — `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`. Baseline `8 / 6 / 4`.
Inference table and presets: [01-brief-and-dials.md](references/01-brief-and-dials.md).

**4. Structure before style.** Section order, what goes above the fold, what the eye hits first,
second, third. Sketch it as a list of blocks with a one-line purpose each. A page with a beautiful
hero and no argument underneath does not convert.

**5. Fix the system.** Type scale, one accent, neutral family, spacing step, grid, radius scale,
elevation scale, image treatment, motion budget. Write them as tokens, not as values scattered
through components. Concrete recommendations from data:

```bash
python scripts/search.py "<product type> <industry> <keywords>" --design-system -p "<Project>"
```

**6. Implement fully.** Real content, real structure, semantic HTML. No Lorem Ipsum, no invented
testimonials, no fabricated numbers. See [03-design-engineering.md](references/03-design-engineering.md).

**7. All states.** Rest, hover, focus-visible, active, disabled, loading — plus page-level empty,
error and partial. This is where most generated work stops and where finished work starts.

**8. Three widths.** 375, 768, 1440. Not "it uses flexbox so it's responsive". Actually check.

**9. Accessibility, performance, SEO, motion.** Contrast in both modes, keyboard path complete,
landmarks, `prefers-reduced-motion`, image dimensions declared, meta and OG tags present.

**10. Render it.** Start the dev server and take screenshots:

```bash
node scripts/verify.mjs http://localhost:5173 --out .sitesmith/shots
```

Captures 375/768/1440, collects console errors, checks every link, and runs an axe accessibility
scan. Requires `npx playwright install chromium` once.

**11. Look at the screenshots.** Actually open them. Ask: does the eye land where intended? Is
anything cramped, orphaned, misaligned, or floating? Does it look like a product or like a demo?
Fix what you see, then re-render.

**12. Final audit.** Walk [05-ai-tells.md](references/05-ai-tells.md) top to bottom, then the
checklists in [07-ux-rules.md](references/07-ux-rules.md). Report what you changed and what you
could not.

## 3. Precedence

When two references disagree, the higher row wins.

1. **Accessibility and platform requirements** — contrast, touch targets, keyboard, reduced motion.
   Never overridden by aesthetics.
2. **The brief and the dials** — the client's context decides the style, not your preference.
3. **Anti-slop** — the defaults in section 4.
4. **Aesthetic ambition** — commit hard to one direction.
5. **Everything else.**

Example: `07-ux-rules.md` recommends Lucide icons; `06-redesign-audit.md` warns that Lucide is the
default AI choice. Rule 2 settles it — a B2B dashboard takes the familiar set, an agency site does
not.

## 4. Anti-slop is judgement, not a ban list

These patterns are not forbidden. They are **defaults that get reached for without a reason**, which
is what makes generated work recognisable. Each one is fine when the brand, the content or the
function asks for it. Each one is slop when it appears because nothing else was considered.

| Pattern | Slop when | Legitimate when |
| --- | --- | --- |
| Purple/blue gradient | It is the accent because no palette was chosen | It **is** the brand colour, or the sector genuinely owns it |
| Gradient orbs, glow, mesh | Decorating an empty section | Carrying a real depth or focus hierarchy |
| Glassmorphism | Applied to every surface | A layer genuinely floats over content behind it |
| Bento grid | The default layout for any feature set | Cells carry genuinely different weights and sizes |
| Cards everywhere | Every block is boxed | The items are actually peers in a set |
| Pill shapes | On buttons, badges, inputs, tags, all at once | One consistent, deliberate radius language |
| Decorative icons | One per heading, meaning nothing | Carrying information or aiding scanning |
| Huge type, little content | Compensating for a thin page | The statement genuinely is the content |
| Centred hero | On every page regardless of sector | The message is singular and deserves the axis |
| Heavy animation | Everything moves on scroll | Motion explains a relationship or a state change |

**A brand colour is never slop.** Purple, teal, orange — if it comes from the client's identity, it
stays. The tell is not the hue; it is a gradient chosen because no decision was made.

Hard tells with no legitimate use — fabricated testimonials, invented customer logos, made-up
metrics, fake prices, "Unlock your potential", "Elevate your workflow", Lorem Ipsum, "John Doe",
"Acme Corp". Full list: [05-ai-tells.md](references/05-ai-tells.md).

The final question, every time: **would a designer look at this and say a machine made it?** If yes,
find which row above caused it.

## 5. Non-negotiable minimums

Independent of style, budget or brief. Failing any of these is unfinished work.

- A visual direction that fits **this** industry — six different briefs must not produce six
  variations of one template.
- Readable hierarchy: measure under ~75 characters, deliberate scale, one clear primary action.
- Works at 375, 768 and 1440. No horizontal scroll on mobile, ever.
- Semantic HTML, complete keyboard path, visible `:focus-visible`, WCAG AA contrast in both modes.
- `prefers-reduced-motion` honoured.
- Zero console errors, zero dead `href="#"` links.
- No fabricated facts, and no placeholder text presented as a claim.
- Components reused where they repeat, and not abstracted where they do not.
- The existing framework, codebase and design system respected.

## 6. Reference map

Open only what the current step needs. Do not preload.

| File | Open when | Lines |
| --- | --- | --- |
| [01-brief-and-dials.md](references/01-brief-and-dials.md) | Step 3 — direction, dials, choosing a real design system | 192 |
| [02-architecture.md](references/02-architecture.md) | Step 2/5 — stack conventions, RSC safety, fonts | 45 |
| [03-design-engineering.md](references/03-design-engineering.md) | Step 5/6 — type, colour, layout, materiality, content density | 214 |
| [04-motion-and-performance.md](references/04-motion-and-performance.md) | Step 6/9 — motion skeletons, forbidden animations, CWV budgets | 223 |
| [05-ai-tells.md](references/05-ai-tells.md) | Step 12 — the full tell list, plus aesthetic ambition | 174 |
| [06-redesign-audit.md](references/06-redesign-audit.md) | REDESIGN mode — 8 passes, repair order, scoring rubric | 208 |
| [07-ux-rules.md](references/07-ux-rules.md) | PRODUCT UI, and step 9/12 — a11y, forms, nav, charts, checklists | 393 |
| [08-pattern-vocabulary.md](references/08-pattern-vocabulary.md) | Step 4 — names for hero paradigms, grids, scroll effects | 84 |
| [09-block-library.md](references/09-block-library.md) | COMPONENT mode — concrete block implementations | 411 |
| [10-setup.md](references/10-setup.md) | SETUP mode only — gated, skipped by default | 99 |
| [11-search-engine.md](references/11-search-engine.md) | Step 5 — how to query the palette/font/style data | 289 |
| [impeccable/](references/impeccable/) | On demand — one file per command verb | 35 files |

Every file above is one hop from here. None of them requires reading another to be useful.

## 7. Commands

A shared vocabulary for what should happen. Each maps to a file in
[references/impeccable/](references/impeccable/).

`polish` raise quality without changing direction · `audit` find problems, fix nothing yet ·
`critique` reasoned design criticism · `distill` remove everything unnecessary · `bolder` / `quieter`
move the aesthetic up or down · `typeset` / `colorize` / `layout` / `animate` work one layer at a
time · `harden` / `optimize` robustness and performance.

## 8. Scripts

| Script | Purpose | Needs |
| --- | --- | --- |
| `scripts/search.py` | Query 161 palettes, 57 font pairings, 50+ styles, 161 product types, 99 UX rules | Python 3.10+ |
| `scripts/verify.mjs` | Screenshots at 3 widths, console errors, broken links, axe scan | Node 18+, `npx playwright install chromium` |

Both are optional. The skill degrades gracefully without them: without `search.py` you choose the
system by hand from `01-brief-and-dials.md`; without `verify.mjs` steps 10–11 become a manual
browser check. Never skip steps 10–11 entirely just because the script is unavailable.

## 9. Attribution

Built from four openly licensed sources, reproduced without modification and credited in
[NOTICE.md](../../NOTICE.md): [taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT),
[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT),
[frontend-design](https://github.com/anthropics/claude-plugins-official) (Apache 2.0) and
[impeccable](https://github.com/pbakaus/impeccable) (Apache 2.0).

`SKILL.md`, `06-redesign-audit.md`, `10-setup.md` and `scripts/verify.mjs` are original work, MIT.
Full reasoning in [LICENSE-AUDIT.md](../../LICENSE-AUDIT.md).
