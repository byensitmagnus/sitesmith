#!/usr/bin/env node
/**
 * The seven product commands, and one router for all of them. Original work, MIT.
 *
 * `bin/sitesmith.mjs` owns install, update, doctor and pack: getting the skill onto a
 * machine. This file owns what you do once it is there. They share one entry point so a
 * person has one command to learn, and the arg parsing lives here once rather than seven
 * times.
 *
 * Two of these seven do not run a website builder, and say so rather than pretending.
 * `build` and `redesign` are agent-driven: the work is the skill, read by a coding agent
 * with a brief. What the CLI can honestly do for them is prepare the state the run writes
 * into, name the file the agent opens first, and get out of the way. A command that printed
 * a progress bar and produced nothing would be the exact dishonesty the gate refuses on a
 * page.
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const say = (s = '') => console.log(s);

/* ── shared state ────────────────────────────────────────────────────────── */

const STATE_DIR = '.sitesmith';

/** Everything a run reads and writes lives under one directory, so a project can be
    inspected, archived or deleted as one thing. */
export const statePaths = (project) => ({
  dir: join(project, STATE_DIR),
  project: join(project, STATE_DIR, 'PROJECT.md'),
  design: join(project, STATE_DIR, 'DESIGN.md'),
  decisions: join(project, STATE_DIR, 'decisions.jsonl'),
  state: join(project, STATE_DIR, 'state.json'),
  evidence: join(project, STATE_DIR, 'evidence'),
});

async function readState(project) {
  const p = statePaths(project);
  if (!existsSync(p.state)) return null;
  try { return JSON.parse(await readFile(p.state, 'utf8')); } catch { return null; }
}

async function writeState(project, patch) {
  const p = statePaths(project);
  const now = { ...(await readState(project)), ...patch };
  await mkdir(p.dir, { recursive: true });
  await writeFile(p.state, `${JSON.stringify(now, null, 2)}\n`, 'utf8');
  return now;
}

/** One line per decision, append-only, so the history of a project is a file you can read
    rather than a diff you have to reconstruct. */
export async function note(project, entry) {
  const p = statePaths(project);
  await mkdir(p.dir, { recursive: true });
  const { appendFile } = await import('node:fs/promises');
  await appendFile(p.decisions, `${JSON.stringify(entry)}\n`, 'utf8');
}

/* ── running the skill's own scripts ─────────────────────────────────────── */

/* The scripts live in the skill directory, not the project. Every command that needs one
   resolves it the same way and passes the project as cwd, which is the arrangement
   run.md tells an agent to use. */
function skillScript(root, name) {
  const candidates = [
    join(root, 'skills/sitesmith-v3/scripts', name),
    join(root, 'scripts', name),
    join(root, name),
  ];
  return candidates.find(existsSync) ?? null;
}

function runScript(root, name, argv, cwd) {
  const script = skillScript(root, name);
  if (!script) {
    say(`  ${name} is not in this installation, so this step has no result rather than a passing one.`);
    return 2;
  }
  const r = spawnSync(process.execPath, [script, ...argv], { cwd, stdio: 'inherit' });
  return r.status ?? 1;
}

/* ── init ────────────────────────────────────────────────────────────────── */

const PROJECT_MD = (name) => `# ${name}

One line on what this is, who it is for, and the single thing the site must do. If a brief
pinned those, use its words.

## The subject's world

Concrete nouns from this subject's actual world: materials, tools, formats, surfaces,
units, jargon, the artefacts it makes, the marks it leaves. Not adjectives.

## Facts

The only facts. Nothing else may be stated as true on the page. Anything missing is asked
for, or the sentence is cut.

## Constraints

Stack, languages, what exists already, what may not change.
`;

const DESIGN_MD = `# Design

Filled by the run, not by hand. The direction record \`ledger.mjs new\` writes is the
authority for a single surface; this file is what survives across surfaces in one project:
the colours and their names, the type roles, the spacing scale, the signature and what it
is made of, and the one risk the project is carrying.

## Colour

## Type

## Spacing

## Signature

## Carried risks
`;

export async function init(project, { name } = {}) {
  const p = statePaths(project);
  const already = existsSync(p.state);
  await mkdir(p.evidence, { recursive: true });
  const label = name ?? project.split(/[\\/]/).filter(Boolean).pop() ?? 'this project';

  if (!existsSync(p.project)) await writeFile(p.project, PROJECT_MD(label), 'utf8');
  if (!existsSync(p.design)) await writeFile(p.design, DESIGN_MD, 'utf8');
  if (!existsSync(p.decisions)) await writeFile(p.decisions, '', 'utf8');

  await writeState(project, {
    v: 1,
    name: label,
    createdBy: 'sitesmith init',
    surfaces: (await readState(project))?.surfaces ?? [],
  });

  say(`\n  ${already ? 'refreshed' : 'created'} ${STATE_DIR}/ in ${project}\n`);
  for (const f of ['PROJECT.md', 'DESIGN.md', 'decisions.jsonl', 'state.json', 'evidence/']) {
    say(`    ${f}`);
  }
  say('\n  Fill PROJECT.md first. The rest is written by the run.\n');
  return 0;
}

/* ── recommend ───────────────────────────────────────────────────────────── */

export async function recommend(root, { brief, surface, stack }) {
  const engine = [
    join(root, 'knowledge/retrieve.mjs'),
    join(root, 'skills/sitesmith-v3/knowledge/retrieve.mjs'),
  ].find(existsSync);
  if (!engine) {
    say('  the knowledge index is not in this installation, so there is nothing to search.');
    return 2;
  }
  if (!brief) {
    say('  usage: sitesmith recommend "<brief>" [--surface <surface>] [--stack <stack>]');
    return 2;
  }
  const argv = [brief];
  if (surface) argv.push('--surface', surface);
  if (stack) argv.push('--stack', stack);
  const r = spawnSync(process.execPath, [engine, ...argv], { stdio: 'inherit' });
  return r.status ?? 1;
}

/* ── build and redesign, which are the agent's work ──────────────────────── */

function skillEntry(root) {
  return [
    join(root, 'skills/sitesmith-v3/SKILL.md'),
    join(root, 'SKILL.md'),
  ].find(existsSync);
}

export async function build(root, project, { surface }) {
  const entry = skillEntry(root);
  if (!existsSync(statePaths(project).state)) await init(project, {});

  say('\n  build is the skill, read by a coding agent. This command does not write a website.\n');
  say(`    1. open   ${entry ?? 'SKILL.md (not found in this installation)'}`);
  say('    2. fill   .sitesmith/PROJECT.md, then run the direction record:');
  say(`       node <skill>/scripts/ledger.mjs new ${surface ?? '<surface>'}`);
  say('    3. build  from the plan, then: verify, critique packet, journey, gate\n');

  if (surface) {
    const s = await readState(project);
    const surfaces = new Set(s?.surfaces ?? []);
    surfaces.add(surface);
    await writeState(project, { surfaces: [...surfaces] });
    await note(project, { at: 'build', surface, by: 'sitesmith build' });
    say(`  recorded surface: ${surface}\n`);
  }
  return 0;
}

export async function redesign(root, project, { target }) {
  if (!target) {
    say('  usage: sitesmith redesign <url-or-directory>');
    return 2;
  }
  say('\n  redesign begins with what is already there. Running inspect first.\n');
  const out = join(statePaths(project).evidence, 'inspection');
  const code = runScript(root, 'inspect.mjs', [target, '--out', out], project);
  const entry = [
    join(root, 'skills/sitesmith-v3/redesign.md'),
    join(root, 'redesign.md'),
  ].find(existsSync);
  say('');
  say(`  then open ${entry ?? 'redesign.md (not found in this installation)'}: it governs what may change.`);
  say(`  the audit and the baseline are in ${out}\n`);
  await note(project, { at: 'redesign', target, inspection: out });
  return code;
}

/* ── inspect, audit, verify ──────────────────────────────────────────────── */

export async function inspect(root, project, { target, out }) {
  if (!target) {
    say('  usage: sitesmith inspect <url-or-directory> [--out <dir>]');
    return 2;
  }
  const dest = out ?? join(statePaths(project).evidence, 'inspection');
  const code = runScript(root, 'inspect.mjs', [target, '--out', dest], project);
  await note(project, { at: 'inspect', target, out: dest });
  return code;
}

export async function audit(root, project, { target, out }) {
  say('\n  audit reads the built result twice: what is on the page, then what the gate refuses.\n');
  const dest = out ?? join(statePaths(project).evidence, 'audit');
  let worst = 0;
  if (target) worst = Math.max(worst, runScript(root, 'inspect.mjs', [target, '--out', dest], project));
  say('');
  worst = Math.max(worst, runScript(root, 'gate.mjs', [], project));
  await note(project, { at: 'audit', target: target ?? project, out: dest });
  return worst;
}

export async function verify(root, project, { target }) {
  return runScript(root, 'verify.mjs', target ? [target] : [], project);
}

/* ── the router ──────────────────────────────────────────────────────────── */

export const COMMANDS = {
  init: { args: '[--to <dir>] [--name <name>]', what: 'create .sitesmith/ and its four files' },
  recommend: { args: '"<brief>" [--surface <s>] [--stack <s>]', what: 'search the knowledge index, at most three results' },
  build: { args: '[--surface <s>] [--to <dir>]', what: 'name what the agent opens, and record the surface' },
  inspect: { args: '<url-or-dir> [--out <dir>]', what: 'stack, routes, screenshots, components, tokens, assets, audit, baseline' },
  redesign: { args: '<url-or-dir> [--to <dir>]', what: 'inspect first, then the file that governs what may change' },
  audit: { args: '[<url-or-dir>] [--out <dir>]', what: 'inspect the result, then run the gate' },
  verify: { args: '[<target>]', what: 'render matrix, axe in both schemes, floor measures' },
};

export function usage() {
  const lines = ['', '  sitesmith — build websites that do not look AI-generated', ''];
  for (const [name, c] of Object.entries(COMMANDS)) {
    lines.push(`    sitesmith ${name.padEnd(10)} ${c.args}`);
    lines.push(`      ${' '.repeat(10)} ${c.what}`);
  }
  lines.push('');
  lines.push('    sitesmith install | update | doctor | pack     put the skill on this machine');
  lines.push('');
  return lines.join('\n');
}

/** One dispatch for all seven. Every command gets the same resolved root, project and
    flags, so none of them parses arguments of its own. */
export async function route(cmd, { root, argv }) {
  const flag = (n, d = null) => {
    const i = argv.indexOf(`--${n}`);
    return i >= 0 && i + 1 < argv.length && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
  };
  const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--') && flag(argv[i - 1].slice(2)) === a));
  const project = resolve(flag('to', process.cwd()));
  const first = positional[0] ?? null;

  switch (cmd) {
    case 'init': return init(project, { name: flag('name') });
    case 'recommend': return recommend(root, { brief: first, surface: flag('surface'), stack: flag('stack') });
    case 'build': return build(root, project, { surface: flag('surface') });
    case 'inspect': return inspect(root, project, { target: first, out: flag('out') });
    case 'redesign': return redesign(root, project, { target: first });
    case 'audit': return audit(root, project, { target: first, out: flag('out') });
    case 'verify': return verify(root, project, { target: first });
    default: return null;
  }
}
