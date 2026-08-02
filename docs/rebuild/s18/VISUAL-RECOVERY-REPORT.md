---
title: Visual recovery, one pilot
state: S18_VISUAL_RECOVERY
status: awaiting visual review
branch: rebuild/sitesmith-unified
ai_generated: "(C)"
---

# One pilot, and what changed in the product to produce it

`RELEASE_CANDIDATE_READY: NO`. That verdict is not being contested and is not touched by
this round. This round rebuilt one holdout and changed the canonical workflow that failed
to produce it the first time.

## What changed in canonical SiteSmith

Five changes, one new module, nothing hardcoded about bells.

| Change | File | What it does |
| --- | --- | --- |
| new module | `skills/sitesmith-v3/look.md` | Visual thesis with a swap test, two or three references with an explicit line on what is **not** taken, an asset plan where every row names its source and licence and what the page loses without it, the decision about what object owns the first viewport, a materiality choice, and a five-question critique written against the render followed by exactly one correction round. |
| routed | `SKILL.md` frontmatter | `look.md` loads on read, buy, redesign and experience. Ceilings raised once and recorded. |
| routed | `run.md` step 5 | Do `look.md` before any code. |
| routed | `verify.md` | After the render passes, go back and look at the screenshots. |
| two refusals | `scripts/gate.mjs` | `look/first-viewport-unpainted` and `look/dead-field`. |

`look.md` names no colour, no typeface, no layout and no device, because every attempt to
help by listing good options is exactly how one house style reaches unrelated briefs. It
asks questions and sets floors; the answers come from the subject.

### The two numbers, and where they come from

```text
look/first-viewport-unpainted   under 15% of the first screen is anything but running text
look/dead-field                 the largest empty rectangle is over 28% of that screen
```

Measured, not chosen. The three rejected S17 pages scored **0% painted**, and the bell
foundry's largest dead field was **38%**. Scoped to experience and marketing surfaces: a
dashboard is dense with its own data, and demanding painted matter there would produce
decoration, which is the same failure facing the other way.

Two fixtures differing by one drawn plate hold both directions of the gate, at exit 2 and
exit 0. The suite is 21 cases.

## Why the old process could produce those screenshots and still report green

Written up in full in `docs/product/WHY-THE-GATES-PASSED-A-BAD-PAGE.md`. In one sentence:
**every gate in this package refuses a defect, and until this round nothing anywhere asked
for anything to be present.** The asset check refuses lying about images, not having none.
`verify.mjs` counts defects at three widths and never asks what is on the screen. There was
no floor for the experience surface. No step said: open the screenshot and look at it.

## How the pilot was produced through the workflow, not around it

The skill was installed clean into a temporary workspace with
`node tools/install-sitesmith.mjs --to <tmp>/skills`, and the installed copy's scripts were
the ones run:

```text
state.mjs open        a run opened, and closed at the end with a note
stack.mjs detect      no framework, no index.html: static, as run.md section 12 says
components.mjs detect nothing installed, so write rather than add a dependency
LOOK.md               thesis, three references, asset plan, first-viewport decision
build                 index.html
verify.mjs            render matrix, axe both schemes, reduced motion
CRITIQUE.md           five sentences against the screenshot
one correction        redraw, resize, recompose
ledger.mjs new        the 21-heading record, filled
gate.mjs              refused four times before it passed
motion frames         eight captures across the timeline
state.mjs done
```

The old implementation was used as a factual brief only. Nothing of its visual solution
survives: not the palette, not the score-as-layout, not the monospaced micro-labels, not
the flat ground.

## Proof

| | |
| --- | --- |
| desktop | `shots/desktop-1440.png`, `shots/desktop-1440-full.png` |
| mobile | `shots/mobile-390.png`, `shots/mobile-390-full.png` |
| motion | `motion/MOTION-PROOF.html`, eight frames from t=0 to t=0.58, self-contained |
| reduced motion | `shots/reduced-motion-1440.png`, the timeline pinned to its end state |
| no JavaScript | `shots/no-javascript-1440.png`, and the count: 3 sections, 5 schedule entries, 7 ratios, 4 facts still present |
| asset provenance | `ASSET-MANIFEST.md`, four rows, all drawn here, all MIT with this repository |
| clean install | 24 files into an empty directory, no test files, the environment check naming both absences with fix commands |
| gates | `gate.mjs` 0, `verify.mjs` 0, and every repository gate green |

## The critique round, stated exactly

`CRITIQUE.md` holds the five sentences written against the first render. The second one
was that the drawing did not read as a bell, and **the correction round did not fix it**:
redrawing the profile produced two wall sections side by side, which is what a cutaway
looks like with the back wall missing.

Adding the back wall was completed inside the same round rather than opened as a second
one, on the reading that "redraw the bell as a real section" was the specified correction
and a section without its interior is not one. That is a judgement, it is arguable, and it
is recorded here and in the production report so it can be argued with rather than found.

## Honest self-evaluation

- **The band of ground at 1440** between the headline column and the drawing is inside the
  gate's dead-field ceiling and is not what a designer would have left there.
- **Mobile puts the type above the drawing**, so the bell is half below the fold at 390.
  Good for reading order, weaker for impact.
- **There is no photograph.** This page would be better with one. The correct fix is to ask
  the foundry, not to generate one.
- **One page.** A complete experience surface for this brief, and not a large site.
- **The gate's two numbers are floors, not taste.** A page can clear 15% painted and 28%
  dead and still be poor. They catch the failure that shipped three times; they do not
  approve anything.
- **The other two holdouts are untouched** and still carry the rejected house style.

## Scope

Frozen and unchanged: the 19 of 19 source baseline, the architecture, the other two
holdouts. Nothing pushed, nothing merged. Five commits in this round.

`VISUAL_PILOT_READY_FOR_MAGNUS_REVIEW`
