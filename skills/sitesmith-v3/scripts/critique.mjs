#!/usr/bin/env node
/**
 * The critique, locked to the render it was written against. Original work, MIT.
 *
 *   node scripts/critique.mjs packet [build]            what a reviewer is given, and nothing else
 *   node scripts/critique.mjs lock   [build] --file <f> the answers, hashed to this render
 *   node scripts/critique.mjs lock   [build] --file <f> --correction "what changed and why"
 *
 * Why this exists, from one afternoon's measurement rather than from principle.
 *
 * look.md section 6 and verify.md both ask for a critique of the rendered page. Nothing
 * has ever read one. Three builds were made from this package on three unrelated briefs;
 * all three wrote their critique, all three passed their own gates, and three reviewers
 * who saw only the brief and the screenshots rejected all three. Two of the three builders
 * also reported, unprompted, that they had read the verify PASS before opening the images,
 * which is the one ordering verify.md tells them not to use: once you have read a pass you
 * read the picture as confirming it.
 *
 * A model reviewing its own fresh output in the same context misses most of its own
 * mistakes. That is graph-engineering's finding and this repository has now reproduced it
 * three times out of three. The packet below is the whole input a reviewer gets. Hand it to
 * a fresh agent when one is available; read it with the direction record closed when one is
 * not. Either way the answers are locked to a hash of the render, so a critique written
 * after the page moved is a critique of a page that no longer exists, and this says so.
 *
 * Exit codes: 0 done, 2 refused, 1 could not run.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, resolve, relative, sep } from 'node:path'

const argv = process.argv.slice(2)
const CMD = argv[0]
const flag = (name, fallback = null) => {
  const i = argv.indexOf(name)
  return i > -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback
}
const positional = argv.slice(1).find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1]?.startsWith('--') !== true)
const BUILD = resolve(positional ?? '.')
const SHOTS = join(BUILD, '.sitesmith/shots')
const STATE = join(BUILD, '.sitesmith/critique.json')
const show = (p) => relative(process.cwd(), p).split(sep).join('/') || '.'

const die = (code, msg) => { console.error(msg); process.exit(code) }

/* The render, as one hash over every screenshot verify.mjs wrote. Reading the images
   rather than the markup on purpose: the critique is of what was shown, and two builds
   with the same DOM and a different font file are not the same page to look at. */
function renderHash() {
  if (!existsSync(SHOTS)) return null
  const files = readdirSync(SHOTS).filter((f) => f.endsWith('.png')).sort()
  if (!files.length) return null
  const h = createHash('sha256')
  for (const f of files) { h.update(f); h.update(readFileSync(join(SHOTS, f))) }
  return { hash: h.digest('hex').slice(0, 16), files }
}

/* The six questions are verify.md's, and they are here as well as there because the packet
   has to be self-contained: a reviewer who has to open the package to know what to answer
   has read more than the render. */
const QUESTIONS = [
  'Where does the eye land first, and is it the thing the brief said the page must do?',
  'What reads as a template first? Name it.',
  'Is the signature visible at 1440 and alive at 375? One that exists only in the record is not a signature.',
  'Where is the page emptiest, and is that emptiness doing work? Name the element.',
  'Read the six largest words in order. Do they say what this business does, or could a competitor say them?',
  'Cover the top third. Does the rest still say what this is?',
]

if (CMD === 'packet') {
  const r = renderHash()
  if (!r) die(1, `no screenshots under ${show(SHOTS)}. Run verify.mjs first; a critique with no render is an opinion.`)
  const brief = ['BRIEF.md', 'brief.md', '../BRIEF.md'].map((f) => join(BUILD, f)).find(existsSync)
  const lines = [
    '# Critique packet',
    '',
    'This is the whole input. Do not open the direction record, the production report, the',
    'gate output or the source. A critique that could have been written without the images',
    'is not a critique.',
    '',
    `render: ${r.hash}`,
    ...r.files.map((f) => `- ${show(join(SHOTS, f))}`),
    brief ? `\nbrief: ${show(brief)}` : '\nbrief: not found in the build directory; the reviewer must be given it separately.',
    '',
    '## Answer each in one sentence, and be unkind',
    '',
    ...QUESTIONS.map((q, i) => `${i + 1}. ${q}`),
    '',
    '## Then, one line',
    '',
    'ACCEPT or REJECT, and the single worst thing you see.',
    '',
  ]
  const out = join(BUILD, '.sitesmith/critique-packet.md')
  writeFileSync(out, lines.join('\n'), 'utf8')
  console.log(lines.join('\n'))
  console.log(`\nwritten: ${show(out)}`)
  process.exit(0)
}

if (CMD === 'lock') {
  const file = flag('--file')
  if (!file) die(1, 'usage: critique.mjs lock [build] --file <answers.md> [--correction "what changed and why"]')
  if (!existsSync(file)) die(1, `no such file: ${file}`)
  const r = renderHash()
  if (!r) die(1, `no screenshots under ${show(SHOTS)}. Run verify.mjs first.`)
  const answers = readFileSync(file, 'utf8').trim()
  if (answers.split('\n').filter((l) => l.trim()).length < 6) {
    die(2, 'fewer than six answered lines. The six questions are the critique; a shorter answer is a verdict with no reading behind it.')
  }
  const prior = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : null
  const correction = flag('--correction')
  const corrections = prior?.corrections ?? []
  if (correction) corrections.push({ note: correction, fromRender: prior?.render ?? null, toRender: r.hash })
  if (corrections.length > 1) {
    die(2, `${corrections.length} correction rounds. look.md allows one: a second round is where a page gets sanded flat, and if the second look is still wrong the thesis was wrong.`)
  }
  writeFileSync(STATE, `${JSON.stringify({ v: 1, render: r.hash, files: r.files, answers, corrections }, null, 1)}\n`, 'utf8')
  console.log(`locked against render ${r.hash} (${r.files.length} images)${corrections.length ? `, ${corrections.length} correction round` : ''}`)
  console.log(`  ${show(STATE)}`)
  process.exit(0)
}

die(1, 'usage: critique.mjs packet|lock [build] [--file <answers.md>] [--correction "..."]')
