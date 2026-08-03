# Produktionsrapport, Orgelværkstedet Hvidbjerg

- Scenario: read
- draft: no
- Target: docs/rebuild/s11/builds/C
- Floor: ingen. Kørslens trin 4 vælger gulvfil efter, hvad den besøgende laver.
  Her læser et menighedsråd og beslutter, om de skal ringe. Hverken `floor/buy.md`
  eller `floor/operate.md` gælder, og afsnit 1 til 8 i SKILL.md er hele
  instruktionen. Ingen tredje gulvfil er opfundet.

## Retning

```text
thesis 1: Et værksted, der regner i måneder og ikke i timer.
thesis 2: Siden er første side i den tilstandsrapport, rådet får uanset hvad.
thesis 3: Orglet set indefra: vinden fra bælg til pibe, og siden følger den.
built: thesis 2 on the axis of hvem der sidder i lokalet når beslutningen tages
reason: fordi et menighedsråd ikke vælger en stil men et punkt til et møde, og
  fordi det gratis halvdagsbesøg med skriftlig tilstandsrapport bagefter er det
  eneste her, rådet kan sige ja til uden at røre kirkekassen.
runner-up argued: thesis 1
signature: månedsbåndet (.varighed)
risk: atten måneder står på den første skærm, i stedet for at være gemt væk
originality pass: arbejdslistens rækkefølge og margenteksterne blev skåret om,
  så de følger vinden, og paletten blev flyttet fra creme og rust til blyhvid og
  bælgskind
```

## Files opened

- SKILL.md
- run.md
- stacks/static.md
- verify.md
- scripts/ledger.mjs
- scripts/gate.mjs

De tre sidste er åbnet, fordi run.md trin 6 siger "Open `verify.md` and follow
it", og fordi de to scripts er de gates, kørslen skal aflevere output fra. De er
ikke opført under scenariet `read` i SKILL.md. Se punktet i Mechanical findings.

## Run notes

- viewports: 320, 375, 768 og 1440 målt i en rigtig browser mod den lokale
  server. Målt geometrisk, ikke fotograferet: skærmbilleder kunne ikke tages,
  reason: browserruden komponerer ikke billeder i denne session, så
  screenshot-kaldet fik timeout efter 5 sekunder. I stedet er
  `document.documentElement.scrollWidth` mod `clientWidth` og hver elementkasse
  aflæst ved alle fire bredder. Ingen vandret overløb ved nogen af dem.
- axe both schemes: not run, reason: axe-core findes ikke i dette repo, der er
  ingen `package.json` at installere fra i build-mappen, og pakkens egen
  `verify.mjs` kræver playwright, som heller ikke er installeret. I stedet er
  WCAG-kontrastformlen regnet på de renderede farver for hvert element med
  tekstindhold: 0 fejl mod grænserne 4,5:1 og 3:1. Siden erklærer kun ét
  farveskema, `color-scheme: light`, og har ingen mørk variant, så der er ikke
  to skemaer at måle i. Det er en skrevet beslutning i direction-recordet, ikke
  en udeladelse.
- live server: python -m http.server 8911 på 127.0.0.1, og alle målinger er
  hentet derfra. Scaffoldet blev serveret og åbnet, før designkoden blev skrevet.
- anti-slop linter: gate.mjs kørt mod build-mappen, se Mechanical findings.
  Antipattern-detektoren gav 0 udslag: ingen gradienttekst, ingen tre-kolonners
  kortgitter, ingen framework-standardskala, og ikke runde-8-opskriften.
- fallbacks: skærmbilleder erstattet af geometrimålinger i browseren, axe
  erstattet af kontrastberegning på renderede farver, playwright-render i
  gate.mjs kunne ikke køre og er ikke erstattet af noget.

## Mechanical findings

- `reads/outside-manifest`: gate.mjs afviser tre linjer i Files opened, fordi
  `verify.md`, `scripts/ledger.mjs` og `scripts/gate.mjs` ikke står under
  scenariet `read` i SKILL.md's context-blok.
- `direction-fidelity/withheld`: gate.mjs kunne ikke rendere siden, fordi
  playwright ikke er installeret, så dommene om bundfarve, skriftsnit og
  signatur mangler i gatens eget output.

## Reconciliation

- `reads/outside-manifest`: confirmed. Linjerne står der, fordi filerne faktisk
  blev åbnet. Fejlen ligger ikke i bygget: run.md trin 6 pålægger enhver kørsel
  at åbne `verify.md`, men SKILL.md's context-blok nævner kun `verify.md` under
  scenariet `inspect`, og de to scripts nævnes ingen steder. Gaten siger selv
  "Fix one of them; never delete the line to pass", og den eneste rettelse
  ligger i SKILL.md, altså i den pakke, der er under afprøvning her. Den er ikke
  rettet. To forsøg brugt, som run.md tillader: først at opføre filerne korrekt
  under kørslens rigtige scenarie og køre gaten med `--skill` mod pakken, dernæst
  at undersøge, om et andet erklæret scenarie ærligt dækker dem. Det gør ingen:
  `inspect` dækker kun `verify.md`, og de to scripts står ingen steder. At kalde
  kørslen `inspect` ville være en usand oplysning om, hvad der blev bygget her.
  Står som uafklaret nedenfor.
- `direction-fidelity/withheld`: confirmed. Playwright er ikke installeret, og
  der installeres ikke noget som led i opsætning her. De tre domme er i stedet
  taget i hånden mod samme side i en rigtig browser og skrevet ned under
  Designrecord: bundfarven renderer `rgb(217, 218, 212)`, altså `#d9dad4` og
  inden for det bånd, `Palette:`-linjen udspænder, den største overskrift
  renderer i Vollkorn, brødteksten i Atkinson Hyperlegible, og `.varighed` står
  i DOM'en med målbar bredde. Men de er taget i hånden, og gaten melder dem
  stadig som manglende. Ingen pass påstås på gatens vegne.

## Tilstandsliste

Siden har tre interaktive ting: et springlink og to telefonlinks. Optalt, ikke
vurderet.

- Rest, hover, focus-visible, active: findes for alle tre. Hover er aldrig den
  eneste markering, da knappen har både flade og ramme i hviletilstand.
- Disabled: udgår med grund. Der er ingen kontrol på siden, der kan være slået
  fra. Et telefonlink er enten der eller ikke der.
- Loading: udgår med grund. Ingen handling på siden venter på et svar.
- Empty, error, partial: udgår med grund. Siden har ingen formular, ingen
  indtastning og ingen data, der hentes. Der er intet, der kan komme halvt frem
  eller komme forkert ind. Briefen oplyser ingen e-mailadresse, så der er
  bevidst hverken formular eller felt.
- Fokusmarkeringen er 3 px i kancelle med 3 px afstand og måler 13,0:1 mod
  arket, altså over grænsen på sit eget. Tastaturgennemgangen er ikke ført med
  rigtige tastetryk, reason: browserruden tager ikke imod inddata i denne
  session. Reglen `:focus-visible` er verificeret til stede i stylesheetet, og
  ingen regel fjerner browserens egen markering.

## Designrecord, skrevet fra den leverede kode

Aflæst i browseren, ikke fra planen.

- Bund: `#d9dad4`, blyhvid, med en lodret stribning på 40 px i 5,5 % sort.
  Arket ovenpå er `#edeee9` med én ramme på 1 px i `#5f635d`.
- Skrift: h1 renderer i Vollkorn på 41,6 px ved 1440 og 28 px ved 375. Brødtekst
  renderer i Atkinson Hyperlegible på 17 px, linjeafstand 1,65, spaltebredde
  34em, altså cirka 60 tegn.
- Farvebrug som bygget: bælgskind bruges nøjagtig to steder, båndet og knappen,
  præcis som planen sagde. Ingen tredje brug sneg sig ind.
- Kontrast som bygget: 0 elementer under grænsen. Båndet måler 7,3:1 mod arket,
  takkerne 5,3:1.
- Signaturen: `.varighed` renderer 990 px bred ved 1440 og slutter 759 px nede,
  altså inden for første skærm på 900 px. Ved 375 er den 309 px bred, og tallene
  8 og 18 står 59 px fra hinanden ved 320 px bredde.
- Bevægelse som bygget: browseren i denne session melder
  `prefers-reduced-motion: reduce`, og siden opfører sig, som den skal under den
  indstilling: `animation-name` beregnes til `none`, båndet står færdigt tegnet
  fra første billede, og der er ingen animation i kø. Selve optegningen fra otte
  til atten på 900 ms er altså kun verificeret i sin standsede form. Den kørende
  form er ikke set, reason: browseren melder reduce og lader sig ikke sætte om
  herfra. `@keyframes træk` er verificeret til stede i stylesheetet.
- Afvigelse fra planen: månedsbåndet blev flyttet ud af tekstspalten, så det
  spænder over begge spalter i gitteret. Planen placerede det i tekstspalten.
  Ændringen blev lavet, fordi en måleskala på 578 px inde i et ark på 1088 px
  ikke læste som en måling af noget. Farve, skala og indhold er uændret.
- Ingen regel i det leverede stylesheet er en standard, som gulvet eller
  originalitetsgennemgangen havde afvist. Der er ingen mørk bund, ingen
  versaler med sperring, ingen kort med bløde hjørner, intet tre-kolonners
  gitter og ingen skygger overhovedet.

## Uafklaret

1. `reads/outside-manifest`, tre linjer. Kan ikke lukkes fra bygget. Enten skal
   `verify.md` og de to scripts stå under scenarierne i SKILL.md, eller også
   skal run.md trin 6 ikke pålægge en læsekørsel at åbne `verify.md`. Begge
   rettelser hører hjemme i pakken, ikke her.
2. `direction fidelity`, dommen mangler. Playwright er ikke installeret, og
   både `gate.mjs` og `ledger.mjs measure` afhænger af den. `ledger.mjs check`
   og `commit` er derfor heller ikke kørt: de ville have givet exit 3 og en
   tilbageholdt dom, ikke et resultat.
3. Ingen skærmbilleder. Alt visuelt er verificeret gennem geometri og beregnede
   farver, ikke gennem et menneskeligt blik på et billede.
