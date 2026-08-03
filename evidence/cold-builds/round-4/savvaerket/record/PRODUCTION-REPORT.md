# Production report, Rold Savværk

- Scenario: buy
- draft: yes
- Target: `builds/J/index.html`, serveret på `http://localhost:5173/`
- Stack: ingen detekteret. `stack.mjs detect` skrev "no adapter named", så run.md afsnit 12
  gælder: ren HTML og CSS uden byggetrin, hvilket også er det, briefen beder om.
  `components.mjs detect` skrev "nothing installed", så alt er skrevet her.

Bygget er et **udkast**, ikke en release. Grunden står i `ASSET-MANIFEST.md`: der findes
ikke ét fotografi af pladsen, og `look.md` afsnit 3 kalder en side om en fysisk ting uden
et fotografi af den for et udkast. De to billeder, der skal bedes om, står navngivet i
manifestet med hvor de skal tages.

## Files opened

- `SKILL.md`
- `run.md`
- `look.md`
- `floor/buy.md`
- `stacks/static.md`
- `verify.md`
- `scripts/stack.mjs`
- `scripts/components.mjs`
- `scripts/ledger.mjs`
- `scripts/gate.mjs`
- `scripts/verify.mjs`
- `scripts/critique.mjs`
- `scripts/journey.mjs`

`motion.md`, `redesign.md`, `delegation.md` og `floor/operate.md` blev ikke åbnet: briefen
beder ikke om at blive båret gennem noget, der redesignes intet, arbejdet deler sig ikke i
uafhængige dele, og fladen er en handel og ikke et værktøj.

## Retningen, som den blev afgjort

- thesis 1: Stakken set for enden. Hver planke på lager tegnet i sin sande tykkelse, med det mærke savværket selv skriver på endetræet.
- thesis 2: Tørrejournalen fra kammerdøren. Hvad der er inde, hvad der er ude, hvor mange dage der er igen.
- thesis 3: Prislisten som regneark, med tegningen som bilag.
- built: thesis 1, på aksen "hvad den første skærm kan gøre sammenligneligt på ét blik". Tykkelsen er det tal, en snedker vælger ud fra, og fire stakke på ét gulv gør 27, 40, 52 og 65 mm til fire højder i stedet for fire tal. Tegningen kan desuden bære journalens bedste tal længere nede, hvor journalen ikke kan bære tegningen længere oppe.
- runner-up argued: thesis 2, argumenteret på pladsens tilstand og på at journalens egen kolonne er tid.
- signature: `.stak`
- second reading: `.tavle`, tørretiden som streger i rækker af syv, 21 og 34 dage, under første skærm og på en anden måling end signaturen
- risk: en tegning på næsten sort bund uden fotografi kan læses som en plakat i stedet for som en handel
- answer to the risk: `.ordrepanel`
- anti-repeat: `ledger.mjs check` mod otte tidligere fingeraftryk. Fingeraftryk `dark|sans|imageless|flat-surfaces+hairline-separators+tabular-figure-motif`, bund hue 7, accent hue 50. Ingen veto, ingen waiver brugt.

## Run notes

- viewports: 375, 768 og 1440 px optaget af `verify.mjs`, plus en fjerde optagelse ved 1440 med `prefers-reduced-motion: reduce`. Fire billeder i `.sitesmith/shots/`. Vandret overløb 0 px ved alle tre bredder.
- axe both schemes: ran, både `light` og `dark` emuleret, 0 overtrædelser i alt og 0 alvorlige eller kritiske.
- live server: ran, `node serve-J.mjs builds/J 5173` uden for byggemappen, HTTP 200 på alle fire optagelser, 0 døde links, 0 fejlede forespørgsler, 0 konsolfejl.
- anti-slop linter: ran, `gate.mjs builds/J --draft --url http://localhost:5173/`, exit 0, "every check ran and none refused". Dækker em dash, elision, opdigtede identifikatorer, fortalt fravær, den forbudte palet, AI lilla, navngivne skrifter, utokeniseret tegning, token drift, antimønstre, skæve bånd, ujævn venstrekant, ét gennemgående layout, elementer bredere end deres indhold, og retningens troskab i den rendrede side.
- fallbacks: none. Alle fem trin kørte, og intet blev erstattet af en håndkørt kontrol.

## Mechanical findings

Alt, hvad de fem værktøjer rapporterede, uanset alvor, skrevet som fundet og ikke som mål.

- `verify/blockers`: 0 ved alle tre bredder i den afsendte version.
- `verify/duplicate-label-telefon`: 375, 768 og 1440 px. To kontroller bærer samme etiket, "98 39 12 40", i toppen og i bunden.
- `verify/axe`: 0 overtrædelser i begge farveskemaer.
- `verify/overflow`: 0 px vandret overløb ved 375, 768 og 1440.
- `verify/reduced-motion`: 0 fund. Ingen kørende animation, ingen overgang over 100 ms på transform eller opacity, ingen medieforespørgsel efter et bevægelsesaktiv.
- `verify/focus`: 14 tastaturstop ved hver bredde, ingen uden synlig markering, ingen markering under 3:1 mod sin egen flade.
- `verify/targets`: ingen berøringsmål under 44 px og ingen par tættere end 24 px i den afsendte version.
- `verify/typografi`: ingen linjelængde uden for 45 til 80 tegn, ingen sporing under gulvet, ingen displaystørrelse over loftet, ingen svage trin i skalaen i den afsendte version.
- `gate/look-no-photograph`: ét fund, nedgraderet til advarsel af `--draft`. Der er intet fotografi på en side om noget, der findes.
- `gate/other`: 0 refusioner i alle øvrige klasser.
- `ledger/anti-repeat`: passeret, formen findes ikke i de otte tidligere optegnelser.
- `journey/bestilling`: 21 påstande, alle holdt.

## Reconciliation

Min egen læsning blev skrevet og låst i `.sitesmith/critique.json`, før tallene nedenfor
blev læst som en helhed, og de to steder, jeg er uenig med et værktøj, siger hvorfor.

- `verify/blockers`: confirmed.
- `verify/duplicate-label-telefon`: false-positive. reason: de to kontroller er samme hensigt til samme mål, `tel:+4598391240`, og bærer med vilje det samme ord begge steder. `floor/buy.md` kræver én etiket pr. hensigt, og to forskellige ord for det samme telefonnummer ville være bruddet frem for rettelsen. Gatens egen `cta/duplicate-intent` er enig og refuserede ikke.
- `verify/axe`: confirmed.
- `verify/overflow`: confirmed. Første måling efter at navigationen fik 44 px berøringsmål gav +16 px ved 375, hvilket var reelt, og det blev rettet med ombrydning i menuen og en smallere kant under 520 px.
- `verify/reduced-motion`: confirmed. Siden har ingen bevægelse at standse. Det er en beslutning frem for et held: der er ingen indgangsanimation, ingen overgang på transform eller opacity, og ingen figur nær et beløb, der flytter sig.
- `verify/focus`: confirmed.
- `verify/targets`: confirmed. Tre målinger var nødvendige. Første fandt syv mål under 44 px og fem par under 24 px, anden fandt ét, tredje ingen.
- `verify/typografi`: confirmed. To linjelængder i bånd 3 lå under 45 tegn og blev rettet ved at flytte kolonnebredderne, ikke ved at skrue på skriftstørrelsen.
- `gate/look-no-photograph`: confirmed. Det er sandt, det er sidens største mangel, og det er derfor bygget afleveres som udkast. Rettelsen er et fotografi fra pladsen, ikke mere tegning.
- `gate/other`: confirmed.
- `ledger/anti-repeat`: confirmed.
- `journey/bestilling`: confirmed.

## Kritikken af renderingen

Låst mod render `ba4cace0d8b7a346`, én rettelsesrunde. Fuld ordlyd i
`.sitesmith/critique-svar.md`. Kort:

- Øjet lander på h1 og ikke på stakken, så argumentet ankommer som en sætning før det ankommer som den ting, man køber fra.
- Bestillingsafsnittet læses først som skabelon, og panelet ved siden af stod tomt.
- Signaturen lever ved 1440 og overlever klemt ved 375.
- Tommest var `.slip` og den øverste højre del af første skærm.
- De seks største ord er specifikke nok, men træsortsnavnene deles med enhver løvtræshandel.
- Dækker man den øverste tredjedel, siger resten stadig hvad det er.
- Verdict: ACCEPT med rettelser. Værst: `.maaling` var et fladt kvadrat, der stiltiende påstod en plankebredde, ingen har oplyst.

Rettelsesrunden, som den blev kørt, og der bliver ikke en anden:

1. `.maaling` er tegnet om til enden af en planke med brudt højre kant, stiplet midterlinje og to spidser, der går ned fra fladen og standser på midten.
2. `.slip` bærer nu de fire linjer, der står på hver eneste seddel, som en invitation frem for et tomt panel.
3. Den øverste højre del af første skærm bærer nu pladsens adresse, åbningstid, hjemtransport og reservation af grønt træ.
4. Stakkens hoveder fik luftigere skydning, og etiketterne i faktalisten gik fra kridtgul til damp, så den ene kridtgule flade på siden bliver ved med at være knappen, der forpligter.

Det, kritikken fandt og som ikke blev rettet: øjet lander stadig på h1 før stakken.
Rettelsen ville være at skubbe overskriften ned under tegningen, og det ville koste siden
dens sætning om hvad der sælges, til en køber der lander uden kontekst. Det står som en
bevidst afvejning frem for som et fund, der er lukket.

## Design record, skrevet fra den afsendte kode

- Bund `#2b1310` på `html` og `body`, med `repeating-linear-gradient` i `--kerf` ved 102 grader som savsnit i overfladen. Ni farver, alle deklareret som custom properties og alle brugt gennem `var()`. Ingen literal farve står på et kaldested, og `One-offs:` er tom.
- Skrift: `Vollkorn` 700 til h1, h2, h3 og træsortens navn, `Vollkorn` 600 til prisen pr. m³. `Spline Sans` 450 til brødtekst, 500 til etiketter og tal. Brødvægten er 450 og ikke 400, fordi lys tekst på mørk bund taber vægt, og `verify.mjs` målte det og sagde det.
- Skala: `--f-xs` til `--f-2xl`, de fire største med `clamp()`. Overskriftstrinene måler 1,19 til 1,42 gange ved alle tre bredder, over gulvet på 1,15.
- Stakken er bygget i CSS og ikke i SVG: hver plankes højde er `calc(var(--t) * var(--mm))`, hvor `--t` er tykkelsen i millimeter og `--mm` er 1,45 px under 640, 1,7 px under 1024 og 2 px derover. Teksten på plankeenderne er rigtig tekst, som kan markeres og vokser med skriftstørrelsen. Prisen er derfor `ledger.mjs` blind for tegningen og noterer `imagery: imageless`: den tæller `img` og `svg`, og stakken er ingen af delene. Det er en rigtig måling af noget andet end det, den ser ud til at måle, og siden har ingen fotografier, hvilket er den sande halvdel af tallet.
- Plankeenderne bærer en `linear-gradient` fra `--endetrae-lys` til `--endetrae`, som er lyset, der falder på den øverste kant af en savet ende.
- Ingen `box-shadow` nogen steder, ingen `border-radius` nogen steder, ingen positiv `letter-spacing` nogen steder. Overskrifter står på `-0.01em`.
- Bevægelse: ingen overgange, ingen animationer. `prefers-reduced-motion` har intet at standse.
- Fire bånd med fire forskellige former, målt af `gate.mjs`: `2col-full-wideright`, `1col-full`, `3col-full`, `2col-full-even`. Alle fire bånd starter deres indhold på samme venstrekant.
- Afvigelser fra planen, begge skrevet ind i `.sitesmith/direction.md` inden koden: etiketkolonnen står i bånd 1 og 3, ikke i alle fire, fordi specifikationen og sedlen læses fra kant til kant. Skalaen står på siden som ord og ikke som et px tal, fordi px tallet ændrer sig med bredden, og et tal, der kun er sandt ved 1440, ville være en påstand siden ikke kan holde.
- Standarder, som `SKILL.md` afsnit 5 afviser, og som alligevel blev afsendt: ingen.

## Tilstandsregisteret, gået igennem den byggede side

- Rest, hover, focus-visible, active: findes på alle fem kontroller, de fire ankre i menuen, de to telefonlinks, det rullelige tabelområde og knappen.
- Disabled: `#tykkelse` bærer det rigtige `disabled` attribut på de tykkelser, den valgte sort ikke ligger i. Elm giver tre spærrede og én valgbar, og journeyen hævder præcis det.
- Loading: findes ikke. Siden henter intet efter indlæsning, og sedlen skrives i samme billede som klikket. En ventetilstand ville være opdigtet forsinkelse tæt på et beløb, hvilket `floor/buy.md` forbyder.
- Empty: sedlen står fra første billede som en invitation, der allerede bærer de fire linjer, som gælder hver eneste ordre.
- Error: to veje. Tom eller for lille mængde, og mere elm end de 3,4 m³, der er tilbage. Begge skriver på `#maengde-fejl`, som feltet peger på med `aria-describedby`, sætter `aria-invalid`, og flytter fokus tilbage til feltet.
- Partial: findes ikke. Der er ingen del af siden, der kan ankomme for sig.

## Hvad briefen ikke indeholdt

Dette afsnit er studiets papirarbejde og står med vilje her og ikke på siden.

- Intet fotografi. To er navngivet i `ASSET-MANIFEST.md` med motiv, beskæring og hvor de skal tages.
- Ingen moms. Priserne står som briefen skriver dem, og siden siger hverken med eller uden.
- Ingen lagermængder ud over elmens 3,4 m³. Derfor findes der ingen lagerkolonne i
  specifikationen, som ville få de tre andre sorter til at se uoplyste ud.
- Ingen plankebredde. Kun tykkelse og længde er tal på siden, og tegningen er kun målsat
  på tykkelsen. Derfor den brudte kant på `.maaling`.
- Intet sted at sende en bestilling hen. Sedlen skrives derfor på siden og læses op i
  telefonen, som er den eneste kanal briefen giver.
- Ingen tørretid for 40 mm og 65 mm. Kun de to, briefen giver, står på tavlen.
- Ingen returret, ingen leveringstid for tørt træ ud over åbningstiden, ingen betalingsvilkår.

## Spørgsmålet jeg ville have stillet

Ét, med mit eget svar hæftet på: har I et fotografi af stakken under halvtaget med
kridtmærkerne på endetræerne, eller må vi komme og tage et. Uden svar bygger jeg tegningen
og afleverer som udkast, hvilket er hvad der er sket.
