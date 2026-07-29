# What three independent builders found in the skill

> Path 2: one fresh agent per pilot, no shared conversation, workspace, screenshots or knowledge
> of the others. Same frozen skill, same briefs, same evidence packs, same assets, same rubric.
> This file records what the arrangement exposed about **SiteSmith**, separately from what the
> reviewers say about the pages.

## Finding 1 — the axis record has no stated format, so a gate cannot read it

`direction-fidelity.mjs` parses `DIRECTION.md` for five axes and checks the built page against
each one. It looks for lines of the form:

```
- composition: …
- type: …
- colour: …
- imagery: …
- rhythm: …
```

The cask-console builder wrote its axes as prose headings instead:

```
- **Rhythm and edge.** Three unequal blocks, graded row height, type size and rule weight …
```

The gate then read `type` as `undefined` and failed the page for declaring nothing. It also
could not check the colour axis or classify imagery or rhythm.

**This is SiteSmith's fault, not the builder's.** The agent read `SKILL.md` and `PIPELINE.json`,
followed the direction lab, wrote a considered `DIRECTION.md` with three rejected alternatives
and a reasoned winner — and produced a document the toolchain cannot parse, because nothing in
the skill states the format the parser requires. The two lines it *did* get right,
`signature-selector` and `signature-min-share`, were right because the dispatch prompt spelled
them out. Every line the skill alone had to convey, it failed to convey.

The single-author rounds never surfaced this: the author wrote the parser and the documents, so
the contract lived in one head. Three strangers is the only arrangement that could have found
it, and it found it in the first build.

**What it costs:** a gate that silently reads `undefined` and reports a failure that is a
formatting mismatch rather than a design fault. A builder following that signal would change the
typeface of a page that was never wrong.

**The fix, when this run is finished:** `v2/20-direction-lab.md` states the axis block
verbatim, `PIPELINE.json`'s `choose` step names it as the produced artefact's required shape,
and `direction-fidelity.mjs` reports "the axis record is missing or not in the documented form"
instead of failing the page for what it declared. That is a documentation and diagnostics fix.
It is not a change to what any gate accepts, and it is not a patch to any page.

## Finding 2 — the skill does not ship its own test dependencies

Each workspace received the skill by `bin/sitesmith.mjs install`, which is the supported route.
`verify.mjs` then reported `axe violations: not run`, because axe-core is not part of what the
installer places — it is a dependency of the repository the script normally runs inside.

The builder did not notice, because "not run" is not "failed". Run from a directory that has
axe, the same page scores zero violations at three widths in both schemes, so nothing was
actually wrong with the page — but a builder installing SiteSmith into a fresh project would
have shipped believing the accessibility gate had passed.

`doctor` does check for axe-core and would have said so. Nothing in the install output tells a
new user to run `doctor` first, and the builder had no reason to.

## The control arm

Five rounds by one author are tagged `rounds-1-5-single-author`, with every score and criticism
from ten blind reviewers under `docs/v2/preflight/`. Medians: 6.5, 6, 6. That is the number the
three independent builds are being compared against, on the same subjects with the same inputs.
