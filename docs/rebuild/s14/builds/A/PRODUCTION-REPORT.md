# Produktionsrapport, Sømkraft

- Scenario: buy
- release: yes
- Target: `docs/rebuild/s14/builds/A/index.html`
- Stak: ingen fundet af `stack.mjs`, så ren HTML og CSS uden byggetrin, jævnfør run.md afsnit 12.
- Overflader: buy (én side, én overflade)

## Hvad der blev bygget

Én selvstændig HTML-fil med indlejret CSS, ingen JavaScript, ingen framework, ingen
byggetrin. To skrifter hentes fra Google Fonts. Alt billedmateriale er seks
stregtegninger i SVG tegnet til siden, plus sømlinjer der er ren CSS.

Siden sælger tre bestemte istandsatte industrisymaskiner til en værkstedsejer der
allerede kender faget. Prisen står i oversigten og som første række i hver maskines
købsblok, og hele forpligtelsen står i den samme blok som opkaldet.

## Retningen, som ledgeren læste den

```text
thesis 1: En værkstedsjournal: siden er istandsættelsesrapporten for tre bestemte maskiner, ført i den rækkefølge værkstedet arbejder i.
thesis 2: En prøvesøm man kan købe fra: siden er den søm de otte timers kørsel lægger, og de tre maskiner hænger på den hver med sit eget stingbillede.
thesis 3: Et fabriksskilt: siden er maskinens egen typeplade i lak og støbejern, med prisen slået ind i pladen.
built: thesis 2 on the axis of hvad køberen selv kan aflæse frem for papir hun må tage på tro
reason: en prøvesøm er maskinens eget resultat og de tre stingbilleder adskiller de tre maskiner nøjagtigt der hvor køberen vælger imellem dem
runner-up argued: thesis 1
signature: `.sting`, prøvesømmen som specimen
risk: bunden er maskinlak i mellemtone og der er intet hvidt felt på siden
```

## Files opened

- `SKILL.md`
- `run.md`
- `floor/buy.md`
- `stacks/static.md`
- `verify.md`
- `scripts/stack.mjs`
- `scripts/ledger.mjs`
- `scripts/gate.mjs`
- `scripts/verify.mjs`
- `docs/rebuild/s11/briefs/A-symaskiner.md`
- `benchmarks/serve.mjs`
- `benchmarks/package.json`

De fire scripts blev kørt, ikke læst ind som instruktion. `docs/` og `benchmarks/` ligger
uden for pakken og indgår ikke i afsløringsbudgettet. Intet under
`docs/rebuild/` blev åbnet ud over denne kørsels egen brief og denne kørsels egen
byggemappe.

## Run notes

- viewports: 375, 768 og 1440 px optaget af verify.mjs mod http://localhost:4411/, plus en fjerde optagelse ved 1440 px med prefers-reduced-motion.
- axe both schemes: kørte i begge farveskemaer, 0 overtrædelser, 0 alvorlige eller kritiske.
- live server: kørte, `node serve.mjs 4411` fra benchmarks mod byggemappen, HTTP 200 på alle tre bredder, 0 fejlede forespørgsler, 0 døde links.
- anti-slop linter: gate.mjs kørte mod byggemappen med `--skill` peget på sitesmith-v3, hver kontrol kørte og ingen nægtede.
- fallbacks: journey.mjs findes ikke i denne pakke, reason: filen er ikke i `skills/sitesmith-v3/scripts/`, så journey-kontrakten i verify.md er efterprøvet i hånden gennem verify.mjs' tastaturgennemgang, som fandt 9 fokusstop på hver af de tre bredder.

## Mechanical findings

- `verify/same-label-two-controls`: to kontroller bærer samme etiket, "Ring 97 22 08 41", i toplinjen og i den faste opkaldsbjælke. Målt på alle tre bredder.
- `verify/same-target-five-controls`: fem kontroller peger på `tel:+4597220841` med fire forskellige etiketter. Målt på alle tre bredder.
- `ledger/imagery-imageless`: billedandelen på første skærm ved 1440x900 måles til 0 procent, så aftrykket klassificerer siden som billedløs.
- `ledger/ground-band-mid-dark`: bunden måles til relativ luminans 0,377, kulør 102, hvilket lander i båndet mid-dark og ikke i det lyse bånd kategorien normalt bruger.
- `gate/no-css-files`: gaten finder 0 `.css`-filer, fordi hele arket er indlejret i `index.html`.

## Reconciliation

- `verify/same-label-two-controls`: confirmed. Det er tilsigtet og står i gulvets tredje vej: én kontrol forpligter, og den er inden for rækkevidde overalt. De to steder bærer med vilje nøjagtig samme ord, så bjælken ikke læses som en anden handling end knappen i toppen.
- `verify/same-target-five-controls`: confirmed. Alle fem ringer det samme nummer. De tre etiketter i maskineblokkene navngiver maskinen, fordi køberen skal kunne sige hvad hun ringer om, og verbet er det samme hele vejen. Ingen af dem er en anden hensigt, og der er derfor kun én forpligtende kontrol på siden.
- `ledger/imagery-imageless`: confirmed. Der findes ingen fotografier, og tegningerne ligger i maskineblokkene under første skærm. Målingen er rigtig og beskriver et vilkår i brief'en, ikke en mangel i bygget.
- `ledger/ground-band-mid-dark`: confirmed. Det er den navngivne risiko i retningsoptegnelsen. Kontrasten er målt for hvert par og ligger over gulvet.
- `gate/no-css-files`: false-positive, reason: brief'en kræver én selvstændig HTML-fil, så et separat ark ville bryde en betingelse der står i klientens egne ord. Alle regler blev læst af gaten gennem `<style>`-blokken, og token-driften kørte på dem.

## Gulvet for køb, punkt for punkt

- Objektet og vejen til at få det ankommer sammen: de tre maskiner står med navn, stingtype og pris i oversigten på første skærm, og hver maskineblok åbner med købslinjen.
- Prisen findes uden at blive jagtet: samme sted i hver række i oversigten, og som første række i hver maskines købsblok. Ingen tidligere pris er nævnt, fordi ingen er oplyst.
- Én kontrol forpligter: opkaldet. Den har samme udseende hvert sted, og den faste bjælke i bunden gør den tilgængelig uanset hvor på siden køberen beslutter sig.
- Hele forpligtelsen er læselig før den indgås: pris, garanti på tolv måneder, hvad garantien ikke dækker, levering til Jylland og Fyn til 900 kr., Sjælland efter aftale, og indbytning vurderet ved gennemsyn står alle i den samme blok som opkaldet. Alt er ord, ingen farvekode.
- Intet bevæger sig nær penge: der er ingen overgange, ingen animation og ingen JavaScript på siden.
- Sættet indsnævres på køberens navneord: den skrevne oversigt bruger stingtypen som indgang, antallet står i overskriften, og der er ikke andre maskiner end de tre. Ingen tom tilstand kan nås, fordi der ikke er noget filter at tømme.
- Billedbehandling: to tegninger pr. maskine, samme stregtykkelse, samme ramme, samme billedtekst med motiv, udsnit og bund. Målestok er ikke fastlagt, fordi der ikke er oplyst mål på maskinerne, og hver billedtekst siger det.
- Enhver påstand kan efterprøves på samme flade: hver sætning i teksten peger på en række i specifikationen. Afsnittet "Det du ikke finder her" siger hvad der mangler og hvorfor.

## Tilstandsoversigt, målt på den byggede side

| Tilstand | Status | Hvor |
| --- | --- | --- |
| Hvile | findes | alle links og knapper |
| Hover | findes, aldrig eneste virkemiddel | `.ring:hover`, `.lager-liste a:hover` |
| Fokus synlig | findes, 3 px kontur med 3 px afstand, mørk på lyse flader og kridt på mørke | `:focus-visible` |
| Aktiv | findes | `.ring:active` |
| Deaktiveret | skipped, reason: der er ingen kontrol på siden der kan være utilgængelig, fordi der ikke er nogen tilstand at være utilgængelig i |
| Indlæsning | skipped, reason: siden har ingen JavaScript og ingen asynkron handling, så intet kan være undervejs |
| Tom | skipped, reason: der er intet filter, ingen søgning og ingen kurv, så der findes ingen tom visning |
| Fejl | skipped, reason: der er ingen formular og intet inddatafelt, så der er ingen fejl at placere ved en årsag |
| Delvis | skipped, reason: alt indhold står i den samme fil og ankommer i samme forespørgsel |

## Bedømmelse

Denominatoren er kun de bedømte felter. Det oversprungne felt indgår ikke.

| Felt | Status | Point |
| --- | --- | --- |
| Objekt og erhvervelse sammen | scored | 5 af 5 |
| Prisen findes | scored | 5 af 5 |
| Én forpligtende kontrol | scored | 4 af 5 |
| Forpligtelsen er læselig | scored | 5 af 5 |
| Intet bevæger sig nær penge | scored | 5 af 5 |
| Indsnævring på køberens navneord | scored | 4 af 5 |
| Billedbehandling | scored | 4 af 5 |
| Påstande kan efterprøves | scored | 5 af 5 |
| Tilgængelighedsgulvet | scored | 5 af 5 |
| Interaktive tilstande | scored | 4 af 5 |
| Journey-kontrakten | skipped | reason: `journey.mjs` findes ikke i denne pakke, og overfladen har ingen flertrins-vej at drive igennem uden JavaScript |

Sum: 46 af 50 på de ti bedømte felter.

Fradragene: den forpligtende kontrol bærer fire forskellige etiketter mod samme mål;
indsnævringen er en skreven oversigt uden tilbagevenden med filtre, fordi der ikke er
nogen filtre; billedbehandlingen fastlægger ikke målestok, fordi målene ikke er oplyst;
tilstandsoversigten har fem oversprungne tilstande, alle med grund.

## Designoptegnelse, skrevet af det der faktisk blev sendt

Skrevet fra `index.html`s eget stilark, ikke fra planen.

- Bund: `--maskinlak: #9fa89b` på både `html` og `body`. Målt relativ luminans 0,377. Der er intet hvidt felt nogen steder på siden.
- Farver i brug: syv, alle navngivet efter et materiale i værkstedet. `--maskinlak`, `--slidt-lak`, `--støbejern`, `--kridt`, `--kontrasttråd`, `--olie`, `--bordplade`. Ingen af dem hedder noget der beskriver en rolle.
- Mættede farver: to, `--kontrasttråd` og `--olie`. Tråden bruges kun til streger, knuder og kanter, aldrig til brødtekst, fordi den kun når 1,8:1 mod bunden. Olien bruges kun oven på støbejern, hvor den når 8,4:1.
- Skrift: `Familjen Grotesk` 600 og 700 til alle overskrifter og til priser og knapper, `Literata` 400 og 600 til brødtekst. Knibning minus 0,015 em på overskrifter, minus 0,02 em på navn og pris. Ingen versaler nogen steder på siden.
- Tal: `font-variant-numeric: tabular-nums` på priser i oversigten, på prisen i hver købsblok og på trinnumrene i den mørke bane.
- Hjørner: ingen. Der er ikke en eneste `border-radius` i arket.
- Skygger: ingen. Der er ikke en eneste `box-shadow`.
- Streger: alle 2 px eller mere. Ingen hårfine streger, hvilket er grunden til at aftrykket ikke rapporterer `hairline-separators`.
- Signatur: `.sting` med tre varianter. `.sting--enkelt` giver blokken én stiplet linje foroven og forneden, `.sting--transportfod` giver én linje med et parret mærke under, og `.sting--tvilling` giver to parallelle linjer med indholdet sat imellem. Geometrien for hver blok er den stingrække maskinen selv syr.
- Sømmen: en lodret stiplet linje i `--søm-lodret` ned gennem maskinerne med en knude i `--kontrasttråd` ved hver maskine og en sidste knude efter den tredje.
- Bevægelse: ingen. Ingen `transition`, ingen `animation`, ingen `scroll-behavior`. `prefers-reduced-motion` har derfor intet at standse, og verify.mjs fandt 0 punkter i den kørsel.
- Layout: én spalte til og med 63 rem. Fra 64 rem deler hver maskineblok sig i to spalter, specifikation til venstre og tegninger til højre. Der er ingen tre-spaltet gitter af ens kort nogen steder.

Afvigelser fra planen: ingen i farve, skrift eller signatur. To ting kom til under
bygget og står ikke i planen: tospaltet maskineblok fra 64 rem, og en foldet hjørneflig
på prøvelappen i stingtegningerne. Begge er noteret her frem for at blive skrevet ind i
planen bagefter.

Defekter denne bygning bærer: ingen kendte. Ingen standard som gulvet eller
originalitetspasset afviste er sendt med.

## Aftrykket, som ledgeren målte det

```text
fingerprint: mid-dark|sans|imageless|flat-surfaces+line-only-imagery+tabular-figure-motif
  ground     mid-dark (relativ luminans 0.377, kulør 102, h90)
  accent     10 (h0)
  display    sans
  imagery    imageless (0% af første skærm ved 1440x900)
  devices    flat-surfaces, line-only-imagery, tabular-figure-motif
ledger:      0 poster før denne kørsel
verdict:     passed, this shape is not in the ledger
```

Frøopskriften kræver fire greb samtidig: `mono-uppercase-labels`,
`hairline-separators`, `tabular-figure-motif` og `flat-surfaces`. Denne bygning har to
af dem. De to der mangler er fravalgt bevidst: der er ingen monoskrift og ingen versaler
på siden, og alle streger er 2 px eller mere.

## Fakta, og hvad der ikke står på siden

Alt der står som sandt på siden kommer fra brief'en: årstal 2014, de tre navne, de fire
trin i istandsættelsen, de otte timer under belastning, de tre maskiner med deres
stingtype og deres pris, tolv måneders garanti med motor og elektronik undtaget,
levering til Jylland og Fyn til 900 kr., Sjælland efter aftale, indbytning vurderet ved
gennemsyn, telefonnummeret og åbningstiden.

Ikke skrevet, fordi det ikke er oplyst: leveringstid, hvor mange maskiner der er solgt,
anmeldelser, kundenavne, mål på maskinerne, motoroplysning for Pfaff 1245 og Brother
B845, hvad der sker efter opkaldet, og hvad en vurdering ved gennemsyn indebærer.
Motorrækkerne for de to sidste maskiner står som "Ikke oplyst for denne maskine" frem
for at blive udeladt, så specifikationen er ens på alle tre.

## Uafklaret

Intet. Ingen defekt nåede loftet på to rettelsesforsøg, og ingen kontrol blev tilbageholdt.
