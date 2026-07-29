/* Proves open-key.mjs refuses to open on each way a review could be wrong, and opens when
   they are all right. Run from the repo root. */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const T = join(process.env.TEMP ?? '/tmp', 'open-key-test');
await rm(T, { recursive: true, force: true });

const RUN = { 'run-id': 'test-run-1', 'rubric-sha256': 'a'.repeat(64),
              'sheet-sha256': 'b'.repeat(64), briefs: { 'SHEET-M2': 'c'.repeat(64) } };
const SEALED = join(T, 'sealed.json');

async function build({ runId = RUN['run-id'], sheet = RUN['sheet-sha256'],
                       brief = RUN.briefs['SHEET-M2'], locked = '2020-01-01T00:00:00Z',
                       tamperBody = false } = {}) {
  await rm(join(T, 'round'), { recursive: true, force: true });
  await rm(join(T, 'rev'), { recursive: true, force: true });
  await mkdir(join(T, 'round'), { recursive: true });
  await mkdir(join(T, 'rev', 'SHEET-M2'), { recursive: true });
  await writeFile(join(T, 'round', 'RUN.json'), JSON.stringify(RUN));
  await writeFile(SEALED, JSON.stringify({ assignment: { 'SHEET-M2': { subject: 'x' } } }));
  const body = 'A real critique would go here.';
  const h = createHash('sha256').update(body).digest('hex');
  await writeFile(join(T, 'rev', 'SHEET-M2', 'CRITIQUE-Z.md'),
    `---\nreviewer: Z\nreviewer-id: reviewer-z\nsha256: ${h}\nrun-id: ${runId}\n` +
    `rubric-sha256: ${RUN['rubric-sha256']}\nsheet-sha256: ${sheet}\nbrief-sha256: ${brief}\n` +
    `locked: ${locked}\n---\n${tamperBody ? body + ' EDITED AFTER LOCKING.' : body}\n`);
}

const run = () => spawnSync(process.execPath,
  ['tools/open-key.mjs', '--round', join(T, 'round'), '--sealed', SEALED, '--reviews', join(T, 'rev')],
  { encoding: 'utf8' });

const cases = [
  ['a review from another round',      { runId: 'other-run' },                  1],
  ['sheets that are not these sheets', { sheet: 'd'.repeat(64) },               1],
  ['a brief that is not this brief',   { brief: 'e'.repeat(64) },               1],
  ['a body edited after locking',      { tamperBody: true },                    1],
  ['no readable lock time',            { locked: 'sometime tuesday' },          1],
  ['a lock time in the future',        { locked: '2099-01-01T00:00:00Z' },      1],
  ['everything in order',              {},                                      0],
];

let bad = 0;
for (const [name, opts, want] of cases) {
  await build(opts);
  const r = run();
  const ok = r.status === want;
  if (!ok) bad++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name.padEnd(32)} exit ${r.status}, wanted ${want}`);
  if (!ok) console.log(r.stdout.split('\n').filter((l) => l.includes('BLOCK') || l.includes('sealed')).join('\n'));
}
await rm(T, { recursive: true, force: true });
console.log(`\n  ${bad ? `${bad} case(s) wrong` : 'the key opens only when the reviews are locked, bound and unedited'}\n`);
process.exit(bad ? 1 : 0);
