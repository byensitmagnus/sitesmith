/**
 * A journey that reaches a page nothing links to.
 *
 * Written the way a build's own spec is written — it reads BASE and drives the site through
 * its visible controls — and deliberately not told that anything is recording it. That is the
 * point of the fixture: the route recorder has to work on a spec that predates it.
 */

import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'

const BASE = process.env.BASE ?? 'http://127.0.0.1:5173'
const deps = process.env.SITESMITH_DEPS_DIR
const req = createRequire(deps ? join(deps, '..', 'package.json') : import.meta.url)
const pw = await import(pathToFileURL(req.resolve('playwright')).href)
const chromium = pw.chromium ?? pw.default?.chromium

const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.fill('#navn', 'Test Testesen')
await page.fill('#telefon', '20202020')
await Promise.all([page.waitForURL('**/kvittering.html*'), page.click('button[type=submit]')])

const text = await page.evaluate(() => document.body.innerText)
await browser.close()

if (!/Sagsnummer/.test(text)) {
  console.error('the receipt did not show a case number')
  process.exit(1)
}
