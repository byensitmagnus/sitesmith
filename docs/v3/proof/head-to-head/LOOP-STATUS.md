---
title: Loop status
status: active
ai_generated: "(C)"
---

# Loop status — ærlig version

## Hvad der var forkert første gang

| Det du fik | Det du bad om |
|---|---|
| Ét `scheduler` fire (~2–3 min) + jeg **cancellede** det | Et **vedvarende** loop der kører videre alene |
| Status + “sæt API-key” | Arbejde over mange ticks indtil Done/blocker |

Det var en **tick**, ikke et loop. Fair kritik.

## Hvad der kører nu

- **Interval:** 10 minutter  
- **durable:** true  
- **fire_immediately:** true  
- Hvert tick skal flytte backlog A→F eller dokumentere HARD block  
- Prompt er state-machine baseret (lærdige steps springes over)

## Hvad Grok “loop” faktisk er

Grok `/loop` / `scheduler_create` = **periodiske nye agent-kørsler**, ikke én chat der aldrig stopper.

Det er **ikke** det samme som Claude der bare bliver i tråden i 2 timer uden dig.  
Det **er** dog den rigtige mekanisme her til “arbejd videre mens jeg er væk”.

## HARD block

Ingen `XAI_API_KEY` / `GROK_API_KEY` i env eller lokal `.env` (loader tilføjet: `tools/load-env.mjs`).

## Stop loop

Slet scheduled task i Grok, eller bed agenten `scheduler_delete` med task-id.
