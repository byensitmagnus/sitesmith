# Product Requirements Document: SiteSmith v3

**Status:** Binding product contract — corrected after S17 visual proof  
**Date:** 2 August 2026  
**Target:** SiteSmith v3 Release Candidate  
**Repository:** `byensitmagnus/sitesmith`

## 1. Product vision

SiteSmith is one unified, installable website-building system for AI coding agents. It combines the strongest documented mechanisms from leading frontend, UX, motion, implementation and agent-workflow projects into one coherent product.

The user installs SiteSmith once, gives it a website brief or an existing repository, and receives a complete, working and browser-verified website without manually activating or coordinating upstream skills.

The long-term ambition is for SiteSmith to become the strongest and most popular website-building skill on GitHub. This is a strategic vision, not a release claim or technical exit gate.

## 2. Problem

Current AI website workflows commonly fail in one or more of these ways:

- outputs converge on generic, recognisably AI-generated designs;
- creative direction is either weak or reduced to rigid templates;
- UX, accessibility, motion, assets and implementation are handled as disconnected tasks;
- agents stop when code compiles instead of inspecting the rendered result;
- facts, products, testimonials and metrics are invented;
- large rule sets consume context without improving the website;
- multiple useful skills must be installed and orchestrated manually;
- long agent runs drift into research, benchmarking and documentation instead of shipping.

SiteSmith must solve the complete workflow from evidence and creative direction to implementation and browser proof.

## 3. Target users

### Primary users

- developers and founders using Claude Code, Codex, Cursor or Grok;
- agencies and freelancers building marketing sites, webshops and product interfaces;
- non-designers who need a strong design and UX process inside their coding agent;
- experienced developers who want a reliable release loop without surrendering their existing stack.

### User need

> Build or improve this website in the correct stack, make it visually specific to the subject, implement the important journeys, and prove in the browser that it works.

## 4. Product promise

SiteSmith must provide:

- one repository;
- one canonical core;
- one installation journey;
- one coherent workflow;
- thin host-specific adapters;
- progressive capability loading;
- complete website implementation;
- browser-based release proof;
- transparent attribution and licensing.

Upstream projects contribute mechanisms and knowledge, but they must not appear as separate products the user has to operate.

## 5. Product principles

1. **Brief and evidence before design.** Existing brand, content, facts, assets and repository constraints are authoritative.
2. **Creative judgement before mechanical generation.** Scripts may route, validate and measure, but they must not replace the model's creative reasoning.
3. **Subject-specific output.** Each website must derive its visual world, hierarchy, copy and signature element from its actual subject.
4. **Progressive context.** Load only the capabilities required by the current task.
5. **Reuse before invention.** Respect the existing stack and component system before adding dependencies or abstractions.
6. **One product, many capabilities.** The user never orchestrates upstream sources manually.
7. **Rendered proof over source claims.** A build is unfinished until it has been opened, exercised, inspected and corrected in a browser.
8. **Facts fail closed.** Unknown facts remain unknown; SiteSmith must not invent claims, numbers, testimonials, prices, assets or certifications.
9. **Motion is conditional.** Motion must serve the brief, respect reduced motion and degrade gracefully.
10. **Bounded autonomy.** SiteSmith continues through non-blocked work, but loops have explicit limits and a binary exit gate.
11. **Visual quality requires positive proof.** Avoidance rules and automated genericness scores are guardrails, not evidence that a website is professionally designed.

## 6. Supported product modes

SiteSmith v3 must route per page or surface to:

1. **Marketing / experience:** company sites, services, launches, portfolios and editorial experiences.
2. **E-commerce:** collections, product pages and purchase-oriented journeys.
3. **Product UI:** dashboards, administration, forms, tools and agent interfaces.
4. **Redesign / reconstruction:** improve an existing site or reconstruct from a supplied reference while preserving applicable brand and stack constraints.
5. **Component:** create or improve a bounded interface component inside an existing system.
6. **Audit / polish:** inspect, critique, repair and harden an existing implementation.

## 7. Core user journey

```text
INSTALL
→ INTAKE
→ INSPECT REPOSITORY AND EVIDENCE
→ ROUTE CAPABILITIES
→ FORM CREATIVE DIRECTION
→ LOCK DESIGN AND INTERACTION CONTRACT
→ IMPLEMENT IN THE CORRECT STACK
→ RUN IMPORTANT JOURNEYS
→ VERIFY IN THE BROWSER
→ CRITIQUE AND CORRECT ONCE
→ DELIVER PROOF
```

The normal user should be able to describe the task in plain language. Internal source routing, agent roles and validation machinery remain invisible unless inspection is requested.

## 8. Required capabilities

### 8.1 Intake, truth and context

- infer a usable brief when the request is sufficiently clear;
- ask no more than three blocking questions;
- inspect the existing repository before changing it;
- record known facts, unknowns, brand constraints and available assets;
- detect the established stack and preserve it unless the user requests otherwise;
- maintain lightweight durable state for longer builds.

### 8.2 Creative direction

- perform a subject-specific Design Read;
- form a clear creative thesis;
- choose typography, palette, layout rhythm, materiality and imagery deliberately;
- define one memorable signature element derived from the subject;
- avoid generic AI defaults without banning legitimate brand choices;
- allow real rejection or revision of a weak direction;
- prevent a fixed SiteSmith house style across unrelated briefs.

### 8.3 UX and content

- identify the user's primary goal and journey;
- select patterns appropriate to marketing, commerce or product work;
- implement responsive hierarchy, navigation, states, forms, errors and empty states where relevant;
- preserve factual truth in copy;
- use structured design knowledge and component retrieval conditionally.

### 8.4 Assets

- inventory existing assets before sourcing or generating new ones;
- state what each important asset contributes to the page;
- reuse or source licensed assets before generation when appropriate;
- record provenance;
- remain a draft when required assets are unavailable instead of silently inventing them.

### 8.5 Implementation

- work inside the detected stack;
- reuse existing components, dependencies and platform capabilities;
- choose the smallest correct implementation;
- avoid unnecessary abstraction and dependency installation;
- implement real responsive behaviour and interactive states;
- preserve maintainability and accessibility.

### 8.6 Motion and experience

SiteSmith must support four brief-routed levels:

1. micro-interactions;
2. CSS/JavaScript scroll storytelling;
3. scroll-scrubbed video using supplied assets;
4. Remotion composition when the project already uses it or explicitly selects it.

All motion must:

- respect `prefers-reduced-motion`;
- keep content visible when JavaScript fails or is disabled;
- avoid unnecessary main-thread work;
- inherit the selected design direction;
- avoid importing an upstream project's visual house style.

### 8.7 Verification and release proof

- render at mobile, tablet and desktop widths;
- inspect screenshots, not only machine output;
- detect broken links, blocking console errors and horizontal overflow;
- run accessibility checks in relevant colour schemes;
- exercise at least one important journey per surface;
- check design-contract fidelity and undeclared token drift where applicable;
- verify asset and factual integrity;
- capture motion as video or an equivalent interactive recording when motion is part of the brief;
- produce an honest production report containing failures and limitations.

### 8.8 Visual acceptance

A release holdout must look like a production-quality website or product surface, not a test fixture, wireframe or minimally styled HTML document.

Visual proof must demonstrate:

- a clear, subject-specific art direction visible in the first viewport;
- deliberate composition, hierarchy, typography, spacing, colour, materiality and asset use;
- an intentional asset strategy, including provenance for sourced assets;
- an appropriately complete surface and journey for its product mode;
- interaction and state polish proportionate to the brief;
- purposeful whitespace rather than large accidental areas of unused canvas;
- genuinely different design systems across unrelated holdouts;
- desktop and mobile screenshots, plus motion proof when applicable.

Automated tests may reject defects, but they cannot independently approve aesthetics. Genericness scores, forbidden-pattern checks, accessibility checks and green runtime gates are necessary guardrails only. Final visual acceptance requires Magnus to review the rendered evidence explicitly.

## 9. Source integration contract

All 19 mandatory sources must make a concrete, traceable and testable contribution. A source cannot pass by appearing only in research, credits or an archive.

| Source | Required contribution |
| --- | --- |
| Existing SiteSmith v2.3 | Evidence, assets, stack routing, DesignSpec, journeys and browser release proof |
| Anthropic frontend-design | Creative thesis, subject grounding, signature element, typography and direct implementation |
| Taste Skill | Design Read, inference, design dials, reference analysis, variation and anti-slop judgement |
| UI/UX Pro Max | Conditional retrieval of UX rules, product patterns, styles, palettes, font pairings and stack guidance |
| Impeccable | Preserve/redesign routing, critique, audit, polish, hardening and responsive craft |
| Scroll World | Scene model, scroll progression, timeline segments, continuity, performance and fallback |
| Remotion Skills | Composition, frames, scenes, timelines and conditional video workflows |
| Framer Motion patterns | Conditional micro-interactions, transitions and layout motion |
| Ponytail | Smallest correct implementation, reuse and dependency discipline |
| AI Website Cloner Template | Reference intake, token and asset extraction, section mapping and reconstruction |
| Website Builder Setup | Installation, onboarding, packaging and dependency setup |
| Agency Agents | Specialist responsibility and handoff patterns |
| Ruflo | Durable state, coordination and recovery without mandatory swarm complexity |
| Awesome Claude Code Subagents | Reusable role and output contracts with single-agent fallback |
| AI Dev Tasks | Task decomposition, acceptance criteria and scope control |
| Graph Engineering material | Typed context, relationships, blockers, decisions and proof links |
| Before Implementing contract | Investigate-first behaviour, goal, assumptions and proportional planning |
| 21st.dev Agent Elements | Conditional patterns for agent-interface products |
| 21st.dev Magic / registries | Conditional component retrieval and reuse before invention |

Each contribution is classified as `ADOPTED`, `ADAPTED` or `CLEAN_ROOM`. Direct reuse requires compatible licensing and attribution. Unlicensed expression must not be copied; the capability may be implemented independently from its observable purpose.

Core contributions must be visible in end-to-end builds. Conditional contributions may be proven through focused routing, fixture or smoke tests.

## 10. Context and graph requirements

Graph engineering is a lightweight execution aid, not a separate platform.

Permitted live node types:

- Deliverable
- Capability
- Blocker
- Proof
- Decision

Permitted edges:

- REQUIRES
- BLOCKED_BY
- PROVEN_BY
- SUPERSEDES

Constraints:

- no more than 25 live nodes;
- one active node at a time;
- no graph database, vector store or swarm requirement;
- every live node must affect product code, a necessary test, a blocker or a binding decision;
- state must be resumable after interruption.

## 11. Distribution and positioning

SiteSmith is presented as one product:

> One unified website-building system combining creative direction, UX intelligence, motion, component retrieval, implementation discipline and browser-based release proof.

Distribution requirements:

- one canonical SiteSmith package;
- one documented installation journey;
- thin adapters for Claude Code, Codex, Cursor and Grok;
- one README and product identity;
- one quick-start workflow;
- source projects credited through provenance and a clear “Built from the best ideas in” section;
- no requirement for users to install or operate upstream projects separately.

SiteSmith must not claim objective superiority until supported by reproducible website results.

## 12. Non-goals for v3 Release Candidate

SiteSmith v3 RC will not:

- build a general-purpose orchestration platform;
- require a swarm or multi-agent runtime;
- ship a large graph database;
- perform unlimited self-improvement loops;
- run large paid H2H benchmark tournaments;
- guarantee that every host exposes identical tools;
- force motion, Remotion, Agent Elements or component registries into unrelated tasks;
- replace established project stacks without user direction;
- make “best in the world” or GitHub-ranking claims.

## 13. Functional requirements

| ID | Requirement |
| --- | --- |
| FR-01 | A user can install SiteSmith from a clean clone using documented commands. |
| FR-02 | SiteSmith activates as one skill without manual upstream chaining. |
| FR-03 | SiteSmith detects and respects the existing stack. |
| FR-04 | SiteSmith routes the task to the correct product mode and conditional references. |
| FR-05 | SiteSmith creates an evidence-bound creative direction before implementation. |
| FR-06 | SiteSmith implements a complete, responsive primary surface and journey. |
| FR-07 | SiteSmith does not invent factual or commercial claims. |
| FR-08 | SiteSmith supports conditional motion with reduced-motion and no-JavaScript fallbacks. |
| FR-09 | SiteSmith verifies the finished implementation in a real browser. |
| FR-10 | SiteSmith records failures and known limitations honestly. |
| FR-11 | All 19 sources have concrete paths, provenance and proof. |
| FR-12 | Claude Code and Codex clean-install paths are verified; Cursor and Grok use the same canonical core through thin adapters. |
| FR-13 | A build can resume from durable state without restarting research. |
| FR-14 | The execution loop stops only at a passed exit gate or a concrete blocker. |

## 14. Release Candidate exit gate

The agent may declare `RELEASE_CANDIDATE_READY: YES` only when all conditions below pass:

1. Source coverage reports 19/19 concrete contributions.
2. Licences, notices and provenance validate.
3. The canonical package installs in a clean temporary environment.
4. Claude Code and Codex activation paths are verified.
5. Cursor and Grok adapters reference the same canonical core without copied business logic.
6. Exactly three isolated holdouts are built:
   - marketing / experience with brief-driven motion;
   - e-commerce product page;
   - product UI dashboard.
7. The three holdouts are meaningfully different in composition, typography, palette, materiality and signature element.
8. Each holdout passes the positive visual requirements in section 8.8 and is not merely a fixture, wireframe or styled document.
9. Each holdout has a working primary journey on mobile and desktop.
10. Browser checks pass for links, console, overflow and accessibility.
11. Reduced-motion and no-JavaScript content visibility pass where relevant.
12. Factual and asset integrity pass.
13. Conditional capabilities have focused route or fixture proof.
14. Relevant repository, package and runtime tests are green.
15. The working tree is clean and the release-candidate commits are identifiable.
16. The final report lists commands, results, desktop and mobile screenshots, motion proof where relevant, known limitations and the diff from `main`.
17. Magnus explicitly approves the rendered visual evidence for all three holdouts.

The only permitted terminal outcomes are:

```text
RELEASE_CANDIDATE_READY: YES
```

or:

```text
RELEASE_CANDIDATE_READY: NO
BLOCKED_BY: <specific blocker that cannot be resolved within scope>
```

“Next step is …” is not an exit state.

## 15. Publication and release gates

Passing the RC gate does not automatically merge or release the work.

### Publication gate

- push the isolated rebuild branch after Magnus’ approval;
- open one new draft pull request against `main`;
- do not extend or merge the three historical v3 PRs;
- require GitHub CI to reproduce the local gates;
- ensure the PR diff contains product, tests and necessary documentation without generated research noise.

### Merge gate

- GitHub CI is green;
- the draft PR has no unresolved release blocker;
- the installed package is reproduced from the PR head;
- final screenshots and limitations are reviewed;
- Magnus explicitly approves merge and release positioning.

## 16. Success measures

### Release-candidate success

- binary RC exit gate passes;
- three end-to-end holdouts complete;
- source coverage 19/19;
- clean installation succeeds;
- no critical browser or journey defect;
- no fabricated factual content;
- no obvious common SiteSmith house style across holdouts.

### Post-release product measures

- successful installs and first completed website;
- time from brief to verified output;
- manual correction required after SiteSmith delivery;
- share of builds completing browser verification;
- reported installation and adapter failures;
- community adoption, contributors, stars and real project showcases.

GitHub stars are an adoption indicator, not proof of website quality.

## 17. Current state and execution path

Current evidence indicates:

- the rebuild exists locally as 64 commits with a clean working tree and has not been pushed;
- source coverage reports 19 of 19 concrete contributions;
- repository, package, runtime and clean-install gates pass according to the S17 report;
- three holdouts were built: klokkestøberi, sejlmager and kalkværk;
- the rendered holdouts fail the positive visual standard: they appear as sparse fixtures with weak art direction, insufficient assets, limited composition and a shared SiteSmith house style;
- automated genericness and structural gates produced a false sense of completion;
- previous source integration, research and architecture exploration remain frozen;
- the release-candidate verdict is therefore `NO` until the visual product capability is proven.

The remaining path is:

```text
FREEZE THE 19/19 INTEGRATION BASELINE
→ CORRECT THE DESIGN WORKFLOW ON ONE MARKETING / EXPERIENCE PILOT
→ MAGNUS VISUAL REVIEW
→ IF APPROVED, REBUILD THE E-COMMERCE AND PRODUCT-UI HOLDOUTS
→ RUN ALL TECHNICAL AND BROWSER GATES
→ MAGNUS REVIEWS ALL THREE RENDERED RESULTS
→ RELEASE-CANDIDATE VERDICT
→ APPROVED PUSH AND DRAFT PR
→ CI
→ MERGE DECISION
```

## 18. Scope-control rule

No new capability, research programme, benchmark tournament or architecture layer may enter v3 RC unless it is required to satisfy an existing PRD requirement or resolve a concrete blocker.

If two consecutive actions do not change product code, a required test, an identified blocker or a binding product decision, the execution loop must stop and report the drift.

This PRD is the product source of truth. Agent prompts and implementation plans may decide how to fulfil it, but may not silently redefine the product or its exit gate.
