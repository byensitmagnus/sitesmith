# Produktionsrapport, driftskonsol for Nordbo Fjernvarme

- Scenario: operate
- Flade: driftskonsol, én selvstændig HTML-fil uden framework og uden ekstern JavaScript
- Stak: ren HTML og CSS uden byggetrin. `stack.mjs` blev ikke kørt, fordi brieffen selv
  fastlægger stakken med ordene ingen framework og ingen ekstern JavaScript, og
  `stacks/static.md` er den adapter det svarer til.

## Files opened

- `SKILL.md`
- `run.md`
- `floor/operate.md`
- `stacks/static.md`
- `verify.md`
- `scripts/ledger.mjs`
- `scripts/gate.mjs`

## Retningen, som ledger.mjs læser den

```text
  thesis 1: Et vagtbord. Skærmen handler om tre mennesker: Palle, Sanne og Vagn er den knappe
  thesis 2: Et tværsnit af nettet. Hver station er afstanden mellem fremløb og retur tegnet på én
  thesis 3: En mosaiktavle med faste pladser. Skærmen er betjeningspanelet: 61 felter der aldrig
  built: thesis 3 on the axis of hvor afvigelsen bor
  runner-up argued: thesis 2
  signature: mærkesættet, tre tegnede mærker stemplet på pladen
  risk: der er ingen alarmfarve på skærmen
```

## Run notes

- viewports: 1440, 768, 375 og 320 målt i browseren. `scrollWidth` er lig `clientWidth`
  i alle fire, altså intet vandret overløb. Kolonner: 9, 5, 2, 2.
- axe both schemes: not run. reason: axe er ikke installeret i dette repo, og de to gates
  opgaven beder om kører ikke axe. I stedet er kontrastforholdene regnet på de faktisk
  renderede farver i browseren: brødtekst 14,0:1, fremløbstal 5,2:1, returtal 6,4:1,
  stationsnummer og hjælpetekst 4,8:1, hvid tekst i det sorte bånd 14,0:1. Siden har ét
  farveskema og skifter ikke med `prefers-color-scheme`.
- live server: python http.server på 127.0.0.1:8961. Hver måling og hvert skærmbillede er
  hentet derfra, ikke fra `file://`.
- anti-slop linter: not run. reason: sitesmith-v3 har ingen selvstændig anti-slop-linter.
  Antipattern-detektoren inde i `gate.mjs` kørte og fandt intet: ingen gradient-tekst,
  ingen tre-korts-grid, ingen framework-skala, ingen ikonflise-række, ingen runde-8-opskrift.
- fallbacks: `gate.mjs` blev også kørt med `NODE_PATH` peget på en playwright 1.62.0 fra et
  andet projekt på maskinen, for at få render-checket til at køre. Den kørsel gav ingen
  refusals og ingen manglende verdict. Den bare kommando, uden `NODE_PATH`, melder verdict
  missing på direction fidelity, fordi playwright ikke er installeret i dette repo.

## Mechanical findings

- `gate/report-missing`: `gate.mjs` afviste første kørsel, fordi der ikke fandtes en
  PRODUCTION-REPORT.md med en `## Files opened`-liste.
- `gate/direction-fidelity-withheld`: `gate.mjs` tilbageholdt palette-, type- og
  signaturdommen, fordi playwright ikke kunne indlæses fra dette repo.
- `konsol/favicon-404`: browserkonsollen loggede 404 på `/favicon.ico`, da siden blev
  serveret fra en statisk server.

## Reconciliation

- `gate/report-missing`: confirmed. Rapporten fandtes ikke ved første kørsel. Den er
  skrevet nu, og anden kørsel afviser den ikke.
- `gate/direction-fidelity-withheld`: confirmed. Verdict er ikke en pass og bliver ikke
  præsenteret som en. Den er i stedet efterprøvet i den fallback-kørsel der er beskrevet i
  run notes, hvor grund, display-skrift, brødskrift og `.markering` alle blev fundet som
  erklæret.
- `konsol/favicon-404`: confirmed. Rettet med `<link rel="icon" href="data:,">`, så en
  serveret side ikke logger en fejl der ikke er sidens egen. Konsollen er nu tom.

## Fundet i hånden, ikke af en checker

- Tre montører kunne få to åbne udkald hver, hvis operatøren omfordelte en station til en
  montør der allerede var kaldt ud til en anden. Brieffen giver hver montør én tilstand ad
  gangen, så det var forkert. Formularen afviser nu valget og siger hvilken station
  personen allerede er kaldt ud til, og fejlen står både i opsummeringen og som en
  aktiverbar henvisning ned til radioknappen.
- En åben udkaldsformular voksede pladen og flyttede alle stationer efter den. Det ødelagde
  designets egen påstand om faste pladser. Panelet ligger nu uden for flowet under pladen.
  Målt: samtlige 61 pladers position er byte for byte den samme før og efter åbning.
- Montørlinjen i hovedet manglede et mellemrum mellem navn og tilstand i tekstlaget, så en
  skærmlæser ville få Pallefri. Der er indsat et mellemrum.

## Tilstandsrunden, gået mod den byggede side

- Hvile, hover, focus-visible og aktiv findes på alle knapper, afkrydsningsfeltet,
  radioknapperne og tekstfeltet. Hover er aldrig eneste signal: hver knap har en 2px ramme
  i hvile.
- Deaktiveret: findes ikke, med vilje. Ingen kontrol på siden er slukket, så ingen kontrol
  skal forklare hvorfor. Montører der allerede er kaldt ud er valgbare, og forklaringen
  kommer som en fejl der siger hvor de er.
- Indlæsning: findes ikke. Siden henter intet efter første tegning, og et udkald træder i
  kraft i samme øjeblik knappen aktiveres. Der er intet at vente på og derfor intet at vise.
- Tom: ikke nåbar. Filteret Vis kun stationer der afviger kan ikke give nul, fordi et
  afsluttet udkald ikke ændrer en aflæsning. En tom tilstand ville være kode ingen kan nå.
- Fejl: findes, ved siden af feltet og som en samlet opsummering med `role="alert"` der får
  fokus og linker ned til det felt der fejlede.
- Delvis: findes ikke. Der er ingen bulk-handling og ingen halvt gennemført operation.

## Designoptegnelse, læst ud af den byggede fil

- Fem farver, erklæret som `--skum`, `--kappe`, `--stål`, `--fremløb` og `--retur`. To af
  dem er mættede. Ingen af dem bruges til status. Rødt og blåt betyder fremløb og retur på
  alle 61 plader, også de rolige.
- Ingen skygger, ingen afrundede hjørner, ingen fyldfarve bag en plade. Plader adskilles af
  1px `--stål`, afvigende plader af 2px `--kappe`.
- Skrift: Zilla Slab 700 i h1 og de tre h2. Archivo 400 og 600 til alt andet, med
  tabulartal slået til på body.
- Mærkesættet er tre CSS-regler: `.markering--kasse` er en 2px ramme om returrækken,
  `.markering--kile` er en trekant af border-kanter i pladens hjørne, og
  `.markering--skravering` er en `repeating-linear-gradient` over hele pladen. Teksten
  ligger på udsparede flader i `--skum`, så skraveringen aldrig løber ind under et tal.
- Nul overgange og nul animationer, målt i browseren. Derfor ingen
  `prefers-reduced-motion`-blok: der er intet arbejde at stoppe.
- Afvigelsesreglerne står ét sted i koden, funktionen `afvig`, og er ordret brieffens:
  retur over 45, tryk under 0,3 eller over 0,9, alder over 20 minutter.

## Afvigelser fra planen

- Planen skrev at differenstryk og alder skulle stå i en højrekolonne på pladen. De endte
  under en streg som en fodlinje, fordi højrekolonnen ikke kunne holde bredden ved 148px.
  Retningsoptegnelsen er rettet til det byggede.
- Planen sagde at formularen skulle vokse pladen i højden. Den viste sig at flytte tavlen,
  hvilket er præcis det designet lover ikke sker. Formularen ligger nu i et panel uden for
  flowet. Optegnelsen er rettet.

## Uafklaret

- Siden er 1627px høj ved 1440x900. Alle 61 plader er altså ikke over folden på en 900px
  høj skærm; de sidste halvanden række kræver rul. Det er en reel omkostning ved at vise
  fire tal på hver af 61 plader og lade de afvigende bære deres egne kontroller. To ting
  gør det til at leve med: filteret Vis kun stationer der afviger giver en side på præcis
  900px, og den skærm brieffen beskriver er bred, ikke 900px høj. Ikke løst, skrevet ned.
- Rækker der indeholder en afvigende plade er lige så høje som den plade, så naboerne har
  tom plads under sig. Det kunne fjernes ved at lade afvigende plader spænde over to
  rækker, men så flytter stationerne sig, og faste pladser er hele designet. Valgt bevidst,
  ikke løst.
- `direction fidelity` i den bare gate-kommando er en manglende verdict, ikke en pass. Se
  run notes.
