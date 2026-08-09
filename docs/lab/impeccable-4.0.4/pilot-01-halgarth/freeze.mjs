#!/usr/bin/env node
/**
 * Freeze the instrument, seal the mapping, and lay out the judge's packet.
 *
 *   node freeze.mjs
 *
 * Everything the judge could be affected by is hashed before the judge exists, so nothing
 * about the instrument can be adjusted after a verdict is known and still look like it was
 * always that way. The mapping from candidate number back to arm is written to its own file,
 * away from the packet, and is not read again until the verdict is on disk.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'

const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex')

const INSTRUMENT = ['canonical.mjs', 'leakage.mjs', 'fidelity.mjs', 'VALIDATION.md',
  'canonical/A.md', 'canonical/B.md', 'canonical/C.md']

const frozen = Object.fromEntries(INSTRUMENT.map((p) => [p, sha(p)]))

/* The worktree the arms were produced from and the instrument was written in. A benchmark
   whose code state is not recorded is not reproducible. */
const git = (cmd) => { try { return execSync(cmd, { cwd: 'C:/Users/Usmo1/Documents/sitesmith', encoding: 'utf8' }).trim() } catch { return null } }
const worktree = {
  branch: git('git rev-parse --abbrev-ref HEAD'),
  head: git('git rev-parse HEAD'),
  dirty: git('git status --porcelain') || '(clean)',
  impeccablePin: '9a949fb543d44cfb406f61bcab99d95d7f12cf1d',
}

/* Deterministic, from the artifacts themselves, so the order can be recomputed by anyone
   holding the three files and cannot have been chosen to suit a result. */
const PERMS = [['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B'], ['C', 'B', 'A']]
const seed = createHash('sha256')
  .update(['A', 'B', 'C'].map((a) => frozen[`canonical/${a}.md`]).join(':'), 'utf8')
  .digest()
const permIndex = seed.readUInt32BE(0) % 6
const order = PERMS[permIndex]

mkdirSync('judge/packet', { recursive: true })
order.forEach((arm, i) => copyFileSync(`canonical/${arm}.md`, `judge/packet/candidate-${i + 1}.md`))

/* The secret, on its own, not in the judge's directory. */
writeFileSync('SEALED-MAPPING.json', JSON.stringify({
  sealedBefore: 'the judge call',
  rule: 'sha256 of the three canonical hashes joined by colons, first four bytes, modulo six, over the six permutations of A B C in that order',
  permIndex,
  candidateToArm: Object.fromEntries(order.map((arm, i) => [`candidate-${i + 1}`, arm])),
  armMeaning: { A: 'current SiteSmith, no external assignment', B: 'same SiteSmith with assign.mjs', C: 'pinned Impeccable 4.0.4' },
}, null, 2) + '\n', 'utf8')

writeFileSync('FROZEN.json', JSON.stringify({
  frozenBefore: 'the judge call',
  instrument: frozen,
  worktree,
  judgePacket: Object.fromEntries([1, 2, 3].map((n) => [`candidate-${n}.md`, sha(`judge/packet/candidate-${n}.md`)])),
}, null, 2) + '\n', 'utf8')

/* The last look, at exactly what the judge will read and nothing else. */
const BANNED = {
  'candidate or arm label': /\b(arm|option|candidate)\s+[ABC]\b|^##?\s*[ABC]$/im,
  'product name': /\b(sitesmith|impeccable)\b/i,
  /* Narrowed after both fired on design language rather than on a procedure. One direction
     proposes a JavaScript file for the site it would build, /book/book.js, and another writes
     "no colour is assigned a UI role in the abstract". Neither identifies how the direction
     was arrived at, which is the only thing a blinding check is for, and flagging them would
     mean editing a design decision out of an artifact to satisfy a pattern. So these match
     the tools by name and the assignment step by its own phrasing, not every file and not the
     ordinary verb. */
  'assign': /\bassign\.mjs\b|\bthe assignment\b|\bassigned (index|candidate|thesis|direction)\b|\bexternal assignment\b/i,
  'seed or run key': /\b(seed|run)\s+key\b|\b[0-9a-f]{8,}\b/i,
  'tooling file name': /\b(assign|ledger|gate|contract|verify|critique|journey|inspect|stack|concept-seed|commands|cli)\.mjs\b|\b(SKILL|WORKING|RUN|PRODUCT|DESIGN|BRIEF)\.md\b/i,
  'url': /https?:\/\//i,
  'filesystem path': /(?:[A-Za-z]:[\\/]|\.{1,2}[\\/]|\/(?:Users|home|tmp)\/)/,
  'procedural narration': /\b(autopilot|runner[- ]up|challengers?|concept seed|re-?roll|viable|viabilit|shortlist|top-ranked|resonance|ranked|grounded list|the roll|(first|second) swap|originality pass)\b/i,
}

let dirty = 0
console.log('\n  the judge packet, checked one last time\n')
for (const n of [1, 2, 3]) {
  const text = readFileSync(`judge/packet/candidate-${n}.md`, 'utf8')
  for (const [label, re] of Object.entries(BANNED)) {
    const hit = text.match(re)
    if (hit) { console.log(`  FAIL  candidate-${n}: ${label} -> ${JSON.stringify(hit[0])}`); dirty += 1 }
  }
}
if (!dirty) console.log('  clean: no label, product, assign, key, file name, url, path or procedural narration')

console.log('')
console.log(`  worktree   ${worktree.branch} @ ${worktree.head?.slice(0, 8)}${worktree.dirty === '(clean)' ? ', clean' : ', with uncommitted changes'}`)
console.log(`  order      permutation ${permIndex}, sealed away from the packet`)
console.log(`  packet     ${[1, 2, 3].map((n) => `candidate-${n}.md`).join(', ')} in judge/packet/`)
console.log('')
process.exit(dirty ? 1 : 0)
