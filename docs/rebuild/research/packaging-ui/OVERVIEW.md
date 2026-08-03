---
title: "Packaging & UI sources autopsy — agent-elements, remotion-skills, magic-21st, website-builder-setup"
ai_generated: "(C)"
---

# Overview

Scope note first: all four sources here are low-value to a general website-building
skill. None of them ship design judgement, copywriting heuristics, or layout
reasoning — the thing that actually won the frontend-design vs SiteSmith brief.
Three of the four are infrastructure (a component-delivery mechanism, a
skill-routing mechanism, an onboarding wizard) and the fourth is a deprecated
API proxy with no visible mechanism at all. Treat this document as a scan, not
an autopsy — depth is capped to what these sources can actually justify.

## agent-elements-21st (21st-dev/agent-elements, MIT)

**Path:** `upstream/agent-elements-21st` — 3.0 MB, 164 files.
**Entry point:** `skills/agent-elements/SKILL.md` (279 lines, frontmatter
`name: agent-elements`).

This is a shadcn-compatible component registry for **agent/chat UI** —
`AgentChat`, `MessageList`, `InputBar`, and a set of "tool cards"
(`BashTool`, `EditTool`, `SearchTool`, `TodoTool`, `PlanTool`, `SubagentTool`,
`McpTool`, `ThinkingTool`, `GenericTool`, `QuestionTool`) that render an AI
agent's own tool invocations inside a chat transcript
(`README.md:15-21`). Components are generated from `lib/agent-ui/*` into
`public/r/*.json` by `scripts/build-registry.mts` (`README.md:98,107,113`) and
installed on demand with `npx shadcn@latest add
https://agent-elements.21st.dev/r/<component>.json` — nothing is vendored into
the consuming project until the developer asks for it.

The companion `SKILL.md` is the actual mechanism worth naming: it is a short,
static reference document (component catalog, exact prop shapes, import
paths, a "never import from a barrel" rule at `SKILL.md:93-102`) whose stated
purpose is to stop the model from **hallucinating imports and props**
(`README.md:75`). It does not contain design opinions — it contains ground
truth about an API surface. That is a different job than SiteSmith's design
skill does, and it is a legitimate one: a small, accurate reference file that
prevents a class of factual error is exactly the kind of thing that makes a
model behave better without moving a decision out of the model.

Scope constraint, stated explicitly in the brief and confirmed by reading the
catalog: every component here (`BashTool`, `EditTool`, `SubagentTool`,
`McpTool`, and the rest) exists to render **another agent's tool calls**. A
marketing site, e-commerce page, or dashboard has no tool calls to render.
This is only relevant to a website that itself embeds a chat/agent interface
(e.g. a support widget, an agent-builder product, an internal ops console) —
the skill's own guidance agrees, listing plain chat UIs that never render
tool calls or plans as a case where the lighter `InputBar` alone is enough and
the full `AgentChat` shell should be skipped (`SKILL.md:252-258`).

## remotion-skills (remotion-dev/skills, no license — read-only)

**Path:** `upstream/remotion-skills` — 1.2 MB, 90 files.
**Entry point:** `skills/remotion-best-practices/SKILL.md` (48 lines,
`description: Router for all Remotion skills`).

Structurally this is ~10 independent, individually-scoped skills
(`remotion-create`, `remotion-markup`, `remotion-maps`, `remotion-captions`,
`remotion-render`, `remotion-interactivity`, `remotion-docs`,
`remotion-multimedia`, `remotion-saas`, `remotion-upgrade` — directory listing
under `skills/remotion-best-practices/`) unified by one router skill whose
`SKILL.md` is a one-line-per-topic table of contents, each topic a relative
markdown link to that sub-skill's own entry doc (`SKILL.md:9-47`). The router
itself carries no technique content — it exists purely to route.

Below the router, `remotion-maps` repeats the same pattern one level deeper:
its `REFERENCE.md` directs the model to pick a single mapping technique
appropriate to the shot and load only that technique's own doc, and states as
a design rule that each technique's directory stands alone and can be deleted
without affecting the others
(`skills/remotion-best-practices/remotion-maps/REFERENCE.md:9-10`, paraphrased
— licence forbids quoting this source). That is a genuinely good
progressive-disclosure design: nothing loads until selected, and independence
is a stated design constraint, not an accident.

The maximum path depth in this checkout is 9 segments, e.g.
`skills/remotion-best-practices/remotion-markup/remotion-maps/techniques/maptiler/assets/example-Root.tsx`
(verified with `find . | awk -F/ '{print NF-1}' | sort -rn`, max value 8
separators = 9 segments). That depth is not itself the router pattern — it is
what happens when a *second* skill (`remotion-markup`) also embeds
`remotion-maps` inside itself, nesting one embedded copy inside another
embedded copy.

The embedding is a real, checked-in mechanism, not a description: two build
scripts implement it. `scripts/sync-embedded-skills.ts` symlinks each
sub-skill directory into its parent skill's folder in dev
(`sync-embedded-skills.ts:37-54`, `symlinkSync(expectedTarget, embeddedPath,
'dir')`) and rewrites the router's relative links from `../name/` to
`./name/` so they resolve inside the parent (`sync-embedded-skills.ts:69-79`).
`scripts/prepare-embedded-skills.ts` then renames each embedded sub-skill's
`SKILL.md` to `REFERENCE.md` (`prepare-embedded-skills.ts:78-84`) — so the
harness's auto-discovery of top-level `SKILL.md` files doesn't register the
same skill twice, once standalone and once nested — and rewrites internal
markdown links accordingly (`prepare-embedded-skills.ts:52-69`).

Verified with `git ls-tree`: what is actually committed in this checkout is
**not** symlinks (mode `120000`) but real directory trees (mode `040000`) —
i.e. by the time this content is packaged, the "embedding" is physical file
duplication, held consistent only by running the sync script. A repo-wide
content hash check (`find skills -type f -exec md5sum {} \;`) found 83 files
sharing only 62 unique content hashes — roughly a quarter of the tree is
duplicate bytes of files that also exist elsewhere in the same tree (e.g. every
file under `remotion-maps/techniques/*` exists three times: as the standalone
skill, embedded once in `remotion-best-practices`, and embedded again inside
`remotion-best-practices/remotion-markup`).

**Verdict on the nesting, as asked:** it is an elegant composition mechanism
*at the router level* (one short table of contents, on-demand loading, stated
independence of leaf techniques) and a maintenance liability *at the embedding
level* (real duplicated files kept in sync only by a script with a `--check`
mode that has to exist because drift is a known, anticipated failure — see
`sync-embedded-skills.ts:92-98`, which exits non-zero and prints every
mismatch). The two are separable: SiteSmith can copy the router idea (a small
top file that links to on-demand reference docs) without copying the
symlink/rename/duplicate machinery, because SiteSmith is one skill, not ten —
the problem the embedding machinery solves (the same sub-skill needing to
appear inside more than one parent, without being independently auto-loaded)
does not exist for a single-skill package.

## magic-21st (21st-dev/magic-mcp, ISC — read-only)

**Path:** `upstream/magic-21st` — 136 KB, 9 files.
**Entry point:** `src/index.ts` (218 lines) — the entire package.

There is no component-generation logic, no registry, and no design data in
this repository. `README.md:1-3` states, in its own words, that the old
standalone Magic MCP server has been replaced by a unified hosted 21st MCP
service, and that this package is kept only as a compatibility layer for
configs that still reference the old install command (paraphrased — licence
forbids quoting this source). Reading `src/index.ts` confirms it line for
line: it is a stdio↔HTTP relay that reads JSON-RPC lines from stdin and POSTs
them to `https://21st.dev/api/mcp` (`src/index.ts:20-21,118-153`), requires an
API key obtained from a hosted paid console (`README.md:24,26`), and latches
into a permanent authentication-refused state after one HTTP 401 rather than
retrying (`src/index.ts:108-116,168`). The component generation and registry
this task asked about lives entirely behind that hosted endpoint and is
invisible to this repo — there is nothing here to trace a mechanism to.
`package.json:35` confirms the license as ISC.

**Conclusion:** this source contributes nothing to SiteSmith. It is a network
proxy to a paid third-party service with no bundled content, no local
fallback, and no design or component data to adopt, adapt, or even meaningfully
critique beyond "don't depend on it."

## website-builder-setup (tenfoldmarc/website-builder-setup, no license — read-only)

**Path:** `upstream/website-builder-setup` — 95 KB, 2 files total, exactly as
flagged in the task. `README.md` (64 lines) and
`website-builder-setup/SKILL.md` (144 lines). Read both in full.

Honest accounting of substance: there isn't much. The skill is a five-step
onboarding wizard that runs shell commands to install three external
dependencies — `npm install -g uipro-cli` + `uipro init --ai claude`
(`SKILL.md:51-57`), `npm install framer-motion` (`SKILL.md:74-75`), and the
now-deprecated `@21st-dev/magic` MCP proxy examined above, which it tells the
model to wire into the user's global `~/.claude.json` together with a
user-supplied API key obtained from a live signup page
(`SKILL.md:98-110`). The specific counts of design styles, color palettes,
font pairings, and pre-built components asserted in the sales pitch
(`SKILL.md:14,16`, `README.md:45,47` — paraphrased, licence forbids quoting
this source) are not backed by any content in this repository — they
describe external packages this repo does not contain and cannot be verified
from what was supplied. The skill's own content is entirely procedural: a
script for what to say at each step, what shell command to run, and an
instruction to acknowledge any failure, hand over the equivalent manual
command, and continue rather than stopping (`SKILL.md:137-143`, paraphrased).

The one transferable idea is that failure-handling stance for a multi-step
setup flow — narrate one step at a time, don't dump all instructions at once,
give a manual fallback command on failure instead of halting
(`SKILL.md:137-143`). That is a generic onboarding-UX pattern, not specific to
website building, and SiteSmith has no analogous multi-step external-install
flow today, so there is nothing concrete to attach it to.
