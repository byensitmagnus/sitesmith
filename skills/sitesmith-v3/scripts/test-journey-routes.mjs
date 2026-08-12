#!/usr/bin/env node
/**
 * A page you can only reach by finishing the journey is still a page. Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node skills/sitesmith-v3/scripts/test-journey-routes.mjs
 *
 * Rendered pilot 02's losing build reported `verify.mjs` PASS with 0 accessibility
 * violations. Its receipt page carried six serious ones — `dlitem` and `listitem`, from an
 * `<li>` inside a `<dl>` — and the build's own notes say that exact nesting was fixed. It was,
 * on the entry. The receipt kept it, because the entry does not link to the receipt: the only
 * way there is to complete the booking.
 *
 * So nothing measured it. The measurement was not wrong; the coverage was.
 *
 * The invariant this file holds is deliberately not "crawl every href from the entry" — a page
 * nobody links to is exactly the page this is about. It is: every page the declared journey
 * can actually reach is a page the gate has looked at.
 *
 * The fixture is the same shape as the losing build and small enough to serve from a static
 * directory: an entry that links nowhere, a form that submits to a receipt, and the same
 * invalid nesting on that receipt. The journey spec was written the way a build writes one and
 * knows nothing about the recorder, which is the case that matters — the recorder had to work
 * on a spec that predates it.
 */

import { spawnSync, spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdtempSync, rmSync, mkdirSync, cpSync, writeFileSync, readdirSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const ROOT = resolve(fileURLToPath(new URL('../../..', import.meta.url)))
const SCRIPTS = join(ROOT, 'skills/sitesmith-v3/scripts')
const FIXTURE = join(ROOT, 'docs/rebuild/s10/fixtures/scripts/journey-routes')

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}

/* ── a static server for the fixture ─────────────────────────────────────── */

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' }
const site = join(FIXTURE, 'site')
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const file = join(site, path === '/' ? 'index.html' : path)
  if (!existsSync(file)) { res.writeHead(404, { 'content-type': 'text/html' }); res.end('<h1>404</h1>'); return }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
})
await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const BASE = `http://127.0.0.1:${server.address().port}`

/* The fixture server runs in this process, so anything that needs to talk to it must not
   block this event loop. `spawnSync` does, and the first version of this file used it: every
   child timed out against a server sitting right here, unable to answer. journey.mjs had the
   same bug for the same reason, one level down. */
const run = (args, opts) => new Promise((done) => {
  const child = spawn(process.execPath, args, opts)
  let out = ''
  child.stdout.on('data', (b) => { out += b })
  child.stderr.on('data', (b) => { out += b })
  const kill = setTimeout(() => child.kill('SIGKILL'), 180000)
  child.on('close', (status) => { clearTimeout(kill); done({ status, out }) })
})

console.log('\n  the journey reaches pages nothing links to, and the gate has to know\n')

/* ── the shape of the defect, before anything about coverage ─────────────── */

/* Proving the fixture is a real reproduction rather than a story about one. The entry links
   nowhere, the receipt holds the invalid nesting, and axe calls it serious. */
{
  const entry = readFileSync(join(site, 'index.html'), 'utf8')
  check('the entry links to no other page, so a crawl from it finds nothing',
    !/<a\s[^>]*href=["'](?!#)/i.test(entry))

  const req2 = createRequire(join(process.env.SITESMITH_DEPS_DIR ?? join(ROOT, 'benchmarks/node_modules'), '..', 'package.json'))
  const pw = await import(pathToFileURL(req2.resolve('playwright')).href)
  const chromium = pw.chromium ?? pw.default?.chromium
  const axeMod = await import(pathToFileURL(req2.resolve('@axe-core/playwright')).href)
  const AxeBuilder = axeMod.default?.default ?? axeMod.default ?? axeMod.AxeBuilder

  const browser = await chromium.launch()
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(`${BASE}/kvittering.html`, { waitUntil: 'networkidle' })
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  await browser.close()
  const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  check('the receipt really does carry serious accessibility violations',
    serious.length > 0 && serious.some((v) => v.id === 'dlitem' || v.id === 'listitem'),
    serious.map((v) => `${v.id} (${v.impact})`).join(', ') || 'none found')
}

/* ── the recorder works on a spec that knows nothing about it ────────────── */

const work = mkdtempSync(join(tmpdir(), 'jroutes-'))
mkdirSync(join(work, 'journeys'), { recursive: true })
cpSync(join(FIXTURE, 'journeys'), join(work, 'journeys'), { recursive: true })

{
  const r = await run([join(SCRIPTS, 'journey.mjs'), 'journeys', '--base', BASE], {
    cwd: work,
    env: { ...process.env, SITESMITH_DEPS_DIR: process.env.SITESMITH_DEPS_DIR ?? join(ROOT, 'benchmarks/node_modules') },
  })
  check('the journey passes against the fixture',
    r.status === 0,
    r.out.trim().split('\n').slice(-6).join('\n          '))

  const recorded = existsSync(join(work, '.sitesmith/journey-routes.json'))
    ? JSON.parse(readFileSync(join(work, '.sitesmith/journey-routes.json'), 'utf8'))
    : null
  check('it wrote down which pages it reached', recorded !== null && recorded.recorded === true,
    JSON.stringify(recorded))
  check('and the receipt is one of them, without the spec being asked to report it',
    (recorded?.routes ?? []).includes('/kvittering.html'),
    JSON.stringify(recorded?.routes ?? []))
  check('the entry is in there too, so the record is the whole path and not just the end',
    (recorded?.routes ?? []).includes('/'))
}

/* ── the gate refuses a build that verified only the entry ───────────────── */

const gateOn = (verified) => {
  const dir = mkdtempSync(join(tmpdir(), 'jgate-'))
  cpSync(join(ROOT, 'docs/rebuild/s10/fixtures/scripts/gate/pass'), dir, { recursive: true })
  mkdirSync(join(dir, 'journeys'), { recursive: true })
  cpSync(join(FIXTURE, 'journeys'), join(dir, 'journeys'), { recursive: true })
  mkdirSync(join(dir, '.sitesmith'), { recursive: true })
  cpSync(join(work, '.sitesmith/journey-routes.json'), join(dir, '.sitesmith/journey-routes.json'))
  if (verified) {
    writeFileSync(join(dir, '.sitesmith/verified-routes.json'),
      JSON.stringify({ origin: BASE, routes: verified }, null, 2) + '\n')
  }
  const r = spawnSync(process.execPath, [join(SCRIPTS, 'gate.mjs')], { cwd: dir, encoding: 'utf8' })
  const out = `${r.stdout}${r.stderr}`
  rmSync(dir, { recursive: true, force: true })
  return out
}

{
  const out = gateOn(['/'])
  check('a build that verified only the entry is refused for the page it never opened',
    /journeys\/unverified-route/.test(out) && /kvittering/.test(out),
    out.split('\n').filter((l) => /journeys\//.test(l)).slice(0, 3).join('\n          '))
}

{
  const out = gateOn(null)
  check('a build with no verify record at all is refused too',
    /journeys\/no-verify-record/.test(out),
    out.split('\n').filter((l) => /journeys\//.test(l)).slice(0, 2).join('\n          '))
}

{
  const out = gateOn(['/', '/kvittering.html'])
  check('and a build that verified both pages is not refused for coverage',
    !/journeys\/unverified-route|journeys\/no-verify-record/.test(out),
    out.split('\n').filter((l) => /journeys\//.test(l)).slice(0, 3).join('\n          '))
}

/* ── the record verify.mjs itself writes ─────────────────────────────────── */

{
  const dir = mkdtempSync(join(tmpdir(), 'jverify-'))
  const r = await run(
    [join(SCRIPTS, 'verify.mjs'), `${BASE}/kvittering.html`, '--out', join(dir, 'shots'), '--widths', '1440'],
    { cwd: dir,
      env: { ...process.env, SITESMITH_DEPS_DIR: process.env.SITESMITH_DEPS_DIR ?? join(ROOT, 'benchmarks/node_modules') } })
  const rec = existsSync(join(dir, '.sitesmith/verified-routes.json'))
    ? JSON.parse(readFileSync(join(dir, '.sitesmith/verified-routes.json'), 'utf8'))
    : null
  rmSync(dir, { recursive: true, force: true })
  check('verify.mjs writes down which page it measured',
    (rec?.routes ?? []).includes('/kvittering.html'),
    JSON.stringify(rec) + ` (verify exit ${r.status})`)
}

rmSync(work, { recursive: true, force: true })
server.close()

console.log(`\n  ${failed ? `${failed} failing` : 'the gate refuses a build whose journey reaches a page it never verified'}\n`)
process.exit(failed ? 1 : 0)
