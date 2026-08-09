# One-brief A/B/C pilot: stopped before the judge

```
instrument:            INVALID
winner on this brief:  not determined, the judge was not run
distance:              not determined
judge confidence:      not determined
model calls used:      3 of 4 planned
```

The three directions exist and are sound. The blinding is not, and a verdict from a judge who
can sort the arms is a verdict about the sorting.

## Why it stopped

Deterministic normalisation was required, and no model was allowed for it. Code did three
things well and one thing not at all.

**It removed the vocabulary.** Every term naming how a direction was arrived at is gone, cut
at sentence level so no decision was left dangling beside a deleted clause. Nothing matches
the mechanism list afterwards, and no run key, script name, source id or catalogue URL
survives.

**It removed the punctuation tell**, which was total on its own:

| | A | B | C |
| --- | --- | --- | --- |
| em dashes, before | 0 | 0 | **65** |
| en dashes, before | 0 | 0 | 11 |
| after | 0 | 0 | 0 |

Two of these arms come from a skill that bans the character outright. That made it a tell
about the procedure rather than about the design, so replacing it loses no decision.

**It cannot remove the structure.** This is what stops the run:

| | A | B | C |
| --- | --- | --- | --- |
| words after scrub | 2555 | 2444 | **3403** |
| markdown table rows | 0 | 0 | **11** |
| bold spans | 0 | 0 | 4 |
| bullets | 6 | 0 | 7 |

C carries eleven table rows and neither of the others carries one. A table is not decoration
here; it holds the design information, so a regular expression cannot take it out without
taking the content with it. Converting it to prose needs a model, and a model was excluded.
The same is true of the 39 per cent length difference.

Any reader can sort these into a pair and a singleton without reading a word of the design.

## What was checked and found clean

- no arm names, no product names, no script names
- no run keys, no seed keys, no source ids, no paths, no URLs
- no comparative selection language ("the only one of these", "the strongest of them")
- the scrub cut comparable amounts: 103, 204 and 83 words, which is a 121-word spread on
  artifacts of 2400 to 3400 words. No arm was thinned relative to another.
- the length difference is **not** uniform, which is the one thing that argues against
  stopping. A is the longest arm under Composition and layout, 630 words against C's 413. C
  leads on Thesis, First viewport and Honest risk. Each arm is longer in a different place, so
  length alone does not identify a procedure. The table rows do.

## The artifacts

Raw, before any normalisation:

| arm | sha256 | words | lines |
| --- | --- | --- | --- |
| A | `c72d9d5fc3d84555…` | 2658 | 307 |
| B | `503cd3c1915eca87…` | 2648 | 262 |
| C | `156b498027cda0de…` | 3550 | 341 |

Full hashes in `ARTIFACT-HASHES.json`. Normalised packets and their hashes in
`NORMALISATION.json`. Nothing is deleted.

## What each arm produced

Recorded because it is evidence, and read only by me, never by a judge.

**A**, no assignment step. Three theses, chose its own. Thesis: "A weighbridge, not a
shopfront." Its agent reported two things unprompted: an ambiguity in the brief about which
return date may be shown, resolved by scoping the rule to the headline promise; and that it
rewrote both its files to remove em dashes after reading the skill's ban as applying to its
own prose.

**B**, `assign.mjs` active. Six theses, all judged for viability before the key was drawn.
Thesis 4 assigned, drawn from the viable pool {2, 3, 4, 5, 6} at index 2, run key `c50098ae`,
no re-roll. Thesis: "A working-day tally, not a calendar."

**C**, Impeccable 4.0.4 at `9a949fb`, `--scope direction`. Seven grounded candidates, index 7
assigned, six challengers dealt, seed key `17ccb1bc`. Thesis: the site is the plate the rotor
gets laid out on.

## Preconditions, all met before any call

| | |
| --- | --- |
| pin | `concept-seed.mjs` `78c13ebc…` and `new-work.md` `4a226548…`, both matching GitHub at `9a949fb543d44cfb406f61bcab99d95d7f12cf1d` |
| scope | `DIRECTION CONCEPT SEED` in the header, run with `--scope direction` |
| not degraded | `source: api`, 281 of 531 human-approved, six challengers dealt |

The seed process threw the known libuv shutdown assertion after its output had flushed. The
capture is complete, 112 lines, ending on the seed key. It was not re-rolled.

## Cost

| | |
| --- | --- |
| calls used | 3 of 4 |
| model passed | `sonnet`, resolved id `claude-sonnet-5` per this session's environment |
| effort passed | `max`, and whether the runtime honoured it is not observable from inside the run |
| output tokens, three calls combined | 577,937 |
| per call | **not available**: the harness reports a workflow total, not a per-agent split |
| cost | **not available**: no price is exposed to the run |

The unused fourth call is the judge. It is unspent.

## The concern, stated plainly

This is a methodology problem, not a result. Nothing here says anything about which direction
is better, and the three artifacts are still usable the moment a normalisation exists that can
level structure as well as vocabulary.

Two ways forward, both a decision rather than a fix:

1. **Spend one call on normalisation and one on the judge**, which is five calls against a
   budget of four. It needs a new budget, not a quiet overrun.
2. **Judge the raw artifacts and record the run as unblinded**, which is cheap and honest but
   produces a preference that cannot be separated from recognising the arms.

Neither was chosen here.
