#!/usr/bin/env node
/**
 * Mechanical review / foundation integrity gate.
 * Fail closed if a decision document claims PASS for a review that is not PASS.
 * Readiness is derived from review frontmatter, never from filenames alone.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const reviewsDir = join(root, 'docs', 'v3', 'reviews');
const foundationPath = join(root, 'docs', 'v3', 'FOUNDATION-DECISION.md');
const statusJsonPath = join(reviewsDir, 'REVIEW-STATUS.json');

const problems = [];
const ok = (msg) => console.log(`ok  ${msg}`);
const fail = (msg) => {
  problems.push(msg);
  console.error(`FAIL ${msg}`);
};

function parseFrontmatter(markdown) {
  const match = String(markdown).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.+?)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

function normalizeStatus(value) {
  const v = String(value ?? '').trim().toLowerCase();
  if (/^(pass|passed|ready)$/.test(v)) return 'pass';
  if (/^(fail|failed|blocked|not-ready|not_ready)$/.test(v)) return 'fail';
  return v || 'unknown';
}

function parseReviewFile(filePath) {
  const text = readFileSync(filePath, 'utf8');
  const fm = parseFrontmatter(text);
  const status = normalizeStatus(fm.status);
  const blockerCount = Number(fm.blockerCount);
  const findings = [];
  const fence = text.match(/```review-findings[ \t]*\n([\s\S]*?)\n```/);
  if (fence) {
    try {
      const envelope = JSON.parse(fence[1]);
      for (const finding of envelope.findings ?? []) {
        if (finding?.id) findings.push(finding);
      }
    } catch {
      /* structural findings optional for integrity of status claims */
    }
  }
  return {
    file: relative(root, filePath).replace(/\\/g, '/'),
    status,
    blockerCount: Number.isFinite(blockerCount) ? blockerCount : null,
    findings,
    text,
    sha256: createHash('sha256').update(text).digest('hex'),
  };
}

const reviewFiles = readdirSync(reviewsDir)
  .filter((name) => /REVIEW-.*\.md$/i.test(name) && name !== 'REVIEW-STATUS.md')
  .map((name) => parseReviewFile(join(reviewsDir, name)))
  .sort((a, b) => a.file.localeCompare(b.file));

if (reviewFiles.length === 0) fail('no review markdown files found');

const byBase = Object.fromEntries(reviewFiles.map((r) => [r.file.split('/').pop(), r]));

// --- frontmatter validity ---
for (const review of reviewFiles) {
  if (!['pass', 'fail'].includes(review.status)) {
    fail(`${review.file}: status must be pass|fail, found ${review.status}`);
  } else {
    ok(`${review.file}: status=${review.status}`);
  }
  if (review.blockerCount === null || review.blockerCount < 0 || !Number.isInteger(review.blockerCount)) {
    fail(`${review.file}: blockerCount must be a non-negative integer`);
  } else if (review.status === 'pass' && review.blockerCount !== 0) {
    fail(`${review.file}: pass requires blockerCount 0, found ${review.blockerCount}`);
  } else if (review.status === 'fail' && review.blockerCount === 0 && !/REVIEW-STATUS/i.test(review.file)) {
    // fail with zero blockers is suspicious but allowed if findings fence says otherwise; warn as fail for readiness
    fail(`${review.file}: fail with blockerCount 0 is inconsistent for readiness derivation`);
  } else {
    ok(`${review.file}: blockerCount=${review.blockerCount}`);
  }
}

// --- derived readiness ---
const tracePass = reviewFiles.filter((r) => /TRACEABILITY/i.test(r.file) && r.status === 'pass' && r.blockerCount === 0);
const advPass = reviewFiles.filter((r) => /ADVERSARIAL/i.test(r.file) && r.status === 'pass' && r.blockerCount === 0);
const derivedReady = tracePass.length >= 1 && advPass.length >= 1;

if (derivedReady) {
  ok('derived readiness: ready-for-architecture-approval (trace+adversarial PASS present)');
} else {
  ok('derived readiness: not-ready-for-architecture-approval (missing paired PASS reviews)');
}

// --- foundation claims must match live review files ---
const foundation = readFileSync(foundationPath, 'utf8');
const foundationFm = parseFrontmatter(foundation);
const foundationStatus = String(foundationFm.status ?? '').toLowerCase();

if (derivedReady) {
  if (foundationStatus !== 'ready-for-architecture-approval') {
    fail(`FOUNDATION status is ${foundationStatus}; derived readiness is ready`);
  }
} else if (foundationStatus === 'ready-for-architecture-approval') {
  fail('FOUNDATION claims ready-for-architecture-approval but reviews do not support it');
} else if (foundationStatus !== 'not-ready-for-architecture-approval') {
  fail(`FOUNDATION status must be not-ready-for-architecture-approval, found ${foundationStatus}`);
} else {
  ok('FOUNDATION status matches derived not-ready');
}

// Explicit PASS/FAIL claim patterns against named review files
const claimPatterns = [
  {
    re: /ADVERSARIAL-REVIEW-C\.md\)?:\s*\*\*PASS/i,
    file: 'ADVERSARIAL-REVIEW-C.md',
    claimed: 'pass',
  },
  {
    re: /\[Adversarial review\]\(\.\/reviews\/ADVERSARIAL-REVIEW-C\.md\):\s*\*\*PASS/i,
    file: 'ADVERSARIAL-REVIEW-C.md',
    claimed: 'pass',
  },
  {
    re: /TRACEABILITY-REVIEW-C\.md\)?:\s*\*\*PASS/i,
    file: 'TRACEABILITY-REVIEW-C.md',
    claimed: 'pass',
  },
];

for (const claim of claimPatterns) {
  if (!claim.re.test(foundation)) continue;
  const review = byBase[claim.file];
  if (!review) {
    fail(`FOUNDATION claims ${claim.claimed} for missing ${claim.file}`);
    continue;
  }
  if (review.status !== claim.claimed) {
    fail(`FOUNDATION claims ${claim.file} is ${claim.claimed} but file is ${review.status}/blockers=${review.blockerCount}`);
  } else {
    ok(`FOUNDATION claim for ${claim.file} matches file (${review.status})`);
  }
}

// Catch any "**PASS, 0 blockers**" near ADVERSARIAL-REVIEW-C
if (/ADVERSARIAL-REVIEW-C[\s\S]{0,200}\*\*PASS,\s*0 blockers\*\*/i.test(foundation)
  || /Adversarial review[\s\S]{0,120}\*\*PASS,\s*0 blockers\*\*/i.test(foundation)) {
  const advC = byBase['ADVERSARIAL-REVIEW-C.md'];
  if (advC && advC.status !== 'pass') {
    fail('FOUNDATION still contains PASS, 0 blockers claim for adversarial review while file is not pass');
  }
}

// READY banner consistency
if (/^READY FOR ARCHITECTURE APPROVAL\s*$/m.test(foundation) && !derivedReady) {
  fail('FOUNDATION ends with READY banner while derived readiness is not-ready');
}
if (/^NOT READY FOR ARCHITECTURE APPROVAL\s*$/m.test(foundation) && derivedReady) {
  fail('FOUNDATION ends with NOT READY banner while derived readiness is ready');
}
if (!derivedReady) ok('FOUNDATION banner/policy consistent with not-ready');

// --- REVIEW-STATUS.json must mirror live files ---
const statusDoc = JSON.parse(readFileSync(statusJsonPath, 'utf8'));
if (statusDoc.architectureReadiness?.status !== (derivedReady ? 'ready-for-architecture-approval' : 'not-ready-for-architecture-approval')) {
  fail(`REVIEW-STATUS.json readiness ${statusDoc.architectureReadiness?.status} != derived`);
} else {
  ok('REVIEW-STATUS.json readiness matches derived verdict');
}

for (const entry of statusDoc.reviews ?? []) {
  const base = entry.file.split('/').pop();
  const live = byBase[base];
  if (!live) {
    fail(`REVIEW-STATUS.json references missing ${entry.file}`);
    continue;
  }
  if (normalizeStatus(entry.status) !== live.status) {
    fail(`REVIEW-STATUS.json ${base} status ${entry.status} != live ${live.status}`);
  }
  if (Number(entry.blockerCount) !== live.blockerCount) {
    fail(`REVIEW-STATUS.json ${base} blockerCount ${entry.blockerCount} != live ${live.blockerCount}`);
  }
}
ok('REVIEW-STATUS.json statuses match live review frontmatter');

// Known claim audit rows must match live
for (const row of statusDoc.claimAudit ?? []) {
  if (row.claim.includes('ADVERSARIAL-REVIEW-C = PASS') && row.match !== false) {
    const live = byBase['ADVERSARIAL-REVIEW-C.md'];
    if (live?.status !== 'pass') fail('claimAudit incorrectly marks ADVERSARIAL-C PASS as match=true');
  }
}

if (problems.length) {
  console.error(`\nreview integrity FAILED (${problems.length})`);
  process.exit(1);
}
console.log(`\nreview integrity PASS (${reviewFiles.length} reviews checked)`);
