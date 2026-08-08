# Frozen baseline, before any change

## Pins

**SiteSmith:** branch `lab/beat-impeccable-4.0.4`, HEAD `15a7aa6`, forked from `feat/design-contract-v1` @ `2ca0278d796ff137fc5a218709f37c3255b5f96f`
**Impeccable:** commit `9a949fb543d44cfb406f61bcab99d95d7f12cf1d`, annotated tag `skill-v4.0.4` (tag object `fb0942f57736841580a65088637f94da4a4ba87c`), released 2026-07-30

All line numbers below are from those two trees. Statements are read from source; where a reader ran the code, that is said.

---

## How each product forms a creative direction

### Who generates the candidates

**SiteSmith.** The host model writes them as prose theses into `.sitesmith/direction.md`. `SKILL.md:84-100` orders "Write at least three one-line theses. Each says what the site is, not what it looks like." No script proposes a thesis. `ledger.mjs` states its own scope at lines 4-5 — "Nothing **in here** selects, ranks, seeds or suggests a colour, a face, a layout or a thesis" — and that scope holds for that file: it parses theses out of the `Theses` heading with `/^\s*(\d+)[.)]\s+(\S.*)$/` (`ledger.mjs:134-138`) and counts them.

The package as a whole does rank and suggest design material, before the first thesis exists. `knowledge/retrieve.mjs` scores 107 JSONL records against the brief text (IDF-weighted term overlap, field weights userJob 5 / problem 5 / mechanism 3, top-3). `commands.mjs:200-228` spawns it automatically inside `sitesmith build`, and `commands.mjs:377-393` writes the records' full `mechanism` text into `.sitesmith/RUN.md`, which `SKILL.md:40-42` orders the agent to work from. A reader ran it on a real brief and got, among the top three, `anti-three-equal-feature-cards` ("Use 2-column zig-zag, asymmetric grid, scroll-pinned, or horizontal-scroll alternative") and `cmp-label-above-input-error-below` ("Label ABOVE input … Error text BELOW input … gap-2").

**Impeccable.** The host model also writes the grounded candidates (5–7 of them, ranked by itself). Separately, `concept-seed.mjs` deals six catalogue *challengers* — cultural source forms with a five-rule "system grammar" — drawn from a curated catalogue with per-entry approval, rating (1–3), breadth (general/niche) and allowed modes. Two challengers per translation tier (`graphic`, `interaction`, `atmosphere`), ranked by sha256 digest of `${scope}:${key}:challenger-${index}`, weighted by a ticket system (rating 3 → two tickets, rating 1 or breadth niche → zero) (`lib/roll-selection.mjs:90-237`). A second catalogue of identity-free *compositions* is dealt in the same roll (count 3) but is not rendered unless `IMPECCABLE_COMPOSITIONS === '1'` (`concept-seed.mjs:434`).

### Who selects

**SiteSmith.** The model. `ledger.mjs` audits the shape of the choice after the fact: exactly one `Built: <n>, axis: <axis>, because <reason>` line in the whole file; a `Case for the runner-up` block carrying `For: <n>` that must not equal the built thesis, must name a thesis in the list, must run to at least two sentences, and must not restate the built reason (Jaccard ≥ 0.5 over content words is refused). The built reason must carry at least three content words. `docs/rebuild/ARCHITECTURE-DECISION.md:421` records that a `pick.mjs` (hash selects the thesis index) was rejected in favour of "the model chooses, all candidates are recorded". No file in the tree hashes a thesis.

**Impeccable.** A script. `concept-seed.mjs:290-295`:

```
unit(salt) = sha256(`${scope}:${salt}:${key}`).readUInt32BE(0) / 0xffffffff
buildIndex = 3 + Math.floor(unit(indexSalt) * (candidateCount - 2))
```

`candidateCount` is validated as an integer 5–7, default 7, so `buildIndex` lands in 3..candidateCount — the model's own top-two ranked candidates are structurally unreachable. `reference/new-work.md:46` makes running the script before writing artifact code a stated contract violation to skip. Whether the model actually built the assigned index is never read back: no hook, no detector rule, no reviewer script in the repo reads `ASSIGNED INDEX`.

### Where the entropy comes from

**SiteSmith.** Nowhere. There is no random or hash-derived choice anywhere in the direction path. The only crypto in `ledger.mjs` is `randomBytes(16)` for a salt used to compute an anonymous surface id (`sha256(salt:resolve(dir))`, truncated to 16 hex chars) so the anti-repeat ledger can recognise a surface without storing its path.

**Impeccable.** One 4-byte value: `--from <key>` → `IMPECCABLE_CONCEPT_SEED` → `crypto.randomBytes(4)` (`concept-seed.mjs:536-538`). Given a key, index, challengers, compositions and the whole re-roll chain are pure sha256 functions of key + scope + mode + grain + platform + reroll + catalogue contents. Three further inputs change what a given key renders: catalogue presence (`IMPECCABLE_CATALOG_DIR`), network reachability inside a single shared 4 s budget, and `IMPECCABLE_COMPOSITIONS`.

### Anti-repeat memory

**SiteSmith.** `~/.sitesmith/renders.jsonl`, append-only, one line per committed render: `{v:1, when, id, fingerprint, waived}`. `judge()` (`ledger.mjs:470-553`) applies five rules against a rendered fingerprint: a hard-coded `SEED_RECIPE` of four devices; exact fingerprint-key match; colour proximity (RGB deltas 14/14/16) and hue proximity (arcs 25/20/30); ≥4 shared devices with any one record; and a saturation rule over the last three records. A veto is fatal unless the record carries a `Brief-pinned:` line with a quoted string of ≥10 characters. The file is machine-local, has no env override and is never synced, so on a fresh machine or a CI runner only `SEED_RECIPE` can fire. No documented step or manifest command invokes `ledger.mjs check|commit`; the only automated call in the repo is `ledger.mjs parse ../pilots/04-byens-it` in CI.

**Impeccable.** The catalogue itself, server-side. Re-roll round *n* excludes every id drawn in rounds 0..n−1 from the same base key. A `chosen` ping (`POST /api/chosen`, payload `{chosenId, key, scope, mode}`) is fire-and-forget and opt-out via `IMPECCABLE_NO_TELEMETRY` / `DO_NOT_TRACK`. There is no per-render fingerprint and no repeat veto.

### What is enforced in code at direction time

**SiteSmith.** One gate before code: `sitesmith build` exits 3 when `.sitesmith/direction.md` or `.sitesmith/contract.json` is missing (`commands.mjs:293-301, 362-367`). It tests existence only — a reader created a 0-byte `direction.md` and a 0-byte `contract.json` in an empty directory and `sitesmith build --surface buy` exited 0 with no blockers. Content is first checked mechanically by `gate.mjs`, which runs against a built site.

**Impeccable.** Two gates: argument validation, and a `PRODUCT.md` init gate (`concept-seed.mjs:521-533`) that prints `NO_PRODUCT_MD: the dice stay in the cup until product truth exists.` and exits 1. Everything about authority — "the assignment is the roll, not a suggestion", "taste is never grounds" for a re-roll, "a fused challenger that wins both axes becomes the build", "never present a ranked lineup" — is instruction text rendered into the seed. No code checks any of it. Re-roll count is validated as a non-negative integer and used only as a hash salt, so the prose limit on consecutive re-rolls is unenforced.

---

## Where SiteSmith is downstream-stronger

Verified in code, this tree only.

1. **Accessibility is measured and fail-closed.** `verify.mjs` runs axe with `wcag2a/2aa/21a/21aa` in both colour schemes, and a *missing* axe run is itself blocking unless `--no-axe` was typed (`verify.mjs:934-942`). Every measurement that throws pushes a `notMeasured` entry that feeds the blocking sum. Impeccable's `package.json` contains no axe-core and no Lighthouse; its accessibility dimensions in `reference/audit.md` are model judgment.

2. **A declarative design contract with checks no render can do.** `contract.mjs validate()` computes per-pair WCAG contrast from declared token values against floors keyed by `minimum` (4.5 / 3 / 3); refuses a translucent background with no named backdrop stack and marks the pair `verdict: 'not measured'`; requires each primitive's sRGB fallback within 0.04 per channel of its authored oklch/oklab value; enforces referential integrity of `from`/roles; requires `rest` and `focus` to each own a painted pair, non-empty `changes` and a `carriedBy`; refuses scheme claims that no pair supports; and pins responsive widths to exactly 375/768/1440 with non-identical `becomes`. `compare` then checks the declared primitives, named things (≥8×8 rendered, first-viewport object above 900 px) and focus order (as a subsequence) against the live DOM. Impeccable has no equivalent artefact.

3. **The direction record is bound to the rendered DOM.** `gate.mjs` extracts selectors from `Signature:`, `Answer to the risk` and `Second reading` and queries them in a real render. The signature must *render* (`getClientRects().length > 0 || getBoundingClientRect().width`), not merely exist. The second reading is refused as the same drawing twice when it shares >0.6 of ≥3 facts with the signature.

4. **A blind critique cryptographically bound to the render.** `critique.mjs packet` writes six fixed questions and instructs the reviewer not to open the direction record, report, gate output or source. `lock` refuses fewer than six answered lines and a second correction round (exit 2 each). `gate.mjs:848-852` recomputes the identical sha256 over the same PNG bytes and refuses `critique/stale` on any mismatch; a recorded correction does not excuse it, and the code comment records the cold build that walked through that hole before it was closed. Impeccable's equivalent ceiling ("two rounds is the ceiling", "at most one more round") is prose in `SKILL.md:18` and `new-work.md:105-107` with no counter anywhere.

5. **Behavioural specs exist as a category.** `journey.mjs` spawns each `journeys/*.spec.mjs` as a separate node process with a 120 s timeout; `gate.mjs:436-453` refuses `journeys/none` / `journeys/empty` for surfaces matching `buy|operate|redesign`. Impeccable has no clicking or submitting check.

6. **A stated separation between measured and gated.** `verify.mjs` prints a craft-floor list (tap targets, gaps, radii count, family count, measure, tracking, display size, step ratio, focus-indicator contrast) that never enters the blocking sum, with the reason in the source. `gate.mjs` prints one number ("MEASURED, never gated") and states in the print why it is not a gate. `contract.mjs compare` prints a squint ink-density measure that cannot fail a run.

7. **CI enforces the proof layer per pilot** — `contract check`/`compare`/`stress`, `journey.mjs`, and `gate.mjs` — on printed text, not exit codes (every gate step pipes `|| true`).

---

## Where Impeccable is upstream-different

Verified in code. Listed as capabilities SiteSmith's tree does not contain.

1. **A mechanical device that removes the model's argmax from reach.** `buildIndex ≥ 3` is arithmetic, not instruction. SiteSmith has nothing that constrains which thesis is built; its equivalent device is the argued runner-up, which is a shape check over prose.

2. **A shared, curated, approval-gated catalogue reachable over a network.** Entries carry a validated schema (form 40–360 chars with a comma, lineage, exactly three tags, five prefixed system rules, spark, webLeverage), an approval file keyed by a 12-char content hash that goes stale when the entry changes, ratings, breadth and allowed modes. Catalogue-level minimums are enforced (schemaVersion ≥ 7, ≥3 families, ≥5 wells, every tier represented, ≥3 approved). Resolution is local catalogue → `GET https://impeccable.style/api/roll` → a degraded assignment-only seed that tells the model to say plainly it ran degraded. SiteSmith's only cross-build memory is a machine-local JSONL that no documented run touches.

3. **Editor-time enforcement.** The Cursor `preToolUse` hook returns `{permission:'deny'}` and blocks the write on any surviving finding (`hook-before-edit.mjs:68-72, 500`), with a loop breaker at six denials on the same file+finding signature. The Claude/Codex `PostToolUse` and `Stop` hooks report and always exit 0. SiteSmith has no hook layer; all its refusals happen when a script is invoked.

4. **A 59-rule registry running against real computed styles in a browser.** `detect <url>` launches Chrome, injects a 366 KB bundled rule script, and runs element/page/layout rules; it also captures up to three deduped uncaught page errors, performs a scripted scroll sweep and re-measures text still invisible at rest, and runs a screenshot-pixel contrast fallback for text the DOM pass could not resolve. SiteSmith's antipattern detector is five tells (`gradient-text`, `three-card-grid`, `framework-default-scale`, `round-8-recipe`, `icon-tile-row`).

5. **A per-route strategy artefact with its own resolver.** `.impeccable/surfaces/<slug>.md` with frontmatter (`version`, `slug`, `primary_target`, `related_targets`), resolved at boot by slug or by frontmatter mapping, with named reasons (`only-brief`, `slug`, `mapping`, `ambiguous`, `ambiguous-target`, `not-found`, `invalid-target`, `none`). SiteSmith has one direction record per build directory.

6. **A session boot that assembles context and emits machine-readable directives** — `RESOLVED_CONTEXT` (11 fields), `MANUAL_DETECTOR_REQUIRED`, `IMAGE_GEN_AVAILABLE`, `AUTONOMY_DIRECTIVE_CHECK`, `SUBAGENT_AUTHORIZATION`, `MONOREPO_TARGET_REQUIRED`, `CONTEXT_STALE` — plus a two-tier staleness system whose deep tier declares that where the answer needs judgment it reports a measured proxy and says it is a proxy.

---

## The mechanism under test

**Hypothesis.** SiteSmith's blind-buyer-preference deficit against Impeccable 4.0.4 is produced at direction formation, not in the proof layer. Specifically: Impeccable constrains the direction mechanically (an assigned index the model cannot reach with its own top-two ranking, plus six challengers drawn from a curated pool the model did not write), while SiteSmith leaves selection entirely to the model and checks only the *shape* of the record afterwards — and it is that difference, not any downstream gate, that shows up to a blind judge.

**What would refute it.**

- Builds that differ only in the direction mechanism — same brief, same builder, same downstream gates — show no preference difference to blind judges.
- Impeccable builds run degraded (assignment-only seed, zero challengers, no catalogue) score the same as full rolls. That would locate the effect in the assigned index alone, or nowhere in the roll, rather than in the catalogue.
- Blind rejections of SiteSmith builds name defects the existing gates already have a class for (contrast, overflow, stale critique, missing journey, unpainted first viewport). That would put the deficit downstream, in gates not being run, not upstream in direction.
- SiteSmith builds converge on each other across briefs *with* the anti-repeat ledger armed. The ledger is the only code SiteSmith has that measures cross-build convergence, and it currently runs in no documented step, so convergence today is untested rather than absent.

**Evidence strength.** Thin on the load-bearing point. Both repos assert a head-to-head number in a source comment and neither ships the data: `ledger.mjs:6-8` and `gate.mjs:11-14` claim "a deterministic direction generator scored 40 … a model reasoning from evidence scored 59"; `concept-seed.mjs:10-12` claims "30/35 identical concepts across 16 prompt framings". No code, dataset or reproduction backs either. `SKILL.md:93-96`'s "thirty times in thirty-five" is the same kind of claim. This round starts with no measured preference baseline of any kind.

---

## Claims corrected during verification

Twenty-eight reader claims were wrong or imprecise. Each correction below was reproduced against the pinned trees.

### SiteSmith — direction record and ledger

1. **"Nothing in the shipped code proposes, ranks, seeds or suggests a thesis, colour, face or layout."** The quoted header says "Nothing **in here**" — scope is one file. `knowledge/retrieve.mjs` ranks 107 records and `commands.mjs:377-393` writes their mechanism text (including named layout alternatives) into RUN.md during `sitesmith build`, before any thesis exists. Also: the three-thesis floor is enforced by `parse`, `check` **and** `commit` (`directionProblems` at :775 and :833), not by `parse` alone; and `gate.mjs`'s `parseDirection` returns seven fields including `raw` (the whole record), used by three brief-pinned exceptions — it still never looks for `Theses`.

2. **"REQUIRED has 22 headings."** It has **24**. `ledger.mjs new` prints "24 empty headings" and "N of 24 headings filled" from `REQUIRED.length` at :764 and :768.

3. **"`ADDED_AFTER_FIRST_RECORDS` forgives records that predate it."** There is no age signal. The array holds one element, so `olderTemplate` (:190-191) is true exactly when `Second reading` is absent, and the skip at :194 then makes a *missing* `Second reading` unreportable on every record, new or old. Only its blank-heading branch can fire.

4. **`directionProblems()` completeness list.** Three errors: a missing heading is refused *except* `Second reading` (above); the same-face rule at :258 is `faces.length >= 2 && new Set(faces).size < 2` — it fires only when *every* quoted face is identical, not when two roles share one; and "empty reason" is actually `contentWords(built.reason).size < 3`, so `because grid rhythm` is refused. Four refusals were omitted: a Built line naming a thesis not in the list, a runner-up naming a thesis not in the list, a runner-up under two sentences, and a runner-up at Jaccard ≥ 0.5.

5. **The autopilot description "is written first into `.sitesmith/direction.md`" as a field of the record.** It is never a field. `run.md:29-31` orders it into that path; `run.md:32`'s next step, `ledger.mjs new`, then either refuses (`skipped_exists`, after which `parse` reports 28 problems — reproduced) or with `--force` renames the autopilot text to `.sitesmith/direction.replaced-*.md` and writes a blank 24-heading template. `REQUIRED` has no autopilot heading. `commands.mjs:295` clears its blocker on mere existence, so an autopilot-only file passes `build` while failing every ledger check. Also: `Originality pass` is at `ledger.mjs:89`, not 93, enforced only by the generic blank-heading loop at :193-197; the revision cap of 1 is at `run.md:36-37`, not :38; the autopilot ban is conditional (`SKILL.md:112-113`: "If the brief asks for a look, give it exactly that"); and §5's second code consequence is `judge()`, named at `SKILL.md:110`.

6. **The render fingerprint.** Three errors, one load-bearing. (a) The accent is **not** coverage-weighted and **not** first-screen: `ledger.mjs:617-624` is a plain argmax over saturation across every `body *` descendant. A reader rendered a probe page and a 1×1 px off-screen magenta span beat a colour covering 100 % of the first screen. (b) `fingerprintOf()` computes no hues; it passes `groundHue/accentHue/signatureHue` and the three colours straight through from `raw`. The hues are computed one level up, in the CLI at :836-841. Anyone calling `fingerprintOf(await measure(p))` directly gets six nulls and silently disarms both colour vetoes. (c) `signatureColor` is **never measured** — `measure()` returns twelve fields and none is a signature; `hueOf(undefined)` is null, so `SIGNATURE_ARC` (30°) and `SIGNATURE_DELTA` (16) are inert on every rendered run, despite the comment at :838-840 asserting the hole was closed.

7. **`judge()` constants.** The cross-band ground-hue exemption is `Math.round(25/2)` = **13** degrees, not 12 (a reader ran it: 13 is vetoed, 14 passes). The saturation rule arms at **three or more** prior other-records — `others.slice(-3)` caps the window, so `recent.length === 3` is a floor, not an exact count (reproduced with 5 records). Rule 4 skips any record whose fingerprint key already matches, so an exact twin is never double-vetoed. Constants start at :457.

### SiteSmith — gates and pipeline

8. **"Three separate hard stops before code."** One: `sitesmith build` exit 3, and it tests existence only (0-byte files pass, exit 0 — reproduced). `contract.mjs new` always exits 0 and pins the record hash only `if (existsSync(record))`; written before the record, `writtenAgainst.hash` stays `''` and `check` skips the comparison with no note. `gate.mjs` is a hard stop (exit 2, not draft-downgradable) but runs after code. Blockers top out at 3, not 4, because the contract blocker is mutually exclusive with the direction blocker.

9. **`gate.mjs` exit codes are inverted in the claim.** Actual: 0 = every check ran and none refused; **1** = nothing refused but a verdict is missing ("NO VERDICT … This is not a pass"); **2** = one or more refusals. `--help` and a non-directory build path exit 1, not 2. Additionally, if a run lacking a direction record also lacks `ASSET-MANIFEST.md`, the honesty short-circuit reports first and `direction/record-missing` is never emitted at all.

10. **`report()` print order.** Not refusals → warnings → waived → missing. Actual order: header, MEASURED, WAIVED, WARNED, REFUSED, VERDICT MISSING. And there is a fifth, bucket-less output (`vocabularyShare`) that prints and can never gate.

11. **The honesty short-circuit stops on honesty refusals only.** It stops on **any** refusal accumulated before :590, which includes `journeys/none` and `journeys/empty` (:445-453) — so a build with clean copy still gets nine checks reported as not run "because the honesty refusals above stop the gate". Under `--draft`, asset and journey refusals become warnings and the gate runs on past :595. The short-circuit also passes a fresh nine-name literal, silently dropping any already-withheld verdict.

12. **"The three `DRAFT ? warn : refuse` ternaries are evaluated at module top level."** True for `journeyRefusal` and `assetRefusal`. `photoRefusal` (:1900) is four blocks deep inside the render branch, under `if (measured)`. `look/no-photograph` cannot fire at all without a successful browser render — with no Playwright, no entry, or a failed goto the run records a withheld verdict and exits 1, not 2.

13. **The token vocabulary is 22 words.** It is **18** (`gate.mjs:318-319`), and the numeric suffix is stripped only in the hyphenated form `-\d+$`. `waived` is also not "the other non-blocking output" — `warnings` prints under WARNED and is equally non-blocking — and waived has six producers, of which only `tell()` handles antipatterns; `look/no-shell` is waived by the record answering "The shell: none".

14. **`verify.mjs` craft floor measure band is 45–80 ch.** `verify.mjs:416` overrides the lower bound to **28 ch** when `window.innerWidth < 600`, so at the default 375 px viewport the band is 28–80 while the printed line still says "the 45 to 80 band". The list also omits `leading-too-tight-for-measure` (≥70 ch with line-height < 1.45) and `leading-too-loose-for-measure` (≤50 ch with line-height > 1.8).

15. **`contract.mjs stress` uses anchored regexes.** None of the three is anchored — they are unanchored substring matchers; the only real guard against writing a verdict onto the wrong case is the GLYPHS exclusion. The clipping test is not "any element": it is 8 tag names (h1, h2, h3, p, li, label, button, a), visible only, vertical only, with a 2 px tolerance, and only when computed `overflow !== 'visible'`.

16. **"`gate.mjs` is the only script wired into another command."** `inspect.mjs` runs inside both `audit` and `redesign`; `recommend` spawns `knowledge/retrieve.mjs`; `build` spawns `stack.mjs` and `retrieve.mjs`. And while `gate.mjs` contains no reference to `contract.json`, a *missing* contract is a `build` blocker, so the contract is not confined to its own command's exit code. `journey.mjs` is run by CI at `verify.yml:222, 601, 824`.

17. **`product/rules.json`'s own `$comment` says "Every refusal class the engines emit."** It does not; that wording is in `pipeline.json:363` and `verify.yml:146`. Also, "no contract/verify/journey/critique refusal appears" is literally true but misleading — those four scripts emit no namespaced classes at all. The gap is entirely inside `gate.mjs`: 10 emitted classes absent from a 59-row registry (5 literal + 5 `antipattern/*` built by template literal). A complete registry would be 69 rules.

18. **CI enforcement is uniform across pilots.** The `every check ran and none refused` grep exists only in the matrix job (pilots 02, 03). Pilot 01 *expects* a refusal and asserts only that the extracted refusal-class set contains nothing beyond `look/no-photograph`. The stress step's `grep -q "not run"` asserts nothing — `contract.mjs:842-843` prints that string unconditionally. The portfolio test blocks on two independent conditions: an identical six-axis fingerprint with **no** reason test at all, or `converged >= 0.6` (`>=`, not `>`), where `converged` counts only axes that share a value *and* whose reasons overlap ≥ 0.4; the raw shared-weight fraction never blocks.

### Impeccable

19. **`BLAND_FORM_RE` rejects forms named "platform".** It rejects the two-word phrases `software platform` and `digital platform` only. A reader ran the regex: "a trading platform, inheriting exchange floor signage" **passes** the finished-product gate. Also, the `webLeverage` regex check is a warning in `validateConceptCatalog`, not part of `validateConceptEntry`, and validation runs once per catalogue directory per process (memoised), not on every load.

20. **`buildIndex` range and reproducibility.** `unit()` divides by `0xffffffff` (inclusive), so an all-`0xFF` digest prefix yields `candidateCount + 1` — an index past the end of the model's list (p ≈ 2⁻³²); the source comment `// 3..candidateCount` is wrong on that edge. The printed rerun string omits `--grain` and `--platform`, both of which change the dealt compositions, so it reproduces the index and challengers only. The random key is not the sole nondeterminism (catalogue presence, network reachability inside the shared 4 s budget, `IMPECCABLE_COMPOSITIONS`). The catalogue and selection modules are under `skill/scripts/lib/`.

21. **The context boot's only filesystem write is the update cache.** There are up to **two**, both under the user's home: the update-check cache (`context.mjs:986-987`) and the staleness-notice throttle cache (`lib/staleness-notice.mjs:64-65`), reached from `context.mjs:1353` on both output branches. Both paths are env-overridable defaults, not fixed. Native-platform reference files are loaded only on the `hasProduct` branch.

22. **`MANUAL_DETECTOR_REQUIRED` appears only when no hook manifest is found.** `automaticHookMode` short-circuits to `'none'` *before* the manifest scan when `IMPECCABLE_HOOK_DISABLED` is truthy or `hook.enabled: false` sits in `.impeccable/config.json` — so the directive fires with a fully installed manifest present. `RESOLVED_CONTEXT` echoes **eleven** fields, not seven.

23. **"There is no PRODUCT.md writer in `skill/scripts`."** `doctor.mjs:208` calls `fs.writeFileSync(productPath, stampProductSchema(report.ctx.product))` under `--fix`, and `reference/doctor.md:29` tells the model to run `--fix` without asking. The model authors the substance; a script is the sole automatic writer of the `<!-- impeccable:product-schema 1 -->` stamp — the one constant the claim singled out as model-copied.

24. **"Anything escaping projectRoot returns null and `writeSurfaceBrief` throws."** Only for relative paths and drive-absolute paths. A leading-slash target that does not exist on disk and contains no `..` is reinterpreted as a route: a reader ran `writeSurfaceBrief({primaryTarget: '/etc/passwd'})` and it succeeded, creating `.impeccable/surfaces/route-etc-passwd.md`. URL normalisation keeps the pathname and drops only a trailing slash. Add reason `'none'` for zero briefs.

25. **Ten rules carry `severity: 'advisory'`.** Eleven do. Correct breakdown of 59: 46 default 'warning' + 11 `severity: 'advisory'` + 2 `severity: 'error'`. Only one rule (`em-dash-overuse`) carries `advisory: true`, which is the flag that actually partitions the exit code; the eleventh, `image-hover-transform`, is labelled advisory in severity but still counts as a failure and still exits 2.

26. **The per-edit pass emits only the 13 `IMMEDIATE_TIER_RULES`.** Only when `perEditTieringActive(config, harness)` is true — false for `harness === 'cursor'` and `'github'` (no deep pass is wired for them, so deferring would drop the rules entirely) and false under `perEditRules: 'all'`. The Cursor pre-write gate — the one surface that actually blocks — runs the full filtered set.

27. **Puppeteer engine ranges and constants.** `detectUrl` is `:165-337`, not `:164-325` (the cited range excludes the `finally`/close block it describes); every constant citation is off by 1–3 lines. More materially: `'networkidle0'` and `settleMs: 0` are the run's constants only for a single URL. With more than one http(s)/file target the CLI routes through `createBrowserDetector`, whose defaults override to `waitUntil: 'load'` and `settleMs: 100`, and whose browser `detectUrl` does not close. Page errors are deduped by first line before the slice of 3. And this is the only *headless* render check, not the only render check — live mode drives a real browser.

28. **"Findings are reported, never auto-fixed."** `SKILL.md:84` says the doctor reports *and repairs* drift; `SKILL.md:86` names the exception in its own text ("The one exception is a finding marked `auto`"). `doctor.mjs applyFixes()` skips every non-`auto` finding and performs the auto migrations for real (`fs.renameSync`). The claim was internally inconsistent, having listed `'auto'` among the emitted severities.

29. **"Refuses in exactly two places; silent only for its own telemetry."** Both quantifiers fail. Refusals also fire on missing *state*: `surface-brief.mjs:42` exit 2 when `read` cannot resolve, `serve-question.mjs:222` exit 2 when `--update` finds no live server, `:93/:109` exit 2 headless. And silence is not confined to telemetry: `hook.mjs:64-78` swallows **any** error in the enforcement path and exits 0 (stderr only under `IMPECCABLE_HOOK_DEBUG`); `hook-before-edit.mjs` allows silently on `detector-missing` and `detector-threw`, because `allow()`/`writeAuditLog` is a no-op unless `IMPECCABLE_HOOK_LOG` or config `auditLog` is set; `surface-briefs.mjs:96-100` silently drops an unreadable surface brief. The CLI refuses on a missing detector; the hook meets the identical condition and allows.

### Cross-cutting, confirmed rather than corrected

- **The declared exit contract does not match two of the four engines.** `product/pipeline.json:341-347` declares 0/1/2/3 as done / measured defect / usage / not-ready-or-withheld, "stable across every command, so an automated caller can branch on it". `gate.mjs` inverts 1 and 2. `critique.mjs` inverts them *and* stretches 1 to cover invocation errors the contract assigns to 2. `verify.mjs` folds withheld verdicts into 1 and has no 3. Only `contract.mjs` implements the declared contract. This reaches the shipped CLI: `sitesmith audit` returns `Math.max(inspect, gate)`, and `tools/provider-pack.mjs:50` copies the contract into every provider pack. `tools/test-commands-exit.mjs` exercises only `init` and `build`.

---

## Not verified in code

**SiteSmith**

- That the anti-repeat ledger runs as part of any normal build. `verify.md`'s release command list and `commands.mjs`'s manifest name neither `parse`, `check` nor `commit`; `gate.mjs` imports node builtins only. `README.md:90` and `.claude-plugin/plugin.json:4` describe a capability that exists in code and is wired into no documented run.
- That the signature-material veto can fire from a rendered page (see correction 6 — the measurement half does not exist).
- That the three-thesis floor and argued runner-up gate a *release*. They live only in `ledger.mjs`; `gate.mjs` never reads `Theses`.
- `run.md:32`'s command string omits the directory positional the CLI requires; typed literally it exits 2.
- The head-to-head numbers in `SKILL.md:93-96` and `ledger.mjs:6-8` (40 vs 59, thirty in thirty-five). No code or data reproduces them.
- Cross-machine reach of the ledger: no code shares or syncs the file.
- `hueRegion()`'s twelve buckets are printed and never consulted.
- `docs/GATE-POLICY.md`'s four criteria were quoted from `pipeline.json`, not read from the policy document (one reader later confirmed the wording matches; the other did not open it).
- The `falsePositiveRisk` and `evidence` strings in `rules.json` come from `product/rule-notes.json`, which was not read.
- `evidence/pilot/` and the provider status claims in `pipeline.json:296-318` were not opened.
- `tools/context-budget.mjs`, named as the reason for the inverted gate exit codes, was not read.
- `measureViewport`/`measureFocus` internals were not traced line by line; only their exclusion from the blocking sum was verified.
- No script in this list was executed on this branch except where a reader explicitly says they ran it.

**Impeccable**

- The size and composition of the production concept catalogue. `concept-seed.mjs:97` says the full catalogue does not ship; the tests say the live catalogue is service-side. The only data at this commit is a fixture (35 concepts, 5 families, 5 wells, 30 approved / 5 rejected; 6 compositions in 4 families).
- The size of the production composition catalogue. The "137 of 173 approved compositions were view grain" figure is an inline comment; `git ls-tree` at this SHA shows no composition catalogue JSON anywhere.
- The "30/35 identical concepts across 16 prompt framings" measurement. Comment only.
- Server-side behaviour of `/api/roll` and `/api/chosen` — what is logged, retained or returned. No server code at this commit. The client payload is `{chosenId, key, scope, mode}`.
- Whether the roll API applies the same breadth/rating/mode gates as the shipped selector. Only the client half is in this repo.
- Whether anything downstream verifies the model built the assigned index. Nothing found in hooks, detector rules or reviewer scripts.
- The re-roll rule that earlier rounds' candidates may not return reworded is enforced only for catalogue challengers by id exclusion; the model's own grounded candidates are tracked nowhere.
- The two-round verification ceiling. No script counts inspection rounds, captures build screenshots or refuses a third pass.
- `reference/audit.md`'s five dimensions and its 0–4 scoring / P0–P3 severities are model instructions; only dimension 5 names an executable step.
- The 59 rules were verified as registry entries and engine-support declarations, not as 59 implementations. `cli/engine/rules/checks.mjs` (252 KB), the regex and static-HTML engines and the browser bundle were not read, so per-rule thresholds come from registry text.
- Live mode (`live*.mjs`, `live-browser.js` ~500 KB, `live-server.mjs`) is a second rendered-iteration surface with its own browser; only `live/accept-verify.mjs` was read.
- The npm package version at this commit is 3.5.0 while the skill declares 4.0.4; how the two are reconciled at release was not verified.
- Whether the detector's CI-facing exit 2 is consumed by any real pipeline is outside the repo.