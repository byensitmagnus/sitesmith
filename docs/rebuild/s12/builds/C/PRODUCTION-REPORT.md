# PRODUCTION-REPORT

- Scenario: read
- Surface: én læse-side, `index.html`
- Draft: nej

## Direction

- thesis 1: En værkstedsdagbog: siden er den bænkjournal, der bliver ført mens arbejdet sker.
- thesis 2: Vindvejen: siden er læst i den rækkefølge luften går gennem instrumentet, fra bælgen til pibemunden, og trakturen den modsatte vej.
- thesis 3: Et brev fra to mennesker, der kommer og ser på orglet, før nogen skylder noget.
- built: thesis 2 on the axis of hvor sidens rækkefølge kommer fra
- reason: vindvejen kan menighedsrådet selv gå op på pulpituret og kontrollere, mens dagbogens og brevets orden kun findes inde i værkstedet.
- runner-up argued: thesis 1
- signature: `.bælgfold`, folderne i bælgeskindet, som både adskiller fladerne og bærer sidens argument i deres retning.
- risk: mellemtone-grund i materialets farve med fire mørke fuldbredde-bånd, i stedet for kategoriens pergament og luft.
- originality pass: swap 1 bandt siden til de fakta kun disse to har. Swap 2 afslørede planen som proces, og folden blev derfor lavet om fra adskiller til argumentets rytme.

## Files opened

- `SKILL.md`
- `run.md`
- `stacks/static.md`
- `verify.md`
- `scripts/ledger.mjs`
- `scripts/gate.mjs`
- `scripts/stack.mjs`

Gulvfil: ingen. Step 5 i `run.md` deler efter, hvad den besøgende laver. Et menighedsråd
læser og beslutter, der er ingen pris og intet værktøj på siden, og for den slags flade
siger `run.md` udtrykkeligt, at der ikke skal åbnes nogen gulvfil, fordi sektion 1 til 8
i `SKILL.md` er hele instruktionen. Hverken `floor/buy.md` eller `floor/operate.md` er
åbnet.

Uden for pakken blev kun briefet `docs/rebuild/s11/briefs/C-orgler.md` læst.

## Run notes

- viewports: run ved 320, 375, 768 og 1440 i en rigtig Chromium, med genindlæsning ved hver bredde og måling i DOM. Ingen vandret scroll nogen af stederne: scrollWidth er lig clientWidth ved alle fire, og ingen efterkommer rager ud over viewporten. reason for det, der mangler: der findes ingen skærmbilleder, fordi browserruden ikke komponerer billeder på denne vært, og screenshot fejler med timeout efter 5 sekunder. Intet på siden er altså bedømt med øjnene, kun målt. Det står også under Unresolved.
- axe both schemes: not run. reason: der er ingen axe-installation og ingen playwright på værten, hverken i repoet eller globalt. I stedet blev kontrasten regnet i browseren på hvert eneste tekstelement mod dets faktiske malede baggrund: laveste værdi på hele siden er 6,41, resten ligger på 8,04, 10,11 og 12,95. Fokusindikatoren blev målt for sig, 6,41 mod hudlim-knappen og 10,11 mod ege-foden. Siden erklærer ikke color-scheme, sætter alle sine egne farver og har derfor ét skema, ikke to.
- live server: run. En statisk node-server på 127.0.0.1:8973 leverede build-mappen. Fem indlæsninger, alle 200, ingen konsolbeskeder overhovedet, ingen døde forespørgsler. Serveren blev startet med `npx http-server`, altså hentet fra npm ved kørsel. Den ligger uden for repoet og intet er skrevet ind i projektet.
- anti-slop linter: run. `node scripts/gate.mjs` kørte mod build-mappen. Resultatet står under Mechanical findings.
- fallbacks: begge skriftsnit har en fuld lokal fallback-stak af antikvaer (Iowan Old Style, Palatino Linotype, Georgia, serif), så siden holder sin karakter, hvis Google Fonts ikke svarer. Begge webskrifter blev i øvrigt bekræftet indlæst i browseren, så antagelsen i direction-recorden er nu efterprøvet: Old Standard TT i 400, 400 kursiv og 700, Alegreya i 400 og 500, alle med æ, ø og å.

## States

Siden har tre interaktive elementer, alle tre lænker til det samme telefonnummer: to
ring-knapper og nummeret i foden. Roster fra `verify.md`, gået igennem mod den byggede
side og ikke mod planen:

- rest, hover, focus-visible, active: findes for begge klasser, `.ring` og `.tlf`. Hover
  er aldrig eneste kendetegn, fokusringen er en outline på 3px plus en box-shadow-ring i
  rødt filt, og på den mørke fod skifter outline-farven til alunlæder, så indikatoren selv
  klarer 3:1 mod sin egen baggrund.
- disabled, loading: skipped. reason: en tel-lænke har ingen af delene. Der er ingen
  knapper, der starter noget, ingen formular og ingen netværkskald på siden.
- empty, error, partial: skipped. reason: siden har intet indhold, der hentes eller
  indtastes, så der findes ikke en tilstand, hvor kun noget af det er ankommet.

Journeys: der findes ingen `journeys/`-mappe og intet `scripts/journey.mjs` i denne
pakke, så journey-kontrakten i `verify.md` kunne ikke køres. Den er ikke erklæret bestået.

## Claims

Hver sætning på siden er ført tilbage til briefet. Navnene, 1998, fire eller fem om året,
otte til atten måneder, de fem slags arbejde, nej til elektroniske orgler, gratis første
besøg på en halv dag, tilstandsrapporten uanset udfald, Hvidbjerg i Thy, hele Danmark,
telefonnummeret og postadressen. Intet andet står som sandt.

Beskrivelserne af, hvad en bælg, en vindlade, en pibe og en traktur er, er ordforklaringer
til en lægmandslæser og ikke påstande om værkstedet: de kan ikke handles på og ikke holdes
imod klienten. Ingen svartid, ingen pris, intet om hvad rapporten indeholder, intet om hvad
rådet skal have klar, intet om hvad der sker bagefter. Ingen udtalelser, ingen sognenavne,
ingen instrumentnavne, ingen mærker.

## Mechanical findings

Modellens egen gennemgang skete i browseren, før gaten blev læst. De to første fund er
mine, de tre sidste er maskinens.

- browser/dobbelt-tagrende: `--spalte` var sat til `min(100% - 2.2rem, 62rem)`, mens `.flade` allerede havde `padding-inline`. Rendet var derfor lagt ind to gange, og ved 320 blev tekstspalten 250px i stedet for 285px.
- browser/ombrudt-ringknap: ved 320 brød `Ring 97 87 12 06` over to linjer og gjorde knappen 117px høj.
- gate/verdict-missing-direction-fidelity: `gate.mjs` tilbageholdt dommen om grund, skrift og signatur, fordi playwright ikke er installeret, og der derfor ikke blev renderet noget af gaten selv. Kørslen slutter på exit 1: intet blev afvist, og én kontrol kunne ikke køre.
- ledger/parse: `ledger.mjs parse` svarede complete. Ingen tomme overskrifter, tre teser, én Built-linje, runner-up argumenteret for en anden tese end den byggede.
- gate/token-vocabulary: 0 af 18 erklærede navne kommer fra framework-ordforrådet. Tallet måles og gater aldrig.

## Reconciliation

- browser/dobbelt-tagrende: confirmed. Rettet til `min(100%, 62rem)`, så `.flade` ejer rendet alene. Efter rettelsen er spalten 285px ved 320, 340 ved 375, 689 ved 768 og 992 ved 1440, altså de 62rem planen erklærede.
- browser/ombrudt-ringknap: confirmed. Rettet med `white-space: nowrap`, som først blev muligt, da tagrenden var væk. Knappen er nu 260 gange 75 ved 320 og 375, og der er stadig ingen vandret scroll.
- gate/verdict-missing-direction-fidelity: confirmed. Gaten renderede intet, og en manglende dom er ikke en bestået prøve. Den er ikke lukket ved at pege gaten et andet sted hen. Det, gaten ville have målt, blev i stedet målt i hånden i browseren: grunden er rgb(185, 171, 147), største overskrift renderer i Old Standard TT, brødteksten i Alegreya, og `.bælgfold` findes fire gange i DOM.
- ledger/parse: confirmed. Kørt før første linje kode og igen til sidst.
- gate/token-vocabulary: confirmed som måling, ikke som dom. Tallet er 0 af 18, fordi gatens scanner kun læser `--[\w-]+` og derfor ikke tæller de syv farvenavne med æ og ø. Alle syv er navngivet efter materialer fra værkstedet. Det er en begrænsning i målingen og ikke en påstand om siden.

## Unresolved

- Ingen har set siden. Alt er målt, intet er bedømt visuelt: browserruden komponerer ikke
  billeder på denne vært, og screenshot fejler med timeout. Foldenes gradienter, kornets
  tæthed og den samlede balance mellem de fire flader er derfor uefterset, og det er den
  største åbne risiko i afleveringen.
- `gate.mjs` fik aldrig sin direction fidelity-dom, fordi playwright ikke findes på
  værten. Kørslen slutter på exit 1, ikke 0, og det er ikke rettet.
- Journey-kontrakten i `verify.md` er ikke kørt: der findes hverken en `journeys/`-mappe
  eller et `scripts/journey.mjs` i denne pakke.
- `scripts/verify.mjs` er ikke kørt af samme grund som gatens render: den kræver
  playwright og axe, som ikke er installeret her.
