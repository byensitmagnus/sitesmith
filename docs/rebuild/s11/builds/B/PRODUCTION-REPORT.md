# Produktionsrapport, driftskonsol for Nordbo Fjernvarme

- Scenario: operate
- draft: nej
- release: nej

Bygget: `index.html`, én selvstændig fil uden byggetrin. `node scripts/stack.mjs detect .`
svarede at intet på disken navngiver en stack, og run.md afsnit 12 sender den til ren HTML
og CSS uden byggetrin. Det er også det briefen beder om.

## Files opened

- SKILL.md
- run.md
- floor/operate.md
- stacks/static.md
- verify.md
- scripts/ledger.mjs
- scripts/gate.mjs

`verify.md` blev åbnet, fordi `run.md` trin 6 siger at den skal åbnes, men `verify.md` er
kun erklæret for scenariet `inspect`, ikke for `operate`. `scripts/ledger.mjs` og
`scripts/gate.mjs` blev åbnet for at læse deres afvisningskontrakt, før der blev skrevet
kode. Ingen af de tre er erklæret for `operate`. Manifestet er ikke rettet, fordi det ligger
i det skill, der er under afprøvning, og linjerne er ikke slettet, fordi filerne faktisk
blev åbnet. Se Unresolved nedenfor.

## Direction

- thesis 1: En vagttavle: hele nettet som 61 felter, hvert felt en station med sin tilstand.
- thesis 2: En vagtjournal, der skriver sig selv: skærmen er vagtens løbende protokol.
- thesis 3: Et instrument: alarmen er en afstand, ikke en kategori.
- built: thesis 3 on the axis of afstand til grænsen
- runner-up argued: thesis 2
- signature: `.vandskala`, 61 vandrette spænd fra retur til fremløb på én celsius-akse
- risk: 56 af 61 stationer har intet navn i det øverste felt
- originality pass: fremløb og retur blev slået sammen fra to skalaer til ét spænd på én akse

## Run notes

- viewports: delvist. Ingen skærmbilleder. Siden blev serveret på en lokal statisk server og
  målt i en rigtig browser for vandret overløb ved 320, 375 og 768 pixels bredde ved at
  binde dokumentets bredde og læse `getBoundingClientRect` på hvert element uden for
  rulleområdet. Resultatet var 0 elementer uden for papiret og `scrollWidth` lig bredden i
  alle tre tilfælde. reason: `scripts/verify.mjs` var ikke en del af denne opgaves porte, og
  browserruden kunne ikke komponere billeder, så der findes ingen billedfiler at vise frem.
- axe both schemes: not run. reason: `scripts/verify.mjs` blev ikke kørt, og der er ingen
  axe-installation på maskinen. Siden har kun ét farveskema, så der ville kun være ét at
  køre i. Kontrastforholdene er i stedet regnet i hånden ud af paletten og står under
  Kontrast nedenfor.
- live server: kørt. `python -m http.server` på 127.0.0.1 port 8944, med filen hentet over
  http og de fem forløb gennemspillet i browseren. Ingen fejl i konsollen.
- anti-slop linter: kørt. `node scripts/gate.mjs` med tankestregsforbuddet, tokenafdriften og
  antimønster-detektoren. Ingen af de tre afviste. Resultatet står under Mechanical findings.
- fallbacks: none.

## Kontrast

Regnet på paletten efter WCAG-relativ luminans, ikke målt af et værktøj.

- `--pen` #1c2320 på `--papir` #eceee4: 13,7 mod 1.
- `--penlet` #59614f på `--papir`: 5,5 mod 1.
- `--udslag` #b32d16 på `--papir`: 5,4 mod 1, altså også nok som brødtekst og ikke kun som
  grafik.
- `--pen` på `--margen` #dcdfd1: 11,8 mod 1.
- `--penlet` på `--margen`: 4,8 mod 1.
- `--papir` på `--pen`, som er den primære knap: 13,7 mod 1.
- Fokusrammen er `--pen` i 2 pixel med 2 pixels afstand og står altid på `--papir` eller
  `--margen`, altså mindst 11,8 mod 1 i sig selv.
- `--rude` #c4c9b4 på `--papir` er 1,4 mod 1. Den bærer ingen betydning: den er ruderne på
  skriverpapiret og aksernes delestreger. Alt, der betyder noget, er `--pen` eller `--udslag`.

## Model findings

Fundet ved gennemgang i browseren, før portenes udskrift blev læst.

- `overloeb/aksemaerker`: mærkerne i akseenderne var centreret om deres position, så det
  første og det sidste stak uden for papiret og kunne give vandret rulning på en smal skærm.
  Rettet: enderne bindes til kanten i stedet for at centreres.
- `overloeb/raekkemaerke`: mærkatet i vandskalaens margen stod som "Station 07" og var
  bredere end margenen ved 320 pixel. Rettet til stationsnummeret alene, hvilket også er det,
  direction-optegnelsen faktisk lovede.
- `overloeb/knaptekst`: knappen "Send montør til Station 07" kunne ikke ombryde. Rettet med
  ombrydning og en maksimal bredde.
- `overloeb/springlink`: springlinket lå på left minus 9999 pixel. Ingen målt rulning, men
  teknikken kan give overløb i andre motorer. Erstattet med en fast placering og en
  forskydning, der falder på plads ved fokus.

## Mechanical findings

- `reads/outside-manifest`: tre linjer i Files opened peger på filer, som scenariet `operate`
  ikke erklærer: `verify.md`, `scripts/ledger.mjs` og `scripts/gate.mjs`.
- `direction/signature-not-declared`: `.sitesmith/direction.md` havde en Signature-sektion,
  men ingen linje der begyndte med `Signature:`, så porten kunne ikke læse hvilken vælger
  bygningen var tegnet omkring. Fundet på første kørsel.
- `direction-fidelity-withheld`: playwright er ikke installeret, så porten gengav ingenting,
  og dommene over bund, skrift og signatur mangler.

## Reconciliation

- `direction/signature-not-declared`: confirmed. Rettet i første forsøg. Optegnelsen bærer nu
  en `Signature:`-linje, der navngiver `.vandskala`, og porten afviser den ikke længere.
- `reads/outside-manifest`: confirmed, uløst. To forsøg brugt. Første forsøg var at skrive
  hvorfor de tre filer blev åbnet; det ændrer ikke afvisningen. Andet forsøg ville være at
  rette manifestet i `SKILL.md`, og det ligger i det skill, som denne bygning afprøver, så
  det bliver ikke rørt. Den tredje mulighed, at slette linjerne, forbyder afvisningsteksten
  selv. Se Unresolved.
- `direction-fidelity-withheld`: confirmed. Verdikten mangler og bliver ikke påstået kørt.
  Der er ikke installeret en browsermotor for at få den, fordi `stacks/static.md` siger at
  denne stack ikke skal have tilføjelser den ikke er blevet bedt om. Bunden, skrifterne og
  signaturen er i stedet aflæst manuelt i den kørende side: bunden gengiver
  rgb(236, 238, 228), den største overskrift gengiver "Martian Mono", brødteksten gengiver
  "IBM Plex Sans", og `.vandskala` findes i DOM med 61 rækker, hvoraf 5 er mærket ude. Det
  er en manuel aflæsning og ikke portens dom.

## Unresolved

- `reads/outside-manifest`, 3 linjer. Der er en modstrid inde i selve skillet:
  `run.md` trin 6 pålægger enhver kørsel at åbne `verify.md`, mens `SKILL.md` kun erklærer
  `verify.md` for scenariet `inspect`. Enhver bygning, der følger run.md og navngiver sit
  eget scenarie ærligt, vil blive afvist her. De to andre linjer er portenes egne scripts,
  som blev læst for at kende deres kontrakt. Bygningen bærer afvisningen frem for at skjule
  den.

## State roster

Gået igennem mod den byggede side, ikke mod planen.

- Rest, hover, active: alle knapper og alle valgfelter har alle tre, og hover er aldrig den
  eneste markering.
- Focus-visible: fælles regel på links, knapper, felter og rulleområdet, 2 pixel `--pen` med
  2 pixels afstand.
- Disabled: findes ikke på siden. Ingen kontrol ser trykbar ud uden at være det, og listen
  af montører i en omfordeling udelader den, der allerede har udkaldet, frem for at vise den
  som slukket.
- Loading: findes ikke. Der er ingen ventetid at dække: alt regnes lokalt og skiftet sker i
  samme billede som klikket.
- Empty: to stykker. Udkaldslisten uden udkald er en invitation, ikke en undskyldning, og
  afvigelseslisten uden afvigelser siger at næste runde lander om få minutter.
- Error: formularens to felter fejler hver for sig med beskeden ved feltet, og en samling
  øverst i formularen med `role="alert"`, som tastaturet når først, og hvis punkter fører ned
  til det felt, der fejlede.
- Partial: hver runde aflæsninger melder hvor mange af 61 stationer der svarede, og
  navngiver dem der ikke gjorde. Det står både i hovedets "Seneste runde" og i beskeden.

## Design record

Skrevet ud af den stilart, der faktisk blev sendt, ikke ud af planen.

- Bund og flader: `--papir` #eceee4 på html og body. `--margen` #dcdfd1 på trykbåndet,
  tabelhovedet, tabelfoden, beskedbjælken og formularen. Ingen tredje flade, ingen skygger,
  ingen løftede kasser. `box-shadow` optræder ikke i stilarket.
- Blæk: `--pen` #1c2320 til al brødtekst, alle tal, alle grænselinjer og alle normale mærker
  i vandskalaen. `--penlet` #59614f til enheder, kolonnehoveder og selve vandspændene.
- Signal: `--udslag` #b32d16 optræder 12 steder i stilarket og hvert eneste af dem hænger på
  en overskredet grænse: mærket i vandskalaen, spændet og dets kolde ende, rytteren og dens
  nummer på de to små skalaer, tallet og årsagen i afvigelsen, rækken i registeret, tælleren
  i hovedet, feltrammen ved en formularfejl og fejlteksterne. Farven bruges ikke på en eneste
  overskrift, knap eller kant, der ikke betyder overskredet.
- Hjørner: `border-radius` er 0 overalt. Der er ingen `--radius`-værdi i stilarket.
- Skrift: `--skrift-vis` er "Martian Mono" og sidder på h1, h2, h3, enhedsteksterne,
  aksetallene, mærkaterne i skalaerne, tabelhovedet, tabelunderskriften, formularetiketterne
  og montørernes navne. `--skrift-brod` er "IBM Plex Sans" og bærer alt læsestof, alle tal og
  alle kontroller, med tabulære cifre slået til på body. Ingen versalisering nogen steder,
  ingen udspærring nogen steder.
- Skriftgrader: 11, 13, 15, 17, 22 og 28 pixel, plus 16 pixel på felter. Ingen af dem er trin
  fra et frameworks standardskala, og porten afviste ingen tokenafdrift.
- Geometri: rækkehøjden i vandskalaen er 6 pixel, 5 på små skærme. Feltets vandrette linjering
  er en gentagen gradient hver 60. pixel, altså hver tiende station. Skalaernes lodrette
  delestreger er kasser på 1 pixel.
- Bevægelse: der er ingen overgange og ingen animationer i stilarket. Det eneste, der ændrer
  sig af sig selv, er aflæsningernes alder, som regnes om hvert femte sekund, og
  aflæsningsrunden, der lander hvert femte minut og nulstiller de stationer, der svarer.
  Uret står stille, mens et felt har fokus. `prefers-reduced-motion` slår overgange fra på
  mærkerne og rulleadfærd fra på dokumentet.
- Afvigelse fra planen: planen sagde at det udslagne mærke i vandskalaens margen skulle bære
  stationens navn. Det bærer nummeret, fordi navnet ikke er i margenen ved 320 pixel. Det er
  den eneste forskel mellem optegnelsen og koden.
- Ingen af de fem udseender i SKILL.md afsnit 5 er landet her ved et uheld, og ingen af dem
  er landet her ved en beslutning heller. Bunden er lys og ikke nærsort, displayskriften er
  en mono og ikke en serif med høj kontrast, der er ingen versalisering med udspærring, der
  er ingen tre-kolonners kortgitter, og der er intet stort tal med en gradient bag.
