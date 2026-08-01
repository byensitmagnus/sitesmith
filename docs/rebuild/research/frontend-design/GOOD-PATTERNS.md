---
title: GOOD-PATTERNS — frontend-design
ai_generated: "(C)"
---

# What it does better than anyone

## 1. It names the enemy concretely (`SKILL.md:31`)

> "(1) a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta
> accent; (2) a near-black background with a single bright acid-green or vermilion accent; (3) a
> broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns"

Most anti-genericism guidance says "be original" or "avoid clichés" — content-free advice a model
cannot act on because it has no test for what counts as a cliché. This source instead names three
actual, specific, checkable patterns. A model can literally diff its own draft plan against these
three descriptions. This is the difference between "eat healthy" and "here are three foods you
keep reaching for, stop defaulting to them." It is the most concrete, most portable mechanism in
the whole file, and the most plausible single explanation for the 59-vs-40 blind test result.

## 2. It scopes the anti-cliché pressure so it can't override the brief (`SKILL.md:31`)

> "Where the brief pins down a visual direction, follow it exactly — the brief's own words always
> win, including when it asks for one of these looks."

This is a small but important piece of engineering: an anti-house-style rule that didn't have this
clause would itself become a rigid rule fighting explicit client intent. Pairing the cliché-list
with an explicit override keeps the freedom-forcing pressure applied only where the brief left an
axis open, never as a defiant refusal of the actual request.

## 3. It puts a real test on a fuzzy structural instinct (`SKILL.md:21`)

Numbered markers (01/02/03) are one of the most recognizable "AI template" tells. Instead of
banning them, the source gives a testable condition: is the content actually a sequence? "Question
if choices like numbered markers actually make sense before incorporating them." This generalizes:
the same test ("does this structural device encode something true?") could be applied to any
structural device, not just numbering — see `MECHANISMS.json` entry `structure-as-information`.

## 4. It externalizes the plan before code, in a form cheap enough to critique (`SKILL.md:33`)

The 4-part token system (color/type/layout/signature) is small — a handful of hex values, two
typeface roles, a paragraph of layout prose plus ASCII, one signature sentence. It is cheap to
produce and cheap to throw away. This is what makes the self-critique step (`SKILL.md:35`)
possible at all: reviewing a paragraph of intent is tractable; reviewing 400 lines of generated
CSS for "does this feel generic" is not.

## 5. It treats copy as design material with the same rigor as visuals (`SKILL.md:45-55`)

Concrete, checkable rules — "a control should say exactly what happens when it's used," "the
button that says 'Publish' produces a toast that says 'Published,'" describe by what the user
controls not by system internals — generalize the anti-genericism instinct to language, closing a
gap that a purely visual design skill would miss entirely. Many design skills stop at the pixel;
this one does not.

## 6. It's honest about being a heuristic, not a rule, in its own framing (`SKILL.md:9,25,43`)

"Not taking a risk can be a risk itself" and "elegance is executing the chosen vision well"
explicitly avoid prescribing a single correct amount of boldness. This is unusual restraint for a
prompt file — it resists the temptation to over-specify, which is exactly what keeps it from
becoming its own house style (a fixed maximalism-always or minimalism-always rule would just be a
different fixed look).
