/** Visual worlds + direction cards for v3 slice. Original work, MIT. */

import { createHash } from 'node:crypto';
import { grammarTreatment } from '../direction-record.mjs';

/** Structurally distinct world templates (treatments only). Counts are policy-driven. */
export const WORLD_LIBRARY = [
  {
    id: 'statement-object',
    composition: 'single object left, large type right',
    type: 'condensed display grotesque over quiet sans',
    colour: 'light paper ground with one reserve accent',
    imagery: 'object-led, full-height product plate',
    rhythm: 'hard vertical split then calm bands',
    surface: 'open — subject earns space around the object',
    labels: 'sentence case captions — retail voice stays human',
    figures: 'proportional — price is content not motif',
    depth: 'elevated — object lifts off ground slightly',
    interaction: 'hover reveals material fact on the object',
    density: 'airy',
  },
  {
    id: 'index-first',
    composition: 'dense index grid starts immediately',
    type: 'monospace index labels over book serif body',
    colour: 'cream ground, ink-only, no accent chrome',
    imagery: 'diagram-led thumbnails in a catalogue grid',
    rhythm: 'continuous field with ruled row breaks',
    surface: 'hairline — catalogue rows need quiet separators',
    labels: 'mono uppercase — inventory codes are the voice',
    figures: 'functional tabular — compare SKUs only',
    depth: 'flat — paper catalogue logic',
    interaction: 'row focus expands one fact line',
    density: 'packed',
  },
  {
    id: 'workspace-canvas',
    composition: 'real interface full width as first screen',
    type: 'UI sans pair, tight tracking on tools',
    colour: 'dark near-black ground, functional status accent',
    imagery: 'deliberately imageless — chrome is the content',
    rhythm: 'asymmetric tool rail + main canvas',
    surface: 'framed — panels bound the work surface',
    labels: 'symbol-led — tools speak as icons with text fallback',
    figures: 'absent — no decorative metrics',
    depth: 'inset — panels recede into the shell',
    interaction: 'keyboard-first primary journey',
    density: 'cockpit',
  },
  {
    id: 'editorial-bleed',
    composition: 'full-bleed image with type over it',
    type: 'high-contrast display serif over narrow sans',
    colour: 'dark photographic ground, light type',
    imagery: 'photography-led, edge-to-edge crop',
    rhythm: 'alternating full-bleed and quiet text bands',
    surface: 'colour-field — photo is the ground',
    labels: 'display-face captions — editorial voice',
    figures: 'proportional — rare and quiet',
    depth: 'overlap — type sits on image layers',
    interaction: 'scroll chapters, not tabs',
    density: 'cinematic',
  },
  {
    id: 'split-evidence',
    composition: 'hard vertical rule: proof left, action right',
    type: 'neutral grotesque, medium weight only',
    colour: 'stone ground, single brand accent on CTA only',
    imagery: 'diagram-led evidence stack',
    rhythm: 'two columns for the whole first fold',
    surface: 'framed — evidence cards in heavy borders',
    labels: 'sentence case — operational clarity',
    figures: 'functional tabular — measurements only where compared',
    depth: 'elevated — evidence cards raise on focus',
    interaction: 'sticky action column on desktop',
    density: 'balanced',
  },
  {
    id: 'poster-type',
    composition: 'type alone at scale, artefact below the fold',
    type: 'custom-feeling display, extreme scale ratio',
    colour: 'saturated ground from subject material, not purple gradient',
    imagery: 'deliberately imageless on first screen',
    rhythm: 'one continuous field then a single break',
    surface: 'open — type is the material',
    labels: 'symbol-led — almost no chrome labels',
    figures: 'absent',
    depth: 'flat',
    interaction: 'single decisive scroll cue',
    density: 'poster',
  },
  {
    id: 'material-board',
    composition: 'grid of many small material samples',
    type: 'small caps labels over soft serif',
    colour: 'warm light ground from material palette',
    imagery: 'object-led sample plates',
    rhythm: 'tight mosaic then wide breathing band',
    surface: 'colour-field — each cell is a material ground',
    labels: 'sentence case — trade names, not UI chrome',
    figures: 'proportional — dimensions only when needed',
    depth: 'overlap — samples slightly shuffle depth',
    interaction: 'sample select builds a slip/cart',
    density: 'tactile',
  },
];

const MACRO_AXES = ['composition', 'type', 'colour', 'imagery', 'rhythm'];
const GRAMMAR = ['surface', 'labels', 'figures', 'depth'];

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(str) {
  const hex = createHash('sha256').update(String(str)).digest('hex').slice(0, 8);
  return Number.parseInt(hex, 16);
}

/**
 * External seed assignment — not chosen by a scorer that already prefers a winner.
 */
export function assignSeeds({ projectName, randomSeed, worldCount, catalog = 'local' }) {
  const entropy = randomSeed ?? `${projectName}:${Date.now()}`;
  const numeric = seedFromString(String(entropy));
  const rand = mulberry32(numeric);
  const order = WORLD_LIBRARY.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const worlds = order.slice(0, worldCount).map((idx, n) => ({
    worldId: WORLD_LIBRARY[idx].id,
    template: WORLD_LIBRARY[idx],
    seed: {
      source: catalog === 'local' ? 'local-world-library' : catalog,
      version: '1.0.0',
      method: 'sha256-project-entropy + fisher-yates',
      randomSeed: String(entropy),
      numericSeed: numeric,
      licence: 'MIT SiteSmith-original world templates',
      origin: 'local',
      slot: n,
    },
  }));
  return { numericSeed: numeric, entropy: String(entropy), worlds };
}

export function axisDiffCount(a, b) {
  let n = 0;
  for (const key of MACRO_AXES) {
    if (normalize(a[key]) !== normalize(b[key])) n += 1;
  }
  return n;
}

export function grammarDiffCount(a, b) {
  let n = 0;
  for (const key of GRAMMAR) {
    if (grammarTreatment(key, a[key]) !== grammarTreatment(key, b[key])) n += 1;
  }
  return n;
}

function normalize(value) {
  return String(value).toLowerCase().replace(/\s+/g, ' ').trim();
}

export function isStructurallyDifferent(a, b, policy) {
  const macro = axisDiffCount(a, b);
  const grammar = grammarDiffCount(a, b);
  const compositionDiff = normalize(a.composition) !== normalize(b.composition);
  const minMacro = policy.minMacroAxisDiff ?? 3;
  const minGrammar = policy.minGrammarDiff ?? 2;
  const requireComp = policy.requireCompositionDiff !== false;
  return macro >= minMacro && grammar >= minGrammar && (!requireComp || compositionDiff);
}

export function isRound8Recipe(card) {
  const surface = grammarTreatment('surface', card.surface);
  const labels = grammarTreatment('labels', card.labels);
  const figures = grammarTreatment('figures', card.figures);
  const depth = grammarTreatment('depth', card.depth);
  return surface === 'hairline'
    && labels === 'mono-uppercase'
    && (figures === 'tabular-motif' || figures === 'functional-tabular')
    && depth === 'flat';
}

/**
 * Build policy-sized world set and pick structurally different cards.
 */
export function generateDirectionCards(input, route, policy) {
  const groups = capabilityGroups(route);
  // Impeccable seed mechanics expand the world pool; without them, fewer candidates.
  const baseWorldCount = policy.worldCount ?? 5;
  const worldCount = groups.impeccable ? baseWorldCount : Math.max(3, baseWorldCount - 2);
  const cardCount = policy.cardCount ?? 3;
  // Mix project entropy with route hash so capability ablation changes seed order.
  const routeSalt = (route.decisionHash ?? route.selected?.map((s) => s.capabilityId).join(',') ?? '')
    .slice(0, 24);
  const { worlds, entropy, numericSeed } = assignSeeds({
    projectName: input.projectName,
    randomSeed: `${input.randomSeed ?? 'seed'}|${routeSalt}|g:${Object.entries(groups).filter(([, v]) => v).map(([k]) => k).join('+')}`,
    worldCount,
    catalog: policy.seedCatalog ?? 'local',
  });

  // Prefer worlds compatible with loaded creative pressures.
  const rankedWorlds = [...worlds].sort((a, b) => worldScore(b.template, input, groups) - worldScore(a.template, input, groups));

  const candidates = rankedWorlds.map((world, index) => {
    const t = applyGroupPressure(world.template, groups, input);
    const subject = input.subjectHints.subject;
    const thesis = buildThesis(subject, input.mode, t, groups);
    return {
      internalId: `W${index + 1}`,
      worldId: world.worldId,
      seed: world.seed,
      thesis,
      evidence: summariseEvidence(input.evidence, groups),
      audience: input.subjectHints.audience,
      designIntent: `${input.mode} for ${subject}`,
      composition: t.composition,
      type: t.type,
      colour: t.colour,
      imagery: t.imagery,
      rhythm: t.rhythm,
      surface: t.surface,
      labels: t.labels,
      figures: t.figures,
      depth: t.depth,
      layoutPrinciple: t.composition,
      typographicPrinciple: t.type,
      assetStrategy: t.imagery,
      motionInteraction: t.interaction,
      signatureElement: signatureFor(subject, t, groups),
      primaryRisk: riskFor(t, input.mode, groups),
      differenceNote: '',
      capabilityProvenance: route.selected.map((s) => s.capabilityId),
      density: t.density,
      groupsApplied: groups,
    };
  });

  // Greedy select pairwise-different cards; fail if policy cannot be met.
  const selected = [];
  for (const candidate of candidates) {
    if (selected.length >= cardCount) break;
    if (isRound8Recipe(candidate)) continue;
    const okPair = selected.every((other) => isStructurallyDifferent(candidate, other, policy));
    if (okPair) selected.push(candidate);
  }

  if (selected.length < cardCount) {
    return {
      ok: false,
      problems: [`could only form ${selected.length}/${cardCount} pairwise-different cards from ${worldCount} worlds`],
      worlds,
      entropy,
      numericSeed,
    };
  }

  for (const card of selected) {
    const others = selected.filter((c) => c.internalId !== card.internalId).map((c) => c.worldId);
    card.differenceNote = `Differs from ${others.join(', ')} on composition/type/imagery/grammar treatments, not hue alone.`;
  }

  return {
    ok: true,
    entropy,
    numericSeed,
    worlds: worlds.map((w) => w.worldId),
    cards: selected,
    pairwise: pairwiseReport(selected, policy),
  };
}

function pairwiseReport(cards, policy) {
  const rows = [];
  for (let i = 0; i < cards.length; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      const a = cards[i];
      const b = cards[j];
      rows.push({
        a: a.internalId,
        b: b.internalId,
        macroDiff: axisDiffCount(a, b),
        grammarDiff: grammarDiffCount(a, b),
        compositionDiff: normalize(a.composition) !== normalize(b.composition),
        pass: isStructurallyDifferent(a, b, policy),
      });
    }
  }
  return rows;
}

function capabilityGroups(route) {
  const ids = (route.selected ?? []).map((s) => s.capabilityId);
  return {
    taste: ids.some((id) => id.startsWith('TASTE-')),
    uupm: ids.some((id) => id.startsWith('uupm.')),
    frontend: ids.some((id) => id.startsWith('frontend.')),
    impeccable: ids.some((id) => id.startsWith('IMP-')),
  };
}

function worldScore(template, input, groups) {
  let score = 0;
  if (input.mode === 'product-ui' && /interface|canvas|keyboard/i.test(JSON.stringify(template))) score += 3;
  if (input.mode === 'ecommerce' && /object|product|sku|grid/i.test(JSON.stringify(template))) score += 3;
  if (input.mode === 'marketing' && /bleed|poster|type/i.test(JSON.stringify(template))) score += 2;
  if (groups.frontend && /type|thesis|vernacular/i.test(template.composition + template.type)) score += 1;
  if (!groups.frontend && template.id === 'poster-type') score -= 2;
  if (!groups.impeccable && template.id === 'material-board') score -= 1;
  if (groups.uupm && /index|diagram|grid/i.test(JSON.stringify(template))) score += 1;
  return score;
}

function applyGroupPressure(template, groups, input) {
  const t = { ...template };
  if (!groups.frontend) {
    // Without frontend-design pressure, fall back to safer, more generic type role.
    t.type = 'system sans pair, conservative scale';
    t.labels = 'sentence case — generic UI labels without subject vernacular';
  }
  if (!groups.taste) {
    t.surface = t.surface.replace(/open/, 'framed');
    t.density = t.density === 'poster' ? 'balanced' : t.density;
  }
  if (!groups.uupm && input.mode === 'ecommerce') {
    t.figures = 'proportional — no comparison tables without domain knowledge';
  }
  if (!groups.impeccable) {
    t.depth = 'flat — fewer layered craft decisions without critique loop';
  }
  return t;
}

function buildThesis(subject, mode, template, groups = {}) {
  const parts = [`${subject} as ${mode}`];
  if (groups.frontend) parts.push(`hero thesis: ${template.density} first screen where ${template.composition}`);
  else parts.push(`layout sketch: ${template.composition}`);
  if (groups.taste) parts.push('anti-default dials applied before chrome');
  if (groups.uupm) parts.push('domain knowledge consulted');
  if (groups.impeccable) parts.push('seeded world before polish');
  parts.push('subject recognised before chrome');
  return parts.join(' — ');
}

function summariseEvidence(evidence, groups = {}) {
  const lines = String(evidence).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const base = lines.slice(0, 6).join(' | ').slice(0, 400) || 'evidence pack present but empty summary';
  if (groups.uupm) return `${base} | domain-knowledge: on`;
  return base;
}

function signatureFor(subject, template, groups = {}) {
  const token = subject.split(/\s+/)[0]?.toLowerCase() || 'subject';
  const tag = groups.frontend ? 'sig' : 'layout';
  return `${token}-${template.id}-${tag}`;
}

function riskFor(template, mode, groups = {}) {
  if (!groups.frontend) return 'Weak subject signature risk without frontend thesis pressure.';
  if (!groups.impeccable) return 'May overfit first sketch without critique/seed loop.';
  if (template.density === 'packed' && mode === 'marketing') {
    return 'Index density may bury the primary conversion if not paced.';
  }
  if (template.imagery.includes('imageless') && mode === 'ecommerce') {
    return 'Commerce without product imagery needs exceptional object truth elsewhere.';
  }
  if (template.colour.includes('dark') && mode === 'product-ui') {
    return 'Dark shells can hide disabled states without careful contrast.';
  }
  return 'Signature may overfit if evidence is thin.';
}

/** Blind presentation: shuffle, hide internal IDs, strip generator scores. */
export function blindCandidates(cards, randomSeed) {
  const rand = mulberry32(seedFromString(String(randomSeed ?? 'blind')));
  const copy = cards.map((card, index) => ({
    ...card,
    generatorRank: index, // stripped below
  }));
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const labels = ['L1', 'L2', 'L3', 'L4', 'L5'];
  const key = {};
  const blinded = copy.map((card, i) => {
    const label = labels[i] ?? `L${i + 1}`;
    key[label] = card.internalId;
    const {
      internalId, generatorRank, capabilityProvenance, seed, ...publicCard
    } = card;
    return {
      blindId: label,
      ...publicCard,
      // critic sees treatments, not world IDs or scores
    };
  });
  return { blinded, key, independence: 'context-isolated' };
}
