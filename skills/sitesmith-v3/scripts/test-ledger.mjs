#!/usr/bin/env node
// The test of the ledger.
//
// A gate that cannot fail is decoration, and a gate that cannot pass is noise. Every case
// below fixes its expected exit code before the run, so neither of those can be true
// quietly. The two that matter most are the pair on the same measurement: distinct.json
// passes against an absent ledger and is vetoed against a ledger that already holds that
// shape, which is the whole claim of the tool in one input.
//
//   node skills/sitesmith-v3/scripts/test-ledger.mjs
//
// Exit codes under test: 0 passed, 1 refused, 2 bad invocation, 3 verdict withheld.

import { spawnSync } from 'node:child_process'
import { mkdtempSync, copyFileSync, readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..', '..')
const LEDGER = join(here, 'ledger.mjs')
const FIX = join(root, 'docs', 'rebuild', 's10', 'fixtures', 'scripts', 'ledger')
const tmp = mkdtempSync(join(tmpdir(), 'sitesmith-ledger-test-'))

const dir = (name) => join(FIX, name)
const measurement = (name) => join(FIX, 'measurements', name)
const absentLedger = join(tmp, 'absent.jsonl')

const priorCopy = (label) => {
  const to = join(tmp, `${label}.jsonl`)
  copyFileSync(join(FIX, 'ledgers', 'prior.jsonl'), to)
  return to
}

let failed = 0
const results = []

function run(args) {
  return spawnSync(process.execPath, [LEDGER, ...args], { cwd: root, encoding: 'utf8' })
}

function expect(why, args, code, alsoRequire = null) {
  const r = run(args)
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`
  let ok = r.status === code
  let extra = ''
  if (ok && alsoRequire) {
    ok = alsoRequire(out)
    if (!ok) extra = ' (exit matched, but the output check did not)'
  }
  if (!ok) failed++
  results.push(`${ok ? '  ok  ' : '  FAIL'} exit ${r.status} want ${code}${extra}  ${why}`)
  return out
}

/* the direction record */

expect('a finished record parses', ['parse', dir('complete')], 0)
expect('a runner-up block that names no thesis is refused',
  ['parse', dir('no-runner-up')], 1, (o) => /runner-up was never argued/.test(o))
expect('a runner-up case that restates the winning reason is refused',
  ['parse', dir('restated-runner-up')], 1, (o) => /restates the chosen thesis/.test(o))
expect('two Built lines are refused', ['parse', dir('two-built')], 1, (o) => /2 "Built:" lines/.test(o))
expect('theses renumbered out of the order they were written are refused',
  ['parse', dir('shuffled-theses')], 1, (o) => /must run 1 to 3/.test(o))
expect('a blank heading is refused', ['parse', dir('blank-heading')], 1, (o) => /blank heading/.test(o))

/* the veto */

expect('a shape with no measured devices passes an absent ledger',
  ['check', dir('complete'), '--measurement', measurement('distinct.json'), '--ledger', absentLedger], 0)

expect('the seed recipe trips on a clean install with no ledger file',
  ['check', dir('complete'), '--measurement', measurement('seed-recipe.json'), '--ledger', join(tmp, 'still-absent.jsonl')],
  1, (o) => /round-8/.test(o) && /absent, and the seed recipe still applies/.test(o))

expect('the same measurement is vetoed once the ledger holds that fingerprint',
  ['check', dir('complete'), '--measurement', measurement('distinct.json'), '--ledger', priorCopy('exact')],
  1, (o) => /same fingerprint/.test(o))

expect('four devices shared with one prior record is a veto',
  ['check', dir('complete'), '--measurement', measurement('four-shared.json'), '--ledger', priorCopy('four')],
  1, (o) => /4 devices are shared/.test(o))

expect('three shared devices is not',
  ['check', dir('complete'), '--measurement', measurement('three-shared.json'), '--ledger', priorCopy('three')], 0)

expect('a verbatim Brief-pinned quote waives the veto and prints the waiver',
  ['check', dir('waived'), '--measurement', measurement('seed-recipe.json'), '--ledger', join(tmp, 'waive.jsonl')],
  0, (o) => /WAIVED/.test(o) && /PRODUCTION-REPORT\.md/.test(o))

expect('an incomplete record is refused by check before any veto is considered, and cannot be waived',
  ['check', dir('blank-heading'), '--measurement', measurement('distinct.json'), '--ledger', join(tmp, 'blank.jsonl')],
  1, (o) => /the direction record is not complete/.test(o))

/* withholding */

expect('a ledger that half-parses withholds its verdict rather than reporting new',
  ['check', dir('complete'), '--measurement', measurement('distinct.json'), '--ledger', join(FIX, 'ledgers', 'corrupt.jsonl')],
  3, (o) => /withheld/.test(o) && !/passed/.test(o))

expect('no built page and no measurement withholds the verdict',
  ['check', dir('complete'), '--ledger', absentLedger], 3, (o) => /withheld/.test(o))

expect('a directory with no direction record withholds the verdict',
  ['parse', join(tmp, 'nothing-here')], 3, (o) => /withheld/.test(o))

expect('no verb is a usage error, not a pass', [], 2)

/* recording */

const commitLedger = join(tmp, 'commit.jsonl')
const commitDir = join(tmp, 'commit-surface')
mkdirSync(join(commitDir, '.sitesmith'), { recursive: true })
copyFileSync(join(dir('complete'), '.sitesmith', 'direction.md'), join(commitDir, '.sitesmith', 'direction.md'))

expect('commit appends a passing render',
  ['commit', commitDir, '--measurement', measurement('distinct.json'), '--ledger', commitLedger], 0)
expect('committing the same shape for the same surface appends nothing',
  ['commit', commitDir, '--measurement', measurement('distinct.json'), '--ledger', commitLedger],
  0, (o) => /skipped_exists/.test(o))

const lines = readFileSync(commitLedger, 'utf8').split('\n').filter(Boolean)
const onlyOne = lines.length === 1
if (!onlyOne) failed++
results.push(`${onlyOne ? '  ok  ' : '  FAIL'} ledger holds ${lines.length} line(s) after two commits of one shape`)

// The rule the ledger exists to keep: it describes a design, not a client. A path, a name
// or a URL in this file is the failure that would make the ledger unshippable.
const entry = JSON.parse(lines[0])
const clean = !/[\\/]|https?:|rigging|loft/i.test(JSON.stringify(entry))
  && ['v', 'when', 'id', 'fingerprint', 'waived'].sort().join() === Object.keys(entry).sort().join()
if (!clean) failed++
results.push(`${clean ? '  ok  ' : '  FAIL'} the stored entry carries no path, name or URL: ${JSON.stringify(entry)}`)

expect('a rerun of the same surface is not vetoed by its own committed entry',
  ['check', commitDir, '--measurement', measurement('distinct.json'), '--ledger', commitLedger], 0)

/* the template, and not overwriting it */

const newDir = join(tmp, 'new-surface')
expect('new writes a record of empty headings', ['new', newDir, 'pris og bestilling'], 0)
const first = readFileSync(join(newDir, '.sitesmith', 'direction.md'), 'utf8')
expect('a second new refuses to discard the first run\'s decisions',
  ['new', newDir, 'pris og bestilling'], 0, (o) => /skipped_exists/.test(o))
const unchanged = readFileSync(join(newDir, '.sitesmith', 'direction.md'), 'utf8') === first
if (!unchanged) failed++
results.push(`${unchanged ? '  ok  ' : '  FAIL'} the existing record was left byte-identical`)

expect('--force says what it replaced', ['new', newDir, 'pris og bestilling', '--force'],
  0, (o) => /replaced a record with/.test(o))
const kept = readdirSync(join(newDir, '.sitesmith')).filter((f) => f.startsWith('direction.replaced-'))
const keptOk = kept.length === 1 && /direction\.replaced-pris-og-bestilling-\d+\.md/.test(kept[0])
if (!keptOk) failed++
results.push(`${keptOk ? '  ok  ' : '  FAIL'} the replaced record was kept under an allowlisted slug: ${kept.join(', ') || 'none'}`)

// The template must never carry a design value. A worked example in a scaffold is a
// suggestion wearing a placeholder, and this script is not allowed to make one.
const template = readFileSync(join(newDir, '.sitesmith', 'direction.md'), 'utf8')
const noValues = !/#[0-9a-f]{3,6}\b/i.test(template)
  && !/\b(Inter|Georgia|Helvetica|serif|grotesque|cream|terracotta|slate)\b/i.test(template)
if (!noValues) failed++
results.push(`${noValues ? '  ok  ' : '  FAIL'} the template proposes no colour, face or adjective`)

const templateParses = run(['parse', newDir]).status === 1
if (!templateParses) failed++
results.push(`${templateParses ? '  ok  ' : '  FAIL'} an unfilled template is refused by parse`)

/* A9 round two, real numbers. Three unrelated trades landed their grounds at 41, 42 and 38
   degrees after four separate rewrites of the instruction had already been applied. Prose
   could not stop that, so these pin the veto that replaced the fifth rewrite. */
const { judge, hueOf, hueGap } = await import('./ledger.mjs')
/* The other fingerprint axes are deliberately different in each pair, so these cases
   isolate hue. An earlier version of this block held them equal and the same-fingerprint
   veto fired instead, which the suite caught. */
const at = (h, band = 'light', display = 'sans') => ({ ground: band, groundHue: h, accentHue: null, display, imagery: 'imageless', devices: [] })
const prior = (h, band = 'light') => [{ id: 'prior', when: '2026-08-01', fingerprint: at(h, band, 'serif') }]
for (const [name, got, want] of [
  ['two grounds one degree apart are vetoed', judge({ fingerprint: at(41), ledger: prior(42), selfId: 'me' }).some((v) => /ground is 1 degrees/.test(v)), true],
  ['the same hue in a different luminance band is not a repeat', judge({ fingerprint: at(41, 'dark'), ledger: prior(42), selfId: 'me' }).length === 0, true],
  ['a ground far from the record is allowed', judge({ fingerprint: at(210), ledger: prior(42), selfId: 'me' }).length === 0, true],
  ['grey has no hue, so two greys are not a shared one', hueOf('rgb(128, 128, 128)') === null && hueGap(null, 40) === null, true],
]) {
  const ok = got === want
  if (!ok) failed++
  results.push(`${ok ? '  ok  ' : '  FAIL'} ${name}`)
}

for (const line of results) console.log(line)
console.log(failed ? `\n${failed} case(s) disagreed with the expected exit\n` : `\nall ${results.length} cases agreed\n`)
if (existsSync(tmp)) console.log(`working files: ${tmp}`)
process.exit(failed ? 1 : 0)
