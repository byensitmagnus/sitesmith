#!/usr/bin/env node
/**
 * Runs the interaction journeys. Original work, MIT.
 *
 *   node scripts/journey.mjs journeys/ --base http://localhost:5173
 *
 * A thin runner. Each journey is a plain script that drives the page and exits non-zero on
 * failure, so a single one can be run directly with `node journeys/x.spec.mjs` while it is
 * being written. This exists so the production gate has one command to call.
 */

import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--')) ?? 'journeys';
const base = (() => { const i = args.indexOf('--base'); return i >= 0 ? args[i + 1] : 'http://localhost:5173'; })();

const files = (await readdir(dir).catch(() => {
  console.error(`no ${dir}/ directory. A site with no journey has not been tested for behaviour.`);
  process.exit(2);
})).filter((f) => f.endsWith('.spec.mjs')).sort();

if (!files.length) {
  console.error(`no *.spec.mjs in ${dir}/. See v2/40-interaction.md for what one contains.`);
  process.exit(1);
}

console.log(`\n  journeys — ${files.length} against ${base}\n`);
let failed = 0;

for (const f of files) {
  const started = Date.now();
  const r = spawnSync(process.execPath, [resolve(join(dir, f))], {
    encoding: 'utf8', env: { ...process.env, BASE: base }, timeout: 120000,
  });
  const ms = Date.now() - started;
  const out = ((r.stdout ?? '') + (r.stderr ?? '')).trim();
  if (r.status === 0) {
    console.log(`  ok    ${f.padEnd(38)} ${ms}ms`);
  } else {
    failed++;
    console.log(`  FAIL  ${f.padEnd(38)} ${ms}ms${r.signal ? ` (${r.signal})` : ''}`);
    for (const line of out.split('\n')) console.log(`        ${line}`);
  }
}

console.log(`\n  ${failed ? `${failed} of ${files.length} failed` : `${files.length} passed`}\n`);
process.exit(failed ? 1 : 0);
