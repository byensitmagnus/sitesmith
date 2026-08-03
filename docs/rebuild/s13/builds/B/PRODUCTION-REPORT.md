# Produktionsrapport, driftskonsol Nordbo Fjernvarme

- Scenario: operate
- Surface: driftskonsol, den skærm en operatør holder åben hele vagten
- Stack: ingen detekteret. `stack.mjs detect` navngav ingen adapter, så run.md afsnit 12 gælder: ren HTML og CSS uden byggetrin.
- draft: nej
- release: nej. Dette er en enkelt bygget flade, ikke en udgivelse.

## Beslutningsblok fra ledger parse

```text
thesis 1: Et instrumentbræt med 61 visere.
thesis 2: Et aflæsningsark der skriver sig selv.
thesis 3: Et tracé set oppefra.
built: thesis 2 on the axis of which artefact the shift already keeps
reason: a utility that reads sixty one fixed points on a fixed interval keeps an
        aflæsningsark and a driftsjournal, and an irreversible dispatch behaves like an
        ink line rather than like a state inside a machine.
runner-up argued: thesis 1
signature: arket (.arket), 61 ens trykte felter i én blok
risk: papir i stedet for mørkt kontrolrum, og markeringstusch i stedet for rødt
originality pass: kørt én gang mod autopilotbeskrivelsen
```

## Files opened

- `SKILL.md`
- `run.md`
- `floor/operate.md`
- `stacks/static.md`
- `verify.md`
- `scripts/ledger.mjs`
- `scripts/gate.mjs`
- `scripts/stack.mjs`
- `scripts/verify.mjs`

Uden for pakken blev kun briefen `docs/rebuild/s11/briefs/B-fjernvarme.md` og denne builds
egne filer åbnet. Intet under `docs/rebuild/` ud over briefen, og intet under
`skills/sitesmith/`.

## Run notes

- viewports: 375, 768 og 1440 renderet af verify.mjs mod http://127.0.0.1:4319/, og 320 renderet separat med playwright. Ingen vandret scroll på nogen af dem.
- axe both schemes: kørte i både light og dark på 375, 768 og 1440. 0 overtrædelser, 0 serious eller critical.
- live server: kørte. En lille statisk http-server fra scratchpad serverede byggemappen på 127.0.0.1:4319, fordi verify.mjs afviser `file:`-protokollen.
- anti-slop linter: gate.mjs kørte mod byggemappen med `--skill` peget på sitesmith-v3. Resultatet står under ## Mechanical findings.
- fallbacks: none

## Tilstandsoversigten gået igennem på den byggede side

Gået igennem mod den kørende side, ikke mod planen.

| Tilstand | Hvor den findes | Verificeret |
| --- | --- | --- |
| Rest | alle felter i arket, alle knapper, select og tekstfelt | ja, renderet |
| Hover | `.felt:hover` skifter rammefarve og blækfarve, `.knap:hover` skifter fyld. Aldrig eneste virkemiddel: alt har ramme og markør i hvile. | ja, renderet |
| Focus-visible | 3px blækkontur med 2px afstand på alt fokuserbart. Måler 13,4:1 mod papiret og 7,2:1 mod et markeret felt. | ja, playwright-tastatursweep, 18 stop |
| Active | `.knap:active` fylder med `--rulering` | ja, renderet |
| Disabled | findes ikke, og det er et valg. Ingen kontrol på denne skærm har en tilstand hvor den er til stede og ikke virker. Hvor en handling ikke er mulig, tegnes knappen ikke: et sendt udkald erstatter formularen i stedet for at slukke den, og en montør der kører kan stadig vælges, fordi briefen tillader omfordeling. Send-knappen slukkes ikke ved tomt felt, fordi fejlen skal kunne læses. | bevidst fravalgt, begrundelse her |
| Loading | `.knap[aria-busy="true"]` findes i stylesheetet og bruges ikke, fordi der ikke er nogen ventetid at rapportere. SKILL.md afsnit 6 forbyder at noget venter mellem hensigt og resultat, så udkaldet skrives i samme tick. | eksisterer i CSS, ikke udøvet |
| Empty | to komponerede tomme visninger: alle tre filtre slået fra, og filtre slået til uden træffere. Begge er en invitation, ikke en undskyldning. | ja, playwright drev begge |
| Error | fejl står ved feltet der udløste dem, og igen i én opsummering med `role="alert"` som tastaturet når først, med links ned til felterne. Indtastet tekst bevares. | ja, playwright drev begge fejl og bekræftede at kladden overlevede |
| Partial | telegramlinjen: 59 af 61 stationer svarede, 2 mangler, og de to er de samme to stationer hvis aflæsning står som gammel. | ja, renderet |

## Design record, skrevet fra den leverede kode

Skrevet fra `index.html` som den er, ikke fra direction-recorden.

- Farver, syv custom properties: `--ark #F2EDE3` er sidens bund, `--beton #DCD6C9` fylder
  blokmarkører og hover, `--rulering #C3BCAB` tegner alle hårstreger og papirlinjerne bag
  journalen, `--blyant #5C5A52` bærer etiketter og enheder, `--skrift #1A2338` bærer al
  primær tekst og alle synlige rammer, `--markering #E0A400` er felt bag et brud og intet
  andet, `--stempel #5B3A8E` rammer og navngiver et modtaget udkald og intet andet.
- Skrift: Zilla Slab 500 og 600 til h1, h2 og h3, Archivo Narrow 400 til 700 til alt andet.
  Målt i browseren: den største overskrift renderer i Zilla Slab, body renderer i Archivo
  Narrow.
- Skala i rem, alle som tokens: 1,375 / 1,0625 / 1,5 / 1 / 0,9375 / 0,8125. Ingen
  font-størrelse står som literal ved et kaldested.
- Ingen `text-transform` findes i filen. Ingen `animation` og ingen `transition` findes i
  filen. Der er én `position: sticky` på vagtjournalen over 1000px, og den flytter ikke
  noget af sig selv.
- Afvigelser fra planen: planen sagde at hele arbejdsenheden ville ligge over folden ved
  1440. Det passer for arket, montørerne, telegrammet, første linje og journalens top.
  Linje to til fem ligger under folden. Det er skrevet ind her frem for at blive rettet
  ved at klemme linjerne sammen, fordi en linje der er svær at læse er værre end en linje
  man scroller til.
- Én tilføjelse efter planen: vagtjournalen blev gjort sticky over 1000px, så den bliver
  siddende mens operatøren arbejder sig ned gennem linjerne. Det er ikke et defekt, men
  det stod ikke i planen, og det står derfor her.

## Mechanical findings

Alt hvad de kørte værktøjer rapporterede, som det blev rapporteret.

- `verify/tap-target-24px`: de tre filter-afkrydsningsfelter måler 24px, under gulvets 44px. Rapporteret på 375, 768 og 1440.
- `verify/target-spacing-2px`: felterne i arket ligger 2px og 3px fra hinanden, under gulvets 24px. 37 par pr. bredde.
- `verify/duplicate-labels`: fem grupper af kontroller delte etiket ved første kørsel, blandt andet "montør" på tre linjer.
- `verify/skip-link-42px`: springlinket målte 42px i højden, under gulvets 44px.
- `ledger/env-var-ignored`: `ledger.mjs` læser ikke `SITESMITH_LEDGER`. Den bruger `--ledger` eller `~/.sitesmith/renders.jsonl`, så den kommando briefen gav kørte mod en tom hjemmeledger.
- `verify/file-protocol`: `verify.mjs` kan ikke køre mod en `file:`-URL. Den fejler i sit link-tjek med "Protocol file: not supported".
- `gate/journey-script-absent`: `verify.md` foreskriver `node scripts/journey.mjs`, og det script findes ikke i pakken.
- `gate/clean`: gate.mjs endte med at alle tjek kørte og ingen afviste.

## Reconciliation

- `verify/tap-target-24px`: confirmed, og accepteret som den er. Feltet blev hævet fra 20px til 24px, hvilket rammer WCAG 2.2 AA. Det egentlige klikmål er den omsluttende `label`, der er 44px høj og indeholder både felt og tekst, og verify måler input-boksen alene. To forsøg brugt: 20px til 24px, og label som mål. Et 44px afkrydsningsfelt blev fravalgt, fordi det er større end det bogstav det står ved.
- `verify/target-spacing-2px`: confirmed, og bevidst. Arket er én sammenhængende trykt blok, og 24px luft mellem felterne ville opløse netop den blok, som hele retningen hviler på. Felterne er selv 44px eller mere, og afstandskravet i WCAG 2.5.8 er et alternativ til størrelse, ikke et tillæg. Ingen ændring.
- `verify/duplicate-labels`: confirmed og rettet. Etiketterne hedder nu "Montør til station 07" og "Grund for station 07, én linje", og de tre knapper har `aria-label` der navngiver stationen og indeholder den synlige tekst. Verify rapporterer dem ikke længere.
- `verify/skip-link-42px`: confirmed og rettet. Springlinket er nu `inline-flex` med `min-height: 44px`.
- `ledger/env-var-ignored`: confirmed. Kommandoen fra briefen kørte og gav "passed", men mod `~/.sitesmith/renders.jsonl` med 0 poster, hvilket ikke er et svar. Kontrollen blev kørt igen med `--ledger` peget på s13-ledgeren med A's ene post. Den kørsel er den der tæller, og den gav også passed. Begge kommandoer står i afsnittet nedenfor.
- `verify/file-protocol`: confirmed, ikke en fejl i denne build. Der blev startet en lille statisk http-server, og verify blev kørt mod den. Fallbacken står i ## Run notes.
- `gate/journey-script-absent`: confirmed. `journeys/` og `journey.mjs` findes ikke i sitesmith-v3, så journey-kontrakten kunne ikke køres som script. De fire ting en journey skal bevise blev i stedet kørt med playwright direkte mod den serverede side: en synlig ændring, en annoncering i `role="status"`, fejlvejen med beskeden ved sit eget felt, og hele vejen på tastatur med synligt fokus. Det er ikke det samme som at scriptet kørte, og det står derfor som uafklaret nedenfor.
- `gate/clean`: confirmed. Ingen afvisning og ingen manglende dom.

## Kørte kommandoer

```text
node scripts/ledger.mjs new    <build> operate
node scripts/stack.mjs detect  <build>
node scripts/ledger.mjs parse  <build>
node scripts/ledger.mjs measure <build>/index.html
SITESMITH_LEDGER=... SITESMITH_DEPS_DIR=... node scripts/ledger.mjs check <build>
node scripts/ledger.mjs check  <build> --ledger docs/rebuild/s13/ledger/renders.jsonl
node scripts/ledger.mjs commit <build> --ledger docs/rebuild/s13/ledger/renders.jsonl
node scripts/verify.mjs http://127.0.0.1:4319/ --out <build>/.sitesmith/verify --font-stress
node scripts/gate.mjs <build> --skill skills/sitesmith-v3
```

Alle kørt med arbejdsmappe `benchmarks/`, fordi playwright er installeret der og både
ledger.mjs og verify.mjs slår pakken op fra arbejdsmappen.

## Fingeraftryk

```text
fingerprint: light|sans|imageless|flat-surfaces+hairline-separators+tabular-figure-motif
  ground     light, relativ luminans 0,85, kulør 40
  accent     44
  display    sans
  imagery    imageless, 0 procent af første skærm
```

Ledgerens ene tidligere post er mid-dark med grundkulør 39 og accentkulør 6. Grundbåndet er
forskelligt, så kulørprøven på grunden gælder ikke, og accenten ligger 38 grader væk mod en
grænse på 20. Ingen nedlæggelse. Fingeraftrykket blev skrevet ind i s13-ledgeren bagefter.

## Uafklaret

- Journey-scriptet findes ikke i pakken, så de fire krav i journey-kontrakten er bevist med
  playwright i hånden og ikke med det foreskrevne script. Se `gate/journey-script-absent`.
- Afkrydsningsfelterne måler 24px og ikke 44px. Det egentlige mål er den 44px høje label,
  men verify måler input-boksen, og tallet står derfor stadig i dens liste.
- Felterne i arket ligger 2px fra hinanden. Bevidst, se reconciliation.
- Kun 1440, 768, 375 og 320 er set. Der er ikke set noget mellem 900 og 1000, hvor
  tokolonnelayoutet slår om.
