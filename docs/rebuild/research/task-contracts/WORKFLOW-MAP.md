---
title: "Task-Contracts Autopsy — Workflow Map"
ai_generated: "(C)"
---

# Workflow Map

Paths relative to `BASE` defined in `OVERVIEW.md`.

## ai-dev-tasks: linear, human-gated, three-file pipeline

```
User idea
   │
   ▼
create-prd.md  ── AI asks 3-5 lettered clarifying questions (create-prd.md:9-10,14-23)
   │               then writes prd-[feature-name].md to /tasks/ (create-prd.md:71-75)
   │               "Do NOT start implementing the PRD" (create-prd.md:79)
   ▼
generate-tasks.md ── Phase 1: parent tasks only, task 0.0 = create branch is mandatory
   │                  (generate-tasks.md:17), presented to user
   │                  ── STOP, wait for literal "Go" (generate-tasks.md:17-18)
   ▼
   ── Phase 2: sub-tasks + Relevant Files list, saved to tasks-[feature-name].md
   │
   ▼
Sequential execution ── one sub-task at a time, checkbox flipped [ ]→[x] in the same file
                         after each sub-task, not after the whole parent (generate-tasks.md:43-50)
```

There is no branching: every feature goes through both files in the same order, and the only gate
is the human "Go". Task state lives nowhere but the markdown file itself — no separate database,
no JSON.

## grill-for-unknowns: a loop with an explicit exit condition, not a pipeline

```
Request arrives
   │
   ▼
Applicability check: "When to Use" vs "Do not use when" (SKILL.md:27-42)
   │  (trivial/unambiguous/low-risk tasks skip the whole skill)
   ▼
1. Restate the map (SKILL.md:52)
2. Read the territory — docs/source/tests/config (SKILL.md:53, 78-88)
3. Open grill-session.md ledger IF complex enough (SKILL.md:54)
4. Build unknowns ledger — classify into 4 quadrants (SKILL.md:55, 65-74)
5. Build domain ledger — fuzzy terms (SKILL.md:56)
   │
   ▼
6. Grill loop: ── ask ONE material+grounded+answerable question (SKILL.md:57,92-118)
   │              using template: question/why/evidence/recommended default
   │              budget ~5 blocking questions (SKILL.md:124)
   │              fatigue valve: short/impatient answers → stop asking, batch remaining as
   │              defaults for veto (SKILL.md:125-126)
   │        ◄──── loop continues until unknowns ledger is empty (SKILL.md:48)
   ▼
7. Propose defaults for low-risk unknowns (SKILL.md:58)
8. Persist to CONTEXT.md / offer ADR if hard-to-reverse+surprising+real-tradeoff (SKILL.md:59,
   references/domain-modeling-add-on.md:66-74)
9. Create/revise plan, leading with likely-to-change decisions (SKILL.md:60, 166-176)
10. STOP — confirmation gate before build, unless user explicitly authorizes proceeding with
    labeled assumptions (SKILL.md:61)
   │
   ▼
11. During implementation: continue-and-log vs stop-and-ask, docs win over the original map
    (SKILL.md:62, 178-186)
12. Post-implementation: explainer + quiz, every quiz item answerable from the report itself
    (SKILL.md:63, 188-199)
```

Branch points that don't exist in ai-dev-tasks:
- Unknown-knowns branch: user can't verbalize taste → build prototypes/contrasting references
  instead of asking a question (SKILL.md:104, 157-165).
- Unknown-unknowns branch: blindspot pass over docs/source/tests before the interview even starts,
  only triggered for unfamiliar-domain/high-stakes work (SKILL.md:134-136).
- Subagent branch: launch packet + 5-role split (docs scout/codebase scout/prototype
  scout/implementer/reviewer) only when spawning subagents (SKILL.md:201-211).

## Where the two would meet in a single SiteSmith build

ai-dev-tasks answers "what are we building and in what order" (scope, sequencing, done/not-done
state). grill-for-unknowns answers "do we actually know enough to start, and where's the taste gap
that a spec can't capture." They are complementary layers, not competitors — but neither is a
website-specific design mechanism; both are meta-process wrappers around whatever the model does
with them. See `VERDICT.md` for what that means for adoption.
