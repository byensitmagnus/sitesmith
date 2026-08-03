// journeys/ring-op.spec.mjs — the one thing this page exists to cause: a phone call.
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:5199';
const browser = await chromium.launch();
const problems = [];
const check = (name, ok, detail = '') => { if (!ok) problems.push(`${name}${detail ? ': ' + detail : ''}`); };

for (const width of [375, 1440]) {
  const height = width === 375 ? 812 : 900;
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });

  // The action exists, is a real link, and carries the number from the brief.
  const call = page.getByRole('link', { name: /Ring til Klinke og Datter/ }).first();
  check(`${width}: the call action exists`, (await call.count()) > 0);
  const href = await call.getAttribute('href');
  check(`${width}: it is a tel: link to the number in the brief`, href === 'tel:+4566124709', href ?? 'no href');

  // It is reachable before the visitor scrolls.
  const box = await call.boundingBox();
  check(`${width}: the action is above the fold`, box !== null && box.y + box.height <= height,
    box ? `bottom at ${Math.round(box.y + box.height)} of ${height}` : 'not laid out');

  // The failure path a tel: link really has: a device with no dialler. The number must
  // survive as readable text, not only as a link target.
  const body = await page.locator('body').innerText();
  const seen = (body.match(/66 12 47 09/g) ?? []).length;
  check(`${width}: the number is also readable text`, seen >= 2, `${seen} occurrence(s)`);

  // Keyboard: reach it without a pointer, and see the focus.
  let reached = false;
  for (let i = 0; i < 12 && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(() => (document.activeElement?.getAttribute('href') ?? '') === 'tel:+4566124709');
  }
  check(`${width}: the action is reachable by keyboard`, reached);
  check(`${width}: focus is visible on it`, reached && await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement);
    return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
  }));

  await page.close();
}

await browser.close();
console.log(problems.length ? 'FAIL\n  ' + problems.join('\n  ') : 'ok — the call action works at 375 and 1440');
process.exit(problems.length ? 1 : 0);
