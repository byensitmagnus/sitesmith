---
title: Nordrig A/B forensics — why the frontend-design build won
state: S2_REPO_AUTOPSIES
status: complete
evidence: codex/v3-direction-head-to-head @ bb4be56, docs/v3/proof/product-e2e/nordrig/
ai_generated: "(C)"
---

# Why build A won and build B lost

Two complete static sites, same brief, same `CONTENT.md`, same facts, same prices,
same cart key, same asset pack, both static HTML/CSS/vanilla JS. One was built to
frontend-design's method, one to SiteSmith's. Magnus accepted the verdict:
A wins creatively, B loses, neither was production-ready
(`nordrig/ACCEPTED-VERDICT.md`).

Nobody had opened the two builds side by side and asked *what is different in the
code*. This is that read. It matters more than any score, because it is the only
place in the repo where the winning and losing method produced comparable artifacts
from identical inputs.

## The two methods, in their own words

`builds/A-frontend-design/BUILD-NOTES.md` states its method as:

- a subject-grounded thesis — **"Thermal Blueprint"** (engineering hangar, DWG sheets)
- a signature — blueprint grid paper, caution-orange purchase controls, mono part labels
- a display typeface choice — Syne over IBM Plex
- **one deliberate aesthetic risk** — light paper and construction-orange on a gaming-PC
  shop, explicitly *not* the dark RGB default

`builds/B-sitesmith/BUILD-NOTES.md` states its method as:

- mode split — home is marketing, listing and product are e-commerce
- the purchase path owns the accent colour
- prices in tabular mono
- sticky buy panel, mobile bottom bar
- trust strip with locked claims only
- no motion near money

Read those two lists again. **A's list is a design. B's list is a set of production
rules.** Not one item in B's list decides what the site looks like. Every item in A's
list does.

## Where it shows up in the code

### 1. Token names come from the concept, or from the framework

```css
/* A — site.css:1 */
--ink --paper --grid --steel --mute --caution --print --line
```

```css
/* B — site.css:1 */
--bg --surface --surface-2 --border --text --muted --accent
```

A's names are the vocabulary of a drawing office. Once a variable is called
`--caution`, every later decision about it is answered by the world: caution orange
goes on the thing you must not click by accident, which is the purchase control.
B's names are the vocabulary of any dark UI, so every later decision has to be made
again from nothing.

This is not cosmetic. The token layer is written before the components, so a
subject-grounded token layer steers every component that follows, and a generic one
steers nothing.

### 2. The signature costs nothing and is unmistakable

A renders the blueprint grid in CSS, in three lines, with no asset:

```css
background:
  linear-gradient(90deg, rgba(13,110,110,.04) 1px, transparent 1px) 0 0 / 24px 24px,
  linear-gradient(rgba(13,110,110,.04) 1px, transparent 1px) 0 0 / 24px 24px,
  var(--paper);
```

B has `background: var(--bg)`. B has no signature element at all.

### 3. A took a risk against its own category; B took the category default

A: `--paper: #f4f1e8` — a light, warm paper ground for a gaming-PC shop.
B: `--bg: #0f1218` with `--accent: #3dd6c6` — near-black with a teal accent.

B landed on exactly the arrangement the palette corpus measurement flags as the
monoculture risk: dark ground, one saturated accent, everything else neutral
(`docs/rebuild/PALETTE-ANALYSIS.md`, finding 4). B did not choose that. B defaulted
into it. A's build notes name the risk as a deliberate decision — *"one aesthetic
risk"* is a line item in its method.

### 4. Typography: an identity versus a stack

A loads Syne (display) + IBM Plex Sans + IBM Plex Mono, and uses `--font-display`
for headings. B loads IBM Plex Sans + Mono and has no display face. A's heading
voice is different from its body voice. B's is the same voice at a larger size.

### 5. The world leaks into the micro-copy

A labels its process section `PROC-03` and its catalogue `CAT-01`, numbers its steps
`01 02 03`, and puts an eyebrow above the h1 reading `Danmark · stationær gaming`.
B numbers its steps `1 2 3`, has no reference codes and no eyebrow.

Those codes are diegetic — they only make sense because the site is pretending to be
a drawing sheet. That is what "grounded in the subject" produces when it reaches the
copy layer, and it is invisible to any rule that says "write clear microcopy".

### 6. The hero right-hand column: information versus decoration

A puts a definition list there — Levering 3–7 hverdage, Garanti 2 år, Support
man–fre 10–16, Test 24 timer. It reads like a spec block on an engineering drawing,
which is on-concept, *and* it answers the four questions a buyer has.

B puts a placeholder product image there.

A's choice is both more useful and more distinctive, from the same content pool.

## What this actually proves

**Proven by the artifacts:** the winning build derived its colour names, typeface
roles, background texture, section labels and hero content from a single named
concept; the losing build derived them from page-category conventions. Both had the
same facts available.

**Not proven:** that a thesis step *causes* the win in general. n=1, one subject, one
pair of builds, and the same host model wrote both. What is proven is that the two
methods produce structurally different code, and that the difference is exactly where
the reviewers said the quality gap was.

**Also true, and easy to lose:** every rule in B's list is a good rule. "No motion
near money", "trust strip with locked claims only", "prices in tabular mono", "sticky
buy panel with a mobile bottom bar" — A has none of these, and A was also judged
not production-ready. B's rules are the reason B's *commerce* behaviour is sound.

## Consequence for the rebuild

The two lists are not competitors. They are two different layers that were never run
in the same build:

| Layer | Owned today by | What it decides |
| --- | --- | --- |
| Thesis | A's method | what this specific site *is* — concept, token vocabulary, signature, typographic identity, the one risk |
| Craft floor | B's method | what any site of this kind must do — purchase path, trust, states, motion discipline, accessibility, verification |

The failure of the old SiteSmith was not that its rules were wrong. It is that it
had **only** the craft floor, and a craft floor with no thesis converges — which is
exactly what `gallery/showcase.json` records as three sites, one style,
`portfolioDiversity: fail`.

So the unified skill must run thesis **before** craft floor, and the craft floor must
be written so it can be satisfied in many visual languages rather than one. A rule
that can only be satisfied one way is a house style with a compliance report attached.

Recorded in the graph as `mech:subject-world-thesis` (adopt) and
`mech:craft-floor-without-look` (adapt), with an `INSPIRES` edge from
`result:nordrig-ab`.
