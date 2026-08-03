/**
 * Rejsen siden findes for: forstå formiddagen, send en forespørgsel.
 *
 * Kontrakten i verify.md, "The journey contract", er fire ting:
 *   1. noget ændrede sig og kan aflæses
 *   2. det blev annonceret
 *   3. fejlvejen kørte, og beskeden sad på det felt der forårsagede den
 *   4. hele vejen blev gået på tastaturet alene, med synligt fokus ved hvert stop
 *
 *   BASE=http://localhost:4381 node journeys/forespoergsel.spec.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4381';

let fejl = 0;
const ok = (betingelse, hvad) => {
  if (betingelse) console.log(`  ok    ${hvad}`);
  else { fejl++; console.log(`  FAIL  ${hvad}`); }
};

const browser = await chromium.launch();
const side = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await side.goto(BASE, { waitUntil: 'networkidle' });

console.log('\n  forstå formiddagen, send forespørgslen\n');

/* ── argumentet selv ───────────────────────────────────────────────────── */

const formiddag = await side.$('.formiddag');
ok(Boolean(formiddag), 'signaturen .formiddag renderer');
const fBoks = await formiddag.boundingBox();
ok(fBoks.y < 900, 'og den ligger i første skærm');

const prikker = await side.$$eval('.f-prik', (els) => els.length);
ok(prikker === 12, `tolv prikker for de tolv pletter (fandt ${prikker})`);

const saeson = await side.$('.saeson');
ok(Boolean(saeson), 'anden læsning .saeson renderer');
const sBoks = await saeson.boundingBox();
ok(sBoks.y > 900, 'og den ligger uden for første skærm');
const huller = await side.$$eval('.s-hul', (els) => els.length);
const uspurgte = await side.$$eval('.s-hul--uspurgt', (els) => els.length);
ok(huller === 31, `enogtredive huller (fandt ${huller})`);
ok(uspurgte === 19, `nitten af dem tegnet som tomme, fordi ingen har spurgt (fandt ${uspurgte})`);

/* Risikoens svar: hvad der sker hvis lodsejeren ikke svarer. */
const sidste = await side.textContent('.sidste');
ok(/venter det et helt år/.test(sidste ?? ''), 'siden siger hvad der sker hvis man ikke svarer: hullet venter et år');
ok(/i lov er ingenting/.test(sidste ?? ''), 'og at et brev om en af de sidste tre bestande ikke betyder noget i lov');

/* Reglen, med begge tal. */
const regel = await side.textContent('.regel');
ok(/femtedel/.test(regel ?? '') && /halvtreds/.test(regel ?? ''),
  'reglen står med begge sine tal: en femtedel og halvtreds planter');

/* Ingen betaling, begge veje. */
const krop = await side.textContent('body');
ok(/betaler ikke for adgang/.test(krop), 'siden siger at frøbanken ikke betaler for adgang');
ok(/findes ikke/.test(krop), 'og at frøbanken er et fiktivt eksempel');

/* Der er ingen checkout, ingen konto og ingen booking. */
/* Ordet betaling staar paa siden, fordi siden siger at der ingen er. Det der ikke maa
   findes, er en handelsflade: en kurv, en konto, et login, en booking eller en pris. */
ok(!/læg i kurv|kurv \(|opret konto|log ind|book (en )?tid|kr\.|,-/i.test(krop),
  'ingen kurv, konto, login, booking eller pris nogen steder på siden');
ok(/Ingen betaling nogen af vejene/.test(krop), 'og siden siger selv at der ikke betales nogen af vejene');
const knapper = await side.$$eval('button', (els) => els.length);
ok(knapper === 1, `én knap på hele siden (fandt ${knapper})`);

/* ── TRIN 3 først: fejlvejen, på det felt der forårsagede den ──────────── */

await side.click('.send');
await side.waitForTimeout(150);

const fejlSted = (await side.textContent('#fejl-sted')).trim();
const fejlMaaned = (await side.textContent('#fejl-maaned')).trim();
const fejlKontakt = (await side.textContent('#fejl-kontakt')).trim();
ok(fejlSted.length > 0 && fejlMaaned.length > 0 && fejlKontakt.length > 0,
  'hvert tomt felt får sin egen besked på sit eget felt');
ok(!/påkrævet|obligatorisk|udfyld feltet/i.test(fejlSted + fejlMaaned + fejlKontakt),
  'og beskederne siger hvad der ville blive taget imod, ikke at feltet er påkrævet');
ok((await side.getAttribute('#sted', 'aria-invalid')) === 'true', 'feltet er markeret ugyldigt for hjælpemidler');
ok((await side.getAttribute('#fejl-sted', 'role')) === 'status', 'og beskeden er et status-område');
ok((await side.getAttribute('#fejl-sted', 'aria-live')) === 'polite', 'som annonceres høfligt');
ok(await side.locator('#sendt').isHidden(), 'og der er ikke sendt noget');

/* En måned uden for sæsonen er en egen fejl, ikke den samme som en tom. */
await side.fill('#sted', 'Klitgården ved Nymindegab');
await side.selectOption('#maaned', 'juli');
await side.fill('#kontakt', '97 31 44 08');
await side.click('.send');
await side.waitForTimeout(150);
const udenfor = (await side.textContent('#fejl-maaned')).trim();
ok(/fem uger/.test(udenfor), 'en måned uden for sæsonen får en besked der siger hvilke uger der findes');
ok(await side.locator('#sendt').isHidden(), 'og forespørgslen sendes ikke');

/* Et ulæseligt kontaktfelt siger hvad der ville blive taget imod. */
await side.selectOption('#maaned', '8-sep');
await side.fill('#kontakt', 'ring bare');
await side.click('.send');
await side.waitForTimeout(150);
const kontaktFejl = (await side.textContent('#fejl-kontakt')).trim();
ok(/otte cifre/.test(kontaktFejl) && /snabel-a/.test(kontaktFejl),
  'et ulæseligt kontaktfelt siger hvad et telefonnummer og en e-mail er');

/* ── TRIN 1 og 2: noget ændrer sig, og det annonceres ──────────────────── */

await side.fill('#kontakt', '97 31 44 08');
await side.click('.send');
await side.waitForTimeout(300);

ok(await side.locator('#sendt').isVisible(), 'med tre gyldige svar sendes forespørgslen');
ok(await side.locator('#form').isHidden(), 'og formularen er væk, fordi den er besvaret');
const kvittering = await side.textContent('#sendt');
ok(/Klitgården ved Nymindegab/.test(kvittering), 'kvitteringen viser hvad der faktisk blev skrevet ned: stedet');
ok(/8\. september/.test(kvittering), 'ugen');
ok(/97 31 44 08/.test(kvittering), 'og kontakten');
ok(/fem arbejdsdage/.test(kvittering), 'den siger hvornår der bliver svaret');
ok(/Aase|Halim/.test(kvittering), 'og hvem der læser den');
ok(/Ingenting er sendt/.test(kvittering), 'og at intet faktisk blev sendt, fordi siden er en demonstration');
ok(!/^\s*tak/i.test(kvittering.trim()), 'kvitteringen er ikke et tak, den er det der blev sendt');

/* ── TRIN 4: hele vejen på tastaturet ──────────────────────────────────── */

const frisk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await frisk.goto(BASE, { waitUntil: 'networkidle' });

const stop = [];
for (let i = 0; i < 9; i++) {
  await frisk.keyboard.press('Tab');
  const her = await frisk.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      id: el.id || null,
      cls: el.className?.toString?.() ?? '',
      ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
    };
  });
  if (her) stop.push(her);
}

ok(stop[0]?.cls.includes('spring'), 'første tastaturstop er spring-linket');
ok(stop.every((s) => s.ring), 'hvert stop har en synlig ring på mindst 2px');
const idx = (id) => stop.findIndex((s) => s.id === id);
ok(idx('sted') > 0 && idx('maaned') > idx('sted') && idx('kontakt') > idx('maaned'),
  'felterne nås i den rækkefølge kontrakten siger');

await frisk.focus('#sted');
await frisk.keyboard.type('Sognet ved Thyborøn');
await frisk.keyboard.press('Tab');
await frisk.keyboard.press('Tab');
await frisk.selectOption('#maaned', '1-sep');
await frisk.focus('#kontakt');
await frisk.keyboard.type('aase@example.dk');
await frisk.focus('.send');
await frisk.keyboard.press('Enter');
await frisk.waitForTimeout(300);
ok(await frisk.locator('#sendt').isVisible(), 'hele vejen kan gås på tastaturet alene');
const fokusEfter = await frisk.evaluate(() => document.activeElement?.id ?? '');
ok(fokusEfter === 'sendt', 'og fokus flyttes til det der kom i stedet for formularen');

await browser.close();
console.log(`\n  ${fejl ? `${fejl} fejlede` : 'rejsen holder'}\n`);
process.exit(fejl ? 1 : 0);
