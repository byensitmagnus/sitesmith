---
title: "Task-Contracts Autopsy — Failure Modes"
ai_generated: "(C)"
---

# Failure Modes

Each entry: the mechanism, the concrete way it breaks, and the citation.

## From ai-dev-tasks

- **Mandatory branch task fires with no signal it was needed**
  (`generate-tasks.md:17`, "IMPORTANT: Always include task 0.0"). This is a rule executed
  unconditionally rather than judged from context — it directly conflicts with Magnus's own
  solo-dev, direct-to-branch workflow, and is the class of mechanism Fact 1 penalizes: a decision
  moved into a script rather than left to the model's judgment. **Reject.**

- **Junior-developer audience framing adds explanatory padding for a reader who doesn't exist**
  (`create-prd.md:67-69`, `generate-tasks.md:68-70`). In an agent-to-agent handoff, writing for "a
  junior developer" means padding the spec with things a capable executing model doesn't need —
  the opposite of the terse, 55-line skill that won on Fact 1. **Reject.**

- **The full 9-section PRD template is heavier than most SiteSmith briefs need**
  (`create-prd.md:53-65`). Mandating Introduction/Goals/User Stories/Functional
  Requirements/Non-Goals/Design Considerations/Technical Considerations/Success
  Metrics/Open Questions for every brief, including a one-page landing site, is exactly the kind
  of unconditional structure that adds tokens without adding value on small tasks. Only two of the
  nine sections (Non-Goals, Success Metrics) survive into `MECHANISMS.json` as adopted; the rest
  are dropped for proportionality, matching the reject reason "adds complexity without measurable
  value" on small builds.

- **Checkbox-state files multiplying**
  (`generate-tasks.md:43-50`, general risk). The mechanism itself is fine at one file; the failure
  mode is proliferation — a state file per phase or per parallel "world," which is structurally
  identical to the 139-file sprawl that already lost to a 55-line skill (Fact 1). Any adaptation
  must cap it at one file per build.

- **Literal "Go" as the confirmation signal is brittle outside a live chat turn**
  (`generate-tasks.md:17-18`). In a non-interactive or long-running agent context (see this user's
  own Grok/Claude long-run autonomy rules), waiting for an exact string match either stalls
  forever or gets bypassed by a differently-worded approval, silently defeating the gate.

## From before-implementing (grill-for-unknowns)

- **Domain-modeling file infrastructure applied by default**
  (`references/domain-modeling-add-on.md:1-95`). `CONTEXT.md`/ADR generation is explicitly meant to
  be lazy ("do not add ... until there is something worth recording," line 34), but if a rebuilt
  SiteSmith applies it to every build regardless of complexity, it reintroduces the exact
  file-sprawl shape that already lost once. This is a real risk specifically *because* the
  mechanism is well-designed and easy to over-apply — the safeguard (lazy creation, three-part ADR
  gate) has to be enforced, not just described.

- **Formal post-implementation quiz as default reporting format**
  (`SKILL.md:188-199`). The quiz format is explicitly for "complex work needing pre-merge
  understanding" — applied to every build (including a one-page site) it becomes padding that
  actively conflicts with this user's own ADHD-reader house format (conclusion-first, max 5
  bullets, no restatement). See `INSTRUCTIONS.md` §5 in this user's global CLAUDE.md.

- **Five-role subagent split for every build**
  (`SKILL.md:201-211`). Docs scout / codebase scout / prototype scout / implementer / reviewer is
  designed for genuinely complex, multi-surface work. Applied to a single landing page it multiplies
  context cost for no benefit, and it duplicates this user's already-standardized fan-out mechanism
  (`context-diamond` skill) rather than composing with it — running both would be two competing
  fan-out protocols in the same skill.

- **Blindspot pass without its trigger condition becomes an unbounded research spiral**
  (`SKILL.md:134-136`). The pass is scoped to "unfamiliar domain... or high-stakes integration." If
  a rebuilt SiteSmith drops that gate and runs a docs/source/tests scan on every build regardless of
  familiarity, it turns a targeted risk-check into open-ended research that never converges — the
  same practical failure as the over-long original package, just spent on research instead of rules.

- **"Low-risk and local" in the deviation policy is a judgment call that can misfire**
  (`SKILL.md:182-186`). Without concrete examples of what counts as user-facing versus local, an
  agent building a website (where almost everything is, in some sense, user-facing) may
  misclassify a real visual change as "local" and silently proceed when it should have stopped.
  Needs website-specific examples to actually bite (see `sitesmithForm` field in
  `MECHANISMS.json` for the proposed fix).
