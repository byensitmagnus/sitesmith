# Produktionsrapport, Sømkraft

- Scenario: buy
- draft: no
- release: no
- Target: docs/rebuild/s13/builds/A
- Stack: ingen adapter fundet af stack.mjs, så ren HTML og CSS uden byggetrin, jævnfør run.md afsnit 12.

## Files opened

- SKILL.md
- run.md
- floor/buy.md
- stacks/static.md
- verify.md
- scripts/ledger.mjs
- scripts/gate.mjs
- scripts/verify.mjs
- scripts/stack.mjs

Uden for pakken blev briefen `docs/rebuild/s11/briefs/A-symaskiner.md` læst, samt
`benchmarks/package.json` og `benchmarks/serve.mjs` for at finde playwright og en
lokal server.

## Retningen, som ledger.mjs parse skriver den ud

- thesis 1: En prøvekørselsrapport man kan købe fra.
- thesis 2: Et sømprøvekort.
- thesis 3: Værkstedsgulvet set ovenfra.
- built: thesis 2 på aksen hvad køberen selv dømmer maskinen på
- runner-up argued: thesis 1
- signature: `.sting`, sømprøven, tegnet i CSS og SVG
- risk: en sektion der opregner hvad siden ikke fortæller
- fingerprint: mid-dark|sans|imageless|tabular-figure-motif, ground hue 39, accent hue 6
- anti-repeat: ingen veto. Ingen waiver brugt, ingen Brief-pinned linje i posten.

## Run notes

- viewports: 375, 768 og 1440 px optaget med scripts/verify.mjs mod http://localhost:4477/. Skærmbilleder i `.sitesmith/verify/`.
- axe both schemes: kørte i både light og dark, 0 overtrædelser i sidste kørsel. Første kørsel gav 12 knuder color-contrast i begge skemaer, rettet og kørt igen.
- live server: benchmarks/serve.mjs på port 4477 med byggemappen som rod. Port 4399 var optaget, derfor 4477.
- anti-slop linter: scripts/gate.mjs kørt mod byggemappen med --skill mod sitesmith-v3. Antipattern-detektoren fandt intet at afvise.
- fallbacks: none

## Mechanical findings

- `axe/color-contrast-seddel`: 12 knuder, kridt tekst på manila mærkeseddel, 1,78:1 mod kravet 4,5:1, i begge farveskemaer.
- `verify/tap-target-spring`: springlinket målte 26 px høj i hviletilstand, under 44 px.
- `verify/tap-target-telefon`: telefonlinket i toppen målte 14 px højt, under 44 px.
- `verify/tel-repeated`: fem kontroller peger på samme mål, tel:+4597220841, med forskellige etiketter.
- `verify/label-wrap-375`: opkaldskontrollen brydes over to linjer ved 375 px.
- `gate/report-missing`: ingen PRODUCTION-REPORT.md ved første kørsel af gate.mjs.

## Reconciliation

- `axe/color-contrast-seddel`: confirmed. Årsagen er præcis den specificitetsfælde stacks/static.md advarer mod: `.malet a` med (0,1,1) slog `.seddel` med (0,1,0), så sedlen arvede den lakerede tekstfarve. Rettet ved at binde sedlen som `.malet a.seddel` og hæve hover, active og focus-visible til samme specificitet. Fundet af maskinen, ikke af mig, før kørslen.
- `verify/tap-target-spring`: confirmed. Springlinket fik min-height 44px og flexcentrering i hviletilstand, ikke kun ved fokus. To forsøg brugt: første forsøg satte kun målet på :focus, og måleren læser hviletilstanden.
- `verify/tap-target-telefon`: confirmed. Telefonlinket i toppen er nu inline-flex med min-height 44px.
- `verify/tel-repeated`: false-positive, reason: floor/buy.md tillader udtrykkeligt at den forpligtende kontrol gentages ved afslutningen af hver sektion, og de fem etiketter er forskellige med vilje, fordi hver enkelt navngiver den maskine opkaldet handler om. Et fælles mål med forskellige etiketter er her oplysning, ikke forvirring.
- `verify/label-wrap-375`: false-positive, reason: etiketten "Ring om Juki DDL-8700 på 97 22 08 41" navngiver både maskinen og nummeret, og ved 375 px er to linjer den ærlige konsekvens af det. Alternativet er at fjerne maskinnavnet fra kontrollen, hvilket ville gøre fem ens kontroller ud af fem forskellige.
- `gate/report-missing`: confirmed. Rapporten er skrevet, og gate.mjs er kørt igen bagefter.

## Vurdering med anvendelighed

| Dimension | Tilstand | Resultat |
| --- | --- | --- |
| Gulvet, tilgængelighed og robusthed | scored | 0 blokerende fund i sidste kørsel af verify.mjs, axe rent i begge skemaer, 9 tastaturstop pr. bredde, 0 døde links, 0 fejlede requests |
| Købsgulvet, floor/buy.md | scored | Otte forpligtelser gennemgået. Syv opfyldt. Én kan ikke opfyldes, se konflikten nedenfor |
| Ærlighed i påstande | scored | Ingen tal, navne, anmeldelser eller garantier på siden ud over briefens egne. En sektion navngiver det der mangler og hvorfor |
| Anti-gentagelse, ledger.mjs | scored | Ingen veto. Fingeraftrykket er ikke i hovedbogen, og seed-opskriften er ikke ramt |
| Rejser, journeys/ | skipped | Der er ingen journeys/-mappe og ingen tilstandsændrende flow på siden. Alt der kan gøres er at følge et anker eller ringe op. En rejsetest ville kræve en handling siden ikke har |
| Mørkt farveskema som selvstændigt design | skipped | Siden har ét bevidst udseende og skifter ikke med prefers-color-scheme. Axe kørte alligevel i begge skemaer, og resultatet er det samme |

Nævneren er de fire scorede dimensioner. De to sprungne indgår ikke, og der udregnes
ingen samlet karakter hen over et blandet sæt.

## Konflikt skrevet ned frem for at blive løst i tavshed

floor/buy.md kræver mere end én vinkel på objektet, behandlet ens på tværs af kataloget.
Briefen siger at der ikke findes fotografi, og at intet må stå som sandt ud over de
oplyste fakta. En anden vinkel ville enten være opdigtet eller være den samme tegning
drejet. Siden har derfor én tegnet visning per maskine plus navneskiltet, behandlet ens
på alle tre, og hver tegning skriver selv at den er en tegning og ikke i målestok.
Manglen er ikke skjult og er ikke løst.

## Tilstande, gået efter på den byggede side

Rest, hover, focus-visible og active findes på alle fem kontroller og på mærkesedlerne.
Disabled og loading findes ikke, fordi der ikke er nogen kontrol der kan være
utilgængelig eller undervejs: siden har ingen formularer, ingen JavaScript og ingen
tilstand at vente på. Empty findes ikke som en tilstand, fordi listen ikke kan blive tom
uden en filtrering siden ikke har. Error findes ikke af samme grund. Partial er ikke
relevant på en enkelt statisk fil uden asynkrone dele.

## Uløst

Intet defekt er efterladt uløst. De to punkter der stadig står i verify.mjs' liste over
det målte er dispositioneret ovenfor som bevidste valg.

## Designoptegnelse, skrevet fra den leverede kode

- Bund: `--manila` #b9a888, mærkesedlens karton, relativ luminans 0,401.
- Malede flader: `--hammerlak` #2f3a33 med `--kridt` #e7e1d4 ovenpå, 9,1:1.
- Brødtekst: `--jern` #191c1a på manila, 7,3:1.
- Priser på navneskiltet: `--garn` #8f2318, 3,7:1 mod manila, sat i 2,1rem Bevan, som er
  stor tekst og over 3:1. Garn bruges aldrig til brødtekst.
- Fokusring: 3px `--garn` på lys bund, 3px `--olie` på malet bund, sat via en
  `--fokus`-variabel der skifter i `.malet`.
- Skrift: Bevan til overskriften og de tre navneskilte, Newsreader til alt andet.
  Ingen versale etiketter nogen steder, ingen letter-spacing ud over minus 0,012em på
  overskriften.
- Signatur: `.sting`, tre SVG-tegninger inde i specifikationen, på linje med rækken de
  tegner.
- Hjørner: 0 overalt. Skygge kun på mærkesedlerne, 0 7px 16px.
- Afvigelse fra planen: ingen i farver, skrift eller struktur. To rettelser i koden efter
  første måling, begge specificitet og målstørrelse, ingen af dem en ændring af retningen.
