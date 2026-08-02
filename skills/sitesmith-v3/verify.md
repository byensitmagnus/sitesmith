---
title: Inspect, release and the report contract
read: at step 6 of run.md, the inspect and release step
---

## Release commands

Run these in order. Each produces an artifact, and the artifact is the only thing that
entitles you to say the check ran.

```text
node scripts/verify.mjs <target>   render matrix, axe in both colour schemes, floor measures
node scripts/journey.mjs           every journey in journeys/
node scripts/gate.mjs              honesty, anti-pattern and contract refusals
```

A command that is missing, or that fails to start, is neither a pass nor a silent skip.
Record it in the run notes below with the observed reason and whatever you did by hand
instead, then carry on.

## Look at the render before you read the report

The scripts measure. They cannot see. Open `375.png` and `1440.png` and look the way the client will, before any machine
verdict: once you have read a PASS you read the picture as confirming it.

Six questions, answered from the image alone:

1. **Where does the eye land first, and is it the thing the brief said the page must
   do?** If it lands on the navigation or a decorative panel, the hierarchy is wrong
   whatever the heading levels say.
2. **What reads as a template first?** Name it.
3. **Is the signature visible at 1440 and alive at 375?** One that exists only in the
   design record is not a signature.
4. **Where is the page emptiest, and is that emptiness doing work?** Space nobody chose
   reads as a missing section.
5. **Read the six largest words in order. Do they say what the business does?** If a
   competitor could say them too, that is category copy.
6. **Cover the top third. Does the rest still say what this is?** If not, the hero is
   carrying everything and the page has one idea.

One line per question in the report, then fix what you found. **Two passes at most**, and
the second may not add an element, only change or remove one.

With no browser, say the render was not inspected and mark the visual verdict not taken.
Never answer these six from the code.

## The journey contract

A journey is a `journeys/*.spec.mjs` file that drives one real path through the built page
and asserts four things. Fewer than four and it is a smoke test, not a journey.

1. Something observably changed: a value, a row, a URL or a rendered region differs after
   the action.
2. The change was announced: a `role="status"` or `role="alert"` region carries it, or
   focus moved to the thing that changed.
3. The failure path was exercised, and its message is attached to the field that caused it
   rather than floated at the top of the page.
4. The whole path completed on the keyboard alone, with a focus indicator visible at every
   stop.

Write one journey per surface listed on the `Surfaces:` line of `.sitesmith/direction.md`.
`node scripts/journey.mjs` runs them all. A surface with no journey fails `gate.mjs` at
release, and an empty `journeys/` directory fails it outright.

## The state roster

Every interactive element owes six states, and each one prevents a named failure. **Rest.**
**Hover**, never the only affordance, because touch has no hover. **Focus-visible.**
**Active.** **Disabled**, carrying the actual attribute, because something that looks
pressable and does nothing is a bug. **Loading**, occupying the shape of what it replaces.

Three more belong to the page rather than to the control. **Empty** is a composed first-run
view. **Error** sits inline next to its cause and offers a way forward. **Partial** is the
view where only some of the content arrived.

Walk the roster against the built page, not against the plan. A state that exists only in
the plan is a missing state.

## The report contract

**No fixed-count quotas anywhere.** Every obligatory section admits an empty answer, and
the empty answer carries a reason. A null with no reason fails validation. Counts are
reported as found, never as targets: never write "list 3 to 5 issues", write "list every
issue at or above severity X, or state that there are none".

**Every scored dimension carries an applicability state**, scored or skipped-with-reason.
The denominator is computed from the scored set alone. Refuse to emit a total against a
denominator that contains a skipped dimension, and write the skipped dimensions and their
reasons into the machine-readable result, not only into the prose.

**Run notes are a fixed block, one line per step that can degrade.** Which viewports were
captured, whether axe ran in both colour schemes, whether a live server was reachable,
whether the anti-slop linter ran, and for each step that did not run, the observed reason
and the fallback used. A missing field, or a missing reason on a step that did not run,
fails the gate. An absent field is detectable where an absent behaviour is invisible, which
is the entire reason the block is fixed rather than written to taste.

**The design record is written last**, from the shipped stylesheet and components, not from
`.sitesmith/direction.md`. Record what the code actually does, including where it diverged
from the plan. Before you write down any rule, check it against section 5 of `SKILL.md`: a
default that the floor or the originality pass refused, and that shipped anyway, is written
down as a defect this build carries, never as a rule the next build inherits.

**Results persist as a small machine-readable record** keyed by a canonical target path,
carrying the score, the applicable maximum and the defect counts. A later run reads the
prior records and reports the delta. It refuses to present a delta across differing
applicable sets as like-for-like, and prints each score against its own denominator
instead. Persistence that fails prints and moves on, and never blocks the run.

**A user-owned dismissal list is the only prior-run state the assessment reads.** Prior
scores reach the reporting layer for the trend line and stop there. A reviewer that reads
its own last report anchors on it and stops looking.
