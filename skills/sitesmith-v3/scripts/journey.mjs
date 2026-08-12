#!/usr/bin/env node
/**
 * Runs the interaction journeys. Original work, MIT.
 *
 *   node scripts/journey.mjs journeys/ --base http://localhost:5173
 *
 * A thin runner. Each journey is a plain script that drives the page and exits non-zero on
 * failure, so a single one can be run directly with `node journeys/x.spec.mjs` while it is
 * being written. This exists so the release gate has one command to call.
 *
 * Why this file is here at all, since v3 dropped almost everything of its size:
 *
 * verify.mjs renders, measures and scans. It does not click. Its keyboard pass presses Tab
 * and reads computed style; it never submits a form, never opens a drawer, never adds
 * anything to a cart. gate.mjs contains no interaction driving either. So a Next.js
 * product page whose add-to-cart handler sits in a component that never hydrates renders
 * at three widths, clears axe in both schemes, has no console error, no failed request, no
 * dead link and no overflow, and both gates exit 0 while the one thing the page exists to
 * do is broken.
 *
 * verify.md already described this runner and already promised that a surface with no
 * journey fails the gate. Both sentences were false: neither the runner nor the gate
 * clause existed. Writing prose that describes a check nobody built is the same defect as
 * a check that cannot fail, and it is worse in one way, because it reads as coverage.
 *
 * Exit codes match the rest of the package. 0 passed, 1 a journey failed, 2 the run could
 * not happen. An absent journeys/ directory is a 2 rather than a 1: nothing was tested,
 * which is a setup problem, and the gate is what turns it into a refusal at release.
 */

import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer, request as httpRequest } from 'node:http';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--')) ?? 'journeys';
const base = (() => {
  const i = args.indexOf('--base');
  return i >= 0 ? args[i + 1] : 'http://localhost:5173';
})();
const routesOut = (() => {
  const i = args.indexOf('--routes-out');
  return resolve(i >= 0 ? args[i + 1] : '.sitesmith/journey-routes.json');
})();

/**
 * Which pages the journey actually reaches, recorded rather than declared.
 *
 * Rendered pilot 02 shipped a receipt page carrying six serious accessibility violations
 * while the build's own verify run reported none. Nothing was wrong with the measurement:
 * verify.mjs measures the URL it is handed, the builder handed it the entry, and the entry
 * does not link to the receipt. The only way to that page is to complete the booking — which
 * is exactly what a journey does, and the journey knew the page existed while the gate did
 * not.
 *
 * So the journey is asked. The specs are not: they drive the site through `BASE`, and BASE
 * now points at a forwarding proxy in front of the real server, which writes down every HTML
 * document that goes past. A spec written before this file changed reports its routes without
 * knowing it, which is the point — a convention the spec has to opt into would have been
 * absent on exactly the build that needed it.
 *
 * Only documents are recorded. Assets are not pages, and a page a user cannot reach is not
 * coverage.
 */
const BEACON = '/__journey-route';

/* Reported by the page, because the wire is not enough.
 *
 * Watching requests catches a server-rendered navigation. It does not catch a client-rendered
 * one, and that is not an edge case here: in rendered pilot 02 the booking POSTed to `/`, the
 * framework answered with a component payload, and the receipt was rendered and its URL pushed
 * without anything ever asking the server for that page. Traffic alone says the journey never
 * left the entry. The browser knows better, so it is asked. */
const REPORTER = `<script>(function(){try{
var seen='';var tell=function(){var p=location.pathname;if(p===seen)return;seen=p;
try{navigator.sendBeacon(${JSON.stringify(BEACON)},p)}catch(e){}};tell();
['pushState','replaceState'].forEach(function(m){var o=history[m];history[m]=function(){
var r=o.apply(this,arguments);tell();return r}});
addEventListener('popstate',tell);addEventListener('hashchange',tell);
}catch(e){}})()</script>`;

async function startRecordingProxy(target) {
  const upstream = new URL(target);
  const reached = new Set();

  const server = createServer((req, res) => {
    if (req.url === BEACON) {
      let body = '';
      req.on('data', (b) => { body += b; });
      req.on('end', () => {
        if (body.startsWith('/')) reached.add(body.split(/[?#]/)[0]);
        res.writeHead(204); res.end();
      });
      return;
    }

    const headersOut = { ...req.headers };
    /* Identity encoding, so an HTML body can be read and added to without decompressing it
       first. The cost is a slower local transfer of a page nobody is timing. */
    delete headersOut['accept-encoding'];

    const proxied = httpRequest(
      {
        hostname: upstream.hostname,
        port: upstream.port || 80,
        path: req.url,
        method: req.method,
        /* The client's headers go through otherwise untouched, `host` included.
           Rewriting host to the upstream was the obvious thing and it broke the one case
           this recorder exists for: a Next.js server action compares Origin against Host and
           refuses the POST when they disagree, so the booking never submitted. */
        headers: headersOut,
      },
      (up) => {
        const type = String(up.headers['content-type'] ?? '');
        if (req.method === 'GET' && up.statusCode < 400 && type.includes('text/html')) {
          reached.add(new URL(req.url, target).pathname);
        }
        const headers = { ...up.headers };
        /* A redirect that names the real server would walk the browser off the proxy, and the
           page it lands on is the one worth recording. */
        if (typeof headers.location === 'string' && headers.location.startsWith(target)) {
          headers.location = headers.location.slice(target.length) || '/';
        }

        if (req.method === 'GET' && up.statusCode < 400 && type.includes('text/html')) {
          const chunks = [];
          up.on('data', (c) => chunks.push(c));
          up.on('end', () => {
            let html = Buffer.concat(chunks).toString('utf8');
            html = html.includes('</body>')
              ? html.replace('</body>', `${REPORTER}</body>`)
              : html + REPORTER;
            const body = Buffer.from(html, 'utf8');
            delete headers['content-length'];
            res.writeHead(up.statusCode, { ...headers, 'content-length': body.length });
            res.end(body);
          });
          return;
        }

        res.writeHead(up.statusCode, headers);
        up.pipe(res);
      },
    );
    proxied.on('error', () => { res.writeHead(502); res.end('upstream unreachable'); });
    req.pipe(proxied);
  });

  await new Promise((ok, fail) => {
    server.on('error', fail);
    server.listen(0, '127.0.0.1', ok);
  });
  return { base: `http://127.0.0.1:${server.address().port}`, reached, close: () => server.close() };
}

const files = (await readdir(dir).catch(() => {
  console.error(`no ${dir}/ directory. A site with no journey has not been tested for behaviour.`);
  process.exit(2);
})).filter((f) => f.endsWith('.spec.mjs')).sort();

if (!files.length) {
  console.error(`no *.spec.mjs in ${dir}/. verify.md, "The journey contract", says what one contains.`);
  process.exit(2);
}

console.log(`\n  journeys, ${files.length} against ${base}\n`);
let failed = 0;

/* If the proxy cannot start, the specs still run — against the real base, as before — and the
   route file says so rather than claiming an empty journey reached nothing. A missing
   recording is a gap in coverage, not a passing run. */
let recorder = null;
try {
  recorder = await startRecordingProxy(base);
} catch (e) {
  console.log(`  note  routes were not recorded: ${String(e).slice(0, 80)}\n`);
}
const specBase = recorder?.base ?? base;

/* Not spawnSync. The recording proxy lives in this process, and a synchronous child blocks
   the event loop that would have answered it — the spec then times out on its first
   navigation against a server that is right here and cannot reply. */
const runSpec = (file) => new Promise((done) => {
  const child = spawn(process.execPath, [resolve(join(dir, file))], {
    env: { ...process.env, BASE: specBase },
  });
  let out = '';
  child.stdout.on('data', (b) => { out += b; });
  child.stderr.on('data', (b) => { out += b; });
  const kill = setTimeout(() => child.kill('SIGKILL'), 120000);
  child.on('close', (status, signal) => { clearTimeout(kill); done({ status, signal, out }); });
});

for (const f of files) {
  const r = await runSpec(f);
  const out = r.out.trim();
  if (r.status === 0) {
    console.log(`  ok    ${f}`);
  } else {
    failed++;
    console.log(`  FAIL  ${f}${r.signal ? ` (${r.signal})` : ''}`);
    for (const line of out.split('\n')) console.log(`        ${line}`);
  }
}

recorder?.close();

const reached = [...(recorder?.reached ?? [])].sort();
await mkdir(join(routesOut, '..'), { recursive: true });
await writeFile(routesOut, JSON.stringify({
  base,
  recorded: recorder !== null,
  specs: files,
  routes: reached,
}, null, 2) + '\n');

console.log(`  routes reached: ${reached.length ? reached.join('  ') : 'none recorded'}`);
console.log(`\n  ${failed ? `${failed} of ${files.length} failed` : `${files.length} passed`}\n`);
process.exit(failed ? 1 : 0);
