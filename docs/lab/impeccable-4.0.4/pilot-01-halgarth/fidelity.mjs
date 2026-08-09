#!/usr/bin/env node
/**
 * Nothing concrete was lost on the way through. Deterministic, no model.
 *
 *   node fidelity.mjs
 *
 * Blinding that quietly drops decisions is worse than no blinding, because the judge then
 * compares three directions of which one has been thinned and nobody can see it. So this
 * pulls every concrete, checkable token out of each artifact before and after normalisation
 * and compares the sets.
 *
 * A concrete token is something a developer would have to implement: a colour value, a
 * measurement with a unit, a named typeface, a selector, a price, a time, a viewport. Prose
 * is not checked, because prose is what the normaliser is allowed to reflow.
 *
 * Anything missing afterwards is reported with the statement it came from. A token that was
 * only ever inside a sentence naming the procedure is expected to go with it, and is listed
 * separately rather than counted as a loss.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const ARMS = ['A', 'B', 'C']

const TOKENS = {
  'colour value': /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\([^)]*\)/g,
  'measurement': /\b\d+(?:\.\d+)?\s?(?:px|rem|em|ch|vw|vh|vmin|vmax|pt|%|ms|s)\b/g,
  'typeface': /\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Sans|Serif|Mono|Display|Grotesk|Grotesque|Text|Condensed)\b|"[^"]{2,40}"(?=\s*(?:,|falling|fallback|at\b))/g,
  'selector': /(?:^|[\s(])[.#][a-zA-Z][\w-]{2,}\b/g,
  'price or quantity': /\b(?:GBP|£|\$|kr\.?)\s?\d[\d,.]*\b|\b\d[\d,.]*\s?(?:kg|mm|cm|m|rpm|kW|hours?|days?|weeks?)\b/g,
  'ratio': /\b\d+(?:\.\d+)?\s*:\s*\d+(?:\.\d+)?\b/g,
}

const grab = (text, re) => new Set((text.match(re) ?? []).map((s) => s.trim().replace(/^[(\s]+/, '')))

const report = []
let lost = 0

for (const arm of ARMS) {
  const before = readFileSync(`${arm}/DIRECTION.md`, 'utf8')
  const after = readFileSync(`canonical/${arm}.md`, 'utf8')
  const kinds = {}

  for (const [kind, re] of Object.entries(TOKENS)) {
    const b = grab(before, re)
    const a = grab(after, re)
    const missing = [...b].filter((t) => !a.has(t))

    /* A token that only ever appeared in a sentence naming the procedure leaves with that
       sentence. That is the scrub working, not the normaliser losing something, so it is
       counted apart. */
    const MECH = /\b(autopilot|runner[- ]up|challengers?|concept seed|seed key|run key|re-?roll|viabilit|catalogues?|catalogs?|grounded list|assigned (index|candidate)|the roll|sitesmith|impeccable|\w+\.mjs)/i
    const explained = []
    const unexplained = []
    for (const t of missing) {
      const line = before.split('\n').find((l) => l.includes(t)) ?? ''
      ;(MECH.test(line) ? explained : unexplained).push({ token: t, from: line.trim().slice(0, 120) })
    }
    lost += unexplained.length
    kinds[kind] = { before: b.size, after: a.size, wentWithAScrubbedStatement: explained, lostWithoutExplanation: unexplained }
  }
  report.push({ arm, kinds })
}

writeFileSync('FIDELITY.json', JSON.stringify({
  question: 'is every concrete design decision still recoverable after normalisation',
  verdict: lost === 0 ? 'nothing concrete was lost' : `${lost} token(s) lost without explanation`,
  arms: report,
}, null, 2) + '\n', 'utf8')

console.log('\n  concrete tokens, before -> after\n')
for (const r of report) {
  console.log(`  ${r.arm}`)
  for (const [kind, v] of Object.entries(r.kinds)) {
    const flag = v.lostWithoutExplanation.length ? `  LOST ${v.lostWithoutExplanation.length}` : ''
    const note = v.wentWithAScrubbedStatement.length ? `  (${v.wentWithAScrubbedStatement.length} left with a scrubbed statement)` : ''
    console.log(`    ${kind.padEnd(18)} ${String(v.before).padStart(3)} -> ${String(v.after).padStart(3)}${note}${flag}`)
    for (const m of v.lostWithoutExplanation.slice(0, 3)) console.log(`        missing: ${m.token}   from: ${m.from}`)
  }
}
console.log(`\n  ${lost === 0 ? 'nothing concrete was lost' : `${lost} token(s) lost without explanation`}\n`)
process.exit(lost === 0 ? 0 : 1)
