#!/usr/bin/env node
/**
 * Tests for the SiteSmith Knowledge Index.
 *
 * Node builtins only, no test runner. Run it with:
 *   node knowledge/test-retrieve.mjs
 *
 * It checks the things that would make the index quietly wrong rather than
 * loudly broken: a post that no longer parses, two posts sharing an id, a
 * missing field, a licence that is not on the allow list, a verbatim quote
 * with no line numbers behind it, a search returning more than three results,
 * and a brief with no relation to anything returning the least bad post
 * instead of saying so.
 */

import { existsSync, statSync, readFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  search,
  loadCorpus,
  loadFile,
  corpusFiles,
  tokenize,
  HARD_RULE,
  REQUIRED_FIELDS,
  ARRAY_FIELDS,
  ALLOWED_LICENCES,
  VERBATIM_LICENCES,
  ALLOWED_PROVENANCE,
  ALLOWED_SURFACES,
  ALLOWED_GENERICNESS,
  MAX_RESULTS,
  NO_MATCH_THRESHOLD,
} from './retrieve.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(HERE);

const EXPECTED_FILES = {
  'surfaces.jsonl': 8,
  'patterns.jsonl': 12,
  'ux-rules.jsonl': 10,
  'cro-rules.jsonl': 8,
  'typography.jsonl': 8,
  'motion.jsonl': 8,
  'components.jsonl': 8,
  'evidence.jsonl': 8,
  'anti-patterns.jsonl': 8,
  'stacks/wordpress.jsonl': 5,
  'stacks/shopify.jsonl': 5,
  'stacks/nextjs.jsonl': 5,
  'stacks/astro.jsonl': 5,
  'stacks/react.jsonl': 5,
  'stacks/static.jsonl': 5,
};

let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed += 1;
    process.stdout.write(`  ok    ${name}\n`);
  } catch (err) {
    failures.push({ name, message: err.message });
    process.stdout.write(`  FAIL  ${name}\n        ${err.message}\n`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function section(title) {
  process.stdout.write(`\n${title}\n`);
}

/* ---------------------------------------------------------------- 1. files */

section('1. Every expected file exists and parses');

check('all expected jsonl files are present', () => {
  for (const rel of Object.keys(EXPECTED_FILES)) {
    assert(existsSync(join(HERE, rel)), `missing ${rel}`);
  }
});

check('every jsonl file parses line by line', () => {
  for (const file of corpusFiles(HERE)) {
    const posts = loadFile(file, HERE);
    assert(posts.length > 0, `${basename(file)} parsed to zero posts`);
  }
});

const corpus = loadCorpus({ root: HERE, reload: true });

check('per-file minimum post counts are met', () => {
  const counts = new Map();
  for (const post of corpus.posts) {
    counts.set(post._file, (counts.get(post._file) ?? 0) + 1);
  }
  for (const [rel, min] of Object.entries(EXPECTED_FILES)) {
    const got = counts.get(rel) ?? 0;
    assert(got >= min, `${rel} has ${got} posts, minimum is ${min}`);
  }
});

/* ------------------------------------------------------------------ 2. ids */

section('2. Ids are unique and well formed');

check('all ids are unique across every file', () => {
  const seen = new Map();
  for (const post of corpus.posts) {
    const previous = seen.get(post.id);
    assert(!previous, `duplicate id "${post.id}" in ${previous} and ${post._file}`);
    seen.set(post.id, post._file);
  }
});

check('all ids are kebab-case', () => {
  for (const post of corpus.posts) {
    assert(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.id), `id "${post.id}" in ${post._file} is not kebab-case`);
  }
});

/* --------------------------------------------------------------- 3. schema */

section('3. Every post carries exactly the required fields');

check('no post is missing a required field', () => {
  for (const post of corpus.posts) {
    for (const field of REQUIRED_FIELDS) {
      assert(Object.prototype.hasOwnProperty.call(post, field), `${post.id} is missing "${field}"`);
    }
  }
});

check('no post carries an unexpected extra field', () => {
  const allowed = new Set(REQUIRED_FIELDS);
  for (const post of corpus.posts) {
    for (const field of Object.keys(post)) {
      assert(allowed.has(field), `${post.id} carries unexpected field "${field}"`);
    }
  }
});

check('array fields are non-empty arrays of strings', () => {
  for (const post of corpus.posts) {
    for (const field of ARRAY_FIELDS) {
      const value = post[field];
      assert(Array.isArray(value), `${post.id}.${field} is not an array`);
      assert(value.length > 0, `${post.id}.${field} is empty`);
      for (const entry of value) {
        assert(typeof entry === 'string' && entry.trim().length > 0, `${post.id}.${field} holds a non-string or empty entry`);
      }
    }
  }
});

check('text fields are non-empty strings', () => {
  const textFields = ['userJob', 'problem', 'worksWhen', 'avoidWhen', 'mechanism', 'genericnessNote', 'source'];
  for (const post of corpus.posts) {
    for (const field of textFields) {
      assert(typeof post[field] === 'string' && post[field].trim().length > 0, `${post.id}.${field} is empty or not a string`);
    }
  }
});

check('surface, genericnessRisk and confidence hold legal values', () => {
  for (const post of corpus.posts) {
    assert(ALLOWED_SURFACES.includes(post.surface), `${post.id} has surface "${post.surface}"`);
    assert(ALLOWED_GENERICNESS.includes(post.genericnessRisk), `${post.id} has genericnessRisk "${post.genericnessRisk}"`);
    assert(typeof post.confidence === 'number', `${post.id}.confidence is not a number`);
    assert(post.confidence > 0 && post.confidence <= 1, `${post.id}.confidence ${post.confidence} is outside 0 to 1`);
  }
});

/* -------------------------------------------------------------- 4. licence */

section('4. Licence and provenance hold');

check('every licence value is on the allow list', () => {
  for (const post of corpus.posts) {
    assert(ALLOWED_LICENCES.includes(post.licence), `${post.id} has licence "${post.licence}"`);
  }
});

check('every provenance value is legal', () => {
  for (const post of corpus.posts) {
    assert(ALLOWED_PROVENANCE.includes(post.provenance), `${post.id} has provenance "${post.provenance}"`);
  }
});

check('verbatim posts only quote the four redistributable sources', () => {
  for (const post of corpus.posts) {
    if (post.provenance !== 'verbatim') continue;
    assert(
      VERBATIM_LICENCES.includes(post.licence),
      `${post.id} is verbatim under "${post.licence}", which may not be quoted word for word`,
    );
  }
});

check('verbatim posts name a source file with line numbers', () => {
  for (const post of corpus.posts) {
    if (post.provenance !== 'verbatim') continue;
    assert(
      /\.md:\d+(-\d+)?(,\d+(-\d+)?)*/.test(post.source),
      `${post.id} is verbatim but its source "${post.source}" has no file:line reference`,
    );
  }
});

check('verbatim sources point at files that exist in this repo', () => {
  for (const post of corpus.posts) {
    if (post.provenance !== 'verbatim') continue;
    for (const ref of post.source.split(';')) {
      const path = ref.trim().split(':')[0];
      if (!path) continue;
      const abs = join(REPO_ROOT, path);
      assert(existsSync(abs) && statSync(abs).isFile(), `${post.id} cites "${path}", which is not a file in this repo`);
    }
  }
});

check('verbatim mechanisms appear word for word at the cited lines', () => {
  // Markdown emphasis markers and whitespace are normalised away on both
  // sides, which is exactly the licence the provenance note claims. Anything
  // else, a swapped character or a spliced sentence, fails here.
  const norm = (s) => s.replace(/[*`_]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  for (const post of corpus.posts) {
    if (post.provenance !== 'verbatim') continue;
    let found = false;
    for (const ref of post.source.split(';').map((s) => s.trim())) {
      const [file, range] = ref.split(':');
      if (!range) continue;
      const lines = readFileSync(join(REPO_ROOT, file), 'utf8').split(/\r?\n/);
      for (const part of range.split(',')) {
        const [from, to] = part.split('-').map(Number);
        const segment = norm(lines.slice(from - 1, to || from).join(' '));
        if (segment.includes(norm(post.mechanism))) found = true;
      }
    }
    assert(found, `${post.id} claims to quote ${post.source} verbatim, but the text is not there`);
  }
});

check('original posts do not claim an upstream licence', () => {
  for (const post of corpus.posts) {
    if (post.provenance !== 'original') continue;
    assert(post.licence === 'MIT (sitesmith)', `${post.id} is original but claims "${post.licence}"`);
    assert(post.source === 'original', `${post.id} is original but cites "${post.source}"`);
  }
});

check('no post carries a long dash in any visible text', () => {
  for (const post of corpus.posts) {
    const text = JSON.stringify(post);
    assert(!text.includes('—'), `${post.id} contains an em dash`);
    assert(!text.includes('–'), `${post.id} contains an en dash`);
  }
});

/* ------------------------------------------------------------ 5. retrieval */

section('5. Retrieval behaves');

check('tokenize drops stopwords and unifies price with pricing', () => {
  const a = tokenize('the pricing of it');
  const b = tokenize('a price');
  assert(!a.includes('the'), 'stopword survived tokenisation');
  assert(a[0] === b[0], `"pricing" stemmed to "${a[0]}" and "price" to "${b[0]}"`);
});

check('a relevant brief returns at most three results', () => {
  const out = search({
    brief: 'product page where the buyer must see the price and the delivery terms before committing',
    surface: 'buy',
    root: HERE,
  });
  assert(!out.noGoodMatch, `expected results, got: ${out.message}`);
  assert(out.results.length <= MAX_RESULTS, `returned ${out.results.length} results`);
  assert(out.results.length > 0, 'returned zero results');
});

check('limit above three is still capped at three', () => {
  const out = search({ brief: 'accessibility contrast focus keyboard touch target form label', limit: 25, root: HERE });
  assert(out.query.limit === MAX_RESULTS, `limit was reported as ${out.query.limit}`);
  assert(out.results.length <= MAX_RESULTS, `returned ${out.results.length} results`);
});

check('every result explains which terms matched which field', () => {
  const out = search({ brief: 'the hero first screen needs an object rather than a headline on a flat ground', root: HERE });
  assert(out.results.length > 0, 'expected results');
  for (const r of out.results) {
    assert(Array.isArray(r.why) && r.why.length > 0, `${r.id} has no why entries`);
    for (const w of r.why) {
      assert(typeof w.term === 'string' && w.term.length > 0, `${r.id} why entry has no term`);
      assert(typeof w.field === 'string' && w.field.length > 0, `${r.id} why entry has no field`);
      assert(w.explanation.includes(w.term) && w.explanation.includes(w.field), `${r.id} explanation does not name term and field`);
    }
  }
});

check('every result carries risks and a related anti-pattern list', () => {
  const out = search({ brief: 'feature section with three cards showing what the product does', root: HERE });
  assert(out.results.length > 0, 'expected results');
  for (const r of out.results) {
    assert(Array.isArray(r.risks) && r.risks.length > 0, `${r.id} carries no risks`);
    assert(Array.isArray(r.relatedAntiPatterns), `${r.id} carries no relatedAntiPatterns array`);
  }
});

check('the hard rule is printed with every result and in the text output', () => {
  const out = search({ brief: 'dashboard for a dispatcher watching a shift of deliveries', surface: 'operate', root: HERE });
  assert(out.hardRule === HARD_RULE, 'top level hardRule missing');
  assert(out.results.length > 0, 'expected results');
  for (const r of out.results) {
    assert(r.hardRule === HARD_RULE, `${r.id} does not carry the hard rule`);
  }
});

check('an unrelated brief reports no good match instead of the least bad post', () => {
  const out = search({ brief: 'sourdough starter hydration ratio rye flour overnight bulk ferment', root: HERE });
  assert(out.noGoodMatch === true, `expected no good match, got ${out.results.length} results`);
  assert(out.results.length === 0, 'results were returned despite noGoodMatch');
  assert(/no good match/i.test(out.message), `message did not report no good match: ${out.message}`);
});

check('an empty brief reports no good match', () => {
  const out = search({ brief: '   ', root: HERE });
  assert(out.noGoodMatch === true, 'empty brief returned results');
});

check('the surface filter is hard', () => {
  const out = search({ brief: 'price buyer commit delivery stock control listing', surface: 'operate', root: HERE });
  for (const r of out.results) {
    assert(r.surface === 'operate' || r.surface === 'any', `${r.id} has surface "${r.surface}" under an operate filter`);
  }
});

check('the stack filter is hard', () => {
  const out = search({ brief: 'where do design tokens live and how are fonts loaded', stack: 'astro', root: HERE });
  assert(out.results.length > 0, 'expected results');
  for (const r of out.results) {
    assert(r.stack === 'astro' || r.stack === 'any', `${r.id} has stack "${r.stack}" under an astro filter`);
  }
});

check('an unknown stack filters everything out and says so', () => {
  const out = search({ brief: 'tokens and fonts', stack: 'coldfusion', root: HERE });
  const stacks = new Set(out.results.map((r) => r.stack));
  assert(![...stacks].some((s) => s !== 'any'), 'a stack-specific post survived an unknown stack filter');
});

check('scores are ordered and never exceed one', () => {
  const out = search({ brief: 'contrast ratio for body text in dark mode', root: HERE });
  assert(out.results.length > 0, 'expected results');
  let previous = Infinity;
  for (const r of out.results) {
    assert(r.score <= 1.0001, `${r.id} scored ${r.score}`);
    assert(r.score >= NO_MATCH_THRESHOLD, `${r.id} scored ${r.score}, below the threshold`);
    assert(r.score <= previous, 'results are not ordered by score');
    previous = r.score;
  }
});

/* ----------------------------------------------------------------- summary */

const total = passed + failures.length;
process.stdout.write(`\n${passed}/${total} checks passed.\n`);

if (failures.length > 0) {
  process.stdout.write('\nFailures:\n');
  for (const f of failures) process.stdout.write(`  - ${f.name}: ${f.message}\n`);
  process.exit(1);
}

process.stdout.write(`\nHARD RULE: ${HARD_RULE}\n`);
process.exit(0);
