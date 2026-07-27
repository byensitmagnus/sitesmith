#!/usr/bin/env node
/**
 * How disciplined is a page's design system, really? Original work, MIT.
 *
 *   node scripts/token-drift.mjs "src/**\/*.html"
 *   node scripts/token-drift.mjs index.html --contract DESIGN-SYSTEM.md
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

import { readFile, readdir } from 'node:fs/promises';
import { relative, resolve, join, sep } from 'node:path';

const ROOT = process.cwd();

/* A ten-line glob, inlined so this script has no imports beyond node: and can be
   copied into a project on its own, like verify.mjs. fs/promises.glob is Node 22. */
const SKIP = new Set(['.git', 'node_modules', '.sitesmith', '__pycache__', 'dist', 'build']);
async function walk(dir, base, out) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, base, out);
    else out.push(full.slice(base.length + 1).split(sep).join('/'));
  }
  return out;
}
async function expand(patterns, root) {
  const base = resolve(root);
  const literal = patterns.filter((p) => !p.includes('*'));
  const globs = patterns
    .filter((p) => p.includes('*'))
    .map((p) => new RegExp(`^${p.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')}$`));
  if (!globs.length) return [...new Set(literal)].sort();
  const all = await walk(base, base, []);
  return [...new Set([...literal, ...all.filter((f) => globs.some((rx) => rx.test(f)))])].sort();
}

const css = (html) => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');

/**
 * Declared custom properties: `--name: value`. These are the system.
 *
 * Every value, not the last one. A token declared once in `:root` and again in
 * the dark-mode block has two values, and keying a Map by name drops the first —
 * which made every light-mode colour on a themed page look undeclared.
 */
function declaredTokens(sheet) {
  const map = new Map();
  for (const m of sheet.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) {
    const name = m[1];
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(m[2].trim());
  }
  return map;
}

/** Flatten a token map to the set of values it declares, across all schemes. */
const allTokenValues = (tokens) => [...tokens.values()].flat().join(' ');

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
  const tokenValues = allTokenValues(tokens);

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

/* ── contract mode ─────────────────────────────────────────────────────────
   With --contract the question changes from "how loose is this page" to "did
   this page use a value its project never declared". That is the check that
   makes a design system real rather than aspirational. */

const REQUIRED_GROUPS = {
  spacing: /^--space-/,
  type: /^--text-/,
  shape: /^--radius-/,
  elevation: /^--elev-/,
  container: /^--container\b/,
  families: /^--font-/,
  motion: /^--motion-/,
  colour: /^--(bg|surface|ink|line|accent|on-accent)\b/,
};

/** Values a page may use without declaring: they carry no design decision. */
const UTILITY = /^(0|0px|0rem|1px|-1px|2px|50%|100%|auto|none|inherit|100vh|100dvh|100vw)$/;

function contractTokens(md) {
  const block = md.match(/```css\s+contract\s*\n([\s\S]*?)```/);
  if (!block) return null;
  return declaredTokens(block[1]);
}

/**
 * Values the contract documents as deliberate exceptions, from the "One-off values"
 * table. A token set is a vocabulary, not a cage: an optical offset or a 1.5px rule
 * is a decision, and a checker that forbids decisions produces consistent dead sites.
 * The reason column is for a human; the checker only needs the value.
 */
function contractOneOffs(md) {
  const section = md.match(/##\s*\d*\.?\s*One-off values[\s\S]*?(?=\n##\s|\n*$)/i);
  const out = new Set();
  if (!section) return out;
  for (const row of section[0].matchAll(/^\|\s*`([^`]+)`\s*\|/gm)) {
    out.add(row[1].trim().toLowerCase());
  }
  return out;
}

function checkAgainstContract(html, tokens, oneOffs = new Set()) {
  const sheet = css(html);
  const declaredValues = new Set(oneOffs);
  for (const v of [...tokens.values()].flat()) {
    declaredValues.add(v.toLowerCase());
    for (const m of v.matchAll(HEX)) declaredValues.add(m[0].toLowerCase());
    for (const m of v.matchAll(LEN)) declaredValues.add(m[0].toLowerCase());
  }

  const undeclared = new Map();
  // Deliberately not width/height/inset. A control's height is a component
  // decision and lives in part 2 of the contract, in prose. Tokenising every
  // dimension produces a contract nobody writes. These seven are the ones a
  // design system genuinely owns.
  const PROPS = 'color|background|background-color|border-color|fill|stroke|padding|margin|gap|row-gap|column-gap|border-radius|font-size|box-shadow';
  for (const m of sheet.matchAll(new RegExp(`(^|[;{\\s])(${PROPS})\\s*:\\s*([^;}]+)`, 'gi'))) {
    const prop = m[2].toLowerCase();
    const value = m[3].trim();
    if (/var\(|calc\(|clamp\(|min\(|max\(|currentColor|transparent/i.test(value)) continue;
    for (const rx of [HEX, LEN]) {
      for (const v of value.matchAll(rx)) {
        const lit = v[0].toLowerCase();
        if (UTILITY.test(lit) || declaredValues.has(lit)) continue;
        const key = `${prop}: ${lit}`;
        undeclared.set(key, (undeclared.get(key) ?? 0) + 1);
      }
    }
  }

  const names = [...tokens.keys()];
  const missing = Object.entries(REQUIRED_GROUPS)
    .filter(([, rx]) => !names.some((n) => rx.test(n)))
    .map(([group]) => group);
  const unused = names.filter((n) => !sheet.includes(`var(${n})`));

  return { undeclared: [...undeclared.entries()].sort((a, b) => b[1] - a[1]), missing, unused };
}

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const contractPath = (() => {
  const i = argv.indexOf('--contract');
  return i === -1 ? null : argv[i + 1];
})();
const patterns = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--contract');
if (!patterns.length) {
  console.error('usage: node tools/token-drift.mjs <file-or-glob>... [--json]');
  process.exit(2);
}

const files = await expand(patterns, ROOT);

if (contractPath) {
  const md = await readFile(resolve(ROOT, contractPath), 'utf8');
  const tokens = contractTokens(md);
  if (!tokens) {
    console.error(`${contractPath} has no \`\`\`css contract block — see references/12-design-system.md`);
    process.exit(2);
  }

  const oneOffs = contractOneOffs(md);
  const results = [];
  for (const f of files) {
    const rel = relative(ROOT, resolve(ROOT, f)).replace(/\\/g, '/');
    results.push({
      file: rel,
      ...checkAgainstContract(await readFile(resolve(ROOT, f), 'utf8'), tokens, oneOffs),
    });
  }
  const missing = results[0]?.missing ?? [];
  const drift = results.reduce((n, r) => n + r.undeclared.reduce((m, [, c]) => m + c, 0), 0);

  if (asJson) {
    console.log(JSON.stringify({ contract: contractPath, tokens: tokens.size, missing, results }, null, 2));
  } else {
    console.log(`\n  contract: ${contractPath} — ${tokens.size} tokens\n`);
    if (missing.length) {
      console.log(`  incomplete contract, missing group(s): ${missing.join(', ')}`);
      console.log(`  a project that needs none of a group declares it as none and says why\n`);
    }
    for (const r of results) {
      const n = r.undeclared.reduce((m, [, c]) => m + c, 0);
      console.log(`  ${n === 0 ? '  0 ✓' : String(n).padStart(3) + ' ✗'}  ${r.file}`);
      for (const [what, count] of r.undeclared.slice(0, 12)) {
        console.log(`         ${String(count).padStart(3)}×  ${what}`);
      }
      if (r.undeclared.length > 12) console.log(`         …and ${r.undeclared.length - 12} more`);
    }
    const unused = results[0]?.unused ?? [];
    if (unused.length) console.log(`\n  declared and never used: ${unused.join(' ')}`);
    console.log(`\n  ${drift === 0 && !missing.length ? 'PASS — every value comes from the contract' : `FAIL — ${drift} undeclared value(s)${missing.length ? `, ${missing.length} missing group(s)` : ''}`}\n`);
  }
  process.exit(drift === 0 && !missing.length ? 0 : 1);
}

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
