---
title: WORKFLOW-MAP — ai-website-cloner-template
ai_generated: "(C)"
---

# Step order a run actually takes

| # | Phase | Driven by | What happens |
|---|-------|-----------|---------------|
| 1 | Pre-Flight | `SKILL.md:27-33` | Detect a browser-MCP tool (Chrome/Playwright/Browserbase/Puppeteer — Chrome preferred), validate URL(s), verify `npm run build` on the pre-scaffolded project, create `docs/research/`, `docs/research/components/`, `docs/design-references/`. |
| 2 | Reconnaissance — screenshots | `SKILL.md:124-127` | Full-page screenshots at 1440px and 390px, saved as the "master reference." |
| 3 | Reconnaissance — global extraction | `SKILL.md:129-138` | Fonts (via `<link>` tags + computed `font-family`), colors (mapped onto shadcn CSS-variable token names in `globals.css`), favicons/OG/webmanifest, global CSS/JS patterns (scroll-snap, keyframes, smooth-scroll libraries). |
| 4 | Reconnaissance — mandatory interaction sweep | `SKILL.md:140-166` | Four required sub-sweeps — scroll, click, hover, responsive (1440/768/390) — every finding written to `docs/research/BEHAVIORS.md`. |
| 5 | Reconnaissance — page topology | `SKILL.md:168-176` | Section-by-section map: order, sticky/flow, z-index layers, cross-section dependencies, per-section interaction model. Written to `docs/research/PAGE_TOPOLOGY.md`. |
| 6 | Foundation Build (sequential, not delegated) | `SKILL.md:178-227` | Fonts into `layout.tsx`; color/spacing/keyframe tokens into `globals.css`; TypeScript interfaces into `src/types/`; deduplicated inline SVGs into `src/components/icons.tsx`; a Node script (`scripts/download-assets.mjs`, written fresh each run, not pre-built) that batch-downloads (4 at a time) every image/video found via a DOM-enumeration snippet (`SKILL.md:193-225`); `npm run build` verified. |
| 7 | Per-section extract | `SKILL.md:233-300` | Isolated screenshot; full computed-style extraction via the depth-4 DOM-walk script (`SKILL.md:239-283`); before/after diffing for every stateful element (`SKILL.md:285-296`); verbatim text/alt/aria capture, clicking every tab to capture per-state content (`SKILL.md:296`); layered-image/overlay check (`SKILL.md:298`); sub-component complexity count (`SKILL.md:300`). |
| 8 | Per-section spec write | `SKILL.md:302-375` | One `docs/research/components/<name>.spec.md` file per component/sub-component, following a fixed template (overview, DOM structure, computed styles per element, states/behaviors with trigger+before+after+transition, per-state content, assets, verbatim text, responsive breakpoints). Mandatory — "not optional" (`SKILL.md:304,375`). |
| 9 | Per-section dispatch | `SKILL.md:377-393` | One builder agent per simple section, or one agent per sub-component plus one wrapper agent for complex sections (3+ sub-components), each in its own git worktree, each receiving the spec file's full contents inline (never "go read the spec file," `SKILL.md:386,456`). Foreman does not wait — moves to the next section immediately (`SKILL.md:393`). |
| 10 | Merge | `SKILL.md:395-403` | As worktree branches complete, foreman merges into main, resolves conflicts using its own cross-agent context, reverifies `npm run build` after every merge. |
| 11 | Assembly | `SKILL.md:405-413` | Wire all section components into `src/app/page.tsx`; implement page-level behaviors (scroll-snap, sticky, z-index, smooth scroll); final `npm run build`. |
| 12 | Visual QA Diff | `SKILL.md:415-429` | Side-by-side screenshot comparison at 1440px then 390px, section by section, narrated by the agent — any mismatch triggers either a spec re-extraction or a component fix, then the interactive behaviors are manually re-walked (scroll/click/hover). |
| 13 | Completion report | `SKILL.md:464-473` | Section/component/spec-file counts (should match 1:1), asset counts, build status, remaining QA gaps. |

# What routes the process

Nothing branches on stack or CMS type — the skill is single-path regardless of what the target site
is built on (WordPress, Webflow, hand-rolled React, etc. are all funneled through the same
getComputedStyle-and-screenshot pipeline). The one real fork is complexity-driven, not
content-driven: the "150 lines of spec content" rule (`SKILL.md:49,444,458`) decides whether a
section gets one builder or several. Multi-URL runs get an explicit sequential-vs-parallel choice
posed to the user up front (`SKILL.md:33`), the only place the skill asks a yes/no question rather
than deciding unilaterally.
