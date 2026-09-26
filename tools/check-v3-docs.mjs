#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const docsDir = path.join(root, 'docs', 'v3');
const requiredDocs = [
  'FOUNDATION-DECISION.md',
  'UPSTREAM-FORENSICS.md',
  'UPSTREAM-CAPABILITY-LEDGER.md',
  'CAPABILITY-SUPREMACY-MATRIX.md',
  'DERIVATION-ARCHITECTURE.md',
  'QUALITY-CONTRACT.md',
  'ADOPTION-ARCHITECTURE.md',
  'LICENSE-DERIVATION-AUDIT.md',
];
const canonicalReviewArtifacts = [
  'docs/v3/UPSTREAM-FORENSICS.md',
  'docs/v3/UPSTREAM-CAPABILITY-LEDGER.json',
  'docs/v3/UPSTREAM-CAPABILITY-LEDGER.md',
  'docs/v3/CAPABILITY-SUPREMACY-MATRIX.md',
  'docs/v3/DERIVATION-ARCHITECTURE.md',
  'docs/v3/QUALITY-CONTRACT.md',
  'docs/v3/STRENGTH-ASSERTIONS.json',
  'docs/v3/ADOPTION-ARCHITECTURE.md',
  'docs/v3/LICENSE-DERIVATION-AUDIT.md',
  'skills/sitesmith/THIRD-PARTY-PROVENANCE.json',
  'tools/check-v3-docs.mjs',
];
const provenanceManifestRelativePath = 'skills/sitesmith/THIRD-PARTY-PROVENANCE.json';
const provenanceManifestAuditPath = '../../skills/sitesmith/THIRD-PARTY-PROVENANCE.json';
const mappedBaselineCommit = '80d4030780a4cab18f3baa16dfd354269f83971c';
const mappedBaselineConclusion = 'closed-for-exact-mapped-baseline-only';
const requiredCapabilityFields = [
  'capabilityId', 'sourceRepository', 'sourceCommit', 'sourceFiles', 'sourceLines',
  'activationMechanism', 'inputs', 'outputs', 'persistentArtifacts', 'runtimeBehavior',
  'deterministicParts', 'nondeterministicParts', 'userDecisionPoints', 'strengths',
  'failureModes', 'tests', 'networkDependencies', 'license', 'attributionRequirements',
  'sitesmithDecision', 'decisionReason', 'sitesmithSuccessorCapability',
  'requiredImprovement', 'verificationMethod', 'integrationTreatmentId', 'licenceTreatmentId',
];
const requiredArrayFields = new Set([
  'sourceFiles', 'sourceLines', 'inputs', 'outputs', 'persistentArtifacts',
  'deterministicParts', 'nondeterministicParts', 'userDecisionPoints', 'strengths',
  'failureModes', 'tests', 'networkDependencies', 'attributionRequirements',
]);
const frozenSources = new Map([
  ['https://github.com/Leonxlnx/taste-skill.git', 'e988add20dab0fa97d7a76781c48961c8184288e'],
  ['nextlevelbuilder/ui-ux-pro-max-skill', '4857a2c5ef989794751a0f66b8545a4a49566286'],
  ['https://github.com/anthropics/skills', 'b29e7cf65e5cb78a5ac33d582270551bc74a14eb'],
  ['https://github.com/pbakaus/impeccable.git', '6b342244e915d64b0d6e84d5eec448fd196ce6bb'],
]);
const expectedSourceCounts = new Map([
  ['https://github.com/Leonxlnx/taste-skill.git', 19],
  ['nextlevelbuilder/ui-ux-pro-max-skill', 15],
  ['https://github.com/anthropics/skills', 10],
  ['https://github.com/pbakaus/impeccable.git', 15],
]);
const integrationCategories = [
  'direct dependency',
  'git submodule',
  'adapter',
  'provider-plugin',
  'vendored component',
  'spec-compatible reimplementation',
  'clean-room reimplementation',
  'principle-only inspiration',
  'deliberate rejection',
];

const failures = [];
const ok = (message) => console.log(`ok   ${message}`);
const fail = (message) => failures.push(message);
const strengthAssertionsRelativePath = 'docs/v3/STRENGTH-ASSERTIONS.json';
const qualityContractRelativePath = 'docs/v3/QUALITY-CONTRACT.md';
const derivationArchitectureRelativePath = 'docs/v3/DERIVATION-ARCHITECTURE.md';
const fixedFailureSemantics = Object.freeze({
  missing: 'fail',
  inconclusive: 'fail',
  unmeasurable: 'fail',
  postUnblindingWaiver: 'fail',
  negativeControl: 'required',
  denominator: 'retain-all-assigned-and-applicable',
});

function read(relative) {
  return fs.readFileSync(path.join(docsDir, relative), 'utf8').replace(/\r\n/g, '\n');
}

function markdownFilesBelow(directory, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...markdownFilesBelow(path.join(directory, entry.name), relative));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(relative);
  }
  return files;
}

function splitTableRow(line) {
  const escapedPipe = '\u0000';
  return line
    .replace(/\\\|/g, escapedPipe)
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.replaceAll(escapedPipe, '|').trim());
}

function frontmatterValue(markdown, key) {
  if (!markdown.startsWith('---\n')) return undefined;
  const end = markdown.indexOf('\n---\n', 4);
  if (end < 0) return undefined;
  const match = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(markdown.slice(4, end));
  return match?.[1]?.replace(/^['"]|['"]$/g, '');
}

function countLiteral(text, value) {
  return text.split(value).length - 1;
}

function canonicalTextFromBuffer(buffer) {
  let value = buffer;
  if (value.length >= 3 && value[0] === 0xef && value[1] === 0xbb && value[2] === 0xbf) {
    value = value.subarray(3);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(value).replace(/\r\n?/g, '\n');
}

function canonicalTextFile(file) {
  return canonicalTextFromBuffer(fs.readFileSync(file));
}

function sha256Text(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function gitBlobSha1(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(header).update(buffer).digest('hex');
}

function provenanceTreeSha(files) {
  const payload = [...files.keys()]
    .sort()
    .map((file) => `${file}\0${files.get(file)}\n`)
    .join('');
  return sha256Text(payload);
}

function canonicalLines(value) {
  if (value === '') return [];
  const lines = value.split('\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

function validatePosixRelative(value, where, problems) {
  if (typeof value !== 'string' || !value || value.includes('\\')) {
    problems.push(`${where}: path must be a non-empty POSIX relative path`);
    return undefined;
  }
  const parts = value.split('/');
  if (value.startsWith('/') || parts.some((part) => !part || part === '.' || part === '..')
      || path.posix.normalize(value) !== value) {
    problems.push(`${where}: path escapes its declared root: ${JSON.stringify(value)}`);
    return undefined;
  }
  return value;
}

function resolvedContainedPath(rootDirectory, relative, where, problems) {
  const target = path.resolve(rootDirectory, ...relative.split('/'));
  const lexicalRelative = path.relative(path.resolve(rootDirectory), target);
  if (lexicalRelative === '..' || lexicalRelative.startsWith(`..${path.sep}`) || path.isAbsolute(lexicalRelative)) {
    problems.push(`${where}: path escapes its declared root: ${relative}`);
    return undefined;
  }
  if (fs.existsSync(target)) {
    const realRoot = fs.realpathSync.native(rootDirectory);
    const realTarget = fs.realpathSync.native(target);
    const realRelative = path.relative(realRoot, realTarget);
    if (realRelative === '..' || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)) {
      problems.push(`${where}: resolved path escapes its declared root: ${relative}`);
      return undefined;
    }
  }
  return target;
}

function filesBelow(directory, predicate) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...filesBelow(target, predicate));
    else if (entry.isFile() && predicate(target)) files.push(target);
  }
  return files;
}

const fetchedGitHubSourceCache = new Map();
const fetchPinnedSourceScript = `
const fs = require('node:fs');
const urls = fs.readFileSync(0, 'utf8').split('\\n').filter(Boolean);
(async () => {
  const rows = [];
  for (let index = 0; index < urls.length; index += 8) {
    const batch = await Promise.all(urls.slice(index, index + 8).map(async (url) => {
      const response = await fetch(url, {
        redirect: 'error',
        headers: { 'user-agent': 'sitesmith-v3-source-audit' },
      });
      if (!response.ok) throw new Error(url + ' returned HTTP ' + response.status);
      return url + '\\t' + Buffer.from(await response.arrayBuffer()).toString('base64');
    }));
    rows.push(...batch);
  }
  process.stdout.write(rows.join('\\n'));
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});`;

function pinnedGitHubSourceUrl(repository, revision, sourcePath) {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/.exec(repository ?? '');
  if (!match || !/^[0-9a-f]{40}$/.test(revision ?? '')) {
    throw new Error('source repository/revision is not one immutable GitHub coordinate');
  }
  const encodedPath = sourcePath.split('/').map(encodeURIComponent).join('/');
  return `https://raw.githubusercontent.com/${encodeURIComponent(match[1])}/${encodeURIComponent(match[2])}/${revision}/${encodedPath}`;
}

function fetchPinnedGitHubSources(urls) {
  const missing = [...new Set(urls)].filter((url) => !fetchedGitHubSourceCache.has(url));
  if (missing.length === 0) return;
  const output = execFileSync(process.execPath, ['-e', fetchPinnedSourceScript], {
    cwd: root,
    input: missing.join('\n'),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 30_000,
    maxBuffer: 32 * 1024 * 1024,
  });
  const rows = output ? output.split('\n') : [];
  if (rows.length !== missing.length) throw new Error('pinned-source batch returned an incomplete response set');
  for (const row of rows) {
    const separator = row.indexOf('\t');
    if (separator < 1) throw new Error('pinned-source batch returned a malformed row');
    const url = row.slice(0, separator);
    if (!missing.includes(url)) throw new Error('pinned-source batch returned an unexpected URL');
    fetchedGitHubSourceCache.set(url, Buffer.from(row.slice(separator + 1), 'base64'));
  }
}

function fetchPinnedGitHubSource(repository, revision, sourcePath) {
  const url = pinnedGitHubSourceUrl(repository, revision, sourcePath);
  fetchPinnedGitHubSources([url]);
  return fetchedGitHubSourceCache.get(url);
}

function resolveDeclaredSourceBlob({ repository, revision, sourcePath }) {
  if (!sourcePath) throw new Error('sourcePath is unavailable');
  return fetchPinnedGitHubSource(repository, revision, sourcePath);
}

function prefetchManifestSourceBlobs(manifest) {
  const sources = new Map((Array.isArray(manifest.sources) ? manifest.sources : [])
    .filter((source) => source && typeof source === 'object' && !Array.isArray(source))
    .map((source) => [source.id, source]));
  const urls = [];
  for (const group of Array.isArray(manifest.groups) ? manifest.groups : []) {
    const source = sources.get(group?.sourceId);
    if (!source) continue;
    for (const entry of Array.isArray(group.files) ? group.files : []) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const sourcePath = entry.sourcePath;
      const parts = typeof sourcePath === 'string' ? sourcePath.split('/') : [];
      if (!sourcePath || sourcePath.includes('\\') || sourcePath.startsWith('/')
          || parts.some((part) => !part || part === '.' || part === '..')) continue;
      const revisions = Array.isArray(entry.sourceRevisions) ? entry.sourceRevisions
        : entry.sourceRevision ? [entry.sourceRevision]
          : group.sourceRevision ? [group.sourceRevision]
            : source.derivationRevisions?.length === 1 ? [source.derivationRevisions[0]] : [];
      for (const revision of revisions) {
        if (!/^[0-9a-f]{40}$/.test(revision ?? '')) continue;
        urls.push(pinnedGitHubSourceUrl(
          source.derivationRepository ?? source.repository,
          revision,
          sourcePath,
        ));
      }
    }
  }
  fetchPinnedGitHubSources(urls);
}

function frontendDesignBodyAfterFrontmatter(sourceText) {
  const lines = canonicalLines(sourceText);
  if (lines[0] !== '---') return undefined;
  const closing = lines.indexOf('---', 1);
  if (closing < 0) return undefined;
  const body = lines.slice(closing + 1);
  while (body[0] === '') body.shift();
  return body.join('\n');
}

function reconstructUpstreamBodyWithAttribution(localText) {
  const attribution = /\nPart of the sitesmith skill\. From ui-ux-pro-max-skill \(MIT, \(c\) 2024 Next Level Builder\):\nhttps:\/\/github\.com\/nextlevelbuilder\/ui-ux-pro-max-skill\n/;
  const matches = localText.match(new RegExp(attribution.source, 'g')) ?? [];
  if (matches.length !== 1) return undefined;
  return localText.replace(attribution, '');
}

function reconstructImpeccableSource(entry, localText, impeccableNames, problems, where) {
  if (entry.path.endsWith('/_SKILL-original.md')) {
    const lines = localText.match(/[^\n]*\n|[^\n]+$/g) ?? [];
    const starts = lines
      .map((line, index) => (line.startsWith('> Part of the **sitesmith** skill. Derived from ') ? index : -1))
      .filter((index) => index >= 0);
    if (starts.length !== 1) {
      problems.push(`${where}: cannot reconstruct Impeccable _SKILL attribution block`);
      return undefined;
    }
    const index = starts[0];
    if (index < 1 || index + 4 >= lines.length
        || !lines[index + 1].startsWith('> **Modified for sitesmith:**')
        || lines[index + 3].trim() !== '---') {
      problems.push(`${where}: Impeccable _SKILL transform shape drifted`);
      return undefined;
    }
    lines.splice(index - 1, 6);
    let repoints = 0;
    let value = lines.join('').replace(/\]\(([^/)]+\.md)\)/g, (match, name) => {
      if (!impeccableNames.has(name)) return match;
      repoints += 1;
      return `](reference/${name})`;
    });
    if (repoints !== 32) {
      problems.push(`${where}: Impeccable _SKILL reconstructed ${repoints} links, expected 32`);
      return undefined;
    }
    if (entry.derivation !== 'remove-attribution-restore-32-reference-prefixes-and-terminal-lf'
        || !value.endsWith('\n')) {
      problems.push(`${where}: Impeccable _SKILL terminal-LF transform drifted`);
      return undefined;
    }
    value = value.slice(0, -1);
    return value;
  }

  const header = /> Part of the \*\*sitesmith\*\* skill\. Verbatim from \[impeccable\].*?\n> Reproduced without modification; only this header block and the file name are ours\.\n\n---\n\n/s;
  if (!header.test(localText)) {
    problems.push(`${where}: cannot remove exact Impeccable attribution from ${entry.path}`);
    return undefined;
  }
  return localText.replace(header, '');
}

function validateProvenanceManifest(manifestText, manifest, repositoryRoot = root) {
  const problems = [];
  const verifiedFiles = new Set();
  const skillRoot = path.join(repositoryRoot, 'skills', 'sitesmith');
  const referencesRoot = path.join(skillRoot, 'references');
  const dataRoot = path.join(skillRoot, 'data');
  const manifestWhere = provenanceManifestRelativePath;
  const fullSha = /^[0-9a-f]{64}$/;
  const fullRevision = /^[0-9a-f]{40}$/;
  const expectedManifestSelfSha256 = '8cd2d0c387eb72a5a89e40cf8c80986d7e80773efce96f84eb53d02ee575aa35';
  const expectedScalars = {
    schemaVersion: 1,
    normalization: 'utf8-strip-bom-crlf-to-lf-v1',
    spanHashMode: 'lines-inclusive-no-synthetic-final-lf-v1',
    treeHashMode: 'sha256-sorted-relative-path-null-canonical-file-sha-lf-v1',
    selfHashMode: 'normalized-text-replace-own-sha-with-64-zeroes-v1',
  };
  const expectedSources = new Map([
    ['taste-skill', {
      repository: 'https://github.com/Leonxlnx/taste-skill',
      capabilityRevision: 'e988add20dab0fa97d7a76781c48961c8184288e',
      licenseSpdx: 'MIT',
      derivationRevisions: ['e988add20dab0fa97d7a76781c48961c8184288e'],
    }],
    ['ui-ux-pro-max', {
      repository: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
      capabilityRevision: '4857a2c5ef989794751a0f66b8545a4a49566286',
      licenseSpdx: 'MIT',
      derivationRevisions: [
        '65e23199492fa911af32d9078e627ab4de01f4c8',
        '13789290064c88039ad8fc5376412e8d22e491d7',
        '07f4ef3ac2568c25a3b0c8ef5165a86abc3e56e4',
        '6142b073958df645d0fb27e682428e69599386dc',
      ],
    }],
    ['frontend-design', {
      repository: 'https://github.com/anthropics/skills',
      derivationRepository: 'https://github.com/anthropics/claude-plugins-official',
      capabilityRevision: 'b29e7cf65e5cb78a5ac33d582270551bc74a14eb',
      licenseSpdx: 'Apache-2.0',
      derivationRevisions: ['df5224ba07bcc260c4c6bcd7ce2c5a6cff533c4a'],
    }],
    ['impeccable', {
      repository: 'https://github.com/pbakaus/impeccable',
      capabilityRevision: '6b342244e915d64b0d6e84d5eec448fd196ce6bb',
      licenseSpdx: 'Apache-2.0',
      derivationRevisions: ['af78b1e512148e2a2f2d2ded6786d265ea420191'],
    }],
  ]);
  const expectedGroupCounts = new Map([
    ['taste-references', 7],
    ['frontend-design-span', 1],
    ['uupm-references', 2],
    ['uupm-data', 28],
    ['uupm-python', 3],
    ['impeccable-provider-output', 35],
  ]);
  const knownDerivations = new Set([
    'verbatim-spans-in-sitesmith-assembly',
    'frontmatter-and-leading-blank-removed-body-in-sitesmith-assembly',
    'modified-derivative',
    'verbatim-canonical-text',
    'upstream-body-plus-attribution',
    'remove-attribution-restore-32-reference-prefixes-and-terminal-lf',
    'remove-attribution-header',
  ]);

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return { problems: [`${manifestWhere}: manifest must be an object`], verifiedFiles };
  }
  for (const [key, expected] of Object.entries(expectedScalars)) {
    if (manifest[key] !== expected) problems.push(`${manifestWhere}: ${key} must be ${JSON.stringify(expected)}`);
  }

  const expectedAudit = {
    path: 'docs/v3/LICENSE-DERIVATION-AUDIT.md',
    baseline: mappedBaselineCommit,
    conclusion: mappedBaselineConclusion,
  };
  if (!isDeepStrictEqual(manifest.audit, expectedAudit)) {
    problems.push(`${manifestWhere}: audit must pin the exact ${mappedBaselineCommit} baseline and baseline-only conclusion`);
  } else {
    try {
      const auditText = canonicalTextFile(path.join(repositoryRoot, manifest.audit.path));
      if (!auditText.includes(manifest.audit.baseline)) {
        problems.push(`${manifest.audit.path}: does not contain the manifest's full baseline revision`);
      }
      if (!/closed for that exact mapped baseline only/i.test(auditText)) {
        problems.push(`${manifest.audit.path}: does not state the manifest's baseline-only conclusion`);
      }
    } catch (error) {
      problems.push(`${manifest.audit.path}: cannot read declared audit: ${error.message}`);
    }
  }

  const sources = Array.isArray(manifest.sources) ? manifest.sources : [];
  if (!Array.isArray(manifest.sources)) problems.push(`${manifestWhere}: sources must be an array`);
  const sourceIds = sources.filter((source) => source && typeof source === 'object').map((source) => source.id);
  if (sources.length !== 4 || new Set(sourceIds).size !== sourceIds.length
      || [...expectedSources.keys()].some((id) => !sourceIds.includes(id))) {
    problems.push(`${manifestWhere}: sources must contain the four unique audited source ids`);
  }
  const sourcesById = new Map();
  for (const source of sources) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      problems.push(`${manifestWhere}: every source must be an object`);
      continue;
    }
    if (sourcesById.has(source.id)) continue;
    sourcesById.set(source.id, source);
    const expected = expectedSources.get(source.id);
    if (!expected) {
      problems.push(`${manifestWhere}: unknown source id ${JSON.stringify(source.id)}`);
      continue;
    }
    if (source.repository !== expected.repository
        || source.derivationRepository !== expected.derivationRepository
        || source.capabilityRevision !== expected.capabilityRevision
        || source.licenseSpdx !== expected.licenseSpdx) {
      problems.push(`${manifestWhere}: ${source.id} repository, derivation repository, capability revision or SPDX id drifted`);
    }
    if (!Array.isArray(source.derivationRevisions)
        || source.derivationRevisions.length === 0
        || source.derivationRevisions.some((revision) => typeof revision !== 'string' || !fullRevision.test(revision))) {
      problems.push(`${manifestWhere}: ${source.id} has invalid derivation revisions`);
    } else if (!isDeepStrictEqual(source.derivationRevisions, expected.derivationRevisions)) {
      problems.push(`${manifestWhere}: ${source.id} derivation revisions do not match the audit`);
    }
  }

  const carriage = Array.isArray(manifest.carriage) ? manifest.carriage : [];
  if (!Array.isArray(manifest.carriage)) problems.push(`${manifestWhere}: carriage must be an array`);
  const expectedCarriageIds = new Set([
    'root-mit-license', 'root-notice', 'apache-2.0-license', 'third-party-notices', 'provenance-manifest',
  ]);
  const officialApache20Sha256 = 'cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30';
  const carriageIds = carriage.filter((entry) => entry && typeof entry === 'object').map((entry) => entry.id);
  if (carriageIds.length !== expectedCarriageIds.size || new Set(carriageIds).size !== carriageIds.length
      || [...expectedCarriageIds].some((id) => !carriageIds.includes(id))) {
    problems.push(`${manifestWhere}: carriage ids must be the exact five licence/notice/manifest surfaces`);
  }
  const carriageById = new Map(carriage.filter((entry) => entry && typeof entry === 'object')
    .map((entry) => [entry.id, entry]));
  for (const source of sourcesById.values()) {
    if (!Array.isArray(source.carriageIds)) {
      problems.push(`${manifestWhere}: ${source.id} carriageIds must be an array`);
      continue;
    }
    for (const carriageId of source.carriageIds) {
      if (!carriageById.has(carriageId)) {
        problems.push(`${manifestWhere}: ${source.id} references missing carriage id ${JSON.stringify(carriageId)}`);
      }
    }
  }
  for (const item of carriage) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      problems.push(`${manifestWhere}: every carriage entry must be an object`);
      continue;
    }
    const itemWhere = `${manifestWhere} carriage ${item.id ?? '<missing>'}`;
    const relative = validatePosixRelative(item.path, itemWhere, problems);
    if (!['repository', 'skill'].includes(item.scope)) {
      problems.push(`${itemWhere}: invalid scope ${JSON.stringify(item.scope)}`);
      continue;
    }
    if (!relative) continue;
    const carriageRoot = item.scope === 'repository' ? repositoryRoot : skillRoot;
    const target = resolvedContainedPath(carriageRoot, relative, itemWhere, problems);
    if (!target) continue;
    if (typeof item.canonicalFileSha256 !== 'string' || !fullSha.test(item.canonicalFileSha256)) {
      problems.push(`${itemWhere}: invalid canonicalFileSha256`);
      continue;
    }
    if (item.id === 'apache-2.0-license' && item.canonicalFileSha256 !== officialApache20Sha256) {
      problems.push(`${itemWhere}: must match the complete official Apache-2.0 text`);
    }
    let actual;
    if (item.id === 'provenance-manifest') {
      if (item.canonicalFileSha256 !== expectedManifestSelfSha256) {
        problems.push(`${itemWhere}: self hash does not match the checker-pinned audited manifest`);
      }
      if (item.hashMode !== manifest.selfHashMode) {
        problems.push(`${itemWhere}: manifest carriage must declare the self-hash mode`);
      } else if (countLiteral(manifestText, item.canonicalFileSha256) !== 1) {
        problems.push(`${itemWhere}: manifest self hash must occur exactly once`);
      } else {
        actual = sha256Text(manifestText.replace(item.canonicalFileSha256, '0'.repeat(64)));
      }
    } else {
      try {
        actual = sha256Text(canonicalTextFile(target));
      } catch (error) {
        problems.push(`${itemWhere}: cannot hash carriage: ${error.message}`);
      }
    }
    if (actual !== undefined && actual !== item.canonicalFileSha256) {
      problems.push(`${itemWhere}: hash drift: expected ${item.canonicalFileSha256}, got ${actual}`);
    }
    if (typeof item.shipsWithInstall !== 'boolean') {
      problems.push(`${itemWhere}: shipsWithInstall must be boolean`);
    } else if (item.shipsWithInstall !== (item.scope === 'skill')) {
      problems.push(`${itemWhere}: incorrect install-carriage state`);
    }
  }

  const groups = Array.isArray(manifest.groups) ? manifest.groups : [];
  if (!Array.isArray(manifest.groups)) problems.push(`${manifestWhere}: groups must be an array`);
  try {
    prefetchManifestSourceBlobs(manifest);
  } catch (error) {
    problems.push(`${manifestWhere}: pinned upstream source batch cannot be resolved fail-closed: ${error.message}`);
  }
  const groupIds = groups.filter((group) => group && typeof group === 'object').map((group) => group.id);
  if (groupIds.length !== expectedGroupCounts.size || new Set(groupIds).size !== groupIds.length
      || [...expectedGroupCounts.keys()].some((id) => !groupIds.includes(id))) {
    problems.push(`${manifestWhere}: provenance groups are missing, duplicated or unexpected`);
  }

  const memberships = new Map();
  const uniqueFiles = new Map();
  const groupLocalTexts = new Map();
  const groupSourceTexts = new Map();
  for (const group of groups) {
    if (!group || typeof group !== 'object' || Array.isArray(group)) {
      problems.push(`${manifestWhere}: every group must be an object`);
      continue;
    }
    const groupWhere = `${manifestWhere} group ${group.id ?? '<missing>'}`;
    const source = sourcesById.get(group.sourceId);
    if (!source) problems.push(`${groupWhere}: references an unknown source`);
    const files = Array.isArray(group.files) ? group.files : [];
    if (!Array.isArray(group.files)) problems.push(`${groupWhere}: files must be an array`);
    if (files.length !== (expectedGroupCounts.get(group.id) ?? -1)) {
      problems.push(`${groupWhere}: has ${files.length} files, expected ${expectedGroupCounts.get(group.id)}`);
    }

    let groupRevision;
    if (group.sourceRevision !== undefined) {
      if (typeof group.sourceRevision !== 'string' || !fullRevision.test(group.sourceRevision)) {
        problems.push(`${groupWhere}: sourceRevision must be one full lowercase commit`);
      } else if (!source?.derivationRevisions?.includes(group.sourceRevision)) {
        problems.push(`${groupWhere}: sourceRevision is not in ${group.sourceId}.derivationRevisions`);
      } else {
        groupRevision = group.sourceRevision;
      }
    }
    if (['uupm-data', 'uupm-python'].includes(group.id) && !groupRevision) {
      problems.push(`${groupWhere}: requires one group-level sourceRevision; revision-list fallback is forbidden`);
    }

    const within = new Map();
    const localTexts = new Map();
    const sourceTextsByPath = new Map();
    for (const entry of files) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        problems.push(`${groupWhere}: contains a non-object file entry`);
        continue;
      }
      const relative = validatePosixRelative(entry.path, groupWhere, problems);
      const sourcePath = validatePosixRelative(entry.sourcePath, `${groupWhere} source`, problems);
      if (!knownDerivations.has(entry.derivation)) {
        problems.push(`${groupWhere}: ${entry.path ?? '<missing>'} has unknown derivation mode ${JSON.stringify(entry.derivation)}`);
      }

      const singularRevision = entry.sourceRevision;
      const pluralRevisions = entry.sourceRevisions;
      if (singularRevision !== undefined && pluralRevisions !== undefined) {
        problems.push(`${groupWhere}: ${entry.path ?? '<missing>'} may not declare both sourceRevision and sourceRevisions`);
      }
      if (['uupm-data', 'uupm-python'].includes(group.id)
          && singularRevision !== undefined && singularRevision !== groupRevision) {
        problems.push(`${groupWhere}: ${entry.path ?? '<missing>'} may not override the group's singleton sourceRevision`);
      }
      let effectiveRevisions = [];
      if (singularRevision !== undefined) {
        if (typeof singularRevision !== 'string' || !fullRevision.test(singularRevision)) {
          problems.push(`${groupWhere}: ${entry.path ?? '<missing>'} sourceRevision must be one full lowercase commit`);
        } else {
          effectiveRevisions = [singularRevision];
        }
      } else if (pluralRevisions !== undefined) {
        if (!Array.isArray(pluralRevisions) || pluralRevisions.length === 0
            || new Set(pluralRevisions).size !== pluralRevisions.length
            || pluralRevisions.some((revision) => typeof revision !== 'string' || !fullRevision.test(revision))) {
          problems.push(`${groupWhere}: ${entry.path ?? '<missing>'} sourceRevisions must be a non-empty unique full-commit list`);
        } else {
          effectiveRevisions = pluralRevisions;
        }
        if (!sourcePath || typeof entry.sourceCanonicalFileSha256 !== 'string'
            || !fullSha.test(entry.sourceCanonicalFileSha256)) {
          problems.push(`${groupWhere}: plural sourceRevisions require exact sourcePath and sourceCanonicalFileSha256`);
        }
        if (['uupm-data', 'uupm-python'].includes(group.id)) {
          problems.push(`${groupWhere}: revision-list fallback is forbidden for ${group.id}`);
        }
      } else if (groupRevision) {
        effectiveRevisions = [groupRevision];
      } else if (Array.isArray(source?.derivationRevisions) && source.derivationRevisions.length === 1) {
        effectiveRevisions = [...source.derivationRevisions];
      } else {
        problems.push(`${groupWhere}: ${entry.path ?? '<missing>'} has no unambiguous effective source revision`);
      }
      if (effectiveRevisions.some((revision) => !source?.derivationRevisions?.includes(revision))) {
        problems.push(`${groupWhere}: ${entry.path ?? '<missing>'} source revision is outside ${group.sourceId}.derivationRevisions`);
      }
      if (group.id === 'uupm-references' && relative === 'references/07-ux-rules.md'
          && (singularRevision !== '65e23199492fa911af32d9078e627ab4de01f4c8'
            || pluralRevisions !== undefined
            || sourcePath !== '.claude/skills/ui-ux-pro-max/SKILL.md')) {
        problems.push(`${groupWhere}: ${relative} must preserve its exact audited singleton revision/path tuple`);
      }
      if (group.id === 'uupm-references' && relative === 'references/11-search-engine.md'
          && (!isDeepStrictEqual(pluralRevisions, [
            '13789290064c88039ad8fc5376412e8d22e491d7',
            '07f4ef3ac2568c25a3b0c8ef5165a86abc3e56e4',
          ])
            || singularRevision !== undefined
            || sourcePath !== 'cli/assets/templates/base/skill-content.md'
            || entry.sourceCanonicalFileSha256 !== '00df1a36535738b3bb3a07d6c2a537725f817ebf5b218ac91274f2804123388f')) {
        problems.push(`${groupWhere}: ${relative} must preserve its exact audited plural revision/path/source-SHA tuple`);
      }
      if (group.id === 'frontend-design-span'
          && (singularRevision !== source?.derivationRevisions?.[0]
            || typeof entry.sourceGitBlob !== 'string' || !fullRevision.test(entry.sourceGitBlob)
            || typeof entry.sourceCanonicalFileSha256 !== 'string'
            || !fullSha.test(entry.sourceCanonicalFileSha256))) {
        problems.push(`${groupWhere}: frontend-design span requires its exact revision, source blob and source canonical SHA-256`);
      }

      if (!relative) continue;
      const target = resolvedContainedPath(skillRoot, relative, groupWhere, problems);
      if (!target) continue;
      if (typeof entry.canonicalFileSha256 !== 'string' || !fullSha.test(entry.canonicalFileSha256)) {
        problems.push(`${groupWhere}: ${relative} has invalid canonicalFileSha256`);
        continue;
      }
      let localText;
      try {
        localText = canonicalTextFile(target);
      } catch (error) {
        problems.push(`${groupWhere}: cannot hash covered file ${relative}: ${error.message}`);
        continue;
      }
      const actualFileSha = sha256Text(localText);
      if (actualFileSha !== entry.canonicalFileSha256) {
        problems.push(`${groupWhere}: ${relative} full-file hash drift: expected ${entry.canonicalFileSha256}, got ${actualFileSha}`);
      }
      if (within.has(relative)) problems.push(`${groupWhere}: contains duplicate path ${relative}`);
      within.set(relative, entry.canonicalFileSha256);
      localTexts.set(relative, localText);
      const pathMemberships = memberships.get(relative) ?? [];
      pathMemberships.push({ groupId: group.id, entry });
      memberships.set(relative, pathMemberships);
      if (uniqueFiles.has(relative) && uniqueFiles.get(relative) !== entry.canonicalFileSha256) {
        problems.push(`${groupWhere}: overlapping groups disagree on ${relative}'s hash`);
      }
      uniqueFiles.set(relative, entry.canonicalFileSha256);

      const sourceCanonicalTexts = [];
      if (entry.sourceCanonicalFileSha256 !== undefined
          && (typeof entry.sourceCanonicalFileSha256 !== 'string'
            || !fullSha.test(entry.sourceCanonicalFileSha256))) {
        problems.push(`${groupWhere}: ${relative} has invalid sourceCanonicalFileSha256`);
      }
      if (['uupm-data', 'uupm-python'].includes(group.id)
          && (typeof entry.sourceCanonicalFileSha256 !== 'string'
            || !fullSha.test(entry.sourceCanonicalFileSha256)
            || typeof entry.sourceGitBlob !== 'string'
            || !fullRevision.test(entry.sourceGitBlob))) {
        problems.push(`${groupWhere}: ${relative} requires exact sourceGitBlob and sourceCanonicalFileSha256`);
      }
      if (entry.sourceGitBlob !== undefined) {
        if (typeof entry.sourceGitBlob !== 'string' || !fullRevision.test(entry.sourceGitBlob)) {
          problems.push(`${groupWhere}: ${relative} has invalid sourceGitBlob`);
        } else if (typeof entry.sourceCanonicalFileSha256 !== 'string'
            || !fullSha.test(entry.sourceCanonicalFileSha256)) {
          problems.push(`${groupWhere}: ${relative} sourceGitBlob requires sourceCanonicalFileSha256`);
        }
      }
      if (sourcePath && effectiveRevisions.length > 0) {
        for (const revision of effectiveRevisions) {
          try {
            const sourceBlob = resolveDeclaredSourceBlob({
              repository: source?.derivationRepository ?? source?.repository,
              revision,
              sourcePath,
            });
            const sourceCanonicalText = canonicalTextFromBuffer(sourceBlob);
            sourceCanonicalTexts.push(sourceCanonicalText);
            if (entry.sourceGitBlob !== undefined && gitBlobSha1(sourceBlob) !== entry.sourceGitBlob) {
              problems.push(`${groupWhere}: ${relative} sourceGitBlob content does not match ${revision}:${sourcePath}`);
            }
            if (entry.sourceCanonicalFileSha256 !== undefined
                && sha256Text(sourceCanonicalText) !== entry.sourceCanonicalFileSha256) {
              problems.push(`${groupWhere}: ${relative} sourceCanonicalFileSha256 does not match ${revision}:${sourcePath}`);
            }
          } catch (error) {
            problems.push(`${groupWhere}: ${relative} source revision/path cannot be resolved fail-closed: ${revision}:${sourcePath}: ${error.message}`);
          }
        }
      }
      sourceTextsByPath.set(relative, sourceCanonicalTexts);

      const spans = entry.spans === undefined ? [] : entry.spans;
      if (!Array.isArray(spans)) {
        problems.push(`${groupWhere}: ${relative} spans must be an array`);
      } else {
        const lines = canonicalLines(localText);
        for (const span of spans) {
          const localLines = span && typeof span === 'object' && !Array.isArray(span) ? span.localLines : undefined;
          const validLocalLines = Array.isArray(localLines) && localLines.length === 2
            && localLines.every(Number.isInteger)
            && localLines[0] >= 1 && localLines[0] <= localLines[1] && localLines[1] <= lines.length;
          const sourceLines = span?.sourceLines;
          const sourceSelector = span?.sourceSelector;
          const validSourceLines = Array.isArray(sourceLines) && sourceLines.length === 2
            && sourceLines.every(Number.isInteger) && sourceLines[0] >= 1 && sourceLines[0] <= sourceLines[1];
          const validSourceSelector = typeof sourceSelector === 'string' && sourceSelector.trim() !== '';
          if (!validLocalLines || typeof span?.canonicalSpanSha256 !== 'string'
              || !fullSha.test(span.canonicalSpanSha256)
              || (validSourceLines === validSourceSelector)) {
            problems.push(`${groupWhere}: ${relative} has an invalid span declaration`);
            continue;
          }
          if (validSourceLines && (localLines[1] - localLines[0]) !== (sourceLines[1] - sourceLines[0])) {
            problems.push(`${groupWhere}: ${relative} source/local span lengths differ`);
          }
          const actualSpanSha = sha256Text(lines.slice(localLines[0] - 1, localLines[1]).join('\n'));
          if (actualSpanSha !== span.canonicalSpanSha256) {
            problems.push(`${groupWhere}: ${relative} L${localLines[0]}-${localLines[1]} span hash drift`);
          }
          if (validSourceLines) {
            for (const sourceCanonicalText of sourceCanonicalTexts) {
              const upstreamLines = canonicalLines(sourceCanonicalText);
              if (sourceLines[1] > upstreamLines.length) {
                problems.push(`${groupWhere}: ${relative} source line range exceeds the resolved upstream file`);
                continue;
              }
              const sourceSpanSha = sha256Text(upstreamLines.slice(sourceLines[0] - 1, sourceLines[1]).join('\n'));
              if (sourceSpanSha !== span.canonicalSpanSha256 || sourceSpanSha !== actualSpanSha) {
                problems.push(`${groupWhere}: ${relative} source/local line span hash mismatch`);
              }
            }
          }
          if (group.id === 'frontend-design-span') {
            if (sourceSelector !== 'body-after-yaml-frontmatter-with-leading-blank-removed') {
              problems.push(`${groupWhere}: ${relative} frontend-design source selector drifted`);
            }
            const sourceBody = sourceCanonicalTexts.length !== 1
              ? undefined
              : frontendDesignBodyAfterFrontmatter(sourceCanonicalTexts[0]);
            if (sourceBody === undefined) {
              problems.push(`${groupWhere}: ${relative} frontend-design source body cannot be reconstructed`);
            } else {
              const sourceSpanSha = sha256Text(sourceBody);
              if (typeof span.sourceCanonicalSpanSha256 !== 'string'
                  || !fullSha.test(span.sourceCanonicalSpanSha256)
                  || span.sourceCanonicalSpanSha256 !== sourceSpanSha
                  || sourceSpanSha !== actualSpanSha) {
                problems.push(`${groupWhere}: ${relative} frontend-design source/local span hash mismatch`);
              }
            }
          }
        }
      }
      if (entry.derivation === 'verbatim-canonical-text'
          && entry.sourceCanonicalFileSha256 !== undefined
          && entry.sourceCanonicalFileSha256 !== actualFileSha) {
        problems.push(`${groupWhere}: ${relative} verbatim source hash differs from local canonical hash`);
      }
      if (entry.derivation === 'upstream-body-plus-attribution') {
        const reconstructed = reconstructUpstreamBodyWithAttribution(localText);
        if (reconstructed === undefined) {
          problems.push(`${groupWhere}: ${relative} upstream-body attribution transform drifted`);
        } else {
          const reconstructedSha = sha256Text(reconstructed);
          const reconstructedBlob = gitBlobSha1(Buffer.from(reconstructed, 'utf8'));
          if (entry.sourceCanonicalFileSha256 !== reconstructedSha) {
            problems.push(`${groupWhere}: ${relative} reconstructed source hash drift`);
          }
          if (entry.sourceGitBlob !== reconstructedBlob) {
            problems.push(`${groupWhere}: ${relative} reconstructed source blob drift`);
          }
        }
      }
    }
    groupLocalTexts.set(group.id, localTexts);
    groupSourceTexts.set(group.id, sourceTextsByPath);
    const actualTree = provenanceTreeSha(within);
    if (group.treeSha256 !== actualTree) {
      problems.push(`${groupWhere}: tree hash drift: expected ${group.treeSha256}, got ${actualTree}`);
    }
  }

  const expectedThirdParty = new Set();
  for (const file of filesBelow(referencesRoot, (candidate) => path.dirname(candidate) === referencesRoot
      && candidate.endsWith('.md'))) {
    const header = canonicalLines(canonicalTextFile(file)).slice(0, 10).join('\n');
    if (/— (?:MIT|Apache License 2\.0),|Derived from/.test(header)) {
      expectedThirdParty.add(path.relative(skillRoot, file).split(path.sep).join('/'));
    }
  }
  for (const relative of ['scripts/core.py', 'scripts/design_system.py', 'scripts/search.py']) {
    expectedThirdParty.add(relative);
  }
  for (const file of filesBelow(dataRoot, (candidate) => candidate.endsWith('.csv'))) {
    expectedThirdParty.add(path.relative(skillRoot, file).split(path.sep).join('/'));
  }
  const impeccableRoot = path.join(referencesRoot, 'impeccable');
  for (const file of filesBelow(impeccableRoot, (candidate) => path.dirname(candidate) === impeccableRoot
      && candidate.endsWith('.md'))) {
    expectedThirdParty.add(path.relative(skillRoot, file).split(path.sep).join('/'));
  }
  if (expectedThirdParty.size !== 75) {
    problems.push(`${manifestWhere}: repository third-party candidate set is ${expectedThirdParty.size}, expected 75`);
  }
  const missing = [...expectedThirdParty].filter((file) => !uniqueFiles.has(file)).sort();
  const orphans = [...uniqueFiles.keys()].filter((file) => !expectedThirdParty.has(file)).sort();
  if (missing.length > 0 || orphans.length > 0) {
    problems.push(`${manifestWhere}: exact coverage drift; missing=${JSON.stringify(missing)}, orphans=${JSON.stringify(orphans)}`);
  }

  const overlaps = new Map([...memberships].filter(([, entries]) => entries.length > 1));
  const overlapPath = 'references/05-ai-tells.md';
  const declaredOverlap = manifest.coverage?.allowedOverlap;
  if (!declaredOverlap || declaredOverlap.path !== overlapPath
      || !isDeepStrictEqual(new Set(declaredOverlap.groupIds), new Set(['taste-references', 'frontend-design-span']))
      || declaredOverlap.mustUseDisjointSpans !== true) {
    problems.push(`${manifestWhere}: coverage.allowedOverlap must declare the one disjoint 05-ai-tells overlap`);
  }
  if (overlaps.size !== 1 || !overlaps.has(overlapPath)) {
    problems.push(`${manifestWhere}: only ${overlapPath} may overlap groups, got ${JSON.stringify([...overlaps.keys()].sort())}`);
  } else {
    const overlapEntries = overlaps.get(overlapPath);
    const overlapGroups = new Set(overlapEntries.map(({ groupId }) => groupId));
    if (!isDeepStrictEqual(overlapGroups, new Set(['taste-references', 'frontend-design-span']))) {
      problems.push(`${manifestWhere}: 05-ai-tells overlap must be Taste plus frontend-design`);
    }
    const ranges = overlapEntries.flatMap(({ entry }) => Array.isArray(entry.spans)
      ? entry.spans.map((span) => span.localLines).filter((lines) => Array.isArray(lines) && lines.length === 2)
      : []).sort((left, right) => left[0] - right[0] || left[1] - right[1]);
    if (ranges.length === 0 || ranges.slice(1).some((right, index) => ranges[index][1] >= right[0])) {
      problems.push(`${manifestWhere}: 05-ai-tells source spans must be explicit and disjoint`);
    }
  }

  const membershipCount = groups.reduce((count, group) => (
    count + (Array.isArray(group?.files) ? group.files.length : 0)
  ), 0);
  if (manifest.coverage?.uniqueFileCount !== 75 || manifest.coverage?.membershipCount !== 76) {
    problems.push(`${manifestWhere}: coverage counts must be exactly 75 unique / 76 memberships`);
  }
  if (uniqueFiles.size !== 75 || membershipCount !== 76) {
    problems.push(`${manifestWhere}: actual coverage is ${uniqueFiles.size} unique / ${membershipCount} memberships`);
  }
  const coverageTree = provenanceTreeSha(uniqueFiles);
  if (manifest.coverage?.treeSha256 !== coverageTree) {
    problems.push(`${manifestWhere}: global third-party tree hash drift: expected ${manifest.coverage?.treeSha256}, got ${coverageTree}`);
  }

  const impeccable = groups.find((group) => group?.id === 'impeccable-provider-output');
  if (impeccable && Array.isArray(impeccable.files)) {
    const sourceHashes = new Map();
    const impeccableNames = new Set(impeccable.files
      .filter((entry) => entry?.path !== 'references/impeccable/_SKILL-original.md')
      .map((entry) => path.posix.basename(entry.path)));
    const localTexts = groupLocalTexts.get(impeccable.id) ?? new Map();
    const resolvedSourceTexts = groupSourceTexts.get(impeccable.id) ?? new Map();
    for (const entry of impeccable.files) {
      if (!entry?.path || !localTexts.has(entry.path)) continue;
      const reconstructed = reconstructImpeccableSource(
        entry,
        localTexts.get(entry.path),
        impeccableNames,
        problems,
        manifestWhere,
      );
      if (reconstructed === undefined) continue;
      const reconstructedSha = sha256Text(reconstructed);
      if (entry.reconstructedSourceCanonicalFileSha256 !== reconstructedSha) {
        problems.push(`${manifestWhere}: ${entry.path} reconstructed source hash drift`);
      }
      const upstreamTexts = resolvedSourceTexts.get(entry.path) ?? [];
      if (upstreamTexts.length !== 1 || sha256Text(upstreamTexts[0] ?? '') !== reconstructedSha) {
        problems.push(`${manifestWhere}: ${entry.path} reconstructed content does not match its exact upstream revision/path`);
      }
      if (sourceHashes.has(entry.sourcePath)) {
        problems.push(`${manifestWhere}: duplicate reconstructed sourcePath ${entry.sourcePath}`);
      }
      sourceHashes.set(entry.sourcePath, reconstructedSha);
    }
    const reconstructedTree = provenanceTreeSha(sourceHashes);
    if (impeccable.reconstructedSourceTreeSha256 !== reconstructedTree) {
      problems.push(`${manifestWhere}: Impeccable reconstructed source tree drift: expected ${impeccable.reconstructedSourceTreeSha256}, got ${reconstructedTree}`);
    }
  }

  if (problems.length === 0) {
    for (const relative of uniqueFiles.keys()) verifiedFiles.add(path.resolve(skillRoot, ...relative.split('/')));
  }
  return { problems, verifiedFiles };
}

function plainTableCell(value) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replaceAll('&#124;', '|')
    .trim();
}

function integrationCategory(value) {
  const normalized = value
    .replace(/^\*\*/, '')
    .replace(/^`/, '')
    .toLowerCase();
  return integrationCategories.find((category) => normalized.startsWith(category));
}

function normalizeGitHubRepository(value) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^git@github\.com:/, '')
    .replace(/^(?:https?:\/\/)?github\.com\//, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.git$/, '');
}

function provenanceTreatmentProblems({
  capability, cells, sourceId, integrationTreatments, licenceTreatments, carriageIds,
}) {
  const problems = [];
  const integration = integrationTreatments?.[capability.integrationTreatmentId];
  const licence = licenceTreatments?.[capability.licenceTreatmentId];
  if (!integration) {
    problems.push(`unknown integrationTreatmentId ${capability.integrationTreatmentId}`);
  } else {
    if (cells[8] !== integration.matrixText) problems.push('integration matrixText drifted');
    if (integrationCategory(cells[8] ?? '') !== integration.category) {
      problems.push('integration category drifted');
    }
  }
  if (!licence) {
    problems.push(`unknown licenceTreatmentId ${capability.licenceTreatmentId}`);
  } else {
    if (cells[9] !== licence.matrixText) problems.push('licence matrixText drifted');
    if (!licence.allowedSourceIds?.includes(sourceId)) {
      problems.push(`licence treatment disallows source ${sourceId}`);
    }
    for (const carriageId of licence.requiredCarriageIds ?? []) {
      if (!carriageIds.has(carriageId)) problems.push(`missing provenance carriage ${carriageId}`);
    }
  }
  return problems;
}

function integrationCountSignature(categoryCounts) {
  return integrationCategories.map((category) => categoryCounts.get(category) ?? 0).join('/');
}

function architectureDispositionCounts(architecture, capabilityId) {
  const counts = { carriedOrAssigned: 0, rejected: 0 };
  const literal = `\`${capabilityId}\``;
  for (const line of architecture.split(/\r?\n/)) {
    if (!/^\s*\|/.test(line)) continue;
    const cells = splitTableRow(line);
    const label = plainTableCell(cells[0] ?? '');
    const occurrences = countLiteral(line, literal);
    if (label === 'Upstream capabilities carried' || label === 'Upstream capabilities assigned') {
      counts.carriedOrAssigned += occurrences;
    } else if (label === 'Rejected/exclusion-only') {
      counts.rejected += occurrences;
    }
  }
  return counts;
}

function rejectCellsClaimPreservation(cells) {
  const claimText = [cells[4], cells[7], cells[8]]
    .map((cell) => plainTableCell(cell ?? ''))
    .join(' ')
    .replace(/No source mechanism, carry-forward, preservation, replacement, or non-inferiority claim\./gi, '')
    .replace(/BLOCK if the rejected mechanism[^.]*without a new recorded decision\./gi, '');
  return /\b(?:carr(?:y|ies|ied)(?:-forward)?|preserv(?:e|es|ed|ation)|replac(?:e|es|ed|ement)|non-inferior(?:ity)?)\b/i.test(claimText);
}

function capabilityDispositionProblems({ canonical, cells, assertion, architecture }) {
  const problems = [];
  const id = canonical.capabilityId;
  const category = integrationCategory(cells[8] ?? '');
  const moduleCell = cells[10] ?? '';
  const architectureCounts = architectureDispositionCounts(architecture, id);
  const isRejected = canonical.sitesmithDecision === 'reject';
  const assertionClassification = assertion?.rejectionTreatment?.classification;
  const assertionMode = assertion?.verdictPredicate?.comparison?.mode;

  if (isRejected) {
    if (canonical.sitesmithSuccessorCapability !== 'none') problems.push('reject successor must be exactly none');
    if (moduleCell !== '`Rejected/exclusion-only`') problems.push('reject module cell must be Rejected/exclusion-only');
    if (category !== 'deliberate rejection') problems.push('reject integration category must be deliberate rejection');
    const dispositionText = [cells[4], cells[7], cells[8]].map((cell) => plainTableCell(cell ?? '')).join(' ');
    if (!/named deliberate loss/i.test(dispositionText) || !/named loss/i.test(dispositionText)) {
      problems.push('reject matrix disposition must name the deliberate loss');
    }
    if (rejectCellsClaimPreservation(cells)) problems.push('reject matrix disposition claims carry or preservation');
    if (assertionClassification !== 'deliberate-rejection'
        || !(assertion?.directionOfBenefit ?? '').includes('Exact exclusion')
        || assertionMode !== 'exclusion') {
      problems.push('reject assertion must be exclusion-only');
    }
    if (architectureCounts.rejected !== 1 || architectureCounts.carriedOrAssigned !== 0) {
      problems.push(`reject architecture placement must be 0 carried/assigned and 1 exclusion row, found ${architectureCounts.carriedOrAssigned}/${architectureCounts.rejected}`);
    }
  } else {
    if (!/^`M(?:10|[0-9])-[a-z0-9-]+`$/.test(moduleCell)) {
      problems.push('non-reject module cell must name one M0..M10 module');
    }
    if (canonical.sitesmithSuccessorCapability === 'none') problems.push('non-reject successor may not be none');
    if (category === 'deliberate rejection') problems.push('non-reject integration category may not be deliberate rejection');
    if (assertionClassification !== 'not-rejected'
        || (assertion?.directionOfBenefit ?? '').includes('Exact exclusion')
        || assertionMode === 'exclusion') {
      problems.push('non-reject assertion must be positive and not-rejected');
    }
    if (architectureCounts.carriedOrAssigned !== 1 || architectureCounts.rejected !== 0) {
      problems.push(`non-reject architecture placement must be 1 carried/assigned and 0 exclusion rows, found ${architectureCounts.carriedOrAssigned}/${architectureCounts.rejected}`);
    }
  }
  return problems;
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function stableCanonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableCanonicalJson(entry)).join(',')}]`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableCanonicalJson(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

function stableJsonSha256(value) {
  return crypto.createHash('sha256').update(stableCanonicalJson(value)).digest('hex').toUpperCase();
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
  const sourcesByPath = new Map(Object.values(sourceOfTruth ?? {})
    .filter((source) => source?.path)
    .map((source) => [source.path, source]));
  return [...(assertion.policyRefs ?? [])]
    .sort()
    .map((policyRef) => {
      const source = sourcesByPath.get(policyRef);
      if (!source) return { path: policyRef, unresolved: true };
      const versionBinding = source.contractVersion !== undefined
        ? { contractVersion: source.contractVersion }
        : { architectureVersion: source.architectureVersion };
      return {
        path: source.path,
        ...versionBinding,
        sha256: source.sha256,
      };
    });
}

function expectedVerdictPredicate(assertion, sourceOfTruth) {
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

function parseSemver(value) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?$/.exec(value ?? '');
  if (!match) return undefined;
  return {
    core: match.slice(1, 4).map(Number),
    prerelease: match[4]?.split('.') ?? [],
  };
}

function compareSemver(left, right) {
  const a = parseSemver(left);
  const b = parseSemver(right);
  if (!a || !b) return undefined;
  for (let index = 0; index < 3; index += 1) {
    if (a.core[index] !== b.core[index]) return Math.sign(a.core[index] - b.core[index]);
  }
  if (a.prerelease.length === 0 || b.prerelease.length === 0) {
    return Math.sign(b.prerelease.length - a.prerelease.length);
  }
  const length = Math.max(a.prerelease.length, b.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const aPart = a.prerelease[index];
    const bPart = b.prerelease[index];
    if (aPart === undefined) return -1;
    if (bPart === undefined) return 1;
    if (aPart === bPart) continue;
    const aNumeric = /^\d+$/.test(aPart);
    const bNumeric = /^\d+$/.test(bPart);
    if (aNumeric && bNumeric) return Math.sign(Number(aPart) - Number(bPart));
    if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
    return aPart < bPart ? -1 : 1;
  }
  return 0;
}

function gitFileAt(revision, relativePath) {
  try {
    return execFileSync('git', ['show', `${revision}:${relativePath}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return undefined;
  }
}

function gitCommitExists(revision) {
  try {
    execFileSync('git', ['cat-file', '-e', `${revision}^{commit}`], {
      cwd: root,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function runStrengthSealSelfTest() {
  const canonicalA = { z: [3, { b: true, a: null }], a: 'x' };
  const canonicalB = { a: 'x', z: [3, { a: null, b: true }] };
  if (stableCanonicalJson(canonicalA) !== stableCanonicalJson(canonicalB)
      || stableJsonSha256(canonicalA) !== stableJsonSha256(canonicalB)) {
    throw new Error('strength seal self-test failed: canonical JSON depends on object key order');
  }
  if (stableJsonSha256(canonicalA) === stableJsonSha256({ ...canonicalB, a: 'y' })) {
    throw new Error('strength seal self-test failed: semantic change did not change canonical hash');
  }

  const assertion = {
    qcGate: 'QC-TEST-01',
    subgate: 'SA::TEST-001',
    observableMeasure: { deterministic: true, samples: [1, 2] },
    fixture: 'SA-FIXTURE::TEST-001',
    applicableBriefsOrSystemFixture: ['SYS-TEST'],
    nonInferiorityMargin: {
      estimand: 'blinded seven-point capability outcome',
      adjustedLowerBound: '> -0.25',
    },
    negativeControl: { id: 'NC::TEST-001', requiredObservation: 'gate remains red' },
    artifactPath: 'docs/v3/results/strength-assertions/test-001.json',
    rejectionTreatment: { classification: 'not-rejected' },
    policyRefs: [qualityContractRelativePath],
  };
  const sourceOfTruth = {
    qualityContract: {
      path: qualityContractRelativePath,
      contractVersion: '1.2.0',
      sha256: 'A'.repeat(64),
    },
  };
  const predicate = expectedVerdictPredicate(assertion, sourceOfTruth);
  if (predicate.comparison.mode !== 'seven-point-non-inferiority'
      || predicate.comparison.margin !== assertion.nonInferiorityMargin
      || predicate.failureSemantics !== fixedFailureSemantics
      || predicate.observableMeasureSha256 !== stableJsonSha256(assertion.observableMeasure)
      || predicate.negativeControlSha256 !== stableJsonSha256(assertion.negativeControl)) {
    throw new Error('strength seal self-test failed: verdict predicate is not mechanically bound');
  }
  const copiedPredicate = JSON.parse(JSON.stringify(predicate));
  if (!isDeepStrictEqual(predicate, copiedPredicate)) {
    throw new Error('strength seal self-test failed: predicate does not survive JSON round-trip');
  }
  copiedPredicate.resultPath = 'different.json';
  if (isDeepStrictEqual(predicate, copiedPredicate)) {
    throw new Error('strength seal self-test failed: strict predicate equality ignored a changed result path');
  }
  const changedPolicyPredicate = expectedVerdictPredicate(assertion, {
    qualityContract: {
      ...sourceOfTruth.qualityContract,
      sha256: 'B'.repeat(64),
    },
  });
  if (stableJsonSha256(predicate) === stableJsonSha256(changedPolicyPredicate)) {
    throw new Error('strength seal self-test failed: changed policy SHA did not change semantic SHA');
  }

  const versionCases = [
    ['2.0.0', '1.9.9', 1],
    ['2.0.0', '2.0.0', 0],
    ['2.0.0-beta.2', '2.0.0-beta.1', 1],
    ['2.0.0', '2.0.0-beta.2', 1],
    ['1.9.9', '2.0.0', -1],
  ];
  for (const [next, previous, expected] of versionCases) {
    if (compareSemver(next, previous) !== expected) {
      throw new Error(`strength seal self-test failed: semver ${next} vs ${previous}`);
    }
  }
  if (compareSemver('2', '1.0.0') !== undefined) {
    throw new Error('strength seal self-test failed: invalid semver was accepted');
  }
}

function runCapabilityDispositionSelfTest() {
  const rejectCanonical = {
    capabilityId: 'TEST-REJECT',
    sitesmithDecision: 'reject',
    sitesmithSuccessorCapability: 'none',
  };
  const rejectCells = [
    '`TEST-REJECT`', '', '', '',
    'Canonical successor: `none`. Named deliberate loss: “test loss”. No source mechanism, carry-forward, preservation, replacement, or non-inferiority claim.',
    '', '',
    'BLOCK if the rejected mechanism is claimed carried, preserved, replaced, or non-inferior without a new recorded decision.',
    'deliberate rejection — Exclude the mechanism and record the named loss; the negative fixture proves exclusion only.',
    '', '`Rejected/exclusion-only`', '`QC-TEST-01`',
  ];
  const rejectAssertion = {
    rejectionTreatment: { classification: 'deliberate-rejection' },
    directionOfBenefit: 'Exact exclusion: mechanism remains absent.',
    verdictPredicate: { comparison: { mode: 'exclusion' } },
  };
  const rejectArchitecture = '| Rejected/exclusion-only | `TEST-REJECT` — named loss: test loss |';
  const validRejectProblems = capabilityDispositionProblems({
    canonical: rejectCanonical,
    cells: rejectCells,
    assertion: rejectAssertion,
    architecture: rejectArchitecture,
  });
  if (validRejectProblems.length !== 0) {
    throw new Error(`capability disposition self-test failed: valid reject: ${validRejectProblems.join('; ')}`);
  }
  const overclaimCells = [...rejectCells];
  overclaimCells[4] = `${overclaimCells[4]} SiteSmith preserves this strength.`;
  if (!capabilityDispositionProblems({
    canonical: rejectCanonical,
    cells: overclaimCells,
    assertion: rejectAssertion,
    architecture: rejectArchitecture,
  }).some((problem) => problem.includes('claims carry or preservation'))) {
    throw new Error('capability disposition self-test failed: reject preservation claim passed');
  }
  if (!capabilityDispositionProblems({
    canonical: rejectCanonical,
    cells: rejectCells,
    assertion: rejectAssertion,
    architecture: '| Upstream capabilities carried | `TEST-REJECT` |',
  }).some((problem) => problem.includes('architecture placement'))) {
    throw new Error('capability disposition self-test failed: reject carried-row placement passed');
  }

  const nonRejectCanonical = {
    capabilityId: 'TEST-CARRY',
    sitesmithDecision: 'adapt',
    sitesmithSuccessorCapability: 'Native successor',
  };
  const nonRejectCells = [
    '`TEST-CARRY`', '', '', '', 'Canonical successor: Native successor.', '', '', '',
    'adapter — typed boundary', '', '`M1-test`', '`QC-TEST-01`',
  ];
  const nonRejectAssertion = {
    rejectionTreatment: { classification: 'not-rejected' },
    directionOfBenefit: 'Preserve or improve the named observable strength.',
    verdictPredicate: { comparison: { mode: 'exact-binary' } },
  };
  if (!capabilityDispositionProblems({
    canonical: nonRejectCanonical,
    cells: nonRejectCells,
    assertion: nonRejectAssertion,
    architecture: '| Rejected/exclusion-only | `TEST-CARRY` — named loss: invalid |',
  }).some((problem) => problem.includes('architecture placement'))) {
    throw new Error('capability disposition self-test failed: non-reject exclusion-row placement passed');
  }
}

function runProvenanceTreatmentSelfTest() {
  const capability = {
    capabilityId: 'TEST-PROVENANCE',
    integrationTreatmentId: 'vendored',
    licenceTreatmentId: 'mit',
  };
  const integrationTreatments = {
    vendored: {
      category: 'vendored component',
      matrixText: 'vendored component — pinned and hash-covered',
    },
  };
  const licenceTreatments = {
    mit: {
      matrixText: 'MIT: exact carriage contract',
      allowedSourceIds: ['source-a'],
      requiredCarriageIds: ['notice'],
    },
  };
  const cells = Array(12).fill('');
  cells[8] = integrationTreatments.vendored.matrixText;
  cells[9] = licenceTreatments.mit.matrixText;
  const base = {
    capability,
    cells,
    sourceId: 'source-a',
    integrationTreatments,
    licenceTreatments,
    carriageIds: new Set(['notice']),
  };
  if (provenanceTreatmentProblems(base).length !== 0) {
    throw new Error('provenance treatment self-test failed: valid binding was rejected');
  }
  const driftedCells = [...cells];
  driftedCells[8] += '.';
  if (!provenanceTreatmentProblems({ ...base, cells: driftedCells })
    .some((problem) => problem.includes('matrixText drifted'))) {
    throw new Error('provenance treatment self-test failed: matrix text drift passed');
  }
  if (!provenanceTreatmentProblems({ ...base, sourceId: 'source-b' })
    .some((problem) => problem.includes('disallows source'))) {
    throw new Error('provenance treatment self-test failed: disallowed source/licence pair passed');
  }
  const counts = new Map(integrationCategories.map((category) => [category, 0]));
  counts.set('provider-plugin', 1);
  counts.set('vendored component', 2);
  counts.set('spec-compatible reimplementation', 30);
  counts.set('clean-room reimplementation', 19);
  counts.set('principle-only inspiration', 3);
  counts.set('deliberate rejection', 4);
  if (integrationCountSignature(counts) !== '0/0/0/1/2/30/19/3/4') {
    throw new Error('provenance treatment self-test failed: canonical category count signature drifted');
  }
  counts.set('adapter', 1);
  if (integrationCountSignature(counts) === '0/0/0/1/2/30/19/3/4') {
    throw new Error('provenance treatment self-test failed: category count drift passed');
  }
}

function runProvenanceDigestSelfTest() {
  const manifestPath = path.join(root, provenanceManifestRelativePath);
  if (!fs.existsSync(manifestPath)) {
    throw new Error('provenance digest self-test failed: manifest is missing');
  }
  const manifestText = canonicalTextFile(manifestPath);
  const manifest = parseStrictJson(manifestText);
  const baseline = validateProvenanceManifest(manifestText, manifest);
  if (baseline.problems.length !== 0 || baseline.verifiedFiles.size !== 75) {
    throw new Error(`provenance digest self-test failed: valid manifest rejected: ${baseline.problems.join('; ')}`);
  }

  const expectRejected = (name, mutate, pattern) => {
    const fixture = structuredClone(manifest);
    mutate(fixture);
    const { problems } = validateProvenanceManifest(manifestText, fixture);
    if (!problems.some((problem) => pattern.test(problem))) {
      throw new Error(`provenance digest self-test failed: ${name} passed (${problems.join('; ')})`);
    }
  };
  expectRejected('fabricated file SHA', (fixture) => {
    fixture.groups[0].files[0].canonicalFileSha256 = '0'.repeat(64);
  }, /full-file hash drift/);
  expectRejected('fabricated group tree', (fixture) => {
    fixture.groups[0].treeSha256 = '0'.repeat(64);
  }, /tree hash drift/);
  expectRejected('fabricated coverage tree', (fixture) => {
    fixture.coverage.treeSha256 = '0'.repeat(64);
  }, /global third-party tree hash drift/);
  expectRejected('fabricated carriage SHA', (fixture) => {
    fixture.carriage.find((item) => item.id === 'root-mit-license').canonicalFileSha256 = '0'.repeat(64);
  }, /carriage root-mit-license: hash drift/);
  expectRejected('substituted Apache-2.0 text', (fixture) => {
    fixture.carriage.find((item) => item.id === 'apache-2.0-license').canonicalFileSha256 = 'a'.repeat(64);
  }, /complete official Apache-2\.0 text/);
  expectRejected('fabricated self SHA', (fixture) => {
    fixture.carriage.find((item) => item.id === 'provenance-manifest').canonicalFileSha256 = '0'.repeat(64);
  }, /manifest self hash must occur exactly once/);
  {
    const substituted = manifestText.replace(
      'https://github.com/Leonxlnx/taste-skill',
      'https://github.com/example/taste-skill',
    );
    const oldSelfSha = manifest.carriage.find((item) => item.id === 'provenance-manifest').canonicalFileSha256;
    const recomputedSelfSha = sha256Text(substituted.replace(oldSelfSha, '0'.repeat(64)));
    const resealedText = substituted.replace(oldSelfSha, recomputedSelfSha);
    const resealedFixture = parseStrictJson(resealedText);
    const { problems } = validateProvenanceManifest(resealedText, resealedFixture);
    if (!problems.some((problem) => /self hash does not match the checker-pinned audited manifest/.test(problem))) {
      throw new Error(`provenance digest self-test failed: resealed substituted manifest passed (${problems.join('; ')})`);
    }
  }
  expectRejected('path escape', (fixture) => {
    fixture.groups[0].files[0].path = '../outside.md';
  }, /path escapes its declared root/);
  expectRejected('fabricated span SHA', (fixture) => {
    fixture.groups[0].files[0].spans[0].canonicalSpanSha256 = '0'.repeat(64);
  }, /span hash drift/);
  expectRejected('fabricated frontend source span SHA', (fixture) => {
    fixture.groups.find((group) => group.id === 'frontend-design-span')
      .files[0].spans[0].sourceCanonicalSpanSha256 = '0'.repeat(64);
  }, /frontend-design source\/local span hash mismatch/);
  expectRejected('overlapping source spans', (fixture) => {
    fixture.groups.find((group) => group.id === 'frontend-design-span').files[0].spans[0].localLines = [100, 150];
  }, /source spans must be explicit and disjoint/);
  expectRejected('ambiguous UUPM data revision', (fixture) => {
    delete fixture.groups.find((group) => group.id === 'uupm-data').sourceRevision;
  }, /requires one group-level sourceRevision/);
  expectRejected('revision outside audited source', (fixture) => {
    fixture.groups.find((group) => group.id === 'uupm-python').sourceRevision = '0'.repeat(40);
  }, /sourceRevision is not in ui-ux-pro-max\.derivationRevisions/);
  expectRejected('UUPM file revision override', (fixture) => {
    fixture.groups.find((group) => group.id === 'uupm-data').files[0].sourceRevision = '65e23199492fa911af32d9078e627ab4de01f4c8';
  }, /may not override the group's singleton sourceRevision/);
  expectRejected('fabricated reconstructed source SHA', (fixture) => {
    fixture.groups.find((group) => group.id === 'impeccable-provider-output')
      .files[0].reconstructedSourceCanonicalFileSha256 = '0'.repeat(64);
  }, /reconstructed source hash drift/);
  expectRejected('fabricated source blob', (fixture) => {
    fixture.groups.find((group) => group.id === 'uupm-python').files[0].sourceGitBlob = 'not-a-full-git-blob';
  }, /invalid sourceGitBlob|requires exact sourceGitBlob/);
  expectRejected('valid-looking fabricated upstream blob', (fixture) => {
    fixture.groups.find((group) => group.id === 'frontend-design-span').files[0].sourceGitBlob = 'a'.repeat(40);
  }, /sourceGitBlob content does not match/);
  expectRejected('fabricated upstream canonical SHA', (fixture) => {
    fixture.groups.find((group) => group.id === 'frontend-design-span')
      .files[0].sourceCanonicalFileSha256 = 'a'.repeat(64);
  }, /sourceCanonicalFileSha256 does not match/);
  expectRejected('unresolvable pinned revision/path', (fixture) => {
    fixture.groups.find((group) => group.id === 'uupm-data')
      .files[0].sourcePath = 'src/ui-ux-pro-max/data/does-not-exist-sitesmith-audit.csv';
  }, /cannot be resolved fail-closed/);
  expectRejected('Taste source-path relabel', (fixture) => {
    fixture.groups.find((group) => group.id === 'taste-references')
      .files[0].sourcePath = 'README.md';
  }, /source\/local line span hash mismatch|source line range exceeds/);
  expectRejected('Taste source-line relabel', (fixture) => {
    fixture.groups.find((group) => group.id === 'taste-references')
      .files[0].spans[0].sourceLines = [9, 122];
  }, /source\/local line span hash mismatch/);
  expectRejected('frontend derivation-repository relabel', (fixture) => {
    fixture.sources.find((source) => source.id === 'frontend-design').derivationRepository =
      'https://github.com/mows21/claude-plugins-official';
  }, /repository, derivation repository, capability revision or SPDX id drifted/);
  expectRejected('UUPM plural lineage reduction', (fixture) => {
    fixture.groups.find((group) => group.id === 'uupm-references')
      .files.find((entry) => entry.path === 'references/11-search-engine.md')
      .sourceRevisions = ['13789290064c88039ad8fc5376412e8d22e491d7'];
  }, /must preserve its exact audited plural revision\/path\/source-SHA tuple/);
  expectRejected('Impeccable source-path relabel', (fixture) => {
    fixture.groups.find((group) => group.id === 'impeccable-provider-output')
      .files.find((entry) => entry.path.endsWith('/adapt.md')).sourcePath = '.claude/skills/impeccable/reference/audit.md';
  }, /reconstructed content does not match its exact upstream revision\/path/);
}

function canonicalReviewArtifact(value) {
  const normalized = value
    .replace(/[`*_]/g, '')
    .replace(/^<|>$/g, '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/{2,}/g, '/');
  const lower = normalized.toLowerCase();
  return canonicalReviewArtifacts.find((artifact) => {
    const canonical = artifact.toLowerCase();
    if (lower === canonical || lower.endsWith(`/${canonical}`)) return true;
    return !lower.includes('/') && lower === path.posix.basename(canonical);
  });
}

function fullSha256(value) {
  const normalized = value.replace(/[`*_]/g, '').trim();
  const match = /^([0-9a-f]{64})$/i.exec(normalized);
  return match?.[1].toUpperCase();
}

function validateReviewArtifactHashes(reviewPath, review) {
  const failureCountBefore = failures.length;
  const occurrences = new Map(canonicalReviewArtifacts.map((artifact) => [artifact, 0]));
  const reported = new Map();

  for (const line of review.split('\n')) {
    if (!/^\s*\|/.test(line)) continue;
    const cells = splitTableRow(line);
    const artifacts = cells.map(canonicalReviewArtifact).filter(Boolean);
    if (artifacts.length === 0) continue;
    const hashes = cells.map(fullSha256).filter(Boolean);
    for (const artifact of artifacts) {
      occurrences.set(artifact, occurrences.get(artifact) + 1);
      if (hashes.length !== 1) {
        fail(`${reviewPath}: ${artifact} row must contain exactly one full SHA-256`);
      } else if (!reported.has(artifact)) {
        reported.set(artifact, hashes[0]);
      }
    }
  }

  for (const artifact of canonicalReviewArtifacts) {
    const count = occurrences.get(artifact);
    if (count === 0) {
      fail(`${reviewPath}: missing SHA-256 for ${artifact}`);
      continue;
    }
    if (count !== 1) {
      fail(`${reviewPath}: duplicate SHA-256 rows for ${artifact} (${count})`);
      continue;
    }
    const reportedHash = reported.get(artifact);
    if (!reportedHash) continue;
    const artifactPath = path.resolve(root, artifact);
    if (!fs.existsSync(artifactPath) || !fs.statSync(artifactPath).isFile()) {
      fail(`${reviewPath}: hashed artifact is missing ${artifact}`);
    } else if (reportedHash !== sha256(artifactPath)) {
      fail(`${reviewPath}: SHA-256 mismatch for ${artifact}`);
    }
  }

  if (failures.length === failureCountBefore) {
    ok(`${reviewPath} hash-locks all ${canonicalReviewArtifacts.length} review artifacts`);
  }
}

function withoutFences(markdown) {
  let fenced = false;
  return markdown
    .split('\n')
    .filter((line) => {
      if (/^\s*```/.test(line)) {
        fenced = !fenced;
        return false;
      }
      return !fenced;
    })
    .join('\n');
}

function reviewFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) return { entries: [], body: markdown };
  const end = markdown.indexOf('\n---\n', 4);
  if (end < 0) return { entries: [], body: markdown };
  const entries = markdown
    .slice(4, end)
    .split('\n')
    .map((line) => /^([A-Za-z0-9_-]+):\s*(.*?)\s*$/.exec(line))
    .filter(Boolean)
    .map((match) => ({ key: match[1], value: match[2].replace(/^['"]|['"]$/g, '') }));
  return { entries, body: markdown.slice(end + 5) };
}

function parseStrictJson(text) {
  let index = 0;
  const whitespace = /\s/;

  function skipWhitespace() {
    while (index < text.length && whitespace.test(text[index])) index += 1;
  }

  function parseString() {
    const start = index;
    if (text[index] !== '"') throw new Error(`expected string at offset ${index}`);
    index += 1;
    while (index < text.length) {
      const character = text[index];
      if (character === '"') {
        index += 1;
        return JSON.parse(text.slice(start, index));
      }
      if (character === '\\') {
        index += 1;
        if (index >= text.length) throw new Error('unterminated string escape');
        if (text[index] === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(index + 1, index + 5))) {
            throw new Error(`invalid unicode escape at offset ${index}`);
          }
          index += 5;
          continue;
        }
        if (!'"\\/bfnrt'.includes(text[index])) {
          throw new Error(`invalid string escape at offset ${index}`);
        }
      } else if (character.charCodeAt(0) < 0x20) {
        throw new Error(`unescaped control character at offset ${index}`);
      }
      index += 1;
    }
    throw new Error('unterminated string');
  }

  function parseArray() {
    const value = [];
    index += 1;
    skipWhitespace();
    if (text[index] === ']') {
      index += 1;
      return value;
    }
    while (index < text.length) {
      value.push(parseValue());
      skipWhitespace();
      if (text[index] === ']') {
        index += 1;
        return value;
      }
      if (text[index] !== ',') throw new Error(`expected ',' or ']' at offset ${index}`);
      index += 1;
      skipWhitespace();
    }
    throw new Error('unterminated array');
  }

  function parseObject() {
    const value = {};
    const keys = new Set();
    index += 1;
    skipWhitespace();
    if (text[index] === '}') {
      index += 1;
      return value;
    }
    while (index < text.length) {
      const key = parseString();
      if (keys.has(key)) throw new Error(`duplicate object key ${JSON.stringify(key)}`);
      keys.add(key);
      skipWhitespace();
      if (text[index] !== ':') throw new Error(`expected ':' at offset ${index}`);
      index += 1;
      value[key] = parseValue();
      skipWhitespace();
      if (text[index] === '}') {
        index += 1;
        return value;
      }
      if (text[index] !== ',') throw new Error(`expected ',' or '}' at offset ${index}`);
      index += 1;
      skipWhitespace();
    }
    throw new Error('unterminated object');
  }

  function parseValue() {
    skipWhitespace();
    const character = text[index];
    if (character === '"') return parseString();
    if (character === '{') return parseObject();
    if (character === '[') return parseArray();
    const remainder = text.slice(index);
    for (const [literal, value] of [['true', true], ['false', false], ['null', null]]) {
      if (remainder.startsWith(literal)) {
        index += literal.length;
        return value;
      }
    }
    const number = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(remainder)?.[0];
    if (number) {
      index += number.length;
      return Number(number);
    }
    throw new Error(`invalid JSON value at offset ${index}`);
  }

  const value = parseValue();
  skipWhitespace();
  if (index !== text.length) throw new Error(`unexpected content at offset ${index}`);
  return value;
}

function exactObjectKeys(value, expected) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return isDeepStrictEqual(Object.keys(value).sort(), [...expected].sort());
}

function reviewFindingsEnvelope(markdown) {
  const problems = [];
  const openingLines = markdown.match(/^```review-findings[^\n]*$/gm) ?? [];
  const exactFences = [...markdown.matchAll(/^```review-findings[ \t]*\n([\s\S]*?)^```[ \t]*$/gm)];
  if (openingLines.length !== 1 || exactFences.length !== 1
      || !/^```review-findings[ \t]*$/.test(openingLines[0])) {
    problems.push('must contain exactly one canonical ```review-findings JSON fence');
    return { problems };
  }

  let envelope;
  try {
    envelope = parseStrictJson(exactFences[0][1]);
  } catch (error) {
    problems.push(`review-findings fence is not strict JSON: ${error.message}`);
    return { problems };
  }
  if (!exactObjectKeys(envelope, ['schemaVersion', 'findings'])) {
    problems.push('review-findings object must contain exactly schemaVersion and findings');
    return { problems };
  }
  if (envelope.schemaVersion !== 1) problems.push('review-findings schemaVersion must be 1');
  if (!Array.isArray(envelope.findings)) {
    problems.push('review-findings findings must be an array');
    return { problems };
  }

  const ids = new Set();
  const severities = new Set(['blocker', 'critical', 'major', 'minor', 'info']);
  const dispositions = new Set(['open', 'resolved']);
  for (const [findingIndex, finding] of envelope.findings.entries()) {
    const where = `review-findings finding ${findingIndex + 1}`;
    if (!exactObjectKeys(finding, ['id', 'severity', 'disposition', 'summary'])) {
      problems.push(`${where} must contain exactly id, severity, disposition and summary`);
      continue;
    }
    if (typeof finding.id !== 'string' || !/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*$/.test(finding.id)) {
      problems.push(`${where} id must be a canonical uppercase finding id`);
    } else if (ids.has(finding.id)) {
      problems.push(`${where} duplicates id ${finding.id}`);
    } else {
      ids.add(finding.id);
    }
    if (!severities.has(finding.severity)) problems.push(`${where} has invalid severity`);
    if (!dispositions.has(finding.disposition)) problems.push(`${where} has invalid disposition`);
    if (typeof finding.summary !== 'string' || !finding.summary.trim()) {
      problems.push(`${where} summary must be a non-empty string`);
    }
  }
  if (problems.length > 0) return { problems };

  const blockerCount = envelope.findings.filter((finding) => (
    finding.disposition === 'open' && ['blocker', 'critical'].includes(finding.severity)
  )).length;
  return {
    problems,
    findings: envelope.findings,
    findingCount: envelope.findings.length,
    blockerCount,
    status: blockerCount === 0 ? 'pass' : 'fail',
  };
}

function reviewVerdictProblems(markdown, { requirePassingVerdict = true } = {}) {
  const problems = [];
  const { entries, body: rawBody } = reviewFrontmatter(markdown);
  const body = withoutFences(rawBody);
  const findingsEnvelope = reviewFindingsEnvelope(markdown);
  problems.push(...findingsEnvelope.problems);
  const statusEntries = entries.filter(({ key }) => key.toLowerCase() === 'status');
  if (statusEntries.length !== 1 || statusEntries[0]?.key !== 'status') {
    problems.push('must contain exactly one canonical frontmatter status field');
  }
  const canonicalStatus = statusEntries.length === 1 ? statusEntries[0].value.toLowerCase() : undefined;
  if (!['pass', 'fail'].includes(canonicalStatus)) {
    problems.push('canonical frontmatter status must be pass or fail');
  } else if (requirePassingVerdict && canonicalStatus !== 'pass') {
    problems.push('readiness requires canonical frontmatter status pass');
  }
  if (findingsEnvelope.status !== undefined && canonicalStatus !== findingsEnvelope.status) {
    problems.push(`canonical frontmatter status must match structured findings status ${findingsEnvelope.status}`);
  }
  const alternateStatusEntries = entries.filter(({ key }) => /^(?:verdict|reviewstatus|review_status|review-status)$/i.test(key));
  for (const { key, value } of alternateStatusEntries) {
    const alternateStatus = /^(?:pass(?:ed)?|ready)$/i.test(value)
      ? 'pass'
      : /^(?:fail(?:ed)?|blocked|not[- ]ready)$/i.test(value) ? 'fail' : undefined;
    if (!alternateStatus || alternateStatus !== canonicalStatus) {
      problems.push(`contains contradictory frontmatter ${key} ${value}`);
    }
  }

  const blockerCountEntries = entries.filter(({ key }) => key.toLowerCase() === 'blockercount');
  if (blockerCountEntries.length !== 1 || blockerCountEntries[0]?.key !== 'blockerCount') {
    problems.push('must contain exactly one canonical frontmatter blockerCount field');
  }
  const blockerCountValue = blockerCountEntries.length === 1 ? blockerCountEntries[0].value : undefined;
  const canonicalBlockerCount = /^(0|[1-9]\d*)$/.test(blockerCountValue ?? '')
    ? Number(blockerCountValue)
    : undefined;
  if (canonicalBlockerCount === undefined) {
    problems.push('canonical frontmatter blockerCount must be a non-negative integer');
  } else if (requirePassingVerdict && canonicalBlockerCount !== 0) {
    problems.push(`readiness requires canonical frontmatter blockerCount 0, found ${canonicalBlockerCount}`);
  }
  if (findingsEnvelope.blockerCount !== undefined
      && canonicalBlockerCount !== findingsEnvelope.blockerCount) {
    problems.push(`canonical frontmatter blockerCount must match ${findingsEnvelope.blockerCount} open blocker/critical findings`);
  }
  const alternateBlockerCountEntries = entries.filter(({ key }) => (
    /^(?:blockers?|blocker_count|blocker-count)$/i.test(key)
  ));
  for (const { key, value } of alternateBlockerCountEntries) {
    if (!/^(0|[1-9]\d*)$/.test(value)) {
      problems.push(`contains non-integer frontmatter ${key}`);
    } else if (Number(value) !== canonicalBlockerCount) {
      problems.push(`contains contradictory frontmatter ${key} ${value}`);
    }
  }

  const findingCountEntries = entries.filter(({ key }) => key.toLowerCase() === 'findingcount');
  if (findingCountEntries.length !== 1 || findingCountEntries[0]?.key !== 'findingCount') {
    problems.push('must contain exactly one canonical frontmatter findingCount field');
  }
  const findingCountValue = findingCountEntries.length === 1 ? findingCountEntries[0].value : undefined;
  const canonicalFindingCount = /^(0|[1-9]\d*)$/.test(findingCountValue ?? '')
    ? Number(findingCountValue)
    : undefined;
  if (canonicalFindingCount === undefined) {
    problems.push('canonical frontmatter findingCount must be a non-negative integer');
  } else if (findingsEnvelope.findingCount !== undefined
      && canonicalFindingCount !== findingsEnvelope.findingCount) {
    problems.push(`canonical frontmatter findingCount must match ${findingsEnvelope.findingCount} structured findings`);
  }

  const contradictoryStatuses = [];
  const bodyBlockerCounts = [];
  let ambiguousBlockerCount = false;
  for (const line of body.split('\n')) {
    const tableCells = /^\s*\|/.test(line)
      ? splitTableRow(line).map((cell) => plainHeading(cell))
      : [];
    const plainLine = plainHeading(line.replace(/^\s*[-*+]\s+/, ''));
    const statusMatch = /^(?:review\s+)?(?:status|verdict)\s*(?::|\bis\b)\s*(pass(?:ed)?|ready|fail(?:ed)?|blocked|not[- ]ready)\b/i.exec(plainLine);
    const statusClass = statusMatch && /^(?:pass(?:ed)?|ready)$/i.test(statusMatch[1]) ? 'pass'
      : statusMatch ? 'fail' : undefined;
    if (statusClass && statusClass !== canonicalStatus) {
      contradictoryStatuses.push(statusMatch[1]);
    }
    if (/^(?:(?:review\s+)?status|verdict)$/i.test(tableCells[0] ?? '')) {
      const tableStatus = /^(pass(?:ed)?|ready|fail(?:ed)?|blocked|not[- ]ready)\b/i.exec(tableCells[1] ?? '');
      const tableStatusClass = tableStatus && /^(?:pass(?:ed)?|ready)$/i.test(tableStatus[1]) ? 'pass'
        : tableStatus ? 'fail' : undefined;
      if (tableStatusClass && tableStatusClass !== canonicalStatus) {
        contradictoryStatuses.push(tableStatus[1]);
      }
    }

    const countMatch = /^blockers?(?:\s+count)?\s*(?::|=|\bis\b)\s*(\d+)\b/i.exec(plainLine);
    if (countMatch) bodyBlockerCounts.push(Number(countMatch[1]));
    if (/^blockers?(?:\s+count)?\s*(?::|=|\bis\b)/i.test(plainLine) && !countMatch) ambiguousBlockerCount = true;
    if (/^blockers?(?:\s+count)?$/i.test(tableCells[0] ?? '')) {
      const tableCount = /^(\d+)\b/.exec(tableCells[1] ?? '');
      if (tableCount) bodyBlockerCounts.push(Number(tableCount[1]));
      else if (tableCells[1] && !/^[-:]+$/.test(tableCells[1])) ambiguousBlockerCount = true;
    }
  }
  if (contradictoryStatuses.length > 0) {
    problems.push(`contains contradictory status ${contradictoryStatuses.join(', ')}`);
  }
  if (ambiguousBlockerCount) problems.push('contains a non-integer blocker-count statement');
  const conflictingCounts = canonicalBlockerCount === undefined
    ? []
    : bodyBlockerCounts.filter((count) => count !== canonicalBlockerCount);
  if (conflictingCounts.length > 0) {
    problems.push(`contains contradictory blocker count ${[...new Set(conflictingCounts)].join(', ')}`);
  }

  const blockerFindingPatterns = [
    /^#{1,6}\s+(?:blockers?\b|B(?:LOCKER)?[- ]?\d+\b)/im,
    /^\s*(?:[-*+]\s+|\|\s*)?(?:\*{0,2})B(?:LOCKER)?[- ]?\d+\b/im,
    /\bseverity\s*(?::|\|)\s*(?:\*{0,2})blocker\b/i,
    /\bblocking finding\b/i,
    /\bblocking (?:issue|gap|defect)\b/i,
    /\brequired closure\s*:/i,
    /\b(?:open|unresolved|remaining|pending)\s+blockers?\b/i,
    /\bblockers?\s+(?:remains?|are\s+open|are\s+unresolved|are\s+pending)\b/i,
    /\b(?:[1-9]\d*|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:open\s+|unresolved\s+|blocking\s+)?blockers?\b/i,
    /\bB(?:LOCKER)?[- ]?\d+\s+[—:-]/i,
    /\b(?:critical|blocker)\b[^.\n]{0,120}\b(?:open|unresolved|remaining|pending|integrity defect)\b/i,
    /\b(?:open|unresolved|remaining|pending)\b[^.\n]{0,120}\b(?:critical|blocker)\b/i,
  ];
  if (canonicalStatus === 'pass' && blockerFindingPatterns.some((pattern) => pattern.test(body))) {
    problems.push('contains a blocker finding or open-blocker marker');
  }
  return problems;
}

function runReviewVerdictSelfTest() {
  const base = `---
title: Review
status: pass
blockerCount: 0
findingCount: 0
---
# Review
Blocker count: 0
Status: PASS

\`\`\`review-findings
{
  "schemaVersion": 1,
  "findings": []
}
\`\`\`
`;
  const withFindings = (review, findings, frontmatter = {}) => review
    .replace('status: pass', `status: ${frontmatter.status ?? 'pass'}`)
    .replace('blockerCount: 0', `blockerCount: ${frontmatter.blockerCount ?? 0}`)
    .replace('findingCount: 0', `findingCount: ${frontmatter.findingCount ?? findings.length}`)
    .replace('"findings": []', `"findings": ${JSON.stringify(findings, null, 2)}`);
  const fixtures = [
    ['valid pass review', base, true],
    ['duplicate status', base.replace('status: pass', 'status: pass\nStatus: fail'), false],
    ['duplicate canonical count', base.replace('blockerCount: 0', 'blockerCount: 0\nblockercount: 0'), false],
    ['non-zero canonical count', base.replace('blockerCount: 0', 'blockerCount: 2'), false],
    ['contradictory body count', base.replace('Blocker count: 0', 'Blocker count: 3'), false],
    ['contradictory alternate count syntax', base.replace('Blocker count: 0', 'Blocker count is 3'), false],
    ['contradictory body status', base.replace('Status: PASS', 'Status is **FAIL**.'), false],
    ['contradictory alternate frontmatter', base.replace('blockerCount: 0', 'blockerCount: 0\nblockers: 2'), false],
    ['contradictory frontmatter verdict', base.replace('status: pass', 'status: pass\nverdict: fail'), false],
    ['blocker finding despite zero', `${base}\n### B1 — Open integrity gap\n`, false],
    ['open blocker prose despite zero', `${base}\nOne unresolved blocker remains.\n`, false],
    [
      'exact critical prose bypass despite zero',
      `${base}\nCritical unresolved integrity defect: provenance is unverifiable and approval must wait.\n`,
      false,
    ],
    ['missing structured findings fence', base.replace(/```review-findings[\s\S]*?```\n/, ''), false],
    ['duplicate structured findings fence', `${base}\n\`\`\`review-findings\n{"schemaVersion":1,"findings":[]}\n\`\`\`\n`, false],
    ['unexpected structured findings key', base.replace('"findings": []', '"findings": [], "extra": true'), false],
    ['duplicate JSON key', base.replace('"schemaVersion": 1,', '"schemaVersion": 1,\n  "schemaVersion": 1,'), false],
    [
      'open critical finding cannot pass',
      withFindings(base, [{
        id: 'B-01', severity: 'critical', disposition: 'open', summary: 'Machine gate is incomplete.',
      }], { findingCount: 1 }),
      false,
    ],
    [
      'resolved critical finding may pass',
      withFindings(base, [{
        id: 'B-01', severity: 'critical', disposition: 'resolved', summary: 'Machine gate is closed.',
      }], { findingCount: 1 }),
      true,
    ],
    ['findingCount must be derived', withFindings(base, [], { findingCount: 2 }), false],
  ];
  for (const [name, fixture, expectedValid] of fixtures) {
    const problems = reviewVerdictProblems(fixture);
    if ((problems.length === 0) !== expectedValid) {
      throw new Error(`review verdict self-test failed: ${name}: ${problems.join('; ') || 'unexpected pass'}`);
    }
  }
  const faithfulFail = withFindings(base, [{
    id: 'B-01', severity: 'critical', disposition: 'open', summary: 'Machine gate is incomplete.',
  }], { status: 'fail', blockerCount: 1, findingCount: 1 })
    .replace('Blocker count: 0', 'Blocker count: 1')
    .replace('Status: PASS', 'Status: FAIL');
  const structuralProblems = reviewVerdictProblems(faithfulFail, { requirePassingVerdict: false });
  if (structuralProblems.length !== 0) {
    throw new Error(`review verdict self-test failed: faithful FAIL schema rejected: ${structuralProblems.join('; ')}`);
  }
  if (reviewVerdictProblems(faithfulFail).length === 0) {
    throw new Error('review verdict self-test failed: faithful FAIL incorrectly opened the readiness gate');
  }
}

function runCanonicalJsonSelfTest() {
  const contracts = [
    path.join(docsDir, 'UPSTREAM-CAPABILITY-LEDGER.json'),
    path.join(root, strengthAssertionsRelativePath),
  ];
  for (const contractPath of contracts) {
    const text = fs.readFileSync(contractPath, 'utf8');
    const match = /^(\s*"schemaVersion"\s*:\s*[^,\n]+,)/m.exec(text);
    if (!match) throw new Error(`canonical JSON self-test failed: ${contractPath} lacks schemaVersion`);
    const duplicate = text.replace(match[1], `${match[1]}\n${match[1]}`);
    try {
      parseStrictJson(duplicate);
      throw new Error(`canonical JSON self-test failed: duplicate key passed in ${contractPath}`);
    } catch (error) {
      if (!/duplicate (?:JSON|object) key/.test(error.message)) throw error;
    }
  }
}

function plainHeading(value) {
  return value
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .trim();
}

function baseSlug(value) {
  return plainHeading(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function anchorsFor(markdown) {
  const counts = new Map();
  const anchors = new Set();
  for (const line of withoutFences(markdown).split('\n')) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const base = baseSlug(match[2]);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    anchors.add(count === 0 ? base : `${base}-${count}`);
  }
  return anchors;
}

function validateFrontmatter(file, markdown) {
  if (!markdown.startsWith('---\n')) {
    fail(`${file}: missing frontmatter`);
    return;
  }
  const end = markdown.indexOf('\n---\n', 4);
  if (end < 0) {
    fail(`${file}: unterminated frontmatter`);
    return;
  }
  const keys = new Map();
  for (const line of markdown.slice(4, end).split('\n')) {
    const match = /^([A-Za-z0-9_-]+):/.exec(line);
    if (!match) continue;
    keys.set(match[1], (keys.get(match[1]) ?? 0) + 1);
  }
  for (const [key, count] of keys) {
    if (count > 1) fail(`${file}: duplicate frontmatter field ${key}`);
  }
  for (const key of ['title', 'status']) {
    if (keys.get(key) !== 1) fail(`${file}: expected exactly one ${key} field`);
  }
}

function validateHeadings(file, markdown) {
  const headings = withoutFences(markdown)
    .split('\n')
    .map((line) => /^(#{1,6})\s+(.+?)\s*$/.exec(line))
    .filter(Boolean);
  const h1 = headings.filter((heading) => heading[1] === '#');
  if (h1.length !== 1) fail(`${file}: expected one H1, found ${h1.length}`);

  const seen = new Set();
  for (const heading of headings) {
    const key = `${heading[1].length}:${plainHeading(heading[2]).toLowerCase()}`;
    if (seen.has(key)) fail(`${file}: duplicate heading ${heading[2]}`);
    seen.add(key);
  }

  const numbered = headings
    .filter((heading) => heading[1] === '##')
    .map((heading) => /^(\d+)\.\s/.exec(plainHeading(heading[2])))
    .filter(Boolean)
    .map((match) => Number(match[1]));
  if (numbered.length) {
    const start = numbered[0] === 0 ? 0 : 1;
    const expected = Array.from({ length: numbered.length }, (_, index) => index + start);
    if (numbered.join(',') !== expected.join(',')) {
      fail(`${file}: non-sequential H2 numbers ${numbered.join(',')}`);
    }
  }
}

function validateLinks(file, markdown, docs) {
  const linkPattern = /\[[^\]]*]\(([^)]+)\)/g;
  for (const match of markdown.matchAll(linkPattern)) {
    const target = match[1].trim();
    if (/^(https?:|mailto:)/i.test(target)) continue;
    const [filePart, anchorPart] = target.split('#', 2);
    let targetMarkdown = markdown;
    if (filePart) {
      const absolute = path.resolve(docsDir, path.dirname(file), decodeURIComponent(filePart));
      if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
        fail(`${file}: unresolved local link ${target}`);
        continue;
      }
      if (anchorPart) targetMarkdown = fs.readFileSync(absolute, 'utf8').replace(/\r\n/g, '\n');
    }
    if (anchorPart && !anchorsFor(targetMarkdown).has(decodeURIComponent(anchorPart))) {
      fail(`${file}: unresolved anchor ${target}`);
    }
  }
}

runReviewVerdictSelfTest();
runStrengthSealSelfTest();
runCapabilityDispositionSelfTest();
runProvenanceTreatmentSelfTest();
runProvenanceDigestSelfTest();
runCanonicalJsonSelfTest();
if (process.argv.includes('--self-test')) {
  console.log('PASS — review verdict, strict JSON, strength seal, disposition and provenance digest self-tests');
  process.exit(0);
}

for (const file of requiredDocs) {
  if (!fs.existsSync(path.join(docsDir, file))) fail(`missing required document ${file}`);
}

const markdownFiles = fs.existsSync(docsDir)
  ? markdownFilesBelow(docsDir).sort()
  : [];
const docs = new Map(markdownFiles.map((file) => [file, read(file)]));

for (const [file, markdown] of docs) {
  validateFrontmatter(file, markdown);
  validateHeadings(file, markdown);
  validateLinks(file, markdown, docs);
}
if (!failures.some((problem) => /frontmatter|heading|H1|H2/.test(problem))) {
  ok('frontmatter and headings are unique and sequential');
}
if (!failures.some((problem) => /link|anchor/.test(problem))) {
  ok('all local links and anchors resolve');
}

const ledgerPath = path.join(docsDir, 'UPSTREAM-CAPABILITY-LEDGER.json');
if (fs.existsSync(ledgerPath)) {
  let ledger;
  try {
    ledger = parseStrictJson(fs.readFileSync(ledgerPath, 'utf8'));
  } catch (error) {
    fail(`UPSTREAM-CAPABILITY-LEDGER.json: ${error.message}`);
  }
  if (ledger) {
    const entries = ledger.capabilities;
    const provenanceManifestPath = path.join(root, provenanceManifestRelativePath);
    let provenanceManifest;
    let provenanceManifestText = '';
    let hashCoveredManifestFiles = new Set();
    try {
      provenanceManifestText = canonicalTextFile(provenanceManifestPath);
      provenanceManifest = parseStrictJson(provenanceManifestText);
    } catch (error) {
      fail(`THIRD-PARTY-PROVENANCE.json: ${error.message}`);
    }
    if (provenanceManifest) {
      const validation = validateProvenanceManifest(provenanceManifestText, provenanceManifest);
      for (const problem of validation.problems) fail(problem);
      hashCoveredManifestFiles = validation.verifiedFiles;
      if (validation.problems.length === 0) {
        ok('third-party provenance recomputes all file/span/group/coverage/source/carriage/self digests');
      }
    }
    const expectedSourceIds = new Set(['taste-skill', 'ui-ux-pro-max', 'frontend-design', 'impeccable']);
    const manifestSources = provenanceManifest?.sources ?? [];
    const manifestSourceIds = new Set(manifestSources.map((source) => source.id));
    const manifestSourcesByRepository = new Map(manifestSources
      .map((source) => [normalizeGitHubRepository(source.repository), source]));
    const manifestCarriageIds = new Set((provenanceManifest?.carriage ?? []).map((entry) => entry.id));
    if (provenanceManifest?.schemaVersion !== 1) {
      fail('THIRD-PARTY-PROVENANCE.json: schemaVersion must be 1');
    }
    if (provenanceManifest?.audit?.path !== 'docs/v3/LICENSE-DERIVATION-AUDIT.md'
        || provenanceManifest?.audit?.baseline !== mappedBaselineCommit
        || provenanceManifest?.audit?.conclusion !== mappedBaselineConclusion) {
      fail('THIRD-PARTY-PROVENANCE.json: audit path/baseline/conclusion drifted');
    }
    if (manifestSources.length !== 4
        || manifestSourceIds.size !== 4
        || manifestSourcesByRepository.size !== 4
        || [...expectedSourceIds].some((id) => !manifestSourceIds.has(id))) {
      fail('THIRD-PARTY-PROVENANCE.json: sources must be exactly taste-skill/ui-ux-pro-max/frontend-design/impeccable');
    }
    if (ledger.schemaVersion !== '1.1.0') {
      fail(`UPSTREAM-CAPABILITY-LEDGER.json: schemaVersion must be 1.1.0, found ${ledger.schemaVersion}`);
    }
    if (Object.keys(ledger.integrationTreatments ?? {}).length !== 11) {
      fail('UPSTREAM-CAPABILITY-LEDGER.json: expected 11 integration treatments');
    }
    if (Object.keys(ledger.licenceTreatments ?? {}).length !== 7) {
      fail('UPSTREAM-CAPABILITY-LEDGER.json: expected 7 licence treatments');
    }
    for (const [treatmentId, treatment] of Object.entries(ledger.licenceTreatments ?? {})) {
      for (const carriageId of treatment.requiredCarriageIds ?? []) {
        if (!manifestCarriageIds.has(carriageId)) {
          fail(`licence treatment ${treatmentId}: missing provenance carriage ${carriageId}`);
        }
      }
    }
    const licenceAudit = docs.get('LICENSE-DERIVATION-AUDIT.md') ?? '';
    if (frontmatterValue(licenceAudit, 'mappedBaselineCommit') !== mappedBaselineCommit
        || frontmatterValue(licenceAudit, 'licenceGate') !== mappedBaselineConclusion
        || frontmatterValue(licenceAudit, 'provenanceManifest') !== provenanceManifestAuditPath) {
      fail('LICENSE-DERIVATION-AUDIT.md: provenance frontmatter must exactly match the manifest baseline, conclusion and relative path');
    }
    const declaredFrozenSources = Array.isArray(ledger.frozenSources) ? ledger.frozenSources : [];
    for (const [sourceRepository, sourceCommit] of frozenSources) {
      const matches = declaredFrozenSources.filter((source) => (
        source.sourceRepository === sourceRepository && source.sourceCommit === sourceCommit
      ));
      if (matches.length !== 1) fail(`ledger frozenSources must contain ${sourceRepository}@${sourceCommit} exactly once`);
    }
    if (declaredFrozenSources.length !== frozenSources.size) {
      fail(`ledger frozenSources expected ${frozenSources.size} entries, found ${declaredFrozenSources.length}`);
    }
    if (!Array.isArray(entries) || entries.length === 0) {
      fail('capability ledger must contain a non-empty capabilities array');
    } else {
      const ids = new Set();
      const entriesById = new Map(entries.map((entry) => [entry.capabilityId, entry]));
      const sourceCounts = new Map();
      for (const entry of entries) {
        if (!isDeepStrictEqual(Object.keys(entry).sort(), [...requiredCapabilityFields].sort())) {
          fail(`${entry.capabilityId ?? '<unknown>'}: capability record keys must be the exact 26-field schema`);
        }
        for (const field of requiredCapabilityFields) {
          if (!(field in entry)) fail(`${entry.capabilityId ?? '<unknown>'}: missing ${field}`);
          if (requiredArrayFields.has(field) && !Array.isArray(entry[field])) {
            fail(`${entry.capabilityId ?? '<unknown>'}: ${field} must be an array`);
          }
          if (!requiredArrayFields.has(field) && (typeof entry[field] !== 'string' || !entry[field].trim())) {
            fail(`${entry.capabilityId ?? '<unknown>'}: ${field} must be a non-empty string`);
          }
        }
        if (ids.has(entry.capabilityId)) fail(`duplicate capabilityId ${entry.capabilityId}`);
        ids.add(entry.capabilityId);
        if (!/^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)+$/.test(entry.capabilityId ?? '')) {
          fail(`invalid capabilityId ${entry.capabilityId}`);
        }
        if (!/^[0-9a-f]{40}$/.test(entry.sourceCommit ?? '')) {
          fail(`${entry.capabilityId}: sourceCommit is not a full hash`);
        }
        if (!['retain', 'adapt', 'reimplement', 'integrate', 'reject'].includes(entry.sitesmithDecision)) {
          fail(`${entry.capabilityId}: invalid sitesmithDecision`);
        }
        if (!frozenSources.has(entry.sourceRepository)) {
          fail(`${entry.capabilityId}: unexpected sourceRepository ${entry.sourceRepository}`);
        } else if (frozenSources.get(entry.sourceRepository) !== entry.sourceCommit) {
          fail(`${entry.capabilityId}: sourceCommit does not match the frozen repository revision`);
        }
        const manifestSource = manifestSourcesByRepository.get(normalizeGitHubRepository(entry.sourceRepository));
        if (!manifestSource) {
          fail(`${entry.capabilityId}: sourceRepository does not resolve to a provenance source`);
        } else if (entry.sourceCommit !== manifestSource.capabilityRevision) {
          fail(`${entry.capabilityId}: sourceCommit does not match provenance capabilityRevision`);
        }
        if (typeof entry.integrationTreatmentId !== 'string'
            || typeof entry.licenceTreatmentId !== 'string') {
          fail(`${entry.capabilityId}: missing treatment IDs`);
        }
        sourceCounts.set(entry.sourceRepository, (sourceCounts.get(entry.sourceRepository) ?? 0) + 1);
        for (const field of ['sourceFiles', 'sourceLines', 'strengths', 'failureModes', 'tests', 'attributionRequirements']) {
          if (Array.isArray(entry[field]) && entry[field].length === 0) {
            fail(`${entry.capabilityId}: ${field} must record evidence or an explicit absence`);
          }
        }
      }
      if (entries.length !== 59) fail(`expected 59 capabilities, found ${entries.length}`);
      for (const [source, expected] of expectedSourceCounts) {
        const actual = sourceCounts.get(source) ?? 0;
        if (actual !== expected) fail(`${source}: expected ${expected} capabilities, found ${actual}`);
      }
      if (!failures.some((problem) => /capability|sourceCommit|sourceRepository|sitesmithDecision|missing |must be|expected 59/.test(problem))) {
        ok(`${entries.length} capability records satisfy the ledger schema`);
      }

      const matrixPath = path.join(docsDir, 'CAPABILITY-SUPREMACY-MATRIX.md');
      if (fs.existsSync(matrixPath)) {
        const matrix = fs.readFileSync(matrixPath, 'utf8');
        const matrixRows = matrix
          .split(/\r?\n/)
          .filter((line) => /^\|\s*`[^`]+`\s*\|/.test(line))
          .map(splitTableRow);
        const matrixIds = new Map();
        const provenanceCategoryCounts = new Map(integrationCategories.map((category) => [category, 0]));
        for (const cells of matrixRows) {
          if (cells.length !== 12) {
            fail(`matrix row has ${cells.length} columns instead of 12: ${cells[0] ?? '<unknown>'}`);
            continue;
          }
          const id = /^`([^`]+)`$/.exec(cells[0])?.[1];
          if (!id) {
            fail(`matrix row has invalid capability cell ${cells[0]}`);
            continue;
          }
          matrixIds.set(id, (matrixIds.get(id) ?? 0) + 1);
          const canonical = entriesById.get(id);
          if (canonical) {
            if (plainTableCell(cells[1]) !== canonical.activationMechanism) {
              fail(`matrix ${id}: current mechanism is not the canonical activationMechanism`);
            }
            if (plainTableCell(cells[2]) !== canonical.strengths[0]) {
              fail(`matrix ${id}: strength is not the first canonical strength`);
            }
            if (!plainTableCell(cells[4]).includes(canonical.sitesmithSuccessorCapability)) {
              fail(`matrix ${id}: preservation omits the canonical successor`);
            }
            if (plainTableCell(cells[5]) !== canonical.requiredImprovement) {
              fail(`matrix ${id}: required improvement is not canonical`);
            }
            if (plainTableCell(cells[6]) !== canonical.verificationMethod) {
              fail(`matrix ${id}: measurable test is not the canonical verification method`);
            }
          }
          if (!/^\*\*(yes|partial|no)\*\*/.test(cells[3])) fail(`matrix ${id}: missing explicit v2 match`);
          const category = integrationCategory(cells[8]);
          if (!category) fail(`matrix ${id}: missing canonical integration category`);
          else provenanceCategoryCounts.set(category, (provenanceCategoryCounts.get(category) ?? 0) + 1);
          if (canonical) {
            const source = manifestSourcesByRepository.get(normalizeGitHubRepository(canonical.sourceRepository));
            const treatmentProblems = provenanceTreatmentProblems({
              capability: canonical,
              cells,
              sourceId: source?.id,
              integrationTreatments: ledger.integrationTreatments,
              licenceTreatments: ledger.licenceTreatments,
              carriageIds: manifestCarriageIds,
            });
            for (const problem of treatmentProblems) fail(`matrix ${id}: ${problem}`);

            if (category === 'vendored component') {
              const evidenceLinks = [...cells[3].matchAll(/\[[^\]]+]\(([^)]+)\)/g)]
                .map((match) => path.resolve(docsDir, match[1]));
              if (evidenceLinks.length === 0
                  || evidenceLinks.some((evidencePath) => !hashCoveredManifestFiles.has(evidencePath))) {
                fail(`matrix ${id}: vendored repo-evidence must resolve inside a hash-covered provenance group`);
              }
            }
          }
          if (category === 'principle-only inspiration'
              && /\bdeterministic mechanism\b/i.test(plainTableCell(cells[4]))) {
            fail(`matrix ${id}: principle-only preservation may not claim a deterministic mechanism`);
          }
          if (canonical?.sitesmithDecision === 'reject') {
            if (cells[10] !== '`Rejected/exclusion-only`') {
              fail(`matrix ${id}: rejected capability must use architecture cell Rejected/exclusion-only`);
            }
          } else if (!/^`M(?:10|[0-9])-[a-z0-9-]+`$/.test(cells[10])) {
            fail(`matrix ${id}: invalid architecture module ${cells[10]}`);
          }
          if (!/^`QC-[A-Z]+-[0-9]{2}`$/.test(cells[11])) fail(`matrix ${id}: invalid QC benchmark ${cells[11]}`);
          for (let index = 1; index < cells.length; index += 1) {
            if (!cells[index]) fail(`matrix ${id}: empty column ${index + 1}`);
          }
        }
        for (const id of ids) {
          const count = matrixIds.get(id) ?? 0;
          if (count !== 1) fail(`matrix capability ${id} occurs ${count} times`);
        }
        for (const id of matrixIds.keys()) {
          if (!ids.has(id)) fail(`matrix contains unknown capability ${id}`);
        }
        const categorySignature = integrationCountSignature(provenanceCategoryCounts);
        if (categorySignature !== '0/0/0/1/2/30/19/3/4') {
          fail(`matrix integration category counts must be 0/0/0/1/2/30/19/3/4, found ${categorySignature}`);
        }
        if (!licenceAudit.includes('The current matrix satisfies the taxonomy condition 59/59 with counts')
            || !licenceAudit.includes('`0/0/0/1/2/30/19/3/4` in the §5 order')
            || !licenceAudit.includes('**closed for that exact mapped baseline only**')) {
          fail('LICENSE-DERIVATION-AUDIT.md: missing exact 59/59 category count and narrow mapped-baseline conclusion');
        }
        if (!failures.some((problem) => problem.startsWith('matrix'))) {
          ok(`supremacy matrix maps ${matrixRows.length}/${entries.length} capabilities exactly once`);
        }

        const ledgerMarkdownPath = path.join(docsDir, 'UPSTREAM-CAPABILITY-LEDGER.md');
        if (fs.existsSync(ledgerMarkdownPath)) {
          const ledgerMarkdown = fs.readFileSync(ledgerMarkdownPath, 'utf8');
          if (!ledgerMarkdown.includes('exactly 26 fields per record')
              || !ledgerMarkdown.includes('59/59 records have 26/26 fields')
              || /24[- ]field|24\/24/.test(ledgerMarkdown)) {
            fail('ledger Markdown must report the exact 26-field JSON record schema');
          }
          const ledgerRows = ledgerMarkdown
            .split(/\r?\n/)
            .filter((line) => /^\|[^|]+\|\s*`[^`]+`\s*\|/.test(line))
            .map(splitTableRow);
          const ledgerRowsById = new Map(ledgerRows.map((cells) => [cells[1]?.replaceAll('`', ''), cells]));
          for (const id of ids) {
            const count = countLiteral(ledgerMarkdown, `\`${id}\``);
            if (count !== 1) fail(`ledger Markdown capability ${id} occurs ${count} times`);
            const cells = ledgerRowsById.get(id);
            const canonical = entriesById.get(id);
            if (!cells || cells.length !== 7) {
              fail(`ledger Markdown capability ${id} lacks its seven-column projection row`);
              continue;
            }
            const mechanismAndStrength = plainTableCell(cells[2]);
            const expectedProjection = `${canonical.activationMechanism} **Strength:** ${canonical.strengths[0]}`;
            if (mechanismAndStrength !== expectedProjection) {
              fail(`ledger Markdown capability ${id} mechanism/strength projection drifted`);
            }
            if (cells[3].replaceAll('`', '') !== canonical.sitesmithDecision) {
              fail(`ledger Markdown capability ${id} decision projection drifted`);
            }
            if (!plainTableCell(cells[4]).includes(canonical.sitesmithSuccessorCapability)) {
              fail(`ledger Markdown capability ${id} successor projection drifted`);
            }
            if (plainTableCell(cells[5]) !== canonical.requiredImprovement) {
              fail(`ledger Markdown capability ${id} improvement projection drifted`);
            }
            if (plainTableCell(cells[6]) !== canonical.verificationMethod) {
              fail(`ledger Markdown capability ${id} verification projection drifted`);
            }
          }
          if (!failures.some((problem) => problem.startsWith('ledger Markdown capability'))) {
            ok('readable ledger covers all capabilities exactly once');
          }
        }

        const architecturePath = path.join(docsDir, 'DERIVATION-ARCHITECTURE.md');
        const qualityPath = path.join(docsDir, 'QUALITY-CONTRACT.md');
        if (fs.existsSync(architecturePath) && fs.existsSync(qualityPath)) {
          const architecture = fs.readFileSync(architecturePath, 'utf8');
          const quality = fs.readFileSync(qualityPath, 'utf8');
          const modules = new Set(matrixRows
            .map((cells) => cells[10]?.replaceAll('`', ''))
            .filter((moduleId) => /^M(?:10|[0-9])-[a-z0-9-]+$/.test(moduleId ?? '')));
          const benchmarks = new Set(matrixRows.map((cells) => cells[11]?.replaceAll('`', '')).filter(Boolean));
          const allMatrixQcIds = new Set([...matrix.matchAll(/QC-[A-Z]+-[0-9]{2}/g)].map((match) => match[0]));
          for (const moduleId of modules) {
            if (!architecture.includes(`\`${moduleId}\``)) fail(`architecture missing matrix module ${moduleId}`);
          }
          for (const benchmarkId of benchmarks) {
            if (!quality.includes(`\`${benchmarkId}\``)) fail(`quality contract missing matrix benchmark ${benchmarkId}`);
          }
          for (const qcId of allMatrixQcIds) {
            if (!quality.includes(`\`${qcId}\``)) fail(`quality contract missing matrix subgate ${qcId}`);
          }
          let assertionById = new Map();
          if (fs.existsSync(path.join(root, strengthAssertionsRelativePath))) {
            try {
              const assertionContract = parseStrictJson(fs.readFileSync(path.join(root, strengthAssertionsRelativePath), 'utf8'));
              assertionById = new Map((assertionContract.assertions ?? [])
                .map((assertion) => [assertion.capabilityId, assertion]));
            } catch (error) {
              fail(`capability disposition: cannot parse STRENGTH-ASSERTIONS.json: ${error.message}`);
            }
          }
          for (const cells of matrixRows) {
            const id = cells[0].replaceAll('`', '');
            const canonical = entriesById.get(id);
            if (!canonical) continue;
            const dispositionProblems = capabilityDispositionProblems({
              canonical,
              cells,
              assertion: assertionById.get(id),
              architecture,
            });
            for (const problem of dispositionProblems) {
              fail(`capability disposition ${id}: ${problem}`);
            }
          }

          const rejectedLedgerIds = new Set(entries
            .filter((entry) => entry.sitesmithDecision === 'reject')
            .map((entry) => entry.capabilityId));
          const nonRejectedCount = entries.length - rejectedLedgerIds.size;
          if (nonRejectedCount !== 55 || rejectedLedgerIds.size !== 4) {
            fail(`capability disposition count must be 55 non-rejected and 4 rejected, found ${nonRejectedCount}/${rejectedLedgerIds.size}`);
          }
          const rejectedAssertionIds = new Set([...assertionById.values()]
            .filter((assertion) => assertion.rejectionTreatment?.classification === 'deliberate-rejection')
            .map((assertion) => assertion.capabilityId));
          const rejectedArchitectureIds = new Set();
          for (const line of architecture.split(/\r?\n/)) {
            if (!/^\s*\|/.test(line)) continue;
            const cells = splitTableRow(line);
            if (plainTableCell(cells[0] ?? '') !== 'Rejected/exclusion-only') continue;
            for (const match of line.matchAll(/`([^`]+)`/g)) rejectedArchitectureIds.add(match[1]);
          }
          const sameIds = (left, right) => (
            left.size === right.size && [...left].every((id) => right.has(id))
          );
          if (!sameIds(rejectedLedgerIds, rejectedAssertionIds)
              || !sameIds(rejectedLedgerIds, rejectedArchitectureIds)) {
            fail('capability disposition reject IDs differ between ledger, assertions and architecture');
          }
          if (!failures.some((problem) => /architecture missing matrix module|quality contract missing matrix benchmark/.test(problem))) {
            ok(`${modules.size} architecture modules and ${benchmarks.size} QC gates close the traceability chain`);
          }
          if (!failures.some((problem) => problem.startsWith('quality contract missing matrix subgate'))) {
            ok(`quality contract defines all ${allMatrixQcIds.size} matrix QC IDs`);
          }
          if (!failures.some((problem) => problem.startsWith('capability disposition'))) {
            ok('derivation architecture carries 55 capabilities and records 4 exclusion-only losses exactly once');
          }
        }
      }
    }
  }
}

const strengthAssertionsPath = path.join(root, strengthAssertionsRelativePath);
if (!fs.existsSync(strengthAssertionsPath)) {
  fail('missing required strength assertion contract STRENGTH-ASSERTIONS.json');
} else if (fs.existsSync(ledgerPath)) {
  let contract;
  try {
    contract = parseStrictJson(fs.readFileSync(strengthAssertionsPath, 'utf8'));
  } catch (error) {
    fail(`STRENGTH-ASSERTIONS.json: ${error.message}`);
  }
  if (contract) {
    const ledger = parseStrictJson(fs.readFileSync(ledgerPath, 'utf8'));
    const canonicalById = new Map(ledger.capabilities.map((entry) => [entry.capabilityId, entry]));
    const matrix = docs.get('CAPABILITY-SUPREMACY-MATRIX.md') ?? '';
    const matrixRows = matrix
      .split(/\r?\n/)
      .filter((line) => /^\|\s*`[^`]+`\s*\|/.test(line))
      .map(splitTableRow);
    const matrixById = new Map(matrixRows.map((cells) => [cells[0].replaceAll('`', ''), cells]));
    const assertions = contract.assertions;
    if (contract.schemaVersion !== '2.0.0') {
      fail(`STRENGTH-ASSERTIONS.json: schemaVersion must be 2.0.0, found ${contract.schemaVersion}`);
    }
    if (contract.status !== 'preregistered-not-executed') {
      fail(`STRENGTH-ASSERTIONS.json: invalid status ${contract.status}`);
    }

    const policySourceSpecs = [
      ['qualityContract', qualityContractRelativePath, 'contractVersion', 'QUALITY-CONTRACT.md'],
      ['derivationArchitecture', derivationArchitectureRelativePath, 'architectureVersion', 'DERIVATION-ARCHITECTURE.md'],
    ];
    for (const [key, expectedPath, versionField, markdownName] of policySourceSpecs) {
      const source = contract.sourceOfTruth?.[key];
      const markdown = docs.get(markdownName) ?? '';
      const expectedVersion = frontmatterValue(markdown, versionField);
      if (source?.path !== expectedPath) {
        fail(`STRENGTH-ASSERTIONS.json: sourceOfTruth.${key}.path must be ${expectedPath}`);
      }
      if (!expectedVersion || source?.[versionField] !== expectedVersion) {
        fail(`STRENGTH-ASSERTIONS.json: sourceOfTruth.${key}.${versionField} must match ${markdownName} frontmatter`);
      }
      const absolutePath = path.resolve(root, expectedPath);
      if (!fs.existsSync(absolutePath) || source?.sha256 !== sha256(absolutePath)) {
        fail(`STRENGTH-ASSERTIONS.json: sourceOfTruth.${key}.sha256 must match current ${expectedPath} bytes`);
      }
    }

    if (contract.assertionCount !== 59 || !Array.isArray(assertions) || assertions.length !== 59) {
      fail(`STRENGTH-ASSERTIONS.json: expected 59 assertions`);
    } else {
      const requiredFields = [
        'assertionVersion', 'capabilityId', 'exactUpstreamStrength', 'matrixConcreteStrength',
        'strengthRelation', 'sourceBaseline', 'fixture', 'applicableBriefsOrSystemFixture',
        'observableMeasure', 'directionOfBenefit', 'policyRefs', 'verdictPredicate',
        'semanticSha256', 'qcGate', 'subgate',
        'artifactPath', 'negativeControl', 'rejectionTreatment', 'sitesmithDecision',
        'matrixIntegrationTreatment', 'status',
      ];
      const seen = new Set();
      const seenSubgates = new Set();
      let rejected = 0;
      const modeCounts = new Map([
        ['exact-binary', 0],
        ['seven-point-non-inferiority', 0],
        ['binary-rate-non-inferiority', 0],
        ['exclusion', 0],
      ]);
      const boundPolicyPaths = new Set(Object.values(contract.sourceOfTruth ?? {})
        .map((source) => source?.path)
        .filter(Boolean));
      for (const assertion of assertions) {
        const id = assertion.capabilityId ?? '<unknown>';
        for (const field of requiredFields) {
          if (!(field in assertion)) fail(`strength assertion ${id}: missing ${field}`);
        }
        if ('exactBinaryRule' in assertion) {
          fail(`strength assertion ${id}: exactBinaryRule is forbidden by schemaVersion 2.0.0`);
        }
        if (seen.has(id)) fail(`strength assertion ${id}: duplicate capabilityId`);
        seen.add(id);
        const canonical = canonicalById.get(id);
        const matrixRow = matrixById.get(id);
        if (!canonical || !matrixRow) {
          fail(`strength assertion ${id}: unknown capability`);
          continue;
        }
        if (assertion.exactUpstreamStrength !== canonical.strengths[0]) {
          fail(`strength assertion ${id}: upstream strength drifted`);
        }
        if (assertion.matrixConcreteStrength !== plainTableCell(matrixRow[2])) {
          fail(`strength assertion ${id}: matrix strength drifted`);
        }
        if (assertion.observableMeasure?.ledgerVerificationMethod !== canonical.verificationMethod
            || assertion.observableMeasure?.matrixMeasurableTest !== plainTableCell(matrixRow[6])) {
          fail(`strength assertion ${id}: verification method drifted`);
        }
        if (assertion.qcGate !== matrixRow[11].replaceAll('`', '')) {
          fail(`strength assertion ${id}: QC gate drifted`);
        }
        const subgate = assertion.subgate;
        const assertionSpecificSubgate = `SA::${id}`;
        if (subgate === assertion.qcGate) {
          fail(`strength assertion ${id}: subgate may not equal its parent QC gate`);
        } else if (typeof subgate !== 'string'
            || (!subgate.startsWith('SA::') && !/^QC-[A-Z]+-[0-9]{2}$/.test(subgate))) {
          fail(`strength assertion ${id}: invalid subgate ${subgate}`);
        } else if (subgate.startsWith('SA::') && subgate !== assertionSpecificSubgate) {
          fail(`strength assertion ${id}: assertion-specific subgate must be ${assertionSpecificSubgate}`);
        } else if (subgate.startsWith('QC-')
            && !canonical.verificationMethod.includes(subgate)) {
          fail(`strength assertion ${id}: named QC subgate is absent from the canonical verification method`);
        }
        if (seenSubgates.has(subgate)) {
          fail(`strength assertion ${id}: duplicate subgate ${subgate}`);
        }
        seenSubgates.add(subgate);
        if (assertion.sitesmithDecision !== canonical.sitesmithDecision) {
          fail(`strength assertion ${id}: SiteSmith decision drifted`);
        }
        if (assertion.matrixIntegrationTreatment !== matrixRow[8]) {
          fail(`strength assertion ${id}: integration treatment drifted`);
        }
        if (assertion.sourceBaseline?.repository !== canonical.sourceRepository
            || assertion.sourceBaseline?.commit !== canonical.sourceCommit
            || JSON.stringify(assertion.sourceBaseline?.files) !== JSON.stringify(canonical.sourceFiles)
            || JSON.stringify(assertion.sourceBaseline?.lines) !== JSON.stringify(canonical.sourceLines)) {
          fail(`strength assertion ${id}: source baseline drifted`);
        }
        if (!Array.isArray(assertion.applicableBriefsOrSystemFixture)
            || assertion.applicableBriefsOrSystemFixture.length === 0) {
          fail(`strength assertion ${id}: missing applicable fixture`);
        }
        if (assertion.status !== 'preregistered-not-executed') {
          fail(`strength assertion ${id}: invalid status ${assertion.status}`);
        }
        const isRejected = canonical.sitesmithDecision === 'reject';
        if (isRejected) rejected += 1;
        const classification = assertion.rejectionTreatment?.classification;
        if (classification !== (isRejected ? 'deliberate-rejection' : 'not-rejected')) {
          fail(`strength assertion ${id}: invalid rejection classification ${classification}`);
        }
        if (isRejected && !assertion.directionOfBenefit.includes('Exact exclusion')) {
          fail(`strength assertion ${id}: rejection may not claim preservation`);
        }
        if (!assertion.negativeControl?.id || !assertion.negativeControl?.requiredObservation) {
          fail(`strength assertion ${id}: incomplete negative control`);
        }

        if (!Array.isArray(assertion.policyRefs) || assertion.policyRefs.length === 0
            || new Set(assertion.policyRefs).size !== assertion.policyRefs.length
            || assertion.policyRefs.some((policyRef) => typeof policyRef !== 'string'
              || !boundPolicyPaths.has(policyRef))) {
          fail(`strength assertion ${id}: policyRefs must be unique bound sourceOfTruth paths`);
        } else {
          if (!assertion.policyRefs.includes(qualityContractRelativePath)) {
            fail(`strength assertion ${id}: policyRefs must include ${qualityContractRelativePath}`);
          }
          if (id === 'IMP-002'
              && !assertion.policyRefs.includes(derivationArchitectureRelativePath)) {
            fail(`strength assertion ${id}: policyRefs must include ${derivationArchitectureRelativePath}`);
          }
        }

        const expectedPredicate = expectedVerdictPredicate(assertion, contract.sourceOfTruth);
        if (!isDeepStrictEqual(assertion.verdictPredicate, expectedPredicate)) {
          fail(`strength assertion ${id}: verdictPredicate drifted from its mechanical inputs`);
        }
        const expectedSemanticSha256 = stableJsonSha256(expectedPredicate);
        if (assertion.semanticSha256 !== expectedSemanticSha256) {
          fail(`strength assertion ${id}: semanticSha256 must seal canonical verdictPredicate JSON`);
        }
        const mode = expectedPredicate.comparison.mode;
        modeCounts.set(mode, (modeCounts.get(mode) ?? 0) + 1);
      }
      for (const id of canonicalById.keys()) {
        if (!seen.has(id)) fail(`strength assertions missing capability ${id}`);
      }
      if (contract.rejectedCount !== 4 || rejected !== 4) {
        fail(`strength assertions expected 4 deliberate rejections, found contract=${contract.rejectedCount} assertions=${rejected}`);
      }
      const expectedModeCounts = new Map([
        ['exact-binary', 41],
        ['seven-point-non-inferiority', 12],
        ['binary-rate-non-inferiority', 2],
        ['exclusion', 4],
      ]);
      for (const [mode, expectedCount] of expectedModeCounts) {
        if (modeCounts.get(mode) !== expectedCount) {
          fail(`strength assertions expected ${expectedCount} ${mode} predicates, found ${modeCounts.get(mode)}`);
        }
      }

      const configuredBase = (process.env.SITESMITH_BASE_SHA ?? '').trim();
      let previousRevision = 'HEAD';
      let canReadHistory = true;
      if (configuredBase) {
        if (!/^[0-9a-f]{40}$/i.test(configuredBase) || /^0{40}$/.test(configuredBase)) {
          fail('STRENGTH-ASSERTIONS.json: SITESMITH_BASE_SHA must be a non-zero 40-character commit SHA');
          canReadHistory = false;
        } else {
          previousRevision = configuredBase;
        }
      }
      if (canReadHistory && !gitCommitExists(previousRevision)) {
        fail(`STRENGTH-ASSERTIONS.json: historical revision ${previousRevision} is unavailable`);
        canReadHistory = false;
      }
      const previousBytes = canReadHistory
        ? gitFileAt(previousRevision, strengthAssertionsRelativePath)
        : undefined;
      if (canReadHistory && previousBytes === undefined) {
        const existingOutputs = assertions
          .map((assertion) => assertion.artifactPath)
          .filter((artifactPath) => typeof artifactPath === 'string'
            && fs.existsSync(path.resolve(root, artifactPath)));
        if (existingOutputs.length > 0) {
          fail(`STRENGTH-ASSERTIONS.json: initial seal is forbidden after result outputs exist (${existingOutputs.join(', ')})`);
        }
      } else {
        let previousContract;
        try {
          previousContract = parseStrictJson(previousBytes);
        } catch (error) {
          fail(`STRENGTH-ASSERTIONS.json: previous contract at ${previousRevision} is invalid JSON: ${error.message}`);
        }
        const previousById = new Map((previousContract?.assertions ?? [])
          .map((assertion) => [assertion.capabilityId, assertion]));
        for (const assertion of assertions) {
          const previous = previousById.get(assertion.capabilityId);
          if (!previous) {
            fail(`strength assertion ${assertion.capabilityId}: missing from previous contract at ${previousRevision}`);
            continue;
          }
          const versionComparison = compareSemver(assertion.assertionVersion, previous.assertionVersion);
          if (versionComparison === undefined) {
            fail(`strength assertion ${assertion.capabilityId}: assertionVersion must be valid semver`);
          } else if (assertion.semanticSha256 === previous.semanticSha256
              && assertion.assertionVersion !== previous.assertionVersion) {
            fail(`strength assertion ${assertion.capabilityId}: unchanged semanticSha256 requires unchanged assertionVersion`);
          } else if (assertion.semanticSha256 !== previous.semanticSha256 && versionComparison <= 0) {
            fail(`strength assertion ${assertion.capabilityId}: changed semanticSha256 requires a higher assertionVersion`);
          }
        }
      }
    }

    for (const source of Object.values(contract.sourceOfTruth ?? {})) {
      const sourcePath = source?.path ? path.resolve(root, source.path) : '';
      if (!sourcePath || !fs.existsSync(sourcePath)) {
        fail(`STRENGTH-ASSERTIONS.json: missing hashed source ${source?.path ?? '<unknown>'}`);
      } else if (sha256(sourcePath) !== source.sha256) {
        fail(`STRENGTH-ASSERTIONS.json: hash drift for ${source.path}`);
      }
    }
    if (!failures.some((problem) => /strength assertion|strength assertions|STRENGTH-ASSERTIONS/.test(problem))) {
      ok('59 preregistered StrengthAssertions are policy-bound, mechanically sealed and history-safe');
    }
  }
}

const routingFailureCountBefore = failures.length;
if (fs.existsSync(ledgerPath) && fs.existsSync(strengthAssertionsPath)) {
  const routingLedger = parseStrictJson(fs.readFileSync(ledgerPath, 'utf8'));
  const routingAssertions = parseStrictJson(fs.readFileSync(strengthAssertionsPath, 'utf8'));
  const routingCapability = routingLedger.capabilities?.find((entry) => entry.capabilityId === 'IMP-002');
  const routingAssertion = routingAssertions.assertions?.find((entry) => entry.capabilityId === 'IMP-002');
  const architecture = docs.get('DERIVATION-ARCHITECTURE.md') ?? '';
  const quality = docs.get('QUALITY-CONTRACT.md') ?? '';

  if (!routingCapability) {
    fail('routing contract: missing IMP-002 capability');
  } else {
    const capabilityContract = [
      routingCapability.sitesmithSuccessorCapability,
      routingCapability.requiredImprovement,
      routingCapability.verificationMethod,
    ].join('\n');
    for (const token of [
      'capability-router', 'selectedCapabilities', 'excludedCapabilities', '100 % nødvendige',
      '0 forbudte', 'full-registry fallback', 'QC-ROUTING-01', 'surface', 'page-job', 'task',
      'selectedCapabilities < 59', 'eksplicit ambiguity',
    ]) {
      if (!capabilityContract.includes(token)) fail(`routing contract IMP-002: missing ${token}`);
    }
  }

  const architecturePatterns = [
    /RouteDecision := \{[\s\S]*?selectedCapabilities:[\s\S]*?excludedCapabilities:[\s\S]*?ambiguity:[\s\S]*?decisionHash[\s\S]*?\}/,
    /CapabilityPacketManifest := \{[\s\S]*?routeDecisionHash[\s\S]*?selectedCapabilities\[\][\s\S]*?excludedCapabilities\[\][\s\S]*?requiredCapabilities\[\][\s\S]*?forbiddenCapabilities\[\][\s\S]*?compiledInstructionRefs[\s\S]*?manifestHash[\s\S]*?\}/,
    /ActorInputPacket := \{[\s\S]*?routeDecisionRef[\s\S]*?capabilityManifest:[\s\S]*?instructionDigest[\s\S]*?packetHash[\s\S]*?\}/,
    /WorkOrder<Inputs, Output> := \{[\s\S]*?actorInputPacketHash[\s\S]*?capabilityManifestHash[\s\S]*?instructionDigest[\s\S]*?routeDecisionRef[\s\S]*?selectedCapabilities\[\][\s\S]*?excludedCapabilities\[\][\s\S]*?requiredCapabilities\[\][\s\S]*?forbiddenCapabilities\[\]/,
    /ProviderSubmission<Output> := \{[\s\S]*?actorInputPacketHash[\s\S]*?capabilityManifestHash[\s\S]*?instructionDigest[\s\S]*?routeDecisionHash[\s\S]*?packetManifestHash[\s\S]*?carriedCapabilities\[\][\s\S]*?requiredCapabilities\[\][\s\S]*?excludedCapabilities\[\][\s\S]*?forbiddenCapabilities\[\][\s\S]*?evidenceHash/,
    /ordinary complete task[\s\S]*?non-empty proper subset of the 59-entry\s+registry/,
    /Missing material\s+routing evidence[\s\S]*?no `WorkOrder`[\s\S]*?full\s+registry/,
    /CapabilityPacketManifest\.selectedCapabilities[\s\S]*?equal the route's selected set exactly[\s\S]*?59\/59 partition[\s\S]*?all required capabilities[\s\S]*?zero excluded or forbidden capabilities/,
    /WorkOrder`, packet and provider submission[\s\S]*?same route, manifest and instruction digests[\s\S]*?exact\s+selected-set carriage[\s\S]*?complete required-set carriage[\s\S]*?zero excluded\/forbidden carriage/,
    /required-instruction omission[\s\S]*?excluded\/forbidden instruction injection[\s\S]*?standing full-registry context/,
    /preregistered type-and-test contract[\s\S]*?documentation gate does not prove runtime parity[\s\S]*?executable\s+`QC-ROUTING-01` corpus/,
  ];
  architecturePatterns.forEach((pattern, index) => {
    if (!pattern.test(architecture)) fail(`routing architecture: missing binding pattern ${index + 1}`);
  });

  const qualityTokens = [
    '| `QC-ROUTING-01` | `QC-INSTALL-01` |', '59/59 partition', '100% required',
    'zero forbidden', '`1–58` capabilities', 'ambiguity emits no WorkOrder',
    'all-59 standard-task fallback', '`CapabilityPacketManifest`',
    'packet, WorkOrder and submission quote identical route/manifest/instruction digests',
    'required omission', 'excluded/forbidden/full-registry instruction injection',
    '`QC-ROUTING-01` remains unexecuted', 'Static document consistency cannot pass',
  ];
  for (const token of qualityTokens) {
    if (!quality.includes(token)) fail(`routing quality contract: missing ${token}`);
  }

  if (!routingAssertion) {
    fail('routing contract: missing IMP-002 StrengthAssertion');
  } else {
    if (routingAssertion.assertionVersion !== '2.0.0') {
      fail('routing StrengthAssertion: assertionVersion must be 2.0.0');
    }
    if (routingAssertion.subgate !== 'QC-ROUTING-01') {
      fail('routing StrengthAssertion: subgate must be QC-ROUTING-01');
    }
    if (!routingAssertion.applicableBriefsOrSystemFixture?.includes('SYS-ROUTING-SUBSET')) {
      fail('routing StrengthAssertion: missing SYS-ROUTING-SUBSET fixture');
    }
    const negative = routingAssertion.negativeControl?.seededCondition ?? '';
    const requiredNegativeControls = [
      /59 capabilities/i,
      /ambiguity-state/i,
      /(?:required-instruction|required instruction|required-omission)/i,
      /excluded\/forbidden\/full-registry instruction/i,
      /ActorInputPacket/,
      /ProviderSubmission/,
    ];
    if (requiredNegativeControls.some((pattern) => !pattern.test(negative))) {
      fail('routing StrengthAssertion: negative control must cover all-registry, ambiguity, required omission and packet/submission instruction injection');
    }
    if (!routingAssertion.policyRefs?.includes(derivationArchitectureRelativePath)) {
      fail('routing StrengthAssertion: policyRefs must bind the derivation architecture');
    }
  }
}
if (failures.length === routingFailureCountBefore) {
  ok('IMP-002 documentation binds the unexecuted route/packet/submission parity contract without claiming runtime proof');
}

const foundation = docs.get('FOUNDATION-DECISION.md');
if (foundation) {
  const status = frontmatterValue(foundation, 'status');
  const statusToFinal = new Map([
    ['not-ready-upstream-analysis-incomplete', 'NOT READY — UPSTREAM ANALYSIS INCOMPLETE'],
    ['not-ready-derivation-architecture-incomplete', 'NOT READY — DERIVATION ARCHITECTURE INCOMPLETE'],
    ['not-ready-licensing-blocked', 'NOT READY — LICENSING BLOCKED'],
    ['not-ready-quality-contract-incomplete', 'NOT READY — QUALITY CONTRACT INCOMPLETE'],
    ['ready-for-architecture-approval', 'READY FOR ARCHITECTURE APPROVAL'],
  ]);
  if (!statusToFinal.has(status)) fail(`FOUNDATION-DECISION.md: invalid decision status ${status}`);
  const expectedFinal = statusToFinal.get(status);
  if (expectedFinal && foundation.trimEnd().split('\n').at(-1) !== expectedFinal) {
    fail(`FOUNDATION-DECISION.md: final status line must be ${expectedFinal}`);
  }
  if (!foundation.includes('[26-field JSON ledger]')
      || !foundation.includes('Canonical 26-field records')
      || /24[- ]field/.test(foundation)) {
    fail('FOUNDATION-DECISION.md: must report the exact 26-field capability schema');
  }

  if (status === 'ready-for-architecture-approval') {
    const requiredReviews = [
      'reviews/TRACEABILITY-REVIEW-F.md',
      'reviews/ADVERSARIAL-REVIEW-F.md',
    ];
    for (const reviewPath of requiredReviews) {
      const review = docs.get(path.normalize(reviewPath));
      if (!review) {
        fail(`ready decision missing required review ${reviewPath}`);
        continue;
      }
      for (const problem of reviewVerdictProblems(review)) fail(`${reviewPath}: ${problem}`);
      if (frontmatterValue(review, 'contextIsolation') !== 'fork_turns=none') {
        fail(`${reviewPath}: contextIsolation must be fork_turns=none`);
      }
      if (frontmatterValue(review, 'originalRecommendationKnown') !== 'no') {
        fail(`${reviewPath}: originalRecommendationKnown must be no`);
      }
      validateReviewArtifactHashes(reviewPath, review);
    }
  }
}

const expectedDocumentStatuses = new Map([
  ['UPSTREAM-FORENSICS.md', 'complete'],
  ['UPSTREAM-CAPABILITY-LEDGER.md', 'complete'],
  ['CAPABILITY-SUPREMACY-MATRIX.md', 'complete'],
  ['DERIVATION-ARCHITECTURE.md', 'proposed-for-architecture-approval'],
  ['QUALITY-CONTRACT.md', 'contract-complete-not-executed'],
  ['ADOPTION-ARCHITECTURE.md', 'complete'],
  ['LICENSE-DERIVATION-AUDIT.md', 'complete'],
]);
for (const [file, expectedStatus] of expectedDocumentStatuses) {
  const markdown = docs.get(file);
  if (markdown && frontmatterValue(markdown, 'status') !== expectedStatus) {
    fail(`${file}: expected status ${expectedStatus}`);
  }
}

const forensics = docs.get('UPSTREAM-FORENSICS.md');
if (forensics && fs.existsSync(ledgerPath)) {
  const ledger = parseStrictJson(fs.readFileSync(ledgerPath, 'utf8'));
  const forensicLines = forensics.split('\n');
  if (countLiteral(forensics, '26-field') !== 3 || /24[- ]field/.test(forensics)) {
    fail('forensics must report the exact 26-field capability schema at all three ledger hand-offs');
  }
  for (const capability of ledger.capabilities ?? []) {
    const count = countLiteral(forensics, `\`${capability.capabilityId}\``);
    if (count !== 1) fail(`forensics capability ${capability.capabilityId} occurs ${count} times`);
    const row = forensicLines.find((line) => line.includes(`\`${capability.capabilityId}\``)) ?? '';
    if (!row.toLowerCase().includes(`**${capability.sitesmithDecision}`)) {
      fail(`forensics capability ${capability.capabilityId} omits canonical decision ${capability.sitesmithDecision}`);
    }
  }
  for (const sectionNumber of [3, 4, 5, 6]) {
    const startMarker = `### ${sectionNumber}.2 `;
    const endMarker = `\n### ${sectionNumber}.3 `;
    const start = forensics.indexOf(startMarker);
    const end = start < 0 ? -1 : forensics.indexOf(endMarker, start);
    const section = start < 0 || end < 0 ? '' : forensics.slice(start, end);
    const steps = [...section.matchAll(/^\|\s+(\d+)\.\s+/gm)].map((match) => Number(match[1]));
    const expected = Array.from({ length: 15 }, (_, index) => index + 1);
    if (steps.join(',') !== expected.join(',')) {
      fail(`forensics section ${sectionNumber}.2 has activation steps ${steps.join(',') || '<none>'}`);
    }
  }
  if (!failures.some((problem) => problem.startsWith('forensics capability') || problem.startsWith('forensics section'))) {
    ok('four upstreams each have a 15-step flow and exact capability coverage');
  }
}

const licenceAudit = docs.get('LICENSE-DERIVATION-AUDIT.md');
if (licenceAudit && frontmatterValue(licenceAudit, 'status') === 'complete') {
  if (/LICENSING GATE OPEN|pending consolidation|missing Apache-2\.0 licence copy/i.test(licenceAudit)) {
    fail('LICENSE-DERIVATION-AUDIT.md: complete audit still contains an open-gap marker');
  }
}

if (failures.length) {
  for (const problem of failures) console.error(`FAIL ${problem}`);
  process.exit(1);
}

ok(`${requiredDocs.length} required v3 documents are present`);
console.log('PASS — v3 documentation structure and traceability hold');
