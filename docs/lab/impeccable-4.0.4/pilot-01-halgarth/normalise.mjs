#!/usr/bin/env node
/**
 * Deterministic normalisation. Code, no model.
 *
 *   node normalise.mjs
 *
 * Three things it can do, and one it cannot.
 *
 * It can split each direction on the nine agreed headings, because all three carry them, and
 * emit them in one order. It can delete whole sentences that name a mechanism, which removes
 * the tell without rewriting a decision. It can count what is left.
 *
 * It cannot level a voice. Two of these were written in one register and the third in
 * another, and no regular expression turns one into the other. So this script measures rather
 * than claiming: if the arms leave here at materially different lengths, or if the scrub had
 * to cut materially different amounts, that is reported and the run stops.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'

const HEADINGS = ['Thesis', 'Subject grounding', 'First viewport', 'Visual and material system',
  'Typography strategy', 'Composition and layout', 'Signature element', 'Visitor path', 'Honest risk']

/* Whole words, so "scroll" does not match "roll" and a rotor that is balanced does not match
   "assign". Each is a term that names how the direction was arrived at rather than what it is. */
const MECHANISM = [
  'autopilot', 'runner-up', 'runner up', 'challenger', 'challengers', 'concept seed', 'seed key',
  're-roll', 're-rolled', 'reroll', 'viability', 'viable', 'quality bar', 'system grammar',
  'catalog', 'catalogue', 'sitesmith', 'impeccable', 'assign\\.mjs', 'ledger\\.mjs', 'gate\\.mjs',
  'run key', 'grounded list', 'dealt', 'the roll', 'this roll', 'assigned candidate',
  'assigned index', 'thesis \\d', 'candidate \\d', 'seven-item', 'six dealt', 'the only one', 'the strongest', 'the other two', 'the other six',
]
const RE = new RegExp(`\\b(${MECHANISM.join('|')})\\b`, 'i')

/* A sentence is the unit, because deleting a clause leaves a sentence that does not parse and
   deleting a paragraph loses decisions that were sitting beside the tell. */
const sentences = (block) => block.split(/(?<=[.!?])\s+(?=[A-Z`\-*#])/)

function section(text, name, next) {
  const start = text.indexOf(`## ${name}`)
  if (start < 0) return null
  const from = start + `## ${name}`.length
  const end = next ? text.indexOf(`## ${next}`, from) : -1
  return text.slice(from, end < 0 ? undefined : end).trim()
}

const report = []
for (const arm of ['A', 'B', 'C']) {
  const raw = readFileSync(`${arm}/DIRECTION.md`, 'utf8')
  const out = []
  let cutSentences = 0
  let cutWords = 0
  let keptWords = 0

  for (let i = 0; i < HEADINGS.length; i += 1) {
    const body = section(raw, HEADINGS[i], HEADINGS[i + 1])
    if (body === null) { out.push(`## ${HEADINGS[i]}`, '', 'Not stated.', ''); continue }
    const kept = []
    for (const s of sentences(body)) {
      const words = s.split(/\s+/).filter(Boolean).length
      if (RE.test(s)) { cutSentences += 1; cutWords += words; continue }
      keptWords += words
      kept.push(s)
    }
    out.push(`## ${HEADINGS[i]}`, '', kept.join(' ').trim() || 'Not stated.', '')
  }

  /* Punctuation, because it separated these three completely on its own: one arm used 65 em
     dashes and 11 en dashes, the other two used none, so a reader could sort them into a pair
     and a singleton without reading a word. The skill behind two of them bans the character
     outright, which makes it a tell about the procedure rather than about the design.
     Replacing it loses no decision: a dash between clauses becomes a comma, a numeric range
     becomes a hyphen. Emphasis marks go the same way and for the same reason. */
  const text = `${out.join('\n').trim()}\n`
    .replace(/(\d)\s*[–—]\s*(\d)/g, '$1-$2')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*([.;:!?])/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
  mkdirSync('packet', { recursive: true })
  writeFileSync(`packet/${arm}.md`, text, 'utf8')
  const leftovers = MECHANISM.filter((m) => new RegExp(`\\b${m}\\b`, 'i').test(text))
  report.push({
    arm,
    wordsBefore: raw.split(/\s+/).filter(Boolean).length,
    wordsAfter: text.split(/\s+/).filter(Boolean).length,
    cutSentences, cutWords,
    stillLeaking: leftovers,
    sha256: createHash('sha256').update(text, 'utf8').digest('hex'),
  })
}

const after = report.map((r) => r.wordsAfter)
const spread = (Math.max(...after) - Math.min(...after)) / Math.min(...after)
const cuts = report.map((r) => r.cutWords)
const cutSpread = Math.max(...cuts) - Math.min(...cuts)

writeFileSync('NORMALISATION.json', JSON.stringify({
  method: 'deterministic: heading split, sentence-level mechanism scrub, no model',
  arms: report,
  lengthSpread: Number(spread.toFixed(3)),
  cutWordSpread: cutSpread,
}, null, 2) + '\n', 'utf8')

for (const r of report) {
  console.log(`${r.arm}  ${r.wordsBefore} -> ${r.wordsAfter} words, cut ${r.cutSentences} sentence(s) / ${r.cutWords} words`
    + `${r.stillLeaking.length ? `, STILL LEAKING: ${r.stillLeaking.join(', ')}` : ''}`)
}
console.log('')
console.log(`length spread after scrub : ${(spread * 100).toFixed(0)} per cent`)
console.log(`cut-word spread           : ${cutSpread} words between the least and most scrubbed arm`)
