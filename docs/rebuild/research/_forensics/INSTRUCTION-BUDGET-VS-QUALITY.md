---
title: The winner is 55 lines — instruction budget versus creative quality
state: S2_REPO_AUTOPSIES
status: complete
method: byte counts at the pinned commits; estimated tokens = bytes / 4
ai_generated: "(C)"
---

# The winner is 55 lines

`skills/frontend-design` at `b29e7cf6` contains exactly two files: `SKILL.md` and
`LICENSE.txt`. `SKILL.md` is **55 lines, 8,315 bytes, about 2,078 estimated tokens**.
No scripts. No data. No references. No routing table. No loops. No verification.

It beat SiteSmith 59 to 40 on an identical brief with identical evidence
(`docs/v3/proof/head-to-head/eval/MINI-1-LEATHER-LLM-REPORT.md`).

## The comparison that should decide the architecture

Markdown instruction surface at the pinned commits, excluding `.git` and
`node_modules`:

| Skill | Markdown files | Est. instruction tokens | Always-loaded |
| --- | ---: | ---: | ---: |
| **frontend-design** | **1** | **2,078** | **2,078** (it is all one file) |
| taste-skill | 29 | 93,129 | not measured |
| **SiteSmith v2.3** | 67 | 164,621 | **6,546** |
| ui-ux-pro-max | 138 | 210,866 | not measured |
| impeccable | 685 | 1,512,837 | not measured |

SiteSmith's *always-loaded* instruction budget is **3.1× larger** than the entire
frontend-design skill, and SiteSmith lost the creative comparison anyway. Its full
package is 630k estimated tokens (`docs/rebuild/BASELINE-CONTEXT-BUDGET.json`).

More instruction did not buy better design. That is not a hunch; it is what the two
numbers say when placed next to the blind score.

## What those 2,078 tokens actually spend themselves on

Reading `SKILL.md` at the pinned commit, the budget goes almost entirely to things
that raise the *model's* standard, and almost none to things that constrain its
output:

1. **A role with stakes, not a job title.** It casts the model as the design lead at
   a studio known for identities that could not be mistaken for anyone else's, and
   adds that this client *has already rejected templated proposals*. A prior rejection
   in the premise raises the bar before a single instruction is given.
2. **Pin the subject yourself.** If the brief does not say what the thing is, name a
   concrete subject, its audience and the page's single job, and commit. Vagueness is
   converted into a commitment rather than absorbed as freedom.
3. **One generative rule, stated once.** The subject's own world — its materials,
   instruments, artifacts and vernacular — is where distinctive choices come from.
   That single sentence is the engine. Everything downstream is derived from it.
4. **Name the defaults instead of banning them.** It names the three clusters
   AI design currently falls into, then says all three are legitimate *for some
   briefs*, and that where the brief asks for one, the brief wins. This is anti-slop
   that cannot itself become a house style, because it forbids nothing — it only
   removes the excuse of arriving somewhere by default.
5. **A two-pass plan with an originality self-test.** Pass one: a compact token
   system — 4–6 named hex values, two or more type roles, a layout concept with ASCII
   wireframes, and one signature element. Pass two: review the plan against the brief,
   and *work through a similar prompt to see whether you arrive somewhere similar*. If
   you would, revise and say what changed and why. That is a convergence test with no
   script, no corpus and no cost.
6. **Spend boldness in one place.** One signature element, everything around it quiet.
   Plus Chanel's rule: before leaving the house, remove one accessory.
7. **A quality floor stated without ceremony.** Responsive to mobile, visible keyboard
   focus, reduced motion respected — one sentence, "without announcing it".
8. **Copy as design material.** Roughly a fifth of the whole skill is about writing,
   because copy is where a design most easily reverts to template.

Two operational instructions are also worth noting because they are about cost, not
craft: do the planning and iteration *in thinking* and only show the user
high-confidence ideas; and take screenshots when the environment allows, because
"a picture is worth 1000 tokens".

## The mechanism SiteSmith was missing, stated precisely

SiteSmith v2.3 spent its instruction budget telling the machine **what to produce**.
frontend-design spends its budget telling the model **what standard to hold itself
to, and which specific failures to check itself against.**

The first approach scales with the number of situations you can enumerate — and it
converges, because two situations that fall in the same bucket get the same answer.
That is precisely what `gallery/showcase.json` records: three briefs, one style,
`portfolioDiversity: fail`.

The second approach scales with the model's own capability, and it diverges by
construction, because the generative rule ("derive from *this* subject's world") has
a different answer for every subject.

## The counter-evidence that stops this becoming "just be small"

frontend-design's nordrig build was **also judged not production-ready**
(`nordrig/ACCEPTED-VERDICT.md`). Its 55 lines contain:

- no browser verification, no screenshots at breakpoints, no axe pass
- no journey testing, no state coverage, no error or empty states
- no commerce patterns — no purchase path, no trust discipline, no price formatting
- no stack detection, no adapter for an existing codebase
- no asset or evidence handling, no factual guard on invented claims
- no release gate of any kind

Every one of those exists and works in SiteSmith v2.3. `scripts/verify.mjs` is real
machinery, and its control group in `benchmarks/06-redesign/before/` is a genuine
test-of-the-test.

## The architectural conclusion this forces

The two skills are not competing implementations of one thing. They are two layers,
and the measured result is that **the creative layer must be small, dense prose aimed
at the model, and the production layer is the only place where files, scripts and
data earn their keep.**

Concretely, for S5:

| Layer | Budget | Form | Why |
| --- | --- | --- | --- |
| Creative direction | target ≤ 2,500 tokens, always loaded | prose, second person, names the failure modes | 2,078 tokens beat 6,546 on exactly this |
| Craft floor | small, always loaded | prose stating the floor, not how to reach it | must be satisfiable in many visual languages |
| Production machinery | unbounded, never always-loaded | scripts, adapters, verification, data | this is where SiteSmith already wins and frontend-design has nothing |
| Retrieval corpora | unbounded, brief-gated | data | 57% of v2.3's package; useful only when asked for |

Any candidate architecture that puts creative instruction into a file tree, a routing
table or a generator is arguing against the only two measurements this repo has.

Recorded as `mech:small-dense-creative-surface` (adopt),
`mech:name-the-defaults-not-ban-them` (adopt),
`mech:originality-self-test` (adopt) and `result:instruction-budget-vs-quality`.
