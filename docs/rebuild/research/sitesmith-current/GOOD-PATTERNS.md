---
title: GOOD-PATTERNS — sitesmith-current autopsy
ai_generated: "(C)"
---

# What this source does better than anyone

All items below are real, adversarial (each was written against a specific defect that
actually shipped), and mechanically enforced — not asserted. See MECHANISMS.json for full
records; this file is the evidence-first summary.

## 1. It measures the rendered page, never trusts the declaration

`scripts/direction-fidelity.mjs:11-19` documents the exact defect this exists to catch: two
pilots declared a dark ground, shipped it correctly behind `prefers-color-scheme: dark`, and
both rendered light in Chromium's default scheme — every other gate passed. The fix is to
render with **no colour-scheme override** (direction-fidelity.mjs:405) and measure WCAG
luminance, display font family, image-area share, section-band count, and four visual-grammar
device counts (mono-caps, hairlines, tabular-nums, shadows) directly from `getComputedStyle`
and `getBoundingClientRect` (direction-fidelity.mjs:176-250).

`scripts/direction-check.mjs:179-221` does the same for the three direction comps: "a comp
whose NOTE.md claims a dark ground and renders #faf8f4 has not made the choice it says it made"
(v2/20-direction-lab.md:224-225) — the measurement wins over the declaration, always.

## 2. Cross-project memory, not per-project memory

`scripts/direction-history.mjs:1-38` keeps one append-only ledger at
`~/.sitesmith/direction-history.jsonl`, outside any single project. It hard-codes a known-bad
recipe (`KNOWN_RECIPES`, lines 29-38: mono-uppercase-labels + hairline-separators +
tabular-figure-motif + flat-surfaces together) that fails even on a completely empty ledger,
because a per-project check literally cannot see repetition across projects — which is where a
house style forms. This is the single piece of existing machinery most directly aimed at the
brief's C-no-house-style constraint.

## 3. Portfolio-level sameness has its own gate, separate from any single page

`scripts/portfolio-diversity.mjs:11-16` names the actual failure: three pilots with different
evidence, different modes, different chosen directions, still rendered off-white grounds
within a 0.031 luminance band, with the same letterspaced-mono/hairline/line-drawing devices —
"every existing gate passed." The gate measures the SET (shared-device count across sites,
ground-family clustering, whether imagery is load-bearing anywhere at all, layout-signature
collisions, display-face diversity) — properties no single-site check can see by construction.

## 4. A "does it work" / "is it good" split that a good average cannot cheat

`v2/50-critique.md:14-18`: merging the technical gate and the visual judgement is how "PASS
came to be read as this is good." The visual rubric's primary-criticism test
(50-critique.md:99-112) asks one open question before any score is seen — "what is the main
thing wrong with this page" — and if the answer is a variant of "generic AI template," the
gate **fails regardless of the numeric scores**. Specificity is capped at 3 if the page could
be a different company in the same category with only the copy changed (50-critique.md:52-54).
This is a targeted trap for genericness, not a quality score that could average it away.

## 5. The blind-review ceremony is actually enforced, not just described

`scripts/critique-gate.mjs` checks, by hashing and timestamp — not by trusting a checklist —
that: the reviewer is not the build agent (lines 145-156), both reviews are bound to the same
brief/rubric/screenshots by sha256 (158-166), labels are opaque (170-173), each review's body
matches its recorded hash (post-lock edits are caught, 191-195), and the sealed key was opened
strictly after both reviews locked (204-220). The generic-template tell is scanned across whole
sentences with an explicit negation grammar (lines 74-93) so a reviewer who *praises* the page
by contrasting it with a template is not misread as failing it. "It exists because a blind
review that is only described is a blind review that will not happen" (critique-gate.mjs:10-11).

## 6. Fail-closed on missing verification, not silently green

`scripts/verify.mjs:264-269`: a fresh install without `@axe-core/playwright` reported "axe
violations: not run" and PASSED, because "not run" reads as fine to a human skimming output.
The fix: a missing axe scan is now a **blocking failure** unless `--no-axe` is explicitly typed,
and the tool prints exactly what waiving it costs (verify.mjs:270-272, 298-303). Same file also
reads the raw HTML source rather than the live DOM for structural checks (missing
`<!doctype>`/`<html lang>`/`<main>`), because the browser silently repairs a missing root
element and the DOM cannot show the defect after the fact (verify.mjs:169-186).

## 7. Honesty checks that catch fabricated authenticity, not just broken markup

`scripts/production-gate.mjs` is explicit that it answers a different question than `verify.mjs`
— "is the page finished," which a page can fail while passing every technical check
(production-gate.mjs:10-17). It regex-scans for placeholder language and dummy identifiers
(555 numbers, example.com, "Anytown"), requires every rendered image/svg to carry a
`data-asset` id present and `ready` in the manifest, and — in e-commerce mode — extracts every
price/rating/delivery-promise/warranty claim and blocks any that cannot be traced to
`EVIDENCE.md` or a `data-source` attribute (lines 281-324). Borrowed customer/partner logos must
name who they belong to and must be evidenced, never a "substitute" (lines 191-237).

## 8. Interaction journeys assert four specific properties, not "didn't throw"

`v2/40-interaction.md:115-129` requires every journey to prove something changed, the change
was *announced* (role=status/alert/focus move — "a change only a sighted mouse user notices is
half-built"), a deliberate failure path is handled and field-attached, and the same outcome is
reachable by keyboard with visible focus. This directly answers the legacy defect named in the
same file: "across the nine legacy pages there are zero `<script>` tags... every state is
*drawn correctly* and none of them has ever been entered" (40-interaction.md:10-14).

## 9. Progressive disclosure as a machine-readable manifest, not a promise

`PIPELINE.json` declares exactly 3 always-loaded files (SKILL.md:20) and attaches an explicit
`reads` list to every one of its 19 steps. This makes "an ordinary task must never pull the
whole rule set or the 1.4MB of data into context" (PIPELINE.json:14-16) a property of the file
layout and the router, not an instruction the model has to remember to obey.
