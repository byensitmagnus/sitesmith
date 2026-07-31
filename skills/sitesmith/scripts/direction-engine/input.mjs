/** Direction Engine v3 vertical slice — typed input. Original work, MIT. */

export const ESSENTIAL_FIELDS = [
  'brief',
  'evidence',
  'mode',
  'stack',
];

export const OPTIONAL_FIELDS = [
  'brand',
  'assetPlan',
  'assetManifest',
  'userConstraints',
  'projectName',
  'randomSeed',
];

export const MODES = [
  'marketing',
  'portfolio',
  'editorial',
  'ecommerce',
  'product-ui',
  'redesign',
  'component',
  'audit',
];

/** Map public v2.3 mode files onto finer internal subclasses without changing product UX. */
export const V23_MODE_ALIASES = {
  marketing: 'marketing',
  ecommerce: 'ecommerce',
  'product-ui': 'product-ui',
  product: 'product-ui',
  redesign: 'redesign',
  portfolio: 'portfolio',
  editorial: 'editorial',
  component: 'component',
  audit: 'audit',
};

/**
 * @param {object} raw
 * @returns {{ ok: true, input: object } | { ok: false, status: 'stop'|'draft', problems: string[] }}
 */
export function validateDirectionInput(raw) {
  const problems = [];
  const input = {
    brief: String(raw?.brief ?? '').trim(),
    evidence: String(raw?.evidence ?? '').trim(),
    brand: String(raw?.brand ?? '').trim(),
    assetPlan: String(raw?.assetPlan ?? '').trim(),
    assetManifest: String(raw?.assetManifest ?? '').trim(),
    mode: String(raw?.mode ?? '').trim().toLowerCase(),
    stack: String(raw?.stack ?? '').trim().toLowerCase(),
    userConstraints: String(raw?.userConstraints ?? '').trim(),
    projectName: String(raw?.projectName ?? 'untitled').trim(),
    randomSeed: raw?.randomSeed == null ? null : String(raw.randomSeed),
  };

  if (!input.brief) problems.push('BRIEF.md content is required (brief)');
  if (!input.evidence) problems.push('EVIDENCE.md content is required (evidence)');
  if (!input.mode) problems.push('mode is required');
  if (!input.stack) problems.push('stack is required');

  const mapped = V23_MODE_ALIASES[input.mode];
  if (input.mode && !mapped) {
    problems.push(`mode must be one of: ${Object.keys(V23_MODE_ALIASES).join(', ')}`);
  } else if (mapped) {
    input.mode = mapped;
  }

  // Fabrication guards: essential product claims must appear in evidence/brief, not only brand copy.
  const inventSignals = [
    { re: /\b(testimonial|customer quote)\b/i, where: 'brand', label: 'testimonials' },
  ];
  for (const signal of inventSignals) {
    if (signal.re.test(input.brand) && !signal.re.test(input.evidence) && !signal.re.test(input.brief)) {
      problems.push(`refuses to invent ${signal.label}: present in brand but absent from brief/evidence`);
    }
  }

  if (problems.length) {
    const status = problems.some((p) => /required/.test(p)) ? 'stop' : 'draft';
    return { ok: false, status, problems };
  }

  // Soft draft warnings when brand/assets missing (allowed to proceed with explicit unknowns).
  const warnings = [];
  if (!input.brand) warnings.push('BRAND.md missing — brand facts must remain unknown, not invented');
  if (!input.assetPlan) warnings.push('ASSET-PLAN.md missing — asset strategy limited to evidence only');
  if (!input.assetManifest) warnings.push('ASSET-MANIFEST.md missing — comps may use labelled slots only');

  return {
    ok: true,
    input: {
      ...input,
      warnings,
      subjectHints: extractSubjectHints(input),
    },
  };
}

export function extractSubjectHints(input) {
  const text = `${input.brief}\n${input.evidence}\n${input.brand}`;
  const subject = firstMatch(text, /(?:subject|product|company|client)\s*[:—-]\s*(.+)$/im)
    ?? firstMatch(text, /^#\s+(.+)$/m)
    ?? 'unnamed subject';
  const audience = firstMatch(text, /(?:audience|for)\s*[:—-]\s*(.+)$/im) ?? 'unknown audience';
  const primaryAction = firstMatch(text, /(?:primary action|cta|job)\s*[:—-]\s*(.+)$/im)
    ?? firstMatch(text, /(?:buy|book|enquire|sign up|log|configure)/i)?.[0]
    ?? 'unknown action';
  const antiRefs = [...text.matchAll(/anti[- ]references?\s*[:—-]\s*(.+)$/gim)].map((m) => m[1].trim());
  return {
    subject: subject.trim().slice(0, 120),
    audience: audience.trim().slice(0, 120),
    primaryAction: String(primaryAction).trim().slice(0, 120),
    antiRefs,
  };
}

function firstMatch(text, re) {
  const m = String(text).match(re);
  return m ? (m[1] ?? m[0]) : null;
}
