import { chromium } from 'playwright';

const url = process.argv[2];
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 375, height: 712 }, isMobile: true, deviceScaleFactor: 2 });
const p = await c.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
// The CI runner's default sans and mono are wider than Windows'. Force a wide pair
// so the layout is measured against the font it will actually meet.
await p.addStyleTag({
  content: `*{font-family:'DejaVu Sans',Verdana,sans-serif !important}
            code,pre,kbd,.num,[class*=mono]{font-family:'DejaVu Sans Mono',monospace !important}`,
});
await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const name = (el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  const clipped = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true;
    }
    return false;
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();
    if (rect.right > vw + 1 && !clipped(el)) {
      out.push({ sel: name(el), right: Math.round(rect.right), text: (el.textContent || '').trim().slice(0, 60) });
    }
  }
  return { vw, overflow: document.documentElement.scrollWidth - vw, worst: out.slice(0, 8) };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
