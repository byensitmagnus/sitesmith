---
title: WORKFLOW-MAP — scroll-world
ai_generated: "(C)"
---

# The 8-step procedure, and which half each step belongs to

| Step | File:lines | Paid-pipeline-bound? | Notes |
|---|---|---|---|
| 0 — Bootstrap | `SKILL.md:45-75` | Yes | Checks `monid`/`higgsfield`/`ffmpeg`/PIL/`codex` CLIs. Nothing here applies without those tools. |
| 1 — Interview | `SKILL.md:78-206` | Mostly yes | Subject (open question, `SKILL.md:90-93`) and brand-kit intake are generic; camera style (`104-122`), mobile 9:16 chain (`129-149`), and the render-tier/Monid-vs-Higgsfield budget table (`151-198`) are 100% paid-video-specific. |
| 2 — Generate stills | `SKILL.md:210-253` | Yes | Higgsfield `gpt_image_2` or Codex `image_gen`, billed generation. |
| 3 — Float the scenes (optional) | `SKILL.md:256-265` | No (image-only) | Runs `knockout.py` on an already-generated still; the technique itself is generic PNG processing but exists only to serve step 2's output. |
| 4 — Camera architecture | `SKILL.md:268-464` | Yes | Model roster, frame-lock capability gate, Monid backend wiring, camera-grammar prompt library. Entirely about steering a generative video model. |
| 5 — Connectors | `SKILL.md:467-520` | Yes | The "seam law" (extract actual rendered frames, never the source still, as the next clip's conditioning image) — meaningless without a video model that accepts start/end-image conditioning. |
| 6 — Encode for scrubbing | `SKILL.md:523-559` | **No** | Pure `ffmpeg` encoding knowledge (blob-vs-byte-range, CRF/GOP settings) — applies to *any* video destined for scroll-scrubbing, generated or not. |
| 7 — Assemble the page | `SKILL.md:562-609` | **No** | Wires `scrub-engine.js` with a config object; framework-agnostic. |
| 8 — QA the seams | `SKILL.md:613-646` | Partially | Seam-continuity screenshot diffing is generic browser QA; the PSNR calibration note and NSFW-related mobile checks are pipeline-specific. |
| Gotchas | `SKILL.md:650-751` | Mixed | ~24 entries; roughly two-thirds (NSFW filter, Monid billing/URL quirks, model flag differences, Codex stdin hang) are vendor-specific. The scrub/mobile/CSS gotchas (frozen video, huge files, phone stutter, iOS blank scene, page-jump-on-resize, dark theme) are generic front-end bugs with generic fixes. |

# Reference-file routing

`SKILL.md` names each reference file at the point in the procedure it's needed, rather
than loading all of them up front:

- `references/prompts.md` — pulled in at Steps 1, 2, 4, 5 (intake checklist + every
  prompt template). 170 lines, entirely paid-pipeline prose (prompt text for a video
  model) except the "Copy per section" block (`prompts.md:164-171`), which is generic
  landing-page copywriting guidance.
- `references/pipeline.md` — pulled in at Steps 2, 4, 5, 6 (batch shell scripts). 306
  lines; §5 (encode, lines 119-132) and §6 (mobile crop fallback, lines 137-171) are
  generic ffmpeg technique, everything else (§1-4, §7) is Higgsfield/Monid CLI
  orchestration.
- `references/scrub-engine.js` — pulled in at Step 7. 448 lines, **zero** paid-pipeline
  dependency — see `MECHANISMS.json`.
- `references/index-template.html` — pulled in at Step 7 as an optional standalone
  shell. Generic.
- `references/knockout.py` — pulled in at Step 3 only, and only if the user wants
  floating (rather than boxed) scenes. Generic PNG technique, narrow use case.

# What a SiteSmith build would actually use

If SiteSmith ever ships a "scroll-scrubbed video hero" capability, the only steps that
transfer are 6 (encode), 7 (assemble — `scrub-engine.js` as-is or adapted), and the
generic half of 8 (QA). Steps 0-2, 4-5, and most of 1 have no analogue without a
Monid/Higgsfield-equivalent backend wired into SiteSmith, which does not currently exist.
