---
title: The craft floor nobody read — marketing mode, redesign audit, setup
state: S2_REPO_AUTOPSIES
status: complete
scope: skills/sitesmith/v2/modes/marketing.md (194), v2/tasks/redesign-audit.md (208), v2/tasks/setup.md (99)
evidence: floor-lint run recorded below; NORDRIG-AB-FORENSICS.md; _architecture/RAW-ARCHITECTURE.json
ai_generated: "(C)"
---

# The craft floor nobody read

The first autopsy of this repository produced fifteen mechanisms and cited `PIPELINE.json`,
the scripts, the direction lab, the contract, the gates. It cited zero lines of `v2/modes/`
and zero lines of `v2/tasks/`. That is where the rules that actually reach the page live.
This is the correction for three of those files.

Read in full: `skills/sitesmith/v2/modes/marketing.md`,
`skills/sitesmith/v2/tasks/redesign-audit.md`, `skills/sitesmith/v2/tasks/setup.md`.

## The test applied to every rule

For each numbered rule: **can this be satisfied three visually unrelated ways?**

Yes, it is an obligation and belongs in a floor file. No, it is appearance wearing an
obligation's clothes and it gets named, line-cited and left behind. A rule true of every
page regardless of surface is neither, and goes to `SKILL.md` section 8.

---

## Finding 0: floor-lint cannot see the problem

Before any extraction, the gate that is supposed to police this layer was run against all
three files, copied unmodified into a `floor/` directory:

```
  FAIL .../floor/marketing.md
         no rendition section.
  FAIL .../floor/redesign-audit.md
         line 56: a type scale (type-scale) — letter-spacing
         line 67: a colour value (hex) — #000, #fff
         line 71: a colour value (colour-fn) — rgba(
         line 71: a shadow (shadow) — box-shadow
         line 89: a corner radius (radius) — border-radius
  FAIL .../floor/setup.md
         no rendition section.
```

**`marketing.md` passes the purity scan with zero problems.** Its only failure is the
missing rendition heading, which is a formatting check.

That file contains "a short fade-and-rise on first view, staggered by no more than three
elements" (l.122), "three places on a page, not thirty" (l.134), "Neutrals carry the page"
(l.136), and "One line at 1440, height ≤ 80px" (l.159). Four house-style rules, clean lint.

Meanwhile `redesign-audit.md` fails on five lines, and **four of those five are quotations
of a defect the file is telling you to remove.** Line 71 flags
`box-shadow: 0 4px 6px rgba(0,0,0,.1)` as "the default, instantly recognisable". The lint
punishes the file for naming the thing it forbids.

The lint's own comment states its model: appearance is "a value someone could copy into a
stylesheet" (`floor-lint.mjs:25-26`). That model is wrong about how round 8 converged.
NORDRIG records build B choosing `--bg: #0f1218` and `--accent: #3dd6c6`, values that appear
nowhere in any v2 file. B was not copying values. B was executing a **structure**: one
saturated accent used sparingly, neutrals carrying, soft-cornered cards, entrance motion.
That structure is prescribed in prose, in `marketing.md` sections 6 and 7, and prose passes.

**Consequence for the rebuild:** the purity scan is necessary and insufficient. It needs a
second class of ban covering prescribed devices, counts and characters, not just CSS values.
Concretely: a floor file may not name a motion character, an accent budget, a nav height, a
component to use instead of another component, or a word/paragraph count. Without that, a
rewritten `floor/*.md` can reproduce the round-8 recipe and ship green.

---

## File 1 — `v2/modes/marketing.md` (194 lines)

### The six-of-twelve claim, recounted

`_architecture/RAW-ARCHITECTURE.json:194` states the diagnosis that justified deleting this
file: "twelve numbered decisions and six of them are appearance (first-screen arrangement,
density, radius, imagery treatment, motion character ..., accent count ...)".

Two of those six quotations are verbatim and correct. Three are **stale**. Sections 2, 3 and
4 had already been rewritten into outcome form before this autopsy, and they now say the
opposite of what the diagnosis attributes to them:

| § | The diagnosis says | The file actually says |
| --- | --- | --- |
| 2 first screen | appearance: prescribes an arrangement | l.47-52 "**There is no default arrangement here.** ... Naming a default is how nine subjects end up with the same hero" |
| 3 density | appearance: prescribes density | l.79-82 "**The specific numbers come from the contract**, which comes from the winning comp" |
| 4 radius | appearance: prescribes radius | l.90-91, l.98 "a property of the direction, not of the mode ... **there is no marketing radius either**" |

Section 2 is not an appearance rule. It is a **generative rule**: a table mapping the
subject's strongest true material to what the first screen is built around (l.57-64). That is
an anti-convergence mechanism, and it is the closest thing in v2 to the thesis layer the
rebuild wants.

The corrected count: **two decisions are wholly appearance (6 Motion, 7 Colour emphasis), two
are majority appearance (9 Navigation, 11 Content density), one is mixed (5 Imagery).**
Roughly 3.5 of 12 by decision, about 31 of 168 body lines. **Call it 30% appearance, not 50%.**

The 30% is not evenly distributed and it is not harmless. Section 7 is the round-8 palette
recipe stated as a rule.

### Obligation / appearance split

| § | Line(s) | Rule as written | Verdict |
| --- | --- | --- | --- |
| 1 | 29-39 | Six-beat argument: what this is / why it matters / how / why believe / what it costs / what next. Cut before you add | **Obligation.** Ordering of information, not layout |
| 1 | 41-42 | First screen establishes what this is and who it is for | **Obligation** |
| 2 | 47-52 | No default arrangement; the arrangement is the axis the comps must differ on | **Obligation** (generative) |
| 2 | 57-64 | Strongest true material decides what the first screen is built around | **Obligation.** Highest-value rule in the file after §12.1 |
| 2 | 66-67 | Div-built fake product screenshot is banned | **Obligation** (honesty, not look) |
| 2 | 71-72 | Headline ≤ 2 lines at 1440, subtext ≤ 4 lines | Mixed. Reachable-action half is obligation; the line caps are an arbitrary proxy |
| 3 | 77-78 | Argument reads as separated steps without a border saying so | **Obligation** |
| 3 | 80-82 | "marketing sits at the open end of whatever ramp the contract defines" | **Appearance**, soft. A density steer with no subject input |
| 3 | 84-86 | Measure 55-75ch; gaps from one ramp; few sizes used hard | **Universal** |
| 4 | 88, 90 | Section exists to talk about radius at all | **Appearance-shaped**, though every sentence inside refuses to set a value |
| 4 | 92-95 | Two values plus full at most; inside is tighter than the container; declared in the contract | **Universal** (nesting consistency) |
| 5 | 104-105 | "**Images are mandatory in this mode**" | **Appearance.** Forbids the type-only page. The escape hatch cites "mode M, manifesto hero", which is this same file and no longer contains a manifesto hero: a dead cross-reference |
| 5 | 109-112 | Provenance ladder: real > generated one-treatment > seeded placeholder > labelled slot | **Obligation** |
| 5 | 114 | "Never: hand-rolled decorative SVG blobs" | **Appearance.** A ban on one device is a tell, not a floor |
| 5 | 117-118 | One treatment across the site; two photographic treatments is two brands | **Obligation** |
| 6 | 122-123 | "Entrance only ... a short fade-and-rise ... staggered by no more than three elements" | **Appearance.** Prescribes a motion character. Passes floor-lint |
| 6 | 125-127 | Scroll effects only when the motion explains a relationship | Obligation, already carried by §8 |
| 6 | 128 | "**Nothing moves in a form. Nothing delays a click.**" | **Obligation.** Not carried anywhere in v3. Generalises the NORDRIG commerce rule |
| 7 | 133-134 | "The accent works hard and appears rarely ... Three places on a page, not thirty" | **Appearance.** This is the monoculture |
| 7 | 136 | "**Neutrals carry the page.**" | **Appearance.** Two-accent, three-accent and no-accent palettes are all legitimate directions |
| 7 | 138-140 | Status colour comes from the semantic group, exempt from the accent budget | Bookkeeping for an appearance rule. Dies with it. Kernel: a state colour is not the emphasis colour |
| 8 | 144-152 | Proof ladder, descending, with "**Nothing**" as a legitimate rung | **Obligation.** Best-formed rule in the file |
| 8 | 149 | Logo wall "logos only, no category labels beneath them" | **Appearance** (component layout). Kernel: the logos are real customers |
| 8 | 154-155 | Fabricated testimonials, logos, metrics are absolute | Obligation, mostly carried by §7 |
| 9 | 159-160 | "One line at 1440, height ≤ 80px, five destinations at most" | **Appearance.** A nav height cap is a look |
| 9 | 160-161 | Above five destinations the sitemap is wrong, not the nav | **Obligation** (IA, not layout) |
| 9 | 163-164 | Mega-menu legitimate above ~twelve destinations | Appearance-adjacent. Kernel: nav form follows catalogue size |
| 9 | 165-166 | On a phone: real disclosure, current item marked, primary action visible without opening | **Obligation.** Not in v3 |
| 10 | 170-172 | Above the fold, repeated once at the end, three appearances maximum | Weak obligation. A budget, satisfiable many ways |
| 10 | 174 | Label with the outcome, not the mechanism | Obligation, carried by §7 |
| 10 | 174-175 | Two labels for one intent is a page that could not decide | **Obligation.** Extends §7 |
| 11 | 179 | "Two to four short paragraphs per section, or one paragraph and a list" | **Appearance.** Forbids the dense essay and the index page |
| 11 | 180 | A section makes one point; two points is two sections | **Obligation** |
| 11 | 182 | "Sub-paragraphs under about 25 words" | **Appearance** in copy form |
| 11 | 182 | Headings that describe rather than label | Obligation, largely carried by §7 |
| 12 | 188-191 | "**Delete every image and panel, read what is left.** If it does not persuade in plain text, the design was carrying an empty page" | **Obligation, and a test.** The single best mechanism in the file |
| 12 | 192 | Invented proof is the tell that survives every other improvement | Carried by §7 |
| 12 | 193-194 | "Ask what the page would lose if the accent were a different hue; if nothing, no direction was chosen" | **Obligation** (falsifier for the signature). §6 has a Signature step and no test for it |

### Was deleting this file the right call?

**Yes for the file. No for the stated reason, and the reason has to be corrected before the
same argument is applied to `ecommerce.md` and `product-ui.md`.**

The architecture's reasoning is that "a marketing-specific craft floor could only contain
rules that are either universal or a look". The file falsifies that dichotomy. Four of its
rules are neither:

- **The argument shape** (l.29-39). A dashboard does not make an argument. Not universal.
- **The proof ladder** (l.144-152). An internal admin console has no proof section. Not universal.
- **The delete-the-design test** (l.188-191). Tests whether the argument survives the design's
  removal. Meaningless on an operate surface. Not universal.
- **Material decides the first screen** (l.57-64). Persuade-specific, and it is a divergence
  engine, not a convergence risk.

There is a third category the diagnosis missed: obligations specific to a persuade surface
that are not looks. Deleting the file on the two-category argument deletes those four with
the appearance, and one of them is the mechanism most aligned with what the rebuild is for.

The file should still go. Not because everything in it is universal-or-a-look, but because
its 30% appearance is concentrated in exactly the recipe that failed
(`portfolioDiversity: fail`), and because the file is a proven repeat offender: it already
survived one round of prose self-restraint. Sections 2, 3 and 4 were rewritten to refuse
defaults, the file still produced 0/8, and the untouched sections 6 and 7 are why. Prose
restraint in a file of this shape does not work.

**Destination.** Section 9 of `SKILL.md` routes "deciding whether to care, or reading" to
"nothing. Sections 1 to 8 are the whole instruction", and the architecture is explicit that
there is deliberately no `floor/decide.md`. So the four persuade obligations have to land in
sections 6, 7 and 8 as single lines, or they are lost. The recommendation below is that they
land in `SKILL.md`, not that a fourth floor file be invented.

---

## File 2 — `v2/tasks/redesign-audit.md` (208 lines)

This is two documents stapled together, and they score opposite.

**Part A, the diagnostic tables** (Pass 1, 2, 3 and 6; lines 50-95 and 137-154, about 60
lines). Every row is `Look for | Repair`. The Repair column names a replacement device.
**28 of 39 rows are appearance: 72%.**

**Part B, everything else** (preservation contract, phasing, states, copy, semantics,
forgotten surfaces, repair order, scoring; about 140 lines). Roughly 90% obligation, and it
is the best floor material in all three files.

### Part A is the redesign path's convergence engine

Pass 2 is the clearest case in the repository. Read the Repair column top to bottom:

- l.67 shift the ground off pure black or white and tint it toward the accent's hue
- l.68 **one accent**, demote the rest to neutrals
- l.69 one grey family, tint all neutrals consistently
- l.70 desaturate accents above ~80%
- l.71 tint the shadow with the background hue
- l.74 replace even gradients with radial, mesh, or a flat fill with texture
- l.75 add a low-opacity noise layer

Run those seven instructions on any input and you arrive at: an off-black or off-white ground
tinted toward a single desaturated accent, one consistent grey family, hue-tinted shadows,
and a noise texture. That is a complete house style, delivered as an audit. NORDRIG documents
build B landing on precisely this shape and calls it "the monoculture risk: dark ground, one
saturated accent, everything else neutral". **Pass 2 does not merely permit that outcome. It
instructs it, on every project, before the subject is consulted.** It is the same rule as
`marketing.md` section 7, stated twice in two files, so both the build path and the redesign
path arrive at it.

Pass 6 has a subtler version of the same defect. It is a `Default | Alternative` table:
squircles instead of circular avatars, a masonry wall instead of a testimonial carousel, a
two-column list instead of an accordion, a slide-over instead of a modal. Each replacement is
defensible once. Applied on every project, **the alternatives become the new defaults**, and
three redesigns of three different generic sites arrive at one non-generic site. This is the
inverted-convergence failure the architecture already identified elsewhere: systematically
inverting each category's default rotates the categories into one another. The left column is
valuable and belongs in a tells corpus. The right column has to go.

Pass 1 and Pass 3 are milder cases of the same thing: "introduce a second face for headings"
(l.54) forbids a single-face direction, "add 500 and 600" (l.55) prescribes a weight ramp,
"offset one axis" (l.84) forbids symmetry, "overlap with negative margin to create depth"
(l.90) mandates a device that a Swiss grid direction would refuse.

### Part B, row by row

| Section | Line(s) | Rule | Verdict |
| --- | --- | --- | --- |
| How to run | 25-33 | Read, Score, Repair. **Do not start editing during phase one** | **Obligation.** Fixing while reading hides systemic problems behind local ones |
| How to run | 35-36 | Forty files improving nothing is worse than four targeted changes | **Obligation** (diff economy) |
| Preservation | 40-48 | Framework, router, styling system, state library; brand marks and legally required text; URLs, route and field and event names; copy carrying a claim; anything behind a flag. **"Stop and say so. Do not decide it silently"** | **Obligation.** Strongest rule in all three files. Zero appearance |
| Pass 1 | 57 | Measure wider than ~75 characters: constrain the measure, not the container | **Universal** |
| Pass 1 | 58 | Line-height scales inversely with size | **Universal** (legibility) |
| Pass 1 | 59 | Aligned numeric runs must not jitter | **Obligation**, with a caveat below |
| Pass 1 | 60 | A single word alone on the last line reads as a typo | **Universal** |
| Pass 4 | 98-108 | Six states enumerated with a definition each | **Obligation.** More operable than §8's one sentence |
| Pass 4 | 102 | Hover is never the only affordance; touch has no hover | **Obligation.** Not in v3 |
| Pass 4 | 106 | Disabled: "something that looks pressable and does nothing is a bug" | **Obligation** |
| Pass 4 | 108 | Loading occupies the shape of the content it replaces | **Obligation** (the skeleton half is appearance) |
| Pass 4 | 110-112 | Page states: empty is composed, error is inline next to the cause with a way forward, partial exists | **Obligation.** §8 says these exist; it does not say where the error goes |
| Pass 4 | 113-114 | Transitions on `transform` and `opacity` only; animating geometry forces layout every frame | **Obligation** (performance) |
| Pass 4 | 114-116 | 150-300ms, ease-out entering, ease-in leaving, exits two-thirds of entrances | **Appearance.** Motion character in numeric form. Same defect as `marketing.md` §6 |
| Pass 5 | 121-124 | Never invent proof; if unavailable, a visible placeholder that cannot be mistaken for a claim | **Obligation**, and it **contradicts** `SKILL.md` §7 l.157-158, which forbids the placeholder outright. Resolve before merging |
| Pass 5 | 125 | "Round numbers read as fake. `47.2%` is believable; `50%` is a guess" | **Reject.** As a detection tell it is true. As an instruction it says make your invented numbers more convincing, which is the opposite of §7 |
| Pass 5 | 126-129 | No placeholder names; retire the generated-marketing vocabulary | Tells corpus, not a floor. Also carries the Apache attribution obligation |
| Pass 5 | 130 | No lorem: "fake copy hides layout problems" | Carried by §8; the reason is the useful part |
| Pass 5 | 134-135 | Vary dates and avatars; identical timestamps break the illusion instantly | **Obligation.** Real content has variance. Nowhere in v3 |
| Pass 6 | 152-153 | One icon family, one stroke width, one optical size scale. Emoji are not icons | **Obligation** |
| Pass 6 | 149 | Detect `prefers-color-scheme`, offer an override | **Obligation** (the sun/moon half is appearance) |
| Pass 7 | 158-161 | Semantic landmarks, one h1, alt text | Carried by §8 |
| Pass 7 | 162 | No inline styles in a project that has a styling system | **Obligation** |
| Pass 7 | 164 | A named z-index scale; `z-index: 9999` means the scale was lost | **Obligation.** Not in v3 |
| Pass 7 | 165-166 | **Verify every import against the dependency manifest.** A hallucinated import fails at build time | **Obligation**, agent-specific, nowhere in v3 |
| Pass 7 | 167 | `<title>`, description, `og:*`, favicon | **Obligation.** Not in v3 |
| Pass 8 | 172-181 | Six forgotten surfaces: custom 404, privacy and terms, skip link, field-tied validation, a way back from every dead end, active nav state | **Obligation.** A completeness checklist is the definition of a floor. "Add whichever apply" keeps it conditional |
| Repair order | 185-194 | Seven steps ordered by visual return per unit of diff, re-judged after each group | **Obligation** (sequencing), but steps 1 and 2 point at the two most appearance-heavy passes. Keep the ordering, re-point the steps |
| Scoring | 198-208 | Six dimensions, 1/3/5, before and after. Anything at 2 or below is where the next session starts | **Obligation**, with a hole named below |

### Two caveats that matter more than they look

**The tabular figures rule is correct and complicit.** Line 59 mandates
`font-variant-numeric: tabular-nums` on aligned numeric runs. Tabular figures are one of the
four devices `scripts/direction-history.mjs` hard-codes as the round-8 known-bad recipe, and
the architecture's own kill note observes that a commerce obligation reading "a figure that
lines up between rows" mandates that device **through the obligations door while passing the
purity lint**. The rule is right; its phrasing hands over the implementation. Stated as an
obligation it is: figures being compared must not shift position between rows. That is
satisfiable by tabular figures, by fixed-width right-aligned cells, by a monospaced-figure
face, or by not putting them in a column at all.

**The scoring rubric is proven insufficient in the exact dimension it claims to measure.**
`Originality: 5 = Could not be mistaken for another site` (l.204). Every one of the three
round-8 sites passed its own review. This rubric is what they passed. It compares a site
against sites in general, never against the studio's own previous work, which is precisely
the axis `portfolioDiversity` failed on. Adopt the rubric, but it must carry a cross-build
comparator or it reproduces the failure with a score attached.

---

## File 3 — `v2/tasks/setup.md` (99 lines)

**Roughly 95% obligation and close to 0% appearance.** The purest floor material of the
three, and the architecture folded it away almost silently into `stacks.md`.

| Line(s) | Rule | Verdict |
| --- | --- | --- |
| 5-7 | Skipped by default. If a framework, bundler or styling system exists, that decision is already made | **Obligation** |
| 19-31 | Decision gate: five filesystem checks, any single match means skip entirely. Also read `CLAUDE.md`, `AGENTS.md`, `README.md`: "a project that documents its stack has chosen its stack" | **Obligation.** Prevents the worst redesign failure |
| 33-34 | If nothing matches, say so in one line and state what you are about to install before installing it | **Obligation** (consent before mutation) |
| 37-42 | A stack is sufficient when four things are true: something renders, styles are one system, dev server with reload, production build. "Do not add tooling beyond this without being asked" | **Obligation** |
| 48-54 | Brief-to-scaffold table | Not appearance. A technology default table that will rot. Note that one stack for the most common brief does constrain the look through its default scale |
| 62-64 | Tailwind v4 configuration note | Dated fact. Will be wrong. Belongs in an adapter with a date, or nowhere |
| 66-73 | Verify before writing any design code: `npm run dev`, `npm run build`. "A scaffold that does not build is not a scaffold" | **Obligation** |
| 83 | Generated components: "**You own the output. Never ship it at default styling**" | **Obligation**, and explicitly anti-house-style. v3 has nowhere for it today |
| 84 | Icons: one family only, decide once | Duplicate of Pass 6 l.152 |
| 86 | Every addition is a dependency someone must maintain. If CSS can do it, use CSS | **Obligation** |
| 90-91 | Never install a framework into a project that has one. Migrating stacks is a separate project with its own budget | **Obligation** |
| 92-93 | Never add a second styling system | **Obligation** |
| 95-97 | Never install a paid or key-gated service. **Do not ask for, store, or write API keys on the user's behalf** | **Obligation** (safety). Nowhere in v3 |
| 98-99 | Never leave the scaffold's placeholder content in the delivered result | **Obligation** |

---

## The appearance rules, named and left behind

These are the lines that most plausibly produced one look from three briefs. None of them is
extracted as a mechanism. Note that only four of the twenty-two are caught by `floor-lint`.

| File:line | The rule | Caught by lint |
| --- | --- | --- |
| marketing.md:80-82 | marketing sits at the open end of the density ramp | no |
| marketing.md:104-105 | images are mandatory in this mode | no |
| marketing.md:114 | never hand-rolled decorative SVG blobs | no |
| marketing.md:122-123 | entrance only, a short fade-and-rise, staggered by no more than three elements | no |
| marketing.md:133-134 | the accent appears in three places on a page, not thirty | no |
| marketing.md:136 | neutrals carry the page | no |
| marketing.md:149 | logo wall: logos only, no category labels beneath them | no |
| marketing.md:159 | nav is one line at 1440, height ≤ 80px | no |
| marketing.md:163-164 | mega-menu above roughly twelve destinations | no |
| marketing.md:179 | two to four short paragraphs per section | no |
| marketing.md:182 | sub-paragraphs under about 25 words | no |
| redesign-audit.md:54 | introduce a second face for headings | no |
| redesign-audit.md:55 | add 500 and 600 weights | no |
| redesign-audit.md:56 | tighten tracking as size grows | **yes** |
| redesign-audit.md:61 | sentence case, not title case | no |
| redesign-audit.md:67 | shift the ground off the extreme, tint toward the accent's hue | **yes** |
| redesign-audit.md:68 | one accent; demote the rest to neutrals | no |
| redesign-audit.md:69-70 | one grey family; desaturate accents above ~80% | no |
| redesign-audit.md:71 | tint the shadow with the background hue | **yes** |
| redesign-audit.md:74-75 | replace even gradients with radial or mesh; add a low-opacity noise layer | no |
| redesign-audit.md:84-91 | offset one axis; overlap with negative margin; more padding below than above | partly (l.89) |
| redesign-audit.md:114-116 | 150-300ms, ease-out in, ease-in out, exits two-thirds of entrances | no |
| redesign-audit.md:139-151 | the Alternative column: squircles, masonry wall, two-column FAQ, slide-over | no |

---

## Verdict

**`marketing.md`: 30% appearance, and the file should still be deleted.** The
six-of-twelve count is stale by one revision. The real figure is about 3.5 of 12 numbered
decisions, roughly 31 of 168 body lines. But the reason given for deleting it is wrong: the
file contains four persuade-specific obligations that are neither universal nor a look, and
the two-category argument that justified the deletion would also throw those away. It goes
because its concentrated 30% is the round-8 recipe itself, and because prose self-restraint
was already tried on this file and failed at 0/8. **Rescue four rules into `SKILL.md`, do not
create a `floor/decide.md`, and correct the recorded reason before `ecommerce.md` and
`product-ui.md` are judged by the same argument.**

**`redesign-audit.md`: two documents.** The four diagnostic tables are 72% appearance and are
the redesign path's convergence engine, with Pass 2 the single clearest instance of a house
style shipped as an audit. Everything else, about 140 lines, is 90% obligation and contains
the strongest rules in the whole v2 corpus: the preservation contract, the read-score-repair
phasing, the six states, the forgotten-surfaces checklist, the repair order and the scoring
rubric. **`redesign.md` should be built from Part B, with Part A's left column moved to a
tells corpus and its right column discarded.**

**`setup.md`: about 95% obligation and near-zero appearance.** The most under-rated file of
the three. Its decision gate, its four-condition definition of a sufficient stack, its
build-before-design verification, its API-key prohibition, and "never ship it at default
styling" are all obligations with no home in v3 today.

**The engineering finding that outranks all three:** `floor-lint.mjs` would have passed
`marketing.md` clean. Until the purity scan bans prescribed devices, counts and motion
characters as well as CSS values, a rewritten floor can reproduce the failure and report green.
