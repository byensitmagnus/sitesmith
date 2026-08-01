#!/usr/bin/env node
// The test of stack.mjs.
//
// A gate that cannot fail is decoration, and a gate that cannot pass is noise. Detection
// fails both ways: a router that answers every directory is a guesser, and a router that
// refuses every directory sends every run down the degraded path. So every case below
// fixes its exit code before the run, and the cases that assert a stack name fix that
// too, because exit 0 alone cannot show that Next.js outranked React.
//
//   node skills/sitesmith-v3/scripts/test-stack.mjs

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(SCRIPT_DIR, '../../..')
const SCRIPT = join(SCRIPT_DIR, 'stack.mjs')
const FIX = join(REPO, 'docs/rebuild/s10/fixtures/scripts/stack')
const ADAPTERS = join(FIX, '_adapters')

// The shipped stacks/ directory holds only static.md today, so the precedence cases run
// against a complete test-double set. Their twins below run against the shipped set and
// are pinned to exit 2, which is what keeps that substitution visible instead of
// convenient: the day stacks/nextjs.md lands, the second block starts failing and
// somebody has to come back here and say so.
const CASES = [
  // Must pass, against the package exactly as it ships.
  {
    name: 'static-site',
    args: ['detect', join(FIX, 'static-site')],
    expect: 0,
    stack: 'static',
    why: 'index.html and no manifest is the one stack the shipped package can serve today',
  },

  // Must pass, and must name the right stack. This is the precedence rule.
  {
    name: 'nextjs-with-react',
    args: ['detect', join(FIX, 'nextjs-with-react'), '--stacks', ADAPTERS],
    expect: 0,
    stack: 'nextjs',
    why: 'next and react together resolve to next, which is the rule most often got wrong by hand',
  },
  {
    name: 'astro-with-react',
    args: ['detect', join(FIX, 'astro-with-react'), '--stacks', ADAPTERS],
    expect: 0,
    stack: 'astro',
    why: 'astro with the react integration resolves to astro, not react',
  },
  {
    name: 'react-vite',
    args: ['detect', join(FIX, 'react-vite'), '--stacks', ADAPTERS],
    expect: 0,
    stack: 'react',
    why: 'react without a primary framework is a stack in its own right, and its index.html must not read as static',
  },

  // Must keep failing.
  {
    name: 'bare',
    args: ['detect', join(FIX, 'bare'), '--stacks', ADAPTERS],
    expect: 1,
    why: 'nothing on disk names a stack, and a guess here is worse than the documented degraded path',
  },
  {
    name: 'both-primaries',
    args: ['detect', join(FIX, 'both-primaries'), '--stacks', ADAPTERS],
    expect: 1,
    why: 'next and astro at once has no single right answer, so it must refuse rather than pick the first entry in a list',
  },
  {
    name: 'nuxt-app',
    args: ['detect', join(FIX, 'nuxt-app'), '--stacks', ADAPTERS],
    expect: 1,
    why: 'a framework with no adapter must refuse by name, not fall through to "nothing detected" and invite plain HTML on top of a Nuxt app',
  },
  {
    name: 'html-with-unknown-deps',
    args: ['detect', join(FIX, 'html-with-unknown-deps'), '--stacks', ADAPTERS],
    expect: 1,
    why: 'index.html beside unrecognised dependencies could be source or output, and static is a claim about which',
  },
  {
    name: 'broken-manifest',
    args: ['detect', join(FIX, 'broken-manifest'), '--stacks', ADAPTERS],
    expect: 2,
    why: 'an unreadable manifest withholds its verdict; the index.html sitting next to it must not answer in its place',
  },
  {
    name: 'nextjs-with-react against the shipped adapters',
    args: ['detect', join(FIX, 'nextjs-with-react')],
    expect: 2,
    why: 'stacks/nextjs.md does not exist yet, and naming a file that is not there is not a pass',
  },
  {
    name: 'no command',
    args: [],
    expect: 2,
    why: 'usage errors are not detections',
  },
  {
    name: 'unknown flag',
    args: ['detect', join(FIX, 'static-site'), '--pick-the-nicest'],
    expect: 2,
    why: 'an unrecognised flag must stop the run rather than be ignored into a default',
  },
]

let failed = 0
for (const c of CASES) {
  const r = spawnSync(process.execPath, [SCRIPT, ...c.args], { cwd: REPO, encoding: 'utf8' })
  const problems = []
  if (r.status !== c.expect) problems.push(`exit ${r.status}, expected ${c.expect}`)
  if (c.stack && !new RegExp(`^stack: ${c.stack}$`, 'm').test(r.stdout ?? '')) {
    problems.push(`stdout did not name stack ${c.stack}`)
  }
  if (problems.length) failed++
  console.log(`${problems.length ? '  FAIL' : '  ok  '} ${c.name} (${c.why})`)
  for (const p of problems) console.log(`       ${p}`)
}

console.log(failed ? `\n${failed} case(s) failed` : `\nall clear, ${CASES.length} cases`)
process.exit(failed ? 1 : 0)
