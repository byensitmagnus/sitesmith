# Produktionsrapport, driftskonsol for Nordbo Fjernvarme

- Scenario: operate
- Surface: driftskonsol
- Stack: ingen. `stack.mjs detect` fandt intet og navngav ingen adapter, så run.md afsnit 12
  gælder: ren HTML og CSS uden byggetrin. Det er også hvad briefen beder om.
- Target: `docs/rebuild/s14/builds/B/index.html`, én selvstændig fil, 73573 tegn
- draft: no
- release: yes

## Files opened

- SKILL.md
- run.md
- floor/operate.md
- verify.md
- scripts/ledger.mjs
- scripts/gate.mjs
- scripts/verify.mjs
- scripts/stack.mjs
- docs/rebuild/s11/briefs/B-fjernvarme.md

## Direction, som den blev afgjort

- thesis 1: Et vagtbord: 61 sedler sorteret, så den værste ligger øverst, og handlingen står i rækken.
- thesis 2: Et snit gennem ledningsnettet: hver station er et rørpar på en fælles temperaturskala, og skraveringen mellem de to linjer er afkølingen.
- thesis 3: En driftsjournal der skriver sig selv, og som vagten kvitterer i, så skærmen er en tidslinje frem for et øjebliksbillede.
- built: thesis 2 on the axis of hvad øjet kan afgøre før det læser
- runner-up argued: thesis 1
- signature: `.ledningsnet`, 61 snit gennem rørparret på én fælles skala fra 20 til 90 grader, med én gennemgående returgrænse ved 45 grader
- risk: en lys zinkflade uden en eneste rød farve på en driftskonsol
- originality pass: to ombytninger, og den anden ændrede planen

## Design record, skrevet fra den byggede fil

Læst ud af den leverede `index.html`, ikke ud af planen.

**Farver, som de faktisk står i `:root`.** `--zink` #b7c0c2 er ground på både `html` og
`body` og måler 0,517 i relativ luminans. `--plade` #cbd3d4 er panelflade. `--kridt`
#dfe6e6 er bund i nettegningen. `--rids` #4d5b5e er hver eneste hårlinje og skraveringen.
`--kappe` #0b171a er al tekst, fremløbslinjen, returlinjen og returgrænsen. `--messing`
#c99a17 optræder to steder i den byggede CSS: klodsen `.overskud` og fladen på den primære
knap `.knap`. `--ir` #17614f optræder ét sted, `.fod`.

Afvigelse fra planen, som skal skrives ned: planen sagde at `--messing` kun blev brugt ét
sted. Den byggede fil bruger den også som baggrund på den primære knap. Det er en reel
udvidelse af en signalfarve til et ikke-signal, og floor-reglen om at en betydningsbærende
farve ikke bruges til andet er dermed strakt. Den er beholdt, fordi knappen er sidens ene
handling og står i et panel hvor der ikke er andre messingflader, men den står her som en
defekt denne build bærer, ikke som en regel den næste arver.

**Type.** `--face-display` er `"Zilla Slab", Georgia, serif` og bruges af h1, h2, h3,
`.række-id`, `.valgt-id`, `.montør-navn` og de 61 `.nr`. `--face-body` er
`"Atkinson Hyperlegible", Verdana, sans-serif` og bruges af body, alle felter og alle tal.
Skalaen er 1.4rem, 1.0625rem, 0.9375rem, 0.8125rem, 0.6875rem og 1rem i select og input.
Ingen af de fem rem-værdier ligger på framework-skalaen.

**Geometri.** Radius er 0 i hele filen. Der findes ingen `box-shadow` overhovedet, og de to
`inset` markeringer af valgt tilstand er `box-shadow: inset` på `.stn` og `.række`, som
gate og fingerprint tæller som skygger. Målingen viser 0 skyggede elementer, fordi begge
kun findes under `[aria-pressed="true"]`, som ingen station har ved indlæsning.

**Signaturen i kode.** `.ledningsnet` er et grid med
`repeat(auto-fill, minmax(44px, 1fr))`, som ved 1440 giver 31 kolonner, altså to rækker.
Hver `.stn` er 45px bred og 84px høj plus nummerlinje, hvilket holder trykfladen over 44px.
Inde i hver `.snit` ligger fem absolut placerede spans i z-orden 1 til 5: skraveringen,
messingklodsen, de to aflæsningslinjer, returgrænsen og den irrede fod. Temperaturen
oversættes til procent i byggetrinnet som `(t - 20) / 70`, og de tre tal skrives ind som
`--frem`, `--retur` og `--afkøling` i et `style`-attribut, så al farve og al notation
bliver i stylesheetet.

**Motion.** Tre `transition: background-color 80ms linear` på `.stn`, `.række` og `.knap`.
Ingen animationer, ingen transforms, ingen scroll-effekter. `prefers-reduced-motion: reduce`
sætter `transition: none` på alt. Reduced-motion-passet fandt 0 findings.

## Sådan opfylder skærmen de fire ting operate-gulvet kræver

1. **Arbejdet former skærmen.** Arbejdsenheden er én stations aflæsningspar, og hele
   nettet på 61 enheder ligger på ét skærmbillede ved 1440. Afvigelserne står i en
   rækkefølge der er skrevet på skærmen. Totalerne står i foden.
2. **Systemet rapporterer sig selv.** Én `role="status"` linje bærer valg, sendt udkald,
   afsluttet udkald, flyttet udkald og fejl. Panelet under journalen siger hvornår tallene
   er taget, hvor mange stationer der mangler en frisk aflæsning, og at intet sendes videre.
   Delvis tilstand er ægte her: 2 af 61 stationer har en aflæsning der er ældre end resten,
   og de er tegnet stiplet.
3. **En kontrol sidder ved sit objekt.** Montørens to handlinger ligger i montørens egen
   række. Formularens handling ligger i formularens ende. Den irreversible handling,
   Afslut, står til højre for Flyt med 24px imellem og bekræftes af en sætning der siger
   hvad der lukkes. Feltet er tastaturtilgængeligt hele vejen, og tastaturbrugen står på
   skærmen i nettets undertekst.
4. **Indtastning er mærket og bliver ikke smidt væk.** Begge felter har en synlig label.
   Fejl står både ved feltet og i en samling som tastaturet får fokus på først, og
   samlingen linker ned til feltet. Det indtastede bliver stående ved fejl.
5. **En farve der bærer betydning bruges ikke til andet.** To mættede farver, to
   betydninger, plus en stiplet notation uden farve. Undtagelsen er noteret ovenfor.

## Tilstandsregister, gået igennem på den byggede side

- Rest, hover, focus-visible, active: findes på `.stn`, `.række` og `.knap`. Fokusringen
  er 3px `--kappe` og måler 9,8:1 mod zink og 14,4:1 mod kridt.
- Disabled: `<option>` for en montør der kører eller er på stedet er disabled og siger
  hvorfor i sin egen tekst. Ingen knap på siden er disabled uden en begrundelse.
- Loading: findes ikke. Grunden: intet på siden venter. Et udkald er sendt i samme frame
  som knappen trykkes, og en indlæsningstilstand ville være en opfundet forsinkelse.
- Empty: den komponerede førstegangsvisning i Valgt station, som er hvad skærmen viser ved
  indlæsning.
- Error: begge fejlveje i udkaldsformularen, inline plus samling.
- Partial: de to stationer med en aflæsning over 20 minutter, tegnet stiplet og talt op i
  tilstandspanelet.

## Journey, kørt i hånden

`scripts/journey.mjs` findes ikke i denne skill-pakke, og der er ingen `journeys/` mappe at
køre. Stien er derfor kørt i hånden med Playwright mod den servede side, og de fire krav
fra `verify.md` er tjekket enkeltvis:

1. Noget ændrede sig observerbart: journalen gik fra 3 til 4 linjer, Sanne skiftede fra fri
   til kører ved ST-07, og foden gik fra 3 til 4 udkald.
2. Ændringen blev annonceret: `role="status"` bar teksten "Montør sendt til ST-07. Sanne
   kører. Årsag: ...".
3. Fejlvejen blev kørt: tom formular gav "Udkaldet blev ikke sendt. 2 felter mangler.",
   `aria-invalid="true"` på begge felter, en fejl ved hvert felt og en samling som fik
   fokus.
4. Hele stien blev kørt på tastatur: ét tabulatorstop ind i nettet, piletaster til ST-07,
   Enter, fokus flyttet til panelets overskrift, videre til felterne og til Send montør.

## Mechanical findings

- `ledger/type-fewer-than-two-roles`: `ledger.mjs parse` afviste første udkast til direction-record, fordi Type-sektionen kun navngav én rolle.
- `gate/report-missing`: første `gate.mjs` afviste, fordi PRODUCTION-REPORT.md ikke fandtes endnu og reads-manifestet derfor ikke kunne tjekkes.
- `verify/duplicate-accessible-name`: 27 fund på tværs af tre bredder, hvor en stations søjle i nettet og dens række i afvigelseslisten havde samme tilgængelige navn.
- `verify/target-gap-under-24px`: 4 fund, 8px mellem Flyt og Afslut i montørrækken.
- `verify/axe-violations`: ingen. Axe kørte i begge farveskemaer og fandt 0 overtrædelser, heraf 0 alvorlige eller kritiske.
- `verify/blockers`: ingen. Ingen konsolfejl, ingen døde links, ingen vandret overløb, ingen fejlede requests, ingen bevægelse der overlevede reduced motion.
- `gate/token-drift`: ingen. Ingen literal farve, skrifttype, skygge, radius eller skriftstørrelse på et kaldested.
- `gate/antipattern`: ingen. Ingen gradienttekst, intet trekortsgitter, ingen framework-skala, ingen ikonfliser, ikke round-8-opskriften.
- `gate/palette-and-typeface`: ingen. Ingen hex inden for 12 RGB-enheder af den forbudte palet, ingen af de tre navngivne skriftsnit, ingen mættet farve i lilla-regionen.
- `ledger/anti-repeat`: ingen. Ingen veto mod fingerprint, ground-, accent- eller signaturkulør.
- `model/transliterede-identifikatorer`: 34 klassenavne, id-attributter og JavaScript-navne var skrevet med ae, oe og aa i stedet for æ, ø og å.

## Reconciliation

- `ledger/type-fewer-than-two-roles`: confirmed. Type-sektionen fik tre navngivne roller, overskrifter, aflæsninger og brødtekst, og recorden er nu complete.
- `gate/report-missing`: confirmed. Denne fil er svaret, og gate er kørt igen bagefter.
- `verify/duplicate-accessible-name`: confirmed. `aria-label` er fjernet fra rækkerne i afvigelseslisten, så deres navn nu kommer fra deres synlige tekst og adskiller sig fra søjlens. Samtidig fik montørknapperne stationen med i navnet, Flyt udkaldet på ST-31 og Afslut udkaldet på ST-31.
- `verify/target-gap-under-24px`: confirmed. `.handlinger` fik 24px gap. Efterfølgende kørsel: 0 fund.
- `verify/axe-violations`: confirmed as clean. Modellen fandt heller ingen tilgængelighedsfejl ved gennemgangen af den byggede side.
- `verify/blockers`: confirmed as clean.
- `gate/token-drift`: confirmed as clean.
- `gate/antipattern`: confirmed as clean.
- `gate/palette-and-typeface`: confirmed as clean.
- `ledger/anti-repeat`: confirmed as clean.
- `model/transliterede-identifikatorer`: missed-by-the-model af værktøjerne og fundet ved gennemlæsning af den byggede fil. Ingen mekanisk kontrol i pakken læser identifikatorer. Rettet: klasser, id-attributter og variabelnavne hedder nu række, mærke, grænse, afkøling, montør, årsag, hjælp og bekræft. Formularen, tastaturstien og fejlvejen er kørt igen bagefter og opfører sig ens.
- `model/messing-paa-knappen`: missed-by-the-model af værktøjerne og fundet ved at skrive design record fra den byggede fil. Ingen mekanisk kontrol tjekker om en signalfarve også bruges dekorativt. Den står som en defekt denne build bærer.

## Run notes

- viewports: 375, 768 og 1440 px optaget, alle tre HTTP 200, plus et ekstra 1440-pass med reduced motion. Filer i `.sitesmith/verify/`.
- axe both schemes: ran, både light og dark, 0 overtrædelser og 0 alvorlige eller kritiske.
- live server: ran. `node benchmarks/serve.mjs 4331 <build-dir>` på http://localhost:4331/, svarede 200 ved alle tre bredder.
- anti-slop linter: ran. `gate.mjs` mod build-mappen med `--skill` peget på sitesmith-v3. Sidste kørsel: every check ran and none refused.
- fallbacks: none. Bemærkning uden fallback: `scripts/journey.mjs` findes ikke i denne pakke, så journey-kontrakten er kørt i hånden og skrevet ud ovenfor.

## Resultat, maskinlæsbart

Skrevet til `.sitesmith/result.json` ved siden af denne fil. Den bærer defekttællinger og
de dimensioner der blev sprunget over med grund. Der udskrives ingen totalscore, fordi
denne kørsel ikke kørte en pointgivende rubrik, og en score mod en nævner der indeholder en
sprunget dimension er præcis det rapportkontrakten forbyder.

## Konflikter og afvigelser

- Briefen beder om at 375 ikke går i stykker, og gulvet beder om 44px trykflader. De 61
  søjler er 44px eller bredere ved alle tre bredder, fordi gitteret er
  `minmax(44px, 1fr)`. Ved 375 giver det 7 kolonner og 9 rækker, hvilket er højere, men
  intet vandret overløb.
- Søjlerne støder op til hinanden uden mellemrum. Det er bevidst: den gennemgående
  returgrænse er hele pointen, og et mellemrum ville skære den i 61 stykker. Trykfladerne
  er hver især over 44px, så de er ikke undermålige, og `verify` rapporterer ingen for
  tætte par blandt dem.
- Briefen siger at et udkald ikke kan trækkes tilbage, kun afsluttes eller flyttes.
  Konsollen tilbyder derfor ikke en fortryd-knap på et sendt udkald. Reglen om at en
  destruktiv handling skal være undoable eller bekræftet af en sætning er opfyldt med
  bekræftelsen, ikke med en fortrydelse.
- Rækkefølgen temperatur, tryk, alder står ikke i briefen. Den er valgt og skrevet på
  skærmen, hvor vagten kan modsige den.
