#!/usr/bin/env node
/**
 * The signature veto, on two pages built to make it fire and not fire. Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node scripts/test-signature-veto.mjs
 *
 * `judge()` has carried SIGNATURE_ARC and SIGNATURE_DELTA since round four, and `measure()`
 * returned no signature colour, so `hueOf(undefined)` was null and both were inert on every
 * run that has ever happened. The report listed the check as having run. A comment beside
 * the veto asserted the hole was closed.
 *
 * So this file does not test that a field exists. It renders two pages, measures them, and
 * asks the veto for a verdict: one page whose signature is the same material as a record
 * already in the ledger and must be refused, one whose signature is a different material and
 * must not be. If the measurement ever goes missing again, the first case turns green, which
 * is the failure this file is here to make loud.
 */

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { measure, fingerprintOf, judge, parseDirection } from './ledger.mjs'

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}

/* One page shape, three colours. Ground and accent are held identical across every fixture
   so nothing but the signature can move the verdict: a test where two things differ cannot
   say which one the veto answered. */
const page = ({ signature }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Bench</title>
<style>
  body { background: #f2eee3; color: #241f18; font-family: Georgia, serif; margin: 0; }
  main { padding: 48px; }
  h1 { font-family: Georgia, serif; font-size: 44px; margin: 0 0 24px; }
  .note { color: rgb(176, 42, 28); font-weight: 700; }
  .gauge { width: 640px; height: 180px; background: ${signature}; }
</style></head>
<body><main>
  <h1>Bench notes</h1>
  <p class="note">One sentence the page wants read.</p>
  <div class="gauge" aria-hidden="true"></div>
  <p>Body text so the page is not only a coloured box.</p>
</main></body></html>`

const record = (selector) => `# Direction record

## Signature

The gauge, as \`${selector}\`, a band whose width encodes the reading.
`

const dir = mkdtempSync(join(tmpdir(), 'sitesmith-sigveto-'))
const render = async (name, signature, selector = '.gauge') => {
  const file = join(dir, `${name}.html`)
  writeFileSync(file, page({ signature }), 'utf8')
  const sel = parseDirection(record(selector)).signatureSelector
  return { raw: await measure(file, { signature: sel }), sel }
}

console.log('\n  the signature veto, on pages built to move it\n')

try {
  const { raw: base, sel } = await render('base', 'rgb(20, 90, 140)')
  check('the record\'s selector is read out of its own Signature section', sel === '.gauge', `got ${sel}`)
  check('the signature element is found on the page', base.signatureMatches === 1, `matched ${base.signatureMatches}`)
  check('and its colour is measured, which is what was missing',
    base.signatureColor !== null && base.signatureColor !== undefined, `got ${base.signatureColor}`)

  const first = fingerprintOf(base)
  check('so the fingerprint carries a signature hue', first.signatureHue !== null, `got ${first.signatureHue}`)

  /* The ledger this page is judged against: one earlier render, same everything, so the only
     thing a verdict can be about is the signature. */
  const priorOf = (f) => [{ v: 1, when: '2026-01-01T00:00:00.000Z', id: 'earlier', fingerprint: f, waived: false }]
  const prior = priorOf(first)

  /* MUST FIRE. A different page whose signature is the same material, two degrees away. The
     hard-coded arc is 30 degrees and the delta 16, so this is well inside both. */
  const near = await render('near', 'rgb(22, 88, 146)')
  const nearPrint = fingerprintOf(near.raw)
  const nearVerdict = judge({ fingerprint: nearPrint, ledger: prior, selfId: 'near' })
  const nearReasons = JSON.stringify(nearVerdict)
  check('a signature two degrees from one already in the ledger is refused',
    /signature/i.test(nearReasons), `hue ${first.signatureHue} then ${nearPrint.signatureHue}\n          ${nearReasons.slice(0, 300)}`)

  /* MUST NOT FIRE. The same page with a signature from the other side of the wheel. If this
     one is also refused, the veto is not measuring the signature, it is refusing everything. */
  const far = await render('far', 'rgb(150, 120, 20)')
  const farPrint = fingerprintOf(far.raw)
  const farVerdict = judge({ fingerprint: farPrint, ledger: prior, selfId: 'far' })
  check('a signature from a different material is not refused for its signature',
    !/signature/i.test(JSON.stringify(farVerdict)),
    `hue ${first.signatureHue} then ${farPrint.signatureHue}\n          ${JSON.stringify(farVerdict).slice(0, 300)}`)

  /* The two states that both produce a null colour and are not the same thing. A record with
     no selector is a record that has not said what it built; a selector matching nothing is a
     record that said, and was wrong. */
  const noSelector = await measure(join(dir, 'base.html'), {})
  check('a page measured with no selector reports no signature colour and says so',
    noSelector.signatureColor === null && noSelector.signatureSelector === null
    && noSelector.signatureMatches === null,
    JSON.stringify({ c: noSelector.signatureColor, s: noSelector.signatureSelector, m: noSelector.signatureMatches }))

  const missing = await measure(join(dir, 'base.html'), { signature: '.not-on-this-page' })
  check('a selector that matches nothing is told apart from having no selector',
    missing.signatureColor === null && missing.signatureSelector === '.not-on-this-page'
    && missing.signatureMatches === 0,
    JSON.stringify({ c: missing.signatureColor, s: missing.signatureSelector, m: missing.signatureMatches }))

  /* A selector the browser cannot parse must not take the whole measurement down with it. */
  const broken = await measure(join(dir, 'base.html'), { signature: 'div:::' })
  check('an unparseable selector leaves the rest of the measurement intact',
    broken.signatureColor === null && typeof broken.luminance === 'number',
    JSON.stringify({ c: broken.signatureColor, lum: broken.luminance }))
} finally {
  rmSync(dir, { recursive: true, force: true })
}

console.log(`\n  ${failed ? `${failed} failing` : 'the veto fires on a repeat and stays quiet on a difference'}\n`)
process.exit(failed ? 1 : 0)
