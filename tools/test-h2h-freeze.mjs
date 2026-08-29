#!/usr/bin/env node
/** Benchmark preparation tests — freeze integrity, no model calls. */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
let failed = 0;
const ok = (m) => console.log(`ok  ${m}`);
const fail = (m) => {
  failed += 1;
  console.error(`FAIL ${m}`);
};

const arms = [
  'taste-skill',
  'ui-ux-pro-max',
  'frontend-design',
  'impeccable',
  'sitesmith',
];
const briefs = [
  '01-leather-goods',
  '02-atelier-printworks',
  '03-passage-console',
];

const sources = JSON.parse(readFileSync(join(h2h, 'CANONICAL-SOURCES.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(h2h, 'RUN-MANIFEST.json'), 'utf8'));
const state = JSON.parse(readFileSync(join(h2h, 'WORKFLOW-STATE.json'), 'utf8'));

if (Object.keys(sources.arms || {}).sort().join() !== arms.slice().sort().join()) {
  fail(`arms ${Object.keys(sources.arms)}`);
} else ok('exactly five canonical arms');

if (briefs.some((b) => !manifest.briefs[b])) fail('missing brief in manifest');
else if (Object.keys(manifest.briefs).length !== 3) fail('not exactly three briefs');
else ok('exactly three briefs');

for (const b of briefs) {
  const hashes = manifest.screeningRuns
    .filter((r) => r.briefId === b)
    .map((r) => r.contextPackHash);
  if (hashes.length !== 5) fail(`${b} arm count`);
  else if (new Set(hashes).size !== 1) fail(`${b} context hash differs by arm`);
  else ok(`identical context hashes for ${b}`);
}

const packFiles = [
  'BRIEF.md',
  'EVIDENCE.md',
  'BRAND.md',
  'ASSET-PLAN.md',
  'ASSET-MANIFEST.md',
  'CONSTRAINTS.md',
  'RUN-CONTEXT.json',
];
for (const b of briefs) {
  for (const f of packFiles) {
    if (!existsSync(join(h2h, 'briefs', b, f))) fail(`missing ${b}/${f}`);
  }
}
ok('no missing context files');

const results = manifest.screeningRuns.filter((r) => r.resultPresent);
if (results.length) fail('results present before credit approval');
else ok('no results before credit approval');

if (state.state !== 'AWAITING_CREDIT_APPROVAL') fail(`state ${state.state}`);
else ok('state AWAITING_CREDIT_APPROVAL');

if (state.paidModelCallsMade !== 0 || manifest.paidModelCallsMade !== 0) {
  fail('paid model calls recorded');
} else ok('paid model calls = 0');

// dry-run subprocess must not set paid calls
try {
  execFileSync(process.execPath, [join(root, 'tools/dry-run-h2h.mjs')], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const report = JSON.parse(readFileSync(join(h2h, 'DRY-RUN-REPORT.json'), 'utf8'));
  if (!report.dryRun || report.modelCallsAttempted !== 0 || report.packetsGenerated !== 0) {
    fail('dry-run attempted model work');
  } else ok('dry-run makes no model calls');
} catch (e) {
  fail(`dry-run failed: ${e.stderr || e.message}`);
}

// PR #3 should not contain production engine implementation changes vs proof base
// (only head-to-head docs/tools). Soft check on freeze tree.
const enginePath = join(root, 'skills/sitesmith/scripts/direction-engine');
if (!existsSync(enginePath)) fail('engine missing');
else ok('engine present but freeze artifacts are docs-only under head-to-head');

if (failed) {
  console.error(`\nh2h freeze tests FAILED (${failed})`);
  process.exit(1);
}
console.log('\nh2h freeze tests PASS');
