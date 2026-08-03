---
title: taste-skill — Failure Modes
ai_generated: "(C)"
---

# Where it breaks, degrades, or produces sameness

## 1. The dial system is a lookup table wearing reasoning's clothes
`skills/taste-skill/SKILL.md:54-75` (§1.A, §1.B) maps vibe words and use-case names directly to numeric ranges — "minimalist / clean / calm / editorial / Linear-style" → variance 5-6, motion 3-4, density 2-3, no exceptions shown. Two unrelated briefs that both use the word "minimalist" get pulled toward the identical three numbers. This is precisely the "deterministic rules generator" side of the C-no-mechanical-creativity axis, sitting inside the same file that also contains the best example of the opposite (the design read). The pre-flight checklist (`:917`) asks "dial values explicit and reasoned... not silently using baseline?" but has no way to check whether the number came from genuine reasoning or the table two pages earlier.

## 2. "Rotate, don't repeat" claims memory a stateless skill file cannot have
The premium-consumer palette ban (`:192-207`) and the serif rotation pool (`:181`) both instruct: "if the previous project used X, this one must use a different family," and "do not reuse the same serif across consecutive projects." A `SKILL.md` loaded fresh into a new conversation has no record of what the "previous project" used — this instruction is unenforceable as written unless an external system tracks project history and injects it, which nothing in this repo does. It is a good idea with no supporting mechanism.

## 3. Three fixed-template skills reproduce the exact convergence problem the brief warns about
`soft-skill`, `minimalist-skill`, and `brutalist-skill` (98/85/92 lines) each hardcode a complete palette, type stack, and component system with no design-read step at all — `minimalist-skill` fixes `#EAEAEA` borders and four named pastel accents outright (`skills/minimalist-skill/SKILL.md:33-40`), `gpt-tasteskill` fixes a literal `#f9fafb` background with no override clause (`skills/gpt-tasteskill/SKILL.md:197`). Any set of projects built with the same one of these skills will share borders, radii, and palette by construction — this is a smaller-scale version of the "three sites converged on five shared moves" problem this repo's own memory already documents for the pre-v2 skill. See `MECHANISMS.json:fixed-aesthetic-template-skills`.

## 4. A fabricated "Python RNG" step that cannot do what it claims
`gpt-tasteskill` (`skills/gpt-tasteskill/SKILL.md:13-20`) asks the model to narrate a mock Python execution and treat the narration as real randomization. No code actually runs; the model is fabricating plausible-looking output and then trusting its own fabrication. This cannot decorrelate outputs across separate conversations (no shared seed state exists across calls) and adds token cost for zero actual signal. It is the single clearest instance in this repo of moving a creative decision into a (fake) script instead of making the model think — exactly what the C-no-mechanical-creativity brief measured as the losing side (40 vs. 59).

## 5. Zero real verification anywhere in the repo
There is no `verify.mjs` equivalent, no axe/Lighthouse automation, no screenshot pipeline. `scripts/*.mjs` only convert README banner images to webp (`scripts/convert-readme-assets-webp.mjs:1-20`); `skill.sh` is a bash associative-array path lookup for `npx`-style invocation, not a test runner (`skill.sh:1-25`). Every claim of verification in the skill content itself — "Run Lighthouse before declaring a page done" (`:541`), "test in both modes before finishing" (`:590`), the entire 70-item pre-flight checklist (`:910-979`) — is a *prompt instruction telling the model to say it did this*, not an automated check. See `TESTING.md`.

## 6. Self-grading checklists have no independent critic and no defined stop condition beyond "honestly ticked"
The flagship's pre-flight check (`:910-979`), `gpt-tasteskill`'s pre-output checklist (`skills/gpt-tasteskill/SKILL.md:86-98`), and `image-to-code-skill`'s clarity check (`skills/image-to-code-skill/SKILL.md:1083-1109`) are all single-pass, same-model self-report. None define a second agent, an adversarial reviewer, or a maximum/minimum iteration count. "If a single checkbox cannot be honestly ticked, the page is not done" (`:979`) puts all the enforcement weight on the word "honestly," which is not a mechanism. See `LOOPS.md`.

## 7. Uncited research used to justify unrelated rules
`research/laziness/findings/references.md` cites five "studies" (LazyBench, a "2025 Controlled Laziness Experiments" paper, a "Winter Break Hypothesis") with no links, no locatable authors, and precise percentage claims (+45%, +115%, 34%→80%) that cannot be traced from the repo alone. This backs `output-skill`, which is otherwise a reasonable, low-risk mechanism — but the citation apparatus around it is decoration, not evidence. See `TESTING.md`.

## 8. The Block Library is a schema with nothing behind it
Section 12 (`:835-893`) defines a detailed frontmatter and body-section contract for implementing named patterns from the Reference Vocabulary (§10) as real code blocks — but zero blocks exist in the repo (`find ... -type f` shows no `blocks/` directory at all). The Reference Vocabulary itself is therefore closer to a glossary of names the model is told to "know" and "reach for" than a library of proven implementations, apart from the two GSAP skeletons in §5.A/5.B, which are the only patterns actually instantiated.

## 9. Enterprise-scale rule volume risks the exact failure it's trying to prevent
Sections 4 and 9 alone are roughly 540 lines of enumerated banned patterns, specific hex codes, specific font names, and specific phrase blocklists. At a large enough count, reciting-and-complying-with a long enumerated list becomes functionally the same behavior as executing a rules engine — the file's own stated goal (make the model reason, not template) is in some tension with how much of its own bulk is enumerated rule-following rather than reasoning support.

## 10. No stack-agnostic path
Section 3 hard-defaults to React/Next.js RSC, Tailwind v4, and the Motion library, with the icon-library allowlist and dependency-verification rule all assuming an npm-based JS stack. A brief for a plain-HTML, Vue, Svelte, or server-rendered-non-JS site gets no first-class path here — the aesthetic content (§4, §9) would still transfer, but the architecture section (§3) would need to be rewritten, not adopted.
