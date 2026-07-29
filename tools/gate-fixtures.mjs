#!/usr/bin/env node
/**
 * Runs every gate against fixtures it must pass and fixtures it must fail. Original work, MIT.
 *
 *   node tools/gate-fixtures.mjs
 *
 * A gate that has only ever been run against work that passes has not been shown to catch
 * anything. Every negative fixture here is a defect that either shipped in the legacy set or
 * is the obvious way to fake the thing the gate is checking:
 *
 *   direction   three palette variants of one layout, and a note that claims a direction the
 *               page does not render
 *   production  a labelled placeholder, an asset that is not ready, an empty coloured square
 *               used as a logo, a shop with nothing but its own mark, surviving stand-in
 *               identifiers
 *   journey     a page with every state painted and nothing wired, which is pixel-identical
 *               to the working one in a screenshot
 *   critique    one reviewer, a key opened before the reviews were locked, the generic-
 *               template criticism, a median under the threshold, a review edited after
 *               locking
 *
 * Each case asserts the exit code and, where it matters, that the failure is reported for the
 * right reason — a gate that fails for an unrelated reason is not evidence.
 */

import { spawnSync, spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FIX = join(ROOT, 'tests/gates');
const S = join(ROOT, 'skills/sitesmith/scripts');

const results = [];
const record = (gate, name, want, got, ok, detail = '') =>
  results.push({ gate, name, want, got, ok, detail });

function run(script, args, cwd = ROOT) {
  const r = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8', timeout: 180000 });
  return { code: r.status, out: ((r.stdout ?? '') + (r.stderr ?? '')) };
}

/** Assert the exit code, and that the reason appears in the output. */
function expect(gate, name, { code, out }, wantCode, reason) {
  const codeOk = wantCode === 0 ? code === 0 : code !== 0;
  const reasonOk = !reason || reason.test(out);
  record(gate, name, wantCode === 0 ? 'pass' : 'fail', code === 0 ? 'pass' : `fail(${code})`,
    codeOk && reasonOk,
    !codeOk ? 'wrong exit code' : !reasonOk ? `failed, but not for the expected reason (${reason})` : '');
}

/* ── a static server, so journey fixtures can be driven over http ──────── */

/* benchmarks/serve.mjs, spawned. An inline server written here served the page but the
   browser's navigation never completed, and a fixture runner whose own scaffolding is the
   thing that fails is worse than no fixture at all. Reuse the server that already works. */
function serve(dir, port) {
  const child = spawn(process.execPath, [join(ROOT, 'benchmarks/serve.mjs'), String(port), dir],
    { stdio: 'ignore' });
  return child;
}

async function waitForServer(port, tries = 40) {
  for (let i = 0; i < tries; i++) {
    const ok = await fetch(`http://localhost:${port}/`).then((r) => r.ok, () => false);
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

/* ══ direction-check ════════════════════════════════════════════════════ */

const dc = (fixture) => run(join(S, 'direction-check.mjs'), [join('direction', fixture)], FIX);

expect('direction', 'three genuinely different comps', dc('pass-three-directions'), 0);

expect('direction', 'three palette variants of one layout', dc('fail-palette-variants'), 1,
  /differ on \d axis|measure identically/);

expect('direction', 'a note that claims what the page does not render',
  dc('fail-declared-not-rendered'), 1,
  /declares a dark ground and renders|declares imagery .* and renders none/);

/* The measurement, not the notes, must be what catches the palette variants. Re-run with the
   notes rewritten to claim five differences: the declared axes now pass and the render must
   still fail. */
{
  const dir = join(FIX, 'direction/fail-palette-variants');
  const { writeFileSync, readFileSync } = await import('node:fs');
  const backups = ['a', 'b', 'c'].map((d) => {
    const p = join(dir, d, 'NOTE.md');
    return [p, readFileSync(p, 'utf8')];
  });
  const claims = {
    a: ['dense index starting immediately', 'condensed sans with mono figures', 'warm paper ground', 'diagram-led inline', 'hairline field'],
    b: ['single object centred on a ground', 'large serif display', 'dark ground, no accent', 'object-led at plate scale', 'centred continuous field'],
    c: ['split on a hard vertical rule', 'system sans, few sizes', 'light neutral ground, one accent', 'deliberately imageless', 'asymmetric column'],
  };
  for (const [d, v] of Object.entries(claims)) {
    writeFileSync(join(dir, d, 'NOTE.md'),
      `# ${d}\n\n- composition: ${v[0]}\n- type: ${v[1]}\n- colour: ${v[2]}\n- imagery: ${v[3]}\n- rhythm: ${v[4]}\n`);
  }
  expect('direction', 'the render overrules notes that claim a difference that is not there',
    dc('fail-palette-variants'), 1, /measure identically|declares/);
  for (const [p, s] of backups) writeFileSync(p, s);
}

expect('direction', 'an axis record written as prose headings',
  run(join(S, 'direction-fidelity.mjs'),
      [join(FIX, 'direction/fail-axis-record-is-prose/NOTE.md'), 'http://127.0.0.1:4611/'], ROOT),
  1, /axis record is missing or not in the documented form/);

/* ══ asset-plan ═════════════════════════════════════════════════════════
   Assets scored 6 on five of six assignment-blinded reviews, the lowest criterion on every
   page, and every picture involved was sourced, licensed, recorded and cropped correctly.
   The gap was upstream of all of that: what is each picture for. These fixtures hold the
   answer to that question to the same standard as the rest. */

const ap = (fixture) => {
  const dir = join(FIX, 'asset-plan', fixture);
  const extra = [];
  if (existsSync(join(dir, 'ASSET-MANIFEST.md'))) extra.push('--manifest', 'ASSET-MANIFEST.md');
  if (existsSync(join(dir, 'DIRECTION.md'))) extra.push('--direction', 'DIRECTION.md');
  return run(join(S, 'asset-plan.mjs'), ['check', 'ASSET-PLAN.md', ...extra], dir);
};

expect('asset-plan', 'assets that each carry an argument', ap('pass-carrying-assets'), 0);
expect('asset-plan', 'a page that declares imagery is not load-bearing and means it',
  ap('pass-deliberately-imageless'), 0);
expect('asset-plan', 'every field filled in and none of them saying anything',
  ap('fail-decoration'), 1, /says nothing about this subject/);
expect('asset-plan', 'a comparison the page invites and no asset enables',
  ap('fail-no-comparative'), 1, /none is comparative/);
expect('asset-plan', 'other people\'s marks resting on nothing',
  ap('fail-invented-logos'), 1, /marks resting on no evidence|fabricated endorsement/);

/* ══ production-gate ════════════════════════════════════════════════════ */

const prod = (fixture, extra = []) => run(join(S, 'production-gate.mjs'),
  ['site', '--manifest', 'ASSET-MANIFEST.md', '--production', ...extra],
  join(FIX, 'production', fixture));

expect('production', 'a complete page with every asset ready', prod('pass-complete', ['--mode', 'E']), 0);

/* The two logo rules, which are opposites and both used to be called "the logo rule".
   The mark the page renders must be recorded; other people's marks must be lent. */
expect('production', 'a brand mark on the page that the manifest never lists',
  prod('fail-unlisted-mark', ['--mode', 'E']), 1,
  /the mark renders as "logo-primary" and the manifest has no such row/);
expect('production', 'customers named on the page and nowhere in the evidence pack',
  prod('fail-invented-endorsement', ['--mode', 'E']), 1,
  /nowhere in EVIDENCE\.md/);
expect('production', 'customers who agreed in writing to be named',
  prod('pass-evidenced-endorsement', ['--mode', 'E']), 0);
expect('production', 'a stand-in where someone else\'s endorsement should be',
  prod('fail-substitute-endorsement', ['--mode', 'E']), 1,
  /no stand-in for someone else/);
expect('production', 'a labelled placeholder', prod('fail-labelled-placeholder'), 1,
  /placeholder language/);
expect('production', 'an asset that is needed or substitute', prod('fail-asset-needed'), 1,
  /is needed|is substitute/);
expect('production', 'an empty coloured square used as a logo', prod('fail-empty-square-logo'), 1,
  /empty element is standing in for the brand mark/);
expect('production', 'a shop whose only asset is its own mark',
  prod('fail-no-product-asset', ['--mode', 'E']), 1,
  /no asset other than its own mark|nothing but the mark is rendered/);
expect('production', 'stand-in identifiers that survived', prod('fail-dummy-identifiers'), 1,
  /example domain|stand-in street address|stand-in place name|555/);
expect('production', 'invented commerce facts in a shop',
  prod('fail-invented-commerce-facts', ['--mode', 'E']), 1,
  /with no source/);
expect('production', 'a shop with no evidence pack',
  prod('fail-labelled-placeholder', ['--mode', 'E']), 1,
  /no evidence pack|placeholder language/);
expect('production', 'a sourced price that ends a sentence',
  prod('pass-sourced-price-ends-sentence', ['--mode', 'E']), 0);
expect('production', 'an arithmetic figure that carries a data-source',
  prod('pass-arithmetic-carries-a-source', ['--mode', 'E']), 0);
expect('production', 'the same figure with no data-source',
  prod('fail-arithmetic-without-a-source', ['--mode', 'E']), 1, /with no source/);

/* ══ visual asset engine ════════════════════════════════════════════════
   Every one of these runs against the mock provider. No network call, no key, no credit. */

const VFIX = join(ROOT, 'tests/gates/visual');
const va = (args) => run(join(S, 'visual-assets.mjs'), args, ROOT);
const plan = (f, extra = []) => va(['check', join(VFIX, 'plan', f, 'VISUAL-SOURCE-PLAN.md'), ...extra]);
const rec = (f) => va(['record', 'x', '--json', join(VFIX, 'record', `${f}.json`)]);

expect('visual', 'a complete plan whose assets are all in the manifest',
  plan('complete', [join(VFIX, 'plan/complete/ASSET-MANIFEST.md')]), 0);
expect('visual', 'a plan missing lighting and factual risk', plan('fail-incomplete'), 1,
  /no lighting|no factualRisk/);
expect('visual', 'a plan asking for a third attempt', plan('fail-too-many-attempts'), 1,
  /two iterations is the ceiling/);
expect('visual', 'a plan with a strategy that is not one of the five',
  plan('fail-bad-strategy'), 1, /is not one of reuse, stock, drawn, generate, edit/);
expect('visual', 'an asset planned but never listed in the manifest',
  plan('fail-not-in-manifest', [join(VFIX, 'plan/fail-not-in-manifest/ASSET-MANIFEST.md')]), 1,
  /planned, but no row in/);

expect('visual', 'a complete generated-asset record', rec('pass'), 0);
expect('visual', 'a real product with a generated environment around it',
  rec('pass-real-product-context'), 0);
expect('visual', 'a remote generation link used as the asset', rec('fail-remote-url'), 1,
  /A generation link expires/);
expect('visual', 'a recorded hash that is not the file s', rec('fail-wrong-hash'), 1,
  /file hashes to/);
expect('visual', 'approved without a visual QA pass', rec('fail-approved-without-qa'), 1,
  /Technically clean is not approved/);
expect('visual', 'a synthetic product presented as a stocked one',
  rec('fail-synthetic-as-stocked'), 1, /may not be/);
expect('visual', 'a generated asset that does not admit it', rec('fail-not-marked-synthetic'), 1,
  /must record synthetic/);
expect('visual', 'text baked into the pixels', rec('fail-baked-text'), 1,
  /Real HTML text belongs in the page/);

/* ══ journey ════════════════════════════════════════════════════════════ */

{
  const srvA = serve(join(FIX, 'journey/working-page'), 4711);
  const srvB = serve(join(FIX, 'journey/painted-page'), 4712);
  const up = (await waitForServer(4711)) && (await waitForServer(4712));
  if (!up) record('journey', 'the fixture servers came up', 'pass', 'error', false);

  // cwd is tests/gates, not tests/gates/journey: a journey resolves playwright from the
  // working directory, and that is where it is installed.
  const jr = (base) => {
    const r = spawnSync(process.execPath, [join(S, 'journey.mjs'), 'journey/journeys', '--base', base],
      { cwd: FIX, encoding: 'utf8', timeout: 180000, env: { ...process.env } });
    return { code: r.status, out: (r.stdout ?? '') + (r.stderr ?? '') };
  };

  expect('journey', 'a page that actually works', jr('http://localhost:4711'), 0, /1 passed/);
  expect('journey', 'a page with every state painted and nothing wired',
    jr('http://localhost:4712'), 1, /the total responds to the length|1 of 1 failed/);

  expect('journey', 'no journeys at all',
    run(join(S, 'journey.mjs'), [join(FIX, 'journey/nowhere')]), 1, /no .*directory/);

  srvA.kill(); srvB.kill();
}

/* ══ critique ═══════════════════════════════════════════════════════════ */

const crit = (f) => run(join(S, 'critique-gate.mjs'), [join(FIX, 'critique', f)]);
expect('critique', 'two locked reviews and a key opened afterwards', crit('pass'), 0);
expect('critique', 'only one reviewer', crit('fail-one-reviewer'), 1, /needs two independent/);
expect('critique', 'the key opened before both reviews were locked', crit('fail-key-opened-early'), 1,
  /opened at .* before/);
expect('critique', 'the generic-template criticism', crit('fail-generic-template'), 1,
  /generic-template failure/);
expect('critique', 'a median under the threshold', crit('fail-below-threshold'), 1,
  /median production-readiness is [\d.]+, under the threshold/);
expect('critique', 'a review edited after locking', crit('fail-edited-after-locking'), 1,
  /was edited after locking/);
expect('critique', 'a reviewer who is the build agent', crit('fail-reviewer-is-builder'), 1,
  /is the build agent/);
expect('critique', 'a key that was never opened', crit('fail-key-never-opened'), 1,
  /never opened/);
expect('critique', 'reviews bound to different contact sheets', crit('fail-different-sheets'), 1,
  /disagree on sheet-sha256/);
expect('critique', 'the generic criticism buried in the notes', crit('fail-generic-buried'), 1,
  /raises the generic-template failure inside the review/);
expect('critique', 'the generic tell only ever denied, across a line wrap',
  crit('pass-generic-only-denied'), 0);
expect('critique', 'the generic criticism conceded rather than denied',
  crit('fail-generic-conceded'), 1, /generic-template failure inside the review/);
expect('critique', 'a buried criticism after a denial in the same review',
  crit('fail-generic-buried-after-denial'), 1, /generic-template failure inside the review/);
expect('critique', 'a label that names the subject', crit('fail-label-names-subject'), 1,
  /label names the subject/);

/* ══ search v3 ══════════════════════════════════════════════════════════ */

{
  const r = spawnSync('python', [join(ROOT, 'tests/gates/search_v3_test.py')],
    { cwd: join(ROOT, 'skills/sitesmith/scripts'), encoding: 'utf8', timeout: 180000 });
  const out = (r.stdout ?? '') + (r.stderr ?? '');
  // Split on \r?\n and trim. On Windows the child's lines end \r\n, and \r is a line
  // terminator to a JS regex, so `(.+)$` matched nothing and the whole suite reported
  // silently — a runner that loses a gate's results is worse than one that fails loudly.
  let seen = 0;
  for (const line of out.split(/\r?\n/)) {
    const m = line.trim().match(/^(ok|FAIL)\s+(.+)$/);
    if (!m) continue;
    seen++;
    record('search', m[2].trim(), 'pass', m[1] === 'ok' ? 'pass' : 'fail', m[1] === 'ok');
  }
  if (!seen) record('search', 'the python tests produced results', 'pass', 'error', false,
    (r.error?.message ?? '') + out.slice(-300));
}

/* ── report ────────────────────────────────────────────────────────────── */

let gate = '';
console.log('\n  gate fixtures — every gate against work it must accept and work it must reject\n');
for (const r of results) {
  if (r.gate !== gate) { gate = r.gate; console.log(`  ${gate}`); }
  console.log(`    ${r.ok ? 'ok  ' : 'FAIL'}  must ${r.want.padEnd(4)}  ${r.name}` +
    (r.ok ? '' : `\n            ${r.got}${r.detail ? ' — ' + r.detail : ''}`));
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n  ${failed === 0 ? `PASS — ${results.length} fixtures, every gate behaved` : `FAIL — ${failed} of ${results.length}`}\n`);
process.exit(failed ? 1 : 0);
