#!/usr/bin/env node
/**
 * Runs the interaction journeys. Original work, MIT.
 *
 *   node scripts/journey.mjs journeys/ --base http://localhost:5173
 *
 * A thin runner. Each journey is a plain script that drives the page and exits non-zero on
 * failure, so a single one can be run directly with `node journeys/x.spec.mjs` while it is
 * being written. This exists so the release gate has one command to call.
 *
 * Why this file is here at all, since v3 dropped almost everything of its size:
 *
 * verify.mjs renders, measures and scans. It does not click. Its keyboard pass presses Tab
 * and reads computed style; it never submits a form, never opens a drawer, never adds
 * anything to a cart. gate.mjs contains no interaction driving either. So a Next.js
 * product page whose add-to-cart handler sits in a component that never hydrates renders
 * at three widths, clears axe in both schemes, has no console error, no failed request, no
 * dead link and no overflow, and both gates exit 0 while the one thing the page exists to
 * do is broken.
 *
 * verify.md already described this runner and already promised that a surface with no
 * journey fails the gate. Both sentences were false: neither the runner nor the gate
 * clause existed. Writing prose that describes a check nobody built is the same defect as
 * a check that cannot fail, and it is worse in one way, because it reads as coverage.
 *
 * Exit codes match the rest of the package. 0 passed, 1 a journey failed, 2 the run could
 * not happen. An absent journeys/ directory is a 2 rather than a 1: nothing was tested,
 * which is a setup problem, and the gate is what turns it into a refusal at release.
 */

import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--')) ?? 'journeys';
const base = (() => {
  const i = args.indexOf('--base');
  return i >= 0 ? args[i + 1] : 'http://localhost:5173';
})();

const files = (await readdir(dir).catch(() => {
  console.error(`no ${dir}/ directory. A site with no journey has not been tested for behaviour.`);
  process.exit(2);
})).filter((f) => f.endsWith('.spec.mjs')).sort();

if (!files.length) {
  console.error(`no *.spec.mjs in ${dir}/. verify.md, "The journey contract", says what one contains.`);
  process.exit(2);
}

console.log(`\n  journeys, ${files.length} against ${base}\n`);
let failed = 0;

for (const f of files) {
  const r = spawnSync(process.execPath, [resolve(join(dir, f))], {
    encoding: 'utf8',
    env: { ...process.env, BASE: base },
    timeout: 120000,
  });
  const out = ((r.stdout ?? '') + (r.stderr ?? '')).trim();
  if (r.status === 0) {
    console.log(`  ok    ${f}`);
  } else {
    failed++;
    console.log(`  FAIL  ${f}${r.signal ? ` (${r.signal})` : ''}`);
    for (const line of out.split('\n')) console.log(`        ${line}`);
  }
}

console.log(`\n  ${failed ? `${failed} of ${files.length} failed` : `${files.length} passed`}\n`);
process.exit(failed ? 1 : 0);
