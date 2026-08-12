# Reproducing the four findings

Nothing here needs a model. Every finding is a measurement on a build that is in this folder.

## Serving both builds

Each build needs its dependencies and a production build. Node 24, npm reachable.

```bash
cd docs/lab/rendered-pilot-02-damgaard/builds/S && npm install && npm run build && npx next start -p 3518
```

```bash
cd docs/lab/rendered-pilot-02-damgaard/builds/P && npm install && npm run build && npx next start -p 3517
```

`package-lock.json` is frozen for both, so the dependency tree is the one that was measured.
`node_modules` and `.next` were left out on purpose: both regenerate from what is here.

## The whole check, both arms

```bash
cd docs/lab/rendered-pilot-02-damgaard/instrument && node check.mjs http://localhost:3518 S
```

Compare against `checks/S.json` and `checks/P.json`. The checker resolves Playwright and axe
from `benchmarks/node_modules`, and imports the product's own `clipping.mjs` so the two cannot
drift apart about what "clipped" means.

Expected: S 6 axe violations and P 0; everything else level; both arms 4 of 4 on the journey.

## D-A — the clipping check cannot see SVG text

The judge's headline visual complaint. The text is complete in the DOM and cut on screen.

```bash
curl -s http://localhost:3518/ | grep -o "kernemåling tages[^<]\{0,40\}"
```

That prints `kernemåling tages her`. What renders is `kernemåling tages h`, because the
`<text>` node runs past its `<svg>`, which clips:

```js
// in the page, at 1440
for (const t of document.querySelectorAll('svg text')) {
  const s = t.ownerSVGElement.getBoundingClientRect(), b = t.getBoundingClientRect()
  if (b.right > s.right) console.log(t.textContent, Math.round(b.right - s.right), getComputedStyle(t.ownerSVGElement).overflow)
}
// dybde: kernemåling tages her   16   hidden
```

Now run the product's own measurement over the same page and watch it return nothing:
`skills/sitesmith-v3/scripts/clipping.mjs` walks a fixed list of HTML tags. `svg` and `text`
are not on it.

## D-B — verification never renders a page the entry does not link to

```bash
curl -s http://localhost:3518/ | grep -c kvittering        # 0 — nothing links there
curl -s http://localhost:3518/kvittering | grep -o "<dl[^>]*>.\{0,80\}"
```

The second prints `<dl class="instrument-readout"><li><dt>Pris</dt>…` — an `<li>` inside a
`<dl>`, which is what axe reports as `dlitem` and `listitem`, 6 serious violations across the
three widths. `builds/S/PRODUCTION-REPORT.md` records the same run finishing at 0 axe
violations, because the receipt is reachable only by completing the booking and the product
walks the site from its entry.

`instrument/check.mjs` catches it only because of the line that adds whatever page the journey
ends on to the set of pages the static checks run over.

## D-C — two sibling skill trees named for the product

```bash
ls skills/                                   # sitesmith  sitesmith-v3
grep -n "legacy-v2" bin/sitesmith.mjs        # the flag that reaches the first one
```

`skills/sitesmith/` is legacy v2 and is reachable only behind that flag; the default install
resolves `skills/sitesmith-v3` through `product/pipeline.json`. Arm S read the first, took it
for current, and deleted its own finished build on that premise — see `EVENTS.md`. Arm P read
the same tree, which is what `CONTAMINATION.md` is about.

## D-D — nothing measures text that runs together

```js
// in the page, at 1440
const small = document.querySelector('header small')
const r = document.createRange()
r.selectNodeContents([...small.parentElement.childNodes].find((n) => n.nodeType === 3))
console.log(Math.round(small.getBoundingClientRect().left - r.getBoundingClientRect().right))
// 0
```

`<a class="wordmark">Damgaard Estrik<small>Udtørring og estrik, Lemvig</small></a>`,
`display: flex`, `gap: normal`. The masthead reads `Damgaard EstrikUdtørring og estrik, Lemvig`
on every page at every width. `gate.mjs` ran six iterations, from 51 refused defects to 0, and
did not look for it.
