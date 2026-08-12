#!/usr/bin/env node
/**
 * The same external checks on both finished sites, plus the purchase journey driven through
 * whatever controls each site actually has.
 *
 *   node check.mjs <base-url> <label>
 *
 * Two changes from pilot 01, both of them things pilot 01 got wrong.
 *
 * The clipping check now looks inside controls and in both axes, using the same measurement
 * the product itself now ships, because pilot 01's losing build was decided by a clipped year
 * input that nothing in the package could see.
 *
 * And the journey is no longer written off as NOT COMPARABLE. Pilot 01 refused to drive the
 * required states because the two sites reached them through different controls, which meant
 * the one thing the brief exists for went unmeasured. The goal is defined from the brief and
 * each site is driven through its own visible controls to reach it. Different selectors are
 * allowed; the same user goal is not negotiable.
 *
 * When a goal fails, the site's own error text is reported with it. A driver that fills a
 * field badly and a site that rejects a good answer both end on the form, and only the error
 * text tells them apart. The driver is fixed generically or not at all: never for one arm.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { FILL_IN_PAGE, SNAPSHOT_IN_PAGE, findBookingPath, crawl, PAST_DATE } from './driver.mjs'

const [BASE, LABEL] = [process.argv[2], process.argv[3]]
const WIDTHS = [375, 768, 1440]

const req = createRequire('C:/Users/Usmo1/Documents/sitesmith/benchmarks/package.json')
const pw = await import(pathToFileURL(req.resolve('playwright')).href)
const chromium = pw.chromium ?? pw.default?.chromium
const axeMod = await import(pathToFileURL(req.resolve('@axe-core/playwright')).href)
const AxeBuilder = axeMod.default?.default ?? axeMod.default ?? axeMod.AxeBuilder

/* The product's own clipping measurement, imported rather than copied, so this checker and
   the product cannot drift apart about what clipped means. */
const { clippedElements } = await import(pathToFileURL(
  'C:/Users/Usmo1/Documents/sitesmith/skills/sitesmith-v3/scripts/clipping.mjs').href)

/* ── the brief, as facts a site either states or does not ───────────────── */

const MUST_APPEAR = [
  ['the review price', /2[.\s]?400\s*kr/i],
  ['that the price excludes VAT', /ekskl\.?\s*moms/i],
  ['the 75 km limit', /75\s*km/i],
  ['the telephone number', /97\s*00\s*41\s*20/],
  ['the opening hours', /07[:.]00\s*[–-]\s*14[:.]00/],
  ['the case number', /DE-2026-0318/],
  ['the deduction threshold', /15[.\s]?000\s*kr/i],
  ['the booking window', /3\s*(til|-|–)\s*9\s*hverdage/i],
  ['that it is measured in a borehole', /borehul/i],
]

/* The brief's own never-claim list. Each is a claim the office cannot make, and each is also
   a phrase the site is likely to use in its denial, so the sentence around a hit decides. */
const MUST_NOT_APPEAR = [
  ['a duty line, emergency cover or weekend call-out', /døgnvagt|akutberedskab|weekendudkald|weekendvagt/i],
  ['working with or being approved by insurers', /(samarbejd\w*\s+med|godkendt\s+af)\s+[\wæøå]*forsikring|forsikringspartner/i],
  ['an authorisation, certification, trade approval or membership', /autorisation|autoriseret|certificer|branchegodkend|medlemskab|medlem\s+af/i],
  ['competence with mould', /skimmel\w*\s*(sanering|kompetence|behandl)/i],
  ['a guarantee', /\bgaranti/i],
  ['reviews, testimonials or stars', /anmeldelse|udtalelse|stjerner|trustpilot/i],
]
/* "stiftet 2016" is the one experience claim the brief allows, so it is not on this list. */
const NEGATED = /\b(ikke|ingen|aldrig|hverken|uden|nægter|kan ikke|må ikke|har ikke|giver ingen|tilbyder ikke|er ikke)\b/i
const DISCLAIM = /(må aldrig påstås|vi påstår ikke|hvad vi ikke|det vi ikke)/i

/* ── the journey, from the brief and not from either implementation ─────── */

const GOALS = {
  'empty-state-readable': 'before filling anything in, a visitor can read the price, the 75 km limit and the refusals',
  'refusal-postcode': "a postcode outside the area is refused on the postcode field, in the brief's own words, with the other answers kept",
  'refusal-sewage': "sewage in the construction is refused on that field, in the brief's own words, with the other answers kept",
  receipt: 'a complete booking produces the case number and the do-and-do-not list',
}

const OUT = { label: LABEL, base: BASE, widths: WIDTHS, checks: {}, journey: [] }

const browser = await chromium.launch()
const httpFailures = []; const consoleErrors = []; const overflow = []
const clipped = []; const axeViolations = []; const brokenLinks = []
let text = ''

/* ── the pages, and the form, found the same way on both sites ─────────── */

const seen = new Set(await crawl(browser, BASE))
const bookingPath = await findBookingPath(browser, BASE, seen)

const runCase = async (want) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + bookingPath, { waitUntil: 'networkidle' })
  const filled = await page.evaluate(FILL_IN_PAGE, want)
  const btn = await page.$('form button[type=submit], form input[type=submit], form button:not([type])')
  if (!btn) { await ctx.close(); return { filled, after: null, note: 'no submit control in the form' } }
  await btn.click().catch(() => {})
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(600)
  const after = await page.evaluate(SNAPSHOT_IN_PAGE)
  await ctx.close()
  return { filled, after, note: null }
}

const record = (id, verdict, why, evidence) => OUT.journey.push({ id, goal: GOALS[id], verdict, why, evidence })

if (!bookingPath) {
  for (const id of Object.keys(GOALS)) record(id, 'FAIL', 'no page on this site carries a form with controls')
} else {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + bookingPath, { waitUntil: 'networkidle' })
  const t = await page.evaluate(() => document.body.innerText)
  await ctx.close()
  const has = {
    price: /2[.\s]?400\s*kr/i.test(t),
    km: /75\s*km/i.test(t),
    refusals: /kloakvand|skimmel|nægter|tager (vi )?ikke|påtager/i.test(t),
  }
  record('empty-state-readable', has.price && has.km && has.refusals ? 'PASS' : 'FAIL',
    `price ${has.price}, 75 km ${has.km}, refusals ${has.refusals}`)

  const bad = await runCase({ postcode: '2200', sewage: 'nej', pastDate: PAST_DATE })
  const badOk = bad.after && /uden for de 75 km fra Lemvig/i.test(bad.after.text)
  record('refusal-postcode', badOk ? 'PASS' : 'FAIL',
    bad.after
      ? `the brief's wording ${badOk ? 'appeared' : 'did not appear'}; focus landed on ${bad.after.focused ?? 'nothing'}; ${bad.after.answers.length} of ${bad.filled} answers kept`
      : bad.note,
    bad.after?.problems)

  const sew = await runCase({ postcode: '7620', sewage: 'ja', pastDate: PAST_DATE })
  const sewOk = sew.after && /må vi ikke røre den/i.test(sew.after.text)
  record('refusal-sewage', sewOk ? 'PASS' : 'FAIL',
    sew.after
      ? `the brief's wording ${sewOk ? 'appeared' : 'did not appear'}; focus landed on ${sew.after.focused ?? 'nothing'}; ${sew.after.answers.length} of ${sew.filled} answers kept`
      : sew.note,
    sew.after?.problems)

  const good = await runCase({ postcode: '7620', sewage: 'nej', pastDate: PAST_DATE })
  const gotCase = good.after && /DE-2026-0318/.test(good.after.text)
  const gotList = good.after && /Indtil vi kommer/i.test(good.after.text)
  record('receipt', gotCase && gotList ? 'PASS' : 'FAIL',
    good.after
      ? `case number ${gotCase ? 'shown' : 'absent'}, the do-and-do-not list ${gotList ? 'shown' : 'absent'}, ended at ${good.after.url}`
      : good.note,
    good.after?.problems)

  /* A receipt nothing links to is still a page a real visitor reaches. Whatever the journey
     ended on gets the same static checks as everything the crawl found. */
  if (good.after?.url && !seen.has(good.after.url)) seen.add(good.after.url)
}

const pages = [...seen]

/* ── the static checks, on every page either route found ────────────────── */

for (const path of pages) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await ctx.newPage()
    const errs = []
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
    page.on('pageerror', (e) => errs.push(`uncaught: ${e.message}`))
    page.on('requestfailed', (rq) => { if (!/favicon/.test(rq.url())) httpFailures.push({ path, width, url: rq.url() }) })

    const resp = await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => null)
    if (!resp || resp.status() >= 400) { httpFailures.push({ path, width, status: resp?.status() ?? 'none' }); await ctx.close(); continue }

    const wide = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (wide > 1) overflow.push({ path, width, px: wide })

    for (const c of await page.evaluate(clippedElements)) clipped.push({ path, width, ...c })
    if (width === WIDTHS[0]) text += `\n${await page.evaluate(() => document.body.innerText)}`

    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    for (const v of axe.violations) axeViolations.push({ path, width, id: v.id, impact: v.impact, nodes: v.nodes.length })
    for (const e of errs) consoleErrors.push({ path, width, text: e.slice(0, 200) })
    await ctx.close()
  }

  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => {})
  for (const h of await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))) {
    if (!h || /^(#|mailto:|tel:|https?:)/.test(h)) continue
    const r = await page.request.get(new URL(h, BASE + path).href).catch(() => null)
    if (!r || r.status() >= 400) brokenLinks.push({ path, href: h, status: r?.status() ?? 'unreachable' })
  }
  await ctx.close()
}

await browser.close()

/* ── the brief's facts and the claims it forbids ────────────────────────── */

const stated = MUST_APPEAR.map(([name, re]) => ({ name, present: re.test(text) }))
const claimed = MUST_NOT_APPEAR.map(([name, re]) => {
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)
  let asserted = 0; let disclaimed = 0; const examples = []
  for (const m of text.matchAll(rx)) {
    const around = text.slice(Math.max(0, m.index - 400), m.index + 160)
    const near = text.slice(Math.max(0, m.index - 160), m.index + 160)
    if (DISCLAIM.test(around) || NEGATED.test(near)) disclaimed += 1
    else { asserted += 1; examples.push(near.replace(/\s+/g, ' ').trim().slice(0, 140)) }
  }
  return { name, asserted, disclaimed, examples: examples.slice(0, 2) }
})

OUT.checks = {
  pages,
  httpFailures: { count: httpFailures.length, detail: httpFailures.slice(0, 8) },
  brokenLinks: { count: brokenLinks.length, detail: brokenLinks.slice(0, 8) },
  consoleErrors: { count: consoleErrors.length, detail: consoleErrors.slice(0, 8) },
  horizontalOverflow: { count: overflow.length, detail: overflow.slice(0, 8) },
  clippedContent: { count: clipped.length, detail: clipped.slice(0, 8) },
  axe: { violations: axeViolations.length, byId: axeViolations.reduce((a, v) => ({ ...a, [v.id]: (a[v.id] ?? 0) + 1 }), {}), detail: axeViolations.slice(0, 6) },
  briefFactsStated: { of: stated.length, present: stated.filter((s) => s.present).length, missing: stated.filter((s) => !s.present).map((s) => s.name) },
  forbiddenClaims: { asserted: claimed.reduce((n, c) => n + c.asserted, 0), disclaimed: claimed.reduce((n, c) => n + c.disclaimed, 0), detail: claimed },
  bookingPath,
}

mkdirSync('checks', { recursive: true })
writeFileSync(`checks/${LABEL}.json`, JSON.stringify(OUT, null, 2) + '\n', 'utf8')

const c = OUT.checks
console.log(`\n  ${LABEL}: ${pages.length} page(s) x ${WIDTHS.length} width(s)  ${pages.join(' ')}\n`)
console.log(`  http failures       ${c.httpFailures.count}`)
console.log(`  broken links        ${c.brokenLinks.count}`)
console.log(`  console errors      ${c.consoleErrors.count}`)
console.log(`  horizontal overflow ${c.horizontalOverflow.count}`)
console.log(`  clipped content     ${c.clippedContent.count}${c.clippedContent.count ? `  ${JSON.stringify(c.clippedContent.detail.slice(0, 3))}` : ''}`)
console.log(`  axe violations      ${c.axe.violations}${c.axe.violations ? `  ${JSON.stringify(c.axe.byId)}` : ''}`)
console.log(`  brief facts stated  ${c.briefFactsStated.present} of ${c.briefFactsStated.of}${c.briefFactsStated.missing.length ? `  missing: ${c.briefFactsStated.missing.join(', ')}` : ''}`)
console.log(`  forbidden claims    ${c.forbiddenClaims.asserted} asserted, ${c.forbiddenClaims.disclaimed} as disclaimers`)
console.log(`\n  the journey, driven through this site's own controls (form at ${c.bookingPath}):`)
for (const j of OUT.journey) {
  console.log(`    ${j.verdict.padEnd(5)} ${j.id.padEnd(22)} ${j.why}`)
  if (j.verdict === 'FAIL' && j.evidence?.length) console.log(`          the site said: ${j.evidence.slice(0, 3).join(' | ').slice(0, 260)}`)
}
console.log('')
