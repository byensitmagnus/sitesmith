#!/usr/bin/env node
/**
 * Rejsen på indvejningsskærmen: prøven tastes, væggen svarer, lasten anvises.
 *
 *   BASE=http://localhost:4180 node journeys/anvisning.spec.mjs
 *
 * Fire ting bliver hævdet, jf. `verify.md`, afsnittet om rejsekontrakten:
 *   1. Noget ændrede sig, som kan ses: loggen fik en række, og cellen blev reserveret.
 *   2. Det blev annonceret: `.melding` er role="status" og skiftede tekst.
 *   3. Fejlvejen blev kørt, og beskeden står ved det felt, der udløste den.
 *   4. Hele vejen kan gås på tastaturet alene, med synligt fokus ved hvert stop.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:4180'
const fejl = []
const ok = (betingelse, hvad) => {
  if (betingelse) console.log(`  ok    ${hvad}`)
  else { fejl.push(hvad); console.log(`  FAIL  ${hvad}`) }
}

const browser = await chromium.launch()
const side = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const konsolfejl = []
side.on('console', (m) => { if (m.type() === 'error') konsolfejl.push(m.text()) })

try {
  await side.goto(BASE, { waitUntil: 'networkidle' })

  /* ---- 3. fejlvejen, først, fordi den er den der plejer at mangle ---- */

  await side.fill('#vand', 'tolv komma tre')
  await side.click('#godkend')

  const feltfejl = await side.evaluate(() => {
    const f = document.getElementById('vand-fejl')
    if (!f) return null
    const input = document.getElementById('vand')
    const a = input.getBoundingClientRect()
    const b = f.getBoundingClientRect()
    return {
      tekst: f.textContent.trim(),
      synlig: b.width > 0 && b.height > 0,
      iSammeFelt: f.closest('.felt') === input.closest('.felt'),
      underFeltet: b.top >= a.top,
      samme_venstre: Math.abs(b.left - a.left) < 40,
      beskrevetAf: (input.getAttribute('aria-describedby') || '').split(' ').includes('vand-fejl'),
      ugyldig: input.getAttribute('aria-invalid') === 'true',
      samlingSynlig: !document.getElementById('fejlsamling').hidden,
      samlingHarFokus: document.activeElement === document.getElementById('fejlsamling'),
      samlingRolle: document.getElementById('fejlsamling').getAttribute('role'),
      samlingPeger: !!document.querySelector('#fejlsamling a[href="#vand"]'),
    }
  })

  ok(!!feltfejl, 'fejlvejen: en besked kom frem for vand')
  ok(feltfejl && feltfejl.synlig && feltfejl.iSammeFelt && feltfejl.underFeltet && feltfejl.samme_venstre,
    'fejlvejen: beskeden står ved det felt der udløste den')
  ok(feltfejl && feltfejl.beskrevetAf && feltfejl.ugyldig,
    'fejlvejen: feltet er mærket ugyldigt og peger på sin egen besked')
  ok(feltfejl && feltfejl.samlingSynlig && feltfejl.samlingRolle === 'alert' && feltfejl.samlingHarFokus && feltfejl.samlingPeger,
    'fejlvejen: samlingen fik fokus, meldes som alert og linker ned til feltet')
  ok(feltfejl && /^Vand\b/.test(feltfejl.tekst) && /for eksempel/.test(feltfejl.tekst),
    'fejlvejen: beskeden navngiver feltet, siger hvad der skete og viser formen')

  const efterFejl = await side.textContent('#melding')
  ok(/mangler|Tast/.test(efterFejl), 'fejlvejen: væggen frigiver ikke lasten på en ugyldig prøve')

  /* ---- 1 og 2. den rigtige vej, med mus ---- */

  const foerLog = await side.$$eval('#logliste li', (n) => n.length)
  const foerMelding = await side.textContent('#melding')

  await side.fill('#vand', '13,8')
  await side.click('#godkend')
  const knapper = await side.$$eval('#siloer button[data-celle]', (n) => n.map((k) => k.getAttribute('data-celle')))
  ok(knapper.join(',') === '1,2,3', `væggen tændte celle 1, 2 og 3 og ikke andre (fik: ${knapper.join(',') || 'ingen'})`)

  const foerFyld = await side.textContent('#siloer li:nth-child(3) .celle-plads')
  await side.click('#siloer button[data-celle="3"]')

  const efter = await side.evaluate(() => ({
    logRaekker: document.querySelectorAll('#logliste li').length,
    foersteLog: document.querySelector('#logliste li').textContent.replace(/\s+/g, ' ').trim(),
    melding: document.getElementById('melding').textContent.trim(),
    meldingRolle: document.getElementById('melding').getAttribute('role'),
    plads: document.querySelector('#siloer li:nth-child(3) .celle-plads').textContent.trim(),
    fortryd: !!document.getElementById('fortryd'),
    reserveret: !!document.querySelector('#siloer li:nth-child(3) svg [fill="url(#korn-baand-m)"]'),
  }))

  ok(efter.logRaekker === foerLog + 1, `loggen fik en række (${foerLog} til ${efter.logRaekker})`)
  ok(/celle 3/.test(efter.foersteLog) && /CV 41 872/.test(efter.foersteLog),
    'den nye række navngiver vognen og cellen')
  ok(efter.plads !== foerFyld, `celle 3 mistede plads i tegningen (${foerFyld} til ${efter.plads})`)
  ok(efter.reserveret, 'lastens plads er tegnet som et bånd i cellen')
  ok(efter.meldingRolle === 'status' && efter.melding !== foerMelding && /Anvist til celle 3/.test(efter.melding),
    'ændringen blev annonceret i en role="status" der skiftede tekst')
  ok(efter.fortryd, 'anvisningen kan fortrydes, så længe vognen står på broen')

  await side.click('#broknap')
  const laast = await side.evaluate(() => ({
    fortryd: !!document.getElementById('fortryd'),
    tekst: document.querySelector('#logliste li').textContent.replace(/\s+/g, ' '),
    bro: document.getElementById('bro-vaegt').textContent.trim(),
  }))
  ok(!laast.fortryd && /Låst/.test(laast.tekst), 'anvisningen låses, når vognen har forladt broen')
  ok(laast.bro === '0 kg', 'broen læser 0 kg mellem to vogne')

  /* ---- 4. hele vejen på tastaturet alene ---- */

  await side.goto(BASE, { waitUntil: 'networkidle' })
  const stop = []
  let naaedeVand = false
  for (let i = 0; i < 40 && !naaedeVand; i++) {
    await side.keyboard.press('Tab')
    const s = await side.evaluate(() => {
      const e = document.activeElement
      if (!e || e === document.body) return null
      const cs = getComputedStyle(e)
      return {
        id: e.id || e.tagName.toLowerCase(),
        fokusMaerke: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
        farve: cs.outlineColor,
      }
    })
    if (!s) break
    stop.push(s)
    if (s.id === 'vand') naaedeVand = true
  }
  ok(naaedeVand, 'tastaturet når frem til det første felt')
  ok(stop.length > 0 && stop.every((s) => s.fokusMaerke),
    `hvert af de ${stop.length} tastaturstop har et synligt fokusmærke`)

  await side.keyboard.press('Control+a')
  await side.keyboard.type('14,2')
  await side.keyboard.press('Tab')
  await side.keyboard.press('Control+a')
  await side.keyboard.type('11,9')
  await side.keyboard.press('Tab')
  await side.keyboard.press('Control+a')
  await side.keyboard.type('0,4')
  await side.keyboard.press('Tab')
  const paaKnappen = await side.evaluate(() => document.activeElement.id)
  ok(paaKnappen === 'godkend', `tabulator lander på Godkend prøve (kom til: ${paaKnappen})`)
  await side.keyboard.press('Enter')

  let anvist = false
  for (let i = 0; i < 12 && !anvist; i++) {
    await side.keyboard.press('Tab')
    const her = await side.evaluate(() => document.activeElement.getAttribute('data-celle'))
    if (her === '2') {
      const maerke = await side.evaluate(() => {
        const cs = getComputedStyle(document.activeElement)
        return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
      })
      ok(maerke, 'Anvis-knappen viser fokus, inden den trykkes')
      await side.keyboard.press('Enter')
      anvist = true
    }
  }
  const tast = await side.evaluate(() => ({
    log: document.querySelector('#logliste li').textContent.replace(/\s+/g, ' '),
    melding: document.getElementById('melding').textContent,
  }))
  ok(anvist && /celle 2/.test(tast.log) && /14,2/.test(tast.log),
    'hele vejen kørt på tastaturet alene, og loggen har rækken med 14,2 % vand')
  ok(/Anvist til celle 2/.test(tast.melding), 'og tastaturvejen blev annonceret samme sted')

  ok(konsolfejl.length === 0, `ingen konsolfejl undervejs (${konsolfejl.length})`)
} finally {
  await browser.close()
}

console.log(fejl.length ? `\n  ${fejl.length} fejlede\n` : '\n  alt bestod\n')
process.exit(fejl.length ? 1 : 0)
