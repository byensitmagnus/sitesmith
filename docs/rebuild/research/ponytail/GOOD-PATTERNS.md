---
title: GOOD-PATTERNS — ponytail
ai_generated: "(C)"
---

# The core reasoning artifact stays small no matter how big the repo gets

`skills/ponytail/SKILL.md` is 120 lines / 6,757 characters (~1,690 tokens) — smaller than
frontend-design's 55-line file is not, but in the same order of magnitude, and the whole repo
around it is 156 files / 3.1 MB. The sprawl (13 platform-adapter dirs, MCP server, Pi extension,
benchmark harness) is entirely in *distribution*, not in the thing the model actually reads to
decide what to build. SiteSmith's own 630k-token package mixed both together; ponytail's split is
worth copying even though its distribution half is not (see `MECHANISMS.json` →
`cross-platform-portability-plumbing`, rejected).

# Zero runtime dependencies

Root `package.json` declares 0 entries under `dependencies` — `node --test` (built into modern
Node) is the entire test runner (`package.json:36-37`). The correctness benchmark itself follows
the same discipline: `benchmarks/agentic/judge.py` uses `urllib.request` for its one HTTP call
specifically to avoid a `requests` dependency (judge.py:16: "stdlib urllib for the API call, no
requests dependency"). A skill preaching dependency discipline that itself carries dependencies
would be an obvious credibility gap; it doesn't.

# The safety carve-out lives in the same file as the instruction it limits

`SKILL.md:90-105` ("When NOT to be lazy") sits in the same document as the simplicity ladder, not
in a separate best-practices file the model might not load. Directly measured to matter: the
adversarial safety tier of the agentic benchmark shows ponytail at 100% safe (20/20) against a
bare "prefer one-liners" prompt without this carve-out at 95% (19/20), the one slip being a
path-traversal guard dropped (`benchmarks/results/2026-06-18-agentic.md:130-147`).

# Every benchmark claim in the README is walked back to the honest number, not deleted

The README keeps the original single-shot 80-94% figure visible in a `<details>` block
(`README.md:75-86`) while stating plainly above it that the agentic re-run is "the honest,
defensible number" (`benchmarks/README.md:64-71`). This is the single most transferable practice
for SiteSmith given its own history of an inflated internal claim (18-run showcase study, later
found to be 0/8 on portfolio diversity) — publish the correction next to the original, not instead
of it.

# The one-shot skills declare their own non-goals

`ponytail-review` and `ponytail-audit` both state, verbatim, "Correctness bugs, security holes, and
performance are explicitly out of scope. Route them to a normal review pass" (SKILL.md files,
review:52-53, audit:38-39). This keeps each skill testable against a narrow claim instead of an
unbounded one.

# The judge is checked before it is trusted

`benchmarks/agentic/judge.py:120-137` requires the LLM judge to separate a known-over-engineered
reference from a known-minimal one before any real submission is scored, and the run refuses to
proceed if it can't (`judge.py:180`: "judge not trustworthy; refusing to judge the matrix"). This
is the strongest single mechanism in the source for SiteSmith's hardest open problem — judging
visual distinctiveness, which similarly resists a deterministic check.
