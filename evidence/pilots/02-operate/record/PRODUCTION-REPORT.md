# Produktionsrapport

scenario: operate
draft: no

## Hvad der blev bygget

Bjerregaard Sluses vagtkonsol. Én side, Astro, rigtig produktionsbuild, ingen levende
forbindelse: natten den 3. august er faste data i siden, og skærmen står klokken 04:10.

## Files opened

- `.claude/skills/sitesmith/SKILL.md`
- `.claude/skills/sitesmith/run.md`
- `.claude/skills/sitesmith/look.md`
- `.claude/skills/sitesmith/floor/operate.md`
- `.claude/skills/sitesmith/stacks/astro.md`
- `.claude/skills/sitesmith/contract.md`
- `.claude/skills/sitesmith/verify.md`
- `.sitesmith/RUN.md`, `.sitesmith/direction.md`, `.sitesmith/contract.json`

## Mechanical findings

| hvad | hvor | hvad der blev gjort |
| --- | --- | --- |
| 38 fund om trykflader: menupunkter på 19px og 12px mellem de to kontroller | `verify.mjs`, alle tre bredder | Menupunkter fik 44px højde og 56px afstand; kontrollerne fik 32px imellem sig |
| Spring-linket på 40px | `verify.mjs`, alle tre bredder | 44px højde |
| Logtekst på 142 tegn ved 1440 | `verify.mjs` | Rækken bundet til 80ch, teksten til 62ch, tidsstemplet beholder sin kolonne |
| Lys tekst på mørk bund ved vægt 400 | `verify.mjs`, alle tre bredder | Kompenseret på leading og sporing, 1,6 og 0,008em. Vægten blev bevidst ikke rørt: 350 er en variabel akse Segoe UI Variable Text har og Segoe UI ikke har, og på en maskine uden den første ville browseren vælge 300, hvilket er den forkerte vej |
| Kontrakten: rust #b4462a på 2,91 mod kammerbetonen | `contract.mjs check`, før implementering | Materialet blev våd rust under lygten, #dd7050, 4,93 |
| Kontrakten: fokusrækkefølgen sagde at kontrollerne kom før menuen | `contract.mjs compare` | Kontrakten var forkert om siden. Rettet og skrevet ind som departure |

## Reconciliation

Alle fund er behandlet. Nedenfor står hvad der blev rettet, hvad der er dokumenteret, og
det ene der er afvist som falsk positiv med begrundelse.

**Rettet:** trykflader, spring-linket, den for lange logtekst, kontraktens rustfarve,
kontraktens fokusrækkefølge, aktivmanifestets format, `data-asset` på begge tegninger,
`.post-top`'s forskydning fra rygraden, de tomme flanker i posterne, og lygtens farve.

**Dokumenteret, ikke lukket:** `verify.mjs` melder ved alle tre bredder at lys tekst på
mørk bund ved vægt 400 skal kompenseres på leading, sporing og vægt. Den er kompenseret på
leading og sporing, og vægten er bevidst ikke rørt, fordi 350 er en variabel akse Segoe UI
Variable Text har og Segoe UI ikke har. Svaret står i kontraktens `typography`.

**Falsk positiv, med begrundelse:** `verify.mjs` melder logrækkerne som 100 tegn ved 768 og
1440, uden for båndet 45 til 80. Målingen er taget på `li`-elementet, som er hele rækken,
og ikke på tekstspalten inde i den, som er bundet til 52 tegn. Rækken går fra kant til kant
fordi den bærer sin egen tid til venstre og hvor længe siden det er til højre, og teksten
imellem holder sit mål.

Det er efterprøvet, og prisen for at få tallet ned blev målt to gange: en smallere række lod
430px stå tom til højre, hvilket `gate.mjs` afviste som `look/lopsided-band` og havde ret i,
og en centreret blok stod 214px fra sidens rygrad, hvilket den afviste som
`look/ragged-margin` og også havde ret i. Layoutet der består begge, er det der er her, og
det tal `verify.mjs` melder, er en måling af den forkerte kasse.

## Run notes

- viewports: 375, 768 og 1440 renderet mod den serverede produktionsbuild, plus en fjerde
  kørsel ved 1440 med prefers-reduced-motion sat på konteksten
- axe both schemes: ja, `@axe-core/playwright` kørt i både light og dark, 0 overtrædelser i
  begge. Siden har kun ét skema, og det er det mørke; light-kørslen renderer den samme side
- live server: ja, produktionsbuild serveret på http://localhost:4371, HTTP 200 ved alle tre
  bredder. Gaten og kontraktens compare er kørt mod den samme serverede build
- anti-slop linter: ja, antipattern-detektoren i `gate.mjs` kørte og fandt ét fund,
  `palette/premium-consumer-default`, som er erklæret under `Deliberate` med begrundelsen
- fallbacks: ingen. Alle kommandoer i `.sitesmith/RUN.md` kørte som skrevet

- Kontrakten fandt to ting før der var skrevet en linje kode: farven der ikke kunne bære sin
  egen tekst, og en fokusrækkefølge der var gættet. Begge var billigere at rette der.
- Skærmen er mørk fordi brugsscenen er mørk, ikke fordi konsoller er mørke. Det står i
  `colour.schemes.why`, og genericitetsrisikoen ved præcis den beslutning står ved siden af.

## Gate

Én afvisning: `look/no-photograph`, erklæret under `Deliberate` i retningsprotokollen og
begrundet i `ASSET-MANIFEST.md`.
