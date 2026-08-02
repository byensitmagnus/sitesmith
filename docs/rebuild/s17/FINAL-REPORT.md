---
title: Source acceptance, one integration round and three holdouts
state: S17_SOURCE_ACCEPTANCE
status: complete for this round
branch: rebuild/sitesmith-unified
ai_generated: "(C)"
---

# Every source changes the product now, and one measurement still says no

`node tools/source-coverage.mjs` returns 19 of 19. Every gate in the repository is green.
The three holdout builds pass individually. One portfolio-level measurement fails, and it
is reported here rather than removed.

## What each source contributes, where it lives, when it loads, how it was proved

The machine-readable version is `SOURCE-CONTRIBUTIONS.json`, and
`tools/source-coverage.mjs` refuses a release when a row has no mechanism, no path, no
proof, no licence or no attribution, or when a path or a proof names a file that is not in
the tree. The required list lives in the script rather than the register, so deleting a row
cannot make the gate pass.

| Source | Integration | Lives in | Loads when | Proved by | Holdout |
| --- | --- | --- | --- | --- | --- |
| SiteSmith v2.3 | ADOPTED | `scripts/verify.mjs`, `gate.mjs`, `ledger.mjs`, `journey.mjs`, both floors | every build, at release | four suites, and the whole benchmark set under the v3 verifier | all three |
| frontend-design | ADAPTED | `SKILL.md` sections 1 to 8 | always | the six-arm holdout, and `tools/provenance-overlap.mjs` | all three |
| taste-skill | CLEAN_ROOM | `gate.mjs` palette and typeface checks | always, and at release | `unpinned` and `pinned-by-brief` fixtures | all three, and it refused all three at least once |
| ui-ux-pro-max | CLEAN_ROOM | `verify.mjs` floor measures, `floor/operate.md` | operate, every render | `test-verify.mjs`, `floor-lint.mjs` | c |
| impeccable | ADAPTED | `redesign.md`, `gate.mjs`, `ledger.mjs` | redesign, at release | `test-gate.mjs` | preserve-vs-redesign not exercised; routing test only |
| scroll-world | CLEAN_ROOM | `motion.md`, the reduced-motion pass in `verify.mjs` | experience, every render | `fail-motion` fixture, and holdout a | a |
| remotion-skills | CLEAN_ROOM | `stacks/remotion.md` | experience, only when remotion is a dependency | routing in `stack.mjs`, zero measured overlap | none: conditional, and no holdout had remotion |
| motion, formerly Framer Motion | CLEAN_ROOM | `motion.md` section 4, detection in `components.mjs` | experience, only when already installed | `test-components.mjs` motion detection | none: conditional, correctly not installed |
| ponytail | CLEAN_ROOM | `SKILL.md` restraint, `run.md` caps, `tools/genericness-judge.mjs` | always, and repo-side | the judge refuses to score until it ranks the control pair | all three scored 3 of 16 |
| ai-website-cloner-template | CLEAN_ROOM | `redesign.md` | redesign | placement record | none: no holdout was a reconstruction |
| website-builder-setup | CLEAN_ROOM | `tools/install-sitesmith.mjs` | install, once | the clean install below | n/a, install-time |
| agency-agents | CLEAN_ROOM | `run.md` argument order | always | placement record | all three |
| ruflo | CLEAN_ROOM | `scripts/state.mjs` | every run, and on resume | `test-state.mjs`, eleven cases | all three opened a run |
| awesome-claude-code-subagents | CLEAN_ROOM | `delegation.md` | delegate, only when work splits | budget accounting, and the single-agent fallback it names | none: all three were built by one agent, which is the point |
| ai-dev-tasks | CLEAN_ROOM | `run.md` phase 1 | always | placement record | all three |
| graph-engineering | CLEAN_ROOM | `scripts/state.mjs` typed graph | every run, on check | `test-state.mjs` graph validation cases | all three |
| before-implementing | CLEAN_ROOM | `run.md` blocking questions, `tools/self-contained-lint.mjs` | always, and repo-side | the lint and its self-test | all three |
| agent-elements-21st | CLEAN_ROOM | `scripts/components.mjs` | only on an agent-interface brief | `test-components.mjs`, four routing cases | none: correctly never routed in |
| magic-21st | CLEAN_ROOM | `scripts/components.mjs` | before writing any component | `test-components.mjs` | all three: nothing installed, so all three were told to write |

Six sources have no holdout column, and that is the correct result rather than a gap. A
conditional capability that fires on a brief none of the three holdouts had would only
appear in a holdout if the brief were written to make it appear, which measures nothing.
Their proof is a routing test that shows they fire when they should and, more importantly,
that they do not fire when they should not.

## Licence handling

Fifteen sources carry a licence that permits redistribution and none of them is
redistributed anyway. Four carry a problem, and each was answered by implementing rather
than abandoning:

- `remotion-dev/skills`: no declared licence, upstream monorepo NOASSERTION with commercial
  restrictions. `stacks/remotion.md` was written without opening the upstream files.
- `21st-dev/magic-mcp`: ISC in `package.json` only, no LICENSE file. `components.mjs`
  searches the user's own project instead of a hosted registry.
- `tenfoldmarc/website-builder-setup`: two files, no licence, all rights reserved.
  The step-at-a-time install was implemented from observed behaviour.
- `motiondivision/motion`: MIT, resolved this round at commit `a4e4b3ab`. Nothing copied;
  what is taken is the rule about when a project already has it.

Measured 8-word overlap against all four is zero, by `tools/provenance-overlap.mjs`.
`THIRD-PARTY-NOTICES.md` no longer has a "read but not used" section.

## One unified experience, verified

Installed into an empty directory: 24 files, no test files, no working directories. The
installer checks Node, playwright and axe one at a time, gives the fix command for each
absence and continues. `stack.mjs`, `state.mjs` and `components.mjs` all answered from the
fresh install. Six stack adapters present. One `SKILL.md`, one `agents/openai.yaml`, one
install command.

## The three holdouts

Three unrelated Danish trades, three surfaces, built in sequence by one agent.

| | Subject | Surface | Gate | Verify | Journey | Genericness |
| --- | --- | --- | --- | --- | --- | --- |
| a | a bell foundry's open day | experience | 0 | 0, no measured findings | n/a, read-like | 3 of 16 |
| b | a sailmaker's storm jib order sheet | buy | 0 | 0 | 4 assertions, all held | 3 of 16 |
| c | a lime works' kiln watch desk | operate | 0 | 0 | 5 assertions, all held | 3 of 16 |

The control page this repository keeps deliberately generic scores 10 of 16 on the same
validated judge. Browser, accessibility in both colour schemes, responsive at 375, 768 and
1440, and the reduced-motion render were run on all three.

What the gates caught while building them, none of which a human review would have found
as fast:

- Holdout b shipped without a `<main>` landmark and was refused.
- Holdout c's commit blue measured 3.91:1 at 12px in the dark scheme and was refused.
- All three grounds landed inside taste-skill's premium-consumer band on the first pass
  and all three were moved onto a material the subject actually has, rather than waived.
- All three used wide-tracked uppercase micro-labels. The round-8 detector named it on two
  of them. It was removed from all three, because one instruction surface producing the
  same micro-typographic device on three unrelated trades is the house style in miniature.

## The measurement that still fails

`tools/portfolio-diversity.mjs` over the three:

```text
FAIL  imagery: the most image-led site gives assets 0.0% of its first screen.
      No site in the portfolio is carried by anything but type and rules.
note  a and c both use hairline borders as the separator
note  a and c both use no elevation anywhere
```

Two of the three original failures were closed by real changes: holdout c's light scheme
became limewash rather than cool grey, which separated it from b, and holdout b's sum panel
took a hard offset shadow, which is what a receipt lying on a sheet does.

The third is not closed and is not being explained away. The honest reading has two halves
and both belong here. Against it: all three briefs supplied no assets, so a portfolio of
three asset-less subjects cannot produce an image-led first screen, and the rule assumes at
least one site could have been. For it: that is a description of the brief set, not a
defence, and the same convergence has now been observed four times in this repository,
each time relocating to whatever the current measures do not watch. Holdout a gained a
drawn section this round, and it sits below the first screen because the direction record
argues schedule over showcase. Moving it above the fold to satisfy the measurement would be
rewriting the argument to pass a test, which is the one thing this repository does not do.

So: **two of three portfolio failures closed, one open and stated.**

## Every gate, at the end of this round

`test-stack`, `test-ledger` 39 cases, `test-state` 11 cases, `test-components` 10 cases,
`test-gate` 19 cases, `test-verify` 7 cases, `context-budget`, `test-context-budget`,
`floor-lint` and its self-test, `self-contained-lint` and its self-test,
`placement-coverage`, `provenance-overlap`, `source-coverage` 19 of 19, `check-repo`.
All green. Nothing pushed, nothing merged.

## What this round does not establish

- No claim that SiteSmith is objectively better than any upstream. The six-arm holdout is
  one brief, one language and three model judges, none validated against a known pair.
- The delegation contract has never been run with real delegation, because this round was
  built by one agent on purpose. Its single-agent fallback is exercised; its handoff format
  is not.
- Preserve-versus-redesign and the reconstruction workflow have routing proof and no
  holdout, because none of the three briefs was a redesign of an existing site.
- The genericness judge measures the render and is not the language-model judge upstream
  describes. It is reproducible and it is narrower. Both are stated in its source.
