#!/usr/bin/env node
/**
 * Fixtures for the Visual Asset Engine. Original work, MIT.
 *
 *   node tests/gates/build-visual-fixtures.mjs
 *
 * Every one of these runs against the `mock` provider and makes no network call, so CI can
 * exercise routing, the plan contract, the manifest record contract and the e-commerce
 * product-truth rule without spending a credit or holding a key.
 */

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const FIX = join(ROOT, 'tests/gates/visual');
await rm(FIX, { recursive: true, force: true });

const put = async (p, body) => {
  const f = join(FIX, p);
  await mkdir(dirname(f), { recursive: true });
  await writeFile(f, body);
  return f;
};

/* ── provider declarations ───────────────────────────────────────────────
   What a runtime says about itself. No MCP tool name appears anywhere: a provider is a name
   and a list of capabilities, which is the whole point. */
await put('providers/full.json', JSON.stringify([
  { id: 'mock', capabilities: ['text-to-image', 'image-to-image', 'image-edit',
    'background-replace', 'generative-expand', 'upscale', 'style-reference'],
    paid: false, models: ['mock-1'], note: 'deterministic fixture provider' },
], null, 2));

await put('providers/supplied-only.json', JSON.stringify([
  { id: 'supplied', capabilities: [], paid: false, note: 'the client sent a logo and nothing else' },
], null, 2));

/* A host that offers a capability nobody has heard of. It must be ignored and reported, not
   silently accepted — a typo in a capability name would otherwise route to nothing. */
await put('providers/unknown-capability.json', JSON.stringify([
  { id: 'mock', capabilities: ['text-to-image', 'text-to-hologram'], paid: false },
], null, 2));

/* Two providers that both serve text-to-image. The ladder decides, and `supplied` wins,
   because a real photograph of the real thing beats a generated one every time. */
await put('providers/ladder.json', JSON.stringify([
  { id: 'openai', capabilities: ['text-to-image', 'image-edit'], paid: true },
  { id: 'supplied', capabilities: ['text-to-image'], paid: false },
], null, 2));

/* ── plans ───────────────────────────────────────────────────────────────── */

const planAsset = (o) => `## \`${o.id}\`

- role: ${o.role ?? 'the first thing a visitor sees, at the top of the page'}
- why: ${o.why ?? 'the trade is tactile and the page has no way to show it otherwise'}
- strategy: ${o.strategy ?? 'generate'}
- medium: ${o.medium ?? 'photograph'}
- subject: ${o.subject ?? 'three-strand polyester rope on an oak bench'}
- materials: ${o.materials ?? 'polyester fibre; oak; galvanised steel'}
- composition: ${o.composition ?? 'close, from just above, the lay running left to right'}
- lighting: ${o.lighting ?? 'north window, overcast, no fill'}
- aspect-ratios: ${o.ratios ?? '3:2; 4:5'}
- crops: ${o.crops ?? '1440x960; 390x488'}
- focal: ${o.focal ?? '48% 52%'}
- anti-references: ${o.anti ?? 'harbour at sunset; nautical decor; a stock businessman'}
- must-not-change: ${o.mustNot ?? 'the number of strands and the direction of the lay'}
- factual-risk: ${o.risk ?? 'a wrong lay direction misrepresents the product a buyer is choosing'}
- max-attempts: ${o.attempts ?? 2}
- candidates: ${o.candidates ?? 4}
- capability: ${o.capability ?? 'text-to-image'}
`;

await put('plan/complete/VISUAL-SOURCE-PLAN.md',
  '# Visual source plan\n\n' + planAsset({ id: 'bench-rope' }) + '\n' +
  planAsset({ id: 'coil-rack', strategy: 'stock', capability: 'text-to-image', candidates: 0 }));

await put('plan/complete/ASSET-MANIFEST.md',
  '# manifest\n\n| id | what |\n| --- | --- |\n| `bench-rope` | rope on the bench |\n' +
  '| `coil-rack` | the rack |\n');

/* A plan with a hole in it. `factual-risk` is the field most likely to be skipped and the one
   that decides whether a picture is allowed to be invented at all. */
await put('plan/fail-incomplete/VISUAL-SOURCE-PLAN.md',
  '# Visual source plan\n\n' +
  planAsset({ id: 'bench-rope' }).replace(/^- factual-risk:.*$/m, '- factual-risk:')
                                 .replace(/^- lighting:.*$/m, '- lighting:'));

/* Three attempts. Two is the ceiling: a third is a sign the plan is wrong, not the generator. */
await put('plan/fail-too-many-attempts/VISUAL-SOURCE-PLAN.md',
  '# Visual source plan\n\n' + planAsset({ id: 'bench-rope', attempts: 3 }));

await put('plan/fail-bad-strategy/VISUAL-SOURCE-PLAN.md',
  '# Visual source plan\n\n' + planAsset({ id: 'bench-rope', strategy: 'imagine' }));

/* Planned but never listed in the manifest — the asset that gets made and then forgotten. */
await put('plan/fail-not-in-manifest/VISUAL-SOURCE-PLAN.md',
  '# Visual source plan\n\n' + planAsset({ id: 'bench-rope' }) + '\n' + planAsset({ id: 'ghost-asset' }));
await put('plan/fail-not-in-manifest/ASSET-MANIFEST.md',
  '# manifest\n\n| id | what |\n| --- | --- |\n| `bench-rope` | rope on the bench |\n');

/* ── manifest records ────────────────────────────────────────────────────── */

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64');
await put('record/one.webp', PNG);
const REAL_SHA = createHash('sha256').update(PNG).digest('hex');

const record = (o) => ({
  id: 'bench-rope', role: 'product materiality, first screen', file: 'one.webp',
  sourceType: 'generated', provider: 'mock', model: 'mock-1',
  generationId: '00000000-0000-4000-8000-000000000001',
  promptSha256: 'a'.repeat(64), referenceSha256: 'none', settings: 'seed=7;ratio=3:2',
  sha256: REAL_SHA, synthetic: true, licence: 'generated, owned',
  focal: '48% 52%', crops: '1440x960; 390x488', alt: 'Three-strand polyester on an oak bench',
  approval: 'approved', visualQa: true, productTruth: 'synthetic-illustrative', ...o,
});

await put('record/pass.json', JSON.stringify([record()], null, 2));

/* A generation link is not an asset. It expires, and then the page has a hole in it. */
await put('record/fail-remote-url.json', JSON.stringify([
  record({ file: 'https://cdn.example.com/gen/abc123.png' })], null, 2));

/* The hash has to be the file's, or the record is decorative. */
await put('record/fail-wrong-hash.json', JSON.stringify([record({ sha256: 'b'.repeat(64) })], null, 2));

/* Technically clean is not approved. */
await put('record/fail-approved-without-qa.json', JSON.stringify([
  record({ approval: 'approved', visualQa: false })], null, 2));

/* The e-commerce rule: a synthetic product may not be presented as a stocked one. */
await put('record/fail-synthetic-as-stocked.json', JSON.stringify([
  record({ productTruth: 'synthetic-illustrative', presentedAsStocked: true })], null, 2));

/* A generated asset that does not admit it is generated. */
await put('record/fail-not-marked-synthetic.json', JSON.stringify([
  record({ sourceType: 'generated', synthetic: false })], null, 2));

/* Text baked into the pixels, where real HTML text belongs. */
await put('record/fail-baked-text.json', JSON.stringify([record({ bakedText: true })], null, 2));

/* A real product photograph with a generated environment around it — allowed, and the row has
   to say so, because the distinction is the whole rule. */
await put('record/pass-real-product-context.json', JSON.stringify([
  record({ sourceType: 'edited', synthetic: 'composite', productTruth: 'real-product-context',
           referenceSha256: 'c'.repeat(64) })], null, 2));

console.log('visual asset fixtures written');
