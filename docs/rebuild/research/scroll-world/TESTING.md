---
title: TESTING — scroll-world
ai_generated: "(C)"
---

# What exists in the repo

Nothing automated. Full file inventory (`find <repo> -type f -not -path "*/.git/*"`):
`LICENSE`, `README.md`, two `.claude-plugin` manifests, `SKILL.md`, and five files under
`references/`. No `test/`, `tests/`, `*.spec.*`, `*.test.*`, CI config
(`.github/workflows/`), or verification script of any kind. This was confirmed by
inventory, not inferred.

# What the source describes instead

All quality assurance is manual, described in prose:

- **Step 8 ("QA the seams")** — `SKILL.md:613-646` — instructs driving the finished page
  in a headless browser and screenshotting just before/after each seam, checking the
  console for errors, confirming `video.seekable.end(0) > 0`, and checking that
  `currentTime` tracks scroll. This is a real, sound QA *procedure*, but it is not a
  script — nothing in the repo runs a headless browser or diffs screenshots. An agent
  following this skill would have to write that automation itself each time, from scratch
  if not directed elsewhere.
- **Cohesion review of stills** (`SKILL.md:248-250`) and **per-leg last-frame check**
  (`SKILL.md:423-426`) are both "look at the image and judge," with no comparison tool.
- **Monid/Higgsfield qualification probes** (`SKILL.md:361-367`, `pipeline.md:281-288`)
  are the closest thing to a numeric, falsifiable test in the repo — a PSNR threshold
  (≳30 dB) and an expected billing-cell match — but they verify backend capability
  (does this endpoint honor image conditioning correctly), not build output quality, and
  they're run by hand via `curl`/`jq`, not by a script that exists in this repo.

# Comparison to this project's actual verification bar

`CLAUDE.md` (this project) requires `scripts/verify.mjs` as "the proof for any change" —
screenshots at 375/768/1440px, axe in both color schemes, console errors, dead links,
horizontal overflow, run before anything is called done. `scroll-world` has no
equivalent. If any piece of this skill (the scrub engine, most plausibly) is adopted into
SiteSmith, it should be verified through SiteSmith's existing gate, not given a bespoke
QA process of its own — the seam-continuity check (Step 8's screenshot-diff idea) is
worth folding into `verify.mjs` as an additional check when a scroll-scrubbed video build
is in play (screenshot just before/after each configured segment boundary and flag large
pixel deltas), but as a new assertion inside the existing script, not a parallel one.

# What would need to be built, not just described, to make this testable

1. A scripted seam-continuity check: screenshot at `segment.start - Δ` and
   `segment.start + Δ` for every segment boundary, compare via perceptual diff (not raw
   pixel diff — the source itself notes correctly frame-locked seams can read 18-25 dB
   from detail shimmer alone) with a documented pass threshold.
2. A scripted mobile-hardening check: confirm `clipMobile`/`stillMobile` are actually
   served on a mobile viewport (network panel assertion), confirm `videoWidth <
   videoHeight` for a claimed-portrait mobile clip (catches the "crop shipped as the
   mobile version" failure the source warns about at `SKILL.md:700-704`), confirm no
   scroll-position jump across a height-only resize.
3. A scripted reduced-motion check: force `prefers-reduced-motion: reduce` and assert no
   video network request fires.
None of these exist today; all three are straightforward given the engine's own DOM/CSS
class conventions (`has-clip`, `sw-scene__video` vs `sw-scene__still`) and would fit
naturally as additions to `verify.mjs` rather than a separate harness.
