# What the rendered pilots may be cited as

Methodology, written after the fact and kept apart from the results it is about. Nothing in
`docs/lab/rendered-pilot-02-damgaard/` has been edited: `RAW-VERDICT.json`, `RESULT.md`,
`RESULT.json`, `SEALED-MAPPING.json` and the 24 screenshots stand exactly as they were
produced. This file says what they support, and the correction lives beside them rather than
inside them.

## Rendered pilot 02 — Damgaard Estrik

**Supported.** It measured a real, defective SiteSmith build. Six serious accessibility
violations on the receipt page, a masthead whose logo runs into its own tagline at every
width, a signature diagram cut mid-word, and 3.1 times the tokens of the other arm. Every one
of those is a measurement on the built site, reproducible from
`docs/lab/rendered-pilot-02-damgaard/REPRODUCE.md` without a model.

**Not supported.** A clean comparison of SiteSmith against plain AI. The control arm was handed
an absolute dependency path inside this repository, and its own `DIRECTION.md` names
`direction-check.mjs`, `direction-history.mjs` and the `~/.sitesmith` ledger — three things
that exist only under `skills/sitesmith`, the legacy v2 tree. It read the product's own method
material. The full account is in that folder's `CONTAMINATION.md`.

The claim that arm P "independently reinvented much of SiteSmith's artifact set unaided" is
**withdrawn**. Those names are in the material it read.

What the pilot supports instead, and it is a harder result rather than a softer one: *the
pipeline lost to a competent agent that had read the pipeline's own method notes and applied
them by hand, at a third of the cost.*

## Rendered pilot 01 — Halgarth

**Status: CONTROL ISOLATION UNRESOLVED.**

The same channel was open. `workflows/scripts/rendered-01-build-p-*.js` line 8 hands the
control arm the identical in-repository dependency path.

That is where the finding stops. **The channel existed. Whether the control used it has not
been checked**, because pilot 01's control artifacts have not been frozen into this repository
and no one has read them for traces. A channel is not a use, and recording it as one would be
the same error in the opposite direction — convicting an arm on opportunity.

To resolve it, someone reads pilot 01's arm-P artifacts for names that exist only in this
repository, the way pilot 02's were read. Until then the pilot 01 result is cited with this
status attached, and it is not cited as a clean comparison either.

## The rule this leaves behind

A control arm receives its workspace, its brief, and generic runtime dependencies at a neutral
path. It does not receive a path inside this repository, product source, skills, benchmark
history, sibling build artifacts or hidden product state — and it is not told not to look,
because telling an agent not to look at something tells it the something is there.

`tools/control-isolation.mjs provision` produces the neutral dependency root.
`tools/control-isolation.mjs check` refuses a workspace that can reach the product.
`tools/test-control-isolation.mjs` holds both, with pilot 02's own configuration pinned as a
shape that must always be refused.

No pilot runs until `check` passes on its arms.
