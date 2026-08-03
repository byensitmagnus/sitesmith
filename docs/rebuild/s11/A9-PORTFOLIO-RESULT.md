---
title: A9 — the house-style test, and it failed
state: S11_PROTOTYPE_BUILD
status: complete
verdict: FAIL — the old five moves are dead and seven new ones took their place
ai_generated: "(C)"
---

# A9 failed, and this is the most useful result in the rebuild

Three sealed briefs with nothing in common: reconditioned industrial sewing machines,
a district heating operations console, a two-person church organ workshop. One per
floor. Three isolated builders, each following `skills/sitesmith-v3` and blind to the
others. Then one judge, rendering all three at 1440 and reading every line of CSS.

```text
VERDICT: FAIL. A designer shown these three cold would guess one process.
Not for the old five reasons. Those are genuinely gone. For seven new ones,
applied just as uniformly.
```

## What the rebuild actually fixed

These are real wins and they should not be lost in the failure.

| Old tell | Status |
| --- | --- |
| Near-black ground | **dead.** All three light |
| Soft-cornered cards in a three-column grid | **dead.** `repeat(3, …)` appears zero times in all three; radius is 0, 0 and one 2px button |
| Generously spaced sans | **dead.** `text-transform: uppercase` is 0/0/0; A runs negative tracking |
| Mono-uppercase labels | **dead** |
| Generic token names | **dead.** A has `--hammerlak --stingplade --lærred --olie`, B has `--papir --margen --rude --udslag`, C has `--blyhvid --kancelle --bælgskind --stemmejern`. Three workshops, no `--bg` anywhere |

Typography is a clean pass: six faces, zero overlap, three genres. Of the eight
structural moves counted, only one is unanimous and six appear at most once.

## The seven ways they are still one site

1. **All three grounds land in an 18 degree arc** of desaturated yellow-green. Sage and
   greige, at 88, 72 and 70 degrees hue. Surfaces land in a 6 degree arc. Nobody chose
   blue, a warm cream, a true white, or a dark console — and B is a 24-hour night-shift
   operations screen, the one brief in the set with a real argument for dark.
2. **All three accents land in a 29 degree arc** of red-orange, all at 59 to 78 percent
   saturation and 30 to 39 percent lightness. There is no blue, green, yellow or purple
   anywhere in any of the three sites.
3. **All three declare the same accent doctrine in the same words.** A: "Kun tre steder."
   B: "Den eneste kulør på skærmen." C: "Den eneste mættede farve på siden."
   That is the old one-saturated-accent tell reproduced verbatim, with the ground
   inverted.
4. **Hairline rules are unanimous**, 28, 453 and 31 occurrences. The repository's own
   diversity tool names it: a device every site shares belongs to the portfolio, not to
   any of them.
5. **Zero imagery in all three.** The briefs forbid photography, so this is partly a
   fixture artifact, but zero `<img>` and zero `<svg>` across three builds is still a
   shared answer. Every one drew its signature with divs and gradients.
6. **The signatures are three executions of one idea.** Strip the subject and all three
   are: a CSS-drawn horizontal measuring instrument, placed high on the page, encoding a
   quantity as horizontal extent, `aria-hidden` with a caption restating it in words,
   whose whole rhetorical job is an honesty claim about a number the client would rather
   not say. A's stitch band with zero strokes where the spec is silent. B's 61 spans
   against a printed 45 degree limit. C's eight-to-eighteen-month band captioned "Vi
   skriver begge tal." Mechanically identical too: repeating gradients, absolutely
   positioned fills at percentage offsets, a printed limit line.
7. **A paragraph moves between the sites unnoticed.** Same register throughout: short
   declarative Danish, present tense, noun-phrase fragments, every section closing on a
   self-limiting disclaimer naming what the page refuses to claim. "Skilt ad til
   stellet. Nye lejer. Lakeret." / "Palle, ledig. Sanne, kører. Vagn, på stedet." /
   "Aase og Thorbjørn. Fire eller fem instrumenter om året." One writer, three subjects.

## The cause, and it is in the skill I wrote

**Section 6 asks for four to six values named from the noun list, and says to state what
each one is for.** The names vary beautifully. The *roles* do not. All three produced the
same five slots:

| slot | A | B | C |
| --- | --- | --- | --- |
| light desaturated ground | 88°, 10% | 72°, 23% | 70°, 7% |
| lighter raised surface | 67° | 73° | 72° |
| near-black ink | `#171a10` | `#1c2320` | `#23262b` |
| one saturated accent | 349° | 9° | 18° |
| desaturated olive secondary | 77°, 10% | 87°, 10% | 100°, 3% |

That is the twelve-slot schema failure of `v2/modes/README.md`, reappearing inside my
own `SKILL.md`. I diagnosed it, wrote a lint against it for the floor files, and then
reproduced it in the always-loaded surface. A file obliged to answer "Radius" answers it;
a plan obliged to name what each colour is *for* answers with the same five roles.

**Section 5 names four looks to avoid. All three builders avoided all four and converged
on a fifth that section 5 does not name.** Naming N defaults pushes the work into default
N+1. The fix is not a fifth entry.

**Section 6's originality self-test cannot see this.** All three ran it, all three
reported the plan survived the neighbour-brief swap almost intact, and all three then
bolted trade-specific nouns onto the surviving skeleton and called the pass complete. The
test detects convergence toward a *category*. It is blind to convergence toward a
*process*, because every build runs the same process and the process has a shape.

**Section 6's "spend your boldness in one place" produced three spends on the same kind of
thing.** The instruction constrains quantity, not kind.

## Two tooling defects the run exposed

- `tools/portfolio-diversity.mjs` does not exist. The tool is at
  `skills/sitesmith/scripts/portfolio-diversity.mjs` and takes URLs, not directories:
  it filters argv to `/^https?:/` and silently drops paths.
- It reads `document.body.backgroundColor`. Build C paints its ground on `html` and
  leaves `body` transparent, so C measured `rgba(0,0,0,0)`, luminance 0, and was filed as
  a dark site. C's real ground is `#d9dad4` at luminance 0.696. **The gate measured a
  fiction on one of three sites** and still returned the right verdict for other reasons.
- `gate.mjs` refused build A on `reads/outside-manifest` for reading `verify.md`,
  `ledger.mjs` and `gate.mjs` — all three of which `run.md` instructs the model to open.
  The manifest and the procedure disagree. The gate is right to refuse; the manifest is
  wrong.

## What this does not mean

It does not mean the architecture is wrong. The measured wins above are real and they
came from the mechanisms this rebuild adopted. It means the anti-convergence work is one
level short: it defeated convergence in *values* and *structure*, and left convergence in
*roles*, *kinds* and *voice* untouched.

It also means the charter's own warning was correct and I did not fully honour it:
*anti-slop must not become a signature.* A rule that says "one saturated accent" is a
signature whether the accent is teal or oxblood.

Recorded as `result:a9-fail-second-order` and `failure:convergence-in-roles-not-values`.
