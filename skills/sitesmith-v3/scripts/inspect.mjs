#!/usr/bin/env node
/**
 * sitesmith inspect: reads a site that already exists and writes down what is there.
 *
 *   node inspect.mjs <url-or-directory> [--out DIR] [--routes /a,/b,/c]
 *
 * The shared ground floor under audit and redesign. redesign.md says the read comes
 * before the repair and that nobody should have to guess a value afterwards; this is the
 * pass that produces those values. It registers the stack and the routes, renders every
 * route at 375, 768 and 1440, maps the visible components and which of the six states
 * each control actually has, pulls the design tokens out of computed styles rather than
 * out of a stylesheet, inventories the brand assets, names what has to survive a
 * redesign, and leaves a hashed baseline so a later build can be compared against this
 * one instead of against a memory of it.
 *
 * It reports. It does not refuse. No verdict here blocks anything, and per
 * docs/GATE-POLICY.md nothing in this file may grow into a hard gate: every number below
 * is a signal, printed with its measurement and dispositioned by a person.
 *
 * Fail-closed, in the sense the rest of the package uses: a check that could not run is
 * listed under notMeasured with its reason and is never reported as a zero. A route whose
 * navigation failed produces no route record at all rather than an empty one, because an
 * empty record reads as "inspected, nothing there".
 *
 * Exit 0  the inspection ran and the artefacts were written
 * Exit 2  nothing could be inspected: bad arguments, missing dependency, unreachable
 *         target, no route rendered. The artefacts are still written, carrying the
 *         reasons, because "could not run" is the finding in that case.
 *
 * There is deliberately no exit 1. Exit 1 is the package's refusal code and this script
 * has nothing to refuse.
 *
 * Requires: playwright (@axe-core/playwright optional, its absence is reported).
 * Resolution order for those: bare import, then SITESMITH_DEPS_DIR, then the working
 * directory, which is the pattern verify.mjs and test-verify.mjs already use.
 *
 * MIT, part of https://github.com/byensitmagnus/sitesmith
 */

import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename, dirname, extname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ *
 * Numbers. Every one of them is quoted here so a reader can see it and
 * argue with it, instead of finding it inline three hundred lines down.
 * ------------------------------------------------------------------ */

/** Fixed by the brief, and by SKILL.md section 8, which uses the same three. */
const WIDTHS = [375, 768, 1440];
/** The width the structural passes are taken at, named in every record they produce. */
const STRUCTURE_WIDTH = 1440;
/** The width the accessibility scan runs at. The narrowest viewport is the strictest. */
const AXE_WIDTH = 375;
/** Routes inspected in one run. Above this the list is truncated and the truncation is printed. */
const MAX_ROUTES = 8;
/** Controls carried through the state pass. */
const MAX_STATE_CONTROLS = 40;
/** Controls the pointer is actually driven onto. Hover is slow; declaration evidence is not. */
const MAX_HOVER_CONTROLS = 12;
/** Elements read per computed-style sweep, to keep a large page from stalling the run. */
const MAX_ELEMENTS = 4000;
/** The six states this package tracks, in the order they are reported. */
const SIX_STATES = ['rest', 'hover', 'focus-visible', 'active', 'disabled', 'loading'];
/** A colour is a candidate for preservation at or above both of these. Neither alone is enough:
    a share test alone promotes a one-off on a nearly empty page, a count test alone promotes
    a border colour on a page with ten thousand elements. */
const PRESERVE_COLOUR_MIN_COUNT = 3;
const PRESERVE_COLOUR_MIN_SHARE = 0.01;
/** Settle time after navigation, the same one verify.mjs uses, so the two agree on "loaded". */
const SETTLE_MS = 600;

const USAGE = 'usage: node inspect.mjs <url-or-directory> [--out DIR] [--routes /a,/b,/c]';

/* ------------------------------------------------------------------ *
 * Dependency resolution
 * ------------------------------------------------------------------ */

const depsRoots = [];
if (process.env.SITESMITH_DEPS_DIR) depsRoots.push(resolve(process.env.SITESMITH_DEPS_DIR));
depsRoots.push(process.cwd());

async function load(name) {
  try {
    return await import(name);
  } catch {
    /* fall through to the explicit roots */
  }
  for (const root of depsRoots) {
    try {
      const req = createRequire(join(root, 'package.json'));
      return await import(pathToFileURL(req.resolve(name)).href);
    } catch {
      /* try the next root */
    }
  }
  throw new Error(`cannot resolve ${name} from ${depsRoots.join(', ')}`);
}

/* ------------------------------------------------------------------ *
 * Arguments
 * ------------------------------------------------------------------ */

const argv = process.argv.slice(2);
const VALUE_FLAGS = new Set(['out', 'routes']);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

let target;
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    if (VALUE_FLAGS.has(argv[i].slice(2))) i++;
    continue;
  }
  target = argv[i];
  break;
}
if (!target) {
  console.error(USAGE);
  process.exit(2);
}
const outDir = resolve(flag('out', '.sitesmith/inspect'));
const baselineDir = join(outDir, 'baseline');
const routesArg = flag('routes', null);
if (routesArg !== undefined && routesArg !== null && !String(routesArg).trim()) {
  console.error(`--routes was given with no value\n${USAGE}`);
  process.exit(2);
}

/* ------------------------------------------------------------------ *
 * The report. Written whatever happens, including when nothing ran.
 * ------------------------------------------------------------------ */

const report = {
  target,
  kind: null,
  generatedAt: new Date().toISOString(),
  widths: WIDTHS,
  measuredAt: { structure: STRUCTURE_WIDTH, accessibility: AXE_WIDTH, tokens: 'every width, merged' },
  stack: null,
  routeDiscovery: null,
  routes: [],
  preserve: null,
  baseline: { dir: 'baseline', manifest: 'baseline/manifest.json', images: [] },
  findings: [],
  // Every check that could not run, with the reason. Empty is the only clean value.
  notMeasured: [],
};

const withhold = (check, reason) => report.notMeasured.push({ check, reason: String(reason).split('\n')[0].slice(0, 200) });

async function writeArtefacts() {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'inspection.json'), JSON.stringify(report, null, 2));
  await writeFile(join(outDir, 'AUDIT.md'), renderAudit());
}

async function die(message, detail = []) {
  console.error(`inspect.mjs: ${message}`);
  for (const line of detail) console.error(`  ${line}`);
  withhold('the inspection as a whole', message);
  try {
    await writeArtefacts();
    console.error(`  what is known was still written to ${outDir}`);
  } catch {
    /* the artefact write is best effort once we are already failing */
  }
  process.exit(2);
}

/* ------------------------------------------------------------------ *
 * Target: a URL, or a directory this script serves itself
 * ------------------------------------------------------------------ */

let baseUrl = null;
let server = null;
let serverRoot = null;
let entryRoute = '/';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

/** A read-only static server rooted at the project, so a folder of HTML can be rendered
    without asking the operator to start one. It never leaves the root. */
async function serveDirectory(root) {
  const s = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = join(root, path);
      if (path.endsWith('/')) file = join(file, 'index.html');
      if (!normalize(file).startsWith(root + sep) && normalize(file) !== root) {
        res.writeHead(403).end('outside the served directory');
        return;
      }
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end('<!doctype html><title>404</title>not found');
    }
  });
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  return s;
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '.astro', '.svelte-kit', 'dist', 'build', 'out', 'coverage', '.sitesmith', 'vendor']);

async function htmlFilesUnder(root, maxDepth = 4, cap = 60) {
  const found = [];
  async function walk(dir, depth) {
    if (depth > maxDepth || found.length >= cap) return;
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (found.length >= cap) return;
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
        await walk(join(dir, e.name), depth + 1);
      } else if (e.isFile() && /\.html?$/i.test(e.name)) {
        found.push(join(dir, e.name));
      }
    }
  }
  await walk(root, 0);
  return found;
}

if (/^https?:\/\//i.test(target)) {
  report.kind = 'url';
  try {
    baseUrl = new URL(target);
  } catch {
    await die(`not a valid URL: ${target}`, [USAGE]);
  }
  entryRoute = canonicalRoute(baseUrl.pathname);
  report.stack = {
    detected: null,
    reason: 'the target is a URL, and stack.mjs reads files on disk. Point inspect at the project directory to name a stack.',
  };
} else {
  report.kind = 'directory';
  const dir = resolve(target);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    await die(`not a directory and not an http(s) URL: ${target}`, [USAGE]);
  }
  serverRoot = dir;

  // Stack detection is stack.mjs's job and stays there. It refuses on purpose when the
  // disk does not answer, and a refusal is a finding here, not a failure: inspect still
  // renders whatever HTML is present.
  const stackScript = join(HERE, 'stack.mjs');
  if (!existsSync(stackScript)) {
    withhold('stack detection', `stack.mjs is missing from ${HERE}`);
    report.stack = { detected: null, reason: 'stack.mjs is missing from this package' };
  } else {
    const r = spawnSync(process.execPath, [stackScript, 'detect', dir, '--json'], { encoding: 'utf8' });
    if (r.status === 0) {
      try {
        const parsed = JSON.parse(r.stdout);
        report.stack = { detected: parsed.stack, adapter: parsed.adapter, evidence: parsed.evidence };
      } catch (e) {
        withhold('stack detection', `stack.mjs exited 0 with output this script could not parse: ${e.message}`);
        report.stack = { detected: null, reason: 'stack.mjs output was unreadable' };
      }
    } else if (r.status === 1) {
      report.stack = {
        detected: null,
        reason: 'stack.mjs named no adapter',
        stackOutput: (r.stderr || '').trim().split('\n').slice(0, 6),
      };
    } else {
      withhold('stack detection', `stack.mjs exited ${r.status}: ${(r.stderr || '').trim().split('\n')[0]}`);
      report.stack = { detected: null, reason: `stack.mjs could not run (exit ${r.status})` };
    }
  }

  const htmlFiles = await htmlFilesUnder(dir);
  if (!htmlFiles.length) {
    await die(`no HTML to render under ${dir}`, [
      'inspect renders pages. A project that builds its HTML has to be built and served first,',
      'then pointed at by URL: node inspect.mjs http://localhost:3000/',
    ]);
  }
  try {
    server = await serveDirectory(dir);
  } catch (e) {
    await die(`could not start a local server for ${dir}: ${String(e).split('\n')[0]}`);
  }
  baseUrl = new URL(`http://127.0.0.1:${server.address().port}/`);
  const rootIndex = htmlFiles.find((f) => dirname(f) === dir && /^index\.html?$/i.test(basename(f)));
  entryRoute = rootIndex ? '/' : routeForFile(dir, htmlFiles[0]);
  report.servedFrom = dir;
  report.diskHtmlFiles = htmlFiles.map((f) => relative(dir, f).split(sep).join('/'));
}

function routeForFile(root, file) {
  const rel = relative(root, file).split(sep).join('/');
  return canonicalRoute('/' + rel);
}

/** `/a/index.html` and `/a/` are one route. Without this the entry page is inspected twice
    under two names and every count in the report is off by one page. */
function canonicalRoute(pathname) {
  let p = pathname || '/';
  if (!p.startsWith('/')) p = '/' + p;
  p = p.replace(/\/index\.html?$/i, '/');
  return p;
}

const slugsTaken = new Map();
function slugFor(routePath) {
  let s = routePath
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  if (!s) s = 'index';
  const n = slugsTaken.get(s) ?? 0;
  slugsTaken.set(s, n + 1);
  return n === 0 ? s : `${s}-${n + 1}`;
}

/* ------------------------------------------------------------------ *
 * Browser
 * ------------------------------------------------------------------ */

let chromium, AxeBuilder;
try {
  const pw = await load('playwright');
  chromium = pw.chromium ?? pw.default?.chromium;
  if (!chromium) throw new Error('playwright loaded but exposes no chromium export');
} catch (e) {
  server?.close();
  await die('playwright is not installed where this runs.', [
    'npm i -D playwright && npx playwright install chromium',
    'or set SITESMITH_DEPS_DIR to the directory that has it',
    String(e).split('\n')[0],
  ]);
}
try {
  const ax = await load('@axe-core/playwright');
  AxeBuilder = ax.default?.default ?? ax.default ?? ax.AxeBuilder;
} catch {
  withhold('accessibility scan', '@axe-core/playwright is not installed where this runs');
}

await mkdir(baselineDir, { recursive: true });

/* ------------------------------------------------------------------ *
 * Page probes, the same bundle verify.mjs installs. Defining these twice
 * with two definitions of "a control" is how two reports about the same
 * page start disagreeing.
 * ------------------------------------------------------------------ */

async function installProbes(page) {
  await page.evaluate(() => {
    const INTERACTIVE =
      'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

    const visible = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };

    const sel = (el) => {
      if (el.id) return `#${el.id}`;
      const parts = [];
      let n = el;
      for (let i = 0; n && n.nodeType === 1 && i < 3; i++) {
        let s = n.tagName.toLowerCase();
        if (n.classList.length) s += '.' + [...n.classList].slice(0, 2).join('.');
        parts.unshift(s);
        n = n.parentElement;
      }
      return parts.join(' > ');
    };

    const nameOf = (el) => {
      const by = el.getAttribute('aria-labelledby');
      if (by) {
        const t = by
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent || '')
          .join(' ')
          .trim();
        if (t) return t;
      }
      const aria = el.getAttribute('aria-label');
      if (aria && aria.trim()) return aria.trim();
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
        if (el.id) {
          const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          if (l && l.textContent.trim()) return l.textContent.trim();
        }
        const wrap = el.closest('label');
        if (wrap && wrap.textContent.trim()) return wrap.textContent.trim();
        if (el.value && ['submit', 'button', 'reset'].includes(el.type)) return String(el.value).trim();
      }
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt) return txt;
      const img = el.querySelector('img[alt]');
      if (img && img.alt.trim()) return img.alt.trim();
      const title = el.getAttribute('title');
      if (title && title.trim()) return title.trim();
      return '';
    };

    window.__ss = { INTERACTIVE, visible, sel, nameOf };
  });
}

/* ------------------------------------------------------------------ *
 * 3. Components and the first screen, per viewport
 * ------------------------------------------------------------------ */

async function collectComponents(page) {
  return page.evaluate(
    ({ MAX_ELEMENTS }) => {
      const { INTERACTIVE, visible, sel, nameOf } = window.__ss;
      const text = (el, n = 60) => (el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, n);
      const vh = window.innerHeight;
      const inFirstScreen = (el) => {
        const r = el.getBoundingClientRect();
        return r.top < vh && r.bottom > 0 && r.width > 0 && r.height > 0;
      };

      const navs = [...document.querySelectorAll('nav, [role="navigation"]')].map((n) => {
        const links = [...n.querySelectorAll('a[href]')].filter(visible);
        return {
          selector: sel(n),
          visible: visible(n),
          linkCount: links.length,
          links: links.slice(0, 16).map((a) => ({ text: text(a, 40), href: a.getAttribute('href') })),
        };
      });
      // A header full of links and no nav element is still the navigation, and a redesign
      // that only looked for <nav> would delete it.
      const headerLinks = [...document.querySelectorAll('header a[href]')].filter(visible);
      const headerAsNav =
        navs.length === 0 && headerLinks.length >= 2
          ? { selector: sel(headerLinks[0].closest('header')), linkCount: headerLinks.length, note: 'no nav element; links live directly in header' }
          : null;

      const controls = [...document.querySelectorAll(INTERACTIVE)].filter(visible);
      const firstScreenControls = controls.filter(inFirstScreen);
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible);
      const firstScreenHeadings = headings.filter(inFirstScreen);
      const media = [...document.querySelectorAll('img, video, svg, picture, canvas')].filter(visible);

      const firstScreen = {
        viewportHeightPx: vh,
        headings: firstScreenHeadings.slice(0, 6).map((h) => ({
          level: Number(h.tagName.slice(1)),
          text: text(h, 80),
          fontSizePx: Math.round(parseFloat(getComputedStyle(h).fontSize)),
          selector: sel(h),
        })),
        controls: firstScreenControls.slice(0, 12).map((el) => ({
          tag: el.tagName.toLowerCase(),
          name: nameOf(el).slice(0, 50),
          href: el.getAttribute('href'),
          selector: sel(el),
        })),
        controlCount: firstScreenControls.length,
        mediaCount: media.filter(inFirstScreen).length,
        largestTextPx: firstScreenHeadings.length
          ? Math.max(...firstScreenHeadings.map((h) => Math.round(parseFloat(getComputedStyle(h).fontSize))))
          : null,
      };

      const forms = [...document.querySelectorAll('form')].map((f) => {
        const fields = [...f.querySelectorAll('input:not([type="hidden"]), select, textarea')];
        return {
          selector: sel(f),
          visible: visible(f),
          action: f.getAttribute('action'),
          method: (f.getAttribute('method') || 'get').toLowerCase(),
          fieldCount: fields.length,
          hiddenFieldCount: f.querySelectorAll('input[type="hidden"]').length,
          fields: fields.slice(0, 24).map((i) => ({
            name: i.getAttribute('name'),
            type: i.tagName === 'INPUT' ? i.type : i.tagName.toLowerCase(),
            required: i.hasAttribute('required') || i.getAttribute('aria-required') === 'true',
            label: nameOf(i).slice(0, 60),
            labelled: Boolean(nameOf(i)),
            placeholderOnly: !nameOf(i) && Boolean(i.getAttribute('placeholder')),
            selector: sel(i),
          })),
          submits: [...f.querySelectorAll('button, input[type="submit"]')].slice(0, 6).map((b) => ({
            selector: sel(b),
            name: nameOf(b).slice(0, 50),
            disabled: b.disabled === true,
          })),
        };
      });
      const orphanInputs = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')].filter(
        (i) => !i.closest('form'),
      );

      const tables = [...document.querySelectorAll('table, [role="table"]')].map((t) => {
        const headRow = t.querySelector('thead tr') || t.querySelector('tr');
        return {
          selector: sel(t),
          visible: visible(t),
          caption: t.querySelector('caption') ? text(t.querySelector('caption'), 80) : null,
          columns: headRow ? headRow.children.length : 0,
          rows: t.querySelectorAll('tbody tr').length || Math.max(0, t.querySelectorAll('tr').length - 1),
          headerCells: t.querySelectorAll('th').length,
          scopedHeaders: t.querySelectorAll('th[scope]').length,
        };
      });

      // Cards and panels: two or more siblings that share a shape and carry a heading or a
      // link. Repetition plus a box is what makes something a card; either alone is not.
      const cardGroups = [];
      const seenKeys = new Set();
      for (const parent of [...document.querySelectorAll('*')].slice(0, MAX_ELEMENTS)) {
        const kids = [...parent.children].filter(visible);
        if (kids.length < 2) continue;
        const keyOf = (el) => el.tagName + '.' + [...el.classList].slice(0, 2).join('.');
        const key = keyOf(kids[0]);
        const same = kids.filter((k) => keyOf(k) === key);
        if (same.length < 2) continue;
        const cs = getComputedStyle(same[0]);
        const boxed =
          cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
          parseFloat(cs.borderTopWidth) > 0 ||
          cs.boxShadow !== 'none' ||
          cs.borderTopLeftRadius !== '0px';
        if (!boxed) continue;
        if (!same[0].querySelector('h1,h2,h3,h4,h5,h6,a[href],button')) continue;
        const groupKey = sel(parent) + '>' + key;
        if (seenKeys.has(groupKey)) continue;
        seenKeys.add(groupKey);
        cardGroups.push({
          container: sel(parent),
          member: key.toLowerCase(),
          count: same.length,
          example: sel(same[0]),
          radius: cs.borderTopLeftRadius,
          shadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 80),
        });
        if (cardGroups.length >= 12) break;
      }

      const footers = [...document.querySelectorAll('footer, [role="contentinfo"]')].map((f) => ({
        selector: sel(f),
        visible: visible(f),
        linkCount: [...f.querySelectorAll('a[href]')].filter(visible).length,
        textLength: (f.textContent || '').trim().length,
      }));

      const imgs = [...document.querySelectorAll('img')];
      const doc = {
        title: document.title,
        lang: document.documentElement.getAttribute('lang'),
        metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content')?.slice(0, 200) ?? null,
        h1Count: document.querySelectorAll('h1').length,
        headingOutline: headings.slice(0, 24).map((h) => ({ level: Number(h.tagName.slice(1)), text: text(h, 60) })),
        landmarks: {
          main: document.querySelectorAll('main, [role="main"]').length,
          nav: navs.length,
          footer: footers.length,
          header: document.querySelectorAll('header, [role="banner"]').length,
        },
        controlCount: controls.length,
        namelessControls: controls.filter((el) => !nameOf(el)).slice(0, 12).map((el) => ({ selector: sel(el), tag: el.tagName.toLowerCase() })),
        imagesWithoutAlt: imgs.filter((i) => !i.hasAttribute('alt')).slice(0, 12).map((i) => ({ src: (i.currentSrc || i.src || '').slice(0, 160), selector: sel(i) })),
        imageCount: imgs.length,
        linkCount: document.querySelectorAll('a[href]').length,
        outboundLinkCount: [...document.querySelectorAll('a[href]')].filter((a) => {
          try {
            return new URL(a.href, location.href).origin !== location.origin;
          } catch {
            return false;
          }
        }).length,
      };

      return { document: doc, navigation: navs, headerAsNav, firstScreen, forms, orphanInputCount: orphanInputs.length, tables, cardGroups, footers };
    },
    { MAX_ELEMENTS },
  );
}

/* ------------------------------------------------------------------ *
 * 4. Design tokens, read off the rendered page
 * ------------------------------------------------------------------ */

async function collectTokens(page) {
  return page.evaluate(
    ({ MAX_ELEMENTS }) => {
      const { visible, sel } = window.__ss;
      const els = [...document.querySelectorAll('*')].slice(0, MAX_ELEMENTS).filter(visible);

      const tallies = new Map();
      const bump = (bucket, value, example, role) => {
        if (value === null || value === undefined || value === '') return;
        const key = bucket + ' ' + value;
        let rec = tallies.get(key);
        if (!rec) {
          rec = { bucket, value: String(value), count: 0, example, roles: [] };
          tallies.set(key, rec);
        }
        rec.count++;
        if (role && !rec.roles.includes(role)) rec.roles.push(role);
      };

      const TRANSPARENT = /^rgba\(0,\s*0,\s*0,\s*0\)$/;
      let colourObservations = 0;

      for (const el of els) {
        const cs = getComputedStyle(el);
        const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

        if (hasOwnText && cs.color && !TRANSPARENT.test(cs.color)) {
          bump('colour', cs.color, sel(el), 'text');
          colourObservations++;
        }
        if (cs.backgroundColor && !TRANSPARENT.test(cs.backgroundColor)) {
          bump('colour', cs.backgroundColor, sel(el), 'background');
          colourObservations++;
        }
        for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
          if (parseFloat(cs[`border${side}Width`]) > 0 && !TRANSPARENT.test(cs[`border${side}Color`])) {
            bump('colour', cs[`border${side}Color`], sel(el), 'border');
            colourObservations++;
            break;
          }
        }
        if (el instanceof SVGElement) {
          if (cs.fill && cs.fill !== 'none' && !TRANSPARENT.test(cs.fill)) {
            bump('colour', cs.fill, sel(el), 'svg-fill');
            colourObservations++;
          }
          if (cs.stroke && cs.stroke !== 'none' && !TRANSPARENT.test(cs.stroke)) {
            bump('colour', cs.stroke, sel(el), 'svg-stroke');
            colourObservations++;
          }
        }

        if (hasOwnText) {
          bump('family', cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), sel(el));
          bump('size', `${Math.round(parseFloat(cs.fontSize))}px`, sel(el));
          bump('weight', cs.fontWeight, sel(el));
          const fs = parseFloat(cs.fontSize) || 16;
          const lh = parseFloat(cs.lineHeight);
          bump('lineHeight', Number.isFinite(lh) ? String(Number((lh / fs).toFixed(2))) : cs.lineHeight, sel(el));
          if (cs.letterSpacing && cs.letterSpacing !== 'normal') {
            bump('letterSpacing', `${Number((parseFloat(cs.letterSpacing) / fs).toFixed(3))}em`, sel(el));
          }
        }

        /* Padding, gaps and block-axis margins only. getComputedStyle resolves `auto` to the
           used value, so `margin: 0 auto` on a centred container reports as two invented
           spacing tokens the stylesheet never contained: the first run of this script put
           344.375px in the vocabulary of a page whose largest real gap is 40px. Inline-axis
           margins are a centring technique, not a spacing scale. */
        for (const p of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'rowGap', 'columnGap']) {
          const v = cs[p];
          if (!v || v === '0px' || v === 'normal' || v === 'auto') continue;
          bump('spacing', v, sel(el));
        }

        const r = cs.borderTopLeftRadius;
        const boxed = !TRANSPARENT.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
        if (r && r !== '0px' && boxed) bump('radius', r, sel(el));
        if (cs.boxShadow && cs.boxShadow !== 'none') bump('shadow', cs.boxShadow.slice(0, 120), sel(el));
      }

      const bucketOf = (name) =>
        [...tallies.values()]
          .filter((t) => t.bucket === name)
          .sort((a, b) => b.count - a.count)
          .map(({ bucket, ...rest }) => rest);

      return {
        elementsMeasured: els.length,
        colourObservations,
        colours: bucketOf('colour').slice(0, 60),
        typography: {
          families: bucketOf('family').slice(0, 20),
          sizes: bucketOf('size').slice(0, 30),
          weights: bucketOf('weight').slice(0, 12),
          lineHeights: bucketOf('lineHeight').slice(0, 16),
          letterSpacings: bucketOf('letterSpacing').slice(0, 12),
        },
        spacing: bucketOf('spacing').slice(0, 40),
        radii: bucketOf('radius').slice(0, 16),
        shadows: bucketOf('shadow').slice(0, 16),
      };
    },
    { MAX_ELEMENTS },
  );
}

/* ------------------------------------------------------------------ *
 * 4b/6. What the stylesheets themselves declare: breakpoints, custom
 * properties, @font-face, and the selectors that name a state.
 * ------------------------------------------------------------------ */

async function collectCss(page) {
  return page.evaluate(() => {
    const breakpoints = new Map();
    const customProps = new Map();
    const fontFaces = [];
    const stateSelectors = { hover: [], 'focus-visible': [], active: [], disabled: [], loading: [] };
    const unreadable = [];
    let rulesRead = 0;
    let sheetsRead = 0;

    const STATE_PATTERNS = [
      ['hover', /:hover\b/],
      ['focus-visible', /:focus-visible\b|:focus\b/],
      ['active', /:active\b/],
      ['disabled', /:disabled\b|\[disabled\]|\[aria-disabled/],
      ['loading', /\[aria-busy|\[data-loading|\[data-state=["']?loading|\.is-loading\b|\.loading\b|\.busy\b/],
    ];

    const readRules = (rules, sheetHref) => {
      for (const rule of rules) {
        rulesRead++;
        if (rule.type === CSSRule.MEDIA_RULE || rule.constructor?.name === 'CSSMediaRule') {
          const cond = rule.conditionText || rule.media?.mediaText || '';
          const re = /\(\s*(min|max)-(width|height)\s*:\s*([\d.]+)(px|em|rem)\s*\)/g;
          let m;
          while ((m = re.exec(cond))) {
            const px = m[4] === 'px' ? Number(m[3]) : Number(m[3]) * 16;
            const key = `${m[1]}-${m[2]}:${m[3]}${m[4]}`;
            if (!breakpoints.has(key)) {
              breakpoints.set(key, { bound: m[1], axis: m[2], value: Number(m[3]), unit: m[4], px, condition: cond.slice(0, 120), sheet: sheetHref });
            }
          }
          if (rule.cssRules) readRules(rule.cssRules, sheetHref);
          continue;
        }
        if (rule.cssRules && !rule.selectorText) {
          readRules(rule.cssRules, sheetHref);
          continue;
        }
        if (rule.constructor?.name === 'CSSFontFaceRule') {
          fontFaces.push({
            family: (rule.style.getPropertyValue('font-family') || '').replace(/["']/g, '').trim(),
            weight: rule.style.getPropertyValue('font-weight') || 'normal',
            style: rule.style.getPropertyValue('font-style') || 'normal',
            src: (rule.style.getPropertyValue('src') || '').slice(0, 200),
            sheet: sheetHref,
          });
          continue;
        }
        if (!rule.selectorText || !rule.style) continue;

        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (!prop.startsWith('--')) continue;
          if (!customProps.has(prop)) {
            customProps.set(prop, {
              name: prop,
              declaredIn: rule.selectorText.slice(0, 80),
              declaredValue: rule.style.getPropertyValue(prop).trim().slice(0, 120),
              sheet: sheetHref,
            });
          }
        }

        for (const [state, re] of STATE_PATTERNS) {
          if (re.test(rule.selectorText)) {
            for (const part of rule.selectorText.split(',')) {
              const p = part.trim();
              if (re.test(p) && stateSelectors[state].length < 200 && !stateSelectors[state].includes(p)) stateSelectors[state].push(p);
            }
          }
        }
      }
    };

    for (const sheet of [...document.styleSheets]) {
      const href = sheet.href ? String(sheet.href).slice(0, 160) : 'inline <style>';
      let rules = null;
      try {
        rules = sheet.cssRules;
      } catch (e) {
        // A cross-origin sheet cannot be read by script. That is a measurement this pass
        // could not take, not a stylesheet with nothing in it.
        unreadable.push({ sheet: href, reason: 'cross-origin stylesheet, cssRules is not readable from script' });
        continue;
      }
      if (!rules) {
        unreadable.push({ sheet: href, reason: 'stylesheet exposes no cssRules' });
        continue;
      }
      sheetsRead++;
      try {
        readRules(rules, href);
      } catch (e) {
        unreadable.push({ sheet: href, reason: String(e).slice(0, 120) });
      }
    }

    const rootCs = getComputedStyle(document.documentElement);
    const customProperties = [...customProps.values()].map((c) => ({
      ...c,
      computedValue: rootCs.getPropertyValue(c.name).trim().slice(0, 120) || null,
    }));

    return {
      sheetsSeen: document.styleSheets.length,
      sheetsRead,
      rulesRead,
      breakpoints: [...breakpoints.values()].sort((a, b) => a.px - b.px),
      customProperties,
      fontFaces,
      stateSelectors,
      unreadableSheets: unreadable,
    };
  });
}

/* ------------------------------------------------------------------ *
 * 5. Brand assets
 * ------------------------------------------------------------------ */

async function collectAssets(page) {
  return page.evaluate(
    ({ MAX_ELEMENTS }) => {
      const { visible, sel } = window.__ss;
      const abs = (u) => {
        try {
          return new URL(u, location.href).href;
        } catch {
          return u;
        }
      };

      const images = [...document.querySelectorAll('img')].slice(0, 60).map((i) => {
        const r = i.getBoundingClientRect();
        return {
          src: abs(i.currentSrc || i.getAttribute('src') || '').slice(0, 200),
          declaredSrc: (i.getAttribute('src') || '').slice(0, 200),
          srcset: (i.getAttribute('srcset') || '').slice(0, 240) || null,
          sizes: (i.getAttribute('sizes') || '').slice(0, 120) || null,
          alt: i.hasAttribute('alt') ? i.getAttribute('alt').slice(0, 120) : null,
          loading: i.getAttribute('loading'),
          naturalWidth: i.naturalWidth || null,
          naturalHeight: i.naturalHeight || null,
          renderedWidth: Math.round(r.width),
          renderedHeight: Math.round(r.height),
          selector: sel(i),
        };
      });

      const backgroundImages = [];
      for (const el of [...document.querySelectorAll('*')].slice(0, MAX_ELEMENTS)) {
        const bg = getComputedStyle(el).backgroundImage;
        if (!bg || bg === 'none') continue;
        const urls = [...bg.matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => abs(m[2]).slice(0, 200));
        if (!urls.length) continue;
        backgroundImages.push({ selector: sel(el), urls });
        if (backgroundImages.length >= 30) break;
      }

      const videos = [...document.querySelectorAll('video')].slice(0, 12).map((v) => ({
        selector: sel(v),
        src: v.getAttribute('src') ? abs(v.getAttribute('src')).slice(0, 200) : null,
        poster: v.getAttribute('poster') ? abs(v.getAttribute('poster')).slice(0, 200) : null,
        sources: [...v.querySelectorAll('source')].map((s) => abs(s.getAttribute('src') || '').slice(0, 200)),
        autoplay: v.hasAttribute('autoplay'),
        loop: v.hasAttribute('loop'),
      }));

      const svgs = [...document.querySelectorAll('svg')].filter(visible).slice(0, 20).map((s) => {
        const r = s.getBoundingClientRect();
        return {
          selector: sel(s),
          viewBox: s.getAttribute('viewBox'),
          title: s.querySelector('title')?.textContent?.trim().slice(0, 60) ?? null,
          renderedWidth: Math.round(r.width),
          renderedHeight: Math.round(r.height),
        };
      });

      let loadedFonts = [];
      try {
        loadedFonts = [...document.fonts].slice(0, 40).map((f) => ({
          family: String(f.family).replace(/["']/g, ''),
          weight: String(f.weight),
          style: String(f.style),
          status: String(f.status),
        }));
      } catch {
        loadedFonts = [];
      }

      const favicons = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"]')].map((l) => ({
        rel: l.getAttribute('rel'),
        href: abs(l.getAttribute('href') || '').slice(0, 200),
        sizes: l.getAttribute('sizes'),
        type: l.getAttribute('type'),
      }));

      const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => abs(l.getAttribute('href') || '').slice(0, 200));

      /* The brand mark. Reported with what it matched on, because a heuristic that does not
         show its working is indistinguishable from a guess, and this one is a candidate for
         the preservation contract in redesign.md. */
      const MARK = /logo|brand|wordmark|\bmark\b|emblem|sigil/i;
      const scopes = [...document.querySelectorAll('header, nav, [role="banner"], [role="navigation"]')];
      let logo = null;
      const attrBlob = (el) =>
        [el.getAttribute('alt'), el.getAttribute('src'), el.getAttribute('class'), el.getAttribute('id'), el.getAttribute('aria-label'), el.querySelector('title')?.textContent]
          .filter(Boolean)
          .join(' ');
      for (const scope of scopes) {
        for (const el of scope.querySelectorAll('img, svg')) {
          if (!visible(el)) continue;
          const blob = attrBlob(el);
          if (!MARK.test(blob)) continue;
          const r = el.getBoundingClientRect();
          logo = {
            kind: el.tagName.toLowerCase(),
            selector: sel(el),
            src: el.tagName === 'IMG' ? abs(el.getAttribute('src') || '').slice(0, 200) : null,
            alt: el.getAttribute('alt') ?? el.querySelector('title')?.textContent?.trim() ?? null,
            renderedWidth: Math.round(r.width),
            renderedHeight: Math.round(r.height),
            matchedOn: 'alt, src, class, id or title contains logo, brand, wordmark, mark, emblem or sigil',
          };
          break;
        }
        if (logo) break;
      }
      if (!logo) {
        // Second reading: the first image or wordmark inside a link back to the site root.
        const home = [...document.querySelectorAll('header a[href], nav a[href]')].find((a) => {
          try {
            const u = new URL(a.href, location.href);
            return u.origin === location.origin && (u.pathname === '/' || /\/index\.html?$/i.test(u.pathname));
          } catch {
            return false;
          }
        });
        if (home) {
          const img = home.querySelector('img, svg');
          const r = (img || home).getBoundingClientRect();
          logo = {
            kind: img ? img.tagName.toLowerCase() : 'text',
            selector: sel(img || home),
            src: img && img.tagName === 'IMG' ? abs(img.getAttribute('src') || '').slice(0, 200) : null,
            alt: img?.getAttribute?.('alt') ?? (home.textContent || '').trim().slice(0, 60),
            renderedWidth: Math.round(r.width),
            renderedHeight: Math.round(r.height),
            matchedOn: 'first image or wordmark inside a header or nav link to the site root',
          };
        }
      }

      return { logo, images, backgroundImages, videos, svgs, loadedFonts, favicons, stylesheetLinks };
    },
    { MAX_ELEMENTS },
  );
}

/* ------------------------------------------------------------------ *
 * 3b. The six states
 *
 * Two kinds of evidence, and the report always says which:
 *   driven    the state was actually entered and the computed style changed
 *   declared  a CSS rule exists whose selector targets this element in that state
 *   attribute the element carries the attribute or class that puts it in that state
 *
 * `active` is never driven. Driving it means pressing the mouse down on a control and
 * releasing it, and the release is a click: on a link that navigates, and the run would
 * be measuring a different page than the one it reported. Declaration evidence is worth
 * less and it does not lie about what happened.
 * ------------------------------------------------------------------ */

const DRIVE_PROPS = [
  'outlineStyle', 'outlineWidth', 'outlineColor', 'outlineOffset',
  'boxShadow', 'borderTopColor', 'borderTopWidth', 'backgroundColor',
  'color', 'textDecorationLine', 'filter', 'transform', 'opacity', 'cursor',
];

async function collectStates(page, stateSelectors) {
  const prepared = await page.evaluate(
    ({ props, limit, stateSelectors, states }) => {
      const { INTERACTIVE, visible, sel, nameOf } = window.__ss;
      const controls = [...document.querySelectorAll(INTERACTIVE)].filter(visible).slice(0, limit);
      window.__ssDrive = { props, rest: [] };

      const STRIP = /:(hover|focus-visible|focus|active|disabled|enabled)\b|\[disabled\]|\[aria-disabled[^\]]*\]|\[aria-busy[^\]]*\]|\[data-loading[^\]]*\]|\[data-state=["']?loading["']?\]|\.is-loading\b|\.loading\b|\.busy\b/g;
      const declaredFor = (el, state) => {
        for (const s of stateSelectors[state] ?? []) {
          const base = s.replace(STRIP, '').replace(/\s+/g, ' ').trim();
          if (!base) {
            // A bare state selector such as `:focus-visible { ... }` applies to anything that
            // can enter the state. That is true for the three pointer and keyboard states and
            // not a claim worth making for disabled or loading, which need a targeted rule.
            if (state === 'hover' || state === 'focus-visible' || state === 'active') return true;
            continue;
          }
          if (/[>+~,]$/.test(base)) continue;
          try {
            if (el.matches(base)) return true;
          } catch {
            /* a selector this browser will not parse is not evidence */
          }
        }
        return false;
      };

      return controls.map((el, i) => {
        el.setAttribute('data-ss-i', String(i));
        const cs = getComputedStyle(el);
        const snap = {};
        for (const p of props) snap[p] = cs[p];
        window.__ssDrive.rest.push(snap);

        const cls = String(el.className || '');
        const attrs = {
          disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true',
          loading: el.getAttribute('aria-busy') === 'true' || el.hasAttribute('data-loading') || /\b(is-)?loading\b|\bbusy\b/.test(cls),
        };
        const declared = {};
        for (const s of states) declared[s] = s === 'rest' ? true : declaredFor(el, s);

        return {
          i,
          selector: sel(el),
          name: nameOf(el).slice(0, 50),
          tag: el.tagName.toLowerCase(),
          declared,
          attrs,
        };
      });
    },
    { props: DRIVE_PROPS, limit: MAX_STATE_CONTROLS, stateSelectors, states: SIX_STATES },
  );

  // Driven focus, from a real Tab. focus() does not always match :focus-visible, and a
  // report built on the wrong pseudo-class would name indicators nobody can see.
  const focusDriven = new Map();
  let focusStops = 0;
  await page.evaluate(() => {
    document.activeElement?.blur?.();
    window.scrollTo(0, 0);
  });
  const seen = new Set();
  for (let n = 0; n < MAX_STATE_CONTROLS + 10; n++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      const raw = el.getAttribute('data-ss-i');
      if (raw === null) return { idx: null };
      const idx = Number(raw);
      const cs = getComputedStyle(el);
      const rest = window.__ssDrive.rest[idx];
      const changed = window.__ssDrive.props.filter((p) => rest[p] !== cs[p]);
      const outlinePaints = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const outlineIsNew =
        outlinePaints && (rest.outlineStyle === 'none' || rest.outlineWidth !== cs.outlineWidth || rest.outlineColor !== cs.outlineColor);
      const PAINTS = ['boxShadow', 'borderTopColor', 'borderTopWidth', 'backgroundColor', 'color', 'textDecorationLine', 'filter', 'transform', 'opacity'];
      const paintChanged = changed.filter((p) => PAINTS.includes(p) && !(p === 'boxShadow' && cs.boxShadow === 'none'));
      return {
        idx,
        changed,
        paints: Boolean(outlineIsNew || paintChanged.length),
        focusVisible: el.matches(':focus-visible'),
      };
    });
    if (!stop) break;
    focusStops++;
    if (stop.idx === null) continue;
    if (seen.has(stop.idx)) break;
    seen.add(stop.idx);
    focusDriven.set(stop.idx, stop);
  }

  // Driven hover.
  const hoverDriven = new Map();
  let hoverAttempted = 0;
  let hoverFailed = 0;
  const handles = await page.$$('[data-ss-i]');
  for (const h of handles.slice(0, MAX_HOVER_CONTROLS)) {
    hoverAttempted++;
    try {
      await h.hover({ timeout: 1200 });
    } catch {
      hoverFailed++;
      continue;
    }
    try {
      const r = await h.evaluate((el) => {
        const idx = Number(el.getAttribute('data-ss-i'));
        const cs = getComputedStyle(el);
        const rest = window.__ssDrive.rest[idx];
        return { idx, changed: window.__ssDrive.props.filter((p) => rest[p] !== cs[p]) };
      });
      hoverDriven.set(r.idx, r.changed);
    } catch {
      hoverFailed++;
    }
  }
  // Park the pointer and the focus so a lingering state does not leak into a later pass.
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    document.activeElement?.blur?.();
    window.scrollTo(0, 0);
    for (const el of document.querySelectorAll('[data-ss-i]')) el.removeAttribute('data-ss-i');
  });

  const counts = Object.fromEntries(SIX_STATES.map((s) => [s, 0]));
  const elements = prepared.map((c) => {
    const states = {};
    states.rest = 'computed';

    const hoverChanged = hoverDriven.get(c.i);
    if (hoverChanged && hoverChanged.length) states.hover = 'driven';
    else if (c.declared.hover) states.hover = 'declared';
    else states.hover = null;

    const f = focusDriven.get(c.i);
    if (f && f.paints) states['focus-visible'] = 'driven';
    else if (c.declared['focus-visible']) states['focus-visible'] = 'declared';
    else states['focus-visible'] = null;

    states.active = c.declared.active ? 'declared' : null;
    states.disabled = c.attrs.disabled ? 'attribute' : c.declared.disabled ? 'declared' : null;
    states.loading = c.attrs.loading ? 'attribute' : c.declared.loading ? 'declared' : null;

    for (const s of SIX_STATES) if (states[s]) counts[s]++;
    return { selector: c.selector, name: c.name, tag: c.tag, states };
  });

  return {
    measuredAtWidth: STRUCTURE_WIDTH,
    controlsExamined: prepared.length,
    driven: { focusStops, hoverAttempted, hoverFailed },
    counts,
    elements,
    method: {
      driven: 'the state was entered and at least one computed style property changed',
      declared: 'a CSS rule exists whose selector targets this element in that state',
      attribute: 'the element carries the attribute or class that puts it in that state',
      active: 'declaration evidence only; driving it would click the control',
    },
  };
}

/* ------------------------------------------------------------------ *
 * 1. Routes
 * ------------------------------------------------------------------ */

async function discoverRoutes(context) {
  const origin = baseUrl.origin;
  const sources = [];
  const considered = [];
  const push = (href, how) => {
    let u;
    try {
      u = new URL(href, baseUrl);
    } catch {
      return;
    }
    if (u.origin !== origin) return;
    if (!/\.(html?)$/i.test(u.pathname) && /\.[a-z0-9]{2,5}$/i.test(u.pathname)) return; // an asset, not a page
    const route = canonicalRoute(u.pathname);
    if (considered.some((c) => c.route === route)) return;
    considered.push({ route, how });
  };

  if (routesArg) {
    for (const r of String(routesArg).split(',').map((s) => s.trim()).filter(Boolean)) push(r, 'explicit --routes');
    sources.push('explicit --routes');
    return { method: 'explicit', sources, considered, entryRoute };
  }

  push(entryRoute, 'entry');
  sources.push('entry');

  if (report.kind === 'directory' && report.diskHtmlFiles) {
    for (const rel of report.diskHtmlFiles) push('/' + rel, 'html file on disk');
    sources.push('html files on disk');
  }

  // sitemap.xml if it is there. It is the site's own statement about its routes and it
  // outranks anything inferred from a menu.
  try {
    const res = await context.request.get(new URL('/sitemap.xml', baseUrl).href, { timeout: 10000 });
    if (res.ok()) {
      const body = await res.text();
      if (/<urlset|<sitemapindex/i.test(body)) {
        const locs = [...body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);
        for (const loc of locs.slice(0, 100)) push(loc, 'sitemap.xml');
        sources.push(`sitemap.xml (${locs.length} entries)`);
      }
    }
  } catch (e) {
    // No sitemap is normal and is not a failed measurement, but a sitemap that was there
    // and could not be read is.
    withhold('sitemap.xml', String(e).split('\n')[0]);
  }

  // Navigation links from the entry page.
  const page = await context.newPage();
  try {
    const entryUrl = new URL(entryRoute, baseUrl).href;
    await page.goto(entryUrl, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(SETTLE_MS);
    const hrefs = await page.evaluate(() => {
      const inNav = [...document.querySelectorAll('nav a[href], [role="navigation"] a[href], header a[href]')].map((a) => a.getAttribute('href'));
      if (inNav.length) return { from: 'nav', hrefs: inNav };
      return { from: 'all links', hrefs: [...document.querySelectorAll('a[href]')].slice(0, 60).map((a) => a.getAttribute('href')) };
    });
    for (const h of hrefs.hrefs) if (h) push(h, `link in ${hrefs.from}`);
    sources.push(`${hrefs.from} links on the entry page`);
  } catch (e) {
    withhold('route discovery from navigation links', String(e).split('\n')[0]);
  } finally {
    await page.close();
  }

  return { method: 'discovered', sources, considered, entryRoute };
}

/* ------------------------------------------------------------------ *
 * The per-route pass
 * ------------------------------------------------------------------ */

async function inspectRoute(browser, routePath) {
  const url = new URL(routePath, baseUrl).href;
  const slug = slugFor(routePath);
  const rec = {
    route: routePath,
    url: report.kind === 'directory' ? routePath : url,
    slug,
    widths: {},
    components: {},
    tokens: null,
    css: null,
    assets: null,
    states: null,
    axe: null,
  };
  const tokensByWidth = [];
  let rendered = 0;

  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: Math.round(width * 1.9) },
      deviceScaleFactor: 1,
      isMobile: width < 768,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200));
    });

    let response;
    try {
      response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    } catch (e) {
      withhold(`route ${routePath} at ${width}px`, `navigation failed: ${String(e).split('\n')[0]}`);
      await context.close();
      continue;
    }
    await page.waitForTimeout(SETTLE_MS);

    const file = `${slug}-${width}.png`;
    try {
      await page.screenshot({ path: join(baselineDir, file), fullPage: true });
    } catch (e) {
      withhold(`baseline screenshot ${file}`, String(e).split('\n')[0]);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);
    await installProbes(page);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

    rec.widths[width] = {
      status: response?.status() ?? null,
      screenshot: `baseline/${file}`,
      horizontalOverflowPx: overflow,
      title: await page.title(),
      consoleErrors,
    };
    rendered++;

    try {
      rec.components[width] = await collectComponents(page);
    } catch (e) {
      withhold(`component map for ${routePath} at ${width}px`, String(e).split('\n')[0]);
    }
    try {
      tokensByWidth.push(await collectTokens(page));
    } catch (e) {
      withhold(`design tokens for ${routePath} at ${width}px`, String(e).split('\n')[0]);
    }

    if (width === STRUCTURE_WIDTH) {
      let stateSelectors = null;
      try {
        rec.css = await collectCss(page);
        stateSelectors = rec.css.stateSelectors;
        for (const u of rec.css.unreadableSheets) withhold(`stylesheet rules for ${routePath}: ${u.sheet}`, u.reason);
      } catch (e) {
        withhold(`stylesheet read for ${routePath}`, String(e).split('\n')[0]);
      }
      try {
        rec.assets = await collectAssets(page);
      } catch (e) {
        withhold(`asset inventory for ${routePath}`, String(e).split('\n')[0]);
      }
      if (stateSelectors) {
        try {
          rec.states = await collectStates(page, stateSelectors);
        } catch (e) {
          withhold(`interaction states for ${routePath}`, String(e).split('\n')[0]);
        }
      } else {
        withhold(`interaction states for ${routePath}`, 'the stylesheet read produced no state selectors, so declaration evidence was unavailable');
      }
    }

    if (width === AXE_WIDTH && AxeBuilder) {
      try {
        const scan = async (scheme) => {
          await page.emulateMedia({ colorScheme: scheme });
          await page.waitForTimeout(150);
          const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
          return r.violations.map((v) => ({ ...v, scheme }));
        };
        const found = [...(await scan('light')), ...(await scan('dark'))];
        await page.emulateMedia({ colorScheme: null });
        rec.axe = {
          scannedAtWidth: AXE_WIDTH,
          violations: found.map((v) => ({
            id: v.id,
            scheme: v.scheme,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.length,
            examples: v.nodes.slice(0, 3).map((n) => ({
              target: n.target.join(' '),
              detail: (n.any?.[0]?.message ?? n.failureSummary ?? '').split('\n')[0].slice(0, 160),
            })),
          })),
        };
      } catch (e) {
        withhold(`axe scan for ${routePath}`, String(e).split('\n')[0]);
      }
    }

    await context.close();
  }

  if (!rendered) {
    // No fabricated record. A route entry full of zeros reads as "inspected and empty",
    // which is the single most expensive lie this script could tell a redesign.
    withhold(`route ${routePath}`, 'no viewport rendered, so nothing about this route was measured');
    return null;
  }

  rec.tokens = mergeTokenSets(tokensByWidth);
  return rec;
}

/** Merge the per-viewport token sweeps. A value seen at any width is present; its count is
    the largest count any single viewport saw, never the sum, because summing three
    viewports would triple every number and invent a page three times the size. */
function mergeTokenSets(sets) {
  if (!sets.length) return null;
  const mergeBucket = (key, path) => {
    const out = new Map();
    for (const s of sets) {
      const list = path ? s[path]?.[key] : s[key];
      for (const item of list ?? []) {
        const prev = out.get(item.value);
        if (!prev || item.count > prev.count) out.set(item.value, { ...item });
      }
    }
    return [...out.values()].sort((a, b) => b.count - a.count);
  };
  return {
    measuredAtWidths: WIDTHS.filter((_, i) => i < sets.length),
    elementsMeasured: Math.max(...sets.map((s) => s.elementsMeasured)),
    colourObservations: Math.max(...sets.map((s) => s.colourObservations)),
    colours: mergeBucket('colours'),
    typography: {
      families: mergeBucket('families', 'typography'),
      sizes: mergeBucket('sizes', 'typography'),
      weights: mergeBucket('weights', 'typography'),
      lineHeights: mergeBucket('lineHeights', 'typography'),
      letterSpacings: mergeBucket('letterSpacings', 'typography'),
    },
    spacing: mergeBucket('spacing'),
    radii: mergeBucket('radii'),
    shadows: mergeBucket('shadows'),
  };
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

const browser = await chromium.launch();
try {
  const discoveryContext = await browser.newContext({ viewport: { width: STRUCTURE_WIDTH, height: 900 } });
  let discovery;
  try {
    discovery = await discoverRoutes(discoveryContext);
  } catch (e) {
    discovery = { method: 'entry only', sources: ['entry'], considered: [{ route: entryRoute, how: 'entry' }], entryRoute };
    withhold('route discovery', String(e).split('\n')[0]);
  } finally {
    await discoveryContext.close();
  }

  const inspected = discovery.considered.slice(0, MAX_ROUTES).map((c) => c.route);
  report.routeDiscovery = {
    method: discovery.method,
    sources: discovery.sources,
    entryRoute,
    considered: discovery.considered,
    inspected,
    truncated: discovery.considered.length > MAX_ROUTES ? discovery.considered.length - MAX_ROUTES : 0,
  };
  if (report.routeDiscovery.truncated) {
    withhold(
      `${report.routeDiscovery.truncated} discovered route(s)`,
      `this run inspects at most ${MAX_ROUTES} routes; the rest were found and not measured`,
    );
  }

  for (const routePath of inspected) {
    const rec = await inspectRoute(browser, routePath);
    if (rec) report.routes.push(rec);
  }
} finally {
  await browser.close();
  server?.close();
}

/* When this script served the directory itself, every absolute URL in the report points at
   an ephemeral port on this machine and means nothing anywhere else. verify.mjs makes the
   same call about screenshot paths for the same reason: a committed report that names the
   machine it was produced on is not a report about the site. Site-relative is what the
   project actually contains. */
if (report.kind === 'directory' && baseUrl) {
  const origin = baseUrl.origin;
  const strip = (v) => {
    if (typeof v === 'string') return v.split(origin).join('');
    if (Array.isArray(v)) return v.map(strip);
    if (v && typeof v === 'object') {
      for (const k of Object.keys(v)) v[k] = strip(v[k]);
      return v;
    }
    return v;
  };
  strip(report);
}

/* ------------------------------------------------------------------ *
 * 8. Baseline manifest
 * ------------------------------------------------------------------ */

for (const route of report.routes) {
  for (const [width, w] of Object.entries(route.widths)) {
    const file = w.screenshot.replace(/^baseline\//, '');
    try {
      const bytes = await readFile(join(baselineDir, file));
      report.baseline.images.push({
        file,
        route: route.route,
        width: Number(width),
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      });
    } catch (e) {
      withhold(`baseline hash for ${file}`, String(e).split('\n')[0]);
    }
  }
}
try {
  await writeFile(
    join(baselineDir, 'manifest.json'),
    JSON.stringify(
      {
        target: report.target,
        generatedAt: report.generatedAt,
        widths: WIDTHS,
        algorithm: 'sha256',
        note: 'compare a later render against these hashes; a changed hash is a changed pixel, not a verdict',
        images: report.baseline.images,
      },
      null,
      2,
    ),
  );
} catch (e) {
  withhold('baseline manifest', String(e).split('\n')[0]);
}

/* ------------------------------------------------------------------ *
 * 6. What has to survive
 * ------------------------------------------------------------------ */

function buildPreserve() {
  const siteTokens = mergeTokenSets(report.routes.map((r) => r.tokens).filter(Boolean));
  const totalColour = report.routes.reduce((n, r) => n + (r.tokens?.colourObservations ?? 0), 0);
  const colours = (siteTokens?.colours ?? [])
    .map((c) => ({ ...c, share: totalColour ? Number((c.count / totalColour).toFixed(4)) : null }))
    .filter((c) => c.count >= PRESERVE_COLOUR_MIN_COUNT && (c.share === null || c.share >= PRESERVE_COLOUR_MIN_SHARE));

  const customProperties = [];
  const seenProp = new Set();
  for (const r of report.routes) {
    for (const p of r.css?.customProperties ?? []) {
      if (seenProp.has(p.name)) continue;
      seenProp.add(p.name);
      customProperties.push(p);
    }
  }

  const fontFaces = [];
  const seenFace = new Set();
  for (const r of report.routes) {
    for (const f of r.css?.fontFaces ?? []) {
      const k = `${f.family}|${f.weight}|${f.style}`;
      if (seenFace.has(k)) continue;
      seenFace.add(k);
      fontFaces.push(f);
    }
  }

  const brandMark = report.routes.map((r) => r.assets?.logo).find(Boolean) ?? null;

  return {
    brandMark,
    brandMarkNote: brandMark ? null : 'no element matched either brand-mark reading; a mark may still exist and was not identified mechanically',
    colours,
    fonts: siteTokens?.typography?.families ?? [],
    fontFaces,
    loadedFonts: report.routes[0]?.assets?.loadedFonts ?? [],
    customProperties,
    thresholds: {
      colourMinCount: PRESERVE_COLOUR_MIN_COUNT,
      colourMinShare: PRESERVE_COLOUR_MIN_SHARE,
      colourObservations: totalColour,
      rule: `a colour is listed when it is used at least ${PRESERVE_COLOUR_MIN_COUNT} times and accounts for at least ${PRESERVE_COLOUR_MIN_SHARE * 100}% of all colour observations`,
    },
    siteTokens,
  };
}
report.preserve = report.routes.length ? buildPreserve() : null;

/* ------------------------------------------------------------------ *
 * 7. Findings. Every line carries the number it came from.
 * ------------------------------------------------------------------ */

function buildFindings() {
  const out = [];
  const add = (area, route, text) => out.push({ area, route, text });

  for (const r of report.routes) {
    const structural = r.components[STRUCTURE_WIDTH] ?? Object.values(r.components)[0] ?? null;
    if (!structural) continue;
    const doc = structural.document;

    /* UX */
    if (!structural.navigation.length && !structural.headerAsNav) add('ux', r.route, 'no nav element, no [role=navigation] and no header links: this page has no measured navigation');
    for (const [w, c] of Object.entries(r.components)) {
      const visibleNavLinks = (c.navigation ?? []).filter((n) => n.visible).reduce((n, x) => n + x.linkCount, 0);
      const anyNav = (c.navigation ?? []).length;
      if (anyNav && visibleNavLinks === 0) add('ux', r.route, `${w}px: a nav element is present and 0 of its links are visible, so the menu is behind something at this width`);
    }
    if (!structural.footers.length) add('ux', r.route, 'no footer and no [role=contentinfo]');
    if (doc.h1Count === 0) add('ux', r.route, 'no h1 on the page');
    else if (doc.h1Count > 1) add('ux', r.route, `${doc.h1Count} h1 elements on one page`);
    if (!doc.landmarks.main) add('ux', r.route, 'no main landmark');
    if (doc.namelessControls.length) add('ux', r.route, `${doc.namelessControls.length} of ${doc.controlCount} interactive elements have no accessible name, first: ${doc.namelessControls[0].selector}`);
    for (const f of structural.forms) {
      const unlabelled = f.fields.filter((x) => !x.labelled);
      if (unlabelled.length) add('ux', r.route, `form ${f.selector}: ${unlabelled.length} of ${f.fieldCount} fields have no label (${unlabelled.filter((x) => x.placeholderOnly).length} carry a placeholder only)`);
    }
    if (structural.orphanInputCount) add('ux', r.route, `${structural.orphanInputCount} input, select or textarea elements sit outside any form element`);
    for (const t of structural.tables) {
      if (!t.headerCells) add('ux', r.route, `table ${t.selector}: ${t.columns} columns, ${t.rows} rows, 0 th cells`);
      if (!t.caption) add('ux', r.route, `table ${t.selector}: no caption`);
    }
    if (r.states) {
      const bare = r.states.elements.filter((e) => SIX_STATES.filter((s) => s !== 'rest').every((s) => !e.states[s]));
      if (bare.length) add('ux', r.route, `${bare.length} of ${r.states.controlsExamined} controls have no evidence of any state beyond rest, first: ${bare[0].selector}`);
      if (r.states.driven.hoverFailed) add('ux', r.route, `hover could not be driven onto ${r.states.driven.hoverFailed} of ${r.states.driven.hoverAttempted} controls, so their hover evidence is declaration only`);
    }

    /* CRO */
    for (const [w, c] of Object.entries(r.components)) {
      const fs = c.firstScreen;
      add('cro', r.route, `${w}px first screen: ${fs.controlCount} interactive elements, ${fs.headings.length} headings, ${fs.mediaCount} media elements, largest heading ${fs.largestTextPx === null ? 'none measured' : fs.largestTextPx + 'px'}`);
      if (!fs.headings.length) add('cro', r.route, `${w}px first screen has no heading`);
      if (fs.controlCount === 0) add('cro', r.route, `${w}px first screen has no interactive element`);
    }
    for (const f of structural.forms) {
      add('cro', r.route, `form ${f.selector}: ${f.fieldCount} visible fields, ${f.fields.filter((x) => x.required).length} required, ${f.hiddenFieldCount} hidden, method ${f.method}`);
    }
    add('cro', r.route, `${doc.linkCount} links, ${doc.outboundLinkCount} of them leaving this origin`);

    /* Accessibility */
    for (const [w, d] of Object.entries(r.widths)) {
      if (d.horizontalOverflowPx > 1) add('a11y', r.route, `${w}px: horizontal overflow +${d.horizontalOverflowPx}px past the viewport`);
      if (d.consoleErrors.length) add('a11y', r.route, `${w}px: ${d.consoleErrors.length} console error(s), first: ${d.consoleErrors[0]}`);
      if ((d.status ?? 0) >= 400) add('a11y', r.route, `${w}px: HTTP ${d.status}`);
    }
    if (!doc.lang) add('a11y', r.route, 'the html element carries no lang attribute');
    if (doc.imagesWithoutAlt.length) add('a11y', r.route, `${doc.imagesWithoutAlt.length} of ${doc.imageCount} images have no alt attribute, first: ${doc.imagesWithoutAlt[0].selector}`);
    if (r.axe) {
      const serious = r.axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      add('a11y', r.route, `axe at ${r.axe.scannedAtWidth}px in both colour schemes: ${r.axe.violations.length} violations, ${serious.length} serious or critical`);
      for (const v of r.axe.violations.slice(0, 8)) add('a11y', r.route, `axe ${v.impact} [${v.scheme}] ${v.id}: ${v.help} (${v.nodes} nodes, e.g. ${v.examples[0]?.target ?? 'no target recorded'})`);
    }
    if (r.states) {
      const noFocus = r.states.elements.filter((e) => !e.states['focus-visible']);
      if (noFocus.length) add('a11y', r.route, `${noFocus.length} of ${r.states.controlsExamined} controls have no focus-visible evidence, driven or declared, first: ${noFocus[0].selector}`);
    }

    /* Design */
    const t = r.tokens;
    if (t) {
      add('design', r.route, `${t.colours.length} distinct colours over ${t.elementsMeasured} visible elements, most used: ${t.colours.slice(0, 4).map((c) => `${c.value} x${c.count}`).join(', ') || 'none measured'}`);
      add('design', r.route, `type: ${t.typography.families.length} families, ${t.typography.sizes.length} sizes, ${t.typography.weights.length} weights, ${t.typography.lineHeights.length} line-heights`);
      add('design', r.route, `shape: ${t.radii.length} corner radii, ${t.shadows.length} shadow values, ${t.spacing.length} distinct spacing values`);
    }
    if (r.css) {
      add('design', r.route, `${r.css.customProperties.length} custom properties declared across ${r.css.sheetsRead} of ${r.css.sheetsSeen} stylesheets`);
      add('design', r.route, r.css.breakpoints.length ? `${r.css.breakpoints.length} breakpoints in CSS: ${r.css.breakpoints.map((b) => `${b.bound}-${b.axis} ${b.value}${b.unit}`).join(', ')}` : 'no min- or max-width media query found in the readable stylesheets');
    }
    if (structural.cardGroups.length) add('design', r.route, `${structural.cardGroups.length} repeated card or panel group(s), largest ${Math.max(...structural.cardGroups.map((g) => g.count))} members`);
  }
  return out;
}
report.findings = buildFindings();

/* ------------------------------------------------------------------ *
 * The audit artefact
 * ------------------------------------------------------------------ */

function table(rows) {
  if (!rows.length) return '';
  const head = rows[0];
  const body = rows.slice(1);
  return [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...body.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');
}

function renderAudit() {
  const L = [];
  const say = (s = '') => L.push(s);

  say('---');
  say('title: Inspection of an existing site');
  say(`target: ${report.target}`);
  say(`generated: ${report.generatedAt}`);
  say('produced_by: skills/sitesmith-v3/scripts/inspect.mjs');
  say('status: report, not a verdict. Nothing here refuses a build.');
  say('ai_generated: "(C)"');
  say('---');
  say();
  say('# What is there now');
  say();
  say('Every line below is a measurement with the number it came from. Where a measurement');
  say('could not be taken it is listed under **Not measured** and is not reported as a zero.');
  say();

  say('## Stack and routes');
  say();
  if (report.stack?.detected) {
    say(`- stack: **${report.stack.detected}**, adapter \`${report.stack.adapter}\``);
    for (const e of report.stack.evidence ?? []) say(`  - evidence: ${e}`);
  } else {
    say(`- stack: not named. ${report.stack?.reason ?? 'no detection was attempted'}`);
    for (const line of report.stack?.stackOutput ?? []) say(`  - ${line}`);
  }
  const d = report.routeDiscovery;
  if (d) {
    say(`- route discovery: ${d.method}, from ${d.sources.join('; ')}`);
    say(`- entry route: \`${d.entryRoute}\``);
    say(`- routes found: ${d.considered.length}, inspected: ${d.inspected.length}${d.truncated ? `, not inspected: ${d.truncated}` : ''}`);
    say();
    say(table([['route', 'how it was found', 'inspected'], ...d.considered.map((c) => [`\`${c.route}\``, c.how, d.inspected.includes(c.route) ? 'yes' : 'no'])]));
  }
  say();

  say('## Screens captured');
  say();
  if (report.routes.length) {
    say(table([
      ['route', ...WIDTHS.map((w) => `${w}px`), 'title'],
      ...report.routes.map((r) => [
        `\`${r.route}\``,
        ...WIDTHS.map((w) => {
          const rec = r.widths[w];
          if (!rec) return 'not rendered';
          const of = rec.horizontalOverflowPx > 1 ? ` (+${rec.horizontalOverflowPx}px overflow)` : '';
          return `\`${rec.screenshot}\`${of}`;
        }),
        (r.widths[STRUCTURE_WIDTH]?.title ?? Object.values(r.widths)[0]?.title ?? '').slice(0, 60),
      ]),
    ]));
    say();
    say(`Baseline manifest: \`baseline/manifest.json\`, ${report.baseline.images.length} images hashed with sha256. A later`);
    say('render whose hash differs has changed pixels; whether that is an improvement is not this file\'s call.');
  } else {
    say('No route was rendered. See **Not measured**.');
  }
  say();

  say('## Components and states');
  say();
  for (const r of report.routes) {
    const c = r.components[STRUCTURE_WIDTH] ?? Object.values(r.components)[0];
    if (!c) {
      say(`### \`${r.route}\``);
      say();
      say('Component map was not measured on this route. See **Not measured**.');
      say();
      continue;
    }
    say(`### \`${r.route}\``);
    say();
    say(`- navigation: ${c.navigation.length} nav element(s)${c.headerAsNav ? ', plus header links with no nav element' : ''}${c.navigation.length ? `, ${c.navigation.reduce((n, x) => n + x.linkCount, 0)} visible links at ${STRUCTURE_WIDTH}px` : ''}`);
    say(`- first screen at ${STRUCTURE_WIDTH}px: ${c.firstScreen.headings.length} heading(s)${c.firstScreen.headings[0] ? ` starting "${c.firstScreen.headings[0].text}" at ${c.firstScreen.headings[0].fontSizePx}px` : ''}, ${c.firstScreen.controlCount} interactive element(s), ${c.firstScreen.mediaCount} media element(s)`);
    say(`- forms: ${c.forms.length}${c.forms.map((f) => ` [${f.selector}: ${f.fieldCount} fields, method ${f.method}]`).join('')}`);
    say(`- tables: ${c.tables.length}${c.tables.map((t) => ` [${t.selector}: ${t.columns} cols, ${t.rows} rows, ${t.headerCells} th, caption ${t.caption ? `"${t.caption}"` : 'none'}]`).join('')}`);
    say(`- cards or panels: ${c.cardGroups.length} repeated group(s)${c.cardGroups.map((g) => ` [${g.member} x${g.count} in ${g.container}]`).join('')}`);
    say(`- footer: ${c.footers.length}${c.footers.map((f) => ` [${f.selector}: ${f.linkCount} links]`).join('')}`);
    say();
    if (r.states) {
      say(`States, measured at ${r.states.measuredAtWidth}px on ${r.states.controlsExamined} controls (${r.states.driven.focusStops} tab stops, hover driven onto ${r.states.driven.hoverAttempted - r.states.driven.hoverFailed} of ${r.states.driven.hoverAttempted}):`);
      say();
      say(table([['state', 'controls with evidence', 'of'], ...SIX_STATES.map((s) => [s, String(r.states.counts[s]), String(r.states.controlsExamined)])]));
      say();
      say(table([
        ['control', ...SIX_STATES],
        ...r.states.elements.slice(0, 20).map((e) => [`\`${e.selector}\` ${e.name ? `"${e.name}"` : ''}`.trim(), ...SIX_STATES.map((s) => e.states[s] ?? '-')]),
      ]));
      say();
      say('`driven` means the state was entered and a computed style changed. `declared` means a CSS rule targets');
      say('this element in that state. `attribute` means the element carries the attribute or class. `active` is never');
      say('driven: releasing the mouse would click the control and the run would be measuring a different page.');
    } else {
      say('States were not measured on this route. See **Not measured**.');
    }
    say();
  }

  say('## Design tokens');
  say();
  const st = report.preserve?.siteTokens;
  if (st) {
    say(`Read off the rendered page at ${WIDTHS.join(', ')}px and merged, not read out of a stylesheet: a computed`);
    say('value is what the reader actually saw.');
    say();
    say(table([['colour', 'uses', 'roles', 'example element'], ...st.colours.slice(0, 16).map((c) => [`\`${c.value}\``, String(c.count), (c.roles ?? []).join(', '), `\`${c.example}\``])]));
    say();
    say(`- families: ${st.typography.families.map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- sizes: ${st.typography.sizes.map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- weights: ${st.typography.weights.map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- line-heights: ${st.typography.lineHeights.map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- letter-spacing: ${st.typography.letterSpacings.map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- spacing values (padding, row and column gap, and block-axis margins): ${st.spacing.slice(0, 16).map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- radii: ${st.radii.map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- shadows: ${st.shadows.length}`);
  } else {
    say('No tokens were measured. See **Not measured**.');
  }
  const bps = report.routes.flatMap((r) => r.css?.breakpoints ?? []);
  const seenBp = new Set();
  const uniqueBps = bps.filter((b) => {
    const k = `${b.bound}-${b.axis}:${b.value}${b.unit}`;
    if (seenBp.has(k)) return false;
    seenBp.add(k);
    return true;
  });
  say();
  say(`- breakpoints declared in CSS: ${uniqueBps.length ? uniqueBps.map((b) => `${b.bound}-${b.axis} ${b.value}${b.unit}`).join(', ') : 'none found in the readable stylesheets'}`);
  say();

  say('## Brand assets');
  say();
  const assets = report.routes.map((r) => r.assets).find(Boolean);
  if (assets) {
    const logo = report.preserve?.brandMark;
    say(`- brand mark: ${logo ? `\`${logo.selector}\` (${logo.kind}${logo.src ? `, ${logo.src}` : ''}, ${logo.renderedWidth}x${logo.renderedHeight}px rendered) matched on ${logo.matchedOn}` : report.preserve?.brandMarkNote}`);
    say(`- images: ${report.routes.reduce((n, r) => n + (r.assets?.images.length ?? 0), 0)} across the inspected routes`);
    const imgs = report.routes.flatMap((r) => (r.assets?.images ?? []).map((i) => ({ ...i, route: r.route })));
    if (imgs.length) {
      say();
      say(table([
        ['image', 'route', 'intrinsic', 'rendered', 'alt'],
        ...imgs.slice(0, 20).map((i) => [`\`${i.declaredSrc || i.src}\``, `\`${i.route}\``, i.naturalWidth ? `${i.naturalWidth}x${i.naturalHeight}` : 'not reported by the browser', `${i.renderedWidth}x${i.renderedHeight}`, i.alt === null ? 'no alt attribute' : i.alt === '' ? 'empty alt' : i.alt.slice(0, 40)]),
      ]));
      say();
    }
    say(`- background images: ${report.routes.reduce((n, r) => n + (r.assets?.backgroundImages.length ?? 0), 0)}`);
    say(`- video elements: ${report.routes.reduce((n, r) => n + (r.assets?.videos.length ?? 0), 0)}`);
    say(`- inline svg: ${report.routes.reduce((n, r) => n + (r.assets?.svgs.length ?? 0), 0)}`);
    say(`- fonts loaded by the page: ${assets.loadedFonts.length ? assets.loadedFonts.map((f) => `${f.family} ${f.weight} ${f.style} (${f.status})`).join(', ') : 'none reported by document.fonts, so the page is on system faces'}`);
    say(`- @font-face rules: ${report.preserve?.fontFaces.length ?? 0}`);
    say(`- favicons: ${assets.favicons.length ? assets.favicons.map((f) => f.href).join(', ') : 'none declared'}`);
  } else {
    say('No asset inventory was taken. See **Not measured**.');
  }
  say();

  say('## What has to survive a redesign');
  say();
  say('redesign.md names five categories that are not the builder\'s to change without the brief saying so.');
  say('This section is the mechanical half of that list: what is measurably here now. It is an input to the');
  say('preservation contract, not the contract itself.');
  say();
  const p = report.preserve;
  if (p) {
    say(`- brand mark: ${p.brandMark ? `\`${p.brandMark.selector}\`${p.brandMark.src ? ` (${p.brandMark.src})` : ''}` : p.brandMarkNote}`);
    say(`- colours over the threshold (${p.thresholds.rule}): ${p.colours.length}`);
    if (p.colours.length) {
      say();
      say(table([['colour', 'uses', 'share of colour observations'], ...p.colours.slice(0, 16).map((c) => [`\`${c.value}\``, String(c.count), c.share === null ? 'not computed' : `${(c.share * 100).toFixed(1)}%`])]));
      say();
    }
    say(`- typefaces in use: ${p.fonts.map((f) => `${f.value} (x${f.count})`).join(', ') || 'none measured'}`);
    say(`- design-system tokens (CSS custom properties): ${p.customProperties.length}`);
    if (p.customProperties.length) {
      say();
      say(table([['token', 'declared in', 'declared value', 'computed at :root'], ...p.customProperties.slice(0, 40).map((c) => [`\`${c.name}\``, `\`${c.declaredIn}\``, `\`${c.declaredValue}\``, c.computedValue ? `\`${c.computedValue}\`` : 'not resolvable at the document root'])]));
      say();
    }
  } else {
    say('Nothing was measured, so nothing can be named for preservation. See **Not measured**.');
  }
  say();

  say('## Findings');
  say();
  for (const [area, heading] of [['ux', 'UX'], ['cro', 'CRO'], ['a11y', 'Accessibility'], ['design', 'Design system']]) {
    const lines = report.findings.filter((f) => f.area === area);
    say(`### ${heading}`);
    say();
    if (!lines.length) say('- nothing measured in this area produced a finding');
    for (const f of lines) say(`- \`${f.route}\` ${f.text}`);
    say();
  }

  say('## Not measured');
  say();
  if (!report.notMeasured.length) {
    say('- none, every check produced a result');
  } else {
    say('No result is reported for these, and none of them is reported as a zero.');
    say();
    for (const n of report.notMeasured) say(`- **${n.check}** did not run: ${n.reason}`);
  }
  say();
  return L.join('\n');
}

await writeArtefacts();

/* ------------------------------------------------------------------ *
 * Console summary
 * ------------------------------------------------------------------ */

console.log(`\n  ${report.target}\n`);
if (report.stack?.detected) console.log(`  stack   : ${report.stack.detected} (${report.stack.adapter})`);
else console.log(`  stack   : not named, ${report.stack?.reason ?? 'no detection attempted'}`);
console.log(`  routes  : ${report.routes.length} inspected of ${report.routeDiscovery?.considered.length ?? 0} found`);
for (const r of report.routes) {
  const shots = WIDTHS.map((w) => (r.widths[w] ? `${w}ok` : `${w}--`)).join(' ');
  const states = r.states ? `${SIX_STATES.filter((s) => r.states.counts[s] > 0).length}/6 states` : 'states not measured';
  console.log(`    ${r.route.padEnd(28)} ${shots}  ${states}`);
}
console.log(`  tokens  : ${report.preserve?.siteTokens ? `${report.preserve.siteTokens.colours.length} colours, ${report.preserve.siteTokens.typography.families.length} families, ${report.preserve.siteTokens.typography.sizes.length} sizes, ${report.preserve.customProperties.length} custom properties` : 'not measured'}`);
console.log(`  baseline: ${report.baseline.images.length} images hashed into baseline/manifest.json`);
console.log('');
for (const [area, heading] of [['ux', 'UX'], ['cro', 'CRO'], ['a11y', 'ACCESSIBILITY'], ['design', 'DESIGN']]) {
  const lines = report.findings.filter((f) => f.area === area);
  console.log(`  ${heading}  (${lines.length})`);
  for (const f of lines.slice(0, 8)) console.log(`    ${f.route}  ${f.text}`);
  if (lines.length > 8) console.log(`    and ${lines.length - 8} more, see AUDIT.md`);
}
console.log('');
console.log('  NOT MEASURED');
if (!report.notMeasured.length) console.log('    none, every check produced a result');
for (const n of report.notMeasured) console.log(`    ${n.check} did not run : ${n.reason}`);
console.log('');
console.log(`  ${report.routes.length ? `inspection written to ${outDir}` : `nothing could be inspected; the reasons are in ${outDir}`}\n`);

process.exit(report.routes.length ? 0 : 2);
