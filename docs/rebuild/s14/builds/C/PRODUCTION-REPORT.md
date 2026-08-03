# Produktionsrapport, Orgelværkstedet Hvidbjerg

- Scenario: read
- Surface: read (én side, én URL)
- Stack: ingen adapter fundet, ren HTML og CSS uden byggetrin, jf. run.md afsnit 12
- Build: `docs/rebuild/s14/builds/C/index.html`
- Draft: no
- Release: yes

## Hvad der blev bygget

En læseside for et to personers orgelværksted, skrevet til et menighedsråd, der skal
beslutte, hvem det ringer til. Siden er ét stykke støbt orgelmetal: pladen fylder første
skærm, værkstedets navn er slået ned i den, og resten af arket er delt på samme snit med
overskrift til venstre og tekst til højre på brede skærme.

Retningen ligger i `.sitesmith/direction.md` og blev skrevet færdig, inklusive autopilot
beskrivelsen, før den første linje kode.

- Tese 1: Tilstandsrapporten, før den er skrevet.
- Tese 2: Piberækken.
- Tese 3: Måneder som enhed.
- Tese 4: Inde i instrumentet.
- Bygget: tese 1 på aksen "hvad menighedsrådet reelt beslutter i aften".
- Runner-up argumenteret: tese 2, og den tabte på at en søjle af led, der bliver kortere
  nedad, er den vandrette måler i lodret kostume.
- Signatur: værkstedets navn slået ned i pladen, `.stempel`. Slagets art er en slidt
  flade, ikke en måler, ikke et kort, ikke et dokumenthoved.
- Risiko: grunden er koldt metal og ikke papir. Kategorien vælger altid varmt papir.

## Fakta på siden, og hvor de kommer fra

Hver eneste påstand på siden står i briefen. Der er ikke tilføjet et tal, et navn, en
anbefaling, en garanti, en leveringstid eller en beskrivelse af, hvad tilstandsrapporten
indeholder.

- To personer, Aase og Thorbjørn, sammen siden 1998.
- Fire eller fem instrumenter om året. Otte til atten måneder for en fuld restaurering.
- Fem slags arbejde: bælge og pneumatik, vindlader, traktur, piberækker, intonation og
  stemning.
- De installerer ikke elektroniske orgler og siger det.
- Første besøg er gratis, tager en halv dag, og der skrives en tilstandsrapport bagefter,
  uanset om arbejdet bliver til noget.
- Hvidbjerg i Thy, kører i hele Danmark. Telefon 97 87 12 06. Kirkevej 4, 7790 Hvidbjerg.

Sætninger, der blev skrevet og derefter skåret væk, fordi de ikke stod i briefen: hvad
tilstandsrapporten indeholder, hvad der sker efter opkaldet, at instrumentet står stille
mens der arbejdes, og at de kun er to om selve arbejdet. Der er ingen e-mailadresse på
siden, fordi der ikke findes en i briefen.

## Tilstande, gået igennem på den byggede side

Interaktive elementer i alt: to telefonlinks med samme etiket.

| tilstand | status | note |
| --- | --- | --- |
| rest | findes | `.nummer`, hævet metal, understreget 2px |
| hover | findes | flader om til filtgrønt felt, aldrig eneste signal |
| focus-visible | findes | 3px omrids i blæk, 3px offset, 8,2:1 mod grunden |
| active | findes | slaget vender indad, `--hak` |
| disabled | ikke relevant | et telefonlink har ingen deaktiveret tilstand, og attributten ville være en løgn |
| loading | ikke relevant | siden henter ingen data og venter aldrig |
| empty | ikke relevant | der er ingen liste, der kan være tom |
| error | ikke relevant | der er ingen formular og ingen validering |
| partial | ikke relevant | alt indhold er i dokumentet, intet ankommer senere |

## Run notes

- viewports: 375, 768 og 1440 optaget med `verify.mjs`, screenshots i `.sitesmith/verify`
- axe both schemes: kørte i både light og dark, 0 overtrædelser, 0 alvorlige eller kritiske
- live server: `benchmarks/serve.mjs` på `http://localhost:4399/`, HTTP 200 på alle tre bredder
- anti-slop linter: `gate.mjs` kørte mod build mappen, antipattern detektoren fandt 0
- fallbacks: none
- journeys: not run, reason: der findes ingen `scripts/journey.mjs` i denne pakke og ingen
  `journeys/` mappe. Fladen har ingen flertrins vej at køre: den eneste handling er at
  følge et `tel:` link, som forlader siden. Tastaturgennemgangen i `verify.mjs` dækkede de
  to stop, der findes.

## Mechanical findings

- `verify/same-label-controls`: to kontroller med samme etiket, "ring 97 87 12 06", på 375,
  768 og 1440, i `p.handling > a.nummer` og `div.kontaktplade > p.handling > a.nummer`.
- `verify/horizontal-overflow-768`: +20px vandret overløb ved 768px i den anden kørsel.
- `gate/report-missing`: `PRODUCTION-REPORT.md` manglede en `## Files opened` liste.
- `ledger/fingerprint`: aftrykket blev målt til `mid|condensed|imageless|none`, grund
  achromatisk, accent hue 161, mod to fremmede optegnelser i hovedbogen.

## Reconciliation

- `verify/same-label-controls`: confirmed, og beholdt med vilje. Det er samme handling to
  steder, og etiketten er ord for ord den samme, netop for at undgå to navne for én
  hensigt. `gate.mjs` cta/duplicate-intent refuserer ikke, fordi der kun er én etiket.
- `verify/horizontal-overflow-768`: confirmed, og rettet. Årsagen var, at pladens spalte
  regnede `100% - 2.6rem`, mens venstremargenen var 8vw. Bredden bruger nu det samme
  `--kant` token som margenen, og overløbet er 0 på alle tre bredder i den sidste kørsel.
- `gate/report-missing`: confirmed, og rettet ved at skrive denne rapport med listen over
  åbnede filer, run notes og denne afstemning.
- `ledger/fingerprint`: confirmed, ingen veto. Hverken grund, accent eller signaturmateriale
  ligger inden for den bue, hovedbogen afviser, og ingen enhed deles med de to andre
  optegnelser, fordi der ikke blev målt nogen.

## Model findings, fundet før checkerne sagde noget

Begge er fundet ved at se på den optagne render, ikke af et værktøj, og begge er rettet.

- Spætningen var bygget af `repeating-radial-gradient` og rendede som store koncentriske
  ringe over hele arket. Den er nu tre bløde ellipselag med hver sin flisestørrelse
  (211x173, 157x139, 263x197 px), og pladen læses som støbt metal i stedet for som et
  mønster. Andet forsøg lignede prikkede rækker, så alfaerne blev sænket og fliserne
  gjort dobbelt så store.
- Første skærm var en smal tekststrimmel i et bredt tomt felt ved 1440. Pladen deles nu i
  to spalter over 64rem, og resten af arket følger samme snit.

## Files opened

- SKILL.md
- run.md
- stacks/static.md
- verify.md
- scripts/stack.mjs
- scripts/ledger.mjs
- scripts/gate.mjs
- scripts/verify.mjs
- docs/rebuild/s11/briefs/C-orgler.md

Ingen gulvfil blev åbnet. Run.md trin 5 vælger ingen for en læseflade: afsnit 1 til 8 i
SKILL.md er hele instruktionen. `floor/buy.md` og `floor/operate.md` blev ikke læst.

## Gulvet, målt og ikke gættet

| dimension | tilstand | resultat |
| --- | --- | --- |
| rigtigt indhold, ingen lorem | scored | bestået, alt indhold er briefens fakta |
| alle interaktive tilstande findes og kan nås | scored | bestået, se tabellen ovenfor |
| ingen vandret scroll ned til 320px | scored | bestået, 0px overløb ved 375, 768, 1440 |
| synlig tastaturfokus med egen kontrast | scored | bestået, 3px omrids, 8,2:1 |
| prefers-reduced-motion stopper arbejdet | scored | bestået, der findes ingen bevægelse at stoppe |
| semantik, overskrifter, landmarks | scored | bestået, ét h1, main, header, footer, address, ol |
| kontrast 4,5:1 brødtekst og 3:1 stor tekst | scored | bestået, axe 0 overtrædelser i begge skemaer |
| berøringsmål 44px og 24px afstand | scored | bestået, telefonknappen er 44px høj, de to står i hver sit afsnit |
| alt tekst på billeder | skipped | der er ingen billeder på siden, hverken raster eller SVG |
| formularvalidering ved en tillidsgrænse | skipped | der er ingen formular og ingen indtastning |
| 16px på inputfelter | skipped | samme grund, der er ingen inputfelter |

Score: 8 af 8 scorede dimensioner. Nævneren indeholder ikke de tre oversprungne, og de
står med grund i `.sitesmith/result.json`.

## Design record, skrevet til sidst ud fra den byggede kode

Dette er hvad koden gør, ikke hvad planen sagde.

- Grund: `--pibemetal` #b6bcba på `html` og `body`, relativ luminans 0,495. Målt af
  hovedbogen som achromatisk, hvilket er sandt: tin og bly har ingen kulør at tale om.
- Seks navngivne værdier, alle opkaldt efter et materiale i værkstedet: `--pibemetal`,
  `--spætning`, `--rille`, `--egetræ`, `--filt`, `--blæk`. Ingen af dem hedder noget med
  bg, surface eller accent. Danske bogstaver er beholdt i variabelnavnene.
- Typografi: `Archivo Narrow` 700 til mærket, alle overskrifter og telefonknappen,
  `Faustina` 400 og 600 til al løbende tekst. Displayklassen måles som condensed.
- Signaturen `.stempel` renderer: 96px versaler i blæk med en lys kant 2px under og en
  mørk kant 1px over, oven på tre lag spætning.
- Ingen border-radius nogen steder, ingen kort, ingen ikoner, ingen mono skrift, ingen
  tabulartal, ingen versaletiketter ud over ét ord i kontaktfeltet.
- Bevægelse: nul. Ingen transition, ingen animation, ingen scroll effekt. Derfor står der
  ingen tom `prefers-reduced-motion` blok i arket, og `verify.mjs` fandt 0 fund under
  reduceret bevægelse.

Afvigelser fra planen, skrevet ned som afvigelser og ikke som regler:

1. Planen sagde to `repeating-radial-gradient` lag til spætningen. Koden har tre almindelige
   radial-gradienter med `background-size`, fordi den gentagne form rendede som ringe.
2. Planen sagde én spalte på 62ch. Koden har 64ch under 64rem og en to spaltet deling på
   84ch derover, med overskrift til venstre og tekst til højre.
3. Planen nævnte ikke en kant token. Koden har `--kant`, 8vw, som stiger til 14vw over
   84rem, fordi arket ellers klæber til venstre kant på meget brede skærme.

Ingen af de tre er en regel, den næste bygning skal arve. De er noget, denne side gør.

## Kørsler og deres sidste dom

| kommando | dom |
| --- | --- |
| `stack.mjs detect` | ingen adapter, exit 1, ren HTML og CSS valgt efter run.md afsnit 12 |
| `ledger.mjs new` | skrev 19 tomme overskrifter, alle udfyldt før første kodelinje |
| `ledger.mjs parse` | complete, efter én afvisning der er gengivet nedenfor |
| `verify.mjs` | PASS, ingen blokerende fund, efter én afvisning der er gengivet nedenfor |
| `gate.mjs` | every check ran and none refused |
| `ledger.mjs check` | passed, this shape is not in the ledger |
| `ledger.mjs commit` | optaget i `docs/rebuild/s14/ledger/renders.jsonl` |

Afvisninger, ordret, og hvad de førte til:

1. `FAIL  the "Built:" line has en tom reason clause` (ordret: `the "Built:" line has an
   empty reason clause`). Årsag: begrundelsen var brudt over flere linjer, og parseren
   læser kun den første. Hele Built linjen blev samlet på én linje.
2. `1. horizontal overflow at 768px : +20px past the viewport`. Rettet ved at bruge samme
   `--kant` token i spaltebredden som i venstremargenen.
3. `report/missing ... PRODUCTION-REPORT.md has no "## Files opened" list`. Rettet ved at
   skrive denne rapport.

Ingen af de fire skærpede kontroller i denne runde afviste noget: hverken paletten inden
for 12 RGB enheder af premium mønstret, de to display antikvaer og den ene standard
grotesk ved navn, det mættede lilla felt, eller hovedbogens bue for grund, accent og
signaturmateriale. Farverne blev valgt fra værkstedets egne materialer, før noget blev
kørt, og de landede uden for alle fire lukkede felter.

## Konflikter og fravalg

- Briefen beder om dansk tekst, ingen fotografier og ingen opdigtede fakta. Ingen af
  gulvets krav kolliderede med det, så der er ingen konflikt at afveje.
- Der blev ikke stillet spørgsmål til klienten. Intet manglende svar ville have ændret,
  hvad der blev bygget, og run.md trin 1 tillader kun ét spørgsmål, hvis svaret ville.
- Hovedbogens veto blev ikke omgået. Der er ingen `Brief-pinned` linje i retningen, fordi
  intet blev afvist.
