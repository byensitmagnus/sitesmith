#!/usr/bin/env node
/**
 * The accent measurement, against a page carrying a decoy. Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node scripts/test-accent-measure.mjs
 *
 * `measure()` took the most saturated colour on any descendant of `body`, and its own comment
 * claimed the result was "weighted by how much of the first screen it covers". Nothing
 * weighted anything. A one-pixel span far below the fold beat a band of colour filling the
 * first screen, and every colour veto downstream then compared the wrong colour.
 *
 * Every page here is the same page with one thing moved, so a verdict can only be about the
 * accent. The last case is the control that stops the fix going too far: the fix must not
 * turn the biggest neutral area into the accent.
 */

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { measure } from './ledger.mjs'

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}

/* rgb(176, 42, 28) is the real accent: saturation 0.72, 240 by 64, high on the page.
   rgb(255, 0, 255) is the decoy: saturation 1.0, and as small or as far away as each case
   needs. On the old code the decoy wins every time, because only saturation was read. */
const ACCENT = 'rgb(176, 42, 28)'
const DECOY = 'rgb(255, 0, 255)'

const page = (decoy) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Bench</title>
<style>
  body { background: #f2eee3; color: #241f18; font-family: Georgia, serif; margin: 0; }
  main { padding: 48px; }
  h1 { font-size: 44px; margin: 0 0 24px; }
  .accent { width: 240px; height: 64px; background: ${ACCENT}; }
  .slab { width: 1200px; height: 600px; background: rgb(214, 210, 202); margin-top: 24px; }
  .decoy { position: absolute; background: ${DECOY}; }
</style></head>
<body><main>
  <h1>Bench notes</h1>
  <div class="accent" aria-hidden="true"></div>
  <p>Body text so the page is not only coloured boxes.</p>
  <div class="slab" aria-hidden="true"></div>
  ${decoy}
</main></body></html>`

const dir = mkdtempSync(join(tmpdir(), 'sitesmith-accent-'))
const shot = async (name, decoy) => {
  const file = join(dir, `${name}.html`)
  writeFileSync(file, page(decoy), 'utf8')
  return measure(file)
}
const is = (got, want) => String(got).replace(/\s/g, '') === String(want).replace(/\s/g, '')

console.log('\n  the accent measurement, against a decoy\n')

try {
  /* 1. One pixel, below the fold. The documented case. */
  const below = await shot('below', '<span class="decoy" style="top:4000px;left:0;width:1px;height:1px"></span>')
  check('a 1x1 pixel below the first screen is not the accent',
    is(below.accentColor, ACCENT), `chose ${below.accentColor}, wanted ${ACCENT}`)

  /* 2. One pixel, inside the first screen. Visible and still not a design element. */
  const tiny = await shot('tiny', '<span class="decoy" style="top:8px;left:8px;width:1px;height:1px"></span>')
  check('a 1x1 pixel inside the first screen is not the accent either',
    is(tiny.accentColor, ACCENT), `chose ${tiny.accentColor}, wanted ${ACCENT}`)

  /* 3. Zero visible area, by any means. display:none, and an element scrolled off the side. */
  const hidden = await shot('hidden', '<span class="decoy" style="display:none;width:400px;height:200px"></span>')
  check('a hidden element of any size is not the accent',
    is(hidden.accentColor, ACCENT), `chose ${hidden.accentColor}, wanted ${ACCENT}`)

  const offside = await shot('offside', '<span class="decoy" style="top:100px;left:-500px;width:400px;height:200px"></span>')
  check('an element parked off the left edge is not the accent',
    is(offside.accentColor, ACCENT), `chose ${offside.accentColor}, wanted ${ACCENT}`)

  /* 4. The same colour, at a size a designer would actually use. It must win: the fix is
        about visible area, not about refusing magenta. */
  const real = await shot('real', '<span class="decoy" style="top:100px;left:600px;width:300px;height:120px"></span>')
  check('the same colour at a real size does become the accent',
    is(real.accentColor, DECOY), `chose ${real.accentColor}, wanted ${DECOY}`)

  /* 5. The control on the other side. The slab is 1200 by 600, far larger than anything else
        on the page, and neutral. Coverage must not be able to promote it. */
  const none = await shot('none', '')
  check('the largest area on the page, being neutral, is not the accent',
    is(none.accentColor, ACCENT), `chose ${none.accentColor}, wanted ${ACCENT}`)

  /* 6. A page with nothing saturated at all reports no accent rather than the least grey
        thing it could find. */
  const bare = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>x</title>
<style>body{background:#f2eee3;color:#241f18;margin:0}.slab{width:1200px;height:600px;background:rgb(214,210,202)}</style>
</head><body><main><h1>Bench notes</h1><div class="slab"></div></main></body></html>`
  const bareFile = join(dir, 'bare.html')
  writeFileSync(bareFile, bare, 'utf8')
  const nothing = await measure(bareFile)
  check('a page with no saturated colour reports no accent',
    nothing.accentColor === null, `chose ${nothing.accentColor}`)
} finally {
  rmSync(dir, { recursive: true, force: true })
}

console.log(`\n  ${failed ? `${failed} failing` : 'the accent is the colour the page actually shows'}\n`)
process.exit(failed ? 1 : 0)
