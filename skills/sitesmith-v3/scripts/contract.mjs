#!/usr/bin/env node
/**
 * Design Contract v1: write it, check it, and compare it against what was built.
 * Original work, MIT.
 *
 *   node <skill>/scripts/contract.mjs new <surface>        write the template
 *   node <skill>/scripts/contract.mjs check [--write]      validate; --write records contrast
 *   node <skill>/scripts/contract.mjs compare --url <url>  contract against the rendered page
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
import { fileURLToPath } from 'node:url';
import { join, dirname, resolve } from 'node:path';
import { parse as parseColour, contrast, distance, hex, AA } from './colour.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
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
    pairs: [{ name: '', foreground: '', background: '', use: '', minimum: 'text' }],
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
    const ratio = contrast(fg.value, bg.value);
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

  /* Dark, if it is claimed. A scheme claimed and unpopulated is worse than one not claimed:
     it reads as covered. */
  if (c.colour?.schemes?.dark === true) {
    const darkPairs = (c.colour.pairs ?? []).filter((p) => /dark/i.test(p.use ?? '') || /dark/i.test(p.name ?? ''));
    if (!darkPairs.length) {
      bad('colour.schemes.dark', 'claimed, and no pair names a dark state',
        'add the pairs the dark scheme actually uses, or set dark to false and say why in schemes.why');
    }
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
  L.push('| pair | foreground on background | floor | measured | verdict |', '| --- | --- | --- | --- | --- |');
  for (const p of c.colour?.pairs ?? []) {
    L.push(`| ${p.name} | \`--${p.foreground}\` on \`--${p.background}\` | ${p.minimum} | ${p.measured ?? '-'}:1 | ${p.verdict ?? '-'} |`);
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

/* ── compare, against the rendered page ──────────────────────────────────── */

async function compare(c, url) {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch {
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

    /* 4. Structural adaptation. The contract says what the layout becomes at each width;
          this measures whether it becomes anything at all. Three widths that produce the
          same arrangement of the leading elements is a page that was designed once and
          allowed to reflow, which is the thing "responsive" is usually used to mean. */
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
      findings.push({ what: 'the leading elements sit in the same arrangement at 375 and at 1440',
        fix: 'the contract names a transformation at each width and the page performs none' });
    }

    /* 5. The squint test, measured and reported, never gated. Downscale the first screen to
          a coarse grid and find the block that stands out most from its neighbours. If the
          first viewport object does not cover it, the thing the eye lands on is not the
          thing the contract says owns the screen. This is a proxy and it says so: it is a
          luminance measure, and a page can be right and fail it. */
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(120);
    const squint = await page.evaluate(async (sel) => {
      const COLS = 12, ROWS = 8;
      const el = sel ? document.querySelector(sel) : null;
      const box = el ? el.getBoundingClientRect() : null;
      /* No canvas readback of the page is possible without a screenshot, so the proxy is
         built from the elements themselves: every painted box contributes its own area's
         luminance to the cells it covers. Coarse on purpose. */
      const cells = Array.from({ length: ROWS * COLS }, () => []);
      const lum = (c) => {
        const m = c.match(/\d+(\.\d+)?/g);
        if (!m || m.length < 3) return null;
        const [r, g, b] = m.map(Number);
        if (m[3] !== undefined && Number(m[3]) === 0) return null;
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      };
      for (const node of document.querySelectorAll('body *')) {
        const r = node.getBoundingClientRect();
        if (r.top > 900 || r.bottom < 0 || r.width < 12 || r.height < 12) continue;
        const cs = getComputedStyle(node);
        const l = lum(cs.backgroundColor);
        if (l === null) continue;
        const c0 = Math.max(0, Math.floor(r.left / (1440 / COLS)));
        const c1 = Math.min(COLS - 1, Math.floor(r.right / (1440 / COLS)));
        const r0 = Math.max(0, Math.floor(Math.max(0, r.top) / (900 / ROWS)));
        const r1 = Math.min(ROWS - 1, Math.floor(Math.min(900, r.bottom) / (900 / ROWS)));
        for (let y = r0; y <= r1; y++) for (let x = c0; x <= c1; x++) cells[y * COLS + x].push(l);
      }
      const grid = cells.map((xs) => (xs.length ? xs.at(-1) : null));
      const known = grid.filter((v) => v !== null);
      if (known.length < 8) return { measured: false };
      const mean = known.reduce((a, b) => a + b, 0) / known.length;
      let best = -1, bestI = -1;
      grid.forEach((v, i) => { if (v === null) return; const d = Math.abs(v - mean); if (d > best) { best = d; bestI = i; } });
      const bx = bestI % COLS, by = Math.floor(bestI / COLS);
      const inObject = box
        ? bx >= Math.floor(box.left / (1440 / COLS)) && bx <= Math.floor(box.right / (1440 / COLS))
          && by >= Math.floor(Math.max(0, box.top) / (900 / ROWS)) && by <= Math.floor(Math.min(900, box.bottom) / (900 / ROWS))
        : null;
      return { measured: true, cell: [bx, by], separation: Math.round(best * 100) / 100, inObject };
    }, c.layout?.firstViewportObject?.selector ?? null);

    say(`\n  contract compare ${url}\n`);
    say('  MEASURED, never gated');
    if (squint.measured) {
      say(`    squint: the block that stands out most in the first screen is column ${squint.cell[0] + 1}, row ${squint.cell[1] + 1},`);
      say(`    ${squint.separation} from the mean. The declared first viewport object ${squint.inObject === null ? 'was not named' : squint.inObject ? 'covers it' : 'does not cover it'}.`);
      say('    This is a luminance proxy on painted boxes. A page can be right and fail it.');
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

if (CMD === 'check' || CMD === 'compare') {
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
      await writeFile(CONTRACT, `${JSON.stringify(c, null, 2)}\n`, 'utf8');
      await writeFile(READABLE, readable(c), 'utf8');
      say(`  wrote ${join(STATE_DIR, 'CONTRACT.md')} and recorded every contrast result\n`);
    }
    say('  every field is answered and every pair clears its floor\n');
    process.exit(0);
  }

  const url = flag('url');
  if (!url) die(2, 'usage: contract.mjs compare --url <url>');
  if (probs.length) {
    say(`\n  ${probs.length} thing(s) in the contract are unanswered or wrong. Comparing a build`);
    say('  against an incomplete contract measures nothing. Run `check` first.\n');
    process.exit(3);
  }
  process.exit(await compare(c, url));
}

die(2, `usage:
  contract.mjs new <buy|operate|read|experience> [--to <dir>] [--force]
  contract.mjs check [--write] [--to <dir>]
  contract.mjs compare --url <url> [--to <dir>]`);
