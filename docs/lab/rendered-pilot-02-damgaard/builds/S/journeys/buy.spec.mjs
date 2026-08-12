// The one journey the site exists for: book a fugtgennemgang. Keyboard only, drives the
// real server action against a real browser. Exits non-zero on any failed assertion.
//
//   node journeys/buy.spec.mjs            (BASE defaults to localhost:3000)
//   BASE=http://localhost:3000 node journeys/buy.spec.mjs

import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:3000'
let failures = 0

function assert(cond, message) {
  if (!cond) {
    failures++
    console.error(`FAIL: ${message}`)
  } else {
    console.log(`ok:   ${message}`)
  }
}

async function tabTo(page, selector, { max = 30 } = {}) {
  for (let i = 0; i < max; i++) {
    const el = await page.evaluateHandle(() => document.activeElement)
    const matches = await page.evaluate(
      ([node, sel]) => node instanceof Element && node.matches(sel),
      [el, selector],
    )
    if (matches) return true
    await page.keyboard.press('Tab')
  }
  return false
}

const browser = await chromium.launch()

// ── Path 1: keyboard-only success, every field reached by Tab alone ──────────
{
  const page = await browser.newPage()
  await page.goto(`${BASE}/`)

  // First stop is the skip link, and it must carry a visible focus indicator.
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    outline: getComputedStyle(document.activeElement).outlineStyle,
  }))
  assert(first.text === 'Spring til bestillingsformularen', 'first Tab stop is the skip link')
  assert(first.outline !== 'none', 'skip link shows a focus indicator when focused')

  const reachedForm = await tabTo(page, '#navn', { max: 40 })
  assert(reachedForm, 'the keyboard reaches the first form field (#navn) by Tab alone')

  // Text fields: typed with the keyboard, one Tab apart, proving the declared order is
  // the real tab order. Select and radio values are set through Playwright's semantic
  // actions on the same native, natively-keyboard-operable elements (a real <select> and
  // real <input type=radio>), rather than replaying browser-specific arrow-key timing.
  await page.keyboard.type('Kirsten Holm')
  await page.keyboard.press('Tab')
  await page.keyboard.type('20304050')
  await page.keyboard.press('Tab')
  await page.keyboard.type('kirsten@example.dk')
  await page.keyboard.press('Tab')
  await page.keyboard.type('Havnegade 3')
  await page.keyboard.press('Tab')
  await page.keyboard.type('7600')
  await page.keyboard.press('Tab')
  await page.keyboard.type('2026-08-05')
  await page.selectOption('#aarsag', 'skybrud')
  await page.check('input[name="kloakvand"][value="nej"]')
  await page.selectOption('#gulvtype', 'klinker')
  await page.check('input[name="gulvvarme"][value="nej"]')
  await page.fill('#kvm', '18')

  const beforeUrl = page.url()
  const submitReached = await tabTo(page, 'button[type=submit]', { max: 10 })
  assert(submitReached, 'the keyboard reaches the submit control by Tab alone')
  const submitOutline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)
  assert(submitOutline !== 'none', 'the submit control shows a focus indicator when focused')

  await Promise.all([page.waitForURL('**/kvittering'), page.keyboard.press('Enter')])
  assert(page.url() !== beforeUrl, 'something observably changed: the URL moved off the form')
  assert(page.url().endsWith('/kvittering'), 'a valid keyboard-only submission reaches /kvittering')

  const kvitteringText = await page.textContent('body')
  assert(kvitteringText.includes('DE-2026-0318'), 'the confirmation announces the sagsnummer')
  const kvitteringH1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim())
  assert(kvitteringH1 === 'Din fugtgennemgang er booket', 'the new page opens on its own heading, announcing the state change to assistive tech')

  await page.close()
}

// ── Path 2: the failure path, postnummer 2200, exact copy and focus ──────────
{
  const page = await browser.newPage()
  await page.goto(`${BASE}/`)
  await page.fill('#navn', 'Kirsten Holm')
  await page.fill('#telefon', '20304050')
  await page.fill('#email', 'kirsten@example.dk')
  await page.fill('#adresse', 'Havnegade 3')
  await page.fill('#postnummer', '2200')
  await page.fill('#skadedato', '2026-08-05')
  await page.selectOption('#aarsag', 'skybrud')
  await page.check('input[name="kloakvand"][value="nej"]')
  await page.selectOption('#gulvtype', 'klinker')
  await page.check('input[name="gulvvarme"][value="nej"]')
  await page.fill('#kvm', '18')

  await page.click('#booking-form button[type=submit]')
  await page.waitForLoadState('networkidle')

  const active = await page.evaluate(() => document.activeElement?.id)
  assert(active === 'postnummer', 'focus moves to the field that raised the error (postnummer)')

  const errorText = await page.textContent('.field-error')
  assert(
    errorText.includes(
      '2200 København N ligger uden for de 75 km fra Lemvig. Vi kører ikke derover, heller ikke mod ekstra kørsel. Ring 97 00 41 20 mandag til fredag 07:00–14:00, så siger vi hvem der dækker området.',
    ),
    'the Fejl state shows the exact pinned copy for postnummer 2200',
  )
  assert(
    (await page.evaluate(() => document.querySelector('.field-error')?.getAttribute('role'))) === 'alert',
    'the error is announced via role="alert"',
  )

  const navnValue = await page.inputValue('#navn')
  const telefonValue = await page.inputValue('#telefon')
  assert(navnValue === 'Kirsten Holm' && telefonValue === '20304050', 'the other answers are preserved exactly as entered')

  await page.close()
}

await browser.close()

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed`)
  process.exit(1)
}
console.log('\nall assertions passed')
