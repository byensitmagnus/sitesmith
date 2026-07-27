# Grading rubric

> Original work, MIT. Applied blind: the grader does not know which arm a run belongs to.

Seven dimensions, scored 1 to 5. The automatic measurements are recorded separately and are
not part of this score — a site that fails axe is already failing, and rating it here twice
would double-count the floor.

**Score the artifact in front of you, not the effort behind it.** A site that did three
things well and stopped scores above one that attempted everything and finished nothing.

---

## The scale

| Score | Means |
| --- | --- |
| 5 | A professional would ship this. Specific to this client, finished, nothing obviously missing. |
| 4 | Sound. One or two things a reviewer would send back. |
| 3 | Competent and generic. Nothing wrong, nothing chosen. The average of everything in its category. |
| 2 | Visibly unfinished, or actively wrong somewhere it matters. |
| 1 | Not usable as a starting point. |

**3 is the important score.** It is where an unsteered model lands, and the whole claim under
test is whether the skill moves work off it.

---

## 1. Brand fit

Does this look like it belongs to this client, and only this client?

- **5** — swap the logo onto a competitor and it would look wrong. The direction answers
  something in the brief.
- **3** — plausible for any firm in the sector.
- **1** — belongs to a different sector entirely.

Test: what would this site lose if the accent were a different hue? If the answer is
"nothing", it is a 3 at best.

## 2. Visual quality

Hierarchy, type, spacing, composition.

- **5** — squint and one thing is clearly first. Type has a scale that is visibly used.
  Spacing groups things. Nothing floats, nothing is orphaned.
- **3** — even, calm, unobjectionable. Everything the same weight.
- **1** — cramped or sprawling, misaligned, competing focal points.

## 3. Content quality

Copy, argument, specificity.

- **5** — written for this audience, makes an argument, every claim traceable. Delete the
  images and the case still stands.
- **3** — accurate and generic. Could describe any competitor.
- **1** — filler, or fabricated facts. **Any invented statistic, testimonial or customer logo
  caps this dimension at 2**, whatever else is true of the copy.

## 4. Asset handling

Images, illustration, placeholders.

- **5** — one treatment, consistently applied. Where an asset does not exist, a labelled slot
  says what belongs there.
- **3** — images present, treatment inconsistent, or placeholders that do not say what they
  are.
- **1** — unlabelled grey rectangles, decorative SVG blobs, or a div-built fake screenshot.

## 5. State coverage

Every state the thing can be in.

- **5** — six control states distinguishable; empty, error, loading and partial present
  wherever the data can be absent. The empty state says what would fill it.
- **3** — hover and focus exist, page-level states do not.
- **1** — the happy path only.

## 6. Cross-page consistency

Only scored where the brief asked for more than one page.

- **5** — header, footer, components and tokens identical across pages. Page four cost less
  than page two.
- **3** — recognisably the same site, with drift: a spacing that changed, a second grey, a
  header that lost an item.
- **1** — pages that look like different projects.

The automatic cross-page numbers are in `report.json`. Read them after scoring, not before.

## 7. Completion

Is it finished, against what the brief asked for?

- **5** — every page the brief named exists and is complete. `BRIEF.md` and
  `DESIGN-SYSTEM.md` exist and describe what was built.
- **3** — the main pages exist, the secondary ones are stubs.
- **1** — one page and a promise.

---

## The blind procedure

1. `node tools/bench.mjs grade <brief>` copies every run for that brief into a working
   directory under a random label, strips `manifest.json` and any file naming the arm, and
   writes a key file the grader must not open.
2. Grade all six. Write `grade.json` per run: seven scores, and one sentence per dimension
   saying why. A score with no sentence is not a judgement, it is a number.
3. Only then open the key.
4. Report every run. Six runs where two were dropped is a four-run benchmark with a
   selection story.

**If the grader built the skill, the result says so.** It does not invalidate the automatic
columns; it does qualify these seven, and the honest thing is to publish the qualification
next to the number rather than under it.
