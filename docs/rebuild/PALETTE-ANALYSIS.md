---
title: Palette corpus — measured analysis
state: S1_SOURCE_RESOLUTION
status: complete
source: docs/rebuild/PALETTE-CORPUS.json
tool: tools/palette-analyse.mjs
ai_generated: "(C)"
---

# Palette corpus — what the numbers say

Eight three-colour palettes from Magnus's screenshots. The screenshots' colour
*names* were inconsistent, so they were discarded; the hex values are the source of
truth. Everything below is produced by `node tools/palette-analyse.mjs`, so it is
reproducible and falsifiable.

| id | ground | surface | accent | best pair | AA body pairs | accent on ground | accent on surface | accent usable as text on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | `#012F25` | `#FAF2A0` | `#FC7D14` | 12.74 | 2 | 5.63 | 2.26 | ground only |
| P02 | `#2A0C1B` | `#FFE0EB` | `#BE2C55` | 14.67 | 2 | 3.15 | 4.65 | **surface** (large only on ground) |
| P03 | `#0C1433` | `#58D4F9` | `#36D2FF` | 10.49 | 2 | 10.16 | **1.03** | ground only |
| P04 | `#071317` | `#FFBD65` | `#02A0A0` | 11.41 | 2 | 5.87 | 1.95 | ground only |
| P05 | `#2F0F03` | `#FFDDAC` | `#FAAA48` | 13.60 | 2 | 9.16 | 1.48 | ground only |
| P06 | `#001619` | `#C7F8FE` | `#50E8F4` | 16.20 | 2 | 12.57 | 1.29 | ground only |
| P07 | `#4E0401` | `#FFFBF3` | `#E88C2B` | 15.16 | 2 | 6.12 | 2.48 | ground only |
| P08 | `#002B4C` | `#C0EBFF` | `#F59E71` | 11.43 | 2 | 6.91 | 1.65 | ground only |

Roles were assigned mechanically: with three colours, the darkest and lightest are
the two grounds and the remainder is the accent. No judgement enters that step.

## Four findings that change how these should be used

**1. Seven of eight are structurally dark-first.** In P01, P03–P08 the accent clears
4.5:1 against the dark ground and fails against the light surface — often badly
(P03 at 1.03, P05 at 1.48, P08 at 1.65). These are not "a dark and a light theme with
an accent". They are dark canvases with a light *material* on them. Used light-first,
the accent can only ever be a fill, never a word. Only P02 inverts: its accent reads
as body text on the light surface and only as large text on the dark ground.

**2. P03 is really a two-colour palette.** `#36D2FF` and `#58D4F9` sit at 1.03:1 —
indistinguishable to the contrast algorithm and nearly so to the eye. Treating them
as two roles produces a design with one ground and one enormous cyan field. Either
drop one, or introduce a third value; do not pretend it is a triad.

**3. Every palette has exactly two AA-body pairs, and they are always ground↔surface
plus one accent pair.** So in every case the type system is forced: body text lives on
the ground/surface axis, and the accent is a punctuation colour. Any design that tries
to set paragraphs in the accent will fail accessibility in seven of eight palettes.
That is a useful constraint to hand the model, not a reason to reject the palettes.

**4. Warm-accent-on-dark dominates.** P01, P04, P05, P07, P08 are all
dark ground + warm accent (orange/amber/coral). If the corpus is retrieved without a
brief-fit filter, it will push everything toward the same amber-on-near-black look —
which is precisely the failure mode already measured in `gallery/showcase.json`
(three sites, one style, `portfolioDiversity: fail`). **The corpus is a house-style
risk, not just an inspiration source.**

## Where each is and is not appropriate

| Palette | Reads as | Fits | Fights |
| --- | --- | --- | --- |
| P01 deep green / chartreuse / orange | botanical, fermented, agricultural | food, drink, growing, craft produce | finance, medical, anything asking to be trusted with money |
| P02 near-black plum / blush / raspberry | intimate, cosmetic, editorial | beauty, fashion editorial, hospitality | industrial, technical, high-density product UI |
| P03 navy / cyan | synthetic, screen-native, cold | dev tools, data, gaming, network products | anything material, tactile or handmade |
| P04 near-black / teal / apricot | clinical but warmed, laboratory | health tech, science-led product, precision services | soft lifestyle, nostalgia |
| P05 dark cocoa / amber / cream | baked, roasted, hospitable | coffee, bakery, leather, hospitality | technology, anything claiming to be new |
| P06 near-black teal / ice cyan | aquatic, cryogenic, high-clarity | marine, cooling, audio, clean-tech | warmth-led retail, family services |
| P07 oxblood / off-white / ochre | archival, printed, editorial | publishing, museum, wine, heritage retail | SaaS, dashboards, anything modern-first |
| P08 marine navy / pale sky / coral | coastal, civic, calm | travel, public sector, community, healthcare | luxury, nightlife, high-drama product launches |

Commerce note: P05, P07 and P08 hold up best as e-commerce grounds because their
surfaces are near-neutral, so product photography sits on them without a colour cast.
P03 and P06 tint everything placed on them and will fight real product images.

## How the corpus is allowed to be used

- **Retrieval only, gated by brief.** A palette may be surfaced when the subject,
  mood and mode make it the right answer — never as a starting default, never as a
  fallback, never as "here are eight options, pick one".
- **Seed, not output.** The model may take a palette as a *starting relationship*
  (dark ground, single warm accent, near-neutral surface) and derive its own values
  from the subject. Copying the hexes straight through is how eight briefs become one
  look.
- **Diversity is checked across builds.** If two consecutive builds land in the same
  region of this corpus, that is the house-style signal, and the second one has to
  justify itself or move.
- **The measured constraints travel with the palette.** When one is surfaced, the
  accent's usable contrast pairs go with it, so the model is not left to discover at
  verification time that its accent cannot hold text.

Recorded in the context graph as `Asset:palette-corpus` with an `INSPIRES` edge and an
explicit `Risk:palette-monoculture`.
