---
title: Canonical source registry
state: S1_SOURCE_RESOLUTION
status: generated
generator: tools/build-source-registry.mjs
ai_generated: "(C)"
---

# Source registry

Generated. Do not hand-edit — change the generator or the evidence instead.

17 sources: 13 resolved or pinned, 4 ambiguous, 0 unresolved. 14 may be redistributed with notice; 3 may not be copied at all.

## Redistribution status is the first thing to read

| Source | Licence | Licence file | May we copy text? |
| --- | --- | --- | --- |
| frontend-design | Apache-2.0 | yes | yes, with notice |
| taste-skill | MIT | yes | yes, with notice |
| ui-ux-pro-max | MIT | yes | yes, with notice |
| impeccable | Apache-2.0 | yes | yes, with notice |
| scroll-world | MIT | yes | yes, with notice |
| remotion-skills | (none) | no | **no** |
| ponytail | MIT | yes | yes, with notice |
| ai-website-cloner-template | MIT | yes | yes, with notice |
| agency-agents | MIT | yes | yes, with notice |
| ruflo | MIT | yes | yes, with notice |
| awesome-claude-code-subagents | MIT | yes | yes, with notice |
| ai-dev-tasks | Apache-2.0 | yes | yes, with notice |
| before-implementing | MIT | yes | yes, with notice |
| graph-engineering | MIT | yes | yes, with notice |
| agent-elements-21st | MIT | yes | yes, with notice |
| magic-21st | ISC | no | **no** |
| website-builder-setup | (none) | no | **no** |

## Sources

### frontend-design

| | |
| --- | --- |
| repository | https://github.com/anthropics/skills (path `skills/frontend-design`) |
| commit | `b29e7cf65e5cb78a5ac33d582270551bc74a14eb` |
| licence | Apache-2.0 |
| redistribution | **allowed-with-notice** — Apache-2.0 permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | creative direction — thesis, typography, signature, composition |
| resolution | pinned, independently confirmed |

Beat SiteSmith 59 to 40 on an identical brief in a blind test. The single most important source in the rebuild.

### taste-skill

| | |
| --- | --- |
| repository | https://github.com/Leonxlnx/taste-skill |
| commit | `e988add20dab0fa97d7a76781c48961c8184288e` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | brief inference, design read, dials, anti-slop |
| resolution | pinned, independently confirmed |

Turns a vague request into density/motion/boldness settings a designer can act on.

### ui-ux-pro-max

| | |
| --- | --- |
| repository | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| commit | `4857a2c5ef989794751a0f66b8545a4a49566286` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | structured retrieval — patterns, palettes, font pairings, UX rules |
| resolution | pinned, independently confirmed |

The retrieval corpus SiteSmith already vendors as data/.

### impeccable

| | |
| --- | --- |
| repository | https://github.com/pbakaus/impeccable |
| commit | `6b342244e915d64b0d6e84d5eec448fd196ce6bb` |
| licence | Apache-2.0 |
| redistribution | **allowed-with-notice** — Apache-2.0 permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | routing, critique, bounded polish, craft floor, hardening |
| resolution | pinned, independently confirmed |

The only upstream with an explicit preserve-vs-redesign router and bounded loops.

### scroll-world

| | |
| --- | --- |
| repository | https://github.com/oso95/scroll-world |
| commit | `71cc36d3bb150248ae36a2c552f9cbf88802a79c` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | scroll-driven scene storytelling, camera logic, graceful fallback |
| resolution | resolved, independently confirmed |
| alternatives considered | vyctncao/scroll-world (0.02), VR-Jobs/scroll-world (0.01) |

This is an agent skill (SKILL.md format, Claude Code plugin + Vercel skills CLI installable) whose entire mechanism is scroll-driven scene storytelling: N AI-generated scene stills, N 'dive-in' camera clips, N-1 'connector' clips, and a framework-agnostic vanilla-JS scrub engine that maps scroll position to video time. That is exactly the scroll scenes / scroll progression / camera logic the hint describes.

Paths that matter: `skills/scroll-world/SKILL.md`, `skills/scroll-world/references/scrub-engine.js`, `skills/scroll-world/references/pipeline.md`, `skills/scroll-world/references/prompts.md`, `skills/scroll-world/references/index-template.html`, `skills/scroll-world/references/knockout.py`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `README.md`, `LICENSE`

Claims an autopsy must test:
- Claims the scrub engine in references/scrub-engine.js is self-contained vanilla JS that builds its own DOM and injects its own CSS, so it is framework-agnostic (drops into plain HTML, Next.js, Vue, anything) — verify no framework imports and no external CSS dependency.
- Claims scroll only drives time and the camera genuinely moves — i.e. the page scrubs PRE-RENDERED video by scroll position rather than doing runtime 3D. Verify the engine does video currentTime scrubbing, not WebGL/Three.js camera transforms.
- Claims seams between scenes must be 'frame-identical' and that the connector-clip method (first/last-frame conditioning) prevents a visible pop — verify references/pipeline.md actually specifies a frame-extraction/verification step rather than just asserting it.
- Claims it is agent-portable across Claude Code, Codex and 'any SKILL.md-compatible agent' — verify the SKILL.md frontmatter (allowed-tools: Bash, Read, Write, Edit, AskUserQuestion, Skill) does not hard-depend on Claude-only tooling.
- Claims a hard external dependency chain (Monid CLI default / Higgsfield CLI fallback, ffmpeg, Python+Pillow) — verify how much of the skill is unusable without paid API balance, since that determines what can actually be rebuilt.

### remotion-skills

| | |
| --- | --- |
| repository | https://github.com/remotion-dev/skills |
| commit | `4951f6aca2a236f2f2a2bff4734566963fe12707` |
| licence | **none declared** |
| redistribution | **forbidden** — No licence declared anywhere. All rights reserved by default. Read for understanding; never copy or closely paraphrase the text. |
| role in SiteSmith | skill routing, progressive references, timeline and scene composition |
| resolution | ambiguous, independently confirmed |
| alternatives considered | remotion-dev/remotion (packages/skills) (0.38), remotion-dev/claude-code-plugin (0.02), buainoai/remotion-skills (0.01) |

This is the dedicated remotion-dev repo holding the Remotion agent skills as SKILL.md files — 11 skills covering programmatic video creation, rendering, captions, interactivity and upgrades. It is the skills repo the hint asks for, not the renderer. Note that remotion-best-practices is a parent skill: its directory contains SKILL.md plus nested copies of the other ten skill directories, so there is an embedded/nested skill-composition mechanism worth inspecting (the scripts/ folder contains sync-embedded-skills.ts and prepare-embedded-skills.ts, which appear to generate that nesting).

Paths that matter: `skills/`, `skills/remotion-best-practices/SKILL.md`, `skills/remotion-create/SKILL.md`, `skills/remotion-create/tailwind.md`, `skills/remotion-create/video-layout.md`, `skills/remotion-render/`, `skills/remotion-captions/`, `skills/remotion-docs/`, `skills/remotion-interactivity/`, `skills/remotion-maps/`

Claims an autopsy must test:
- The README claims only 'This is an internal package and has no documentation' — verify whether the repo is genuinely intended for third-party consumption despite 4165 stars, since that affects whether its patterns are a supported reference or an internal artifact.
- Implicit claim of skill composition: remotion-best-practices/ contains nested copies of the other ten skills. Verify whether these are duplicated content or symlinks/generated, and whether the nesting implements progressive context loading (load parent, then pull child SKILL.md on demand).
- Claims of a build/sync pipeline via scripts/sync-agent-skills.ts, sync-embedded-skills.ts and prepare-embedded-skills.ts — verify whether skill content is hand-authored or generated from the Remotion docs, because that determines whether the skills are the source or a derived output.
- scripts/validate-links.ts implies a claim that all doc links inside the skills are checked — verify it actually runs in CI and covers every SKILL.md.
- package.json declares "private": true and version 4.0.503 tracking the Remotion release train — verify whether the skills are versioned in lockstep with the renderer, which would mean pinning a skill version implies pinning a Remotion version.

> **Ambiguous.** Marked AMBIGUOUS deliberately, on the upstream question only — the org and the content are certain, the canonical HOST is not. Both remotion-dev/skills and remotion-dev/remotion/packages/skills contain the same 11 skills with identical top-level structure (README.md, package.json, scripts, skills, tsconfig.json). Decisive evidence pointing at the monorepo as upstream: the standalone repo's package.json sets repository.url to https://github.com/remotion-dev/remotion/tree/main/packages/skills — i.e. remotion-dev/skills self-identifies as a subtree split of the monorepo. I still chose remotion-dev/skills because it is the artifact users and agents actually install and it is scoped to the skills alone. WHAT WOULD SETTLE IT: diff skills/ between the two at the recorded SHAs and check whether remotion-dev/skills has hand-written commits or only sync/split commits — if every commit is a mirror 

### ponytail

| | |
| --- | --- |
| repository | https://github.com/DietrichGebert/ponytail |
| commit | `16f29800fd2681bdf24f3eb4ccffe38be3baec6b` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | proportionality — smallest correct implementation, reuse before invention, dependency discipline |
| resolution | resolved, independently confirmed |
| alternatives considered | 0xwilliamortiz/ponytail-improved (0.05), ilindaniel/ponytail-lite (0.03), warp-svg/ponytail-gilfoyle (0.02) |

This is the mechanism SiteSmith would borrow for restraint discipline: a single skill file that pushes an agent down a 'laziness ladder' — reach for the platform-native primitive before a dependency, the smallest correct implementation before an abstraction — with named safety carve-outs so the minimisation never strips a guard. It also ships something rare: a reproducible agentic benchmark harness (benchmarks/) that measures the skill's effect on a real repo rather than asserting it.

Paths that matter: `skills/ponytail/SKILL.md`, `skills/ponytail-audit/`, `skills/ponytail-debt/`, `skills/ponytail-gain/`, `skills/ponytail-help/`, `skills/ponytail-review/`, `AGENTS.md`, `commands/`, `hooks/`, `benchmarks/`

Claims an autopsy must test:
- Claims ~54% less code (up to 94%), ~20% cheaper, ~27% faster, and 100% safe versus a no-skill baseline, measured on headless Claude Code sessions editing fastapi/full-stack-fastapi-template across 12 feature tickets, n=4, Haiku 4.5 — check that benchmarks/ actually contains a runnable harness reproducing this, not just a results markdown.
- Claims it keeps every safety guard while a bare 'YAGNI + one-liners' prompt drops one (95% safe) — verify SKILL.md contains explicit safety carve-outs that survive the minimisation pressure.
- Claims it works with 20 agents via platform-native plugin manifests (.claude-plugin, .codex-plugin, .cursor, .windsurf, .kiro, .qoder, .opencode, .devin-plugin, .clinerules, .agents, gemini-extension.json, pi-extension) — verify these are real per-platform packagings of one source of truth and not 20 divergent copies.
- Claims prefer-the-platform-primitive as the core move (README's date-picker example: 404 lines to a native <input type="date">) — verify SKILL.md encodes this as an ordered decision procedure rather than a vibe.

### ai-website-cloner-template

| | |
| --- | --- |
| repository | https://github.com/JCodesMore/ai-website-cloner-template |
| commit | `a9b35751b756dd8e9c3951afec86d2cb869c4e0f` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | URL intake, design-token and asset extraction, section mapping, reconstruction fidelity |
| resolution | resolved, independently confirmed |
| alternatives considered | UHolli/ai-website-cloner (0.05), ZevileN/hack-JCodesMore-ai-website-cloner-template (0.01), hljlgj/ai-website-cloner (0.01) |

This is the closest public prior art to SiteSmith's reconstruction path: a URL-in, Next.js-codebase-out pipeline where one skill file drives live browser inspection (`claude --chrome`), token and asset extraction, section mapping into component specs, and parallel builder dispatch. Two mechanisms are worth autopsying specifically — docs/research/INSPECTION_GUIDE.md as the evidence-gathering contract, and scripts/sync-skills.mjs + sync-agent-rules.sh as a single-source-of-truth generator that fans one skill out to 11+ agent-specific rule directories.

Paths that matter: `.claude/skills/clone-website/SKILL.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `docs/research/INSPECTION_GUIDE.md`, `docs/design-references/`, `scripts/sync-skills.mjs`, `scripts/sync-agent-rules.sh`, `src/app/`, `src/components/`

Claims an autopsy must test:
- Claims a single /clone-website command runs the full pipeline: inspect the site, extract design tokens and assets, write component specs, and dispatch PARALLEL builders per section — verify .claude/skills/clone-website/SKILL.md actually orchestrates concurrent subagents rather than a sequential loop.
- Claims support for 11+ agents (Claude Code, Codex CLI, OpenCode, Copilot, Cursor, Windsurf, Gemini CLI, Cline, Roo Code, Continue, Amazon Q) — verify the per-agent directories are genuinely generated from one source by scripts/sync-skills.mjs and have not drifted apart.
- Claims it accepts multiple target URLs in one invocation (/clone-website <url1> [<url2> ...]) — verify SKILL.md defines how multi-URL input is reconciled into one coherent design system rather than producing conflicting token sets.
- Claims output is a 'clean, modern Next.js codebase' from reverse-engineering — verify whether it produces reusable components and real design tokens, or whether it screenshot-matches into one-off markup. This is the claim most load-bearing for SiteSmith, since a cloner that copies pixels is the opposite of the anti-AI-generic goal.
- Claims Claude Code with Opus 4.8 gives best results and requires --chrome — verify how hard the dependency on live browser inspection is, i.e. whether the pipeline degrades gracefully without it.

### agency-agents

| | |
| --- | --- |
| repository | https://github.com/msitarzewski/agency-agents |
| commit | `c89557f78509868c6d4cc08e5cbc79bc8625fe1c` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | specialist agent roles, delegation, handoff, responsibility boundaries |
| resolution | resolved, independently confirmed |
| alternatives considered | jnMetaCode/agency-agents-zh (0.05), Anas-Khan93/ai-agency-agents (0.03), Raheel2774/agency-agents (0.02) |

The mechanism we care about — specialist agent role definitions organised like a creative/dev agency — lives as one Markdown file per persona inside the division directories (confirmed: engineering/ holds engineering-ai-engineer.md, engineering-backend-architect.md, engineering-code-reviewer.md, engineering-devops-automator.md, and ~dozens more, all prefixed with the division name). divisions.json and tools.json are the machine-readable structure that binds personas to divisions and to supported host tools. integrations/ holds the per-host adapters (claude-code, codex, cursor, opencode, openclaw, hermes, ...) which is where any delegation/handoff wiring would have to live. scripts/ holds the repo's own quality gates, including an originality check.

Paths that matter: `engineering/`, `design/`, `marketing/`, `product/`, `sales/`, `project-management/`, `testing/`, `security/`, `support/`, `strategy/`

Claims an autopsy must test:
- README claims '230+ Specialized Agents' across 11+ divisions — count the actual .md persona files across the division directories and check the division count against divisions.json.
- README claims each agent has 'Deep expertise in their domain (not generic prompt templates)' with identity, mission, workflows, technical deliverables with code examples, and success metrics — sample personas and check whether these sections are actually present and substantive, or whether the files are near-identical boilerplate with the noun swapped.
- README claims support for 14 host platforms (Claude Code, Copilot, Antigravity, Gemini CLI, OpenCode, OpenClaw, Cursor, Aider, Windsurf, Qwen, Kimi, Codex, Osaurus, Hermes) — integrations/ lists 17 entries; verify each is a real adapter and not an empty stub.
- The hint attributes 'delegation, handoff, responsibility boundaries' to this repo, but the README documents NO inter-agent delegation or handoff mechanism — agents are user-activated and independent. Verify against actual file content whether any handoff protocol exists at all, or whether the agency framing is purely taxonomic.

### ruflo

| | |
| --- | --- |
| repository | https://github.com/ruvnet/ruflo |
| commit | `913f9eaedee92627950544424e50339feaf98271` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | shared memory, orchestration, long workflows, state persistence |
| resolution | resolved, independently confirmed |
| alternatives considered | marcuspat/turbo-flow (0.02), henryalouf/ruflow (0.01) |

Every mechanism named in the hint has a confirmed on-disk home. Shared memory + state persistence: .claude/skills/agentdb-memory-patterns/, agentdb-vector-search/, agentdb-learning/, plus agentdb.rvf and agentdb.rvf.lock at repo root (the RVF trajectory-persistence store the README claims). Swarm coordination: .claude/skills/hive-mind-advanced/ and flow-nexus-swarm/, with .claude/agents/hive-mind/ and .claude/agents/consensus/ holding the Raft/Byzantine/Gossip agent definitions. Self-improvement: .claude/skills/reasoningbank-intelligence/ and reasoningbank-agentdb/, .claude/agents/neural/. Long workflows: .claude/workflows/, .claude/commands/, .claude/skills/sparc-methodology/, .claude/skills/stream-chain/. Host-agnostic packaging: .agents/ (config.toml + skills) mirrors .claude/, .claude-plugin/ and plugins/ carry the plugin manifests, and root SKILL.md is the single-skill entry point. v3/ is a parallel newer implementation tree with its own agents/, mcp/, and plugins/ — treat it as a second surface, not dead weight. verification/ and tests/ are where any self-proof would live.

Paths that matter: `SKILL.md`, `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.claude/skills/`, `.claude/skills/hive-mind-advanced/`, `.claude/skills/agentdb-memory-patterns/`, `.claude/skills/agentdb-learning/`, `.claude/skills/agentdb-vector-search/`, `.claude/skills/reasoningbank-intelligence/`

Claims an autopsy must test:
- README claims '100+ Agents' but the CLI install path claims '98 agents, 60+ commands, 30 skills' — count actual agent definition files under .claude/agents/ (and v3/agents/) and reconcile the three numbers.
- Claims '~210 tools, ready to call' via MCP — enumerate the actual registered MCP tool definitions (v3/mcp/, plugins/) and check whether the count is real, and whether tools are implemented or stubbed.
- Claims agents 'remember across sessions' and 'Save and restore agent memory across sessions' via HNSW-indexed AgentDB / RVF — verify there is real persistence code and an actual index, not a JSON blob rewritten per run. agentdb.rvf is committed into the repo, which is worth checking: is it a real store, a seed, or a fixture?
- Claims 'Agents learn from past successes and get smarter' and 'SONA self-learning with pattern matching' — locate the feedback loop that writes outcomes back into memory and check whether retrieval actually conditions later behaviour, or whether 'learning' is only logging.
- Claims 'Queen-led hierarchy (Raft, Byzantine, Gossip)' consensus and 'hierarchical, mesh, and adaptive topologies' — check .claude/agents/consensus/ for whether these are implemented protocols or prompt-level descriptions of protocols.

### awesome-claude-code-subagents

| | |
| --- | --- |
| repository | https://github.com/VoltAgent/awesome-claude-code-subagents |
| commit | `91810b33c707111e05e0988b12e7385d7b5cfe9d` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | role taxonomy, reusable subagent contracts |
| resolution | resolved, independently confirmed |
| alternatives considered | rahulvrane/awesome-claude-agents (0.05), ximet/awesome-claude-code-subagents, briventia/…, 1nexvora/…, robzsaunders/… (0.02) |

This is the canonical upstream of the subagent taxonomy: agent definitions are one markdown file per subagent, grouped into ten numbered category directories, plus a catalog tool and an installer script. That directory layout IS the mechanism (a browsable taxonomy of reusable agent definitions) the rebuild cares about.

Paths that matter: `categories/`, `categories/01-core-development/`, `categories/02-language-specialists/`, `categories/03-infrastructure/`, `categories/04-quality-security/`, `categories/05-data-ai/`, `categories/06-developer-experience/`, `categories/07-specialized-domains/`, `categories/08-business-product/`, `categories/09-meta-orchestration/`

Claims an autopsy must test:
- Claims '100+ specialized Claude Code subagents' — count the actual .md agent files under categories/ (excluding README.md and .claude-plugin) and check whether it reaches 100.
- Claims the collection covers 'a wide range of development use cases' via 10 categories — verify each category directory is non-trivially populated rather than a few stub files.
- Claims installability: verify install-agents.sh and .claude-plugin/ actually produce working Claude Code agent installs, and that agent files carry valid frontmatter (name/description/tools) rather than prose-only markdown.
- Claims to be a curated 'awesome' list — verify whether entries are original agent definitions authored in-repo (they appear to be full .md agent bodies) rather than links out to third-party repos, since that changes the licensing/provenance story.

### ai-dev-tasks

| | |
| --- | --- |
| repository | https://github.com/snarktank/ai-dev-tasks |
| commit | `efbffaac10e68c94e14aaa587c79b7d5015b5ebd` |
| licence | Apache-2.0 |
| redistribution | **allowed-with-notice** — Apache-2.0 permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | idea to PRD to tasks, sequential execution, acceptance criteria, scope control |
| resolution | resolved, independently confirmed |
| alternatives considered | stulogy/vibe-prd (0.02), cjo4m06/mcp-shrimp-task-manager (0.01) |

The entire mechanism is three markdown files at repo root: create-prd.md (clarifying-questions-then-PRD prompt), generate-tasks.md (PRD -> parent tasks -> sub-tasks), and README.md which documents the four-step human-in-the-loop protocol. There is no code, no packaging — the prompts are the product, which is exactly the idea-to-PRD-to-tasks-to-sequential-execution workflow the rebuild is sourcing.

Paths that matter: `create-prd.md`, `generate-tasks.md`, `README.md`, `LICENSE`

Claims an autopsy must test:
- README claims a step 4/5 'work through tasks one sub-task at a time, marking completion' protocol — but the current repo root contains NO process-task-list.md (only create-prd.md and generate-tasks.md). Verify where the execution/completion-marking rules actually live now (inside generate-tasks.md? README prose only?) and whether the file was removed upstream; earlier circulating copies of this repo included process-task-list.md.
- Claims tool-agnosticism: 'works with any AI coding assistant including Amp, Claude Code, Windsurf'. Verify the prompt files contain no tool-specific syntax beyond the @file reference convention.
- Claims 'built-in checkpoints for verification' / human approval per sub-task — verify generate-tasks.md actually instructs the agent to pause and wait for user confirmation, rather than that only appearing in README marketing prose.
- Claims create-prd.md produces a scoped PRD by asking clarifying questions first — verify the file mandates the question phase before drafting.

### before-implementing

| | |
| --- | --- |
| repository | https://github.com/nicobailon/grill-for-unknowns |
| commit | `d8d5f4b422b8be1301dd4a515d96589eaddc5f3c` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | investigate-before-asking contract, blocking questions, assumptions, proportional planning |
| resolution | ambiguous, independently confirmed |
| alternatives considered | addyosmani/agent-skills (0.3), tobrun/skills (dev/skills/to-plan) (0.15), Piebald-AI/claude-code-system-prompts (system-prompt-exploratory-questions-analyze-before-implementing.md) (0.05) |

Best mechanism-level match for the described contract: investigate the repo before asking the user, restate the goal, raise only blocking/non-obvious questions, name assumptions explicitly, and reach shared understanding before any implementation begins. Chosen as the working stand-in, NOT as a confirmed name match.

Paths that matter: `plugins/grill-for-unknowns/SKILL.md`, `plugins/`, `README.md`, `NOTICE.md`, `LICENSE`, `CHANGELOG.md`, `.claude-plugin/`

Claims an autopsy must test:
- Claims the agent inspects the repository/codebase to answer questions itself instead of asking the user (investigate-before-asking).
- Claims it restates the plan/goal back in one short paragraph before questioning.
- Claims each question must surface exactly one consequential unknown (hidden assumption, edge case, permission boundary, data lifecycle, failure mode) rather than confirming the obvious.
- Claims a hard boundary: grill first, decide second, implement third — no code until the unknowns are resolved.
- Verify whether it produces a plan whose depth is proportional to the stakes, or only a question set — the hint's 'proportional plan' element may be absent.

> **Ambiguous.** NOT confirmed. No source — repo, skill directory, SKILL.md frontmatter name, or standalone document — is actually called 'Before Implementing'. Searched: `gh search repos before-implementing`, `search/repositories q=before-implementing in:name` (1 unrelated hit about incident management), `search/code` for `filename:before-implementing.md` (36 hits, all rules/ADRs/memory notes inside unrelated projects), `path:before-implementing` and `filename:SKILL.md path:*before-implementing*` (0 hits), `"name: before-implementing" in:file` (0), `"Restate the goal" "Blocking questions"` (28 hits, none named that), `"Investigate before asking"` (433 hits, no matching skill), plus web searches on the hint's five elements. Listed directory contents of anthropics/skills, addyosmani/agent-skills, indykite/skills and codejunkie99's 37 public repos — none contains a before-implementing skill. Metadata for t

### graph-engineering

| | |
| --- | --- |
| repository | https://github.com/codejunkie99/graph-engineering |
| commit | `cfacb56a05a31ba69bf84d0b8b00f5ce463127ef` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | typed nodes, directional relationships, durable shared context, experiment lineage |
| resolution | ambiguous, independently confirmed |
| alternatives considered | Peter Steinberger (@steipete) X post, 18 July 2026 (0.2), explainx.ai — 'Graph Engineering: Wire Multi-Agent Orgs After Loops (2026)' (0.2), vanja.io — 'Graph Engineering: The Next Layer After Context' (0.1), langchain — '3 Years of Graph Engineering with LangGraph' (0.1) |

Only actionable, licence-clean, self-contained artifact carrying the mechanism: typed graph nodes plus precisely-named directional relations as the agents' durable memory substrate, provenance and time on every fact (the lineage property), ontology-before-extraction with domain/range validation to reject hallucinated structure, fusion before storage, per-stage evaluation, and a task-graph half for multi-agent orchestration with verifier separation and human gates.

Paths that matter: `graph-engineering/SKILL.md`, `graph-engineering/references/modeling.md`, `graph-engineering/references/extraction.md`, `graph-engineering/references/fusion-and-llm.md`, `graph-engineering/references/task-graphs.md`, `graph-engineering/references/curriculum.md`, `WORKFLOWS.md`, `dist/graph-engineering.skill`, `LICENSE`, `README.md`

Claims an autopsy must test:
- Claims a 9-stage knowledge-graph pipeline distilled and translated from Southeast University's graduate KG course (npubird/KnowledgeGraphCourse, Prof. Peng Wang) — check the derivation is real and that the upstream course's licence permits redistribution, since the repo ships MIT.
- Claims quality comes from pipeline ORDER — model the domain before extracting, fuse before storing, evaluate at every stage — and that stages 3 (ontology) and 8 (fusion) must never be skipped.
- Claims every fact carries time and provenance (span + source pointer), which is the load-bearing claim for 'experiment lineage' and for distinguishing agent-written edges from human-confirmed facts.
- Claims constraining the LLM to the ontology's relation list with domain/range checks 'removes most hallucinated structure' — an empirical claim with no cited measurement.
- Claims a teaching mode that generates mermaid/HTML diagram artifacts per stage; verify the reference files actually contain that material rather than pointing outward.

> **Ambiguous.** AMBIGUOUS BY NATURE OF THE TERM. 'Graph engineering' has no single canonical primary source: it is a 2026 label (viral 18 July 2026, after 'prompt → context → loop') applied retroactively to knowledge-graph/GraphRAG and graph-orchestration work that predates it. Multiple unrelated repos ship a skill literally named graph-engineering — codejunkie99/graph-engineering, guyghost/swarm-dao (.agents/skills/graph-engineering, an XState-based DAO workflow governor, unrelated), xxarupakaxx/.codex (Japanese, loop-coordination contract), BhaveshKhaple/bhavesh-claude-skills (loops-and-graphs 5-layer workflow design), Mark393295827/third-brain-v7-skills (static-DAG contract, paired with loop-engineering and harness-engineering). I opened the first ~25 lines of each of those four alternatives; none covers the hint's full span, and codejunkie99's is the only one that treats the graph as durable shared 

### agent-elements-21st

| | |
| --- | --- |
| repository | https://github.com/21st-dev/agent-elements |
| commit | `b04b36cb6381a1dd1a0e86cc7c90564ddcd56d37` |
| licence | MIT |
| redistribution | **allowed-with-notice** — MIT permits redistribution provided the notice travels with the copy. Add to THIRD-PARTY-NOTICES.md before copying a single line. |
| role in SiteSmith | agent UI primitives — plans, approvals, tool renderers, streaming |
| resolution | resolved, independently confirmed |

Canonical upstream for the agent-UI primitives the rebuild wants: a shadcn-compatible registry of 26 components covering plan cards, edit approval with diffs, tool renderers dispatched by name, subagent UI, clarifying-question tool, and safe streaming markdown. It also ships its own Claude skill (skills/agent-elements/SKILL.md) that is a direct comparator for how a skill should describe a component library.

Paths that matter: `README.md`, `LICENSE`, `skills/agent-elements/SKILL.md`, `skills/agent-elements/README.md`, `lib/agent-ui/`, `lib/agent-ui/components/`, `lib/agent-ui/components/tools/`, `lib/agent-ui/components/question/`, `lib/agent-ui/components/input/`, `lib/agent-ui/components/agent-chat.tsx`

Claims an autopsy must test:
- README claims '26 components total' — count the actual component files under lib/agent-ui/components/ (incl. tools/, question/, input/ subdirs) and the registry index at /r/index.json.
- README claims the registry is shadcn-compatible and that installing 'agent-chat' transitively installs everything it needs — verify components.json + scripts/ actually generate valid shadcn registry JSON with dependency chains.
- README claims components are 'production-ready' and built on React 19 + Tailwind v4 + Vercel AI SDK — verify package.json pins those versions and that the API is typed on UIMessage[]/ChatStatus from 'ai'.
- SKILL.md claims project-aware triggering (fires when code imports from @/components/agent-elements/* or that folder exists on disk) and explicitly scopes itself OUT for plain chat UIs — verify the skill body actually contains detection logic rather than just prose.

### magic-21st

| | |
| --- | --- |
| repository | https://github.com/21st-dev/magic-mcp |
| commit | `dfba16c1b9baa63ed4efd0c69121ed08ba697b1a` |
| licence | ISC |
| redistribution | **forbidden** — Licence "ISC" is declared only in package metadata, with no LICENSE file and a null GitHub licence field. That is weaker provenance than a licence file, so treat as unresolved risk and do not redistribute. |
| role in SiteSmith | component generation and registry used by website builder setups |
| resolution | ambiguous, independently confirmed |
| alternatives considered | 21st-dev/cli (0.22), 21st-dev/skill (0.06), 21st-dev/registry (0.03) |

This is the repo behind the '21st.dev Magic' entry that website-builder-setup installs, so it is the correct upstream for reconstructing what that stack actually wired up. Its current state is itself the important finding: the real component-generation logic no longer lives here — src/ is one file (index.ts) that proxies to the remote 21st MCP at https://21st.dev/api/mcp. Any rebuild that assumes local generation code exists in this repo will be wrong.

Paths that matter: `README.md`, `src/index.ts`, `package.json`, `llms-install.md`, `smithery.yaml`, `Dockerfile`, `tsconfig.json`

Claims an autopsy must test:
- README claims that since v0.2.0 the package is 'a small stdio proxy that forwards every MCP message to the 21st MCP server' — verify src/index.ts contains only proxying, no component generation or local registry.
- README claims legacy tool names (21st_magic_component_builder, 21st_magic_component_inspiration, 21st_magic_component_refiner, logo_search) are still accepted and translated to generate/get_inspiration/search_logo — verify whether that translation happens in this repo or only server-side.
- README claims the API key is accepted in five historical forms (positional API_KEY=, --API_KEY=, /API_KEY:, -API_KEY, plus TWENTY_FIRST_API_KEY / API_KEY_21ST env vars) — verify src/index.ts parses all of them.
- website-builder-setup claims 21st.dev Magic provides '100+ production-ready React components' (README) while the 21st-dev org description says '10,000+ React/Tailwind components' — neither number is verifiable from this repo's content, since the catalogue is remote. Flag both as unverifiable-from-source.

> **Ambiguous.** AMBIGUOUS by succession, not by identity. Nothing else on GitHub is plausibly 'the' 21st Magic — a gh search for '21st.dev magic mcp' returned only forks, security-lab clones (sls-org-testing-*) and third-party installers. The ambiguity is which node of the 21st.dev lineage is 'canonical' for the rebuild: the historical Magic MCP (21st-dev/magic-mcp, what website-builder-setup actually installed) or its stated successor (21st-dev/cli + the closed remote server at https://21st.dev/api/mcp). I chose magic-mcp because the task frames this as 'the registry used by website builder setups', which is historical. WHAT WOULD SETTLE IT: decide whether the rebuild is reconstructing what the old stack did (→ magic-mcp) or wiring the current 21st.dev product (→ 21st-dev/cli, and note the actual generation server is not open source at all). LICENCE CONFLICT — record carefully: GitHub API .license.spdx

### website-builder-setup

| | |
| --- | --- |
| repository | https://github.com/tenfoldmarc/website-builder-setup |
| commit | `83d94dac66b90b1da37152084ac671989379b692` |
| licence | **none declared** |
| redistribution | **forbidden** — No licence declared anywhere. All rights reserved by default. Read for understanding; never copy or closely paraphrase the text. |
| role in SiteSmith | installation, onboarding, dependency setup, packaging |
| resolution | resolved, independently confirmed |
| alternatives considered | creativecore-ai/ccai-website-builder-setup (0.01) |

The entire repo is two files: a README and a single SKILL.md. The SKILL.md is a linear onboarding script (check Node → install UI/UX Pro Max → install Framer Motion → install 21st.dev Magic) written for a zero-coding-experience user, with explicit 'if a step fails, don't stop, give the manual command and keep moving' instruction. That whole mechanism is the thing being rebuilt, and it is small enough to autopsy in full.

Paths that matter: `README.md`, `website-builder-setup/SKILL.md`

Claims an autopsy must test:
- SKILL.md description claims 'One skill, three tools, zero coding experience needed' — verify the skill actually completes all three installs unattended rather than handing off manual commands at each failure point.
- README claims UI/UX Pro Max gives '50+ design styles, 161 color palettes, 57 font pairings' and that this makes sites 'look designed, not AI-generated' — these are claims about a THIRD-PARTY skill, not about this repo's own content; verify the numbers against ui-ux-pro-max upstream, not here.
- README claims 21st.dev Magic supplies '100+ production-ready React components' — unverifiable from this repo and inconsistent with 21st.dev's own '10,000+' figure.
- README documents an OLD INSTALL path ('claude install-skill <url>') explicitly marked REMOVED, and the current path clones into ~/.claude/commands/ (commands, not skills) — verify whether that install location still works with current Claude Code skill discovery, since it may be stale.

