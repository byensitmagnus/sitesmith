#!/usr/bin/env node
/**
 * Design Contract v1: write it, check it, and compare it against what was built.
 * Original work, MIT.
 *
 *   node <skill>/scripts/contract.mjs new <surface>        write the template
 *   node <skill>/scripts/contract.mjs check [--write]      validate; --write records contrast
 *   node <skill>/scripts/contract.mjs compare --url <url>  contract against the rendered page
 *   node <skill>/scripts/contract.mjs stress  --url <url>  run the stress cases and record them
 *
 * Why this exists at all, when the direction record already exists.
 *
 * The record explains a decision: three theses, the runner-up argued honestly, the risk and
 * its answer, the signature. Every field in it is prose, and prose is the right shape for a
 * decision. But nothing in it can be compared against a build. A record can say "warm
 * ground, one cold accent" and the page can ship at 3.9:1 on its own body text, and both
 * the record and the gate are content.
 *
 * So this is the other half: the same decision expressed as values. Which colour is the
 * action, which foreground goes on which background, what the fallback stack is when the
 * webfont does not land, what the layout becomes at 375, and which selector the keyboard
 * reaches first. Every one of those is checkable, and `compare` checks them against the
 * page that was actually built.
 *
 * It never invents a value. Every field is the builder's answer to a fixed question, which
 * is the mechanism that took this repository's cold builds from nought of nine to three of
 * three: ask, record, then look for the answer in the rendered DOM.
 *
 * Exit codes are the package's: 0 done, 1 a defect, 2 usage, 3 not ready or withheld.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse as parseColour, contrast, distance, hex, flatten, AA } from './colour.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/* Resolve from the project, not from the skill. The skill is installed somewhere the
   project's node_modules is not a parent of, so a bare import finds nothing and the run
   withholds a verdict it could have earned. verify.mjs solves it the same way. */
const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
async function load(name) {
  try { return await import(name); }
  catch { return await import(pathToFileURL(requireFromCwd.resolve(name)).href); }
}
const SCHEMA_PATH = join(HERE, '../contract/schema.json');
const STATE_DIR = '.sitesmith';

const argv = process.argv.slice(2);
const CMD = argv[0];
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && i + 1 < argv.length && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);
const project = resolve(flag('to', process.cwd()));
const CONTRACT = join(project, STATE_DIR, 'contract.json');
const READABLE = join(project, STATE_DIR, 'CONTRACT.md');

const say = (s = '') => console.log(s);
const die = (code, msg) => { console.error(msg); process.exit(code); };

const schema = JSON.parse(await readFile(SCHEMA_PATH, 'utf8'));

/* ── the template ────────────────────────────────────────────────────────────
   Every field present and empty, in the order they are answered. An empty field is a
   question; an absent one is a question nobody was asked, and that is the difference this
   template exists to remove. */

const TEMPLATE = (surface) => ({
  v: 1,
  schemaVersion: schema.schemaVersion,
  surface,
  subject: '',
  writtenAgainst: { record: `${STATE_DIR}/direction.md`, hash: '' },
  colour: {
    strategy: '',
    strategyWhy: '',
    sources: [{ name: '', material: '', value: '', why: '' }],
    primitives: [
      { token: '', value: '', fallback: '', from: '' },
      { token: '', value: '', fallback: '', from: '' },
    ],
    roles: Object.fromEntries(schema.roles.required.map((r) => [r, ''])),
    pairs: [
      { name: '', foreground: '', background: '', use: '', minimum: 'text', state: 'rest' },
      { name: '', foreground: '', background: '', use: '', minimum: 'nonText', state: 'focus' },
    ],
    states: { rest: { changes: '', carriedBy: '' }, focus: { changes: '', carriedBy: '' } },
    schemes: { light: true, dark: false, why: '' },
    genericnessRisk: '',
  },
  typography: {
    roles: [{
      role: 'body', family: '', source: '', licence: '', weights: [], why: '',
      fallback: [], metricCompatible: false, languages: [], loading: 'swap', lineHeight: 1.5,
      genericnessRisk: '',
    }],
    scale: [
      { name: '', size: '', lineHeight: 1.2, role: '' },
      { name: '', size: '', lineHeight: 1.4, role: '' },
      { name: '', size: '', lineHeight: 1.5, role: '' },
    ],
    measure: { target: 66, band: [45, 80] },
    stress: [
      { case: 'a heading three times its expected length', expected: '' },
      { case: 'the page\'s own language at 200 per cent zoom', expected: '' },
      { case: 'the fallback stack, with the webfont blocked', expected: '' },
    ],
    genericnessRisk: '',
  },
  layout: {
    path: '',
    leading: [''],
    supporting: [],
    grouping: '',
    density: '',
    densityWhy: '',
    rhythm: { base: '', steps: ['', ''] },
    topology: '',
    firstViewportObject: { what: '', selector: '' },
    signature: { what: '', selector: '' },
    responsive: [
      { width: 375, becomes: '', departures: [] },
      { width: 768, becomes: '', departures: [] },
      { width: 1440, becomes: '', departures: [] },
    ],
    container: '',
    focusOrder: ['', ''],
    stress: [{ case: '', expected: '' }],
    squint: '',
  },
});

/* ── validation ──────────────────────────────────────────────────────────── */

const problems = [];
const notes = [];
const bad = (where, what, fix) => problems.push({ where, what, fix });
const note = (where, what) => notes.push({ where, what });

const empty = (v) => v === undefined || v === null || v === ''
  || (Array.isArray(v) && (v.length === 0 || v.every(empty)))
  || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);

const at = (obj, path) => path.split('.').reduce((o, k) => (o === undefined || o === null ? o : o[k]), obj);

function checkShape(item, shapeName, where) {
  const shape = schema.shapes[shapeName];
  if (!shape) return;
  for (const [key, rule] of Object.entries(shape)) {
    const v = item?.[key];
    if (rule.req && empty(v)) {
      bad(`${where}.${key}`, 'empty', rule.note ?? 'fill it, or the contract is a form rather than a decision');
      continue;
    }
    if (empty(v)) continue;
    if (rule.enum && !rule.enum.includes(v)) bad(`${where}.${key}`, `${v} is not one of ${rule.enum.join(', ')}`, 'use one of the listed values');
    if (rule.type === 'colour' && !parseColour(v)) {
      bad(`${where}.${key}`, `${v} is not a colour this can resolve`,
        'hex, rgb, hsl, oklch or oklab. A custom property reference cannot be checked, so it is not a value here.');
    }
    if (rule.type === 'array' && rule.min && (v?.length ?? 0) < rule.min) {
      bad(`${where}.${key}`, `${v.length} of ${rule.min} required`, '');
    }
  }
}

function validate(c) {
  for (const [path, rule] of Object.entries(schema.fields)) {
    const v = at(c, path);
    if (rule.req && empty(v)) { bad(path, 'empty', rule.note ?? ''); continue; }
    if (empty(v)) continue;
    if (rule.enum && !rule.enum.includes(v)) bad(path, `${v} is not one of ${rule.enum.join(', ')}`, '');
    if (rule.type === 'array' && rule.min && v.length < rule.min) bad(path, `${v.length} of ${rule.min} required`, rule.note ?? '');
    if (rule.of && Array.isArray(v)) v.forEach((item, i) => checkShape(item, rule.of, `${path}[${i}]`));
    if (rule.of && !Array.isArray(v) && typeof v === 'object') checkShape(v, rule.of, path);
  }

  /* Cross-references. A field can be filled and still point at nothing, and every one of
     these was a way for a complete-looking contract to describe no system at all. */
  const tokens = new Map((c.colour?.primitives ?? []).map((p) => [p.token, p]));
  const sources = new Set((c.colour?.sources ?? []).map((s) => s.name));

  for (const p of c.colour?.primitives ?? []) {
    if (p.from && p.from !== 'derived' && !sources.has(p.from) && !p.from.startsWith('derived')) {
      bad(`colour.primitives ${p.token}`, `from: ${p.from} names no source colour`,
        `one of: ${[...sources].join(', ') || 'none declared'}, or "derived: <why>"`);
    }
    if (p.fallback) {
      const d = distance(p.value, p.fallback);
      if (d === null) bad(`colour.primitives ${p.token}`, 'the fallback is not a colour this can resolve', '');
      else if (d > 0.04) {
        bad(`colour.primitives ${p.token}`, `the fallback is a different colour: ${d} apart per channel`,
          `${p.value} renders as ${hex(parseColour(p.value))}`);
      }
    }
  }

  for (const required of schema.roles.required) {
    const tok = c.colour?.roles?.[required];
    if (empty(tok)) bad(`colour.roles.${required}`, 'empty', 'every required role points at a primitive token');
    else if (!tokens.has(tok)) bad(`colour.roles.${required}`, `${tok} is not a declared primitive`, `one of: ${[...tokens.keys()].join(', ')}`);
  }
  for (const [role, tok] of Object.entries(c.colour?.roles ?? {})) {
    const known = [...schema.roles.required, ...schema.roles.optional];
    if (!known.includes(role)) note(`colour.roles.${role}`, 'not one of the named roles; kept, and it is yours to justify');
    if (!empty(tok) && !tokens.has(tok)) bad(`colour.roles.${role}`, `${tok} is not a declared primitive`, '');
  }

  /* Contrast, per pair. This is the check the gate cannot do from a render alone: a pair
     that is never painted in a state the crawler reaches is never measured, and the pair
     that fails is usually exactly that one. */
  for (const pair of c.colour?.pairs ?? []) {
    const fg = tokens.get(pair.foreground), bg = tokens.get(pair.background);
    if (!fg || !bg) {
      bad(`colour.pairs ${pair.name}`, 'names a token that is not declared', '');
      pair.measured = null; pair.verdict = 'not measured';
      continue;
    }
    /* A translucent background is not a colour until you know what is behind it. The pilot's
       error message is red chalk on red chalk at nine per cent, on a white at fifty-five per
       cent, on the page ground: measured as written it reads 1:1, and measured as painted it
       is legible. The stack is the contract's to state, and unstated it is refused rather
       than guessed. */
    const bgAlpha = parseColour(bg.value)?.a ?? 1;
    let bgValue = bg.value;
    if (bgAlpha < 1) {
      if (!pair.backdrop?.length) {
        bad(`colour.pairs ${pair.name}`, `${pair.background} is ${Math.round(bgAlpha * 100)} per cent opaque and no backdrop is named`,
          'add backdrop: [<opaque token>, ...] back to front. A colour at nine per cent has no contrast of its own.');
        pair.measured = null; pair.verdict = 'not measured';
        continue;
      }
      const stack = [...pair.backdrop, pair.background].map((t) => tokens.get(t)?.value);
      if (stack.some((v) => v === undefined)) {
        bad(`colour.pairs ${pair.name}`, 'the backdrop names a token that is not declared', '');
        pair.measured = null; pair.verdict = 'not measured';
        continue;
      }
      const flat = flatten(stack);
      if (!flat) {
        bad(`colour.pairs ${pair.name}`, 'the backdrop does not start from an opaque colour',
          'the first entry is what is behind the page, so it cannot itself be translucent');
        pair.measured = null; pair.verdict = 'not measured';
        continue;
      }
      bgValue = hex(flat);
      pair.backgroundPainted = bgValue;
    }
    const ratio = contrast(fg.value, bgValue);
    const floor = schema.pairMinimums[pair.minimum] ?? AA.text;
    pair.measured = ratio;
    if (ratio === null) {
      pair.verdict = 'withheld';
      bad(`colour.pairs ${pair.name}`, 'one side could not be resolved, so this pair is unmeasured', '');
    } else if (ratio < floor) {
      pair.verdict = `fails ${pair.minimum} (${floor}:1)`;
      bad(`colour.pairs ${pair.name}`, `${ratio}:1 against a ${floor}:1 floor`,
        `${pair.foreground} on ${pair.background}, used for: ${pair.use}`);
    } else {
      pair.verdict = `passes ${pair.minimum}`;
    }
  }

  /* Every required role that is a foreground owes at least one pair, or the role exists and
     nothing says what it is legible on. */
  const paired = new Set((c.colour?.pairs ?? []).flatMap((p) => [p.foreground, p.background]));
  for (const role of ['foreground', 'onAction', 'focusRing']) {
    const tok = c.colour?.roles?.[role];
    if (tok && !paired.has(tok)) {
      bad(`colour.pairs`, `${role} (${tok}) appears in no pair`,
        'a foreground with no stated background has no contrast result, and axe will only find it if the state renders');
    }
  }

  /* State coverage. rest and focus are owed by every surface: a page a keyboard can reach
     has a focus state whether or not anyone chose one, and the one nobody chose is the
     browser's, on a ground it was not picked against. Every state that has a pair also owes
     a line saying what carries it besides colour, because colour alone is not a state for
     anyone who cannot see the difference. */
  const statesWithPairs = new Set((c.colour?.pairs ?? []).map((p) => p.state).filter(Boolean));
  for (const state of schema.stateCoverage.always) {
    if (!statesWithPairs.has(state)) {
      bad(`colour.pairs`, `no pair is painted in the ${state} state`,
        `add one, with its own minimum. ${state === 'focus' ? 'A focus ring nobody chose is the browser default, on a ground it was never picked against.' : ''}`);
    }
    if (empty(c.colour?.states?.[state]?.changes)) {
      bad(`colour.states.${state}`, 'empty', 'what visibly changes here. "Nothing, and here is why" is an answer.');
    }
  }
  for (const [state, s] of Object.entries(c.colour?.states ?? {})) {
    if (!empty(s?.changes) && empty(s?.carriedBy)) {
      bad(`colour.states.${state}.carriedBy`, 'empty',
        'name what carries this state besides colour: a border, a weight, a mark, a position');
    }
  }

  /* Schemes. A scheme claimed and unpopulated is worse than one not claimed: it reads as
     covered. But "populated" means something different depending on how many schemes there
     are, and the first version of this check got that wrong on the first page it met.
     It looked for the word dark in a pair, which is right when a light page adds a dark
     scheme and wrong when the page IS dark: a console for a lock keeper at 02:00 has no
     light scheme at all, every pair in it is a dark pair, and not one of them says so. */
  const schemes = c.colour?.schemes ?? {};
  if (schemes.light === false && schemes.dark === false) {
    bad('colour.schemes', 'neither light nor dark is claimed', 'a page renders in something; say which');
  } else if (schemes.light === true && schemes.dark === true) {
    const darkPairs = (c.colour.pairs ?? []).filter((p) => /dark/i.test(`${p.use} ${p.name}`));
    if (!darkPairs.length) {
      bad('colour.schemes.dark', 'both schemes are claimed and no pair names the dark one',
        'a second scheme is a second set of pairs with their own measurements. Name them, or claim one scheme and say why in schemes.why');
    }
  }
  /* One scheme is a decision and it owes its reason, whichever one it is. */
  if (schemes.light !== schemes.dark && String(schemes.why ?? '').length < 60) {
    bad('colour.schemes.why', 'one scheme is claimed and the reason is thin',
      'answer from the use scene: who reads this, where, and in what light');
  }

  /* Typography. The stress cases are required to exist; their results are not, because a
     result written before the case is run is a fabrication. */
  const bodyRole = (c.typography?.roles ?? []).find((r) => r.role === 'body');
  if (!bodyRole) bad('typography.roles', 'no body role', 'every page has body text, including the ones that are mostly display');
  for (const r of c.typography?.roles ?? []) {
    if (r.fallback?.length) {
      const last = String(r.fallback.at(-1)).toLowerCase();
      const generics = ['serif', 'sans-serif', 'monospace', 'system-ui', 'cursive', 'fantasy', 'ui-sans-serif', 'ui-serif', 'ui-monospace'];
      if (!generics.includes(last)) {
        bad(`typography.roles ${r.role}`, `the fallback stack ends in ${last}, not a generic family`,
          'end in serif, sans-serif or monospace, so a machine with none of the named faces still has an answer');
      }
    }
    if (r.metricCompatible === false && r.loading === 'swap') {
      note(`typography.roles ${r.role}`, 'swap with a metrically different fallback: the page will reflow when the face lands. Say so in the stress result or change the strategy.');
    }
  }

  /* Layout. focusOrder and leading are selectors and are checked against the DOM by
     `compare`; here only that they were answered and that the two agree with each other. */
  const lead = new Set(c.layout?.leading ?? []);
  const order = c.layout?.focusOrder ?? [];
  if (lead.size && order.length && ![...lead].some((s) => order.includes(s))) {
    note('layout.focusOrder', 'no leading element appears in the focus order. That can be right, and it is worth having looked.');
  }
  const widths = (c.layout?.responsive ?? []).map((r) => r.width).sort((a, b) => a - b);
  if (JSON.stringify(widths) !== JSON.stringify([375, 768, 1440])) {
    bad('layout.responsive', `widths ${widths.join(', ')}`, 'exactly 375, 768 and 1440, which are the widths verify.mjs renders');
  }
  const becomes = (c.layout?.responsive ?? []).map((r) => String(r.becomes).trim().toLowerCase());
  if (becomes.length === 3 && new Set(becomes).size === 1 && becomes[0]) {
    bad('layout.responsive', 'all three widths say the same thing',
      'if the layout genuinely does not change, say that once in layout.container and name the width it stops at');
  }

  return { problems, notes, contract: c };
}

/* ── the readable copy ───────────────────────────────────────────────────── */

function readable(c) {
  const L = [];
  const list = (xs) => (xs ?? []).map((x) => `\`${x}\``).join(', ') || '-';
  L.push('# Design contract', '');
  L.push('Written from `.sitesmith/direction.md` after the direction was chosen and before');
  L.push('implementation. The record explains the decision; this is the decision as values.', '');
  L.push(`- surface: **${c.surface}**`);
  L.push(`- subject: ${c.subject}`);
  L.push(`- written against: \`${c.writtenAgainst?.record}\` @ ${c.writtenAgainst?.hash || 'unhashed'}`, '');

  L.push('## Colour', '');
  L.push(`**Strategy.** ${c.colour?.strategy}. ${c.colour?.strategyWhy}`, '');
  L.push('### Where the colours come from', '');
  L.push('| name | material | value | why |', '| --- | --- | --- | --- |');
  for (const s of c.colour?.sources ?? []) L.push(`| ${s.name} | ${s.material} | \`${s.value}\` | ${s.why} |`);
  L.push('', '### Primitives', '');
  L.push('| token | value | renders as | from |', '| --- | --- | --- | --- |');
  for (const p of c.colour?.primitives ?? []) {
    const r = parseColour(p.value);
    L.push(`| \`--${p.token}\` | \`${p.value}\` | ${r ? `\`${hex(r)}\`` : 'unresolved'} | ${p.from} |`);
  }
  L.push('', '### Roles', '');
  for (const [role, tok] of Object.entries(c.colour?.roles ?? {})) L.push(`- **${role}**: \`--${tok}\``);
  L.push('', '### Pairs, measured', '');
  L.push('| pair | state | foreground on background | floor | measured | verdict |', '| --- | --- | --- | --- | --- | --- |');
  for (const p of c.colour?.pairs ?? []) {
    const bgLabel = p.backgroundPainted ? `\`--${p.background}\` over ${(p.backdrop ?? []).map((t) => `\`--${t}\``).join(' over ')}, painted \`${p.backgroundPainted}\`` : `\`--${p.background}\``;
    L.push(`| ${p.name} | ${p.state} | \`--${p.foreground}\` on ${bgLabel} | ${p.minimum} | ${p.measured ?? '-'}:1 | ${p.verdict ?? '-'} |`);
  }
  L.push('', `**Schemes.** light: ${c.colour?.schemes?.light ? 'yes' : 'no'}, dark: ${c.colour?.schemes?.dark ? 'yes' : 'no'}. ${c.colour?.schemes?.why}`, '');
  if (c.colour?.dataVisualisation) {
    const d = c.colour.dataVisualisation;
    L.push(`**Data.** ${d.series} series, ${d.ordering}. Without colour: ${d.distinguishableWithoutColour}`, '');
  }
  L.push(`**Genericness risk.** ${c.colour?.genericnessRisk}`, '');

  L.push('## Typography', '');
  for (const r of c.typography?.roles ?? []) {
    L.push(`### ${r.role}: ${r.family}`, '');
    L.push(`- source: ${r.source} (${r.licence})`);
    L.push(`- weights: ${list(r.weights)}${r.axes?.length ? `, axes ${list(r.axes)}` : ''}`);
    L.push(`- fallback: ${list(r.fallback)}, metric compatible: ${r.metricCompatible ? 'yes' : 'no'}`);
    L.push(`- languages: ${list(r.languages)}, loading: \`${r.loading}\`, line height ${r.lineHeight}`);
    L.push(`- why: ${r.why}`);
    L.push(`- genericness risk: ${r.genericnessRisk}`, '');
  }
  L.push('### Scale', '', '| step | size | line height | role |', '| --- | --- | --- | --- |');
  for (const s of c.typography?.scale ?? []) L.push(`| ${s.name} | ${s.size} | ${s.lineHeight} | ${s.role} |`);
  L.push('', `**Measure.** ${c.typography?.measure?.target} characters, band ${(c.typography?.measure?.band ?? []).join(' to ')}.`, '');
  L.push('### Stress', '', '| case | expected | result | verdict |', '| --- | --- | --- | --- |');
  for (const s of c.typography?.stress ?? []) L.push(`| ${s.case} | ${s.expected} | ${s.result ?? '-'} | ${s.verdict ?? 'not run'} |`);
  L.push('');

  L.push('## Layout', '');
  L.push(`**Path.** ${c.layout?.path}`, '');
  L.push(`- leading: ${list(c.layout?.leading)}`);
  L.push(`- supporting: ${list(c.layout?.supporting)}`);
  L.push(`- grouping: ${c.layout?.grouping}`);
  L.push(`- density: **${c.layout?.density}**, ${c.layout?.densityWhy}`);
  L.push(`- rhythm: base ${c.layout?.rhythm?.base}, steps ${list(c.layout?.rhythm?.steps)}`);
  L.push(`- topology: ${c.layout?.topology}`);
  L.push(`- container: ${c.layout?.container}`, '');
  L.push(`**First viewport.** ${c.layout?.firstViewportObject?.what} \`${c.layout?.firstViewportObject?.selector}\``);
  L.push(`**Signature.** ${c.layout?.signature?.what} \`${c.layout?.signature?.selector}\``, '');
  L.push('### At each width', '', '| width | becomes | departures |', '| --- | --- | --- |');
  for (const r of c.layout?.responsive ?? []) L.push(`| ${r.width} | ${r.becomes} | ${(r.departures ?? []).join('; ') || '-'} |`);
  L.push('', `**Focus order.** ${list(c.layout?.focusOrder)}`, '');
  L.push('### Stress', '', '| case | expected | result | verdict |', '| --- | --- | --- | --- |');
  for (const s of c.layout?.stress ?? []) L.push(`| ${s.case} | ${s.expected} | ${s.result ?? '-'} | ${s.verdict ?? 'not run'} |`);
  L.push('', `**Squint.** ${c.layout?.squint}`, '');

  const dep = [...(c.colour?.departures ?? []), ...(c.typography?.departures ?? []), ...(c.layout?.departures ?? [])];
  if (dep.length) {
    L.push('## Departures from the direction record', '');
    for (const d of dep) L.push(`- **${d.from}** to **${d.to}**: ${d.why}`);
    L.push('');
  }
  return L.join('\n');
}

/* The contract carries its own proof, and only this function writes it. A validation block
   filled in by hand is a claim that something ran; nothing about the file itself would say
   otherwise, so nothing but the runner may write it. */
function stamp(c, extra) {
  const pairs = c.colour?.pairs ?? [];
  return {
    checkedAt: new Date().toISOString().slice(0, 19) + 'Z',
    schemaVersion: schema.schemaVersion,
    pairsMeasured: pairs.filter((p) => typeof p.measured === 'number').length,
    pairsFailing: pairs.filter((p) => /^fails/.test(p.verdict ?? '')).length,
    ...(c.validation?.comparedAgainst ? { comparedAgainst: c.validation.comparedAgainst, comparedVerdict: c.validation.comparedVerdict } : {}),
    ...extra,
  };
}

/* ── staleness ───────────────────────────────────────────────────────────────
   Adapted from impeccable's checkDesignDrift (Apache-2.0), and adapted rather than copied
   in one specific way: it reports and never rewrites. Counting commits is a proxy and it
   says so. A document is not wrong because a number is large, and this has no opinion about
   whether the contract or the code is the one that moved. */
function staleness(root, file) {
  const git = (args) => {
    const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    return r.status === 0 ? r.stdout.trim() : null;
  };
  if (!git(['rev-parse', '--is-inside-work-tree'])) return null;
  const rel = relative(root, file).split(sep).join('/');
  const last = git(['log', '-1', '--format=%H', '--', rel]);
  if (!last) return null;
  const dirs = ['src', 'app', 'pages', 'components', 'site', 'styles', 'public']
    .filter((d) => existsSync(join(root, d)));
  if (!dirs.length) return null;
  const log = git(['log', '--oneline', `${last}..HEAD`, '--', ...dirs]);
  if (log === null) return null;
  const commits = log ? log.split('\n').filter(Boolean).length : 0;
  return { commits, dirs, since: git(['log', '-1', '--format=%ad', '--date=short', '--', rel]) };
}

/* ── compare, against the rendered page ──────────────────────────────────── */

async function compare(c, url) {
  let chromium;
  /* CommonJS resolved by file path exposes its exports under `default`, so a bare
     destructure gets undefined and the next line reads .launch of undefined. */
  try {
    const pw = await load('playwright');
    chromium = pw.chromium ?? pw.default?.chromium;
    if (!chromium) throw new Error('no chromium export');
  } catch {
    say('\n  contract compare needs playwright, and it is not installed here.');
    say('  npm i -D playwright && npx playwright install chromium');
    say('\n  VERDICT WITHHELD. Nothing was measured, so nothing is claimed.\n');
    return 3;
  }
  const browser = await chromium.launch();
  const findings = [];
  const held = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const stylesheetFailed = [];
    page.on('requestfailed', (r) => { if (r.resourceType() === 'stylesheet') stylesheetFailed.push(r.url()); });
    await page.goto(url, { waitUntil: 'networkidle' });

    /* The same guard the gate learned the hard way: a page whose stylesheets did not load
       is an unstyled document, and every measurement below would be a confident lie. */
    const sheets = await page.evaluate(() => ({
      linked: document.querySelectorAll('link[rel~="stylesheet"]').length,
      applied: [...document.styleSheets].filter((s) => { try { return s.cssRules.length > 0; } catch { return true; } }).length,
    }));
    if (stylesheetFailed.length || (sheets.linked > 0 && sheets.applied === 0)) {
      say('\n  the stylesheets did not load, so this is an unstyled document.');
      say('  Serve the build and pass --url, rather than pointing at files on disk.');
      say('\n  VERDICT WITHHELD.\n');
      return 3;
    }

    /* 1. Every primitive is declared, and renders as the value the contract states. */
    const declared = await page.evaluate((toks) => {
      const cs = getComputedStyle(document.documentElement);
      return Object.fromEntries(toks.map((t) => [t, cs.getPropertyValue(`--${t}`).trim()]));
    }, (c.colour?.primitives ?? []).map((p) => p.token));
    for (const p of c.colour?.primitives ?? []) {
      const got = declared[p.token];
      if (!got) { findings.push({ what: `--${p.token} is not declared on the page`, fix: 'declare it, or take it out of the contract' }); continue; }
      const d = distance(p.value, got);
      if (d === null) held.push(`--${p.token} renders as ${got}, which cannot be resolved here`);
      else if (d > 0.04) findings.push({ what: `--${p.token} renders as ${got}, and the contract says ${p.value}`, fix: 'one of the two is wrong, and the contract is the one that was agreed' });
    }

    /* 2. The named things render, and the first viewport object is in the first viewport. */
    for (const [name, thing] of [['first viewport object', c.layout?.firstViewportObject], ['signature', c.layout?.signature]]) {
      if (!thing?.selector) continue;
      const box = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top + scrollY, height: r.height, width: r.width };
      }, thing.selector).catch(() => null);
      if (!box) { findings.push({ what: `the ${name} selector ${thing.selector} matches nothing`, fix: 'the contract names a selector that is not in the page' }); continue; }
      if (box.width < 8 || box.height < 8) findings.push({ what: `the ${name} ${thing.selector} renders at ${Math.round(box.width)}x${Math.round(box.height)}`, fix: 'it is declared and it is not there' });
      if (name === 'first viewport object' && box.top > 900) {
        findings.push({ what: `the first viewport object starts at ${Math.round(box.top)}px, below the first screen`, fix: 'either it is not the first viewport object or the first screen is something else' });
      }
    }

    /* 3. Focus order, as a subsequence. Exact equality would refuse every page with a skip
          link, so the contract's order has to appear in the tab order in that order, and
          anything else the page also focuses is the page's business. */
    const tabbed = await page.evaluate(() => {
      const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return [...document.querySelectorAll(sel)]
        .filter((el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed')
        .map((el) => ({
          id: el.id ? `#${el.id}` : null,
          cls: [...el.classList].map((c) => `.${c}`),
          tag: el.tagName.toLowerCase(),
        }));
    });
    const matches = (want, el) => el.id === want || el.cls.includes(want) || el.tag === want
      || (want.startsWith('.') && el.cls.includes(want)) || (want.startsWith('#') && el.id === want);
    let i = 0;
    const missed = [];
    for (const want of (c.layout?.focusOrder ?? []).filter(Boolean)) {
      const found = tabbed.findIndex((el, j) => j >= i && matches(want, el));
      if (found === -1) missed.push(want); else i = found + 1;
    }
    if (missed.length) {
      findings.push({ what: `the focus order does not contain ${missed.join(', ')} in the declared order`,
        fix: 'the keyboard walks the page in a different order than the contract states' });
    }

    /* 4. Coarse geometry adaptation, and it is a proxy rather than a validation.

          The contract says in words what the layout becomes at 375, 768 and 1440. Nothing
          here reads those words. What this measures is that the leading elements do not sit
          in the same eight-pixel grid position at 375 and at 1440, which catches a page
          designed once and allowed to reflow and catches nothing finer than that. A page
          whose contract says "the drawing moves above the form and its annotation is
          redrawn" passes this by moving the drawing one grid cell, and the annotation is
          never looked at.

          A real validation needs a vocabulary the contract can declare and this can check:
          same-with-reason, reflow, reorder, collapse, split, replace, redraw, scroll. That
          is recorded as a v1.1 candidate in contract/schema.json and is deliberately not
          built here. Calling this a validation of the declared transformation would be the
          one thing the whole contract exists to stop. */
    const arrangements = {};
    for (const w of [375, 768, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(120);
      arrangements[w] = await page.evaluate((sels) => sels.map((s) => {
        const el = document.querySelector(s);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return [Math.round(r.left / 8), Math.round((r.top + scrollY) / 8), Math.round(r.width / 8)];
      }), (c.layout?.leading ?? []).filter(Boolean));
    }
    const shape = (w) => JSON.stringify(arrangements[w]);
    if (shape(375) === shape(1440) && (c.layout?.leading ?? []).filter(Boolean).length) {
      findings.push({ what: 'the leading elements sit in the same coarse position at 375 and at 1440',
        fix: 'the contract names a transformation at each width and the page performs no geometric change at all. This is a coarse proxy: passing it does not mean the declared transformation happened.' });
    }

    /* 5. The squint test, measured and reported, never gated. Downscale the first screen to
          a coarse grid and find the block that stands out most from its neighbours. If the
          first viewport object does not cover it, the thing the eye lands on is not the
          thing the contract says owns the screen. This is a proxy and it says so: it is a
          luminance measure, and a page can be right and fail it. */
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(120);
    const squint = await page.evaluate((sel) => {
      const COLS = 12, ROWS = 8, W = 1440, H = 900;
      /* Squinting does not blur backgrounds, it blurs ink. The first version of this
         measured background-colour only, and on a page whose sections are all one ground it
         reported every cell identical and separation zero, which is a measurement of nothing.
         So this counts ink: text, drawings, images and rules, weighted by how far each is
         from the ground it sits on. What is left when you squint is where the ink is. */
      const px = (v) => parseFloat(v) || 0;
      const lum = (c) => {
        const m = String(c).match(/[\d.]+/g);
        if (!m || m.length < 3) return null;
        if (m[3] !== undefined && Number(m[3]) === 0) return null;
        const f = (x) => { const s = x / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(+m[0]) + 0.7152 * f(+m[1]) + 0.0722 * f(+m[2]);
      };
      const groundOf = (node) => {
        for (let n = node; n && n !== document.documentElement; n = n.parentElement) {
          const l = lum(getComputedStyle(n).backgroundColor);
          if (l !== null) return l;
        }
        return lum(getComputedStyle(document.body).backgroundColor) ?? 1;
      };
      const cells = new Float64Array(ROWS * COLS);
      const add = (r, weight) => {
        if (r.top > H || r.bottom < 0 || r.width < 2 || r.height < 2) return;
        const c0 = Math.max(0, Math.floor(r.left / (W / COLS)));
        const c1 = Math.min(COLS - 1, Math.floor((r.right - 0.01) / (W / COLS)));
        const r0 = Math.max(0, Math.floor(Math.max(0, r.top) / (H / ROWS)));
        const r1 = Math.min(ROWS - 1, Math.floor((Math.min(H, r.bottom) - 0.01) / (H / ROWS)));
        const share = r.width * r.height / Math.max(1, (c1 - c0 + 1) * (r1 - r0 + 1));
        for (let y = r0; y <= r1; y++) for (let x = c0; x <= c1; x++) cells[y * COLS + x] += share * weight;
      };

      /* Text, measured per text node so a paragraph contributes its lines and not its box. */
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.nodeValue.trim()) continue;
        const parent = n.parentElement;
        if (!parent || parent.offsetParent === null) continue;
        const cs = getComputedStyle(parent);
        const ink = lum(cs.color);
        if (ink === null) continue;
        const ground = groundOf(parent);
        const weight = Math.abs(ink - ground) * Math.min(1, px(cs.fontWeight) / 400 || 1);
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) add(r, weight);
      }
      /* Drawings, images and anything with a ground of its own. */
      for (const node of document.querySelectorAll('svg, img, picture, canvas, video, hr, [style*="background-image"]')) {
        const r = node.getBoundingClientRect();
        const ground = groundOf(node.parentElement ?? document.body);
        const own = lum(getComputedStyle(node).backgroundColor);
        add(r, own === null ? 0.5 : Math.max(0.35, Math.abs(own - ground)));
      }

      const total = cells.reduce((a, b) => a + b, 0);
      if (total <= 0) return { measured: false };
      let bestI = 0;
      for (let i = 1; i < cells.length; i++) if (cells[i] > cells[bestI]) bestI = i;
      const bx = bestI % COLS, by = Math.floor(bestI / COLS);
      const share = Math.round((cells[bestI] / total) * 1000) / 10;
      const el = sel ? document.querySelector(sel) : null;
      const box = el ? el.getBoundingClientRect() : null;
      const inObject = box
        ? bx >= Math.floor(box.left / (W / COLS)) && bx <= Math.floor((box.right - 0.01) / (W / COLS))
          && by >= Math.floor(Math.max(0, box.top) / (H / ROWS)) && by <= Math.floor((Math.min(H, box.bottom) - 0.01) / (H / ROWS))
        : null;
      /* How much of the first screen's ink the declared object holds, which is the number
         look.md's "painted matter" asks about from the other side. */
      let objectShare = null;
      if (box) {
        let inside = 0;
        for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
          const cx = (x + 0.5) * (W / COLS), cy = (y + 0.5) * (H / ROWS);
          if (cx >= box.left && cx <= box.right && cy >= Math.max(0, box.top) && cy <= box.bottom) inside += cells[y * COLS + x];
        }
        objectShare = Math.round((inside / total) * 1000) / 10;
      }
      return { measured: true, cell: [bx, by], share, inObject, objectShare };
    }, c.layout?.firstViewportObject?.selector ?? null);

    say(`\n  contract compare ${url}\n`);
    say('  MEASURED, never gated');
    if (squint.measured) {
      say(`    squint: the heaviest block of ink in the first screen is column ${squint.cell[0] + 1} of 12, row ${squint.cell[1] + 1} of 8,`);
      say(`    holding ${squint.share} per cent of it. The declared first viewport object ${squint.inObject === null ? 'was not named' : squint.inObject ? 'covers that block' : 'does not cover that block'}`);
      if (squint.objectShare !== null) say(`    and holds ${squint.objectShare} per cent of the first screen's ink in total.`);
      say('    This is an ink-density proxy, not a rendering. A page can be right and fail it.');
    } else say('    squint: too few painted boxes in the first screen to measure. Not a finding either way.');
    say('');

    if (held.length) {
      say('  WITHHELD');
      for (const h of held) say(`    ${h}`);
      say('');
    }
    if (findings.length) {
      say('  THE BUILD DOES NOT MATCH ITS CONTRACT');
      for (const f of findings) say(`    ${f.what}\n      ${f.fix}`);
      say(`\n  ${findings.length} difference(s). The contract was agreed before the build; the build is what changed.\n`);
      return 1;
    }
    say('  the build matches its contract on every field this can measure\n');
    return held.length ? 3 : 0;
  } finally {
    await browser.close();
  }
}

/* ── stress ──────────────────────────────────────────────────────────────────
   The stress cases are written before they are run, and a case with an expectation and no
   result is a case nobody ran. This runs the three that a browser can decide: a heading at
   three times its length, the page at 200 per cent zoom, and the page with its own faces
   blocked. It writes what it measured and never writes the verdict for a case it did not
   run: "not run" is the honest value and it stays. */

async function stress(c, url) {
  let chromium;
  try {
    const pw = await load('playwright');
    chromium = pw.chromium ?? pw.default?.chromium;
    if (!chromium) throw new Error('no chromium export');
  } catch {
    say('\n  contract stress needs playwright, and it is not installed here.');
    say('  npm i -D playwright && npx playwright install chromium');
    say('\n  VERDICT WITHHELD. Nothing was measured, so nothing is claimed.\n');
    return 3;
  }

  const browser = await chromium.launch();
  const results = [];
  try {
    const measure = async (label, prepare, width = 1440) => {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(url, { waitUntil: 'networkidle' });
      if (prepare) await prepare(page);
      await page.waitForTimeout(150);
      const r = await page.evaluate((sels) => {
        const doc = document.documentElement;
        const overflow = Math.max(0, doc.scrollWidth - doc.clientWidth);
        const clipped = [...document.querySelectorAll('h1, h2, h3, p, li, label, button, a')]
          .filter((el) => el.offsetParent !== null)
          .filter((el) => el.scrollHeight > el.clientHeight + 2 && getComputedStyle(el).overflow !== 'visible').length;
        const boxes = sels.map((s) => {
          const el = document.querySelector(s);
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)];
        });
        return { overflow, clipped, boxes, height: doc.scrollHeight };
      }, (c.layout?.leading ?? []).filter(Boolean));
      await page.close();
      return { label, ...r };
    };

    const base = await measure('as it ships');

    /* A heading three times its length, in the page's own language. The text comes from the
       page rather than from a word list, so it stresses the faces the page actually uses. */
    const long = await measure('a heading three times its length', async (page) => {
      await page.evaluate(() => {
        const h = document.querySelector('h1, h2');
        if (h) h.textContent = `${h.textContent} ${h.textContent} ${h.textContent}`;
      });
    });

    /* 200 per cent zoom is 720 CSS pixels of a 1440 viewport, which is what WCAG 1.4.10
       asks about from the other direction. */
    const zoom = await measure('the page at 200 per cent zoom', null, 720);

    /* The faces blocked. Every family in the contract is overridden to a deliberately wide
       fallback, so the page is measured as a machine without them would see it. */
    const families = (c.typography?.roles ?? []).flatMap((r) => [r.family, ...(r.fallback ?? [])]);
    const fallback = await measure("the fallback stack, with the page's own faces blocked", async (page) => {
      await page.addStyleTag({ content: `* { font-family: "DejaVu Serif", "Liberation Serif", serif !important; }` });
    });

    const verdictOf = (r, name) => {
      if (r.overflow > 0) return { verdict: 'failed', result: `${r.overflow}px of horizontal overflow` };
      if (r.clipped > 0) return { verdict: 'failed', result: `${r.clipped} element(s) clipped their own content` };
      const grew = Math.round(((r.height - base.height) / base.height) * 100);
      return { verdict: 'held', result: `no overflow, nothing clipped, the page ${grew === 0 ? 'is the same height' : `grew ${grew} per cent taller`}` };
    };

    /* Anchored and specific. A loose /fallback/ also matched a case about glyph coverage,
       which is a different question a browser cannot answer, and writing a layout verdict
       onto it would have been the one thing this must never do. */
    /* A case about which glyphs a face carries is not a case about layout under a blocked
       face, and writing a layout verdict onto it would be the one thing this must never do. */
    const GLYPHS = /aeoe|degree sign|coverage|separator|thousands/i;
    for (const [r, match] of [
      [long, /three times its (own |expected )?length/i],
      [zoom, /200 per cent zoom/i],
      [fallback, /fallback stack/i],
    ]) {
      const v = verdictOf(r);
      results.push({ label: r.label, match, ...v });
    }

    say(`
  contract stress ${url}
`);
    say(`  ${families.length} families named in the contract, all overridden for the fallback case
`);
    for (const r of results) {
      say(`  ${r.verdict === 'held' ? 'held  ' : 'FAILED'}  ${r.label}`);
      say(`          ${r.result}`);
    }

    /* Write the results back onto the cases they answer, and only onto those. A case the
       contract wrote that this cannot run keeps "not run". */
    let written = 0;
    for (const bucket of [c.typography?.stress ?? [], c.layout?.stress ?? []]) {
      for (const item of bucket) {
        if (GLYPHS.test(item.case)) continue;
        const hit = results.find((r) => r.match.test(item.case));
        if (!hit) continue;
        item.result = hit.result;
        item.verdict = hit.verdict;
        written++;
      }
    }
    const unrun = [...(c.typography?.stress ?? []), ...(c.layout?.stress ?? [])]
      .filter((s) => (s.verdict ?? 'not run') === 'not run');
    say('');
    say(`  ${written} case(s) answered. ${unrun.length} still says "not run", which is what a case`);
    say('  nobody ran is called. A browser cannot decide them, and this does not pretend to.');
    for (const s of unrun) say(`    not run: ${s.case}`);
    say('');
    return results.some((r) => r.verdict === 'failed') ? 1 : 0;
  } finally {
    await browser.close();
  }
}

/* ── run ─────────────────────────────────────────────────────────────────── */

if (CMD === 'new') {
  const surface = argv[1];
  if (!['buy', 'operate', 'read', 'experience'].includes(surface)) {
    die(2, 'usage: contract.mjs new <buy|operate|read|experience> [--to <dir>]');
  }
  if (existsSync(CONTRACT) && !has('force')) {
    die(2, `${CONTRACT} exists. --force replaces it, after you have checked you have no answers in it.`);
  }
  const c = TEMPLATE(surface);
  const record = join(project, STATE_DIR, 'direction.md');
  if (existsSync(record)) {
    c.writtenAgainst.hash = createHash('sha256').update(await readFile(record)).digest('hex').slice(0, 16);
  }
  await mkdir(dirname(CONTRACT), { recursive: true });
  await writeFile(CONTRACT, `${JSON.stringify(c, null, 2)}\n`, 'utf8');
  say(`\n  wrote ${join(STATE_DIR, 'contract.json')}`);
  say('  Every field is empty and every empty field is a question. Fill it from the');
  say('  direction record and the subject, then run `contract.mjs check`.\n');
  process.exit(0);
}

if (CMD === 'check' || CMD === 'compare' || CMD === 'stress') {
  if (!existsSync(CONTRACT)) die(3, `no ${join(STATE_DIR, 'contract.json')}. Run \`contract.mjs new <surface>\` first.`);
  const c = JSON.parse(await readFile(CONTRACT, 'utf8'));
  if (c.schemaVersion !== schema.schemaVersion) {
    say(`\n  contract schema ${c.schemaVersion}, this package speaks ${schema.schemaVersion}.`);
    say('  Fields may have moved. Read it before trusting it.\n');
  }

  const record = join(project, STATE_DIR, 'direction.md');
  if (existsSync(record) && c.writtenAgainst?.hash) {
    const now = createHash('sha256').update(await readFile(record)).digest('hex').slice(0, 16);
    if (now !== c.writtenAgainst.hash) {
      note('writtenAgainst', `the direction record has changed since this contract was written (${c.writtenAgainst.hash} to ${now}). Read them against each other; this does not rewrite either.`);
    }
  }

  const drift = staleness(project, CONTRACT);
  if (drift && drift.commits >= 25) {
    note('staleness', `${drift.commits} commits have touched ${drift.dirs.join(', ')} since this contract was last written`
      + `${drift.since ? ` (${drift.since})` : ''}. That counts commits, not contradictions: it says the contract is worth `
      + 're-reading against the code, not that either is wrong. Nothing here rewrites either of them.');
  }

  const { problems: probs, notes: ns } = validate(c);

  if (CMD === 'check') {
    say(`\n  design contract, ${c.surface}\n`);
    if (ns.length) {
      say('  WORTH KNOWING');
      for (const n of ns) say(`    ${n.where}: ${n.what}`);
      say('');
    }
    const measured = (c.colour?.pairs ?? []).filter((p) => typeof p.measured === 'number');
    if (measured.length) {
      say('  CONTRAST, MEASURED');
      for (const p of measured) say(`    ${String(p.measured).padStart(6)}:1  ${p.name.padEnd(28)} ${p.verdict}`);
      say('');
    }
    if (probs.length) {
      say('  NOT READY');
      for (const p of probs) say(`    ${p.where}\n      ${p.what}${p.fix ? `\n      ${p.fix}` : ''}`);
      say(`\n  ${probs.length} thing(s) unanswered or wrong. The contract is not a form; an empty field is a question.\n`);
      if (has('write')) {
        await writeFile(CONTRACT, `${JSON.stringify(c, null, 2)}\n`, 'utf8');
        await writeFile(READABLE, readable(c), 'utf8');
      }
      process.exit(3);
    }
    if (has('write')) {
      c.validation = stamp(c, {});
      await writeFile(CONTRACT, `${JSON.stringify(c, null, 2)}\n`, 'utf8');
      await writeFile(READABLE, readable(c), 'utf8');
      say(`  wrote ${join(STATE_DIR, 'CONTRACT.md')} and recorded every contrast result\n`);
    }
    say('  every field is answered and every pair clears its floor\n');
    process.exit(0);
  }

  const url = flag('url');
  if (!url) die(2, `usage: contract.mjs ${CMD} --url <url>`);
  if (probs.length) {
    say(`\n  ${probs.length} thing(s) in the contract are unanswered or wrong. Comparing a build`);
    say('  against an incomplete contract measures nothing. Run `check` first.\n');
    process.exit(3);
  }
  if (CMD === 'stress') {
    const code = await stress(c, url);
    if (has('write')) {
      await writeFile(CONTRACT, `${JSON.stringify(c, null, 2)}
`, 'utf8');
      await writeFile(READABLE, readable(c), 'utf8');
    }
    process.exit(code);
  }

  const code = await compare(c, url);
  if (has('write')) {
    c.validation = stamp(c, {
      comparedAgainst: url,
      comparedVerdict: code === 0 ? 'matches' : code === 1 ? 'differs' : 'withheld',
    });
    await writeFile(CONTRACT, `${JSON.stringify(c, null, 2)}
`, 'utf8');
    await writeFile(READABLE, readable(c), 'utf8');
  }
  process.exit(code);
}

die(2, `usage:
  contract.mjs new <buy|operate|read|experience> [--to <dir>] [--force]
  contract.mjs check [--write] [--to <dir>]
  contract.mjs compare --url <url> [--to <dir>]
  contract.mjs stress  --url <url> [--write] [--to <dir>]`);
