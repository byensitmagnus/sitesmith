---
title: DesignSpec handoff contract
status: implemented-in-slice
ai_generated: "(C)"
---

# DesignSpec handoff

## Compiler

`skills/sitesmith/scripts/direction-engine/designspec.mjs`

## Required fields (validated by tests)

design thesis, content hierarchy, page composition, grid/spacing, typography system, colour roles, surface/material, imagery, components, interaction states, motion, responsive, a11y, signature, forbidden defaults, fidelity assertions, acceptance criteria, capability provenance.

## Build context receives

- evidence artifacts (paths/flags)
- chosen `DESIGNSPEC.json`
- `DIRECTION.md` with v2.3 axis record (for existing `direction-fidelity.mjs`)
- mode + stack for existing adapters

## Build context must NOT receive

- rejected direction cards
- generator scores
- generator favorite
- blind key mapping

Enforced in `HANDOFF.json` → `withheldFromBuild`.

## Fresh context rule

A new build agent should open only evidence + DesignSpec/DIRECTION + stack mode — not the engine-result critic payload.
