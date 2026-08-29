/** Direction Engine v3 vertical slice — typed input. Original work, MIT. */

export const ESSENTIAL_FIELDS = ['brief', 'evidence', 'mode', 'stack'];
export const OPTIONAL_FIELDS = [
  'brand', 'assetPlan', 'assetManifest', 'userConstraints', 'projectName', 'randomSeed',
];

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
 * Canonical text for hashing and signal extraction.
 * CRLF/CR → LF so Windows checkouts and Linux CI produce the same inputHash
 * and the same proof results. Idempotent.
 * @param {unknown} text
 * @returns {string}
 */
export function canonicalNewlines(text) {
  return String(text ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * @param {object} raw
 * @returns {{ ok: true, input: object } | { ok: false, status: 'stop'|'draft', problems: string[] }}
 */
export function validateDirectionInput(raw) {
  const problems = [];
  const input = {
    brief: canonicalNewlines(raw?.brief ?? '').trim(),
    evidence: canonicalNewlines(raw?.evidence ?? '').trim(),
    brand: canonicalNewlines(raw?.brand ?? '').trim(),
    assetPlan: canonicalNewlines(raw?.assetPlan ?? '').trim(),
    assetManifest: canonicalNewlines(raw?.assetManifest ?? '').trim(),
    mode: String(raw?.mode ?? '').trim().toLowerCase(),
    stack: String(raw?.stack ?? '').trim().toLowerCase(),
    userConstraints: canonicalNewlines(raw?.userConstraints ?? '').trim(),
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

  if (/\b(testimonial|customer quote)\b/i.test(input.brand)
    && !/\b(testimonial|customer quote)\b/i.test(input.evidence)
    && !/\b(testimonial|customer quote)\b/i.test(input.brief)) {
    problems.push('refuses to invent testimonials: present in brand but absent from brief/evidence');
  }

  if (problems.length) {
    return {
      ok: false,
      status: problems.some((p) => /required/.test(p)) ? 'stop' : 'draft',
      problems,
    };
  }

  const warnings = [];
  if (!input.brand) warnings.push('BRAND.md missing — brand facts must remain unknown, not invented');
  if (!input.assetPlan) warnings.push('ASSET-PLAN.md missing — asset strategy limited to evidence only');
  if (!input.assetManifest) warnings.push('ASSET-MANIFEST.md missing — comps may use labelled slots only');

  const signals = extractProjectSignals(input);
  return {
    ok: true,
    input: {
      ...input,
      warnings,
      subjectHints: signals,
      dials: extractDials(input),
      signals,
    },
  };
}

/**
 * Strip frontmatter noise and trailing quote artifacts from extracted fields.
 * H2H failure: subject became `Northline Leather Goods"` from YAML title lines.
 */
export function cleanExtractedField(value) {
  return String(value ?? '')
    .replace(/^#\s*/, '')
    .replace(/^subject:\s*/i, '')
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/\\+"/g, '"')
    .replace(/["']+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Body lines only — skip YAML frontmatter keys that leak into captures. */
export function contentLines(text) {
  return String(text ?? '')
    .split(/\r?\n/)
    .filter((line) => {
      if (/^---\s*$/.test(line)) return false;
      if (/^(title|status|ai_generated|schemaVersion)\s*:/i.test(line)) return false;
      return true;
    });
}

export function extractProjectSignals(input) {
  const text = `${input.brief}\n${input.evidence}\n${input.brand}\n${input.assetPlan}\n${input.assetManifest}\n${input.userConstraints}`;
  const body = contentLines(text).join('\n');
  const subject = cleanExtractedField(
    firstMatch(body, /(?:subject|product|company|client)\s*[:—-]\s*(.+)$/im)
      ?? firstMatch(body, /^#\s+(.+)$/m)
      ?? 'unnamed subject',
  );
  const audience = cleanExtractedField(
    firstMatch(body, /(?:audience|for)\s*[:—-]\s*(.+)$/im) ?? 'unknown audience',
  );
  const primaryAction = cleanExtractedField(
    firstMatch(body, /(?:primary action|cta|job)\s*[:—-]\s*(.+)$/im)
      ?? firstMatch(body, /\b(buy|book|enquire|sign up|log a passage|configure|request)\b/i)
      ?? 'unknown action',
  );
  const antiRefs = [...body.matchAll(/anti[- ]references?\s*[:—-]\s*(.+)$/gim)]
    .map((m) => cleanExtractedField(m[1]))
    .filter(Boolean);
  const hasBrand = Boolean(input.brand);
  const hasAssetPlan = Boolean(input.assetPlan);
  const hasManifest = Boolean(input.assetManifest);
  const imageless = /deliberately imageless|imagery:\s*deliberately imageless|no imagery/i.test(text);
  const hasProductPlates = /product plates?|product photos?|object-led plates?|tote\.webp|belt\.webp|product plate/i.test(text)
    || (/\(have\)/i.test(text) && /product|tote|belt|bag|sku/i.test(text) && !/diagram|exploded/i.test(text));
  const hasDiagrams = /diagram|schema|wireframe/i.test(text);
  const operational = /console|log form|keyboard|validation|desktop web app|harbour|passage/i.test(text);
  const commerce = /price|sku|cart|slip|make-slot|checkout|product/i.test(text);
  const editorial = /edition|portfolio|letterpress|festival|print/i.test(text);
  const brandPalette = extractBrandPalette(input.brand);
  const materials = extractMaterials(body);
  const products = extractProductList(body);
  const constraints = input.userConstraints
    ? input.userConstraints.split(/\n+/).map((s) => s.trim()).filter(Boolean)
      .filter((s) => !/^(---|#|title:|status:|ai_generated:)/i.test(s))
    : [];

  return {
    subject: subject.slice(0, 120),
    audience: audience.slice(0, 120),
    primaryAction: primaryAction.slice(0, 120),
    antiRefs,
    brandPalette,
    materials,
    products,
    hasBrand,
    hasAssetPlan,
    hasManifest,
    imageless,
    hasProductPlates,
    hasDiagrams,
    operational,
    commerce,
    editorial,
    constraints,
    vocabulary: uniqueTokens(`${subject} ${audience} ${primaryAction} ${input.evidence}`).slice(0, 24),
  };
}

export function extractDials(input) {
  const text = `${input.brief}\n${input.evidence}`;
  const density = parseDial(text, /visual density\s*[:—-]\s*(\d{1,2})/i);
  const motion = parseDial(text, /motion intensity\s*[:—-]\s*(\d{1,2})/i);
  const boldness = parseDial(text, /aesthetic boldness\s*[:—-]\s*(\d{1,2})/i);
  return {
    visualDensity: density ?? null,
    motionIntensity: motion ?? null,
    aestheticBoldness: boldness ?? null,
    status: {
      visualDensity: density == null ? 'unknown' : 'explicit',
      motionIntensity: motion == null ? 'unknown' : 'explicit',
      aestheticBoldness: boldness == null ? 'unknown' : 'explicit',
    },
  };
}

function parseDial(text, re) {
  const m = text.match(re);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isInteger(n) || n < 1 || n > 10) return null;
  return n;
}

function firstMatch(text, re) {
  const m = String(text).match(re);
  return m ? (m[1] ?? m[0]) : null;
}

function uniqueTokens(text) {
  return [...new Set(String(text).toLowerCase().match(/[a-zæøå0-9-]{3,}/g) ?? [])];
}

function extractBrandPalette(brand) {
  if (!brand) return [];
  const body = contentLines(brand).join(' ');
  const bits = [];
  // free-text colours: "Ink brown, warm cream, single brass accent"
  const colourish = body.match(
    /\b(ink|near-black|chalk|cream|brass|coral|amber|fog|grey|gray|brown|bone|soot|harbour|white|black)[\w\s-]{0,24}/gi,
  );
  if (colourish) bits.push(...colourish.map((s) => s.trim().toLowerCase()).slice(0, 6));
  const hex = body.match(/#[0-9A-Fa-f]{3,8}/g);
  if (hex) bits.push(...hex.slice(0, 4));
  return [...new Set(bits)].slice(0, 8);
}

function extractMaterials(body) {
  const m = firstMatch(body, /materials?\s*[:—-]\s*(.+)$/im);
  if (!m) return [];
  return m.split(/,|\/|;/).map((s) => cleanExtractedField(s)).filter(Boolean).slice(0, 8);
}

function extractProductList(body) {
  const m = firstMatch(body, /products?(?:\s*\(truth\))?\s*[:—-]\s*(.+)$/im)
    ?? firstMatch(body, /work\s*[:—-]\s*(.+)$/im)
    ?? firstMatch(body, /proof\s*[:—-]\s*(.+)$/im);
  if (!m) return [];
  return m.split(/,|;/).map((s) => cleanExtractedField(s)).filter(Boolean).slice(0, 8);
}
