#!/usr/bin/env node
/**
 * Writes every gate fixture. Original work, MIT.
 *
 *   node tests/gates/build-fixtures.mjs
 *
 * Each gate gets at least one fixture it must pass and several it must fail. The negative
 * fixtures are the point: a gate that has only ever been run against work that passes has
 * not been shown to catch anything, and three of the four gates here were written after the
 * legacy audit specifically to catch defects that had already shipped.
 *
 * Regenerate rather than hand-edit, so the fixtures cannot drift from the runner.
 */

import { writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const put = async (p, s) => {
  await mkdir(dirname(join(ROOT, p)), { recursive: true });
  await writeFile(join(ROOT, p), s);
};

await rm(join(ROOT, 'direction'), { recursive: true, force: true });
await rm(join(ROOT, 'production'), { recursive: true, force: true });
await rm(join(ROOT, 'journey'), { recursive: true, force: true });
await rm(join(ROOT, 'critique'), { recursive: true, force: true });

const page = (title, css, body) => `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<style>*{box-sizing:border-box}${css}</style></head>
<body>${body}</body></html>
`;

/* ══ direction-check ════════════════════════════════════════════════════ */

const note = (axes) => Object.entries(axes).map(([k, v]) => `- ${k}: ${v}`).join('\n') + '\n';

/* PASS — three comps that genuinely render differently. The differences are in the DOM and
   the computed styles, not only in the notes: ground luminance, display family, number of
   type sizes and whether any imagery renders at all. */
await put('direction/pass-three-directions/a/index.html', page('A', `
body{margin:0;background:#f4f1e8;color:#1b1712;font:15px/1.5 'Arial Narrow',sans-serif}
table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #c9bfa8;
font:13px ui-monospace,monospace;text-align:left}h2{font-size:13px;letter-spacing:.14em;
text-transform:uppercase;margin:14px 8px}svg{width:44px;height:44px}small{font-size:11px}
`, `<h2>Stock, by construction</h2>
<table><tr><th>Section</th><th>Line</th><th>Per metre</th></tr>
<tr><td><svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="10" r="4"/></svg></td><td>Double braid</td><td>4.15</td></tr>
<tr><td><svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><circle cx="7" cy="7" r="5"/><circle cx="13" cy="13" r="5"/></svg></td><td>Three-strand</td><td>2.40</td></tr></table>
<small>Figures are minimum breaking loads for the batch on your ticket.</small>`));
await put('direction/pass-three-directions/a/NOTE.md', '# A\n\n' + note({
  composition: 'dense index starting immediately, no hero',
  type: 'condensed sans with tabular mono figures',
  colour: 'warm light paper ground, one stamp red',
  imagery: 'diagram-led, drawings inline in the table',
  rhythm: 'one continuous field divided by hairlines' }));

await put('direction/pass-three-directions/b/index.html', page('B', `
body{margin:0;background:#131110;color:#e8dfcd;font:17px/1.6 Georgia,'Iowan Old Style',serif;
text-align:center;padding:40px 20px}
h1{font-size:44px;font-weight:400;margin:30px auto;max-width:14ch;line-height:1.08}
p{max-width:44ch;margin:0 auto;color:#b6ab95}
svg{width:180px;height:220px;color:#c9ab6d}
small{display:block;margin-top:26px;font:11px ui-monospace,monospace;color:#8d8471}
`, `<svg viewBox="0 0 60 80" fill="none" stroke="currentColor" stroke-width="2">
<path d="M20 8h20c6 12 8 30 12 46l4 18H4l4-18c4-16 6-34 12-46z"/></svg>
<h1>The cover takes the wear</h1>
<p>Cut from the coil while you wait, whipped at both ends.</p>
<small>No. 114 · double braid · 12 mm</small>`));
await put('direction/pass-three-directions/b/NOTE.md', '# B\n\n' + note({
  composition: 'single object, centred, on a ground',
  type: 'large serif display with mono figures',
  colour: 'dark ground, no accent',
  imagery: 'object-led, one drawing at plate scale',
  rhythm: 'one continuous field, centred' }));

await put('direction/pass-three-directions/c/index.html', page('C', `
body{margin:0;background:#fbfbfa;color:#101114;font:16px/1.55 ui-sans-serif,system-ui,sans-serif}
.grid{display:grid;grid-template-columns:1fr 1px 380px;min-height:100vh}
.rule{background:#dcdde0}.l{padding:26px}.r{padding:26px}
h1{font-size:30px;letter-spacing:-.02em;margin:0 0 12px}
dt,dd{font:14px ui-monospace,monospace;padding:8px 0;border-bottom:1px solid #dcdde0;margin:0}
b{font-size:28px}
`, `<div class="grid"><div class="l"><h1>Priced before you commit</h1>
<p>Tell us the length and the ticket is written before the hot knife comes out.</p>
<p><b>£101.40</b></p></div><div class="rule"></div><div class="r">
<dl><dt>Construction</dt><dd>Double braid</dd><dt>Breaking load</dt><dd>3.8 t</dd></dl></div></div>`));
await put('direction/pass-three-directions/c/NOTE.md', '# C\n\n' + note({
  composition: 'split on a hard vertical rule, calculator left',
  type: 'system sans, few sizes, mono for every figure',
  colour: 'light neutral ground, one green accent',
  imagery: 'deliberately imageless, figures only',
  rhythm: 'asymmetric column running the full height' }));

/* FAIL — three palette variants of one layout. The notes even admit it, and the measurement
   backs them up: same display family, same size count, same imagery presence, grounds within
   a few percent of each other. This is what "three directions" usually turns out to mean. */
for (const [dir, bg, accent] of [['a', '#ffffff', '#2563eb'], ['b', '#fdfdfc', '#16a34a'], ['c', '#fcfcff', '#db2777']]) {
  await put(`direction/fail-palette-variants/${dir}/index.html`, page(`Variant ${dir}`, `
body{margin:0;background:${bg};color:#111827;font:16px/1.5 ui-sans-serif,system-ui,sans-serif}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:60px 40px;align-items:center}
h1{font-size:44px;line-height:1.1;margin:0 0 16px;letter-spacing:-.02em}
.cta{display:inline-block;background:${accent};color:#fff;padding:12px 22px;border-radius:8px}
.card{background:#f3f4f6;border-radius:12px;height:220px}
`, `<div class="hero"><div><h1>Everything your team needs</h1>
<p>One place to plan, track and ship the work that matters.</p>
<span class="cta">Start free</span></div><div class="card"></div></div>`));
  await put(`direction/fail-palette-variants/${dir}/NOTE.md`, `# Variant ${dir}\n\n` + note({
    composition: 'split hero, statement left, panel right',
    type: 'system sans, one display size',
    colour: `light ground, one ${['blue', 'green', 'pink'][['a', 'b', 'c'].indexOf(dir)]} accent`,
    imagery: 'deliberately imageless',
    rhythm: 'one continuous field' }));
}

/* FAIL — the note claims a direction the page does not render. Comp a says dark ground and
   photography-led and renders a white page with no imagery at all; the measurement wins. */
await put('direction/fail-declared-not-rendered/a/index.html', page('A', `
body{margin:0;background:#ffffff;color:#111;font:16px/1.5 ui-sans-serif,system-ui,sans-serif;padding:40px}
h1{font-size:40px;margin:0 0 12px}
`, `<h1>Claims a dark ground</h1><p>Renders white, and shows nothing.</p>`));
await put('direction/fail-declared-not-rendered/a/NOTE.md', '# A\n\n' + note({
  composition: 'full-bleed photograph with type over it',
  type: 'contrasting serif display',
  colour: 'dark ground, no accent',
  imagery: 'photography-led, full bleed',
  rhythm: 'one continuous field' }));
await put('direction/fail-declared-not-rendered/b/index.html', page('B', `
body{margin:0;background:#101418;color:#eee;font:16px/1.6 Georgia,serif;padding:40px}
svg{width:120px;height:120px}
`, `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8"/></svg>
<h1>Dark, and it renders dark</h1>`));
await put('direction/fail-declared-not-rendered/b/NOTE.md', '# B\n\n' + note({
  composition: 'single object centred on a ground',
  type: 'serif display with mono figures',
  colour: 'dark ground, no accent',
  imagery: 'object-led, one drawing',
  rhythm: 'one continuous field, centred' }));
await put('direction/fail-declared-not-rendered/c/index.html', page('C', `
body{margin:0;background:#f7f7f5;color:#111;font:15px/1.5 ui-monospace,monospace;padding:30px}
table{width:100%;border-collapse:collapse}td{border-bottom:1px solid #ddd;padding:6px}
`, `<table><tr><td>An index</td><td>1</td></tr><tr><td>Of things</td><td>2</td></tr></table>`));
await put('direction/fail-declared-not-rendered/c/NOTE.md', '# C\n\n' + note({
  composition: 'dense index starting immediately',
  type: 'mono throughout at one size',
  colour: 'light ground, no accent',
  imagery: 'deliberately imageless',
  rhythm: 'one continuous field with hairlines' }));

/* ══ production-gate ════════════════════════════════════════════════════ */

const MANIFEST_HEAD =
  '| id | what | where | source | licence | state | focal | treatment |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- |\n';
const row = (id, what, state = 'ready') =>
  `| \`${id}\` | ${what} | home | drawn for this project | owned | ${state} | 50% 50% | line, currentColor |\n`;

const FAVICON = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><circle cx='10' cy='10' r='8' fill='none' stroke='%23222' stroke-width='2'/><path d='M4 10h12M10 4v12' stroke='%23222' stroke-width='2'/></svg>">`;
const MARK = `<svg data-asset="logo-primary" role="img" aria-label="Halloughton Rope" viewBox="0 0 30 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 7c3-5 6-5 9 0s6 5 9 0 6-5 8 0"/></svg>`;
const DRAWING = `<svg data-asset="sec-double-braid" role="img" aria-label="Cross-section, double braid" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><circle cx="20" cy="20" r="17"/><circle cx="20" cy="20" r="9"/></svg>`;
const SHOP_CSS = `body{margin:0;background:#f4f1e8;color:#1b1712;font:16px/1.5 system-ui,sans-serif;padding:24px}
a.logo{display:flex;gap:8px;align-items:center;font-weight:700;color:inherit;text-decoration:none}
a.logo svg{width:34px}table{border-collapse:collapse;margin-top:18px}td{padding:8px 14px 8px 0;border-bottom:1px solid #c9bfa8}
td svg{width:52px;color:#1b1712}`;
const shop = (extraRow = '', head = FAVICON) => page('Halloughton Rope', SHOP_CSS,
  `<a class="logo" href="/">${MARK} Halloughton Rope</a>
   <h1>Rope, cut to the metre</h1>
   <table><tr><td>${DRAWING}</td><td>Double braid, 12 mm</td><td>£4.15 /m</td></tr></table>
   ${extraRow}
   <p>Halloughton Rope, Grimsby. Ring the counter on 01472 604 118.</p>`).replace('</title>', `</title>${head}`);

/* PASS — everything ready, a real mark, a real drawing, no stand-ins. */
await put('production/pass-complete/site/index.html', shop());
await put('production/pass-complete/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Three strands in a lay') + row('favicon', 'The mark at 32px') +
  row('sec-double-braid', 'Cross-section, double braid'));
await put('production/pass-complete/journeys/x.spec.mjs', 'process.exit(0);\n');

/* FAIL — a labelled placeholder. Honest, and still not finished. */
await put('production/fail-labelled-placeholder/site/index.html',
  shop('<figure><div style="height:180px;border:1px dashed #999"></div><figcaption>Photograph of the coil rack would sit here</figcaption></figure>'));
await put('production/fail-labelled-placeholder/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Three strands in a lay') + row('favicon', 'The mark at 32px') +
  row('sec-double-braid', 'Cross-section, double braid'));
await put('production/fail-labelled-placeholder/journeys/x.spec.mjs', 'process.exit(0);\n');

/* FAIL — a manifest row that is not ready. */
await put('production/fail-asset-needed/site/index.html', shop());
await put('production/fail-asset-needed/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Three strands in a lay') + row('favicon', 'The mark at 32px') +
  row('sec-double-braid', 'Cross-section, double braid') +
  row('hero-coil-rack', 'The coil rack, photographed', 'needed') +
  row('van-livery', 'The van at a drop', 'substitute'));
await put('production/fail-asset-needed/journeys/x.spec.mjs', 'process.exit(0);\n');

/* FAIL — an empty coloured square standing in for the identity. Three legacy pages shipped
   exactly this and nothing labelled it, which is why it is a block and not a warning. */
await put('production/fail-empty-square-logo/site/index.html',
  page('Halloughton Rope', SHOP_CSS + 'a.logo i{width:26px;height:26px;border-radius:5px;background:#163a2b;display:block}',
    `<a class="logo" href="/"><i></i> Halloughton Rope</a>
     <h1>Rope, cut to the metre</h1>
     <table><tr><td>${DRAWING}</td><td>Double braid, 12 mm</td><td>£4.15 /m</td></tr></table>
     <p>Ring the counter on 01472 604 118.</p>`).replace('</title>', `</title>${FAVICON}`));
await put('production/fail-empty-square-logo/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Wordmark') + row('favicon', 'The mark at 32px') +
  row('sec-double-braid', 'Cross-section, double braid'));
await put('production/fail-empty-square-logo/journeys/x.spec.mjs', 'process.exit(0);\n');

/* FAIL — mode E with nothing but its own mark. The shop shows no product. */
await put('production/fail-no-product-asset/site/index.html',
  page('Halloughton Rope', SHOP_CSS,
    `<a class="logo" href="/">${MARK} Halloughton Rope</a>
     <h1>Rope, cut to the metre</h1>
     <table><tr><td>Double braid, 12 mm</td><td>£4.15 /m</td></tr></table>
     <p>Ring the counter on 01472 604 118.</p>`).replace('</title>', `</title>${FAVICON}`));
await put('production/fail-no-product-asset/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Three strands in a lay') + row('favicon', 'The mark at 32px'));
await put('production/fail-no-product-asset/journeys/x.spec.mjs', 'process.exit(0);\n');

/* FAIL — stand-in identifiers that survived into a page called finished. */
await put('production/fail-dummy-identifiers/site/index.html',
  shop('<address>123 Main Street, Anytown · hello@example.com · 555-0142</address>'));
await put('production/fail-dummy-identifiers/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Three strands in a lay') + row('favicon', 'The mark at 32px') +
  row('sec-double-braid', 'Cross-section, double braid'));
await put('production/fail-dummy-identifiers/journeys/x.spec.mjs', 'process.exit(0);\n');

/* ══ journey ════════════════════════════════════════════════════════════ */

/* A real, minimal working page: a quantity that reprices, a refusal with the limit named,
   a live announcement and a keyboard path. */
await put('journey/working-page/index.html', page('Working counter', `
body{margin:0;background:#111;color:#eee;font:16px/1.5 system-ui,sans-serif;padding:26px}
label{display:block;font:12px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;
color:#9aa;margin-bottom:6px}
input{font:16px ui-monospace,monospace;padding:10px;width:8ch;background:#1b1f22;color:#eee;
border:2px solid #3a4249;border-radius:2px}
input[aria-invalid=true]{border-color:#ff8168;background:#331812}
button{font:600 16px system-ui;padding:11px 18px;background:#f0a92c;color:#171308;border:0;
border-radius:2px;cursor:pointer;min-height:44px}
button[disabled]{background:#2a3036;color:#7c858d;cursor:not-allowed}
:focus-visible{outline:3px solid #f0a92c;outline-offset:2px}
.err{color:#ff8168;font-weight:600;min-height:1.4em}
.total{font:600 26px ui-monospace,monospace}
`, `<h1>Cut to length</h1>
<label for="len">Length, metres</label>
<input id="len" type="number" min="3" max="96" step="1" value="" aria-describedby="err">
<p class="err" id="err" role="alert"></p>
<p>Line total <span class="total" data-total>—</span></p>
<button type="button" data-add disabled>Add this cut</button>
<p role="status" data-status></p>
<script>
const len = document.getElementById('len'), err = document.getElementById('err');
const total = document.querySelector('[data-total]'), add = document.querySelector('[data-add]');
const status = document.querySelector('[data-status]');
function price(){
  const v = Number(len.value);
  if (len.value === '') { err.textContent=''; len.removeAttribute('aria-invalid');
    total.textContent='—'; add.disabled=true; return null; }
  if (!Number.isInteger(v) || v < 3) { err.textContent='We cut a minimum of 3 m.';
    len.setAttribute('aria-invalid','true'); total.textContent='—'; add.disabled=true; return null; }
  if (v > 96) { err.textContent='This batch has 96 m left.';
    len.setAttribute('aria-invalid','true'); total.textContent='—'; add.disabled=true; return null; }
  err.textContent=''; len.removeAttribute('aria-invalid');
  const t = v * 4.15 + 1.8; total.textContent = '£' + t.toFixed(2); add.disabled=false; return t;
}
len.addEventListener('input', price);
add.addEventListener('click', () => { const t = price(); if (!t) return;
  status.textContent = len.value + ' m added — £' + t.toFixed(2) + ', cut from batch DB12-2426.';
  len.value=''; price(); });
</script>`));

/* The same page with every state painted and nothing wired. It looks identical in a
   screenshot and must fail. */
await put('journey/painted-page/index.html', page('Painted counter', `
body{margin:0;background:#111;color:#eee;font:16px/1.5 system-ui,sans-serif;padding:26px}
label{display:block;font:12px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;
color:#9aa;margin-bottom:6px}
input{font:16px ui-monospace,monospace;padding:10px;width:8ch;background:#1b1f22;color:#eee;
border:2px solid #3a4249;border-radius:2px}
button{font:600 16px system-ui;padding:11px 18px;background:#f0a92c;color:#171308;border:0;
border-radius:2px;min-height:44px}
:focus-visible{outline:3px solid #f0a92c;outline-offset:2px}
.err{color:#ff8168;font-weight:600;min-height:1.4em}
.total{font:600 26px ui-monospace,monospace}
`, `<h1>Cut to length</h1>
<label for="len">Length, metres</label>
<input id="len" type="number" value="24" aria-describedby="err">
<p class="err" id="err" role="alert"></p>
<p>Line total <span class="total" data-total>£101.40</span></p>
<button type="button" data-add>Add this cut</button>
<p role="status" data-status></p>`));

const JOURNEY = `/**
 * The four things a journey must assert: something changed, the change was announced, the
 * failure path, and the keyboard path. Run against the working page it passes; against the
 * painted page — which is pixel-identical in a screenshot — every one of them fails.
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const require_ = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = await import('playwright').catch(
  () => import(pathToFileURL(require_.resolve('playwright')).href));

const BASE = process.env.BASE;
const problems = [];
const check = (n, ok, d = '') => { if (!ok) problems.push(\`\${n}\${d ? ' — ' + d : ''}\`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(BASE, { waitUntil: 'load' });

// 1. something changed
const before = await page.locator('[data-total]').innerText();
await page.fill('#len', '24');
const after = await page.locator('[data-total]').innerText();
check('the total responds to the length', before !== after, \`\${before} -> \${after}\`);

// 2. the failure path, with the real limit named
await page.fill('#len', '400');
const err = (await page.locator('#err').innerText()).trim();
check('an over-length cut is refused', err.length > 0);
check('the refusal names the limit', /96/.test(err), err || '(nothing said)');
check('the field is marked invalid',
  (await page.getAttribute('#len', 'aria-invalid')) === 'true');
check('the action is blocked while invalid', await page.locator('[data-add]').isDisabled());

// 3. the change is announced
await page.fill('#len', '24');
await page.click('[data-add]');
const status = (await page.locator('[data-status]').innerText()).trim();
check('a status message announces the result', status.length > 0);
check('the announcement is specific', /24 m/.test(status), status || '(silent)');

// 4. the keyboard path
await page.focus('#len');
await page.keyboard.type('12');
check('typing prices the cut',
  (await page.locator('[data-total]').innerText()) === '£51.60',
  await page.locator('[data-total]').innerText());
check('focus is visible', await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return false;
  const s = getComputedStyle(el);
  return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
}));

await browser.close();
console.log(problems.length ? 'FAIL\\n  ' + problems.join('\\n  ') : 'ok — 9 assertions passed');
process.exit(problems.length ? 1 : 0);
`;
await put('journey/journeys/counter.spec.mjs', JOURNEY);

/* ══ critique ═══════════════════════════════════════════════════════════ */

const RUN = 'run-2026-07-28-a91f';
const BRIEF_SHA = 'b1'.repeat(32);
const RUBRIC_SHA = 'r2'.repeat(32);
const SHEET_SHA = 's3'.repeat(32);

/* A locked review carries everything the ceremony needs to be shown rather than described:
   who reviewed, under which opaque label, in which run, and the hashes of the brief, the
   rubric and the contact sheets they scored. */
const review = ({ reviewer, id, locked, primary, scores, notes = '', label = 'L7',
                  run = RUN, brief = BRIEF_SHA, rubric = RUBRIC_SHA, sheet = SHEET_SHA }) => {
  const body = `primary-criticism: ${primary}\n` +
    Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join('\n') + '\n' +
    (notes ? `\nnotes: ${notes}\n` : '');
  const sha = createHash('sha256').update(body.trim()).digest('hex');
  return `---\nreviewer: ${reviewer}\nreviewer-id: ${id}\nrun-id: ${run}\nlabel: ${label}\n` +
    `locked: ${locked}\nsha256: ${sha}\nbrief-sha256: ${brief}\nrubric-sha256: ${rubric}\n` +
    `sheet-sha256: ${sheet}\n---\n${body}`;
};
const keyFile = (opened) => JSON.stringify({ opened, 'built-by': 'build-agent-1',
  labels: { L7: 'site-a', L2: 'site-b' } }, null, 2) + '\n';
const GOOD = { direction: 8, specificity: 9, type: 8, colour: 8, assets: 8, hierarchy: 8, 'production-readiness': 8 };

await put('critique/pass/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a', locked: '2026-07-28T09:12:00Z',
  primary: 'The batch number is the smallest thing on a page whose whole argument is the batch.',
  scores: GOOD }));
await put('critique/pass/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b', locked: '2026-07-28T09:31:00Z',
  primary: 'The drawing column crowds the price at 1024px.', scores: { ...GOOD, type: 7 } }));
await put('critique/pass/key.json', keyFile('2026-07-28T09:40:00Z'));

await put('critique/fail-one-reviewer/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z', primary: 'The lede runs long at 375.', scores: GOOD }));
await put('critique/fail-one-reviewer/key.json', keyFile('2026-07-28T09:40:00Z'));

await put('critique/fail-key-opened-early/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z', primary: 'The lede runs long at 375.', scores: GOOD }));
await put('critique/fail-key-opened-early/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD }));
await put('critique/fail-key-opened-early/key.json',
  keyFile('2026-07-28T09:20:00Z'));

await put('critique/fail-generic-template/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z',
  primary: 'It looks like a generic AI-generated template: system font, off-white, one accent.',
  scores: GOOD }));
await put('critique/fail-generic-template/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD }));
await put('critique/fail-generic-template/key.json',
  keyFile('2026-07-28T09:40:00Z'));

await put('critique/fail-below-threshold/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z', primary: 'The price is hard to find.',
  scores: { ...GOOD, 'production-readiness': 6 } }));
await put('critique/fail-below-threshold/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.',
  scores: { ...GOOD, 'production-readiness': 7 } }));
await put('critique/fail-below-threshold/key.json',
  keyFile('2026-07-28T09:40:00Z'));

await put('critique/fail-edited-after-locking/CRITIQUE-A.md',
  review({ reviewer: 'A', id: 'rev-a', locked: '2026-07-28T09:12:00Z', primary: 'Fine.', scores: GOOD })
    .replace('production-readiness: 8', 'production-readiness: 9'));
await put('critique/fail-edited-after-locking/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD }));
await put('critique/fail-edited-after-locking/key.json',
  keyFile('2026-07-28T09:40:00Z'));


await put('critique/fail-reviewer-is-builder/CRITIQUE-A.md', review({ reviewer: 'A',
  id: 'build-agent-1', locked: '2026-07-28T09:12:00Z', primary: 'The lede runs long.', scores: GOOD }));
await put('critique/fail-reviewer-is-builder/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD }));
await put('critique/fail-reviewer-is-builder/key.json', keyFile('2026-07-28T09:40:00Z'));

await put('critique/fail-key-never-opened/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z', primary: 'The lede runs long.', scores: GOOD }));
await put('critique/fail-key-never-opened/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD }));
await put('critique/fail-key-never-opened/key.json', keyFile(null));

await put('critique/fail-different-sheets/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z', primary: 'The lede runs long.', scores: GOOD }));
await put('critique/fail-different-sheets/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD,
  sheet: 'ff'.repeat(32) }));
await put('critique/fail-different-sheets/key.json', keyFile('2026-07-28T09:40:00Z'));

/* The generic criticism buried in the notes rather than the headline. Reading only
   primary-criticism lets this through, which is why the whole review is scanned. */
await put('critique/fail-generic-buried/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z', primary: 'The price sits below the fold at 1280.',
  scores: GOOD, notes: 'Competent, but it could be any business in the trade — interchangeable.' }));
await put('critique/fail-generic-buried/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD }));
await put('critique/fail-generic-buried/key.json', keyFile('2026-07-28T09:40:00Z'));

await put('critique/fail-label-names-subject/CRITIQUE-A.md', review({ reviewer: 'A', id: 'rev-a',
  locked: '2026-07-28T09:12:00Z', primary: 'The lede runs long.', scores: GOOD,
  label: 'chandlery-with' }));
await put('critique/fail-label-names-subject/CRITIQUE-B.md', review({ reviewer: 'B', id: 'rev-b',
  locked: '2026-07-28T09:31:00Z', primary: 'The drawing crowds the price.', scores: GOOD,
  label: 'chandlery-without' }));
await put('critique/fail-label-names-subject/key.json', keyFile('2026-07-28T09:40:00Z'));

console.log('critique fixtures include the hardened cases');


/* Mode E may only state figures it can point at. The evidence pack carries the one price the
   shop publishes; the negative fixture adds a rating, a customer count, a delivery promise, a
   stock figure, a warranty and a certification that nothing sources. */
const SHOP_EVIDENCE = "# EVIDENCE — Halloughton Rope\n\n## 7. Asset reality and figures\n\nPrices are the counter's own, taken from the 2026 trade list:\n\n- Double braid polyester, 12 mm — £4.15 per metre.\n\nNo rating, delivery promise, stock figure, warranty or certification is published, because\nnone has been measured. The counter telephone is 01472 604 118.\n";
await put('production/pass-complete/EVIDENCE.md', SHOP_EVIDENCE);
await put('production/fail-invented-commerce-facts/EVIDENCE.md', SHOP_EVIDENCE);
await put('production/fail-invented-commerce-facts/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Three strands in a lay') + row('favicon', 'The mark at 32px') +
  row('sec-double-braid', 'Cross-section, double braid'));
await put('production/fail-invented-commerce-facts/journeys/x.spec.mjs', 'process.exit(0);\n');
await put('production/fail-invented-commerce-facts/site/index.html',
  shop(`<p>Rated 4.8 out of 5 by 1,240 customers. Next-day delivery on every order.
     Only 3 left in stock. Lifetime guarantee. Certified to ISO 9001.</p>`));

/* PASS — a sourced price written where a sentence ends. The price pattern used to take the
   full stop with the figure, so "£4.15." was looked up in the evidence pack as "£4.15." and
   never found, and a shop was blocked for stating a price it had sourced. Reproduced on
   pilot 1 against a real EVIDENCE.md; the fixture is here so it stays fixed. */
await put('production/pass-sourced-price-ends-sentence/EVIDENCE.md', SHOP_EVIDENCE);
await put('production/pass-sourced-price-ends-sentence/ASSET-MANIFEST.md', '# manifest\n\n' + MANIFEST_HEAD +
  row('logo-primary', 'Three strands in a lay') + row('favicon', 'The mark at 32px') +
  row('sec-double-braid', 'Cross-section, double braid'));
await put('production/pass-sourced-price-ends-sentence/journeys/x.spec.mjs', 'process.exit(0);\n');
await put('production/pass-sourced-price-ends-sentence/site/index.html',
  shop('<p>Double braid polyester in 12 mm is cut from the coil at £4.15.</p>'));

console.log('fixtures written');
