---
title: CONTEXT-STRATEGY — scroll-world
ai_generated: "(C)"
---

# Measured sizes

```
SKILL.md              762 lines / 50,306 chars  (≈12,600 tokens at 4 chars/token)
references/prompts.md   170 lines / 10,156 chars
references/pipeline.md  306 lines / 16,526 chars
references/scrub-engine.js 448 lines / 29,145 chars
references/index-template.html  73 lines / 2,786 chars
references/knockout.py  89 lines / 2,944 chars
```
(`wc -c`/`wc -l` on each file, verified directly.)

The always-loaded entry point (`SKILL.md` alone) is **~12,600 tokens** for one narrow
capability (scroll-scrubbed diorama landing pages). The measured comparison point from
this project's own benchmark is the Anthropic `frontend-design` skill: a single 55-line,
~2,078-token file that beat SiteSmith's full 630k-token/139-file package 59-to-40 on an
identical brief. `scroll-world`'s entry point alone is already ~6x that winning file's
size, before counting a single reference file, for a capability with a far narrower scope
than "design any website."

# Progressive disclosure is present but under-applied

The skill does route reference material out of the main file correctly in principle —
`references/prompts.md`, `pipeline.md`, `scrub-engine.js`, `index-template.html`, and
`knockout.py` are each named at the specific step they're needed
(`WORKFLOW-MAP.md` has the full mapping), and nothing is pre-loaded speculatively.

But `SKILL.md` itself still inlines large blocks of heavy, rarely-needed vendor detail
that arguably belong in a deferred reference file instead of the always-loaded entry
point:

- The render-tier/pricing table and Monid-vs-Higgsfield cost breakdown
  (`SKILL.md:151-198`, ~47 lines) — pure reference data (dollar figures, token-pricing
  formulas) that could sit in `pipeline.md` and be pointed to rather than reproduced.
- The full video-model capability table (`SKILL.md:284-297`, ~14 lines) plus the Monid
  backend qualification section (`SKILL.md:324-367`, ~44 lines) — schema/pricing detail
  that changes with vendor API updates (the source says so itself, `SKILL.md:735-738`)
  and is exactly the kind of volatile, rarely-read-in-full material progressive
  disclosure exists to keep out of the hot path.

Rough accounting: those three blocks alone are ~105 of the 762 lines (≈14%) of the
always-loaded file, and they're the least stable content in the whole skill (pricing and
endpoint schemas that the source itself warns will drift).

# What this means for a rebuilt SiteSmith

The measured fact this project already has (2078 tokens beat 630k tokens on the same
brief) argues for a SiteSmith entry point closer to `frontend-design`'s size than to
`scroll-world`'s — favoring prose that changes the model's *reasoning* over large
reference tables the model mostly doesn't need to see per-build. If SiteSmith adopts any
piece of this skill (the scrub engine, the encoding recipe), it should land as a
reference file loaded only when a scroll-video build is actually chosen, never inlined
into SiteSmith's main procedure file — and none of the volatile vendor-pricing pattern
this source falls into should be replicated at all.
