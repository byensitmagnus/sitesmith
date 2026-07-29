# v2 — what the reference set actually says, and where it disagrees with itself

Measured on `main` at f6f44b8 with `tools/extract-rules.py` and `tools/find-conflicts.py`.
This is the decision log the synthesis works from. Nothing here is opinion until the
**Resolution** column, which is.

## The shape of the problem

```
978 rules across 47 files

  forbids    735
  requires   185
  advises     58

  ratio forbids:requires = 4.0 : 1
```

Four prohibitions for every requirement. A model reading 978 rules of which three
quarters are bans has one dominant strategy available to it: **do less**. That is the
mechanism behind timid output, and it is not fixed by adding a rule that says "be bold".

The five heaviest files carry 428 of the 978:

| File | Rules | What it is |
| --- | ---: | --- |
| `07-ux-rules.md` | 111 | product UX, from ui-ux-pro-max |
| `impeccable/critique.md` | 89 | design criticism vocabulary |
| `impeccable/live.md` | 85 | live browser iteration |
| `03-design-engineering.md` | 81 | type, colour, layout, from taste-skill |
| `09-block-library.md` | 68 | a 68-item pre-flight checklist, and no blocks |

## Contradictions, with evidence

`tools/find-conflicts.py` groups rules by subject and flags a subject that carries both a
prohibition and a requirement across more than one file. It is a candidate finder with
real noise — it matches "corner" in "do not perfect one corner" — so every row below was
read and adjudicated by hand. Thirteen of fourteen subjects came back split.

### 1. Corner radius — direct contradiction

| Side | Source |
| --- | --- |
| One scale, everywhere | `03-design-engineering.md:81` — "SHAPE CONSISTENCY LOCK (mandatory): Pick ONE corner-radius scale for the page and stick to it." |
| One scale everywhere is a defect | `06-redesign-audit.md:89` — "Identical border-radius on every element → Tighter inside, softer outside." |

Both are shipped. `SKILL.md`'s precedence list puts them at the same level, so it cannot
settle this. **Resolution:** one radius *system*, not one radius *value* — a scale with a
stated inside/outside relationship. Both sources were reaching for that and neither said it.

### 2. Scope — the skill forbids three of its own benchmarks

`09-block-library.md:101-111` declares the skill **out of scope** for "Dashboards / dense
product UI / admin panels", "Data tables", and "Multi-step forms / wizards (this skill
won't make them better)".

`SKILL.md:28` routes exactly those to PRODUCT UI mode. Benchmarks 03, 07 and 09 are a
dashboard, a multi-step form and a data-entry grid.

**Resolution:** the out-of-scope list is taste-skill's, written when it was a
marketing-page skill. sitesmith deliberately took a wider remit and built the UX-rules
governance model for it. Delete the list; state the remit once, in `SKILL.md`, and let the
routing table be the only answer to "is this in scope".

### 3. Div-built product previews — banned, and present in benchmark 01

Banned in three places: `03-design-engineering.md:154`, `05-ai-tells.md:54`,
`05-ai-tells.md:84` — "Never build a fake product UI out of `<div>` rectangles to simulate
a screenshot", "NO div-based fake product UI in the hero (fake task list, fake terminal,
fake dashboard built from styled divs)".

`benchmarks/01-saas-landing/index.html` puts a `<figure class="artefact">` in the hero: five
`<div>` rows with `<time>` and `<span>`, rendering an incident timeline that does not exist.

It is milder than a faked browser chrome — semantic elements, labelled as an excerpt, no
simulated application furniture — but it is a div-built stand-in for a product in a hero,
and the rule as written does not distinguish the two. **Resolution:** the rule needs the
distinction it is missing. *Simulated application chrome is banned. A typeset excerpt of
real output is allowed and must be labelled as an excerpt.* Then 01 either complies or is
rebuilt against a rule that means something.

### 4. Em-dashes — an absolute rule with a 100% violation rate

`09-block-library.md:125` — "**ZERO em-dashes (—) anywhere on the page.** Headlines,
eyebrows, pills, body, quotes, attribution, captions, buttons, alt text. Zero.
(non-negotiable.)"

| Benchmark | `&mdash;` or `—` |
| --- | ---: |
| 01 saas-landing | 7 |
| 02 product-page | 6 |
| 03 dashboard | 17 |
| 04 local-service | 6 |
| 05 editorial | 13 |
| 06 redesign/after | 14 |
| 07 multistep-form | 5 |
| 08 documentation | 13 |
| 09 data-entry | 22 |
| **total** | **103** |

Nine of nine. **Resolution:** the rule is a typographic preference stated as a
non-negotiable, and it was never enforced, so it trained everyone — including this
repository — to treat non-negotiables as decorative. Either enforce it mechanically or
demote it to a preference. It cannot stay as it is.

### 5. Icons — hand-rolled SVG banned, used in all nine

`09-block-library.md:178` — "Icons from an allowed library only (Phosphor / HugeIcons /
Radix / Tabler), no hand-rolled SVG paths".

All nine benchmarks contain hand-authored `<path>` elements: 1 each in 01–06, 2 in 07 and
08, 6 in 09.

**Resolution:** the rule is right for icon *sets* and wrong for a single brand mark, which
is what eight of these are. Split it: icon sets come from a library; a brand mark may be
authored and must be the only authored SVG on the page.

### 6. The engine's fallback is the slop the skill exists to prevent

`scripts/design_system.py` falls back to, when no rule matches:

| Field | Fallback | Where the skill calls it a tell |
| --- | --- | --- |
| pattern | `Hero + Features + CTA` | `05-ai-tells.md` — the default section order |
| style | `Minimalism` / `Flat Design` | — |
| heading + body font | `Inter` | `09-block-library.md:180` — "No AI Tells (Inter as default, …)" |
| secondary | `#3B82F6` | `09-block-library.md:180` — AI-blue |
| accent | `#F97316` | — |

`design_system.py:97-99, 204-239, 678-679`. **Resolution:** a design engine that cannot find
a match must say so and ask, not emit the median of its training data. Remove the fallbacks;
return an explicit `no confident match` with the two nearest candidates and what
distinguishes them.

### 7. Split verdicts, since adjudicated

**Seven of the thirteen were real. Six were not.** The grouper classifies by verb, so a
contrast threshold reads as advice and a logo rule reads as a requirement, and a subject
lands in the split column without anything actually disagreeing. Each was read; the verdicts
and the reasons are in [DECISIONS.md](DECISIONS.md). Two of the seven turned out to be gaps
rather than contradictions — the one-accent lock has no notion of semantic status colour,
and nothing in the set permits a deliberate single-theme page.

The counts that produced the candidates:

| Subject | forbids | requires | files |
| --- | ---: | ---: | ---: |
| motion | 47 | 17 | 18 |
| fabricated content | 35 | 2 | 16 |
| images | 31 | 5 | 13 |
| typography | 26 | 4 | 14 |
| cards | 14 | 4 | 12 |
| icons | 14 | 3 | 8 |
| eyebrow | 11 | 2 | 3 |
| dark mode | 5 | 1 | 8 |
| accent colour | 2 | 1 | 4 |

`gradient` (15 forbids, 0 requires) and `cursor` (3 forbids, 0 requires) are not split —
they are simply bans with no stated legitimate use, which contradicts `SKILL.md:111`:
"Anti-slop is judgement, not a ban list… Each one is fine when the brand, the content or
the function asks for it."

## The other half of the audit

This file measures the rules. [TOKEN-DISCIPLINE.md](TOKEN-DISCIPLINE.md) measures the
output, and finds that not one of the eleven pages has a spacing scale or a type scale —
including the control, which scores no worse than the nine builds on either.

## Addendum, 2026-07-29 — the rules were written against marketing pages

Three new benchmarks were built from unrelated briefs: a tannery, a public seed library, and a
lock keeper's internal duty board. Between them they tripped **four** conformance rules. Three
of the four were the instrument, not the page, and all three failed the same way — the rule was
written with a marketing landing page in mind and misread anything else.

**§5 revised — `authored-svg`.** The resolution above says "a brand mark may be authored and
must be the only authored SVG on the page". That was right when a mark was the only legitimate
authored SVG. `24-asset-plan.md` now makes *drawn* a first-class asset strategy, and a build
with no image budget has drawing or nothing, so a planned diagram of nine seeds counted as 76
icons. The rule now ignores SVGs carrying `data-asset`. That is stricter than it looks: such an
SVG must also match a manifest row at `production-gate` and carry a written argument, a named
job and a source at `asset-plan`. A hand-rolled icon set has none of those and still fails.

**`theme-lock` — two faults, both instrument.** It read the HTML only, so a page that declared
its colour scheme in a linked stylesheet was reported as not saying which theme it meant. And
it required a single keyword, so `color-scheme: light dark` — the standard way to say "built
for both" — did not match. Linked same-directory stylesheets are read in now, which also makes
the rule's actual subject, a mid-page ground-and-ink inversion, visible for the first time,
because those rules live in CSS.

**`div-product-preview` — instrument.** The tell is a marketing hero containing a picture of
software assembled from inert divs. The check matched class names, so it failed a duty board
for calling its real top bar `chrome` — a bar with a working button that the page's own journey
drives. The two words carrying the rule are *div-built* and *fake*: the region must now be
inert to count. A fake product UI built of divs in a marketing hero still fails.

**The fourth was real.** 21 em-dashes on one page and 3 on another, which is the rule doing
exactly its job.

**What to take from this.** These rules were extracted from a reference set aimed at landing
pages, and the ratio noted below — 4:1 prohibitions to positives — is not the only cost of
that. A prohibition written against one page type will misfire on another, and it will misfire
*as a design criticism*, which is the expensive kind: the page looks wrong, the author changes
something that was right, and nobody learns the rule was inapplicable. Three of the four here
would have done that. Before adding any absolute, ask which page types it was written for and
what it does on the others.

## What this means for the rewrite

1. **The ratio is the target.** 4:1 against is why output is careful rather than good. The
   synthesised set should carry positive patterns — what a finished page *has* — and reach
   for a prohibition only where there is no legitimate use.
2. **One document owns each decision.** Radius, scope, images and motion currently have two
   or more owners. After the rewrite each has exactly one.
3. **A rule that is not enforced is not a rule.** 103 em-dashes and nine hand-rolled SVGs
   passed a green CI. Every absolute in the synthesised set must be machine-checkable or
   demoted to a preference in the text.

## Reproduce

```bash
python tools/extract-rules.py            # the counts above
python tools/extract-rules.py --json     # the full inventory
python tools/find-conflicts.py           # the split table
python tools/find-conflicts.py radius scope images
```
