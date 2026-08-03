#!/usr/bin/env node
/**
 * The one path this page has, driven for real.
 *
 *   BASE=http://localhost:4322/pilots/04-byens-it node journeys/jobs.spec.mjs
 *
 * verify.md's journey contract asks for four assertions and says fewer is a smoke test.
 * This page sells nothing on itself, so it has no checkout and no form; what it has is a
 * scroll timeline that changes which job is current, and every action on it is a link.
 * The four below are the four this page can actually be held to, and each one is a real
 * failure mode rather than a box:
 *
 *   1. Something observably changed. The current job moves from 01 to 02 on scroll.
 *   2. The change was announced. It is carried by aria-current on the rail link, which is
 *      what a screen reader reads, not by colour alone.
 *   3. The failure path was exercised. With prefers-reduced-motion the timeline is switched
 *      off, and the page must still present every job and every action. A page whose
 *      content only exists for someone who scrolls is the failure this asserts against.
 *   4. The whole path completes on the keyboard alone, with a visible focus indicator at
 *      every stop.
 */

/* Resolved from the working directory, the same way verify.mjs does it. Playwright lives
   in the project being tested, not next to a spec file, and importing it by bare specifier
   from here fails on every machine that did not install it into this exact folder. */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
const pw = await (async () => {
  try {
    return await import('playwright');
  } catch {
    return await import(pathToFileURL(requireFromCwd.resolve('playwright')).href);
  }
})();
const chromium = pw.chromium ?? pw.default?.chromium;
if (!chromium) {
  console.error('playwright resolved but exposes no chromium; nothing was tested');
  process.exit(2);
}

const BASE = process.env.BASE ?? 'http://localhost:4322/pilots/04-byens-it';
const fails = [];
const check = (ok, what, detail) => {
  if (ok) console.log(`  ok    ${what}`);
  else {
    fails.push(what);
    console.log(`  FAIL  ${what}\n        ${detail}`);
  }
};

const browser = await chromium.launch();

/* 1 and 2: the current job changes, and the change is announced */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const before = await page.$eval('.rail a[aria-current="true"]', (a) => a.textContent.trim());
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.55));
  await page.waitForTimeout(600);
  const after = await page.$eval('.rail a[aria-current="true"]', (a) => a.textContent.trim());

  check(before !== after, 'the current job changes on scroll', `stayed on "${before}"`);
  check(
    /JOB 0[123]/.test(after),
    'the change is announced by aria-current, not by colour alone',
    `aria-current landed on "${after}", which does not name a job`,
  );
  await ctx.close();
}

/* 3: the failure path. Reduced motion switches the timeline off, and nothing may be lost */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const state = await page.evaluate(() => ({
    jobs: [...document.querySelectorAll('main section')].filter((s) => s.getClientRects().length).length,
    actions: [...document.querySelectorAll('a.act')].filter((a) => a.getClientRects().length).length,
    facts: [...document.querySelectorAll('.facts li')].filter((li) => li.getClientRects().length).length,
    open: getComputedStyle(document.documentElement).getPropertyValue('--open').trim(),
  }));

  check(
    state.jobs === 3 && state.actions === 4 && state.facts === 4,
    'with motion switched off, every job, action and fact is still present',
    `saw ${state.jobs} jobs, ${state.actions} actions, ${state.facts} facts`,
  );
  check(
    state.open === '1',
    'the case is left in its end state rather than its start state',
    `--open is "${state.open}", so the drawing is frozen half-built`,
  );
  await ctx.close();
}

/* 4: the whole path on the keyboard alone, with a visible indicator at every stop */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const reached = [];
  const invisible = [];
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        name: (el.textContent || '').trim().slice(0, 40),
        href: el.getAttribute('href') ?? null,
        focusVisible: el.matches(':focus-visible'),
        outline: `${cs.outlineStyle} ${cs.outlineWidth}`,
      };
    });
    if (!stop) break;
    reached.push(stop);
    if (stop.focusVisible && /none|0px/.test(stop.outline)) invisible.push(stop.name);
  }

  const hrefs = reached.map((s) => s.href).filter(Boolean);
  check(
    hrefs.some((h) => h.includes('gaming-computere')) && hrefs.some((h) => h.includes('it-support-erhverv')),
    'both jobs are reachable by keyboard alone',
    `reached ${hrefs.length} links and neither action was among them`,
  );
  check(
    invisible.length === 0,
    'every keyboard stop paints a focus indicator',
    `no visible outline at: ${invisible.join(', ')}`,
  );
  await ctx.close();
}

await browser.close();
console.log(`\n  ${fails.length ? `${fails.length} assertion(s) failed` : 'all assertions held'}\n`);
process.exit(fails.length ? 1 : 0);
