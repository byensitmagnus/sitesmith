#!/usr/bin/env node
/**
 * The design contract, against work it must accept and work it must refuse.
 * Original work, MIT.
 *
 *   node scripts/test-contract.mjs
 *
 * Fixture-shaped, like the gate's. Every case here is either a contract that must check
 * clean or one specific way of being wrong, and three of them are ways the pilot's own
 * contract was wrong on the first pass. A validator with only passing fixtures proves it
 * can read JSON.
 */

import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { parse, contrast, flatten, distance, hex } from './colour.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI = join(HERE, 'contract.mjs');

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${detail && !ok ? `\n          ${detail}` : ''}`);
  if (!ok) failed++;
};

/* ── colour maths ────────────────────────────────────────────────────────── */

console.log('\n  colour\n');
check('oklch resolves', hex(parse('oklch(0.7 0.15 145)')) === '#5bb661', hex(parse('oklch(0.7 0.15 145)') ?? {}));
check('a percentage lightness is the same colour', hex(parse('oklch(70% 0.15 145)')) === hex(parse('oklch(0.7 0.15 145)')));
check('black on white is 21', contrast('#000', '#fff') === 21);
check('an unresolvable side gives null, not a number', contrast('var(--x)', '#fff') === null);
check('a translucent foreground is composited over its background',
  contrast('rgba(28,36,38,0.34)', '#dbe3dd') === 1.99, String(contrast('rgba(28,36,38,0.34)', '#dbe3dd')));
check('and the opaque reading of the same colour is different',
  contrast('#1c2426', '#dbe3dd') === 12.07, String(contrast('#1c2426', '#dbe3dd')));
/* Worked by hand, because a literal copied from the code it is checking proves nothing.
   #dbe3dd is (219,227,221). White at 55 per cent: 255*0.55 + 219*0.45 = 238.8, and the same
   for the other two channels, giving (239,242,240). Red chalk at 9 per cent over that:
   163*0.09 + 239*0.91 = 232.2, 58*0.09 + 242*0.91 = 225.4, 30*0.09 + 240*0.91 = 221.1,
   which is (232,225,221) and #e8e1dd. */
check('a stack flattens back to front',
  hex(flatten(['#dbe3dd', 'rgba(255,255,255,0.55)', 'rgba(163,58,30,0.09)'])) === '#e8e1dd',
  hex(flatten(['#dbe3dd', 'rgba(255,255,255,0.55)', 'rgba(163,58,30,0.09)']) ?? {}));
check('a stack whose base is translucent is refused', flatten(['rgba(0,0,0,0.5)', '#fff']) === null);
check('an oklch value and its own sRGB rendering are the same colour',
  distance('oklch(0.7 0.15 145)', '#5bb661') === 0);
check('8-digit hex carries alpha', Math.round((parse('#1c242657')?.a ?? 0) * 100) === 34);

/* ── the validator ───────────────────────────────────────────────────────── */

const base = () => ({
  v: 1,
  schemaVersion: 1,
  surface: 'buy',
  subject: 'A fixture',
  writtenAgainst: { record: '.sitesmith/direction.md', hash: 'fixture' },
  colour: {
    strategy: 'committed',
    strategyWhy: 'because the fixture says so',
    sources: [
      { name: 'ground', material: 'a real material', value: '#dbe3dd', why: 'it is the thing' },
      { name: 'ink', material: 'a pencil line', value: '#1c2426', why: 'it is the mark' },
      { name: 'edge', material: 'glass seen edge on', value: '#16584a', why: 'the action' },
      { name: 'white', material: 'a fresh cut edge', value: '#ffffff', why: 'what sits on the action' },
    ],
    primitives: [
      { token: 'ground', value: '#dbe3dd', from: 'ground' },
      { token: 'ink', value: '#1c2426', from: 'ink' },
      { token: 'edge', value: '#16584a', from: 'edge' },
      { token: 'white', value: '#ffffff', from: 'white' },
      { token: 'veil', value: 'rgba(255,255,255,0.55)', from: 'derived: white at 55 per cent' },
    ],
    roles: { background: 'ground', foreground: 'ink', action: 'edge', onAction: 'white', focusRing: 'edge', border: 'ink' },
    pairs: [
      { name: 'body', foreground: 'ink', background: 'ground', use: 'text', minimum: 'text', state: 'rest' },
      { name: 'action', foreground: 'white', background: 'edge', use: 'the button', minimum: 'text', state: 'rest' },
      { name: 'ring', foreground: 'edge', background: 'ground', use: 'the focus ring', minimum: 'nonText', state: 'focus' },
    ],
    states: {
      rest: { changes: 'nothing moves', carriedBy: 'the rule under the field' },
      focus: { changes: 'a 3px outline', carriedBy: 'the outline thickness' },
    },
    schemes: { light: true, dark: false, why: 'Read once, in daylight, next to the broken thing it is about. Nobody in that scene ever sees a dark scheme.' },
    genericnessRisk: 'a pale ground is arrivable at by anyone',
  },
  typography: {
    roles: [{
      role: 'body', family: 'Sitka Text', source: 'system', licence: 'system font',
      weights: [400], why: 'a trade manual reads like this', fallback: ['Georgia', 'serif'],
      metricCompatible: true, languages: ['da'], loading: 'system', lineHeight: 1.55,
      genericnessRisk: 'Georgia is the most-used screen serif there is',
    }],
    scale: [
      { name: 't1', size: '15px', lineHeight: 1.5, role: 'captions' },
      { name: 't2', size: '17px', lineHeight: 1.55, role: 'body' },
      { name: 't3', size: '27px', lineHeight: 1.2, role: 'headings' },
    ],
    measure: { target: 66, band: [45, 80] },
    stress: [{ case: 'a long heading', expected: 'it wraps' }],
    genericnessRisk: 'system faces are what everyone has',
  },
  layout: {
    path: 'see it, enter it, read the total',
    leading: ['.drawing'],
    supporting: ['.list'],
    grouping: 'measurements together, facts apart',
    density: 'measured',
    densityWhy: 'a docket is dense where the numbers are',
    rhythm: { base: '8px', steps: ['8px', '16px', '40px'] },
    topology: 'a drawing and a form beside it, one column below',
    firstViewportObject: { what: 'the drawing', selector: '.drawing' },
    signature: { what: 'the drawing', selector: '.drawing' },
    responsive: [
      { width: 375, becomes: 'one column, drawing on top' },
      { width: 768, becomes: 'one column, table becomes a table' },
      { width: 1440, becomes: 'two columns, drawing on the left' },
    ],
    container: 'stops at 1240 and centres',
    focusOrder: ['.skip', '.drawing'],
    stress: [{ case: 'empty', expected: 'the drawing waits' }],
    squint: 'a pale field with one dark band across it',
  },
});

async function run(mutate, label, wantCode, wantText) {
  const dir = await mkdtemp(join(tmpdir(), 'sitesmith-contract-'));
  try {
    const c = base();
    mutate(c);
    await mkdir(join(dir, '.sitesmith'), { recursive: true });
    await writeFile(join(dir, '.sitesmith', 'contract.json'), JSON.stringify(c, null, 2));
    const r = spawnSync(process.execPath, [CLI, 'check', '--to', dir], { encoding: 'utf8' });
    const out = `${r.stdout}${r.stderr}`;
    const codeOk = r.status === wantCode;
    const textOk = !wantText || new RegExp(wantText, 'i').test(out);
    check(label, codeOk && textOk, `exit ${r.status}, wanted ${wantCode}${wantText ? `, and text matching /${wantText}/` : ''}\n${out.split('\n').slice(-14).join('\n')}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

console.log('\n  the validator, against work it must accept\n');
await run(() => {}, 'a complete contract checks clean', 0);

console.log('\n  and work it must refuse\n');
await run((c) => { c.colour.sources[0].material = ''; },
  'a source colour with no material', 3, 'material');
await run((c) => { c.colour.primitives[0].from = 'the brand'; },
  'a primitive from a source that does not exist', 3, 'names no source colour');
await run((c) => { c.colour.roles.action = 'nonesuch'; },
  'a role pointing at a primitive that is not declared', 3, 'not a declared primitive');
await run((c) => { c.colour.primitives[1].value = '#9aa3a5'; },
  'a pair below its contrast floor', 3, 'against a 4.5:1 floor');
await run((c) => {
  c.colour.pairs.push({ name: 'veiled', foreground: 'ink', background: 'veil', use: 'a panel', minimum: 'text', state: 'rest' });
}, 'a translucent background with no backdrop', 3, 'no backdrop is named');
await run((c) => {
  c.colour.pairs.push({ name: 'veiled', foreground: 'ink', background: 'veil', backdrop: ['ground'], use: 'a panel', minimum: 'text', state: 'rest' });
}, 'and the same pair with its backdrop stated is measured and passes', 0);
await run((c) => { c.colour.pairs = c.colour.pairs.filter((p) => p.state !== 'focus'); },
  'no pair painted in the focus state', 3, 'focus state');
await run((c) => { c.colour.states.focus.carriedBy = ''; },
  'a state carried by colour alone', 3, 'besides colour');
/* Both schemes claimed, and no pair says which one it belongs to. The check used to fire
   on `dark: true` alone, which is right for a light page that adds a dark scheme and wrong
   for a page that IS dark: the lock keeper's console has no light scheme at all, every pair
   in it is a dark pair, and not one of them says so. It met that page and refused it. */
await run((c) => { c.colour.schemes.dark = true; },
  'both schemes claimed and no pair names the dark one', 3, 'no pair names the dark one');
await run((c) => {
  c.colour.schemes.light = false;
  c.colour.schemes.dark = true;
  c.colour.schemes.why = 'Read at 02:00 in a room with the lights down, by someone about to walk out into the dark. A light screen would cost them their night vision.';
}, 'a page that is entirely dark, with no light scheme, is not refused for it', 0);
await run((c) => { c.colour.schemes.light = false; c.colour.schemes.dark = false; },
  'neither scheme claimed', 3, 'neither light nor dark');
await run((c) => { c.colour.schemes.why = 'it looks better'; },
  'one scheme claimed with a thin reason', 3, 'reason is thin');
await run((c) => { c.typography.roles[0].fallback = ['Georgia']; },
  'a fallback stack that does not end in a generic family', 3, 'generic family');
await run((c) => { c.typography.roles[0].role = 'display'; },
  'no body role', 3, 'no body role');
await run((c) => { c.layout.responsive.forEach((r) => { r.becomes = 'it stacks'; }); },
  'three widths that say the same thing', 3, 'same thing');
await run((c) => { c.layout.responsive[0].width = 320; },
  'a width that verify does not render', 3, '375, 768 and 1440');
await run((c) => { c.colour.primitives[2].fallback = '#ff0000'; },
  'a fallback that is a different colour from the value it stands for', 3, 'different colour');
await run((c) => { c.layout.squint = ''; },
  'the squint test unanswered', 3, 'squint');

console.log(`\n  ${failed ? `${failed} failing` : 'the contract accepts what it must and refuses what it must'}\n`);
process.exit(failed ? 1 : 0);
