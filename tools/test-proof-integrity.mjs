#!/usr/bin/env node
/** Canonical upstream pins + proof summary vs run consistency. */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDirectionEngine } from '../skills/sitesmith/scripts/direction-engine/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;
const ok = (m) => console.log(`ok  ${m}`);
const fail = (m) => {
  failed += 1;
  console.error(`FAIL ${m}`);
};

const pins = JSON.parse(readFileSync(join(root, 'docs/v3/CANONICAL-UPSTREAM-PINS.json'), 'utf8'));
const ledger = JSON.parse(readFileSync(join(root, 'docs/v3/UPSTREAM-CAPABILITY-LEDGER.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'docs/v2/CAPABILITY-MANIFEST.json'), 'utf8'));
const comparison = readFileSync(join(root, 'docs/v3/proof/UPSTREAM-COMPARISON.md'), 'utf8');
const foundation = readFileSync(join(root, 'docs/v3/FOUNDATION-DECISION.md'), 'utf8');

// 6. pins match ledger
for (const [name, sha] of Object.entries(pins.pins)) {
  const hit = (ledger.frozenSources ?? []).some((s) => (s.sourceCommit ?? s.commit) === sha)
    || (ledger.capabilities ?? []).some((c) => c.sourceCommit === sha);
  if (!hit) fail(`ledger missing pin ${name}=${sha}`);
  else ok(`ledger has ${name}`);
}

// CAPABILITY-MANIFEST competitors
const map = {
  'taste-skill': pins.pins['taste-skill'],
  'ui-ux-pro-max': pins.pins['ui-ux-pro-max'],
  'frontend-design': pins.pins['frontend-design'],
  'impeccable': pins.pins.impeccable,
};
for (const [k, sha] of Object.entries(map)) {
  if (manifest.competitors?.[k]?.sha !== sha) fail(`CAPABILITY-MANIFEST ${k} is ${manifest.competitors?.[k]?.sha} want ${sha}`);
  else ok(`manifest ${k}`);
}

for (const sha of Object.values(pins.pins)) {
  if (!comparison.includes(sha)) fail(`UPSTREAM-COMPARISON missing ${sha}`);
  if (!foundation.includes(sha.slice(0, 12)) && !foundation.includes(sha)) {
    // foundation may use short links
    if (!foundation.includes(sha.slice(0, 7))) fail(`FOUNDATION missing pin ${sha}`);
    else ok(`foundation has short ${sha.slice(0, 7)}`);
  } else ok(`comparison/foundation has ${sha.slice(0, 7)}`);
}

// No stale pins
const stale = ['2235be7c60b551f5de82ade908fd3816455afcda', '1cf7d7ab0f1ac0bb3319fd20be389a3009f4037d'];
for (const s of stale) {
  const files = [
    'docs/v2/CAPABILITY-MANIFEST.json',
    'docs/v3/proof/UPSTREAM-COMPARISON.md',
    'docs/v3/CANONICAL-UPSTREAM-PINS.json',
    'docs/v3/FOUNDATION-DECISION.md',
  ];
  for (const f of files) {
    const t = readFileSync(join(root, f), 'utf8');
    if (t.includes(s)) fail(`stale pin ${s} still in ${f}`);
  }
}
ok('no stale frontend/impeccable pins in lock files');

// Summaries match runs
const direction = JSON.parse(readFileSync(join(root, 'docs/v3/proof/DIRECTION-RESULTS.json'), 'utf8'));
for (const r of direction.results ?? []) {
  const engPath = join(root, 'docs/v3/proof/runs', r.brief, 'engine-result.json');
  if (!existsSync(engPath)) {
    fail(`missing run ${r.brief}`);
    continue;
  }
  const eng = JSON.parse(readFileSync(engPath, 'utf8'));
  const sumIds = (r.cards ?? []).map((c) => c.worldId).join(',');
  const engIds = (eng.direction?.cards ?? []).map((c) => c.worldId).join(',');
  if (sumIds !== engIds) fail(`${r.brief} summary cards ${sumIds} != eng ${engIds}`);
  else ok(`${r.brief} summary matches run`);
  if (!eng.proofMeta?.inputHash) fail(`${r.brief} missing proofMeta.inputHash`);
  if (!eng.proofMeta?.policyVersion) fail(`${r.brief} missing proofMeta.policyVersion`);
  if (eng.critic?.independence === 'context-isolated' && !eng.critic?.externalRunEvidence) {
    fail(`${r.brief} claims context-isolated without external evidence`);
  }
}

// Live regenerate hash equality for leather (deterministic)
const briefDir = join(root, 'docs/v3/proof/briefs/01-leather-goods');
const meta = JSON.parse(readFileSync(join(briefDir, 'engine-input.json'), 'utf8'));
const readMd = (n) => readFileSync(join(briefDir, n), 'utf8');
const input = {
  brief: readMd('BRIEF.md'),
  evidence: readMd('EVIDENCE.md'),
  brand: readMd('BRAND.md'),
  assetPlan: readMd('ASSET-PLAN.md'),
  assetManifest: readMd('ASSET-MANIFEST.md'),
  mode: meta.mode,
  stack: meta.stack,
  projectName: meta.projectName,
  randomSeed: meta.randomSeed,
};
const live = runDirectionEngine({ input, userChoiceBlindId: 'L1', randomSeed: meta.randomSeed });
const committed = JSON.parse(readFileSync(join(root, 'docs/v3/proof/runs/01-leather-goods/engine-result.json'), 'utf8'));
if (live.proofMeta?.inputHash !== committed.proofMeta?.inputHash) {
  fail('live inputHash != committed (re-run regenerate-proof-summaries)');
} else ok('live inputHash matches committed leather run');

if (failed) {
  console.error(`\nproof integrity FAILED (${failed})`);
  process.exit(1);
}
console.log('\nproof integrity PASS');
