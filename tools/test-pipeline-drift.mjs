#!/usr/bin/env node
/**
 * One pipeline, or none. Original work, MIT.
 *
 *   node tools/test-pipeline-drift.mjs
 *
 * Every check here failed at least once on the repository as it stood before the v3 alpha
 * hardening, which is the only reason any of them exists. The repository had two products
 * in it: `install` delegated to v3 while `install --provider` generated its packs from v2's
 * PIPELINE.json, so no provider pack anyone received described the product they installed,
 * and product/pipeline.json was a document nothing read.
 *
 * A drift test that only reads the pipeline against itself proves nothing. These read the
 * pipeline against the code, against an install written to a temporary directory, and
 * against the two command lines actually running.
 */

import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { PROVIDERS, providerNames, loadPipeline, renderJourney, packFiles } from './provider-pack.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKILL = join(ROOT, 'skills/sitesmith-v3');

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${detail && !ok ? `\n          ${detail}` : ''}`);
  if (!ok) failed++;
};

const p = await loadPipeline();

console.log('\n  pipeline drift\n');

/* 1. A command in one place and not the other.
      The CLI's own table is the thing a user meets; the pipeline is the thing the packs are
      written from. If they disagree, one of them is lying to somebody. */
{
  const { COMMANDS } = await import('../skills/sitesmith-v3/commands.mjs');
  const fromPipeline = Object.fromEntries(Object.entries(p.commands).filter(([k]) => !k.startsWith('$')));
  const fromCode = Object.fromEntries(Object.entries(COMMANDS).map(([k, c]) => [k, c.does]));
  const pk = Object.keys(fromPipeline).join(',');
  const ck = Object.keys(fromCode).join(',');
  check('command names match commands.mjs, in order', pk === ck, `pipeline: ${pk}\n          code:     ${ck}`);
  for (const [name, does] of Object.entries(fromPipeline)) {
    check(`  ${name} does the same thing in both`, fromCode[name] === does,
      `pipeline says ${does}, commands.mjs says ${fromCode[name]}`);
  }
}

/* 2. A different order of steps.
      Renders the journey twice: once from the pipeline in memory, once from what an install
      actually placed on disk. Reordering the steps in one place and not the other is exactly
      the drift that made two products possible. */
const journey = renderJourney(p);
{
  const ids = p.steps.map((s) => s.id);
  const inJourney = [...journey.matchAll(/^### (\S+)$/gm)].map((m) => m[1]);
  check('the rendered journey lists every step, in pipeline order',
    ids.join(' ') === inJourney.join(' '), `${ids.join(' ')}\n          ${inJourney.join(' ')}`);
  check('no step id repeats', new Set(ids).size === ids.length);
}

/* 3. A module reference that does not exist in the installed package.
      Half of the pilot's defects were documented commands that did not run. A pipeline is
      allowed to be aspirational in a design document and nowhere else. */
for (const s of p.steps) {
  if (!s.module) continue;
  const file = s.module.split('#')[0];
  check(`${s.id}: ${file} exists in the package`, existsSync(join(SKILL, file)));
}

/* 3b. The design contract has to travel. A contract an installed user can write and cannot
       validate is a form, and the schema is data the validator reads at runtime rather than
       code bundled into it, so it is exactly the kind of file an installer forgets. */
{
  const dc = p.designContract;
  check('product/pipeline.json declares the design contract', Boolean(dc));
  if (dc) {
    for (const f of [dc.schema, dc.validator]) {
      check(`${f} exists`, existsSync(join(ROOT, f)));
      check(`${f} is inside the package`, f.startsWith('skills/sitesmith-v3/'), f);
    }
    check('the contract does not claim to be a hard gate', dc.hardGate === false);
    check('and says why not', typeof dc.whyNotAHardGate === 'string' && dc.whyNotAHardGate.length > 40);
  }
}

/* 4. A README quickstart that does not match the pipeline's.
      The README is where a stranger starts. It was the last place still describing a
      journey nothing generated. */
{
  const readme = await readFile(join(ROOT, 'README.md'), 'utf8');
  const blocks = [...readme.matchAll(/```bash\n([\s\S]*?)```/g)].map((m) => m[1].trimEnd());
  const want = p.quickstart.join('\n');
  check('README contains the pipeline quickstart verbatim', blocks.includes(want),
    `no bash block in README.md equals product/pipeline.json quickstart:\n\n${want}`);
}

/* 5. The installed CLI and the repository CLI routing differently.
      They import one router, and this proves it by running both rather than by reading the
      import line. `cli.mjs` is the only entry an installed user has. */
{
  const run = (file, args) => spawnSync(process.execPath, [join(ROOT, file), ...args], { encoding: 'utf8' });
  const installed = run('skills/sitesmith-v3/cli.mjs', ['--help']);
  const repo = run('bin/sitesmith.mjs', ['--help']);
  const commandBlock = (s) => (s.match(/^ {4}sitesmith .*$/gm) ?? []).join('\n');
  check('installed cli.mjs and repo bin/sitesmith.mjs print the same command surface',
    commandBlock(installed.stdout) === commandBlock(repo.stdout) && commandBlock(repo.stdout).length > 0,
    `cli.mjs:\n${commandBlock(installed.stdout)}\n\nbin:\n${commandBlock(repo.stdout)}`);
  check('installed cli.mjs exits 0 on --help', installed.status === 0, `exit ${installed.status}`);
  check('every pipeline command appears in the printed surface',
    Object.keys(p.commands).filter((k) => !k.startsWith('$'))
      .every((c) => new RegExp(`^ {4}sitesmith ${c}\\b`, 'm').test(installed.stdout)));
}

/* 6. A provider whose pack does not contain the entry the pipeline promises.
      This is the check that would have caught the original defect on its own: it fails
      unless the file the pipeline names is in the directory the pipeline names, put there
      by the install command the pipeline names. */
{
  const dir = await mkdtemp(join(tmpdir(), 'sitesmith-drift-'));
  try {
    const r = spawnSync(process.execPath,
      [join(ROOT, 'bin/sitesmith.mjs'), 'install', '--to', dir, '--provider', 'all'],
      { encoding: 'utf8' });
    check('install --provider all exits 0', r.status === 0, (r.stderr || r.stdout || '').slice(-400));
    for (const name of providerNames()) {
      const declared = p.providers[name];
      check(`${name}: declared in product/pipeline.json`, Boolean(declared));
      if (!declared) continue;
      const entry = join(dir, declared.entry);
      check(`${name}: ${declared.entry} written by install`, existsSync(entry));
      check(`${name}: pipeline entry path agrees with the provider table`,
        declared.entry === `${PROVIDERS[name].dir}/${PROVIDERS[name].entry}`,
        `${declared.entry} vs ${PROVIDERS[name].dir}/${PROVIDERS[name].entry}`);
      check(`${name}: status is one of supported, experimental, not supported`,
        ['supported', 'experimental', 'not supported'].includes(declared.status), declared.status);
      const shipped = join(dir, PROVIDERS[name].dir, 'JOURNEY.md');
      check(`${name}: the installed JOURNEY.md is the rendered pipeline, byte for byte`,
        existsSync(shipped) && await readFile(shipped, 'utf8') === journey);
      for (const extra of Object.keys(packFiles(name, p))) {
        check(`${name}: ${extra} present`, existsSync(join(dir, PROVIDERS[name].dir, extra)));
      }
      /* The contract, its schema and its own step document, in every provider's pack. */
      for (const f of ['scripts/contract.mjs', 'scripts/colour.mjs', 'contract/schema.json', 'contract.md']) {
        check(`${name}: ${f} installed`, existsSync(join(dir, PROVIDERS[name].dir, f)));
      }
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/* 7. A second pipeline claiming to be current.
      v2's file still exists because the v2 evidence was produced against it. It has to say
      so in itself, or the next person to open it has no way of knowing which one is live. */
{
  const v2 = JSON.parse(await readFile(join(ROOT, 'skills/sitesmith/PIPELINE.json'), 'utf8'));
  check('skills/sitesmith/PIPELINE.json labels itself legacy', v2.legacy?.status === 'legacy');
  check('and names product/pipeline.json as what replaced it',
    v2.legacy?.supersededBy === 'product/pipeline.json');
  const bin = await readFile(join(ROOT, 'bin/sitesmith.mjs'), 'utf8');
  check('v2 is reachable only behind --legacy-v2', /has\('legacy-v2'\)/.test(bin) && !/has\('v2'\)/.test(bin));
}

console.log(`\n  ${failed ? `${failed} failing` : 'no drift'}\n`);
process.exit(failed ? 1 : 0);
