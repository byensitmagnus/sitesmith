---
title: "Task-Contracts Autopsy — Verdict"
ai_generated: "(C)"
---

# Verdict

## Is `before-implementing` the artifact the requester meant?

Yes, with one caveat stated plainly: the local folder is named `before-implementing`, but its
actual content — the only content — is one plugin, `nicobailon/grill-for-unknowns` v0.1.3, MIT.
Read cover to cover (`SKILL.md`, both READMEs, both LICENSEs, `NOTICE.md`, `CHANGELOG.md`, both
reference files, all five templates), it directly and substantively implements every term in the
requester's contract: investigate-before-asking (the blindspot pass, `SKILL.md:78-88,134-155`),
goal restatement (`SKILL.md:52`), blocking questions (`SKILL.md:92-118`), assumptions
(`SKILL.md:57-58`, `templates/grill-session.md:81-83`), proportional planning
(`SKILL.md:27-42`), approval gates (`SKILL.md:61`), and stop-on-invalidated-assumption
(`SKILL.md:182-186`). It is not a same-named-but-different artifact wearing a similar coat — it is
a genuine, well-documented, self-disclosed fork of Matt Pocock's `grilling`/`domain-modeling`/
`grill-with-docs` skills plus one external article, and its own `CHANGELOG.md` shows real
iteration against a real failure mode (user exhaustion from over-questioning, v0.1.2). Treat it as
confirmed for this autopsy's purposes.

## Judged against the two measured facts

**Fact 1 (55-line skill beat 630k-token/139-file package 59-40):** both sources pass this test
where they stay short and judgment-based, and fail it where they turn into unconditional structure.
`ai-dev-tasks`' mandatory branch task and full 9-section PRD template are rejected/trimmed for
exactly this reason — they are decisions moved into a script rather than left to model judgment.
`grill-for-unknowns`' domain-modeling file infrastructure and five-role subagent split are adapted
down for the same reason: well-designed, but only cheap when actually gated by their own stated
trigger conditions, and a real risk of recreating file-sprawl if those gates are dropped during
implementation. The mechanisms that survive cleanly — the unknowns taxonomy, the question-quality
bar, the blindspot pass, the deviation policy, the calibration paragraph itself — are all one
short table or a few lines of judgment-guiding text, never a lookup table mapping inputs to fixed
outputs.

**Fact 2 (three briefs converged on one house style, showcase 0/8):** this is where
`grill-for-unknowns` earns its keep and `ai-dev-tasks` has almost nothing to offer. Neither PRD
sections nor task checklists address visual/taste diversity at all — that entire failure mode is
outside ai-dev-tasks' scope (it is a feature-development workflow, not a design workflow). The one
mechanism in either source that directly targets the convergence problem is
`unknown-knowns-prototypes` (`SKILL.md:104,157-165`): route taste to contrasting prototypes instead
of silently defaulting or asking an unanswerable question. This is the single highest-value finding
of this entire autopsy.

## What to actually take

Adopt without much modification: `unknown-knowns-prototypes`, `four-quadrant-unknowns-taxonomy`,
`blocking-question-template-with-budget`, `blindspot-pass`, `deviation-policy`,
`calibration-over-under-constrain`, `self-contained-packaging-lesson`,
`clarifying-questions-before-spec`, `map-vs-territory-framing`.

Adapt down (keep the judgment rule, drop the always-on file/formality infrastructure):
`prd-non-goals-and-success-metrics`, `two-phase-approval-gate`, `checkbox-state-in-file`,
`domain-modeling-context-adr`, `post-implementation-explainer`, `launch-packet-role-split`.

Reject outright, with reasons already stated in `MECHANISMS.json`: `junior-dev-audience-framing`
(wrong audience for an agent-to-agent handoff), `mandatory-branch-task` (unconditional rule,
conflicts with this user's own workflow).

## notApplicable

Neither source contains any mechanism for the thing this project's own history shows is its actual
weak point: *deciding what a website should look like*. `ai-dev-tasks` is scoped entirely to
feature-development process (PRD → tasks → sequential execution) and never touches visual/design
decisions — it would apply identically to a backend API as to a landing page, which means it has
no opinion on the one axis SiteSmith failed on. `grill-for-unknowns` gets closer (the unknown-knowns
mechanism is genuinely about taste) but stops at "extract taste via contrast" — it does not itself
supply any design taste, style vocabulary, or visual judgment; it is a *process* for surfacing taste
the user already has, not a source of taste for cases where the user has none to surface. Both
sources are, correctly, general-purpose software-process tooling: useful for how SiteSmith manages
its own build loop, contributing nothing to what SiteSmith should actually generate. That gap has to
be filled by SiteSmith's own design-knowledge sources (the four licensed skills already named in
this project's `CLAUDE.md`), not by either source in this autopsy.

Also not applicable: the jest/unit-test file-pairing convention in `generate-tasks.md:29-36` — it is
a generic software-engineering testing convention, not adopted as its own mechanism since SiteSmith's
verification gate (`scripts/verify.mjs`) already covers the equivalent ground with a different,
website-appropriate method (screenshots, axe, console errors, dead links) rather than unit tests.
