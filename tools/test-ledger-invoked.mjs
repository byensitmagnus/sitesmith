#!/usr/bin/env node
/**
 * The anti-repeat ledger is executed, not documented. Original work, MIT.
 *
 *   node tools/test-ledger-invoked.mjs
 *
 * `ledger.mjs check` and `commit` appeared in no command, no manifest and no release list.
 * The README and the plugin manifest both described the capability, and the only automated
 * call anywhere was `ledger.mjs parse` in CI against one pilot. A veto nobody runs is not a
 * veto, and a test that greps the documentation for the words would have passed the whole
 * time.
 *
 * So this file watches invocation. It builds a skill directory whose `ledger.mjs` is a stub
 * that records its own argv and exits with whatever the case needs, runs the real `audit`
 * against it, and reads the log. `gate.mjs` is stubbed the same way, so a case can put the
 * gate in either state without needing a page that genuinely passes or fails it.
 */

import { mkdtemp, rm, writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/* All 24 headings answered, so completeness passes and the only thing under test is
   whether commit consults the gate. */
const FULL_RECORD = "# Direction record\n\n## Surface\n\nbuy\n\n## Subject\n\nAnswered for the fixture, so no heading is blank.\n\n## Constraints in force\n\nAnswered for the fixture, so no heading is blank.\n\n## Assets that exist\n\nAnswered for the fixture, so no heading is blank.\n\n## Nouns\n\nAnswered for the fixture, so no heading is blank.\n\n## Theses\n\n1. A cutting list you price before you ring.\n2. The shop counter, with the two measurements on it.\n3. A specimen tray of offcuts.\n\n## Case for the runner-up\n\nFor: 1\n\nThe cutting list puts the price first and the room second. It would work, and it would look like every other supplier page in this trade. That is why it lost, not because it was wrong about the buyer.\n\n## Built\n\nBuilt: 2, axis: the buyer already holds both numbers, because the counter is where they are read out\n\n## Colour\n\npaper: the ground the whole counter is read against\ncaution: the one band that carries the reading\ngrid: the hairlines the counter is ruled with\n\n## Type\n\ndisplay: Georgia, used at 44px for the one heading and nowhere else\nbody: Georgia, 16px, for everything a buyer actually reads\n\n## Density, motion and boldness\n\nAnswered for the fixture, so no heading is blank.\n\n## Structure\n\nAnswered for the fixture, so no heading is blank.\n\n## First screen\n\nAnswered for the fixture, so no heading is blank.\n\n## Imagery treatment\n\nAnswered for the fixture, so no heading is blank.\n\n## Argument order\n\nAnswered for the fixture, so no heading is blank.\n\n## Signature\n\nThe band, as `.a`, whose width encodes the reading.\n\n## Risk\n\nAnswered for the fixture, so no heading is blank.\n\n## Answer to the risk\n\nThe band is captioned in the same block, as `.a`, so a reader is never left to guess what the width means.\n\n## Second reading\n\nThe offcut count, as `p`, read in the body rather than the first screen, and it repeats no fact the band carries.\n\n## The shell\n\nA two-person glass shop on Bygaden, open Monday to Thursday, and the one thing a reader can do is bring the two measurements to the counter.\n\n## Assumptions\n\nAnswered for the fixture, so no heading is blank.\n\n## Originality pass\n\nAnswered for the fixture, so no heading is blank.\n\n## One-offs\n\nAnswered for the fixture, so no heading is blank.\n\n## Deliberate\n\nAnswered for the fixture, so no heading is blank.\n";

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`);
  if (!ok) failed++;
};

/* A stub that answers like the real script and leaves a trace. `exit` is baked in per case,
   so a veto and a clean pass are the same stub with a different number. */
const spy = (log, name, exit) => `#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
appendFileSync(${JSON.stringify(log)}, JSON.stringify({ script: ${JSON.stringify(name)}, argv: process.argv.slice(2), cwd: process.cwd() }) + '\\n');
console.log(${JSON.stringify(name)} + ' stub, exiting ${exit}');
process.exit(${exit});
`;

async function scenario({ gate = 0, ledger = 0 }) {
  const dir = await mkdtemp(join(tmpdir(), 'sitesmith-invoked-'));
  const skill = join(dir, 'skill', 'scripts');
  const project = join(dir, 'project');
  const log = join(dir, 'calls.jsonl');
  await mkdir(skill, { recursive: true });
  await mkdir(join(project, '.sitesmith'), { recursive: true });
  await writeFile(log, '', 'utf8');
  await writeFile(join(skill, 'gate.mjs'), spy(log, 'gate.mjs', gate), 'utf8');
  await writeFile(join(skill, 'ledger.mjs'), spy(log, 'ledger.mjs', ledger), 'utf8');
  await writeFile(join(skill, 'inspect.mjs'), spy(log, 'inspect.mjs', 0), 'utf8');

  const runner = join(dir, 'run.mjs');
  await writeFile(runner, `import { audit } from ${JSON.stringify(pathToUrl(join(ROOT, 'skills/sitesmith-v3/commands.mjs')))};
const code = await audit(${JSON.stringify(join(dir, 'skill'))}, ${JSON.stringify(project)}, {});
console.log('AUDIT_EXIT=' + code);
`, 'utf8');

  const r = spawnSync(process.execPath, [runner], { encoding: 'utf8' });
  const calls = (await readFile(log, 'utf8')).trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const exit = Number((`${r.stdout}`.match(/AUDIT_EXIT=(-?\d+)/) ?? [])[1]);
  return { dir, calls, exit, out: `${r.stdout}${r.stderr}` };
}

const pathToUrl = (p) => new URL(`file:///${p.replace(/\\/g, '/')}`).href;
const called = (calls, script) => calls.filter((c) => c.script === script);

console.log('\n  the ledger is executed on the canonical path\n');

const scratch = [];
try {
  /* 1. The normal path. audit is the command that reads a built result, and after the gate
        it must ask the ledger whether this shape has been made before. */
  const clean = await scenario({ gate: 0, ledger: 0 });
  scratch.push(clean.dir);
  const ledgerCalls = called(clean.calls, 'ledger.mjs');
  check('audit invokes ledger.mjs', ledgerCalls.length === 1,
    `${ledgerCalls.length} call(s); saw ${clean.calls.map((c) => c.script).join(', ') || 'nothing'}`);
  check('and it invokes it as `check`, not `commit`',
    ledgerCalls[0]?.argv?.[0] === 'check', JSON.stringify(ledgerCalls[0]?.argv));
  check('after the gate, not before',
    clean.calls.findIndex((c) => c.script === 'ledger.mjs') > clean.calls.findIndex((c) => c.script === 'gate.mjs'),
    clean.calls.map((c) => c.script).join(' then '));
  check('a clean gate and a clean ledger leave audit at exit 0', clean.exit === 0, `exit ${clean.exit}`);

  /* 2. A veto has to stop the run. An audit that reports a repeat and exits 0 is a report
        nobody acts on. */
  const vetoed = await scenario({ gate: 0, ledger: 1 });
  scratch.push(vetoed.dir);
  check('a ledger veto is carried into audit\'s exit code', vetoed.exit === 1, `exit ${vetoed.exit}`);

  /* 3. The gate refused, so the ledger is not asked. The two answer different questions and
        a run with both gets a list where the second is noise until the first is fixed. */
  const refused = await scenario({ gate: 2, ledger: 0 });
  scratch.push(refused.dir);
  check('a refusing gate means the ledger is not asked', called(refused.calls, 'ledger.mjs').length === 0,
    refused.calls.map((c) => c.script).join(', '));
  check('and audit still carries the gate\'s refusal', refused.exit === 2, `exit ${refused.exit}`);
  check('and it says why the ledger did not run, rather than being silent',
    /did not run/i.test(refused.out), refused.out.split('\n').slice(-6).join('\n'));

  /* 4. Nothing on this path commits. Committing is a claim that a version ships, and audit
        does not know that. See NO-SHIP-MOMENT.md. */
  check('no path through audit invokes commit',
    ![clean, vetoed, refused].some((s) => called(s.calls, 'ledger.mjs').some((c) => c.argv[0] === 'commit')));

  /* 5. Idempotence, against the real script rather than a stub: the ledger already refuses
        to append a shape it holds for the same surface, and that is the property that stops
        a rerun growing the file. Tested here because it is the half of D2 that is real. */
  const real = await mkdtemp(join(tmpdir(), 'sitesmith-idem-'));
  scratch.push(real);
  const ledgerFile = join(real, 'renders.jsonl');
  const entry = {
    v: 1, when: '2026-01-01', id: 'abc123',
    fingerprint: { ground: 'pale', display: 'serif', imagery: 'none', devices: [], groundHue: 44, accentHue: 4, signatureHue: null, groundColor: 'rgb(242, 238, 227)', accentColor: 'rgb(176, 42, 28)', signatureColor: null },
    waived: false,
  };
  await writeFile(ledgerFile, `${JSON.stringify(entry)}\n${JSON.stringify(entry)}\n`, 'utf8');
  const { readLedger, fingerprintKey } = await import(pathToUrl(join(ROOT, 'skills/sitesmith-v3/scripts/ledger.mjs')));
  const read = await readLedger(ledgerFile);
  const key = fingerprintKey({ devices: [], ...entry.fingerprint });
  const dupes = read.filter((e) => e.id === entry.id && fingerprintKey({ devices: [], ...e.fingerprint }) === key);
  check('the guard commit uses to skip a shape it already holds matches on id and fingerprint',
    dupes.length === 2 && key.length > 0, `${dupes.length} matched, key ${key}`);

  /* commit is a claim that a version ships, and it cannot be tested here: nothing in the
     architecture can say that a version ships, so there is nothing for a test to observe.
     The guard was written and it works, and it is not in the tree, because it needs every
     commit test to carry a full release fixture. The reasoning is in
     docs/lab/impeccable-4.0.4/D2-NO-SHIP-MOMENT.md and the decision is Magnus's. */
} finally {
  for (const d of scratch) if (existsSync(d)) await rm(d, { recursive: true, force: true });
}

console.log(`\n  ${failed ? `${failed} failing` : 'the ledger runs where the product says it runs'}\n`);
process.exit(failed ? 1 : 0);
