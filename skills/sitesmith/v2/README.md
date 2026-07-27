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
| [05-evidence.md](05-evidence.md) | Before anything visual. What the subject's world is actually made of. |
| [10-core.md](10-core.md) | Once per build. Sixty rules that hold in every mode. |
| [modes/](modes/README.md) | After routing. One outcome per topic for the mode you are actually in. |
| [20-direction-lab.md](20-direction-lab.md) | Three structurally different comps, one chosen with reasons. |
| [25-assets.md](25-assets.md) | The asset manifest, and the state each asset is in. |
| [30-contract.md](30-contract.md) | **After** the direction is chosen. Written from the winning comp. |
| [40-interaction.md](40-interaction.md) | The interaction contract and the journeys that exercise it. |
| [50-critique.md](50-critique.md) | After the technical gate is green. The visual judgement, separately. |
| [../blocks/](../blocks/README.md) | While building. Structure, semantics, states, responsive — never the look. |

Sixty core rules plus one mode file is what an agent holds while working; the rest are read at
their step and put down again. A rule enters the core only by displacing one.

## What changed in v2.1

v2 fixed the rules. It did not fix the output, and the [audit of the nine legacy
pages](../../../docs/v2/LEGACY-VISUAL-AUDIT.md) says why: six of nine could be rebadged for a
different company by editing the logo and the copy, all nine use the same OS font stack, all
nine build a palette from one recipe with a rotated hue, three ship an empty coloured square
as a logo, and there is not one `<script>` tag in the whole set, so every state in it was
painted rather than reached.

Five changes follow from that, and each is aimed at one line of the audit.

**Evidence before design.** A page designed from a brief alone can only look like its
category. `05-evidence.md` goes and looks at the subject first.

**Three directions, then the contract.** `20-direction-lab.md` requires three *structurally*
different comps and records why two lost. `30-contract.md` moved after it: fixing a spacing
step and a three-value ink ramp before anyone asks what the page should be is precisely how
nine subjects arrived at the same ramp.

**Assets are a tracked deliverable.** `25-assets.md` gives every asset a state, and
`production-gate.mjs` fails a build that ships one that is not `ready`. A labelled placeholder
is honest and is still not finished.

**States must be reachable.** `40-interaction.md` requires at least one Playwright journey per
surface that drives the real page and asserts what changed. A styled state nobody can enter is
a picture of a state.

**Two gates, not one.** The technical gate asks whether it works. `50-critique.md` asks whether
it is any good, on screenshots, blind, after the first is green. Merging them is how "PASS"
came to be read as "this is good".

Two smaller consequences: the mode files now state **outcomes** rather than defaults — there is
no default hero, no mode radius and no mode spacing, because a named default is what gets
reached for — and blocks are restricted to structure, semantics, states and responsive
behaviour, because a block that carries art direction makes every site that uses it look
like every other one.

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
