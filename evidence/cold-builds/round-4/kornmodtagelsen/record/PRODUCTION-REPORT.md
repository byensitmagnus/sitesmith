# Produktionsrapport, Kornmodtagelsen, Hobro Andel

- Scenario: operate
- draft: no
- release: yes
- Overflade: én skærm, `index.html`, ren HTML og CSS uden byggetrin
- Bygget: 2026-08-02

## Hvad der blev bygget

Indvejningsskærmen i vægthuset. Én modtagemand ser vognen på broen, taster spydprøvens tre
aflæsninger og anviser lasten til en celle eller til tørreriet fra samme skærm. Anvisningen
kan fortrydes, indtil vognen kører af broen, og låses derefter.

Tese 2 blev bygget: en cellevæg man kan pege en vogn mod. Aksen er, at det skærmen gør
størst skal være det manden afgør, ikke det maskinen måler. Tese 1, den levende brovægt som
skærmens største tal, blev argumenteret i direction-record og fravalgt, fordi vægten er det
eneste tal på pladsen der allerede er afgjort.

## Files opened

- `SKILL.md`
- `run.md`
- `look.md`
- `floor/operate.md`
- `stacks/static.md`
- `verify.md`
- `scripts/stack.mjs`
- `scripts/components.mjs`
- `scripts/ledger.mjs`
- `scripts/verify.mjs`
- `scripts/critique.mjs`
- `scripts/journey.mjs`
- `scripts/gate.mjs`

Pakken blev listet med `ls`, men `redesign.md`, `motion.md`, `delegation.md`, `floor/buy.md`,
`README.md`, `THIRD-PARTY-NOTICES.md` og `agents/openai.yaml` blev ikke åbnet.

## Run notes

- viewports: 375, 768 og 1440 px optaget i `.sitesmith/shots/`, plus en reduced-motion-optagelse ved 1440
- axe both schemes: ja, kørt i både light og dark via `@axe-core/playwright`, 0 overtrædelser i begge
- live server: ja, `node serve.mjs 4180` fra byggemappen, alle svar HTTP 200, 0 døde links
- anti-slop linter: ja, `scripts/gate.mjs` kørt mod byggemappen med `--url http://localhost:4180/`
- fallbacks: none
- ledger: `check` kørt og bestået, `commit` bevidst ikke kørt, fordi den skriver uden for
  byggemappen til `~/.sitesmith/renders.jsonl`. Næste kørsel ser derfor ikke dette
  fingeraftryk, og det er en kendt konsekvens af at holde alt inde i leverancen.

## Kontroller og hvad de sagde

| kommando | resultat |
| --- | --- |
| `verify.mjs http://localhost:4180/` | PASS, intet blokerende. 0 axe-overtrædelser i begge farveskemaer, 0 konsolfejl, 0 døde links, 0 px vandret overløb ved 375, 768 og 1440, 0 fund i reduced-motion-passet, 17 tastaturstop med synligt fokus |
| `critique.mjs packet` og `lock` | seks svar skrevet mod billederne alene, låst til render `4ad50a997d85f806` med én korrektionsrunde |
| `journey.mjs builds/K/journeys` | 1 af 1 bestod, 22 hævdelser |
| `ledger.mjs check` | passed efter tre afviste paletter, fingeraftryk `mid｜sans｜imageless｜hairline-separators+tabular-figure-motif` |
| `gate.mjs builds/K --url ...` | hver kontrol kørte, og ingen afviste |

## Rejsen, og hvad den beviser

`journeys/anvisning.spec.mjs` kører den rigtige vej gennem skærmen og hævder de fire ting
`verify.md` kræver.

1. Noget ændrede sig synligt: loggen gik fra 6 til 7 rækker, celle 3 gik fra 745 til 697 t
   plads, og lastens bånd blev tegnet ind i cellen.
2. Det blev annonceret: `.melding` er `role="status"` og skiftede til "Anvist til celle 3".
3. Fejlvejen kørte: "tolv komma tre" i vandfeltet giver en besked i samme `.felt` som
   feltet, `aria-invalid`, `aria-describedby` til beskeden, og en samling med `role="alert"`
   der får fokus og linker ned til feltet.
4. Hele vejen blev gået på tastaturet alene, med synligt fokusmærke på alle syv stop frem
   til første felt og på Anvis-knappen, inden den blev trykket.

Den hævder også, at anvisningen låses, når vognen kører af broen, og at broen læser 0 kg
mellem to vogne.

## Kritikken, og hvad den fandt

Kritikken blev skrevet mod billederne, med direction-record lukket, og den fandt noget:
øjet landede først på den levende vægt på 58 px og ikke på cellevæggen, hvilket modsagde
buildets egen akse. Korrektionsrunden satte broens tal ned til 40 px og meldingen over
cellerne op til 27 px. Den fandt også, at køen og anvisningslisten er den samme
administrationsrække to gange, og at midterblokken i "På broen" har luft der ikke laver
noget. Begge dele står, se defekterne nedenfor.

Rækkefølgen var forkert på ét punkt, og det skal stå her: verify-rapportens PASS blev læst,
før billederne blev åbnet første gang. `verify.md` siger det modsatte, og grunden er, at man
derefter læser billedet som en bekræftelse. Kritikken blev skrevet efter, mod pakken alene,
men den blev ikke skrevet i uvidenhed om at målingerne var grønne.

## Mechanical findings

- `verify/duplicate-label-nav`: fire par kontroller med samme etiket, sidehovedets genveje og bundens genveje, ved alle tre bredder
- `verify/measure-ukendt-27ch`: `dd.ukendt` i vejesedlen måler 27 tegn pr. linje ved 1440, under båndet 45 til 80
- `verify/measure-skala-41ch`: de tre afsnit i `.skala` og `#lasten-note` måler 41 tegn pr. linje ved 1440
- `ledger/ground-veto`: tre paletter afvist i træk, først en lysegrøn plade 12 enheder fra en tidligere kørsel, så en grågrøn 2 enheder fra en anden, så en blågrå 7 grader fra en tredje
- `look/first-look-was-the-weight`: kritikkens eget fund, den levende vægt tog første blik fra cellevæggen
- `look/two-rows-of-the-same-shape`: køen og anvisningslisten er samme rækkeform to gange

## Reconciliation

- `verify/duplicate-label-nav`: false-positive, reason: gentagelsen er skallen. `gate.mjs` afviser en side uden nav og uden footer, og de fire genveje peger på skærmens egne afsnit. To identiske etiketter, der fører samme sted hen, er ikke to hensigter.
- `verify/measure-ukendt-27ch`: confirmed. Sætningen om at nettoen først kendes ved udkørsel står i en smal kolonne. Den blev venstrestillet i korrektionen, men kolonnen er stadig smal, og det er en defekt denne build bærer.
- `verify/measure-skala-41ch`: false-positive, reason: 41 tegn er en marginspalte og ikke brødtekst. Båndet 45 til 80 er sat for løbende tekst; en 12 px legende ved siden af en tegning læses i spring og ikke i linjer.
- `ledger/ground-veto`: confirmed, og den kostede tre runder. Pladen endte akromatisk grå, hvilket er hvad galvaniseret stål er, men valget blev truffet af hvad der var ledigt og ikke kun af hvad materialet er.
- `look/first-look-was-the-weight`: confirmed, rettet i den ene korrektionsrunde kritikken tillader.
- `look/two-rows-of-the-same-shape`: confirmed, ikke rettet. Køen og anvisningerne har samme rækkeform, fordi de er samme slags oplysning i to tider, men det betyder at to af sidens fem blokke ligner hinanden.

## Defekter denne build bærer

- Nettovægten er ukendt, mens vognen står på broen, så pladskontrollen regnes på bruttovægt.
  Det er sandt og konservativt, og det betyder, at en celle med for eksempel 30 t plads ikke
  tændes til en last der reelt er 28 t. Skærmen skriver det, men den kan ikke gøre det bedre
  uden en taravægt, og det er det ene spørgsmål der skulle have været stillet.
- Vejesedlens netto-sætning står i en 27 tegn bred kolonne ved 1440.
- Køen og anvisningslisten deler rækkeform.
- Der er ingen mørk visning. Skærmen står i et vægthus med dagslys fra 06.00, men vagten
  slutter ved sidste vogn, og i august er det efter mørkets frembrud. En natvisning er ikke
  bygget, og den er ikke afvist: den er ikke afgjort.
- Der er ingen loading-tilstand, fordi intet på skærmen venter på noget. Det er ikke et
  manglende arbejde, men det er et hul i den seks-tilstands-liste `verify.md` fører.

## Tilstandene, gået efter den byggede side

- Rest, hover, focus-visible og active findes på alle knapper, felter og links.
- Disabled: `#hold-knap` og prøvefelterne får `disabled`, når broen er tom, og skærmen
  skriver hvorfor i meldingen. Ingen kontrol er slukket uden en grund på skærmen.
- Loading: findes ikke, se defekterne.
- Empty: broen mellem to vogne, hvor aflæsningen står på 0 kg, cellerne står dæmpede, og
  knappen hedder "Giv grønt til" den næste vogn i køen.
- Error: ugyldige aflæsninger, med besked ved feltet og en samling der får fokus.
- Partial: en prøve, der ikke er godkendt endnu, hvor væggen holder alle celler dæmpede og
  meldingen siger hvad der mangler.

## Designrecord, skrevet fra den leverede stilart

- Farver, tolv navngivne værdier: `--zink #b2b6b7` (bund, galvaniseret plade), `--dis
  #d0d5d6` (løftede strimler), `--tryk #1b2428` (al tekst), `--beton #364042` (anden tekst),
  `--rille #98a0a2` (hårstreger), `--hvede #c9a227`, `--byg
  #c3bd82`, `--rug #7d6a55`, `--havre #9aa06d` (kornet i cellerne, kun der), `--lampe
  #0f6a2a` (kan tage lasten, kun der), `--stop #98291f` (afvist eller over grænse, kun der),
  `--damp #1f5763` (tørreri, kun der).
- Skrift: "Big Shoulders Display" 500 og 700 til h1, celletal, meldingen og brovægten;
  "Atkinson Hyperlegible" 400 og 700 til alt andet, med tabulære cifre på alle tal. Trin 12,
  16, 21, 27 og 40 px. Ingen versaler som stiltræk, ingen udspærring.
- Form: fem strimler i fuld bredde med samme indrykning, så alt blæk starter på x=40 ved
  1440. Ingen kort, ingen afrundede felter ud over 2 px på knapper og felter, én skygge på
  en hårstregs højde under de løftede strimler.
- Signatur: `.siloer`, otte beholdere plus tørreriet i opstalt på fælles gulvlinje, tegnet i
  skala efter kapacitet, fyldt med en hatch pr. afgrøde. Arealet af kornet i tegningen er
  tonnagen, cirka 12 kvadratpunkter pr. ton i alle fire cellestørrelser.
- Anden aflæsning: `.dagsvand`, dagens fjorten vandprocenter mod grænsen 15,0, under første
  skærm, tegnet af andre tal end signaturen.
- Svar på risikoen: `.melding`, linjen over væggen, som siger med ord hvad væggen tegner.
- Afvigelser fra planen: paletten blev lagt om tre gange efter `ledger.mjs`, og pladen endte
  akromatisk i stedet for grågrøn. Brovægten blev sat ned fra 58 til 40 px efter kritikken.
  Prøvekortet mistede sin ramme og blev en spalte med en lodret hårstreg, fordi en ramme med
  egen indrykning ville have brudt sidens rygrad. Førsteskærmen blev bygget om to gange,
  fordi cellevæggens knapper første gang lå under folden.
- Ingen af disse er regler næste build skal arve. Den akromatiske bund er dette buildets
  svar på en optaget nabo, ikke en husstil.

## Antagelser, som en læser må udfordre

- Nettovægten kendes ikke, mens vognen står på broen. Pladsen regnes derfor på bruttovægten.
- Modtagemanden taster de tre aflæsninger; brevet siger, at prøven læses, ikke af hvem.
- Én vogn ad gangen på broen, og køen er ankomstrækkefølgen.
- Anvisningen kan fortrydes, mens vognen står på broen, og låses, når den kører af. Brevet
  siger kun det sidste.
- Alle navne, nummerplader, vægte, tider, kapaciteter og fyldninger er demodata og er mærket
  som demodata i bunden af siden.

## Det spørgsmål der ville have været stillet

Kender vægten lastens nettovægt, før vognen kører af broen, for eksempel fra en gemt
taravægt på vognmandens bil, eller skal anvisningen tages på bruttovægten? Default, som er
det der er bygget: bruttovægten, med det skrevet på skærmen ved siden af tallet.

Og som asset-spørgsmålet: må vi få et fotografi af cellevæggen med nummereringen, set fra
vægthusets vindue? Skærmen fungerer uden, og tegningen ville kunne matche det, man ser ud af
vinduet.
