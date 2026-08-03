---
title: LOOPS — ponytail
ai_generated: "(C)"
---

# No self-critique loop inside the skill itself

Unlike frontend-design's brainstorm→explore→plan→critique→build→critique-again process, ponytail's
core skill (`skills/ponytail/SKILL.md`) is a single pass: read the ladder, apply it, ship. The
closest thing to a loop is the instruction to "question the complex request in the same response"
when shipping the lazy version (SKILL.md:62) — a one-shot self-check folded into the same turn, not
a separate revisit pass.

# The debt ledger is the closest thing to a deferred loop

`ponytail-debt` (`skills/ponytail-debt/SKILL.md`) is explicitly designed as the second half of a
two-step loop that spans sessions: step 1 (any session) marks a shortcut with a `ponytail:` comment
naming a ceiling and upgrade trigger; step 2 (a later, separate invocation) harvests all markers
into a ledger and flags any with `no-trigger` as rot risk. This is a real cross-session loop, but it
is entirely manual — nothing schedules or forces the harvesting step to run; a user has to remember
to invoke `/ponytail-debt`.

# The benchmark methodology loop (external, project-level)

At the project level (not the skill's runtime), there is a genuine iterate-and-correct loop visible
in the commit/issue history referenced in the docs: single-shot benchmark → critique (issue #126) →
rebuilt agentic benchmark → contamination bug found and fixed → corrected numbers published
alongside the original (`benchmarks/results/2026-06-18-agentic.md:1-47`). This is a real
verification loop, but it operates on the *benchmark*, not on any individual code-generation
session — it does not run automatically per-use.

# The judge selftest is a pre-flight loop, not a per-answer loop

`judge.py --selftest` (lines 120-137) must pass before `--run` proceeds (line 179-181) — this is a
gate that runs once per benchmark invocation, not a loop that re-scores or revises any individual
judgment. It validates the judge's discriminating power up front, then trusts it for the whole
batch; there is no per-item recheck.

# What SiteSmith should note

Ponytail deliberately has no build-time critique loop analogous to frontend-design's — its
simplicity ladder is meant to prevent over-building at generation time rather than catch it after
the fact (that job is explicitly handed off to the separate, on-demand `-review`/`-audit` skills,
which are also single-pass, not iterative). For SiteSmith, the actionable takeaway is that a
self-critique loop for *simplicity/proportionality* (as distinct from the visual-distinctiveness
loop already documented in `frontend-design`'s autopsy) does not need to be a full iterate-until-
converged loop — a one-shot audit skill invoked after the build, in the pattern of
`ponytail-review`, is sufficient and matches this source's own design choice.
