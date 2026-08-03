---
title: "Task-Contracts Autopsy — Good Patterns"
ai_generated: "(C)"
---

# Good Patterns

Ranked by expected value to the SiteSmith rebuild. Full evidence for each is in `MECHANISMS.json`;
this file is the short version.

1. **Route taste to prototypes, not questions** (`unknown-knowns-prototypes`,
   `plugins/grill-for-unknowns/SKILL.md:104,157-165`). The single highest-value mechanism found.
   It bans asking the user to verbalize taste they can only recognize when shown, and instead
   requires 2-3 genuinely contrasting directions. This is the one concrete, testable fix for the
   showcase 0/8 convergence problem — and it costs a few lines of instruction, not a lookup table.

2. **Four-quadrant unknowns taxonomy** (`four-quadrant-unknowns-taxonomy`, `SKILL.md:65-74`). One
   short table that gives the model an explicit branch for "this is taste, not fact" versus "this
   is a risk nobody named" versus "this is answerable from docs." Without it, all uncertainty
   collapses into "ask a question," which is what produces a generic default when the user is
   tired of answering.

3. **Blocking-question quality bar + exit conditions** (`blocking-question-template-with-budget`,
   `SKILL.md:92-126`). Material + grounded + answerable, a ~5-question budget, and a fatigue valve
   that converts remaining unknowns into one batched assumptions list. This is a *documented fix*
   for a real failure mode (see `CHANGELOG.md:13-25` in `before-implementing`) — not a hypothesis.

4. **Blindspot pass before interviewing** (`blindspot-pass`, `SKILL.md:134-155`). Investigate
   docs/source/tests for undiscovered risk before asking the user anything. This is the clearest
   match to the requester's "investigate-before-asking" contract term.

5. **Deviation policy** (`deviation-policy`, `SKILL.md:182-186`). A three-branch rule — continue
   and log low-risk local issues, stop and ask for anything user-facing/architectural, and trust
   docs over the original plan — that avoids both silent wrong turns and constant check-ins during
   an autonomous build.

6. **Calibration principle** (`calibration-over-under-constrain`, `SKILL.md:213-216`). Four lines
   that name both failure directions this project has already measured: over-specification (the
   losing 630k-token package) and under-specification (the house-style convergence). Cheap enough
   to keep verbatim as an editorial principle for the rebuilt skill.

7. **Self-contained packaging** (`self-contained-packaging-lesson`, `README.md:159-165`). An
   unrelated author independently re-derived "ship one self-contained skill, don't depend on other
   skills being installed" — direct corroborating evidence for this rebuild's own stated goal of
   one unified skill.

8. **Clarifying questions capped and lettered** (`clarifying-questions-before-spec`,
   `ai-dev-tasks/create-prd.md:9-10,14-23`). Independently converges with pattern 3 above from an
   unrelated repo: cap questions, ask only where the brief is genuinely silent, make the answer
   trivial to give. Two unrelated sources landing on the same idea is a stronger signal than either
   alone.

9. **Two-phase approval gate before granular detail** (`two-phase-approval-gate`,
   `ai-dev-tasks/generate-tasks.md:17-18`, converges with `SKILL.md:61`). Confirm the high-level
   shape before spending tokens on the detailed breakdown.

10. **One flat state file, checked off per step** (`checkbox-state-in-file`,
    `generate-tasks.md:43-50`). Cheap execution-state tracking for a long build — as long as it
    stays one file, not one per phase/world (see `FAILURE-MODES.md` for why that distinction
    matters here specifically).
