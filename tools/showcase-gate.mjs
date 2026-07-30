#!/usr/bin/env node
/**
 * Re-run every portfolio named by gallery/showcase.json and require the rendered verdict to
 * match the public status. Original work, MIT.
 *
 *   node tools/showcase-gate.mjs --base http://localhost:4321 --out /tmp/showcase
 *
 * Run from benchmarks/ so its Playwright installation is available to the underlying gate.
 */

import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const value = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : fallback;
};
const base = value('--base', 'http://localhost:4321').replace(/\/$/, '');
const out = resolve(value('--out', join(ROOT, '.sitesmith/showcase-gate')));
const manifestPath = resolve(value('--manifest', join(ROOT, 'gallery/showcase.json')));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const gate = join(ROOT, 'skills/sitesmith/scripts/portfolio-diversity.mjs');
const problems = [];

console.log('\n  showcase gate\n');

for (const group of manifest.groups ?? []) {
  const urls = group.cases.map((path) => `${base}/${path}/`);
  const labels = group.cases.map((path) => path.split('/')[0].replace(/^\d+-/, '')).join(',');
  const result = spawnSync(process.execPath,
    [gate, ...urls, '--labels', labels, '--out', join(out, group.id)],
    { cwd: process.cwd(), encoding: 'utf8', timeout: 180000 });
  const actual = result.status === 0 ? 'pass' : result.status === 1 ? 'fail' : 'error';
  const expected = group.portfolioDiversity;

  console.log(`  ${group.id.padEnd(18)} expected ${expected}, rendered ${actual}`);
  if (actual !== expected) {
    problems.push(`${group.id}: expected portfolio diversity ${expected}, rendered ${actual}`);
    if (result.stdout) console.log(result.stdout);
    if (result.stderr) console.log(result.stderr);
  }
}

if (manifest.status === 'reset' && manifest.approved.length) {
  problems.push('reset status cannot carry approved showcase cases');
}
if (manifest.status === 'ready') {
  if (manifest.approved.length < manifest.target) {
    problems.push(`ready status needs ${manifest.target} approved cases, found ${manifest.approved.length}`);
  }
  const passingCases = new Set((manifest.groups ?? [])
    .filter((group) => group.portfolioDiversity === 'pass' && group.individualReview === 'pass')
    .flatMap((group) => group.cases));
  for (const path of manifest.approved) {
    if (!passingCases.has(path)) problems.push(`approved case is not in a passing portfolio: ${path}`);
  }
}

for (const problem of problems) console.log(`  FAIL  ${problem}`);
console.log(`\n  ${problems.length ? `FAIL - ${problems.length} problem(s)` : 'PASS - public status matches rendered portfolios'}\n`);
process.exit(problems.length ? 1 : 0);
