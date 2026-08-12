#!/usr/bin/env node
/**
 * A benchmark control arm must not be able to reach this product. Original work, MIT.
 *
 *   node tools/test-control-isolation.mjs
 *
 * Rendered pilot 02's control arm was given a clean prompt and one dirty path: its browser
 * dependency at `<repo>/benchmarks/node_modules`. Two directories up is this repository. The
 * arm's own DIRECTION.md then named `direction-check.mjs`, `direction-history.mjs` and the
 * ledger at `~/.sitesmith/` — three things that exist only under `skills/sitesmith`.
 *
 * This file was red first. The failing case below is the pilot's actual configuration, and it
 * is asserted here as a shape that must always be refused, so the fix cannot be undone by a
 * later harness reaching for the convenient path again.
 *
 * What it does not claim: that an agent cannot read some other absolute path on the machine.
 * Nothing here can prevent that. What it does prove is that nothing this harness *hands over*
 * leads to the product.
 */

import { mkdtempSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { join, resolve, dirname } from 'node:path'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const TOOL = join(ROOT, 'tools/control-isolation.mjs')

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}
const run = (args) => spawnSync(process.execPath, [TOOL, ...args], { encoding: 'utf8', cwd: ROOT })

console.log('\n  a control arm must not be handed a way back to this product\n')

/* ── the mechanism, reproduced rather than described ─────────────────────── */

/* The concrete traversal: from the path pilot 02 handed over, walking up reaches the marker
   directories. This is the whole leak, and it is two lines of path arithmetic. */
{
  const handed = join(ROOT, 'benchmarks/node_modules')
  let hops = 0
  let cur = handed
  let hit = null
  while (hops <= 4 && !hit) {
    if (existsSync(join(cur, 'skills/sitesmith'))) hit = { cur, hops }
    const up = dirname(cur)
    if (up === cur) break
    cur = up
    hops += 1
  }
  check('the dependency path pilot 02 handed over reaches skills/sitesmith by walking up',
    hit !== null && hit.hops === 2,
    hit ? `reached at ${hit.hops} levels up` : 'not reachable — has the layout changed?')
  check('and the two scripts the control arm named are really in there',
    existsSync(join(ROOT, 'skills/sitesmith/scripts/direction-check.mjs'))
    && existsSync(join(ROOT, 'skills/sitesmith/scripts/direction-history.mjs')))
}

/* ── the shapes that must be refused ─────────────────────────────────────── */

const ws = mkdtempSync(join(tmpdir(), 'ctlws-'))
writeFileSync(join(ws, 'BRIEF.md'), '# a brief and nothing else\n')

{
  const r = run(['check', ws, '--path', join(ROOT, 'benchmarks/node_modules')])
  check('pilot 02\'s own configuration is refused',
    r.status === 1 && /reaches skills\/sitesmith/.test(r.stdout),
    r.stdout.split('\n').filter((l) => /FAIL/.test(l)).slice(0, 2).join('\n          '))
}

{
  /* A workspace inside the repository, which is the other way the same leak arrives. */
  const inside = join(ROOT, 'benchmarks/.tmp-control-arm')
  mkdirSync(inside, { recursive: true })
  const r = run(['check', inside])
  rmSync(inside, { recursive: true, force: true })
  check('a workspace inside the repository is refused',
    r.status === 1 && /inside this repository/.test(r.stdout))
}

{
  /* The name is a pointer too. An arm told to read SITESMITH_DEPS_DIR knows the product
     exists before it has read a single file. */
  const r = run(['check', ws, '--env', 'SITESMITH_DEPS_DIR=/somewhere/neutral'])
  check('an environment variable named for the product is refused',
    r.status === 1 && /named for this product/.test(r.stdout))
}

{
  const r = run(['check', ws, '--env', `DEPS_DIR=${join(ROOT, 'benchmarks/node_modules')}`])
  check('a neutrally named variable pointing into the repository is still refused',
    r.status === 1 && /points inside this repository/.test(r.stdout))
}

{
  /* Contamination that has already landed in the workspace, whatever the paths say. */
  const dirty = mkdtempSync(join(tmpdir(), 'ctlws-'))
  writeFileSync(join(dirty, 'NOTES.md'), 'I read the sitesmith direction lab and copied its method.\n')
  const r = run(['check', dirty])
  rmSync(dirty, { recursive: true, force: true })
  check('a workspace whose own files name the product is refused',
    r.status === 1 && /names this product/.test(r.stdout))
}

/* ── the shape that must be accepted, and must still work ────────────────── */

{
  const p = run(['provision'])
  const deps = p.stdout.trim()
  check('provision yields a dependency root outside the repository',
    p.status === 0 && deps.length > 0 && !resolve(deps).startsWith(ROOT),
    p.status === 0 ? deps : `${p.stdout}${p.stderr}`.trim())

  if (p.status === 0 && deps) {
    const r = run(['check', ws, '--path', deps, '--env', `DEPS_DIR=${deps}`])
    check('a workspace outside the repository with those dependencies is accepted',
      r.status === 0,
      r.stdout.split('\n').filter((l) => /FAIL/.test(l)).slice(0, 3).join('\n          '))

    /* Isolation that breaks the capability is not isolation, it is sabotage. The arm still
       has to be able to look at its own work. */
    const probe = spawnSync(process.execPath, ['-e', `
      const { createRequire } = require('module')
      const { join, resolve } = require('path')
      const req = createRequire(join(resolve(process.argv[1]), '..', 'package.json'))
      req.resolve('playwright'); req.resolve('@axe-core/playwright')
      console.log('resolved')
    `, deps], { encoding: 'utf8', cwd: ws })
    check('and a browser and axe still resolve from it',
      probe.status === 0 && /resolved/.test(probe.stdout),
      `${probe.stdout}${probe.stderr}`.trim().split('\n').slice(-2).join('\n          '))
  }
}

rmSync(ws, { recursive: true, force: true })

console.log(`\n  ${failed ? `${failed} failing` : 'nothing handed to a control arm leads back to the product'}\n`)
process.exit(failed ? 1 : 0)
