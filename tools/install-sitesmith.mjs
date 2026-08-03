#!/usr/bin/env node
// Puts the skill where an agent will find it.
//
//   node tools/install-sitesmith.mjs
//   node tools/install-sitesmith.mjs --to /path/to/skills
//   node tools/install-sitesmith.mjs --force
//   node tools/install-sitesmith.mjs --dry-run
//
// Two rules, both learned from this repository's own history.
//
// It refuses to overwrite an existing install without --force, because a skill directory
// is somewhere a person edits, and silently replacing their edits is not an install, it
// is a loss.
//
// It prints every path it wrote. An installer that says "done" is asking to be trusted
// about the one thing the user cannot see.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'
import { homedir } from 'node:os'
import { PROVIDERS, providerNames, loadPipeline, packFiles } from './provider-pack.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(root, 'skills/sitesmith-v3')
const NAME = 'sitesmith'

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const DRY = args.includes('--dry-run')
const toIndex = args.indexOf('--to')
const explicit = toIndex > -1 ? args[toIndex + 1] : null
const provIndex = args.indexOf('--provider')
const wantProviders = provIndex > -1 ? (args[provIndex + 1] ?? '') : null

if (!existsSync(join(SOURCE, 'SKILL.md'))) {
  console.error(`no SKILL.md under ${SOURCE}. Run this from the repository root.`)
  process.exit(2)
}

// --provider puts the skill where that agent looks, and writes the generated journey next
// to it. Without it the skill goes in a plain `sitesmith/` directory, which is what the
// pilot used and what someone driving the CLI by hand wants.
let providers = []
if (wantProviders !== null) {
  providers = wantProviders === 'all' ? providerNames() : wantProviders.split(',').map((s) => s.trim()).filter(Boolean)
  const bad = providers.filter((p) => !PROVIDERS[p])
  if (!providers.length || bad.length) {
    console.error(`usage: --provider ${providerNames().join('|')}|all`)
    if (bad.length) console.error(`unknown provider: ${bad.join(', ')}`)
    process.exit(2)
  }
}

// Both roots are installed when both exist, because this machine keeps them as a pair and
// updating one leaves the other stale, which is worse than not installing at all.
const targets = providers.length
  ? providers.map((p) => join(explicit ?? process.cwd(), PROVIDERS[p].dir))
  : explicit
    ? [join(explicit, NAME)]
    : [join(homedir(), '.claude', 'skills', NAME), join(homedir(), '.agents', 'skills', NAME)]
        .filter((p) => existsSync(dirname(dirname(p))))

if (!targets.length) {
  console.error('found no skills directory. Pass --to <path> to say where it goes.')
  process.exit(2)
}

const pipeline = await loadPipeline()

// Working files and test doubles are not part of the skill. .sitesmith is a run's own
// scratch directory and would ship one project's state to every later project.
const SKIP_DIR = new Set(['node_modules', '.git', '.sitesmith', '__pycache__'])
const SKIP_FILE = /^(test-.*\.mjs|.*\.log)$/

async function collect(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue
      await collect(join(dir, e.name), base, out)
    } else if (!SKIP_FILE.test(e.name)) {
      out.push(relative(base, join(dir, e.name)).replace(/\\/g, '/'))
    }
  }
  return out
}

const files = await collect(SOURCE)
const bytes = files.reduce((n, f) => n + statSync(join(SOURCE, f)).size, 0)

console.log(`sitesmith: ${files.length} files, ${(bytes / 1024).toFixed(0)} KB\n`)

let wrote = 0
let refused = 0
targets.forEach((target, i) => {
  const provider = providers[i] ?? null
  const generated = provider ? packFiles(provider, pipeline) : { 'JOURNEY.md': packFiles('claude', pipeline)['JOURNEY.md'] }
  if (existsSync(target) && !FORCE) {
    console.log(`  refused  ${target}`)
    console.log(`           already exists. Pass --force to replace it, after checking you have no local edits there.`)
    refused++
    return
  }
  if (DRY) {
    console.log(`  would write  ${target}  (${files.length + Object.keys(generated).length} files)`)
    return
  }
  if (existsSync(target) && FORCE) rmSync(target, { recursive: true, force: true })
  for (const f of files) {
    const dest = join(target, f)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, readFileSync(join(SOURCE, f)))
  }
  for (const [f, body] of Object.entries(generated)) {
    const dest = join(target, f)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, body)
  }
  console.log(`  installed  ${target}${provider ? `  (${provider}, entry ${PROVIDERS[provider].entry})` : ''}`)
  for (const f of [...files, ...Object.keys(generated)].sort()) console.log(`             ${f}`)
  wrote++
})

if (refused && !wrote) {
  console.error('\nnothing installed.')
  process.exit(1)
}

/* One thing worth taking from tenfoldmarc/website-builder-setup, which is otherwise a
   wizard that installs three other people's tools and never combines them: it walks a
   person through setup one step at a time and, when a step fails, gives the manual
   command and keeps going rather than stopping. This installer printed a wall. Someone
   who installs without playwright then gets withheld verdicts and no idea why, which is
   the same defect in a different place: a tool that knows what is missing and does not
   say which. Nothing was copied; that repository carries no licence at all. */
function environmentSteps() {
  // Resolved exactly the way verify.mjs resolves them, from the working directory,
  // because a check that looks somewhere else answers a different question than the
  // one the user is asking. An earlier draft of this function fell back to this
  // repository's own benchmarks directory and would have reported "ok" to someone
  // whose project had neither.
  const req = createRequire(join(process.cwd(), 'package.json'))
  const where = (name) => {
    try {
      return dirname(req.resolve(`${name}/package.json`))
    } catch {
      try {
        return dirname(req.resolve(name))
      } catch {
        return null
      }
    }
  }
  const major = Number(process.versions.node.split('.')[0])
  const pw = where('playwright')
  const axe = where('@axe-core/playwright')
  return [
    {
      name: 'Node 20 or newer',
      ok: major >= 20,
      have: `node ${process.versions.node}`,
      fix: 'Install the current LTS from nodejs.org, then run this again.',
    },
    {
      name: 'playwright, to render a page',
      ok: Boolean(pw),
      have: pw ? `resolves from ${relative(process.cwd(), pw) || '.'}` : 'does not resolve here',
      fix: 'npm i -D playwright && npx playwright install chromium',
    },
    {
      name: 'axe, for the accessibility pass',
      ok: Boolean(axe),
      have: axe ? `resolves from ${relative(process.cwd(), axe) || '.'}` : 'does not resolve here',
      fix: 'npm i -D @axe-core/playwright',
    },
  ]
}

if (!DRY && wrote) {
  console.log('')
  console.log(`Checking what the skill needs, from ${process.cwd()}`)
  console.log('')
  let missing = 0
  for (const s of environmentSteps()) {
    console.log(`  ${s.ok ? 'ok    ' : 'absent'}  ${s.name}  (${s.have})`)
    if (s.ok) continue
    missing++
    console.log(`          ${s.fix}`)
  }
  console.log('')
  if (missing) {
    console.log(`${missing} absent. The skill still installs and still builds pages.`)
    console.log('What you lose: every check that has to render withholds its verdict and says so')
    console.log('in the report. It never prints a pass it did not earn, so a build made without')
    console.log('these is not wrong, it is unverified. Install them in any order, whenever.')
  } else {
    console.log('Everything the skill needs is here.')
  }
  console.log('')
  console.log('Start a session in the project you want to build and say what you want.')
}
