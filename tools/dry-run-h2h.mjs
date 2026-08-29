#!/usr/bin/env node
/**
 * Dry-run head-to-head harness validation.
 * MUST NOT call models, generate packets, or create scores.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
const problems = [];
const ok = (m) => console.log(`ok  ${m}`);
const fail = (m) => {
  problems.push(m);
  console.error(`FAIL ${m}`);
};

function sha256File(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

const requiredRoot = [
  'CANONICAL-SOURCES.json',
  'FAIRNESS-CONTRACT.md',
  'OUTPUT-SCHEMA.json',
  'RUN-MANIFEST.json',
  'RUN-LEDGER.jsonl',
  'WORKFLOW-STATE.json',
  'STATE-HISTORY.jsonl',
  'COST-ESTIMATE.md',
  'REPRODUCE.md',
  'RISK-REGISTER.md',
  'BUDGETS.json',
  'FREEZE-SUMMARY.json',
];

for (const f of requiredRoot) {
  if (!existsSync(join(h2h, f))) fail(`missing ${f}`);
  else ok(`path ${f}`);
}

const state = JSON.parse(readFileSync(join(h2h, 'WORKFLOW-STATE.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(h2h, 'RUN-MANIFEST.json'), 'utf8'));
const sources = JSON.parse(readFileSync(join(h2h, 'CANONICAL-SOURCES.json'), 'utf8'));
const schema = JSON.parse(readFileSync(join(h2h, 'OUTPUT-SCHEMA.json'), 'utf8'));
const pinsFile = JSON.parse(
  readFileSync(join(root, 'docs/v3/CANONICAL-UPSTREAM-PINS.json'), 'utf8'),
);

const expectedCommits = {
  'taste-skill': 'e988add20dab0fa97d7a76781c48961c8184288e',
  'ui-ux-pro-max': '4857a2c5ef989794751a0f66b8545a4a49566286',
  'frontend-design': 'b29e7cf65e5cb78a5ac33d582270551bc74a14eb',
  impeccable: '6b342244e915d64b0d6e84d5eec448fd196ce6bb',
  sitesmith: 'b92cdabad98c4d23ff79b74d6881e6b7129325a4',
};

for (const [arm, sha] of Object.entries(expectedCommits)) {
  const got = sources.arms?.[arm]?.commit;
  if (got !== sha) fail(`arm ${arm} commit ${got} != ${sha}`);
  else ok(`commit ${arm}`);
}

for (const [k, sha] of Object.entries(pinsFile.pins)) {
  const key = k;
  if (sources.arms[key]?.commit !== sha) fail(`sources vs CANONICAL-UPSTREAM-PINS ${k}`);
  else ok(`pin file match ${k}`);
}

const briefIds = [
  '01-leather-goods',
  '02-atelier-printworks',
  '03-passage-console',
];
const packFiles = [
  'BRIEF.md',
  'EVIDENCE.md',
  'BRAND.md',
  'ASSET-PLAN.md',
  'ASSET-MANIFEST.md',
  'CONSTRAINTS.md',
  'RUN-CONTEXT.json',
];

for (const id of briefIds) {
  const dir = join(h2h, 'briefs', id);
  for (const f of packFiles) {
    if (!existsSync(join(dir, f))) fail(`pack missing ${id}/${f}`);
  }
  const ctx = JSON.parse(readFileSync(join(dir, 'RUN-CONTEXT.json'), 'utf8'));
  if (ctx.contextPackHash !== manifest.briefs[id]?.contextPackHash) {
    fail(`context hash mismatch manifest vs RUN-CONTEXT ${id}`);
  } else ok(`context hash ${id}`);
  const parts = packFiles
    .filter((f) => f !== 'RUN-CONTEXT.json')
    .map((f) => `${f}\0${readFileSync(join(dir, f), 'utf8')}`);
  const recomputed = createHash('sha256').update(parts.join('\n'), 'utf8').digest('hex');
  if (recomputed !== ctx.contextPackHash) fail(`recomputed pack hash ${id}`);
  else ok(`recomputed pack hash ${id}`);
}

if (manifest.screeningRuns?.length !== 15) fail(`screening runs ${manifest.screeningRuns?.length}`);
else ok('15 screening slots declared');
if (manifest.replicationRuns?.length !== 15) fail(`replication runs ${manifest.replicationRuns?.length}`);
else ok('15 replication slots declared');
if (manifest.randomizedScreeningOrder?.length !== 15) fail('random order length');
else ok('randomized plan length 15');

const orderIds = new Set(manifest.randomizedScreeningOrder.map((r) => r.runId));
const runIds = new Set(manifest.screeningRuns.map((r) => r.runId));
if (orderIds.size !== 15 || [...orderIds].some((id) => !runIds.has(id))) {
  fail('random order not a permutation of screening runs');
} else ok('random order is full permutation');

for (const r of manifest.screeningRuns) {
  const dir = join(root, r.outputDir);
  if (!existsSync(dir)) fail(`missing slot dir ${r.outputDir}`);
  const all = readdirSync(dir);
  for (const n of all) {
    if (n === '.gitkeep') continue;
    if (/\.(json|md)$/i.test(n) && /result|score|direction|packet|eval/i.test(n)) {
      fail(`result present before credit approval: ${r.outputDir}/${n}`);
    }
  }
  if (r.resultPresent) fail(`resultPresent true for ${r.runId}`);
  if (r.modelCallsAllowed) fail(`modelCallsAllowed true for ${r.runId}`);
  if (r.status !== 'declared-not-started') fail(`status ${r.runId}=${r.status}`);
}
ok('no screening results present');

if (state.state !== 'AWAITING_CREDIT_APPROVAL') {
  fail(`state is ${state.state}, want AWAITING_CREDIT_APPROVAL`);
} else ok('state AWAITING_CREDIT_APPROVAL');

if (state.paidModelCallsMade !== 0) fail('paidModelCallsMade != 0');
else ok('paidModelCallsMade 0');

if (!/PROOF FAILED/.test(state.proofStatus || '')) fail(`proofStatus ${state.proofStatus}`);
else ok('proof status still failed');

const requiredFields = schema.requiredFields || [];
for (const field of [
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
]) {
  if (!requiredFields.includes(field)) fail(`schema missing ${field}`);
}
ok('output schema fields complete');

const fairnessHash = sha256File(join(h2h, 'FAIRNESS-CONTRACT.md'));
const manifestHash = sha256File(join(h2h, 'RUN-MANIFEST.json'));
const sourcesHash = sha256File(join(h2h, 'CANONICAL-SOURCES.json'));
if (state.fairnessContractHash && state.fairnessContractHash !== fairnessHash) {
  fail('state fairnessContractHash stale');
} else ok('fairness hash matches state');
if (state.runManifestHash && state.runManifestHash !== manifestHash) {
  fail('state runManifestHash stale');
} else ok('runManifest hash matches state');
if (state.canonicalPinsHash && state.canonicalPinsHash !== sourcesHash) {
  fail('state canonicalPinsHash stale');
} else ok('canonical sources hash matches state');

for (const briefId of briefIds) {
  const hashes = manifest.screeningRuns
    .filter((r) => r.briefId === briefId)
    .map((r) => r.contextPackHash);
  if (new Set(hashes).size !== 1) fail(`arms disagree on context hash for ${briefId}`);
  else ok(`identical context hash across 5 arms for ${briefId}`);
}

const report = {
  dryRun: true,
  at: new Date().toISOString(),
  paidModelCallsMade: 0,
  modelCallsAttempted: 0,
  packetsGenerated: 0,
  scoresGenerated: 0,
  problems,
  ok: problems.length === 0,
  state: state.state,
  screeningSlots: 15,
  randomizedOrderSample: manifest.randomizedScreeningOrder.slice(0, 3),
  contextPackHashes: state.contextPackHashes,
  hashes: {
    canonicalSources: sourcesHash,
    fairnessContract: fairnessHash,
    runManifest: manifestHash,
  },
};

writeFileSync(join(h2h, 'DRY-RUN-REPORT.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (problems.length) {
  console.error(`\ndry-run FAILED (${problems.length})`);
  process.exit(1);
}
console.log('\ndry-run PASS — no model calls, freeze valid');
console.log(JSON.stringify({
  state: state.state,
  paidModelCallsMade: 0,
  screeningSlots: 15,
}, null, 2));
