#!/usr/bin/env node
// The test of the budget gate.
//
// A gate that cannot fail is decoration, and a gate that cannot pass is noise. The old
// version of context-budget.mjs always exited 0 while three architecture candidates
// cited it as the check that made acceptance criterion A3 measured. So this suite
// requires the gate to do both, on fixtures whose expected verdict is fixed in advance.
//
//   node tools/test-context-budget.mjs

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FIX = 'docs/rebuild/s10/fixtures'

const CASES = [
  { dir: `${FIX}/pass`, expect: 0, why: 'every scenario is under its ceiling' },
  { dir: `${FIX}/fail-over-ceiling`, expect: 1, why: 'a scenario exceeds its ceiling' },
  { dir: `${FIX}/fail-missing-file`, expect: 1, why: 'a declared file does not exist, which is how a manifest shrinks until the numbers look good' },
  { dir: `${FIX}/fail-ungated`, expect: 1, why: 'a scenario has no ceiling, and an ungated budget is not a measured one' },
  { dir: 'skills/sitesmith', expect: 0, why: 'the pre-rebuild tree has no manifest; the legacy path reports and must never gate' },
]

let failed = 0
for (const c of CASES) {
  const r = spawnSync(process.execPath, ['tools/context-budget.mjs', c.dir], { cwd: root, encoding: 'utf8' })
  const ok = r.status === c.expect
  if (!ok) failed++
  console.log(`${ok ? '  ok  ' : '  FAIL'} ${c.dir} -> exit ${r.status}, expected ${c.expect}  (${c.why})`)
}

console.log(failed ? `\n${failed} case(s) failed` : '\nall clear')
process.exit(failed ? 1 : 0)
