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

The order is the design. **Evidence, then direction, then contract** — tokens fixed before a
direction is chosen is how nine different subjects converge on one look, and that is measured,
not asserted: [docs/v2/LEGACY-VISUAL-AUDIT.md](../../docs/v2/LEGACY-VISUAL-AUDIT.md).

**1. Write `BRIEF.md`.** Business goal, primary action, audience, sitemap, page inventory, and
what done means here. Items 1 to 6 of [v2/00-done.md](v2/00-done.md). If two readings lead to
materially different sites, ask **one** question. Otherwise infer, write it down, proceed.

**2. Inspect what exists.** Framework, styling system, tokens, component library,
`CLAUDE.md` / `AGENTS.md` / `README`, existing assets. An established stack is a decision
already made. Adopt it.

**3. Write `EVIDENCE.md`.** [v2/05-evidence.md](v2/05-evidence.md). The subject's artefacts,
vocabulary, materials, colours that are already true, constraints, references and
anti-references, and what assets actually exist. Research, not design — nothing here picks a
colour. A direction that could have been reached without this file did not need it.

**4. Start `ASSET-MANIFEST.md`.** [v2/25-assets.md](v2/25-assets.md). Every non-text thing the
site needs, including the logo and the favicon, each `ready`, `needed` or `substitute`.

**5. Run the direction lab.** [v2/20-direction-lab.md](v2/20-direction-lab.md). Three comps
that are *structurally* different, one chosen with reasons, two recorded with the reason they
lost. Starting points, three at a time and deliberately contrasting:

```bash
python scripts/search.py "<subject> <trade> <what it is made of>" --candidates -p "<Project>"
node scripts/direction-check.mjs directions/
```

**6. Write `DESIGN-SYSTEM.md` from the winning comp.** [v2/30-contract.md](v2/30-contract.md).
The ground, the type, the rhythm and the edge come from the comp that won; the contract writes
them down so the second page knows them. Not the other way round.

**7. Write `INTERACTIONS.md`.** [v2/40-interaction.md](v2/40-interaction.md). Primary actions
and what observably happens, the states per surface and how each is reached, keyboard and
focus. A state with no way in is deleted or wired.

**8. Structure before style.** Section order per page, from the argument the mode file gives
you. What the eye hits first, second, third.

**9. Build.** [blocks/](blocks/README.md) supplies structure, semantics, states and responsive
behaviour — never the look. Real content, semantic HTML, every state from
[v2/10-core.md](v2/10-core.md) section F. Three widths: 375, 768, 1440.

**10. Wire the journeys.** At least one per surface, driving the real page and asserting what
changed. `journeys/*.spec.mjs`.

**11. Technical gate.** Does it work.

```bash
node scripts/verify.mjs http://localhost:5173 --out .sitesmith/shots
node scripts/verify.mjs http://localhost:5173 --font-stress --no-axe
node scripts/token-drift.mjs "<pages>" --contract DESIGN-SYSTEM.md
node scripts/journey.mjs journeys/ --base http://localhost:5173
node scripts/production-gate.mjs "<pages>" --manifest ASSET-MANIFEST.md --production
```

**12. Visual critique gate.** [v2/50-critique.md](v2/50-critique.md). Separate, and only once
step 11 is green — a broken layout cannot be assessed for art direction. Open the screenshots.
Squint. Then the rubric: direction, specificity, type, colour, assets, hierarchy,
production-readiness. If the main criticism is "looks like a generic AI template", it fails
whatever the scores say.

**13. Walk the done list.** [v2/00-done.md](v2/00-done.md), all fourteen. Report what you
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

| File | When |
| --- | --- |
| [v2/00-done.md](v2/00-done.md) | First, and again at step 13 |
| [v2/05-evidence.md](v2/05-evidence.md) | Step 3 |
| [v2/10-core.md](v2/10-core.md) | Once per build |
| [v2/modes/](v2/modes/README.md) | After routing — one file only |
| [v2/20-direction-lab.md](v2/20-direction-lab.md) | Step 5 |
| [v2/25-assets.md](v2/25-assets.md) | Step 4, and again at step 11 |
| [v2/30-contract.md](v2/30-contract.md) | Step 6 — after the direction is chosen, never before |
| [v2/40-interaction.md](v2/40-interaction.md) | Step 7 |
| [v2/50-critique.md](v2/50-critique.md) | Step 12 |
| [blocks/](blocks/README.md) | Step 9 |
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
| `scripts/search.py --candidates` | Three *contrasting* starting points with confidence, near-misses and repeat warnings | Python 3.10+ |
| `scripts/direction-check.mjs` | Are the three comps actually three directions | Node 18+, playwright optional |
| `scripts/verify.mjs` | Screenshots at 3 widths, axe in both schemes, links, console, overflow, `--font-stress` | Node 18+, `npx playwright install chromium` |
| `scripts/token-drift.mjs` | Values used that the contract never declared | Node 18+ |
| `scripts/journey.mjs` | Runs the interaction journeys | Node 18+, playwright |
| `scripts/production-gate.mjs` | Placeholders, unmanifested images, empty brand marks, missing journeys | Node 18+ |

The scripts are optional and the skill degrades without them, but never skip steps 11 and 12
because a script is unavailable — open the page in a browser and look instead.

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
