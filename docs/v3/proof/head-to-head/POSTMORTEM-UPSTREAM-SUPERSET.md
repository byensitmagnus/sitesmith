---
title: Postmortem — PROOF FAILED UPSTREAM SUPERSET
status: complete
ai_generated: "(C)"
---

# Postmortem — head-to-head loss

**Verdict locked:** `PROOF FAILED — UPSTREAM SUPERSET`  
**SiteSmith:** 0/3 match-or-win  
**Best upstream:** frontend-design (all three briefs)  
**Evaluators:** full top-1 agreement  

## What the scores said

SiteSmith was consistently **#4/5** (above raw UUPM retrieval, below taste/impeccable/frontend).

Weakest criteria (avg ~2):

- subject specificity
- originality
- hierarchy
- typography / materiality / signature (varies by brief)

Stronger relative criteria:

- anti-cliché (~3–3.5)
- brief fit on product-ui (~4)
- asset strategy when imageless (~4)

## Root causes (engine, not “bad luck”)

1. **Packet prose was template sludge**  
   Thesis/signature like `northline-sig-1` and `via hard vertical rule…` lost to full creative theses (Hide Grade Strip, make-slot desk).

2. **Subject leak**  
   YAML `title: "Subject: …"` left trailing `"` on subject strings — looked broken in blind packets.

3. **Evidence dump**  
   `subjectGrounding` included frontmatter (`title:`, `ai_generated`) instead of clean facts.

4. **Wrong imagery on commerce**  
   With plates available, cards still read as generic “diagram-led” in some paths — not plate-first trade bench.

5. **Arm asymmetry (method)**  
   frontend/taste/impeccable = full LLM native workflows.  
   sitesmith = mechanical Direction Engine slice.  
   uupm = retrieval only (no LLM synthesis) — finished last by design.

The gate still stands: **as shipped for screening, SiteSmith directions were not competitive.**

## Remediation started (post-fail, does not rewrite the lost round)

| Fix | Status |
| --- | --- |
| `cleanExtractedField` / content-line filtering | landed |
| products / materials / brandPalette signals | landed |
| Rich thesis, hierarchy, signature, brand colour | landed |
| Clean evidence summary + handoff prose | landed |
| Tests for quote leak + rich cards | landed |
| Re-freeze + new H2H | **not** done (would be a new proof round) |

## What we will not do

- Claim the failed round “almost won”
- Cherry-pick briefs
- Re-score the same blind set with thicker SiteSmith packets (contamination)
- Start v2.3 builds after this fail
- Change showcase from 0/8

## Next proof round (only if authorized)

1. Land remediations on engine + optional LLM polish layer *behind* DesignSpec (still evidence-bound).  
2. Fair UUPM arm: retrieval **+** same model synthesis budget as other LLM arms.  
3. New freeze hashes + new 15-run screening + new blind eval.  
4. Advance only if match/win ≥2/3.

## Evidence anchors

- `eval/EVAL-REPORT.md`
- Screening packets under `runs/screening/**/DIRECTION-PACKET.json`
- Engine changes: `input.mjs`, `worlds-and-cards.mjs`, `designspec.mjs`
