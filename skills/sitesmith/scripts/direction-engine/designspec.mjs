/** DesignSpec compile + validation + v2.3 handoff. Original work, MIT. */

export const DESIGNSPEC_REQUIRED = [
  'schemaVersion', 'kind', 'projectName', 'mode', 'stack', 'designThesis',
  'contentHierarchy', 'pageComposition', 'gridAndSpacing', 'typographySystem',
  'colourRoles', 'surfaceMaterialModel', 'imageryStrategy', 'componentPrinciples',
  'interactionStates', 'motionRules', 'responsiveBehavior', 'accessibilityConstraints',
  'signatureElement', 'forbiddenFallbackDefaults', 'fidelityAssertions',
  'acceptanceCriteria', 'capabilityProvenance', 'dials',
];

export function validateDesignSpec(spec) {
  const problems = [];
  if (!spec || typeof spec !== 'object') return { ok: false, problems: ['spec missing'] };
  for (const key of DESIGNSPEC_REQUIRED) {
    if (spec[key] == null) problems.push(`missing field: ${key}`);
  }
  if (spec.schemaVersion !== 1) problems.push('schemaVersion must be 1');
  if (spec.kind !== 'sitesmith.designspec.v3-slice') problems.push('unexpected kind');
  if (!Array.isArray(spec.fidelityAssertions) || spec.fidelityAssertions.length < 5) {
    problems.push('fidelityAssertions incomplete');
  }
  if (!spec.dials || typeof spec.dials !== 'object') problems.push('dials missing');
  return { ok: problems.length === 0, problems };
}

export function compileDesignSpec({ input, card, route, policy, choice }) {
  if (!card) {
    return { ok: false, problems: ['no selected card to compile'] };
  }

  const dials = input.dials ?? {
    visualDensity: null,
    motionIntensity: null,
    aestheticBoldness: null,
    status: {
      visualDensity: 'unknown',
      motionIntensity: 'unknown',
      aestheticBoldness: 'unknown',
    },
  };

  const spec = {
    schemaVersion: 1,
    kind: 'sitesmith.designspec.v3-slice',
    projectName: input.projectName,
    mode: input.mode,
    stack: input.stack,
    designThesis: card.thesis,
    contentHierarchy: Array.isArray(card.layoutPrinciple)
      ? card.layoutPrinciple
      : String(card.layoutPrinciple ?? 'subject → action → evidence → secondary').split(/\s*\d\)\s*/).filter(Boolean),
    pageComposition: card.composition,
    gridAndSpacing: spacingFor(card.density),
    typographySystem: {
      principle: card.type,
      roles: ['display', 'body', 'label', 'utility-mono'],
    },
    colourRoles: {
      ground: card.colour,
      accent: (input.signals?.brandPalette ?? []).find((c) => /brass|coral|amber|accent/i.test(c))
        ?? 'single reserved accent from brand evidence only if present',
      text: 'primary ink on ground with WCAG AA body contrast',
      brandPalette: input.signals?.brandPalette ?? [],
    },
    surfaceMaterialModel: card.surface,
    imageryStrategy: card.imagery,
    componentPrinciples: [
      'states must be visible without colour alone',
      'primary action uses reserved accent only',
    ],
    interactionStates: ['default', 'hover/focus', 'active', 'disabled', 'error'],
    motionRules: {
      principle: card.motionInteraction,
      reducedMotion: 'disable non-essential motion',
    },
    responsiveBehavior: {
      firstFold: 'preserve composition intent; stack only after tablet',
      tables: 'horizontal scroll must expose affordance if used',
    },
    accessibilityConstraints: [
      'visible focus',
      'label every control',
      'AA contrast for body and UI text',
    ],
    signatureElement: card.signatureElement,
    forbiddenFallbackDefaults: [
      'purple SaaS gradient hero',
      'three equal feature cards as default identity',
      'round-8 recipe: mono uppercase labels + hairlines + tabular motif + flat depth',
      'invented testimonials, prices, or certifications',
    ],
    fidelityAssertions: [
      { field: 'composition', expected: card.composition },
      { field: 'type', expected: card.type },
      { field: 'colour', expected: card.colour },
      { field: 'imagery', expected: card.imagery },
      { field: 'rhythm', expected: card.rhythm },
      { field: 'surface', expected: card.surface },
      { field: 'labels', expected: card.labels },
      { field: 'figures', expected: card.figures },
      { field: 'depth', expected: card.depth },
      { field: 'signature-selector', expected: `[data-signature="${card.signatureElement}"]` },
    ],
    acceptanceCriteria: [
      'built page matches axis record treatments',
      'primary action findable in first fold',
      'no fabricated brand/product facts',
      'passes existing v2.3 verify + direction fidelity',
    ],
    capabilityProvenance: route.selected.map((s) => ({
      capabilityId: s.capabilityId,
      upstreamOrigin: s.upstreamOrigin,
      phase: s.phase,
      whyRelevant: s.whyRelevant,
      evidencePointers: s.evidencePointers,
      status: s.status,
    })),
    seedProvenance: card.seed,
    policyVersion: policy.policyVersion,
    dials,
    choice,
  };

  const validated = validateDesignSpec(spec);
  if (!validated.ok) return { ok: false, problems: validated.problems };
  return { ok: true, spec };
}

function spacingFor(density) {
  if (density === 'packed' || density === 'cockpit') return 'tight 4/8 rhythm, dense modules';
  if (density === 'airy' || density === 'poster' || density === 'cinematic') return 'open 8/16 rhythm, large voids';
  return 'balanced 8/12 rhythm';
}

function dialLine(name, value) {
  if (value == null) return `- ${name}: unknown`;
  return `- ${name}: ${value}`;
}

/** Handoff package for a fresh build context (v2.3 shell). */
export function buildHandoffPackage({ input, spec, selectedCard, rejectedCards }) {
  const dials = input.dials ?? {};
  const axisRecord = [
    '## Axis record',
    '',
    '- direction-version: 2.3',
    `- composition: ${selectedCard.composition}`,
    `- type: ${selectedCard.type}`,
    `- colour: ${selectedCard.colour}`,
    `- imagery: ${selectedCard.imagery}`,
    `- rhythm: ${selectedCard.rhythm}`,
    '',
    `- surface: ${selectedCard.surface}`,
    `- labels: ${selectedCard.labels}`,
    `- figures: ${selectedCard.figures}`,
    `- depth: ${selectedCard.depth}`,
    '',
    dialLine('visual-density', dials.visualDensity),
    dialLine('motion-intensity', dials.motionIntensity),
    dialLine('aesthetic-boldness', dials.aestheticBoldness),
    '',
    `- signature-selector: [data-signature="${selectedCard.signatureElement}"]`,
    '- signature-min-share: 12',
  ].join('\n');

  const g = selectedCard.grounding ?? {};
  const directionMd = [
    '---',
    `title: "DIRECTION — ${input.projectName}"`,
    'status: direction-engine-slice',
    'ai_generated: "(C)"',
    '---',
    '',
    `# DIRECTION — ${input.projectName}`,
    '',
    '## Design thesis',
    selectedCard.thesis,
    '',
    '## Subject grounding',
    [
      g.subject && `Subject: ${g.subject}`,
      g.audience && `Audience: ${g.audience}`,
      g.primaryAction && `Primary action: ${g.primaryAction}`,
      (g.products ?? []).length && `Products/work: ${(g.products ?? []).join(', ')}`,
      (g.materials ?? []).length && `Materials: ${(g.materials ?? []).join(', ')}`,
      (g.brandPalette ?? []).length && `Brand palette cues: ${(g.brandPalette ?? []).join(', ')}`,
      (g.antiRefs ?? []).length && `Anti-references: ${(g.antiRefs ?? []).join('; ')}`,
    ].filter(Boolean).join('\n') || selectedCard.evidence,
    '',
    '## Hierarchy',
    selectedCard.layoutPrinciple,
    '',
    '## Signature',
    selectedCard.signatureElement,
    '',
    '## Primary risk',
    selectedCard.primaryRisk,
    '',
    axisRecord,
    '',
    '## Implementation notes',
    [
      `Composition: ${selectedCard.composition}`,
      `Type: ${selectedCard.type}`,
      `Colour/material: ${selectedCard.colour}`,
      `Imagery/assets: ${selectedCard.imagery}`,
      `Interaction: ${selectedCard.motionInteraction}`,
      'Do not invent testimonials, prices, awards, or assets not in the evidence pack.',
      'Build context must not receive losing cards or generator scores.',
    ].join('\n'),
    '',
    '## Rejections',
    ...rejectedCards.map((c) => `- alternative card (${c.internalId}): withheld from build`),
  ].join('\n');

  return {
    mode: input.mode,
    stack: input.stack,
    evidenceArtifacts: {
      brief: true,
      evidence: true,
      brand: Boolean(input.brand),
      assetPlan: Boolean(input.assetPlan),
      assetManifest: Boolean(input.assetManifest),
    },
    designSpec: spec,
    directionMd,
    axisRecord,
    withheldFromBuild: {
      rejectedDirectionCards: true,
      generatorScores: true,
      generatorFavorite: true,
      blindKey: true,
    },
    next: {
      shell: 'sitesmith-v2.3',
      commands: ['build', 'audit'],
      adapters: input.stack,
    },
  };
}
