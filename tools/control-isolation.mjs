#!/usr/bin/env node
/**
 * Isolation for a benchmark control arm, as a structure rather than an instruction.
 * Original work, MIT.
 *
 *   node tools/control-isolation.mjs provision
 *   node tools/control-isolation.mjs check <workspace> [--path P]... [--env NAME=VALUE]...
 *
 * Rendered pilot 02 ran a control arm that was supposed to know nothing about this product.
 * Its prompt said nothing about it. It was handed one absolute path for its browser
 * dependency:
 *
 *   C:/Users/Usmo1/Documents/sitesmith/benchmarks/node_modules
 *
 * Two directories up from that is this repository. The arm's own DIRECTION.md then named
 * `direction-check.mjs`, `direction-history.mjs` and the ledger at `~/.sitesmith/` — three
 * things that exist only in `skills/sitesmith/`. A clean prompt and a dirty path is a dirty
 * arm.
 *
 * `tools/bench-isolate.mjs` already had the right instinct for the v2 benchmark: it copies
 * the dependency tree into the workspace instead of pointing at the repository, and its own
 * header says an instruction is not isolation. Its `verify` walks the workspace and skips
 * `node_modules` — so it would not have caught this, because this leak is not a file in the
 * workspace. It is a path handed to the arm.
 *
 * So the check here is about the paths, not the contents:
 *
 *   1. the workspace is not inside this repository
 *   2. no handed path is inside this repository
 *   3. no ancestor of any of them holds a marker of this product
 *   4. the workspace tree carries no trace of the product
 *   5. nothing handed over is *named* for the product either — an environment variable
 *      called SITESMITH_DEPS_DIR tells an arm the product exists just as loudly as a path
 *
 * Rule 3 is the one that matters. Rules 1 and 2 are special cases of it, kept separate so
 * the refusal names the real reason.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))

/* What makes a directory this product's root. Any one of them is enough. */
const MARKERS = ['skills/sitesmith', 'skills/sitesmith-v3', 'product/pipeline.json', 'bin/sitesmith.mjs']

/* Deliberately neutral: nothing in it names the product, because the name is the pointer. */
const NEUTRAL_HOME = join(tmpdir(), 'webdeps')
const SOURCE_DEPS = join(ROOT, 'benchmarks/node_modules')
const SOURCE_LOCK = join(ROOT, 'benchmarks/package-lock.json')

const PRODUCT_WORD = /sitesmith/i

/** Every directory from `p` up to the filesystem root, `p` first. */
function ancestry(p) {
  const out = []
  let cur = resolve(p)
  for (;;) {
    out.push(cur)
    const up = dirname(cur)
    if (up === cur) return out
    cur = up
  }
}

/** Is `p` the repository root or inside it? */
function insideRepo(p) {
  const rel = relative(ROOT, resolve(p))
  return rel === '' || (!rel.startsWith('..') && !resolve(p).startsWith('..') && !rel.includes(`..${sep}`))
}

/** The first ancestor of `p` that holds a marker of this product, or null. */
function reachesProduct(p) {
  for (const dir of ancestry(p)) {
    for (const m of MARKERS) {
      if (existsSync(join(dir, m))) return { dir, marker: m }
    }
  }
  return null
}

/* ── provision ──────────────────────────────────────────────────────────── */

/**
 * A dependency root outside the repository, with the repository nowhere above it.
 * Copied rather than linked: a link's target is still a path into the repository, and
 * resolving through it lands exactly where this whole problem started.
 */
function provision(argv) {
  if (!existsSync(SOURCE_DEPS)) {
    console.error(`no dependency tree at ${SOURCE_DEPS} — run npm install in benchmarks/ first`)
    process.exit(2)
  }
  /* Keyed by the lockfile, so a changed dependency set provisions a new root rather than
     silently reusing a stale one. */
  const key = createHash('sha256')
    .update(existsSync(SOURCE_LOCK) ? readFileSync(SOURCE_LOCK) : Buffer.from('no-lock'))
    .digest('hex')
    .slice(0, 12)
  const home = join(NEUTRAL_HOME, key)
  const deps = join(home, 'node_modules')

  if (argv.includes('--force')) rmSync(home, { recursive: true, force: true })

  if (!existsSync(deps)) {
    mkdirSync(home, { recursive: true })
    cpSync(SOURCE_DEPS, deps, { recursive: true })
    /* Written fresh rather than copied: benchmarks/package.json is called
       "sitesmith-benchmarks" and its scripts point back into the repository. */
    writeFileSync(join(home, 'package.json'),
      JSON.stringify({ name: 'workspace-deps', private: true, type: 'module' }, null, 2) + '\n')

    /* npm leaves the installing project's name in its own tree cache. Nothing resolves
       through it — `createRequire` never reads it — and it carried the product's name into an
       otherwise neutral tree. The scan below found it; it is removed rather than rewritten,
       because a cache that only npm reads has no business being here at all. */
    rmSync(join(deps, '.package-lock.json'), { force: true })
  }

  const leaks = scanForProduct(home)
  if (leaks.length) {
    console.error(`the provisioned tree names this product in ${leaks.length} file(s):`)
    for (const f of leaks.slice(0, 5)) console.error(`  ${f}`)
    process.exit(1)
  }
  const found = reachesProduct(deps)
  if (found) {
    console.error(`the provisioned tree can still reach ${found.marker} at ${found.dir}`)
    process.exit(1)
  }

  console.log(deps)
  return deps
}

/** Text files under this tree that name the product. Binaries and large files skipped. */
function scanForProduct(dir) {
  const TEXT = /\.(m?[jt]sx?|json|md|txt|cjs|yml|yaml|html|css|cmd|ps1|sh)$/i
  const hits = []
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name)
      if (e.isDirectory()) { walk(full); continue }
      if (PRODUCT_WORD.test(e.name)) { hits.push(full); continue }
      if (!TEXT.test(e.name)) continue
      if (statSync(full).size > 1_000_000) continue
      if (PRODUCT_WORD.test(readFileSync(full, 'utf8'))) hits.push(full)
    }
  }
  walk(dir)
  return hits
}

/* ── check ──────────────────────────────────────────────────────────────── */

function check(argv) {
  const positional = argv.filter((a) => !a.startsWith('--'))
  const workspace = positional[0]
  if (!workspace) {
    console.error('usage: control-isolation.mjs check <workspace> [--path P]... [--env NAME=VALUE]...')
    process.exit(2)
  }
  const handed = []
  const envs = []
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--path' && argv[i + 1]) handed.push(argv[i + 1])
    if (argv[i] === '--env' && argv[i + 1]) envs.push(argv[i + 1])
  }

  const findings = []
  const named = [['the workspace', workspace], ...handed.map((p) => ['a handed path', p])]

  for (const [what, p] of named) {
    if (insideRepo(p)) findings.push(`${what} is inside this repository: ${resolve(p)}`)
    const found = reachesProduct(p)
    if (found) findings.push(`${what} reaches ${found.marker} by walking up to ${found.dir}: ${resolve(p)}`)
  }

  /* The workspace's own contents. A control arm that has already written the product's name
     into its files has been contaminated whatever the paths say. */
  if (existsSync(workspace)) {
    const SKIP = new Set(['node_modules', '.next', '.git'])
    const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      SKIP.has(e.name) ? [] : e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)])
    const traces = []
    for (const f of walk(workspace)) {
      if (PRODUCT_WORD.test(f)) { traces.push(f); continue }
      if (!/\.(m?[jt]sx?|json|md|txt|html|css)$/i.test(f)) continue
      if (statSync(f).size > 1_000_000) continue
      if (PRODUCT_WORD.test(readFileSync(f, 'utf8'))) traces.push(f)
    }
    for (const t of traces.slice(0, 5)) findings.push(`the workspace names this product: ${relative(workspace, t)}`)
    if (traces.length > 5) findings.push(`...and ${traces.length - 5} more files in the workspace name it`)
  }

  for (const e of envs) {
    const name = e.split('=')[0]
    if (PRODUCT_WORD.test(name)) findings.push(`an environment variable handed over is named for this product: ${name}`)
    const value = e.slice(name.length + 1)
    if (value && insideRepo(value)) findings.push(`${name} points inside this repository: ${value}`)
  }

  console.log(`\n  control isolation — ${resolve(workspace)}\n`)
  console.log(`  repository       ${ROOT}`)
  console.log(`  handed paths     ${handed.length ? handed.join('  ') : 'none'}`)
  console.log(`  handed env       ${envs.length ? envs.map((e) => e.split('=')[0]).join('  ') : 'none'}\n`)
  if (!findings.length) {
    console.log('  ok    nothing handed to this arm resolves, traverses or points to the product\n')
    process.exit(0)
  }
  for (const f of findings) console.log(`  FAIL  ${f}`)
  console.log(`\n  ${findings.length} finding(s). Isolation must be structural: move the workspace and its`)
  console.log('  dependencies outside the repository with `control-isolation.mjs provision`.\n')
  process.exit(1)
}

const [cmd, ...rest] = process.argv.slice(2)
if (cmd === 'provision') provision(rest)
else if (cmd === 'check') check(rest)
else {
  console.error('usage: control-isolation.mjs <provision|check> ...')
  process.exit(2)
}
