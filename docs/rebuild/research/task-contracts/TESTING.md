---
title: "Task-Contracts Autopsy — Testing"
ai_generated: "(C)"
---

# Testing

Neither source ships an automated test suite — both are markdown instruction packages, not code.
"Testing" here means: what verification behavior does each source *prescribe*, and how would a
rebuild verify that the prescribed behavior is actually followed.

## ai-dev-tasks: verification is implicit in the review loop, never specified as a method

Nothing in either file names a concrete verification method (no "run the tests," no "check the
build"). Verification is entirely delegated to the human reviewer at each sub-task checkpoint
(`README.md:59-71`). The `generate-tasks.md` output format asks for a `Notes` section naming how to
run tests for the *feature being built* (e.g. `npx jest [path]`, `generate-tasks.md:41`) — but that
is instruction for the generated task list's own project, not a self-check on whether the PRD/task
workflow itself worked. There is no equivalent of SiteSmith's own `scripts/verify.mjs` gate anywhere
in this source.

## before-implementing: two explicit checklists, one per phase boundary

`SKILL.md:218-235` defines two verification checklists as literal gates:

**Before moving from planning to implementation** (`SKILL.md:220-228`):
- Docs/source/tests/config were inspected, or the lack of access is stated.
- All four unknown quadrants are listed.
- Blocking questions are material and include recommended defaults.
- Low-risk unknowns are converted to labeled assumptions, not left as open questions.
- The plan leads with likely-to-change decisions, not mechanical steps.
- Deviation policy is explicit for long-running/subagent work.
- Verification gates are defined *before* implementation begins.

**Before finalizing implementation** (`SKILL.md:230-235`):
- Deviations and newly discovered unknowns were logged.
- Tests/checks/manual verification were *actually run and reported* — not claimed.
- Remaining assumptions are visible.
- The user/reviewer gets a sufficient explainer.

The load-bearing phrase is "actually run and reported" (`SKILL.md:233`) — this is an explicit guard
against an agent claiming verification happened without evidence, which is the same failure mode
this user's own house rule targets directly: "Stol aldrig på en rapporteret grøn status. Kør testen
selv" (global CLAUDE.md, rule 9). Two independent sources (this skill's author, and this user's own
standing instruction) converge on the same anti-pattern.

Separately, for subjective/visual outputs that no automated test can check, the unknown-knowns
mechanism prescribes distilling the user's reaction to prototypes into "a short rubric that becomes
the verification gate" (`SKILL.md:164`) — a concrete answer to "how do you test taste," which
neither ai-dev-tasks nor most test frameworks address at all.

## Implication for the SiteSmith rebuild

Both checklists (`SKILL.md:220-235`) are cheap (16 short lines total) and map cleanly onto the
existing `scripts/verify.mjs` gate this project already enforces (per `CLAUDE.md` in this repo):
the pre-implementation checklist becomes a pre-build gate for intake completeness, and the
pre-finalize checklist becomes an explicit reminder to actually run `verify.mjs` and report its
real output rather than assert success. The rubric-from-reaction idea
(`MECHANISMS.json:unknown-knowns-prototypes`) is the only mechanism in either source that offers a
verification method for the exact axis SiteSmith's own showcase evaluation failed on — visual/taste
quality — and should be adopted alongside the existing screenshot/axe/console checks, not instead of
them.
