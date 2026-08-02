---
title: Inspect, release and the report contract
read: at step 6 of run.md, the inspect and release step
---

## Release commands

Run these in order. Each produces an artifact, and the artifact is the only thing that
entitles you to say the check ran.

```text
node scripts/verify.mjs <target>   render matrix, axe in both colour schemes, floor measures
node scripts/critique.mjs packet   the six questions and the images, and nothing else
node scripts/critique.mjs lock --file <answers>   the answers, hashed to this render
node scripts/journey.mjs           every journey in journeys/
node scripts/gate.mjs              honesty, anti-pattern and contract refusals
```

The critique runs second, before any report is read. `packet` prints the whole input a
reviewer gets: the images, the brief, the six questions. Hand it to a fresh agent when one
is available, and read it with the direction record closed when one is not. `lock` hashes
the render, so a critique written after the page moved is refused as a critique of a page
that no longer exists, and the one correction round look.md allows is `--correction "what
changed and why"`. A second one is refused: that is where a page gets sanded flat.

A command that is missing, or that fails to start, is neither a pass nor a silent skip.
Record it in the run notes below with the observed reason and whatever you did by hand
instead, then carry on.

## Look at the render before you read the report

The scripts measure. They cannot see. `critique.mjs packet` holds the six questions and
the images, and it is the whole input: once you have read a PASS you read the picture as
confirming it, so the packet is answered first and the report second.

One line per question, then lock it and fix what you found. With no browser, say the
render was not inspected and mark the visual verdict not taken. Never answer the six from
the code.

## The journey contract

A `journeys/*.spec.mjs` file that drives one real path and asserts four things. Fewer than
four is a smoke test.

1. Something observably changed: a value, a row, a URL or a rendered region differs.
2. It was announced: `role="status"`, `role="alert"`, or focus moved to what changed.
3. The failure path ran, and its message sits on the field that caused it.
4. The path completed on the keyboard alone, with an indicator visible at every stop.

One per surface. Run from where playwright is: `node scripts/journey.mjs <dir> --base <url>`.
Buy, operate and redesign are refused without one. Read and experience are not asked: a page
with no interactive path has no journey, and demanding one yields smoke tests wearing the name.

Both answers belong in the production report. A run that says the critique found nothing
is making a claim, and it is the claim a reader is most entitled to disbelieve.

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
