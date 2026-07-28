#!/usr/bin/env node
/**
 * The Visual Asset Engine. Original work, MIT.
 *
 *   node scripts/visual-assets.mjs providers                 # what this runtime can actually do
 *   node scripts/visual-assets.mjs plan   VISUAL-SOURCE-PLAN.md
 *   node scripts/visual-assets.mjs check  VISUAL-SOURCE-PLAN.md ASSET-MANIFEST.md
 *   node scripts/visual-assets.mjs record ASSET-MANIFEST.md --json <record.json>
 *   node scripts/visual-assets.mjs requests VISUAL-SOURCE-PLAN.md > ASSET-REQUESTS.md
 *
 * This completes the `brandkit-and-reference-board` gap rather than starting something new: the
 * brand step already asks what exists, the asset step already tracks what is missing, and the
 * hole between them was that nothing could *make* the missing thing.
 *
 * Three rules shape the file.
 *
 * **Capabilities are discovered, never assumed.** Artlist's MCP is Claude-only today; Codex and
 * Cursor have their own image tools and some runtimes have none at all. So the engine describes
 * capabilities — text-to-image, image-to-image, edit, background, expand, upscale, reference,
 * image-to-video — and a runtime declares which of them it can serve. No MCP tool name is
 * hardcoded here, because a hardcoded tool name is a guess that fails silently on another host.
 *
 * **A remote link is not an asset.** A generation returns a URL that expires. The asset is the
 * bytes on disk, at the sizes the page uses, with a sha256 in the manifest.
 *
 * **Nothing paid happens without a preflight.** The engine reports what a run would cost and
 * stops. CI runs entirely against the mock provider and spends nothing.
 *
 * No key, token or credential is read, written or logged by this file. Providers authenticate
 * themselves in the host; the engine only ever sees capability names and file paths.
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';

/* ── capabilities ────────────────────────────────────────────────────────
   The vocabulary a plan is written in and a provider answers in. */
export const CAPABILITIES = [
  'text-to-image',
  'image-to-image',
  'image-edit',
  'background-replace',
  'generative-expand',
  'upscale',
  'style-reference',
  'image-to-video',
];

/* ── the provider ladder ─────────────────────────────────────────────────
   In order. The first two spend nothing and are always preferred: a real photograph of the
   real thing beats a generated one every time, and the failure this engine exists to prevent
   is a site full of plausible pictures of nothing. */
export const PROVIDER_ORDER = [
  { id: 'supplied',  paid: false, what: 'real brand and product assets the client supplied' },
  { id: 'licensed',  paid: false, what: 'assets already in the project under a recorded licence' },
  { id: 'artlist',   paid: true,  what: 'Artlist MCP, when the host exposes it' },
  { id: 'native',    paid: true,  what: "the agent's own image generation or editing tool" },
  { id: 'openai',    paid: true,  what: 'OpenAI Images adapter' },
  { id: 'google',    paid: true,  what: 'Google Imagen / Gemini adapter' },
  { id: 'firefly',   paid: true,  what: 'Adobe Firefly adapter' },
  { id: 'mock',      paid: false, what: 'deterministic fixture provider, for tests' },
];

/** A runtime declares itself like this. `capabilities` is a subset of CAPABILITIES; `models` is
 *  free-form and only ever recorded, never interpreted. A provider that cannot say what it can
 *  do is treated as if it can do nothing. */
export function describeProvider({ id, capabilities = [], models = [], paid = null, note = '' }) {
  const known = PROVIDER_ORDER.find((p) => p.id === id);
  const bad = capabilities.filter((c) => !CAPABILITIES.includes(c));
  return {
    id,
    known: Boolean(known),
    paid: paid ?? known?.paid ?? true,
    capabilities: capabilities.filter((c) => CAPABILITIES.includes(c)),
    unknownCapabilities: bad,
    models,
    note,
  };
}

/** Which provider serves a capability, honouring the ladder. Returns null when none can. */
export function route(capability, providers) {
  if (!CAPABILITIES.includes(capability)) return null;
  for (const { id } of PROVIDER_ORDER) {
    const p = providers.find((q) => q.id === id && q.capabilities.includes(capability));
    if (p) return p;
  }
  return null;
}

/** What a run would cost, before anything is called. Never spends. */
export function costPreflight(plan, providers) {
  const rows = [];
  for (const item of plan.assets) {
    if (item.strategy === 'reuse' || item.strategy === 'stock') {
      rows.push({ id: item.id, capability: null, provider: item.strategy, calls: 0, paid: false });
      continue;
    }
    const cap = item.capability ?? 'text-to-image';
    const p = route(cap, providers);
    const calls = (item.candidates ?? 0) + (item.maxAttempts ?? 0);
    rows.push({ id: item.id, capability: cap, provider: p?.id ?? null, calls: p ? calls : 0,
                paid: Boolean(p?.paid), unroutable: !p });
  }
  return {
    rows,
    paidCalls: rows.filter((r) => r.paid).reduce((s, r) => s + r.calls, 0),
    unroutable: rows.filter((r) => r.unroutable).map((r) => r.id),
    needsApproval: rows.some((r) => r.paid && r.calls > 0),
  };
}

/* ── the plan ────────────────────────────────────────────────────────────
   Written before anything is generated, so the brief decides the picture rather than the
   picture deciding the brief. Every field is required: a plan with a blank `factualRisk` is a
   plan that has not thought about whether the image can lie. */
export const PLAN_FIELDS = [
  'id', 'role', 'why', 'strategy', 'medium', 'subject', 'materials', 'composition',
  'lighting', 'aspectRatios', 'crops', 'focal', 'antiReferences', 'mustNotChange',
  'factualRisk', 'maxAttempts',
];
export const STRATEGIES = ['reuse', 'stock', 'generate', 'edit'];

export function parsePlan(markdown) {
  const assets = [];
  const problems = [];
  /* One `## <id>` per asset, then `- field: value` lines. Markdown because a human has to read
     and argue with this before a single credit is spent. */
  const blocks = String(markdown).split(/^##\s+/m).slice(1);
  for (const block of blocks) {
    const id = block.split(/\r?\n/)[0].trim().replace(/^`|`$/g, '');
    const item = { id };
    for (const line of block.split(/\r?\n/)) {
      const m = line.match(/^\s*[-*]\s*([\w-]+)\s*:\s*(.*)$/);
      if (!m) continue;
      const key = m[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const raw = m[2].trim();
      item[key] = /^(aspectRatios|crops|antiReferences|materials)$/.test(key)
        ? raw.split(/\s*[;,]\s*/).filter(Boolean)
        : raw;
    }
    if (item.maxAttempts !== undefined) item.maxAttempts = Number(item.maxAttempts);
    if (item.candidates !== undefined) item.candidates = Number(item.candidates);
    for (const f of PLAN_FIELDS) {
      const v = item[f];
      const empty = v === undefined || v === '' || (Array.isArray(v) && !v.length) ||
                    (f === 'maxAttempts' && !Number.isFinite(v));
      if (empty) problems.push(`${id}: no ${f}`);
    }
    if (item.strategy && !STRATEGIES.includes(item.strategy)) {
      problems.push(`${id}: strategy "${item.strategy}" is not one of ${STRATEGIES.join(', ')}`);
    }
    if (Number.isFinite(item.maxAttempts) && item.maxAttempts > 2) {
      problems.push(`${id}: maxAttempts ${item.maxAttempts} — two iterations is the ceiling. ` +
        'A third attempt is a sign the plan is wrong, not the generator.');
    }
    assets.push(item);
  }
  if (!assets.length) problems.push('no assets in the plan');
  return { assets, problems };
}

/* ── the manifest record ─────────────────────────────────────────────────
   What has to be true of a generated or edited asset before it can be called `ready`. */
export const RECORD_FIELDS = [
  'id', 'role', 'file', 'sourceType', 'provider', 'model', 'generationId', 'promptSha256',
  'referenceSha256', 'settings', 'sha256', 'synthetic', 'licence', 'focal', 'crops',
  'alt', 'approval', 'productTruth',
];
export const SOURCE_TYPES = ['supplied', 'licensed', 'generated', 'edited', 'drawn'];
export const APPROVALS = ['pending', 'approved', 'rejected'];
/** For a shop: does this picture make a claim about a real product that must hold up? */
export const PRODUCT_TRUTH = [
  'n/a',                    // not a product image
  'real-product-photo',     // the actual product, unaltered in form
  'real-product-context',   // real product, generated environment or light around it
  'synthetic-illustrative', // clearly not a stocked item, and labelled as such
];

export function checkRecord(rec) {
  const problems = [];
  for (const f of RECORD_FIELDS) {
    const v = rec[f];
    if (v === undefined || v === null || v === '') problems.push(`no ${f}`);
  }
  if (rec.sourceType && !SOURCE_TYPES.includes(rec.sourceType)) {
    problems.push(`sourceType "${rec.sourceType}" is not one of ${SOURCE_TYPES.join(', ')}`);
  }
  if (rec.approval && !APPROVALS.includes(rec.approval)) {
    problems.push(`approval "${rec.approval}" is not one of ${APPROVALS.join(', ')}`);
  }
  if (rec.productTruth && !PRODUCT_TRUTH.includes(rec.productTruth)) {
    problems.push(`productTruth "${rec.productTruth}" is not one of ${PRODUCT_TRUTH.join(', ')}`);
  }
  /* A remote or temporary generation link is not a finished asset. */
  if (/^https?:/i.test(String(rec.file))) {
    problems.push('file is a URL. A generation link expires; the asset is the bytes on disk.');
  }
  /* The e-commerce rule, enforced rather than described. */
  if (rec.productTruth === 'synthetic-illustrative' && rec.presentedAsStocked) {
    problems.push('a synthetic product image is presented as a stocked product. It may not be.');
  }
  if ((rec.sourceType === 'generated' || rec.sourceType === 'edited') && rec.synthetic !== true &&
      rec.synthetic !== 'composite') {
    problems.push('a generated or edited asset must record synthetic: true or "composite"');
  }
  if (rec.approval === 'approved' && rec.visualQa !== true) {
    problems.push('approved without a recorded visual QA pass. Technically clean is not approved.');
  }
  if (rec.bakedText) {
    problems.push('text is baked into the image. Real HTML text belongs in the page.');
  }
  return problems;
}

export const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
export const promptHash = (prompt) => sha256(String(prompt).trim().replace(/\s+/g, ' '));

/** Written when no image provider exists at all, so the project stops as a draft with a list a
 *  human can act on rather than a site full of gaps nobody wrote down. */
export function assetRequests(plan) {
  const out = ['# ASSET-REQUESTS.md', '',
    '> No image provider was available in this runtime, so nothing was generated and the',
    '> project stays a draft. Each request below is what somebody has to shoot, draw or licence.',
    ''];
  for (const a of plan.assets.filter((x) => x.strategy === 'generate' || x.strategy === 'edit')) {
    out.push(`## ${a.id}`, '',
      `**Role.** ${a.role}`, '',
      `**Why it is needed.** ${a.why}`, '',
      `**Subject.** ${a.subject}`, '',
      `**Materials.** ${(a.materials ?? []).join(', ')}`, '',
      `**Composition.** ${a.composition}`, '',
      `**Lighting.** ${a.lighting}`, '',
      `**Ratios.** ${(a.aspectRatios ?? []).join(', ')} — crops ${(a.crops ?? []).join(', ')}, focal ${a.focal}`, '',
      `**Must not change.** ${a.mustNotChange}`, '',
      `**Anti-references.** ${(a.antiReferences ?? []).join('; ')}`, '',
      `**Factual risk.** ${a.factualRisk}`, '');
  }
  return out.join('\n');
}

/* ── run ─────────────────────────────────────────────────────────────────── */

const isMain = process.argv[1] && /visual-assets\.mjs$/.test(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2);
  const flag = (n) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : null; };
  const positional = rest.filter((a, i) => !a.startsWith('--') && !rest[i - 1]?.startsWith('--'));

  const providersFrom = async () => {
    const f = flag('providers');
    if (!f) return [];
    return JSON.parse(await readFile(f, 'utf8')).map(describeProvider);
  };

  if (cmd === 'providers') {
    const ps = await providersFrom();
    console.log('\n  provider ladder — first that serves a capability wins\n');
    for (const { id, paid, what } of PROVIDER_ORDER) {
      const got = ps.find((p) => p.id === id);
      const mark = got ? 'available' : '—        ';
      console.log(`  ${mark}  ${id.padEnd(10)} ${paid ? 'paid ' : 'free '} ${what}`);
      if (got?.capabilities.length) console.log(`              ${got.capabilities.join(', ')}`);
      if (got?.unknownCapabilities.length) {
        console.log(`              IGNORED, not a known capability: ${got.unknownCapabilities.join(', ')}`);
      }
    }
    console.log('\n  capability routing\n');
    for (const c of CAPABILITIES) {
      const p = route(c, ps);
      console.log(`  ${c.padEnd(20)} ${p ? p.id : 'nothing can serve this'}`);
    }
    console.log('');
    process.exit(0);
  }

  if (cmd === 'plan' || cmd === 'check' || cmd === 'requests') {
    const planFile = positional[0];
    if (!planFile) { console.error('usage: visual-assets.mjs <plan|check|requests> <VISUAL-SOURCE-PLAN.md>'); process.exit(2); }
    const plan = parsePlan(await readFile(planFile, 'utf8'));

    if (cmd === 'requests') { console.log(assetRequests(plan)); process.exit(0); }

    /* Cross-check against the manifest before anything is printed: the planned asset that was
       made and then never listed is exactly the one that goes missing quietly. */
    if (cmd === 'check' && positional[1]) {
      const md = await readFile(positional[1], 'utf8');
      for (const a of plan.assets) {
        if (!new RegExp('`' + a.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`').test(md)) {
          plan.problems.push(`${a.id}: planned, but no row in ${relative('.', positional[1])}`);
        }
      }
    }

    console.log(`\n  visual source plan — ${plan.assets.length} asset(s)\n`);
    for (const p of plan.problems) console.log(`  FAIL  ${p}`);

    if (cmd === 'plan') {
      const ps = await providersFrom();
      const pre = costPreflight(plan, ps);
      console.log('\n  cost preflight — nothing has been called\n');
      for (const r of pre.rows) {
        console.log(`  ${String(r.id).padEnd(22)} ${String(r.capability ?? '—').padEnd(20)} ` +
          `${String(r.provider ?? 'UNROUTABLE').padEnd(10)} ${r.calls} call(s)${r.paid ? ' PAID' : ''}`);
      }
      console.log(`\n  ${pre.paidCalls} paid call(s) would be made.`);
      if (pre.unroutable.length) {
        console.log(`  ${pre.unroutable.length} asset(s) no provider can serve: ${pre.unroutable.join(', ')}`);
        console.log('  Write ASSET-REQUESTS.md and keep the project a draft.');
      }
      if (pre.needsApproval) console.log('  This needs explicit approval before any of it runs.');
    }

    console.log(`\n  ${plan.problems.length ? `FAIL — ${plan.problems.length} problem(s)` : 'PASS — the plan is complete'}\n`);
    process.exit(plan.problems.length ? 1 : 0);
  }

  if (cmd === 'record') {
    const json = flag('json');
    if (!json) { console.error('usage: visual-assets.mjs record <ASSET-MANIFEST.md> --json <record.json>'); process.exit(2); }
    const recs = JSON.parse(await readFile(json, 'utf8'));
    let bad = 0;
    for (const rec of [].concat(recs)) {
      const problems = checkRecord(rec);
      /* The recorded sha256 has to be the file's, or the record is decorative. */
      if (rec.file && !/^https?:/i.test(rec.file)) {
        try {
          const buf = await readFile(resolve(dirname(json), rec.file)).catch(() => readFile(rec.file));
          const real = sha256(buf);
          if (rec.sha256 && rec.sha256 !== real) {
            problems.push(`sha256 recorded ${String(rec.sha256).slice(0, 12)}, file hashes to ${real.slice(0, 12)}`);
          }
        } catch { problems.push(`file not on disk: ${rec.file}`); }
      }
      console.log(`\n  ${rec.id}`);
      for (const p of problems) console.log(`    FAIL  ${p}`);
      if (!problems.length) console.log('    ok');
      bad += problems.length;
    }
    console.log(`\n  ${bad ? `FAIL — ${bad} problem(s)` : 'PASS — every record is complete'}\n`);
    process.exit(bad ? 1 : 0);
  }

  console.error('usage: visual-assets.mjs <providers|plan|check|record|requests> ...');
  process.exit(2);
}
