#!/usr/bin/env node
/**
 * The release gate. Original work, MIT.
 *
 *   node scripts/gate.mjs                          gate the current directory
 *   node scripts/gate.mjs dist --draft
 *   node scripts/gate.mjs dist --url http://localhost:4321/
 *
 * This script refuses. It does not choose, rank, seed or suggest a single design value,
 * and it must never be extended to. A deterministic direction generator scored 40 on this
 * repository's own head-to-head where a model reasoning from evidence scored 59 on the same
 * brief; the generator is the most plausible cause of the loss. Everything here reads what
 * a build already decided and says whether the build kept its word.
 *
 * Exit policy, matched to tools/context-budget.mjs:
 *
 *   0  every check ran and none refused
 *   2  refused, with the defect class, the file and the line
 *   1  no refusal, but at least one check could not run, so there is no pass to report
 *
 * 1 is not a softer 2. It means the gate is withholding: a verdict is missing and the run
 * may not claim the check happened. context-budget.mjs exits 1 on an ungated budget for the
 * same reason, and the reason is that an unmeasured thing presented as measured is the
 * defect that made the previous version of that tool decoration.
 *
 * One number is printed and never gated on: the world-derived token vocabulary share. The
 * architecture decision demoted it from a gate to a report because it is n=2, it has no
 * upstream source, it is defeated by find-and-replace, and mandating it manufactures the
 * same move on every build, which is the convergence it was meant to attack. It prints. It
 * cannot fail the run. Do not promote it.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve, relative, sep, extname, basename, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';

/* The one character this package bans outright, written as an escape so that the file
   enforcing the ban does not contain the thing it bans. Two refusal messages below are
   quoted verbatim from the placement record and both contain it, so they are built by
   interpolation rather than typed. */
const EM = '\u2014';

/* ── arguments ─────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(name);

if (has('--help') || has('-h')) {
  console.log(`usage: gate.mjs [build-dir] [--draft] [--url <url>]
                [--skill <dir>] [--direction <file>] [--manifest <file>] [--report <file>]`);
  process.exit(1);
}

const flagValues = new Set();
for (const name of ['--url', '--skill', '--direction', '--manifest', '--report']) {
  const i = argv.indexOf(name);
  if (i >= 0 && argv[i + 1] !== undefined) flagValues.add(i + 1);
}
const positional = argv.filter((a, i) => !a.startsWith('--') && !flagValues.has(i));

const BUILD = resolve(positional[0] ?? '.');
const DRAFT = has('--draft');
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(flag('--skill', join(SCRIPT_DIR, '..')));
const DIRECTION_PATH = resolve(flag('--direction', join(BUILD, '.sitesmith/direction.md')));
const MANIFEST_PATH = resolve(flag('--manifest', join(BUILD, 'ASSET-MANIFEST.md')));
const REPORT_PATH = resolve(flag('--report', join(BUILD, 'PRODUCTION-REPORT.md')));
const URL_TARGET = flag('--url', null);

/* ── findings ──────────────────────────────────────────────────────────── */

const refusals = [];   // blocking: a defect class, a file and a line
const warnings = [];   // downgraded by --draft, or reported without authority
const waived = [];     // an antipattern the direction record claims on purpose
const missing = [];    // a verdict this run did not earn and will not fake

const show = (p) => relative(process.cwd(), p).split(sep).join('/') || '.';
const refuse = (cls, file, line, detail) => refusals.push({ cls, file: show(file), line, detail });
const warn = (cls, file, line, detail) => warnings.push({ cls, file: show(file), line, detail });
const withhold = (check, why) => missing.push({ check, why });

const lineOf = (text, index) => text.slice(0, index).split('\n').length;
const snip = (s, n = 96) => s.replace(/\s+/g, ' ').trim().slice(0, n);

/* One markdown section, from its heading to the next one or to the end of the file. Written
   out rather than done with a lookahead: the lookahead version silently returned nothing for
   the last section in a document, which made the reconciliation check pass on every report
   whose Reconciliation block was written last, which is where anyone would write it. */
function section(md, name) {
  const m = md.match(new RegExp(`^##\\s*${name}\\s*$`, 'im'));
  if (!m) return null;
  const after = md.slice(m.index + m[0].length);
  const next = after.search(/^##\s/m);
  return { body: next === -1 ? after : after.slice(0, next), index: m.index };
}

/* ── the build ─────────────────────────────────────────────────────────── */

/* dist/ and build/ are deliberately walked. The recorded failure mode of the v2.3 token
   scanner is that it read inline <style> only, so a Tailwind or CSS-in-JS project emitted
   its entire design system into a file the checker never opened and scored clean. */
const SKIP_DIRS = new Set(['node_modules', '.git', '__pycache__', '.cache', 'coverage', '.turbo']);
const HTML_EXT = new Set(['.html', '.htm']);
const CSS_EXT = new Set(['.css']);
const CODE_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.vue', '.svelte', '.astro', '.css', '.scss', '.html', '.htm']);
const TEXT_EXT = new Set([...CODE_EXT, '.md', '.txt', '.svg', '.json']);

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const buildStat = await stat(BUILD).catch(() => null);
if (!buildStat?.isDirectory()) {
  console.error(`gate: ${show(BUILD)} is not a directory. Point the gate at the build.`);
  process.exit(1);
}

const allFiles = await walk(BUILD);
const read = new Map();
for (const f of allFiles) {
  if (!TEXT_EXT.has(extname(f).toLowerCase())) continue;
  read.set(f, await readFile(f, 'utf8').catch(() => null));
}
const textOf = (f) => read.get(f) ?? '';
const filesWith = (set) => allFiles.filter((f) => set.has(extname(f).toLowerCase()) && read.get(f) != null);

const htmlFiles = filesWith(HTML_EXT);
/* An adversarial pass found every honesty check scoped to .html, so a Next, Astro or Vite
   source tree carrying nine declared defects in a .tsx file printed "every check ran and
   none refused". Markup lives in components. These are the files the honesty checks read,
   and an empty set is a withheld verdict below, never a clean one. */
const MARKUP_EXT = new Set(['.html', '.htm', '.jsx', '.tsx', '.vue', '.svelte', '.astro'])
const markupFiles = filesWith(MARKUP_EXT)
const cssFiles = filesWith(CSS_EXT);
const codeFiles = filesWith(CODE_EXT);

/* ── stylesheets, wherever they live ───────────────────────────────────── */

/* A sheet keeps the offset of its text inside the file it came from, so a finding in an
   inline <style> reports the line in the HTML rather than a line in a fragment nobody
   can open. */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));

const sheets = [];
for (const f of cssFiles) sheets.push({ file: f, source: textOf(f), css: stripComments(textOf(f)), base: 0 });
for (const f of htmlFiles) {
  const src = textOf(f);
  for (const m of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const base = m.index + m[0].indexOf(m[1]);
    sheets.push({ file: f, source: src, css: stripComments(m[1]), base });
  }
}
const sheetLine = (sheet, idx) => lineOf(sheet.source, sheet.base + idx);

/* ── the direction record ──────────────────────────────────────────────── */

/* The gate reads five declared lines and nothing else. v2's five-axis classifier is not
   carried over: v3's direction record has no macro axes, so palette, type and signature
   are the only things declared and therefore the only things checkable. Inferring the
   rest would be the gate deciding the design. */
/* Two forms are accepted for one reason: the record this gate reads is the record
   `ledger.mjs new` writes, and it writes `## Colour` as a heading with the answer under
   it, not `Colour:` on one line. Until this function read headings, a builder who
   followed run.md to the letter produced a record that refused here with
   direction/palette-not-declared, direction/type-not-declared and
   direction/signature-not-declared, and no correct build could pass. Two parsers
   disagreeing about the same file is the same defect as two skills in one repository,
   only smaller and harder to see. `Colour` is the canonical heading and `Palette` is the
   older line; both mean the ground. */
function parseDirection(md) {
  const NAMES = { Palette: ['Palette', 'Colour', 'Color'] };
  const alternatives = (name) => NAMES[name] ?? [name];

  const oneLine = (name) => {
    const m = md.match(new RegExp(`^[ \\t]*(?:[-*]\\s*)?(?:\\*\\*)?${name}(?:\\*\\*)?:[ \\t]*(.*)$`, 'im'));
    return m && m[1].trim() ? { value: m[1].trim(), line: lineOf(md, m.index) } : null;
  };

  /* A `## Name` heading whose value is the prose beneath it, up to the next heading. The
     value is flattened to one line so every downstream check, all of which scan a string
     for hex codes or quoted families, works on either form without knowing which it got. */
  const heading = (name) => {
    const m = md.match(new RegExp(`^[ \\t]*#{1,6}[ \\t]*${name}[ \\t]*$`, 'im'));
    if (!m) return null;
    const after = md.slice(m.index + m[0].length);
    const body = after.split(/^[ \t]*#{1,6}[ \t]/m)[0];
    const value = body.split('\n').map((l) => l.trim()).filter(Boolean).join(' ').trim();
    return value ? { value, line: lineOf(md, m.index) } : null;
  };

  const line = (name) => {
    for (const alt of alternatives(name)) {
      const hit = oneLine(alt) ?? heading(alt);
      if (hit) return hit;
    }
    return null;
  };

  const block = (name) => {
    const head =
      md.match(new RegExp(`^[ \\t]*(?:\\*\\*)?${name}(?:\\*\\*)?:[ \\t]*$`, 'im')) ??
      md.match(new RegExp(`^[ \\t]*#{1,6}[ \\t]*${name}[ \\t]*$`, 'im'));
    if (!head) return [];
    const rest = md.slice(head.index + head[0].length).split('\n').slice(1);
    const rows = [];
    let n = lineOf(md, head.index);
    for (const raw of rest) {
      n++;
      if (!raw.trim()) break;
      if (/^\S.*:\s*$/.test(raw)) break;
      const m = raw.match(/^[ \t]*[-*][ \t]*`([^`]+)`[ \t]*(.*)$/);
      if (m) rows.push({ value: m[1].trim().toLowerCase(), reason: m[2].replace(/^[:,]\s*/, '').trim(), line: n });
      else rows.push({ value: null, reason: '', line: n, raw: raw.trim() });
    }
    return rows;
  };
  return {
    // The whole record, because three checks offer an escape hatch that is written as a
    // free line rather than a named field: banned-palette-pinned-by-brief,
    // purple-pinned-by-brief, typeface-pinned-by-brief. They all test `direction.raw`,
    // and until this line existed that property was undefined, so every one of those
    // waivers was unreachable. A refusal that names a way past and then ignores it is
    // worse than one with no way past at all: it reads as arbitrary.
    raw: md,
    palette: line('Palette'),
    type: line('Type'),
    signature: line('Signature'),
    surfaces: line('Surfaces'),
    oneOffs: block('One-offs'),
    deliberate: block('Deliberate'),
  };
}

const directionRaw = await readFile(DIRECTION_PATH, 'utf8').catch(() => null);
const direction = directionRaw ? parseDirection(directionRaw) : null;

/* The signature has to name something a query can find. Prose alone would leave the gate
   guessing which element the build was designed around, and guessing is deciding. */
function signatureSelector(d) {
  const m = (d.signature?.value ?? '').match(/`([^`]+)`|\(([.#[][^)]+)\)/);
  return m ? (m[1] ?? m[2]).trim() : null;
}

/* ── colour ────────────────────────────────────────────────────────────── */

const NAMED_COLOURS = new Set(`aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue
blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue
darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid
darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink
deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold
goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush
lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen
lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime
limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen
mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin
navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise
palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue
saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow
springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen`
  .split(/\s+/).filter(Boolean));

function parseColour(value) {
  const v = value.trim().toLowerCase();
  let m = v.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  m = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  m = v.match(/^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%/);
  if (m) return hslToRgb(+m[1], +m[2] / 100, +m[3] / 100);
  return null;   // oklch and friends: see the withheld verdict in the render check
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return { r: Math.round((r + mm) * 255), g: Math.round((g + mm) * 255), b: Math.round((b + mm) * 255) };
}

function luminance(rgb) {
  const f = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b);
}

function saturation(rgb) {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return { s: 0, l };
  return { s: (mx - mn) / (1 - Math.abs(2 * l - 1)), l };
}

/* ── the measurement, printed and never gated ──────────────────────────── */

/* The generic vocabulary as the architecture record wrote it. A name is generic when it is
   this word, or this word with a numeric suffix. Nothing here is enforced. */
const GENERIC_TOKEN_NAMES = new Set(`bg background surface fg foreground text muted border accent primary
secondary card popover ring input destructive radius shadow`.split(/\s+/).filter(Boolean));

const declaredTokenNames = new Set();
for (const sheet of sheets) {
  for (const m of sheet.css.matchAll(/(--[\w-]+)\s*:/g)) declaredTokenNames.add(m[1].slice(2).toLowerCase());
}
const genericNames = [...declaredTokenNames].filter((n) => GENERIC_TOKEN_NAMES.has(n.replace(/-\d+$/, '')));
const vocabularyShare = declaredTokenNames.size
  ? genericNames.length / declaredTokenNames.size
  : null;

/* ── 1. honesty, first and before anything else ────────────────────────── */

/* Taken from skills/sitesmith/scripts/production-gate.mjs, which built these two lists
   against pages that actually shipped. The placement's own list (lorem, Acme, John Doe,
   example.com, 555-, 123-456, TODO, "Your logo here", "Coming soon" where a price belongs)
   is a subset; the wider prior-art list is kept because it was earned, and the price-context
   form of "coming soon" is subsumed by the blanket refusal rather than reported twice. */
const PLACEHOLDER_TEXT = [
  /\bplaceholder\b/i,
  /\bwould (?:sit|go|appear) here\b/i,
  /\bimage (?:goes|to go) here\b/i,
  /\bphoto(?:graph)? (?:goes|to go|would)\b/i,
  /\bcoming soon\b/i,
  /\bto be (?:added|supplied|confirmed)\b/i,
  /\bTBC\b/,
  /\blorem\b/i,
  /\bdolor sit amet\b/i,
  /\bjohn doe\b/i, /\bjane doe\b/i,
  /\bacme\b/i,
  /\byour (?:logo|company|text|name) here\b/i,
  /\bsample (?:text|image|content)\b/i,
  /\bdummy (?:text|content|data)\b/i,
  /\bTODO\b/,
  /\bunlock your potential\b/i,
];

const DUMMY_IDENTIFIERS = [
  [/\bexample\.(com|org|net)\b/i, 'a reserved example domain'],
  [/\b(your|company|yourdomain)\.(com|co\.uk)\b/i, 'a stand-in domain'],
  [/\b[\w.+-]+@(example|test|domain|email|yourcompany)\.[a-z.]{2,}/i, 'a stand-in email address'],
  [/\b555[-\s]\d{3}[-\s]?\d{4}\b/, 'a North American 555 fictional telephone number'],
  [/\b123[-\s]456[-\s]?\d*/, 'a counting-sequence telephone number'],
  [/\b123 (Main|High) (St|Street|Road)\b/i, 'a stand-in street address'],
  [/\bAnytown\b/i, 'a stand-in place name'],
  [/[£$€]\s?0\.00\b/, 'a zero price'],
];

const visibleText = (html) => html
  .replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))
  .replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, (m) => ' '.repeat(m.length))
  .replace(/<[^>]*>/g, (m) => ' '.repeat(m.length));

/* Comments and script bodies are removed before any element check. Both were found by the
   prior gate reporting defects that were not there: a comment explaining why a page does
   not use <img src> was counted as two unmanifested images, and a template literal
   containing data-asset="${L.asset}" was reported as an asset named ${L.asset}. */
const markup = (html) => html
  .replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))
  .replace(/<script\b[\s\S]*?<\/script>/gi, (m) => ' '.repeat(m.length));

const stripDataUris = (s) => s
  .replace(/(href|src|content)\s*=\s*"data:[^"]*"/gi, (m, p) => `${p}="data:"`.padEnd(m.length, ' '))
  .replace(/(href|src|content)\s*=\s*'data:[^']*'/gi, (m, p) => `${p}='data:'`.padEnd(m.length, ' '));

function parseManifest(md) {
  const rows = [];
  for (const line of md.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 6) continue;
    if (/^-+$/.test(cells[0].replace(/[: ]/g, '-'))) continue;
    if (/^id$/i.test(cells[0])) continue;
    const state = (cells[5] ?? '').replace(/\*/g, '').toLowerCase();
    rows.push({
      id: cells[0].replace(/`/g, ''), what: cells[1], where: cells[2],
      source: cells[3], licence: cells[4], state,
    });
  }
  return rows;
}

/* ── journeys ──────────────────────────────────────────────────────────── */

/* verify.md, "The journey contract", has always said this: "A surface with no journey
   fails gate.mjs at release, and an empty journeys/ directory fails it outright." Until
   this block existed the string "journey" did not appear anywhere in this file, so the
   sentence described a check nobody had written. Prose that describes an unbuilt check is
   worse than no prose, because it reads as coverage.

   Why it belongs here and not in verify.mjs: verify.mjs renders, measures and scans, and
   its keyboard pass presses Tab and reads computed style. It never clicks. A product page
   whose add-to-cart handler sits in a component that never hydrates clears every check it
   makes. Behaviour is a different question from appearance and it needs a different check.

   Draft downgrades it, the same as the asset manifest, because a draft is by definition a
   build whose behaviour is not finished yet. */
/* Scoped to the surfaces that have behaviour, and not to every build, because a brochure
   with no interactive path has no journey to write and demanding one would produce a
   directory of smoke tests named after a contract they do not meet. The surface is the
   one the record declares. `buy` and `operate` are where a broken handler ships as a
   working page; `read` and `experience` are not. */
const BEHAVIOURAL_SURFACES = /\b(buy|operate|redesign)\b/i;
/* Two sections of the record the gate reads directly. The shell is what the page owes a
   reader who wants to know who this is and how to act; the risk answer is the selector the
   record itself nominated to answer the risk it wrote down. */
const sectionOf = (name) => {
  if (!directionRaw) return '';
  const re = new RegExp(`^[ \t]*#{1,6}[ \t]*${name}[ \t]*$`, 'im');
  const m = directionRaw.match(re);
  if (!m) return '';
  return directionRaw.slice(m.index + m[0].length).split(/^[ 	]*#{1,6}[ 	]/m)[0].trim();
};
const shellSection = sectionOf('The shell');
const riskAnswerSelector = (sectionOf('Answer to the risk').match(/`([.#][\w-]+)`/) ?? [])[1] ?? null;
const secondReadingSelector = (sectionOf('Second reading').match(/`([.#][\w-]+)`/) ?? [])[1] ?? null;

const journeyDir = join(BUILD, 'journeys');
const journeySpecs = (await readdir(journeyDir).catch(() => null))?.filter((f) => f.endsWith('.spec.mjs')) ?? null;
const journeyRefusal = DRAFT ? warn : refuse;
const declaredSurface = directionRaw
  ? (directionRaw.match(/^[ \t]*#{1,6}[ \t]*Surfaces?[ \t]*$/im)
      ? directionRaw.slice(directionRaw.search(/^[ \t]*#{1,6}[ \t]*Surfaces?[ \t]*$/im)).split('\n').slice(1, 4).join(' ')
      : (directionRaw.match(/^[ \t]*Surfaces?:[ \t]*(.*)$/im)?.[1] ?? ''))
  : '';

if (BEHAVIOURAL_SURFACES.test(declaredSurface)) {
  if (journeySpecs === null) {
    journeyRefusal('journeys/none', join(journeyDir, '<surface>.spec.mjs'), 1,
      `the record declares a ${declaredSurface.trim().split(/\s+/)[0]} surface and there is no journeys/ directory. Appearance was checked and behaviour was not: nothing in this gate clicks, submits or adds to a cart.`);
  } else if (!journeySpecs.length) {
    journeyRefusal('journeys/empty', journeyDir, 1,
      'journeys/ exists and holds no *.spec.mjs. An empty directory reads as tested and is not.');
  }
}

const manifestRaw = await readFile(MANIFEST_PATH, 'utf8').catch(() => null);
const manifest = manifestRaw ? parseManifest(manifestRaw) : [];
const assetRefusal = DRAFT ? warn : refuse;

if (manifestRaw === null) {
  assetRefusal('honesty/no-asset-manifest', MANIFEST_PATH, 1,
    'no ASSET-MANIFEST.md. Every rendered image and inline drawing is listed there with a state.');
} else if (!manifest.length) {
  assetRefusal('honesty/unreadable-asset-manifest', MANIFEST_PATH, 1,
    'expected a table with id | what | where | source | licence | state');
}

const BORROWED = /\b(client|customer|partner|certification|accreditation|badge|logo-?wall)\b/i;

if (!markupFiles.length) {
  withhold('honesty', `no markup found under ${show(BUILD)}. Eight honesty checks read markup, so their verdict is missing, not clean.`)
}

for (const file of markupFiles) {
  const src = textOf(file);
  const text = visibleText(src);

  for (const re of PLACEHOLDER_TEXT) {
    const m = text.match(re);
    if (!m) continue;
    refuse('honesty/placeholder-language', file, lineOf(src, text.indexOf(m[0])),
      `"${snip(text.slice(Math.max(0, text.indexOf(m[0]) - 40), text.indexOf(m[0]) + m[0].length + 40))}"`);
  }

  for (const [re, what] of DUMMY_IDENTIFIERS) {
    const m = text.match(re);
    if (!m) continue;
    refuse('honesty/dummy-identifier', file, lineOf(src, text.indexOf(m[0])),
      `${what} is still on the page: "${snip(m[0])}"`);
  }

  /* The page telling the reader what the brief did not contain. This is the claim rule
     in SKILL.md section 7 obeyed and then narrated, and it has now shipped four times:
     "Der er ikke tilføjet besøgstal, priser, adresse eller parkeringsforhold, fordi
     programmet ikke nævner dem" on a page advertising a casting at 11.14; "Ingen
     anmeldelser og ingen udtalelser. Der er ingen at vise" and "Der står ikke mere, fordi
     der ikke er oplyst mere" on a page selling insoles at 2.950 kroner.

     A reviewer paid to buy the second one put it first: a customer in pain reads it as
     nobody has ever been happy here. Cutting the sentence is honest. Printing the cut is
     the studio's paperwork on the client's page.

     Narrow on purpose. It fires on absence plus a word about supplying or stating, so a
     real factual negative is untouched: "ingen klor, ingen blødgøring", "Overskridelser:
     ingen", "Henvisning: ikke nødvendig" all pass. */
  const NARRATED_ABSENCE = [
    /\b(?:ikke|ingen)\b[^.!?]{0,80}\b(?:oplyst|opgivet|nævnt|angivet|udleveret|tilsendt|leveret af kunden)\b/gi,
    /\bfordi\b[^.!?]{0,60}\b(?:ikke er oplyst|ikke nævner|ikke oplyser|ikke står i|ikke fremgår)\b/gi,
    /\bder (?:er|står) ikke\b[^.!?]{0,40}\b(?:mere|flere|andet|noget)\b/gi,
    /\b(?:er|der er) ingen at (?:vise|nævne)\b/gi,
    /\b(?:not|none were|nothing was)\s+(?:supplied|provided|stated|given|shared)\b/gi,
    /\bwe (?:do not|don't) (?:know|have)\b[^.!?]{0,50}\b(?:because|since)\b/gi,
  ];
  for (const re of NARRATED_ABSENCE) {
    for (const m of text.matchAll(re)) {
      const at = m.index ?? 0;
      refuse('honesty/narrated-absence', file, lineOf(src, at),
        `"${snip(text.slice(Math.max(0, at - 50), at + m[0].length + 50))}" tells the reader what the brief did not contain. `
        + 'Section 7 says a page with no proof section is honest; it does not say to print the absence. Cut the sentence, not into it.');
    }
  }

  /* An element inside a brand link with no text, or whose only text is a filename, is a
     coloured box standing in for an identity. Three pages in the legacy set shipped one. */
  const mk = markup(src);
  for (const m of mk.matchAll(/<a[^>]*class="[^"]*\b(logo|mark|brand|wordmark|ident)\b[^"]*"[\s\S]{0,400}?<\/a>/gi)) {
    const inner = m[0].replace(/<[^>]*>/g, ' ').trim();
    const empty = m[0].match(/<(i|span|div|b)\b[^>]*>\s*<\/\1>/i);
    if (empty && !/<(img|svg)\b/i.test(m[0])) {
      refuse('honesty/empty-brand-mark', file, lineOf(src, m.index),
        `an empty element stands in for the brand mark: ${snip(empty[0])}`);
    } else if (/^[\w.-]+\.(svg|png|jpe?g|webp|avif)$/i.test(inner)) {
      refuse('honesty/brand-mark-is-a-filename', file, lineOf(src, m.index),
        `the brand mark renders the text "${inner}", which is a filename, not a mark`);
    }
  }

  /* Every rendered picture, drawn or photographed, carries an id the manifest answers for.
     Checking only <img> left inline drawings unmanifested, and inlining is the correct
     technique when currentColor has to work, so the gate follows it. */
  const scan = stripDataUris(mk);
  const assets = [
    ...scan.matchAll(/<img\b[^>]*>/gi),
    ...[...scan.matchAll(/<svg\b[^>]*>/gi)].filter((m) => !/aria-hidden\s*=\s*["']true["']/i.test(m[0])),
  ];
  for (const m of assets) {
    const kind = m[0].startsWith('<img') ? 'an image' : 'an inline svg';
    const line = lineOf(src, m.index);
    const id = (m[0].match(/data-asset=["']([^"']+)["']/) ?? [])[1];
    if (!id) {
      assetRefusal('honesty/unmanifested-asset', file, line, `${kind} with no data-asset id: ${snip(m[0])}`);
      continue;
    }
    const row = manifest.find((r) => r.id === id);
    if (!row) assetRefusal('honesty/unmanifested-asset', file, line, `asset "${id}" is in no manifest row`);
    else if (row.state !== 'ready') {
      assetRefusal('honesty/asset-not-ready', file, line, `asset "${id}" is ${row.state || 'in no declared state'}`);
    }
    /* Someone else's mark is the strongest proof a page can carry and the easiest to
       fabricate, so the permission to show it has to be written down. This one is never
       downgraded by --draft: a stand-in endorsement is a fabricated endorsement whatever
       stage the build is at. */
    if (row && (BORROWED.test(row.id) || BORROWED.test(row.what ?? ''))) {
      if (!row.source || !row.licence || /^(tbc|todo|n\/a|-)$/i.test(row.licence)) {
        refuse('honesty/borrowed-mark-without-permission', MANIFEST_PATH, 1,
          `"${row.id}" is a third-party mark and its manifest row does not say where permission to show it comes from`);
      }
    }
  }
}

/* --draft has to leave a trace, or a release build can quietly have been a draft. */
const reportRaw = await readFile(REPORT_PATH, 'utf8').catch(() => null);
const reportHas = (re) => reportRaw != null && re.test(reportRaw);

if (DRAFT && reportRaw === null) {
  refuse('honesty/draft-flag-unrecorded', REPORT_PATH, 1,
    '--draft was used and there is no PRODUCTION-REPORT.md to record it in');
} else if (DRAFT && !reportHas(/^\s*[-*]?\s*draft\s*:\s*yes\b/im)) {
  refuse('honesty/draft-flag-unrecorded', REPORT_PATH, 1,
    '--draft was used and the report does not carry a `draft: yes` line');
}
if (reportHas(/^\s*[-*]?\s*draft\s*:\s*yes\b/im) && reportHas(/^\s*[-*]?\s*release\s*:\s*yes\b/im)) {
  refuse('honesty/release-claimed-on-a-draft-build', REPORT_PATH,
    lineOf(reportRaw, reportRaw.search(/^\s*[-*]?\s*release\s*:\s*yes\b/im)),
    'the report claims release and records the draft flag. No build claiming release may have used --draft.');
}

/* Short-circuit, as the placement requires: a page that is dishonest is not worth
   measuring for anything else. The remaining verdicts are named as missing, not skipped. */
if (refusals.length) {
  report(['direction fidelity', 'token drift', 'antipattern detector', 'em dash ban',
    'full-output enforcement', 'design-system honesty', 'reads-within-manifest',
    'run-notes accounting', 'evidence reconciliation']
    .map((c) => ({ check: c, why: 'not run: the honesty refusals above stop the gate before it measures anything else' })));
}

/* ── 2. the em dash, absolute ──────────────────────────────────────────── */

/* No override flag and no allowlist. Softer phrasing was tried and failed repeatedly,
   which is the only reason a rule this blunt is correct. */
for (const f of allFiles) {
  const src = read.get(f);
  if (src == null) continue;
  for (const m of src.matchAll(/\u2014/g)) {
    refuse('copy/em-dash', f, lineOf(src, m.index), `"${snip(src.slice(Math.max(0, m.index - 40), m.index + 40))}"`);
  }
}

/* ── 3. elision where code should be ───────────────────────────────────── */

/* Truncated output looks finished and is not. `unchanged` on its own is the one pattern
   here that also occurs in honest prose, so it only counts when the whole comment is that
   word: "// unchanged" is an elision, "// kept unchanged from upstream, see NOTICES" is a
   sentence about the code. */
const ELISION_PHRASE = /\b(rest of (?:the )?(?:code|file|component|implementation)|same as above|implementation here|implementation goes here|remaining code)\b/i;
const ELISION_BARE = /^[\s.(\[{<*/-]*unchanged[\s.)\]}>*/-]*$/i;
const BARE_ELLIPSIS = /^(?:\/\/|#|\*|<!--|\{\/\*|\/\*)?\s*(?:\.\.\.|…)\s*(?:\*\/\}|\*\/|-->)?$/;

for (const f of codeFiles) {
  const src = textOf(f);
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const isComment = /^\s*(\/\/|\/\*|\*|#|<!--|\{\/\*)/.test(raw);
    const inner = raw.replace(/^\s*(\/\/|\/\*|\*|#|<!--|\{\/\*)/, '').replace(/(\*\/\}|\*\/|-->)\s*$/, '').trim();
    if (isComment && (ELISION_PHRASE.test(inner) || ELISION_BARE.test(inner))) {
      refuse('output/elision-placeholder', f, i + 1, `"${snip(raw)}"`);
    } else if (BARE_ELLIPSIS.test(raw.trim()) && raw.trim()) {
      refuse('output/elision-placeholder', f, i + 1, 'a bare ellipsis stands where code should be');
    }
  }
}

/* ── 4. naming an official design system you did not install ───────────── */

/* Hand-written CSS may imitate a technology. It may not be described as being it. The fix
   is to label the implementation an approximation, so the hedge words below are recognised
   on the same line, otherwise the documented fix would not work. */
const DESIGN_SYSTEMS = [
  [/\bFluent\s?(?:UI|Design|2|v?9)\b/i, ['@fluentui/react', '@fluentui/react-components', '@fluentui/web-components']],
  [/\bMaterial\s?(?:Design|You|3|UI)\b|\bMUI\b/, ['@mui/material', '@material-ui/core', 'material-components-web', '@angular/material', 'material-symbols']],
  [/\b(?:IBM\s+)?Carbon\s+Design\s+System\b|\bCarbon\s+components\b/i, ['@carbon/react', 'carbon-components', '@carbon/styles']],
  [/\bGOV\.UK\s+(?:Design\s+System|Frontend)\b/i, ['govuk-frontend']],
  [/\bLiquid\s+Glass\b/i, []],
];
const HEDGE = /\b(approximat\w+|imitat\w+|inspired by|in the style of|resembl\w+|evocative of|not actually|is not)\b/i;

const deps = new Set();
for (const f of allFiles.filter((x) => basename(x) === 'package.json')) {
  try {
    const pkg = JSON.parse(textOf(f));
    for (const group of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const name of Object.keys(pkg[group] ?? {})) deps.add(name);
    }
  } catch { /* an unparseable package.json is not this check's business */ }
}

const claimFiles = allFiles.filter((f) => {
  const b = basename(f).toLowerCase();
  return b.endsWith('.md') || CODE_EXT.has(extname(f).toLowerCase());
});
for (const f of claimFiles) {
  const src = textOf(f);
  const isProse = f.toLowerCase().endsWith('.md');
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const inComment = /^\s*(\/\/|\/\*|\*|#|<!--|\{\/\*)/.test(raw) || /\/\/|\/\*|<!--/.test(raw);
    if (!isProse && !inComment) continue;
    for (const [re, packages] of DESIGN_SYSTEMS) {
      const m = raw.match(re);
      if (!m) continue;
      if (packages.some((p) => deps.has(p))) continue;
      if (HEDGE.test(raw)) continue;
      refuse('honesty/design-system-not-installed', f, i + 1,
        `"${snip(m[0])}" is named as the technology and ${packages.length ? `none of ${packages.join(', ')} is a dependency` : 'it is a platform technology with no package to install'}. Label the implementation an approximation.`);
    }
  }
}

/* ── 5. reads within the declared manifest ─────────────────────────────── */

/* A progressive-disclosure budget that nobody checks is a note. The run declares which
   scenario it was, the scenario declares which files it may open, and the report declares
   which files it opened. Two of the three already existed and never met. */
function parseScenarios(skillMd) {
  const fm = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const lines = fm[1].split(/\r?\n/);
  const start = lines.findIndex((l) => /^context:\s*$/.test(l));
  if (start === -1) return null;
  const list = (s) => s.trim().replace(/^\[|\]$/g, '').split(',')
    .map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  const out = { always: [], scenarios: {} };
  let section = null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].replace(/\s+$/, '');
    if (/^\S/.test(line) && line.trim()) break;
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    const t = line.trim();
    if (indent === 2) {
      const m = t.match(/^(always|scenarios|ceilings):\s*(.*)$/);
      if (!m) continue;
      section = m[1];
      if (m[1] === 'always' && m[2]) out.always = list(m[2]);
      continue;
    }
    if (indent >= 4 && section === 'scenarios') {
      const m = t.match(/^([\w-]+):\s*(.*)$/);
      if (m) out.scenarios[m[1]] = list(m[2]);
    }
  }
  return out;
}

const skillMdPath = join(SKILL_DIR, 'SKILL.md');
const skillMd = await readFile(skillMdPath, 'utf8').catch(() => null);
const manifestOfReads = skillMd ? parseScenarios(skillMd) : null;

if (reportRaw === null) {
  refuse('report/missing', REPORT_PATH, 1,
    `PRODUCTION-REPORT.md has no "## Files opened" list ${EM} the reads manifest cannot be checked against a run that did not declare its reads`);
} else if (!manifestOfReads) {
  withhold('reads-within-manifest', `${show(skillMdPath)} declares no context: block, so there is no manifest to check reads against`);
} else {
  const opened = section(reportRaw, 'Files opened');
  if (!opened) {
    refuse('report/no-files-opened-list', REPORT_PATH, 1,
      `PRODUCTION-REPORT.md has no "## Files opened" list ${EM} the reads manifest cannot be checked against a run that did not declare its reads`);
  } else {
    const scenarioLine = reportRaw.match(/^\s*[-*]?\s*Scenario\s*:\s*([\w-]+)\s*$/im);
    const name = scenarioLine?.[1];
    if (!name) {
      refuse('report/scenario-not-named', REPORT_PATH, 1,
        'the report names no `Scenario:`, so the gate cannot tell which reads manifest governs this run');
    } else if (!manifestOfReads.scenarios[name]) {
      refuse('report/unknown-scenario', REPORT_PATH, lineOf(reportRaw, scenarioLine.index),
        `scenario "${name}" is not declared in ${show(skillMdPath)}. Declared: ${Object.keys(manifestOfReads.scenarios).join(', ') || 'none'}`);
    } else {
      const declared = [...manifestOfReads.always, ...manifestOfReads.scenarios[name]];
      const allowed = new Set(declared.filter((p) => !p.endsWith('/*')));
      const allowedGlobs = declared.filter((p) => p.endsWith('/*')).map((p) => p.slice(0, -2));
      const base = lineOf(reportRaw, opened.index);
      const rows = opened.body.split('\n');
      for (let i = 0; i < rows.length; i++) {
        const m = rows[i].match(/^\s*[-*\d.)\s]+\s*`?([^`\s]+)`?\s*$/);
        if (!m) continue;
        const path = m[1].replace(/^\.\//, '');
        /* Only files that are actually in this package are governed. A build file the run
           also opened is not part of the disclosure budget and is not this check's business. */
        if (!existsSync(join(SKILL_DIR, path))) continue;
        if (allowed.has(path)) continue;
        /* A9 found this refusing a build for opening verify.md, ledger.mjs and gate.mjs,
           all three of which run.md instructs the run to use. Scripts are executed, not
           read into context, so they are outside the disclosure budget entirely, and the
           inspect scenario is reachable from every run because release is a step every
           run takes. Nothing wider than that: the first version of this fix exempted any
           file named in any scenario, which let a read-surface run open floor/operate.md,
           and that drift is precisely what the check exists to catch. */
        if (path.startsWith('scripts/')) continue;
        if ((manifestOfReads.scenarios.inspect ?? []).includes(path)) continue;
        /* A manifest entry ending in slash-star means one file out of that directory,
           because a run opens exactly one stack adapter. Matching it literally would
           refuse every build that opened the adapter the router actually named. */
        if (allowedGlobs.some((dir) => path.startsWith(dir + '/'))) continue;
        refuse('reads/outside-manifest', REPORT_PATH, base + 1 + i,
          `read ${path} is not declared for scenario ${name} ${EM} either the run opened more than its scenario allows or the manifest is wrong. Fix one of them; never delete the line to pass.`);
      }
    }
  }
}

/* ── 6. run notes, one line per step that can degrade ──────────────────── */

/* No claim of a check having run may be made without the artifact it produces. An absent
   field is detectable where an absent behaviour is invisible, which is the whole reason
   this block is fixed rather than written to taste. */
const RUN_NOTE_FIELDS = ['viewports', 'axe both schemes', 'live server', 'anti-slop linter', 'fallbacks'];
const NOT_RUN = /^\s*(no|none|not run|did not run|skipped|unavailable|failed|partial)\b/i;

if (reportRaw !== null) {
  const notes = section(reportRaw, 'Run notes');
  if (!notes) {
    refuse('report/no-run-notes', REPORT_PATH, 1,
      'the report carries no `## Run notes` block. Expected one line per degradable step: ' + RUN_NOTE_FIELDS.join(', '));
  } else {
    const base = lineOf(reportRaw, notes.index);
    for (const field of RUN_NOTE_FIELDS) {
      const rx = new RegExp(`^\\s*[-*]?\\s*${field.replace(/ /g, '\\s+')}\\s*:\\s*(.*)$`, 'im');
      const m = notes.body.match(rx);
      if (!m) {
        refuse('run-notes/missing-field', REPORT_PATH, base,
          `no line for "${field}". A step that can degrade and is not accounted for is indistinguishable from one that silently did not happen.`);
        continue;
      }
      const value = m[1].trim();
      const line = base + lineOf(notes.body, m.index);
      if (!value) {
        refuse('run-notes/empty-field', REPORT_PATH, line, `"${field}" is declared with no value`);
        continue;
      }
      /* "fallbacks: none" is a complete answer, not a step that did not run. Every other
         field that reports a non-run owes the observed reason on the same line. */
      if (field === 'fallbacks' && /^none\b/i.test(value)) continue;
      if (NOT_RUN.test(value) && !/reason\s*:\s*\S/i.test(value)) {
        refuse('run-notes/no-reason-on-a-step-that-did-not-run', REPORT_PATH, line,
          `"${field}: ${snip(value, 40)}" reports a step that did not run and carries no "reason: ...". Say what was observed and what was done instead.`);
      }
    }
  }
}

/* ── 7. three-way evidence reconciliation ──────────────────────────────── */

/* The model forms its judgment before it sees the checker output, and then every mechanical
   finding is dispositioned. A false-positive disposition accumulates as evidence against
   the rule, not against the reviewer, which is why it owes a reason and the other two
   do not. */
const DISPOSITION = /\b(confirmed|missed-by-the-model|false-positive)\b/i;

/* ── the critique, and whether it was taken against this render ───────────── */

/* look.md section 6 and verify.md both ask for a critique of the rendered page, in five
   and six sentences, before anything is called done. Nothing has ever read one. Three
   builds were made from this package on three unrelated briefs, all three wrote their
   critique, all three cleared their own gates, and three reviewers who saw only the brief
   and the screenshots rejected all three. Two of the three builders reported, unprompted,
   that they read the verify PASS before opening the images, which is the one ordering
   verify.md tells them not to use.

   Conditional on the screenshots existing, because gate.mjs is documented as runnable on a
   build directory alone and verify.mjs announces its own absence. Where verify has run,
   the critique is owed and it is owed against the render that was actually shown. */
const SHOTS_DIR = join(BUILD, '.sitesmith/shots');
const CRITIQUE_PATH = join(BUILD, '.sitesmith/critique.json');
if (existsSync(SHOTS_DIR) && readdirSync(SHOTS_DIR).some((f) => f.endsWith('.png'))) {
  if (!existsSync(CRITIQUE_PATH)) {
    refuse('critique/not-taken', CRITIQUE_PATH, 1,
      'verify.mjs rendered this page and no critique is locked against it. Run `node scripts/critique.mjs packet` '
      + 'and answer the six questions from the images alone, then `critique.mjs lock --file <answers>`. '
      + 'A critique nothing reads is the field the risk was written in for five builds running.');
  } else {
    let saved = null;
    try { saved = JSON.parse(readFileSync(CRITIQUE_PATH, 'utf8')); }
    catch (e) { refuse('critique/unreadable', CRITIQUE_PATH, 1, `${e.message.split('\n')[0]}`); }
    if (saved) {
      const h = createHash('sha256');
      for (const f of readdirSync(SHOTS_DIR).filter((x) => x.endsWith('.png')).sort()) {
        h.update(f); h.update(readFileSync(join(SHOTS_DIR, f)));
      }
      const now = h.digest('hex').slice(0, 16);
      /* The lock has to name the render that ships, and nothing weaker. The first version
         let a recorded correction stand in for a matching hash, and a cold build walked
         straight through the hole it left: the critique was locked, the ledger then forced
         a palette change, the page shipped, and the gate accepted a critique of a page
         that no longer existed because one correction was on file. The builder reported it
         against itself.

         So the hash must match, always. A correction round explains why the page moved; it
         does not excuse the critique from describing what was actually sent. */
      if (now !== saved.render) {
        const rounds = (saved.corrections ?? []).length;
        refuse('critique/stale', CRITIQUE_PATH, 1,
          `the critique is locked against render ${saved.render} and this build renders as ${now}. `
          + `The page moved after it was looked at${rounds ? `, and the ${rounds} recorded correction round${rounds > 1 ? 's do' : ' does'} not cover this change` : ' and nothing says what changed'}. `
          + 'Look at the render that is actually shipping and re-lock it, with --correction "what changed and why" if this was the correction round.');
      }
    }
  }
}

if (reportRaw !== null) {
  const found = section(reportRaw, 'Mechanical findings');
  const recon = section(reportRaw, 'Reconciliation');
  if (!found) {
    refuse('report/no-mechanical-findings-list', REPORT_PATH, 1,
      'the report carries no `## Mechanical findings` list. An empty answer is allowed and carries a reason; an absent one is not.');
  } else if (!recon) {
    refuse('report/no-reconciliation', REPORT_PATH, lineOf(reportRaw, found.index),
      'mechanical findings are listed and nothing dispositions them as confirmed, missed-by-the-model or false-positive');
  } else {
    const idsOf = (block) => [...block.matchAll(/^\s*[-*]\s*`?([\w./-]+)`?\s*:/gm)]
      .map((m) => ({ id: m[1], index: m.index }));
    const findingIds = idsOf(found.body);
    const reconLines = recon.body.split('\n');
    const foundBase = lineOf(reportRaw, found.index);
    const reconBase = lineOf(reportRaw, recon.index);

    for (const { id, index } of findingIds) {
      if (/^(none|nothing)$/i.test(id)) continue;
      const row = reconLines.find((l) => new RegExp(`(^|[^\\w./-])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\w./-]|$)`).test(l));
      if (!row) {
        refuse('reconciliation/unreconciled-finding', REPORT_PATH, foundBase + lineOf(found.body, index),
          `mechanical finding "${id}" has no line in ## Reconciliation. Disposition it as confirmed, missed-by-the-model, or false-positive with a reason.`);
        continue;
      }
      const d = row.match(DISPOSITION);
      if (!d) {
        refuse('reconciliation/no-disposition', REPORT_PATH, reconBase + 1 + reconLines.indexOf(row),
          `"${id}" is reconciled with no disposition. One of: confirmed, missed-by-the-model, false-positive.`);
      } else if (/false-positive/i.test(d[1]) && !/reason\s*:\s*\S/i.test(row)) {
        refuse('reconciliation/false-positive-without-reason', REPORT_PATH, reconBase + 1 + reconLines.indexOf(row),
          `"${id}" is called a false positive with no "reason: ...". A false positive is evidence against the rule, and evidence has to say what it is.`);
      }
    }
  }
}

/* ── 8. the palette taste-skill named, checked by distance ─────────────── */

/* taste-skill's SKILL.md section 4.2 calls this the second-most-recurring AI tell and
   bans it by hex. This rebuild marked that mechanism "adapt", resolved conflict C1 as
   "naming beats banning", and never carried the list. Round two of the portfolio test
   then produced, from three unrelated Danish trades:
       ink     #1b1a17 #191713 #191512   against banned #1a1714 #1a1814 #1b1814
       accent  #8f5a14 #b3243b           against banned #7d5621 #9a2436
       ground  #e9e3d5 #E3D9C4           against banned #e8dfcb #ece6db
   C1 was right about abstract looks and wrong at hex level, and this is the correction.

   Distance, not equality. #1b1a17 is not in the banned list and is three units from a
   member of it. An exact-match check would have passed every value above. */

const BANNED_PALETTE = [
  { hex: '#f5f1ea', role: 'ground' }, { hex: '#f7f5f1', role: 'ground' }, { hex: '#fbf8f1', role: 'ground' },
  { hex: '#efeae0', role: 'ground' }, { hex: '#ece6db', role: 'ground' }, { hex: '#faf7f1', role: 'ground' },
  { hex: '#e8dfcb', role: 'ground' },
  { hex: '#b08947', role: 'accent' }, { hex: '#b6553a', role: 'accent' }, { hex: '#9a2436', role: 'accent' },
  { hex: '#9c6e2a', role: 'accent' }, { hex: '#bc7c3a', role: 'accent' }, { hex: '#7d5621', role: 'accent' },
  { hex: '#1a1714', role: 'text' }, { hex: '#1a1814', role: 'text' }, { hex: '#1b1814', role: 'text' },
];
/* Twelve units in RGB. Wide enough that the round-two values trip, narrow enough that a
   genuinely different warm neutral does not. Round two's closest pair was three units. */
const PALETTE_ARC = 12;

const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const rgbDistance = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));

/* The override path is taste-skill's own and it is the reason a hex ban is usable at all:
   the palette is permitted when the brief names it, and the direction record has to say so
   in the client's words. Without this the check would overrule rung 1 of the precedence
   ladder, and the brief outranks everything in this package. */
const paletteWaiver = direction && /banned-palette-pinned-by-brief:/i.test(direction.raw ?? '');

if (!paletteWaiver) {
  const seen = new Set();
  for (const file of [...cssFiles, ...markupFiles]) {
    const src = textOf(file);
    for (const m of src.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
      const hex = m[0].toLowerCase();
      if (seen.has(hex)) continue;
      seen.add(hex);
      const mine = rgbOf(hex);
      for (const banned of BANNED_PALETTE) {
        const d = rgbDistance(mine, rgbOf(banned.hex));
        if (d > PALETTE_ARC) continue;
        refuse('palette/premium-consumer-default', file, lineOf(src, m.index),
          `${hex} is ${d} units from ${banned.hex}, a ${banned.role} in the palette taste-skill names as the second-most-recurring AI tell. Choose from the subject's own materials, or write "banned-palette-pinned-by-brief: <the client's words>" in the direction record.`);
        break;
      }
    }
  }
}

/* Shared by every named-tell check below. Each keeps taste-skill's own override path:
   the brief outranks this package, so a value the client pinned in their own words stands. */
const tellWaiver = (name) => direction && new RegExp(`${name}-pinned-by-brief:`, 'i').test(direction.raw ?? '');

/* ── 8a. drawings belong to the token system ─────────────────────── */

/* Measured across six arms of one holdout: the two builds that hard-coded colours inside
   their inline SVG were the two whose drawings floated off the page's own system, and one
   of them was ours. Our previous version passed with seventeen var() attributes and beat
   us on craft. A drawing is part of the design or it is a sticker.

   fill and stroke may be none, currentColor or a var(). A per-shape stroke-width is a
   value invented at point of use, which token drift already refuses everywhere else. */
if (!tellWaiver('drawing')) {
  const OK_PAINT = /^(none|currentcolor|inherit|transparent|url\(#|var\(--)/i;
  for (const file of markupFiles) {
    const src = textOf(file);
    for (const svg of src.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
      const at = svg.index;
      for (const attr of svg[0].matchAll(/\b(fill|stroke)\s*=\s*["']([^"']+)["']/gi)) {
        const value = attr[2].trim();
        if (OK_PAINT.test(value)) continue;
        refuse('drawing/untokenised-paint', file, lineOf(src, at + attr.index),
          `${attr[1]}="${value}" is a value invented inside the drawing. Use a custom property from the design system, or currentColor, so the drawing moves when the system does.`);
      }
      for (const w of svg[0].matchAll(/\bstroke-width\s*=\s*["']([^"']+)["']/gi)) {
        if (/^var\(--/i.test(w[1].trim())) continue;
        refuse('drawing/untokenised-stroke-width', file, lineOf(src, at + w.index),
          `stroke-width="${w[1]}" is a weight chosen at point of use. Declare the drawing's weights once and reference them, the way every other value on the page is declared.`);
      }
    }
  }
}

/* ── 8b. the rest of taste-skill's named tells ────────────────────────── */

/* Three more from the same section that carried the palette. Each is code-checkable from
   static output, each keeps taste-skill's override path, and each is here rather than in
   the prose for the reason round two proved: an instruction every build reads becomes the
   next thing they all agree on. A check does not. */


/* taste-skill: "Specifically BANNED as defaults: Fraunces and Instrument_Serif (the two
   LLM-favorite display serifs)", and Inter is "discouraged as default". */
const BANNED_FACES = [
  { re: /\bFraunces\b/i, why: 'one of the two display serifs taste-skill names as the LLM favourites' },
  { re: /\bInstrument[_ ]?Serif\b/i, why: 'the other of the two' },
  { re: /\bInter\b(?!\s*Tight)/i, why: 'discouraged as a default sans; acceptable when the brief asks for a neutral or accessibility-first feel' },
];
if (!tellWaiver('typeface')) {
  for (const file of [...cssFiles, ...markupFiles]) {
    const src = textOf(file);
    for (const line of [...src.matchAll(/^.*font-family[^;\n]*/gim)]) {
      for (const face of BANNED_FACES) {
        if (!face.re.test(line[0])) continue;
        refuse('typeface/named-default', file, lineOf(src, line.index),
          `${line[0].trim().slice(0, 90)} — ${face.why}. Choose another, or write "typeface-pinned-by-brief: <the client's words>" in the direction record.`);
      }
    }
  }
}

/* taste-skill's LILA RULE: the AI purple and blue-glow aesthetic, discouraged as a
   default. Checked by hue rather than by name, because the tell is the region. */
if (!tellWaiver('purple')) {
  const seen = new Set();
  for (const file of [...cssFiles, ...markupFiles]) {
    const src = textOf(file);
    for (const m of src.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
      const hex = m[0].toLowerCase();
      if (seen.has(hex)) continue;
      seen.add(hex);
      const [r, g, b] = rgbOf(hex).map((v) => v / 255);
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
      if (d < 0.25) continue;
      const l = (mx + mn) / 2;
      const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (s < 0.45) continue;
      let h;
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (mx === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
      h *= 360;
      if (h < 255 || h > 295) continue;
      refuse('colour/ai-purple', file, lineOf(src, m.index),
        `${hex} sits at hue ${Math.round(h)}, inside the AI purple region taste-skill names. Embrace it only if the brief asks: write "purple-pinned-by-brief: <the client's words>" in the direction record.`);
    }
  }
}

/* taste-skill: "Two CTAs with the same intent on one page is a Pre-Flight Fail." One
   label per intent, everywhere on the page. */
const CTA_INTENTS = [
  { intent: 'contact', re: /\b(get in touch|contact us|contact|let'?s talk|start a project|start something|reach out|book a call|tal med os|kontakt os|ring til os|skriv til os)\b/i },
  { intent: 'signup', re: /\b(try free|get started|sign up free|sign up|start free|opret|kom i gang|prøv gratis)\b/i },
  { intent: 'portfolio', re: /\b(view work|see selected work|browse projects|our work|se arbejde|se projekter|se cases)\b/i },
];
if (!tellWaiver('cta')) {
  for (const file of markupFiles) {
    const src = textOf(file);
    const byIntent = new Map();
    for (const m of src.matchAll(/<(?:a|button)\b[^>]*>([\s\S]{1,80}?)<\/(?:a|button)>/gi)) {
      const label = m[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!label || label.length > 40) continue;
      for (const { intent, re } of CTA_INTENTS) {
        if (!re.test(label)) continue;
        if (!byIntent.has(intent)) byIntent.set(intent, new Map());
        if (!byIntent.get(intent).has(label.toLowerCase())) byIntent.get(intent).set(label.toLowerCase(), lineOf(src, m.index));
      }
    }
    for (const [intent, labels] of byIntent) {
      if (labels.size < 2) continue;
      const shown = [...labels.keys()].map((l) => `"${l}"`).join(', ');
      refuse('cta/duplicate-intent', file, [...labels.values()][1],
        `${labels.size} labels for one ${intent} intent on this page: ${shown}. Pick one label and use it in the nav, the hero and the footer.`);
    }
  }
}

/* ── 8. token drift ────────────────────────────────────────────────────── */

/* Values a page may use without declaring: they carry no design decision. Taken from
   skills/sitesmith/scripts/token-drift.mjs, where the carve-out already earned its place:
   without it, `padding: 0` and a 1px rule inflate every count without saying anything. */
const UTILITY = /^(0|0px|0rem|0%|1px|-1px|2px|50%|100%|auto|none|inherit|initial|unset|revert|transparent|currentcolor|100vh|100dvh|100vw|1|1em|1rem\b)$/i;
/* Longest alternatives first, so `border-color` is never half-matched by `border`. */
const SCANNED_PROPS = [
  'border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-color', 'border-right-color', 'border-left-color', 'border-top-color',
  'background-color', 'background-image', 'border-radius', 'border-color', 'outline-color',
  'accent-color', 'caret-color', 'font-family', 'text-shadow', 'background', 'box-shadow',
  'font-size', 'stroke', 'border', 'color', 'fill',
].join('|');
const LENGTH = /-?\d*\.?\d+(?:px|rem|em|pt|ch|vw|vh|%)\b/gi;
const COMPUTED = /\b(?:var|calc|clamp|min|max|env|attr)\s*\(/i;

const oneOffs = new Map();
if (direction) {
  for (const row of direction.oneOffs) {
    if (row.value && row.reason) oneOffs.set(row.value, row.reason);
    else if (row.value) {
      refuse('direction/one-off-without-a-reason', DIRECTION_PATH, row.line,
        `\`${row.value}\` is listed under One-offs: with no reason on the same line, so it does not license anything`);
    }
  }
}

if (directionRaw === null) {
  refuse('direction/record-missing', DIRECTION_PATH, 1,
    'there is no .sitesmith/direction.md, so nothing declares what this build was supposed to be');
} else {
  if (!direction.palette) {
    refuse('direction/palette-not-declared', DIRECTION_PATH, 1, 'the record has no `Palette:` line');
  }
  if (!direction.type) {
    refuse('direction/type-not-declared', DIRECTION_PATH, 1, 'the record has no `Type:` line');
  }
  /* The signature line is checked for shape here rather than in the render block below,
     because whether it names something a machine can look for is a fact about the document
     and does not need a browser. A build with no browser still owes a readable record. */
  if (!direction.signature) {
    refuse('direction/signature-not-declared', DIRECTION_PATH, 1, 'the record has no `Signature:` line');
  } else if (!signatureSelector(direction)) {
    refuse('direction/signature-names-no-selector', DIRECTION_PATH, direction.signature.line,
      'the Signature: line names no selector in backticks or parentheses, so the gate cannot look for it in the DOM');
  }

  for (const sheet of sheets) {
    /* @font-face declares a face; it is not a call site, and font-family inside it is the
       name of the thing being defined. Reporting it was a false positive worth removing. */
    const faces = [...sheet.css.matchAll(/@font-face\s*\{[\s\S]*?\}/gi)].map((m) => [m.index, m.index + m[0].length]);
    const inFace = (i) => faces.some(([a, b]) => i >= a && i < b);

    for (const m of sheet.css.matchAll(new RegExp(`(^|[;{}\\s])(${SCANNED_PROPS})\\s*:\\s*([^;{}]+)`, 'gi'))) {
      const prop = m[2].toLowerCase();
      const value = m[3].trim();
      const at = m.index + m[0].indexOf(m[3]);
      if (inFace(at)) continue;
      /* A custom property definition is the one place a literal belongs. The regex above
         cannot match `--x: red` because it requires a known property name, so reaching
         here already means this is a call site. */
      if (COMPUTED.test(value)) continue;

      const flagged = new Set();
      const say = (lit, kind) => {
        const key = `${prop}:${lit}`;
        if (flagged.has(key)) return;
        flagged.add(key);
        if (UTILITY.test(lit)) return;
        if (oneOffs.has(lit.toLowerCase())) return;
        refuse('tokens/undeclared-literal', sheet.file, sheetLine(sheet, at),
          `${prop}: ${snip(lit, 60)} is a literal ${kind} at a call site. Declare it as a custom property, or list it under One-offs: in the direction record with a reason.`);
      };

      if (prop === 'font-family') {
        say(value, 'type stack');
        continue;
      }
      if (prop === 'box-shadow' || prop === 'text-shadow') {
        say(value, 'shadow');
        continue;
      }
      if (prop === 'font-size' || prop.includes('radius')) {
        for (const v of value.matchAll(LENGTH)) say(v[0].toLowerCase(), 'length');
        continue;
      }
      for (const v of value.matchAll(/#[0-9a-f]{3,8}\b/gi)) say(v[0].toLowerCase(), 'colour');
      for (const v of value.matchAll(/\b(?:rgba?|hsla?|oklch|oklab|lch|lab)\s*\([^)]*\)/gi)) say(v[0].toLowerCase(), 'colour');
      for (const v of value.matchAll(/\b[a-z]{3,20}\b/gi)) {
        if (NAMED_COLOURS.has(v[0].toLowerCase())) say(v[0].toLowerCase(), 'named colour');
      }
    }
  }
}

/* ── 9. the antipattern detector ───────────────────────────────────────── */

/* It reports and never rewrites. A tell the direction record claims on purpose prints as
   waived with its stated reason, so the detector cannot itself become the house style:
   a checker that forbids a move on every build has mandated its opposite on every build. */
const deliberate = new Map();
if (direction) for (const row of direction.deliberate) if (row.value && row.reason) deliberate.set(row.value, row.reason);

/* One report per tell per file. The vendor-prefixed and unprefixed halves of the same
   gradient-text declaration are one decision, and printing it twice reads as two defects. */
const toldAlready = new Set();
const tell = (name, file, line, detail) => {
  const key = `${name}|${file}`;
  if (toldAlready.has(key)) return;
  toldAlready.add(key);
  if (deliberate.has(name)) waived.push({ cls: `antipattern/${name}`, file: show(file), line, detail: deliberate.get(name) });
  /* The way past is named in the refusal, and it is named as a decision rather than as a
     replacement. v2.3 shipped a ten-row table pairing each default with a better one, and
     the autopsy of our own file rejected it in one line: applied on every project the
     alternatives become the new defaults, so three redesigns of three unrelated generic
     sites converge on one non-generic site. What survives is the obligation, per subject:
     name the default you are shipping and say why it is right here. */
  else refuse(`antipattern/${name}`, file, line,
    `${detail}. This is a default of the medium, not a fault. Build something else, or name `
    + `\`${name}\` under Deliberate: with the reason it is right for this subject. The reason `
    + 'has to be about this subject; "it is clean" is about the pattern and waives nothing.');
};

/* Tailwind's default elevation ramp and shadcn's default radius, matched on the exact
   offset triples so a shadow someone actually chose does not trip it. */
const FRAMEWORK_SHADOWS = /0\s+(?:1px\s+3px\s+0|4px\s+6px\s+-1px|10px\s+15px\s+-3px|20px\s+25px\s+-5px|25px\s+50px\s+-12px)\b/i;
const FRAMEWORK_RADII = /^(0\.5rem|0\.375rem|0\.75rem|8px|6px)$/i;
const FRAMEWORK_TYPE_SCALE = ['0.75rem', '0.875rem', '1.125rem', '1.25rem', '1.5rem', '1.875rem', '2.25rem', '3rem'];

/* A tell hidden behind a token is still the tell. `border-radius: var(--radius)` where
   --radius is 0.5rem is the framework default with a name on it, and the first version of
   this detector saw none of them because it only read literals. One level of substitution
   is enough: a token defined in terms of another token is not how anyone writes a radius. */
function varResolver(css) {
  const vars = new Map();
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) vars.set(m[1], m[2].trim());
  return (value) => value.replace(/var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)/g, (whole, name) => vars.get(name) ?? whole);
}

/* Corner radius in px, or null. rem is taken at the 16px root because that is what it is
   unless someone changed it, and a build that changed it has bigger news than this tell. */
function radiusPx(declarations) {
  const m = declarations.match(/border-radius\s*:\s*([\d.]+)(px|rem)/i);
  if (!m) return null;
  return m[2].toLowerCase() === 'rem' ? +m[1] * 16 : +m[1];
}

for (const sheet of sheets) {
  const css = sheet.css;
  const deref = varResolver(css);

  for (const m of css.matchAll(/(?:-webkit-)?background-clip\s*:\s*text/gi)) {
    if (!/(linear|radial|conic)-gradient/i.test(css)) continue;
    tell('gradient-text', sheet.file, sheetLine(sheet, m.index),
      'gradient text via background-clip');
  }

  const grid = css.match(/grid-template-columns\s*:\s*(repeat\(\s*3\s*,\s*(?:minmax\(\s*0\s*,\s*)?1fr\s*\)?\s*\)|1fr\s+1fr\s+1fr)/i);
  if (grid) {
    for (const rule of css.matchAll(/\.[\w-]*(?:card|tile|feature|panel)[\w-]*[^{}]*\{([^}]*)\}/gi)) {
      const px = radiusPx(deref(rule[1]));
      if (px === null || px < 6) continue;
      tell('three-card-grid', sheet.file, sheetLine(sheet, grid.index),
        `a three-column grid of equal cards with a ${px}px corner`);
      break;
    }
  }

  const shadow = css.match(FRAMEWORK_SHADOWS);
  if (shadow) {
    tell('framework-default-scale', sheet.file, sheetLine(sheet, shadow.index),
      `the framework's default elevation ramp used unchanged: ${snip(shadow[0], 40)}`);
  }
  const radius = css.match(/(?:^|[;{\s])(?:--radius|--rounded|border-radius)\s*:\s*([\d.]+(?:px|rem))\s*[;}]/i);
  if (radius && FRAMEWORK_RADII.test(radius[1])) {
    tell('framework-default-scale', sheet.file, sheetLine(sheet, radius.index),
      `the framework's default corner radius used unchanged: ${radius[1]}`);
  }
  const sizes = new Set([...css.matchAll(/font-size\s*:\s*([\d.]+rem)/gi)].map((m) => m[1].toLowerCase()));
  const shared = FRAMEWORK_TYPE_SCALE.filter((s) => sizes.has(s));
  if (shared.length >= 4) {
    const first = css.match(new RegExp(`font-size\\s*:\\s*${shared[0].replace('.', '\\.')}`, 'i'));
    tell('framework-default-scale', sheet.file, first ? sheetLine(sheet, first.index) : 1,
      `the framework's default type scale used unchanged: ${shared.join(', ')}`);
  }

  /* The round-8 recipe. Named in SKILL.md section 5 as ours: three unrelated briefs
     converged on it, every page passed on its own, and the portfolio failed on sameness.
     All three parts have to be present, because each on its own is a legitimate choice. */
  const grounds = [];
  for (const m of css.matchAll(/(?:^|[;{\s])background(?:-color)?\s*:\s*([^;{}]+)/gi)) {
    const literal = (deref(m[1]).match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/i) ?? [])[0];
    const rgb = literal ? parseColour(literal) : null;
    if (rgb && luminance(rgb) < 0.06 && !insideDarkScheme(css, m.index)) grounds.push({ index: m.index, value: literal });
  }
  const accents = [...css.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)]
    .map((m) => parseColour(m[0])).filter(Boolean)
    .map(saturation).filter((x) => x.s >= 0.55 && x.l >= 0.3 && x.l <= 0.78);
  const tracked = css.match(/letter-spacing\s*:\s*(0?\.\d+em|[1-9][\d.]*px)/i);
  /* Typed capitals count. This leg required the CSS property, and across the five pages
     this repository has built the property appears zero times, because every one of them
     typed JOB 01 and UNDEROKTAV into the markup instead. A detector that cannot fire on
     the corpus it was written for is not a detector. */
  const typedCaps = markupFiles.some((f) => {
    const src = textOf(f);
    return [...src.matchAll(/>([^<>{}]{2,40})</g)]
      .map((m) => m[1].trim())
      .some((t) => /^[A-ZÆØÅ0-9][A-ZÆØÅ0-9 .·|/-]{2,}$/.test(t) && /[A-ZÆØÅ]{3}/.test(t));
  });
  const upper = /text-transform\s*:\s*uppercase/i.test(css) || typedCaps;
  if (grounds.length && accents.length && tracked && upper) {
    tell('round-8-recipe', sheet.file, sheetLine(sheet, grounds[0].index),
      `near-black ground ${grounds[0].value}, a saturated accent and wide-tracked uppercase: the combination this studio already shipped three times`);
  }
}


/* A near-black declared inside a dark-scheme block is not "a near-black ground". Every
   page with a dark mode has one, and reading it as an identity choice made the round-8
   detector refuse the one page in this repository the owner accepted, whose default
   ground is light. Counted by brace depth from the nearest preceding
   prefers-color-scheme: dark at-rule. */
function insideDarkScheme(css, index) {
  const before = css.slice(0, index);
  const at = before.lastIndexOf('prefers-color-scheme');
  if (at < 0) return false;
  if (!/dark/i.test(css.slice(at, at + 40))) return false;
  const span = css.slice(at, index);
  let depth = 0;
  for (const ch of span) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
  }
  return depth > 0;
}

/* An icon in a rounded square, repeated once per feature row. Matched on the wrapper class
   that recurs, because the recurrence is the tell: one is a decision, six is a template. */
for (const file of markupFiles) {
  const src = textOf(file);
  const wrappers = new Map();
  for (const m of markup(src).matchAll(/<(div|span|figure|i)\b[^>]*class=["']([^"']+)["'][^>]*>\s*<(svg|img)\b/gi)) {
    const cls = m[2].trim();
    if (!wrappers.has(cls)) wrappers.set(cls, []);
    wrappers.get(cls).push(m.index);
  }
  for (const [cls, hits] of wrappers) {
    if (hits.length < 3) continue;
    /* A radius between a hairline and a circle. 50% or 9999px is a round badge, which is a
       different move and not this tell. */
    const rounded = sheets.some((s) => {
      const deref = varResolver(s.css);
      return cls.split(/\s+/).some((c) => {
        const rx = new RegExp(`\\.${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^{}]*\\{([^}]*)\\}`, 'i');
        const m = s.css.match(rx);
        if (!m) return false;
        const px = radiusPx(deref(m[1]));
        return px !== null && px >= 2 && px <= 28;
      });
    });
    if (!rounded) continue;
    tell('icon-tile-row', file, lineOf(src, hits[0]),
      `"${snip(cls, 40)}" wraps an icon in a rounded square and repeats ${hits.length} times, once per feature row`);
  }
}

/* ── 10. direction fidelity, in the default colour scheme ──────────────── */

/* Measured in the default view, no exceptions. A direction that is only true under a forced
   dark scheme is not the direction anyone was shown. */
async function loadChromium() {
  try { return (await import('playwright')).chromium; } catch { /* fall through */ }
  for (const from of [process.cwd(), BUILD, SCRIPT_DIR, SKILL_DIR]) {
    try {
      const req = createRequire(join(from, 'package.json'));
      const pw = await import(pathToFileURL(req.resolve('playwright')).href);
      return pw.chromium ?? pw.default?.chromium;
    } catch { /* try the next root */ }
  }
  return null;
}

/* --url rendered any page in the world while the report named the build directory, so a
   must-refuse fixture passed by being pointed at a different page. An external target is
   now stated in the verdict line rather than left for the reader to infer. */
const entry = URL_TARGET
  ?? (existsSync(join(BUILD, 'index.html')) ? pathToFileURL(join(BUILD, 'index.html')).href
    : htmlFiles.length ? pathToFileURL(htmlFiles[0]).href : null);

if (!direction || !direction.palette || !direction.type) {
  withhold('direction fidelity', 'the direction record does not declare a palette and a type, so there is nothing to render against');
} else if (!entry) {
  withhold('direction fidelity', `no HTML to render under ${show(BUILD)} and no --url given`);
} else {
  const chromium = await loadChromium();
  if (!chromium) {
    withhold('direction fidelity', 'playwright is not installed, so nothing was rendered and the palette, type and signature verdicts are missing');
  } else {
    const sel = signatureSelector(direction);
    const browser = await chromium.launch();
    /* colorScheme: null disables emulation, which is what "the browser's default, with no
       scheme forced" means. Passing 'light' would force one and answer a question nobody
       asked. */
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: null });
    const page = await context.newPage();
    let measured = null;
    try {
      await page.goto(entry, { waitUntil: 'load', timeout: 20000 });
      measured = await page.evaluate(({ s, riskSel, secondSel }) => {
        const paint = (el) => {
          const c = getComputedStyle(el).backgroundColor;
          return /rgba?\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(c) ? null : c;
        };
        const ground = paint(document.documentElement) ?? paint(document.body) ?? 'rgb(255, 255, 255)';
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
        const biggest = heads.sort((a, b) =>
          parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize))[0];
        const first = (v) => (v ?? '').split(',')[0].replace(/["']/g, '').trim();
        const el = s ? document.querySelector(s) : null;

        /* The first viewport, measured rather than assumed. Two numbers, and they are the
           only positive requirements this package makes: something is there, and there is
           no large field where nothing is.

           paintedShare: the share of the first screen covered by matter that is not
           running text. An image, an inline drawing, a video, a canvas, or an element
           carrying a background image or gradient. Overlapping boxes are unioned on a
           coarse grid rather than summed, because summing rewards stacking.

           deadShare: the largest single rectangle of first screen with nothing in it, as
           a share of that screen. Whitespace is a decision and reads as one; a dead field
           is an absence and reads as that. */
        const VW = window.innerWidth, VH = window.innerHeight;
        const COLS = 48, ROWS = 30;
        const cw = VW / COLS, ch = VH / ROWS;
        const painted = new Uint8Array(COLS * ROWS);
        const occupied = new Uint8Array(COLS * ROWS);
        const mark = (grid, r) => {
          const x0 = Math.max(0, Math.floor(r.left / cw)), x1 = Math.min(COLS - 1, Math.ceil(r.right / cw) - 1);
          const y0 = Math.max(0, Math.floor(r.top / ch)), y1 = Math.min(ROWS - 1, Math.ceil(r.bottom / ch) - 1);
          for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) grid[y * COLS + x] = 1;
        };
        const inFirst = (r) => r.width > 0 && r.height > 0 && r.top < VH && r.bottom > 0 && r.left < VW && r.right > 0;
        const PICTORIAL = 'img,svg,video,canvas,picture,figure';
        for (const n of document.querySelectorAll('*')) {
          if (!n.getClientRects().length) continue;
          const r = n.getBoundingClientRect();
          if (!inFirst(r)) continue;
          const cs = getComputedStyle(n);
          /* Occupancy is what a reader can see, not what exists. Marking every element
             with area marks the body, which covers the screen, which makes the dead-field
             number zero on every page ever measured. Only three things occupy: text a
             person can read, a pictorial element, and a surface whose own background
             differs from the one behind it. */
          const hasText = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim().length > 1);
          const ownBg = cs.backgroundColor;
          const parentBg = n.parentElement ? getComputedStyle(n.parentElement).backgroundColor : '';
          const paintsSurface = ownBg && !/rgba?\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(ownBg)
            && ownBg !== parentBg && n !== document.body && n !== document.documentElement;
          const borders = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) > 0;
          if (hasText || n.matches(PICTORIAL) || paintsSurface || borders) mark(occupied, r);
          const bg = cs.backgroundImage;
          const pictorial = n.matches(PICTORIAL);
          const painterly = bg && bg !== 'none';
          const boxIsBig = r.width * r.height > (VW * VH) / 400;
          if ((pictorial || painterly) && boxIsBig) mark(painted, r);
        }
        const share = (g) => g.reduce((n, v) => n + v, 0) / g.length;

        /* Largest empty rectangle, by the standard histogram sweep over the occupancy
           grid. Cheap, exact on the grid, and the grid is coarse on purpose: a one-cell
           gap between two paragraphs is not a dead field and should not read as one. */
        let best = 0;
        const heights = new Array(COLS).fill(0);
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) heights[x] = occupied[y * COLS + x] ? 0 : heights[x] + 1;
          const stack = [];
          for (let x = 0; x <= COLS; x++) {
            const h = x === COLS ? 0 : heights[x];
            let start = x;
            while (stack.length && stack[stack.length - 1][1] >= h) {
              const [i, hh] = stack.pop();
              best = Math.max(best, hh * (x - i));
              start = i;
            }
            stack.push([start, h]);
          }
        }

        /* The same emptiness, below the fold. deadShare above only sees the first screen,
           and every page this repository has rejected for it was rejected for something
           visible in the first 900px. The defect that keeps coming back is further down:
           a column pinned to one edge while the ground it sits on runs the full width, so
           the right half of the screen is bare for the length of a section.

           Measured three times now on three unrelated briefs. `a-bellfoundry` set four
           sections to max-width:70ch with no margin-inline, and the whole page sat in the
           left half of a 1440 screen. Two builds from a later generation did it again in
           a different costume. Nothing could see it, because the dead-field sweep stops
           at the fold and the band starts at y=1130.

           Per band, not per page: a page is allowed a narrow column, and a centred one
           has equal gaps and never trips this. What trips it is one gap much larger than
           the other, which is not a measure, it is a column somebody forgot to close. */
        const bigEnough = (n) => {
          const c = getComputedStyle(n);
          const q = n.getBoundingClientRect();
          return c.display !== 'none' && c.visibility !== 'hidden' && q.width > 400 && q.height > 200;
        };
        /* Sectioning elements as well as top-level children, because a page whose whole
           body is one <main> has one band by that reading and the measure would be blind
           to every section inside it. */
        const main = document.querySelector('main') ?? document.body;
        const bandList = [...new Set([
          ...main.children,
          ...document.body.children,
          ...document.querySelectorAll('section, article, aside, header, footer, form'),
        ])].filter((n) => n.nodeType === 1 && !n.closest('svg') && bigEnough(n));

        /* The boxes inside a band count too, and one reviewer found five of them on a page
           whose bands were all fine. A framed panel is a band to the eye: the reader sees a
           rectangle with a ground, and half of it empty reads the same whether the ground
           belongs to a <section> or to a <div> with a border. Only boxes that draw their
           own surface, because an invisible wrapper is not a rectangle anybody sees. */
        const seen = new Set(bandList);
        for (const band of [...bandList]) {
          for (const n of band.querySelectorAll('*')) {
            if (seen.has(n) || n.closest('svg')) continue;
            const c = getComputedStyle(n);
            if (c.display === 'none' || c.visibility === 'hidden') continue;
            if (!/^(block|flex|grid|flow-root|list-item)$/.test(c.display)) continue;
            const q = n.getBoundingClientRect();
            if (q.width <= 400 || q.height <= 200) continue;
            const parentBg = n.parentElement ? getComputedStyle(n.parentElement).backgroundColor : '';
            const paints = c.backgroundColor && !/rgba?\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(c.backgroundColor)
              && c.backgroundColor !== parentBg;
            const framed = parseFloat(c.borderTopWidth) > 0 && parseFloat(c.borderLeftWidth) > 0;
            if (!paints && !framed) continue;
            const p = n.parentElement?.getBoundingClientRect();
            if (p && q.width > p.width - 8 && q.height > p.height - 8) continue; // same rectangle as its parent
            seen.add(n);
            bandList.push(n);
          }
        }

        const occupies = (n) => {
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
          const hasText = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim().length > 1);
          const ownBg = cs.backgroundColor;
          const parentBg = n.parentElement ? getComputedStyle(n.parentElement).backgroundColor : '';
          const paintsSurface = ownBg && !/rgba?\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(ownBg)
            && ownBg !== parentBg && n !== document.body && n !== document.documentElement;
          return hasText || n.matches(PICTORIAL) || paintsSurface;
        };

        /* Read in horizontal strips rather than as one bounding box. A bounding box says a
           band is full width the moment one heading or one rule spans it, and the reviewer
           who found five of these was looking at boxes whose heading ran the whole way and
           whose every other line stopped at 57 per cent. The eye reads the majority of the
           rows, so the measure does too. */
        const STRIP = 16;
        /* A rule, a row or a panel drawn far wider than anything inside it. Three
           reviewers on three unrelated pages in three rounds wrote the same sentence in
           their own words: "the line over Temperatur runs 860px out to x=1150 while the
           figures under it stop at x=516, a rule that points at nothing for three quarters
           of its length"; "the band is 1368px wide and holds two 12px dots and a 210px
           chip, about 80 per cent bare, it looks like a component that has not finished
           loading"; "the table's lines run to x=1050 but the numbers stop at x=690, so
           every row has 360px of rule going nowhere".

           Not the same defect as a lopsided band. That one is about a column against an
           edge; this one is about a single element whose own box promises content it does
           not have, and it fires on elements far too short to be a band. */
        const overdrawn = [];
        for (const n of document.querySelectorAll('*')) {
          if (n.closest('svg') || !n.getClientRects().length) continue;
          const q = n.getBoundingClientRect();
          /* Short things only: a rule, a row, a strip. Every case a reviewer named was one
             of those. Taller boxes are bands, and the band measures above already read
             them; letting this one see them made it refuse an ordinary footer whose two
             lines are shorter than its own border. */
          if (q.width < 320 || q.height < 6 || q.height > 80) continue;
          const cs = getComputedStyle(n);
          const draws = (cs.backgroundColor && !/rgba?\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(cs.backgroundColor))
            || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderBottomWidth) > 0
            || (cs.backgroundImage && cs.backgroundImage !== 'none');
          if (!draws || !n.children.length) continue;
          let l = Infinity, r = -Infinity;
          for (const c of n.querySelectorAll('*')) {
            const t = [...c.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim().length > 1);
            if (!t && !c.matches(PICTORIAL)) continue;
            const g = c.getBoundingClientRect();
            if (g.width < 3 || g.height < 3) continue;
            l = Math.min(l, g.left); r = Math.max(r, g.right);
          }
          /* A heading that does not fill its line is not this defect. Every case a
             reviewer named was a container: a table row whose cells stop short of its own
             rule, a strip holding two dots and a chip, a dl row whose figures stop at a
             quarter of the line over them. So only containers, and only the ink in their
             children. */
          if (!Number.isFinite(l)) continue;          // an empty rule is a rule, not a defect
          /* Overhang, not fill. A row with a label on the left and a figure on the right is
             full at both ends and reads as finished however much air is between them; what
             the reviewers named was one end of a drawn element running past the last thing
             in it. "A rule that points at nothing for three quarters of its length." */
          const rightOver = q.right - r;
          const leftOver = l - q.left;
          const over = Math.max(rightOver, leftOver);
          if (over > 240 && over / q.width > 0.25) {
            overdrawn.push({
              tag: n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' ? `.${n.className.trim().split(/\s+/)[0]}` : ''),
              y: Math.round(window.scrollY + q.top),
              width: Math.round(q.width),
              contentWidth: Math.round(r - l),
              overhang: Math.round(over),
              side: rightOver >= leftOver ? 'right' : 'left',
              share: Number((over / q.width).toFixed(2)),
              text: (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
            });
          }
        }

        const bands = [];
        for (const band of bandList) {
          const br = band.getBoundingClientRect();
          const rects = [];
          /* Where the reading starts, which is not where the card starts. A reviewer who
             measured these by hand read the x of the first letter in each band; measuring
             the leftmost painted box instead reported a card's own background as the
             page's left edge and put two bands 7px apart that a reader sees 48px apart. */
          let inkLeft = Infinity;
          for (const n of band.querySelectorAll('*')) {
            if (n.closest('svg') && n.tagName.toLowerCase() !== 'svg') continue;
            if (!n.getClientRects().length || !occupies(n)) continue;
            const q = n.getBoundingClientRect();
            if (q.width < 4 || q.height < 4) continue;
            rects.push(q);
            const inks = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim().length > 1)
              || n.matches(PICTORIAL);
            if (inks) inkLeft = Math.min(inkLeft, q.left);
          }
          if (!rects.length) continue;

          let strips = 0, lopsided = 0, worstLeft = 0, worstRight = 0, narrowest = 1;
          let minL = Infinity, maxR = -Infinity;
          for (let y = br.top; y < br.bottom; y += STRIP) {
            let l = Infinity, r = -Infinity;
            for (const q of rects) {
              if (q.bottom <= y || q.top >= y + STRIP) continue;
              l = Math.min(l, q.left);
              r = Math.max(r, q.right);
            }
            if (!Number.isFinite(l)) continue;   // a strip with nothing in it is padding
            strips++;
            minL = Math.min(minL, l); maxR = Math.max(maxR, r);
            const used = (r - l) / br.width;
            const lg = l - br.left, rg = br.right - r;
            if (used < 0.62 && Math.abs(lg - rg) / br.width > 0.15) {
              lopsided++;
              if (used < narrowest) { narrowest = used; worstLeft = lg; worstRight = rg; }
            }
          }
          if (!strips) continue;
          /* A wrapper that is the same rectangle as a band inside it is not a second
             finding. Report the innermost one, so the reason names an element somebody
             can open rather than the container it happens to sit in. */
          const swallowed = bandList.some((other) => {
            if (other === band || !band.contains(other)) return false;
            const o = other.getBoundingClientRect();
            return o.height > br.height * 0.8;
          });
          if (swallowed) continue;

          /* The band's outer frame, and only the outer frame. An earlier version of this
             keyed on tables, figures, lists and forms as well, and reported five distinct
             families on a page where a reviewer counted three of five sections identical.
             The reviewer was reading the shape of the column, so this reads that too: how
             many columns the widest row has, and how much of the band they use. */
          /* Down three levels, not one. The first version read the band's own children,
             so a section holding a heading and one grid of three cards counted as one
             column: the cards were a level deeper than it looked. It reported four of five
             bands identical on a console a reviewer had just called six distinct layouts,
             one per section, and the reviewer was right. */
          const vis2 = (k) => {
            const c = getComputedStyle(k);
            const q = k.getBoundingClientRect();
            return c.display !== 'none' && c.visibility !== 'hidden' && q.width > 8 && q.height > 8;
          };
          let widest = [];
          const walk = (node, depth) => {
            if (depth > 3) return;
            const kids = [...node.children].filter(vis2);
            const rows = new Map();
            for (const k of kids) {
              const q = k.getBoundingClientRect();
              const key = Math.round(q.top / 24);
              if (!rows.has(key)) rows.set(key, []);
              rows.get(key).push(q);
            }
            for (const row of rows.values()) {
              const span = row.reduce((s, q) => s + q.width, 0);
              /* Three quarters of the band, because the reviewer who counted these read the
                 outer frame and said so: a two-column list inside a prose column is "a
                 variation, not a family". A row has to span most of the band before it is
                 the band's shape. */
              if (row.length > widest.length && span > br.width * 0.75) widest = row
            }
            for (const k of kids) walk(k, depth + 1);
          };
          walk(band, 0);
          const cols = Math.min(widest.length, 4);
          const spanShare = (maxR - minL) / br.width;
          const width = spanShare > 0.9 ? 'full' : spanShare > 0.7 ? 'wide' : 'narrow';
          let family = `${cols || 1}col-${width}`;
          if (cols === 2 && widest.length === 2) {
            const share = widest[0].width / (widest[0].width + widest[1].width);
            family += share > 0.6 ? '-wideleft' : share < 0.4 ? '-wideright' : '-even';
          }

          bands.push({
            family,
            contentLeft: Number.isFinite(inkLeft) ? Math.round(inkLeft) : Math.round(minL),
            /* A band, not the box that holds the bands. main and body are containers whose
               content-left is whichever of their children reaches furthest left, so
               comparing one against its own child reported a page as ragged against
               itself. */
            topLevel: (band.parentElement === main || band.parentElement === document.body)
              && band !== main && band.tagName !== 'MAIN' && band.tagName !== 'BODY',
            container: band === main || band.tagName === 'MAIN' || band.tagName === 'BODY',
            name: (band.querySelector('h1,h2,h3')?.textContent ?? band.tagName).trim().slice(0, 48),
            tag: band.tagName.toLowerCase() + (band.id ? `#${band.id}` : ''),
            y: Math.round(window.scrollY + br.top),
            height: Math.round(br.height),
            lopsidedRows: Number((lopsided / strips).toFixed(2)),
            usedWidth: Number(narrowest.toFixed(2)),
            leftGap: Math.round(worstLeft),
            rightGap: Math.round(worstRight),
          });
        }

        return {
          ground,
          display: biggest ? first(getComputedStyle(biggest).fontFamily) : null,
          body: first(getComputedStyle(document.body).fontFamily),
          signature: !!el && (el.getClientRects().length > 0 || !!el.getBoundingClientRect().width),
          bands,
          overdrawn: overdrawn.sort((a, b) => b.overhang - a.overhang).slice(0, 8),
          firstViewport: {
            paintedShare: Number(share(painted).toFixed(3)),
            deadShare: Number((best / (COLS * ROWS)).toFixed(3)),
            shell: {
              /* Anywhere on the page, not only the first screen: a footer is a shell. The
                 skip link does not count, because it is an accessibility affordance and
                 not a way for a reader to act. */
              actions: [...document.querySelectorAll('a[href],button')]
                .filter((el) => !/^#(main|content|top)?$/i.test(el.getAttribute('href') ?? '')
                  && !/skip|spring/i.test(el.textContent || ''))
                .length,
              nav: Boolean(document.querySelector('nav, [role="navigation"], header a[href]')),
              footer: Boolean(document.querySelector('footer, [role="contentinfo"]')),
            },
            /* Controls a person can actually reach without scrolling, and not counting the
               ones every page has at the top. Two reviewers of two unrelated consoles, one
               per round, said the same thing: the screen opens on inventory and the work is
               below the fold. "There is no button on the first screen ... the whole job is
               1250px further down." A tool whose first screen has nothing to press is a
               report. */
            reachableActions: [...document.querySelectorAll('button, input:not([type=hidden]), select, textarea, a[href]')]
              .filter((el) => {
                if (el.closest('nav, header, footer, [role="navigation"], [role="banner"], [role="contentinfo"]')) return false;
                /* The shell is not the work. A brand mark pointing at the site root and an
                   anchor that only moves the viewport are both ways around the page, and a
                   console whose first screen offers only those offers nothing. */
                const href = el.getAttribute('href');
                if (href !== null && (href.startsWith('#') || /^\.?\/?$/.test(href))) return false;
                if (/skip|spring/i.test(el.textContent || '')) return false;
                if (el.disabled) return false;
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0 && r.top < VH && r.bottom > 0;
              })
              .map((el) => el.tagName.toLowerCase() + (el.getAttribute('type') ? `[${el.getAttribute('type')}]` : ''))
              .slice(0, 12),
          },
          riskAnswerPresent: riskSel ? Boolean(document.querySelector(riskSel)) : null,
          /* The second reading, measured on three axes rather than one: is it there, is it
             below the first screen, and does it read a different fact than the signature.
             The third is the one that matters. Asked for a second reading with nothing
             else said, the cheapest answer is the same drawing again lower down, and this
             package has watched itself take the cheapest answer before. Facts are compared
             as the numbers-with-units and proper nouns each element carries, because that
             is what the reviewers were reading when they said "the hatching density IS the
             shore rating". */
          secondReading: (() => {
            if (!secondSel) return null;
            const e2 = document.querySelector(secondSel);
            if (!e2) return { present: false };
            const r2 = e2.getBoundingClientRect();
            const factsOf = (node) => {
              if (!node) return [];
              const t = (node.textContent || '').replace(/\s+/g, ' ');
              const nums = t.match(/\d[\d.,]*\s*(?:%|[a-zA-ZæøåÆØÅ]{1,6}\b)?/g) ?? [];
              return [...new Set(nums.map((x) => x.trim().toLowerCase()).filter((x) => x.length > 1))];
            };
            const sigFacts = factsOf(el);
            const myFacts = factsOf(e2);
            const shared = myFacts.filter((f) => sigFacts.includes(f));
            return {
              present: true,
              y: Math.round(window.scrollY + r2.top),
              inFirstScreen: r2.top < VH && r2.bottom > 0,
              facts: myFacts.length,
              sharedWithSignature: shared.length,
              shareRatio: myFacts.length ? Number((shared.length / myFacts.length).toFixed(2)) : 0,
              examples: shared.slice(0, 5),
            };
          })(),
        };
      }, { s: sel, riskSel: riskAnswerSelector, secondSel: secondReadingSelector });
    } catch (e) {
      withhold('direction fidelity', `${entry} did not render: ${e.message.split('\n')[0]}`);
    } finally {
      await browser.close();
    }

    if (measured) {
      /* The positive requirements, and the only ones in this package. Everything else
         here refuses a defect; these two refuse an absence.

         Scoped to the surfaces that are sold on how they look. A dashboard is dense with
         its own data and a documentation page is text on purpose; demanding painted
         matter there would produce decoration, which is the failure in the other
         direction. An experience or marketing page whose first screen is words on a flat
         ground has not started, and all three S17 holdouts shipped exactly that with
         every gate green.

         The floors are set from measurement rather than taste: the three rejected pages
         scored 0.00 painted and 0.30 to 0.47 dead. */
      const PAINT_FLOOR = 0.15;
      const DEAD_CEILING = 0.28;
      const fv = measured.firstViewport ?? null;
      const looksSurface = /\b(experience|marketing|campaign|launch|editorial)\b/i.test(declaredSurface);
      /* The shell, and this is the cleanest correlation in the whole corpus. Four pages
         this repository rejected have exactly one anchor each, the skip link, and no nav
         and no footer between them. The one page the owner accepted has twelve anchors, a
         nav and a footer. Nothing anywhere required it, so nobody built it.

         Refused unless the record's "The shell" section says so on purpose: a surface can
         genuinely have no way out, and that answer has to be typed rather than happen. */
      const shellDeclaredNone = /^\s*none[.\s]*$/i.test(shellSection);
      if (fv && shellDeclaredNone) {
        waived.push({
          cls: 'look/no-shell',
          file: show(DIRECTION_PATH),
          line: 1,
          detail: 'the record answers "The shell" with none, so this page is allowed to have no way out. A reader arriving here cannot find out who this is.',
        });
      }
      if (fv && !shellDeclaredNone) {
        if (fv.shell.actions < 2) {
          refuse('look/no-way-out', join(BUILD, 'index.html'), 1,
            `the page carries ${fv.shell.actions} link or button that is not the skip link. A reader who wants to act, or to find out who this is, has nowhere to go. Declare "none" in "The shell" with a reason, or give them one.`);
        }
        if (!fv.shell.nav && !fv.shell.footer) {
          refuse('look/no-shell', join(BUILD, 'index.html'), 1,
            'no nav and no footer. Nothing on the page says who this is, where they are, or what else exists.');
        }
      }

      /* A page about a physical subject with no photograph of it is a draft. The rule is
         ui-ux-pro-max's and it is stated there without hedging: a pure-text page is not
         minimalism, it is incomplete work. This repository proved the point the hard way,
         with five pages and zero <img> between them, every one of them drawing its way out
         of an ask nobody made.

         Downgraded by --draft rather than absolute, because a draft with the missing
         photograph named is the honest state of a page waiting on the client. What it may
         not be is a release. */
      const photoRefusal = DRAFT ? warn : refuse;
      const wantsPhoto = /\b(buy|experience|marketing|campaign|launch|editorial|redesign)\b/i.test(declaredSurface);
      const hasPhoto = markupFiles.some((f) => /<img\b|<picture\b|background-image\s*:\s*url\(\s*['"]?[^'")]*\.(jpe?g|png|webp|avif)/i.test(textOf(f)));
      if (wantsPhoto && !hasPhoto) {
        photoRefusal('look/no-photograph', MANIFEST_PATH, 1,
          'no photograph anywhere on a page about something that exists. look.md section 3: ask the client for one, source a licensed one, or ship as a draft with the missing asset named. A drawing is the right answer for a section and the wrong one for a thing you could photograph.');
      }

      /* The answer to the risk has to be on the page. The model wrote the owner's review
         into the Risk field five times before building, and every one of those builds
         shipped green because nothing read the field. */
      if (riskAnswerSelector && measured.riskAnswerPresent === false) {
        refuse('look/risk-unanswered', DIRECTION_PATH, 1,
          `the record answers its own risk with "${riskAnswerSelector}", and that is not in the rendered page. A risk written down and not answered is the review, filed early.`);
      }

      /* Bands whose content sits against one edge while the ground runs the full width.
         This is the one defect that has survived every rebuild, and it survives because
         every check for it stops at the fold: the bands that fail are at y=1130 and
         below, where deadShare has never looked.

         Not scoped to looks surfaces. Two blind reviewers, given only the brief and the
         render, put it first on two unrelated pages: "we are paying for a page, not for a
         column", "on 1440 there is a vertical edge at about 590px where the page simply
         stops". A read page did it in three bands out of five and a buy page in one.

         A centred column has equal gaps and never trips this, so the cheapest way past is
         also the right fix. The other ways past are to put something in the space that
         earns it, or to type the claim into Deliberate: and own it. */
      const LOPSIDED_ROWS = 0.6;    // most of the band's rows, not one of them
      const lop = (measured.bands ?? []).filter((b) => b.lopsidedRows > LOPSIDED_ROWS);
      for (const band of lop) {
        const claimed = deliberate.has('lopsided-band') || deliberate.has(band.tag.toLowerCase());
        const detail = `${band.tag} "${band.name}" at y=${band.y} is ${band.height}px tall and `
          + `${Math.round(band.lopsidedRows * 100)}% of its rows stop against one edge, the narrowest spanning `
          + `${Math.round(band.usedWidth * 100)}% of the width with ${band.leftGap}px of ground on the left and `
          + `${band.rightGap}px on the right. The ground runs the whole way, so the flank reads as an `
          + `unfinished column rather than as margin. Centre it, give the space something that earns it, or `
          + `claim \`lopsided-band\` under Deliberate: with the reason.`;
        if (claimed) waived.push({ cls: 'look/lopsided-band', file: show(join(BUILD, 'index.html')), line: 1, detail: deliberate.get('lopsided-band') ?? deliberate.get(band.tag.toLowerCase()) });
        else refuse('look/lopsided-band', join(BUILD, 'index.html'), 1, detail);
      }

      /* The page's left edge, and whether it has one. A reviewer paid to accept a read
         surface put this first, above everything else on the page: "H1 starts at x=148,
         the next heading at x=339, the two after that at x=291, the footer back at 148.
         Four blocks straight above each other, three different left edges. It is the first
         thing the eye catches when you scroll, and it is the kind of thing that makes a
         paying board ask whether the page is finished."

         Near misses only, and that is the whole idea. Two edges three hundred pixels apart
         read as a decision; two edges forty-eight pixels apart read as an accident. So a
         full-bleed band beside an indented column is untouched, and a column that almost
         lines up with the one above it is not. */
      /* The reviewer who found this stated the rule better than the first version of this
         check did: "every band heading and all the body text hits 132, and that is the
         page's spine. Two content blocks break it for no reason, the day strip's figure at
         352 and the whole order form at 304. Those two are not another column, they are
         the same column shifted, and that is why it reads as accidental rather than
         planned. The other deviations, 694, 760, 162, 530 and 936, are real columns and do
         not count against it."

         So: find the spine, which is the edge the most bands share, and measure everything
         against it. A second column inside a split band is never the band's own left edge,
         so it never enters this. */
      const EDGE_SAME = 6;                 // within this, the same edge
      const EDGE_DELIBERATE = 0.22;        // beyond this share of the width, a decision
      const VIEW = 1440;
      const edgeBands = (measured.bands ?? []).filter((b) => !b.container && b.height > 200);
      const edges = [];
      for (const b of edgeBands) {
        const near = edges.find((e) => Math.abs(e.x - b.contentLeft) <= EDGE_SAME);
        if (near) near.bands.push(b);
        else edges.push({ x: b.contentLeft, bands: [b] });
      }
      edges.sort((a, b) => b.bands.length - a.bands.length || a.x - b.x);
      const spine = edges[0];
      const offSpine = spine
        ? edges.slice(1).filter((e) => {
          const d = Math.abs(e.x - spine.x);
          return d > EDGE_SAME && d < VIEW * EDGE_DELIBERATE;
        })
        : [];
      if (offSpine.length && !deliberate.has('ragged-margin')) {
        const worst = offSpine.sort((a, b) => Math.abs(b.x - spine.x) - Math.abs(a.x - spine.x))[0];
        refuse('look/ragged-margin', join(BUILD, 'index.html'), 1,
          `${spine.bands.length} of ${edgeBands.length} bands start at x=${spine.x}, so that is this page's spine. `
          + `${worst.bands[0].tag} "${worst.bands[0].name}" starts at x=${worst.x}, ${Math.abs(worst.x - spine.x)}px off it`
          + `${offSpine.length > 1 ? `, and ${offSpine.length - 1} more band(s) sit off it too` : ''}. `
          + 'That is not a second column, it is the same column shifted, which is why it reads as accidental. '
          + 'Put it on the spine, move it far enough to read as a decision, or claim `ragged-margin` under Deliberate:.');
      } else if (offSpine.length) {
        waived.push({ cls: 'look/ragged-margin', file: show(join(BUILD, 'index.html')), line: 1, detail: deliberate.get('ragged-margin') });
      }

      /* One layout, worn by most of the page. Three reviewers on three unrelated pages
         across two rounds said the same sentence in their own words: "three of five
         sections use the same layout", "four sections plus six nested uses of one split",
         "the front has an idea, after that it is a Word document on a green ground".

         Four bands or more, because a three-section page repeating twice is a rhythm and
         a seven-section page repeating five times is a template. */
      const shapeBands = (measured.bands ?? []).filter((b) => b.topLevel && b.height > 200);
      const families = new Map();
      for (const b of shapeBands) families.set(b.family, (families.get(b.family) ?? 0) + 1);
      const worst = [...families.entries()].sort((a, b) => b[1] - a[1])[0];
      if (shapeBands.length >= 4 && worst && worst[1] / shapeBands.length > 0.5) {
        const which = shapeBands.filter((b) => b.family === worst[0]);
        const detail = `${worst[1]} of ${shapeBands.length} bands are the same shape, \`${worst[0]}\`: `
          + `${which.map((b) => `"${b.name}"`).join(', ')}. `
          + `${families.size} distinct layout${families.size === 1 ? '' : 's'} on the page. `
          + 'A reader scrolling past three identical frames stops reading the page and starts reading a document. '
          + 'Give one of them a shape its own content asks for, or claim `one-layout` under Deliberate:.';
        if (deliberate.has('one-layout')) waived.push({ cls: 'look/one-layout', file: show(join(BUILD, 'index.html')), line: 1, detail: deliberate.get('one-layout') });
        else refuse('look/one-layout', join(BUILD, 'index.html'), 1, detail);
      }

      /* A tool's first screen has to hold the work. Two reviewers, two rounds, two
         unrelated consoles, and neither saw the other's page: "the top 200px go on vehicle
         inventory, not on routes, and the list starts at the bottom edge"; "there is no
         button on the first screen, and the call that is waiting is 1250px further down".
         Both pages passed every other check in this file.

         Only operate, because a page that reads or persuades earns its first screen with a
         picture and an argument, and demanding a control there would put a button on an
         essay. */
      /* The second reading has to be on the page, below the fold, and about something
         else. Nine reviewers named one thing they liked and it was the same move nine
         times; four of them then said the page was generic with that one thing cut out. */
      const sr = measured.secondReading;
      if (secondReadingSelector && sr) {
        if (!sr.present) {
          refuse('look/second-reading-missing', DIRECTION_PATH, 1,
            `the record names "${secondReadingSelector}" as the second reading of this subject, and it is not in the rendered page.`);
        } else if (sr.inFirstScreen) {
          refuse('look/one-reading', join(BUILD, 'index.html'), 1,
            `"${secondReadingSelector}" is in the first screen at y=${sr.y}, beside the signature. A page whose whole `
            + 'argument fits above the fold has one reading, and a reviewer who scrolls past it meets chrome. '
            + 'Put the second reading where the reader arrives after the first one has done its work.');
        } else if (sr.facts >= 3 && sr.shareRatio > 0.6) {
          refuse('look/one-reading', join(BUILD, 'index.html'), 1,
            `"${secondReadingSelector}" reads the same facts as the signature: ${Math.round(sr.shareRatio * 100)}% shared`
            + `${sr.examples.length ? ` (${sr.examples.join(', ')})` : ''}. That is the same drawing twice, which is the `
            + 'cheapest answer to being asked for a second one. Render a different measurement of this subject.');
        }
      }

      /* Elements drawn wider than the content they hold. Reported per element with its own
         numbers, because the fix is per element: shorten the rule to what it underlines,
         or put something under it that earns the width. */
      const over = measured.overdrawn ?? [];
      if (over.length && !deliberate.has('wider-than-its-content')) {
        const worst = over[0];
        refuse('look/wider-than-its-content', join(BUILD, 'index.html'), 1,
          `${worst.tag} at y=${worst.y} is ${worst.width}px wide and its content stops ${worst.overhang}px short of the `
          + `${worst.side}, ${Math.round(worst.share * 100)}% of its own width${worst.text ? ` ("${snip(worst.text, 36)}")` : ''}`
          + `${over.length > 1 ? `, and ${over.length - 1} more element(s) like it` : ''}. `
          + 'A rule that points at nothing for most of its length, or a panel drawn for content that is not there, '
          + 'reads as something that failed to load. Shorten it to what it holds, give it something that earns the '
          + 'width, or claim `wider-than-its-content` under Deliberate:.');
      } else if (over.length) {
        waived.push({ cls: 'look/wider-than-its-content', file: show(join(BUILD, 'index.html')), line: 1, detail: deliberate.get('wider-than-its-content') });
      }

      const operateSurface = /\b(operate|console|dashboard|admin|panel|tool)\b/i.test(declaredSurface);
      if (operateSurface && fv?.reachableActions) {
        if (!fv.reachableActions.length) {
          refuse('operate/nothing-to-do-on-the-first-screen', join(BUILD, 'index.html'), 1,
            'the first screen at 1440x900 carries no control outside the navigation: no button, no field, no link '
            + 'that does the thing this surface exists for. An operator opens this and can only read. '
            + 'Put the work on the first screen, or move what is there below it.');
        }
      }

      if (looksSurface && fv) {
        if (fv.paintedShare < PAINT_FLOOR) {
          refuse('look/first-viewport-unpainted', join(BUILD, 'index.html'), 1,
            `${Math.round(fv.paintedShare * 100)}% of the first screen carries anything but running text, and this surface needs at least ${Math.round(PAINT_FLOOR * 100)}%. look.md section 4: decide what object owns the first screen.`);
        }
        if (fv.deadShare > DEAD_CEILING) {
          refuse('look/dead-field', join(BUILD, 'index.html'), 1,
            `the largest empty rectangle on the first screen is ${Math.round(fv.deadShare * 100)}% of it, over the ${Math.round(DEAD_CEILING * 100)}% ceiling. Whitespace is a decision and reads as one; this reads as an absence.`);
        }
      }

      const declared = [...direction.palette.value.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)]
        .map((m) => parseColour(m[0])).filter(Boolean).map(luminance);
      const unparsed = /oklch|oklab|\blch\(|\blab\(/i.test(direction.palette.value);
      if (!declared.length) {
        withhold('direction fidelity: ground',
          unparsed
            ? 'the declared palette uses a colour space this gate cannot convert, so the ground luminance verdict is missing'
            : 'the Palette: line declares no colour value the gate can read, so the ground luminance verdict is missing');
      } else {
        const rendered = parseColour(measured.ground);
        const lum = rendered ? luminance(rendered) : null;
        const lo = Math.min(...declared) - 0.02, hi = Math.max(...declared) + 0.02;
        if (lum === null) {
          withhold('direction fidelity: ground', `the rendered ground "${measured.ground}" could not be read as a colour`);
        } else if (lum < lo || lum > hi) {
          refuse('direction/ground-outside-declared-band', DIRECTION_PATH, direction.palette.line,
            `the page renders a ground of ${measured.ground} (luminance ${lum.toFixed(3)}) and the declared palette implies ${lo.toFixed(3)} to ${hi.toFixed(3)}`);
        }
      }

      /* Roles are bound where the line binds them. A Type: line that names a display face
         and a body face is declaring two different obligations, and checking the rendered
         face against the union of both would pass a page that swapped them, which is the
         one type failure worth catching. */
      const role = (word) => {
        const m = direction.type.value.match(new RegExp(`\\b${word}\\b[^"'\`]{0,30}["'\`]([^"'\`]{2,40})["'\`]`, 'i'));
        return m ? m[1].trim() : null;
      };
      const anyFamily = [...direction.type.value.matchAll(/["'`]([^"'`]{2,40})["'`]/g)].map((m) => m[1].trim());
      const near = (a, b) => !!a && !!b && (a.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(a.toLowerCase()));

      if (!anyFamily.length) {
        withhold('direction fidelity: type',
          'the Type: line names no family in quotes, so the rendered display and body faces cannot be checked against it');
      } else {
        for (const [word, rendered, cls] of [
          ['display', measured.display, 'direction/display-face-not-the-declared-one'],
          ['body', measured.body, 'direction/body-face-not-the-declared-one'],
        ]) {
          const bound = role(word);
          const ok = bound ? near(rendered, bound) : anyFamily.some((d) => near(rendered, d));
          if (ok) continue;
          refuse(cls, DIRECTION_PATH, direction.type.line,
            `${word === 'display' ? 'the largest heading' : 'body text'} renders in "${rendered ?? 'nothing the gate could read'}" and the record declares ${bound ? `"${bound}"` : anyFamily.map((f) => `"${f}"`).join(', ')}`);
        }
      }

      if (sel && !measured.signature) {
        refuse('direction/signature-does-not-render', DIRECTION_PATH, direction.signature.line,
          `\`${sel}\` is the signature this build was designed around and it is not in the rendered DOM`);
      }
    }
  }
}

report(missing);

/* ── the report ────────────────────────────────────────────────────────── */

function report(missingVerdicts) {
  const uniq = [];
  const seen = new Set();
  for (const f of refusals) {
    const key = `${f.cls}|${f.file}|${f.line}|${f.detail}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(f);
  }

  console.log(`\n  gate ${EM} ${markupFiles.length} markup, ${cssFiles.length} css, ${allFiles.length} file(s) under ${show(BUILD)}${URL_TARGET ? `  [rendered from ${URL_TARGET}, not from this directory]` : ''}${DRAFT ? '  [--draft]' : ''}\n`);

  console.log('  MEASURED, never gated');
  if (vocabularyShare === null) {
    console.log('    world-derived token vocabulary: no custom properties are declared, so there is nothing to measure');
  } else {
    console.log(`    world-derived token vocabulary: ${genericNames.length} of ${declaredTokenNames.size} declared names come from the framework vocabulary (${(vocabularyShare * 100).toFixed(0)}%)`);
    if (genericNames.length) console.log(`      generic: ${genericNames.slice(0, 12).join(' ')}`);
  }
  console.log('    This number never fails the run. It is n=2, it has no upstream source, it is defeated');
  console.log('    by find-and-replace, and mandating it would manufacture the same move on every build.\n');

  if (waived.length) {
    console.log('  WAIVED, claimed on purpose in the direction record');
    for (const w of waived) console.log(`    ${w.cls.padEnd(34)} ${w.file}:${w.line}\n      ${w.detail}`);
    console.log('');
  }

  if (warnings.length) {
    console.log('  WARNED, downgraded because this run is a draft');
    for (const w of warnings) console.log(`    ${w.cls.padEnd(34)} ${w.file}:${w.line}\n      ${w.detail}`);
    console.log('');
  }

  if (uniq.length) {
    console.log('  REFUSED');
    for (const f of uniq) console.log(`    ${f.cls.padEnd(34)} ${f.file}:${f.line}\n      ${f.detail}`);
    console.log('');
  }

  if (missingVerdicts.length) {
    console.log('  VERDICT MISSING, not a pass and not a skip');
    for (const m of missingVerdicts) console.log(`    ${m.check.padEnd(34)} ${m.why}`);
    console.log('');
  }

  if (uniq.length) {
    const classes = new Set(uniq.map((f) => f.cls));
    console.log(`  REFUSED ${EM} ${uniq.length} defect(s) in ${classes.size} class(es)${missingVerdicts.length ? `, and ${missingVerdicts.length} verdict(s) missing` : ''}\n`);
    process.exit(2);
  }
  if (missingVerdicts.length) {
    console.log(`  NO VERDICT ${EM} nothing refused, and ${missingVerdicts.length} check(s) could not run. This is not a pass.\n`);
    process.exit(1);
  }
  console.log('  every check ran and none refused\n');
  process.exit(0);
}
