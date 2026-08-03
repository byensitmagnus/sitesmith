#!/usr/bin/env node
/**
 * Generates the skeleton of SOURCE-CONTRIBUTIONS.json from data already on disk.
 *
 *   node tools/build-source-contributions.mjs            # print what it would write
 *   node tools/build-source-contributions.mjs --write    # write the file
 *
 * It reads docs/rebuild/SOURCE-REGISTRY.json for the pinned commit and the licence, and
 * docs/rebuild/PLACEMENT.json for the mechanisms that reached a named file. It never
 * invents a repository, a commit or a licence: a source resolved with an unknown licence
 * comes out with the same unknown here, and a source with no placement comes out with an
 * empty mechanismsUsed, which is what tools/source-coverage.mjs refuses.
 *
 * The generated file is a starting point, not the deliverable. loadedWhen, proof and the
 * integration class are judgements about the shipped product and are written by hand;
 * regenerating merges rather than overwrites them, so hand-written rows survive.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'SOURCE-CONTRIBUTIONS.json');

const readJson = async (p) => JSON.parse(await readFile(join(root, p), 'utf8'));

const registry = await readJson('docs/rebuild/SOURCE-REGISTRY.json');
const sources = Array.isArray(registry) ? registry : registry.sources ?? Object.values(registry);
const placementRaw = await readJson('docs/rebuild/PLACEMENT.json');
const placements = Array.isArray(placementRaw) ? placementRaw : placementRaw.placements ?? Object.values(placementRaw);

/* A placement counts as a contribution only when it names a file that ships or a tool that
   runs. "already-present" means the idea was there before the source was read, which is
   not a contribution from that source; "reference-only" and "drop" are self-explanatory. */
const SHIPPED = (t) => typeof t === 'string' && t.includes('/');

const bySource = new Map();
for (const p of placements) {
  if (!SHIPPED(p.target)) continue;
  const row = bySource.get(p.source) ?? { mechanisms: new Set(), paths: new Set() };
  row.mechanisms.add(p.key.split('/').slice(1).join('/'));
  row.paths.add(p.target);
  bySource.set(p.source, row);
}

/* The two sources in the requirement that the research pass did not resolve as upstream
   repositories, recorded here rather than fabricated. sitesmith-v2 is this repository's
   own previous version, so its commit is a real commit in this history; framer-motion is
   a library rather than a repository we pinned, and it has no entry in SOURCE-REGISTRY,
   which the coverage gate reports rather than papers over. */
const EXTRA = [
  {
    id: 'sitesmith-v2',
    name: 'Existing SiteSmith v2.3',
    licence: 'MIT',
    headCommit: null, // filled from git by hand in the committed file, see below
    aliases: ['sitesmith-current', 'sitesmith-modes'],
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion patterns',
    licence: 'MIT',
    headCommit: null,
    aliases: [],
  },
];

const rows = [];
for (const s of [...sources, ...EXTRA]) {
  const aliases = s.aliases ?? [s.id];
  const merged = { mechanisms: new Set(), paths: new Set() };
  for (const a of [s.id, ...aliases]) {
    const hit = bySource.get(a);
    if (!hit) continue;
    for (const m of hit.mechanisms) merged.mechanisms.add(m);
    for (const p of hit.paths) merged.paths.add(p);
  }
  rows.push({
    source: s.id,
    name: s.name ?? s.id,
    canonicalCommit: s.headCommit ?? null,
    license: s.licence ?? null,
    redistribution: s.redistribution?.status ?? null,
    integration: null,
    mechanismsUsed: [...merged.mechanisms].sort(),
    sitesmithPaths: [...merged.paths].sort(),
    loadedWhen: [],
    proof: [],
    attributionPath: null,
  });
}

const doc = {
  $comment:
    'Canonical register of what each analysed source actually contributes to the shipped '
    + 'product. tools/source-coverage.mjs refuses a release when a required source has no '
    + 'mechanism, no path, no proof, no licence or no attribution. Generated skeleton from '
    + 'docs/rebuild/SOURCE-REGISTRY.json and docs/rebuild/PLACEMENT.json; the judgement '
    + 'fields are written by hand.',
  generatedFrom: ['docs/rebuild/SOURCE-REGISTRY.json', 'docs/rebuild/PLACEMENT.json'],
  sources: rows,
};

if (!process.argv.includes('--write')) {
  const gaps = rows.filter((r) => !r.mechanismsUsed.length);
  console.log(`${rows.length} source(s); ${gaps.length} with no mechanism in a shipped file:`);
  for (const g of gaps) console.log(`  ${g.source}`);
  console.log(`\npass --write to write ${OUT}`);
  process.exit(0);
}

/* Merge, never clobber. The judgement fields are the expensive part of this file. */
let existing = null;
if (existsSync(OUT)) existing = JSON.parse(await readFile(OUT, 'utf8'));
if (existing) {
  const prior = new Map(existing.sources.map((r) => [r.source, r]));
  for (const r of doc.sources) {
    const p = prior.get(r.source);
    if (!p) continue;
    r.integration = p.integration ?? r.integration;
    r.loadedWhen = p.loadedWhen?.length ? p.loadedWhen : r.loadedWhen;
    r.proof = p.proof?.length ? p.proof : r.proof;
    r.attributionPath = p.attributionPath ?? r.attributionPath;
    r.canonicalCommit = r.canonicalCommit ?? p.canonicalCommit;
    // Hand-written mechanism and path lists win: a clean-room contribution has no
    // placement row, because it was never extracted from the source in the first place.
    if (p.mechanismsUsed?.length) r.mechanismsUsed = [...new Set([...p.mechanismsUsed, ...r.mechanismsUsed])].sort();
    if (p.sitesmithPaths?.length) r.sitesmithPaths = [...new Set([...p.sitesmithPaths, ...r.sitesmithPaths])].sort();
  }
}

await writeFile(OUT, `${JSON.stringify(doc, null, 2)}\n`);
console.log(`wrote ${OUT} with ${doc.sources.length} source(s)`);
