#!/usr/bin/env node
/**
 * Product-flow contract for SiteSmith v1.0. Original work, MIT.
 *
 * The installed skill has one ordinary journey: init -> build -> audit. Research-only
 * benchmarks and sealed reviews may exist in this repository, but they cannot leak into that
 * journey. The same contract proves that a real project selects exactly one stack adapter.
 */

import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PIPELINE = join(ROOT, 'skills/sitesmith/PIPELINE.json');
const ROUTER = join(ROOT, 'skills/sitesmith/scripts/stack-router.mjs');
const failures = [];

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
  assert.ok(command('audit').includes('report'), 'audit is missing report');
  assert.ok(!command('audit').includes('diversity'), 'portfolio diversity leaked into a site audit');
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

if (failures.length) {
  console.error(`\n${failures.length} product-flow failure(s):\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log('\nPASS — compact product flow and stack routing hold\n');

