#!/usr/bin/env node
/**
 * Content clipped inside a control is content the reader cannot read. Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node scripts/test-clipping.mjs
 *
 * A build shipped with its year inputs 9px too narrow: `width: 7ch` plus `0.6em` of padding
 * on each side plus the browser's own spinner chrome, holding a four-digit year. `1958` and
 * `2025` rendered as `195` and `202`, on twenty-four pages, at every width, on a site whose
 * whole premise was getting years exactly right. Everything in this package passed it. axe
 * passed it in both colour schemes, the contract's nine colour pairs passed, the gate came
 * down to a manifest technicality.
 *
 * The clipping measurement that exists looked at eight tag names, none of them a form control,
 * and compared `scrollHeight` against `clientHeight` only. So it could not see a value cut off
 * sideways inside the one control the page's journey ran through.
 *
 * This file is the fixture that has to fail before that is fixed, and the guard against the
 * obvious overcorrection: a checker that calls every scrolling region a defect is worse than
 * one that misses this, because it would refuse builds that are working correctly.
 */

import { spawnSync } from 'node:child_process'
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const HERE = dirname(fileURLToPath(import.meta.url))
const FIXTURE = join(HERE, '../../../docs/rebuild/s10/fixtures/scripts/clipping')
const PORT = 4611

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}

const resolvers = [
  createRequire(join(process.cwd(), 'package.json')),
  ...(process.env.SITESMITH_DEPS_DIR ? [createRequire(join(process.env.SITESMITH_DEPS_DIR, '..', 'package.json'))] : []),
]
let chromium = null
for (const r of resolvers) {
  try { const pw = await import(pathToFileURL(r.resolve('playwright')).href); chromium = pw.chromium ?? pw.default?.chromium; break } catch { /* next */ }
}
if (!chromium) {
  console.log('\n  playwright is not resolvable here, so nothing was measured and nothing is claimed.')
  console.log('  set SITESMITH_DEPS_DIR to the directory that has it.\n')
  process.exit(3)
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' }
const server = createServer((r, res) => {
  try {
    let p = join(FIXTURE, decodeURIComponent(new URL(r.url, 'http://x').pathname))
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html')
    res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'text/plain' })
    res.end(readFileSync(p))
  } catch { res.writeHead(404); res.end('not found') }
})
await new Promise((r) => server.listen(PORT, r))

/* The measurement under test, imported from the engine so the fixture exercises the shipped
   code rather than a copy of it. */
const { clippedElements } = await import('./clipping.mjs')

const browser = await chromium.launch()
console.log('\n  clipped content, in both axes and inside controls\n')

try {
  for (const width of [375, 768, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await ctx.newPage()
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
    const found = await page.evaluate(clippedElements)
    const ids = found.map((f) => f.id).sort()

    const MUST_FAIL = ['clipped-h', 'clipped-v']
    const MUST_PASS = ['fits', 'intentional', 'notes', 'hidden', 'offscreen']
    /* Not in either list, and the fixture says why: a select reports scrollWidth equal to
       clientWidth however long its options are, so there is nothing to detect without
       measuring option text in a canvas. Recorded rather than quietly dropped. */
    const NOT_DETECTABLE = ['clipped-select']

    for (const id of MUST_FAIL) {
      check(`${width}px: ${id} is reported clipped`, ids.includes(id),
        `reported: ${JSON.stringify(ids)}`)
    }
    for (const id of MUST_PASS) {
      check(`${width}px: ${id} is not reported`, !ids.includes(id),
        `${id} was called a defect; reported: ${JSON.stringify(ids)}`)
    }
    await ctx.close()
  }

  /* The frozen evidence. The build that lost the rendered pilot is kept exactly as it was
     delivered, and the improved check has to find the defect in it. If it cannot, the fix is
     for the fixture rather than for the product. */
  const HESGIN = 'C:/Users/Usmo1/AppData/Local/Temp/claude/C--Users-Usmo1-Documents-sitesmith/a3462dea-cc9d-43d5-b52c-b0bdfd937431/scratchpad/lab/rendered-01/S/site'
  if (existsSync(join(HESGIN, 'plots/07.html'))) {
    const s2 = createServer((r, res) => {
      try {
        let p = join(HESGIN, decodeURIComponent(new URL(r.url, 'http://x').pathname))
        if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html')
        res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'text/plain' })
        res.end(readFileSync(p))
      } catch { res.writeHead(404); res.end('not found') }
    })
    await new Promise((r) => s2.listen(PORT + 1, r))
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    await page.goto(`http://127.0.0.1:${PORT + 1}/plots/07.html`, { waitUntil: 'networkidle' })
    const found = await page.evaluate(clippedElements)
    check('the frozen build that lost the pilot is now reported clipped',
      found.some((f) => /^(from|to)-07$/.test(f.id)),
      `reported: ${JSON.stringify(found.map((f) => f.id))}`)
    await ctx.close()
    s2.close()
  } else {
    console.log('  --    the frozen Hesgin build is not on this machine, so that case did not run')
  }
} finally {
  await browser.close()
  server.close()
}

console.log(`\n  ${failed ? `${failed} failing` : 'clipping is measured in both axes, inside controls, and scroll regions are left alone'}\n`)
process.exit(failed ? 1 : 0)
