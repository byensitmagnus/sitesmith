---
title: FAILURE-MODES — frontend-design
ai_generated: "(C)"
---

# Where and how it breaks

## The named-cliché list will go stale, with no mechanism to refresh it (`SKILL.md:31`)

The three described patterns are a snapshot of "what AI-generated design looks like right now"
(implicitly, mid-2025). The file is static prose — nothing re-derives this list, nothing dates it,
nothing flags it as time-bound inside the skill itself. Six months after new clichés emerge (a
skill trained partly on *this very skill's guidance* could converge on a fourth pattern), the list
silently stops doing its job while still reading as authoritative. This is the single biggest
"outdated knowledge" risk in the package, precisely because it is also the single most valuable
mechanism (see `MECHANISMS.json` → `named-cliche-calibration`).

## Self-critique is asserted, never verified (`SKILL.md:35`)

"Review that plan against the brief... revise that part, say what you changed and why" is a norm,
not a checkpoint. Nothing forces the revision to actually happen — a model under token/time
pressure, or one that is overconfident, can skip straight from brainstorm to build having merely
*claimed* to have reviewed. There is no second model, no rubric, no measurable pass condition. See
`LOOPS.md` for the full analysis.

## The quality floor is asserted, not gated (`SKILL.md:43`)

"Responsive down to mobile, visible keyboard focus, reduced motion respected" — three genuinely
testable properties — are stated as things to "build to... without announcing," but the source
ships no test, no checklist, no script to confirm any of them. "Taking screenshots if your
environment supports it" is the only nod to verification, and it's conditional and unenforced.
Compare this to our own `scripts/verify.mjs`, which actually captures screenshots at three
breakpoints and runs axe in both color schemes — this source has nothing analogous. If the runtime
doesn't happen to support screenshots, the entire self-critique step degrades to a mental
gesture. See `TESTING.md`.

## No handling for missing/thin input beyond "invent it yourself" (`SKILL.md:11-13`)

When the brief is empty, the instruction is: pick a subject, audience, and job, and say so. This is
reasonable, but it has no fallback if the model's invented subject is *itself* generic (a coffee
shop, a fitness app) — the mechanism constrains the *form* of grounding, not the *quality* of the
model's imagination. A weak model, or a strong model in a bad sampling mode, can satisfy the letter
of this instruction ("I picked a subject and said so") while still landing on the most statistically
common subject available.

## One clause admits an escape hatch from its own core rule (`SKILL.md:17`)

"only use if that's truly the best option" (regarding the stat-block hero pattern) is the correct
design of an override, but it is also exactly the kind of clause a model can use to rationalize
keeping the very default the instruction is trying to prevent. The source has no check on whether
"truly the best option" was actually true, or just asserted.

## No stack, component, or accessibility knowledge is provided

This is a pure judgment-shaping prompt with zero technical scaffolding: no mention of frameworks,
no component patterns, no concrete WCAG criteria beyond naming "keyboard focus" and "reduced
motion." A model with weak front-end implementation knowledge gets no help translating a good
*plan* into good *code* — the entire value of the package lives upstream of implementation. If the
model is weak at execution, an excellent plan can still ship broken.

## CSS-specificity tip is narrow and stack-dependent (`SKILL.md:37`)

Useful only for hand-rolled class-based cascades; irrelevant noise for utility-first CSS
(Tailwind) or CSS-in-JS/scoped-styles stacks, which is most of what SiteSmith actually targets per
its own stack router (Next.js, React/Vite, Astro). Carrying this forward unconditionally would be
dead weight in most of our target stacks.

## No NOTICE file despite Apache-2.0 permitting one

Not a functional failure, but worth flagging for `LICENSE.md`: there's no NOTICE text file, so
there's nothing beyond the LICENSE.txt itself that governs attribution obligations for derivative
works.
