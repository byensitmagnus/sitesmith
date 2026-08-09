#!/usr/bin/env node
/**
 * What is left that a judge could sort the arms by. Deterministic, no model.
 *
 *   node leakage.mjs
 *
 * Two kinds of finding, and the difference is the whole point.
 *
 * A **tell** is a property of how an arm writes or of which procedure made it. If one arm has
 * eleven table rows and the others have none, a reader sorts them without reading a word. Tells
 * are leakage and must go.
 *
 * A **difference** is a property of what an arm decided. One arm writing more about risk than
 * another is the thing under measurement. Removing it would be rewriting, not blinding.
 *
 * This file reports both and says which is which, so the decision to run a judge is made
 * against numbers rather than against a feeling.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const ARMS = ['A', 'B', 'C']
const SECTIONS = ['Thesis', 'Subject grounding', 'First viewport', 'Visual and material system',
  'Typography strategy', 'Composition and layout', 'Signature element', 'Visitor path', 'Honest risk']

/* Named, not the arm's own label: an artifact that says "A" anywhere is the loudest tell of
   all, and so is a product name, a script, a key, a path or a URL. */
const NAMED = {
  'arm label': /\b(arm\s+[ABC]|option\s+[ABC])\b/g,
  'product name': /\b(sitesmith|impeccable)\b/gi,
  'script name': /\b\w+\.mjs\b/g,
  'run or seed key': /\b(run key|seed key|key:\s*[0-9a-f]{6,})\b/gi,
  'hex-looking id': /\b[0-9a-f]{8,}\b/g,
  'source id': /\bSOURCE ID\b/gi,
  'url': /https?:\/\/\S+/g,
  'filesystem path': /(?:[A-Za-z]:[\\/]|\.{1,2}[\\/]|\/(?:Users|home|tmp)\/)\S+/g,
  'model or provider': /\b(sonnet|haiku|opus|claude|anthropic|gpt|openai)\b/gi,
  'procedure vocabulary': /\b(autopilot|runner[- ]up|challengers?|concept seed|re-?roll(ed)?|viabilit(y|ies)|quality bar|system grammar|catalogue?|grounded list|assigned (index|candidate)|the roll)\b/gi,
}

/* Structure that survives as syntax rather than as meaning. Every one of these is a tell. */
const STRUCTURE = {
  'markdown table row': /^\s*\|/gm,
  'bold span': /\*\*/g,
  'italic span': /(^|[^*])\*[^*\n]+\*/g,
  'blockquote': /^\s*>/gm,
  'bullet item': /^\s*[-*+]\s+/gm,
  'numbered item': /^\s*\d+[.)]\s+/gm,
  'heading': /^#{1,6}\s+/gm,
  'code span': /`/g,
  'em or en dash': /[—–]/g,
}

const count = (text, re) => (text.match(re) ?? []).length

const texts = Object.fromEntries(ARMS.map((a) => [a, readFileSync(`canonical/${a}.md`, 'utf8')]))

const named = {}
for (const [label, re] of Object.entries(NAMED)) {
  named[label] = Object.fromEntries(ARMS.map((a) => {
    const hits = texts[a].match(re) ?? []
    return [a, { count: hits.length, examples: [...new Set(hits)].slice(0, 3) }]
  }))
}

const structure = {}
for (const [label, re] of Object.entries(STRUCTURE)) {
  structure[label] = Object.fromEntries(ARMS.map((a) => [a, count(texts[a], re)]))
}

/* A structural row is a tell only when the arms disagree about it. Nine headings each is a
   shared frame; eleven table rows in one arm and none in the others is a signature. */
const structuralTells = Object.entries(structure)
  .filter(([, v]) => new Set(Object.values(v)).size > 1)
  .map(([label, v]) => ({ label, ...v }))

const namedTells = Object.entries(named)
  .filter(([, v]) => ARMS.some((a) => v[a].count > 0))
  .map(([label, v]) => ({ label, ...Object.fromEntries(ARMS.map((a) => [a, v[a]])) }))

/* Word counts, whole and per section. Reported as a difference rather than a tell, and the
   per-section split is what says which it is: an arm that is longer everywhere writes at
   length, an arm that is longer in one place decided more there. */
const words = Object.fromEntries(ARMS.map((a) => [a, texts[a].split(/\s+/).filter(Boolean).length]))
const perSection = {}
for (const s of SECTIONS) {
  perSection[s] = Object.fromEntries(ARMS.map((a) => {
    const i = texts[a].indexOf(`## ${s}`)
    const nextName = SECTIONS[SECTIONS.indexOf(s) + 1]
    const j = nextName ? texts[a].indexOf(`## ${nextName}`) : texts[a].length
    return [a, texts[a].slice(i, j < 0 ? undefined : j).split(/\s+/).filter(Boolean).length]
  }))
}
const longestPerSection = Object.fromEntries(SECTIONS.map((s) => {
  const v = perSection[s]
  return [s, ARMS.reduce((best, a) => (v[a] > v[best] ? a : best), ARMS[0])]
}))
const winnersBySection = ARMS.map((a) => [a, Object.values(longestPerSection).filter((x) => x === a).length])

const spread = (Math.max(...Object.values(words)) - Math.min(...Object.values(words))) / Math.min(...Object.values(words))

const out = {
  verdict: namedTells.length === 0 && structuralTells.length === 0 ? 'no tell found' : 'tells remain',
  namedTells, structuralTells,
  structure, words,
  lengthSpread: Number(spread.toFixed(3)),
  perSection, longestPerSection,
  sectionsLedBy: Object.fromEntries(winnersBySection),
}
writeFileSync('LEAKAGE.json', JSON.stringify(out, null, 2) + '\n', 'utf8')

console.log('\n  named tells\n')
if (!namedTells.length) console.log('  none: no arm label, product, script, key, id, url, path, model or procedure word')
for (const t of namedTells) console.log(`  ${t.label.padEnd(22)} A=${t.A.count} B=${t.B.count} C=${t.C.count}  ${JSON.stringify([...t.A.examples, ...t.B.examples, ...t.C.examples].slice(0, 4))}`)

console.log('\n  structure, and whether the arms disagree\n')
for (const [label, v] of Object.entries(structure)) {
  const differs = new Set(Object.values(v)).size > 1
  console.log(`  ${differs ? 'TELL' : 'same'}  ${label.padEnd(20)} A=${v.A} B=${v.B} C=${v.C}`)
}

console.log('\n  length, reported as a difference\n')
console.log(`  words        A=${words.A} B=${words.B} C=${words.C}, spread ${(spread * 100).toFixed(0)} per cent`)
console.log(`  sections led ${winnersBySection.map(([a, n]) => `${a}=${n}`).join(' ')} of ${SECTIONS.length}`)
console.log('')
