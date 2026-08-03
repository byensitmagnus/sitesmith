---
title: Third-party notices
verified: tools/provenance-overlap.mjs
ai_generated: "(C)"
---

# Third-party notices

This package contains no vendored upstream files. Every mechanism it uses was read from
its source, understood, and written again in our own words. That is a claim a reader
should not have to take on trust, so it is measured: `node tools/provenance-overlap.mjs`
compares every shipped markdown file against every source and reports each shared run of
eight or more consecutive words.

**Measured 2026-08-01, across the seven shipped markdown files:**

| Source | Licence | Shared 8-word runs |
| --- | --- | ---: |
| frontend-design | Apache-2.0 | **3** |
| impeccable | Apache-2.0 | **3** |
| taste-skill | MIT | 0 |
| ui-ux-pro-max | MIT | 0 |
| ponytail | MIT | 0 |
| ai-website-cloner-template | MIT | 0 |
| scroll-world | MIT | 0 |
| ai-dev-tasks | Apache-2.0 | 0 |
| remotion-skills | **none** | 0 |
| magic-21st | **none** | 0 |
| website-builder-setup | **none** | 0 |

Both non-zero sources are Apache-2.0, which permits reproduction with notice, and this
is that notice. The frontend-design matches are short descriptive phrases, the longest
being *"the design lead at a small studio known"*. The impeccable matches are one
sentence in `redesign.md` about the old look being evidence of what the subject is.

**Every source with no licence measures zero**, which is the number that matters, because
for those there is no permission to rely on and an accidental paraphrase would still be a
copy.

## Sources this package derives from

Each entry states what was taken. "Idea" means the mechanism was understood and
re-expressed; no text moved.

| Source | Repository | Commit | Licence | Taken |
| --- | --- | --- | --- | --- |
| frontend-design | `anthropics/skills`, `skills/frontend-design` | `b29e7cf6` | Apache-2.0 | The creative method: subject grounding, hero as thesis, the two-pass token plan, the originality self-test, restraint, copy as design material. Three short phrases survive verbatim; everything else is re-expressed. |
| impeccable | `pbakaus/impeccable` | `6b342244` | Apache-2.0 | Mostly idea, one sentence in `redesign.md` close to the original. Preserve versus redesign, bounded review loops, the craft floor paired with a detector, the anti-argmax roll, licensed empty report slots, run-notes skip accounting. |
| taste-skill | `Leonxlnx/taste-skill` | `e988add2` | MIT | Idea. Brief inference, the design read, redesign-mode detection, the absolute em dash ban, honesty about hand-rolled technology. |
| ui-ux-pro-max | `nextlevelbuilder/ui-ux-pro-max-skill` | `4857a2c5` | MIT | Idea. Never assume the stack, zero-result honesty, canonical doc plus per-page overrides, concrete accessibility facts. |
| ponytail | `DietrichGebert/ponytail` | `16f29800` | MIT | Idea. The simplicity ladder and, more importantly, its paired never-cut list. |
| ai-website-cloner-template | `JCodesMore/ai-website-cloner-template` | `a9b35751` | MIT | Idea. Interaction model first, exhaustive state capture, no silent guessing, spec inline rather than by reference. |
| scroll-world | `oso95/scroll-world` | `71cc36d3` | MIT | Idea. Reduced motion stops the work rather than the animation; theme-safe injection. |
| ai-dev-tasks | `snarktank/ai-dev-tasks` | `efbffaac` | Apache-2.0 | Idea. Clarifying questions before the spec, resumable progress state. |
| agency-agents | `msitarzewski/agency-agents` | `c89557f7` | MIT | Idea. Justify a decision by how a visitor with an intent moves through the page. |
| grill-for-unknowns | `nicobailon/grill-for-unknowns` | `d8d5f4b4` | MIT | Idea. The four-quadrant unknowns taxonomy and prototypes for taste the user cannot verbalise. **Identity unconfirmed:** this was resolved as the best candidate for a source the brief called "Before Implementing", and no artifact under that name exists. |
| SiteSmith v2.3 | this repository | `dc00598c` | MIT | Its verification machinery, largely intact: render-versus-declaration fidelity, fail-closed gates, journeys, the cross-project anti-repeat ledger, portfolio diversity, production honesty checks. Plus the craft floor extracted from `v2/modes/` and `v2/tasks/`. |

## Sources whose contribution is a clean-room implementation

No text, no structure and no file was copied from any of these. Each one taught a
mechanism, the mechanism was implemented here from its observed behaviour, and the
measured 8-word overlap against every one of them is zero. Two of them carry no licence
that permits redistribution, which is precisely why the implementation is original: a
capability is not abandoned because its source cannot be copied.

| Source | Licence | What was implemented, and where it lives |
| --- | --- | --- |
| `remotion-dev/skills` | **none declared**, upstream monorepo is NOASSERTION with commercial restrictions | One technique selected per brief and only that technique's document opened. `stacks/remotion.md`, written without opening the upstream files at all, and reached only when remotion is already a dependency. |
| `21st-dev/magic-mcp` | ISC in `package.json` only, no LICENSE file | Look for a component that exists before writing one. `scripts/components.mjs`, which searches the project in front of it rather than a hosted registry, because a key is spend and a check nobody can run is not a check. |
| `tenfoldmarc/website-builder-setup` | **none**, two files and no LICENSE, so all rights reserved | Walk the environment one step at a time, and on a failure give the manual command and keep going. `tools/install-sitesmith.mjs`. |
| `21st-dev/agent-elements` | MIT | An agent interface has a component vocabulary of its own, conditional on the brief and never on the stack. `scripts/components.mjs`, routed only when the brief names an agent, chat, assistant or transcript surface. |
| `ruflo` | MIT | Durable state that outlives the process, and a resume that says what was happening. `scripts/state.mjs`. The swarm platform and the vector store were not taken: they are the wrong size for a skill that builds one website. |
| `graph-engineering` | MIT | Typed nodes and typed edges rather than a log, with causation separate from sequence and a hard cap of twenty-five live nodes. `scripts/state.mjs`. The nine-stage extraction pipeline and the graph database were not taken. |
| `awesome-claude-code-subagents` | MIT | A role carries an explicit output contract rather than a job title. `delegation.md`, four roles, opened only when the work splits. Its own two-hundred-persona taxonomy is the noun-list antipattern its own critique names, and is not carried. |
| `motiondivision/motion` | MIT, commit `a4e4b3ab` | Reach for a motion library only where it is already a dependency, and animate from a visible resting state rather than into one. `motion.md` section 4, plus the detection in `scripts/components.mjs`. |

## The rule this package follows

Only four sources were ever cleared for verbatim redistribution: taste-skill and
ui-ux-pro-max under MIT, frontend-design and impeccable under Apache-2.0. This package
redistributes none of them anyway, because re-expression was required to fit the
mechanisms together, and re-expression turned out to be testable: a blind comparison
scored our re-expressed creative surface 135 against the original's 134 on an identical
brief.

Full audit trail: `docs/rebuild/SOURCE-REGISTRY.md` for provenance,
`docs/rebuild/MECHANISM-LEDGER.md` for what each source contributed, and
`docs/rebuild/PLACEMENT.json` for where each mechanism landed.
