# Produktionsrapport, Glarmester Nordlys

- Scenario: buy
- Stak: astro 5.14, statisk build, ingen adapter, ingen islands
- Flade: én side, `src/pages/index.astro`
- draft: yes
- Grund til draft: der findes intet fotografi af emnet, og briefen forbyder at lave et.
  Det manglende aktiv står navngivet i `ASSET-MANIFEST.md`.

Denne rapport gør ikke krav på release. Den er en draft, fordi `look.md` afsnit 3 sætter et
leveret fotografi øverst på stigen, og der er ikke leveret et.

## Hvad der blev bygget

En side hvor besøgende skriver værkstedets egen skæreseddel selv. To mål fra fals til fals,
et antal, en glastype og et udleveringsvalg giver falsmålet, arealet med tre decimaler,
prisen og leveringstiden, regnet i browseren uden et eneste netværkskald. Knappen skriver
sedlen som et dokument værkstedet kan skære efter, og siger at intet er betalt endnu.

Førsteskærmen er en målt tegning af skærebænken med en målestok under kanten og grænsen ved
2.200 mm sat af med rødt. Så snart begge mål står der, tegnes ruden ind på bænken i samme
forhold, med målstreger og tallene siddende på stregerne, og ruden kan aflæses direkte mod
bænkens egen målestok.

Tre tegninger, ingen fotografier, ingen ikoner: bænken med ruden på, værkstedets uge tegnet
som åbningstid pr. dag med ordrens arbejdsdage lagt ind, og et snit gennem falsen med de
3 mm luft i hver side.

## Knowledge Index

`.sitesmith/RUN.md` gav tre resultater med score. De blev læst som byggesten, ikke som
skabelon, og de gik gennem emne, tese, autopilot, bytte og originalitet før noget blev
bygget.

- `pat-configurator-prices-from-the-buyers-own-numbers` (0.468). **Brugt.** Den er selve
  briefen: prisen kommer af kundens egne to mål og ikke af et opslag. Konkret blev den til,
  at felterne ikke står ved siden af et resultatpanel, men er sedlens egne linjer, så
  totalen bæres fra første tastetryk og der aldrig findes en formular og et resultat, kun
  ét halvt udfyldt dokument. `floor/buy.md` nævner konfiguratoren som en af tre måder at
  lade objektet og erhvervelsen ankomme sammen, og det er den måde der blev valgt.
- `cro-no-invented-urgency` (0.376). **Brugt, som en spærre.** De 11 m² antikglas er den
  eneste knaphed på siden, og den er en brief-oplyst mængde, ikke en nedtælling. Den står
  som en almindelig oplysning i samme typografi som alt andet: der er 11 m² tilbage, når det
  er brugt er det brugt, og der er ingen genbestillingsdato. Ingen tæller, ingen farve alene,
  ingen tidsfrist, ingen "kun i dag".
- `evi-a-claim-needs-a-source` (0.367). **Brugt, og den er den dyreste af de tre.** Hver
  sætning på siden er holdt op mod briefens fakta. Den kostede fire sætninger: en om at
  antikglassets 5 arbejdsdage skyldes lagerpladerne (en årsag briefen ikke giver), en
  ordrebekræftelse pr. e-mail (der er ingen e-mailadresse i briefen), et
  ordrereferencenummer (opfundet), og en linje om hvorfor der ikke må skæres under 30 mm
  (briefen giver grænsen, ikke grunden).

**Afvist:** ingen af de tre blev afvist. Der kom kun tre hits, og alle tre er relevante for
en købsflade der regner en pris. Det der blev afvist, er det der ikke kom: der var intet
resultat om tomme tilstande, om fejlplacering eller om målte tegninger, og de tre
vigtigste designbeslutninger på siden er derfor ikke understøttet af indekset. Se noten om
skillet nedenfor.

## Files opened

- `SKILL.md`
- `run.md`
- `look.md`
- `floor/buy.md`
- `stacks/astro.md`
- `verify.md`
- `scripts/ledger.mjs`
- `scripts/stack.mjs`
- `scripts/components.mjs`
- `scripts/verify.mjs`
- `scripts/critique.mjs`
- `scripts/journey.mjs`
- `scripts/gate.mjs`
- `BRIEF.md`
- `.sitesmith/RUN.md`
- `.sitesmith/PROJECT.md`
- `.sitesmith/DESIGN.md`
- `.sitesmith/state.json`
- `package.json`

Ikke åbnet: `redesign.md`, `motion.md`, `delegation.md`, `floor/operate.md`,
`knowledge/*`, `agents/*`, `README.md`, `THIRD-PARTY-NOTICES.md`, `cli.mjs` og de fem
andre stak-adaptere. `stack.mjs detect` navngav astro, og kun den adapter blev åbnet.

## Mekaniske scanninger, som ikke er kontekstlæsninger

To gange blev hele projektmappen scannet med et script for ét tegn eller ét mønster, ikke
læst. Scanningerne printede kun de linjer der matchede, og de linjer er ført i
`## Mechanical findings` nedenfor.

1. Em dash-scanning over alle tekstfiler uden for `node_modules`. Den printede 14 linjer,
   fordelt på `.sitesmith/RUN.md`, `BRIEF.md`, `sitesmith/commands.mjs`,
   `sitesmith/scripts/gate.mjs` og `sitesmith/stacks/shopify.md`.
2. Scanning for elisions og for navngivne designsystemer efter samme mønstre som
   `gate.mjs` bruger. Den printede én linje, fra `sitesmith/stacks/static.md`.

De to scanninger blev kørt for at kunne skrive denne rapport om skillet, ikke for at bygge
siden. De står her, fordi en scanning der rammer en fil stadig får tre linjer af den ind i
kørslen, og det bør kunne kontrolleres.

## Run notes

- viewports: 375, 768 og 1440 renderet mod dev-serveren, plus en fjerde kørsel ved 1440 med
  prefers-reduced-motion sat på konteksten før første byte
- axe both schemes: ja, `@axe-core/playwright` kørt i både light og dark med wcag2a,
  wcag2aa, wcag21a og wcag21aa, 0 overtrædelser i begge
- live server: ja, `astro dev` på http://localhost:4321, HTTP 200 ved alle tre bredder;
  produktionsbuild kørt separat med `npm run build` og gate kørt mod begge
- anti-slop linter: ja, antipattern-detektoren i `gate.mjs` kørte over 2 markup-filer og
  2 stylesheets og fandt 0; palet-, typesnit-, lilla- og CTA-kontrollerne kørte og fandt 0
- fallbacks: to. `.sitesmith/RUN.md` opgiver direction-kommandoen som
  `ledger.mjs new buy`, som afviser med exit 2, så den blev kørt som
  `ledger.mjs new . buy` i stedet. Og den grønne gate-kørsel er scopet til en kopi der kun
  indeholder dette builds egne filer, fordi gate.mjs som standard går hele build-mappen
  igennem, og skillet selv og briefen ligger i den. Begge er beskrevet under
  `## Skillet` nedenfor.

## De to bedømmelser

Kritikken blev besvaret først, ud fra de fire billeder og briefen, med retningsprotokollen
og gate-outputtet lukket. Svarene ligger i `.sitesmith/critique-svar.md` og er låst til
renderingen i `.sitesmith/critique.json`.

**Kritikken fandt noget, og det var ikke ingenting.** Værste fund: bænketegningens tomme
tilstand læste som en skeleton loader, fordi den var et stort fladt gråt rektangel med
svage vandrette streger. Andet fund: navigationen brød om til tre og en på 375 og lignede
et menupunkt der manglede.

Én rettelsesrunde blev brugt på begge: de vandrette streger blev til en skrå snitskravering,
der kom en rigtig målestok under bænkekanten med streger for hver 100 mm og tal ved 500,
1.000, 1.500 og 2.000, og navigationen blev sat i to gange to med samme afstand begge veje.
Rettelsen er skrevet ind i låsen med `--correction`. Der er ikke kørt en runde to.

## Mechanical findings

- `verify/motion-under-reduced-motion`: tre kørende caret-color-transitions ved 1440 under
  prefers-reduced-motion, på `#bredde`, `#hoejde` og `#antal`
- `gate/look-wider-than-its-content`: `div.linje` ved y=1239 var 505px bred med indhold der
  stoppede 468px fra højre kant, 93 procent af sin egen bredde, og tre elementer mere som
  den
- `gate/honesty-no-asset-manifest`: ingen `ASSET-MANIFEST.md`, og tre tegninger med
  `data-asset` uden en række at svare for sig
- `gate/look-no-photograph`: intet fotografi nogen steder på en side om noget der findes
- `gate/copy-em-dash`: 14 forekomster af tankestreg i `.sitesmith/RUN.md`, `BRIEF.md`,
  `sitesmith/commands.mjs`, `sitesmith/scripts/gate.mjs` og `sitesmith/stacks/shopify.md`
- `gate/honesty-design-system-not-installed`: en Apple-platformsteknologi navngivet ved sit
  produktnavn og uden forbehold i `sitesmith/stacks/static.md` linje 23
- `verify/small-target-24px`: seks radioknapper måler 24px mod gulvet på 44px
- `verify/measure-115ch`: `ul.glasliste > li` måler 115 tegn mod båndet 45 til 80
- `verify/measure-42ch`: de tre noter under prislisten måler 42 tegn
- `verify/measure-37ch`: `p.falsmaal-tekst` måler 37 tegn
- `ledger/new-buy-usage`: kommandoen som `.sitesmith/RUN.md` opgiver til direction-trinnet
  afviser med exit 2

## Reconciliation

- `verify/motion-under-reduced-motion`: confirmed. Reglen under
  `prefers-reduced-motion` satte `transition-duration: 1ms` på alt, hvilket **tænder**
  transitionen på hver egenskab i stedet for at slukke den, fordi `transition-property`
  som standard er `all`. Rettet til `animation: none` og `transition: none`. Modellen havde
  ikke set det; kontrollen havde ret, og fejlklassen er større end fundet.
- `gate/look-wider-than-its-content`: confirmed. Ventepladsen i talblokken var en streg uden
  tekst, så rækken målte som en linje der peger på ingenting i 93 procent af sin bredde.
  Rettet ved at lade ventepladsen bære enheden, mm, m² og kr, så rækken siger hvad der
  kommer til at stå der. Glas, udlevering og leveringstid afhænger ikke af målene og står nu
  altid udfyldt.
- `gate/honesty-no-asset-manifest`: confirmed. `ASSET-MANIFEST.md` skrevet med en række pr.
  tegning og en række for det fotografi der mangler.
- `gate/look-no-photograph`: confirmed, og uløst med vilje. Briefen skriver at intet
  fotografi er leveret og at intet må genereres. Kørslen er derfor en draft, aktivet er
  navngivet i manifestet, og der er ikke tegnet udenom spørgsmålet.
- `gate/copy-em-dash`: confirmed, og ikke i dette builds egne filer. Alle 14 ligger i
  skillet selv, i briefen, eller i den `RUN.md` som skillets egen `build`-kommando skrev.
  Se `## Skillet`.
- `gate/honesty-design-system-not-installed`: confirmed, i skillets egen `stacks/static.md`.
  Ikke rettet: rettelser til skillets filer hører hjemme opstrøms, ikke i en kundeleverance.
- `verify/small-target-24px`: false-positive. reason: målet er ikke radioknappen, det er
  `<label>`, som omslutter den, er 48px høj og fylder hele kolonnens bredde; hele rækken er
  klikbar, og WCAG 2.2 måler det område der aktiverer kontrollen.
- `verify/measure-115ch`: false-positive. reason: kontrollen måler `li`-boksens bredde og
  antager at den er én linje prosa. Det er en firekolonners tabelrække, og den længste celle
  i den er 46 tegn.
- `verify/measure-42ch`: confirmed, og accepteret. 42 tegn er under gulvet på 45. Det
  alternative layout var to kolonner i stedet for tre, og så ville tre af fem bånd på siden
  have haft samme form, hvilket gate.mjs' egen `look/one-layout` er skrevet imod. Prisen for
  variationen er tre tegn pr. linje i to sætninger.
- `verify/measure-37ch`: confirmed, og accepteret af samme grund; kolonnen deler bredde med
  falsmåltegningen, som skal kunne læses.
- `ledger/new-buy-usage`: confirmed, i skillet. Se `## Skillet`.

## Kontrollerne, og hvad de sagde

**`verify.mjs`** mod `http://localhost:4321/`: PASS, ingenting blokerende. 375, 768 og 1440
alle HTTP 200 uden vandret overløb. axe i begge farveskemaer: 0 overtrædelser. Ingen
konsolfejl, ingen fejlede requests, ingen døde links. Tastatursvøbet fandt 11 stop ved hver
bredde, alle med en synlig fokusmarkering og ingen under 3:1 mod sin flade. Reduceret
bevægelse: 5 requests, 0 fund. Første kørsel fandt tre blokerende fund, som er ført ovenfor.

**`critique.mjs packet`** og **`lock`**: seks spørgsmål besvaret ud fra billederne alene,
låst til rendering `d4a3dbccd412bc07` med én rettelsesrunde. Verdikt: ACCEPT.

**`journey.mjs journeys`**: 1 spec, 44 kontroller, alle grønne. Den kører hele rejsen: tom
tilstand uden pris, fire fejlveje hver med beskeden på det felt der forårsagede den,
udregningen af falsmål, areal og pris, minimumsarealet på 0,15 m², tegningen der får ruden
ind, hele vejen på tastaturet alene med fokusmarkering ved hvert stop, og til sidst
skæresedlen skrevet, annonceret i en `role="status"`-region med fokus flyttet til den.

**`gate.mjs`**: se næste afsnit.

## Gate

Kørt to gange, med to forskellige scopes, og begge står her.

1. **Som dokumenteret, `node sitesmith/scripts/gate.mjs . --url http://localhost:4321/`.**
   Afviser med 18 fejl i 5 klasser. 14 af dem er tankestreger i filer dette build ikke har
   skrevet, 1 er et designsystem navngivet i skillets egen stak-adapter, og 1 er
   `look/no-photograph`, som briefen selv forklarer. De sidste to var
   `report/missing` og `critique/not-taken`, som forsvandt da denne rapport og kritikken
   blev skrevet.
2. **Scopet til dette builds egne filer.** Samme gate, samme retningsprotokol, samme
   manifest, samme rapport, samme journey-spec og samme skærmbilleder, men build-mappen er en
   kopi der kun indeholder det der udgives, altså `dist/`, plus kørslens egne artefakter.
   Uden `--draft` afviser den med præcis én fejl i én klasse, `look/no-photograph`. Med
   `--draft`, som er den rigtige tilstand for et build der venter på et fotografi:

   ```text
   WARNED, downgraded because this run is a draft
     look/no-photograph
   every check ran and none refused
   exit 0
   ```

   Kørt to gange, mod dev-serveren på 4321 og mod `astro preview` på 4322, altså mod det
   rigtige produktionsbuild. Samme svar begge gange. `verify.mjs` og journey-specen er også
   kørt mod produktionsbuildet: PASS uden blokerende fund og 44 af 44 kontroller grønne.

Der er ikke rettet i briefen og ikke i skillet for at få en grøn gate.

## Designprotokol, skrevet fra det der faktisk blev sendt

Skrevet fra `src/styles/vaerksted.css` og `src/pages/index.astro`, ikke fra
`.sitesmith/direction.md`.

**Farver, seks, alle med et materiale i navnet.** `--glasflade` #dbe3dd er sidens bund,
`--skaerebaenk` #c3cec6 er bænkefladen og leveringsafsnittets bund, `--blyant` #1c2426 er
brødtekst og alle streger, `--rudekant` #16584a bærer prisen, den ene knap og alle links,
`--linoliekit` #cbb684 markerer antikglasset og fragtdagene, `--roedkridt` #a33a1e er
fejl og grænsen ved 2.200 mm. Ingen af de 37 erklærede tokennavne kommer fra
framework-ordforrådet. Der er ingen dark mode; briefen beder ikke om den.

**Snit, to, med hver sin opgave.** Bahnschrift på rubrikker og på hvert tal der er et mål,
Sitka Text på alt der skal læses som sprog. Begge blev målt som faktisk renderede i
`verify`-rapporten. Skalaen er 13/15/17/21/27/32/38 px med 54 px til h1 fra 900px og opefter.
Ingen skriftfil er hentet eller pakket med.

**Form.** Fem bånd, fire forskellige former: to kolonner på skæreafsnittet, tre på glasset,
to med et fuldbredde-diagram imellem på leveringen, tre på værkstedet. Hjørneradius er 0
overalt, der er ingen skygge nogen steder, og der er ingen animation og ingen transition.

**Afvigelser fra planen, som blev sendt alligevel.** Tre.

1. Planen sagde en 8 px basisrytme på sedlen og 4 px i tabellen. Det der blev sendt, er én
   rytme på 4, 8, 16, 24, 40, 64 og 88 px for hele siden. To rytmer var en beslutning ingen
   kunne se, og den blev ikke bygget.
2. Planen skrev intet om en målestok under bænkekanten. Den kom af kritikken, ikke af
   planen, og det er den enkeltrettelse `--correction` dækker.
3. Planen sagde at ventepladsen holder formen af svaret. Det gjorde den ikke godt nok:
   den holdt formen uden at sige hvad der kom. Enheden i ventepladsen er en tilføjelse
   gaten fremtvang.

**En default dette build bærer.** Formularpanelet er et indrammet lyst kort med legend,
label, felt og en knap i fuld bredde, og det er mediets standardform for en kasse. Kritikken
navngav det som det der først læses som skabelon. Det blev ikke bygget om, fordi felterne
skulle være sedlens linjer og en seddel er et indrammet ark. Det står her som en defekt dette
build bærer, ikke som en regel næste build skal arve.

## Ingen score

Der udsendes ikke et samlet tal. `verify.md` kræver at hver bedømt dimension bærer en
anvendelighedstilstand og at nævneren kun indeholder de bedømte, og de kontroller der er
kørt her, giver bestået eller afvist pr. klasse, ikke point. Et tal ville skulle opfindes
for at kunne trykkes.

## Skillet, og hvad der var galt med det

Ført her, fordi det ikke hører hjemme på kundens side.

1. **`.sitesmith/RUN.md` opgiver en kommando der ikke virker.** Manifestet skriver
   direction-trinnet som `ledger.mjs new buy`. `ledger.mjs` forventer
   `new <dir> <surface>` og afviser med exit 2 og en usage-linje. Kommandoen skal være
   `ledger.mjs new . buy`. Manifestets øvrige seks kommandoer er rigtige.
2. **Skillet skriver den tankestreg det selv forbyder absolut, ind i den mappe det selv
   gater.** `sitesmith/commands.mjs` interpolerer en tankestreg i tre linjer, og de havner i
   `.sitesmith/RUN.md`, som ligger i den mappe `gate.mjs` som standard går igennem. Dertil
   `sitesmith/scripts/gate.mjs` linje 1021 og `sitesmith/stacks/shopify.md` linje 12.
   `gate.mjs` er selv omhyggelig nok til at bygge to af sine egne beskeder ved interpolation
   for ikke at indeholde tegnet, og skriver så tegnet direkte tre linjer længere nede.
   Konsekvensen er konkret: et build der følger skillet til punkt og prikke, kan ikke få en
   grøn gate på sin egen projektmappe.
3. **`sitesmith/stacks/static.md` linje 23 navngiver en Apple-platformsteknologi ved dens
   produktnavn og uden forbehold**, og
   `gate.mjs` afviser præcis det mønster med `honesty/design-system-not-installed`.
4. **Læsemanifestet kan ikke se forskel på en projektsti og en skillsti.** Kontrollen
   `reads/outside-manifest` slår kun til, hvis stien findes under skillmappen. Skriver en
   rapport sine læsninger som projektstier, altså `sitesmith/run.md` i stedet for `run.md`,
   kontrolleres ingen af dem, og kontrollen består uden at have gjort noget. Der er intet
   der siger hvilken konvention rapporten skal bruge.
5. **Knowledge Index-resultaterne er ID'er uden tekst, og teksten ligger uden for
   læsemanifestet.** `RUN.md` giver tre ID'er med score. Indholdet ligger i
   `sitesmith/knowledge/*.jsonl`, og hverken `knowledge/*` eller `knowledge/retrieve.mjs` er
   nævnt i nogen scenarie-liste i `SKILL.md`. En builder der åbner dem og skriver det ærligt
   i `## Files opened`, afvises af `reads/outside-manifest`; en builder der lader være,
   arbejder ud fra ID'ets ordlyd. Der findes ikke en tredje mulighed. De blev ikke åbnet her.
6. **`ledger.mjs new` skriver en skabelon som `gate.mjs` ikke kan læse.** Skabelonen sætter
   en tom linje mellem `## One-offs` og den første række. `gate.mjs`' `block()` læser den
   første linje efter overskriften og stopper ved den første tomme linje, så rækkerne under
   `One-offs` og `Deliberate` bliver aldrig læst med skabelonens egen formatering. Rækkerne
   skal skrives på linjen umiddelbart efter overskriften for at tælle, og det står ingen
   steder.
7. **`verify.md` og `run.md` opgiver scripts som `node scripts/…` fra projektets rod.**
   De ligger i skillmappen, så den rigtige kommando er `node <skill-dir>/scripts/…`.
   `run.md` siger det ét sted og bruger den korte form to gange bagefter.
8. **`floor/buy.md` kræver mere end ét kameravinkel på billedmaterialet** i afsnittet
   "Imagery says what a photograph cannot", mens `look.md` afsnit 3 siger at en tegning er
   det rigtige svar hvor fotografiet ikke findes. De to læses fint sammen her, men gaten
   håndhæver kun `look/no-photograph`, så et build der tegner tre gode tegninger står med en
   afvisning der ikke kan løses uden at bryde briefen. Draft-flaget er svaret, og det er
   ikke skrevet nogen steder at det er svaret på netop den kombination.

**Det der virkede godt.** `look.md` afsnit 4b, kravet om at en af emnets egne målinger skal
kunne læses på et sekund, og at det skal ske mindst to gange fra to forskellige fakta, er
den enkeltregel der formede denne side mest. `ledger.mjs`' krav om at argumentere for
nummer to gav et andet svar end det første, og swap-øvelsen i `SKILL.md` afsnit 6 flyttede
bænken fra en illustration i bunden til at være hele førsteskærmen. Og `critique.mjs`'
adskillelse af billederne fra rapporten virkede: det værste fund på siden kom af at kigge
på et billede, ikke af at læse en kontrol.

## Det der ikke lykkedes

- Der er intet fotografi, og der kommer ikke et. Siden er en draft indtil værkstedet
  leverer et billede af bænken.
- Gaten kan ikke blive grøn på projektmappen som helhed, så længe skillet og briefen ligger
  i den. Det er ført som fund 2 ovenfor, og den grønne kørsel er scopet.
- Antallet af ruder er et felt briefen ikke beder om. Det blev tilføjet, fordi briefens egen
  fejltilstand for antikglas ellers er uopnåelig: den største lovlige rude er 2.200 x
  2.200 mm, altså 4,84 m², og den kan aldrig overskride de 11 m² på lager. Det står som
  antagelse i retningsprotokollen.
- Der ligger tre ting i projektroden som denne kørsel ikke har lavet: `rejse.mjs`,
  `shoot.mjs` og mappen `shots/` med syv skærmbilleder, alle tidsstemplet mens buildet stod
  på. De læser kun siden og skriver billeder, de rører ingen kildefiler, og gaten går uden
  om dem uden at finde noget. De er nævnt og ikke slettet.
- Ordren slutter ikke i en afsendelse. Briefen har et telefonnummer og en adresse og ingen
  e-mailadresse, så sedlen skrives og bæres videre af kunden. Det er den ærlige version, men
  det er ikke den rejse en køber forventer i 2026, og værkstedet bør spørges om en adresse.
