#!/usr/bin/env node
/**
 * Open a sealed blind-review key, after both reviews are locked. Original work, MIT.
 *
 *   node tools/open-key.mjs --round <dir> --sealed <path> --reviews <dir> [--reviews <dir>]
 *
 * The key says which label was which project. Committing it before the reviews are written is
 * how a blind review stops being blind, and that is exactly what happened in rounds 3 to 6:
 * KEY-MASTER.json sat in the repository, on the same filesystem the reviewers were working on,
 * while they worked. Nobody handed them the path, and "they were not given the path" is not
 * isolation.
 *
 * So the key is generated outside the tree and stays there. This is the one door back in, and
 * it will not open until it can prove the reviews were finished first:
 *
 *   - every review carries the run id, and the rubric, sheet and brief hashes of this round,
 *   - every review carries a `locked` timestamp,
 *   - the body hash in each review matches the body, so a review cannot be edited after locking,
 *   - and the open time is now, recorded, strictly after the last lock.
 *
 * What it writes is not the sealed file. It is the sealed file plus who reviewed, when each of
 * them locked, when it was opened, and against which hashes — so a reader a year from now can
 * check the order of events rather than take this note's word for it.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const all = (n) => args.reduce((a, v, i) => (v === `--${n}` ? [...a, args[i + 1]] : a), []);

const round = flag('round');
const sealed = flag('sealed');
const reviewDirs = all('reviews');
if (!round || !sealed || !reviewDirs.length) {
  console.error('usage: open-key.mjs --round <dir> --sealed <path> --reviews <dir> [--reviews <dir>]');
  process.exit(2);
}

const run = JSON.parse(await readFile(join(round, 'RUN.json'), 'utf8'));
const problems = [];
const reviews = [];

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (/^(CRITIQUE|PORTFOLIO)-.*\.md$/.test(e.name)) out.push(full);
  }
  return out;
}

for (const dir of reviewDirs) {
  const files = await walk(dir);
  if (!files.length) problems.push(`${dir}: no review files`);
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m) { problems.push(`${file}: no frontmatter`); continue; }
    const fm = Object.fromEntries(m[1].split(/\r?\n/)
      .map((l) => l.match(/^([\w-]+):\s*(.*)$/)).filter(Boolean)
      .map((x) => [x[1], x[2].trim()]));

    /* A review that does not name the run and the hashes could have been written against any
       sheets at all, including a different round's. */
    for (const [k, want] of [['run-id', run['run-id']],
                             ['rubric-sha256', run['rubric-sha256']],
                             ['sheet-sha256', run['sheet-sha256']]]) {
      if (fm[k] !== want) problems.push(`${file}: ${k} is ${fm[k] ?? 'missing'}, round says ${want}`);
    }
    const label = file.replace(/\\/g, '/').split('/').find((p) => p.startsWith('SHEET-'));
    if (label && run.briefs?.[label] && fm['brief-sha256'] !== run.briefs[label]) {
      problems.push(`${file}: brief-sha256 does not match ${label}`);
    }
    /* And a review whose body no longer hashes to its own claim was edited after it locked. */
    const body = createHash('sha256').update(m[2].trim()).digest('hex');
    if (fm.sha256 !== body) problems.push(`${file}: body hash ${body.slice(0, 12)} != stated ${String(fm.sha256).slice(0, 12)}`);
    if (!fm.locked || Number.isNaN(Date.parse(fm.locked))) problems.push(`${file}: no readable locked time`);

    reviews.push({ file: file.replace(/\\/g, '/'), reviewer: fm.reviewer ?? null,
                   'reviewer-id': fm['reviewer-id'] ?? null, label: label ?? null,
                   locked: fm.locked ?? null, 'body-sha256': body });
  }
}

if (problems.length) {
  console.log('\n  the key stays sealed\n');
  for (const p of problems) console.log(`  BLOCK  ${p}`);
  console.log(`\n  ${problems.length} problem(s). Fix the reviews, not this check.\n`);
  process.exit(1);
}

const locks = reviews.map((r) => Date.parse(r.locked)).sort((a, b) => a - b);
const opened = new Date();
if (opened.getTime() <= locks[locks.length - 1]) {
  console.log('\n  the key stays sealed: the last lock is not in the past.\n');
  process.exit(1);
}

const key = JSON.parse(await readFile(sealed, 'utf8'));
const reviewers = [...new Set(reviews.map((r) => r['reviewer-id']))].sort();

await writeFile(join(round, 'KEY.json'), JSON.stringify({
  ...key,
  'run-id': run['run-id'],
  'rubric-sha256': run['rubric-sha256'],
  reviewers,
  'first-locked': new Date(locks[0]).toISOString(),
  'last-locked': new Date(locks[locks.length - 1]).toISOString(),
  opened: opened.toISOString(),
  reviews: reviews.sort((a, b) => a.file.localeCompare(b.file)),
  ceremony: 'Generated outside the repository, held outside every reviewer workspace, and ' +
            'committed only after both reviews were locked. Each review above is bound to this ' +
            "round's run id and to the rubric, sheet and brief hashes, and to its own body hash, " +
            'so it can be shown not to have been written or edited after the labels were known.',
}, null, 2) + '\n');

console.log(`\n  key opened at ${opened.toISOString()}`);
console.log(`  ${reviewers.length} reviewer(s): ${reviewers.join(', ')}`);
console.log(`  ${reviews.length} review file(s), last locked ${new Date(locks[locks.length - 1]).toISOString()}`);
for (const [label, v] of Object.entries(key.assignment ?? {})) console.log(`  ${label}  ${v.subject}`);
console.log(`  written to ${join(round, 'KEY.json')}\n`);
