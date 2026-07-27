#!/usr/bin/env node
/**
 * The v2 benchmark harness. Original work, MIT.
 *
 *   node tools/bench.mjs init 01-company with 1 --model claude-opus-5 --settings default
 *   node tools/bench.mjs measure benchmarks/v2/runs/01-company-with-1 --origin http://localhost:4323
 *   node tools/bench.mjs grade 01-company
 *
 * Exists because a site is not its pages: the v1 checks answer "is this page
 * broken" and say nothing about whether page four looks like page one, which is
 * the thing a multi-page brief is actually testing.
 *
 * Exit 0 fine, 1 the run failed a floor check, 2 could not run.
 */

import { readFile, writeFile, mkdir, readdir, cp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve, relative, basename } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const RUNS = join(ROOT, 'benchmarks/v2/runs');
const BRIEFS = join(ROOT, 'benchmarks/v2/briefs');

const die = (msg) => {
  console.error(msg);
  process.exit(2);
};
const flag = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

/* ── init ──────────────────────────────────────────────────────────────── */

async function init([brief, arm, n]) {
  if (!brief || !['with', 'without'].includes(arm) || !n) {
    die('usage: bench.mjs init <brief> <with|without> <n> --model M --settings S');
  }
  const model = flag('model') ?? die('--model is required: a run whose model is unrecorded cannot be repeated');
  const settings = flag('settings') ?? 'default';

  // A run whose skill commit is "main, roughly" is not reproducible, and the point
  // of the harness is reproducibility.
  //
  // Changes under runs/ do not count: scaffolding a run is what makes the tree
  // dirty, so counting them means the second run of a batch can never be created.
  // What must be clean is the skill the commit claims to identify.
  const dirty = git('status', '--porcelain')
    .split('\n')
    .filter(Boolean)
    .filter((l) => !l.slice(3).replace(/^"|"$/g, '').startsWith('benchmarks/v2/runs/'));
  if (dirty.length) {
    die(
      'the skill is uncommitted, so the commit this run records would be a lie:\n' +
        dirty.map((l) => `  ${l}`).join('\n'),
    );
  }

  const briefPath = join(BRIEFS, `${brief}.md`);
  const briefText = await readFile(briefPath, 'utf8').catch(() =>
    die(`no such brief: benchmarks/v2/briefs/${brief}.md`),
  );

  const dir = join(RUNS, `${brief}-${arm}-${n}`);
  await mkdir(join(dir, 'site'), { recursive: true });
  await mkdir(join(dir, 'shots'), { recursive: true });

  // The prompt is the brief and nothing else. Adding context to one arm and not the
  // other is the failure that makes a control a straw man.
  await writeFile(join(dir, 'prompt.txt'), briefText);
  await writeFile(
    join(dir, 'manifest.json'),
    JSON.stringify(
      {
        brief,
        arm,
        run: Number(n),
        model,
        settings,
        skillLoaded: arm === 'with',
        skillCommit: git('rev-parse', 'HEAD'),
        skillCommitSubject: git('log', '-1', '--format=%s'),
        promptSha: null,
        startedAt: null,
        note: 'startedAt and promptSha are filled by whoever executes the run.',
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`${relative(ROOT, dir)}\n  prompt.txt written from ${brief}.md`);
  console.log(`  agent writes its files into site/, nothing else`);
}

/* ── measure ───────────────────────────────────────────────────────────── */

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const hash = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
};

async function htmlFiles(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await htmlFiles(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** A site is not its pages. This is the half the v1 checks never looked at. */
function crossPage(pages) {
  // A correct site marks the current page in its own header, so comparing raw
  // header markup reports drift on every well-built multi-page site and consistency
  // on none. Strip the current-page marker and the class that goes with it.
  const stripCurrent = (s) =>
    s
      .replace(/\saria-current="[^"]*"/gi, '')
      .replace(/\bclass="([^"]*)"/gi, (m, cls) => {
        const kept = cls.split(/\s+/).filter((c) => !/current|active|selected|is-here/i.test(c));
        return kept.length ? `class="${kept.join(' ')}"` : '';
      });
  const grab = (html, tag) => {
    const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
    return m ? hash(norm(stripCurrent(m[1]))) : null;
  };
  const headers = new Set(), footers = new Set(), tokenSets = [];
  const classCounts = new Map();
  for (const { html, sheets } of pages) {
    const h = grab(html, 'header');
    const f = grab(html, 'footer');
    if (h) headers.add(h);
    if (f) footers.add(f);
    const styled = html + '\n' + (sheets ?? '');
    tokenSets.push(new Set([...styled.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1])));
    for (const m of html.matchAll(/class="([^"]+)"/g)) {
      for (const c of m[1].split(/\s+/)) classCounts.set(c, (classCounts.get(c) ?? 0) + 1);
    }
  }
  const union = new Set(tokenSets.flatMap((s) => [...s]));
  const shared = [...union].filter((t) => tokenSets.every((s) => s.has(t)));
  const reused = [...classCounts.values()].filter((n) => n > 1).length;

  /**
   * Coverage, not vocabulary size. A raw token count rewards declaring tokens and
   * says nothing about whether the page uses them — the previous run reported
   * 43 against 17 and that number is not a quality measure.
   *
   * This measures the share of colour and length values in declarations that come
   * from somewhere named, using the site's own token block as the reference. It is
   * therefore comparable across both arms whether or not a contract file exists.
   */
  const sheets = pages[0]?.sheets ?? '';
  const allCss = pages.map((p) => p.html).join('\n') + '\n' + sheets;
  const declared = new Set();
  for (const m of allCss.matchAll(/--[\w-]+\s*:\s*([^;}]+)/g)) {
    for (const v of m[1].matchAll(/#[0-9a-f]{3,8}\b|-?\d*\.?\d+(?:px|rem|em)\b/gi)) {
      declared.add(v[0].toLowerCase());
    }
  }
  const UTILITY = /^(0|0px|0rem|1px|-1px|2px|100%|50%)$/;
  const PROPS =
    'color|background|background-color|border-color|fill|stroke|padding|margin|gap|row-gap|column-gap|border-radius|font-size|box-shadow';
  let literals = 0, covered = 0;
  for (const m of allCss.matchAll(new RegExp(`(?:^|[;{\\s])(?:${PROPS})\\s*:\\s*([^;}]+)`, 'gi'))) {
    const value = m[1];
    if (/var\(/.test(value)) continue;
    for (const v of value.matchAll(/#[0-9a-f]{3,8}\b|-?\d*\.?\d+(?:px|rem|em)\b/gi)) {
      const lit = v[0].toLowerCase();
      if (UTILITY.test(lit)) continue;
      literals++;
      if (declared.has(lit)) covered++;
    }
  }
  const varUses = (allCss.match(/var\(--/g) ?? []).length;

  return {
    pages: pages.length,
    distinctHeaders: headers.size,
    distinctFooters: footers.size,
    tokensDeclared: union.size,
    tokensOnEveryPage: shared.length,
    // The reported numbers, in the order they matter.
    valueCoverage: varUses + literals ? +(varUses / (varUses + literals)).toFixed(3) : null,
    undeclaredLiterals: literals - covered,
    literalsTotal: literals,
    varUses,
    classesShared: reused,
    classesTotal: classCounts.size,
    componentReuse: classCounts.size ? +(reused / classCounts.size).toFixed(3) : null,
  };
}

async function measure([dir]) {
  if (!dir) die('usage: bench.mjs measure <run-dir> [--origin http://localhost:4323]');
  const runDir = resolve(ROOT, dir);
  const origin = flag('origin', 'http://localhost:4323');
  const site = join(runDir, 'site');

  const files = await htmlFiles(site).catch(() => die(`no site/ in ${dir}`));
  if (!files.length) die(`${dir}/site contains no HTML. Nothing to measure.`);

  // Tokens usually live in a linked stylesheet, not inline. Reading only the HTML
  // reported every one of these sites as declaring zero tokens, which was the
  // measurement being wrong rather than six agents forgetting design systems.
  const cssFiles = [];
  const walkCss = async (d) => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const full = join(d, e.name);
      if (e.isDirectory()) await walkCss(full);
      else if (e.name.endsWith('.css')) cssFiles.push(full);
    }
  };
  await walkCss(site).catch(() => {});
  const sheets = (await Promise.all(cssFiles.map((f) => readFile(f, 'utf8')))).join('\n');

  const pages = [];
  for (const f of files) {
    const html = await readFile(f, 'utf8');
    pages.push({ file: relative(site, f).replace(/\\/g, '/'), html, sheets });
  }

  const artifacts = {
    brief: files.length ? await readFile(join(runDir, 'site/BRIEF.md'), 'utf8').then(() => true, () => false) : false,
    designSystem: await readFile(join(runDir, 'site/DESIGN-SYSTEM.md'), 'utf8').then(() => true, () => false),
  };

  const report = {
    measuredAt: null,
    origin,
    artifacts,
    crossPage: crossPage(pages),
    pages: pages.map((p) => ({ file: p.file, verify: `run verify.mjs against ${origin}/${p.file}` })),
    note:
      'Per-page verify and contract results are produced by scripts/verify.mjs and ' +
      'scripts/token-drift.mjs against a served copy of site/. This file records the ' +
      'cross-page half, which no other script measures.',
  };
  await writeFile(join(runDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');

  const c = report.crossPage;
  console.log(`\n  ${relative(ROOT, runDir)}\n`);
  console.log(`  pages                 ${c.pages}`);
  console.log(`  distinct headers      ${c.distinctHeaders}${c.distinctHeaders > 1 ? '  <- drifted' : ''}`);
  console.log(`  distinct footers      ${c.distinctFooters}${c.distinctFooters > 1 ? '  <- drifted' : ''}`);
  console.log(`  tokens anywhere       ${c.tokensDeclaredAnywhere}`);
  console.log(`  tokens on every page  ${c.tokensOnEveryPage}`);
  console.log(`  classes reused        ${c.classesReused} of ${c.classesTotal}`);
  console.log(`  BRIEF.md              ${artifacts.brief ? 'present' : 'missing'}`);
  console.log(`  DESIGN-SYSTEM.md      ${artifacts.designSystem ? 'present' : 'missing'}\n`);

  const floor = c.distinctHeaders <= 1 && c.distinctFooters <= 1;
  process.exit(floor ? 0 : 1);
}

/* ── grade ─────────────────────────────────────────────────────────────── */

async function grade([brief]) {
  if (!brief) die('usage: bench.mjs grade <brief>');
  const entries = (await readdir(RUNS, { withFileTypes: true }).catch(() => []))
    .filter((e) => e.isDirectory() && e.name.startsWith(`${brief}-`))
    .map((e) => e.name);
  if (!entries.length) die(`no runs for ${brief}. Nothing to grade.`);

  // Deterministic shuffle from the run names, so the labelling is reproducible
  // without a clock and without anyone being able to infer the arm from the order.
  const labelled = entries
    .map((name) => ({ name, key: hash(name + brief) }))
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((r, i) => ({ ...r, label: String.fromCharCode(65 + i) }));

  const out = join(ROOT, 'benchmarks/v2/grading', brief);
  await rm(out, { recursive: true, force: true });
  for (const r of labelled) {
    const dest = join(out, r.label);
    await cp(join(RUNS, r.name, 'site'), join(dest, 'site'), { recursive: true });
    await cp(join(RUNS, r.name, 'shots'), join(dest, 'shots'), { recursive: true }).catch(() => {});
    // manifest.json and report.json stay behind: both name the arm.
  }
  await writeFile(
    join(out, 'KEY.json'),
    JSON.stringify(Object.fromEntries(labelled.map((r) => [r.label, r.name])), null, 2) + '\n',
  );

  console.log(`\n  ${relative(ROOT, out)} — ${labelled.length} runs, labelled ${labelled.map((r) => r.label).join(' ')}`);
  console.log(`  Grade every one against benchmarks/v2/rubric.md before opening KEY.json.`);
  console.log(`  Write grade.json per label: seven scores and one sentence each.\n`);
}

/* ── main ──────────────────────────────────────────────────────────────── */

const [cmd, ...rest] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const commands = { init, measure, grade };
if (!commands[cmd]) die('usage: bench.mjs <init|measure|grade> ...');
await commands[cmd](rest);
