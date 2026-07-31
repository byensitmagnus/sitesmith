#!/usr/bin/env node
/**
 * Mini proof: one brief through orchestrator creative pass.
 * Usage:
 *   node tools/run-creative-mini-proof.mjs [--creative rules|llm] [--brief 01-leather-goods]
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDirectionEngine, runDirectionEngineAsync } from '../skills/sitesmith/scripts/direction-engine/index.mjs';
import { loadEnvFiles, hasCreativeApiKey } from './load-env.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
loadEnvFiles(root);
const args = process.argv.slice(2);
const flag = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : null;
};
const creative = flag('--creative') || (hasCreativeApiKey() ? 'llm' : 'rules');
const briefId = flag('--brief') || '01-leather-goods';
const packDir = join(root, 'docs/v3/proof/head-to-head/briefs', briefId);
const outDir = join(root, 'docs/v3/proof/head-to-head/mini-proof', `${briefId}-${creative}`);

const read = (n) => readFileSync(join(packDir, n), 'utf8');
const ctx = JSON.parse(read('RUN-CONTEXT.json'));
const input = {
  brief: read('BRIEF.md'),
  evidence: read('EVIDENCE.md'),
  brand: read('BRAND.md'),
  assetPlan: read('ASSET-PLAN.md'),
  assetManifest: read('ASSET-MANIFEST.md'),
  userConstraints: read('CONSTRAINTS.md'),
  mode: ctx.mode,
  stack: ctx.stack,
  projectName: ctx.projectName,
  randomSeed: `mini-${creative}-${ctx.randomSeed}`,
};

const opts = {
  input,
  userChoiceBlindId: 'L1',
  randomSeed: input.randomSeed,
  creativePass: creative,
};

const result = creative === 'llm'
  ? await runDirectionEngineAsync(opts)
  : runDirectionEngine(opts);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'engine-result.json'), `${JSON.stringify(result, null, 2)}\n`);
if (result.directionPacket) {
  writeFileSync(join(outDir, 'DIRECTION-PACKET.json'), `${JSON.stringify(result.directionPacket, null, 2)}\n`);
}
if (result.handoff?.directionMd) writeFileSync(join(outDir, 'DIRECTION.md'), result.handoff.directionMd);
if (result.designSpec) {
  writeFileSync(join(outDir, 'DESIGNSPEC.json'), `${JSON.stringify(result.designSpec, null, 2)}\n`);
}

const summary = {
  briefId,
  creative,
  ok: result.ok,
  stage: result.stage,
  creativeMeta: result.creative,
  thesis: result.directionPacket?.designThesis ?? null,
  signature: result.directionPacket?.signatureElement ?? null,
  outDir: outDir.replace(root + '\\', '').replace(root + '/', ''),
};
writeFileSync(join(outDir, 'SUMMARY.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
process.exit(result.ok ? 0 : 1);
