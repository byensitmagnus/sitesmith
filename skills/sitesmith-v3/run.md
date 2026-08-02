---
title: Run order, precedence and degraded mode
read: once, at the start of a run, before section 2
---

## 10. Run order

Three phases. Every loop below has an integer cap, and the run ends in a written report,
never in a question.

**Build.**

1. Read the brief. If it is not a web surface at all, say so here and stop. State the
   standing defaults first, so an ambiguity becomes a written assumption rather than a
   question or a drift. Then sort what you do not know into four piles: look it up,
   prototype it, assume it and say so, or ask. A pile becomes a question only if the
   brief is silent on it **and** the answer changes what gets built. **One round, one
   question, with your default attached. Silence means your default.** Ask it as one
   open sentence in plain prose, and never manufacture a multiple-choice list of options
   you invented. Never ask what a thing should feel like; show two
   directions that differ in structure rather than in hue, or name two real pages and
   ask which is closer. A look-up that comes back empty does not become a plausible
   fact, it moves to the assumption pile in those words.
2. Write the autopilot description section 5 asks for, four or five lines, into
   `.sitesmith/direction.md` before anything else. It is the first field, so the rest of
   the plan is written next to the thing it must not become.
3. Do sections 2 to 6. Run `node scripts/ledger.mjs new <surface>` and fill every heading
   it writes to `.sitesmith/direction.md` before any code; a blank heading fails the
   check, and the script owns the heading list so this file does not repeat it. One entry
   per surface, not per project: when a second surface lands in a project that has one,
   keep the system it names and write down only what differs and why. **Revision after
   the originality pass: cap 1.** Before a typeface, library or API in the plan reaches
   code, confirm it supports what the plan asks of it. If the brief asks to see the
   direction first, stop here and present the record as one screen.
4. If the brief names a platform, CMS or component library new to this run, read its own
   documentation once. Run `node scripts/stack.mjs detect .` and open the adapter it
   names. Never assume a stack from the brief's wording or from category habit.
5. Ask what the visitor is doing here and open the floor file for it. Buying or looking
   at a price: `floor/buy.md`. Operating a tool: `floor/operate.md`. Reading or deciding:
   nothing, because sections 1 to 8 are the whole instruction. If the brief asks to be
   carried through something, by scroll, animation or video, also open `motion.md`. When one page is two
   surfaces at once, open both and say which governs where. If a brief fits none, say so,
   pick the closest with a reason, and carry on. Do not invent a third floor.
   Two conditional layers, neither of which loads by default. Run
   `node scripts/components.mjs detect .` before writing any component: it reports what
   this project already has, and `plan <thing>` answers reuse, adapt or write with the
   reason. Nothing it says installs anything. Open `delegation.md` only when the work
   genuinely splits into independent parts, which is rare; one agent is the normal case
   and everything here works that way.
6. Build from the plan exactly. Every colour and type decision in the code comes from
   it, and changing your mind mid build means changing the plan first. Before writing
   each piece, climb: does it need to exist at all, is it already in this codebase, can
   the platform do it natively, and any dependency you add names the native API it
   replaces. Where a browser control exists for the job, use it, because a rebuilt
   control has to re-earn focus, keyboard and screen-reader behaviour and `verify.mjs`
   will find out. **On any single defect, cap 2 edit attempts, then write it down as
   unresolved and move on.**

**Inspect and release.**

6. Open `verify.md` and follow it. It holds the render matrix, the two assessments that
   must not see each other, the one-word verdict and its caps, the gates, the report,
   and what to do when this host has no browser.

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

When the build forces a deviation: if the surprise is invisible to the reader, a build
flag or a package version, take the conservative option and note it; if it changes what
the reader sees or can do, stop and say so first; if the brief demands something the
floor forbids, build it and write the conflict and your reasoning into the report rather
than silently resolving it either way.

## 12. When something is missing

No stack detected: use plain HTML and CSS with no build step, and say so.

No evidence and no answers: your assumptions from step 1 are the evidence. List them in
the report where a reader can challenge them.

If any part of this build is delegated to another agent or session, its packet is the
full text of `.sitesmith/direction.md` pasted inline, the floor file section 9 selected,
and the stack adapter. Never a path, never a summary.

## Attribution

Re-expresses mechanisms from `frontend-design` and `impeccable` (Apache-2.0) and
`taste-skill`, `ui-ux-pro-max` and `ponytail` (MIT). See `THIRD-PARTY-NOTICES.md`.
