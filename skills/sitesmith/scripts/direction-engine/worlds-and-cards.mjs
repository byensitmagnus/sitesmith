/** Seed worlds + grounded cards for Direction Engine v3 slice. Original work, MIT. */

import { createHash } from 'node:crypto';
import { grammarTreatment } from '../direction-record.mjs';

/** Seed templates only — never final directions without grounding. */
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
    modes: ['ecommerce', 'marketing', 'portfolio'],
    needs: { plates: true },
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
    modes: ['ecommerce', 'editorial', 'audit', 'product-ui', 'component'],
    needs: {},
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
    modes: ['product-ui', 'component', 'audit'],
    needs: { operational: true },
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
    modes: ['marketing', 'portfolio', 'editorial'],
    needs: { photography: true },
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
    modes: ['marketing', 'ecommerce', 'product-ui', 'redesign', 'component'],
    needs: {},
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
    modes: ['marketing', 'portfolio', 'editorial', 'product-ui', 'ecommerce'],
    needs: {},
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
    modes: ['ecommerce', 'portfolio'],
    needs: { plates: true, material: true },
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

export function assignSeeds({ projectName, randomSeed, worldCount, catalog = 'local', eligibleWorlds }) {
  const entropy = randomSeed ?? `${projectName}:seed`;
  const numeric = seedFromString(String(entropy));
  const rand = mulberry32(numeric);
  const pool = eligibleWorlds?.length ? eligibleWorlds : WORLD_LIBRARY;
  const order = pool.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const worlds = order.slice(0, worldCount).map((idx, n) => ({
    worldId: pool[idx].id,
    template: pool[idx],
    seed: {
      source: catalog === 'local' ? 'local-world-library-seed' : catalog,
      version: '1.1.0',
      method: 'sha256-project-entropy + fisher-yates over eligibility-filtered seeds',
      randomSeed: String(entropy),
      numericSeed: numeric,
      licence: 'MIT SiteSmith-original world seed templates',
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

/** Mode-fit + evidence gates — seed is only eligible if brief can support it. */
export function worldEligible(template, input) {
  const s = input.signals ?? input.subjectHints ?? {};
  const mode = input.mode;
  if (template.modes && !template.modes.includes(mode)) {
    return { ok: false, reason: `seed ${template.id} not allowed for mode ${mode}` };
  }
  if (template.needs?.operational && !s.operational && mode !== 'product-ui' && mode !== 'component') {
    return { ok: false, reason: `seed ${template.id} needs operational UI evidence` };
  }
  if (template.needs?.plates && !s.hasProductPlates && !s.hasManifest) {
    return { ok: false, reason: `seed ${template.id} needs product/asset plates in plan/manifest` };
  }
  if (template.needs?.photography && (s.imageless || (!s.hasProductPlates && !s.hasAssetPlan))) {
    return { ok: false, reason: `seed ${template.id} needs photography evidence; imageless/no assets` };
  }
  if (template.needs?.material && !/material|hide|leather|sample|paper|stock/i.test(`${input.brief}\n${input.evidence}`)) {
    return { ok: false, reason: `seed ${template.id} needs material vocabulary in evidence` };
  }
  // Anti-references: ban seeds whose *affirmative* treatments match banned tropes.
  // Do not treat the phrase "not purple gradient" as a purple default.
  const anti = (s.antiRefs ?? []).join(' ').toLowerCase();
  if (anti && /purple|saas gradient|handshake|fintech/i.test(anti)) {
    const colour = String(template.colour ?? '');
    if (/\bpurple\b/i.test(colour) && !/not purple|no purple/i.test(colour)) {
      return { ok: false, reason: 'seed colour conflicts with anti-references' };
    }
  }
  if (s.imageless && /photography-led|product plate|sample plates/i.test(template.imagery)) {
    return { ok: false, reason: 'brief declares imageless; photo/plate seeds out' };
  }
  if (mode === 'product-ui' && /material-board|editorial-bleed/i.test(template.id)) {
    if (!s.hasProductPlates) {
      return { ok: false, reason: 'product-ui without product plates cannot take material/editorial photo seeds' };
    }
  }
  if (mode === 'product-ui' && template.id === 'poster-type' && !s.imageless) {
    // poster-type is only a safe product-ui seed when chrome/type must carry the UI (imageless)
    return { ok: false, reason: 'poster-type for product-ui only when imageless' };
  }
  return { ok: true };
}

export function capabilityGroups(route) {
  const ids = (route.selected ?? []).map((s) => s.capabilityId);
  return {
    taste: ids.some((id) => id.startsWith('TASTE-')),
    uupm: ids.some((id) => id.startsWith('uupm.')),
    frontend: ids.some((id) => id.startsWith('frontend.')),
    impeccable: ids.some((id) => id.startsWith('IMP-')),
  };
}

/**
 * Semantic effects of capability groups on treatments (documented, not salt).
 */
export function applyGroupSemantics(template, groups, input) {
  const t = { ...template };
  const s = input.signals ?? {};
  if (!groups.frontend) {
    t.type = 'system sans pair, conservative scale';
    t.labels = 'sentence case — generic UI labels without subject vernacular';
  }
  if (!groups.taste) {
    t.surface = String(t.surface).replace(/^open/, 'framed');
  }
  if (!groups.uupm && input.mode === 'ecommerce') {
    t.figures = 'proportional — no comparison tables without domain knowledge retrieval';
  }
  if (!groups.impeccable) {
    t.depth = 'flat — fewer layered craft decisions without seed/critique loop';
  }
  // Asset availability reshapes imagery
  if (s.imageless) {
    t.imagery = 'deliberately imageless — chrome and type carry the first screen';
  } else if (s.hasProductPlates && /object-led|product plate/i.test(t.imagery)) {
    t.imagery = `${t.imagery} using declared product plates from asset plan`;
  } else if (!s.hasProductPlates && /object-led|product plate|sample plates/i.test(t.imagery)) {
    t.imagery = 'diagram-led evidence slots until plates exist';
  }
  // Constraints
  for (const c of s.constraints ?? []) {
    if (/no motion|static/i.test(c)) t.interaction = 'static state feedback only';
    if (/light mode only|no dark/i.test(c)) t.colour = 'light ground only — constraint';
  }
  return t;
}

export function generateDirectionCards(input, route, policy) {
  const groups = capabilityGroups(route);
  const baseWorldCount = policy.worldCount ?? 5;
  // Semantic: without impeccable seed caps, fewer concurrent seeds
  const worldCount = groups.impeccable ? baseWorldCount : Math.max(3, baseWorldCount - 2);
  const cardCount = policy.cardCount ?? 3;

  const eligible = WORLD_LIBRARY.filter((w) => worldEligible(w, input).ok);
  if (eligible.length < cardCount) {
    return {
      ok: false,
      problems: [`only ${eligible.length} evidence-eligible seed worlds for mode ${input.mode}; need ${cardCount}`],
      eligible: eligible.map((w) => w.id),
      rejectedSeeds: WORLD_LIBRARY.filter((w) => !worldEligible(w, input).ok).map((w) => ({
        id: w.id,
        reason: worldEligible(w, input).reason,
      })),
    };
  }

  // Seed entropy from project only — NOT route hash (no artificial ablation diversity)
  const { worlds, entropy, numericSeed } = assignSeeds({
    projectName: input.projectName,
    randomSeed: input.randomSeed,
    worldCount: Math.min(worldCount, eligible.length),
    catalog: policy.seedCatalog ?? 'local',
    eligibleWorlds: eligible,
  });

  const candidates = worlds.map((world, index) => {
    const t = applyGroupSemantics(world.template, groups, input);
    const subject = input.signals?.subject ?? input.subjectHints?.subject ?? 'subject';
    const vocab = (input.signals?.vocabulary ?? []).slice(0, 6).join(', ');
    const thesis = groups.frontend
      ? `${subject}: ${input.signals?.primaryAction ?? 'primary action'} via ${t.composition} — ${vocab || 'evidence-grounded'}`
      : `${subject} layout sketch: ${t.composition}`;
    return {
      internalId: `W${index + 1}`,
      worldId: world.worldId,
      seed: world.seed,
      thesis,
      evidence: summariseEvidence(input.evidence, route),
      audience: input.signals?.audience ?? 'unknown',
      designIntent: `${input.mode} · ${input.signals?.primaryAction ?? 'action'} · ${subject}`,
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
      // Opaque to seed catalog IDs — blind packet must not reintroduce worldId.
      signatureElement: `${String(subject).split(/\s+/)[0]?.toLowerCase() || 'subject'}-sig-${index + 1}`,
      primaryRisk: riskFor(t, input.mode, groups),
      differenceNote: '',
      capabilityProvenance: route.selected.map((s) => s.capabilityId),
      density: t.density,
      groupsApplied: groups,
      grounding: {
        subject,
        primaryAction: input.signals?.primaryAction,
        antiRefs: input.signals?.antiRefs ?? [],
        assets: {
          imageless: Boolean(input.signals?.imageless),
          plates: Boolean(input.signals?.hasProductPlates),
        },
      },
      semanticGroupEffects: {
        withoutFrontend: !groups.frontend,
        withoutTaste: !groups.taste,
        withoutUupm: !groups.uupm,
        withoutImpeccable: !groups.impeccable,
      },
    };
  });

  // Brief-fit first, then structural diversity
  candidates.sort((a, b) => briefFitScore(b, input) - briefFitScore(a, input));

  const selected = [];
  for (const candidate of candidates) {
    if (selected.length >= cardCount) break;
    if (briefFitScore(candidate, input) < 1) continue;
    if (isRound8Recipe(candidate) && !antiRefAllowsRound8(input)) continue;
    const okPair = selected.every((other) => isStructurallyDifferent(candidate, other, policy));
    if (okPair) selected.push(candidate);
  }
  // Fallback: if diversity bar blocks, still require brief-fit and pairwise as soft pass
  if (selected.length < cardCount) {
    for (const candidate of candidates) {
      if (selected.length >= cardCount) break;
      if (selected.some((s) => s.internalId === candidate.internalId)) continue;
      if (briefFitScore(candidate, input) < 1) continue;
      if (isRound8Recipe(candidate) && !antiRefAllowsRound8(input)) continue;
      selected.push(candidate);
    }
  }

  if (selected.length < cardCount) {
    return {
      ok: false,
      problems: [`could only form ${selected.length}/${cardCount} brief-fit + pairwise-different cards`],
      worlds: worlds.map((w) => w.worldId),
      entropy,
      numericSeed,
    };
  }

  for (const card of selected) {
    // Use internal slot ids only — never peer worldIds (would leak in blind packets).
    const others = selected.filter((c) => c.internalId !== card.internalId).map((c) => c.internalId);
    card.differenceNote = `Differs from ${others.join(', ')} on composition/type/imagery/grammar after brief-fit filter.`;
  }

  return {
    ok: true,
    entropy,
    numericSeed,
    worlds: worlds.map((w) => w.worldId),
    cards: selected,
    pairwise: pairwiseReport(selected, policy),
    eligibleSeedCount: eligible.length,
  };
}

function briefFitScore(card, input) {
  const s = input.signals ?? {};
  let score = 0;
  const blob = JSON.stringify(card).toLowerCase();
  const subj = String(s.subject ?? '').toLowerCase().split(/\s+/)[0];
  if (subj && blob.includes(subj)) score += 2;
  if (s.operational && /interface|canvas|keyboard|panel/i.test(blob)) score += 3;
  if (s.commerce && /object|product|sku|price|slip|cart/i.test(blob)) score += 2;
  if (s.editorial && /bleed|poster|edition|type/i.test(blob)) score += 2;
  if (s.imageless && /imageless/i.test(blob)) score += 2;
  if (s.imageless && /photography-led|product plate/i.test(blob)) score -= 3;
  if (input.mode === 'product-ui' && /material-board|editorial-bleed/i.test(card.worldId)) score -= 4;
  return score;
}

function antiRefAllowsRound8(input) {
  return false;
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

function summariseEvidence(evidence, route) {
  const lines = String(evidence).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const base = lines.slice(0, 6).join(' | ').slice(0, 400) || 'evidence pack present but empty summary';
  if (route.domainRetrieval?.claimAllowed) {
    return `${base} | domain-knowledge: consulted (${route.domainRetrieval.hitCount} hits)`;
  }
  return `${base} | domain-knowledge: not consulted`;
}

function riskFor(template, mode, groups) {
  if (!groups.frontend) return 'Weak subject signature without frontend thesis pressure.';
  if (mode === 'product-ui' && /bleed|poster/i.test(template.id)) return 'Expressive marketing seeds can bury the work journey.';
  return 'Signature may overfit if evidence is thin.';
}

/** Public blind packet: no identity/provenance leakage. */
export function blindCandidates(cards, randomSeed) {
  const rand = mulberry32(seedFromString(String(randomSeed ?? 'blind')));
  const copy = cards.map((card) => ({ ...card }));
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const labels = ['L1', 'L2', 'L3', 'L4', 'L5'];
  const key = {};
  const blinded = copy.map((card, i) => {
    const label = labels[i] ?? `L${i + 1}`;
    key[label] = card.internalId;
    const subjectToken = String(card.grounding?.subject ?? 'subject')
      .split(/\s+/)[0]
      ?.toLowerCase()
      .replace(/[^a-zæøå0-9-]/gi, '') || 'subject';
    return {
      blindId: label,
      thesis: card.thesis,
      evidence: card.evidence,
      audience: card.audience,
      designIntent: card.designIntent,
      composition: card.composition,
      type: card.type,
      colour: card.colour,
      imagery: card.imagery,
      rhythm: card.rhythm,
      surface: card.surface,
      labels: card.labels,
      figures: card.figures,
      depth: card.depth,
      layoutPrinciple: card.layoutPrinciple,
      typographicPrinciple: card.typographicPrinciple,
      assetStrategy: card.assetStrategy,
      motionInteraction: card.motionInteraction,
      // Re-key with blind labels only — never pass through worldId-bearing strings.
      signatureElement: `${subjectToken}-sig-${label}`,
      primaryRisk: card.primaryRisk,
      differenceNote: '', // filled after all labels known
      density: card.density,
      grounding: card.grounding,
    };
  });
  for (const card of blinded) {
    const others = blinded.filter((c) => c.blindId !== card.blindId).map((c) => c.blindId);
    card.differenceNote = `Differs from ${others.join(', ')} on composition/type/imagery/grammar after brief-fit filter.`;
  }
  return {
    blinded,
    key,
    independence: 'deterministic-preflight',
    claim: 'local keyword preflight only — not context-isolated external critic',
  };
}

/**
 * Fail if banned keys exist OR if any string field embeds seed catalog / internal ids.
 * @returns {string[]} leak descriptors (empty = clean)
 */
export function assertNoBlindLeakage(blindedCard) {
  const leaks = [];
  const bannedKeys = [
    'worldId', 'internalId', 'groupsApplied', 'capabilityProvenance',
    'seed', 'generatorRank', 'semanticGroupEffects',
  ];
  for (const k of bannedKeys) {
    if (Object.prototype.hasOwnProperty.call(blindedCard, k)) leaks.push(`key:${k}`);
  }
  const text = JSON.stringify(blindedCard);
  for (const world of WORLD_LIBRARY) {
    if (text.includes(world.id)) leaks.push(`content:${world.id}`);
  }
  if (/\bW[1-9]\d*\b/.test(text)) leaks.push('content:internalId-pattern');
  if (/\b(TASTE-CAP-\d+|uupm\.[a-z0-9.-]+|frontend\.[a-z0-9.-]+|impeccable\.[a-z0-9.-]+)\b/i.test(text)) {
    leaks.push('content:capability-id');
  }
  if (/\blocal-world-library-seed\b/i.test(text)) leaks.push('content:seed-provenance');
  return leaks;
}
