# Model budget, written before the first call

```
build workflows:              2
blind judge workflows:        1
maximum expensive workflows:  3
design rerolls:               0
second judges:                0
```

A technical retry is permitted only if a workflow produces no usable build at all, and it
would be recorded as a retry rather than folded into the result. No reroll because a design
came out weak.

## The question

Does the corrected SiteSmith produce a better finished website than competent plain Sonnet?
A product test, on the rendered site. Not a direction document, not Impeccable.

## The frozen product

`lab/beat-impeccable-4.0.4` at `3d19e7cb0d7c9e91653abef6bee6c43b2e1bbc28`, with the two
deterministic repairs in: horizontal clipping inside controls is detectable, and the contract
step's own file is permitted while undeclared reads stay refused. Deterministic suite 27 files,
0 failures. **Nothing in the product changes while this pilot runs.**

## The brief, and the thinness of the pool

`damgaard-estrik`, surface buy, sha256
`bcdcbe8a1f652412d4eb24c6c68b4a38dd10bffafd0a296823877e7d6f9c5c0f`.

Six buy briefs exist. Four are spent, and each is spent for its own reason:

| brief | why it is out |
| --- | --- |
| halgarth-rotor-balancing | the direction pilots ran on it, and it is the source observation for the thesis-order hypothesis |
| halvard-reedworks | audited in the coherence diagnostic, and it is the one additional FAIL that hypothesis rested on |
| bredo-rebslageri | audited in the coherence diagnostic |
| stannard-pattern-foundry | audited in the coherence diagnostic |

**That leaves two.** `damgaard-estrik` and `ordway-farriery`, and the rule picked the first.
A pool of two is thin, and the honest consequence is that a third buy pilot has one brief left
before the surface is exhausted. Recorded now rather than discovered later.

**One caveat, stated rather than left to be found.** All sixteen briefs had an arm-A direction
generated in the voided sixteen-brief run. That run was voided, no result was ever computed
from it, and neither build in this pilot reads it or knows it exists.

## The stack, and what it costs

The brief names Next.js with the App Router. That is a real build step, unlike pilot 01's plain
HTML, so both arms need `npm install` and a production build before anything can be served.
The registry was checked reachable before either workflow started: `npm view next version`
returned 16.3.0.

Both arms get the same brief bytes, so the cost falls on both equally. It does mean this pilot
measures something pilot 01 did not: whether each arm can carry a framework build to a served
page at all.

## Fairness

Same brief bytes, same resolved model, same effort, same fresh isolated workspace, same
runtime and browser, same asset availability. Neither arm sees the other's workspace, pilot
01's results, any judge verdict, or the losing pages from the last pilot.

SiteSmith runs its normal public route: install, then the product flow. If its own verification
finds a concrete defect the builder may correct the website, because that is the product
working and it should count. The product itself is not touched.

Plain Sonnet gets a neutral competent task and no SiteSmith rule of any kind.

## Model

| what | value |
| --- | --- |
| model passed | `sonnet` |
| resolved id per this session's environment | `claude-sonnet-5` |
| effort passed | `max` |
| effort actually honoured | not observable from inside a run |

## Cost is part of the result

Tokens, tool calls and wall time are recorded per arm and reported beside the verdict, never
normalised away. The judge is shown none of it.

Pilot 01's numbers, for the comparison that will be made afterwards: SiteSmith 634,905 tokens
and 79 minutes against plain 287,592 and 44, a 2.2 times multiplier, on a pilot SiteSmith lost.

## The instrument, and the order it was built in

The checker was written before either build finished and first run against P, because P
finished first. That order carries a fairness risk worth naming: a driver tuned until one arm
passes is a driver shaped by that arm.

Two rules hold it straight, and both were written before S was measured.

1. **The driver fills by construction, not by site.** A select takes one of its own options,
   a number field takes a number, a date field takes a past date. Only two answers come from
   the brief: the postcode and the sewage question. Nothing in it names a route, a class or a
   field of either build.
2. **A failed goal reports the site's own error text.** A driver that fills a field badly and
   a site that rejects a good answer both end on the form; only the site's words separate
   them. If S fails a goal for a driver reason, the driver is fixed generically and **both
   arms are re-measured with the same code**. Never one arm.

The first dry-run against P found exactly this class of bug: the driver wrote `Testsvar` into
an m² field, so the valid booking never validated and the receipt read as a P defect. It was
not one. Fixed generically, P then passed all four goals.
