#!/usr/bin/env node
/**
 * Canonical structural normalisation. Deterministic code, no model.
 *
 *   node canonical.mjs
 *
 * The previous scrub removed vocabulary and punctuation and left the structure, which is what
 * stopped the run: one arm carried eleven table rows and the other two carried none, so a
 * reader could sort them into a pair and a singleton without reading a word of the design.
 *
 * Removing tables with a regular expression would have taken the design information with
 * them, because in that arm the table IS the information. So this parses each artifact into
 * blocks and re-emits every block in one form. A table row becomes labelled statements. A
 * bullet becomes a sentence. Bold, italic, code spans and links become their own text. What
 * survives is what each arm decided; what goes is how it chose to lay the decision out.
 *
 * The rule throughout: remove presentation, keep information. Nothing is shortened to match a
 * word count, nothing is summarised, and nothing is added to a shorter arm.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'

const ARMS = ['A', 'B', 'C']

/* The nine the three artifacts actually share. Eleven were suggested; inventing two more
   would mean splitting one arm's prose across headings it never wrote, which is authoring
   rather than blinding. */
const SECTIONS = ['Thesis', 'Subject grounding', 'First viewport', 'Visual and material system',
  'Typography strategy', 'Composition and layout', 'Signature element', 'Visitor path', 'Honest risk']

/* ── block parsing ──────────────────────────────────────────────────────── */

function blocks(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (/^\s*```/.test(line)) {
      const body = []
      i += 1
      while (i < lines.length && !/^\s*```/.test(lines[i])) { body.push(lines[i]); i += 1 }
      i += 1
      out.push({ kind: 'sketch', body })
      continue
    }
    if (/^#{1,6}\s+/.test(line)) {
      out.push({ kind: 'heading', text: line.replace(/^#{1,6}\s+/, '').trim() })
      i += 1
      continue
    }
    if (/^\s*\|/.test(line)) {
      const rows = []
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i += 1 }
      out.push({ kind: 'table', rows })
      continue
    }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const items = []
      while (i < lines.length && (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) items.push(lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, ''))
        else items[items.length - 1] += ` ${lines[i].trim()}`   /* a wrapped item is one item */
        i += 1
      }
      out.push({ kind: 'list', items })
      continue
    }
    if (!line.trim()) { i += 1; continue }
    const para = []
    while (i < lines.length && lines[i].trim() && !/^\s*(\||```|#{1,6}\s|([-*+]|\d+[.)])\s)/.test(lines[i])) {
      para.push(lines[i].trim())
      i += 1
    }
    out.push({ kind: 'paragraph', text: para.join(' ') })
  }
  return out
}

/* ── inline levelling ───────────────────────────────────────────────────── */

/* Emphasis, code spans and links are presentation. The text inside every one of them is the
   decision, so the marks come off and the words stay. A selector written as `.wetline` is
   design information and survives as .wetline. */
const inline = (s) => String(s)
  .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
  .replace(/__([^_]+)__/g, '$1')
  .replace(/`([^`]*)`/g, '$1')
  .replace(/(\d)\s*[–—]\s*(\d)/g, '$1-$2')
  .replace(/\s*[—–]\s*/g, ', ')
  .replace(/,\s*,/g, ',')
  /* Not before a decimal. This rule turned rgba(0,0,0,.25) into rgba(0,0,0.25), which is a
     different colour and a corrupted declaration, and the fidelity check caught it. A comma
     followed by a full stop is a typing slip only when no number follows. */
  .replace(/,\s*\.(?!\d)/g, '.')
  .replace(/,\s*([;:!?])/g, '$1')
  .replace(/\s{2,}/g, ' ')
  .trim()

/* ── one canonical statement per decision ───────────────────────────────── */

function render(block) {
  if (block.kind === 'paragraph') return [inline(block.text)]
  if (block.kind === 'list') return block.items.map((t) => {
    const s = inline(t)
    return /[.!?]$/.test(s) ? s : `${s}.`
  })
  if (block.kind === 'sketch') {
    /* Two things arrive inside a fence and they are not the same thing. A drawing is a
       decision made in alignment, and reflowing it destroys it. A list that happened to be
       fenced is prose with markers on it, and leaving it fenced smuggles the structure back
       in past everything above: one arm's fenced page outline was seven numbered items and
       six em dashes that survived the whole normalisation.

       Box-drawing characters tell them apart, deterministically. */
    const isDrawing = block.body.some((l) => /[─-╿▀-▟■-◿]/.test(l))
    if (!isDrawing) return blocks(block.body.join('\n')).flatMap(render)
    /* A drawing keeps its alignment, and only the punctuation between words is levelled: a
       dash separating two words is a writing habit, a dash drawing a rule is the picture. */
    return ['Sketch:', ...block.body.map((l) => l.replace(/\s+$/, '')
      .replace(/(\w)\s*[—–]\s*(\w)/g, '$1, $2'))]
  }
  if (block.kind === 'table') {
    const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => inline(c))
    const rows = block.rows.filter((r) => !/^\s*\|[\s:|-]+\|?\s*$/.test(r)).map(cells)
    if (!rows.length) return []
    const [head, ...body] = rows
    /* Each data row becomes one statement carrying every column it filled, labelled by the
       header. A row with no header to label it keeps its cells in order, which is still the
       information without the grid. */
    return body.map((r) => r
      .map((v, k) => (head[k] && head[k] !== v ? `${head[k]}: ${v}` : v))
      .filter((x) => x && !/^:?\s*$/.test(x))
      .join('. ')
      .replace(/\.\s*\./g, '.')
      .concat(/[.!?]$/.test(r.join('')) ? '' : '.'))
  }
  return []
}

/* Vocabulary, after the structure and not before it. A statement that names how the direction
   was arrived at goes whole: cutting the phrase out would leave a sentence that no longer
   parses, and cutting the paragraph would take decisions that were sitting beside it. A
   drawing line is never dropped, because a diagram cannot lose a row and still be the same
   diagram, and no arm wrote its procedure inside one. */
/* Widened after reading the three packets by hand, which found two the first pass missed.
   One arm wrote "every other viable candidate organises the page around", which says a
   shortlist existed. The other wrote "it was not the top-ranked candidate on that list, it
   was deliberately the lowest-resonance one, full reasoning in WORKING.md", which names the
   ranking, the ordering and a file. Both are the procedure describing itself, and neither
   matched a pattern built from the vocabulary the tools print. A regular expression finds
   what it was told to look for; reading the artifact is what finds the rest. */
const MECHANISM = /\b(autopilot|runner[- ]up|challengers?|concept seed|seed key|run key|re-?rolls?|re-?rolled|viable|viabilit(y|ies)|candidates?|shortlist(ed)?|top-ranked|lowest-resonance|resonance|ranked|(first|second) swap|swap(ped)? the (brief|trade)|originality pass|quality bar|system grammar|catalogues?|catalogs?|grounded list|assigned (index|candidate)|the roll|this roll|sitesmith|impeccable|\w+\.(mjs|md)|§\d|\b[0-9a-f]{8,}\b)/i

/* Sentence, not statement. A paragraph is one statement here, and dropping a whole paragraph
   because one clause in it named a script cost a real design fact: an arm's 44px touch-target
   minimum left with a sentence that happened to mention `ledger.mjs`. The fidelity check
   caught that too. So a paragraph is split, the sentence carrying the tell goes, and the rest
   of the paragraph stays. */
const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z"'`(])/)

const scrub = (statements) => {
  const kept = []
  let cut = 0
  let inDrawing = false
  for (const s of statements) {
    if (s === 'Sketch:') { inDrawing = true; kept.push(s); continue }
    if (inDrawing && /[─-╿▀-▟■-◿│┌└├]/.test(s)) { kept.push(s); continue }
    inDrawing = false
    if (!MECHANISM.test(s)) { kept.push(s); continue }
    const survivors = sentences(s).filter((one) => !MECHANISM.test(one))
    cut += sentences(s).length - survivors.length
    if (survivors.length) kept.push(survivors.join(' '))
  }
  return { kept, cut }
}

function section(bs, name, next) {
  const from = bs.findIndex((b) => b.kind === 'heading' && b.text === name)
  if (from < 0) return null
  const rest = bs.slice(from + 1)
  const to = next ? rest.findIndex((b) => b.kind === 'heading' && b.text === next) : -1
  return to < 0 ? rest : rest.slice(0, to)
}

/* ── run ────────────────────────────────────────────────────────────────── */

mkdirSync('canonical', { recursive: true })
const report = []

for (const arm of ARMS) {
  const raw = readFileSync(`${arm}/DIRECTION.md`, 'utf8')
  const bs = blocks(raw)
  const out = []
  const perSection = {}
  let cutTotal = 0

  for (let i = 0; i < SECTIONS.length; i += 1) {
    const body = section(bs, SECTIONS[i], SECTIONS[i + 1])
    const raw2 = body === null ? ['Not stated.'] : body.flatMap(render).filter(Boolean)
    const { kept: statements, cut } = scrub(raw2)
    cutTotal += cut
    out.push(`## ${SECTIONS[i]}`, '', ...(statements.length ? statements : ['Not stated.']), '')
    perSection[SECTIONS[i]] = statements.join(' ').split(/\s+/).filter(Boolean).length
  }

  const text = `${out.join('\n').trim()}\n`
  writeFileSync(`canonical/${arm}.md`, text, 'utf8')
  report.push({
    arm,
    sha256: createHash('sha256').update(text, 'utf8').digest('hex'),
    words: text.split(/\s+/).filter(Boolean).length,
    perSection,
    statementsCut: cutTotal,
    blocksIn: bs.reduce((a, b) => ({ ...a, [b.kind]: (a[b.kind] ?? 0) + 1 }), {}),
  })
}

writeFileSync('CANONICAL.json', JSON.stringify({
  method: 'deterministic block parse, one statement per decision, no model',
  sections: SECTIONS,
  arms: report,
}, null, 2) + '\n', 'utf8')

for (const r of report) console.log(`${r.arm}  ${r.words} words, ${r.statementsCut} statement(s) cut  blocks in: ${JSON.stringify(r.blocksIn)}`)
