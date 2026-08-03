# Produktionsrapport, Klinke & Datter

Scenario: buy

Surface: forside. Én selvstændig HTML-fil, al CSS inline, ingen ekstern JS, ét Google
Fonts-kald. `stack.mjs detect .` navngav ingen adapter, så run.md afsnit 12 gælder: ren
HTML og CSS uden byggetrin.

## Files opened

- `SKILL.md`
- `run.md`
- `floor/buy.md`
- `stacks/static.md`
- `verify.md`

Uden for pakken: brieffen `docs/rebuild/s15/BRIEF.md`. Scripts blev kørt, ikke læst ind.

## Retningen, som den blev valgt

Tre teser blev skrevet ned, sagen for nummer 1 blev ført helt igennem, og nummer 2 blev
bygget.

- tese 1: En perforeret rulle, man kan læse. Siden er selv en musikrulle.
- tese 2: Den tilstandsrapport, kunden får udleveret. Siden har form som det dokument, de
  1.850 kr. faktisk køber.
- tese 3: Værkstedets dagbog. Fire pladser og ventetiden.
- bygget: tese 2, på aksen hvad den besøgende faktisk står og skal beslutte, fordi arvingen
  skal tage stilling til ét køb, en halv dag og 1.850 kr. for en dom på skrift, mens en
  rulle til 340 kr. ikke kan svare på, om instrumentet kan reddes.
- runner-up ført igennem: tese 1.
- signatur: kanalen, luftens vej tegnet som et rør ned ad arkets venstre kant, `.kanal`,
  med en afgrening og et rødt mærke ved hvert af de fem fund.
- risiko: siden fører med instrumentets fejl i stedet for med et løfte, og rødt bruges
  udelukkende til skade, aldrig til en knap.

## Designnoter, skrevet af den leverede stylesheet

Ikke af planen. Det her er, hvad koden gør.

- Farver: `--rullepapir #E6D9BB` som bund overalt, `--blæk #140D04` til tekst, `--valnød
  #3A2318` til det mørke bånd og den fyldte knap, `--messing #7A5410` til feltnavne,
  `--messingstreg #8C6316` til hårstreger og kanalens vægge, `--messinglys #C29A45` inde i
  det mørke bånd, `--hammerfilt #A81F16` kun til skade, `--blyrør #5A5648` til
  billedtekster. `--blækdyb #0B0703` findes kun som aktiv-tilstand på den mørke knap.
- Målt kontrast mod rullepapir: blæk 13,5:1, valnød 10,5:1, hammerfilt 5,2:1, blyrør
  5,2:1, messing 4,8:1. `--messingstreg` er 3,8:1 og bærer aldrig brødtekst, kun streger.
  Rullepapir på valnød er 10,5:1.
- Skrift: `Zilla Slab` til navnetræk, H1, H2, H3, beløb og fundnumre. `Atkinson
  Hyperlegible` til al brødtekst, valgt fordi læseren ofte selv er oppe i årene. `Courier
  Prime` til feltnavne, honorar, adresse, åbningstid og billedtekster. Alle tre har
  fallbacks, så siden holder uden netværk.
- Layout: `.ark` er 1040px bredt, får en kant i højre side over 1120px og er ellers fuld
  bredde. Hvert felt er et grid med en 56px venstremargen til kanalen og et indholdsfelt.
  Over 900px deler indholdet sig i en tekstspalte på højst 62 tegn og en notespalte på
  15rem.
- Kanalen er ren CSS: `.kanal::before` er et absolut placeret rør med to messingvægge og
  en lysning i gradient, strakt over hele feltets højde. De fem mærker og afgreninger er
  `::before` og `::after` på hvert `li` i fundlisten med negativ venstreforskydning, så de
  rammer røret uden absolut positionering på sidens niveau.
- Bevægelse: ingen. Ingen transition, ingen animation, ingen scroll-effekt. Reglen for
  `prefers-reduced-motion` står i filen, så en senere tilføjelse ikke slipper igennem.
- Fravigelse fra planen: planen beskrev feltnavne i versaler med bred spatiering. Det blev
  fjernet, fordi `gate.mjs` genkendte kombinationen mørkt bånd plus mættet accent plus
  bred versalspatiering som husstil fra tre tidligere leverancer. Feltnavnene står nu i
  almindelig skrivemåde i maskinskrift, hvilket i øvrigt ligner et maskinskrevet skema
  bedre. Det er en rettelse, ikke en regel til næste build.

## De seks spørgsmål, besvaret fra billedet

1. Øjet lander på overskriften "Kan det reddes?" og derefter på det mørke honorarpanel,
   altså på præcis det, brieffen siger siden skal gøre.
2. Det, der først læses som skabelon, er det mørke afslutningsbånd med en knap i. Det er
   sidens mest konventionelle greb, og det bliver stående, fordi valnød er kassens træ.
3. Signaturen er synlig i 1440 og i live i 375: kanalen løber i begge bredder fra hoved til
   fod, og de fem røde mærker sidder ud for deres fund.
4. Tommest er notespalten til højre for felt B og E. Efter at arket blev sat ned til
   1040px, læses den plads som papirets margen i stedet for som et hul, og noterne står i
   den.
5. De seks største ord i rækkefølge: Klinke & Datter, Kan det reddes, De fem fejl. En
   konkurrent i kategorien kan sige det første halve, ikke resten.
6. Med den øverste tredjedel dækket siger resten stadig, hvad det er: fem pneumatiske fejl
   på én luftvej, en vurdering til 1.850 kr., ruller efter originale mastere og to navne
   med hvert sit årstal.

To visuelle rettelser blev foretaget, som loftet tillader. Første: knappen i foden var
usynlig, fordi `.fod a` slog `.ring--lys` i specificitet, og arket blev sat fra 1180px ned
til 1040px med en kant i højre side. Anden: rulletegningen blev gjort smallere, så felt E
ikke stod skævt.

## Tilstandsroster

- Hvile, hover, focus-visible og aktiv: findes på alle tre `tel:`-kontroller og på
  spring-linket. Fokusringen er 3px hammerfilt med 3px afstand på papir og skifter til
  rullepapir inde i det mørke bånd, hvor rødt kun ville give 2,0:1.
- Disabled: findes ikke, og grunden er, at der ikke er nogen kontrol på siden, der kan være
  utilgængelig. En `tel:`-henvisning er altid gyldig.
- Loading: findes ikke, af samme grund. Der er ingen asynkron handling på siden.
- Tom, fejl og delvis: findes ikke som tilstande, fordi der ikke er nogen formular, ingen
  liste, der kan være tom, og intet indhold, der hentes efter sideindlæsning. Brieffen
  oplyser hverken svartider eller hvad en henvendelse skal indeholde, og en formular ville
  kræve, at begge dele blev opfundet.

## Journeys

Ingen. `journeys/` er tom, og det er ikke skjult: `scripts/journey.mjs` findes ikke i denne
pakke, og siden har ingen tilstandsskiftende kontrol at føre en rejse igennem. Alle fire
krav i journey-kontrakten forudsætter noget, der ændrer sig efter en handling. Den eneste
handling her forlader siden til telefonens opkaldsfelt.

## Run notes

- viewports: 375, 768 og 1440px optaget, plus én ekstra ved 1440px med
  `prefers-reduced-motion`.
- axe both schemes: kørte i begge farveskemaer, 0 overtrædelser, 0 alvorlige eller
  kritiske. Siden har kun ét farveskema, `color-scheme: light`, så de to kørsler måler det
  samme.
- live server: `python -m http.server 8713` i buildmappen, HTTP 200 på alle kørsler.
- anti-slop linter: `gate.mjs` kørte fire gange, sidste gang med `--url` mod den kørende
  server.
- fallbacks: none.

## Mechanical findings

- `verify/controls-same-label-x3`: tre kontroller med samme etikette "Ring 66 12 47 09" ved
  375, 768 og 1440.
- `verify/three-type-families`: tre skriftfamilier på siden.
- `verify/panel-button-wrapped`: knappens etikette brød over flere linjer i honorarpanelet
  ved 768 og 1440.
- `verify/tap-target-16px`: telefonlinket i fodens adresseblok var 16px højt.
- `gate/honesty-no-asset-manifest`: ingen ASSET-MANIFEST.md, og rulletegningen havde intet
  `data-asset`.
- `gate/palette-premium-consumer-default`: `#191410` lå 5 enheder fra en bandlyst
  tekstfarve, og `#f2e9d6` lå 10 enheder fra en bandlyst bundfarve.
- `gate/tokens-undeclared-literal`: 45 literale skriftstakke, størrelser og farver på
  kaldsteder.
- `gate/antipattern-round-8-recipe`: mørkt bånd, mættet accent og bred versalspatiering i
  samme stylesheet.
- `gate/direction-not-declared`: recorden manglede `Palette:`, `Type:` og `Signature:`.
- `model/fod-knap-usynlig`: knappen i foden havde rullepapir på rullepapir.

## Reconciliation

- `verify/controls-same-label-x3`: confirmed, og beholdt. Det er den samme kontrol gentaget
  ved afslutningen af de afsnit, hvor beslutningen tages, hvilket er en af de tre måder,
  `floor/buy.md` anerkender. Etiketten er den samme hele vejen med vilje.
- `verify/three-type-families`: confirmed, og beholdt. Hver familie har en rolle:
  overskrift, brødtekst, maskinskrevet felt. De står i recorden.
- `verify/panel-button-wrapped`: confirmed og rettet. Årsagen var, at `.panel div` gjorde
  `.handling` til en flex-række, så knappens `width:100%` blev til indholdsbredde.
  Selektoren blev snævret til `.panel dl > div`, og knappen fik sin egen størrelse.
- `verify/tap-target-16px`: confirmed og rettet ved at fjerne linket. Nummeret står stadig
  som tekst i adressen, og knappen lige ovenfor er kontrollen.
- `gate/honesty-no-asset-manifest`: confirmed og rettet. ASSET-MANIFEST.md er skrevet, og
  tegningen har `data-asset="rulle-skema"`.
- `gate/palette-premium-consumer-default`: confirmed og rettet. Blækket gik til `#140D04`,
  og den lyse knap skifter nu til messing i stedet for til et lysere papir, fordi et lysere
  papir ikke findes i værkstedet.
- `gate/tokens-undeclared-literal`: confirmed og rettet. Alle skriftstakke, størrelser og
  farver ligger nu i et tokenlag i `:root` med navne fra materialerne.
- `gate/antipattern-round-8-recipe`: confirmed og rettet ved at fjerne versalerne fra
  feltnavnene. Det mørke bånd og den røde accent er beholdt, fordi begge kommer fra
  materialerne.
- `gate/direction-not-declared`: confirmed og rettet. De tre linjer står nu i recorden, og
  signaturlinjen navngiver `.kanal`.
- `model/fod-knap-usynlig`: missed-by-the-model. Den blev ikke fanget af nogen måling, men
  af at kigge på 1440-billedet, sådan som verify.md kræver før rapporten læses.

## Det, der ikke står på siden

Brieffen er den eneste kilde. Der er ingen kundenavne, ingen udtalelser, ingen
anmeldelser, ingen optælling af restaurerede instrumenter, ingen leveringsløfter og ingen
beskrivelse af, hvad tilstandsrapporten indeholder. Sidstnævnte blev skrevet i et tidligt
udkast og skåret igen, fordi brieffen kun oplyser, at rapporten er skriftlig og bliver
udleveret uanset udfaldet. Ordene trakterstang og vindkanal er oversættelser af tracker bar
og wind trunk, og den engelske term står på siden begge steder.
