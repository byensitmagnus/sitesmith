/** Shared parser for the machine-readable SiteSmith direction record. Original work, MIT. */

export const AXES = ['composition', 'type', 'colour', 'imagery', 'rhythm'];
export const GRAMMAR = ['surface', 'labels', 'figures', 'depth'];

export function parseDirectionRecord(md) {
  const axes = {};
  const grammar = {};
  for (const line of String(md).split('\n')) {
    const match = line.match(/^\s*[-*]\s*(composition|type|colour|color|imagery|rhythm|surface|labels|figures|depth)\s*:\s*(.+?)\s*$/i);
    if (!match) continue;
    const key = match[1].toLowerCase().replace('color', 'colour');
    (GRAMMAR.includes(key) ? grammar : axes)[key] = match[2].trim();
  }
  const version = String(md).match(/^\s*[-*]?\s*direction-version\s*:\s*([\d.]+)\s*$/im);
  return { version: version ? Number(version[1]) : null, axes, grammar };
}

/** A reason is part of the record, but it must not make the same treatment count as new. */
export function grammarParts(value) {
  const match = String(value).trim().match(/^(.+?)\s+(?:—|--)\s+(.+)$/);
  if (!match) return null;
  return { treatment: match[1].trim(), reason: match[2].trim() };
}

/** Normalise the treatments the browser gates understand. The vocabulary remains open; an
 * unknown treatment compares as its own text instead of being forced into a preset. */
export function grammarTreatment(field, value) {
  const raw = grammarParts(value)?.treatment ?? String(value).trim();
  const treatment = raw.toLowerCase().replace(/\s+/g, ' ');
  if (field === 'surface') {
    if (/\b(hairline|thin rules?|ruled)\b/.test(treatment)) return 'hairline';
    if (/\b(open|whitespace|borderless|rule[- ]free)\b/.test(treatment)) return 'open';
    if (/\b(framed|heavy frame|thick border|block border)\b/.test(treatment)) return 'framed';
    if (/\b(colou?r fields?|alternating grounds?|bands?)\b/.test(treatment)) return 'colour-field';
  }
  if (field === 'labels') {
    if (/\bmono(space)?\b/.test(treatment) && /\b(uppercase|caps|all-caps)\b/.test(treatment)) return 'mono-uppercase';
    if (/\b(sentence case|mixed case|body case)\b/.test(treatment)) return 'sentence-case';
    if (/\bsymbol/.test(treatment)) return 'symbol-led';
  }
  if (field === 'figures') {
    if (/\bfunctional\b/.test(treatment) && /\btabular\b/.test(treatment)) return 'functional-tabular';
    if (/\btabular\b/.test(treatment) && /\b(motif|display|visual language)\b/.test(treatment)) return 'tabular-motif';
    if (/\bproportional\b/.test(treatment)) return 'proportional';
    if (/\babsent\b/.test(treatment)) return 'absent';
  }
  if (field === 'depth') {
    if (/\b(flat|no elevation|no shadows?|zero elevation)\b/.test(treatment)) return 'flat';
    if (/\binset\b/.test(treatment)) return 'inset';
    if (/\boverlap/.test(treatment)) return 'overlap';
    if (/\b(elevated|shadowed|raised|floating)\b/.test(treatment)) return 'elevated';
  }
  return treatment;
}

export function directionRecordProblems(record) {
  const problems = [];
  const missingAxes = AXES.filter((field) => !record.axes?.[field]);
  if (missingAxes.length) problems.push(`direction record is missing: ${missingAxes.join(', ')}`);
  if ((record.version ?? 0) >= 2.3) {
    const missingGrammar = GRAMMAR.filter((field) => !record.grammar?.[field]);
    if (missingGrammar.length) {
      problems.push(`direction 2.3 grammar is missing: ${missingGrammar.join(', ')}`);
    }
    for (const field of GRAMMAR.filter((name) => record.grammar?.[name])) {
      if (!grammarParts(record.grammar[field])) {
        problems.push(`${field} must be "<treatment> — <subject-specific reason>"`);
      }
    }
  }
  return problems;
}
