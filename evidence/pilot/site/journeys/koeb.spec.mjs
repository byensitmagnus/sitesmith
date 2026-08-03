/**
 * Rejsen siden findes for: mål, pris, ordre.
 *
 * Kontrakten i verify.md, "The journey contract", er fire ting, og de er navngivet
 * herunder som TRIN 1 til TRIN 4:
 *   1. noget ændrede sig og kan aflæses
 *   2. det blev annonceret
 *   3. fejlvejen kørte, og beskeden sad på det felt der forårsagede den
 *   4. hele vejen blev gået på tastaturet alene, med synligt fokus ved hvert stop
 *
 *   node journeys/koeb.spec.mjs            (BASE=http://localhost:4321 som standard)
 *   BASE=http://localhost:4321 node journeys/koeb.spec.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4321';

let fejl = 0;
const ok = (betingelse, hvad) => {
  if (betingelse) {
    console.log(`  ok    ${hvad}`);
  } else {
    fejl++;
    console.log(`  FAIL  ${hvad}`);
  }
};
const lig = (fundet, ventet, hvad) => ok(fundet === ventet, `${hvad}: ventede "${ventet}", fandt "${fundet}"`);

const browser = await chromium.launch();
const side = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const konsolfejl = [];
side.on('console', (m) => {
  if (m.type() === 'error') konsolfejl.push(m.text());
});

try {
  await side.goto(BASE, { waitUntil: 'networkidle' });

  /* ── udgangspunktet: tom, og ingen pris ────────────────────────────── */

  const prisFoer = (await side.locator('#v-pris').textContent()).trim();
  lig(prisFoer, 'kr', 'prisfeltet holder svarets form og enhed før der er tastet noget, og skriver ikke 0 kr');
  ok(!/\d/.test(prisFoer), 'prisfeltet indeholder ikke et tal før der er to mål');
  ok(await side.locator('#skriv').isDisabled(), 'knappen er slået fra indtil sedlen kan skrives');
  ok(
    (await side.locator('#baenk-tom').getAttribute('class')) === 'tal-tegning-svag',
    'bænketegningen står i sin tomme tilstand og siger hvad der mangler',
  );
  ok(
    (await side.locator('#tal').getAttribute('aria-busy')) === 'true',
    'talblokken holder formen af svaret og er markeret som ventende',
  );

  /* ── TRIN 3: fejlvejen, på det felt der forårsagede den ────────────── */

  await side.fill('#bredde', '20');
  await side.locator('#hoejde').focus();
  const fejlBredde = (await side.locator('#fejl-bredde').textContent()).trim();
  ok(fejlBredde.includes('14 mm'), 'for lille mål: beskeden regner falsmålet ud og skriver det');
  ok(fejlBredde.includes('30 mm'), 'for lille mål: beskeden siger hvor grænsen går');
  lig(await side.locator('#bredde').getAttribute('aria-invalid'), 'true', 'bredden er markeret ugyldig');
  lig(
    await side.locator('#bredde').getAttribute('aria-describedby'),
    'fejl-bredde',
    'beskeden er bundet til det felt der forårsagede den',
  );
  ok(
    (await side.locator('#fejl-hoejde').textContent()).trim() === '',
    'højden har ingen fejl, så fejlen sidder ikke på hele formularen',
  );
  ok(await side.locator('#skriv').isDisabled(), 'sedlen kan ikke skrives mens et felt er forkert');

  await side.fill('#bredde', '2500');
  await side.locator('#hoejde').focus();
  const forStor = (await side.locator('#fejl-bredde').textContent()).trim();
  ok(forStor.includes('2.494 mm'), 'for stort mål: beskeden skriver falsmålet');
  ok(forStor.includes('2,4 m'), 'for stort mål: beskeden siger hvorfor, altså skærebænken');

  // Et talfelt kan ikke fyldes med bogstaver gennem fill(), så det tastes.
  await side.locator('#bredde').fill('');
  await side.locator('#bredde').pressSequentially('12e');
  await side.locator('#hoejde').focus();
  ok(
    await side.evaluate(() => document.getElementById('bredde').validity.badInput),
    'ikke-tal: browseren kan ikke læse feltets indhold som et tal',
  );
  ok(
    (await side.locator('#fejl-bredde').textContent()).includes('kun læse tal'),
    'ikke-tal: feltet siger at det kun læser tal',
  );

  await side.fill('#bredde', '1400');
  await side.fill('#hoejde', '900');
  await side.check('input[name="udlevering"][value="kasse"]');
  const kasseFejl = (await side.locator('#fejl-udlevering').textContent()).trim();
  ok(kasseFejl.includes('1.394 x 894 mm'), 'for stor til kasse: beskeden skriver falsmålet');
  ok(kasseFejl.includes('Glarmestervej 8'), 'for stor til kasse: beskeden siger hvad man så gør');
  ok(await side.locator('#skriv').isDisabled(), 'sedlen kan ikke skrives med en kasse der ikke findes');

  await side.check('input[name="udlevering"][value="afhentning"]');
  await side.check('input[name="glas"][value="antik"]');
  await side.fill('#antal', '20');
  const lagerFejl = (await side.locator('#fejl-antal').textContent()).trim();
  ok(lagerFejl.includes('11 m²'), 'antikglas over lager: beskeden skriver hvad der er tilbage');
  ok(lagerFejl.startsWith('Der er 11 m²'), 'antikglas over lager: beskeden sidder på antallet, som er det felt der forårsagede den');
  lig(await side.locator('#antal').getAttribute('aria-invalid'), 'true', 'antallet er markeret ugyldigt');

  /* ── TRIN 1: noget ændrede sig, og det er til at aflæse ────────────── */

  await side.fill('#antal', '1');
  await side.check('input[name="glas"][value="float4"]');
  await side.fill('#bredde', '900');
  await side.fill('#hoejde', '606');

  lig(
    (await side.locator('#v-falsmaal').textContent()).trim(),
    '894 x 600 mm',
    'falsmålet er de to mål minus 3 mm i hver side',
  );
  lig((await side.locator('#v-areal').textContent()).trim(), '0,536 m²', 'arealet står med tre decimaler');
  lig((await side.locator('#v-pris').textContent()).trim(), '343 kr', 'prisen er arealet gange kvadratmeterprisen');
  lig((await side.locator('#v-klar').textContent()).trim(), '2 arbejdsdage', 'leveringstiden følger glastypen');
  ok(prisFoer !== (await side.locator('#v-pris').textContent()).trim(), 'prisfeltet er observerbart anderledes end før');
  ok(
    (await side.locator('#tal').getAttribute('aria-busy')) === null,
    'talblokken er ikke længere ventende, når svaret står der',
  );
  ok(
    (await side.locator('#baenk-rude').getAttribute('class')) === '',
    'ruden er tegnet ind på bænken',
  );
  lig(
    (await side.locator('#rude-tal-b').textContent()).trim(),
    '894 mm',
    'tegningen målsætter den lange side langs bænken',
  );

  const minimum = await side.evaluate(async () => {
    const s = (id, v) => {
      const el = document.getElementById(id);
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    s('bredde', '106');
    s('hoejde', '106');
    return {
      areal: document.getElementById('v-areal').textContent.trim(),
      pris: document.getElementById('v-pris').textContent.trim(),
    };
  });
  lig(minimum.areal, '0,150 m²', 'en lille rude regnes som mindst 0,15 m²');
  lig(minimum.pris, '96 kr', 'minimumsarealet er det der bliver betalt for');

  /* ── TRIN 4: hele vejen på tastaturet, med synligt fokus ───────────── */

  await side.goto(BASE, { waitUntil: 'networkidle' });
  await side.evaluate(() => window.scrollTo(0, 0));
  await side.locator('body').click({ position: { x: 2, y: 2 } });
  await side.evaluate(() => document.activeElement?.blur());

  const stop = [];
  let naaedeKnappen = false;
  for (let i = 0; i < 40; i++) {
    await side.keyboard.press('Tab');
    const nu = await side.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        id: el.id,
        tag: el.tagName.toLowerCase(),
        navn: el.name ?? '',
        markering: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
        stil: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
      };
    });
    if (!nu) break;
    stop.push(nu);
    if (nu.id === 'bredde') await side.keyboard.type('900');
    if (nu.id === 'hoejde') await side.keyboard.type('606');
    if (nu.id === 'skriv') {
      naaedeKnappen = true;
      break;
    }
  }

  ok(naaedeKnappen, 'knappen kan nås med Tab alene fra toppen af siden');
  const udenMarkering = stop.filter((s) => !s.markering);
  ok(
    udenMarkering.length === 0,
    `hvert af de ${stop.length} tastaturstop har en synlig fokusmarkering${
      udenMarkering.length ? `, mangler: ${udenMarkering.map((s) => s.id || s.tag).join(', ')}` : ''
    }`,
  );
  ok(
    (await side.locator('#v-pris').textContent()).trim() === '343 kr',
    'prisen blev regnet af de tal der blev tastet med tastaturet',
  );

  /* ── TRIN 2: det blev annonceret ───────────────────────────────────── */

  await side.keyboard.press('Enter');
  await side.waitForFunction(() => document.getElementById('kvittering').children.length > 0);

  const kvit = await side.evaluate(() => {
    const el = document.getElementById('kvittering');
    return {
      rolle: el.getAttribute('role'),
      fokus: document.activeElement === el,
      tekst: el.textContent.replace(/\s+/g, ' ').trim(),
    };
  });
  lig(kvit.rolle, 'status', 'skæresedlen ligger i en region der annonceres');
  ok(kvit.fokus, 'fokus flyttede hen på skæresedlen da den blev skrevet');
  ok(kvit.tekst.includes('894 x 600 mm'), 'skæresedlen bærer falsmålet');
  ok(kvit.tekst.includes('0,536 m²'), 'skæresedlen bærer arealet med tre decimaler');
  ok(kvit.tekst.includes('343 kr'), 'skæresedlen bærer prisen');
  ok(kvit.tekst.includes('2 arbejdsdage'), 'skæresedlen bærer leveringstiden');
  ok(kvit.tekst.includes('Afhentning, Glarmestervej 8'), 'skæresedlen bærer hvordan ruden udleveres');
  ok(kvit.tekst.includes('75 62 11 09'), 'skæresedlen siger hvordan den bliver til en ordre');
  ok(
    kvit.tekst.includes('betales ved afhentning eller på faktura'),
    'skæresedlen siger at intet er betalt endnu',
  );

  ok(konsolfejl.length === 0, `ingen konsolfejl undervejs${konsolfejl.length ? `: ${konsolfejl[0]}` : ''}`);
} finally {
  await browser.close();
}

console.log(fejl ? `\n  ${fejl} kontrol(ler) fejlede\n` : '\n  alle kontroller passerede\n');
process.exit(fejl ? 1 : 0);
