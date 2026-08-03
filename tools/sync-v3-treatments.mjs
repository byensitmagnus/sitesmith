#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ledgerPath = path.join(root, 'docs', 'v3', 'UPSTREAM-CAPABILITY-LEDGER.json');
const matrixPath = path.join(root, 'docs', 'v3', 'CAPABILITY-SUPREMACY-MATRIX.md');
const write = process.argv.includes('--write');

function splitTableRow(line) {
  const escapedPipe = '\u0000';
  return line.replace(/\\\|/g, escapedPipe).split('|').slice(1, -1)
    .map((cell) => cell.replaceAll(escapedPipe, '|').trim());
}

const integrationDefinitions = [
  ['clean-room-standard', 'clean-room reimplementation', 'clean-room reimplementation — Implement natively; upstream remains a behavioural reference and copied expression remains provenance-tracked.'],
  ['spec-compatible-standard', 'spec-compatible reimplementation', 'spec-compatible reimplementation — Adapt semantics behind the module interface; do not concatenate prompts.'],
  ['deliberate-rejection', 'deliberate rejection', 'deliberate rejection — Exclude the source mechanism and record the named loss; the negative fixture proves exclusion only.'],
  ['clean-room-brand-input', 'clean-room reimplementation', 'clean-room reimplementation — Implement natively from the outcome contract; do not copy the raster-board implementation or prompt expression.'],
  ['clean-room-style-lenses', 'clean-room reimplementation', 'clean-room reimplementation — Implement natively from the outcome contract; do not copy sibling-persona, simulated-randomness, or prompt expression.'],
  ['clean-room-run-checkpoints', 'clean-room reimplementation', 'clean-room reimplementation — Implement natively from the outcome contract; do not copy urgency language, pause-marker protocol, research claims, or prompt expression.'],
  ['vendored-deterministic', 'vendored component', 'vendored component — Pin the deterministic subset behind a typed adapter and verify its source hash.'],
  ['clean-room-product-reasoning', 'clean-room reimplementation', 'clean-room reimplementation — Implement natively from the outcome contract; do not copy classifier code, source data expression, top-one stereotype selection, or prompt expression.'],
  ['principle-only', 'principle-only inspiration', 'principle-only inspiration — Preserve the documented prompt principle as a behaviour target; do not copy prompt expression or treat it as deterministic code or an adapter.'],
  ['spec-compatible-retained', 'spec-compatible reimplementation', 'spec-compatible reimplementation — Retain the semantic contract behind a typed SiteSmith artifact.'],
  ['provider-plugin', 'provider-plugin', 'provider-plugin — Pin the deterministic subset behind a typed adapter and verify its source hash.'],
];

const licenceDefinitions = [
  ['taste-mit', ['taste-skill'], ['root-mit-license', 'third-party-notices'], 'MIT: retain Taste copyright and permission notice for copied or substantial portions; track asset and dependency rights separately.'],
  ['uupm-mit', ['ui-ux-pro-max'], ['root-mit-license', 'third-party-notices'], 'MIT: retain the Next Level Builder copyright and permission notice for copied code, data, or substantial wording; pin provenance.'],
  ['mixed-bundle', ['ui-ux-pro-max'], ['root-mit-license', 'apache-2.0-license', 'third-party-notices'], 'Mixed bundle: retain root MIT plus every Apache-2.0/OFL/component notice; never flatten installed artifacts to root MIT.'],
  ['uupm-metadata-conflict', ['ui-ux-pro-max'], ['root-mit-license', 'third-party-notices'], 'MIT code, but resolve the public CC-BY-NC-4.0 metadata conflict before redistribution or release.'],
  ['frontend-apache', ['frontend-design'], ['apache-2.0-license', 'third-party-notices'], 'Apache-2.0: ship the licence, retain applicable notices, and mark modified copied files; font licences remain separate.'],
  ['impeccable-platform-apache', ['impeccable'], ['apache-2.0-license', 'third-party-notices'], 'Apache-2.0: ship the full licence and NOTICE, retain platform-design-skills attribution, mark modifications; ignore the generated Grok MIT metadata error.'],
  ['impeccable-apache', ['impeccable'], ['apache-2.0-license', 'third-party-notices'], 'Apache-2.0: ship the full licence and NOTICE, retain applicable headers, and mark modifications; asset/provider terms remain separate where relevant.'],
];

const integrationByText = new Map(integrationDefinitions.map(([id, category, matrixText]) => (
  [matrixText, { id, category, matrixText }]
)));
const licenceByText = new Map(licenceDefinitions.map(([id, allowedSourceIds, requiredCarriageIds, matrixText]) => (
  [matrixText, { id, matrixText, allowedSourceIds, requiredCarriageIds }]
)));

const rows = fs.readFileSync(matrixPath, 'utf8').split(/\r?\n/)
  .filter((line) => /^\|\s*`[^`]+`\s*\|/.test(line))
  .map(splitTableRow);
const matrixById = new Map(rows.map((cells) => [cells[0].replaceAll('`', ''), cells]));
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

for (const capability of ledger.capabilities) {
  const row = matrixById.get(capability.capabilityId);
  if (!row || row.length !== 12) throw new Error(`${capability.capabilityId}: missing 12-column matrix row`);
  const integration = integrationByText.get(row[8]);
  const licence = licenceByText.get(row[9]);
  if (!integration) throw new Error(`${capability.capabilityId}: unknown integration treatment ${row[8]}`);
  if (!licence) throw new Error(`${capability.capabilityId}: unknown licence treatment ${row[9]}`);
  capability.integrationTreatmentId = integration.id;
  capability.licenceTreatmentId = licence.id;
}

ledger.schemaVersion = '1.1.0';
ledger.integrationTreatments = Object.fromEntries(integrationDefinitions.map(([id, category, matrixText]) => (
  [id, { category, matrixText }]
)));
ledger.licenceTreatments = Object.fromEntries(licenceDefinitions.map(([
  id, allowedSourceIds, requiredCarriageIds, matrixText,
]) => [id, { matrixText, allowedSourceIds, requiredCarriageIds }]));

const synced = `${JSON.stringify(ledger, null, 2)}\n`;
const original = fs.readFileSync(ledgerPath, 'utf8').replace(/\r\n/g, '\n');
if (!write) {
  if (synced !== original) {
    console.error('FAIL — v3 treatment IDs/dictionaries are stale; run with --write intentionally');
    process.exit(1);
  }
  console.log(`PASS — ${ledger.capabilities.length} capabilities resolve exact integration/licence treatments`);
  process.exit(0);
}

fs.writeFileSync(ledgerPath, synced, 'utf8');
console.log(`WROTE ${path.relative(root, ledgerPath)} — ${integrationDefinitions.length} integration and ${licenceDefinitions.length} licence treatments`);
