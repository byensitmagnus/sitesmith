#!/usr/bin/env node
/**
 * The source-coverage gate. Original work, MIT.
 *
 *   node tools/source-coverage.mjs            # refuse on any gap
 *   node tools/source-coverage.mjs --json     # the same verdict as data
 *
 * The requirement this enforces, in one sentence: a source that was analysed has to change
 * the product, and "we read it and credited it" is not a change.
 *
 * So this refuses when a required source has no mechanism, has no path into a file that
 * ships, has no proof anyone can run, has no licence recorded, has no attribution, or is
 * registered only as research or inspiration. It also refuses when a path or a proof names
 * a file that is not there, because a register that drifts from the tree is a register that
 * reports coverage it does not have. That last check is the one that will fail most often
 * and it is the reason this file exists rather than a checklist in a document.
 *
 * What it deliberately does not do: weigh the sources against each other. Contribution is
 * meant to be proportional to strength, and a script cannot tell whether one line in
 * run.md is a bigger contribution than four in a stack adapter. That judgement is in
 * SOURCE-CONTRIBUTIONS.json's prose and in the final report, where a person can argue
 * with it.
 *
 * Exit codes match the rest of the package: 0 covered, 1 refused, 2 the run was wrong.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTER = join(root, 'SOURCE-CONTRIBUTIONS.json');
const JSON_OUT = process.argv.includes('--json');

/* The list is here rather than in the register, on purpose. If the register were also the
   list of what must be in the register, deleting a row would make the gate pass. */
const REQUIRED = [
  'sitesmith-v2',
  'frontend-design',
  'taste-skill',
  'ui-ux-pro-max',
  'impeccable',
  'scroll-world',
  'remotion-skills',
  'framer-motion',
  'ponytail',
  'ai-website-cloner-template',
  'website-builder-setup',
  'agency-agents',
  'ruflo',
  'awesome-claude-code-subagents',
  'ai-dev-tasks',
  'graph-engineering',
  'before-implementing',
  'agent-elements-21st',
  'magic-21st',
];

const INTEGRATION = new Set(['ADOPTED', 'ADAPTED', 'CLEAN_ROOM']);

/* Words that describe having looked at something rather than having used it. A row whose
   integration or loadedWhen is one of these is the exact failure the requirement names. */
const RESEARCH_ONLY = /^(research|research-only|inspiration|inspired|considered|reviewed|noted|credited)$/i;

if (!existsSync(REGISTER)) {
  console.error(`no SOURCE-CONTRIBUTIONS.json at ${REGISTER}.`);
  console.error('Generate the skeleton with: node tools/build-source-contributions.mjs --write');
  process.exit(2);
}

const doc = JSON.parse(await readFile(REGISTER, 'utf8'));
const rows = doc.sources ?? [];
const byId = new Map(rows.map((r) => [r.source, r]));

const refusals = [];
const refuse = (source, why) => refusals.push({ source, why });

for (const id of REQUIRED) {
  const r = byId.get(id);
  if (!r) {
    refuse(id, 'required by the product brief and absent from the register');
    continue;
  }

  if (!r.license) refuse(id, 'no licence recorded, so redistribution is unaudited');
  if (!r.attributionPath) {
    refuse(id, 'no attributionPath, so the credit this licence requires is not carried anywhere');
  } else if (!existsSync(join(root, r.attributionPath))) {
    refuse(id, `attributionPath "${r.attributionPath}" does not exist`);
  }

  if (!INTEGRATION.has(r.integration)) {
    refuse(id, `integration is ${JSON.stringify(r.integration)}; expected one of ADOPTED, ADAPTED, CLEAN_ROOM`);
  }

  if (!r.mechanismsUsed?.length) {
    refuse(id, 'mechanismsUsed is empty: this source was analysed and changed nothing');
  }

  if (!r.sitesmithPaths?.length) {
    refuse(id, 'sitesmithPaths is empty: no file in this product carries the contribution');
  } else {
    for (const p of r.sitesmithPaths) {
      if (!existsSync(join(root, p))) refuse(id, `sitesmithPaths names "${p}", which is not in the tree`);
    }
  }

  if (!r.loadedWhen?.length) {
    refuse(id, 'loadedWhen is empty: nothing says when this contribution reaches a build');
  } else {
    for (const w of r.loadedWhen) {
      if (RESEARCH_ONLY.test(String(w).trim())) refuse(id, `loadedWhen says "${w}", which is a reading, not a load`);
    }
  }

  if (RESEARCH_ONLY.test(String(r.integration ?? '').trim())) {
    refuse(id, `integration says "${r.integration}", which is the status the brief forbids`);
  }

  if (!r.proof?.length) {
    refuse(id, 'proof is empty: nothing anyone can run demonstrates the contribution');
  } else {
    for (const p of r.proof) {
      const path = String(p).split('#')[0].split(' ')[0];
      if (path.includes('/') && !existsSync(join(root, path))) {
        refuse(id, `proof names "${path}", which is not in the tree`);
      }
    }
  }
}

const extra = rows.map((r) => r.source).filter((s) => !REQUIRED.includes(s));

if (JSON_OUT) {
  console.log(JSON.stringify({ required: REQUIRED.length, refusals, extra }, null, 2));
  process.exit(refusals.length ? 1 : 0);
}

console.log(`\n  source coverage, ${REQUIRED.length} required source(s)\n`);

if (!refusals.length) {
  for (const id of REQUIRED) {
    const r = byId.get(id);
    console.log(`  ok    ${id.padEnd(30)} ${r.integration.padEnd(11)} ${r.sitesmithPaths.length} path(s), ${r.proof.length} proof(s)`);
  }
  if (extra.length) console.log(`\n  also registered, not required: ${extra.join(', ')}`);
  console.log('\n  every required source contributes, and every contribution names a file that exists\n');
  process.exit(0);
}

const grouped = new Map();
for (const { source, why } of refusals) {
  if (!grouped.has(source)) grouped.set(source, []);
  grouped.get(source).push(why);
}
console.log('  REFUSED\n');
for (const [source, whys] of grouped) {
  console.log(`    ${source}`);
  for (const w of whys) console.log(`      ${w}`);
}
console.log(`\n  ${refusals.length} problem(s) across ${grouped.size} source(s). A source that changed nothing is not a source this product used.\n`);
process.exit(1);
