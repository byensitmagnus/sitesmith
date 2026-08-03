---
title: When a new hard gate may be added
status: policy, in force from the v3 integration round
ai_generated: "(C)"
---

# Gate development is frozen by default

A hard gate is a refusal: a build that trips it does not ship. Every one of them is a
promise that the defect it names costs a real person something, and that the measurement
finds it without inventing it. Gates are cheap to add and expensive to live with, and this
repository has already watched a measurement become the next thing passed without the page
getting better.

**No new hard gate is added during an integration round.** A release round integrates and
proves; it does not move the bar it is being measured against.

## The four conditions

A new hard gate requires all four, written down where the gate is defined:

1. **A defect a user is affected by.** Not a rule violation, not an inconsistency someone
   would only find by reading source. Name the person and what it costs them.
2. **Reproduced in at least two independent builds.** Two different briefs, two different
   builders. One occurrence is an anecdote.
3. **A mechanical measurement with a low false-positive risk**, calibrated against builds
   that must stay silent. A control that keeps passing is part of the evidence.
4. **Proof that no existing gate already covers it.** Run the existing gates against the
   failing build first and show what they said.

Anything that meets fewer than four is a **signal**: measured and reported, never
refused.

## Signals are not weaker gates

A signal is printed with its numbers, read by a person, and dispositioned in the production
report. It is the right shape for a finding whose correct answer depends on the subject.
Turning a signal into a gate mandates one answer everywhere, which is how a checker becomes
a house style.

## Reclassified on this policy's first application

**Hairline separators** and **tabular figures** were standalone portfolio failures. They are
signals from now on. Both recur across unrelated trades for honest reasons: a sawmill, a
grain intake and a lighthouse all have real figures to set, and a rule between two rows is a
way of not drawing a box rather than a style.

Portfolio diversity is judged first on the axes where sameness costs a client something:

- layout topology
- visual metaphor
- typographic voice
- information hierarchy
- interaction model
- material world
- signature device

## A rubric change takes effect forward only

Historical reports are not rewritten when a reclassification changes later verdicts, and a
subject measured under the old rubric is never re-reported as passing under the new one.
Round 4's portfolio verdict is FAIL and stays FAIL;
`evidence/cold-builds/PORTFOLIO-DIVERSITY.md` is what the tool printed on 2026-08-02.

A revised rubric is **unvalidated** until it has been applied to work produced after it
existed. Applying it to the set that motivated the change proves nothing: that is the
weakest evidence a measurement can have, and reporting it as a pass is how a benchmark stops
meaning anything.
