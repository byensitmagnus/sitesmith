# sitesmith

**A coding-agent skill for building websites that don't look AI-generated.**

Most design skills are a list of rules. This one is a loop: it routes by what you're actually doing,
picks a direction before it picks colours, and then **renders the page and measures it** instead of
stopping when the code compiles.

![Six benchmark sites and one control](benchmarks/results/contact-sheet.png)

Six sites, six briefs, one skill. The seventh is the control — the page you get when nothing steers
the model. [Full results and how to reproduce them.](benchmarks/README.md)

---

## The problem

Ask any coding agent for a landing page and you get the same page: a purple-to-blue gradient hero,
centred, two blurred orbs, three equal feature cards with emoji icons, "Unlock Your Potential", four
fabricated statistics and three testimonials from Jane Smith at Acme Corp. It scores well in a diff
and badly in a browser.

Three things cause it, and rule lists only fix the first:

1. **No direction was chosen.** The model reached for a default because nothing told it not to.
2. **The result was never looked at.** Contrast failures, mobile overflow and dead keyboard paths are
   invisible in source.
3. **Rules fire in the wrong context.** A dashboard doesn't want a cinematic hero; a portfolio doesn't
   want a settings panel.

## What sitesmith does about it

**Routes first.** New build, redesign, single component, audit, or product UI — each takes a
different path with different governing rules. Marketing pages are governed by three dials
(variance, motion, density). Product UI is governed by the UX rules. They don't mix.

**Commits to a direction before writing CSS.** One line, stated out loud: *"Reading this as: B2B SaaS
landing for technical buyers, with a Linear-style minimalist language, leaning toward Tailwind +
restrained motion."* Everything downstream follows from that sentence.

**Renders and measures.** A bundled Playwright script screenshots at 375/768/1440, runs axe in
**both** colour schemes, collects console errors, checks every link and detects horizontal overflow.
Step 11 of the build process is *look at the screenshots*.

**Treats anti-slop as judgement, not a ban list.** A purple gradient is slop when it's the accent
because no palette was chosen. It's correct when it's the brand. The skill distinguishes the two —
it will never reject your brand colour for being purple.

## What the loop caught

These were found in work that looked finished in the editor, while building the benchmarks:

| Defect | Why review missed it |
| --- | --- |
| +55px horizontal overflow at 375px | An inline `style="display:contents"` silently beat the `display:none` media query |
| Body text at 4.37:1 | Looks fine. Fails AA by 0.13 |
| Status green at 1.87:1 in light mode | The colour was only ever chosen against the dark background |
| White button label at 1.83:1 in dark mode | The light-mode value was hardcoded |
| Scrollable table unreachable by keyboard | Nothing visually wrong at any width |

Seven real defects across five sites. Every one ships if the process stops at "the code compiles".

## Results

Measured, not asserted. [Method and raw reports.](benchmarks/README.md)

| | Console | Broken links | Axe serious | Mobile overflow | Lighthouse a11y |
| --- | --- | --- | --- | --- | --- |
| Six sitesmith builds | 0 | 0 | 0 | 0 | 100 |
| Control (no skill) | 0 | 8 | 2 | 1 | 81 |

## Install

**Claude Code**

```bash
claude plugin marketplace add byensitmagnus/sitesmith
claude plugin install sitesmith@sitesmith
```

**Any agent that reads `~/.claude/skills` or `~/.agents/skills`** (Codex, Grok, Cursor and others)

```bash
git clone https://github.com/byensitmagnus/sitesmith.git
cp -r sitesmith/skills/sitesmith ~/.claude/skills/
```

**Optional — the verification script**

```bash
npm i -D playwright @axe-core/playwright && npx playwright install chromium
```

Without it the skill still works; steps 10–11 become a manual browser check. Without Python 3.10+
the palette search degrades to choosing by hand from the reference files.

## Use it

Just ask. The skill triggers on its own.

```
Build a landing page for a company that does flat-roof repair in Sheffield.
```
```
This dashboard looks generic. Audit it and fix what you find.
```
```
Redesign this page, but keep the framework and the brand colours.
```
```
Build a pricing table. Three tiers, one recommended.
```

## What's inside

```
skills/sitesmith/
  SKILL.md                  206 lines — routing, the 12-step loop, precedence, anti-slop
  references/               11 files — opened on demand, never preloaded
    01-brief-and-dials      direction, dials, choosing a real design system
    03-design-engineering   type, colour, layout, materiality, states, content
    05-ai-tells             the full tell list
    06-redesign-audit       8 passes, repair order, scoring rubric
    07-ux-rules             a11y, forms, navigation, charts, checklists
    impeccable/             35 files — one per command verb
  data/                     31 CSV datasets — 161 palettes, 57 font pairings, 50+ styles
  scripts/
    search.py               query the datasets
    verify.mjs              screenshot, axe both schemes, links, console, overflow
benchmarks/                 six sites, one control, all measurements
```

`SKILL.md` stays under 500 lines on purpose. References are one hop away and load only when the
current step needs them.

## Credit

sitesmith is a composition. The design knowledge comes from four openly licensed projects,
reproduced without modification and credited in [NOTICE.md](NOTICE.md):

- **[taste-skill](https://github.com/Leonxlnx/taste-skill)** (MIT) — brief inference, dials, AI tells, motion, blocks
- **[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** (MIT) — the datasets, the search engine, the UX rules
- **[frontend-design](https://github.com/anthropics/claude-plugins-official)** (Apache 2.0, Anthropic) — aesthetic ambition
- **[impeccable](https://github.com/pbakaus/impeccable)** (Apache 2.0) — the command vocabulary

If sitesmith is useful, those four are why. Star them too.

Two further sources were evaluated and **rejected** as non-redistributable — one had no license, one
had no traceable author. Their material was replaced with originally written equivalents. The
reasoning is in [LICENSE-AUDIT.md](LICENSE-AUDIT.md).

Original to this repo, MIT: `SKILL.md`, `06-redesign-audit.md`, `10-setup.md`, `verify.mjs`, the
benchmarks and the docs.

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md). The short version: a rule that can't be demonstrated on a
rendered page doesn't belong in the skill.

## License

[MIT](LICENSE) for our own work; bundled material keeps its original license. See
[NOTICE.md](NOTICE.md).
