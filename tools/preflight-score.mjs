#!/usr/bin/env node
/**
 * Read a locked blind-review round and print what it says. Original work, MIT.
 *
 *   node tools/preflight-score.mjs --round docs/v2/preflight/round-7
 *
 * The key must already be open, because until it is there is nothing to attach a score to but
 * a label. Reads every CRITIQUE it finds rather than a list written by hand, so a review that
 * was not written cannot be quietly left out of the average.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const round = args[args.indexOf('--round') + 1];
const THRESHOLD = Number(args[args.indexOf('--threshold') + 1]) || 8;
if (!round) { console.error('usage: preflight-score.mjs --round <dir> [--threshold 8]'); process.exit(2); }

const AXES = ['direction', 'specificity', 'type', 'colour', 'assets', 'hierarchy', 'production-readiness'];
const key = JSON.parse(await readFile(join(round, 'KEY.json'), 'utf8'));
const reviewers = (await readdir(join(round, 'reviews'), { withFileTypes: true }))
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();

const score = (text, axis) => {
  const m = text.match(new RegExp('^' + axis + ':\\s*(\\d+)\\s*$', 'm'));
  return m ? Number(m[1]) : null;
};

const head = 'label      subject     rev ' + AXES.map((a) => a.slice(0, 5).padStart(6)).join('') + '    mean';
console.log('\n' + head);
console.log('-'.repeat(head.length));

const perLabel = {};
for (const label of Object.keys(key.assignment).sort()) {
  for (const rev of reviewers) {
    const file = join(round, 'reviews', rev, label, `CRITIQUE-${rev}.md`);
    const text = await readFile(file, 'utf8').catch(() => null);
    if (text === null) { console.log(`${label}  ${rev}  MISSING`); continue; }
    const s = AXES.map((a) => score(text, a));
    if (s.some((v) => v === null)) {
      console.log(`${label.padEnd(11)}${key.assignment[label].subject.padEnd(12)}${rev.padEnd(4)}` +
        `  incomplete: no ${AXES.filter((_, i) => s[i] === null).join(', ')}`);
      continue;
    }
    const mean = s.reduce((a, b) => a + b, 0) / s.length;
    (perLabel[label] ??= []).push(mean);
    console.log(`${label.padEnd(11)}${key.assignment[label].subject.padEnd(12)}${rev.padEnd(4)}` +
      s.map((v) => String(v).padStart(6)).join('') + '    ' + mean.toFixed(2));
  }
}

console.log();
const means = [];
for (const [label, list] of Object.entries(perLabel)) {
  const m = list.reduce((a, b) => a + b, 0) / list.length;
  means.push(m);
  const spread = Math.max(...list) - Math.min(...list);
  console.log(`  ${label}  ${key.assignment[label].subject.padEnd(10)} ${m.toFixed(2)} / 10` +
    `   ${m >= THRESHOLD ? 'meets' : 'below'} ${THRESHOLD}` +
    `   reviewers ${spread.toFixed(2)} apart`);
}
const portfolio = means.reduce((a, b) => a + b, 0) / means.length;
console.log(`\n  portfolio mean ${portfolio.toFixed(2)} / 10 against a threshold of ${THRESHOLD}`);
console.log(`  ${means.filter((m) => m >= THRESHOLD).length} of ${means.length} meet it\n`);
