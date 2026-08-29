# Produktionsrapport

scenario: read
draft: no

## Hvad der blev bygget

Vestkystens Frøbanks ene side. Astro, rigtig produktionsbuild, ingen CMS og ingen database.
Forespørgslen sendes ingen steder, og det står ved siden af knappen.

## Files opened

- `.claude/skills/sitesmith/SKILL.md`
- `.claude/skills/sitesmith/run.md`
- `.claude/skills/sitesmith/look.md`
- `.claude/skills/sitesmith/stacks/astro.md`
- `.claude/skills/sitesmith/contract.md`
- `.claude/skills/sitesmith/verify.md`
- `.sitesmith/RUN.md`, `.sitesmith/direction.md`, `.sitesmith/contract.json`

## Mechanical findings

| hvad | hvor | hvad der blev gjort |
| --- | --- | --- |
| Kontrakten: den ubleget papirbund lå fem enheder fra en creme i anti-tell-paletten | `gate.mjs`, før implementering | Bunden blev den grå klit, som briefen selv navngiver. Sytten enheder væk, og lige så sand for emnet |
| Kontrakten: den deaktiverede sætning målte 3,1 mod et gulv på 4,5 | `contract.mjs check`, før implementering | Sætningen er en besked og ikke en deaktiveret etiket. Fuld blæk |
| 27px og 26px ved alle tre bredder | `verify.mjs` | Reglens overskrift lå på browserens egen 1.5em. Alle h2 sat til skalaens 27 |
| 8px mellem menupunkter på 375 | `verify.mjs` | 24px begge veje |
| Formularen blev stående synlig under kvitteringen | `journeys/forespoergsel.spec.mjs` | `display: grid` slår browserens egen `[hidden] { display: none }`. Erklæret eksplicit for begge |

## Reconciliation

Alle fem fund er lukket. Ingen er efterladt, og ingen er en falsk positiv.

To af dem blev fundet af kontrakten før der var skrevet en linje kode, og to af dem af
verify og journey efter. Den femte, den skjulte formular, ville ingen af de mekaniske
kontroller have fanget: den blev fundet af rejsen, fordi rejsen påstår noget om hvad en
besøgende ser efter at have handlet.

## Run notes

- viewports: 375, 768 og 1440 renderet mod den serverede produktionsbuild, plus en fjerde
  kørsel ved 1440 med prefers-reduced-motion sat på konteksten
- axe both schemes: ja, `@axe-core/playwright` kørt i både light og dark, 0 overtrædelser i
  begge. Siden har kun ét skema, det lyse, og dark-kørslen renderer den samme side
- live server: ja, produktionsbuild serveret på http://localhost:4381, HTTP 200 ved alle tre
  bredder. Gaten og kontraktens compare er kørt mod den samme serverede build
- anti-slop linter: ja, antipattern-detektoren i `gate.mjs` kørte og fandt 0
- fallbacks: ingen. Alle kommandoer i `.sitesmith/RUN.md` kørte som skrevet

## Gate

Én afvisning: `look/no-photograph`, erklæret under `Deliberate` i retningsprotokollen,
begrundet i `ASSET-MANIFEST.md`, og skrevet på siden selv i foden. Det manglende fotografi
er det aktiv der ville flytte mest på netop denne side.
