# Where this stands, 2026-07-29

Written at the end of a long session so the next one can pick up without re-deriving anything.
HEAD is `a3a1ac3`. Working tree clean, pushed, CI green on all seven checks.

## What is proven

**Round 8: 8.21 across three builds, 3 of 3 over the threshold of 8.** Two assignment-blinded
reviewers, three unrelated briefs, three agents who never met, the same rubric and the same
threshold as round 7. Round 7 was 7.67 and 0 of 3.

The criterion the round was about moved and nothing else did:

| criterion | round 7 mean | round 8 mean |
| --- | --- | --- |
| **assets** | **6.17** | **8.67** |
| direction | 8.83 | 9.17 |
| specificity | 8.67 | 9.00 |
| type | 8.17 | 8.17 |
| colour | 8.17 | 8.17 |
| hierarchy | 6.67 | 7.50 |
| production-readiness | 7.00 | 6.83 |

Production-readiness went *down*, which is the shape that makes the assets number believable:
the reviewers did not simply get warmer.

**The isolation gate runs in CI** (`the benchmark isolation holds`, every push). Both arms
`verdict pass`, bind mounts exactly as expected, from a pinned base digest on an `--internal`
network behind an exact-host proxy. This machine has no Docker; the runner does.

**Clean install works from an empty directory** and the real gate runs from there with axe
actually executing. `verify` fails closed when axe cannot run.

## What is not proven, honestly

- **The skill has a house style.** Both round-7 and both round-8 reviewers, independently, and
  `portfolio-diversity` mechanically: one studio, one method. Three agents with no shared
  context converge. Not repaired and not claimed to be.
- **Assignment-blinded, not technically blind.** Reviewers ran on this host with shell access
  and could have reached the sealed key. What is enforced is a withheld assignment and
  hash-bound, unedited reviews. The CI isolation job is the machinery that could host a truly
  blind review; it has not been used for one.
- **No benchmark claim exists anywhere**, and none should be made until the eighteen runs
  happen. See below for why that is not urgent.
- **The tannery's mobile Specification block** scrolls with no affordance and cuts its prose
  mid-word. Both reviewers scored production-readiness 6 for it. `verify` reports zero
  overflow and is right — the container is `overflow-x: auto`. Real fault, unfixed.

## The eighteen runs, and why they are not the priority

`MAX_TOTAL_COST_USD = 160` is a **ceiling in code, not a bill**. Nothing has been spent. The
runs need an `ANTHROPIC_API_KEY` billed to console.anthropic.com, which is a separate account
from a Claude subscription.

What they would measure is **not** whether the skill is any good. That question already has an
answer: 8.21, 3 of 3, from reviewers who saw only screenshots. The eighteen runs measure
something narrower — whether a *different* agent, given the skill and no other help, produces
measurably better pages than the same agent without it. That is an A/B claim about transfer,
and it is the only thing that would justify a sentence like "SiteSmith measurably improves
output".

So the honest position is: the skill is demonstrably good, and its effect on somebody else's
agent is unmeasured. Those are different sentences and only the first one is currently earned.

## The pilots are the control group

`pilots/01-chandlery`, `02-foundry`, `03-cask-console` are byte-identical to what their build
agents left, and their round-7 reviews are unedited. 7.67, 0 of 3, assets 6 on five of six
reviews. They are not showcase work and the gallery does not show them.

## The recurring lesson of this session

Seven defects were found by *running* the previous session's work rather than reading it, and
three separate conformance rules misfired on the new builds in the same way: they were
extracted from landing-page references and misread other page types **as a design criticism**,
which is the expensive kind — the author changes something that was right. Written up in
`CONFLICTS.md` as an addendum.

One of the seven was mine to own: round 7 reported that all three pilots drew a mark and none
recorded it. All three had recorded it. The gate was matching the word "logo" in an id. That
correction is in place in both round-7 documents rather than quietly amended.

## If you do one thing next

`node tools/bench-container.mjs discovery` costs at most 1 USD and returns the real per-run
figure, which is what the 160 should be decided against. Everything else can wait.
