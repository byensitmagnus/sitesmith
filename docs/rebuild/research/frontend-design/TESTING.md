---
title: TESTING — frontend-design
ai_generated: "(C)"
---

# What it verifies, and how

Nothing is verified by tooling. The package ships no test script, no screenshot harness, no
linter, no accessibility checker, no build step of any kind — it is prose only (see `OVERVIEW.md`).
Every "verification" claim in the source is the model asserting, in its own reasoning or output,
that a criterion was met.

Concretely, the source names four checkable properties and provides zero tools for any of them:

| Claimed check | Source line | Tool provided? |
|---|---|---|
| "review that plan against the brief" / genericness check | `SKILL.md:35` | No — narrative self-review only |
| Responsive down to mobile | `SKILL.md:43` | No |
| Visible keyboard focus | `SKILL.md:43` | No |
| Reduced motion respected | `SKILL.md:43` | No |
| Screenshot-based self-critique | `SKILL.md:43` | No — conditional on "if your environment supports it," and no instruction for what to *do* with the screenshot once taken |

# Is the proof real or asserted?

Entirely asserted. There is no equivalent anywhere in this package to our own
`scripts/verify.mjs`, which actually captures screenshots at 375/768/1440px, runs axe in both color
schemes, and checks for console errors, dead links, and horizontal overflow. This source's
"critique your own work... taking screenshots if your environment supports it" is a suggestion to
*look*, not an instruction backed by a script that *captures and checks*.

The only real, external evidence that this package's approach works at all is the blind test result
(59 vs 40) cited in our brief — but that is a black-box outcome measurement of the whole package
against a whole alternative, not a verification mechanism *within* the package itself. It tells us
the approach is effective; it tells us nothing about which of its claimed quality-floor properties
were actually true in the winning output, because nothing inside the package checked them.

# Implication

Treat every claim in `SKILL.md` about accessibility, responsiveness, and "revised because it read
generic" as an unverified assertion unless SiteSmith's own tooling (its actual verify script) checks
it independently. The self-critique/anti-cliché mechanism (`MECHANISMS.json` →
`named-cliche-calibration`, `self-critique-loop`) is a judgment call that plausibly can only ever be
model-graded — there's no script that detects "does this look like a template" — but the
quality-floor items (focus, motion, responsiveness) are objectively testable and should not be left
to self-report in our own rebuild.
