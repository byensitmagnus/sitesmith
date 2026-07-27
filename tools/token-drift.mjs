#!/usr/bin/env node
/**
 * How disciplined is a page's design system, really? Original work, MIT.
 *
 *   node tools/token-drift.mjs benchmarks/09-data-entry/index.html
 *   node tools/token-drift.mjs "benchmarks/*\/index.html" --json
 *
 * A page can pass every accessibility and layout check and still be built from
 * fourteen greys and nine corner radii chosen one at a time. That is what makes
 * a site feel unfinished, and no existing check in this repository looks at it.
 *
 * For each dimension the report gives two numbers:
 *   distinct  how many different values the page uses
 *   loose     how many of those appear only as literals, never behind a token
 *
 * A high `distinct` is not automatically wrong — a chart needs many colours. A
 * high `loose` is: it means the value was chosen at the call site, which is
 * exactly the decision a design system exists to have already made.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { relative, resolve } from 'node:path';
import { expand } from './lib/files.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const css = (html) => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');

/** Declared custom properties: `--name: value`. These are the system. */
function declaredTokens(sheet) {
  const map = new Map();
  for (const m of sheet.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) {
    map.set(m[1], m[2].trim());
  }
  return map;
}

/** Values that appear as a literal in a declaration, not as var(--x). */
function literals(sheet, prop, valueRx) {
  const out = [];
  const rx = new RegExp(`(^|[;{\\s])(${prop})\\s*:\\s*([^;}]+)`, 'gi');
  for (const m of sheet.matchAll(rx)) {
    const value = m[3].trim();
    if (/var\(/.test(value)) continue;
    for (const v of value.matchAll(valueRx)) out.push(v[0].toLowerCase());
  }
  return out;
}

const HEX = /#[0-9a-f]{3,8}\b/gi;
const LEN = /-?\d*\.?\d+(px|rem|em)\b/gi;
/**
 * 0 and hairlines are not spacing decisions — `padding: 0` and `1px` borders
 * would inflate every count without saying anything about the scale. Excluding
 * them makes the spacing number mean "a gap someone picked".
 */
const isHairline = (v) => /^-?[01](px|rem|em)$/.test(v) || /^-?0/.test(v);

function analyse(html) {
  const sheet = css(html);
  const tokens = declaredTokens(sheet);
  const tokenValues = [...tokens.values()].join(' ');

  // Colours anywhere in the sheet, minus the ones a token already names.
  const allColours = new Set([...sheet.matchAll(HEX)].map((m) => m[0].toLowerCase()));
  const tokenColours = new Set([...tokenValues.matchAll(HEX)].map((m) => m[0].toLowerCase()));
  const looseColours = [...allColours].filter((c) => !tokenColours.has(c));

  const dim = (prop, rx, drop = () => false) => {
    const lit = literals(sheet, prop, rx).filter((v) => !drop(v));
    const all = new Set(
      [...sheet.matchAll(new RegExp(`${prop}\\s*:\\s*([^;}]+)`, 'gi'))]
        .flatMap((m) => [...m[1].matchAll(rx)].map((v) => v[0].toLowerCase()))
        .filter((v) => !drop(v)),
    );
    return { distinct: all.size, loose: new Set(lit).size };
  };

  return {
    tokensDeclared: tokens.size,
    colour: { distinct: allColours.size, loose: looseColours.length },
    radius: dim('border-radius', LEN),
    fontSize: dim('font-size', LEN),
    // Padding and margin together are the spacing scale in practice.
    spacing: (() => {
      const vals = new Set(), loose = new Set();
      for (const prop of ['padding', 'margin', 'gap', 'row-gap', 'column-gap']) {
        const d = dim(prop, LEN, isHairline);
        for (const v of literals(sheet, prop, LEN).filter((v) => !isHairline(v))) loose.add(v);
        for (const m of sheet.matchAll(new RegExp(`${prop}\\s*:\\s*([^;}]+)`, 'gi')))
          for (const v of m[1].matchAll(LEN)) if (!isHairline(v[0])) vals.add(v[0].toLowerCase());
        void d;
      }
      return { distinct: vals.size, loose: loose.size };
    })(),
    shadow: dim('box-shadow', /\d+px/g),
    families: new Set(
      [...sheet.matchAll(/font-family\s*:\s*([^;}]+)/gi)]
        .map((m) => m[1].trim())
        .filter((v) => !/var\(/.test(v)),
    ).size,
  };
}

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const patterns = argv.filter((a) => !a.startsWith('--'));
if (!patterns.length) {
  console.error('usage: node tools/token-drift.mjs <file-or-glob>... [--json]');
  process.exit(2);
}

const files = await expand(patterns, ROOT);

const rows = [];
for (const f of files.sort()) {
  rows.push({ file: relative(ROOT, resolve(ROOT, f)).replace(/\\/g, '/'), ...analyse(await readFile(resolve(ROOT, f), 'utf8')) });
}

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  const name = (f) => f.replace('benchmarks/', '').replace('/index.html', '');
  const pad = Math.max(...rows.map((r) => name(r.file).length));
  console.log(`\n  token discipline — distinct values, and how many are loose literals\n`);
  console.log(
    `  ${'page'.padEnd(pad)}  tokens  colour     radius     spacing    font-size  shadow   families`,
  );
  const cell = (d) => `${String(d.distinct).padStart(2)}/${String(d.loose).padStart(2)}`.padEnd(9);
  for (const r of rows) {
    console.log(
      `  ${name(r.file).padEnd(pad)}  ${String(r.tokensDeclared).padStart(6)}  ` +
        `${cell(r.colour)}  ${cell(r.radius)}  ${cell(r.spacing)}  ${cell(r.fontSize)}  ` +
        `${cell(r.shadow)} ${String(r.families).padStart(5)}`,
    );
  }
  console.log(`\n  each cell is distinct/loose. loose = the value was chosen at the call site.\n`);
}
