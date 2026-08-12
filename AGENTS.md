<!-- AI-BRIDGE:CLAUDE-PROJECT:START -->
# SiteSmith

Skill-pakke der bygger/redesigner websites uden AI-generisk look. Offentligt repo `byensitmagnus/sitesmith`. Denne mappe er hvor skillet **udvikles**, ikke hvor det bruges.

## Det levende skill ligger ét sted

**`skills/sitesmith-v3/`.** Det er `packageRoot` i `product/pipeline.json`, og det er det `node bin/sitesmith.mjs install` lægger ud.

`skills/sitesmith/` er **legacy v2-historik**. Den nås kun med `--legacy-v2` og bliver liggende, fordi CI og benchmarks stadig kører dens `scripts/verify.mjs` og `scripts/token-drift.mjs`. Byg aldrig efter den. En byggeagent læste den, troede den var den aktuelle pipeline, og slettede sit eget færdige arbejde på den præmis — se `docs/lab/rendered-pilot-02-damgaard/`. `tools/test-one-live-surface.mjs` håndhæver at der kun findes én levende flade.

## Hårde regler

- **Licens:** kun fire kilder må videredistribueres — `taste-skill` + `ui-ux-pro-max` (MIT), `frontend-design` + `impeccable` (Apache 2.0). Kopiér aldrig tekst fra `website-builder-setup` (ingen licens) eller `redesign-skill` (ingen sporbar ophavsmand) — se `LICENSE-AUDIT.md` for fuld begrundelse.
- **`skills/sitesmith-v3/SKILL.md` skal blive under 500 linjer** — CI håndhæver det.
- **`benchmarks/06-redesign/before/` er kontrolgruppen og skal blive ved med at fejle** i `scripts/verify.mjs` — CI fejler hvis den består. Ret aldrig testen for at få den grøn.
- Rettelser til de ordret kopierede referencefiler (MIT/Apache-kilderne) hører hjemme opstrøms, ikke i dette repo.

## Verifikationsgate

`scripts/verify.mjs` er beviset for enhver ændring: screenshots ved 375/768/1440px, axe i begge farveskemaer, konsolfejl, døde links, vandret overflow. Kør den før du melder noget færdigt.

## Før du ændrer noget

Tjek `~/.claude/projects/C--Users-Usmo1-Documents-sitesmith/memory/` — særligt `project_sitesmith_release_state.md` (kendt blokeret husstil, showcase-status) og `project_sitesmith_benchmark_decision.md` (droppet benchmark-studie — foreslå det ikke igen).
<!-- AI-BRIDGE:CLAUDE-PROJECT:END -->
