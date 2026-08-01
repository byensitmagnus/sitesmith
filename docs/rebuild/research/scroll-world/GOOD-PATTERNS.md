---
title: GOOD-PATTERNS — scroll-world
ai_generated: "(C)"
---

Everything below is verified adoptable — pure front-end technique with no dependency on
Higgsfield/Monid or any generative video backend. Full detail and citations for each are
in `MECHANISMS.json`; this file is the short version.

1. **Scene-as-data, timeline-as-computation** (`scrub-engine.js:86-101`). Sections and
   optional connectors are an ordered config array; scroll-pixel ranges are derived from
   it at layout time, never hand-authored. Adopt this shape for any SiteSmith
   scroll-driven build, video or not.

2. **Blob-load before scrubbing** (`scrub-engine.js:198-220`; `SKILL.md:528-534`). Fetch
   each clip to a `Blob` and play it from an object URL instead of pointing `<video src>`
   at the network path. This is the actual fix for the "video looks frozen" bug on hosts
   without byte-range support — not a workaround, a root-cause fix, and it's why the
   engine doesn't need all-intra encoding.

3. **Distance-based seam crossfade** (`scrub-engine.js:222-242`). Opacity is a smoothstep
   of pixel-distance-to-segment-boundary, so adjacent scroll segments overlap-dissolve
   automatically. Complements frame-matching; doesn't require it.

4. **Boundary-preserving pacing remap** (`lingerEase`, `scrub-engine.js:175-178,232`). A
   single 0-1 "linger" parameter per section reshapes scroll-to-time mapping (camera
   settles mid-scene, moves faster at the edges) while guaranteeing `f(0)=0, f(1)=1` so
   seam frames are never disturbed. Cheap, reusable, no re-render needed to tune.

5. **Mobile hardening as four named, independent fixes** (`scrub-engine.js:66-73,
   273-323`): seek-coalescing (never queue a new seek while the decoder is still
   resolving one), iOS priming (muted play/pause on first touch + wait for `seeked` not
   just `loadedmetadata` before hiding the poster), resize-gating (ignore height-only
   `resize`, the URL-bar tell, react only to width change), and a coarser mobile seek
   epsilon. Each is independently useful and independently testable.

6. **Reduced-motion as a full data-fetch degrade, not a cosmetic toggle**
   (`scrub-engine.js:199-201`). `prefers-reduced-motion` gates whether clips are ever
   fetched at all, not just whether CSS animates — no wasted bandwidth, and the same
   code path doubles as "no video available" graceful degrade.

7. **`@layer` for injected-component theming** (`scrub-engine.js:438-444`). Wrap a
   component's own default CSS custom properties in `@layer`; the host page's unlayered
   theme rules win automatically, no specificity fight, no `!important`.

8. **Encode-for-seekability, not for keyframe density** (`SKILL.md:523-546`,
   `pipeline.md:119-171`). Native resolution, `crf ~20`, small GOP (`-g 8` desktop /
   `-g 4` mobile) — not all-intra. Seekability comes from blob-loading (#2), so GOP size
   is free to optimize for file size and phone decode cost instead.

9. **Progressive disclosure by file, routed at point of use** (`SKILL.md` References
   section, `752-762`). Heavy reference material (prompt templates, batch scripts, the
   engine itself) lives in separate files named only when that step of the procedure is
   reached — nothing pre-loaded. The instinct is right; this source itself under-applies
   it (see `CONTEXT-STRATEGY.md` for where it still inlines heavy tables it shouldn't).

10. **Open subject question, reserved multiple-choice** (`SKILL.md:80-93`). Ask
    identity-defining questions in open prose; reserve `AskUserQuestion`-style structured
    choice for genuinely enumerable, lower-stakes decisions, always with an escape hatch.
    A model-reasoning-shaping instruction, the same category the frontend-design skill's
    winning mechanisms fall into — not a script or lookup table.
