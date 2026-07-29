#!/usr/bin/env node
/**
 * Contact sheets for the blind visual preflight. Original work, MIT.
 *
 *   node tools/preflight-sheets.mjs --out <dir> [--seed <hex>]
 *
 * bench-sheets.mjs does this for benchmark runs living in the lab directory. This does it for
 * the three pilots, which live in the repository and are named after their subjects — so the
 * work this tool actually does is the *blinding*: it renders each site, gives it an opaque
 * label drawn from a random shuffle, writes the sheets under that label and nothing else, and
 * puts the mapping in a key file the reviewers are never given a path to.
 *
 * The sheet is a scroll strip: the page captured at successive viewport heights, in order,
 * which is what a visitor actually gets. The first frame is the first screen at 1:1.
 *
 * It was one full-page capture, and that was wrong in a way that cost a real review. A
 * `position: sticky` element renders pinned at the top of a full-page screenshot with dead
 * ground below it for the rest of the page, because the capture expands the viewport to the
 * document height and sticky then has nowhere to travel. Both blind reviewers made "the left
 * column is empty for two thirds of the page" their primary criticism of a page whose drawing
 * stays beside the text at every scroll position in a real browser. The page was right and
 * the instrument was wrong. Frames at viewport height cannot make that mistake.
 *
 * The sheets are the only thing the reviewers see. Not the repository, not the directions, not
 * the evidence packs, and not each other's reviews.
 */

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { createHash, randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { chromium } from '../benchmarks/node_modules/playwright/index.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/* The subjects, and the one line of each brief a reviewer needs in order to judge whether the
   page serves it. Nothing here names the pilot, the direction it chose, or the repository. */
/* `states` are the frames after the scroll strip: the page doing the thing it is for. Round 2
   scored three pages on first paint alone, and both reviewers concluded the rope counter had no
   length field — it has one, behind nothing, but a static capture cannot show a filled control,
   a refusal or a success. Each state is a plain async step; a step that throws is skipped and
   reported rather than silently dropped. */
const SUBJECTS = [
  { id: 'chandlery', dir: 'pilots/01-chandlery/site', port: 4501,
    trade: 'A rope and cordage merchant on a fishing dock.',
    task: 'A rigger needs to compare rope constructions and order a cut length.',
    states: [
      { name: 'a length priced, and one refused', run: async (p) => {
        await p.fill('[data-metres="DB12"]', '25');
        await p.fill('[data-metres="TS12"]', '1');
        await p.locator('[data-metres="TS12"]').blur();
        await p.waitForTimeout(120);
        await p.locator('[data-err="TS12"]').scrollIntoViewIfNeeded();
      } },
      { name: 'two cuts on the ticket', run: async (p) => {
        await p.click('[data-add="DB12"]');
        await p.fill('[data-metres="KM11"]', '18');
        await p.click('[data-add="KM11"]');
        await p.waitForTimeout(160);
        await p.locator('.basket').scrollIntoViewIfNeeded();
      } },
    ] },
  { id: 'foundry', dir: 'pilots/02-foundry/site', port: 4502,
    trade: 'A bell foundry that re-tunes church bells.',
    task: 'A parish needs to understand what re-tuning does and send an enquiry.',
    states: [
      { name: 'the ring after tuning', run: async (p) => {
        await p.click('[data-state="after"]');
        await p.waitForTimeout(700);
        await p.locator('.partials').scrollIntoViewIfNeeded();
      } },
      { name: 'an enquiry refused, then sent', run: async (p) => {
        await p.fill('#tower', 'St Æthelburga, Bishopsgate');
        await p.fill('#bells', '19');
        await p.fill('#email', 'not-an-address');
        await p.click('.send');
        await p.waitForTimeout(200);
        await p.locator('#bells').scrollIntoViewIfNeeded();
      } },
      { name: 'the enquiry sent', run: async (p) => {
        await p.fill('#bells', '8');
        await p.fill('#email', 'warden@example.org');
        await p.selectOption('#faculty', 'applied');
        await p.fill('#wrong', 'The third sounds sour.');
        await p.click('.send');
        await p.waitForTimeout(250);
        await p.locator('[data-sent]').scrollIntoViewIfNeeded();
      } },
    ] },
  { id: 'cask', dir: 'pilots/03-cask-console/site', port: 4503,
    trade: 'A brewery cellar desk tracking casks out on trade.',
    task: 'A cellarman needs to see what is overdue and book a consignment back in.',
    states: [
      { name: 'a book-in refused', run: async (p) => {
        await p.evaluate(() => localStorage.clear());
        await p.reload({ waitUntil: 'networkidle' });
        await p.click('[data-book="c2"]');
        await p.waitForTimeout(180);
      } },
      { name: 'the consignment booked back in', run: async (p) => {
        await p.selectOption('[data-cond="c2"]', 'Ullage short');
        await p.fill('[data-ull="c2"]', '11');
        await p.click('[data-book="c2"]');
        await p.waitForTimeout(220);
        await p.locator('.done').scrollIntoViewIfNeeded();
      } },
    ] },
];

const VIEWS = {
  desktop: { width: 1280, height: 900, scale: 1 },
  mobile: { width: 390, height: 844, scale: 1 },
};

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && i + 1 < args.length && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};
const out = flag('out');
if (!out) { console.error('usage: preflight-sheets.mjs --out <dir> [--seed <hex>]'); process.exit(2); }

/* ── the shuffle ────────────────────────────────────────────────────────────
   Labels are drawn without replacement from a shuffle seeded by real randomness, and the seed
   is recorded so the assignment can be shown to have been made before anyone looked rather
   than chosen afterwards to suit a result. */
const seed = flag('seed') ?? randomBytes(16).toString('hex');
function shuffled(list, seedHex) {
  const a = [...list];
  let h = createHash('sha256').update(seedHex).digest();
  let p = 0;
  const next = () => {
    if (p >= h.length - 4) { h = createHash('sha256').update(h).digest(); p = 0; }
    const v = h.readUInt32BE(p); p += 4; return v;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = next() % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL = ['SHEET-K7', 'SHEET-M2', 'SHEET-R9', 'SHEET-B4', 'SHEET-T6', 'SHEET-W1'];
const labels = shuffled(POOL, seed).slice(0, SUBJECTS.length);
const order = shuffled(SUBJECTS.map((_, i) => i), seed + '-order');
const assign = SUBJECTS.map((s, i) => ({ ...s, label: labels[i], seat: order.indexOf(i) + 1 }));

await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'sheets'), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const servers = [];
for (const s of assign) {
  servers.push(spawn(process.execPath,
    [join(ROOT, 'benchmarks/serve.mjs'), String(s.port), join(ROOT, s.dir)], { stdio: 'ignore' }));
}
for (const s of assign) {
  let up = false;
  for (let i = 0; i < 50 && !up; i++) {
    try { up = (await fetch(`http://127.0.0.1:${s.port}/`)).ok; } catch { await sleep(200); }
  }
  if (!up) { console.error(`  ${s.dir} never came up on ${s.port}`); process.exit(1); }
}

const browser = await chromium.launch();
const sheets = {};

for (const s of assign) {
  for (const [view, size] of Object.entries(VIEWS)) {
    const ctx = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: size.scale,
      isMobile: view === 'mobile',
      hasTouch: view === 'mobile',
    });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${s.port}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);

    const wholeHeight = await page.evaluate(() =>
      Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));

    /* One frame per viewport height, scrolled to. The last frame is clamped to the bottom of
       the document rather than scrolling past it, so the footer is seen once, not twice. */
    const frames = [];
    const maxScroll = Math.max(0, wholeHeight - size.height);
    for (let y = 0; frames.length < 8; y += size.height) {
      const at = Math.min(y, maxScroll);
      await page.evaluate((v) => window.scrollTo(0, v), at);
      await page.waitForTimeout(220);
      frames.push({ at, png: await page.screenshot({ type: 'png' }) });
      if (at >= maxScroll) break;
    }

    /* Then the page doing the thing it is for. Each state runs on top of the last, so the
       sequence reads as one visitor working through the task rather than three unrelated
       captures. A step that throws is reported in the caption instead of vanishing. */
    for (const st of s.states ?? []) {
      try {
        await st.run(page);
        await page.waitForTimeout(180);
        frames.push({ label: st.name, png: await page.screenshot({ type: 'png' }) });
      } catch (err) {
        console.log(`    state "${st.name}" did not run: ${String(err).split('\n')[0].slice(0, 90)}`);
      }
    }
    await ctx.close();

    /* Frames laid left to right on desktop, in rows on mobile. Captions carry the scroll
       position and nothing else — a file name would name the subject. */
    const cols = view === 'desktop' ? 3 : 5;
    const sheet = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
      *{box-sizing:border-box}
      body{margin:0;background:#101012;color:#8e8c88;padding:20px;
           font:11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em}
      .g{display:grid;grid-template-columns:repeat(${cols},max-content);gap:20px;align-items:start}
      figure{margin:0;background:#191919;border:1px solid #2a2a2c}
      .p{display:block;background:#fff;overflow:hidden;width:${size.width}px;height:${size.height}px}
      .p img{display:block;width:${size.width}px}
      figcaption{padding:7px 10px;border-top:1px solid #2a2a2c;text-transform:uppercase;color:#77756f}
      h1{font:inherit;text-transform:uppercase;letter-spacing:.22em;color:#c8c6c1;margin:0 0 16px}
      p.n{margin:0 0 16px;color:#6d6b66;text-transform:uppercase}
    </style></head><body>
      <h1>${s.label} &middot; ${view}</h1>
      <p class="n">${frames.filter(f=>!f.label).length} screen(s) scrolled, then ${frames.filter(f=>f.label).length} state(s) &mdash; ${size.width}&times;${size.height}, in order</p>
      <div class="g">
        ${frames.map((f, i) => `<figure>
          <span class="p"><img src="data:image/png;base64,${f.png.toString('base64')}"></span>
          <figcaption>${f.label ? f.label : `screen ${i + 1} &mdash; scrolled ${f.at}px`}</figcaption>
        </figure>`).join('')}
      </div>
    </body></html>`;

    const tmp = join(out, `.sheet-${s.label}-${view}.html`);
    await writeFile(tmp, sheet);
    const sp = await browser.newPage({
      viewport: { width: cols * (size.width + 22) + 60, height: 1000 },
    });
    await sp.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
    await sp.waitForTimeout(400);
    const file = join(out, 'sheets', `${s.label}-${view}.jpg`);
    await sp.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 82 });
    await sp.close();
    await rm(tmp, { force: true });

    sheets[`${s.label}-${view}.jpg`] =
      createHash('sha256').update(await readFile(file)).digest('hex');
    console.log(`  ${s.label}  ${view.padEnd(8)} ${size.width}px  ${frames.length} screen(s), ` +
      `page ${wholeHeight}px`);
  }
}

await browser.close();
for (const srv of servers) srv.kill();

/* One hash over the whole sheet set, in label order, so a review can bind to "these sheets"
   with a single field rather than six. */
const sheetSha = createHash('sha256')
  .update(Object.keys(sheets).sort().map((k) => `${k} ${sheets[k]}`).join('\n'))
  .digest('hex');

await writeFile(join(out, 'sheets', 'hashes.json'),
  JSON.stringify({ seed, sheets, 'sheet-sha256': sheetSha }, null, 2) + '\n');

await writeFile(join(out, 'KEY-MASTER.json'), JSON.stringify({
  seed,
  'sheet-sha256': sheetSha,
  assignment: Object.fromEntries(assign.map((s) => [s.label, { subject: s.id, seat: s.seat }])),
  note: 'Written before any reviewer saw a sheet. The reviewers are never given this path.',
}, null, 2) + '\n');

/* The per-label brief the reviewers do get: the trade, the task, and nothing about the
   direction, the repository, or which of the three this is. */
for (const s of assign) {
  await mkdir(join(out, s.label), { recursive: true });
  await writeFile(join(out, s.label, 'BRIEF.md'),
    `# ${s.label}\n\n**The trade.** ${s.trade}\n\n**What a visitor came to do.** ${s.task}\n\n` +
    `Sheets: \`sheets/${s.label}-desktop.jpg\`, \`sheets/${s.label}-mobile.jpg\`.\n`);
}

console.log(`\n  ${assign.length} subjects, labels ${assign.map((s) => s.label).join(' ')}`);
console.log(`  seed ${seed}`);
console.log(`  sheet-sha256 ${sheetSha}`);
console.log(`  key in ${join(out, 'KEY-MASTER.json')} — do not give this path to a reviewer\n`);
