---
title: SiteSmith unified rebuild — charter
state: S0_REPO_TRUTH
status: active
branch: rebuild/sitesmith-unified
base: dc00598cce2af92435a749856393e287506753bc
ai_generated: "(C)"
---

# Rebuild charter

## Goal

One SiteSmith skill that builds and redesigns complete websites end to end, whose
mechanisms are reverse-engineered from the best upstream skills and repos rather than
chained to them, and whose quality is proven in a browser rather than asserted.

**What it must solve** — the three failures the current repo actually demonstrates:

1. **Mechanical creativity loses.** A deterministic direction engine scored 40 where
   frontend-design's LLM-native method scored 59 on the same brief
   (`docs/v3/proof/head-to-head/eval/MINI-1-LEATHER-LLM-REPORT.md`). SiteSmith kept
   trying to out-compute a creative director. It cannot.
2. **A house style formed.** Three independently-briefed sites converged on five shared
   moves and the showcase sits at **0/8**
   (`gallery/showcase.json`, `portfolioDiversity: fail`). Anti-slop rules produced their
   own slop.
3. **The user has to operate the machine.** The accepted post-H2H pipeline requires the
   user to run four upstream skills plus SiteSmith in the right order
   (`docs/v3/PRODUCT-PIPELINE.md`). That is a workflow, not a product.

**Acceptance criteria** — the rebuild is accepted only when all of these hold:

| # | Criterion | How it is checked |
| --- | --- | --- |
| A1 | One skill. The user types one thing. | No step in `SKILL.md` tells the user to invoke another skill |
| A2 | `SKILL.md` is a control plane, under 500 lines | `tools/check-repo.py` (existing CI gate) |
| A3 | Progressive loading: routine task never loads the whole rule set | Measured — token count of the always-loaded set, recorded |
| A4 | Creative decisions are made by the host model, not by a script | No script output is allowed to be the design decision; enforced by review |
| A5 | Every adopted upstream mechanism traces to a source, commit and licence | `SOURCE-REGISTRY.json` + `MECHANISM-LEDGER` + `THIRD-PARTY-NOTICES.md` |
| A6 | Every rejected mechanism has a written reason | `MECHANISM-LEDGER` decision field |
| A7 | Browser verification works and is honest | `scripts/verify.mjs`; control group `benchmarks/06-redesign/before/` still **fails** |
| A8 | One holdout end-to-end build ≥ the strongest relevant baseline | Blind comparison, screenshots, one new unseen brief |
| A9 | No house style across the holdout plus the two prototypes | Portfolio diversity check across the three |
| A10 | Loops terminate | Every loop in the skill has a written stop condition |

## Hard constraints (violating one invalidates the work)

| Id | Constraint | Source of the constraint |
| --- | --- | --- |
| `C-no-mechanical-creativity` | Scripts verify, retrieve and gate. Scripts never decide the design. | Measured 40 vs 59 loss, `MINI-1-LEATHER-LLM-REPORT.md` |
| `C-no-skill-chain` | The user activates SiteSmith and nothing else. | Master prompt §15 |
| `C-no-house-style` | Anti-slop must not become a signature. Diversity is checked across builds, not inside one. | `gallery/showcase.json` 0/8 |
| `C-licence` | Redistributable verbatim: **taste-skill** and **ui-ux-pro-max** (MIT), **frontend-design** and **impeccable** (Apache-2.0). Nothing else may be copied verbatim without a fresh licence check. | `LICENSE-AUDIT.md`, project `CLAUDE.md` |
| `C-no-unlicensed-text` | `website-builder-setup` (no licence) and `redesign-skill` (no traceable author) must never be quoted, even paraphrased closely. | `LICENSE-AUDIT.md` |
| `C-control-group` | `benchmarks/06-redesign/before/` must keep failing `verify.mjs`. Never fix the test to make it pass. | project `CLAUDE.md` |
| `C-no-new-h2h` | No new 15-arm head-to-head. One holdout against one strongest baseline. | Master prompt §21, benchmark decision memory |
| `C-evidence-over-frontmatter` | A document's own status field is not evidence. Claims are checked against artifacts. | `CURRENT-REPO-TRUTH.md` integrity note |
| `C-no-push-no-merge` | Work on `rebuild/sitesmith-unified`. No force-push. No merge to `main`. Push only after Magnus approves once for this branch. | Master prompt §4, §25 |

## Anti-goals

Not building: a Direction Engine with fixed worlds; a catalogue generator; an
orchestration platform; a swarm for its own sake; a benchmark machine; four skills
glued together; a 2000-line `SKILL.md`; a skill that needs a specific paid provider;
a system that silently falls back to low quality; a house style dressed as anti-slop;
an infinite self-improvement loop.

## Budget policy

Ceilings, not targets. The Budget Controller records against these and the run stops
at a ceiling rather than asking for more.

| Limit | Value |
| --- | --- |
| Concurrent research agents | 6 |
| Revision loops per phase | 2 |
| Architecture candidates | 3 (plus red team) |
| Prototype sites before holdout | 2 |
| Re-runs without a changed hypothesis | 0 |
| Paid third-party API spend | **0** — no key is present, and none is needed |
| New head-to-head arms | 0 |

Model class policy:

| Class | Used for |
| --- | --- |
| cheap | repo scanning, file classification, mechanical comparison, dedup, formatting, state and graph updates |
| mid | repo autopsies, workflow analysis, UX analysis, conflict analysis, implementation planning |
| strong | synthesis, architecture selection, the creative workflow itself, final red team, holdout adjudication |

## Stopgates

Stop and ask only for: real source ambiguity that changes the product; a licence
blocker; an architecture decision with genuinely equal options; cost above the ceiling;
push or merge; needing Magnus's own assets or credentials; a technical blocker not
solvable locally; or the core hypothesis being falsified.

Do not stop after: one autopsy, one agent report, one green script, one prototype, one
review, or a state-file update.
