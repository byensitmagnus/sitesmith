# sitesmith v2 — the canonical layer

> Original work, MIT. This directory is what the agent reads. Everything else in the skill is
> either a tool it runs or provenance it does not read by default.

## Why there is a v2

v1 was four openly licensed skills bolted together behind a router. Measured, that set
carries **978 rules across 47 files, 735 prohibitions against 185 requirements** — four to
one. The four voices restate each other, occasionally contradict each other, and between
them never say what a finished website *has*. An agent reading it avoids specific failures
competently and builds nothing in particular.

v2 is not that set merged. It is a new layer, written here, that is the only thing consulted
during a build.

## What is in it

| File | Read when |
| --- | --- |
| [00-done.md](00-done.md) | First, and again before claiming the work is finished. Fourteen things a finished website has. |
| [10-core.md](10-core.md) | Once per build. Sixty rules that hold in every mode. |
| [modes/](modes/README.md) | After routing. One answer per topic for the mode you are actually in. |
| [30-contract.md](30-contract.md) | Step 5. The design-system contract, derived from this brief. |
| [../blocks/](../blocks/README.md) | While building. Composition patterns with variants. |

Sixty core rules plus one mode file is what an agent holds while working. That is the design
constraint, and a rule enters the core only by displacing one.

## What changed from v1, and why

**Positive first.** `00-done.md` is a list of things to reach for. Prohibitions are reserved
for defects with no legitimate use, and each one states its exception. A ban without an
exception is one the first real brief breaks, after which they all look optional.

**One answer per mode, not one answer.** Radius, imagery, motion, density and the shape of
the argument genuinely differ between a marketing site, a shop and a dashboard. v1 issued
global rules and then contradicted itself when the context demanded otherwise — a mandatory
one-radius lock in one file, "identical radius everywhere is a defect" in another. v2 asks
which mode first and answers once.

**The contract is generated, not imposed.** A design system derived from the brief, with
documented one-off values where a composition needs one. Consistency is not the same as
quality: a site where every value came from a nine-step ramp and nothing was composed is
consistent and dead.

**Blocks are compositions, not just infrastructure.** The first five blocks encoded technical
defects, which is useful and is not a website. The library is being built out into the
patterns real sites are made of: navigation, hero families, product grids, purchase panels,
social proof, pricing, process, editorial, FAQ, forms, CTA bands, footers.

## What happened to v1

[`../references/`](../references/README.md) keeps the upstream material as documented
provenance, with attribution intact. It is not read during a build and it does not decide
output. Where a v2 rule descends from an upstream position, v2 says so; where v2 disagrees,
the adjudication and its reason are in [`docs/v2/DECISIONS.md`](../../../docs/v2/DECISIONS.md).

The benchmarks under `benchmarks/01` to `09` are v1 output and are now legacy. They are kept
because the measurements taken from them are real and cited, and because the control must
keep failing. They are not the evidence that v2 works.

## What would make v2 proven

Not this directory, and not another hand-built page. An agent given a clean brief, generating
complete multi-page sites reproducibly, measured against the same brief run without the
skill, graded blind. Until that exists, v2 is a claim.
