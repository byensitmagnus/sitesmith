#!/usr/bin/env node
/**
 * Words running into words, and everything that only looks like it. Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node skills/sitesmith-v3/scripts/test-collision.mjs
 *
 * The build that lost rendered pilot 02 shipped `Damgaard EstrikUdtørring og estrik, Lemvig`
 * as its masthead, on every page at every width. A flex row, no gap, and the whitespace that
 * would have separated the two runs in ordinary inline flow removed by the layout. The refusal
 * gate ran six rounds, from 51 defects to none, and never looked for it.
 *
 * The instruction for this node was to find out whether it can be detected at all before
 * building anything, and to stop rather than ship a noisy gate. So this fixture is mostly
 * cases that must **not** fire, and the history of the check is in the numbers:
 *
 *   the first rule — two text runs with no gap — found 41 hits over 28 real page renders,
 *   nearly all of them prose with an emphasis in the middle
 *
 *   requiring both sides to be phrases rather than tokens, and neither to be offering the
 *   whitespace itself, took it to 16
 *
 *   requiring the two to share a line, and to touch rather than merely start left of each
 *   other, took it to 9 — every one of them the real defect
 *
 * Measured across the fixture, both pilot 02 builds and eight benchmark sites at three widths:
 * 45 renders, 9 hits, 0 false. That is the evidence for reporting it. It is not yet the
 * evidence for refusing a release over it, so verify.mjs prints it and the gate does not stop
 * on it.
 */

import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const ROOT = resolve(fileURLToPath(new URL('../../..', import.meta.url)))
const FIXTURE = join(ROOT, 'docs/rebuild/s10/fixtures/scripts/collision')

const req = createRequire(join(process.env.SITESMITH_DEPS_DIR ?? join(ROOT, 'benchmarks/node_modules'), '..', 'package.json'))
const pw = await import(pathToFileURL(req.resolve('playwright')).href)
const chromium = pw.chromium ?? pw.default?.chromium
const { collidingText } = await import('./collision.mjs')

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' }
const serve = (root, port) => new Promise((ok) => {
  const s = createServer((r, res) => {
    try {
      let p = join(root, decodeURIComponent(new URL(r.url, 'http://x').pathname))
      if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html')
      res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' })
      res.end(readFileSync(p))
    } catch { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('not found') }
  })
  s.listen(port, '127.0.0.1', () => ok(s))
})

const fixtureServer = await serve(FIXTURE, 0)
const FIXTURE_BASE = `http://127.0.0.1:${fixtureServer.address().port}`

const browser = await chromium.launch()
console.log('\n  two phrases with nothing between them, and the many things that are not that\n')

try {
  for (const width of [375, 768, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await ctx.newPage()
    await page.goto(`${FIXTURE_BASE}/`, { waitUntil: 'networkidle' })
    const found = await page.evaluate(collidingText)
    const ids = found.map((f) => f.id ?? f.selector).sort()

    check(`${width}px: the wordmark running into its tagline is reported`,
      ids.includes('collide'), `reported: ${JSON.stringify(ids)}`)

    /* Everything else on the page must stay quiet. Each is a shape a real page uses. */
    for (const [id, what] of [
      ['separated', 'the same two runs with a gap'],
      ['tokens', 'a numeral and its unit, an ordinal, a compound name, a subscript'],
      ['iconed', 'an icon touching its label'],
      ['apart', 'siblings that are adjacent in the DOM and apart on the page'],
      ['decorated', 'a decorative box overlapping the words it sits behind'],
    ]) {
      check(`${width}px: ${what} is not reported`,
        !ids.includes(id), `reported: ${JSON.stringify(ids)}`)
    }

    check(`${width}px: nothing beyond the one real collision is reported`,
      found.length === 1, `reported ${found.length}: ${JSON.stringify(found.map((f) => f.reads))}`)
    await ctx.close()
  }

  /* The frozen evidence. If the check cannot find the defect in the build that shipped it,
     the fixture is a story about a defect rather than a reproduction of one. */
  const S = 'C:/Users/Usmo1/AppData/Local/Temp/claude/C--Users-Usmo1-Documents-sitesmith/a3462dea-cc9d-43d5-b52c-b0bdfd937431/scratchpad/lab/rendered-02/S'
  const frozen = join(ROOT, 'docs/lab/rendered-pilot-02-damgaard/builds/S/app/globals.css')
  if (existsSync(frozen)) {
    const css = readFileSync(frozen, 'utf8')
    const wordmark = css.match(/\.wordmark\s*\{[^}]*\}/)?.[0] ?? ''
    /* `inline-flex` in the shipped build, not `flex`. Both drop the whitespace between their
       children, which is the property that matters here. */
    check('the frozen losing build really did lay its masthead out with no gap',
      /display:\s*(inline-)?flex/.test(wordmark) && !/\bgap\s*:/.test(wordmark),
      wordmark.replace(/\s+/g, ' ').slice(0, 140) || 'no .wordmark rule found')
  }
  if (existsSync(join(S, 'package.json'))) {
    console.log('  --    the served frozen build is measured by hand, not here: it needs a production server')
  }
} finally {
  await browser.close()
  fixtureServer.close()
}

console.log(`\n  ${failed ? `${failed} failing` : 'a phrase running into a phrase is reported, and typesetting is left alone'}\n`)
process.exit(failed ? 1 : 0)
