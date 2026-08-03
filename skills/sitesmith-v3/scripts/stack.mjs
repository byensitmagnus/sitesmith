#!/usr/bin/env node
// Names the one stack adapter a run is allowed to open, or refuses to name any.
//
// Called from run.md step 3, before a line of code is written. Its whole job is to stop
// the model assuming a stack "from the brief's wording or from what is usual for the
// category". So it reads what is on disk and nothing else, and when the disk does not
// answer the question it says so and exits non-zero, because run.md section 12 already
// documents what to do with a refusal and a confident wrong adapter would send the whole
// build down the wrong file.
//
//   node scripts/stack.mjs detect [project] [--json] [--write] [--stacks <dir>]
//
// Exit codes, in the shape tools/context-budget.mjs already uses:
//   0  one stack detected and its adapter file exists
//   1  refusal: nothing detectable, two primaries at once, or a framework with no adapter
//   2  the tool could not run its check: bad usage, unreadable package.json, or an
//      adapter named but absent from the package
//
// Exit 2 is deliberately not exit 1. A missing adapter is a defect in this package, not
// in the project being inspected, and the two need different people to fix them. It is
// also never a pass: naming stacks/nextjs.md when that file is not there would send the
// model to open nothing and call it read.
//
// This script reports. It does not choose colours, type, layout or direction, and it
// must never grow a flag that does.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url))
const SKILL_ROOT = resolve(SCRIPT_DIR, '..')
const DEFAULT_STACKS = join(SKILL_ROOT, 'stacks')

// Next.js and Astro each own their whole build. React underneath one of them is an
// implementation detail of that build, never a stack of its own. This is the rule the
// v2.3 router encoded and the one people get wrong by hand, so it is the first thing
// resolved and the reason `react` is not in this list.
const PRIMARY = [
  { stack: 'nextjs', deps: ['next'], configs: [/^next\.config\.(js|mjs|cjs|ts)$/] },
  { stack: 'astro', deps: ['astro'], configs: [/^astro\.config\.(js|mjs|cjs|ts)$/] },
]

// A vite config alone proves nothing about the view layer, so the dependency is required
// and the config only ever appears as supporting evidence.
const REACT = { stack: 'react', deps: ['react'], configs: [/^vite\.config\.(js|mjs|cjs|ts)$/] }

// Shopify is the first stack here that no package.json can prove. Liquid is compiled by
// the platform, so a theme's evidence is the directory shape Shopify itself requires and
// the files its CLI writes; the manifest, when there is one at all, describes tooling
// around the theme rather than the theme. That is why this candidate is checked as paths
// instead of going through matched(), which only ever sees deps and root files.
const SHOPIFY = {
  stack: 'shopify',
  // Any one of these names a theme on its own: the layout Shopify requires, the settings
  // file the customiser reads, and the two files the CLI writes beside them.
  files: ['layout/theme.liquid', 'config/settings_schema.json', 'shopify.theme.toml', '.shopifyignore'],
  // Or the whole shape, for a theme handed over without its config. All three, never one:
  // `templates/` alone belongs to half the ecosystems on disk, and `assets/` belongs to
  // nearly all of them, which is why `assets/` is not evidence here at any count.
  dirs: ['sections', 'templates', 'snippets'],
}

// Frameworks this package can recognise and has no adapter for. Without this list they
// fall through to "nothing detected", which reads as an empty project and invites the
// plain-HTML degraded path on top of a Nuxt app. Recognised and unsupported is a
// different sentence from unrecognised, and the run needs to hear the difference.
const NO_ADAPTER = [
  { name: 'Nuxt', deps: ['nuxt'], configs: [/^nuxt\.config\.(js|mjs|cjs|ts)$/] },
  { name: 'SvelteKit', deps: ['@sveltejs/kit'], configs: [/^svelte\.config\.(js|mjs|cjs|ts)$/] },
  { name: 'Svelte', deps: ['svelte'], configs: [] },
  { name: 'Vue', deps: ['vue'], configs: [] },
  { name: 'Angular', deps: ['@angular/core'], configs: [/^angular\.json$/] },
  { name: 'Remix', deps: ['@remix-run/react'], configs: [/^remix\.config\.(js|mjs|cjs|ts)$/] },
  { name: 'Gatsby', deps: ['gatsby'], configs: [/^gatsby-config\.(js|mjs|cjs|ts)$/] },
  { name: 'SolidJS', deps: ['solid-js'], configs: [] },
  { name: 'Qwik', deps: ['@builder.io/qwik'], configs: [] },
  { name: 'Eleventy', deps: ['@11ty/eleventy'], configs: [/^\.eleventy\.(js|cjs)$/, /^eleventy\.config\.(js|mjs|cjs)$/] },
  { name: 'Preact', deps: ['preact'], configs: [] },
]

function usage(message) {
  console.error(`stack.mjs: ${message}`)
  console.error('usage: node scripts/stack.mjs detect [project] [--json] [--write] [--stacks <dir>]')
  process.exit(2)
}

function refuse(reason, detail = []) {
  console.error(`stack.mjs: no adapter named. ${reason}`)
  for (const line of detail) console.error(`  ${line}`)
  console.error('  run.md section 12 governs what happens next. Read it rather than picking a stack.')
  process.exit(1)
}

// Flags with values have to be parsed before the positional, or `--stacks ./x detect`
// silently takes ./x as the project directory and inspects the adapter set instead.
const argv = process.argv.slice(2)
const command = argv[0]
let stacksArg = null
let projectArg = null
let asJson = false
let doWrite = false
for (let i = 1; i < argv.length; i++) {
  const token = argv[i]
  if (token === '--stacks') {
    stacksArg = argv[++i]
    if (!stacksArg) usage('--stacks needs a directory')
  } else if (token === '--json') asJson = true
  else if (token === '--write') doWrite = true
  else if (token.startsWith('--')) usage(`unknown flag ${token}`)
  else if (projectArg === null) projectArg = token
  else usage('more than one project directory given')
}
if (command !== 'detect') usage(command ? `unknown command ${command}` : 'no command given')

const project = resolve(projectArg ?? '.')
if (!existsSync(project)) usage(`project directory does not exist: ${project}`)

// A non-default adapter root is announced in the output. The test runner uses it to pin
// the precedence rule against a complete adapter set while the shipped set is still
// being filled in, and a reader of a report must be able to see that that happened.
const stacksRoot = stacksArg ? resolve(stacksArg) : DEFAULT_STACKS
const stacksIsDefault = stacksRoot === DEFAULT_STACKS
if (!existsSync(stacksRoot)) usage(`adapter directory does not exist: ${stacksRoot}`)

const evidence = []

// package.json first. A manifest that will not parse is the one input we cannot silently
// route around: without it we cannot tell a React app from a folder of HTML, and
// guessing from the directory listing alone would produce a confident wrong answer from
// a project that is merely mid-edit.
let deps = new Map()
let manifestPresent = false
const manifestPath = join(project, 'package.json')
if (existsSync(manifestPath)) {
  manifestPresent = true
  let parsed
  try {
    parsed = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch (error) {
    console.error(`stack.mjs: cannot parse ${manifestPath}: ${error.message}`)
    console.error('  Verdict withheld. This is not "no stack", it is an unread input.')
    process.exit(2)
  }
  deps = new Map(Object.entries({ ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) }))
}

let entries = []
try {
  entries = readdirSync(project, { withFileTypes: true })
} catch (error) {
  console.error(`stack.mjs: cannot list ${project}: ${error.message}`)
  process.exit(2)
}
const rootFiles = entries.filter((e) => e.isFile()).map((e) => e.name)
const rootDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)

const depHit = (names) => names.find((name) => deps.has(name)) ?? null
const configHit = (patterns) => rootFiles.find((file) => patterns.some((p) => p.test(file))) ?? null

function matched(candidate) {
  const dep = depHit(candidate.deps)
  const config = configHit(candidate.configs)
  if (!dep && !config) return null
  const found = []
  if (dep) found.push(`package.json declares ${dep}@${deps.get(dep)}`)
  if (config) found.push(`${config} is present at the project root`)
  return found
}

function matchedShopify() {
  const found = []
  for (const rel of SHOPIFY.files) {
    if (existsSync(join(project, rel))) found.push(`${rel} is present`)
  }
  if (SHOPIFY.dirs.every((dir) => rootDirs.includes(dir))) {
    found.push(`${SHOPIFY.dirs.map((d) => `${d}/`).join(', ')} are all present at the project root`)
  }
  return found.length ? found : null
}

const primaries = PRIMARY.map((c) => ({ ...c, found: matched(c) })).filter((c) => c.found)
if (primaries.length > 1) {
  refuse(
    `two primary frameworks are present at once: ${primaries.map((c) => c.stack).join(' and ')}.`,
    primaries.flatMap((c) => c.found),
  )
}

let stack = null
if (primaries.length === 1) {
  stack = primaries[0].stack
  evidence.push(...primaries[0].found)
  // Written down rather than left implicit, because this is the line a hand detection
  // gets wrong: React is here, and it does not win.
  if (deps.has('react')) {
    evidence.push(`react@${deps.get('react')} is present and does not govern; ${stack} owns the build`)
  }
} else {
  const unsupported = NO_ADAPTER.map((c) => ({ ...c, found: matched(c) })).filter((c) => c.found)
  if (unsupported.length) {
    refuse(
      `recognised ${unsupported.map((c) => c.name).join(' and ')}, and this package has no adapter for that.`,
      unsupported.flatMap((c) => c.found),
    )
  }

  // Before react, because a theme that also builds a script bundle is still a theme: the
  // Liquid is what Shopify renders, and a bundler in devDependencies is how one asset in
  // it gets built.
  const shopify = matchedShopify()
  if (shopify) {
    stack = 'shopify'
    evidence.push(...shopify)
    if (deps.size) {
      evidence.push(`package.json declares ${deps.size} dependencies and does not govern; Shopify compiles the theme`)
    }
  } else {
    const react = matched(REACT)
    if (react && deps.has('react')) {
      stack = 'react'
      evidence.push(...react)
    }
  }
}

if (!stack) {
  // The static path needs positive evidence, not the absence of everything else. An
  // index.html sitting next to dependencies we do not recognise is more likely a
  // framework we have not listed than a hand-written page, and calling it static would
  // be exactly the confident wrong answer this script exists to avoid.
  const html = rootFiles.filter((f) => f.toLowerCase().endsWith('.html'))
  const indexHtml = html.find((f) => f.toLowerCase() === 'index.html')
  if (indexHtml && (!manifestPresent || deps.size === 0)) {
    stack = 'static'
    evidence.push(`${indexHtml} is present at the project root`)
    evidence.push(manifestPresent ? 'package.json declares no dependencies' : 'no package.json')
  } else if (indexHtml && deps.size) {
    refuse('found index.html alongside dependencies this script does not recognise, so it cannot tell whether they build the pages.', [
      `unrecognised: ${[...deps.keys()].sort().join(', ')}`,
    ])
  } else {
    refuse('nothing on disk names a stack.', [
      manifestPresent
        ? `package.json declares ${deps.size} dependencies, none of them a framework this script knows`
        : 'no package.json',
      `no framework config file and no index.html among ${rootFiles.length} files at the project root`,
    ])
  }
}

const adapterFile = join(stacksRoot, `${stack}.md`)
const adapterLabel = stacksIsDefault
  ? `stacks/${stack}.md`
  : relative(process.cwd(), adapterFile).replace(/\\/g, '/')

if (!existsSync(adapterFile)) {
  // Same rule as context-budget.mjs: a declared file that is not there is fatal, never a
  // quiet shrink. Detection succeeded and the package still cannot serve it.
  console.error(`stack.mjs: detected ${stack}, and its adapter is missing: ${adapterLabel}`)
  for (const line of evidence) console.error(`  evidence: ${line}`)
  console.error('  Verdict withheld. Do not substitute another adapter.')
  process.exit(2)
}

const result = {
  project,
  stack,
  adapter: adapterLabel,
  adapterRoot: stacksIsDefault ? 'package default' : stacksRoot,
  evidence,
}

if (doWrite) {
  const outDir = join(project, '.sitesmith')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(
    join(outDir, 'STACK.md'),
    [
      '---',
      `stack: ${result.stack}`,
      `adapter: ${result.adapter}`,
      'ai_generated: "(C)"',
      '---',
      '',
      '# Detected stack',
      '',
      ...evidence.map((item) => `- ${item}`),
      '',
      `Open only \`${result.adapter}\` during implementation.`,
      '',
    ].join('\n'),
  )
}

if (asJson) {
  console.log(JSON.stringify(result, null, 2))
} else {
  console.log(`stack: ${result.stack}`)
  console.log(`adapter: ${result.adapter}`)
  if (!stacksIsDefault) console.log(`adapter root: ${stacksRoot} (not the package default)`)
  for (const item of evidence) console.log(`evidence: ${item}`)
}
