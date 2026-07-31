/** Compile selected direction → machine-readable DesignSpec + v2.3 handoff. Original work, MIT. */

export function compileDesignSpec({ input, card, route, policy, choice }) {
  if (!card) {
    return { ok: false, problems: ['no selected card to compile'] };
  }

  const spec = {
    schemaVersion: 1,
    kind: 'sitesmith.designspec.v3-slice',
    projectName: input.projectName,
    mode: input.mode,
    stack: input.stack,
    designThesis: card.thesis,
    contentHierarchy: [
      'subject recognition',
      input.subjectHints.primaryAction,
      'supporting evidence',
      'secondary navigation',
    ],
    pageComposition: card.composition,
    gridAndSpacing: spacingFor(card.density),
    typographySystem: {
      principle: card.type,
      roles: ['display', 'body', 'label'],
    },
    colourRoles: {
      ground: card.colour,
      accent: 'single reserved accent from brand evidence only if present',
      text: 'primary ink on ground with WCAG AA body contrast',
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
    })),
    seedProvenance: card.seed,
    policyVersion: policy.policyVersion,
    choice,
  };

  return { ok: true, spec };
}

function spacingFor(density) {
  if (density === 'packed' || density === 'cockpit') return 'tight 4/8 rhythm, dense modules';
  if (density === 'airy' || density === 'poster' || density === 'cinematic') return 'open 8/16 rhythm, large voids';
  return 'balanced 8/12 rhythm';
}

/** Handoff package for a fresh build context (v2.3 shell). */
export function buildHandoffPackage({ input, spec, selectedCard, rejectedCards }) {
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
    '- visual-density: 5',
    '- motion-intensity: 3',
    '- aesthetic-boldness: 6',
    '',
    `- signature-selector: [data-signature="${selectedCard.signatureElement}"]`,
    '- signature-min-share: 12',
  ].join('\n');

  const directionMd = [
    '---',
    `title: "DIRECTION — ${input.projectName}"`,
    'status: direction-engine-slice',
    'ai_generated: "(C)"',
    '---',
    '',
    `# DIRECTION — ${input.projectName}`,
    '',
    `Winner: ${selectedCard.worldId} (${selectedCard.thesis})`,
    '',
    '## Signature',
    selectedCard.signatureElement,
    '',
    axisRecord,
    '',
    '## Rejections',
    ...rejectedCards.map((c) => `- ${c.worldId}: recorded alternative; not passed to build context`),
    '',
    '## Notes',
    'Selected by Direction Engine v3 slice. Build context must not receive losing cards or generator scores.',
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
    /** Explicit denylist for build context */
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
