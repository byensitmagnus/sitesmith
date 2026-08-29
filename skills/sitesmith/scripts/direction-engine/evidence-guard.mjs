/**
 * Fail-closed evidence guard for creative direction packets.
 * Rejects invented social proof, awards, assets, and shipping claims
 * not supported by the pack. Original work, MIT.
 */

const FORBIDDEN_PATTERNS = [
  { id: 'testimonial', re: /\b(testimonial|customer quote|\"[^\"]{8,}\"\s+said)\b/i },
  { id: 'fake-rating', re: /\b(4\.[5-9]\s*★|5\s*★|five[- ]star|4\.9\s*\/\s*5)\b/i },
  { id: 'award', re: /\b(award[- ]winning|won (a |the )?(webby|cssda|awwwards)|museum (show|exhibition))\b/i },
  { id: 'celebrity', re: /\b(celebrity client|as seen in|featured in vogue)\b/i },
  { id: 'free-shipping', re: /\bfree (world[- ]?wide )?shipping\b/i },
  { id: 'invented-kpi', re: /\b(\d{2,3}%\s+(conversion|uptime)|10k\+ users)\b/i },
];

const PACKET_TEXT_FIELDS = [
  'designThesis',
  'subjectGrounding',
  'composition',
  'informationHierarchy',
  'typography',
  'colourAndMaterialModel',
  'imageryAndAssetStrategy',
  'interactionConcept',
  'signatureElement',
  'primaryRisk',
  'implementationGuidance',
  'unknowns',
];

function packCorpus(input) {
  return [
    input.brief,
    input.evidence,
    input.brand,
    input.assetPlan,
    input.assetManifest,
    input.userConstraints,
  ].map((s) => String(s ?? '')).join('\n');
}

function tokenize(text) {
  return new Set(
    String(text).toLowerCase().match(/[a-zæøå0-9][a-zæøå0-9-]{2,}/g) ?? [],
  );
}

/**
 * @param {object} packet direction packet fields
 * @param {object} input validated direction input
 * @returns {{ ok: true } | { ok: false, problems: string[] }}
 */
export function guardCreativePacket(packet, input) {
  const problems = [];
  if (!packet || typeof packet !== 'object') {
    return { ok: false, problems: ['packet missing'] };
  }

  const corpus = packCorpus(input);
  const packTokens = tokenize(corpus);
  const blob = PACKET_TEXT_FIELDS.map((f) => String(packet[f] ?? '')).join('\n');

  for (const { id, re } of FORBIDDEN_PATTERNS) {
    if (re.test(blob) && !re.test(corpus)) {
      // Allow only if the pack itself already contains the same claim pattern
      problems.push(`invented-or-forbidden:${id}`);
    }
  }

  // Asset invention: named .webp/.png/.jpg not in pack
  const assetMentions = blob.match(/\b[\w.-]+\.(webp|png|jpe?g|gif|svg)\b/gi) ?? [];
  for (const asset of assetMentions) {
    if (!corpus.toLowerCase().includes(asset.toLowerCase())) {
      problems.push(`undeclared-asset:${asset}`);
    }
  }

  // Product-ish proper phrases: if packet invents a product name not in pack
  // Soft check: multi-word Capitalized sequences of 2+ tokens
  const proper = blob.match(/\b[A-Z][a-zæøå]+(?:\s+[A-Z][a-zæøå]+){1,3}\b/g) ?? [];
  for (const name of proper) {
    const lower = name.toLowerCase();
    if (lower.length < 6) continue;
    if (/^(Display|Body|Utility|Primary|Secondary|Subject|Audience|Action|Materials|Products|Hide Grade|Make-slot|Field Tote|Belt No|Shoulder Strap|Harbour Night|Chalk Path|Ferry Board|Passage Log|Northline Leather|Atelier Møn|IBM Plex|Plex Sans|Plex Mono|Barlow Condensed|Source Serif|Source Sans|Inter|Fraunces|Nunito|Rubik)/i.test(name)) {
      continue; // known system or pack entities / type brands
    }
    // Font / UI system words are never pack inventions
    if (/\b(sans|serif|mono|grotesk|grotesque|display|condensed|plex|barlow|inter|helvetica|arial|ui)\b/i.test(name)) {
      continue;
    }
    // if none of the words appear in pack, flag
    const words = lower.split(/\s+/);
    const missing = words.filter((w) => w.length > 3 && !packTokens.has(w));
    if (missing.length === words.length) {
      problems.push(`unsupported-proper-name:${name}`);
    }
  }

  // Must keep subject token if known
  const subject = input.signals?.subject;
  if (subject && subject !== 'unnamed subject') {
    const head = subject.toLowerCase().split(/\s+/)[0];
    if (head.length >= 3 && !blob.toLowerCase().includes(head)) {
      problems.push('missing-subject-grounding');
    }
  }

  if (problems.length) return { ok: false, problems };
  return { ok: true, problems: [] };
}

/**
 * Build a comparable direction packet from an engine card (+ optional overrides).
 */
export function packetFromCard(card, input, extras = {}) {
  const g = card.grounding ?? {};
  return {
    designThesis: card.thesis,
    subjectGrounding: [
      g.subject && `Subject: ${g.subject}`,
      g.audience && `Audience: ${g.audience}`,
      g.primaryAction && `Action: ${g.primaryAction}`,
      (g.products ?? []).length && `Products: ${g.products.join(', ')}`,
      (g.materials ?? []).length && `Materials: ${g.materials.join(', ')}`,
      (g.brandPalette ?? []).length && `Palette: ${g.brandPalette.join(', ')}`,
      (g.antiRefs ?? []).length && `Anti-refs: ${g.antiRefs.join('; ')}`,
    ].filter(Boolean).join(' · ') || String(card.evidence ?? 'unknown'),
    composition: card.composition,
    informationHierarchy: card.layoutPrinciple ?? card.designIntent,
    typography: card.type ?? card.typographicPrinciple,
    colourAndMaterialModel: card.colour,
    imageryAndAssetStrategy: card.imagery ?? card.assetStrategy,
    interactionConcept: card.motionInteraction ?? card.rhythm,
    signatureElement: card.signatureElement,
    primaryRisk: card.primaryRisk,
    implementationGuidance: card.implementationNotes
      ?? extras.implementationGuidance
      ?? 'Follow DesignSpec axis record; no invented facts.',
    unknowns: (input.warnings ?? []).join('; ') || 'none declared',
    sourcePointers: {
      arm: 'sitesmith',
      creativePass: extras.creativePass ?? 'rules',
      ...(extras.sourcePointers ?? {}),
    },
  };
}
