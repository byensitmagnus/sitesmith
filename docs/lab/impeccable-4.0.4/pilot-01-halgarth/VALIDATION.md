# Instrument repair: canonical normalisation, measured

No model was used. No A/B/C artifact was regenerated. No product mechanism was changed. No
benchmark result was inspected.

```
instrument:      VALID on every measured axis
model calls:     0 spent on this repair
judge calls:     0 used, 1 still budgeted and unspent
```

## What was wrong

The previous scrub removed vocabulary and punctuation with regular expressions and left the
structure alone. One arm carried eleven markdown table rows and the other two carried none, so
a reader could sort them into a pair and a singleton without reading a word of the design.
Deleting the tables with a pattern would have taken the design information with them, because
in that arm the table *was* the information.

## What replaced it

`canonical.mjs` parses each artifact into blocks and re-emits every block in one form.

| block | becomes |
| --- | --- |
| table row | one statement per row, each cell labelled by its column header |
| bullet or numbered item | a sentence |
| bold, italic, code span, link | its own text, marks removed |
| paragraph | a sentence run |
| fenced drawing | kept verbatim, alignment intact, only word-level punctuation levelled |
| fenced list | parsed as markdown and rendered like any other list |

That last row is a distinction the first attempt did not make. A drawing is a decision made in
alignment and reflowing it destroys it; a list that happens to be fenced is prose with markers
on it, and leaving it fenced smuggled seven numbered items and six em dashes past everything
else. Box-drawing characters separate the two, deterministically.

Nine sections, the nine all three artifacts share. Eleven were suggested; the extra two would
have meant splitting one arm's prose across headings it never wrote, which is authoring rather
than blinding.

## Leakage, measured

`leakage.mjs`, against `canonical/`.

**Named tells: none.** No arm label, product name, script name, run key, seed key, source id,
URL, filesystem path, model or provider name, or procedure vocabulary.

**Structural tells: none.** Every measure is now identical across the three arms.

| | A | B | C |
| --- | --- | --- | --- |
| markdown table rows | 0 | 0 | 0 |
| bold spans | 0 | 0 | 0 |
| italic spans | 0 | 0 | 0 |
| blockquotes | 0 | 0 | 0 |
| bullet items | 0 | 0 | 0 |
| numbered items | 0 | 0 | 0 |
| code spans | 0 | 0 | 0 |
| em or en dashes | 0 | 0 | 0 |
| headings | 9 | 9 | 9 |

Before the repair those rows read 0/0/11, 0/0/4, 6/0/7 and 0/0/65.

## Fidelity, measured

`fidelity.mjs` pulls every concrete token out of each artifact before and after and compares
the sets: colour values, measurements with units, named typefaces, selectors, prices and
quantities, ratios.

**Verdict: nothing concrete was lost.**

It earned its place twice, on defects in the normaliser rather than in the arms:

1. **A colour was corrupted.** `rgba(0,0,0,.25)` became `rgba(0,0,0.25)`, a different colour
   and an invalid declaration, because a punctuation rule collapsed a comma before a full
   stop without checking whether a digit followed.
2. **A design fact left with a scrubbed paragraph.** One arm's 44px touch-target minimum sat
   in a paragraph that also mentioned a script by name, and the whole paragraph went. The
   scrub now works at sentence level inside a paragraph.

Both were found by the check, not by reading.

## What reading found that measuring did not

The regular expressions were built from the vocabulary the tools print, so they saw what they
were told to look for. Reading the three packets by hand found three more, all of them the
procedure describing itself in ordinary English:

- "every other **viable candidate** organises the page around a spatial or categorical fact"
- "it was not the **top-ranked candidate** on that list, it was deliberately the
  **lowest-resonance** one, full reasoning in **WORKING.md** §4"
- "this is what stayed after the **second swap** below"

All three are gone. The bare verb "swap" was left alone, because it is also design language:
one arm swaps a focus ring colour.

## The one difference that remains, and why it was not removed

| | A | B | C |
| --- | --- | --- | --- |
| words | 2534 | 2438 | 3271 |
| sections led | 2 | 0 | 7 |

C is 34 per cent longer and is the longest arm in seven of the nine sections.

**This was not normalised, on instruction and on principle.** Shortening one arm to match a
word count means summarising away decisions, and the rule is to remove presentation and keep
information. Length here is what an arm produced, not how it laid it out.

It is still worth naming as a confound rather than a tell. A tell lets a reader identify a
procedure; nothing in the length does that, because a blind judge has no prior that says which
procedure writes longer. A confound is different: a judge who values thoroughness may prefer C
for volume rather than for design, and that would be visible in the reasoning rather than in
the choice. It is recorded here so it can be read in the verdict rather than discovered after.

## Artifacts

| | sha256 |
| --- | --- |
| A raw | `c72d9d5fc3d84555bab833a82a6420cc2b3c9d69e04c3be9466ad7b685540b1f` |
| B raw | `503cd3c1915eca879483c88d3de6c037b8c9ea5e7edc9cf28dc1e6344b32b839` |
| C raw | `156b498027cda0de33293af5ebf7a17191b0c82747b2c580c658a80766027ae6` |

Canonical hashes in `CANONICAL.json`, leakage in `LEAKAGE.json`, fidelity in `FIDELITY.json`.
The raw artifacts are untouched. The earlier normalisation attempt is kept in `packet/` beside
the new one in `canonical/`, so the repair can be read as a diff.

## What has not happened

No judge has run. No verdict exists. Nothing here says anything about which direction is
better, and the three arms are still unlabelled to anyone who has not read this file.
