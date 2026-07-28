import { readFile, writeFile, mkdir } from 'node:fs/promises';
const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n/g, '\n').trim();
const fk = strip(await readFile('site/assets/cask-firkin.svg', 'utf8'));
const kk = strip(await readFile('site/assets/cask-kilderkin.svg', 'utf8'));
const mk = strip(await readFile('site/assets/mark.svg', 'utf8'));

const page = (t, css, body) => `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${t}</title>
<style>*{box-sizing:border-box}
${css}</style></head><body>
${body}
</body></html>
`;

/* A — the board */
await mkdir('directions/a', { recursive: true });
await writeFile('directions/a/index.html', page('Direction A — the board', `
:root{--bg:#0e1012;--row:#15181b;--ink:#eceff1;--ink-2:#9aa3ab;--rule:#262b30;--amber:#f0a92c;--red:#ff7a63}
body{margin:0;background:var(--bg);color:var(--ink);font:18px/1.4 ui-sans-serif,system-ui,sans-serif}
.bar{display:flex;align-items:center;gap:16px;padding:14px 26px;border-bottom:2px solid var(--rule)}
.bar svg{height:22px;width:auto;color:var(--amber)}
.bar b{font-size:19px;letter-spacing:-.01em}
.bar .when{margin-left:auto;font:15px ui-monospace,monospace;color:var(--ink-2)}
table{width:100%;border-collapse:collapse}
th{text-align:left;font:12px/1 ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;
   color:var(--ink-2);font-weight:400;padding:16px 26px 10px;border-bottom:1px solid var(--rule)}
td{padding:16px 26px;border-bottom:1px solid var(--rule);font-size:22px;vertical-align:middle}
td svg{height:38px;width:auto;color:var(--ink-2)}
.pub{font-weight:600}
.num{font:600 26px ui-monospace,monospace;font-variant-numeric:tabular-nums}
.state{font:600 15px ui-sans-serif,system-ui;letter-spacing:.1em;text-transform:uppercase;
       padding:6px 12px;border:2px solid currentColor;display:inline-block}
.out{color:var(--amber)}.due{color:var(--ink)}.late{color:var(--red)}
`, `
<div class="bar">${mk}<b>Stalbridge cask desk</b><span class="when">Thu 06:40 · dray in at 07:15</span></div>
<table>
  <thead><tr><th>Size</th><th>Where</th><th>Out</th><th>Due back</th><th>State</th></tr></thead>
  <tbody>
    <tr><td>${kk}</td><td class="pub">The Feathers, Marram</td><td class="num">4</td>
        <td class="num">Today</td><td><span class="state due">Due</span></td></tr>
    <tr><td>${fk}</td><td class="pub">Sowerby Arms</td><td class="num">2</td>
        <td class="num">−3 d</td><td><span class="state late">Overdue</span></td></tr>
    <tr><td>${fk}</td><td class="pub">Kell &amp; Anchor</td><td class="num">6</td>
        <td class="num">Mon</td><td><span class="state out">On trade</span></td></tr>
  </tbody>
</table>
`));
await writeFile('directions/a/NOTE.md', `# Direction A — the board

Read from four feet, in gloves, while a dray waits. Type at departure-board scale, five
columns and no more, and the state written as a word inside a bordered chip so it survives a
scratched screen, a cellar light and a colourblind cellarman. The cask silhouette does the
work a size column would otherwise do.

- composition: a single table at read-across-the-room scale, no chrome above it
- type: large system sans with very large mono figures, four sizes total
- colour: near-black ground, one amber, red reserved for late
- imagery: cask silhouettes carrying size, one per row
- rhythm: one continuous field with heavy rules
`);

/* B — the log book */
await mkdir('directions/b', { recursive: true });
await writeFile('directions/b/index.html', page('Direction B — the log book', `
:root{--paper:#fbfaf7;--ink:#16150f;--ink-2:#5a564a;--rule:#ddd8c9;--red:#9c2b12}
body{margin:0;background:var(--paper);color:var(--ink);
     font:13px/1.5 ui-monospace,'SF Mono','Cascadia Mono',monospace}
.wrap{max-width:900px;margin:0 auto;padding:20px 22px 60px}
h1{font:600 14px/1 ui-monospace,monospace;letter-spacing:.2em;text-transform:uppercase;
   margin:0 0 4px}
.sub{color:var(--ink-2);margin:0 0 18px}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-weight:400;color:var(--ink-2);border-bottom:1px solid var(--ink);
   padding:0 10px 5px 0;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
td{padding:5px 10px 5px 0;border-bottom:1px solid var(--rule);font-variant-numeric:tabular-nums;
   white-space:nowrap}
.cond{color:var(--red);font-weight:600}
`, `
<div class="wrap">
  <h1>Stalbridge cellar log</h1>
  <p class="sub">Week 31 · every movement, most recent first · duty point at the gate</p>
  <table>
    <thead><tr><th>When</th><th>Gyle</th><th>Size</th><th>Qty</th><th>Movement</th><th>Where</th><th>Note</th></tr></thead>
    <tbody>
      <tr><td>Thu 06:12</td><td>214</td><td>KIL</td><td>4</td><td>collect</td><td>The Feathers</td><td>2 wet</td></tr>
      <tr><td>Wed 16:40</td><td>212</td><td>FIR</td><td>2</td><td>drop</td><td>Sowerby Arms</td><td></td></tr>
      <tr><td>Wed 09:05</td><td>211</td><td>FIR</td><td>1</td><td>collect</td><td>Kell &amp; Anchor</td><td class="cond">condemned, shive seat</td></tr>
      <tr><td>Tue 15:22</td><td>214</td><td>KIL</td><td>6</td><td>drop</td><td>Kell &amp; Anchor</td><td></td></tr>
    </tbody>
  </table>
</div>
`));
await writeFile('directions/b/NOTE.md', `# Direction B — the log book

The cellar log as it exists on paper: one line per movement, most recent at the top, the whole
week on one screen. Set entirely in mono at 13px so the columns line up without any rules
between them.

Its weakness is the same as the paper log's: it is a record, not a working surface, and it is
unreadable from more than about two feet — which is where this team stands.

- composition: dense chronological log starting immediately
- type: mono throughout at one small size
- colour: paper white, ink, red reserved for condemned
- imagery: deliberately imageless
- rhythm: one continuous field with hairlines
`);

/* C — rail and pane */
await mkdir('directions/c', { recursive: true });
await writeFile('directions/c/index.html', page('Direction C — rail and pane', `
:root{--bg:#eef0f2;--pane:#fff;--ink:#14171a;--ink-2:#596069;--rule:#d3d8dd;--blue:#1b4f8f}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 ui-sans-serif,system-ui,sans-serif}
.split{display:grid;grid-template-columns:minmax(0,280px) minmax(0,1fr);min-height:100vh}
.rail{background:var(--pane);border-right:1px solid var(--rule);padding:16px 0}
.rail h2{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-2);
         margin:0 0 8px;padding:0 16px}
.rail a{display:flex;justify-content:space-between;padding:11px 16px;text-decoration:none;
        color:inherit;border-left:3px solid transparent}
.rail a[aria-current=true]{background:#e8eef7;border-left-color:var(--blue);font-weight:600}
.rail .n{font:14px ui-monospace,monospace;color:var(--ink-2)}
.pane{padding:22px 26px}
.pane h1{font-size:1.5rem;margin:0 0 4px;letter-spacing:-.02em}
.pane .sub{color:var(--ink-2);margin:0 0 20px}
.card{background:var(--pane);border:1px solid var(--rule);border-radius:8px;padding:14px;
      display:flex;gap:14px;align-items:center;margin-bottom:10px;max-width:560px}
.card svg{height:34px;width:auto;color:var(--ink-2)}
.card b{display:block}
.card .m{margin-left:auto;font:14px ui-monospace,monospace;color:var(--ink-2)}
`, `
<div class="split">
  <div class="rail">
    <h2>On trade</h2>
    <a href="#" aria-current="true">The Feathers, Marram <span class="n">4</span></a>
    <a href="#">Sowerby Arms <span class="n">2</span></a>
    <a href="#">Kell &amp; Anchor <span class="n">6</span></a>
  </div>
  <div class="pane">
    <h1>The Feathers, Marram</h1>
    <p class="sub">Four casks out, all due back today. Dray arrives 07:15.</p>
    <div class="card">${kk}<span><b>Kilderkin · gyle 214</b>Racked 18 July</span><span class="m">due today</span></div>
    <div class="card">${kk}<span><b>Kilderkin · gyle 214</b>Racked 18 July</span><span class="m">due today</span></div>
    <div class="card">${fk}<span><b>Firkin · gyle 212</b>Racked 21 July</span><span class="m">due today</span></div>
  </div>
</div>
`));
await writeFile('directions/c/NOTE.md', `# Direction C — rail and pane

Pubs on the left, that pub's casks on the right. The argument is that a cellarman works one
account at a time when the dray is at the door, so the interface should scope to one pub and
show everything about it.

- composition: master and detail, two panes side by side
- type: system sans at reading size, mono only for counts
- colour: cool grey ground, white panes, one blue
- imagery: cask silhouettes small, one per card
- rhythm: a rail beside a stack of cards
`);
console.log('three comps written');
