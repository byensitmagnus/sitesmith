#!/usr/bin/env node
/**
 * Assemble every block into one page so the blocks can be measured. Original work, MIT.
 *
 *   node tools/build-block-harness.mjs        # writes benchmarks/blocks/index.html
 *
 * A block library that is only files is a library nobody can check. This renders
 * all of them together under the reference contract, which is then run through
 * verify.mjs and token-drift.mjs like any benchmark. A block that overflows at
 * 375px, fails axe in either scheme, or reaches for a literal fails the build.
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve, sep } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BLOCKS = resolve(ROOT, 'skills/sitesmith/blocks');
const OUT = resolve(ROOT, 'benchmarks/blocks');

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** The leading HTML comment is the block's metadata. `prevents:` is required. */
function meta(source, path) {
  const m = source.match(/^<!--([\s\S]*?)-->/);
  if (!m) throw new Error(`${path}: no metadata comment`);
  const fields = {};
  let key = null;
  for (const line of m[1].split('\n')) {
    const f = line.match(/^\s*([a-z]+):\s*(.*)$/);
    if (f) {
      key = f[1];
      fields[key] = f[2].trim();
    } else if (key && line.trim()) {
      fields[key] += ' ' + line.trim();
    }
  }
  for (const required of ['name', 'family', 'modes', 'use', 'variants']) {
    if (!fields[required]) throw new Error(`${path}: metadata missing \`${required}\``);
  }
  const known = /^[MEP ]+$/;
  if (!known.test(fields.modes)) {
    throw new Error(`${path}: modes must be one or more of M E P, got "${fields.modes}"`);
  }
  return { ...fields, body: source.slice(m[0].length).trim() };
}

const contractMd = await readFile(join(BLOCKS, 'CONTRACT.md'), 'utf8');
const contract = contractMd.match(/```css\s+contract\s*\n([\s\S]*?)```/);
if (!contract) throw new Error('blocks/CONTRACT.md has no ```css contract block');

const files = (await walk(BLOCKS)).sort();
const blocks = [];
for (const f of files) {
  blocks.push({ path: f.slice(BLOCKS.length + 1).split(sep).join('/'), ...meta(await readFile(f, 'utf8'), f) });
}
if (!blocks.length) throw new Error('no blocks found');

// Grouped by family, in the order a page is actually assembled. Alphabetical by path
// interleaves a footer between two heroes, which makes the library unreadable as a
// library even though every block in it is fine.
const FAMILY_ORDER = ['nav', 'hero', 'catalogue', 'product', 'content', 'proof', 'decide', 'form', 'cta', 'data', 'footer'];
blocks.sort((a, b) => {
  const fa = FAMILY_ORDER.indexOf(a.family), fb = FAMILY_ORDER.indexOf(b.family);
  return (fa === -1 ? 99 : fa) - (fb === -1 ? 99 : fb) || a.name.localeCompare(b.name);
});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>sitesmith block library</title>
<meta name="description" content="Every block in the sitesmith library, rendered together under the reference design-system contract and measured by the same scripts as the benchmarks.">
<style>
${contract[1].trim()}

*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);
  font-size:var(--text-body);line-height:var(--leading-body);overflow-x:hidden;
  -webkit-font-smoothing:antialiased}
h1,h2,h3{margin:0;line-height:var(--leading-tight);letter-spacing:-.02em}
p{margin:0}
a{color:var(--accent)}
.harness{max-width:var(--container);margin-inline:auto;padding:var(--space-6) var(--gutter) var(--space-9)}
.harness > header{border-bottom:1px solid var(--line);padding-bottom:var(--space-5);
  margin-bottom:var(--space-6)}
.harness > header h1{font-size:var(--text-h1)}
.harness > header p{color:var(--ink-2);margin-top:var(--space-2);max-width:var(--measure)}
.spec{margin-top:var(--space-8)}
.spec > h2{font-size:var(--text-h3)}
.spec dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:var(--space-1) var(--space-3);
  margin:var(--space-2) 0 var(--space-4);font-size:var(--text-small)}
.spec dt{color:var(--ink-3);font-weight:700}
.spec dd{margin:0;color:var(--ink-2);min-width:0}
/* An unbroken token — a file path in mono — is wider under the runner's font than
   under Windows', and it spills the text without any element box reporting as
   overflowing. +20px at 375px, invisible to an element scan. */
.harness code,.spec dd{overflow-wrap:anywhere}
.spec dd code{font-family:var(--font-mono);font-size:var(--text-micro)}
.stage{border:1px solid var(--line);border-radius:var(--radius-outer);padding:var(--space-5);
  background:var(--bg)}
/* A sticky block sticks to the viewport, not to its specimen box, so on this page
   it would float over the blocks below it. Pinned back here; the block file is
   unchanged, and in a real page the sticky is the point. */
.stage .block-top-bar{position:static}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<main class="harness" id="blocks">
  <header>
    <h1>Block library</h1>
    <p>
      Every block, rendered together under the reference contract in
      <code>blocks/CONTRACT.md</code>. This page is generated by
      <code>tools/build-block-harness.mjs</code> and measured by the same scripts as the
      benchmarks, so a block cannot rot without failing the build.
    </p>
  </header>

${blocks
  .map(
    (b, i) => `  <section class="spec" aria-labelledby="b${i}">
    <h2 id="b${i}">${esc(b.name)}</h2>
    <dl>
      <dt>Family</dt><dd>${esc(b.family)} &middot; modes ${esc(b.modes)}${b.density ? ` &middot; ${esc(b.density)}` : ''}</dd>
      <dt>Use</dt><dd>${esc(b.use)}</dd>
      ${b.avoid ? `<dt>Avoid</dt><dd>${esc(b.avoid)}</dd>` : ''}
      <dt>Variants</dt><dd>${esc(b.variants)}</dd>
      ${b.pairs ? `<dt>Pairs with</dt><dd>${esc(b.pairs)}</dd>` : ''}
      ${b['not-with'] ? `<dt>Not with</dt><dd>${esc(b['not-with'])}</dd>` : ''}
      ${b.prevents ? `<dt>Prevents</dt><dd>${esc(b.prevents)}</dd>` : ''}
      <dt>Source</dt><dd><code>skills/sitesmith/blocks/${esc(b.path)}</code></dd>
    </dl>
    <div class="stage">
${b.body}
    </div>
  </section>`,
  )
  .join('\n\n')}
</main>
</body>
</html>
`;

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'index.html'), page);
console.log(`benchmarks/blocks/index.html: ${blocks.length} blocks`);
for (const b of blocks) console.log(`  ${b.family.padEnd(10)} ${b.modes.padEnd(6)} ${b.name}`);
