---
title: SiteSmith v3 upstream forensics
status: complete
date: 2026-07-30
ai_generated: "(C)"
---

# SiteSmith v3 upstream forensics

## Contents

- [1. Scope and evidence rules](#1-scope-and-evidence-rules)
- [2. Frozen comparison units](#2-frozen-comparison-units)
- [3. taste-skill](#3-taste-skill)
- [4. ui-ux-pro-max](#4-ui-ux-pro-max)
- [5. frontend-design](#5-frontend-design)
- [6. impeccable](#6-impeccable)
- [7. Cross-system findings](#7-cross-system-findings)

## 1. Scope and evidence rules

This audit treats each upstream as a system, not a slogan. It inspects the public entry point plus
the skills, prompts, scripts, CLI, hooks, tests, data, templates, provider packaging, persistent
artifacts, browser integration, network behaviour and licence material reachable from that entry
point. A README claim is not runtime evidence. Each material statement is labelled:

- **SOURCE FACT**: visible in a pinned file and line range;
- **OBSERVED**: reproduced by a read-only command, safe dry-run or structural fixture;
- **ABSENT AT REVISION**: no contract or implementation was found in the frozen tree after named
  searches; this is not a claim about private services or future versions;
- **INTERPRETATION**: a design conclusion, never presented as upstream intent.

The clones remained clean after inspection. No website, image, customer fixture or upstream write
was performed. Code graphs were used only to locate connections and were checked against source.

## 2. Frozen comparison units

`git ls-remote <repo> HEAD refs/heads/main` was run on 2026-07-30 and matched the checked-out commit
for all four repositories. `git rev-parse HEAD`, `git remote get-url origin` and `git status --short`
then verified identity and a clean clone.

| System | Frozen repository and commit | Native comparison unit | Why this revision |
| --- | --- | --- | --- |
| taste-skill | [`Leonxlnx/taste-skill@e988add`](https://github.com/Leonxlnx/taste-skill/tree/e988add20dab0fa97d7a76781c48961c8184288e) | Public repository, default `design-taste-frontend` and all advertised siblings | Commit was public `main`/`HEAD` when frozen; auditing siblings prevents the default skill from standing in for the whole product. |
| ui-ux-pro-max | [`nextlevelbuilder/ui-ux-pro-max-skill@4857a2c`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/4857a2c5ef989794751a0f66b8545a4a49566286) | `uipro` CLI, installed seven-skill bundle, source data/scripts and optional stack product | Commit was public `main`/`HEAD`; this preserves the distinction between core search, installed bundle and non-bundled stack audit. |
| frontend-design | [`anthropics/skills@b29e7cf`](https://github.com/anthropics/skills/tree/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design) | `skills/frontend-design` as installed through the `example-skills` plugin | This is the repository explicitly named for the comparison and was public `main`/`HEAD`; the older plugin repository is retained only in the derivation audit. |
| impeccable | [`pbakaus/impeccable@6b34224`](https://github.com/pbakaus/impeccable/tree/6b342244e915d64b0d6e84d5eec448fd196ce6bb) | Default installer, provider packs, skill, CLI/detector engine, hooks and decision workflow | Commit was public `main`/`HEAD`; excluding the CLI or provider packs would materially understate the product. |

## 3. taste-skill

### 3.1 Classification and package boundary

**SOURCE FACT:** Taste is a prompt library, not a website-generation runtime. The frozen tree has
58 tracked files and thirteen `SKILL.md` packages with thirteen distinct frontmatter names. The
documented install paths are an external `npx skills add` scan, single-skill selection by the
frontmatter `name`, or copying/pasting Markdown. The README explicitly separates implementation
skills from image-only skills.
[`README.md` L75–147](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/README.md#L75-L147).

The local registry is a 24-line Bash lookup that prints a relative file path; it is not an
orchestrator. Its folder-style aliases differ from several install names.
[`skill.sh` L3–24](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skill.sh#L3-L24),
[`llms.txt` L1–13](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/llms.txt#L1-L13).
Claude plugin metadata exists, but both manifests say `1.0.0` while the default skill is described
as experimental v2 and has no machine-readable skill version. The frozen commit has no local tag.
[`plugin.json` L1–19](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/.claude-plugin/plugin.json#L1-L19),
[`CHANGELOG.md` L7–20](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/CHANGELOG.md#L7-L20).

**OBSERVED:** the frozen tree contains no tracked application runtime, package/lock manifest,
test/spec path, CI workflow, lifecycle hook, provider adapter, event log or state store. The
announced `skills/taste-skill/blocks/` directory is absent. Four `.mjs` files are repository-image
maintenance scripts, not product runtime; they import undeclared `sharp`, and three depend on
hard-coded `C:/Users/User/Downloads/...` inputs.
[`build-emil-sponsor-row.mjs` L1–41](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/scripts/build-emil-sponsor-row.mjs#L1-L41),
[`convert-readme-assets-webp.mjs` L76–142](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/scripts/convert-readme-assets-webp.mjs#L76-L142).

### 3.2 Actual fifteen-step activation flow

Steps 1–3 are external host behaviour. Steps 4–15 are natural-language instructions to the model;
the repository has no engine that guarantees their order or records their completion.

| Step | Frozen behaviour | Evidence and boundary |
| --- | --- | --- |
| 1. Acquire | Install from GitHub with `npx skills add`, select one skill, or copy the Markdown. | **SOURCE FACT:** [`README.md` L75–107](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/README.md#L75-L107). No commit/checksum pin is required by the documented command. |
| 2. Discover | The external CLI scans `skills/`; selection uses frontmatter `name`, not folder alias. | **SOURCE FACT:** [`README.md` L77–86](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/README.md#L77-L86). CLI implementation is not vendored. |
| 3. Activate | The host matches the request to the frontmatter description; plugin and Copilot files are alternate entry surfaces. | **SOURCE FACT:** [`SKILL.md` L1–9](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L1-L9), [`copilot-instructions.md` L1–11](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/.github/copilot-instructions.md#L1-L11). Trigger priority and provider parity are unspecified. |
| 4. Scope | Classify supported landing/portfolio/redesign work and route excluded dense product surfaces elsewhere. | **SOURCE FACT:** [`SKILL.md` L896–906](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L896-L906). This is prose routing only. |
| 5. Read brief | Inspect page kind, vibe, references, audience, brand and quiet constraints. | **SOURCE FACT:** [`SKILL.md` L13–24](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L13-L24). Missing values have no confidence/evidence fields. |
| 6. Declare | Emit a one-line Design Read before code. | **SOURCE FACT:** [`SKILL.md` L25–31](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L25-L31). It remains chat text, not an artifact. |
| 7. Clarify | Ask exactly one question only when alternatives materially diverge; otherwise infer and proceed. | **SOURCE FACT:** [`SKILL.md` L33–39](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L33-L39). One question can leave independent material unknowns open. |
| 8. Set dials | Infer `DESIGN_VARIANCE`, `MOTION_INTENSITY` and `VISUAL_DENSITY`; baseline is 8/6/4 unless context or user override wins. | **SOURCE FACT:** [`SKILL.md` L43–78](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L43-L78), [`L552–568`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L552-L568). Mapping is model-dependent and unpersisted. |
| 9. Map language | Choose one official design system when applicable; otherwise label the aesthetic as a native/custom implementation. | **SOURCE FACT:** [`SKILL.md` L82–118](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L82-L118). Package freshness is not checked by Taste. |
| 10. Select project mode | Detect Greenfield, Preserve or Overhaul; audit and preserve contracts for redesigns. | **SOURCE FACT:** [`SKILL.md` L783–831](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L783-L831). No baseline schema or rollback record is defined. |
| 11. Check dependencies | Inspect `package.json` before third-party imports and print a missing-package install command. | **SOURCE FACT:** [`SKILL.md` L122–157](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L122-L157), [`L987–1030`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L987-L1030). Versions, lockfile and install result are unspecified. |
| 12. Compose direction | Apply typography, colour, layout, component, copy, theme, anti-slop, pattern and motion rules. | **SOURCE FACT:** [`SKILL.md` L161–350](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L161-L350), [`L595–779`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L595-L779). Rule precedence and valid exceptions are not machine-defined. |
| 13. Source assets and build | Prefer generated imagery, then relevant brand/open assets, then explicit TODO placeholders; implement the page. | **SOURCE FACT:** [`SKILL.md` L262–296](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L262-L296). Provider, rights manifest, budget, retry and output paths are absent. |
| 14. Self-check | The same model evaluates 62 Markdown preflight boxes and is told to test themes and plausibly meet CWV targets. | **SOURCE FACT:** [`SKILL.md` L910–979](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L910-L979). This is self-attestation, not executable proof. |
| 15. Repair and deliver | Fix failed boxes, then return code/images/chat output. | **SOURCE FACT:** [`SKILL.md` L910–979](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L910-L979). There is no bounded retry, independent reviewer, resumable run state or completion attestation. |

### 3.3 Mechanisms that carry useful information

The default skill's strongest mechanism is the visible chain from six brief signals to Design Read,
three dials and a system-versus-aesthetic decision. The redesign protocol separately protects IA,
brand, copy, accessibility and analytics, and requires approval before changing URLs, navigation,
form names, wordmarks or legal copy.
[`SKILL.md` L13–118](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L13-L118),
[`L783–831`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L783-L831).

The craft material is a mixed policy catalogue. It includes measurable protections such as one
shape system, readable CTA/form contrast, mobile collapse, reduced motion, transform/opacity-only
animation and lifecycle cleanup. It also includes subjective universal bans, mechanical novelty
quotas and cross-run rotation based on a “previous project” that the repository never stores.
[`SKILL.md` L165–260](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L165-L260),
[`L519–591`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L519-L591),
[`L595–701`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L595-L701).
SiteSmith therefore treats those items as separate invariants, brand constraints, domain defaults,
risk heuristics and opt-in style choices; it does not import the whole list as one priority level.

The pattern vocabulary is explicitly descriptive rather than executable. The subsequent Block
Library section defines future metadata/body requirements, but no upstream blocks exist at the
frozen revision.
[`SKILL.md` L705–779](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L705-L779),
[`L835–893`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L835-L893).

### 3.4 Runtime, artifacts, state and network

| Concern | Frozen mechanism | Evidence/status |
| --- | --- | --- |
| Execution runtime | Model follows Markdown after host activation; no Taste process executes the sequence. | **SOURCE FACT / ABSENT AT REVISION:** default [`SKILL.md` L1–9](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L1-L9); no runtime manifest or entry point found. |
| Primary artifacts | Normal outputs are host-chosen code, images and chat text. Design Read, dials, audits and preflight results have no canonical path/schema. | **ABSENT AT REVISION.** The only named handoff artifact is Stitch's `DESIGN.md`: [`stitch-skill` L8–25](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/stitch-skill/SKILL.md#L8-L25), [`L115–162`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/stitch-skill/SKILL.md#L115-L162). |
| Persistent state | Internal design bibles/logs and previous-project rotation are prompt concepts, not stores. No event log, run ID, checkpoint, cache or resume token exists. | **ABSENT AT REVISION:** rotation language in [`SKILL.md` L165–207](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L165-L207); mobile internal bible in [`imagegen-frontend-mobile` L260–319](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/imagegen-frontend-mobile/SKILL.md#L260-L319). |
| Reference-image flow | `image-to-code` mandates image → analysis → code for most design work; web/mobile image skills request many separate frames. | **SOURCE FACT:** [`image-to-code` L112–411](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/image-to-code-skill/SKILL.md#L112-L411), [`imagegen-web` L397–447](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/imagegen-frontend-web/SKILL.md#L397-L447). No provider, seed, frame manifest, rights log, cost ceiling or retry budget. |
| Network | Install uses GitHub/npm. Suggested builds may use npm design systems, image generation, Picsum, Simple Icons/devicon and Stitch/MCP. | **SOURCE FACT:** [`README.md` L75–89](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/README.md#L75-L89), [`SKILL.md` L262–280](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L262-L280), [`stitch-skill` L13–15](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/stitch-skill/SKILL.md#L13-L15). Cache, provenance, timeout, retry, offline and failure policy are absent. |
| Tests and proof | The default preflight has 62 unchecked boxes, but the repository has no test/spec files, browser fixtures, provider mocks or recorded runs. | **OBSERVED:** static enumeration at the frozen tree; preflight source [`L910–979`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/taste-skill/SKILL.md#L910-L979). |
| Research | `research/laziness/` supplies rationale for output enforcement. Numeric claims have no URLs, DOI, authors, datasets, scripts or raw results in the repository. | **UNVERIFIED UPSTREAM CLAIM:** [`empirical-results.md` L3–58](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/research/laziness/findings/empirical-results.md#L3-L58), [`references.md` L3–20](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/research/laziness/findings/references.md#L3-L20). |

Sibling prompts are not a safe substitute for missing runtime. GPT Taste narrates a simulated
Python selection rather than executing one and forces AIDA/GSAP; other lenses conflict on type,
overlap, radii, palette and motion. The redesign sibling even suggests randomized dates, while the
brutalist lens permits invented telemetry/legal symbols.
[`gpt-tasteskill` L13–29](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/gpt-tasteskill/SKILL.md#L13-L29),
[`L46–74`](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/gpt-tasteskill/SKILL.md#L46-L74),
[`redesign-skill` L77–89](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/redesign-skill/SKILL.md#L77-L89),
[`brutalist-skill` L73–92](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/skills/brutalist-skill/SKILL.md#L73-L92).
There is no router or precedence resolver, so loading the full bundle can activate contradictory
natural-language policies.

### 3.5 Capability index and SiteSmith disposition

The full 26-field records are canonical in the forthcoming
[`UPSTREAM-CAPABILITY-LEDGER.json`](./UPSTREAM-CAPABILITY-LEDGER.json). This table is only the
forensic index; decisions mean retain/adapt/reimplement/integrate/reject as defined by that ledger.

| Capability record | Upstream mechanism | SiteSmith disposition / successor |
| --- | --- | --- |
| [`TASTE-CAP-001`](./UPSTREAM-CAPABILITY-LEDGER.json) | Package acquisition, discovery and aliases | **reimplement** → `SS3.CAPABILITY_REGISTRY` |
| [`TASTE-CAP-002`](./UPSTREAM-CAPABILITY-LEDGER.json) | Brief inference and Design Read | **adapt** → `SS3.BRIEF_EVIDENCE` |
| [`TASTE-CAP-003`](./UPSTREAM-CAPABILITY-LEDGER.json) | Three-dial direction policy | **adapt** → `SS3.DIRECTION_POLICY` |
| [`TASTE-CAP-004`](./UPSTREAM-CAPABILITY-LEDGER.json) | Design-language and official-system map | **adapt** → `SS3.DESIGN_SYSTEM_CATALOG` |
| [`TASTE-CAP-005`](./UPSTREAM-CAPABILITY-LEDGER.json) | Typography, colour, layout, copy and anti-repetition rules | **adapt** → `SS3.CRAFT_CONSTRAINTS` |
| [`TASTE-CAP-006`](./UPSTREAM-CAPABILITY-LEDGER.json) | Asset sourcing/reference hierarchy | **reimplement** → `SS3.ASSET_PLAN` |
| [`TASTE-CAP-007`](./UPSTREAM-CAPABILITY-LEDGER.json) | Motion, performance, accessibility and theme rules | **adapt** → `SS3.MOTION_AND_A11Y_CONTRACT` |
| [`TASTE-CAP-008`](./UPSTREAM-CAPABILITY-LEDGER.json) | Redesign audit and preservation | **adapt** → `SS3.REDESIGN_BASELINE` |
| [`TASTE-CAP-009`](./UPSTREAM-CAPABILITY-LEDGER.json) | Final preflight | **reimplement** → `SS3.RELEASE_GATES` |
| [`TASTE-CAP-010`](./UPSTREAM-CAPABILITY-LEDGER.json) | Pattern vocabulary and future block contract | **adapt** → `SS3.PATTERN_CATALOG` |
| [`TASTE-CAP-011`](./UPSTREAM-CAPABILITY-LEDGER.json) | Image-to-code pipeline | **adapt** → `SS3.REFERENCE_RENDER_PIPELINE` |
| [`TASTE-CAP-012`](./UPSTREAM-CAPABILITY-LEDGER.json) | Website reference-image generator | **reimplement** → `SS3.WEB_REFERENCE_FRAMES` |
| [`TASTE-CAP-013`](./UPSTREAM-CAPABILITY-LEDGER.json) | Mobile screen/flow generator | **reject**, successor `none` → named loss: App-native flow/readability consistency; exact exclusion only |
| [`TASTE-CAP-014`](./UPSTREAM-CAPABILITY-LEDGER.json) | Brand-kit raster-board generator | **reimplement** → clean-room `SS3.BRAND_INPUT_VALIDATOR`; retain meaning-first questions with positive successor proof and a separate old-mechanism negative fixture |
| [`TASTE-CAP-015`](./UPSTREAM-CAPABILITY-LEDGER.json) | Stitch semantic `DESIGN.md` | **adapt** → provider-neutral `SS3.DESIGN_SPEC` |
| [`TASTE-CAP-016`](./UPSTREAM-CAPABILITY-LEDGER.json) | Style siblings, legacy v1 and GPT recipe | **reimplement** → clean-room `SS3.STYLE_LENSES`; retain legible aesthetic extremes with positive successor proof and a separate persona/randomness negative fixture |
| [`TASTE-CAP-017`](./UPSTREAM-CAPABILITY-LEDGER.json) | Output enforcement and laziness research | **reimplement** → clean-room transactional `SS3.RUN_CHECKPOINTS`; retain deliverable counting with positive successor proof and a separate urgency/pause-marker negative fixture |
| [`TASTE-CAP-018`](./UPSTREAM-CAPABILITY-LEDGER.json) | Copilot instruction surface | **reimplement** → `SS3.PROVIDER_ADAPTERS` |
| [`TASTE-CAP-019`](./UPSTREAM-CAPABILITY-LEDGER.json) | README/sponsor image-maintenance scripts | **reject**, successor `none` → named loss: Small understandable transformations; exact exclusion only |

### 3.6 Licence and derivation boundary

Taste is MIT, Copyright © 2026 Leonxlnx. Copies or substantial portions must retain the copyright
and permission notice.
[`LICENSE` L1–20](https://github.com/Leonxlnx/taste-skill/blob/e988add20dab0fa97d7a76781c48961c8184288e/LICENSE#L1-L20).
That licence covers Taste's repository material, not the independent licences/terms of named design
systems, packages, fonts, logos, photos, generated assets, Stitch or image providers.

**OBSERVED:** the Taste-derived spans currently present in SiteSmith references 01–05 and 08–09
match their pinned source lines exactly, but every file also has a SiteSmith wrapper; files 01 and
05 are assembled from multiple source spans/sources, and file 09 adds explanatory notes. They are
not whole-file verbatim copies. Exact source/target ranges and the separate Apache-licensed
frontend-design segment in file 05 belong in
[`LICENSE-DERIVATION-AUDIT.md`](./LICENSE-DERIVATION-AUDIT.md), not in the capability ledger.

## 4. ui-ux-pro-max

### 4.1 Classification and package boundary

**SOURCE FACT:** UI/UX Pro Max is three related surfaces, not one generator. The core is an offline,
Python-standard-library search and recommendation runtime over CSV data. Default `uipro init`
materialises that runtime plus an orchestrator and six sibling skills from bundled templates. A
separate `stack/` product adds browser/MCP setup and is not installed by the default bundle.
[`init.ts` L127–193](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/commands/init.ts#L127-L193),
[`template.ts` L208–287](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/utils/template.ts#L208-L287),
[`sync-assets.mjs` L22–46](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/scripts/sync-assets.mjs#L22-L46).

Default installation is local/offline. `--legacy` instead resolves the latest GitHub release and
downloads a ZIP; `update` and `versions` also require GitHub. The frozen CLI declares nineteen
concrete AI targets plus `all`, and every provider template requests a full install. Provider
generation is not lossless: Antigravity and Codex resolve to the same `.agents` skill path, while
`--ai all` iterates Antigravity first and suppresses the later duplicate. Provider-generation
exceptions are caught and omitted rather than failing the whole operation.
[`types/index.ts` L1–69](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/types/index.ts#L1-L69),
[`template.ts` L295–317](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/utils/template.ts#L295-L317).

**OBSERVED:** no lifecycle hook is installed by the default product. The optional stack has its own
`.mcp.json`, commands and setup script. Platform metadata also drifts: `skill.json` advertises
OpenClaw but not CodeWhale, while the CLI advertises CodeWhale but not OpenClaw. Frozen HEAD/tag is
`v2.11.3`; skill/plugin manifests say `2.11.0`, while source `cli/package.json` says `2.5.0`.
[`skill.json` L20–41](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/skill.json#L20-L41),
[`sync-release-version.mjs` L1–77](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/scripts/sync-release-version.mjs#L1-L77).

### 4.2 Actual fifteen-step activation flow

Steps 1–2 are CLI/package behaviour, steps 3–14 combine host-agent instructions with local Python,
and step 15 is a separate online lifecycle command. “Parallel” in the generated documentation is
not runtime behaviour: the generator searches its domains in a sequential `for` loop.

| Step | Frozen behaviour | Evidence and boundary |
| --- | --- | --- |
| 1. Choose install mode | `uipro init` uses bundled template generation by default; `--legacy` switches to a GitHub release ZIP. | **SOURCE FACT:** [`init.ts` L127–193](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/commands/init.ts#L127-L193). Default and legacy have different network/reproducibility boundaries. |
| 2. Materialise provider | Load provider JSON, render the prompt/quick reference and copy data, scripts and six sibling skills. | **SOURCE FACT:** [`template.ts` L35–165](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/utils/template.ts#L35-L165), [`L172–287`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/utils/template.ts#L172-L287). Overlay copy does not remove stale owned files. |
| 3. Activate skill | Host matches a UI-structure, visual-decision, interaction or UX-quality request to the installed prompt. | **SOURCE FACT:** [`SKILL.md` L10–18](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L10-L18). Host matching is not implemented in this repository. |
| 4. Inspect requirements | Infer product type, audience, style words, actual framework and web/native platform from request and project files. | **SOURCE FACT:** [`SKILL.md` L49–55](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L49-L55). No typed brief, evidence path or confidence is emitted. |
| 5. Resolve Python | Build the full script path from plugin root and verify Python. The current template says stop and ask rather than run a package manager. | **SOURCE FACT:** [`SKILL.md` L37–45](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L37-L45), [`skill-content.md` L5–19](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/templates/base/skill-content.md#L5-L19). |
| 6. Invoke required generator | New project/page work starts with `search.py <query> --design-system`; output may be JSON, ASCII or Markdown and may include three dials. | **SOURCE FACT:** [`SKILL.md` L57–70](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L57-L70), [`search.py` L91–129](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/search.py#L91-L129). |
| 7. Classify product | Weighted keyword groups select one product/industry category; ties and fallback follow fixed source order. | **SOURCE FACT:** [`core.py` L319–408](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/core.py#L319-L408). There is no uncertainty gate. |
| 8. Retrieve reasoning | Match the category to `ui-reasoning.csv`, derive priorities/rationale and fall back when no category matches. | **SOURCE FACT:** [`design_system.py` L81–201](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L81-L201). Parsed decision rules are not enforced by formatters. |
| 9. Search dimensions | Search product, style, colour, typography and landing data sequentially; style query is augmented with the first two reasoning priorities. | **SOURCE FACT:** [`design_system.py` L95–106](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L95-L106), [`L207–329`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L207-L329). |
| 10. Apply dials and compose | Variance biases style, motion selects a GSAP row and density rewrites spacing; top rows collapse into one recommendation. | **SOURCE FACT:** [`design_system.py` L35–77](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L35-L77), [`search.py` L97–124](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/search.py#L97-L124). No cross-domain conflict resolver exists. |
| 11. Supplement lookups | Optionally query one of twelve domains and one of twenty-two stacks; retry or disclose fallback on zero results. | **SOURCE FACT:** [`SKILL.md` L116–154](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L116-L154), [`core.py` L411–464](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/core.py#L411-L464). Output has no enforceable fallback flag. |
| 12. Persist optionally | `--persist --output-dir <root>` writes `design-system/<slug>/MASTER.md` and an optional page override; existing MASTER skips unless forced. | **SOURCE FACT:** [`SKILL.md` L72–91](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L72-L91), [`design_system.py` L668–789](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L668-L789). |
| 13. Synthesize and implement | Host agent interprets recommendations with its general knowledge and writes the actual UI/code. | **SOURCE FACT:** [`SKILL.md` L156–175](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L156-L175). Python emits guidance/artifacts, not a website. |
| 14. Self-check | Host follows icon, interaction, responsive, contrast and accessibility checklists. Core has no connected browser proof. | **SOURCE FACT:** [`SKILL.md` L194–196](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.claude/skills/ui-ux-pro-max/SKILL.md#L194-L196), [`quick-reference.md` L194–297](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/templates/base/quick-reference.md#L194-L297). |
| 15. Update separately | `uipro update` queries latest GitHub release, may install the CLI globally through npm and asks for a forced re-init; `versions` is always online. | **SOURCE FACT:** [`update.ts` L30–93](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/commands/update.ts#L30-L93), [`versions.ts` L10–45](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/commands/versions.ts#L10-L45). Installed skill migration is a second operation. |

### 4.3 Search, classifier, reasoning and composition

The local engine has twelve data-domain configurations and twenty-two stack configurations. It
normalises a small synonym set, builds an in-process BM25 index with `k1=1.5` and `b=0.75`, returns
positive-score rows only and resolves ties by CSV order. Zero-hit suggestions use a coarse
three-character prefix. Result projections omit the source row number and BM25 score.
[`core.py` L17–119](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/core.py#L17-L119),
[`L122–289`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/core.py#L122-L289).

**OBSERVED:** the frozen source has 192 product rows, 192 colour rows, 84 styles, 74 typography
rows, 34 landing rows and 161 reasoning rows. Exact product-title queries classified all 192
labels, but the independent style search had zero positive hits in 53/192 cases, typography in
83/192 and landing in 106/192. Final output used `Inter / Inter` in 103/192 cases and only 29 final
style labels. Product recommendation and final style did not even share a literal style label in
79/192 cases. These are concentration and composition observations, not aesthetic scores.

`ui-reasoning.csv` contains duplicate JSON object keys in 66/161 `Decision_Rules` cells. Python
accepts the JSON and silently keeps the final duplicate; for example Government loses its earlier
WCAG rule, Beauty loses booking and Legal loses case-results. The validator checks parseability,
not duplicate keys. The raw result carries `decision_rules`, but ASCII, Markdown and MASTER
formatters never consume it.
[`validate_data.py` L75–83](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/validate_data.py#L75-L83),
[`design_system.py` L303–317](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L303-L317).

**OBSERVED:** representative runs exposed the boundary. A seed-library query classified as a
component library; a beauty query selected Soft UI plus pink/lavender and lost one duplicated rule;
a fintech product row recommended Glassmorphism/Dark OLED while the composed style was Exaggerated
Minimalism. Nonsense input returned General/Flat Design/Inter without a fallback marker. The page
classifier maps “accounting landing” to Settings/Profile because it matches `account`, and
“orderly homepage” to Checkout/Payment because it matches `order`.
[`design_system.py` L1324–1356](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L1324-L1356).

**INTERPRETATION:** the database is useful bounded evidence after a product world is qualified. It
is not a safe direction oracle. SiteSmith v3 therefore retains deterministic lookup behind an
adapter, rejects top-one category/style promotion, and requires contrasting candidates, source
provenance, conflict visibility and an approved typed DesignSpec before implementation.

### 4.4 Runtime, artifacts, state, network and tests

| Concern | Frozen mechanism | Evidence/status |
| --- | --- | --- |
| Core runtime | Python standard library reads local CSV, tokenises, ranks and formats. Raw JSON repeated byte-identically on the same query/data/options. | **OBSERVED:** no third-party Python import or core network call; 12/12 domain and 22/22 stack positive-hit smoke passed. |
| Ephemeral state | CSV/BM25 objects are cached in-process. No cross-run search history, run ID, decision log, confidence state or resume token exists. | **SOURCE FACT / ABSENT AT REVISION:** cache in [`core.py` L229–263](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/core.py#L229-L263). |
| Primary outputs | Search rows and a design-system object rendered as JSON, ASCII or Markdown. The output omits scores, stable row IDs, data hash/version, source commit and fallback status. | **SOURCE FACT:** [`search.py` L91–162](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/search.py#L91-L162), [`core.py` L267–289](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/core.py#L267-L289). |
| Persistent design artifact | `design-system/<project-slug>/MASTER.md` and optional page Markdown. Timestamps make files non-byte-deterministic. Existing MASTER returns before a new page can be added; `--force` then overwrites MASTER. | **SOURCE FACT:** [`design_system.py` L739–789](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L739-L789), [`L792–805`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/design_system.py#L792-L805). Generated template docs still describe a flat `design-system/MASTER.md`. |
| Installer state | Copy/overlay writes provider files, runtime data/scripts and six siblings. Existing orchestrator without force returns before refreshing any of them; stale files are not reconciled by an ownership manifest. | **SOURCE FACT:** [`template.ts` L172–287](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/utils/template.ts#L172-L287). Legacy success also leaves the first of two temp directories behind: [`init.ts` L61–81](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/commands/init.ts#L61-L81), [`extract.ts` L125–146](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/utils/extract.ts#L125-L146). |
| Default network | None for template install or core search. | **SOURCE FACT:** bundled asset generation in [`init.ts` L127–193](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/commands/init.ts#L127-L193). |
| Lifecycle network | Legacy install/update/versions use GitHub API/assets; update may invoke global npm. Sibling skills can introduce Gemini, Pexels or shadcn/API behaviour beyond the core. | **SOURCE FACT:** [`github.ts` L54–123](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/utils/github.ts#L54-L123), [`update.ts` L30–93](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/src/commands/update.ts#L30-L93). |
| Optional browser stack | `design-audit.mjs` captures six viewport tiers, writes screenshots plus `report.md`/`report.json`, and exits 2 only for high findings. README says seven tiers; design-plan calls nonexistent `--domain web-vitals`; MCP packages use `@latest`. | **SOURCE FACT:** [`design-audit.mjs` L1–229](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/stack/scripts/design-audit.mjs#L1-L229), [`.mcp.json` L1–16](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/stack/.mcp.json#L1-L16), [`design-plan.md` L15–20](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/stack/.claude/commands/design-plan.md#L15-L20). Not run in this read-only audit. |
| Unit/data tests | Sixteen stdlib unit tests passed; data validator passed 12 domains, 22 stacks and reasoning; CSV validator passed 35 runtime CSVs; asset-sync check passed. | **OBSERVED.** Coverage includes tokenisation, basic hits, detection and persist/skip/force. It omits ranking quality, classifier corpus, duplicate keys, composition, providers and install/update/uninstall. [`test_core.py` L1–134](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/src/ui-ux-pro-max/scripts/tests/test_core.py#L1-L134). |
| Browser CI | One Playwright test opens a checked-in static preview, checks visible body and no console error. The generator emits guidance/Markdown, not that HTML. | **SOURCE FACT:** [`preview.spec.ts` L8–31](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/tests/e2e/preview.spec.ts#L8-L31), [`tests.yml` L14–43](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/.github/workflows/tests.yml#L14-L43). It is not generator-connected product proof. |

### 4.5 Capability index and SiteSmith disposition

The complete 26-field records are canonical in
[`UPSTREAM-CAPABILITY-LEDGER.json`](./UPSTREAM-CAPABILITY-LEDGER.json). This table keeps the fifteen
audited mechanisms visible and links every stable ID to that ledger.

| Capability record | Upstream mechanism | SiteSmith disposition / successor |
| --- | --- | --- |
| [`uupm.skill.activation`](./UPSTREAM-CAPABILITY-LEDGER.json) | Prompt activation and workflow entry | **adapt** → `sitesmith.v3.activation-and-brief-gate` |
| [`uupm.requirements.stack-detect`](./UPSTREAM-CAPABILITY-LEDGER.json) | Requirement and framework/platform inference | **adapt** → `sitesmith.v3.brief-and-stack-resolver` |
| [`uupm.search.bm25`](./UPSTREAM-CAPABILITY-LEDGER.json) | Deterministic local BM25 retrieval | **integrate** → `sitesmith.v3.evidence-index` |
| [`uupm.classify.product-reasoning`](./UPSTREAM-CAPABILITY-LEDGER.json) | Top-one product classification and reasoning row | **reimplement** → clean-room `sitesmith.v3.world-qualification-and-signal-extractor`; retain 192-category coverage with positive successor proof and a separate top-one-mechanism negative fixture |
| [`uupm.generate.design-system`](./UPSTREAM-CAPABILITY-LEDGER.json) | One-shot cross-domain recommendation | **reimplement** → `sitesmith.v3.designspec-compiler` |
| [`uupm.tune.design-dials`](./UPSTREAM-CAPABILITY-LEDGER.json) | Variance, motion and density controls | **adapt** → `sitesmith.v3.aesthetic-control-vector` |
| [`uupm.lookup.domain-knowledge`](./UPSTREAM-CAPABILITY-LEDGER.json) | Twelve domain datasets | **integrate** → `sitesmith.v3.bounded-ux-knowledge-query` |
| [`uupm.lookup.stack-guidance`](./UPSTREAM-CAPABILITY-LEDGER.json) | Twenty-two implementation-stack datasets | **adapt** → `sitesmith.v3.stack-adapter-contracts` |
| [`uupm.persist.master-overrides`](./UPSTREAM-CAPABILITY-LEDGER.json) | MASTER/page Markdown persistence | **reimplement** → `sitesmith.v3.versioned-designspec-store` |
| [`uupm.provider.template-build`](./UPSTREAM-CAPABILITY-LEDGER.json) | Nineteen-provider template build | **adapt** → `sitesmith.v3.provider-compiler` |
| [`uupm.cli.install-uninstall`](./UPSTREAM-CAPABILITY-LEDGER.json) | Bundled/legacy installation and removal | **adapt** → `sitesmith.v3.transactional-installer` |
| [`uupm.cli.update-versions`](./UPSTREAM-CAPABILITY-LEDGER.json) | Online release/version lifecycle | **reimplement** → `sitesmith.v3.release-manifest-updater` |
| [`uupm.bundle.sibling-skills`](./UPSTREAM-CAPABILITY-LEDGER.json) | Automatic six-sibling full bundle | **reject**, successor `none` → named loss: broader creative workflow from one install; exact exclusion only |
| [`uupm.optional.browser-stack`](./UPSTREAM-CAPABILITY-LEDGER.json) | Separate MCP/Playwright audit stack | **reimplement** → `sitesmith.v3.proof-runner` |
| [`uupm.quality.tests-release`](./UPSTREAM-CAPABILITY-LEDGER.json) | Unit, data, asset and static-preview gates | **adapt** → `sitesmith.v3.release-proof-matrix` |

### 4.6 Licence and SiteSmith derivation boundary

The frozen root licence is MIT, Copyright © 2024 Next Level Builder, and requires the copyright and
permission notice in copies or substantial portions.
[`LICENSE` L1–13](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/LICENSE#L1-L13).
Upstream metadata is internally inconsistent: `cli/package.json` says MIT, while `cli/README.md`
says CC-BY-NC-4.0.
[`cli/package.json` L40–46](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/package.json#L40-L46),
[`cli/README.md` L97–99](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/4857a2c5ef989794751a0f66b8545a4a49566286/cli/README.md#L97-L99).
The installed sibling tree cannot be flattened to root MIT: `ui-styling` carries an Apache-2.0
licence file despite MIT frontmatter, and bundled font trees contain OFL files. Those siblings/fonts
are outside SiteSmith's current 07/11/data/scripts subset, but block wholesale CLI-bundle import.

Current-upstream drift is not automatically a SiteSmith modification. Historical blob comparison
separates four cases:

1. **`07-ux-rules.md`: verbatim historical excerpts in a SiteSmith assembly.** After its local
   heading/attribution/contents wrapper, SiteSmith L35–289 equals
   [`v2.9.0` `SKILL.md` L47–301](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/65e23199492fa911af32d9078e627ab4de01f4c8/.claude/skills/ui-ux-pro-max/SKILL.md#L47-L301),
   and SiteSmith L290–393 equals
   [`L577–680`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/65e23199492fa911af32d9078e627ab4de01f4c8/.claude/skills/ui-ux-pro-max/SKILL.md#L577-L680).
   The copied bodies are unmodified; joining two non-contiguous spans and adding navigation makes
   the local file an assembly, not a whole-file copy. Later frozen-template differences are
   upstream drift, not edits to those historical bodies.
2. **`11-search-engine.md`: genuinely modified historical template.** Its identifiable source blob
   `96a6faea745895a6417ddb0d3a79cfb6afb5fe6d` is identical in upstream tags `v2.4.0` and
   [`v2.5.0`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/07f4ef3ac2568c25a3b0c8ef5165a86abc3e56e4/cli/assets/templates/base/skill-content.md);
   the exact originating tag is therefore **unresolved**. SiteSmith adds its wrapper/contents,
   rewrites twelve script paths, translates six mixed-language examples, adds three lookup rows,
   changes punctuation and omits upstream template L252–353. Its “reproduced without modification”
   label is false even against the historical blob.
3. **Twenty-eight CSVs: verbatim `v2.11.0` snapshot, not local edits.** Every local CSV matches an
   upstream file at
   [`v2.11.0`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6142b073958df645d0fb27e682428e69599386dc).
   Nineteen remain identical at frozen `v2.11.3`. Nine differ only because upstream later changed:
   `colors`, `products`, `styles`, `typography`, and stack files `angular`, `astro`, `laravel`,
   `nuxt-ui`, `threejs`; their exact historical source path is `.claude/skills/ui-ux-pro-max/data/...`
   at `v2.11.0`. This is version drift, so a correct notice pins that snapshot rather than claiming
   current-tree identity.
4. **Three Python files: historical bodies plus SiteSmith changes.** `core.py` and
   `design_system.py` equal the `v2.9.0` `.claude/.../scripts/` bodies except for a three-line
   SiteSmith attribution insertion. `search.py` uses the same historical baseline but also replaces
   static help, adds dynamic domain/stack help and implements SiteSmith's candidates/record/dials
   flow. All three therefore need a pinned historical source; `search.py` additionally needs an
   explicit modified/derived note.

UI/UX Pro Max is MIT, so Apache-2.0 §4(b) does not govern these four UI/UX cases. The distinction
still matters: SiteSmith's current [`NOTICE.md`](../../NOTICE.md) says every remaining UI/UX file is
verbatim, and [`LICENSE-AUDIT.md`](../../LICENSE-AUDIT.md) repeats “kept verbatim”. That statement is
defensible for the 28 CSVs only when pinned to `v2.11.0`; it is too broad for the assembled
references and modified scripts. Exact hashes and local/source ranges belong in
[`LICENSE-DERIVATION-AUDIT.md`](./LICENSE-DERIVATION-AUDIT.md). Before release, notices must name
historical revisions, separate verbatim spans from SiteSmith additions, and preserve the upstream
MIT notice without importing the contradictory CLI or sibling licence claims wholesale.

## 5. frontend-design

### 5.1 Classification and install boundary

**SOURCE FACT:** `frontend-design` is a compact prompt-based skill: its frozen folder contains only
`SKILL.md` and `LICENSE.txt`. The `example-skills` plugin manifest includes that folder; there is no
frontend-design-specific script, hook, test, template, data file or runtime state implementation.
[`marketplace.json` L24–42](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/.claude-plugin/marketplace.json#L24-L42),
[`SKILL.md` L1–55](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L1-L55).

The repository documents plugin marketplace installation, bundle installation and activation by
mentioning the skill. [`README.md` L31–61](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/README.md#L31-L61).
That is host activation, not a standalone website runtime.

### 5.2 Actual activation flow

| Step | Frozen behaviour | Evidence/status |
| --- | --- | --- |
| 1. Install | Register `anthropics/skills`, then install `example-skills`; there is no dedicated frontend-design installer. | **SOURCE FACT:** [`README.md` L31–51](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/README.md#L31-L51). |
| 2. Discover | The bundle points the host at `./skills/frontend-design`; frontmatter names and describes the trigger. | **SOURCE FACT:** [`marketplace.json` L24–42](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/.claude-plugin/marketplace.json#L24-L42), [`SKILL.md` L1–5](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L1-L5). |
| 3. Read | The host loads one instruction file. No progressive secondary reference is declared. | **SOURCE FACT:** frozen folder inventory; [`SKILL.md` L1–55](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L1-L55). |
| 4. Execute code/processes | The host model edits the user's project with its normal tools. The skill itself executes no script or process. | **ABSENT AT REVISION:** only two files in the skill folder; no executable reference in `SKILL.md`. |
| 5. Ask user | No mandatory question protocol. If subject is missing, the model pins one itself and states it. | **SOURCE FACT:** [`SKILL.md` L11–13](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L11-L13). |
| 6. Establish context | It derives a concrete subject, audience, page job and subject vernacular from the brief/memory; no persistent context file is prescribed. | **SOURCE FACT:** [`SKILL.md` L11–13](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L11-L13). |
| 7. Decide design | It selects one justified risk, thesis-like hero, type personality, semantic structure, motion level and complexity. | **SOURCE FACT:** [`SKILL.md` L9–25](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L9-L25). |
| 8. Produce/select direction | It creates one compact plan: 4–6 named colours, at least two type roles, prose/ASCII layout concepts and one signature. It does not render or blind multiple candidates. | **SOURCE FACT:** [`SKILL.md` L29–35](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L29-L35). |
| 9. Transfer to code | It reviews the plan, revises generic choices, then tells the same model to implement the revised plan exactly. | **SOURCE FACT:** [`SKILL.md` L33–39](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L33-L39). |
| 10. Iterate visually | It tells the model to critique while building and take screenshots if available; no browser driver or loop contract ships. | **SOURCE FACT:** [`SKILL.md` L41–43](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L41-L43). |
| 11. Audit | It declares mobile, focus and reduced-motion floors plus self-critique. It has no deterministic audit or pass artifact. | **SOURCE FACT/ABSENT:** [`SKILL.md` L41–43](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L41-L43); folder inventory. |
| 12. Write artifacts | Project code is the intended output. Plan visibility is discretionary; no named durable artifact is required. | **SOURCE FACT:** [`SKILL.md` L33–39](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L33-L39). |
| 13. Preserve state | No shared state schema. A quick note about tried ideas is optional, not a contract. | **SOURCE FACT:** [`SKILL.md` L41–43](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L41-L43). |
| 14. Network | No network call, telemetry or remote catalogue is required by this skill. Host font/image/tool choices remain outside its contract. | **ABSENT AT REVISION:** no URL/tool instruction in the 55-line skill. |
| 15. Fail/resume | No failure, retry, checkpoint, crash-resume or invalidation semantics are defined. Host behaviour governs. | **ABSENT AT REVISION:** skill and folder inventory. |

### 5.3 Mechanisms worth preserving

| Capability ID | Mechanism and strength | Limits/failure mode | SiteSmith successor decision |
| --- | --- | --- | --- |
| `frontend.subject-vernacular` | Grounds art direction in the subject's materials, instruments, artifacts and language instead of a style label. [`SKILL.md` L11–13](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L11-L13). | The same model may rationalise a generic choice after the fact. | **adapt** — preserve the creative instruction, then require evidence refs and critic verification. |
| `frontend.hero-thesis` | Makes the opening the most characteristic true thing, not a template component. [`SKILL.md` L15–17](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L15-L17). | No rendered or journey proof. | **adapt** — preserve the opening-thesis outcome in each VisualWorld and locked DesignSpec. |
| `frontend.type-as-identity` | Treats typography as memorable identity with deliberate roles, scale, weight, width and spacing. [`SKILL.md` L19–20](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L19-L20). | Font feasibility/licensing is not checked. | **adapt** — preserve the creative mandate and combine it with licensed-asset and rendering gates. |
| `frontend.semantic-structure` | Requires numbering, labels and dividers to encode content truth. [`SKILL.md` L21–21](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L21-L21). | Semantic truth is self-reviewed. | **integrate** — preserve the prompt principle through principle-only inspiration, not a deterministic adapter. |
| `frontend.motion-intent` | Prefers one orchestrated, subject-serving moment and permits no motion when restraint fits. [`SKILL.md` L23–25](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L23-L25). | No reduced-motion implementation test beyond the quality-floor sentence. | **adapt** — preserve the planning principle and verify it through motion/reduced-motion journeys. |
| `frontend.anti-default-calibration` | Names three current clustering defaults, obeys explicit briefs and spends only unbound freedom elsewhere. [`SKILL.md` L29–31](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L29-L31). | The list ages; a fixed ban list can create a new opposite-default. | **reimplement** — preserve the outcome through versioned, evidence-backed default/opposite probes plus a creative critic. |
| `frontend.compact-plan-signature` | Uses a small token/layout/signature plan before code; it protects directness and a single memorable idea. [`SKILL.md` L33–35](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L33-L35). | One actor generates and approves it; plan is not necessarily durable. | **adapt** — preserve a concise world contract and binding DesignSpec without exposing workflow machinery to the ordinary user. |
| `frontend.plan-critique-build` | Revises generic choices before directly implementing the selected plan. [`SKILL.md` L35–39](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L35-L39). | Same-context self-critique and no fidelity gate. | **adapt** — preserve direct build while separating the critic and locking exact plan dependencies. |
| `frontend.restraint-quality-floor` | Spends boldness once, removes decoration, and silently requires mobile/focus/reduced-motion quality. [`SKILL.md` L41–43](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L41-L43). | Advisory; no executable verdict. | **integrate** — preserve the judgement through principle-only inspiration and pair it with deterministic SiteSmith browser gates. |
| `frontend.interface-writing` | Treats copy as navigation, uses user-recognisable actions and actionable failure/empty states. [`SKILL.md` L45–55](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/SKILL.md#L45-L55). | No claim/evidence check and no content fixture tests. | **integrate** — preserve the prompt principle through principle-only inspiration, then connect it to ClaimLedger, hierarchy and journey assertions. |

### 5.4 Runtime and test observation

The plugin manifest parsed as JSON and referenced an existing skill folder. The frontmatter had one
name, one description and one licence pointer. No safe project runtime exists to dry-run: invoking
the skill is invoking a host model to design/build, which would be the prohibited website test. No
frontend-design-specific automated test was present. Therefore its creative strength is a benchmark
hypothesis, not a mechanically verified product property.

### 5.5 Licence

The frozen skill points to a complete Apache-2.0 licence. Redistribution requires the licence copy,
prominent notices on modified files, retention of applicable notices and NOTICE propagation if the
source distributes relevant NOTICE text. [`LICENSE.txt` L90–129](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/frontend-design/LICENSE.txt#L90-L129).
No `NOTICE` file exists in this frozen skill folder. SiteSmith's existing verbatim body came from an
older revision; its exact provenance and obligations are handled separately in
[`LICENSE-DERIVATION-AUDIT.md`](LICENSE-DERIVATION-AUDIT.md).

## 6. impeccable

### 6.1 Classification and package boundary

**SOURCE FACT:** Impeccable is four connected surfaces rather than one website generator: a
provider-aware installer/build pipeline, a prompt-routed skill, executable context/artifact/detector
utilities, and an optional local Live browser harness. The public CLI dispatches detection, ignore
management and skill lifecycle commands; it does not compile a brief into a website by itself.
[`cli.js` L31–85](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/bin/cli.js#L31-L85),
[`SKILL.src.md` L1–85](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/SKILL.src.md#L1-L85).

The build describes fourteen provider layouts, but provider generation is not proof of equal
capability. Agents and hooks are emitted only where adapters support them. Installer download
hashing compares the downloaded bundle to the installed tree; it does not authenticate the remote
artifact with a pinned digest or signature.
[`providers.js` L12–156](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/scripts/lib/transformers/providers.js#L12-L156),
[`skills.mjs` L525–667](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/bin/commands/skills.mjs#L525-L667),
[`L1192–1370`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/bin/commands/skills.mjs#L1192-L1370),
[`L2004–2023`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/bin/commands/skills.mjs#L2004-L2023).
Frozen version metadata is also split: skill/plugin is 4.0.4, CLI is 3.5.0 and extension is 1.3.1.
The generated Grok manifest says MIT because its build fallback reads a manifest with no licence,
while the root and skill are Apache-2.0.
[`build.js` L627–692](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/scripts/build.js#L627-L692).

### 6.2 Actual fifteen-step activation flow

Steps 1–4 are package/host entry, steps 5–12 create and consume product/design artifacts, and steps
13–15 perform executable checks, model review and optional browser iteration. A prescribed step is
not necessarily an enforced runtime transition; the boundary is named in the final column.

| Step | Frozen behaviour | Evidence and boundary |
| --- | --- | --- |
| 1. Install or link | `install`, `link`, `update` or `check` resolves a provider, downloads a universal bundle or uses `IMPECCABLE_BUNDLE_PATH`, then transforms it into the provider layout. | **SOURCE FACT:** [`cli.js` L31–85](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/bin/cli.js#L31-L85), [`skills.mjs` L525–667](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/bin/commands/skills.mjs#L525-L667). Remote bundles are neither signed nor digest-pinned. |
| 2. Activate skill | Host frontmatter matches a frontend/design request; setup requires one context run, one routed playbook and the craft floor immediately before UI edits. | **SOURCE FACT:** [`SKILL.src.md` L1–23](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/SKILL.src.md#L1-L23). Host matching remains provider behaviour. |
| 3. Resolve context | `context.mjs` finds repository/monorepo target, PRODUCT, DESIGN, sidecar, surface brief, config, hooks and staleness, and emits textual directives. | **SOURCE FACT:** [`context.mjs` L87–125](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/context.mjs#L87-L125), [`L1080–1430`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/context.mjs#L1080-L1430). Native Windows separators leak into some clone-stable output. |
| 4. Route one playbook | Explicit command or inferred intent selects init, shape, new-work, adapt, audit, critique, polish, harden, live or another reference. `craft` is only a deprecated alias. | **SOURCE FACT:** [`SKILL.src.md` L31–85](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/SKILL.src.md#L31-L85), [`craft.md` L1–5](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/craft.md#L1-L5). Implicit routing is model judgement. |
| 5. Establish product truth | Missing or stale PRODUCT routes through init. It explores existing evidence, asks at most three focused questions in one round and writes a schema/stamped `PRODUCT.md`; it must not write or offer `DESIGN.md`. | **SOURCE FACT:** [`init.md` L1–41](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/init.md#L1-L41), [`L56–125`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/init.md#L56-L125). Command metadata separately says init offers DESIGN, so the provider-facing contract is inconsistent. |
| 6. Shape an unclear request | Shape interviews, resolves whether work is new, produces a bounded brief, asks for confirmation and stops without code or persistence. | **SOURCE FACT:** [`shape.md` L1–59](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/shape.md#L1-L59). The confirmed brief remains conversational state. |
| 7. Resolve visual authority | New-work first tests whether an established surface can be extended. Otherwise it requires seven candidate worlds and a concept seed before implementation. | **SOURCE FACT:** [`new-work.md` L1–57](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/new-work.md#L1-L57). Candidate quality and distinctness are model-dependent. |
| 8. Deal a concept seed | Seed selection prefers a local catalogue subset, then remote `/roll`, then degraded fallback. SHA-256 deterministically deals five-to-seven candidates, six challengers and optionally three compositions from the received pool. | **SOURCE FACT:** [`concept-seed.mjs` L95–190](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/concept-seed.mjs#L95-L190), [`L259–440`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/concept-seed.mjs#L259-L440), [`roll-selection.mjs` L126–266](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/lib/roll-selection.mjs#L126-L266). The request does not pin a catalogue revision, so remote replay is not end-to-end deterministic. |
| 9. Render and approve direction | Visualize requires exactly three high-fidelity compositions under `.impeccable/mocks`, one non-skippable approval point and no implementation before approval. | **SOURCE FACT:** [`visualize.md` L3–47](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/visualize.md#L3-L47). Image/model output remains nondeterministic and can be billable. |
| 10. Persist the surface decision | The approved path/JSON and asset plan become input to a versioned surface brief. The writer requires a concrete target and reports ambiguous matches. | **SOURCE FACT:** [`new-work.md` L71–85](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/new-work.md#L71-L85), [`surface-briefs.mjs` L54–150](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/lib/surface-briefs.mjs#L54-L150). Approval does not have a signed/hash-bound schema. |
| 11. Build against a contract | New-work locks colour/type direction and a five-block implementation contract, then edits the existing project stack with truthful copy and the approved assets. | **SOURCE FACT:** [`new-work.md` L59–101](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/new-work.md#L59-L101). The host model performs the build; no website compiler is present. |
| 12. Document the implemented design | Document writes `DESIGN.md` with eight canonical sections and may write `.impeccable/design.json` schema v2. Seed mode writes a minimal DESIGN without the sidecar. | **SOURCE FACT:** [`document.md` L1–78](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/document.md#L1-L78), [`L257–390`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/document.md#L257-L390). Missing ramps/components may be synthesised, so every sidecar field is not observed ground truth. |
| 13. Detect and audit | The executable detector runs 59 registered rules over supported files or URLs, separates advisory/primary findings and exits 2 for primary findings. Audit adds a five-dimension model score. | **SOURCE FACT:** [`antipatterns.mjs` L4–616](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/engine/registry/antipatterns.mjs#L4-L616), [`main.mjs` L193–435](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/cli/engine/cli/main.mjs#L193-L435), [`audit.md` L7–136](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/audit.md#L7-L136). Detector-clean is not accessibility/browser/visual proof. |
| 14. Critique, polish and harden | Critique requires two isolated assessments; polish preserves established direction and triages evidence; harden reviews errors, data, i18n and edge cases. | **SOURCE FACT:** [`critique.md` L1–241](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/critique.md#L1-L241), [`polish.md` L1–97](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/polish.md#L1-L97), [`harden.md` L1–336](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/harden.md#L1-L336). These are mainly prompt protocols, not executable completion gates. |
| 15. Finish or enter Live | New-work asks for two screenshot rounds, a fresh read-only finish reviewer and a verdict loop. Optional Live runs a loopback SSE/poll session with generate, steer, accept, discard, journal and recovery. | **SOURCE FACT:** [`new-work.md` L103–109](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/new-work.md#L103-L109), [`live.md` L1–327](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/reference/live.md#L1-L327), [`session-store.mjs` L285–562](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/live/session-store.mjs#L285-L562). Live is an optional subsystem, not proof that ordinary builds completed it. |

### 6.3 Runtime, artifacts, state, network and tests

| Concern | Frozen mechanism | Evidence/status |
| --- | --- | --- |
| Prompt/model runtime | Routing, product extraction, visual worlds, implementation, scores, polish and hardening are model instructions. | **SOURCE FACT:** skill/reference inventory. They must be distinguished from executable scripts and tests. |
| Deterministic local runtime | Artifact schema/stamps, context resolution, surface-brief parsing, seed selection over a fixed pool, detector registry/CLI and Live journal replay execute locally. | **SOURCE FACT:** [`artifact-schema.mjs` L19–93](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/lib/artifact-schema.mjs#L19-L93), [`surface-briefs.mjs` L5–150](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/lib/surface-briefs.mjs#L5-L150), [`session-store.mjs` L10–562](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/live/session-store.mjs#L10-L562). Determinism is conditional on identical input/files/catalogue. |
| Durable product/design artifacts | `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `.impeccable/surfaces/*.md`, `.impeccable/mocks` and critique snapshots. | **SOURCE FACT:** init, document, visualize, surface and critique contracts. PRODUCT and DESIGN have schema/stamp support; approval and model judgement lack equivalent provenance fields. |
| Live state | Append-only journal, replay cache, snapshots and an explicit session state machine support resume/recovery. | **SOURCE FACT:** [`session-store.mjs` L10–35](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/live/session-store.mjs#L10-L35), [`L285–562`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/live/session-store.mjs#L285-L562). Ordinary new-work has no equally complete run journal. |
| Update network | Context can GET `/api/version`, cache it and throttle it daily; `IMPECCABLE_NO_UPDATE_CHECK` or config disables it. | **SOURCE FACT:** [`context.mjs` L69–81](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/context.mjs#L69-L81), [`L984–1060`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/context.mjs#L984-L1060). This is an update check, not evidence of general usage telemetry. |
| Seed/telemetry network | Concept seed can GET `/roll` and POST `/chosen`; opt-out is `DO_NOT_TRACK` or `IMPECCABLE_NO_TELEMETRY`. Printed copy says “chosen id only”, while the payload contains `chosenId`, `key`, `scope` and `mode`. | **SOURCE FACT:** [`concept-seed.mjs` L145–190](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/concept-seed.mjs#L145-L190), [`L479–483`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/concept-seed.mjs#L479-L483). |
| Image and Live network | Asset generation may use a provider or bill the user's OpenAI key. Live binds loopback, restricts origins and token-gates its script/SSE/poll endpoints. | **SOURCE FACT:** [`context.mjs` L1269–1281](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/context.mjs#L1269-L1281), [`live-server.mjs` L675–717](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/live-server.mjs#L675-L717), [`L946–1104`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/skill/scripts/live-server.mjs#L946-L1104). |
| Observed green tests | Staleness 50/50, context-signals 34/34, surface brief 5/5, concept seed 29/29, design parser 6/6, serve-question 8/8, critique storage 22/22 and Live session/recovery/completion/poll 65/65 passed. | **OBSERVED:** safe Node suites in the frozen clone. These cover state/protocol behaviours, not LLM design quality. |
| Observed Windows failures | Context passed 96/98; two failures returned backslashes where clone-stable slashes were expected. Doctor passed 37/38 and missed a guarded Windows absolute hook path. Hook suite passed 197/202; four failures are fixture/separator portability and one `.blade.php` allow/deny result needs isolated reproduction. | **OBSERVED:** [`context.test.mjs` L540–557](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/tests/context.test.mjs#L540-L557), [`L1183–1207`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/tests/context.test.mjs#L1183-L1207), [`doctor.test.mjs` L332–347](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/tests/doctor.test.mjs#L332-L347), [`hook.test.mjs` L2884–2911](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/tests/hook.test.mjs#L2884-L2911). |
| Live-root boundary | Live-root passed 18/21. All three failures used a Windows drive path as an ESM import specifier inside `node -e`, producing `ERR_UNSUPPORTED_ESM_URL_SCHEME`; they are test-portability defects, not established Live production defects. | **OBSERVED:** [`live-roots.test.mjs` L173–176](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/tests/live-roots.test.mjs#L173-L176), [`L310–356`](https://github.com/pbakaus/impeccable/blob/6b342244e915d64b0d6e84d5eec448fd196ce6bb/tests/live-roots.test.mjs#L310-L356). |
| Unrun proof | Bun/default, remote API, Playwright/browser, LLM-behaviour and image-generation suites were not run. | **BOUNDARY:** Bun/dependencies were unavailable or suites were opt-in/network/website-generating. No green claim is made for them. |

### 6.4 Current frozen capability index and SiteSmith disposition

The complete 26-field records are canonical in
[`UPSTREAM-CAPABILITY-LEDGER.json`](./UPSTREAM-CAPABILITY-LEDGER.json). All fifteen stable IDs below
refer to current frozen commit `6b342244e915d64b0d6e84d5eec448fd196ce6bb`; historical SiteSmith
vendoring is a separate provenance question in §6.6.

| Capability record | Current frozen mechanism | SiteSmith disposition / successor |
| --- | --- | --- |
| [`IMP-001`](./UPSTREAM-CAPABILITY-LEDGER.json) | Provider-aware installer and build | **reimplement** → signed/checksummed SiteSmith bundle manager with typed adapters |
| [`IMP-002`](./UPSTREAM-CAPABILITY-LEDGER.json) | Skill activation, routing and deprecated craft alias | **adapt** → compact `init → build → audit` router |
| [`IMP-003`](./UPSTREAM-CAPABILITY-LEDGER.json) | Context, target, artifact and staleness resolver | **reimplement** → typed RunContext and ArtifactGraph |
| [`IMP-004`](./UPSTREAM-CAPABILITY-LEDGER.json) | PRODUCT init contract | **adapt** → provenance-bearing ProductBrief |
| [`IMP-005`](./UPSTREAM-CAPABILITY-LEDGER.json) | Planning-only shape brief | **retain** → structured Shape checkpoint |
| [`IMP-006`](./UPSTREAM-CAPABILITY-LEDGER.json) | New-work authority, contract and finish handoffs | **adapt** → evidence-gated BuildRun state machine |
| [`IMP-007`](./UPSTREAM-CAPABILITY-LEDGER.json) | Local/remote concept seed and choice telemetry | **reimplement** → pinned local ConceptSeedLedger |
| [`IMP-008`](./UPSTREAM-CAPABILITY-LEDGER.json) | Three-composition decision page and asset plan | **adapt** → hash-bound DirectionGate |
| [`IMP-009`](./UPSTREAM-CAPABILITY-LEDGER.json) | Versioned surface briefs | **reimplement** → canonical cross-platform SurfaceSpec |
| [`IMP-010`](./UPSTREAM-CAPABILITY-LEDGER.json) | DESIGN.md and schema-v2 sidecar | **adapt** → DesignContract with per-field provenance |
| [`IMP-011`](./UPSTREAM-CAPABILITY-LEDGER.json) | 59-rule detector and model audit | **integrate** → pinned detector inside broader AuditGate |
| [`IMP-012`](./UPSTREAM-CAPABILITY-LEDGER.json) | Lifecycle hooks and doctor | **reimplement** → native structured HookRunner/Doctor |
| [`IMP-013`](./UPSTREAM-CAPABILITY-LEDGER.json) | Two-assessment critique and trend storage | **adapt** → evidence JSON and assignment-blinded ReviewPanel |
| [`IMP-014`](./UPSTREAM-CAPABILITY-LEDGER.json) | Polish and hardening protocols | **adapt** → executable ReleaseMatrix |
| [`IMP-015`](./UPSTREAM-CAPABILITY-LEDGER.json) | Local Live browser iteration, journal and source application | **reject**, successor `none` → named loss: Tæt visuel feedbackloop; exact exclusion only; reconsider only through a new isolated Live Lab plugin decision |

### 6.5 Current frozen overclaim corrections

1. **CLI scope:** the CLI installs, links, checks and detects; the host model still builds the
   website. Provider count is therefore not builder capability or provider parity.
2. **Determinism scope:** a seed deal is deterministic only for an identical pool. Remote `/roll`
   carries no catalogue revision, so a key alone is not a complete replay record.
3. **Proof scope:** 59 detector rules are useful static evidence, but detector-clean plus a
   five-dimension model score is not axe, browser, journey, dark-mode, responsive or visual proof.
4. **Artifact scope:** PRODUCT/DESIGN stamps are stronger than conversational state, but the DESIGN
   sidecar may synthesise values and approval artifacts do not bind source hashes/prompts.
5. **Review scope:** two model assessments are not automatically independent or calibrated. The
   critique reference also retains an unresolved config_file placeholder and a stale assumption
   that init writes “Design Context”, while current init writes PRODUCT and forbids DESIGN output.
6. **Cross-platform scope:** generated hooks use a POSIX guard string even for Windows paths, and
   doctor demonstrably misses one Windows-backslash absolute-path form. That does not prove that all
   Codex hooks fail on Windows; it proves the current cross-platform claim needs narrower evidence.

### 6.6 Historical SiteSmith vendor provenance

Current-upstream drift must not be labelled as a SiteSmith modification. Git history and normalized
blob comparison establish the following separate timeline:

1. SiteSmith commit `6eb8ef8f334c71926d0c22006dbece79ef00337f` added 35 files under
   `skills/sitesmith/references/impeccable/` on 2026-07-25.
2. Every imported body matches the generated Claude-provider tree at Impeccable commit
   [`af78b1e512148e2a2f2d2ded6786d265ea420191`](https://github.com/pbakaus/impeccable/tree/af78b1e512148e2a2f2d2ded6786d265ea420191/.claude/skills/impeccable)
   exactly after line-ending/final-newline normalization:
   `_SKILL-original.md` maps to `.claude/skills/impeccable/SKILL.md`; the other 34 map to
   `.claude/skills/impeccable/reference/<name>.md`.
3. SiteSmith commit `84d79e310a49448ed73d84a1d528e0e6d85cc2cf` then added one attribution
   header to all 35. The 34 reference bodies remain exact against `af78b1e5`. In
   `_SKILL-original.md`, reversing the header plus exactly 32 documented
   `reference/<file>.md → <file>.md` link-target changes restores the source blob exactly.
4. Ten files now differ from frozen current `6b342244`: `_SKILL-original.md`, `audit.md`,
   `craft-floor.md`, `harden.md`, `init.md`, `live.md`, `new-work.md`, `optimize.md`,
   `overdrive.md` and `visualize.md`. Those differences are upstream evolution after
   `af78b1e5`, not SiteSmith edits.
5. `live-setup.md` did not exist at `af78b1e5`; it was added upstream later in
   [`b4f1c1786e7f23b55923f55f9661c640fb11e3f7`](https://github.com/pbakaus/impeccable/commit/b4f1c1786e7f23b55923f55f9661c640fb11e3f7).
   The historical SiteSmith Live file does not reference it. A future refresh to current
   `live.md` must add `live-setup.md` in the same change.

Impeccable's governing upstream licence is Apache-2.0; its current generated Grok MIT value is a
build metadata defect, not a second grant. Exact redistribution scope, in-file modification notices
and licence-copy remediation are tracked in
[`LICENSE-DERIVATION-AUDIT.md`](./LICENSE-DERIVATION-AUDIT.md); this capability audit does not
rewrite that parallel legal record.

## 7. Cross-system findings

All four systems now have equal-depth frozen evidence. The findings below compare mechanism classes;
they are inputs to the later supremacy matrix, not that matrix and not a winner declaration.

| Cross-system fact | Evidence boundary | SiteSmith implication |
| --- | --- | --- |
| The four package boundaries are materially different. frontend-design is one prompt file; Taste is a prompt bundle; UI/UX Pro Max adds an offline retrieval runtime and installer; Impeccable adds artifact utilities, a detector, hooks and optional Live state. | **SOURCE FACT:** §§3.1, 4.1, 5.1 and 6.1. Repository size or command count is not website quality. | Model packaging, knowledge retrieval, creative planning, execution and proof as separate capabilities with explicit interfaces. |
| None of the four repositories is a deterministic brief-to-finished-website compiler. | **SOURCE FACT:** Taste/frontend-design delegate all code to the host; UI/UX Pro Max emits guidance/Markdown; Impeccable's host model implements after approval. | The v3 build contract must own code generation, stack adaptation, run state and completion semantics instead of assuming an upstream prompt supplies them. |
| Deterministic mechanisms exist at narrower boundaries: UI/UX Pro Max has local BM25/data lookup; Impeccable has schemas, state resolution, seed math over a fixed pool, a detector and Live replay. | **OBSERVED/SOURCE FACT:** §§4.3–4.4 and 6.3. Their outputs still feed model judgement. | Preserve deterministic evidence and algorithms behind typed adapters; never relabel the following model synthesis as deterministic. |
| Direction selection follows four incompatible patterns: Taste uses Design Read/dials; UI/UX Pro Max promotes a composed top recommendation; frontend-design creates one self-critiqued plan; Impeccable deals alternatives and requires a three-composition approval. | **SOURCE FACT:** §§3.2–3.3, 4.2–4.3, 5.2–5.3 and 6.2. | Keep hypothesis generation, comparison, user decision and locked implementation contract as separate states. Do not merge their policy lists into one unranked prompt. |
| Persistent state ranges from absent, to optional Markdown, to a multi-artifact graph. No upstream supplies one complete, provider-neutral build ledger from brief through proof. | **SOURCE FACT/ABSENT AT REVISION:** Taste/frontend-design have no canonical store; UI/UX Pro Max optionally writes MASTER/page Markdown; Impeccable persists PRODUCT/DESIGN/surface/critique/Live artifacts but ordinary new-work lacks Live's complete journal. | Use a versioned run ID, artifact hashes, provenance, invalidation and resumable phase state across the entire SiteSmith workflow. |
| Existing proof is fragmented. Taste/frontend-design mostly provide checklists; UI/UX Pro Max's tests verify search/data and a disconnected static preview; Impeccable's detector/state tests are real but do not constitute a mandatory browser/accessibility/journey matrix. | **OBSERVED/SOURCE FACT:** §§3.4, 4.4, 5.4 and 6.3. | A separate proof runner must own executable acceptance: build, responsive screenshots, both colour schemes, axe, console, links, overflow, interactions and artifact capture. |
| Provider breadth repeatedly drifts from parity. UI/UX Pro Max has duplicate/suppressed targets and version metadata drift; Impeccable has provider-specific agents/hooks, split versions and a generated licence mismatch. | **SOURCE FACT/OBSERVED:** §§4.1 and 6.1. | Generate every adapter from one capability/version/licence manifest, publish a parity matrix and fail transactionally on unsupported or stale owned files. |
| Network behaviour is capability-specific, not a single online/offline label. frontend-design requires none; UI/UX Pro Max core is offline but lifecycle is online; Taste delegates optional assets/tools; Impeccable separates bundle, update, seed, choice telemetry, image and loopback paths. | **SOURCE FACT:** §§3.4, 4.4, 5.2 and 6.3. | Declare per-capability endpoints, data sent, billing, cache, retry, timeout and opt-out; pin remote inputs needed for replay and support a truthful offline mode. |
| Historical source identity and current-tree equality are different questions. UI/UX Pro Max and Impeccable both demonstrate that later upstream drift can look like local modification if provenance is not pinned. | **OBSERVED:** §§4.6 and 6.6. | Record source commit/blob/path and local transformation per vendored unit; produce licence notices from that derivation ledger rather than current-tree diffs. |
| Strong creative instructions and strong proof mechanisms are orthogonal. frontend-design and Taste contain useful craft judgement without runtime proof; UI/UX Pro Max and Impeccable contain executable mechanisms without proving superior finished sites. | **INTERPRETATION grounded in all four audits.** | Score creative outcome and engineering/reproducibility separately in the supremacy matrix; neither dimension may stand in for the other. |
