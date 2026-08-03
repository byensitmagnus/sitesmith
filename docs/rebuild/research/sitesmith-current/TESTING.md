---
title: TESTING — sitesmith-current autopsy
ai_generated: "(C)"
---

# What it verifies, how, and whether the proof is real or asserted

## Real (script runs against the actual artifact, exits non-zero on failure)

| Check | File | What it actually measures |
|---|---|---|
| Layout/console/links/a11y | `scripts/verify.mjs` | Real Playwright render at N widths, real axe-core scan in both colour schemes, real HTTP status on every same-origin link, raw HTML source parsed for structural defects (doctype/html/lang/head/body/h1/main) because the live DOM auto-repairs a missing root and hides the defect. Fails closed if axe did not run. |
| Direction fidelity | `scripts/direction-fidelity.mjs` | Real render in the browser's *default* colour scheme (not an override), WCAG luminance formula on `body` background, computed font-family of the `h1`, pixel-area share of every img/svg/video vs. viewport, distinct-background-colour band count, mono-caps/hairline/tabular-nums/shadow element counts, signature-selector pixel-area share — each checked against a classifier of the corresponding DIRECTION.md prose line. |
| Direction difference (comps) | `scripts/direction-check.mjs` | Same measurement approach applied pairwise across the three comps; fails if the *measured* render disagrees with the *declared* NOTE.md, or if two comps measure identically despite different prose. |
| Cross-project novelty | `scripts/direction-history.mjs` | Real render fingerprint (luminance band, display-font class, imagery band, layout shape, device-set) compared against every other project's persisted entry in `~/.sitesmith/direction-history.jsonl`; a hard-coded known-bad recipe is checked even against an empty ledger. |
| Token discipline | `scripts/token-drift.mjs` | Real regex extraction of colour/length literals from a page's inline `<style>` blocks, checked against the contract's declared token values plus a documented one-off table; reports undeclared, missing-group, and unused-token findings. |
| Production honesty | `scripts/production-gate.mjs` | Real text/markup scan (with comments and script bodies stripped so those aren't mistaken for page content) for placeholder language, dummy identifiers, empty brand-mark elements, unmanifested/un-ready assets, untraceable commerce claims (mode E), unevidenced borrowed logos, and a missing favicon; can read either static files or a rendered URL/DOM. |
| Behavioural journeys | `scripts/journey.mjs` + hand-written `*.spec.mjs` | Real Playwright automation against a live dev server; each spec asserts an observable change, an accessible announcement of it, a handled failure path, and a keyboard-only path with visible focus. |
| Portfolio sameness | `scripts/portfolio-diversity.mjs` | Real cross-site render comparison: palette-family clustering by luminance band, shared-device-across-set counts, whether any site clears an imagery-load-bearing threshold, layout-signature collisions, display-face diversity — a property no single-site check can see. |
| Review-ceremony integrity | `scripts/critique-gate.mjs` | Real sha256 hash verification (review body unchanged since lock), real timestamp ordering (key opened only after every review locked), real reviewer-identity check against the builder's identity, real sentence-level scan for a generic-template admission with negation handling. |

Across all nine, the shared design principle is: **measure the artifact that a human reviewer or
visitor actually experiences (the rendered page, in its default state), never the source that
produced it, and never trust a self-reported claim about what the page does.**

## Asserted only (self-certified checklist, no script)

| Check | File | Why it is not (and arguably cannot be) scripted |
|---|---|---|
| Evidence pack quality | `v2/05-evidence.md` "when it is done" (lines 119-124) | Whether research is real/specific/sufficiently anti-generic is a judgement call about content quality, not a parseable structural property. |
| Direction choice reasoning | `v2/20-direction-lab.md` §4 scoring | The five criteria (subject-specificity, primary-action service, buildability, anti-reference avoidance, defensible signature) are argued in prose; nothing scores the argument's quality, only its presence. |
| Design-system contract quality | `v2/30-contract.md` "not done if" list | "Derived from this brief" vs "copied from an example" is checkable only by reading, not by parsing — the contract block's *shape* is checked by `token-drift.mjs`, its *origin* is not. |
| Visual critique (ordinary build) | `v2/50-critique.md` rubric | Self-scored by the same agent that built the page in the non-benchmark path; no independence enforcement (contrast with `critique-gate.mjs`, which does enforce it, but only lab-side). |
| Production report completeness | `v2/00-done.md` "the done check" | Five explicit reading-based questions (squint at 1440, delete every image and re-read, open page two, trace a number, tab through the primary task) are stated as "no script has an opinion about any of them" (00-done.md:238-240) — deliberately left to human/model judgement. |
| Progressive-disclosure compliance | `PIPELINE.json`'s `reads` manifest | Nothing checks that an agent actually limited itself to the declared read-list for a step (see CONTEXT-STRATEGY.md, FAILURE-MODES #10). |

## Net assessment

The technical-gate half of this repository is genuinely rigorous: every script above was written
against a **named, previously-shipped defect** (documented in the script's own header comment),
not speculative coverage — dark-mode-only directions, wide-font overflow invisible under a
developer's system font, a missing-axe-scan silently reading as PASS, empty brand marks, zero
`<script>` tags across nine "finished" pages, three sites converging on one recipe despite
passing individual review. This is the strongest, most portable part of the source.

The judgement-gate half (evidence quality, direction reasoning quality, contract-derivation
quality, ordinary-build visual critique) is honestly and consistently labeled as unscriptable —
the source does not pretend otherwise (`00-done.md:238-240` says so explicitly) — but it also
means the source's actual creative-quality claims rest entirely on model judgement it does
nothing to verify, except in the lab-only ceremony.
