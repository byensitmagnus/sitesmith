#!/usr/bin/env node
/**
 * Detect the project's established frontend stack and select one bundled adapter.
 * Original work, MIT. AI-generated: (C).
 *
 *   node stack-router.mjs detect [project] [--json] [--write]
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url));
const SKILL_ROOT = resolve(SCRIPT_DIR, '..');
const args = process.argv.slice(2);
const command = args[0];
const projectArg = args.find((arg, index) => index > 0 && !arg.startsWith('--')) ?? '.';
const project = resolve(projectArg);
const has = (flag) => args.includes(`--${flag}`);

const ADAPTERS = [
  { stack: 'nextjs', packages: ['next'] },
  { stack: 'astro', packages: ['astro'] },
  { stack: 'react', packages: ['react'] },
];

function die(message, code = 1) {
  console.error(`stack-router: ${message}`);
  process.exit(code);
}

async function readPackageJson() {
  const file = join(project, 'package.json');
  if (!existsSync(file)) return { file, packages: new Map() };
  let parsed;
  try {
    parsed = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    die(`cannot parse ${file}: ${error.message}`, 2);
  }
  const all = { ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) };
  return { file, packages: new Map(Object.entries(all)) };
}

function selectedAdapter(packages) {
  const primary = ADAPTERS.filter(({ stack, packages: names }) =>
    stack !== 'react' && names.some((name) => packages.has(name)));
  if (primary.length > 1) {
    die(`ambiguous primary frameworks: ${primary.map(({ stack }) => stack).join(', ')}`);
  }
  if (primary.length === 1) return primary[0];
  return ADAPTERS.find(({ stack, packages: names }) =>
    stack === 'react' && names.some((name) => packages.has(name))) ?? null;
}

function evidenceFor(stack, packages) {
  const evidence = [];
  const relevant = stack === 'nextjs' ? ['next', 'react']
    : stack === 'astro' ? ['astro', 'react']
      : ['react', 'vite', '@vitejs/plugin-react'];
  for (const name of relevant) {
    if (packages.has(name)) evidence.push(`package.json declares ${name}@${packages.get(name)}`);
  }
  return evidence;
}

async function detect() {
  const { packages } = await readPackageJson();
  const chosen = selectedAdapter(packages);
  if (!chosen) die('no supported stack detected (Next.js, React/Vite or Astro)');

  const adapter = `data/stacks/${chosen.stack}.csv`;
  if (!existsSync(join(SKILL_ROOT, adapter))) die(`adapter is missing: ${adapter}`, 2);
  const evidence = evidenceFor(chosen.stack, packages);
  const result = {
    stack: chosen.stack,
    adapter,
    confidence: 'exact',
    evidence,
    matches: [{ stack: chosen.stack, adapter }],
  };

  if (has('write')) {
    const outDir = join(project, '.sitesmith');
    const out = join(outDir, 'STACK.md');
    await mkdir(outDir, { recursive: true });
    await writeFile(out, [
      '---',
      `stack: ${result.stack}`,
      `adapter: ${result.adapter}`,
      `confidence: ${result.confidence}`,
      'ai_generated: "(C)"',
      '---',
      '',
      '# Detected stack',
      '',
      ...evidence.map((item) => `- ${item}`),
      '',
      `Read only \`${result.adapter}\` during implementation.`,
      '',
    ].join('\n'));
  }

  if (has('json')) console.log(JSON.stringify(result));
  else {
    console.log(`stack: ${result.stack}`);
    console.log(`adapter: ${result.adapter}`);
    for (const item of evidence) console.log(`evidence: ${item}`);
  }
}

if (command !== 'detect') {
  die('usage: stack-router.mjs detect [project] [--json] [--write]', 2);
}

await detect();

