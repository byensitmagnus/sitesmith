---
title: Conflict matrix
state: S4_CAPABILITY_SYNTHESIS
status: complete
inputs: docs/rebuild/MECHANISM-LEDGER.json, docs/rebuild/CONTEXT-GRAPH.jsonl
ai_generated: "(C)"
---

# Conflict matrix

Adding every good mechanism together produces a skill that contradicts itself. This
file resolves the contradictions before any of them reach `SKILL.md`.

Twenty conflicts were recorded by the autopsy agents in the `conflicts` field of the
mechanism records. They collapse into nine real ones plus the central architectural
conflict. Each is resolved with a priority, a routing signal, the failure mode of
getting it wrong, and how it is tested.

## The precedence ladder

Everything below resolves against this order:

```text
1. the user's explicit brief
2. factual truth
3. existing brand and hard constraints
4. task-specific evidence
5. general design principles
6. skill defaults
```

**One boundary must be stated or rule 1 becomes dangerous.** The brief outranks
factual truth for *design* decisions — if the user asks for a look, they get it, even
one the evidence would argue against. The brief never authorises a *claim*. "Make it
feel established" is a design instruction; "say we have 10,000 customers" when nobody
counted is a fabrication, and the evidence guard refuses it at any precedence level.
Design is a matter of taste; a number on a page is a matter of fact.

---

## C1 — Creative freedom versus hard anti-slop rules

**The two mechanisms.** frontend-design names three AI-design clusters and says not
to spend a free axis on them, while insisting the brief wins if it asks for one
(`SKILL.md:31`). taste-skill enumerates 70+ bans with override paths
(`taste-skill/bias-correction-bans-with-override-paths`) — and its own autopsy flags
that the ban list risks becoming the mechanical rules-execution its thesis argues
against.

**Resolution.** Naming beats banning. A named default is a mirror; a banned default is
a wall, and walls have a shape — which is how anti-slop becomes a house style. The
unified skill names the defaults, states that each is legitimate when the brief asks
for it, and forbids only *arriving* there without choosing.

| | |
| --- | --- |
| Priority | naming > banning |
| Routing signal | does the brief pin this axis? If yes, follow it exactly, including into a named default |
| Failure mode if wrong | the ban list becomes the signature: every site avoids the same things the same way |
| Test | three unrelated briefs; if all three avoid the same three clusters *by using the same fourth thing*, the rule has become a style |

## C2 — Established UX patterns versus originality

**The two mechanisms.** impeccable's craft floor and SiteSmith's mode rules encode
conventional patterns (purchase path, sticky buy panel, trust strip). frontend-design
demands the hero be a thesis and structure encode something true.

**Resolution.** They separate cleanly by *surface*, not by strength. Interaction
surfaces the user must operate — checkout, forms, navigation, tables, error states —
follow convention, because novelty there costs money and trust. Expressive
surfaces — hero, section transitions, imagery, typography, texture, copy voice — are
where originality is spent. This is not a compromise; it is what the nordrig
comparison showed: build A won on expressive surfaces and lost on interaction
surfaces, build B the reverse
(`docs/rebuild/research/_forensics/NORDRIG-AB-FORENSICS.md`).

| | |
| --- | --- |
| Priority | convention on operable surfaces, originality on expressive surfaces |
| Routing signal | is the user *deciding* here or *operating* here? |
| Failure mode if wrong | a beautiful checkout nobody can complete, or a correct site nobody remembers |
| Test | journey test passes on operable surfaces; portfolio diversity passes on expressive ones |

## C3 — Minimal implementation versus ambitious experience

**The two mechanisms.** ponytail's proportionality (smallest correct implementation,
reuse before invention) versus scroll-world's scene choreography and frontend-design's
"maximalist directions need elaborate execution".

**Resolution.** frontend-design already states the rule and it is the better one:
*match complexity to the vision*. Proportionality applies to the **means**, not the
**ambition** — take the smallest implementation that achieves the chosen direction,
never a smaller direction to justify a smaller implementation. A dependency is added
only when the native platform cannot do the thing at all, not when it would be
slightly more convenient.

| | |
| --- | --- |
| Priority | ambition set by the brief; means minimised against that ambition |
| Routing signal | can the platform do this natively? then no dependency |
| Failure mode if wrong | either a 3 MB bundle for a landing page, or a timid site defended as "proportionate" |
| Test | dependency count and bundle size recorded per build; every dependency names what native API it replaces |

## C4 — Motion ambition versus performance and accessibility

**Resolution.** Motion is a design decision, so the model owns it; performance and
reduced-motion are a floor, so verification owns it. One orchestrated moment beats
scattered effects — that is frontend-design's rule and it also happens to be the
cheap one. `prefers-reduced-motion` is not negotiable and is not a design choice.

| | |
| --- | --- |
| Priority | one deliberate moment > many small ones; reduced-motion always honoured |
| Routing signal | does the motion carry meaning the static page loses? if not, cut it |
| Failure mode if wrong | scattered hover effects, which is itself an AI tell |
| Test | verification renders with and without `prefers-reduced-motion` |

## C5 — Reference extraction versus original design

**The two mechanisms.** The cloner pipeline (token/asset/section extraction) versus
subject-world grounding.

**Resolution.** Extraction is for *understanding what exists*, never for *deciding
what to build*. In REDESIGN the extracted tokens are the description of the thing
being replaced, plus the constraint list of what must be preserved (brand marks, legal
copy, working journeys). A "clone this site" request is the one case where fidelity is
the goal, and it must be stated by the user in those words — it is never inferred.

| | |
| --- | --- |
| Priority | extraction informs; the brief decides |
| Routing signal | did the user say clone/match/replicate? otherwise extraction is input, not target |
| Failure mode if wrong | a redesign that reproduces the problem it was hired to fix |
| Test | REDESIGN builds must differ measurably from their `before/` on the expressive surfaces while preserving named constraints |

## C6 — Component reuse versus visual distinctiveness

**Resolution.** Reuse **behaviour**, author **appearance**. A date picker, a combobox,
a focus trap, a cart drawer — take the accessible implementation. Its colours,
type, spacing, radii and motion come from the design system, which came from the
thesis. This is the only way component libraries and distinctiveness coexist, and it
is also what makes `21st-dev/agent-elements` safe to reference: it is behaviour for
agent interfaces, and it must never become a dependency of an ordinary website.

| | |
| --- | --- |
| Priority | behaviour reused, appearance authored |
| Routing signal | is this a solved accessibility problem? then reuse it |
| Failure mode if wrong | a site that looks like its component library, which is the shadcn tell |
| Test | no component ships with library-default tokens; token drift scanner already exists in v2.3 |

## C7 — Persistent project context versus contamination

**The two mechanisms.** SiteSmith's cross-project direction history (anti-repeat
ledger) versus the risk that yesterday's project steers today's.

**Resolution.** History may **veto**, never **propose**. It answers "have I done this
before?" and nothing else. It never contributes a colour, a typeface or a layout. The
v2.3 fingerprint ledger with its hard-coded known-bad recipe is exactly the right
shape and is adopted; what is rejected is any use of history as a source of ideas.

| | |
| --- | --- |
| Priority | veto only |
| Routing signal | fingerprint match against prior builds |
| Failure mode if wrong | the house style becomes literal — the skill copies itself |
| Test | portfolio diversity across builds; the ledger's own known-bad recipe must keep tripping |

## C8 — Multi-agent autonomy versus a single accountable skill

**Resolution.** SiteSmith is one skill with one accountable output. Sub-agents are an
*optional execution detail* the host may or may not offer, never a requirement and
never a source of authority. impeccable's dual isolated critique is genuinely good and
is adopted in a degradable form: if the host can run an isolated critic, use it; if
not, the same critique runs inline against a written checklist. A skill that only
works on a harness with sub-agents is not portable, and portability was a stated goal.

| | |
| --- | --- |
| Priority | single accountable skill; delegation is an optimisation |
| Routing signal | host capability, detected at run time |
| Failure mode if wrong | the skill breaks on Codex or a plain chat surface |
| Test | full flow runs with sub-agents disabled |

## C9 — Evidence guard versus creative copy

**Resolution.** The guard governs **claims**, not **voice**. A number, a testimonial,
a certification, a customer count, a guarantee, a delivery time — these need a source
and are refused without one. Tone, rhythm, metaphor, diegetic labels like `PROC-03`
and eyebrow text are craft and are free. The nordrig comparison shows why this matters:
the winning build's distinctiveness came almost entirely from voice and labelling,
none of which touches a factual claim.

| | |
| --- | --- |
| Priority | claims gated, voice free |
| Routing signal | would a reader treat this as a verifiable statement about the business? |
| Failure mode if wrong | either invented social proof, or copy so hedged it says nothing |
| Test | the existing production-gate honesty check, run against expressive copy to confirm it does not fire on voice |

## C10 — Progressive loading versus coherent design understanding

**Resolution.** The measurement settles this: v2.3 loads 1.9% of its package on a
routine run and its progressive disclosure works
(`docs/rebuild/BASELINE-CONTEXT-BUDGET.json`). What must stay always-loaded is not
*more* material but the *right* material — the creative surface, because that is the
part that must be in mind while every later decision is made. Reference material,
adapters and data are opened at their step. The rule is: **anything that shapes taste
is always loaded; anything that answers a question is fetched.**

| | |
| --- | --- |
| Priority | taste always loaded, answers fetched |
| Routing signal | does this shape a judgement or supply a fact? |
| Failure mode if wrong | either a routine task pulling 630k tokens, or a model designing with the craft standard out of context |
| Test | `tools/context-budget.mjs` reports ALWAYS and ROUTINE; a gate can fail on either |

---

## The central conflict, now resolvable

`constraint:no-skill-chain` versus `constraint:no-mechanical-creativity` was recorded
at S0 as unresolved: if a script may not decide the design and the user may not be
asked to run frontend-design, what produces the creative direction?

The measurement answers it. frontend-design's entire method is **2,078 estimated
tokens of prose** (`docs/rebuild/research/_forensics/INSTRUCTION-BUDGET-VS-QUALITY.md`).
That fits inside a unified skill's always-loaded surface with room to spare —
SiteSmith v2.3 already spends 6,546 there. The creative direction is produced by the
host model, reasoning from a small dense instruction surface that lives inside
SiteSmith. Nothing is chained and nothing is generated by a script.

The conflict is resolved by **re-expression**, and re-expression is exactly what the
licence permits (Apache-2.0, notice required) and what the charter demands.

**The remaining risk is real and is now the rebuild's core hypothesis:** that the
method survives being rewritten in our own words. frontend-design's power may live in
its specific phrasing, not its structure. That is testable, it is cheap to test, and
it is the first mechanism smoke test in S10 — same brief, same model, our re-expressed
surface versus the original, blind-scored.

Recorded as `decision:resolve-central-conflict-by-reexpression` with an open
`risk:reexpression-may-not-transfer`.
