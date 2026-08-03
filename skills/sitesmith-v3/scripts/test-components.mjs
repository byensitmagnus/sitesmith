#!/usr/bin/env node
/**
 * The routing suite for the component layer. Original work, MIT.
 *
 *   node scripts/test-components.mjs
 *
 * Four project shapes, built here rather than committed, because the thing under test is
 * the routing and the routing reads a project. The cases that matter are the two refusals:
 * an ordinary website must never acquire an agent-interface dependency, and a project with
 * nothing installed must be told to write rather than to install.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'components.mjs');
const tmp = mkdtempSync(join(tmpdir(), 'sitesmith-components-test-'));

let failed = 0;
const results = [];

function project(name, { pkg, files = [] }) {
  const dir = join(tmp, name);
  mkdirSync(dir, { recursive: true });
  if (pkg) writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  for (const f of files) {
    mkdirSync(join(dir, dirname(f)), { recursive: true });
    writeFileSync(join(dir, f), '');
  }
  return dir;
}

function expect(name, args, code, check) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const ok = r.status === code && (!check || check(out));
  if (!ok) failed++;
  results.push(`${ok ? '  ok  ' : '  FAIL'} ${name}`);
  if (!ok) results.push(`        exit ${r.status}, expected ${code}\n        ${out.trim().split('\n').slice(0, 5).join('\n        ')}`);
}

const bare = project('bare', { pkg: { name: 'bare' } });
const shad = project('shadcn', {
  pkg: { name: 's', dependencies: { '@radix-ui/react-dialog': '1', next: '15' } },
  files: ['components.json', 'components/ui/dialog.tsx', 'components/ui/tabs.tsx'],
});
const agent = project('agent', {
  pkg: { name: 'a', dependencies: { '@21st-extension/agent-elements': '1', react: '19' } },
});
const opinionated = project('opinionated', { pkg: { name: 'o', dependencies: { antd: '5' } } });

/* 1. Nothing installed. The answer is write, and the reason names the cost of the
      alternative, because "just add a library" is the default a model reaches for. */
expect('an empty project is told to write, not to install', ['plan', 'tabs', bare], 0,
  (o) => /WRITE/.test(o) && /dependency the client maintains/.test(o));

/* 2. A registry is present. Reuse the behaviour, replace the appearance. This is the one
      that stops the layer becoming a way to ship somebody else's look. */
expect('an installed registry is adapted, not adopted whole', ['plan', 'dialog', shad], 0,
  (o) => /ADAPT/.test(o) && /replace the appearance/.test(o));

/* 3. The conditional route. Agent-interface vocabulary only when the brief asks. */
expect('an agent brief in a project that has the package reuses it', ['plan', 'agent chat', agent], 0,
  (o) => /REUSE/.test(o) && /agent-elements/.test(o) && /restyle to the direction record/.test(o));

expect('an agent brief with nothing installed writes rather than adding a dependency',
  ['plan', 'assistant transcript', bare], 0,
  (o) => /WRITE/.test(o) && /dependency decision, not a design one/.test(o));

/* 4. The refusal that protects an ordinary website: an agent package must never appear in
      a plan for a page that did not ask for one. */
expect('an ordinary component in an ordinary project never mentions agent components',
  ['plan', 'pricing table', shad], 0,
  (o) => !/agent-elements/i.test(o));

expect('an ordinary component in an agent-capable project still does not reach for it',
  ['plan', 'footer', agent], 0,
  (o) => !/agent-elements/i.test(o));

/* 5. Detection reports what is there and says so plainly, including the warning that an
      opinionated library is where a distinctive page goes to die. */
expect('an opinionated library is named as a cost', ['detect', opinionated], 0,
  (o) => /ant-design/.test(o) && /opinionated/.test(o));

expect('detect on an empty project says write rather than listing nothing', ['detect', bare], 0,
  (o) => /nothing installed/.test(o) && /Do not add a library/.test(o));

/* 6. Nothing here may install or copy. The line saying so is part of the contract. */
expect('every plan states that nothing was installed and nothing copied', ['plan', 'card', shad], 0,
  (o) => /Nothing was installed and nothing was copied/.test(o) && /Licence terms travel/.test(o));

expect('a bad verb is a usage error, not a plan', ['invent', 'x', bare], 2);

for (const r of results) console.log(r);
console.log(`\n${failed ? `${failed} case(s) failed` : `all ${results.length} cases agreed`}\n`);
console.log(`working files: ${tmp}`);
process.exit(failed ? 1 : 0);
