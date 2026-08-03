---
title: S10-1 — does the re-expressed creative surface transfer?
state: S10_MECHANISM_TESTS
status: complete
verdict: TRANSFERS — no verbatim swap; one real defect found and fixed
ai_generated: "(C)"
---

# S10-1 result

The pre-registered question: does our re-expressed creative prose carry the power of
`frontend-design/SKILL.md`, or does the power live in its specific phrasing? The
pre-registered response to a loss: replace sections 1–7 with an Apache-2.0 verbatim
include, leaving the rest of the architecture untouched.

**Arm P** — `frontend-design/SKILL.md` verbatim, 2,078 est tokens.
**Arm Q** — our `creative-surface-draft.md` sections 1–8, 2,161 est tokens.
Same sealed brief, same host model class, same output contract, builders blind to each
other. Three judges with distinct lenses, each blind to which arm was which.

## Scores

| Judge lens | P | Q | Winner |
| --- | ---: | ---: | --- |
| Design director | **48** | 37 | P, clear |
| The shop owner in the brief | 45 | **50** | Q, clear |
| AI-tell hunter | 41 | **48** | Q, clear |
| **Total (of 180)** | **134** | **135** | — |

**Judges 2–1 to Q. Aggregate one point apart.**

## Verdict

`TRANSFERS — NO SWAP`

Arm Q did not lose materially, which is what the contingency was written against. The
re-expression carries. `risk:reexpression-may-not-transfer` is closed as far as n=1 can
close it, and the honest limit is stated below.

## What the disagreement is actually about

The three judges did not split on quality. They split on **where the idea lives.**

The design director's case for P is the strongest single argument in the whole test:
P's thesis survives into the render as a graduated instrument rule down the page edge,
with one seal-green segment aligned to the certificate section, while Q's thesis "only
exists in its plan". That is precisely the failure this repository already has a gate
for — `sitesmith-current/direction-fidelity-render-check`, the mechanism the capability
matrix rates highest at 0.88. It is adopted in the architecture and was not running
here, because no scripts exist yet.

The other two judges rendered the same pages and reached the opposite conclusion,
specifically praising Q's deviation readout as the service drawn rather than described.
The AI-tell hunter ran the swap test on both and found Q's page breaks when moved to
another trade while P's card row and 2×2 grid survive the move — which is the harsher
test of the two.

That disagreement is recorded, not resolved. n=1.

## The defect this test found, which matters more than the score

**Arm Q invented three facts. Arm P invented essentially none.** All three judges
flagged the same sentence independently as the most serious:

> "Vi lægger besøget, så du kan have vægten i drift indtil da."

The page tells a shop owner they may keep using an instrument that an inspector has
taken out of verification. That is operational advice with legal consequences, and
nothing in the brief supports it. Two more: that the certificate records the measured
deviation, and that the label on the instrument is sufficient information to start a
job.

**Why the rule failed.** Our section 7 said a claim needs a source and then *enumerated
the categories*: numbers, guarantees, delivery times, certifications, testimonials,
customer counts. All three inventions fall outside that list. The enumeration created
the loophole — which is exactly the failure mode ponytail's own measurement warns
about, where a finite named list gives no protection to a category not listed
(`ponytail/explicit-never-simplify-carveouts`, confidence 0.85).

frontend-design has no such list, and arm P invented nothing material. Being less
specific was safer here.

**The fix, applied to the draft.** The rule becomes a test rather than a list: if a
reader could act on it, or hold the client to it, it is a claim. The enumeration
survives only as examples of the test, never as its boundary. And because
`decision:prose-generates-structure-enforces` says prose is never the enforcement, this
now requires a structural check in `gate.mjs` rather than a stronger sentence.

Arm P's own smaller errors are recorded too: it drew the class F1 reference weights as
brass, which is both unsupported and factually wrong — real F1 weights are stainless
steel — and it dropped the brief's "a few" before pharmacies where Q kept it.

## Contamination, verified rather than accepted

Arm P disclosed that a screenshot returned another builder's page from a shared browser
pane, and stated that its own design was complete at that point with file timestamps
bearing it out. Checked directly rather than taken at face value:

| File | Written |
| --- | --- |
| P `PLAN.md` | 12:16:00 |
| Q `index.html` | 12:22:51 |
| Q `PLAN.md` | 12:23:19 |
| P `index.html` | **12:26:15** |

P's *plan* was fixed six minutes before Q's page existed, so every design decision
scored here — thesis, palette, typefaces, signature, named risk — is clean. P's *HTML*
was written after Q's page existed. So the plan-level comparison is uncontaminated and
the render-level comparison is contaminated **in P's favour**.

P lost 2–1 anyway, so this does not threaten the verdict. It does land on the one axis
where P won: the design director's argument was specifically that P's idea survives
into the render. That argument cannot be fully separated from the contamination and is
therefore weakened, not dismissed.

**Process fix:** builders in every later test get isolated browser contexts, and the
render step is verified as isolated before the run rather than disclosed after it.

## Honest limits

- n=1 brief, one host model, one output contract. This detects a large effect and
  nothing smaller.
- The set-level question — do three unrelated briefs converge — is A9 and needs three
  builds that do not exist yet. This test cannot see it.
- Judges are model-based. `ponytail/self-validating-llm-judge` says a judge should
  prove it can rank a known-templated reference below a known-distinctive one before
  its verdict is trusted. That gate was not built for this run, and the verdict is one
  point wide. Treat the 2–1 as "no material loss", not as "Q is better".
- Both pages were written by the same model class. The test isolates the instruction,
  not the model.

## What changes as a result

1. Section 7's claims rule becomes a test, not a list. **Done** in the draft.
2. `gate.mjs` gains a claims check that reads the built page against the brief's fact
   list, because prose is not enforcement.
3. `direction-fidelity-render-check` moves up the build order. The strongest argument
   against our arm was that its idea did not reach the render, and this repository
   already owns the mechanism that measures exactly that.
4. Isolated browser contexts for every later A/B.
5. The judge gate from `ponytail/self-validating-llm-judge` is built before the holdout,
   not after.
