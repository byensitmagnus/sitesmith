---
name: sitesmith
description: "Design, build, redesign, audit and polish websites and web apps that do not look AI-generated. Use for landing pages, marketing sites, product and e-commerce pages, SaaS sites, dashboards, web apps, local business sites, portfolios and editorial sites, and for improving existing React, Next.js, Astro, Vue, Tailwind, shadcn or plain HTML/CSS projects. Triggers on: build a website, make a landing page, design a page, redesign this, make it look better, fix the design, improve the UI, this looks generic, choose colours or fonts, pick a style, add animations, make it responsive, add dark mode, accessibility pass, hero section, pricing table, dashboard layout, product page, component styling, design system, design review, UI audit."
license: MIT
---

# sitesmith

A website is not done when the code compiles, and it is not done when the checks pass. The
checks are a floor. It is done when it has the fourteen things in
[v2/00-done.md](v2/00-done.md), and has been rendered, looked at, measured and corrected.

**Read [v2/](v2/README.md). That is the skill.** The pipeline it follows is declared once, in
[PIPELINE.json](PIPELINE.json) — which is also what the command vocabulary and the provider
packages are generated from. `references/` is the upstream material this descends from, kept
for attribution and not read during a build.

**Progressive disclosure is mandatory.** What is always in context is this file, the sixty
core rules, and one mode file. Everything else is read at its step and put down again. A
routine task must never pull the whole rule set or the 1.4 MB of data into context.

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

## 2. Three-command product loop

The ordinary journey is **`init → build → audit`**. The internal order still matters, but the
user should not have to operate nineteen implementation steps. The exact machine-readable
sequence lives in [PIPELINE.json](PIPELINE.json).

### `init` — decide what will be built

1. Write `BRIEF.md`, including the three justified 1–10 dials: visual density, motion
   intensity and aesthetic boldness.
2. Inspect the existing repository and run `scripts/stack-router.mjs detect . --write`. It
   selects one adapter; Next.js and Astro outrank their optional React dependency.
3. Write the evidence, brand and asset records. Plan what every picture carries before
   sourcing or generating it.
4. Build three structurally different comps. Pass the dials to candidate search, choose one
   with reasons, and write `DIRECTION.md`, `DESIGN-SYSTEM.md` and `INTERACTIONS.md` from it.

The order is **evidence → direction → contract**. A contract written before the direction is
the mechanism that made unrelated subjects converge on one house style.

```bash
python scripts/search.py "<subject> <trade>" --candidates \
  --density <1-10> --motion <1-10> --boldness <1-10>
node scripts/direction-check.mjs directions/
```

### `build` — make it work in the detected stack

Structure the argument, read only `.sitesmith/STACK.md` and its named adapter, implement every
state, and wire at least one journey per surface. The edit loop renders only the changed
surface:

```bash
node scripts/verify.mjs <changed-url> --out .sitesmith/shots/preview --no-axe
```

That explicit axe waiver is preview-only. It keeps a visual iteration cheap; it can never
produce a release verdict.

### `audit` — make one release decision

Run the canonical verification once, including axe, direction fidelity, token drift, journeys
and the production gate. Open the screenshots and write one specific critique. Then walk all
fourteen items in [v2/00-done.md](v2/00-done.md) and write `PRODUCTION-REPORT.md`, including
every failure.

```bash
node scripts/verify.mjs <url> --out .sitesmith/shots
node scripts/direction-fidelity.mjs DIRECTION.md <url>
node scripts/token-drift.mjs "<pages>" --contract DESIGN-SYSTEM.md
node scripts/journey.mjs journeys/ --base <url>
node scripts/production-gate.mjs "<pages>" --manifest ASSET-MANIFEST.md --production
```

`harden` reruns only the functional or production checks that failed. `polish` applies one
round driven by a specific screenshot criticism. `doctor` checks the installation. None is a
mandatory fourth phase.

Portfolio diversity, assignment-blinded reviews, sealed keys and container isolation belong
to the repository's benchmark lab. They run only for an explicit benchmark task, never while
building one customer website. They are mandatory before benchmark pages enter the public
showcase: an individual critique pass is necessary and insufficient. The boundary is recorded in
[RELEASE-MAP.md](../../docs/v2/RELEASE-MAP.md).

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

| File | When |
| --- | --- |
| [v2/00-done.md](v2/00-done.md) | First in `init`, and again at the end of `audit` |
| [v2/05-evidence.md](v2/05-evidence.md) | `init` — before direction work |
| [v2/10-core.md](v2/10-core.md) | Once per build |
| [v2/modes/](v2/modes/README.md) | After routing — one file only |
| [v2/20-direction-lab.md](v2/20-direction-lab.md) | `init` — after evidence, before the contract |
| [v2/24-asset-plan.md](v2/24-asset-plan.md) | `init` — before anything is sourced |
| [v2/25-assets.md](v2/25-assets.md) | `init`, and again during `audit` |
| [v2/30-contract.md](v2/30-contract.md) | `init` — after the direction is chosen, never before |
| [v2/40-interaction.md](v2/40-interaction.md) | End of `init`, then journeys in `build` |
| [v2/50-critique.md](v2/50-critique.md) | `audit`, after technical verification |
| [blocks/](blocks/README.md) | `build` |
| [references/06-redesign-audit.md](references/06-redesign-audit.md) | REDESIGN only |
| [references/](references/README.md) | Provenance. Not during a build. |

Sixty core rules plus one mode file is what you hold while working. The others are read at
their step and put down again. That is the constraint.

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
| `scripts/stack-router.mjs` | Detect Next.js, React/Vite or Astro and record one adapter | Node 18+ |
| `scripts/search.py --candidates` | Three contrasting starts shaped by visible dials, with repeat warnings | Python 3.10+ |
| `scripts/direction-check.mjs` | Are the three comps actually three directions | Node 18+, playwright optional |
| `scripts/verify.mjs` | Screenshots at 3 widths, axe in both schemes, links, console, overflow, `--font-stress` | Node 18+, `npx playwright install chromium` |
| `scripts/token-drift.mjs` | Values used that the contract never declared | Node 18+ |
| `scripts/journey.mjs` | Runs the interaction journeys | Node 18+, playwright |
| `scripts/production-gate.mjs` | Placeholders, unmanifested images, empty brand marks, missing journeys | Node 18+ |

The prose still works without the scripts, but an `audit` cannot pass until the canonical checks
have actually run. If a browser tool is unavailable, open the page manually and report that the
mechanical release verdict is missing.

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
