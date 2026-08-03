#!/usr/bin/env node
/**
 * SiteSmith Knowledge Index: local retrieval.
 *
 * ---------------------------------------------------------------------------
 * THE HARD RULE
 * ---------------------------------------------------------------------------
 * Retrieval never returns a complete visual template or a finished look. These
 * are building blocks, and they still have to go through SiteSmith's subject,
 * thesis, autopilot, swap and originality flow before anything is built.
 *
 * That sentence is not decoration. It is printed with every result this module
 * emits, in both the text and the JSON output, because the failure this index
 * is most likely to cause is a builder treating three retrieved posts as a
 * design. A post says what obligation applies and what usually goes wrong. It
 * does not say what the page looks like. The look comes from the subject's own
 * nouns, and no amount of retrieval can supply those.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS
 * ---------------------------------------------------------------------------
 * A dependency-free retrieval engine over the JSONL files in this directory.
 * Node builtins only. No index is persisted; the corpus is small enough that
 * loading and scoring it costs less than maintaining a cache.
 *
 * Scoring is term overlap between the brief and the post, weighted by field:
 *
 *     userJob   5   what the builder is trying to do
 *     problem   5   what goes wrong without this post
 *     mechanism 3   the structure or mechanism itself
 *     worksWhen 2   the condition under which it applies
 *     id        2   so a direct id lookup works
 *     avoidWhen 1   the counter-condition
 *     risks     1
 *     genericnessNote / mobileRules / accessibilityRules   0.5
 *
 * Each query term contributes the weight of the highest-weighted field it
 * appears in, multiplied by its inverse document frequency across the corpus,
 * so common words such as "page" and "design" cannot carry a match on their
 * own. The score is normalised against the score the query would reach if
 * every one of its terms landed in the highest-weighted field, counting terms
 * the index has never seen as well. That last part is what makes the no-match
 * threshold mean anything: a brief mostly made of words the index does not
 * know cannot reach a good score off one incidental hit.
 *
 * `surface` and `stack` are hard filters. A post whose surface is "any"
 * survives every surface filter; a post outside `knowledge/stacks/` survives
 * every stack filter. Nothing is scored back in after being filtered out.
 *
 * At most three results are ever returned. When the best score is below the
 * threshold the engine reports "no good match" and returns nothing, rather
 * than handing back the least bad post in the corpus. An honest empty answer
 * is cheaper than a plausible wrong one.
 *
 * ---------------------------------------------------------------------------
 * PROVENANCE
 * ---------------------------------------------------------------------------
 * Every post carries `licence` and `provenance`. `provenance: "verbatim"`
 * means the post's `mechanism` field is text copied word for word from the
 * file and lines named in `source`, with markdown emphasis markers removed;
 * every other field on that post is SiteSmith's own framing. Verbatim quotes
 * exist only for the four sources that permit redistribution: ui-ux-pro-max
 * and taste-skill (MIT), frontend-design and impeccable (Apache-2.0).
 * Everything else is re-expressed or original.
 *
 * ---------------------------------------------------------------------------
 * USAGE
 * ---------------------------------------------------------------------------
 *   import { search } from './retrieve.mjs';
 *   const out = search({ brief: 'pricing page for a two person bindery',
 *                        surface: 'buy', stack: 'wordpress', limit: 3 });
 *
 *   node knowledge/retrieve.mjs "<brief>" [--surface buy] [--stack astro]
 *                               [--limit 3] [--json]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(HERE);

export const HARD_RULE =
  'Retrieval never returns a complete visual template or a finished look. ' +
  'These are building blocks, and they still have to go through SiteSmith\'s ' +
  'subject, thesis, autopilot, swap and originality flow before anything is built.';

export const REQUIRED_FIELDS = [
  'id', 'surface', 'userJob', 'problem', 'worksWhen', 'avoidWhen', 'mechanism',
  'risks', 'mobileRules', 'accessibilityRules', 'genericnessRisk',
  'genericnessNote', 'source', 'licence', 'provenance', 'confidence',
];

export const ARRAY_FIELDS = ['risks', 'mobileRules', 'accessibilityRules'];

/** Only these four sources may be quoted verbatim. Everything else must not be. */
export const VERBATIM_LICENCES = [
  'MIT (ui-ux-pro-max)',
  'MIT (taste-skill)',
  'Apache-2.0 (frontend-design)',
  'Apache-2.0 (impeccable)',
];

/** Every licence value a post is allowed to carry. */
export const ALLOWED_LICENCES = [...VERBATIM_LICENCES, 'MIT (sitesmith)'];

export const ALLOWED_PROVENANCE = ['verbatim', 're-expressed', 'original'];
export const ALLOWED_SURFACES = ['buy', 'operate', 'read', 'experience', 'redesign', 'any'];
export const ALLOWED_GENERICNESS = ['low', 'medium', 'high'];

const FIELD_WEIGHTS = {
  userJob: 5,
  problem: 5,
  mechanism: 3,
  worksWhen: 2,
  id: 2,
  avoidWhen: 1,
  risks: 1,
  genericnessNote: 0.5,
  mobileRules: 0.5,
  accessibilityRules: 0.5,
};

const MAX_WEIGHT = 5;

/** Below this normalised score the engine says "no good match" instead of guessing. */
export const NO_MATCH_THRESHOLD = 0.12;

/* How many of a query's terms the denominator counts, taken from the most informative end.
   Twelve is roughly one sentence of real content words, which is what a person types into
   `recommend`; a whole brief is normalised against the same budget so both routes agree. */
export const QUERY_TERM_CAP = 12;

export const MAX_RESULTS = 3;

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'do',
  'does', 'for', 'from', 'get', 'got', 'has', 'have', 'how', 'i', 'if', 'in',
  'into', 'is', 'it', 'its', 'just', 'me', 'my', 'need', 'needs', 'no', 'not',
  'of', 'on', 'onto', 'or', 'our', 'out', 'over', 'so', 'some', 'that', 'the',
  'their', 'them', 'then', 'there', 'these', 'they', 'this', 'to', 'up', 'us',
  'use', 'used', 'want', 'wants', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
]);

/** Small alias table for the handful of domain pairs light stemming will not unify. */
const ALIASES = new Map(Object.entries({
  a11y: 'accessibility',
  accessible: 'accessibility',
  colour: 'color',
  colours: 'color',
  ecommerce: 'commerce',
  'e-commerce': 'commerce',
  webshop: 'commerce',
  shop: 'commerce',
  store: 'commerce',
  storefront: 'commerce',
  typeface: 'font',
  fonts: 'font',
  cta: 'control',
  button: 'control',
  buttons: 'control',
  responsive: 'mobile',
  phone: 'mobile',
  cellphone: 'mobile',
  smartphone: 'mobile',
  animation: 'motion',
  animations: 'motion',
  animate: 'motion',
  animated: 'motion',
  copy: 'copy',
  wording: 'copy',
  dashboard: 'console',
  admin: 'console',
}));

/** Lowercase, split, drop stopwords, apply aliases, then strip a few suffixes. */
export function tokenize(text) {
  if (text === null || text === undefined) return [];
  const raw = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean);

  const out = [];
  for (const word of raw) {
    if (word.length < 2) continue;
    if (STOPWORDS.has(word)) continue;
    const aliased = ALIASES.get(word) ?? word;
    if (STOPWORDS.has(aliased)) continue;
    const stem = stemLite(aliased);
    if (stem.length >= 2) out.push(stem);
  }
  return out;
}

/**
 * Light suffix stripping. Not a real stemmer and not trying to be: it exists so
 * that price/pricing, buyer/buyers and navigate/navigation land on one token.
 */
function stemLite(word) {
  let w = word;
  if (w.length > 6 && w.endsWith('ation')) w = w.slice(0, -5) + 'at';
  else if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith('ly')) w = w.slice(0, -2);
  if (w.length > 4 && w.endsWith('ies')) w = w.slice(0, -3) + 'y';
  else if (w.length > 4 && w.endsWith('sses')) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
  return w;
}

function fieldText(post, field) {
  const value = post[field];
  if (Array.isArray(value)) return value.join(' ');
  return value === null || value === undefined ? '' : String(value);
}

/* ------------------------------------------------------------------ corpus */

function jsonlFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.jsonl'))
    .sort()
    .map((name) => join(dir, name));
}

/** Every JSONL file in the index, top level first, then the per-stack files. */
export function corpusFiles(root = HERE) {
  return [...jsonlFiles(root), ...jsonlFiles(join(root, 'stacks'))];
}

/**
 * Read one JSONL file into posts. Throws with the file and line number on a
 * parse failure, because a silently skipped line is a post that quietly stops
 * being retrievable.
 */
export function loadFile(filePath, root = HERE) {
  const text = readFileSync(filePath, 'utf8');
  const stack = basename(dirname(filePath)) === 'stacks'
    ? basename(filePath, '.jsonl')
    : 'any';
  const file = relative(root, filePath).split(sep).join('/');
  const posts = [];

  text.split(/\r?\n/).forEach((line, i) => {
    if (!line.trim()) return;
    let post;
    try {
      post = JSON.parse(line);
    } catch (err) {
      throw new Error(`${file} line ${i + 1}: invalid JSON (${err.message})`);
    }
    Object.defineProperty(post, '_file', { value: file, enumerable: false });
    Object.defineProperty(post, '_stack', { value: stack, enumerable: false });
    Object.defineProperty(post, '_line', { value: i + 1, enumerable: false });
    posts.push(post);
  });

  return posts;
}

let CACHED = null;

/** Load and index every post. Cached per process; pass reload to rebuild. */
export function loadCorpus({ root = HERE, reload = false } = {}) {
  if (CACHED && !reload && CACHED.root === root) return CACHED;

  const posts = [];
  for (const file of corpusFiles(root)) posts.push(...loadFile(file, root));

  // Document frequency per token, so common words carry less than rare ones.
  const df = new Map();
  for (const post of posts) {
    const seen = new Set();
    for (const field of Object.keys(FIELD_WEIGHTS)) {
      for (const token of tokenize(fieldText(post, field))) seen.add(token);
    }
    Object.defineProperty(post, '_tokens', { value: buildFieldTokens(post), enumerable: false });
    for (const token of seen) df.set(token, (df.get(token) ?? 0) + 1);
  }

  const n = posts.length;
  const idf = new Map();
  for (const [token, count] of df) idf.set(token, Math.log(1 + n / (1 + count)));

  // The weight a term the index has never seen would carry. It is used in the
  // denominator only, so a brief made mostly of words the index does not know
  // cannot reach a high score off one incidental hit.
  const unknownIdf = Math.log(1 + n);

  CACHED = { root, posts, idf, unknownIdf, size: n };
  return CACHED;
}

function buildFieldTokens(post) {
  const map = new Map();
  for (const field of Object.keys(FIELD_WEIGHTS)) {
    for (const token of tokenize(fieldText(post, field))) {
      const current = map.get(token);
      const weight = FIELD_WEIGHTS[field];
      if (!current || weight > current.weight) map.set(token, { weight, field });
    }
  }
  return map;
}

/* ----------------------------------------------------------------- scoring */

function scorePost(post, queryTerms, idf) {
  let raw = 0;
  const matches = [];
  const counted = new Set();

  for (const term of queryTerms) {
    if (counted.has(term)) continue;
    counted.add(term);
    const hit = post._tokens.get(term);
    if (!hit) continue;
    const weight = hit.weight * (idf.get(term) ?? 0);
    if (weight <= 0) continue;
    raw += weight;
    matches.push({ term, field: hit.field, weight: round(weight) });
  }

  matches.sort((a, b) => b.weight - a.weight);
  return { raw, matches };
}

/**
 * The score the query would reach if every one of its terms landed in the
 * highest-weighted field. Terms the index has never seen are counted at
 * `unknownIdf` rather than dropped: dropping them was the bug that let a brief
 * about baking bread score 0.17 off the single word "bulk", because the
 * denominator then only contained the two terms that happened to exist.
 */
function normaliser(queryTerms, idf, unknownIdf) {
  /* Capped at the most informative terms, because the query is sometimes a whole brief.
     `sitesmith build` passes the brief file itself, and a brief is mostly the subject's own
     nouns, which the index does not hold and must not hold: the index carries patterns, not
     subjects. Uncapped, the same question scored 0.295 typed as a sentence and 0.092 pasted
     as its brief, so the command that reads a file found nothing while the command that
     read a summary found the right post first. Unknown terms still count inside the cap, so
     a brief about baking bread cannot reach the threshold off one incidental hit. */
  const weights = [...new Set(queryTerms)]
    .map((term) => MAX_WEIGHT * (idf.get(term) ?? unknownIdf))
    .sort((a, b) => b - a)
    .slice(0, QUERY_TERM_CAP);
  return weights.reduce((sum, w) => sum + w, 0);
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

/* ------------------------------------------------------------------ search */

/**
 * @param {object} options
 * @param {string} options.brief    free text describing the job at hand
 * @param {string} [options.surface] buy | operate | read | experience | redesign | any
 * @param {string} [options.stack]   wordpress | shopify | nextjs | astro | react | static
 * @param {number} [options.limit]   capped at MAX_RESULTS (3) whatever is passed
 * @returns {object} { hardRule, query, corpusSize, candidates, results, noGoodMatch, message }
 */
export function search({ brief = '', surface = null, stack = null, limit = MAX_RESULTS, root = HERE } = {}) {
  const { posts, idf, unknownIdf, size } = loadCorpus({ root });
  const cap = Math.max(1, Math.min(Number(limit) || MAX_RESULTS, MAX_RESULTS));
  const queryTerms = tokenize(brief);

  const wantSurface = surface && surface !== 'any' ? String(surface).toLowerCase() : null;
  const wantStack = stack && stack !== 'any' ? String(stack).toLowerCase() : null;

  // Hard filters. Nothing filtered out here is scored back in later.
  const candidates = posts.filter((post) => {
    if (wantSurface && post.surface !== wantSurface && post.surface !== 'any') return false;
    if (wantStack && post._stack !== wantStack && post._stack !== 'any') return false;
    return true;
  });

  const query = {
    brief,
    terms: queryTerms,
    surface: wantSurface ?? 'any',
    stack: wantStack ?? 'any',
    limit: cap,
  };

  const base = {
    hardRule: HARD_RULE,
    query,
    corpusSize: size,
    candidates: candidates.length,
    results: [],
    noGoodMatch: true,
    message: '',
  };

  if (queryTerms.length === 0) {
    base.message = 'No good match: the brief carried no searchable terms.';
    return base;
  }
  if (candidates.length === 0) {
    base.message = `No good match: no post survives surface "${query.surface}" and stack "${query.stack}".`;
    return base;
  }

  const denom = normaliser(queryTerms, idf, unknownIdf);
  if (denom <= 0) {
    base.message = 'No good match: none of the brief\'s terms appear anywhere in the index.';
    return base;
  }

  const antiPatterns = candidates.filter((post) => post._file === 'anti-patterns.jsonl');

  const scored = candidates
    .map((post) => {
      const { raw, matches } = scorePost(post, queryTerms, idf);
      return { post, score: round(raw / denom), raw, matches };
    })
    .filter((row) => row.raw > 0)
    .sort((a, b) => (b.score - a.score) || (b.post.confidence - a.post.confidence) || a.post.id.localeCompare(b.post.id));

  const best = scored.length ? scored[0].score : 0;
  if (best < NO_MATCH_THRESHOLD) {
    base.message =
      `No good match: best score ${best.toFixed(3)} is below the ${NO_MATCH_THRESHOLD} threshold. ` +
      'The index has nothing to say about this brief. Do not use the nearest post as a substitute; ' +
      'go to the subject\'s own world for the answer.';
    return base;
  }

  base.results = scored
    .slice(0, cap)
    .filter((row) => row.score >= NO_MATCH_THRESHOLD)
    .map((row) => buildResult(row, queryTerms, idf, antiPatterns));
  base.noGoodMatch = base.results.length === 0;
  base.message = base.noGoodMatch
    ? `No good match: nothing cleared the ${NO_MATCH_THRESHOLD} threshold.`
    : `${base.results.length} building block(s) from ${candidates.length} candidate posts.`;

  return base;
}

function buildResult(row, queryTerms, idf, antiPatterns) {
  const { post, score, matches } = row;
  return {
    hardRule: HARD_RULE,
    id: post.id,
    file: post._file,
    surface: post.surface,
    stack: post._stack,
    score,
    confidence: post.confidence,
    userJob: post.userJob,
    problem: post.problem,
    worksWhen: post.worksWhen,
    avoidWhen: post.avoidWhen,
    mechanism: post.mechanism,
    risks: post.risks,
    mobileRules: post.mobileRules,
    accessibilityRules: post.accessibilityRules,
    genericnessRisk: post.genericnessRisk,
    genericnessNote: post.genericnessNote,
    source: post.source,
    licence: post.licence,
    provenance: post.provenance,
    why: matches.map((m) => ({
      term: m.term,
      field: m.field,
      contribution: m.weight,
      explanation: `"${m.term}" matched in ${m.field} (field weight ${FIELD_WEIGHTS[m.field]})`,
    })),
    relatedAntiPatterns: relatedAntiPatterns(post, queryTerms, idf, antiPatterns),
  };
}

/**
 * Anti-patterns scored against the brief plus the matched post's own text.
 *
 * Only terms specific enough to mean something are allowed to connect the two.
 * Without the floor, every post relates to every anti-pattern through words
 * like "page" and "one", which is noise wearing the shape of a finding. An
 * empty list is the right answer more often than a padded one.
 */
const MIN_RELATED_IDF = 2.0;

function relatedAntiPatterns(post, queryTerms, idf, antiPatterns) {
  const context = [
    ...queryTerms,
    ...tokenize(post.userJob),
    ...tokenize(post.problem),
    ...tokenize(post.mechanism),
  ].filter((term) => (idf.get(term) ?? 0) >= MIN_RELATED_IDF);

  if (context.length === 0) return [];

  return antiPatterns
    .filter((ap) => ap.id !== post.id)
    .map((ap) => {
      const { raw, matches } = scorePost(ap, context, idf);
      return { ap, raw, matches };
    })
    .filter((row) => row.matches.length >= 2 && row.raw > 0)
    .sort((a, b) => b.raw - a.raw)
    .slice(0, 2)
    .map((row) => ({
      id: row.ap.id,
      problem: row.ap.problem,
      mechanism: row.ap.mechanism,
      genericnessRisk: row.ap.genericnessRisk,
      sharedTerms: row.matches.slice(0, 5).map((m) => m.term),
    }));
}

/* ------------------------------------------------------------------ output */

function bullet(lines, indent = '    ') {
  if (!lines || lines.length === 0) return `${indent}(none recorded)`;
  return lines.map((line) => `${indent}- ${line}`).join('\n');
}

export function formatResults(out) {
  const head = [
    'SiteSmith Knowledge Index',
    `  brief   : ${out.query.brief || '(empty)'}`,
    `  terms   : ${out.query.terms.join(', ') || '(none)'}`,
    `  surface : ${out.query.surface}    stack: ${out.query.stack}    limit: ${out.query.limit}`,
    `  corpus  : ${out.corpusSize} posts, ${out.candidates} after hard filters`,
    '',
    `HARD RULE: ${HARD_RULE}`,
    '',
  ].join('\n');

  if (out.noGoodMatch) {
    return `${head}${out.message}\n`;
  }

  const blocks = out.results.map((r, i) => {
    const why = r.why.length
      ? r.why.map((w) => `    - ${w.explanation}, contribution ${w.contribution}`).join('\n')
      : '    - (no term-level explanation available)';

    const anti = r.relatedAntiPatterns.length
      ? r.relatedAntiPatterns
          .map((ap) => `    - ${ap.id} [${ap.genericnessRisk} genericness risk]\n      ${ap.problem}\n      shared terms: ${ap.sharedTerms.join(', ')}`)
          .join('\n')
      : '    - (no anti-pattern in the index is close enough to be worth printing)';

    return [
      `${i + 1}. ${r.id}    score ${r.score}    confidence ${r.confidence}`,
      `   ${r.file}  |  surface: ${r.surface}  |  stack: ${r.stack}  |  ${r.licence} (${r.provenance})`,
      '',
      `   Job      : ${r.userJob}`,
      `   Problem  : ${r.problem}`,
      `   Works when : ${r.worksWhen}`,
      `   Avoid when : ${r.avoidWhen}`,
      `   Mechanism  : ${r.mechanism}`,
      '',
      '   Why this matched:',
      why,
      '',
      '   Risks:',
      bullet(r.risks),
      '',
      '   Mobile:',
      bullet(r.mobileRules),
      '',
      '   Accessibility:',
      bullet(r.accessibilityRules),
      '',
      `   Genericness risk: ${r.genericnessRisk}. ${r.genericnessNote}`,
      `   Source: ${r.source}`,
      '',
      '   Related anti-patterns:',
      anti,
      '',
      `   HARD RULE: ${HARD_RULE}`,
      '',
    ].join('\n');
  });

  return `${head}${out.message}\n\n${blocks.join('\n')}`;
}

/* --------------------------------------------------------------------- CLI */

function parseArgs(argv) {
  const opts = { brief: '', surface: null, stack: null, limit: MAX_RESULTS, json: false };
  const loose = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') opts.json = true;
    else if (arg === '--surface') opts.surface = argv[++i];
    else if (arg === '--stack') opts.stack = argv[++i];
    else if (arg === '--limit') opts.limit = Number(argv[++i]);
    else if (arg.startsWith('--surface=')) opts.surface = arg.slice(10);
    else if (arg.startsWith('--stack=')) opts.stack = arg.slice(8);
    else if (arg.startsWith('--limit=')) opts.limit = Number(arg.slice(8));
    else loose.push(arg);
  }
  opts.brief = loose.join(' ');
  return opts;
}

const invokedDirectly = process.argv[1]
  && fileURLToPath(import.meta.url) === process.argv[1];

if (invokedDirectly) {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.brief) {
    process.stdout.write(
      'usage: node knowledge/retrieve.mjs "<brief>" [--surface buy] [--stack astro] [--limit 3] [--json]\n\n'
      + `HARD RULE: ${HARD_RULE}\n`,
    );
    process.exit(2);
  }
  const out = search(opts);
  process.stdout.write(opts.json ? `${JSON.stringify(out, null, 2)}\n` : formatResults(out));
  process.exit(out.noGoodMatch ? 1 : 0);
}

export { REPO_ROOT, FIELD_WEIGHTS };
