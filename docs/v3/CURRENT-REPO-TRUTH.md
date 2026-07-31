---
title: SiteSmith current repository truth
status: verified
verifiedAt: 2026-07-31
ai_generated: "(C)"
---

# Current repository truth

Verified from live `git` commands. Do not treat chat history as source of truth.

## Branch and commits

| Fact | Value |
| --- | --- |
| Current branch at verification start | `main` |
| Proof branch created after verification | `codex/v3-direction-engine-proof` |
| `HEAD` (full SHA) | `dc00598cce2af92435a749856393e287506753bc` |
| `HEAD` short | `dc00598` |
| `origin/main` (full SHA) | `80d4030780a4cab18f3baa16dfd354269f83971c` |
| `origin/main` short | `80d4030` |
| `main` relative to `origin/main` | **ahead by 1 commit** (`dc00598`) |
| `dc00598` exists locally | **yes** (`git cat-file -t` → `commit`) |
| `dc00598` is ancestor of previous `HEAD` | **yes** (it *was* `HEAD`) |
| `dc00598` pushed to `origin/main` | **no** |

### Recent log (`git log --oneline --decorate -10` at verification)

```text
dc00598 (HEAD -> main) chore: snapshot v3 groundwork, licence provenance and repo tooling
80d4030 (origin/main, origin/HEAD) feat: prevent SiteSmith visual convergence
d91c915 Reset showcase and rebuild project page
655812e Redesign landing page around reviewed v2 proof
802d9ec chore: clean product release whitespace
44f6bdd feat: ship the three-command product surface
739839b test: prevent product docs and provider packs from drifting
9a70477 feat: make direction dials shape candidate selection
6a4359c test: require visible direction dials to shape candidates
9ae156c feat: route the compact product flow by detected stack
```

## What `dc00598` contains

48 files changed, +18146 / −81. Material v3 package paths:

- `docs/v3/ADOPTION-ARCHITECTURE.md`
- `docs/v3/CAPABILITY-SUPREMACY-MATRIX.md`
- `docs/v3/DERIVATION-ARCHITECTURE.md`
- `docs/v3/FOUNDATION-DECISION.md`
- `docs/v3/LICENSE-DERIVATION-AUDIT.md`
- `docs/v3/QUALITY-CONTRACT.md`
- `docs/v3/STRENGTH-ASSERTIONS.json`
- `docs/v3/UPSTREAM-CAPABILITY-LEDGER.json`
- `docs/v3/UPSTREAM-CAPABILITY-LEDGER.md`
- `docs/v3/UPSTREAM-FORENSICS.md`
- `docs/v3/reviews/ADVERSARIAL-REVIEW-C.md`
- `docs/v3/reviews/ADVERSARIAL-REVIEW-D.md`
- `docs/v3/reviews/ADVERSARIAL-REVIEW-E.md`
- `docs/v3/reviews/TRACEABILITY-REVIEW-C.md`
- `docs/v3/reviews/TRACEABILITY-REVIEW-E.md`
- `skills/sitesmith/LICENSES/Apache-2.0.txt`
- `skills/sitesmith/THIRD-PARTY-NOTICES.md`
- `skills/sitesmith/THIRD-PARTY-PROVENANCE.json`
- `tools/check-v3-docs.mjs`
- `tools/seal-strength-assertions.mjs`
- `tools/sync-v3-treatments.mjs`
- plus licence/provenance/README/CI and skill reference touch-ups

## Working tree at verification (on `main` before proof branch work)

| Path | Status |
| --- | --- |
| Tracked modifications vs `dc00598` | **none** (`git diff --stat HEAD` empty) |
| `AGENTS.md` | untracked |
| `CLAUDE.md` | untracked |
| `.playwright-mcp/` | untracked (local tool cache; not product) |

So: **not** only two untracked files — three untracked paths. No uncommitted edits to tracked files at verification time.

## v3 push state

| Question | Answer |
| --- | --- |
| Are any v3 files committed locally? | **Yes** — all under `dc00598` |
| Are any v3 files on `origin/main`? | **No** — `origin/main` is still `80d4030` (pre-v3 snapshot) |
| Showcase status (unchanged) | `gallery/showcase.json` → `"status": "reset"`, `approved: []` → **0/8** |

## Integrity note (pre-fix)

At verification, `docs/v3/FOUNDATION-DECISION.md` claimed architecture readiness with both reviews PASS. Live review files on the same commit:

| Review file | Frontmatter `status` | `blockerCount` |
| --- | --- | --- |
| `TRACEABILITY-REVIEW-C.md` | `pass` | `0` |
| `ADVERSARIAL-REVIEW-C.md` | `fail` | `3` |
| `ADVERSARIAL-REVIEW-D.md` | `fail` | `2` |
| `ADVERSARIAL-REVIEW-E.md` | `fail` | `1` |
| `TRACEABILITY-REVIEW-E.md` | `fail` | `1` |

That mismatch is a **blocking integrity defect**. Remediation is tracked in `docs/v3/reviews/REVIEW-STATUS.*` and the foundation status correction on the proof branch.

## Scope decision locked by this workstream

- Full M0–M10 v3 architecture: **not approved for implementation**
- Approved work: **Direction Engine v3 vertical slice** on the existing v2.3 shell
- Push policy: **proof branch only**; do not push or merge `main`
