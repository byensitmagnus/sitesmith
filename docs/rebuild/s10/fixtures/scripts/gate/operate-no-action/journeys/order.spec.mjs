#!/usr/bin/env node
/* Fixture journey. It is deliberately the smallest thing that is still a journey rather
   than a smoke test: it asserts against BASE and exits non-zero when the page is not
   there, so a run that cannot reach the site fails instead of reporting nothing. The gate
   only checks that a spec exists; this file exists so the fixture is not a lie about one. */
const BASE = process.env.BASE ?? 'http://localhost:4321';
const res = await fetch(BASE).catch(() => null);
if (!res || !res.ok) {
  console.error(`no page at ${BASE}`);
  process.exit(1);
}
const html = await res.text();
if (!/<h1/i.test(html)) {
  console.error('the page has no h1, so there is no path to drive');
  process.exit(1);
}
console.log('ok  the page answers and has a heading');
