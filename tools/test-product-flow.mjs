#!/usr/bin/env node
/**
 * Product-flow contract for SiteSmith v1.0. Original work, MIT. AI-generated: (C).
 *
 * The installed skill has one ordinary journey: init -> build -> audit. Research-only
 * benchmarks and sealed reviews may exist in this repository, but they cannot leak into that
 * journey. The same contract proves that a real project selects exactly one stack adapter.
 */

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PIPELINE = join(ROOT, 'skills/sitesmith/PIPELINE.json');
const ROUTER = join(ROOT, 'skills/sitesmith/scripts/stack-router.mjs');
const CLI = join(ROOT, 'bin/sitesmith.mjs');
const APACHE_LICENSE_SHA256 = 'cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30';
const failures = [];

function canonicalText(buffer) {
  let text = buffer.toString('utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

async function check(name, fn) {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.log(`FAIL ${name}`);
  }
}

const pipeline = JSON.parse(await readFile(PIPELINE, 'utf8'));
const command = (name) => pipeline.commands[name]?.steps ?? [];
const step = (id) => pipeline.steps.find((item) => item.id === id);

await check('the ordinary journey is exactly init -> build -> audit', () => {
  assert.deepEqual(pipeline.defaultJourney, ['init', 'build', 'audit']);
});

await check('init owns direction formation instead of requiring a fourth shape command', () => {
  assert.equal(pipeline.commands.shape, undefined);
  for (const id of ['stack', 'directions', 'choose', 'contract']) {
    assert.ok(command('init').includes(id), `init is missing ${id}`);
  }
});

await check('build ends in a fast preview and audit owns the release checks', () => {
  assert.ok(command('build').includes('preview'), 'build is missing preview');
  assert.ok(command('audit').includes('verify'), 'audit is missing verify');
  assert.ok(command('audit').includes('novelty'), 'audit is missing final direction memory');
  assert.ok(command('audit').includes('report'), 'audit is missing report');
  assert.ok(!command('audit').includes('diversity'), 'portfolio diversity leaked into a site audit');
  assert.match(step('novelty')?.gate ?? '', /direction-history\.mjs commit/);
});

await check('lab-only diversity and sealed review are outside the product journey', () => {
  assert.equal(step('diversity')?.scope, 'lab');
  assert.equal(step('critique')?.gate, null);
});

async function fixture(name, packageJson) {
  const root = await mkdtemp(join(tmpdir(), `sitesmith-${name}-`));
  await writeFile(join(root, 'package.json'), JSON.stringify(packageJson, null, 2));
  return root;
}

function detect(project) {
  const result = spawnSync(process.execPath, [ROUTER, 'detect', project, '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, (result.stderr || result.stdout || 'router did not run').trim());
  return JSON.parse(result.stdout);
}

const projects = [];
try {
  const next = await fixture('next', {
    dependencies: { next: '15.2.0', react: '19.0.0', 'react-dom': '19.0.0' },
  });
  const vite = await fixture('vite', {
    dependencies: { react: '19.0.0', 'react-dom': '19.0.0' },
    devDependencies: { vite: '6.1.0', '@vitejs/plugin-react': '4.3.4' },
  });
  const astro = await fixture('astro', {
    dependencies: { astro: '5.3.0', react: '19.0.0' },
  });
  projects.push(next, vite, astro);

  await check('Next.js wins over its React dependency and selects nextjs.csv', () => {
    const got = detect(next);
    assert.equal(got.stack, 'nextjs');
    assert.equal(got.adapter, 'data/stacks/nextjs.csv');
    assert.equal(got.matches.length, 1);
  });

  await check('React with Vite selects the React adapter', () => {
    const got = detect(vite);
    assert.equal(got.stack, 'react');
    assert.equal(got.adapter, 'data/stacks/react.csv');
    assert.match(got.evidence.join('\n'), /vite/i);
  });

  await check('Astro wins over an optional React integration', () => {
    const got = detect(astro);
    assert.equal(got.stack, 'astro');
    assert.equal(got.adapter, 'data/stacks/astro.csv');
    assert.equal(got.matches.length, 1);
  });

  await check('write records one stack contract for the build step', async () => {
    const result = spawnSync(process.execPath, [ROUTER, 'detect', next, '--write'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, (result.stderr || result.stdout).trim());
    const contract = await readFile(join(next, '.sitesmith/STACK.md'), 'utf8');
    assert.match(contract, /^---\nstack: nextjs\nadapter: data\/stacks\/nextjs\.csv\n/m);
    assert.match(contract, /package\.json.*next/);
  });
} finally {
  await Promise.all(projects.map((project) => rm(project, { recursive: true, force: true })));
}

await check('generated provider packs expose the default journey but no lab step', async () => {
  const out = await mkdtemp(join(tmpdir(), 'sitesmith-pack-'));
  try {
    const result = spawnSync(process.execPath, [CLI, 'pack', '--provider', 'codex', '--out', out], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, (result.stderr || result.stdout).trim());
    const pack = await readFile(join(out, 'AGENTS.md'), 'utf8');
    assert.match(pack, /init\s*→\s*build\s*→\s*audit/i);
    assert.doesNotMatch(pack, /### diversity|portfolio diversity/i);
    assert.doesNotMatch(pack, /`shape`/i);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

await check('installed provider bundles carry every manifested licence and notice hash', async () => {
  const out = await mkdtemp(join(tmpdir(), 'sitesmith-install-'));
  try {
    /* `--v2` names which installer this check drives, and it has to. This file tests the v2
       product flow: PIPELINE.json, the generated provider packs, and the licence and notice
       files those bundles carry. `install` without the flag now hands off to the v3
       installer, which writes a different layout and ships no LICENSES directory, so the
       bare command stopped producing the bundle this assertion is about. The contract here
       is right; the command it drove was renamed under it. */
    const result = spawnSync(process.execPath, [CLI, 'install', '--v2', '--provider', 'codex', '--to', out,
      '--no-deps', '--no-doctor'], { cwd: ROOT, encoding: 'utf8' });
    assert.equal(result.status, 0, (result.stderr || result.stdout).trim());
    const installedSkill = join(out, '.agents', 'skills', 'sitesmith');
    const licence = await readFile(join(installedSkill, 'LICENSES', 'Apache-2.0.txt'), 'utf8');
    assert.equal(sha256(canonicalText(licence)), APACHE_LICENSE_SHA256,
      'installed Apache-2.0.txt must exactly match the complete apache.org text');
    const notices = await readFile(join(installedSkill, 'THIRD-PARTY-NOTICES.md'), 'utf8');
    for (const owner of ['Leonxlnx', 'Next Level Builder', 'Anthropic PBC', 'Paul Bakaus']) {
      assert.match(notices, new RegExp(owner));
    }
    const manifestPath = join(installedSkill, 'THIRD-PARTY-PROVENANCE.json');
    const manifestText = canonicalText(await readFile(manifestPath));
    const manifest = JSON.parse(manifestText);
    assert.equal(manifest.schemaVersion, 1);
    const shipping = manifest.carriage.filter((item) => item.shipsWithInstall);
    assert.deepEqual(shipping.map((item) => item.id).sort(),
      ['apache-2.0-license', 'provenance-manifest', 'third-party-notices']);
    for (const item of shipping) {
      assert.equal(item.scope, 'skill', `${item.id} must install inside the skill root`);
      assert.ok(!isAbsolute(item.path) && !item.path.includes('\\') &&
        !item.path.split('/').includes('..'), `${item.id} has an unsafe install path`);
      const installedPath = resolve(installedSkill, ...item.path.split('/'));
      const fromRoot = relative(resolve(installedSkill), installedPath);
      assert.ok(fromRoot && !fromRoot.startsWith('..') && !isAbsolute(fromRoot),
        `${item.id} escapes the installed skill root`);
      let installedText = canonicalText(await readFile(installedPath));
      if (item.hashMode === manifest.selfHashMode) {
        assert.equal(item.id, 'provenance-manifest');
        assert.equal(installedText.split(item.canonicalFileSha256).length - 1, 1,
          'manifest self hash must occur exactly once');
        installedText = installedText.replace(item.canonicalFileSha256, '0'.repeat(64));
      }
      assert.equal(sha256(installedText), item.canonicalFileSha256,
        `${item.id} installed canonical hash drifted`);
    }
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

await check('public product documents agree on the compact journey', async () => {
  const [skill, readme, state, plugin, marketplace] = await Promise.all([
    readFile(join(ROOT, 'skills/sitesmith/SKILL.md'), 'utf8'),
    readFile(join(ROOT, 'README.md'), 'utf8'),
    readFile(join(ROOT, 'docs/v2/STATE.md'), 'utf8'),
    readFile(join(ROOT, '.claude-plugin/plugin.json'), 'utf8'),
    readFile(join(ROOT, '.claude-plugin/marketplace.json'), 'utf8'),
  ]);
  for (const [name, text] of Object.entries({ skill, readme, state })) {
    assert.match(text, /init\s*(?:→|->)\s*build\s*(?:→|->)\s*audit/i, `${name} has no journey`);
  }
  assert.doesNotMatch(`${plugin}\n${marketplace}`, /12-step/i);
  assert.doesNotMatch(state, /HEAD is `/i);
});

await check('the capability manifest no longer reports shipped product features as missing', async () => {
  const manifest = JSON.parse(await readFile(join(ROOT, 'docs/v2/CAPABILITY-MANIFEST.json'), 'utf8'));
  const capabilities = new Map(manifest.capabilities.map((item) => [item.id, item]));
  for (const id of ['guided-variation-dials', 'command-vocabulary', 'install-update-doctor',
                    'provider-packages']) {
    assert.equal(capabilities.get(id)?.sitesmithStatus, 'complete', `${id} is not complete`);
  }
  const stack = capabilities.get('stack-specific-implementation');
  assert.match(stack?.sitesmithFile ?? '', /stack-router\.mjs/);
  assert.doesNotMatch(stack?.evidence ?? '', /^none\b/i);
});

if (failures.length) {
  console.error(`\n${failures.length} product-flow failure(s):\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log('\nPASS — compact product flow and stack routing hold\n');
