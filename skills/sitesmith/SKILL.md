---
name: sitesmith
description: "Design, build, redesign, audit and polish websites and web apps that do not look AI-generated. Use for landing pages, marketing sites, product and e-commerce pages, SaaS sites, dashboards, web apps, local business sites, portfolios and editorial sites, and for improving existing React, Next.js, Astro, Vue, Tailwind, shadcn or plain HTML/CSS projects. Triggers on: build a website, make a landing page, design a page, redesign this, make it look better, fix the design, improve the UI, this looks generic, choose colours or fonts, pick a style, add animations, make it responsive, add dark mode, accessibility pass, hero section, pricing table, dashboard layout, product page, component styling, design system, design review, UI audit."
license: MIT
---

# sitesmith

A website is not done when the code compiles, and it is not done when the checks pass. The
checks are a floor. It is done when it has the fourteen things in
[v2/00-done.md](v2/00-done.md), and has been rendered, looked at, measured and corrected.

**Read [v2/](v2/README.md). That is the skill.** `references/` is the upstream material this
descends from, kept for attribution and not read during a build.

---

## 1. Route

Two questions, in this order.

**Which mode is this page?** Route per page, not per project — a shop's About page is
marketing and its order admin is product UI. One design system across all of them.

| Mode | The visitor is | Open |
| --- | --- | --- |
| **M** Marketing | Deciding whether to care. Company sites, services, launches, portfolios, editorial. | [v2/modes/marketing.md](v2/modes/marketing.md) |
| **E** E-commerce | Deciding whether to buy, and from whom. Listings, product pages, checkout. | [v2/modes/ecommerce.md](v2/modes/ecommerce.md) |
| **P** Product UI | Already committed, and now working. Dashboards, admin, forms, consoles. | [v2/modes/product-ui.md](v2/modes/product-ui.md) |

**Which task is this?**

| The situation | Task | Start at |
| --- | --- | --- |
| Empty directory, no frontend stack | **SETUP** | [references/10-setup.md](references/10-setup.md), then NEW |
| "Build a site / page / portfolio" | **NEW** | Step 1 below |
| Existing code, "redesign / make it better" | **REDESIGN** | [references/06-redesign-audit.md](references/06-redesign-audit.md) — audit before touching anything |
| "Build a pricing table / nav / hero" | **COMPONENT** | [blocks/](blocks/README.md) |
| "Review this UI / is it accessible?" | **AUDIT** | [v2/00-done.md](v2/00-done.md), then the mode file |

## 2. The build process

**1. Write `BRIEF.md`.** Business goal, primary action, audience, brand direction, sitemap,
content and asset plan, page inventory, and what done means for this project. Items 1 to 6 of
[v2/00-done.md](v2/00-done.md). If two readings of the request lead to materially different
sites, ask **one** question. Otherwise infer, write it down, and proceed.

**2. Inspect what exists.** Framework, styling system, tokens, component library,
`CLAUDE.md` / `AGENTS.md` / `README`, existing assets. An established stack is a decision
already made. Adopt it.

**3. Commit to a direction.** One line, out loud, before any colour: page kind, audience,
visual language, family. Then name the **visual signature** — the one thing a visitor would
recognise on a second page with the logo removed. "Clean and modern" is not a signature.

**4. Structure before style.** Section order per page, from the argument the mode file gives
you. What the eye hits first, second, third. A beautiful hero over no argument does not
convert.

**5. Write `DESIGN-SYSTEM.md`.** Derived from this brief, not copied from an example. Spacing
step and ramp, type scale, grid, colour, radius, elevation, motion, plus the header/footer
contract, the component inventory and the states. Format and worked example:
[v2/30-contract.md](v2/30-contract.md). Concrete starting points from data:

```bash
python scripts/search.py "<product type> <industry> <keywords>" --design-system -p "<Project>"
```

**6. Build from blocks.** [blocks/](blocks/README.md) carries the compositions with their
variants and compatibility metadata. Compose them; do not re-solve a header that already
exists.

**7. Implement fully.** Real content, real structure, semantic HTML. Every state from
[v2/10-core.md](v2/10-core.md) section F — six per control, three per page.

**8. Three widths.** 375, 768, 1440. Actually check.

**9. Both schemes, and a wider font.** A palette chosen against a dark ground routinely fails
on a light one. A layout that fits only under your system font is lucky, not responsive.

**10. Render it.**

```bash
node scripts/verify.mjs http://localhost:5173 --out .sitesmith/shots
node scripts/verify.mjs http://localhost:5173 --font-stress --no-axe
node scripts/token-drift.mjs "<pages>" --contract DESIGN-SYSTEM.md
```

**11. Look at the screenshots.** Open them. Squint: is something clearly first? Anything
cramped, orphaned, misaligned or floating? Does it look like a product or a demo? Fix, then
re-render.

**12. Walk the done list.** [v2/00-done.md](v2/00-done.md), all fourteen. Report what you
changed and what you could not.

## 3. Precedence

When two things disagree, the higher row wins.

1. **Accessibility and platform requirements** — contrast, touch targets, keyboard, reduced
   motion. Never overridden by aesthetics.
2. **The brief** — the client's context decides, not your preference.
3. **The mode file** — one answer for this context beats a general answer.
4. **v2 core** — the sixty.
5. **Aesthetic ambition** — commit hard to one direction.

`references/` does not appear in this list. It is provenance, not authority.

## 4. What to read

| File | When | Lines |
| --- | --- | --- |
| [v2/00-done.md](v2/00-done.md) | First, and again at step 12 | 229 |
| [v2/10-core.md](v2/10-core.md) | Once per build | 214 |
| [v2/modes/](v2/modes/README.md) | After routing — one file only | 3 files |
| [v2/30-contract.md](v2/30-contract.md) | Step 5 | 240 |
| [blocks/](blocks/README.md) | Step 6 | — |
| [references/06-redesign-audit.md](references/06-redesign-audit.md) | REDESIGN only | 208 |
| [references/10-setup.md](references/10-setup.md) | SETUP only | 99 |
| [references/](references/README.md) | Provenance. Not during a build. | 47 files |

Sixty core rules plus one mode file is what you hold while working. That is the constraint.

## 5. Anti-slop is judgement, not a ban list

The recognisable patterns — purple gradients, blurred orbs, glassmorphism everywhere, bento
grids by default, three equal feature cards, pill shapes on everything, decorative icons,
huge type over thin content, centred heroes regardless of sector, animation on everything —
are **defaults reached for without a reason**. Each is correct when the brand, the content or
the function asks for it.

**A brand colour is never slop.** The tell is not the hue; it is a gradient chosen because no
decision was made.

Hard tells with no legitimate use, and the only things here stated as absolutes: fabricated
testimonials, invented customer logos, made-up metrics, fake prices, Lorem Ipsum, "John Doe",
"Acme Corp", "Unlock your potential".

The final question, every time: **would a designer look at this and say a machine made it?**

## 6. Scripts

| Script | Purpose | Needs |
| --- | --- | --- |
| `scripts/search.py` | 161 palettes, 73 font pairings, 84 styles, 161 product types, 99 UX rules | Python 3.10+ |
| `scripts/verify.mjs` | Screenshots at 3 widths, axe in both schemes, links, console, overflow, `--font-stress` | Node 18+, `npx playwright install chromium` |
| `scripts/token-drift.mjs` | Values used that the contract never declared | Node 18+ |

All three are optional and the skill degrades without them, but never skip steps 10 and 11
just because a script is unavailable — open the page in a browser instead.

## 7. Attribution

sitesmith v1 was assembled from four openly licensed projects, credited in
[NOTICE.md](../../NOTICE.md): [taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT),
[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT),
[frontend-design](https://github.com/anthropics/claude-plugins-official) (Apache 2.0) and
[impeccable](https://github.com/pbakaus/impeccable) (Apache 2.0). Their material is in
[references/](references/README.md), and several v2 core rules descend from it.

`v2/`, `blocks/`, `references/06-redesign-audit.md`, `references/10-setup.md`,
`scripts/verify.mjs` and `scripts/token-drift.mjs` are original work, MIT. Full provenance:
[LICENSE-AUDIT.md](../../LICENSE-AUDIT.md).
