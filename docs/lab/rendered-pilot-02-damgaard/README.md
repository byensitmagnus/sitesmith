# Rendered Product Value Pilot 02 — Damgaard Estrik

**SiteSmith lost.** Second rendered pilot, second loss, and this one was called "clear".

The question was not whether SiteSmith beats a competitor. It was whether a user gets a better
finished website with SiteSmith than with competent plain AI. Two arms only: **S**, the frozen
current SiteSmith through its public install path, and **P**, plain Sonnet with no tooling and
no rule of any kind. Same brief bytes, same model, same effort, same fresh workspace.

Frozen here because it is losing evidence, and losing evidence is the kind that gets lost.
Nothing in this folder has been edited to read better after the fact.

## The result in one table

| | S — SiteSmith | P — plain Sonnet |
| --- | --- | --- |
| blind judge | | **winner, "clear"** |
| design, 1–10 | 5 | 8 |
| does the job / honest | yes / yes | yes / yes |
| axe WCAG 2.1 AA | 6 serious | 0 |
| the booking journey, 4 goals | 4 PASS | 4 PASS |
| output tokens | 1,633,489 | 528,869 |
| wall clock | 3 h 45 m | 1 h 29 m |

Product frozen at `3d19e7cb0d7c9e91653abef6bee6c43b2e1bbc28` and untouched for the duration.
Brief `damgaard-estrik`, surface `buy`, sha256 in `brief/BRIEF.sha256`.

## Where to start

| read this | for |
| --- | --- |
| `RESULT.md` | the verdict, the checks, the economics, and the four deterministic defects |
| `CONTAMINATION.md` | why the control arm was not clean, and which earlier claim is withdrawn |
| `EVENTS.md` | what went wrong while it ran, written before the verdict came back |
| `REPRODUCE.md` | the commands that reproduce each finding, no model needed |

## What is here

- **The verdict, unopened first.** `RAW-VERDICT.json` was written before `SEALED-MAPPING.json`
  was read. The candidate order was derived from the screenshots themselves, so it can be
  recomputed and could not have been chosen to suit a result.
- **The judge's whole packet.** `judge/` — the 24 screenshots it saw, the brief it read, the
  neutral check sheet, and the instructions. It was shown no cost information.
- **The instrument.** `instrument/check.mjs`, `driver.mjs`, `packet.mjs`. The same code ran
  against both arms. `driver.mjs` fills every form control by what it is rather than by what
  either site called it, which is what let the required states be driven on both sites instead
  of written off as not comparable.
- **Both builds, source only.** `builds/S` and `builds/P`. `node_modules`, `.next` and each
  build's own screenshot dumps are regenerable and were left out; `builds/S/.sitesmith` keeps
  the product's own reasoning record, which is not. `builds/S/INSTALLED-SKILL.json` hashes the
  skill tree that was installed, so which pipeline ran stays provable.
- **Hashes and usage.** `ARTIFACT-HASHES.json` covers every file here. `USAGE.json` holds the
  cost figures, deliberately apart from the verdict.

## What this is not evidence for

It is not evidence that plain AI beats SiteSmith. Two briefs, one judge each, one surface
family — and, per `CONTAMINATION.md`, a control arm that had read the product's legacy method
notes. It is evidence about where this product is weak, and both losses point at the same
weakness: not a wrong measurement, an unmeasured surface.

`ordway-farriery` is the last unspent `buy` brief.
