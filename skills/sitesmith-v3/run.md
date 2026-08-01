---
title: Run order, precedence and degraded mode
read: once, at the start of a run, before section 2
---

## 10. Run order

Three phases. Every loop below has an integer cap, and the run ends in a written report,
never in a question.

**Build.**

1. Read the brief. Sort what you do not know into four piles: look it up, prototype it,
   assume it and say so, or ask. Only the last becomes a question. **One round, at most
   two questions, each with your default attached. Silence means your default.**
2. Do sections 2 to 6. The plan is written to `.sitesmith/direction.md` before any code:
   subject, noun list, the theses you wrote, which you chose and on what axis, the
   colour names and what each is for, the type roles, the signature, the named risk, and
   the one line from the originality pass saying what you changed. **Revision after the
   originality pass: cap 1.**
3. Run `node scripts/stack.mjs detect .` and open the one adapter it names.
4. Open the floor file section 9 selected, if any.
5. Build from the plan exactly. **On any single defect, cap 2 edit attempts, then write
   it down as unresolved and move on.**

**Inspect.**

6. Render it. `node scripts/verify.mjs <url>` at 375, 768 and 1440, both colour schemes,
   plus the reduced-motion pass. Look at the screenshots yourself.
7. Open with one word: **ship**, **fix**, or **rebuild**. **Two rounds, at most one
   rebuild in a run.** A second rebuild is not available; write down what is wrong
   instead.

**Release.**

8. `node scripts/gate.mjs <dir>` and `node scripts/ledger.mjs check <dir>`. **Rerun cap
   2.** Never edit a check to make it pass. A check that could not run withholds its
   verdict, and the report says the mechanical verdict is missing.
9. Write `PRODUCTION-REPORT.md`: what shipped, what each gate said, what is unresolved,
   and every assumption you made in step 1.

There is no self-improvement loop. If you find yourself starting a fourth pass, stop and
write the report.

## 11. What wins when two things conflict

```text
1. the brief's own words
2. factual truth
3. the client's existing brand and hard constraints
4. the evidence gathered for this job
5. general design principles
6. anything else in this file
```

The brief outranks factual truth for **design**, never for **claims**. If the client
asks for a look, give it exactly, including a look this file names as a default. If the
client asks you to state something nobody has verified, refuse and say why. A look is
taste. A number on a page is a fact.

When the brief demands something the floor forbids, build it, and write the conflict and
your reasoning into the report rather than silently resolving it either way.

## 12. When something is missing

No browser available: build, state plainly that nothing was rendered or verified, and
mark the release verdict as not taken. Never imply a check ran.

No stack detected: use plain HTML and CSS with no build step, and say so.

No evidence and no answers: your assumptions from step 1 are the evidence. List them in
the report where a reader can challenge them.

## Attribution

This skill re-expresses mechanisms from `frontend-design` and `impeccable`
(Apache-2.0), and `taste-skill`, `ui-ux-pro-max` and `ponytail` (MIT). See
`THIRD-PARTY-NOTICES.md`. Nothing here is copied from a source without a licence.
