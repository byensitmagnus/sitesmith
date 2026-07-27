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

  results.push({
    run,
    pages: list.length,
    verifyFailed: perPage.filter((p) => p.verify !== 0).map((p) => p.page),
    stressFailed: perPage.filter((p) => p.stress !== 0).map((p) => p.page),
    cross,
    artifacts,
    contract,
  });
}

await writeFile(join(ROOT, 'benchmarks/v2', `measurements-${brief}.json`), JSON.stringify(results, null, 2) + '\n');

console.log(`\n  independent measurement — ${brief}\n`);
console.log('  run                      pages  verify  stress  hdr  ftr  tok/all  reuse  BRIEF  DS   contract');
for (const r of results) {
  if (r.error) {
    console.log(`  ${r.run.padEnd(24)} ${r.error}`);
    continue;
  }
  const c = r.cross;
  console.log(
    `  ${r.run.padEnd(24)} ${String(r.pages).padStart(5)}  ` +
      `${(r.verifyFailed.length ? `${r.verifyFailed.length} FAIL` : 'pass').padEnd(6)}  ` +
      `${(r.stressFailed.length ? `${r.stressFailed.length} FAIL` : 'pass').padEnd(6)}  ` +
      `${String(c.distinctHeaders).padStart(3)}  ${String(c.distinctFooters).padStart(3)}  ` +
      `${String(c.tokensOnEveryPage).padStart(3)}/${String(c.tokensDeclaredAnywhere).padEnd(3)}  ` +
      `${String(c.classesReused).padStart(5)}  ` +
      `${(r.artifacts.brief ? 'yes' : 'no').padEnd(5)}  ${(r.artifacts.designSystem ? 'yes' : 'no').padEnd(3)}  ${r.contract}`,
  );
}
console.log('\n  hdr/ftr: distinct header and footer markup across pages. 1 is consistent.');
console.log(`  written to benchmarks/v2/measurements-${brief}.json\n`);
