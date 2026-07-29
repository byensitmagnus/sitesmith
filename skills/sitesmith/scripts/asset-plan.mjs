#!/usr/bin/env node
/**
 * The asset plan gate. Original work, MIT.
 *
 *   node asset-plan.mjs check ASSET-PLAN.md
 *   node asset-plan.mjs check ASSET-PLAN.md --manifest ASSET-MANIFEST.md --direction DIRECTION.md
 *
 * Two assignment-blinded reviewers scored three independently built sites, and assets came back
 * the lowest criterion on every one: 6 out of 10 on five of six reviews. Every picture involved
 * existed, was licensed, was recorded in the manifest and was cropped correctly. The sourcing
 * engine had done its job. What was missing was the step before it — what each picture is for.
 *
 * So this gate asks, per asset, the question nobody had written down: what does the visitor
 * learn or gain because this exists, and which job from the brief does it serve. An asset whose
 * `carries:` line cannot be written is decoration, and decoration is what a generated page looks
 * like from across the room.
 *
 * It deliberately makes **no component mandatory**. There is no rule here that a page must have
 * a hero image, a logo wall, or one of each kind. The rules are that the assets present must be
 * the ones the page needs, that a page inviting a comparison must actually enable it, and that
 * borrowed credibility — customer and certification logos — must rest on named evidence.
 *
 * Exit 0 the plan holds · 1 findings · 2 could not run.
 */

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const KINDS = ['brand', 'product', 'editorial', 'proof'];
export const FIELDS = ['kind', 'carries', 'job', 'use', 'comparative', 'without-it', 'evidence'];

/* Phrases that are the shape of an answer rather than an answer. `carries:` exists to be hard
   to fill in; a line that could be pasted under any asset on any site has not been filled in. */
const EMPTY_CARRIES = [
  /^\s*(it\s+)?(makes|make)\s+the\s+page\s+(look\s+)?(less\s+empty|better|nicer|complete)/i,
  /^\s*(visual\s+)?(interest|appeal|balance|weight)\b/i,
  /^\s*builds?\s+trust\s*\.?\s*$/i,
  /^\s*(adds?\s+)?(credibility|professionalism|polish)\s*\.?\s*$/i,
  /^\s*breaks?\s+up\s+the\s+(text|page|copy)/i,
  /^\s*fills?\s+(the\s+)?(space|section|gap)/i,
  /^\s*(sets?\s+)?(the\s+)?(tone|mood|atmosphere)\s*\.?\s*$/i,
  /^\s*(shows?\s+)?(what\s+)?we\s+do\s*\.?\s*$/i,
  /^\s*nothing\b/i,
];

/* A job line has to come from a brief, so it names something a person is trying to finish.
   These are the abstractions that get written when it does not. */
const NON_JOBS = [
  /^\s*(build|building|establish|establishing)\s+trust/i,
  /^\s*(brand\s+)?awareness\b/i,
  /^\s*engagement\b/i,
  /^\s*convert(ing)?\s*\.?\s*$/i,
  /^\s*learn\s+(more\s+)?about\s+us\b/i,
];

/** Parse the plan. One block per asset, headed by a code span, then `- field: value` lines. */
export function parsePlan(markdown) {
  const out = [];
  const blocks = String(markdown).split(/^##\s+/m).slice(1);
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const head = lines[0].trim();
    const m = head.match(/^`([^`]+)`\s*$/);
    if (!m) continue; // prose sections are not assets
    const fields = {};
    for (const line of lines.slice(1)) {
      const f = line.match(/^\s*-\s*([a-z-]+)\s*:\s*(.+?)\s*$/i);
      if (f) fields[f[1].toLowerCase()] = f[2].trim();
    }
    out.push({ id: m[1].trim(), fields });
  }
  return out;
}

/** Rows of an ASSET-MANIFEST.md table, keyed by id. */
export function parseManifest(markdown) {
  const rows = [];
  for (const line of String(markdown).split(/\r?\n/)) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length < 8 || !/^`[^`]+`$/.test(cells[1] ?? '')) continue;
    rows.push({
      id: cells[1].replace(/`/g, ''), what: cells[2], where: cells[3], source: cells[4],
      licence: cells[5], state: (cells[6] ?? '').replace(/\*/g, '').toLowerCase(), focal: cells[7],
    });
  }
  return rows;
}

/** `imagery: deliberately imageless` is the one direction that excuses a page with no
 *  load-bearing asset, because it says so on purpose instead of drifting into it. */
export function imageryIsLoadBearing(directionMd) {
  const m = String(directionMd ?? '').match(/^\s*-\s*imagery\s*:\s*(.+)$/mi);
  if (!m) return null;
  return !/\b(imageless|no imagery|type[- ]only|typographic only|figures only)\b/i.test(m[1]);
}

export function judge(plan, { manifest = null, direction = null } = {}) {
  const findings = [];
  const notes = [];
  const add = (where, what, why) => findings.push({ where, what, why });

  if (!plan.length) {
    add('ASSET-PLAN.md', 'no asset blocks',
      'one "## `id`" block per asset — see v2/24-asset-plan.md, "The plan, verbatim"');
    return { findings, notes };
  }

  const seen = new Set();
  for (const { id, fields } of plan) {
    if (seen.has(id)) add(id, 'two blocks share this id', 'an id names one asset');
    seen.add(id);

    const missing = FIELDS.filter((f) => !fields[f]);
    if (missing.length) {
      add(id, `no ${missing.join(', ')}`,
        'every field is required; the plan is a contract, and prose headings do not parse');
      continue; // the rest of the checks read fields that are not there
    }

    if (!KINDS.includes(fields.kind.toLowerCase())) {
      add(id, `kind "${fields.kind}" is not one of ${KINDS.join(', ')}`,
        'the kind decides what the asset has to earn');
    }

    if (EMPTY_CARRIES.some((re) => re.test(fields.carries))) {
      add(id, `carries: "${fields.carries}" says nothing about this subject`,
        'if the honest answer is that it fills space, the asset is cut — that is the test');
    } else if (fields.carries.split(/\s+/).length < 4) {
      add(id, `carries: "${fields.carries}" is too short to be an argument`,
        'name the one thing the visitor learns or can do because this exists');
    }

    if (NON_JOBS.some((re) => re.test(fields.job))) {
      add(id, `job: "${fields.job}" is an objective, not a job`,
        'take the job from the brief — something a person is trying to finish');
    }

    if (!/^(yes|no)\b/i.test(fields.comparative)) {
      add(id, `comparative: "${fields.comparative}" must begin yes or no`,
        'the gate reads this to check that a page inviting a choice enables it');
    }

    if (/^\s*nothing\s*\.?\s*$/i.test(fields['without-it'])) {
      add(id, 'without-it: nothing', 'then the page does not need it — cut it');
    }

    const kind = fields.kind.toLowerCase();
    const ev = fields.evidence;
    const evidenceIsNone = /^none\b/i.test(ev);
    if (kind === 'proof' && evidenceIsNone) {
      add(id, 'a proof asset resting on no evidence',
        'proof that cannot be traced to EVIDENCE.md is decoration wearing a lab coat');
    }
    if (evidenceIsNone && !/none\s*[-—–]\s*(brand asset|drawn for this project)/i.test(ev)) {
      add(id, `evidence: "${ev}" is neither a source nor a stated exemption`,
        'either cite the EVIDENCE.md line, or say "none — brand asset" / "none — drawn for this project"');
    }

    /* Borrowed credibility. Named, sourced, licensed, and never stood in for. */
    if (/\b(client|customer|partner|logo-wall|logos|certification|accreditation|badge)\b/i.test(id) &&
        !/^logo-primary$|^favicon$/i.test(id)) {
      if (evidenceIsNone) {
        add(id, 'other people\'s marks resting on no evidence',
          'a customer or certification logo needs a named, sourced line in EVIDENCE.md — ' +
          'without one the page does not have a logo wall');
      }
      const row = manifest?.find((r) => r.id === id);
      if (row && row.state === 'substitute') {
        add(id, 'a substitute customer logo', 'a stand-in endorsement is a fabricated endorsement');
      }
      if (row && !row.licence) {
        add(id, 'no licence recorded for a mark that is not ours', 'permission is the whole question here');
      }
    }
  }

  /* The comparison rule. If any asset says the visitor's job is to choose between things,
     something on the page has to make that possible in one frame. */
  const choosing = plan.filter(({ fields }) =>
    /\b(compare|comparing|choose|choosing|pick|select|which|between|against|versus|vs\b)/i
      .test(`${fields.job ?? ''} ${fields.carries ?? ''}`));
  if (choosing.length && !plan.some(({ fields }) => /^yes\b/i.test(fields.comparative ?? ''))) {
    add('ASSET-PLAN.md',
      `${choosing.length} asset(s) serve a job of choosing between things, and none is comparative`,
      'a page that invites a comparison and shows the options a screen apart has mentioned ' +
      'the comparison, not made it possible');
  }

  /* The load-bearing rule, with its second door. */
  const loadBearing = plan.some(({ fields }) =>
    !/^\s*nothing\s*\.?\s*$/i.test(fields['without-it'] ?? 'nothing'));
  const declaredImagery = imageryIsLoadBearing(direction);
  if (!loadBearing && declaredImagery !== false) {
    add('ASSET-PLAN.md', 'no asset is load-bearing, and the direction does not say imagery is not',
      'either an asset carries the visitor\'s job, or DIRECTION.md declares imagery is not ' +
      'load-bearing and the typography does that work — there is no third door');
  }
  if (declaredImagery === false && plan.some(({ fields }) =>
        ['product', 'editorial'].includes((fields.kind ?? '').toLowerCase()))) {
    notes.push('the direction declares imagery is not load-bearing, and the plan carries ' +
               'product or editorial assets — check the two still agree');
  }

  /* Every planned asset has to survive into the manifest, or the plan is a wish. */
  if (manifest) {
    for (const { id } of plan) {
      if (!manifest.some((r) => r.id === id)) {
        add(id, 'planned but not in ASSET-MANIFEST.md', 'a plan the manifest does not carry is a wish');
      }
    }
    for (const row of manifest) {
      if (/^(favicon)$/i.test(row.id)) continue;
      if (!plan.some((p) => p.id === row.id)) {
        notes.push(`${row.id} is in the manifest with no block in the plan`);
      }
    }
  }

  return { findings, notes };
}

/* ── run ─────────────────────────────────────────────────────────────────── */

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const args = process.argv.slice(2);
  const VALUE_FLAGS = new Set(['manifest', 'direction']);
  const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };

  /* Walk the argv once, skipping each value flag's value, so `check P --manifest M` does not
     read M as a positional. Filtering with indexOf gets this wrong the moment two arguments
     are equal, which is exactly the sort of bug that only shows up on someone else's paths. */
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) { if (VALUE_FLAGS.has(args[i].slice(2))) i++; continue; }
    positional.push(args[i]);
  }
  const [cmd, planPath] = positional;

  if (cmd !== 'check' || !planPath) {
    console.error('usage: asset-plan.mjs check ASSET-PLAN.md [--manifest ASSET-MANIFEST.md] [--direction DIRECTION.md]');
    process.exit(2);
  }

  const md = await readFile(planPath, 'utf8').catch(() => null);
  if (md === null) {
    console.log(`\n  asset plan\n\n  FAIL  ${planPath} does not exist.`);
    console.log('        The plan is written after the direction and before anything is sourced.');
    console.log('        See v2/24-asset-plan.md.\n');
    process.exit(1);
  }

  const manifestPath = flag('manifest');
  const directionPath = flag('direction');
  const manifest = manifestPath ? parseManifest(await readFile(manifestPath, 'utf8')) : null;
  const direction = directionPath ? await readFile(directionPath, 'utf8') : null;

  const plan = parsePlan(md);
  const { findings, notes } = judge(plan, { manifest, direction });

  console.log(`\n  asset plan — ${planPath}\n`);
  for (const { id, fields } of plan) {
    console.log(`  ${id.padEnd(20)} ${(fields.kind ?? '—').padEnd(10)} ` +
      `${/^yes\b/i.test(fields.comparative ?? '') ? 'comparative' : '           '}  ` +
      `${(fields.carries ?? '—').slice(0, 60)}`);
  }
  console.log('');
  for (const f of findings) console.log(`  FAIL  ${f.where}: ${f.what}\n        ${f.why}`);
  for (const n of notes) console.log(`  note  ${n}`);
  console.log(`\n  ${findings.length === 0
    ? `PASS — ${plan.length} asset(s), each one carrying something`
    : `FAIL — ${findings.length} finding(s)`}\n`);
  process.exit(findings.length === 0 ? 0 : 1);
}
