---
title: Motion, scroll and video
read: at build step 5, beside the floor file, when the brief asks for motion, scroll storytelling, an experience, an animated hero, or video
---

Four levels. Each states what you can build alone and what you cannot.

## 1. Scroll storytelling, CSS and JS

Buildable on every job. No assets, no dependency, nothing owed by the client. This is
the level that matters, because it is the only one that never waits on anyone.

The model, from scroll-world (MIT): scroll position is one flat timeline of segments laid
end to end, and each segment is a pure function of a single number from 0 to 1. Nothing
about that is video specific.

Lay the segments in order, give each a length in viewport heights, and take its local
progress as scroll minus its start over its length, clamped. Bind it with one rAF loop
that reads scroll and writes on the next frame, and never read layout inside the write.
Animate transform and opacity only; anything else re-runs layout every frame. Put an
IntersectionObserver on each segment so off-screen ones do no work.

Pacing is what gets skipped. A linear map spends scroll evenly, so the frame carrying the
point lands wherever the arithmetic put it rather than where the reader is. Remap local
progress through a monotone curve that holds near the middle and moves quicker at the
edges, keeping f(0)=0 and f(1)=1 so the seams stay put. Give the segment that carries the
point more scroll length than the ones in transit.

## 2. Scroll-scrubbed video

You build the player. You never make the clips.

Two failures that are not obvious:

- Setting `currentTime` from scroll fails **silently** on a host with no byte-range
  support. `seekable` collapses to `[0,0]`, every seek clamps to frame 0, the video looks
  frozen, and nothing errors. Fetch each clip as a Blob and play an object URL instead.
- A seam between two clips needs a crossfade driven by scroll distance from the seam, not
  a cut. The clips must also actually meet: the second's first frame is the frame the
  first has to end on.

Before committing: confirm the clips exist, who is making them, and that the host serves
ranges. If the clips do not exist, this level is not available on this job. Level 1 with
stills is the fallback, and it is a finished answer rather than a reduced one.

## 3. Remotion output

Only when Remotion is already in the project. Check the manifest for `remotion` or
`@remotion/*`; if it is absent, do not install it to satisfy a brief.

**remotion-skills carries no licence, so no text, no structure and no file may be
copied.** One idea is usable because it is not theirs: a composition is a pure function
of a frame number, the same shape as level 1 with frames in place of scroll.

You write a composition. You do not render one; rendering is the project's own pipeline.

## 4. Micro-interaction

Hover, focus, state change, the single deliberate moment. Section 6 of `SKILL.md` governs
whether there is one at all. This section governs how it is built.

**In CSS by default.** A transition on `transform` and `opacity` is two lines, ships no
bytes, and cannot fail to load. Reach past it only for something CSS genuinely cannot do:
an element that must animate between two places in the DOM, a gesture that follows a
finger, or a list whose items reorder and must be followed by the eye.

**Motion, formerly Framer Motion, only when it is already installed.** Run
`node scripts/components.mjs detect` and read the `motion` line. If `motion` or
`framer-motion` is a dependency, use it: layout animation and gesture handling are what it
is for, and reimplementing them by hand is worse code with the same bundle already sitting
in `node_modules`. If it is not installed, do not add it. A page whose only justification
for a runtime dependency is one hover state has bought the dependency for the wrong reason,
and the client maintains it forever.

Two rules when it is in use, and both are checked by `verify.mjs` rather than trusted:

- **The content is there without JavaScript.** Animate from a visible resting state, never
  into one. An element whose initial style is `opacity: 0` and whose only path to visible
  runs through a script is content that does not exist for a reader whose script failed.
- **Reduced motion switches it off rather than shortening it.** The preference is a
  statement about vestibular symptoms, not about taste. Read it once and take the branch
  that does not animate; do not scale a duration towards zero.

The direction record decides the character, the same as everything else. A stiff spring on
a workshop's job sheet is the library's default personality, not the client's, and a page
where every interaction has the same overshoot is the one house style this whole package
exists to avoid.

Upstream: `motiondivision/motion`, MIT, commit `a4e4b3ab73dd64fbab2574fae27d28c0418f25cb`.
Nothing is copied from it. What is taken is the rule about when a project already has it.

## What every level owes

`prefers-reduced-motion` stops the **work**, not only the visible animation. No clip is
fetched, no timeline runs, no loop starts. The page must be complete without any of it.

A page whose content is invisible until a script runs is broken, not animated. Load it
with JavaScript disabled and read it: everything must be there.

The rule about nothing moving between an intent and its result is section 6 of
`SKILL.md`, and it applies here unchanged.

## The convergence risk

scroll-world's own engine ships a complete look along with the mechanism: a sky gradient
with drifting particles and a pill nav. Anything that arrives with a look attached makes
three unrelated briefs resemble each other, and this package has failed that test four
times. Take the mechanism, never the scene.
