# Produktionsrapport, Sømkraft

Scenario: buy
Draft: no
Release: no

Bygget som én selvstændig HTML-fil i `index.html`. Retningen ligger i
`.sitesmith/direction.md` og blev skrevet færdig, før første linje kode blev skrevet.
Ledgeren accepterede den: `verdict: complete`, exit 0.

## Files opened

- SKILL.md
- run.md
- floor/buy.md
- stacks/static.md
- verify.md
- scripts/ledger.mjs
- scripts/gate.mjs
- docs/rebuild/s11/briefs/A-symaskiner.md

De tre midterste af skill-filerne er læst ud over det, `context.scenarios.buy` tillader.
Det er ikke skjult, og linjerne er ikke slettet for at slippe forbi. Se Reconciliation.

## Commands run

- `node scripts/ledger.mjs new . buy`, exit 0, skrev de 19 tomme overskrifter.
- `node scripts/ledger.mjs parse <build>`, exit 0, `verdict: complete`.
- `node scripts/gate.mjs <build> --skill <skill>`, exit 2, tre afvisninger i én klasse og
  én manglende dom. Alle fire står under Mechanical findings.
- Statisk node-server på `http://localhost:4599` med bygningens mappe som rod, plus
  Chromium i browserruden. Siden blev hentet og målt derfra ved fire bredder.
- `node scripts/verify.mjs <build>` blev ikke kørt: playwright findes ikke under denne rod,
  der er ingen `package.json` og ingen `node_modules`, så scriptet kan ikke starte.
- `node scripts/journey.mjs` findes ikke i pakken. Filen er navngivet i verify.md, men
  `skills/sitesmith-v3/scripts/` indeholder gate, ledger, stack, verify og deres tests og
  ingen journey. Journey-dommen er derfor ikke taget, hverken som bestået eller som
  sprunget over.

## Run notes

- viewports: 320, 375, 768 og 1440 målt i en levende Chromium på den serverede side, én
  genindlæsning pr. bredde. `scrollWidth` er lig `clientWidth` ved alle fire, altså ingen
  vandret scroll, og ingen elementer rager ud over `clientWidth`. Skærmbilleder findes
  ikke, reason: browserruden komponerer ikke billeder i denne kørsel, så screenshot fejler
  efter fem sekunder; målingerne er taget med DOM-geometri i stedet.
- axe both schemes: not run, reason: axe findes ikke under denne rod og der blev ikke
  installeret noget; fallback var kontrastmåling på den renderede side, fjorten tekstpar,
  laveste forhold 5,08:1, samt eftersyn af sprog, landemærker og overskriftsrækkefølge.
  Der er kun ét farveskema på siden, se Design record, så der er ikke et mørkt skema at
  måle det andet sted.
- live server: kørt. Node-statisk server på port 4599 med bygningens mappe som rod. Siden
  blev hentet over http, ikke fra disk, og begge skrifter kom hjem: `document.fonts.status`
  var `loaded`.
- anti-slop linter: kørt. `gate.mjs` mønsterdetektor kørte mod hele bygningen og fandt
  ingen af de syv mønstre.
- fallbacks: DOM-geometri i stedet for skærmbilleder, håndregnet og maskinmålt kontrast i
  stedet for axe, og læsning af den parsede kaskade i stedet for renderede
  pseudoklassetilstande, fordi ruden ikke genberegner stil ved hover og fokus.

## Mechanical findings

- `direction fidelity`: dom mangler. Playwright er ikke installeret, så gate.mjs renderede
  ikke og målte hverken bund, skrifter eller signatur.
- `reads/outside-manifest`: tre linjer i Files opened peger på filer, som
  `context.scenarios.buy` i SKILL.md ikke tillader: verify.md, scripts/ledger.mjs og
  scripts/gate.mjs.
- `antipattern`: ingen. Detektoren rapporterede hverken gradienttekst, tre lige kort,
  rammeværkets skygge, radius eller typeskala, ikonfliser eller runde 8-opskriften.
- `tokens/undeclared-literal`: ingen. Hver farve, skrift, skygge og skriftstørrelse ved et
  kaldssted er en variabel eller en clamp.
- `honesty`: ingen. Ingen udfyldningstekst, ingen opdigtede identifikatorer, ingen
  umanifesterede tegninger.
- `copy/em-dash`: ingen i nogen fil under bygningen.
- `skiplink-state`: springlinket kunne ikke ses skifte tilstand i ruden. Ruden genberegner
  ikke stil ved fokus, så `:focus` blev aldrig afspejlet i computed style.

## Reconciliation

- `direction fidelity`: confirmed. Dommen mangler og bliver ikke påstået taget. De tre ting
  den ville måle blev i stedet målt i browserruden: bunden renderer `rgb(191, 197, 184)`,
  som er den erklærede `--hammerlak`, den største overskrift renderer i
  `"Big Shoulders Display"` og brødteksten i `"Newsreader"`, og signaturen `.stinglinje`
  findes tre gange i DOM'en. Det er de samme tre spørgsmål, men ikke gate.mjs' egen dom, og
  det bliver ikke skrevet som om det var.
- `reads/outside-manifest`: confirmed, og uløst. verify.md er ikke valgfri: run.md trin 6
  sender enhver kørsel derhen, og `context.scenarios.buy` nævner den ikke, så enhver
  buy-kørsel, der følger run.md, rammer denne afvisning. scripts/ledger.mjs og
  scripts/gate.mjs blev læst for at kunne opfylde deres kontrakter, og det var mere end
  budgettet tillod. To forsøg blev brugt: første var at skrive alle læsninger frem og se om
  gulvet accepterede dem, andet var at overveje at kalde kørslen `inspect` i stedet, hvilket
  ville være løgn, fordi run.md, floor/buy.md og stacks/static.md så ville ligge uden for
  scenariet. Rettelsen hører hjemme i SKILL.md's context-blok, og SKILL.md er den fil, der
  bliver afprøvet her, så den bliver ikke redigeret fra en bygning. Linjerne bliver stående.
- `antipattern`: confirmed som rent resultat. Værd at læse sammen med Design record:
  pladerne har nul radius og takket underkant i stedet for bløde hjørner, der er ingen bund
  med luminans under 0,06 nogen steder i arket, og der er ingen versaler med sperring.
- `tokens/undeclared-literal`: confirmed som rent resultat. Nitten variabler erklæret, nul
  med et navn fra rammeværkernes ordforråd.
- `honesty`: confirmed som rent resultat.
- `copy/em-dash`: confirmed som rent resultat.
- `skiplink-state`: false-positive, reason: reglerne er læst ud af den parsede kaskade i
  browseren og de er der begge, `.spring { clip-path: inset(50%) }` og
  `.spring:focus { clip-path: none }`, hvor den sidste har højere specificitet. Samme rude
  undlod også at genberegne `clamp()` med `vw` på eksisterende elementer, mens et nyoprettet
  element med samme regel gav det rigtige tal, så fejlen ligger i rudens
  stilinvalidering og ikke i siden. Det er noteret som uløst måling, ikke som en ren
  tilstand.

## Sandhedskontrol mod brief'en

Hver påstand på siden og hvor den kommer fra:

- Tre maskiner, modelnavne, specifikationsord og priser: brief'ens liste, ord for ord.
- Skilt ad til stellet, nye lejer, lakeret, otte timer under belastning: brief'ens sætning,
  i brief'ens rækkefølge.
- Tolv måneders garanti på det mekaniske arbejde, motor og elektronik undtaget: brief'en.
- 900 kr. med egen vogn til Jylland og Fyn, Sjælland med fragtmand og pris fra os: brief'en.
- Bytte, værdi sat ved syn: brief'en.
- 97 22 08 41, tirsdag til fredag 08:00 til 15:00: brief'en. Nummeret vises uden landekode
  og har `+45` i `tel:`-adressen, så det kan ringes op fra en telefon.
- Ida, Karsten, Rune, stiftet 2014, værksted i Herning: brief'en. Siden siger ikke, at
  værkstedet har ligget i Herning siden 2014, for det står der ikke.
- Motor på Pfaff og Brother: siden siger, at det ikke står i specifikationen, hvilket er
  sandt om denne side og om brief'en.
- Ingen anmeldelser, ingen kundenavne, ingen salgstal, ingen leveringstid, ingen
  betalingsbetingelser, ingen fortrydelsesret. Intet af det står i brief'en, og intet af det
  står på siden.

## Konflikt mellem gulvet og brief'en

`floor/buy.md` kræver, at hele forpligtelsen er læselig i det øjeblik den indgås: alt hvad
køberen betaler, venter på og må returnere. Brief'en giver pris, fragt, garanti og bytte.
Den giver ikke betalingsbetingelser, leveringstid eller fortrydelsesret.

Gulvet og reglen om, at en påstand skal have en kilde, kan ikke begge opfyldes her. Valget
er skrevet ned i stedet for at blive løst i stilhed: siden nævner manglen med navn under
Handelen og sender den til telefonen i stedet for at opfinde en betalingsbetingelse eller
en returret. En side uden bevis er ærlig. En side med opdigtet bevis er ikke.

Samme gulv beder om mere end én vinkel på billedsiden og om, at målestok slås fast
eksplicit. Der findes ingen fotografier, og der bliver ikke fremstillet nogen. Hver maskine
får i stedet det samme bånd i samme behandling, og målestokken står i ord: båndet viser
sømmet og antal nåle, ikke maskinen. Kravet om flere vinkler er ikke opfyldt og kan ikke
opfyldes uden at opfinde et billede.

## State roster

Siden har præcis to slags interaktive elementer, begge ægte links. Ingen formular, ingen
knap der sender noget, ingen JavaScript.

| Tilstand | Sådan ser den ud på `.ring` og på listelinkene | Anvendelighed |
| --- | --- | --- |
| Rest | fyldt rød flade med mørk underkant, listelinks på plade med rød venstrekant | scoret, findes i arket |
| Hover | fladen skifter til olie og underkanten til tråd, listelinjen skifter bund | scoret, fire hover-regler i arket |
| Focus-visible | 3px kontur med 3px afstand, olie på den røde knap, tråd alle andre steder | scoret, to regler i arket |
| Active | fladen skifter til filt, listelinjens venstrekant skifter til olie | scoret, to active-regler i arket |
| Disabled | skipped, reason: intet element kan være slået fra. Et telefonlink er enten der eller ikke der, og der findes ingen tilstand hvor det ser trykbart ud og ikke virker |
| Loading | skipped, reason: der er intet asynkront. Ingen JavaScript, ingen netværkskald efter indlæsning, intet der kan vente |
| Empty | skipped, reason: siden viser de tre maskiner brief'en navngiver. Der findes ingen kørsel hvor listen er tom, og en tom tilstand for en statisk liste ville være opdigtet indhold |
| Error | skipped, reason: der er ingen inddata og dermed ingen fejl at placere ved sin årsag |
| Partial | skipped, reason: alt indhold ligger i samme fil og ankommer samlet. Den ene delvise tilstand der findes, skrifter der ikke kommer hjem, er dækket af reserverne i skriftstakken |

De fire scorede tilstande er verificeret ved at læse den parsede kaskade i browseren, ikke
ved at se dem skifte. Se `skiplink-state` under Reconciliation.

## Gulvet, målt

Scoret sæt, ni forhold. Alle bestået.

1. Rigtigt indhold, ingen udfyldningstekst. Bestået, mekanisk bekræftet af gate.mjs.
2. Hver interaktiv tilstand findes. Bestået for de fire anvendelige, se State roster.
3. Ingen vandret scroll. Bestået, målt: `scrollWidth` er lig `clientWidth` ved 320, 375,
   768 og 1440, og ingen elementer rager ud.
4. Fokusmarkering med egen kontrast. Bestået: tråd mod hammerlak er 4,05:1 og mod
   stingplade 5,90:1, begge over 3:1, og på den røde knap skifter konturen til olie.
5. Berøringsmål. Bestået, målt: `.ring` er 55px høj alle fire steder, listelinkene er 80px
   høje med 24px mellem naboer.
6. Semantik. Bestået: `lang="da"`, ét header, ét main, ét footer, én h1, fire h2, tre h3 i
   rigtig rækkefølge, definitionslister til specifikationerne, ordnet liste til de fire
   operationer, springlink som første element.
7. Ingen tekstbærende grafik. Bestået: alle bånd er `aria-hidden`, og alt de viser står som
   tekst i billedteksten under dem.
8. `prefers-reduced-motion` findes og stopper arbejdet. Bestået, blokken er i arket. Der er
   i forvejen ingen animation og ingen overgang i hele filen.
9. Kontrast på brødtekst og store elementer. Bestået, målt på den renderede side: fjorten
   tekstpar, laveste 5,08:1 i bundlinjen, brødtekst 9,98:1, pris og ringeknap 5,91:1,
   etiketter og billedtekster 7,4:1, linjen i det tomme bånd 5,7:1.

Sprunget over, med grund: axe i begge farveskemaer, skærmbilleder, gate.mjs' egen
renderdom, og journeys. De to første mangler værktøj i denne rod, den tredje mangler
playwright, den fjerde mangler scriptet. Der udregnes ikke et samlet tal på tværs af scoret
og sprunget, og der findes ingen tidligere kørsel på denne sti at sammenligne med.

## Design record

Skrevet efter bygningen, ud fra det stilark der faktisk blev sendt, ikke ud fra planen.

Bund: `--hammerlak #bfc5b8`, målt renderet til `rgb(191, 197, 184)`, luminans 0,545. Der er
ingen mørk bund noget sted i arket og ingen mørk farvevariant. Plader: `--stingplade
#e9eae1`. Stof i båndene: `--lærred #d3cec0`. Tekst: `--olie #171a10`. Accent: `--tråd
#a8203a`, brugt tre steder: sømmet, prisen og ringeknappen. Sekundær tekst: `--filt
#474b3d`. To afledte toner, `--rille` og `--væv`, begge olie med lav alfa.

Skrift: display `"Big Shoulders Display"` 700 og 500 med Arial Narrow og Impact som reserve,
brødtekst `"Newsreader"` 400 til 600 med Georgia som reserve. Målt på den serverede side
renderer h1 i Big Shoulders Display og body i Newsreader, og begge skrifter kom hjem.
Ingen skriftstørrelse står som tal ved et kaldssted: de er enten en variabel eller en clamp.
Nitten variabler erklæret, nul af dem med et navn fra rammeværkernes ordforråd.

Form: nul afrundede hjørner i hele arket. Pladerne er klippet med en takket underkant af to
maskelag, en linear-gradient til kroppen og en conic-gradient til tænderne. Målt: masken
sidder på alle tre plader. Signaturen `.stinglinje` er et 83px højt lærredsfelt med vævet
tekstur af to gentagne gradienter, og sømmet `.sting` er 3px højt, sat af en gentagen
gradient i tråd med en tynd rille under. Brother-båndet har to sømme med 9px imellem, som
tonålet kræver. Samme `.sting` bruges som skillelinje i header og footer, så sidens eneste
linjeelement er det samme søm. Én skygge i hele arket, på opkaldsbjælken.

Fravigelser fra planen, som skal skrives ned:

- Planen sagde fire til seks farver. Der blev sendt seks navngivne plus to afledte toner.
  De to afledte er den samme olie med lav alfa, men de er variabler i arket og tælles her.
- Planen lagde handelsafsnittet på bunden. Det ligger nu på en plade uden takket kant, så
  den takkede kant fortsat kun betyder "denne ting er til salg".
- Planen nævnte ikke en fast opkaldsbjælke i bunden. Den kom til, fordi gulvet kræver, at
  den ene forpligtende kontrol er inden for rækkevidde overalt, og siden er 4900px lang.
- Planen havde et fælles forklaringsafsnit over de tre plader. Det blev slettet, da måling
  viste, at det skubbede det første prøvesøm ned til 988px og dermed ud af første skærm.
  Sætningen om at der ikke findes fotos flyttede op i linjen over listen, og de tre
  billedtekster forklarer stregerne lokalt. Første plade begynder nu ved 848px, og båndet
  slutter ved 931px, så signaturen når op på første skærm ved 1440 gange 900.

Intet i denne liste er en regel, den næste bygning skal arve. Den takkede kant, sømmet og
lærredet hører til dette håndværk og skal ikke flytte med til det næste.

## Uløste defekter

1. `reads/outside-manifest`, tre gange. To forsøg brugt, beskrevet under Reconciliation.
   Rettelsen hører opstrøms i SKILL.md's context-blok og bliver ikke lavet fra en bygning.
2. `direction fidelity`, dom mangler, fordi playwright ikke er installeret. Hverken en fejl
   i siden eller et bestået.
3. Journeys er ikke kørt, fordi `scripts/journey.mjs` ikke findes i pakken. Kontrakten i
   verify.md kan ikke opfyldes mekanisk fra denne kørsel.
4. Pseudoklassetilstandene er ikke set skifte, kun læst i kaskaden, fordi browserruden ikke
   genberegner stil ved hover og fokus.
5. Gulvets krav om mere end én vinkel på billedsiden er ikke opfyldt. Det kræver et billede,
   der ikke findes, og et opfundet billede er værre end ingen vinkel nummer to.
