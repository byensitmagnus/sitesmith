#!/usr/bin/env node
/**
 * The visual critique gate, enforced. Original work, MIT.
 *
 *   node scripts/critique-gate.mjs <dir>
 *
 * <dir> holds one `CRITIQUE-<reviewer>.md` per reviewer and one `key.json`. The rules are in
 * v2/50-critique.md; this is the part of them a script can hold.
 *
 * It exists because a blind review that is only described is a blind review that will not
 * happen. The three things most likely to go wrong are: one reviewer instead of two, the key
 * opened before the reviews were locked, and a good average hiding the one criticism that
 * matters. All three fail here.
 *
 * A review file:
 *
 *     ---
 *     reviewer: A
 *     locked: 2026-07-28T09:12:00Z
 *     sha256: <hash of the body below, excluding this frontmatter>
 *     ---
 *     primary-criticism: The price is the smallest figure on a page about price.
 *     direction: 8
 *     specificity: 9
 *     type: 7
 *     colour: 8
 *     assets: 8
 *     hierarchy: 7
 *     production-readiness: 8
 *
 * key.json:  { "opened": "<ISO timestamp or null>", "labels": { "L1": "…" } }
 */

import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

export const CRITERIA = ['direction', 'specificity', 'type', 'colour', 'assets',
                         'hierarchy', 'production-readiness'];
export const THRESHOLD = 8;      // median production-readiness must reach this
export const FLOOR = 4;          // no criterion may score below this from either reviewer

/** The failure mode the whole v2.1 layer exists to prevent. Matched against the reviewer's
 *  one-sentence answer to "what is the main thing wrong with this page". */
export const GENERIC_TELLS = [
  /\bgeneric\b/i, /\bAI[- ]?(generated|template|slop)\b/i, /\btemplate\b/i,
  /\bcould be any (company|business|brand)\b/i, /\binterchangeable\b/i,
  /\bboilerplate\b/i, /\boff[- ]the[- ]shelf\b/i, /\blooks like every other\b/i,
];

export const isGenericCriticism = (s) => GENERIC_TELLS.some((re) => re.test(String(s)));

/** Where in a line the tell was found, or -1. Needed because the whole-review scan has to look
 *  at what comes *before* the word, and `.test` does not say where it matched. */
export const genericTellAt = (s) => {
  let best = -1;
  for (const re of GENERIC_TELLS) {
    const m = String(s).match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'));
    if (!m) continue;
    const i = String(s).search(new RegExp(re.source, re.flags));
    if (i >= 0 && (best === -1 || i < best)) best = i;
  }
  return best;
};

/** A reviewer who writes "that is the behaviour of a business that sells off coils, not a
 *  generic disabled state" has said the opposite of the failure, and so has "the difference
 *  between a foundry and a template". The scan below reads whole lines, and matching the word
 *  without reading the clause turned three praising sentences into three gate failures on a
 *  real review. Negation and contrast are checked in the run-up to the match.
 *
 *  "not just generic" and "not only a template" are deliberately NOT negations: they concede
 *  the failure and then add to it. */
const NEGATORS = [
  /\bnot\s+(?!just\b|only\b|merely\b|simply\b)(?:a |an |the |another |some |any )?[\w -]{0,24}$/i,
  /\bnever\b[\w ,'-]{0,24}$/i,
  /\brather than\s+(?:a |an |the )?[\w -]{0,16}$/i,
  /\binstead of\s+(?:a |an |the )?[\w -]{0,16}$/i,
  /\bunlike\s+(?:a |an |the )?[\w -]{0,16}$/i,
  /\bfar from\s+(?:a |an |the )?[\w -]{0,16}$/i,
  /\banything but\s+(?:a |an |the )?[\w -]{0,16}$/i,
  /\b(?:difference|distance|gap|distinction)\s+between\b[\w ,'-]{0,40}$/i,
  /\b(?:avoids?|escapes?|refuses?|resists?|sidesteps?)\b[\w ,'-]{0,24}$/i,
  /\bno\s+(?:trace|hint|sign|whiff|sense)\s+of\b[\w ,'-]{0,16}$/i,
];

/** The tell is present but the clause denies it. Returns false when there is no tell at all. */
export function genericMentionIsDenied(line) {
  const at = genericTellAt(line);
  if (at < 0) return false;
  const before = String(line).slice(0, at);
  return NEGATORS.some((re) => re.test(before));
}

/** Sentences, not lines. A review is prose and prose wraps: "which is the difference / between
 *  a foundry and a template" is one clause and two lines, and reading it a line at a time threw
 *  the negation away and failed a review for praising the page. Blank lines stay paragraph
 *  breaks so a sentence cannot be assembled across two of them. */
export function sentences(body) {
  return String(body ?? '')
    .split(/\n\s*\n/)
    .flatMap((para) => para.replace(/\s*\n\s*/g, ' ').split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

export const median = (xs) => {
  const a = [...xs].sort((x, y) => x - y);
  return a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2;
};

/** Split frontmatter from body, and hash the body exactly as the reviewer would have. */
export function parseReview(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { error: 'no frontmatter' };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  const body = m[2];
  const scores = {};
  let primary = null;
  for (const line of body.split('\n')) {
    const kv = line.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!kv) continue;
    if (kv[1] === 'primary-criticism') primary = kv[2];
    else if (CRITERIA.includes(kv[1])) scores[kv[1]] = Number(kv[2]);
  }
  return { meta, body, scores, primary,
           bodyHash: createHash('sha256').update(body.trim()).digest('hex') };
}

/** Every field a locked review has to carry so the ceremony can be shown to have happened
 *  rather than described. */
export const REQUIRED_META = ['reviewer', 'reviewer-id', 'run-id', 'label', 'locked', 'sha256',
                              'brief-sha256', 'rubric-sha256', 'sheet-sha256'];

export function judge({ reviews, key }) {
  const problems = [];
  const denials = [];

  /* The reviewers must not be whoever built the thing. A build agent reviewing its own work
     blind is still the build agent. */
  const builtBy = key?.['built-by'] ?? key?.builtBy ?? null;
  if (!builtBy) {
    problems.push('key.json does not say who built the work (`built-by`), so it cannot be ' +
      'shown that the reviewers were not the builder');
  }
  for (const r of reviews) {
    const id = r.meta?.['reviewer-id'];
    if (builtBy && id && String(id).toLowerCase() === String(builtBy).toLowerCase()) {
      problems.push(`${r.meta.reviewer} is the build agent (${builtBy}). A builder reviewing ` +
        'its own work blind is still the builder.');
    }
  }

  /* Every review must be bound to the same brief, rubric and contact sheets, by hash. Two
     reviewers scoring different screenshots are not two reviews of one thing. */
  for (const field of ['brief-sha256', 'rubric-sha256', 'sheet-sha256', 'run-id']) {
    const values = new Set(reviews.map((r) => r.meta?.[field]).filter(Boolean));
    if (values.size > 1) {
      problems.push(`the reviews disagree on ${field}: ${[...values].map((v) => String(v).slice(0, 12)).join(' vs ')}. ` +
        'They were not looking at the same thing.');
    }
  }

  /* Labels must be randomised and distinct per review, so neither reviewer can infer which
     page they are scoring from the label alone. */
  const labels = reviews.map((r) => r.meta?.label).filter(Boolean);
  if (labels.some((l) => /chandlery|foundry|cask|pilot|with|without|sitesmith/i.test(l))) {
    problems.push(`a label names the subject (${labels.join(', ')}); it has to be opaque`);
  }

  if (reviews.length < 2) {
    problems.push(`a blind review needs two independent reviewers; found ${reviews.length}. ` +
      'One reviewer is an opinion, and a reviewer who knows which page is which finds reasons.');
  }

  const names = new Set(reviews.map((r) => r.meta?.reviewer));
  if (reviews.length >= 2 && names.size < reviews.length) {
    problems.push('two review files carry the same reviewer name, so they are not independent');
  }

  for (const r of reviews) {
    const who = r.meta?.reviewer ?? r.file;
    if (r.error) { problems.push(`${r.file}: ${r.error}`); continue; }
    for (const f of REQUIRED_META) {
      if (!r.meta[f]) problems.push(`${who} carries no ${f}`);
    }
    if (!r.meta.sha256) problems.push(`${who} carries no sha256, so it cannot be shown unchanged`);
    else if (r.meta.sha256 !== r.bodyHash) {
      problems.push(`${who} was edited after locking: recorded ${r.meta.sha256.slice(0, 12)}, ` +
        `body hashes to ${r.bodyHash.slice(0, 12)}`);
    }
    const missing = CRITERIA.filter((c) => !Number.isFinite(r.scores[c]));
    if (missing.length) problems.push(`${who} did not score: ${missing.join(', ')}`);
    if (!r.primary) problems.push(`${who} gave no primary criticism`);
    for (const [c, v] of Object.entries(r.scores)) {
      if (v < FLOOR) problems.push(`${who} scored ${c} ${v}, below the floor of ${FLOOR}`);
    }
  }

  /* The key must not have been opened before every review was locked. */
  if (!key || key.opened === undefined) {
    problems.push('key.json is missing or has no `opened` field, so the order cannot be shown');
  } else if (key.opened === null) {
    problems.push('the key was never opened. A blind review is only finished when the mapping ' +
      'is revealed and recorded, after both reviews are locked.');
  } else {
    const opened = Date.parse(key.opened);
    for (const r of reviews) {
      const locked = Date.parse(r.meta?.locked ?? '');
      if (!Number.isFinite(locked)) continue;
      if (opened < locked) {
        problems.push(`the key was opened at ${key.opened}, before ${r.meta.reviewer} locked ` +
          `at ${r.meta.locked}. That reviewer knew which page they were scoring.`);
      }
    }
  }

  /* The generic-template test. Scanned across the whole review, not only the one-sentence
     answer: a reviewer who buries "could be any consultancy" in the specificity note has
     said the same thing, and reading only the headline lets it through. */
  for (const r of reviews) {
    const who = r.meta?.reviewer ?? r.file;
    if (r.primary && isGenericCriticism(r.primary)) {
      problems.push(`${who} names the generic-template failure as the main problem: ` +
        `"${r.primary}". That fails regardless of the scores.`);
      continue;
    }
    const lines = sentences(r.body).filter((line) => isGenericCriticism(line));
    const hit = lines.find((line) => !genericMentionIsDenied(line));
    if (hit) {
      problems.push(`${who} raises the generic-template failure inside the review: ` +
        `"${hit.trim().slice(0, 120)}"`);
    }
    /* A denial is reported rather than dropped. The gate deciding on its own that a sentence
       does not count is exactly the kind of silent judgement this file exists to prevent. */
    for (const line of lines.filter((l) => genericMentionIsDenied(l))) {
      denials.push(`${who} names the failure only to deny it, so it does not count against ` +
        `the review: "${line.trim().slice(0, 120)}"`);
    }
  }

  const readiness = reviews.map((r) => r.scores?.['production-readiness'])
    .filter((n) => Number.isFinite(n));
  const med = readiness.length ? median(readiness) : null;
  if (med === null) problems.push('no production-readiness scores to take a median of');
  else if (med < THRESHOLD) {
    problems.push(`median production-readiness is ${med}, under the threshold of ${THRESHOLD}`);
  }

  const spread = readiness.length >= 2 ? Math.max(...readiness) - Math.min(...readiness) : 0;
  const notes = spread >= 3
    ? [`the reviewers disagree by ${spread} points on production-readiness. That is not ` +
       'averaged away: the median stands and the disagreement is the finding.']
    : [];
  notes.push(...denials);

  return { pass: problems.length === 0, problems, median: med, spread, notes,
           reviewers: reviews.length };
}

/* ── run ───────────────────────────────────────────────────────────────── */

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
    process.argv[1]?.endsWith('critique-gate.mjs')) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: critique-gate.mjs <dir with CRITIQUE-*.md and key.json>'); process.exit(2); }

  const entries = await readdir(dir).catch(() => {
    console.error(`no such directory: ${dir}`); process.exit(2);
  });
  const reviews = [];
  for (const f of entries.filter((n) => /^CRITIQUE-.+\.md$/.test(n)).sort()) {
    reviews.push({ file: f, ...parseReview(await readFile(join(dir, f), 'utf8')) });
  }
  const key = await readFile(join(dir, 'key.json'), 'utf8').then(JSON.parse, () => null);

  const v = judge({ reviews, key });
  console.log(`\n  critique gate — ${v.reviewers} reviewer(s)` +
    (v.median !== null ? `, median production-readiness ${v.median}` : '') + '\n');
  for (const p of v.problems) console.log(`  FAIL  ${p}`);
  for (const n of v.notes) console.log(`  note  ${n}`);
  console.log(`\n  ${v.pass ? 'PASS — the review stands' : `FAIL — ${v.problems.length} problem(s)`}\n`);
  process.exit(v.pass ? 0 : 1);
}
