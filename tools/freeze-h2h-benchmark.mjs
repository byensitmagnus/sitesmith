#!/usr/bin/env node
/**
 * Freeze head-to-head context packs, sources, fairness, run manifest.
 * Does NOT call models or generate direction results.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
const proofBriefs = join(root, 'docs/v3/proof/briefs');
const proofSha = 'b92cdabad98c4d23ff79b74d6881e6b7129325a4';
const freezeStamp = '2026-07-31T18:30:00.000Z';

function sha256Text(s) {
  return createHash('sha256').update(String(s), 'utf8').digest('hex');
}
function sha256File(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}
function writeLf(p, content) {
  mkdirSync(dirname(p), { recursive: true });
  const text = String(content).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  writeFileSync(p, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
}
function copyCanonical(src, dest) {
  const text = readFileSync(src, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  writeLf(dest, text);
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const constraintsBodies = {
  '01-leather-goods': `---
title: Constraints — Northline Leather Goods
status: frozen-benchmark-input
ai_generated: "(C)"
---

# Constraints

Source: existing proof brief evidence/brand/asset plan only. Unknowns stay unknown.

- Do not invent reviews, celebrity clients, or free worldwide shipping.
- Anti-references: purple SaaS gradient, stock handshake photos, fake 4.9★ rows.
- No testimonials on file (brand).
- Deliberately no lifestyle models (asset plan).
- Load-bearing assets: product plates for Field Tote and Belt No. 2; stitch macro is needed/not declared as have.
- Platform: mobile-first web (brief).
- Price band and make-slot lead time only as stated in evidence.
`,
  '02-atelier-printworks': `---
title: Constraints — Atelier Møn Printworks
status: frozen-benchmark-input
ai_generated: "(C)"
---

# Constraints

Source: existing proof brief evidence/brand/asset plan only. Unknowns stay unknown.

- Do not invent awards or false museum placements.
- Anti-references: generic creative-agency blob gradients, stock loft photos.
- Load-bearing assets: photographs of three editions on press sheets; ferry-board.webp is needed/not declared as have.
- Platform: desktop-tolerant marketing site (brief).
- Facts allowed only as listed in evidence (paper stock names, edition sizes, press type).
`,
  '03-passage-console': `---
title: Constraints — Passage Log Console
status: frozen-benchmark-input
ai_generated: "(C)"
---

# Constraints

Source: existing proof brief evidence/brand/asset plan only. Unknowns stay unknown.

- Do not invent throughput KPIs or customer logos.
- Anti-references: consumer fintech gradients, playful illustration chrome.
- Imagery: deliberately imageless (asset plan/manifest).
- Platform: desktop web app (brief).
- States that exist: empty log, validation error, success row, offline banner.
- Keyboard shortcut fact allowed only as stated: Ctrl+Enter.
`,
};

const briefMap = [
  {
    id: '01-leather-goods',
    sourceDir: '01-leather-goods',
    modeLabel: 'sensory e-commerce',
    mode: 'ecommerce',
    stack: 'html',
    projectName: '01-leather-goods',
    randomSeed: 'h2h-leather-2026-07-31',
  },
  {
    id: '02-atelier-printworks',
    sourceDir: '02-atelier-portfolio',
    modeLabel: 'characterful marketing/portfolio',
    mode: 'marketing',
    stack: 'html',
    projectName: '02-atelier-printworks',
    randomSeed: 'h2h-atelier-2026-07-31',
  },
  {
    id: '03-passage-console',
    sourceDir: '03-passage-console',
    modeLabel: 'functional product UI',
    mode: 'product-ui',
    stack: 'html',
    projectName: '03-passage-console',
    randomSeed: 'h2h-passage-2026-07-31',
  },
];

const contentFiles = [
  'BRIEF.md',
  'EVIDENCE.md',
  'BRAND.md',
  'ASSET-PLAN.md',
  'ASSET-MANIFEST.md',
  'CONSTRAINTS.md',
];

const briefHashes = {};

for (const b of briefMap) {
  const src = join(proofBriefs, b.sourceDir);
  const dest = join(h2h, 'briefs', b.id);
  mkdirSync(dest, { recursive: true });
  for (const f of ['BRIEF.md', 'EVIDENCE.md', 'BRAND.md', 'ASSET-PLAN.md', 'ASSET-MANIFEST.md']) {
    if (!existsSync(join(src, f))) throw new Error(`missing source ${b.sourceDir}/${f}`);
    copyCanonical(join(src, f), join(dest, f));
  }
  writeLf(join(dest, 'CONSTRAINTS.md'), constraintsBodies[b.id]);

  const inputHashes = {};
  for (const f of contentFiles) {
    inputHashes[f] = sha256File(join(dest, f));
  }

  const packParts = contentFiles.map((f) => `${f}\0${readFileSync(join(dest, f), 'utf8')}`);
  const contextPackHash = sha256Text(packParts.join('\n'));

  const runContext = {
    briefId: b.id,
    mode: b.mode,
    modeLabel: b.modeLabel,
    primaryAudience: 'see BRIEF.md / EVIDENCE.md',
    primaryAction: 'see BRIEF.md / EVIDENCE.md',
    stack: b.stack,
    projectName: b.projectName,
    randomSeed: b.randomSeed,
    sourceProofBriefDir: `docs/v3/proof/briefs/${b.sourceDir}`,
    allowedAssets: 'see ASSET-MANIFEST.md',
    antiReferences: 'see EVIDENCE.md and CONSTRAINTS.md',
    constraints: 'see CONSTRAINTS.md',
    inputFiles: contentFiles,
    inputHashes,
    contextPackHash,
    frozen: true,
    frozenAt: freezeStamp,
    proofSha,
    note: 'Identical pack for all five arms. No arm-specific extras. Unknowns remain unknown.',
  };
  writeLf(join(dest, 'RUN-CONTEXT.json'), JSON.stringify(runContext, null, 2));
  inputHashes['RUN-CONTEXT.json'] = sha256File(join(dest, 'RUN-CONTEXT.json'));
  briefHashes[b.id] = {
    contextPackHash,
    inputHashes,
    mode: b.mode,
    modeLabel: b.modeLabel,
    path: `docs/v3/proof/head-to-head/briefs/${b.id}`,
  };
}

const pins = {
  schemaVersion: 1,
  frozen: true,
  frozenAt: freezeStamp,
  proofSha,
  sitesmithBranch: 'codex/v3-direction-engine-proof',
  headToHeadBranch: 'codex/v3-direction-head-to-head',
  readOnlyUpstreams: true,
  noCodeChangesAfterFreeze: true,
  arms: {
    'taste-skill': {
      armId: 'A',
      repo: 'Leonxlnx/taste-skill',
      commit: 'e988add20dab0fa97d7a76781c48961c8184288e',
      role: 'upstream',
      workflow: 'native Design Read + dials',
      readOnly: true,
    },
    'ui-ux-pro-max': {
      armId: 'B',
      repo: 'nextlevelbuilder/ui-ux-pro-max-skill',
      commit: '4857a2c5ef989794751a0f66b8545a4a49566286',
      role: 'upstream',
      workflow: 'native retrieval + design-system generator',
      readOnly: true,
    },
    'frontend-design': {
      armId: 'C',
      repo: 'anthropics/skills',
      path: 'skills/frontend-design',
      commit: 'b29e7cf65e5cb78a5ac33d582270551bc74a14eb',
      role: 'upstream',
      workflow: 'native creative thesis, plan, self-critique',
      readOnly: true,
    },
    impeccable: {
      armId: 'D',
      repo: 'pbakaus/impeccable',
      commit: '6b342244e915d64b0d6e84d5eec448fd196ce6bb',
      role: 'upstream',
      workflow: 'native concept seed, challengers, reroll, decision process',
      readOnly: true,
    },
    sitesmith: {
      armId: 'E',
      repo: 'byensitmagnus/sitesmith',
      commit: proofSha,
      branch: 'codex/v3-direction-engine-proof',
      role: 'candidate',
      workflow: 'frozen Direction Engine + v2.3 handoff',
      readOnlyAfterFreeze: true,
    },
  },
  pinSource: 'docs/v3/CANONICAL-UPSTREAM-PINS.json + proof HEAD b92cdab',
};
writeLf(join(h2h, 'CANONICAL-SOURCES.json'), JSON.stringify(pins, null, 2));

const outputSchema = {
  schemaVersion: 1,
  name: 'direction-packet-normalized-v1',
  purpose: 'Comparable extraction only — never invent or improve content',
  requiredFields: [
    'designThesis',
    'subjectGrounding',
    'composition',
    'informationHierarchy',
    'typography',
    'colourAndMaterialModel',
    'imageryAndAssetStrategy',
    'interactionConcept',
    'signatureElement',
    'primaryRisk',
    'implementationGuidance',
    'unknowns',
    'sourcePointers',
  ],
  rules: {
    retainNativeOutput: true,
    normalizeMay: ['extract', 'structure', 'reformat'],
    normalizeMustNot: [
      'improve weak ideas',
      'invent missing choices',
      'add rationale',
      'hide contradictions',
      'translate unknown into assumptions',
    ],
    missingValue: 'unknown',
  },
};
writeLf(join(h2h, 'OUTPUT-SCHEMA.json'), JSON.stringify(outputSchema, null, 2));

const fairness = `---
title: Fairness contract — upstream direction head-to-head
status: frozen
ai_generated: "(C)"
---

# Fairness contract

**Status:** frozen for screening (and replication if approved).  
**Proof status remains:** \`PROOF FAILED — DIRECTION QUALITY\` until comparison completes.

## Equal inputs

- Same context pack per brief for all five arms.
- Same model/provider class within a round when technically possible.
- Same token budget per run.
- Same wall-clock budget per run.
- Same iteration count (one primary generation path; upstream-native loops allowed only if that is their documented normal workflow and still within budgets).
- Same tool-access level (read brief pack + arm-native tools only).
- Fresh context per run.
- Fresh workspace per run.
- No cross-run memory.
- Randomized run order.
- No live scoring during generation.
- At most one retry, only for documented infrastructure failure.
- Poor quality is not a retry reason.
- No prompt changes after first output is seen.
- No cherry-picking briefs or arms after scores exist.

## Native workflows allowed

| Arm | Allowed native behaviour |
| --- | --- |
| taste-skill | Design Read and dials |
| ui-ux-pro-max | Actual retrieval + design-system generator |
| frontend-design | Creative thesis, plan, self-critique |
| impeccable | Concept seed, challengers, reroll, normal decision process |
| SiteSmith | Frozen Direction Engine + v2.3 handoff |

Upstreams must **not** be artificially reduced to inflate SiteSmith.

SiteSmith must **not** receive extra context, assets, time, iterations, or access to upstream outputs.

## Normalization

See \`OUTPUT-SCHEMA.json\`. Extract/structure/reformat only.

## Isolation

- No candidate knows other candidates, other outputs, evaluator rubric, or rank position.
- Evaluator contexts are separate and blind.

## Invalidation

Any change to packs, pins, fairness rules, budgets, or SiteSmith/upstream code after freeze invalidates the round.
`;
writeLf(join(h2h, 'FAIRNESS-CONTRACT.md'), fairness);

const risks = `---
title: Head-to-head risk register
status: frozen
ai_generated: "(C)"
---

# Risk register (known residuals — not fixed in freeze)

These are known **before** benchmark runs and must not be hidden:

1. **Anti-reference colour gate is weak** against the current Direction Engine seed catalog (near dead code for bare-purple).
2. **Subject parsing** can leave a trailing quotation artifact in theses/signatures.
3. **Asset unit test** can soft-pass without proving imagery change.
4. **Gate 1 proves mechanics**, not aesthetic quality vs upstreams.

Engine fixes for these are **out of scope** for the freeze phase. They inform interpretation; they do not authorize post-hoc engine tuning after runs start.
`;
writeLf(join(h2h, 'RISK-REGISTER.md'), risks);

const budgets = {
  schemaVersion: 1,
  modelClass:
    'frontier-class coding agent (host-equivalent; exact vendor may vary by arm host)',
  tokenBudgetPerRun: 120000,
  wallClockMinutesPerRun: 45,
  maxIterationsPerRun: 1,
  maxInfrastructureRetries: 1,
  note:
    'Estimates are planning bounds, not measured provider invoices. Grok/OpenAI/Anthropic credit burn is not metered here.',
};
writeLf(join(h2h, 'BUDGETS.json'), JSON.stringify(budgets, null, 2));

const arms = [
  'taste-skill',
  'ui-ux-pro-max',
  'frontend-design',
  'impeccable',
  'sitesmith',
];
const briefIds = briefMap.map((b) => b.id);

const screeningRuns = [];
for (const briefId of briefIds) {
  for (const arm of arms) {
    screeningRuns.push({
      runId: `screen-${briefId}-${arm}`,
      phase: 'screening',
      briefId,
      arm,
      status: 'declared-not-started',
      contextPackHash: briefHashes[briefId].contextPackHash,
      armCommit: pins.arms[arm === 'sitesmith' ? 'sitesmith' : arm].commit,
      outputDir: `docs/v3/proof/head-to-head/runs/screening/${briefId}/${arm}`,
      resultPresent: false,
      modelCallsAllowed: false,
    });
  }
}

const order = screeningRuns.map((_, i) => i);
const rand = mulberry32(0x48_32_48_32);
for (let i = order.length - 1; i > 0; i -= 1) {
  const j = Math.floor(rand() * (i + 1));
  [order[i], order[j]] = [order[j], order[i]];
}
const randomizedOrder = order.map((idx, position) => ({
  position,
  runId: screeningRuns[idx].runId,
  briefId: screeningRuns[idx].briefId,
  arm: screeningRuns[idx].arm,
}));

const replicationRuns = screeningRuns.map((r) => ({
  ...r,
  runId: r.runId.replace(/^screen-/, 'replicate-'),
  phase: 'replication',
  status: 'declared-not-started-pending-decision',
  outputDir: r.outputDir.replace('/screening/', '/replication/'),
  modelCallsAllowed: false,
}));

const runManifest = {
  schemaVersion: 1,
  frozen: true,
  frozenAt: freezeStamp,
  proofSha,
  phases: {
    screening: {
      briefs: 3,
      arms: 5,
      runs: 15,
      status: 'declared-not-started',
      requiresCreditApproval: true,
    },
    replication: {
      briefs: 3,
      arms: 5,
      runs: 15,
      status: 'optional-after-screening-decision',
      requiresCreditApproval: true,
      note: 'Only if screening is mixed/preliminary match per protocol',
    },
  },
  briefs: briefHashes,
  arms: pins.arms,
  budgets,
  outputSchema: 'docs/v3/proof/head-to-head/OUTPUT-SCHEMA.json',
  fairnessContract: 'docs/v3/proof/head-to-head/FAIRNESS-CONTRACT.md',
  screeningRuns,
  randomizedScreeningOrder: randomizedOrder,
  randomizationSeed: '0x48324832',
  replicationRuns,
  paidModelCallsMade: 0,
  resultsDirectoriesMustBeEmptyBeforeStart: true,
};
writeLf(join(h2h, 'RUN-MANIFEST.json'), JSON.stringify(runManifest, null, 2));

// empty ledger (header only)
writeLf(
  join(h2h, 'RUN-LEDGER.jsonl'),
  `${JSON.stringify({
    type: 'ledger-opened',
    at: freezeStamp,
    proofSha,
    note: 'No runs executed. Append-only after credit approval.',
    paidModelCallsMade: 0,
  })}\n`,
);

// create empty run slot dirs (no result files)
for (const r of screeningRuns) {
  mkdirSync(join(root, r.outputDir), { recursive: true });
  writeLf(
    join(root, r.outputDir, '.gitkeep'),
    '# Slot reserved. No results until credit approval.\n',
  );
}

const cost = `---
title: Head-to-head cost estimate
status: planning-estimate
ai_generated: "(C)"
---

# Cost estimate (planning bounds — not invoices)

**Uncertainty:** high. Provider list prices, cache hits, host tool overhead, and Grok credit metering are **not** measured in this repo. Figures below are deliberate upper-bound **planning** estimates for approval, not billable totals.

## Shared assumptions

| Parameter | Value |
| --- | --- |
| Token budget / run | 120 000 (input+output combined ceiling) |
| Wall-clock / run | 45 minutes ceiling |
| Iterations / run | 1 primary path (+ at most 1 infra retry) |
| Model class | frontier coding agent (host-dependent) |

## Screening (15 runs)

| Metric | Estimate | Uncertainty |
| --- | --- | --- |
| Runs | 15 | exact |
| Tokens (sum of ceilings) | ≤ 1 800 000 | high (actual often much lower) |
| Wall-clock sequential | ≤ 11.25 h | medium (parallelism may reduce calendar time) |
| Wall-clock if 3-way parallel | ~4 h calendar | medium |
| Provider / credit cost | **unknown** without host billing | cannot claim DKK/$ |
| Credentials required | Host with skill install rights; network for upstream install if not vendored; **no** SiteSmith production secrets | — |

## Replication (optional, +15 runs)

| Metric | Estimate | Uncertainty |
| --- | --- | --- |
| Runs | 15 additional | exact if approved |
| Tokens (ceilings) | ≤ 1 800 000 additional | high |
| Wall-clock sequential | ≤ 11.25 h additional | medium |
| Provider / credit cost | **unknown** | cannot claim DKK/$ |

## Evaluators (not included in the 15× arms)

Blind evaluation uses ≥2 independent evaluator contexts. Token/cost **not** included above; budget separately if evaluators are paid model calls.

## What is **not** claimed

- Exact OpenAI / Anthropic / xAI invoice amounts
- That Grok subscription credits equal the token ceilings
- That dry-run consumed paid credits (it must not)

## Approval gate

No screening or replication model calls until explicit user approval of this estimate and fairness freeze.
`;
writeLf(join(h2h, 'COST-ESTIMATE.md'), cost);

const reproduce = `---
title: Reproduce head-to-head freeze
status: frozen
ai_generated: "(C)"
---

# Reproduce freeze (no model calls)

## Refs

- Proof branch: \`codex/v3-direction-engine-proof\` @ \`${proofSha}\`
- Head-to-head branch: \`codex/v3-direction-head-to-head\`
- Pins: \`docs/v3/proof/head-to-head/CANONICAL-SOURCES.json\`
- Packs: \`docs/v3/proof/head-to-head/briefs/*\`
- Manifest: \`docs/v3/proof/head-to-head/RUN-MANIFEST.json\`

## Rebuild freeze artifacts from source briefs

\`\`\`powershell
node tools/freeze-h2h-benchmark.mjs
node tools/dry-run-h2h.mjs
node tools/test-h2h-freeze.mjs
\`\`\`

Re-running freeze **changes hashes** if source briefs change — treat as a new freeze and invalidate prior approval.

## Verify pins without network (local ledger)

\`\`\`powershell
node tools/test-proof-integrity.mjs
\`\`\`

Upstream commit reachability (optional network):

\`\`\`powershell
# examples — informational only
# gh api repos/Leonxlnx/taste-skill/commits/e988add20dab0fa97d7a76781c48961c8184288e --jq .sha
\`\`\`

## After credit approval (not executed at freeze)

1. Confirm \`WORKFLOW-STATE.json\` state is \`AWAITING_CREDIT_APPROVAL\`.
2. User grants credit approval explicitly.
3. Transition to screening; run slots under \`runs/screening/**\` must still have no result payloads.
4. Follow \`FAIRNESS-CONTRACT.md\` and randomized order in \`RUN-MANIFEST.json\`.
`;
writeLf(join(h2h, 'REPRODUCE.md'), reproduce);

// hashes for state
const hashFiles = {
  canonicalSources: sha256File(join(h2h, 'CANONICAL-SOURCES.json')),
  fairnessContract: sha256File(join(h2h, 'FAIRNESS-CONTRACT.md')),
  runManifest: sha256File(join(h2h, 'RUN-MANIFEST.json')),
  outputSchema: sha256File(join(h2h, 'OUTPUT-SCHEMA.json')),
  budgets: sha256File(join(h2h, 'BUDGETS.json')),
  riskRegister: sha256File(join(h2h, 'RISK-REGISTER.md')),
};

const state = {
  workflowVersion: '1.0.0',
  state: 'AWAITING_CREDIT_APPROVAL',
  previousState: 'S3_FREEZE_HEAD_TO_HEAD',
  allowedNextStates: [
    'S4_SCREENING_15_RUNS',
    'BLOCKED_BENCHMARK_NOT_FROZEN',
  ],
  repository: 'byensitmagnus/sitesmith',
  foundationSha: 'dc00598cce2af92435a749856393e287506753bc',
  proofSha,
  headToHeadBranch: 'codex/v3-direction-head-to-head',
  headToHeadSha: null,
  canonicalPinsHash: hashFiles.canonicalSources,
  contextPackHashes: Object.fromEntries(
    Object.entries(briefHashes).map(([id, v]) => [id, v.contextPackHash]),
  ),
  fairnessContractHash: hashFiles.fairnessContract,
  runManifestHash: hashFiles.runManifest,
  outputSchemaHash: hashFiles.outputSchema,
  budgetsHash: hashFiles.budgets,
  gates: {
    G0_repo_truth: 'pass',
    G1_corrective_review: 'pass',
    G2_benchmark_frozen: 'pass',
    credit_approval: 'awaiting',
    paid_model_calls: 0,
  },
  blockers: [],
  lastVerifiedAt: freezeStamp,
  lastTransitionReason:
    'Context packs, arms, fairness, run manifest frozen; dry-run only; no model calls',
  proofStatus: 'PROOF FAILED — DIRECTION QUALITY',
  gate1Review: 'docs/v3/proof/CORRECTIVE-REVIEW-GATE1.md',
  reviewRange: '5ffc2cb..b92cdab',
  arms: arms,
  briefs: briefIds,
  screeningRunsDeclared: 15,
  replicationRunsDeclared: 15,
  paidModelCallsMade: 0,
};
writeLf(join(h2h, 'WORKFLOW-STATE.json'), JSON.stringify(state, null, 2));

const historyLine = JSON.stringify({
  at: freezeStamp,
  state: state.state,
  previousState: state.previousState,
  proofSha,
  reason: state.lastTransitionReason,
  paidModelCallsMade: 0,
});
const histPath = join(h2h, 'STATE-HISTORY.jsonl');
const prev = existsSync(histPath) ? readFileSync(histPath, 'utf8') : '';
writeFileSync(histPath, `${prev.replace(/\s*$/, '')}\n${historyLine}\n`.replace(/^\n/, ''), 'utf8');

// freeze summary for dry-run
writeLf(
  join(h2h, 'FREEZE-SUMMARY.json'),
  JSON.stringify(
    {
      frozenAt: freezeStamp,
      proofSha,
      briefs: briefHashes,
      hashes: hashFiles,
      screeningRuns: 15,
      replicationRuns: 15,
      paidModelCallsMade: 0,
      state: state.state,
    },
    null,
    2,
  ),
);

console.log(JSON.stringify({
  ok: true,
  state: state.state,
  briefs: Object.keys(briefHashes),
  contextPackHashes: state.contextPackHashes,
  hashes: hashFiles,
  paidModelCallsMade: 0,
}, null, 2));
