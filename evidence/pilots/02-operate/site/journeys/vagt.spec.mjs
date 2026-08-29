/**
 * Rejsen skærmen findes for: rangordn natten, handl på den øverste post, se handlingen
 * lande eller slå fejl.
 *
 * Kontrakten i verify.md, "The journey contract", er fire ting:
 *   1. noget ændrede sig og kan aflæses
 *   2. det blev annonceret
 *   3. fejlvejen kørte, og beskeden sad på det den handlede om
 *   4. hele vejen blev gået på tastaturet alene, med synligt fokus ved hvert stop
 *
 *   BASE=http://localhost:4371 node journeys/vagt.spec.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4371';

let fejl = 0;
const ok = (betingelse, hvad) => {
  if (betingelse) console.log(`  ok    ${hvad}`);
  else { fejl++; console.log(`  FAIL  ${hvad}`); }
};

const browser = await chromium.launch();
const side = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await side.goto(BASE, { waitUntil: 'networkidle' });

console.log('\n  rangordn, handl, se den lande\n');

/* ── rangordningen selv ────────────────────────────────────────────────── */

const poster = await side.$$eval('.post', (els) => els.map((e) => ({
  id: e.getAttribute('data-post'),
  top: e.classList.contains('post-top'),
  navn: e.querySelector('.post-navn')?.textContent?.trim(),
  hvorfor: e.querySelector('.hvorfor')?.textContent?.trim() ?? '',
  alder: e.querySelector('.post-alder')?.textContent?.trim() ?? '',
})));

ok(poster.length === 5, `fem poster i listen (fandt ${poster.length})`);
ok(poster[0]?.id === 'motor', 'øverste post er Nord portmotor, den der er tre grader fra udkobling');
ok(poster[0]?.top === true, 'og den er den eneste der bærer den øverste plads');
ok(poster.filter((p) => p.top).length === 1, 'kun én post har den øverste plads');

/* Risikoens svar: hver post bærer regnestykket der sorterede den. */
ok(poster.every((p) => p.hvorfor.length > 40), 'hver post bærer den sætning der sorterede den');
ok(/71/.test(poster[0].hvorfor) && /74/.test(poster[0].hvorfor),
  'den øverste post nævner både tallet 71 og grænsen 74');

/* Alderen: hvert tal siger hvor gammelt det er. */
ok(poster.every((p) => /\d+ min gammel/.test(p.alder)), 'hver aflæsning bærer sin alder i minutter');
const gammel = poster.find((p) => /ikke aktuel/.test(p.alder));
ok(Boolean(gammel), 'den aflæsning der er ældre end to intervaller, er mærket ikke aktuel');
ok(gammel?.navn === 'Vandtemperatur', 'og det er vandtemperaturen, som måles hvert 15. minut og er 32 minutter gammel');
const struket = await side.$$eval('.gammel', (els) => els.length);
ok(struket >= 1, 'og den er streget over, så mærkningen ikke kun er en farve');

/* Det der mangler, er markeret som manglende og ikke som nul. */
const manglerTekst = await side.textContent('.log li[data-art="mangler"]');
ok(/ikke nul/.test(manglerTekst ?? ''), 'de fire manglende aflæsninger står som manglende og ikke som nul');
ok(/Kammervandstand/.test(manglerTekst ?? ''), 'og de er navngivet enkeltvis');

/* Signaturen og anden læsning renderer. */
const baand = await side.$('.baand');
const slag = await side.$('.slag');
ok(Boolean(baand), 'signaturen .baand renderer');
ok(Boolean(slag), 'anden læsning .slag renderer');
const baandBoks = await baand.boundingBox();
ok(baandBoks.y < 900, 'og signaturen ligger i første skærm');
const slagBoks = await slag.boundingBox();
ok(slagBoks.y > 900, 'anden læsning ligger uden for første skærm');

/* ── TRIN 1 og 2: kvittering ændrer noget aflæseligt, og det annonceres ── */

const svar = side.locator('#svar-motor');
ok((await svar.textContent()).trim() === '', 'før handling er svarfeltet tomt');
ok((await svar.getAttribute('role')) === 'status', 'svarfeltet er et status-område');
ok((await svar.getAttribute('aria-live')) === 'polite', 'og det annonceres høfligt');

await side.click('#kvitter-motor');
await side.waitForTimeout(200);

const efterKvit = (await svar.textContent()).trim();
ok(/Kvitteret 04:10/.test(efterKvit), 'kvittering annoncerer hvem der kvitterede og hvornår');
ok(/uændret/.test(efterKvit), 'og den siger at posten står uændret, fordi kvittering ikke retter noget');
const topEfter = await side.$$eval('.post-top', (els) => els.length);
ok(topEfter === 0, 'den kvitterede post har forladt den øverste plads');
const kvitLinje = await side.textContent('.kvitteret');
ok(/71 grader/.test(kvitLinje ?? ''), 'og den beholder sin historie: motoren er stadig på 71 grader');

/* ── TRIN 3: fejlvejen, på det den handler om ──────────────────────────── */

await side.click('#hold-motor');
const iFlugt = await side.getAttribute('#hold-motor', 'data-tilstand');
ok(iFlugt === 'flyver', 'anmodningen kvitteres lokalt med det samme, uden at vente på radiolinket');

await side.waitForTimeout(300);
const efterFejl = (await svar.textContent()).trim();
ok(/nåede ikke slusehuset/.test(efterFejl), 'fejlen siger at anmodningen ikke nåede frem');
ok(/uændret/.test(efterFejl), 'og at posten står uændret');
ok(!/gik galt|fejl opstod/i.test(efterFejl), 'og den siger hvad der ikke skete i stedet for at noget gik galt');
ok((await side.getAttribute('#hold-motor', 'data-tilstand')) === 'fejlet',
  'kontrollen bærer selv fejlen, så beskeden sidder på det den handlede om');
ok((await side.locator('#hold-motor').isEnabled()), 'og kontrollen kan bruges igen');
ok((await svar.getAttribute('class')).includes('svar--fejl'), 'fejlen har sin egen klasse, ikke kun sin egen farve');

/* Skærmen betjener ikke slusen, og må ikke se ud som om den gør. */
const knapper = await side.$$eval('button', (els) => els.map((e) => e.textContent.trim()));
ok(knapper.length === 2, `kun to kontroller på skærmen (fandt ${knapper.length})`);
ok(!knapper.some((k) => /åbn|luk|nulstil|alarm/i.test(k)), 'ingen kontrol ligner noget der betjener slusen');

/* ── TRIN 4: hele vejen på tastaturet ──────────────────────────────────── */

const frisk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await frisk.goto(BASE, { waitUntil: 'networkidle' });

const stop = [];
for (let i = 0; i < 8; i++) {
  await frisk.keyboard.press('Tab');
  const her = await frisk.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      id: el.id || null,
      cls: el.className?.toString?.() ?? '',
      tag: el.tagName.toLowerCase(),
      ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
    };
  });
  if (her) stop.push(her);
}

ok(stop[0]?.cls.includes('spring'), 'første tastaturstop er spring-linket');
ok(stop.slice(0, 5).every((s) => s.ring), 'hvert af de første fem stop har en synlig ring på mindst 2px');
const idx = (id) => stop.findIndex((s) => s.id === id);
ok(idx('kvitter-motor') > 0, 'kvitteringsknappen kan nås med tastaturet alene');
ok(idx('hold-motor') > idx('kvitter-motor'), 'og hold kommer efter kvittering, som kontrakten siger');

/* Tab hele vejen til kvitteringsknappen og tryk der, i stedet for at trykke der hvor
   otte tabs tilfældigvis endte. Vejen skal gås, ikke rammes. */
await frisk.keyboard.press('Shift+Tab');
let ved = await frisk.evaluate(() => document.activeElement?.id ?? '');
let vaern = 0;
while (ved !== 'kvitter-motor' && vaern < 14) {
  await frisk.keyboard.press(ved === 'hold-motor' ? 'Shift+Tab' : 'Tab');
  ved = await frisk.evaluate(() => document.activeElement?.id ?? '');
  vaern++;
}
ok(ved === 'kvitter-motor', 'kvitteringsknappen kan nås ved at tabbe, uden mus');
await frisk.keyboard.press('Enter');
await frisk.waitForTimeout(250);
const tastaturSvar = (await frisk.textContent('#svar-motor')).trim();
ok(tastaturSvar.length > 0, 'hele vejen kan gås på tastaturet alene: handlingen svarer');

await browser.close();
console.log(`\n  ${fejl ? `${fejl} fejlede` : 'rejsen holder'}\n`);
process.exit(fejl ? 1 : 0);
