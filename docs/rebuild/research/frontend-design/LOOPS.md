---
title: LOOPS — frontend-design
ai_generated: "(C)"
---

# Every loop in this package

There is exactly one loop, and it is a single-iteration, self-graded loop with no external critic.

## Loop 1: plan-then-critique-then-build (`SKILL.md:29-39`)

- **Trigger:** the heading itself names the sequence: "Process: brainstorm, explore, plan,
  critique, build, critique again" (`SKILL.md:29`).
- **Step order:**
  1. Brainstorm/plan — produce the 4-part token system (`SKILL.md:33`).
  2. Critique — "review that plan against the brief... if any part of it reads like the generic
     default you would produce for any similar page... rather than a choice made for this specific
     brief — revise that part, say what you changed and why" (`SKILL.md:35`).
  3. Build — "only after you've confirmed the relative uniqueness of your design plan should you
     start to write the code" (`SKILL.md:35`).
  4. Critique again — a second, separate critique pass happens post-build, under "Restraint and
     self-critique" (`SKILL.md:41-43`): remove-one-accessory framing, quality-floor check
     (responsive, keyboard focus, reduced motion), and optional screenshot review.
- **Who criticises:** the same model, in the same context, no second model, no external reviewer,
  no user-in-the-loop checkpoint. "Critique your own work as you build" (`SKILL.md:43`).
- **Can the whole direction be rejected?** Yes, structurally — the instruction requires revising
  "that part" (not necessarily the whole plan) if it reads generic, but nothing prevents a full
  rewrite if multiple parts fail the check. There's no hard gate forcing full rejection versus
  partial patch; the model exercises judgment on scope of the revision.
- **Stop condition:** exactly one critique pass before build ("Only after you've confirmed... should
  you start to write the code," `SKILL.md:35`), then a second, different critique pass after build
  (quality floor + restraint). There is no iteration counter, no "repeat until score > X," no loop
  that can run more than the two named passes. This is a fixed two-critique-pass design, not an
  open-ended refinement loop.
- **Does it actually improve output?** Only externally corroborated, not internally proven: the
  blind test (59 vs 40) is evidence the package as a whole outperforms a deterministic
  template-generator, but nothing in the source isolates the critique step's individual
  contribution. Given the critique step is the only mechanism that operationalizes the anti-cliché
  list (see `MECHANISMS.json` → `self-critique-loop`, `named-cliche-calibration`), it is very
  plausibly load-bearing, but this is inference, not measurement.

# What is notably absent

- No multi-round loop ("critique, revise, critique again, revise again... until N or until
  satisfied"). Two fixed passes, not an open iteration.
- No adversarial second model or persona playing "the client" or "the harsh critic" — the same
  single voice authors and grades.
- No numeric or rubric-based stop condition (no "score this against 5 criteria, stop at 4/5"). The
  stop condition is purely narrative confidence ("only show ideas to the user when you have higher
  confidence it'll delight them," `SKILL.md:39`), which is unfalsifiable from outside the model's
  own reasoning trace.
- No loop at all around the copy/writing guidance (`SKILL.md:45-55`) — it's presented as principles
  to apply, not as a pass to iterate through separately.

# Implication for SiteSmith

A two-pass, self-graded, single-voice loop is cheap and evidently sufficient to beat a
mechanical/template generator by a wide margin (59 vs 40). That's a useful data point against
over-engineering our own loop: an elaborate multi-agent critique pipeline is not obviously required
to get most of the benefit. What's missing and worth adding without turning this into mechanical
creativity is an external, tool-based check for the *quality-floor* claims specifically (responsive,
keyboard focus, reduced motion) — those are objectively testable and should not remain
self-asserted, unlike the "is this generic" judgment, which is legitimately model-only.
