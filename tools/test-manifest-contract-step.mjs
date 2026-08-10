#!/usr/bin/env node
/**
 * The contract step is a step every run takes, so its file is a file every run may open.
 * Original work, MIT.
 *
 *   SITESMITH_DEPS_DIR=<dir with playwright> node tools/test-manifest-contract-step.mjs
 *
 * A build reported `reads/outside-manifest` for `contract.md`, and the builder chose to
 * document the refusal rather than edit the product's own file to clear its own gate. That was
 * the right call and it left a question worth answering.
 *
 * The three sides of it:
 *
 *   `commands.mjs` refuses to let `build` proceed without a design contract. Exit 3, with a
 *   blocker naming `contract.mjs new`. Every run meets it.
 *
 *   `SKILL.md` declares `contract.md` under a `contract` scenario of its own, not under the
 *   surface scenarios, so a run whose surface is `read` has no declaration for it.
 *
 *   `gate.mjs` checks reads against the surface scenario, and unions in exactly two things:
 *   `scripts/*`, because scripts are executed rather than read, and the whole `inspect`
 *   scenario, on the stated ground that release is a step every run takes.
 *
 * The contract is a step every run takes by the same argument, and it is enforced by a blocker
 * rather than only described. This file proves the contradiction and then that it is closed,
 * without widening the check to anything else: a read-surface run that opens `floor/operate.md`
 * must still be refused, which is the drift the check exists to catch.
 */

import { mkdtemp, rm, writeFile, readFile, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const GATE = join(ROOT, 'skills/sitesmith-v3/scripts/gate.mjs')
const FIXTURE = join(ROOT, 'docs/rebuild/s10/fixtures/scripts/gate/pass')

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n          ${detail}`}`)
  if (!ok) failed += 1
}

/* The known-clean build, with one line added to its report: the file the contract step reads.
   Nothing else about the build changes, so any refusal is about that line alone. */
async function gateWith(opened, scenario = 'buy') {
  const dir = await mkdtemp(join(tmpdir(), 'sitesmith-manifest-'))
  await cp(FIXTURE, dir, { recursive: true })
  const path = join(dir, 'PRODUCTION-REPORT.md')
  let report = await readFile(path, 'utf8')
  report = report.replace(/^Scenario: .*$/m, `Scenario: ${scenario}`)
  report = report.replace(/^(## Files opened\s*\n)/m, `$1${opened.map((f) => `- \`${f}\`\n`).join('')}`)
  await writeFile(path, report, 'utf8')
  const r = spawnSync(process.execPath, [GATE], { cwd: dir, encoding: 'utf8' })
  await rm(dir, { recursive: true, force: true })
  return `${r.stdout}${r.stderr}`
}

/* The class and the path sit on separate lines: `reads/outside-manifest` with the report
   location, and `read <path> is not declared` in the message under it. Matching the class line
   alone finds nothing, which is how the first version of this test reported the contradiction
   as absent when it was there. */
const refusedFor = (out, path) => out.includes(`read ${path} is not declared`)

console.log('\n  the reads manifest against the steps every run takes\n')

/* First: the contradiction is real, and it is real for the reason stated rather than a
   different one. `run.md` never names contract.md; the blocker in `build` is what makes the
   contract unavoidable, and that is what the test rests on. */
const runMd = await readFile(join(ROOT, 'skills/sitesmith-v3/run.md'), 'utf8')
check('run.md does not itself instruct a read of contract.md, so that is not the reason',
  !/contract\.md/.test(runMd))

const commands = await readFile(join(ROOT, 'skills/sitesmith-v3/commands.mjs'), 'utf8')
check('build refuses to proceed without a design contract, which is what makes it unavoidable',
  /no design contract/.test(commands))

const skillMd = await readFile(join(ROOT, 'skills/sitesmith-v3/SKILL.md'), 'utf8')
check('SKILL.md declares contract.md under a scenario of its own, not under the surfaces',
  /contract:\s*\[contract\.md\]/.test(skillMd) && !/read:.*contract\.md/.test(skillMd))

/* The refusal itself. Red before the fix. */
const withContract = await gateWith(['contract.md'])
check('a run that opened contract.md is not refused for it',
  !refusedFor(withContract, 'contract.md'),
  withContract.split('\n').filter((l) => /outside-manifest/.test(l)).slice(0, 2).join('\n          '))

/* The other half of the reported contradiction, and it turned out not to be one. Nothing sends
   a builder to `contract/schema.json`: `contract.md` mentions it once, as the place a v1.1
   candidate is recorded, and the only thing that reads it is `contract.mjs`, a script. It is a
   machine input, and it is 19,726 bytes against a scenario ceiling of 5,200 tokens, so
   declaring it as a read would break the budget the ceiling exists to hold. `contract.mjs
   check` reports every problem in a contract without the builder opening it.

   So this refusal is correct and stays. The build that reported it had read something it did
   not need, and the gate said so. */
const withSchema = await gateWith(['contract/schema.json'])
check('the schema is still refused, because nothing instructs a person to read it',
  refusedFor(withSchema, 'contract/schema.json'),
  withSchema.split('\n').filter((l) => /outside-manifest/.test(l)).slice(0, 2).join('\n          '))

/* And the drift the check exists to catch has to stay caught. The first version of the
   inspect exemption let any file named in any scenario through, which let a read-surface run
   open an operate floor. Widening for the contract must not widen for that. */
const wrongFloor = await gateWith(['floor/operate.md'], 'read')
check('a read-surface run that opened an operate floor is still refused',
  refusedFor(wrongFloor, 'floor/operate.md'),
  wrongFloor.split('\n').filter((l) => /outside-manifest|REFUSED/.test(l)).slice(0, 3).join('\n          '))

const wrongMotion = await gateWith(['motion.md'], 'read')
check('and one that opened the motion file it never declared is still refused',
  refusedFor(wrongMotion, 'motion.md'),
  wrongMotion.split('\n').filter((l) => /outside-manifest|REFUSED/.test(l)).slice(0, 3).join('\n          '))

console.log(`\n  ${failed ? `${failed} failing` : 'the contract step is permitted and undeclared reads are still refused'}\n`)
process.exit(failed ? 1 : 0)
