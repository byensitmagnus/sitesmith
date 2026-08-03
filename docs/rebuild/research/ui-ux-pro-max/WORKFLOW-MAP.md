---
title: "UI/UX Pro Max — Workflow Map"
ai_generated: "(C)"
---

Step order a run actually takes, per `SKILL.md` (`.claude/skills/ui-ux-pro-max/SKILL.md`), driven
entirely by the host model reading instructions and shelling out to Python — there is no
orchestration code, no agent, no loop inside the skill itself.

1. **Trigger** — host model's own judgement matches the task against the plugin `description`
   frontmatter (`SKILL.md:3`). No keyword gate, no manifest check.

2. **Step 1 — Analyze User Requirements** (`SKILL.md:49-55`, prose only, no script). Model is told
   to extract product type, audience, style keywords, and **detect the stack** from
   `package.json`/`pubspec.yaml`/`*.xcodeproj`/`composer.json`/React Native markers. Explicit
   instruction: *"Never assume a stack"* — ask the user or default to `html-tailwind` only if
   nothing is detectable (`SKILL.md:55`).

3. **Step 2 — `--design-system`** (`SKILL.md:57-70`) → shells out to
   `scripts/search.py "<query>" --design-system` → `design_system.py:generate_design_system()` →
   `DesignSystemGenerator.generate()` (`design_system.py:207-329`). This is the one call that
   matters; everything downstream is optional supplementation. Internally (see `MECHANISMS.json`
   for full trace):
   a. `search(query, "product", 1)` → picks a `Product Type` row (`design_system.py:220-224`)
   b. `_apply_reasoning(category)` → look up that category in `ui-reasoning.csv`
      (`design_system.py:108-130`)
   c. `_multi_domain_search()` → parallel BM25 lookups against style/color/landing/typography CSVs,
      style query boosted by the reasoning row's `Style_Priority` keywords
      (`design_system.py:95-106`)
   d. `_select_best_match()` picks one style row by keyword score (`design_system.py:166-201`)
   e. Optional `--variance/--motion/--density` dials re-weight step (c)'s style query or splice in
      a `motion.csv` snippet or override the spacing-scale dict — pure post-hoc biasing, no new
      retrieval logic (`design_system.py:46-77`, `230-262`)
   f. Result dict rendered to ASCII box (default), Markdown, or JSON
      (`format_ascii_box`/`format_markdown`, `design_system.py:365-664`)

4. **Step 2b — optional persistence** (`SKILL.md:72-86`) → `--persist --output-dir <root>` writes
   `design-system/<slug>/MASTER.md` (+ optional `pages/<page>.md` override). Guarded by an
   exists-check: skips silently (structured `status: "skipped_exists"`) unless `--force`
   (`design_system.py:751-762`).

5. **Step 3 — supplemental single-domain searches** (`SKILL.md:116-137`) → same `search.py`, one
   domain at a time (`style`, `color`, `typography`, `google-fonts`, `chart`, `ux`, `landing`,
   `icons`, `gsap`, `react`, `web`), auto-detected via keyword-overlap scoring if `--domain` is
   omitted (`core.py:detect_domain`, line 377-408).

6. **Step 4 — stack guidelines** (`SKILL.md:139-145`) → `search_stack(query, stack)` against
   `data/stacks/<stack>.csv` (22 stacks, same BM25 engine, `core.py:442-464`).

7. **Zero-result handling** (`SKILL.md:149-154`, enforced in `search.py:64-74`) — explicit
   instruction not to fabricate; retry once, then say plainly the recommendation is a built-in
   default rather than a database hit. `_suggest_terms()` (`core.py:292-316`) offers nearest
   vocabulary terms by prefix match so the model can retry with better keywords.

8. **Pre-delivery gate** (`SKILL.md:194-196`) — for native/mobile UI, read
   `references/pro-rules.md` and its "canonical Pre-Delivery Checklist" before calling anything
   done. Purely textual; nothing runs it automatically.

No step in this list touches a browser, a screenshot, or a critique loop — that only exists in the
sibling `stack/` starter repo (see `LOOPS.md`), which `ui-ux-pro-max` itself does not invoke.
