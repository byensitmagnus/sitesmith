# Hvorfor siderne ikke bliver gode

## Svaret i én sætning

Instruktionen har den forkerte form: `skills/sitesmith-v3/SKILL.md` er skrevet som et filter der siger hvad der ikke må ske (jeg talte 63 nægtelser i de 209 altid-indlæste linjer 24 til 232), ikke som en specifikation der siger hvad der skal stå på siden, og de få vurderinger den faktisk beder om bliver skrevet ned i felter som hverken kode eller nogen anden fil læser.

## Beviset

### 1. Modellen forudsagde din dom fem gange ud af fem, og intet læste svaret

Opstrøms er selvkritikken en handling med et resultat. `docs/rebuild/research/frontend-design/LOOPS.md:16-18` citerer kilden: *"revise that part, say what you changed and why"*, og `docs/rebuild/research/frontend-design/MECHANISMS.json:211` har modvægten: *"Not taking a risk can be a risk itself."*

Vores er en sætning. `SKILL.md:150-151`: *"**One risk.** Name the thing you are doing that the category would not."*

Svarene, ordret fra vores egne records:
- `docs/rebuild/s17/holdouts/a-bellfoundry/.sitesmith/direction.md:65`: *"may read as unfinished to someone expecting a craft site. Accepted"*
- `docs/rebuild/s17/holdouts/b-sailmaker/.sitesmith/direction.md:65`: *"asks a lot of a buyer who has not met this loft. Accepted"*
- `docs/rebuild/s18/pilot-klokkestoberiet/.sitesmith/direction.md:91`: *"asks a lot of a visitor who wants to see the place. Accepted"*

Den eneste forbruger af feltet er `skills/sitesmith-v3/scripts/ledger.mjs:155`, som kun tjekker at overskriften ikke er tom, og `ledger.mjs:698`, som printer første linje i rapporten. Modellen skrev din anmeldelse ned før siden blev bygget, fem gange, og gaten var grøn hver gang.

### 2. Billedrækkefølgen er vendt om, og det er hele "tynd"

Opstrøms, `skills/sitesmith/references/03-design-engineering.md:138`: *"**Even minimalist sites need real images.** A pure-text page is not minimalism. It is incomplete work."* Og `:149`: *"Hand-rolled decorative SVGs (custom illustrations, logos, marks): **strongly discouraged**, never as default."*

Vores, `skills/sitesmith-v3/look.md:43-46`: *"**Drawn here.** An SVG, a CSS composition, a canvas figure ... This is the honest answer when the client supplied nothing, and it is a real answer rather than a fallback"*, placeret over licenseret fotografi, og `look.md:52`: *"It does not generate a photograph of a place that exists."*

Resultat, målt med grep over alle fem sider: nul `<img>`. `b-sailmaker/index.html` og `c-limeworks/index.html` har også nul `<svg>`. `pilots/04-byens-it/index.html` har nul af begge dele.

### 3. Vi har ingen håndværkstal, og den ene kontrol vi har tæller det forkerte

Opstrøms, `skills/sitesmith/references/impeccable/craft-floor.md:17`: *"Type: body measure 65–75ch, display max 6rem, tracking floor -0.04em, balanced headings, obvious scale and weight steps. Run the real copy at every breakpoint and fix what overflows."*

Vores, `SKILL.md:122-123`: *"Not the pairing you would reach for on any other project. State the scale and the weights."* Det er hele den typografiske instruktion. Grep efter line-height, leading, tracking og measure i `skills/sitesmith-v3/**/*.md` giver nul hits.

Kontrollen er `ledger.mjs:211`, som tæller navngivne roller, ikke skrifter. Alle fem records erklærer samme skrift to gange (`a-bellfoundry/.sitesmith/direction.md:42-43` Iowan Old Style to gange, `c-limeworks:42-43` Segoe UI to gange, `pilots/04-byens-it:70-71` ui-sans-serif to gange) og alle fem består. Ingen af siderne loader en webfont.

Konsekvensen på siden: `a-bellfoundry/index.html:44`, `:57`, `:77` og `:86` sætter hver sektion til `max-width:70ch` uden `margin-inline:auto`, så hele siden ligger i venstre halvdel af en 1440-skærm og højre halvdel er bar bund.

### 4. Opstrøms tæller devices, vi stiller et spørgsmål modellen selv besvarer

Opstrøms, `03-design-engineering.md:115`: *"**Section-Layout-Repetition Ban.** ... A landing page with 8 sections must use at least 4 different layout families."* Og `:117-120`: *"**Maximum 1 eyebrow per 3 sections.** ... Pre-Flight Check is mechanical: count instances of `uppercase tracking` ... If count > ceil(sectionCount / 3), the output fails."*

Vores, `SKILL.md:129-132`: *"Ask what each device claims, and cut the ones that claim nothing."*

Den accepterede side har tre sektioner og tre eyebrows: `pilots/04-byens-it/index.html:217`, `:249`, `:261` (`JOB 01 · GAMING` og videre), sat i mono med `letter-spacing: .08em` på `:130`. Og de to detektorer vi rent faktisk har, `gate.mjs:1178` og `ledger.mjs:544`, kræver begge `text-transform: uppercase`. Grep efter den property over alle fem sider giver nul hits, fordi versalerne er tastet ind i markup. Detektoren kan ikke fyre på noget vi har bygget.

### 5. Ingen fil kræver at siden har en skal, og kildereglen sletter den

Opstrøms forudsætter at der er navigation, `03-design-engineering.md`: *"**Navigation MUST render on a single line on desktop.** If items don't fit at `lg` (1024px), condense labels, drop secondary items, or move to a hamburger."*

Vores, `SKILL.md:192-195`: *"If it is not in the brief or the evidence it does not go on the page, not as a placeholder and not as a plausible example ... The bottom rung is nothing at all."* Grep efter footer, masthead, wayfind, contact og address i `skills/sitesmith-v3/*.md` og `floor/*.md` giver ét hit, `floor/buy.md:68`, og det handler om URL-linjen.

Tallene: `a-bellfoundry/index.html:101`, `b-sailmaker:88`, `c-limeworks:85` og `pilot-klokkestoberiet:174` indeholder hver præcis ét `<a>`, og det er skip-linket. Nul `<nav>`, nul `<footer>`. `pilots/04-byens-it/index.html` har 12 anchors, én `<nav>` på `:206` og én `<footer>`. Det er den reneste korrelation i hele sættet.

Værst: `pilot-klokkestoberiet/index.html:318-320` printer sin egen sletning, *"Der er ikke tilføjet besøgstal, priser, adresse eller parkeringsforhold, fordi programmet ikke nævner dem"*, på en side der reklamerer for en fysisk støbning kl. 11.14 den 14. september.

## Er det prompt, opbygning eller kode

**Prompt: 55 %.** Filens form er forkert, ikke dens længde: 63 nægtelser mod stort set én størrelsesklausul (`SKILL.md:222`, *"A smaller implementation of the chosen direction is always right"*), ingen håndværkstal, en billedrækkefølge der sætter en tegning over et fotografi, og ingen forpligtelse nogen steder om at en side skal fortælle hvem det er, hvor de er, og hvad man kan gøre.

**Kode: 30 %.** De kontroller vi har kan ikke fyre på vores egne sider: `gate.mjs:1178` og `ledger.mjs:544` kræver en CSS-property der optræder nul gange i korpuset, `gate.mjs:1371` lukker de eneste to positive krav bag `/experience|marketing|campaign|launch|editorial/` så `buy` og `operate` aldrig når dem, og `ledger.mjs:211` accepterer samme skrift erklæret to gange som "to roller".

**Opbygning: 15 %.** `look.md` er ikke altid indlæst (`SKILL.md:6`, `always: [SKILL.md]`), den åbnes først i `run.md:38` som trin 5 efter at farve, type, layout og signatur er skrevet i trin 3, den er slet ikke routet til `operate` (`SKILL.md:10`), og den påstår på `look.md:61` at `verify.mjs` måler malet flade, hvilket grep i `scripts/verify.mjs` modbeviser.

## De tre ting der ville flytte mest

**1. Krav om en skal: hvem, hvor, én ting læseren kan gøre. Cirka 3 timer.**
Ny forpligtelse i `SKILL.md` sektion 8 plus en 22. overskrift i `ledger.mjs` REQUIRED (`ledger.mjs:42-70`), så et tomt svar fejler i stedet for at ske i stilhed. Ville have forhindret: `pilot-klokkestoberiet`, som slettede adressen og skrev sletningen på siden (`index.html:318-320`), og de tre s17-holdouts, der hver har ét link og ingen vej ud.

**2. Vend `look.md:41-52` om og gør billedfri til draft. Cirka 1 time.**
Klientens fotografi først, licenseret fotografi som nummer to, egen tegning sidst, og "kunne ikke skaffes" udløser den draft-regel der allerede står på `look.md:50`. Ville have forhindret: `b-sailmaker`, en buy-flade med nul billeder, som allerede bryder sin egen forpligtelse i `floor/buy.md:73-76` (*"More than one angle, treated alike across the catalogue"*) uden at noget kan se det.

**3. Giv Risk-feltet en forbruger. Cirka 3 timer.**
Når Risk-teksten opløses til tynd, ufærdig eller billedløs, skal den navngive det element der svarer på den, og `gate.mjs` skal finde det element i DOM'en på samme måde som den allerede finder signaturen på `gate.mjs:1430`. Ville have forhindret: alle fem, mest åbenlyst `a-bellfoundry`, hvis record på `:65` skrev "may read as unfinished" og derefter shippede grønt.

## Hvad der ikke er problemet

**Modellen ignorerer ikke instruktionen.** Alle fem records udfylder hver overskrift, autopilot-siden er skrevet og ikke bygget, runner-up er argumenteret, og farverne er navngivet efter materialer præcis som `SKILL.md:105-116` beder om (`a-bellfoundry/index.html:13-16`: `--sand`, `--jern`, `--gloed`). Siderne er lydighed, ikke afvigelse. Hold op med at betale for endnu en omgang instruktionstekst.

**Mere prosa virker ikke.** `look.md` landede i commit `28c4435` den 2. august kl. 14:56 med 102 linjers positiv visuel instruktion. Den eneste side bygget med den, `pilot-klokkestoberiet` kl. 15:06, er den du kaldte forvirrende. Den accepterede side, `pilots/04-byens-it` kl. 12:18, blev bygget før filen fandtes. Jeres eget `skills/sitesmith-v3/README.md:88-89` har allerede skrevet det ned: *"Every fix moved it rather than removing it."*

**Farveplanen og de to nye positive gates.** Farvesektionen er den mest fulgte del af filen og ændrede ingenting ved din dom. Og udvid ikke `gate.mjs:1368-1381` til `buy` som den er: den accepterede side har nul `<svg>` og nul `<img>`, så dens paintedShare er cirka 0 mod et gulv på 0.15, og gaten ville afvise netop den side du sagde ja til.