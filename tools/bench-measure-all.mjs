#!/usr/bin/env node
/**
 * Measure every run of a brief, independently. Original work, MIT.
 *
 *   node tools/bench-measure-all.mjs 01-company
 *
 * The agents that produced these runs each reported verifying their own work.
 * That is not evidence; this is. Serves each run in turn and runs the same
 * checks over every page, plus the cross-page pass.
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const RUNS = join(ROOT, 'benchmarks/v2/runs');
const PORT = 4477;
const brief = process.argv[2];
if (!brief) {
  console.error('usage: bench-measure-all.mjs <brief>');
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pages(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await pages(full, base, out);
    else if (e.name.endsWith('.html')) out.push(relative(base, full).replace(/\\/g, '/'));
  }
  return out;
}

const runs = (await readdir(RUNS, { withFileTypes: true }))
  .filter((e) => e.isDirectory() && e.name.startsWith(`${brief}-`))
  .map((e) => e.name)
  .sort();

const results = [];

for (const run of runs) {
  const site = join(RUNS, run, 'site');
  const list = await pages(site).catch(() => []);
  if (!list.length) {
    results.push({ run, error: 'no html in site/' });
    continue;
  }

  const server = spawn(process.execPath, [join(ROOT, 'benchmarks/serve.mjs'), String(PORT), site], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  // Wait for the port to answer rather than guessing at a delay. 700ms was enough
  // on a warm machine and not enough on a cold one, which is how every page in
  // every run came back broken.
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/${list[0]}`);
      if (r.ok) break;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }

  const perPage = [];
  for (const p of list) {
    // 404.html is not reachable as a route and is measured on its own path.
    const url = `http://localhost:${PORT}/${p}`;
    for (const stress of [false, true]) {
      const args = [join(ROOT, 'skills/sitesmith/scripts/verify.mjs'), url, '--out', join(ROOT, '.sitesmith/bench', run, p.replace(/[\\/]/g, '-'), stress ? 'stress' : 'plain')];
      if (stress) args.push('--font-stress', '--no-axe');
      // verify.mjs exit 1 is a defect in the page; exit 2 is the harness failing to
      // run at all. Counting them the same reported all 48 pages as broken when the
      // server had simply not finished starting.
      let code = 0;
      let err = '';
      try {
        // verify.mjs resolves playwright from the working directory, and it lives in
        // benchmarks/node_modules. Running from the repo root made every page report
        // exit 2, which the old code counted as a failing page.
        execFileSync(process.execPath, args, { cwd: join(ROOT, 'benchmarks'), stdio: 'pipe' });
      } catch (e) {
        code = e.status ?? 1;
        err = String(e.stderr ?? '').slice(0, 200);
      }
      if (code === 2) throw new Error(`harness could not measure ${url}: ${err}`);
      if (!stress) perPage.push({ page: p, verify: code });
      else perPage[perPage.length - 1].stress = code;
    }
  }

  server.kill();
  await sleep(200);

  // cross-page + artifacts
  let cross = null;
  try {
    execFileSync(process.execPath, [join(ROOT, 'tools/bench.mjs'), 'measure', join('benchmarks/v2/runs', run)], {
      cwd: ROOT,
      stdio: 'pipe',
    });
  } catch {
    /* exit 1 means drift, not failure to run */
  }
  cross = JSON.parse(await readFile(join(RUNS, run, 'report.json'), 'utf8')).crossPage;
  const artifacts = JSON.parse(await readFile(join(RUNS, run, 'report.json'), 'utf8')).artifacts;

  // contract check where the run wrote one
  let contract = 'no contract';
  const ds = join(site, 'DESIGN-SYSTEM.md');
  if (await stat(ds).then(() => true, () => false)) {
    try {
      execFileSync(
        process.execPath,
        [join(ROOT, 'skills/sitesmith/scripts/token-drift.mjs'), ...list.map((p) => `benchmarks/v2/runs/${run}/site/${p}`), '--contract', `benchmarks/v2/runs/${run}/site/DESIGN-SYSTEM.md`],
        { cwd: ROOT, stdio: 'pipe' },
      );
      contract = 'pass';
    } catch {
      contract = 'undeclared values';
    }
  }

  // Document structure is read from the source, so it does not need a browser.
  const structureFailed = [];
  for (const p of list) {
    const src = await readFile(join(site, p), 'utf8');
    const bad = [];
    if (!/^\s*<!doctype\s+html/i.test(src)) bad.push('doctype');
    if (!/<html\b/i.test(src)) bad.push('html');
    else if (!/<html[^>]*\slang\s*=/i.test(src)) bad.push('lang');
    if (!/<body\b/i.test(src)) bad.push('body');
    const h1 = (src.match(/<h1[\s>]/gi) ?? []).length;
    if (h1 !== 1) bad.push(`h1x${h1}`);
    if (!/<main\b/i.test(src)) bad.push('main');
    if (bad.length) structureFailed.push({ page: p, missing: bad });
  }

  results.push({
    run,
    pages: list.length,
    verifyFailed: perPage.filter((p) => p.verify !== 0).map((p) => p.page),
    stressFailed: perPage.filter((p) => p.stress !== 0).map((p) => p.page),
    structureFailed,
    cross,
    artifacts,
    contract,
  });
}

await writeFile(join(ROOT, 'benchmarks/v2', `measurements-${brief}.json`), JSON.stringify(results, null, 2) + '\n');

const pct = (v) => (v === null ? '  — ' : `${String(Math.round(v * 100)).padStart(3)}%`);

console.log(`\n  independent measurement — ${brief}\n`);
console.log('  run                     pages verify stress struct  cover  undecl  reuse  hdr ftr  BRIEF/DS');
for (const r of results) {
  if (r.error) {
    console.log(`  ${r.run.padEnd(23)} ${r.error}`);
    continue;
  }
  const c = r.cross;
  console.log(
    `  ${r.run.padEnd(23)} ${String(r.pages).padStart(5)} ` +
      `${(r.verifyFailed.length ? `${r.verifyFailed.length}FAIL` : ' pass').padStart(6)} ` +
      `${(r.stressFailed.length ? `${r.stressFailed.length}FAIL` : ' pass').padStart(6)} ` +
      `${(r.structureFailed?.length ? `${r.structureFailed.length}FAIL` : '  ok').padStart(6)}  ` +
      `${pct(c.valueCoverage)}  ${String(c.undeclaredLiterals).padStart(5)}  ` +
      `${pct(c.componentReuse)}  ${String(c.distinctHeaders).padStart(3)} ${String(c.distinctFooters).padStart(3)}  ` +
      `${(r.artifacts.plan ? 'yes' : 'no')}/${(r.artifacts.designSystem ? 'yes' : 'no')}`,
  );
}
console.log('\n  cover : share of colour and length values that come from a named token');
console.log('  undecl: literal values in declarations that no token carries');
console.log('  reuse : share of class names used on more than one page');
console.log('  hdr/ftr: distinct header and footer markup across pages, ignoring the current marker. 1 is consistent.');
console.log(`  written to benchmarks/v2/measurements-${brief}.json\n`);
