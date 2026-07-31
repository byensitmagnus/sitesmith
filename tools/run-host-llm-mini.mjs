#!/usr/bin/env node
/**
 * Run creative pass using an inline JSON packet (host LLM), not a remote API key.
 * Usage: node tools/run-host-llm-mini.mjs [path-to-packet.json]
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDirectionEngineAsync } from '../skills/sitesmith/scripts/direction-engine/index.mjs';
import { guardCreativePacket } from '../skills/sitesmith/scripts/direction-engine/evidence-guard.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brief = '01-leather-goods';
const pack = join(root, 'docs/v3/proof/head-to-head/briefs', brief);
const read = (n) => readFileSync(join(pack, n), 'utf8');
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
  randomSeed: `host-llm-inline-${Date.now()}`,
};

const packetPath = process.argv[2]
  || join(root, 'docs/v3/proof/head-to-head/mini-proof/01-leather-goods-host-llm/HOST-PACKET.json');
const packet = JSON.parse(readFileSync(packetPath, 'utf8'));

const hostProvider = async () => ({
  text: JSON.stringify(packet),
  model: 'host-session-llm-inline',
});

const result = await runDirectionEngineAsync({
  input,
  userChoiceBlindId: 'L1',
  randomSeed: input.randomSeed,
  creativePass: 'llm',
  llmProvider: hostProvider,
});

const out = join(root, 'docs/v3/proof/head-to-head/mini-proof/01-leather-goods-host-llm');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'DIRECTION-PACKET.json'), `${JSON.stringify(result.directionPacket, null, 2)}\n`);
writeFileSync(join(out, 'engine-result-meta.json'), `${JSON.stringify({
  ok: result.ok,
  stage: result.stage,
  creative: result.creative,
  proofMeta: result.proofMeta,
}, null, 2)}\n`);
if (result.handoff?.directionMd) writeFileSync(join(out, 'DIRECTION.md'), result.handoff.directionMd);
if (result.designSpec) {
  writeFileSync(join(out, 'DESIGNSPEC.json'), `${JSON.stringify(result.designSpec, null, 2)}\n`);
}

const directGuard = guardCreativePacket(packet, result.input || input);
const summary = {
  method: 'host-session-as-llm-provider',
  note: 'Same creative prompt as creative-llm.mjs; filled by interactive host agent, not separate API key.',
  ok: result.ok,
  llmSucceeded: result.creative?.llmSucceeded ?? false,
  creativePassFallback: result.creative?.creativePassFallback ?? false,
  guard: result.creative?.guard || directGuard,
  thesis: result.directionPacket?.designThesis ?? null,
  signature: result.directionPacket?.signatureElement ?? null,
};
writeFileSync(join(out, 'SUMMARY.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
process.exit(result.ok && summary.llmSucceeded ? 0 : 1);
