# The control arm was not clean, and this is how it was found

Found while freezing the evidence, after the verdict was sealed and decoded. It does not
change who won. It changes what the win is evidence *of*, so it is recorded here rather than
folded into `RESULT.md` after the fact.

## What arm P was supposed to be

"Plain Sonnet, no SiteSmith, no tooling." The prompt was written to say nothing about the
product. It does not: `grep -i sitesmith` over arm P's prompt in
`workflows/scripts/rendered-02-build-p-*.js` matches two lines, and both are filesystem paths —
the workspace, which lives under a directory named for this repo, and the Playwright
dependency directory, which is `C:/Users/Usmo1/Documents/sitesmith/benchmarks/node_modules`.

## What arm P actually knew

Its own `builds/P/DIRECTION.md` opens with a scope note naming three things it could not have
invented:

> `direction-check.mjs`, `direction-history.mjs`, and a cross-project ledger at `~/.sitesmith/`

All three exist in exactly one place in this repo:

```
skills/sitesmith/scripts/direction-check.mjs
skills/sitesmith/scripts/direction-history.mjs
skills/sitesmith/v2/20-direction-lab.md      (the ~/.sitesmith ledger)
```

`skills/sitesmith/` is the **legacy v2 tree**. So arm P read SiteSmith's legacy method
material, understood its direction-lab procedure well enough to explain which parts of it it
was declining to run and why, and then built to a scoped-down version of that method. It also
wrote its screenshots to `.sitesmith/shots/` and referred to running `journey.mjs`.

The entry channel was a path. The prompt handed it an absolute path inside this repository for
its browser dependency, and the repository is two directories above it.

## The same defect hit both arms

D-C in `RESULT.md` is that `skills/sitesmith/` (legacy v2) sits beside `skills/sitesmith-v3/`
(live), both named for the product, and that this misled arm S into deleting its own finished
build.

The same tree also fed the control arm. **One repo-layout defect produced both the destructive
rebuild in the treatment arm and the contamination of the control arm.** That is one root
cause, not two coincidences.

## What this does and does not do to the result

**Unchanged.** The judge compared two finished websites. The external checker measured both
with the same code. Arm S shipped 6 serious accessibility violations on its receipt page, a
masthead whose logo runs into its own tagline, and a signature diagram cut mid-word. Those are
measured facts about the built site and no amount of contamination in the other arm makes them
untrue.

**Changed.** Arm P cannot be described as naive. Specifically:

- The claim that P "independently reinvented much of SiteSmith's artifact set unaided" —
  `DIRECTION.md`, `DESIGN-SYSTEM.md`, `INTERACTIONS.md`, `journeys/`, its own `verify.mjs` —
  **is withdrawn.** Those names and that shape are in the material it read. It may still have
  reached them alone; this evidence cannot show that, so the claim is not available.
- "SiteSmith lost to plain AI" overstates it. What this pilot measured is closer to: *the
  pipeline lost to a competent agent that had read the pipeline's own method notes and applied
  them by hand, at a third of the cost.* That is a harder result for the pipeline, not a
  softer one — but it is a different claim and only the different claim is supported.

## The same channel was open in pilot 01

`workflows/scripts/rendered-01-build-p-*.js` line 8 carries the identical dependency path.
Rendered pilot 01's control arm had the same access. Whether it used it has not been checked;
that evidence has not been frozen into this repository.

## The fix this implies, not made here

A control arm must not be handed a path inside the product's own repository. The dependency
directory should be copied or linked into the arm's workspace, or exposed under a path that
names nothing, before any further pilot runs. Written down, not implemented: the product does
not change while the evidence is being frozen.
