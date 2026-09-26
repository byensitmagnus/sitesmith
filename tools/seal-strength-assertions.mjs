#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contractPath = path.join(root, 'docs', 'v3', 'STRENGTH-ASSERTIONS.json');
const qualityPath = 'docs/v3/QUALITY-CONTRACT.md';
const architecturePath = 'docs/v3/DERIVATION-ARCHITECTURE.md';
const write = process.argv.includes('--write');
const versionIndex = process.argv.indexOf('--version');
const requestedVersion = versionIndex >= 0 ? process.argv[versionIndex + 1] : undefined;

if (versionIndex >= 0 && !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(requestedVersion ?? '')) {
  throw new Error('--version requires a stable semantic version such as 2.0.0');
}

const fixedFailureSemantics = Object.freeze({
  missing: 'fail',
  inconclusive: 'fail',
  unmeasurable: 'fail',
  postUnblindingWaiver: 'fail',
  negativeControl: 'required',
  denominator: 'retain-all-assigned-and-applicable',
});

function sha256Bytes(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function fileSha256(relativePath) {
  return sha256Bytes(fs.readFileSync(path.join(root, relativePath)));
}

function frontmatterValue(markdown, key) {
  if (!markdown.startsWith('---')) return undefined;
  const end = markdown.indexOf('\n---', 3);
  if (end < 0) return undefined;
  const match = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(markdown.slice(3, end));
  return match?.[1]?.replace(/^['"]|['"]$/g, '');
}

function stableCanonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableCanonicalJson).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => (
      `${JSON.stringify(key)}:${stableCanonicalJson(value[key])}`
    )).join(',')}}`;
  }
  return JSON.stringify(value);
}

function stableJsonSha256(value) {
  return sha256Bytes(stableCanonicalJson(value));
}

function comparisonFor(assertion) {
  if (assertion.rejectionTreatment?.classification === 'deliberate-rejection') {
    return { mode: 'exclusion', margin: null };
  }
  const margin = assertion.nonInferiorityMargin ?? null;
  const estimand = margin?.estimand ?? '';
  if (estimand.includes('seven-point')) {
    return { mode: 'seven-point-non-inferiority', margin };
  }
  if (estimand.includes('binary capability success rate') && estimand.includes('percentage points')) {
    return { mode: 'binary-rate-non-inferiority', margin };
  }
  return { mode: 'exact-binary', margin: null };
}

function policyBindingsFor(assertion, sourceOfTruth) {
  const sourcesByPath = new Map(Object.values(sourceOfTruth)
    .filter((source) => source?.path)
    .map((source) => [source.path, source]));
  return [...assertion.policyRefs].sort().map((policyRef) => {
    const source = sourcesByPath.get(policyRef);
    if (!source) throw new Error(`${assertion.capabilityId}: unresolved policy ref ${policyRef}`);
    return {
      path: source.path,
      ...(source.contractVersion !== undefined
        ? { contractVersion: source.contractVersion }
        : { architectureVersion: source.architectureVersion }),
      sha256: source.sha256,
    };
  });
}

function verdictPredicate(assertion, sourceOfTruth) {
  return {
    gateId: assertion.qcGate,
    subgateId: assertion.subgate,
    policyBindings: policyBindingsFor(assertion, sourceOfTruth),
    observableMeasureSha256: stableJsonSha256(assertion.observableMeasure),
    fixtures: {
      assertionFixture: assertion.fixture,
      applicableBriefsOrSystemFixture: assertion.applicableBriefsOrSystemFixture,
    },
    comparison: comparisonFor(assertion),
    negativeControlSha256: stableJsonSha256(assertion.negativeControl),
    resultPath: assertion.artifactPath,
    failureSemantics: fixedFailureSemantics,
  };
}

const original = fs.readFileSync(contractPath, 'utf8');
const contract = JSON.parse(original);
const qualityMarkdown = fs.readFileSync(path.join(root, qualityPath), 'utf8');
const architectureMarkdown = fs.readFileSync(path.join(root, architecturePath), 'utf8');
const contractVersion = frontmatterValue(qualityMarkdown, 'contractVersion');
const architectureVersion = frontmatterValue(architectureMarkdown, 'architectureVersion');
if (!contractVersion || !architectureVersion) {
  throw new Error('quality and architecture frontmatter versions are required before sealing');
}

contract.schemaVersion = '2.0.0';
contract.sourceOfTruth = {
  ...contract.sourceOfTruth,
  canonicalLedger: {
    path: 'docs/v3/UPSTREAM-CAPABILITY-LEDGER.json',
    sha256: fileSha256('docs/v3/UPSTREAM-CAPABILITY-LEDGER.json'),
  },
  readableLedger: {
    path: 'docs/v3/UPSTREAM-CAPABILITY-LEDGER.md',
    sha256: fileSha256('docs/v3/UPSTREAM-CAPABILITY-LEDGER.md'),
  },
  supremacyMatrix: {
    path: 'docs/v3/CAPABILITY-SUPREMACY-MATRIX.md',
    sha256: fileSha256('docs/v3/CAPABILITY-SUPREMACY-MATRIX.md'),
  },
  qualityContract: {
    path: qualityPath,
    contractVersion,
    sha256: fileSha256(qualityPath),
  },
  derivationArchitecture: {
    path: architecturePath,
    architectureVersion,
    sha256: fileSha256(architecturePath),
  },
};

for (const assertion of contract.assertions) {
  if (requestedVersion) assertion.assertionVersion = requestedVersion;
  if (!assertion.assertionVersion) {
    throw new Error(`${assertion.capabilityId}: missing assertionVersion; pass --version`);
  }
  delete assertion.exactBinaryRule;
  assertion.policyRefs = assertion.capabilityId === 'IMP-002'
    ? [qualityPath, architecturePath]
    : [qualityPath];
  assertion.verdictPredicate = verdictPredicate(assertion, contract.sourceOfTruth);
  assertion.semanticSha256 = stableJsonSha256(assertion.verdictPredicate);
}

const sealed = `${JSON.stringify(contract, null, 2)}\n`;
if (!write) {
  if (sealed !== original.replace(/\r\n/g, '\n')) {
    console.error('FAIL — StrengthAssertion seal is stale; run with --write and an intentional --version');
    process.exit(1);
  }
  console.log('PASS — StrengthAssertion seal matches current policies and assertion inputs');
  process.exit(0);
}

fs.writeFileSync(contractPath, sealed, 'utf8');
console.log(`WROTE ${path.relative(root, contractPath)} — ${contract.assertions.length} assertions sealed`);
