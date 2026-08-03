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
import { join, resolve, relative, dirname, sep } from 'node:path';

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
    join(root, '../knowledge/retrieve.mjs'),
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

/* The run manifest, and why it exists rather than a printed list of steps.
   The first version of `build` printed three lines of advice. A coding agent given that has
   to open five documents and guess the order, which is the gap this command was supposed to
   close. So it resolves what can be resolved, writes it down as one machine-readable order
   of work, and names the one step that is actually next. Nothing here builds a website: the
   agent does that, from this manifest. */
async function resolveStack(root, project) {
  const script = skillScript(root, 'stack.mjs');
  if (!script) return { stack: null, adapter: null, why: 'stack.mjs is not in this installation' };
  const r = spawnSync(process.execPath, [script, 'detect', project], { encoding: 'utf8' });
  const out = `${r.stdout ?? ''}`;
  const stack = (out.match(/stack:\s*(\S+)/) ?? [])[1] ?? null;
  const adapter = (out.match(/adapter:\s*(\S+)/) ?? [])[1] ?? null;
  return { stack, adapter, why: stack ? null : 'nothing detected; plain HTML and CSS with no build step' };
}

async function resolveKnowledge(root, { brief, surface, stack }) {
  const engine = knowledgeEngine(root);
  if (!engine || !brief) return { used: [], note: engine ? 'no brief text given' : 'knowledge index not installed' };
  const argv = [brief, '--json'];
  if (surface) argv.push('--surface', surface);
  if (stack) argv.push('--stack', stack);
  const r = spawnSync(process.execPath, [engine, ...argv], { encoding: 'utf8' });
  try {
    const parsed = JSON.parse(r.stdout);
    const results = parsed.results ?? [];
    return {
      /* The whole post, not its id. A manifest that names three ids sends the agent to a
         corpus that is deliberately not in the read manifest, so it could either open files
         the gate refuses or work from the wording of an identifier. Neither is a third
         option, so the text comes here instead and the corpus stays out of the hot path. */
      used: results.map((x) => ({
        id: x.id, score: x.score, file: x.file ?? null,
        userJob: x.userJob ?? null, problem: x.problem ?? null,
        worksWhen: x.worksWhen ?? null, avoidWhen: x.avoidWhen ?? null,
        mechanism: x.mechanism ?? null, risks: x.risks ?? [],
        mobileRules: x.mobileRules ?? [], accessibilityRules: x.accessibilityRules ?? [],
        genericnessRisk: x.genericnessRisk ?? null,
      })),
      note: parsed.noGoodMatch ? (parsed.message ?? "no good match; go to the subject's own world") : null,
    };
  } catch {
    return { used: [], note: 'retrieval produced no machine-readable result; run `sitesmith recommend` and read it' };
  }
}

function knowledgeEngine(root) {
  return [
    join(root, 'knowledge/retrieve.mjs'),
    join(root, 'skills/sitesmith-v3/knowledge/retrieve.mjs'),
    join(root, '../knowledge/retrieve.mjs'),
  ].find(existsSync) ?? null;
}

export const SURFACES = ['buy', 'operate', 'read', 'experience'];

export async function build(root, project, { surface, brief }) {
  /* Usage is exit 2, and it is checked before anything is written. A surface nobody
     recognises used to run the whole command, resolve a floor file that does not exist and
     write a manifest naming it, which is a wrong answer rather than a refusal. */
  if (surface && !SURFACES.includes(surface)) {
    say(`\n  unknown surface: ${surface}. One of: ${SURFACES.join(', ')}\n`);
    return 2;
  }
  const p = statePaths(project);
  if (!existsSync(p.state)) await init(project, {});

  const briefPath = ['BRIEF.md', 'brief.md', join(STATE_DIR, 'PROJECT.md')]
    .map((f) => join(project, f)).find(existsSync) ?? null;
  const briefText = brief ?? (briefPath ? await readFile(briefPath, 'utf8') : '');
  let { stack, adapter, why } = await resolveStack(root, project);
  /* An empty project detects nothing, and at `build` time the project is always empty. The
     brief's own frontmatter is the only thing that knows what is about to be built, so it
     is the fallback and the manifest says which of the two it used. */
  const declared = (briefText.match(/^stack:\s*(\S+)/mi) ?? [])[1] ?? null;
  let stackSource = stack ? 'detected' : null;
  if (!stack && declared) {
    stack = declared;
    stackSource = 'declared in the brief; nothing is built yet to detect';
    adapter = `stacks/${declared}.md`;
    why = null;
  }
  /* The whole brief, not the first 1200 characters of it.
     Truncating was a workaround for a scorer that punished long queries: the same question
     scored 0.295 typed as a sentence and 0.092 pasted as its brief. That is fixed where it
     was broken, in the normaliser's QUERY_TERM_CAP, so the cut here is no longer load-bearing
     and a fact 1300 characters into a brief can now reach the index. */
  const knowledge = await resolveKnowledge(root, { brief: briefText, surface, stack });

  const directionPath = join(p.dir, 'direction.md');
  const skill = skillEntry(root);
  /* Portable, and portable by construction rather than by find-and-replace.
     RUN.json used to carry absolute paths, so a manifest written on one machine named a
     home directory that did not exist on the next, and the file could not be committed
     without putting a person's name in the repository. Everything the manifest points at is
     now either relative to the project or written against `skillRoot`, which is stated once. */
  const skillRoot = skill ? dirname(skill) : null;
  const rel = (abs) => (abs ? `./${relative(project, abs).split(sep).join('/')}` : null);
  /* The documented layout puts the installation inside the project, at
     `<project>/.claude/skills/sitesmith/`. When it is there, even this line is written
     relative, and the manifest contains no absolute path at all: it can be committed as
     evidence without carrying somebody's home directory into a public repository. */
  const skillRootField = skillRoot && !relative(project, skillRoot).startsWith('..')
    ? rel(skillRoot) : skillRoot;
  const inSkill = (abs) => (skillRoot && abs ? `<skill>/${relative(skillRoot, abs).split(sep).join('/')}` : null);
  const scriptOf = (n) => `node ${inSkill(skillScript(root, n)) ?? `<skill>/scripts/${n}`}`;

  const blockers = [];
  if (!surface) blockers.push('no surface given: pass --surface buy|operate|read|experience');
  if (!briefPath) blockers.push('no BRIEF.md and no filled PROJECT.md, so nothing states the facts the page may use');
  if (!existsSync(directionPath)) blockers.push(`no direction record: run \`${scriptOf('ledger.mjs')} new . ${surface ?? '<surface>'}\``);

  const manifest = {
    v: 1,
    /* `<skill>` in every path below expands to this. It is the one absolute path in the
       file, it is stated rather than pasted into forty strings, and a manifest moved to
       another machine needs this line changed and nothing else. */
    skillRoot: skillRootField ?? null,
    surface: surface ?? null,
    brief: rel(briefPath),
    stack: { name: stack, source: stackSource, adapter, note: why },
    knowledge,
    read: [
      inSkill(skill) ?? 'SKILL.md',
      '<skill>/run.md',
      '<skill>/look.md',
      surface === 'buy' ? '<skill>/floor/buy.md' : surface === 'operate' ? '<skill>/floor/operate.md' : null,
      adapter ? `<skill>/${adapter}` : null,
      '<skill>/verify.md',
    ].filter(Boolean),
    write: [
      `${STATE_DIR}/direction.md`,
      'the site itself, in the detected stack',
      'ASSET-MANIFEST.md',
      'PRODUCTION-REPORT.md',
      surface === 'buy' || surface === 'operate' ? 'journeys/*.spec.mjs' : null,
    ].filter(Boolean),
    commands: {
      direction: `${scriptOf('ledger.mjs')} new . ${surface ?? '<surface>'}`,
      verify: `${scriptOf('verify.mjs')} <url-or-dir>`,
      critiquePacket: `${scriptOf('critique.mjs')} packet`,
      critiqueLock: `${scriptOf('critique.mjs')} lock --file <answers.md>`,
      journey: `${scriptOf('journey.mjs')} journeys --base <url>`,
      gate: `${scriptOf('gate.mjs')}`,
    },
    blockers,
    next: blockers[0] ?? 'build from the direction record, then verify, critique, journey, gate',
  };

  await writeFile(join(p.dir, 'RUN.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await writeFile(join(p.dir, 'RUN.md'), runMarkdown(manifest), 'utf8');

  const s = await readState(project);
  const surfaces = new Set(s?.surfaces ?? []);
  if (surface) surfaces.add(surface);
  await writeState(project, { surfaces: [...surfaces] });
  await note(project, { at: 'build', surface: surface ?? null, stack, blockers: blockers.length });

  say('\n  build does not write a website. It writes the order of work the agent builds from.\n');
  say(`    ${join(STATE_DIR, 'RUN.json')}   machine-readable`);
  say(`    ${join(STATE_DIR, 'RUN.md')}     the same thing, readable\n`);
  say(`  surface : ${surface ?? 'not given'}`);
  say(`  stack   : ${stack ?? 'none detected'}${stackSource ? ` (${stackSource})` : ''}`);
  say(`  brief   : ${manifest.brief ?? 'none found'}`);
  say(`  patterns: ${knowledge.used.length ? knowledge.used.map((k) => k.id).join(', ') : knowledge.note}`);
  say(`\n  next    : ${manifest.next}\n`);
  /* 3, not 0. A blocked build is not a finished build, and an automated caller that reads
     exit 0 goes on to the next step with no direction record and no brief. This returned 0
     either way, with a ternary that had the same value on both sides, which is what a
     contract looks like when it was meant and never written. */
  if (blockers.length) say(`  ${blockers.length} blocker(s): exit 3, nothing was faked.\n`);
  return blockers.length ? 3 : 0;
}

function runMarkdown(m) {
  const L = [];
  L.push('# Run manifest', '');
  L.push('Written by `sitesmith build`. It resolves what a command can resolve and names what');
  L.push('the agent does next. It is not a plan: the plan is the direction record.', '');
  L.push(`- surface: **${m.surface ?? 'not given'}**`);
  L.push(`- stack: **${m.stack.name ?? 'none detected'}**${m.stack.adapter ? `, adapter \`${m.stack.adapter}\`` : ''}${m.stack.source ? ` (${m.stack.source})` : ''}${m.stack.note ? ` (${m.stack.note})` : ''}`);
  L.push(`- brief: ${m.brief ? `\`${m.brief}\`` : 'none found'}`, '');
  L.push('## Knowledge Index', '');
  if (m.knowledge.used.length) {
    L.push('Building blocks, not a template. They go through the subject, thesis, autopilot,');
    L.push('swap and originality flow before anything is built. The full text is here so the');
    L.push('corpus itself stays outside the read manifest.', '');
    for (const k of m.knowledge.used) {
      L.push(`### \`${k.id}\`  (${k.score})`, '');
      if (k.userJob) L.push(`- **job**: ${k.userJob}`);
      if (k.problem) L.push(`- **problem**: ${k.problem}`);
      if (k.worksWhen) L.push(`- **works when**: ${k.worksWhen}`);
      if (k.avoidWhen) L.push(`- **avoid when**: ${k.avoidWhen}`);
      if (k.mechanism) L.push(`- **mechanism**: ${k.mechanism}`);
      for (const r of k.risks ?? []) L.push(`- risk: ${r}`);
      for (const r of k.mobileRules ?? []) L.push(`- mobile: ${r}`);
      for (const r of k.accessibilityRules ?? []) L.push(`- accessibility: ${r}`);
      if (k.genericnessRisk) L.push(`- genericness risk: ${k.genericnessRisk}`);
      L.push('');
    }
  } else L.push(`- ${m.knowledge.note}`);
  L.push('', '## Read, in this order', '');
  for (const f of m.read) L.push(`- \`${f}\``);
  L.push('', '## Write', '');
  for (const f of m.write) L.push(`- \`${f}\``);
  L.push('', '## Commands', '');
  for (const [k, v] of Object.entries(m.commands)) L.push(`- **${k}**: \`${v}\``);
  L.push('', '## Blockers', '');
  if (m.blockers.length) for (const b of m.blockers) L.push(`- ${b}`);
  else L.push('- none');
  L.push('', `## Next`, '', m.next, '');
  return L.join('\n');
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

/* `does` is the honest half of this table. A command either performs the work itself or it
   sets up state and hands the work to the agent reading the skill. Both are legitimate;
   printing them as one list without saying which is which is how a command surface gets
   described as a finished engine when two of its seven commands orchestrate rather than
   execute. */
export const COMMANDS = {
  init: { does: 'runs', args: '[--to <dir>] [--name <name>]', what: 'create .sitesmith/ and its four files' },
  recommend: { does: 'runs', args: '"<brief>" [--surface <s>] [--stack <s>]', what: 'search the knowledge index, at most three results' },
  build: { does: 'orchestrates', args: '[--surface <s>] [--to <dir>]', what: 'prepare state, name the file the agent opens, record the surface' },
  inspect: { does: 'runs', args: '<url-or-dir> [--out <dir>]', what: 'stack, routes, screenshots, components, tokens, assets, audit, baseline' },
  redesign: { does: 'both', args: '<url-or-dir> [--to <dir>]', what: 'runs inspect, then hands the change itself to the agent' },
  audit: { does: 'runs', args: '[<url-or-dir>] [--out <dir>]', what: 'inspect the result, then run the gate' },
  verify: { does: 'runs', args: '[<target>]', what: 'render matrix, axe in both schemes, floor measures' },
};

export function usage() {
  const lines = [
    '',
    '  sitesmith, and what each command does',
    '',
    '  This is one command surface, not one engine. `runs` does the work itself.',
    '  `orchestrates` prepares state and hands the work to an agent reading the skill.',
    '',
  ];
  for (const [name, c] of Object.entries(COMMANDS)) {
    lines.push(`    sitesmith ${name.padEnd(10)} ${c.args}`);
    lines.push(`      ${c.does.padEnd(13)} ${c.what}`);
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
    case 'build': return build(root, project, { surface: flag('surface'), brief: flag('brief') });
    case 'inspect': return inspect(root, project, { target: first, out: flag('out') });
    case 'redesign': return redesign(root, project, { target: first });
    case 'audit': return audit(root, project, { target: first, out: flag('out') });
    case 'verify': return verify(root, project, { target: first });
    default: return null;
  }
}
