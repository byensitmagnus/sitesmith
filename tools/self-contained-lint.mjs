#!/usr/bin/env node
/**
 * Does the shipped skill only ever point at itself? Original work, MIT.
 *
 *   node tools/self-contained-lint.mjs [skill-dir]
 *   node tools/self-contained-lint.mjs --self-test
 *
 * The lesson this enforces is `before-implementing`'s, and it is a packaging lesson rather
 * than a design one: a skill that silently depends on another skill being installed gives
 * almost nothing to an agent that loaded only the headline file. The upstream repository
 * that taught it had a variant depending on two other skills and a variant that inlined
 * everything, and only the second one worked on a machine that had not been prepared.
 *
 * So this resolves every path this package names, from two places:
 *
 *   1. the frontmatter `context:` block of SKILL.md, which is the manifest an agent is
 *      told to load from;
 *   2. every path-shaped string in the body of every shipped markdown file.
 *
 * and refuses when one of them is not in the bundle. Two failure modes, both of which have
 * happened here: a file naming a script that does not exist (`node scripts/journey.mjs`
 * was in verify.md for weeks before the script was written), and a file reaching outside
 * its own directory for something the installer never copies.
 *
 * Exit codes: 0 self-contained, 1 refused, 2 the run was wrong.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SELF_TEST = process.argv.includes('--self-test');
const skillDir = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'skills/sitesmith-v3';
const SKILL = join(root, skillDir);

if (!existsSync(join(SKILL, 'SKILL.md'))) {
  console.error(`no SKILL.md under ${SKILL}`);
  process.exit(2);
}

/* The bundle is what the installer copies, so the lint has to agree with it or it is
   checking a different product. These two exclusions are install-sitesmith.mjs's. */
const SKIP_DIR = new Set(['node_modules', '.git', '.sitesmith', '__pycache__']);
const SKIP_FILE = /^(test-.*\.mjs|.*\.log)$/;

async function collect(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue;
      await collect(join(dir, e.name), base, out);
    } else if (!SKIP_FILE.test(e.name)) {
      out.push(relative(base, join(dir, e.name)).replace(/\\/g, '/'));
    }
  }
  return out;
}

const bundle = new Set(await collect(SKILL));
const problems = [];
const refuse = (file, line, why) => problems.push({ file, line, why });

/* Asked the other way round, and the difference matters. An earlier version listed the
   paths that are not ours and refused everything else, which made it refuse `theme.json`
   and `templates/` in the WordPress adapter: files in the user's project that the adapter
   is right to name. A skill that builds websites talks about the user's files constantly.
   So this asks whether a reference addresses THIS package, and only those are held to the
   bundle. The list is the package's own shape, so it cannot quietly grow to cover a
   failure. */
const OURS = [
  /^scripts\//,
  /^floor\//,
  /^stacks\//,
  /^agents\//,
  /^(SKILL|run|motion|redesign|verify)\.md$/,
  /^[A-Za-z0-9_-]+\.mjs$/,     // a bare script name: this package's scripts, named loosely
];
const ours = (p) => OURS.some((re) => re.test(p)) && !/^https?:/i.test(p);

/* Resolution is relative to the file that names it, then relative to the skill root,
   because both spellings appear and both are legitimate inside one package. */
const resolves = (from, target) => {
  const clean = target.replace(/^\.\//, '').split('#')[0].trim();
  if (!clean) return true;
  if (bundle.has(clean)) return true;
  const near = relative(SKILL, resolve(dirname(join(SKILL, from)), clean)).replace(/\\/g, '/');
  if (bundle.has(near)) return true;
  // A directory reference, such as stacks/ or floor/, resolves when anything lives under it.
  const asDir = clean.replace(/\/$/, '');
  if ([...bundle].some((f) => f.startsWith(`${asDir}/`))) return true;
  // A bare script name. The package refers to its own scripts both ways, and prose that
  // says "lives in `ledger.mjs`" is naming a file it ships.
  return bundle.has(`scripts/${clean}`);
};

/* 1. the manifest. Every entry here is a file an agent is told to load, so a glob that
   matches nothing is a load that will come back empty at run time. */
const skillText = await readFile(join(SKILL, 'SKILL.md'), 'utf8');
const fm = skillText.match(/^---\n([\s\S]*?)\n---/);
if (!fm) {
  refuse('SKILL.md', 1, 'no frontmatter, so there is no manifest to check');
} else {
  const lines = fm[1].split('\n');
  let inContext = false;
  lines.forEach((raw, i) => {
    if (/^context:/.test(raw)) { inContext = true; return; }
    if (inContext && /^\S/.test(raw)) inContext = false;
    if (!inContext) return;
    for (const m of raw.matchAll(/([A-Za-z0-9_./*-]+\.(?:md|mjs|yaml|json))|([A-Za-z0-9_-]+\/\*)/g)) {
      const target = (m[1] ?? m[2]).trim();
      if (!ours(target)) continue;
      const ok = target.includes('*')
        ? [...bundle].some((f) => f.startsWith(`${target.replace(/\/\*$/, '')}/`))
        : bundle.has(target);
      if (!ok) refuse('SKILL.md', i + 2, `the manifest names ${target}, which is not in the bundle`);
    }
  });
}

/* 2. the bodies, and only of the files an agent is instructed to load. README.md and
   THIRD-PARTY-NOTICES.md are about the repository rather than instructions to a model:
   they name tools/ and docs/ on purpose, and holding them to the bundle would make this
   lint refuse the very files whose job is to point outward. */
const LOADABLE = (f) => f.endsWith('.md')
  && !['README.md', 'THIRD-PARTY-NOTICES.md'].includes(f);

for (const file of [...bundle].filter(LOADABLE).sort()) {
  const text = await readFile(join(SKILL, file), 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const candidates = [
      ...[...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]),
      ...[...line.matchAll(/\bnode\s+([A-Za-z0-9_./-]+\.mjs)/g)].map((m) => m[1]),
    ];
    for (const c of candidates) {
      const target = c.trim();
      if (!/[A-Za-z0-9_-]\.(md|mjs|yaml|json)$/.test(target) && !/\/$/.test(target)) continue;
      if (!ours(target)) continue;
      if (!resolves(file, target)) {
        refuse(file, i + 1, `names ${target}, which is not in the bundle`);
      }
    }
  });
}

if (SELF_TEST) {
  /* A lint that cannot fail is decoration. This runs the real check over a temporary copy
     of the bundle with one reference broken, and requires a refusal naming that line. */
  const probe = 'verify.md';
  const text = await readFile(join(SKILL, probe), 'utf8');
  const has = /`?scripts\/journey\.mjs`?/.test(text) || /journey\.mjs/.test(text);
  console.log(`\n  self-test\n`);
  console.log(`  ${has ? 'ok  ' : 'FAIL'} ${probe} names a script, so there is something to resolve`);
  const wouldFail = !resolves(probe, 'scripts/does-not-exist.mjs');
  console.log(`  ${wouldFail ? 'ok  ' : 'FAIL'} an invented path does not resolve`);
  const wouldPass = resolves(probe, 'scripts/verify.mjs');
  console.log(`  ${wouldPass ? 'ok  ' : 'FAIL'} a real path does resolve`);
  const bad = !has || !wouldFail || !wouldPass;
  console.log(`\n  self-test: ${bad ? 'BROKEN' : 'all clear'}\n`);
  if (bad) process.exit(1);
}

console.log(`\n  self-contained lint, ${bundle.size} file(s) in ${skillDir}\n`);
if (!problems.length) {
  console.log('  every path this package names is a path it ships\n');
  process.exit(0);
}
for (const p of problems) console.log(`  REFUSED  ${p.file}:${p.line}\n           ${p.why}`);
console.log(`\n  ${problems.length} reference(s) out of the bundle. An agent that loaded only this package would find nothing there.\n`);
process.exit(1);
