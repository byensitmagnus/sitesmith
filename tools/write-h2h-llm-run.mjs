#!/usr/bin/env node
/**
 * Validate and write an LLM arm's screening artifacts.
 * Usage: node tools/write-h2h-llm-run.mjs <briefId> <arm> <path-to-result.json>
 *
 * result.json shape:
 * {
 *   "nativeMarkdown": "...",
 *   "packet": { ... OUTPUT-SCHEMA fields ... },
 *   "modelCalls": 1,
 *   "method": "..."
 * }
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h2h = join(root, 'docs/v3/proof/head-to-head');
const sources = JSON.parse(readFileSync(join(h2h, 'CANONICAL-SOURCES.json'), 'utf8'));
const schema = JSON.parse(readFileSync(join(h2h, 'OUTPUT-SCHEMA.json'), 'utf8'));

const [briefId, arm, resultPath] = process.argv.slice(2);
if (!briefId || !arm || !resultPath) {
  console.error('Usage: node tools/write-h2h-llm-run.mjs <briefId> <arm> <result.json>');
  process.exit(2);
}

const runId = `screen-${briefId}-${arm}`;
const outDir = join(h2h, 'runs/screening', briefId, arm);
const packCtx = JSON.parse(readFileSync(join(h2h, 'briefs', briefId, 'RUN-CONTEXT.json'), 'utf8'));
const result = JSON.parse(readFileSync(resultPath, 'utf8'));
const packet = result.packet || {};
const missing = schema.requiredFields.filter((f) => packet[f] == null || String(packet[f]).trim() === '');
for (const f of missing) packet[f] = 'unknown';

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'NATIVE.md'), String(result.nativeMarkdown || '').replace(/\r\n/g, '\n'), 'utf8');
writeFileSync(join(outDir, 'NATIVE.json'), `${JSON.stringify({
  kind: `llm-${arm}`,
  method: result.method || arm,
  modelCalls: result.modelCalls ?? 1,
}, null, 2)}\n`, 'utf8');
writeFileSync(join(outDir, 'DIRECTION-PACKET.json'), `${JSON.stringify(packet, null, 2)}\n`, 'utf8');

const finishedAt = new Date().toISOString();
const meta = {
  runId,
  briefId,
  arm,
  status: 'completed',
  startedAt: result.startedAt || finishedAt,
  finishedAt,
  modelCalls: result.modelCalls ?? 1,
  method: result.method || `isolated-llm-${arm}`,
  armCommit: sources.arms[arm]?.commit ?? null,
  contextPackHash: packCtx.contextPackHash,
  packetSha256: createHash('sha256').update(JSON.stringify(packet)).digest('hex'),
  phase: 'screening',
  isolation: 'fresh-subagent-no-peer-outputs',
  model: result.model || 'host-llm-same-class',
};
writeFileSync(join(outDir, 'RUN-META.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
appendFileSync(join(h2h, 'RUN-LEDGER.jsonl'), `${JSON.stringify({
  type: 'run-completed',
  runId,
  briefId,
  arm,
  at: finishedAt,
  modelCalls: meta.modelCalls,
  method: meta.method,
  packetSha256: meta.packetSha256,
})}\n`, 'utf8');

console.log(JSON.stringify({ ok: true, runId, missingFilled: missing, packetSha256: meta.packetSha256 }, null, 2));
