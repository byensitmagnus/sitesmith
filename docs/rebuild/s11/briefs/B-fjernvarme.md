---
title: Brief B — Fjernvarme driftskonsol
surface: operate
sealed: 2026-08-01
ai_generated: "(C)"
---

# Driftskonsol, Nordbo Fjernvarme

An internal console. Two operators per shift watch 61 substations and dispatch three
technicians. It is used all day, on a wide screen, by people who know the network.

## What they need

The screen an operator keeps open. It must make an abnormal substation obvious without
being read, and let the operator dispatch a technician to it without leaving the screen.

## Facts (the only facts; nothing else may be stated as true)

- 61 substations. Each reports flow temperature, return temperature, differential
  pressure and a reading age.
- A substation is abnormal when return temperature is above 45 degrees, or differential
  pressure is outside 0,3 to 0,9 bar, or the reading is more than 20 minutes old.
- Three technicians: Palle, Sanne, Vagn. Each is either free, driving, or on site.
- A dispatch names the substation, the technician and a one-line reason. It cannot be
  withdrawn once accepted, only completed or reassigned.
- Readings arrive every 5 minutes. The console does not control anything; it observes
  and dispatches.
- Shift changes at 06:00, 14:00 and 22:00.

## Constraints

- Danish copy. Single self-contained HTML file, no framework, no external JS. Google
  Fonts allowed. Static demo data is fine and must be visibly plausible, not lorem.
- No invented thresholds, no invented substation names beyond a plausible numbering.
- Works at 1440 primarily; must remain usable at 768. 375 must not break.
