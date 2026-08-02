---
title: A9 round four — they went grey, and grey has no hue
state: S12_CRITIQUE_AND_REVISION
status: complete
verdict: FAIL, and the first round where no check fired at all
ai_generated: "(C)"
---

# Round four failed, and it named the hole exactly

The first round with every structural defence live: the hue vetoes on ground, accent and
signature material, taste-skill's premium-consumer palette by RGB distance, its named
typefaces, and the AI-purple region.

```text
VERDICT: FAIL. The first one where no check fired at all.
```

Three unrelated Danish trades produced three sites on the same near-achromatic mid grey,
each named after a metal, each carrying one warm-metal ochre inside a 4.7 degree arc,
none carrying an image, all written in one voice.

## The arcs look like a win and are not

| Measure | R1 | R2 | R3 | **R4** |
| --- | ---: | ---: | ---: | ---: |
| Ground hue arc | 17.7° | 4.1° | 179.4° | **89.4°** |
| **Closest ground pair, ΔE76** | 7.2 | 1.5 | 26.1 | **2.7** |
| Ground chroma C*, per build | 7.3 / 5.2 / 3.1 | 7.0 / 7.6 / 14.2 | 18.8 / 5.4 / 5.4 | **8.0 / 3.4 / 2.5** |
| Ground luminance spread | 0.301 | 0.387 | 0.573 | **0.140** |
| Emphatic accent saturation band | 18.6 | 4.5 | 38.7 | **9.4** |
| Shared devices, all three | 1 | 1 | 0 | **0** |

The 89.4 degree ground arc is measured **between three greys**. All three sit at CIELAB
chroma 8 or below, the lowest mean of any round, lower than round one. At that chroma the
hue number is noise: a two-unit change swings one build's ground hue by 20 degrees.

The honest cell is ΔE: **26.1 down to 2.7**, a 90 percent collapse, the tightest ground
pair since round two. Luminance spread is the narrowest of all four rounds.

## Why no check fired

**Grey has no hue, and my own code says so.** `hueOf` returns null below a chroma
threshold, deliberately, so two unrelated builds are not vetoed for both using grey. The
builds went grey and every hue veto returned null.

Two of the round-four grounds are **9 RGB units apart** — inside this repository's own
12-unit "this is the same colour" threshold in the palette ban — and the ledger recorded
one as hue 191 and the other as achromatic. Nothing compared them.

**And the signature veto was never wired to a measurement.** `signatureHue` was recorded
as null on every build in the round, because the field was added to the fingerprint and
to the veto and `measure()` was never taught to extract it. A check wired to nothing is
worse than no check: it appears in the report as having run.

## Both are now fixed, and pinned

`colourDistance` in RGB, the same unit the palette ban already uses, so two numbers in
one report mean the same thing. Ground and accent refuse at 14 units, signature material
at 16. Hue still runs alongside it, because two saturated colours can be far apart in RGB
and obviously the same decision.

Verified against the real pair rather than an invented one: the two greys that escaped
are now refused at 9 units. Two genuinely different greys still pass. The suite grew from
35 to 38 cases.

`measure()` now captures the signature colour, so the veto has something to compare.

## What four rounds establish

Each round's convergence moved, and each time it moved to whatever the current measure
could not see.

1. Values, when nothing measured values.
2. Roles, when values were named.
3. The signature material, when ground and accent were watched.
4. Chroma, when hue was watched.

That is not four failures of the same kind. It is a measurement problem with a shape:
**anything measured stops converging, and the convergence relocates to the nearest
unmeasured axis.** The corollary is uncomfortable and worth stating: a fifth round will
converge somewhere the current five measures do not look, and the useful question is
whether that place is one a client would notice.

Rounds three and four both support the structural approach over the editorial one. The
one build round three refused produced every widening in that round, and round four's
failure is a gap in a measure rather than a rule being ignored. Neither round produced
anything like round one's seven shared moves.

## What would settle it

A human looking at three rendered pages and saying whether they look like one studio.
Every verdict in this sequence came from a model told that a FAIL is more useful, which
is a bias I built in deliberately and which should discount all four.

The three round-four pages are at `docs/rebuild/s14/builds/{A,B,C}/index.html`.
