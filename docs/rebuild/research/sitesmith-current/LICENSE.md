---
title: LICENSE — sitesmith-current autopsy
ai_generated: "(C)"
---

# Licence file, SPDX, notice requirements, what we may copy vs must re-express

## What is actually present in this checkout

- `skills/sitesmith/SKILL.md` frontmatter: `license: MIT` (SKILL.md:4) — this is the licence
  declared for SiteSmith's own original work.
- Repository root: `LICENSE` file present (not read in full here; referenced by
  `LICENSE-AUDIT.md`).
- `skills/sitesmith/THIRD-PARTY-NOTICES.md` — travels with every installed provider bundle
  (SKILL.md:186-192); documents each of the four upstream sources with their own copyright
  notice and full licence text inline.
- `skills/sitesmith/LICENSES/Apache-2.0.txt` — complete Apache-2.0 licence text (11,358 bytes),
  shipped alongside the notices file because Apache-2.0 requires the licence text to travel with
  redistributed material.
- Root `LICENSE-AUDIT.md` (104 lines) — a verdict table with an explicit "may we redistribute?"
  column and a dated correction note (2026-07-30) narrowing earlier "kept verbatim" claims.
- `docs/v3/LICENSE-DERIVATION-AUDIT.md` (444 lines, not fully read here) — described as "the
  canonical file/span/hash map."

## SPDX / licence identifiers by source

| Source | Licence | SPDX | Copyright |
|---|---|---|---|
| SiteSmith original work | MIT | `MIT` | (repo owner) |
| taste-skill | MIT | `MIT` | (c) 2026 Leonxlnx |
| ui-ux-pro-max-skill | MIT | `MIT` | (c) 2024 Next Level Builder |
| frontend-design | Apache 2.0 | `Apache-2.0` | Anthropic (anthropics/claude-plugins-official) |
| impeccable | Apache 2.0 | `Apache-2.0` | Paul Bakaus |
| website-builder-setup | **none** | — | tenfoldmarc — **removed from the repo, not redistributable** |
| redesign-skill | **unknown/unverifiable** | — | no traceable author (570+ near-identical GitHub copies, none original) — **removed, not redistributable** |

## Notice requirements actually in force

- **MIT (taste-skill, ui-ux-pro-max-skill)**: copyright notice + permission notice must be
  included in copies/substantial portions. `THIRD-PARTY-NOTICES.md` reproduces both notices in
  full (lines 8-33 for taste-skill, 35-58 for ui-ux-pro-max).
- **Apache 2.0 (frontend-design, impeccable)**: requires the licence text to accompany
  redistributed material and a description of modifications where the work has been changed.
  `LICENSE-AUDIT.md` records this was done: "Frozen body embedded... attributed,
  modification-described and shipped with the complete Apache licence" and "attribution headers
  added and 32 links repointed" for impeccable.

## What our own rebuild repo may copy verbatim vs must re-express

**This autopsy did not reproduce verbatim text from any source** — per the task's own rule, at
most one short quote per point, and none of the four MIT/Apache sources needed quoting to make
an evidentiary point (file paths + line numbers + paraphrase were sufficient throughout).

For the rebuild itself (out of scope for this file, but the relevant constraint to carry
forward):

- **May copy verbatim, with notice**: text originating in `taste-skill`, `ui-ux-pro-max-skill`
  (MIT), `frontend-design`, `impeccable` (Apache 2.0) — but only the same excerpts SiteSmith
  itself already identified as such in `docs/v3/LICENSE-DERIVATION-AUDIT.md`, carrying the
  required notices forward.
- **Must re-express, never copy**: anything descended from `website-builder-setup` (no licence
  at all — SiteSmith's own audit already removed and rewrote this) or `redesign-skill`
  (unverifiable provenance — also already removed and rewritten). SiteSmith's own
  `LICENSE-AUDIT.md` treats these as a closed matter: replaced with original material, and the
  general design principles they discussed ("limit line length," "use one accent colour") are
  explicitly noted as facts/techniques, not protected expression, so the *underlying ideas* are
  fine to reuse — only their specific wording is not.
- **All of SiteSmith's own v2/, blocks/, scripts/verify.mjs, scripts/token-drift.mjs and the
  rest of the original scripts are MIT** (SKILL.md:194-195) — freely reusable with attribution,
  which is the majority of what this autopsy recommends adopting (see MECHANISMS.json: nearly
  every `decision: adopt` entry cites an MIT-licensed original-work file).

## Bottom line for the rebuild

No licensing obstacle exists for adopting the mechanisms recommended in this autopsy
(verify/direction-fidelity/direction-check/direction-history/token-drift/production-gate/
journey/portfolio-diversity/critique-gate, and the v2/*.md prose) — all are SiteSmith's own MIT
original work. The one mechanism explicitly recommended against (`direction-candidate-search` /
`design-system-py-legacy-generator`, both descended from `ui-ux-pro-max-skill`'s MIT-licensed
BM25 engine) is rejected on merit (mechanical creativity), not on licence grounds — it could be
copied verbatim under MIT with attribution, but the rebuild should not want to.
