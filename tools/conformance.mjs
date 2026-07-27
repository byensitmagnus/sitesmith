#!/usr/bin/env node
/**
 * Does the output obey the skill's own absolute rules? Original work, MIT.
 *
 *   node tools/conformance.mjs benchmarks/09-data-entry/index.html
 *   node tools/conformance.mjs "benchmarks/**\/index.html"     # every page
 *   node tools/conformance.mjs --json <paths...>
 *
 * verify.mjs answers "is this page broken". This answers the different question
 * "did we follow our own rules", which a green CI has never once checked. Every
 * check below cites the rule it enforces, and a rule with no citation does not
 * belong here — if it cannot be pointed at, it is taste, not a rule.
 *
 * Exit 0 clean · 1 violations found · 2 could not run.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { relative, resolve } from 'node:path';
import { expand } from './lib/files.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Strip anything a reader never sees, so comments and CSS cannot trip a copy rule. */
function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ');
}

const RULES = [
  {
    id: 'em-dash',
    cite: '09-block-library.md:125 — "ZERO em-dashes anywhere on the page… non-negotiable"',
    run(html) {
      const text = visibleText(html);
      const n = [...text.matchAll(/&mdash;|—/g)].length;
      return n ? [{ detail: `${n} em-dash${n > 1 ? 'es' : ''}`, count: n }] : [];
    },
  },
  {
    id: 'authored-svg',
    cite: '09-block-library.md:178 — icons from a library only, no hand-rolled SVG paths',
    // One authored <path> is a brand mark and is allowed; a set of them is an icon set.
    run(html) {
      const n = (html.match(/<path\b/g) ?? []).length;
      return n > 1
        ? [{ detail: `${n} authored <path> elements, a brand mark is one and a set is an icon set`, count: n }]
        : [];
    },
  },
  {
    id: 'ai-default-type',
    cite: '09-block-library.md:180 — "No AI Tells (Inter as default…)"',
    run(html) {
      const m = html.match(/font-family:[^;}]*\bInter\b/i);
      return m ? ['Inter used as a font-family'] : [];
    },
  },
  {
    id: 'div-product-preview',
    cite: '05-ai-tells.md:54,84 — no div-built fake product UI in the hero',
    // Simulated application chrome is the ban. A labelled excerpt is not.
    run(html) {
      const hero = html.slice(0, html.search(/<\/header>|<hr\b|<section\b/i) + 1 || html.length);
      const chrome = /class="[^"]*\b(window|titlebar|browser|chrome|toolbar|sidebar|tab-bar|traffic-lights?)\b/i;
      return chrome.test(hero) ? ['hero contains simulated application chrome'] : [];
    },
  },
  {
    id: 'fabricated-proof',
    cite: 'SKILL.md:133 — fabricated testimonials, invented logos, made-up metrics, "Acme", "John Doe"',
    run(html) {
      const text = visibleText(html);
      const tells = [
        /\bAcme\b/i, /\bJohn Doe\b/i, /\bJane (Doe|Smith)\b/i, /Lorem ipsum/i,
        /Unlock your potential/i, /Elevate your workflow/i,
        /\b\d[\d,.]*\+?\s*(happy customers|users worldwide|trusted by)/i,
        /\b99\.9+%\s*uptime/i,
      ];
      return tells.filter((t) => t.test(text)).map((t) => `fabricated-proof phrase: ${t.source}`);
    },
  },
  {
    id: 'placeholder-shipped',
    cite: 'SKILL.md:151 — "no placeholder text presented as a claim"',
    run(html) {
      const text = visibleText(html);
      const n = [...text.matchAll(/\bplaceholder\b/gi)].length;
      return n ? [{ detail: `the word "placeholder" appears ${n} time(s) in visible copy`, count: n }] : [];
    },
  },
  {
    id: 'theme-lock',
    cite: '09-block-library.md:126 — one theme for the whole page, no mid-page inversion',
    run(html) {
      return /prefers-color-scheme/.test(html) ? [] : ['no prefers-color-scheme block — page has one hardcoded theme'];
    },
  },
];

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const writeBaseline = argv.includes('--write-baseline');
const patterns = argv.filter((a) => !a.startsWith('--'));
if (!patterns.length) {
  console.error('usage: node tools/conformance.mjs <file-or-glob>... [--json] [--write-baseline]');
  process.exit(2);
}

/**
 * A ratchet, not a wall. The rules below were never enforced, so the repository
 * already breaks them 21 times — including on pages written the day the checker
 * was. Failing CI on all of that would only get the check switched off, and a
 * report-only check is the same disease that produced the debt.
 *
 * So: the existing violations are recorded once, with a date, and the build fails
 * the moment any count goes up or a new rule is broken. The debt is visible, it
 * cannot grow, and v2 decides which of these rules survive rather than a red
 * pipeline deciding it for us.
 */
const BASELINE = resolve(ROOT, 'tools/conformance-baseline.json');
let baseline = { note: '', recorded: '', files: {} };
try {
  baseline = JSON.parse(await readFile(BASELINE, 'utf8'));
} catch {
  if (!writeBaseline) {
    console.error(`no baseline at ${BASELINE} — create one with --write-baseline`);
    process.exit(2);
  }
}

const files = await expand(patterns, ROOT);
if (!files.length) {
  console.error(`no files matched: ${patterns.join(' ')}`);
  process.exit(2);
}

const report = [];
for (const f of files.sort()) {
  const html = await readFile(resolve(ROOT, f), 'utf8');
  const violations = [];
  for (const rule of RULES) {
    // A rule may return a bare string (one occurrence) or {detail, count}.
    // The ratchet compares occurrences, so a rule that folds 18 em-dashes into
    // one line must still report 18 or the count can never regress.
    for (const hit of rule.run(html)) {
      const { detail, count } = typeof hit === 'string' ? { detail: hit, count: 1 } : hit;
      violations.push({ rule: rule.id, cite: rule.cite, detail, count });
    }
  }
  report.push({ file: relative(ROOT, resolve(ROOT, f)).replace(/\\/g, '/'), violations });
}

const total = report.reduce((n, r) => n + r.violations.reduce((m, v) => m + v.count, 0), 0);

// Occurrences per file per rule, which is what the ratchet compares.
const counts = {};
for (const r of report) {
  const per = {};
  for (const v of r.violations) per[v.rule] = (per[v.rule] ?? 0) + v.count;
  if (Object.keys(per).length) counts[r.file] = per;
}
const scanned = new Set(report.map((r) => r.file));

if (writeBaseline) {
  const { writeFile } = await import('node:fs/promises');
  await writeFile(
    BASELINE,
    JSON.stringify(
      {
        note: 'Violations that already existed when the checker was written. The build fails if any count rises or a new rule is broken. Lower these; never raise them.',
        recorded: process.env.SITESMITH_BASELINE_DATE ?? 'see git log for this file',
        files: counts,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`baseline written: ${Object.keys(counts).length} file(s), ${total} violation(s)`);
  process.exit(0);
}

// Anything above the recorded baseline is a regression and fails.
const regressions = [];
for (const [file, per] of Object.entries(counts)) {
  const was = baseline.files?.[file] ?? {};
  for (const [rule, n] of Object.entries(per)) {
    const before = was[rule] ?? 0;
    if (n > before) regressions.push(`${file}: ${rule} ${before} → ${n}`);
  }
}
// A count that fell is progress worth recording, not a failure.
const improvements = [];
for (const [file, was] of Object.entries(baseline.files ?? {})) {
  // Only files in this run. Otherwise scanning one page reports the other ten as fixed.
  if (!scanned.has(file)) continue;
  for (const [rule, before] of Object.entries(was)) {
    const now = counts[file]?.[rule] ?? 0;
    if (now < before) improvements.push(`${file}: ${rule} ${before} → ${now}`);
  }
}

if (asJson) {
  console.log(JSON.stringify({ files: report.length, violations: total, regressions, improvements, report }, null, 2));
} else {
  console.log(`\n  conformance — the skill's own absolute rules, on its own output\n`);
  for (const r of report) {
    const mark = r.violations.length ? `${String(r.violations.length).padStart(3)} ✗` : '  0 ✓';
    console.log(`  ${mark}  ${r.file}`);
    const seen = new Set();
    for (const v of r.violations) {
      const key = `${v.rule}|${v.detail}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`         ${v.rule.padEnd(22)} ${v.detail}`);
    }
  }
  const byRule = {};
  for (const r of report) for (const v of r.violations) (byRule[v.rule] ??= []).push(v.cite);
  if (total) {
    console.log(`\n  rules broken:`);
    for (const [id, hits] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`    ${String(hits.length).padStart(3)}×  ${id}`);
      console.log(`          ${hits[0]}`);
    }
  }
  for (const line of improvements) console.log(`\n  improved: ${line}`);
  for (const line of regressions) console.log(`\n  REGRESSION: ${line}`);
  console.log(
    `\n  ${total} violation(s) across ${report.filter((r) => r.violations.length).length} of ${report.length} file(s), ` +
      `all recorded in the baseline.\n  ${
        regressions.length === 0
          ? 'PASS — nothing new broken'
          : `FAIL — ${regressions.length} regression(s) past the baseline`
      }\n`,
  );
  if (improvements.length) {
    console.log('  Some counts fell. Re-record with --write-baseline so they cannot climb back.\n');
  }
}

process.exit(regressions.length === 0 ? 0 : 1);
