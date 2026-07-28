/**
 * Writes the three direction comps, sharing the two drawings by inlining them from
 * site/assets. Inlined and not <img src> because currentColor does not cross an <img>
 * boundary — pilot 1 lost a comp to that and it is not worth losing another.
 *
 *   node build-comps.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n/g, '\n').trim();
const profile = strip(await readFile('site/assets/bell-profile.svg', 'utf8'));
const mark = strip(await readFile('site/assets/mark.svg', 'utf8'));

const page = (title, css, body) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
*{box-sizing:border-box}
${css}
</style>
</head>
<body>
${body}
</body>
</html>
`;

/* ── A — the profile ───────────────────────────────────────────────────── */
await mkdir('directions/a', { recursive: true });
await writeFile('directions/a/index.html', page('Direction A — the profile', `
:root{
  --ground:#131110; --ground-2:#1b1815; --metal:#c9ab6d; --ink:#e8e0d0;
  --ink-2:#9d937f; --rule:#332e27;
  --caps:'Optima','Palatino Linotype','Iowan Old Style',Georgia,serif;
  --mono:ui-monospace,'SF Mono','Cascadia Mono',monospace;
}
body{margin:0;background:var(--ground);color:var(--ink);
     font:16px/1.6 ui-sans-serif,system-ui,sans-serif}
.grid{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:56px;
      max-width:1220px;margin:0 auto;padding:0 28px}
.plate{position:sticky;top:0;align-self:start;padding-top:40px;color:var(--metal)}
.plate svg{width:100%;height:auto}
.plate figcaption{font:11px/1.6 var(--mono);letter-spacing:.12em;text-transform:uppercase;
                  color:var(--ink-2);margin-top:18px;border-top:1px solid var(--rule);padding-top:12px}
.col{padding:40px 0 90px}
.mark{display:flex;align-items:center;gap:11px;color:var(--metal);
      font:400 13px/1 var(--mono);letter-spacing:.26em;text-transform:uppercase}
.mark svg{width:20px;height:auto}
h1{font:400 clamp(2rem,4.2vw,3.1rem)/1.06 var(--caps);letter-spacing:.02em;
   text-transform:uppercase;margin:36px 0 0;max-width:13ch}
.lede{max-width:52ch;margin:22px 0 0;color:var(--ink-2);font-size:17px}
table{width:100%;border-collapse:collapse;margin-top:46px}
caption{text-align:left;font:11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;
        color:var(--ink-2);padding-bottom:12px}
th,td{text-align:right;padding:9px 0;border-bottom:1px solid var(--rule);
      font:14px/1 var(--mono);font-variant-numeric:tabular-nums}
th{color:var(--ink-2);font-weight:400;font-size:11px;letter-spacing:.14em;text-transform:uppercase}
th:first-child,td:first-child{text-align:left}
td.d{color:var(--metal)}
@media (max-width:860px){.grid{grid-template-columns:minmax(0,1fr);gap:0}
  .plate{position:static;max-width:230px}}
`, `
<div class="grid">
  <figure class="plate">
    ${profile}
    <figcaption>Tenor, 14 cwt 2 qr, before re-tuning · Marrow &amp; Kell 2019</figcaption>
  </figure>
  <div class="col">
    <span class="mark">${mark} Marrow &amp; Kell</span>
    <h1>A bell is tuned by taking metal away</h1>
    <p class="lede">There is no putting it back. We measure five partials before the bell
      goes on the machine, and we publish both sets of figures, because a foundry that will
      not show you the before is asking you to take the after on trust.</p>
    <table>
      <caption>Tenor, St Æthelburga's — before and after, in cents from equal temperament</caption>
      <thead><tr><th>Partial</th><th>Before</th><th>After</th><th>Moved</th></tr></thead>
      <tbody>
        <tr><td>Hum</td><td>−38</td><td class="d">−2</td><td>36</td></tr>
        <tr><td>Prime</td><td>+21</td><td class="d">+1</td><td>20</td></tr>
        <tr><td>Tierce</td><td>−14</td><td class="d">0</td><td>14</td></tr>
        <tr><td>Quint</td><td>+9</td><td class="d">+3</td><td>6</td></tr>
        <tr><td>Nominal</td><td>0</td><td class="d">0</td><td>0</td></tr>
      </tbody>
    </table>
  </div>
</div>
`));

/* ── B — the inscription ───────────────────────────────────────────────── */
await mkdir('directions/b', { recursive: true });
await writeFile('directions/b/index.html', page('Direction B — the inscription', `
:root{
  --lime:#f6f4ee; --ink:#191713; --ink-2:#5c564a; --rule:#d6d0c2;
  --caps:'Optima','Palatino Linotype','Iowan Old Style',Georgia,serif;
  --mono:ui-monospace,'SF Mono','Cascadia Mono',monospace;
}
body{margin:0;background:var(--lime);color:var(--ink);
     font:17px/1.65 ui-sans-serif,system-ui,sans-serif;text-align:center}
.wrap{max-width:900px;margin:0 auto;padding:52px 26px 100px}
.mark{font:400 12px/1 var(--mono);letter-spacing:.3em;text-transform:uppercase;color:var(--ink-2)}
h1{font:400 clamp(2.2rem,6vw,4.2rem)/1.12 var(--caps);letter-spacing:.06em;
   text-transform:uppercase;margin:60px auto 0;max-width:15ch}
.rule{width:64px;height:1px;background:var(--rule);margin:44px auto}
p{max-width:56ch;margin:0 auto 20px;color:var(--ink-2)}
.cast{font:400 15px/2 var(--caps);letter-spacing:.34em;text-transform:uppercase;
      color:var(--ink);margin:52px auto 0;max-width:40ch}
`, `
<div class="wrap">
  <span class="mark">Marrow &amp; Kell · bellfounders · est. 1863</span>
  <h1>Cast to be read from below</h1>
  <div class="rule"></div>
  <p>Every bell we cast carries its founder, its date and its dedication in the waist, in
    letters raised from the mould. They are set to be legible from a ringing chamber floor,
    which is thirty feet down and badly lit.</p>
  <p>We still cut our own stamps.</p>
  <p class="cast">Marrow et Kell me fecerunt · anno domini mmxxvi · in memoriam h. r. sowerby</p>
</div>
`));

/* ── C — the tuning book ───────────────────────────────────────────────── */
await mkdir('directions/c', { recursive: true });
await writeFile('directions/c/index.html', page('Direction C — the tuning book', `
:root{
  --bg:#e6e3dc; --card:#f4f2ec; --ink:#1c1a17; --ink-2:#5d574c;
  --rule:#c8c3b6; --sea:#1c5b57;
  --sans:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
  --mono:ui-monospace,'SF Mono','Cascadia Mono',monospace;
}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 var(--sans)}
.wrap{max-width:1140px;margin:0 auto;padding:26px 24px 80px}
.mark{display:flex;align-items:center;gap:9px;font-weight:700;font-size:16px}
.mark svg{width:18px;height:auto}
h1{font-size:1.9rem;line-height:1.16;letter-spacing:-.02em;margin:26px 0 6px;max-width:20ch}
.lede{color:var(--ink-2);max-width:56ch;margin:0 0 30px}
.ring{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:14px}
.bell{background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:14px}
.bell svg{width:34px;height:auto;color:var(--sea);display:block;margin-bottom:10px}
.bell h2{font-size:13px;margin:0;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-2)}
.bell dl{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;margin:9px 0 0}
.bell dt{font-size:12px;color:var(--ink-2)}
.bell dd{margin:0;text-align:right;font:12px/1.5 var(--mono);font-variant-numeric:tabular-nums}
.band{background:var(--card);margin-top:34px;padding:26px;border-radius:6px}
.band h2{margin:0 0 8px;font-size:1.15rem}
`, `
<div class="wrap">
  <span class="mark">${mark} Marrow &amp; Kell</span>
  <h1>Eight bells, and what each of them is doing wrong</h1>
  <p class="lede">The ring at St Æthelburga's, measured in March. Cards show the weight, the
    nominal, and how far each partial sits from where it should.</p>
  <div class="ring">
    <div class="bell">${mark}<h2>Treble</h2>
      <dl><dt>Weight</dt><dd>4-1-9</dd><dt>Nominal</dt><dd>F♯</dd><dt>Worst partial</dt><dd>−31</dd></dl></div>
    <div class="bell">${mark}<h2>Second</h2>
      <dl><dt>Weight</dt><dd>4-2-14</dd><dt>Nominal</dt><dd>E</dd><dt>Worst partial</dt><dd>−12</dd></dl></div>
    <div class="bell">${mark}<h2>Third</h2>
      <dl><dt>Weight</dt><dd>5-0-2</dd><dt>Nominal</dt><dd>D</dd><dt>Worst partial</dt><dd>+8</dd></dl></div>
    <div class="bell">${mark}<h2>Tenor</h2>
      <dl><dt>Weight</dt><dd>14-2-0</dd><dt>Nominal</dt><dd>B</dd><dt>Worst partial</dt><dd>−38</dd></dl></div>
  </div>
  <div class="band">
    <h2>What we would do</h2>
    <p>Take the tenor and the treble down, leave the rest hung. Two bells off the frame for
      nine weeks, and the tower keeps a ring of six in the meantime.</p>
  </div>
</div>
`));

console.log('three comps written');
