/**
 * Journey: en møbelsnedker stiller en bestilling op og får sedlen skrevet.
 *
 * Fire ting bliver hævdet, som verify.md kræver:
 *   1. Noget ændrede sig, som man kan se: sedlen går fra tom til udfyldt med tal.
 *   2. Det blev meldt: #seddel er role="status", og indholdet skiftede.
 *   3. Fejlvejen kørte, og beskeden står på det felt, der udløste den.
 *   4. Vejen kan gås på tastaturet alene, med en synlig markering hele vejen.
 *
 * Kør alene:  BASE=http://localhost:5173 node journeys/bestilling.spec.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const fejl = [];
const ok = (betingelse, hvad) => {
  if (betingelse) console.log(`  ok    ${hvad}`);
  else { fejl.push(hvad); console.log(`  FAIL  ${hvad}`); }
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const konsol = [];
page.on('console', (m) => { if (m.type() === 'error') konsol.push(m.text()); });

try {
  await page.goto(BASE, { waitUntil: 'load' });

  /* 1. Noget ændrede sig ------------------------------------------------ */

  const foer = (await page.locator('#seddel').innerText()).trim();
  ok(/står på hver eneste seddel/.test(foer) && /Længde/.test(foer),
    'sedlen starter som en invitation, der allerede bærer de fire linjer, som gælder hver ordre');

  await page.selectOption('#sort', 'elm');
  const tykkelseTilstand = await page.$$eval('#tykkelse option', (o) =>
    o.map((x) => `${x.value}:${x.disabled ? 'spærret' : 'valgbar'}`).join(' '));
  ok(tykkelseTilstand === '27:spærret 40:valgbar 52:spærret 65:spærret',
    `elm ligger kun i 40 mm, og de tre andre tykkelser bærer disabled (${tykkelseTilstand})`);

  await page.selectOption('#levering', 'lastbil');
  await page.fill('#maengde', '2');
  await page.click('#skriv');

  const efter = (await page.locator('#seddel').innerText()).trim();
  ok(efter !== foer, 'sedlens indhold er et andet end før klikket');
  ok(/Elm/.test(efter), 'sedlen navngiver træsorten');
  ok(/40 mm/.test(efter), 'sedlen bærer tykkelsen');
  ok(/2,4 til 4,8 m/.test(efter), 'sedlen bærer længden, som pladsen ikke kender på forhånd');
  ok(/33[.,]?850/.test(efter), `sedlen bærer summen af 2 m3 elm og ét læs (${efter.replace(/\s+/g, ' ').slice(0, 200)})`);

  /* 2. Det blev meldt --------------------------------------------------- */

  const rolle = await page.getAttribute('#seddel', 'role');
  ok(rolle === 'status', 'det område, der ændrede sig, er role="status"');

  /* 3. Fejlvejen, med beskeden på sit eget felt ------------------------- */

  await page.fill('#maengde', '5');
  await page.click('#skriv');

  const beskrevetAf = (await page.getAttribute('#maengde', 'aria-describedby')) ?? '';
  const fejltekst = (await page.locator('#maengde-fejl').innerText()).trim();
  const ugyldig = await page.getAttribute('#maengde', 'aria-invalid');
  ok(beskrevetAf.split(/\s+/).includes('maengde-fejl'),
    'fejlbeskeden er det felt, der udløste den, beskrevet ved aria-describedby');
  ok(/3,4 m³ elm/.test(fejltekst), `fejlen siger hvad der skete: ${fejltekst}`);
  ok(/Sæt tallet ned|ring/i.test(fejltekst), 'fejlen siger hvad man gør ved det');
  ok(ugyldig === 'true', 'feltet er markeret aria-invalid');
  const efterFejl = (await page.locator('#seddel').innerText()).trim();
  ok(/står på hver eneste seddel/.test(efterFejl) && !/Træsort/.test(efterFejl),
    'ingen seddel bliver skrevet på et tal, pladsen ikke kan levere');

  /* 4. Hele vejen på tastaturet, med synlig markering ------------------- */

  await page.reload({ waitUntil: 'load' });
  await page.evaluate(() => window.scrollTo(0, 0));

  const markering = async () => page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      id: el.id || el.tagName.toLowerCase(),
      synlig: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
      fokusSynlig: el.matches(':focus-visible'),
    };
  });

  const stop = [];
  let naaedeSort = false;
  for (let i = 0; i < 40 && !naaedeSort; i++) {
    await page.keyboard.press('Tab');
    const m = await markering();
    if (!m) break;
    stop.push(m);
    if (m.id === 'sort') naaedeSort = true;
  }
  ok(naaedeSort, `tabulator når frem til træsorten uden mus, ${stop.length} stop undervejs`);
  const uden = stop.filter((s) => !s.synlig || !s.fokusSynlig);
  ok(uden.length === 0, `hvert stop på vejen bærer en synlig markering (${uden.map((s) => s.id).join(', ') || 'ingen uden'})`);

  await page.keyboard.press('Tab');
  const paaTykkelse = await markering();
  ok(paaTykkelse?.id === 'tykkelse' && paaTykkelse.synlig, 'næste stop er tykkelsen, stadig med markering');

  await page.keyboard.press('Tab');
  const paaMaengde = await markering();
  ok(paaMaengde?.id === 'maengde' && paaMaengde.synlig, 'næste stop er mængden, stadig med markering');
  await page.keyboard.type('1.5');

  let paaKnap = null;
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    const m = await markering();
    if (m?.id === 'skriv') { paaKnap = m; break; }
  }
  ok(paaKnap !== null && paaKnap.synlig, 'knappen kan nås med tabulator og bærer en markering');
  await page.keyboard.press('Enter');

  const tastatur = (await page.locator('#seddel').innerText()).trim();
  ok(/Sedlen er skrevet/.test(tastatur), 'knappen "Skriv sedlen" melder tilbage med "Sedlen er skrevet"');
  ok(/13[.,]?350/.test(tastatur), `sedlen blev skrevet på tastaturet alene (${tastatur.replace(/\s+/g, ' ').slice(0, 160)})`);

  ok(konsol.length === 0, `ingen konsolfejl undervejs (${konsol.join(' | ') || 'ingen'})`);
} finally {
  await browser.close();
}

if (fejl.length) {
  console.error(`\n  ${fejl.length} påstand(e) holdt ikke:`);
  for (const f of fejl) console.error(`   - ${f}`);
  process.exit(1);
}
console.log('\n  bestillingsvejen holder, alle påstande.');
