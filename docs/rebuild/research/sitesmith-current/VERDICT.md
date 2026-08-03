---
title: VERDICT — sitesmith-current autopsy
ai_generated: "(C)"
---

# The single most valuable thing to steal

**The measure-the-rendered-artifact-not-the-declaration discipline, applied at every level from
one comp to a whole portfolio.** `direction-fidelity.mjs`, `direction-check.mjs`,
`direction-history.mjs`, and `portfolio-diversity.mjs` form a genuinely novel four-level
verification stack: does this comp render what it claims → does the finished page render its
chosen direction → has this exact render (or its fingerprint) appeared in any other project
this tool has ever touched → do a set of finished sites, looked at together, still read as one
studio's work. Every level was written against a real, named, previously-shipped defect (a
declared dark-mode direction that rendered light in Chromium's default scheme; three sites that
passed individual review and still shared one recipe). No comparable other source measures
creative *sameness* this rigorously or this cheaply (pure DOM/CSSOM inspection, no LLM calls).
This is the concrete, portable answer to the brief's C-no-house-style constraint, and it should
be adopted close to verbatim.

# The single most dangerous thing to copy

**The direction-candidate-search step** (`scripts/candidates.py` + `scripts/core.py`, invoked
from `v2/20-direction-lab.md:42-48` and wired into the canonical `init` pipeline at step
`directions`). It is a deterministic BM25-plus-Jaccard-distance picker over a closed, dated CSV
taxonomy of named style categories, and it is presented to the model as the seed for its three
"contrasting" directions before the model has done anything with the evidence pack. This is the
textbook C-no-mechanical-creativity liability the brief describes, and it is the most plausible
concrete cause of the measured 40-vs-59 loss: a script chose the menu the model creates from,
rather than the model reasoning outward from the subject's actual evidence. Copying this
mechanism (or its dead, even-more-mechanical sibling, `design_system.py`, which the pipeline no
longer even calls but which still ships) would reintroduce exactly the failure mode this
rebuild exists to fix. Its measured *search-diversity* technique (seed on strongest match, then
greedily maximise minimum distance from what's chosen) is a fine algorithm for de-duplicating a
retrieval result set — it should never be the source of a creative decision.

# One-line verdict

Steal the render-measurement verification stack and the honesty/behavioural gates wholesale;
throw out every place a script generates or seeds a creative choice, and let the model reason
from evidence instead.
