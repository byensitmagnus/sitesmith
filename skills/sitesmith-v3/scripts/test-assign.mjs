#!/usr/bin/env node
/* Self-check for assign.mjs. Runs the real CLI against real files in a temp directory,
   because every property worth checking here is about what gets written to disk and in
   what order. node scripts/test-assign.mjs */

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { draw, candidateHash, parseViability, main } from './assign.mjs'

let failures = 0
const t = (name, fn) => {
  try { fn(); console.log(`  ok   ${name}`) }
  catch (e) { failures += 1; console.log(`  FAIL ${name}\n       ${e.message}`) }
}
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m ?? ''} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`) }
const ok = (v, m) => { if (!v) throw new Error(m ?? 'expected truthy') }

const record = (theses, viability) => `# Direction

## Theses

${theses.map((t2, i) => `${i + 1}. ${t2}`).join('\n')}

## Viability

${viability.map((v, i) => `${i + 1}. ${v}`).join('\n')}

## Built

Built: 1, axis: nothing, because it does not matter here
`

const SIX = ['A tide table you can buy from', 'A drawing office that sells computers',
  'A quiet instrument panel', 'A specimen tray', 'A worn counter surface', 'A machine part catalogue']
const VIABLE = 'truth: yes | task: yes | feasible: yes | autopilot: no'

function scratch(theses, viability) {
  const dir = mkdtempSync(join(tmpdir(), 'assign-'))
  mkdirSync(join(dir, '.sitesmith'), { recursive: true })
  writeFileSync(join(dir, '.sitesmith', 'direction.md'), record(theses, viability), 'utf8')
  return dir
}
const run = (...a) => { const s = console.log; console.log = () => {}; try { return main([...a, '--lab']) } finally { console.log = s } }
const assignment = (dir) => JSON.parse(readFileSync(join(dir, '.sitesmith', 'assignment.json'), 'utf8'))

console.log('assign.mjs')

t('the draw is a function of key, list and reroll only', () => {
  const h = 'a'.repeat(64)
  eq(draw('deadbeef', h, 0), draw('deadbeef', h, 0), 'same inputs')
  ok(draw('deadbeef', h, 0) !== draw('deadbeef', h, 1), 'reroll must move it')
  ok(draw('deadbeef', h, 0) !== draw('cafebabe', h, 0), 'key must move it')
  ok(draw('deadbeef', h, 0) !== draw('deadbeef', 'b'.repeat(64), 0), 'list must move it')
})

t('the draw stays inside the pool for every key', () => {
  const h = candidateHash([{ n: 1, text: 'x' }])
  for (let i = 0; i < 4000; i += 1) {
    const u = draw(i.toString(16).padStart(8, '0'), h, 0)
    ok(u >= 0 && u < 1, `unit out of range: ${u}`)
    for (const size of [2, 3, 5, 7]) {
      const idx = Math.min(size - 1, Math.floor(u * size))
      ok(idx >= 0 && idx < size, `index ${idx} out of range for pool of ${size}`)
    }
  }
})

t('the list hash ignores numbering and whitespace, not wording', () => {
  eq(candidateHash([{ n: 1, text: 'a  tide   table' }]), candidateHash([{ n: 1, text: 'a tide table' }]))
  ok(candidateHash([{ n: 1, text: 'a tide table' }]) !== candidateHash([{ n: 1, text: 'a tide chart' }]))
})

t('a viability line missing a field is reported, not defaulted', () => {
  const v = parseViability('## Viability\n\n1. truth: yes | task: yes\n')
  eq(v.get(1).missing, ['feasible', 'autopilot'])
  eq(v.get(1).viable, false)
})

t('validate refuses fewer than five candidates', () => {
  const dir = scratch(SIX.slice(0, 3), [VIABLE, VIABLE, 'truth: yes | task: yes | feasible: yes | autopilot: yes'])
  eq(run('validate', dir), 1)
  ok(!existsSync(join(dir, '.sitesmith', 'assignment.json')), 'nothing should be written')
  rmSync(dir, { recursive: true, force: true })
})

t('validate refuses a list with no autopilot marked', () => {
  const dir = scratch(SIX, Array(6).fill(VIABLE))
  eq(run('validate', dir), 1)
  rmSync(dir, { recursive: true, force: true })
})

t('validate refuses when one candidate is left in the draw', () => {
  const dir = scratch(SIX, ['truth: yes | task: yes | feasible: yes | autopilot: yes',
    'truth: no  | task: yes | feasible: yes | autopilot: no', 'truth: yes | task: no  | feasible: yes | autopilot: no',
    'truth: yes | task: yes | feasible: no  | autopilot: no', 'truth: no  | task: no  | feasible: no  | autopilot: no', VIABLE])
  eq(run('validate', dir), 1)
  rmSync(dir, { recursive: true, force: true })
})

t('the assignment never lands on autopilot or an unviable candidate', () => {
  const viability = ['truth: yes | task: yes | feasible: yes | autopilot: yes',
    'truth: no  | task: yes | feasible: yes | autopilot: no', VIABLE, VIABLE, VIABLE,
    'truth: yes | task: yes | feasible: no  | autopilot: no']
  const forbidden = new Set([1, 2, 6])
  for (let i = 0; i < 300; i += 1) {
    const dir = scratch(SIX, viability)
    eq(run('validate', dir), 0, 'validate')
    eq(run('assign', dir, '--key', i.toString(16).padStart(8, '0')), 0, 'assign')
    const a = assignment(dir)
    ok(!forbidden.has(a.assignedThesis), `assigned ${a.assignedThesis}, which is excluded`)
    eq(a.poolAtDraw, [3, 4, 5])
    rmSync(dir, { recursive: true, force: true })
  }
})

t('the same key reproduces the same assignment', () => {
  const mk = () => { const d = scratch(SIX, [VIABLE, VIABLE, VIABLE, VIABLE, VIABLE, 'truth: yes | task: yes | feasible: yes | autopilot: yes']); run('validate', d); run('assign', d, '--key', '0f1e2d3c'); return d }
  const a = mk(); const b = mk()
  eq(assignment(a).assignedThesis, assignment(b).assignedThesis)
  rmSync(a, { recursive: true, force: true }); rmSync(b, { recursive: true, force: true })
})

t('every drawable candidate is reachable across keys', () => {
  const seen = new Set()
  for (let i = 0; i < 200; i += 1) {
    const dir = scratch(SIX, [VIABLE, VIABLE, VIABLE, VIABLE, VIABLE, 'truth: yes | task: yes | feasible: yes | autopilot: yes'])
    run('validate', dir); run('assign', dir, '--key', (i * 7919).toString(16).slice(-8).padStart(8, '0'))
    seen.add(assignment(dir).assignedThesis)
    rmSync(dir, { recursive: true, force: true })
  }
  eq([...seen].sort((x, y) => x - y), [1, 2, 3, 4, 5], 'a candidate no key can reach is not in the draw')
})

t('validate refuses once an assignment exists', () => {
  const dir = scratch(SIX, [VIABLE, VIABLE, VIABLE, VIABLE, VIABLE, 'truth: yes | task: yes | feasible: yes | autopilot: yes'])
  eq(run('validate', dir), 0)
  eq(run('assign', dir, '--key', 'aabbccdd'), 0)
  eq(run('validate', dir), 1, 'viability judged after the draw is judged knowing the answer')
  rmSync(dir, { recursive: true, force: true })
})

t('editing the thesis list after assignment is refused', () => {
  const dir = scratch(SIX, [VIABLE, VIABLE, VIABLE, VIABLE, VIABLE, 'truth: yes | task: yes | feasible: yes | autopilot: yes'])
  run('validate', dir); run('assign', dir, '--key', 'aabbccdd')
  const p = join(dir, '.sitesmith', 'direction.md')
  writeFileSync(p, readFileSync(p, 'utf8').replace('A specimen tray', 'A different thing entirely'), 'utf8')
  eq(run('assign', dir, '--key', 'aabbccdd', '--because', 'the stack cannot render it'), 1)
  rmSync(dir, { recursive: true, force: true })
})

t('a re-roll needs a reason, and taste is not one', () => {
  const dir = scratch(SIX, [VIABLE, VIABLE, VIABLE, VIABLE, VIABLE, 'truth: yes | task: yes | feasible: yes | autopilot: yes'])
  run('validate', dir); run('assign', dir, '--key', 'aabbccdd')
  eq(run('assign', dir), 2, 'no reason at all is a usage error')
  eq(run('assign', dir, '--because', 'it is boring and I prefer the second one'), 1, 'taste')
  eq(run('assign', dir, '--because', 'needs a delivery date the brief does not supply'), 0, 'a defect')
  rmSync(dir, { recursive: true, force: true })
})

t('a re-roll cannot return to a candidate it rolled away from, and stops at two', () => {
  const dir = scratch(SIX, [VIABLE, VIABLE, VIABLE, VIABLE, VIABLE, 'truth: yes | task: yes | feasible: yes | autopilot: yes'])
  run('validate', dir); run('assign', dir, '--key', 'aabbccdd')
  const seen = [assignment(dir).assignedThesis]
  const why = ['brief supplies no price for it', 'the stack cannot render that control']
  for (const because of why) {
    eq(run('assign', dir, '--because', because), 0)
    const a = assignment(dir)
    ok(!seen.includes(a.assignedThesis), `re-roll returned to ${a.assignedThesis}`)
    seen.push(a.assignedThesis)
  }
  eq(run('assign', dir, '--because', 'a third real defect'), 1, 'the cap must hold')
  eq(assignment(dir).rerolls.length, 2)
  rmSync(dir, { recursive: true, force: true })
})

t('the lab flag is required', () => {
  const dir = scratch(SIX, Array(6).fill(VIABLE))
  const s = console.log; console.log = () => {}
  try {
    const before = process.env.SITESMITH_LAB
    delete process.env.SITESMITH_LAB
    eq(main(['validate', dir]), 2)
    if (before !== undefined) process.env.SITESMITH_LAB = before
  } finally { console.log = s }
  ok(!existsSync(join(dir, '.sitesmith', 'assignment.json')))
  rmSync(dir, { recursive: true, force: true })
})

console.log('')
console.log(failures ? `${failures} failed` : 'all passed')
process.exit(failures ? 1 : 0)
