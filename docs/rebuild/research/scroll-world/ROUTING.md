---
title: ROUTING — scroll-world
ai_generated: "(C)"
---

# How this skill is triggered today

`plugin.json` description and `SKILL.md` frontmatter both key on: "3D world" /
"browse-through-the-industry" hero, scroll cinematic, diorama landing, "turn a business
into a scrollable world." It is a narrow, opt-in specialty, not a default hero treatment
— nothing in the source suggests it should compete with a plain landing page as a general
answer to "build me a website."

# What would have to be true for SiteSmith to route into any of this

1. **A paid generative-video backend wired into SiteSmith.** Nothing in the current
   SiteSmith project material (per this task's context) indicates Monid, Higgsfield, or
   an equivalent is integrated. Without one, Steps 0-2, 4-5, and most of Step 1 of this
   skill have literally nothing to run against — they are not degradable, they are
   inapplicable.
2. **Explicit user request for the specific genre**, not a general "make it more
   dynamic"/"add some motion" ask. The camera-architecture and diorama-style choices this
   skill hinges on are a specific creative bet, not a generic enhancement.
3. **A decoupling of the two halves at the routing layer.** If SiteSmith ever offers
   "scroll-scrubbed video hero" as a capability, it should route to the engine
   (`scrub-engine.js`) and the encoding recipe (`SKILL.md` Step 6) independent of whether
   the clips come from a generative backend, stock footage, or client-supplied video —
   the engine has zero dependency on asset origin (`MECHANISMS.json:
   segment-interleave-scene-model`, `blob-seek-scrubbing`). Routing that only offers this
   capability when a paid video backend is present would needlessly narrow a genuinely
   general-purpose front-end technique.

# Degrade path if the user asks for this and no video backend exists

Do not silently produce a lesser version of *this specific skill*. Instead:
- Offer the scrub-engine + a static/motion-loop equivalent using assets the user already
  has (their own product photography, a short client-supplied clip, or stock footage) —
  this uses `GOOD-PATTERNS.md` items 1-8 without needing anything from the paid half.
- If the user specifically wants AI-generated diorama-style scenes and there's no backend
  for it, say so plainly rather than attempting a design that pretends to be this and
  isn't — consistent with this source's own "capability-gate-before-commit" principle
  (`MECHANISMS.json`): decline with a one-line reason rather than silently substitute a
  worse thing under the same name.

# Not a routing candidate at all

The interview content specific to camera architecture, mobile-9:16-chain budgeting, and
render-tier cost tables (`SKILL.md` Step 1.4, 1.6, 1.7) should never be surfaced in
SiteSmith's own interview flow even as inspiration — it's entirely bound to a backend
SiteSmith doesn't have, and copying its shape (a cost-negotiation dialogue) into a context
where there's nothing to negotiate cost over would just be confusing.
