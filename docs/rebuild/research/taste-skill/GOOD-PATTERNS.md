---
title: taste-skill — Good Patterns
ai_generated: "(C)"
---

# What it does better than most of the field

## 1. The design read forces evidence, not vibes
`skills/taste-skill/SKILL.md:25-31` requires one committed sentence citing page kind, audience, and aesthetic family before any code — with two worked examples showing the expected specificity ("B2B SaaS landing for technical buyers... Linear-style... Tailwind + Geist + restrained motion"). This is the mechanism that actually matches the brief's C-no-mechanical-creativity axis: reasoning from evidence, not selecting from a table. See `MECHANISMS.json:brief-inference-design-read`.

## 2. Bans always carry a named override condition
Every "discouraged/banned as default" rule in §4 and §9 states exactly when it stops applying — e.g. Inter is fine for an explicitly neutral/public-sector brief (`:170`), serif is fine only if the brief names one or the aesthetic is genuinely editorial/luxury/heritage (`:175-178`). This is a better shape than a bare blocklist: it keeps the ban attached to a reason instead of an arbitrary rule to recite.

## 3. Design-system routing is grounded in real packages, not invented CSS
`:82-119` plus Appendix A/B (`:987-1109`) name the exact npm packages for Fluent/Material/Carbon/Polaris/Atlaskit/Primer/GOV.UK/USWDS/Radix/shadcn, with install commands and canonical doc URLs vendored directly in the file — "do not recreate its CSS by hand" (`:102`). Appendix C goes further and explicitly labels Apple Liquid Glass as having no public web package, giving a named "approximation" skeleton instead of letting the model claim official status for hand-rolled `backdrop-filter` CSS (`:1113-1138`).

## 4. Absolute, mechanically-testable bans exist and are marked as such
The em-dash ban (`:685-701`) is written as fully binary with no override clause — "if your output contains a single — or – anywhere visible... the output fails." It is the one rule in the file that a simple regex could verify, and the file itself flags why it had to become absolute: softer phrasing ("use sparingly") had failed in practice (`:701`).

## 5. Redesign is a first-class, differently-ordered workflow
`:783-833` treats redesigns as a distinct problem requiring an audit *before* any change (brand tokens, IA, content blocks, existing dial reading, SEO baseline) and a fixed "never change silently" list (URL slugs, nav labels, form field names, brand wordmark, legal copy — `:825-831`). This directly matches concerns already documented in this repo's own project memory about redesign risk.

## 6. Structural anti-repetition is enforced with real counting, not taste
Several §4.7 rules are stated as literal counts rather than aesthetic judgment: eyebrow density ≤ `ceil(sectionCount / 3)` (`:253-257`), ≥4 distinct layout families across 8 sections (`:251`), bento cell count must equal item count exactly (`:250`). These are the strongest items in the whole pre-flight checklist precisely because "count instances of X" is something a model (or a script) can actually verify, unlike "is the copy good."

## 7. Concrete, load-bearing GSAP skeletons for a known failure mode
`:365-473` gives two complete, working scroll-pin components and calls out the exact config values that must be correct (`start: "top top"`, not `"top center"` or `"top 80%"`) to avoid the common bug where a pinned section engages mid-scroll instead of at the top. This is genuine engineering knowledge delivered as runnable code, not a description of a vibe.

## 8. Explicit scope boundary
`:896-906` states plainly what the skill is *not* for (dashboards, data tables, multi-step wizards, code editors, native mobile, realtime collab) and tells the model to say so and point elsewhere rather than force-fitting landing-page rules onto the wrong surface. A skill that knows its own edges is rarer than it should be.
