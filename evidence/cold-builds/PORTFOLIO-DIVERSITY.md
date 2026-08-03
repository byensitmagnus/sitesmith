---
title: Portfolio diversity, round 4 — the measurement and its verdict
measured: 2026-08-02
tool: tools/portfolio-diversity.mjs
verdict: FAIL
status: historical evidence, preserved verbatim, not rewritten
ai_generated: "(C)"
---

# The report, as it printed

The three pages of round 4 were each accepted by a blind reviewer, one at a time. They were
then measured together. This is the output, unedited.

```text
  portfolio diversity — measured in the browser default colour scheme

  site             ground               lum    display               assets  mono  hair  layout
  savvaerk         rgb(43, 19, 16)      0.01   Vollkorn              0%         0   104  table+split7
  korn             rgb(178, 182, 183)   0.463  Big Shoulders Displa  0%         0    61  split5
  fyr              rgb(222, 230, 224)   0.775  Marcellus             19.63%     0    25  split3+object

  FAIL  device: all 3 sites use hairline borders as the separator (savvaerk, korn, fyr). A device every site shares belongs to the portfolio, not to any of them.
  FAIL  device: all 3 sites use tabular figures as a motif (savvaerk, korn, fyr). A device every site shares belongs to the portfolio, not to any of them.
  note  savvaerk and fyr both use no elevation anywhere

  FAIL — 2 way(s) in which they are one site
```

Grounds, display faces and layout signatures were all distinct. The two failures were both
device saturation.

## What it is, and what it is not

It **is** a real research finding, and it located a real hole: the anti-repeat ledger
compared each build against one prior record at a time and wanted four shared devices before
it spoke. Across this set every pair shared only two, so nothing objected while the set
converged. `ledger.mjs` now also refuses a device carried by every one of the last three
records. That change is in the release.

It is **not** a release blocker. The hypothesis SiteSmith exists to test is whether a fresh
agent with this skill and one brief produces a page the person paying for it accepts. Three
of three, after nine rejections, answers that. Visual breadth across a portfolio is a
separate question, still open, and it does not gate the validated core.

## The two devices, reclassified

Hairline separators and tabular figures are, from this release, **signals rather than
standalone portfolio failures**. Both have honest reasons to recur across unrelated trades:
a sawmill, a grain intake and a lighthouse all have real figures to set, and a rule between
rows is not a style so much as a way of not drawing a box.

Portfolio diversity is judged first on the axes where sameness actually costs a client:
layout topology, visual metaphor, typographic voice, information hierarchy, interaction
model, material world, and signature device.

This document is not rewritten when that reclassification changes later verdicts. The report
above is what the tool printed on 2026-08-02, and it stays that way.
