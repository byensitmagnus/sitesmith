#!/usr/bin/env node
/**
 * The review packet: the same views of both sites, in the same format, with nothing on them
 * that says which tool made them.
 *
 *   node packet.mjs <S base url> <P base url>
 *
 * Pilot 01 photographed four pages and then wrote the interaction states off as NOT
 * COMPARABLE, because the two sites reached them through different controls. That removed the
 * one journey the brief exists for from both the measurement and the pictures, and it removed
 * it in the pilot SiteSmith lost. It is not repeated here.
 *
 * The states are named from the brief — the form before anything is filled in, the two
 * refusals, the receipt — and reached with the shared driver, which fills every control by
 * what it is rather than by what either site called it. Same user goal, different selectors
 * allowed. A state a site never reaches is captured as the page it stopped on and reported as
 * a failure, not omitted.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
import { FILL_IN_PAGE, findBookingPath, crawl, PAST_DATE } from './driver.mjs'

const req = createRequire('C:/Users/Usmo1/Documents/sitesmith/benchmarks/package.json')
const pw = await import(pathToFileURL(req.resolve('playwright')).href)
const chromium = pw.chromium ?? pw.default?.chromium

const ARMS = [
  { key: 'S', base: process.argv[2] },
  { key: 'P', base: process.argv[3] },
]

/* Mobile and desktop for everything, because a site that only works at one of them is worth
   seeing at both. Tablet for the landing page, where the layout decision is most visible.
   Every shot is full page: a reader scrolls, so the judge scrolls. */
const WIDTHS_ALL = [375, 1440]
const WIDTHS_LANDING = [375, 768, 1440]

const shots = {}
const browser = await chromium.launch()

rmSync('packet', { recursive: true, force: true })
mkdirSync('packet', { recursive: true })

const shoot = async (base, path, name, widths, prepare) => {
  const done = []
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await ctx.newPage()
    await page.goto(base + path, { waitUntil: 'networkidle' }).catch(() => {})
    if (prepare) await prepare(page)
    await page.waitForTimeout(300)
    await page.screenshot({ path: `packet/${name}-${width}.png`, fullPage: true })
    await ctx.close()
    done.push(width)
  }
  return done
}

for (const arm of ARMS) {
  const paths = await crawl(browser, arm.base)
  const booking = await findBookingPath(browser, arm.base, paths)
  const rest = paths.filter((p) => p !== '/' && p !== booking)
  const views = []

  views.push({ id: 'v1-landing', what: 'the page a visitor arrives on', widths: WIDTHS_LANDING, path: '/' })
  if (booking) views.push({ id: 'v2-booking-empty', what: 'the booking form before anything is filled in', widths: WIDTHS_ALL, path: booking })
  rest.forEach((p, i) => views.push({ id: `v3-other-${'abcdefgh'[i]}`, what: 'another page the site links to', widths: WIDTHS_ALL, path: p }))

  shots[arm.key] = []
  for (const v of views) {
    const w = await shoot(arm.base, v.path, `${arm.key}-${v.id}`, v.widths)
    shots[arm.key].push({ ...v, widths: w })
  }

  /* The three states behind the submit button. Same driver on both sites. */
  if (booking) {
    const submit = (want) => async (page) => {
      await page.evaluate(FILL_IN_PAGE, { ...want, pastDate: PAST_DATE })
      const btn = await page.$('form button[type=submit], form input[type=submit], form button:not([type])')
      if (btn) {
        await btn.click().catch(() => {})
        await page.waitForLoadState('networkidle').catch(() => {})
        await page.waitForTimeout(700)
      }
    }
    const states = [
      { id: 'v4-refused-postcode', what: 'what the site shows when the address is outside the area it serves', want: { postcode: '2200', sewage: 'nej' } },
      { id: 'v5-refused-sewage', what: 'what the site shows when the answer is one the office refuses the job for', want: { postcode: '7620', sewage: 'ja' } },
      { id: 'v6-booked', what: 'what the site shows once a booking goes through', want: { postcode: '7620', sewage: 'nej' } },
    ]
    for (const s of states) {
      const w = await shoot(arm.base, booking, `${arm.key}-${s.id}`, WIDTHS_ALL, submit(s.want))
      shots[arm.key].push({ id: s.id, what: s.what, widths: w, path: booking })
    }
  }
}

await browser.close()

/* ── the sealed order ───────────────────────────────────────────────────── */

/* Computed from the screenshots themselves, so it can be recomputed later and could not have
   been chosen to suit a result. */
const digest = createHash('sha256')
  .update(ARMS.map((a) => createHash('sha256').update(readFileSync(`packet/${a.key}-v1-landing-1440.png`)).digest('hex')).join(':'), 'utf8')
  .digest()
const order = digest.readUInt32BE(0) % 2 === 0 ? ['S', 'P'] : ['P', 'S']

rmSync('judge', { recursive: true, force: true })
mkdirSync('judge/packet', { recursive: true })
const manifest = []
order.forEach((armKey, i) => {
  const label = `candidate-${i + 1}`
  for (const v of shots[armKey]) {
    for (const width of v.widths) {
      const from = `packet/${armKey}-${v.id}-${width}.png`
      if (!existsSync(from)) continue
      const to = `judge/packet/${label}-${v.id}-${width}.png`
      writeFileSync(to, readFileSync(from))
      manifest.push({ label, view: v.id, what: v.what, width, sha256: createHash('sha256').update(readFileSync(to)).digest('hex') })
    }
  }
})

writeFileSync('SEALED-MAPPING.json', JSON.stringify({
  sealedBefore: 'the judge call',
  rule: 'sha256 of the two landing screenshots at 1440 joined by a colon, first four bytes, even keeps S first',
  candidateToArm: Object.fromEntries(order.map((a, i) => [`candidate-${i + 1}`, a])),
  armMeaning: { S: 'built with SiteSmith', P: 'built with plain Sonnet, no tooling' },
}, null, 2) + '\n', 'utf8')

/* ── what the judge is told about the technical checks, in neutral words ── */

const read = (k) => JSON.parse(readFileSync(`checks/${k}.json`, 'utf8'))

const neutral = (armKey) => {
  const r = read(armKey)
  const c = r.checks
  const lines = [
    `- pages the site links to: ${c.pages.length}`,
    `- pages that failed to load: ${c.httpFailures.count}`,
    `- links that lead nowhere: ${c.brokenLinks.count}`,
    `- console errors: ${c.consoleErrors.count}`,
    `- horizontal overflow at 375, 768 or 1440: ${c.horizontalOverflow.count}`,
    `- text or controls clipped by their own container: ${c.clippedContent.count}`,
    `- accessibility violations, axe, WCAG 2.1 AA, every page at all three widths: ${c.axe.violations}`,
    `- facts the brief supplies that the site states: ${c.briefFactsStated.present} of ${c.briefFactsStated.of}`,
    `- claims the brief forbids, asserted: ${c.forbiddenClaims.asserted}`,
    `- the same claims stated as disclaimers, which the brief asks for: ${c.forbiddenClaims.disclaimed}`,
    '',
    'The one journey the brief exists for, driven through this site\'s own controls:',
    ...r.journey.map((j) => `- ${j.verdict}: ${j.goal}`),
  ]
  return lines.join('\n')
}

const sheet = `# What was measured on both sites, by the same external tools

Neither site's own tooling produced any of this. Both were served as production builds and
driven by identical code: every page crawled, every internal link followed, every page
rendered at 375, 768 and 1440 pixels, axe run against WCAG 2.1 AA on each page at each width.

The journey was defined from the brief and then driven through whatever controls each site
actually built. Different controls are allowed; the goal is the same on both.

## Candidate 1

${neutral(order[0])}

## Candidate 2

${neutral(order[1])}
`

writeFileSync('judge/CHECKS.md', sheet, 'utf8')
writeFileSync('PACKET-MANIFEST.json', JSON.stringify({ widths: { landing: WIDTHS_LANDING, rest: WIDTHS_ALL }, shots, manifest }, null, 2) + '\n', 'utf8')

console.log(`\n  ${manifest.length} screenshots for the judge`)
for (const a of ARMS) console.log(`  ${a.key}: ${shots[a.key].length} views, ${shots[a.key].reduce((n, v) => n + v.widths.length, 0)} shots`)
console.log(`  order sealed in SEALED-MAPPING.json, away from the packet\n`)
