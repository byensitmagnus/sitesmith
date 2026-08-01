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
import { dirname, join, relative } from 'node:path'
import { homedir } from 'node:os'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(root, 'skills/sitesmith-v3')
const NAME = 'sitesmith'

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const DRY = args.includes('--dry-run')
const toIndex = args.indexOf('--to')
const explicit = toIndex > -1 ? args[toIndex + 1] : null

if (!existsSync(join(SOURCE, 'SKILL.md'))) {
  console.error(`no SKILL.md under ${SOURCE}. Run this from the repository root.`)
  process.exit(2)
}

// Both roots are installed when both exist, because this machine keeps them as a pair and
// updating one leaves the other stale, which is worse than not installing at all.
const targets = explicit
  ? [join(explicit, NAME)]
  : [join(homedir(), '.claude', 'skills', NAME), join(homedir(), '.agents', 'skills', NAME)]
      .filter((p) => existsSync(dirname(dirname(p))))

if (!targets.length) {
  console.error('found no skills directory. Pass --to <path> to say where it goes.')
  process.exit(2)
}

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
for (const target of targets) {
  if (existsSync(target) && !FORCE) {
    console.log(`  refused  ${target}`)
    console.log(`           already exists. Pass --force to replace it, after checking you have no local edits there.`)
    refused++
    continue
  }
  if (DRY) {
    console.log(`  would write  ${target}  (${files.length} files)`)
    continue
  }
  if (existsSync(target) && FORCE) rmSync(target, { recursive: true, force: true })
  for (const f of files) {
    const dest = join(target, f)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, readFileSync(join(SOURCE, f)))
  }
  console.log(`  installed  ${target}`)
  for (const f of files.sort()) console.log(`             ${f}`)
  wrote++
}

if (refused && !wrote) {
  console.error('\nnothing installed.')
  process.exit(1)
}

if (!DRY && wrote) {
  console.log(`\nStart a session in the project you want to build and say what you want.`)
  console.log(`To verify a page in a browser, the skill needs playwright and axe:`)
  console.log(`  npm i -D playwright @axe-core/playwright && npx playwright install chromium`)
  console.log(`Without them every check that renders withholds its verdict rather than passing.`)
}
