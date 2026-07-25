# Benchmarks

Six independent sites built with sitesmith from six different briefs, plus one deliberately generic
control. Every result below was produced by the scripts in this directory, not asserted.

![Six benchmark sites and one control](results/contact-sheet.png)

## Reproduce

```bash
npm install && npx playwright install chromium
node serve.mjs 4321 .
node ../skills/sitesmith/scripts/verify.mjs http://localhost:4321/01-saas-landing/ --out results/01-saas-landing
```

Lighthouse (desktop preset, headless):

```bash
lighthouse http://localhost:4321/01-saas-landing/ --output=json --output-path=results/01-saas-landing/lighthouse.json --preset=desktop --only-categories=performance,accessibility,best-practices,seo
```

## Automated results

Measured 2026-07-25. `verify.mjs` runs axe in **both** colour schemes at 375, 768 and 1440.

| # | Site | Brief | Console | Broken links | Axe serious | Overflow | LH perf / a11y / best / SEO |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | SaaS landing | Incident review tool, B2B, technical buyers | 0 | 0 | 0 | 0 | 100 / 100 / 100 / 100 |
| 02 | Product page | Gaming PC, conversion-focused retail | 0 | 0 | 0 | 0 | 100 / 100 / 100 / 100 |
| 03 | Dashboard | Reconciliation queue, data-dense product UI | 0 | 0 | 0 | 0 | 100 / 100 / 100 / 100 |
| 04 | Local service | Roofing company, trust-first, phone-led | 0 | 0 | 0 | 0 | 100 / 100 / 100 / 100 |
| 05 | Editorial | Sound designer portfolio, typographic | 0 | 0 | 0 | 0 | 100 / 100 / 100 / 100 |
| 06 | Redesign, after | Rota software, rebuilt from the control | 0 | 0 | 0 | 0 | 100 / 100 / 100 / 100 |
| — | **Control, before** | The same product, built the default way | 0 | **8** | **2** | **1** | 100 / **81** / **96** / **90** |

## The control

`06-redesign/before/` is the baseline: the page a model produces when nothing steers it. It was
written to exhibit the patterns sitesmith exists to catch, and it is **not** to be fixed — it is the
measurement. Its defects, all intentional:

1. Purple-to-blue gradient hero with two blurred orbs, centred, no other palette decision made.
2. Three equal feature cards with emoji icons and pill "New" / "Beta" badges.
3. Fabricated proof: "10,000+ Happy Customers", "99.99% Uptime", "50% Time Saved", "4.9/5".
4. Three invented testimonials from Jane Smith at Acme Corp, John Doe at Nexus, Sarah Johnson at SmartFlow.
5. Copy built from "Unlock Your Potential", "seamless", "next-gen", "elevate", "game-changer".
6. `*:focus{outline:none}` — keyboard navigation made invisible.
7. Grey-on-white body text at 2.53:1, well under AA.
8. Eight `href="#"` links that go nowhere.
9. Fixed three-column grids that overflow at 375px.
10. Glassmorphism on the buttons for no functional reason.

`06-redesign/after/` is the same product, same content areas, rebuilt against
`references/06-redesign-audit.md`. The delta in the table above is what the skill changed.

## Design rubric

Scored 1–5 by inspection of the 1440 screenshots. The rubric is in
`references/06-redesign-audit.md`; this is the same one the skill applies to its own output.

| | 01 | 02 | 03 | 04 | 05 | 06 after | Control |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hierarchy | 5 | 5 | 4 | 5 | 5 | 5 | 2 |
| Originality | 5 | 4 | 4 | 4 | 5 | 4 | 1 |
| Cohesion | 5 | 4 | 5 | 4 | 5 | 5 | 3 |
| Responsiveness | 5 | 5 | 4 | 5 | 5 | 5 | 1 |
| Usability (states) | 4 | 5 | 5 | 4 | 4 | 5 | 1 |
| Slop resistance | 5 | 5 | 5 | 5 | 5 | 5 | 1 |

**Template test:** the six do not share a layout. Left-aligned editorial split; two-column commerce
with a sticky purchase panel; top-nav dashboard with a stat rail and a scrollable table; a numbered
price list under a split hero; a ruled typographic index; and a numbered process under a rota
fragment. No bento grid, no three-card feature row, no centred hero anywhere in the set.

## What the loop actually caught

These were found by `verify.mjs` in work that looked finished in the editor, and fixed before the
results above:

| Site | Defect | Why code review would have missed it |
| --- | --- | --- |
| 01 | +55px horizontal overflow at 375px | An inline `style="display:contents"` silently beat the `display:none` media query hiding the nav |
| 01 | `--ink-3` at 4.37:1 | Looks fine; fails AA by 0.13 |
| 02 | `--ink-3` at 4.00:1 dark, 4.37:1 light | Two schemes, two different failures |
| 02 | Status green at 1.87:1 in light mode | The colour was only ever chosen against the dark background |
| 03 | White label on the dark-mode teal button, 1.83:1 | The light-mode value was hardcoded |
| 03 | Scrollable table unreachable by keyboard | Nothing visually wrong at any width |
| 05 | `--ink-3` at 4.29:1 in dark mode only | Light mode passed |

Seven real defects across five sites. All of them ship if the process stops at "the code compiles".

## Limitations

- The pages use system font stacks. The measurement environment has no network, so no webfont is
  downloaded. A real build would self-host a typeface with more character.
- Images are labelled placeholders. No stock photography was invented or implied.
- All companies, products, people and figures are fictional and marked as such on every page. The
  frame-rate table in `02` carries an explicit note that its numbers are illustrative.
- Lighthouse runs against a local static server, so performance scores reflect the pages, not a
  production network. The accessibility, best-practices and SEO scores are the meaningful ones here.
- The rubric scores are one reviewer's judgement. The automated columns are not.

## Cross-platform note

The dashboard passed on Windows and failed in CI on Linux with a **+10px horizontal overflow at
375px**. The first guess — three action buttons in a non-wrapping flex row — was wrong, and the
second CI run failed identically.

The real cause was subtler. The navigation tabs were flex items with `white-space: nowrap`. Under a
wider font they shrank below their content width and let the *text* spill, so no element's bounding
box exceeded the viewport while `documentElement.scrollWidth` still did. An element-by-element
overflow scan finds nothing; only the document-level measurement catches it.

Reproduced locally by injecting `DejaVu Sans` and re-measuring — exactly +10px. Fixed with
`min-width: 0` plus `overflow: hidden` on the tab row, and by dropping to a single visible tab below
600px. All six sites now pass at 375 and 768 under both the system stack and a deliberately wide one.

This is why CI runs the same script on a different platform. A layout that depends on the width of
the developer's system font is not responsive — it is lucky.
