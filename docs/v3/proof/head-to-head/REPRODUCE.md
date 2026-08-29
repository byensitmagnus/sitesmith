---
title: Reproduce head-to-head freeze
status: frozen
ai_generated: "(C)"
---

# Reproduce freeze (no model calls)

## Refs

- Proof branch: `codex/v3-direction-engine-proof` @ `b92cdabad98c4d23ff79b74d6881e6b7129325a4`
- Head-to-head branch: `codex/v3-direction-head-to-head`
- Pins: `docs/v3/proof/head-to-head/CANONICAL-SOURCES.json`
- Packs: `docs/v3/proof/head-to-head/briefs/*`
- Manifest: `docs/v3/proof/head-to-head/RUN-MANIFEST.json`

## Rebuild freeze artifacts from source briefs

```powershell
node tools/freeze-h2h-benchmark.mjs
node tools/dry-run-h2h.mjs
node tools/test-h2h-freeze.mjs
```

Re-running freeze **changes hashes** if source briefs change — treat as a new freeze and invalidate prior approval.

## Verify pins without network (local ledger)

```powershell
node tools/test-proof-integrity.mjs
```

Upstream commit reachability (optional network):

```powershell
# examples — informational only
# gh api repos/Leonxlnx/taste-skill/commits/e988add20dab0fa97d7a76781c48961c8184288e --jq .sha
```

## After credit approval (not executed at freeze)

1. Confirm `WORKFLOW-STATE.json` state is `AWAITING_CREDIT_APPROVAL`.
2. User grants credit approval explicitly.
3. Transition to screening; run slots under `runs/screening/**` must still have no result payloads.
4. Follow `FAIRNESS-CONTRACT.md` and randomized order in `RUN-MANIFEST.json`.
