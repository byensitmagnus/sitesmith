<!-- AI-BRIDGE:CLAUDE-PROJECT:START -->
# SiteSmith

Skill-pakke der bygger/redesigner websites uden AI-generisk look. Offentligt repo `byensitmagnus/sitesmith`. Skillet selv ligger i `skills/sitesmith/` og bruges af andre projekter via `sitesmith`-skillet — denne mappe er hvor skillet **udvikles**, ikke hvor det bruges.

## Hårde regler

- **Licens:** kun fire kilder må videredistribueres — `taste-skill` + `ui-ux-pro-max` (MIT), `frontend-design` + `impeccable` (Apache 2.0). Kopiér aldrig tekst fra `website-builder-setup` (ingen licens) eller `redesign-skill` (ingen sporbar ophavsmand) — se `LICENSE-AUDIT.md` for fuld begrundelse.
- **`skills/sitesmith/SKILL.md` skal blive under 500 linjer** — CI håndhæver det.
- **`benchmarks/06-redesign/before/` er kontrolgruppen og skal blive ved med at fejle** i `scripts/verify.mjs` — CI fejler hvis den består. Ret aldrig testen for at få den grøn.
- Rettelser til de ordret kopierede referencefiler (MIT/Apache-kilderne) hører hjemme opstrøms, ikke i dette repo.

## Verifikationsgate

`scripts/verify.mjs` er beviset for enhver ændring: screenshots ved 375/768/1440px, axe i begge farveskemaer, konsolfejl, døde links, vandret overflow. Kør den før du melder noget færdigt.

## Før du ændrer noget

Tjek `~/.claude/projects/C--Users-Usmo1-Documents-sitesmith/memory/` — særligt `project_sitesmith_release_state.md` (kendt blokeret husstil, showcase-status) og `project_sitesmith_benchmark_decision.md` (droppet benchmark-studie — foreslå det ikke igen).
<!-- AI-BRIDGE:CLAUDE-PROJECT:END -->
