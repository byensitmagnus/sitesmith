import { readFile, writeFile } from 'node:fs/promises';
const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n/g, '\n').trim();
const tag = (svg, id) => svg.replace('<svg ', `<svg data-asset="${id}" `);
const FK = tag(strip(await readFile('site/assets/cask-firkin.svg', 'utf8')), 'cask-firkin');
const KK = tag(strip(await readFile('site/assets/cask-kilderkin.svg', 'utf8')), 'cask-kilderkin');
const MK = tag(strip(await readFile('site/assets/mark.svg', 'utf8')), 'logo-primary');

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cask desk — Stalbridge Brewery</title>
<meta name="description" content="What is out on trade, what is due back, and what the dray brought in this morning.">
<link rel="icon" href="assets/favicon.svg">
<style>
:root{
  --bg:#0e1012; --surface:#15181b; --surface-2:#1c2126; --surface-3:#242b31;
  --ink:#eceff1; --ink-2:#a4adb5; --ink-3:#8a939b;
  --line:#262b30; --line-2:#39424a;
  --accent:#f0a92c; --on-accent:#171308; --accent-soft:#33270f;
  --bad:#ff8168; --bad-soft:#331812;
  --ok:#7fd18d; --ok-soft:#12291a;
  --focus:#f0a92c;

  --font-body:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-display:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-mono:ui-monospace,'SF Mono','Cascadia Mono','Segoe UI Mono',monospace;
  --text-micro:.75rem; --text-small:.9375rem; --text-body:1.125rem;
  --text-figure:1.625rem; --text-h2:1.25rem;
  --leading-body:1.4; --measure:62ch;

  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:72px;
  --container:1500px; --gutter:26px;

  --radius-edge:3px;
  --elev-0:none;
  --motion-fast:100ms; --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:light){
  :root{
    --bg:#eceef0; --surface:#fbfbfc; --surface-2:#f1f3f5; --surface-3:#e4e8ea;
    --ink:#12161a; --ink-2:#4a525a; --ink-3:#586069; --line:#d2d7db; --line-2:#b4bcc3;
    --accent:#7a4d00; --on-accent:#ffffff; --accent-soft:#f7ecd6;
    --bad:#8f2711; --bad-soft:#f7e2dd; --ok:#1f5e2c; --ok-soft:#e0efe3; --focus:#12161a;
  }
}
*{box-sizing:border-box}
html{color-scheme:dark light}
body{margin:0;background:var(--bg);color:var(--ink);
     font:var(--text-body)/var(--leading-body) var(--font-body);-webkit-font-smoothing:antialiased}
:where(a,button,input,select,summary):focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.skip{position:absolute;left:-9999px}
.skip:focus{left:var(--gutter);top:var(--space-2);background:var(--surface);
            padding:var(--space-2) var(--space-3);z-index:5}
.wrap{max-width:var(--container);margin:0 auto;padding:0 var(--gutter)}

/* ── the bar ──────────────────────────────────────────────────────────── */
.bar{display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap;
     padding:var(--space-4) 0;border-bottom:2px solid var(--line-2)}
.bar .mark{display:flex;align-items:center;gap:var(--space-3);font-weight:650;
           font-size:var(--text-body);color:inherit;text-decoration:none}
.bar .mark svg{height:22px;width:auto;color:var(--accent);flex:none}
.bar h1{font:650 var(--text-small)/1 var(--font-display);margin:0;color:var(--ink-2);
        letter-spacing:.02em}
.bar .clock{margin-left:auto;font:var(--text-small)/1 var(--font-mono);color:var(--ink-2);
            font-variant-numeric:tabular-nums}
.bar .count{font:600 var(--text-small)/1 var(--font-mono);color:var(--ink);
            background:var(--surface-2);padding:var(--space-2) var(--space-3);
            border-radius:var(--radius-edge);font-variant-numeric:tabular-nums}

/* ── filters: buttons, not a select, because gloves ───────────────────── */
.filters{display:flex;gap:var(--space-2);flex-wrap:wrap;padding:var(--space-5) 0 var(--space-3)}
.filters button{font:600 var(--text-small)/1 var(--font-body);
  padding:var(--space-3) var(--space-4);min-height:48px;
  background:var(--surface);color:var(--ink);border:2px solid var(--line-2);
  border-radius:var(--radius-edge);cursor:pointer;transition:border-color var(--motion-fast) var(--ease)}
.filters button[aria-pressed=true]{background:var(--accent);color:var(--on-accent);
                                   border-color:var(--accent)}

/* ── the board ────────────────────────────────────────────────────────── */
table{width:100%;border-collapse:collapse}
caption{text-align:left;font:var(--text-micro)/1.5 var(--font-mono);letter-spacing:.16em;
        text-transform:uppercase;color:var(--ink-3);padding:var(--space-3) 0}
th{text-align:left;font:var(--text-micro)/1 var(--font-mono);letter-spacing:.16em;
   text-transform:uppercase;color:var(--ink-3);font-weight:400;
   padding:0 var(--space-4) var(--space-3) 0;border-bottom:2px solid var(--line-2)}
td{padding:var(--space-4) var(--space-4) var(--space-4) 0;border-bottom:1px solid var(--line);
   vertical-align:middle}
tr.row:focus-within td{background:var(--surface)}
td svg{height:40px;width:auto;color:var(--ink-2);display:block}
.pub{font-weight:600}
.gyle{display:block;color:var(--ink-2);font:var(--text-small)/1.4 var(--font-mono)}
.qty{font:650 var(--text-figure)/1 var(--font-mono);font-variant-numeric:tabular-nums}
.due{font:var(--text-body)/1 var(--font-mono);font-variant-numeric:tabular-nums}
.state{display:inline-block;font:650 var(--text-small)/1 var(--font-body);letter-spacing:.1em;
       text-transform:uppercase;padding:var(--space-2) var(--space-3);
       border:2px solid currentColor;border-radius:var(--radius-edge);white-space:nowrap}
.s-out{color:var(--accent)} .s-due{color:var(--ink)} .s-late{color:var(--bad)}
.s-in{color:var(--ok)}
.act{font:650 var(--text-small)/1 var(--font-body);min-height:48px;
     padding:var(--space-3) var(--space-4);background:var(--surface-2);color:var(--ink);
     border:2px solid var(--line-2);border-radius:var(--radius-edge);cursor:pointer;white-space:nowrap}
.act:hover{border-color:var(--ink-2)}
.act[disabled]{color:var(--ink-3);border-color:var(--line);cursor:not-allowed}

/* ── booking in ───────────────────────────────────────────────────────── */
tr.book{display:none}
tr.book.open{display:table-row}
tr.book td{background:var(--surface);padding:var(--space-5) var(--space-4) var(--space-6)}
.bk{display:flex;gap:var(--space-6);flex-wrap:wrap;align-items:flex-start}
fieldset{border:0;margin:0;padding:0}
legend{font:var(--text-micro)/1 var(--font-mono);letter-spacing:.16em;text-transform:uppercase;
       color:var(--ink-3);padding:0 0 var(--space-3)}
.opts{display:flex;gap:var(--space-2);flex-wrap:wrap}
.opt{display:flex;align-items:center;gap:var(--space-2);min-height:48px;
     padding:var(--space-2) var(--space-4);background:var(--surface-2);
     border:2px solid var(--line-2);border-radius:var(--radius-edge);cursor:pointer;
     font-size:var(--text-small);font-weight:600}
.opt input{width:20px;height:20px;accent-color:var(--accent);margin:0}
.opt:has(input:checked){border-color:var(--accent);background:var(--accent-soft)}
.num-field label{display:block;font:var(--text-micro)/1 var(--font-mono);letter-spacing:.16em;
                 text-transform:uppercase;color:var(--ink-3);margin-bottom:var(--space-3)}
.num-field input{width:8ch;min-height:48px;font:var(--text-body)/1 var(--font-mono);
  font-variant-numeric:tabular-nums;padding:var(--space-2) var(--space-3);
  background:var(--surface-2);color:var(--ink);border:2px solid var(--line-2);
  border-radius:var(--radius-edge)}
.num-field input[aria-invalid=true]{border-color:var(--bad);background:var(--bad-soft)}
.hint{font:var(--text-micro)/1.6 var(--font-mono);color:var(--ink-3);margin:var(--space-2) 0 0;
      max-width:38ch}
.err{font:650 var(--text-small)/1.4 var(--font-body);color:var(--bad);margin:var(--space-3) 0 0;
     max-width:44ch}
.err:empty{display:none}
.confirm{font:650 var(--text-body)/1 var(--font-body);min-height:48px;align-self:flex-end;
         padding:var(--space-3) var(--space-5);background:var(--accent);color:var(--on-accent);
         border:0;border-radius:var(--radius-edge);cursor:pointer}
.confirm[disabled]{background:var(--surface-3);color:var(--ink-3);cursor:not-allowed}

/* ── empty state, history, status ─────────────────────────────────────── */
.empty{border:2px dashed var(--line-2);border-radius:var(--radius-edge);
       padding:var(--space-6);margin:var(--space-5) 0;color:var(--ink-2);max-width:var(--measure)}
.status{font:650 var(--text-small)/1.5 var(--font-body);color:var(--ok);
        padding:var(--space-3) 0;min-height:2.4em}
h2{font:650 var(--text-h2)/1.3 var(--font-display);margin:var(--space-7) 0 var(--space-2)}
.log{width:100%;border-collapse:collapse;font:var(--text-small)/1.5 var(--font-mono);
     max-width:900px}
.log th{font-size:var(--text-micro);border-bottom:1px solid var(--line-2)}
.log td{padding:var(--space-2) var(--space-4) var(--space-2) 0;font-variant-numeric:tabular-nums;
        border-bottom:1px solid var(--line)}
.log svg{height:20px;opacity:.7}
footer{border-top:1px solid var(--line);margin-top:var(--space-7);
       padding:var(--space-4) 0 var(--space-8);color:var(--ink-3);font-size:var(--text-small)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
@media (max-width:820px){
  th.h,td.h{display:none}
  td{padding-right:var(--space-3)}
  .bk{gap:var(--space-5)}
}
@media (max-width:620px){
  thead{position:absolute;left:-9999px}
  table,tbody,tr.row,tr.row td{display:block;width:100%}
  tr.row{display:grid;grid-template-columns:44px minmax(0,1fr);gap:var(--space-2) var(--space-4);
         align-items:center;padding:var(--space-4) 0;border-bottom:1px solid var(--line)}
  tr.row td{border:0;padding:0}
  tr.row td:first-child{grid-row:1/span 4}
  tr.row td:last-child{padding-top:var(--space-2)}
  tr.row .act{width:100%}
  tr.book.open td{padding:var(--space-4) 0 var(--space-5)}
  .log{font-size:var(--text-micro)}
  .log td,.log th{padding-right:var(--space-3)}
}
</style>
</head>
<body>
<a class="skip" href="#board">Skip to the board</a>

<div class="wrap">
  <div class="bar">
    <a class="mark" href="/">${MK} Stalbridge cask desk</a>
    <h1 class="line">Cellar, Thursday morning</h1>
    <span class="clock">06:40 · dray in at 07:15</span>
    <span class="count"><span data-on-trade>0</span> on trade</span>
  </div>

  <div class="filters" role="group" aria-label="Show">
    <button type="button" data-filter="all" aria-pressed="true">Everything</button>
    <button type="button" data-filter="due" aria-pressed="false">Due back today</button>
    <button type="button" data-filter="late" aria-pressed="false">Overdue</button>
  </div>

  <main id="board">
    <table>
      <caption data-caption></caption>
      <thead>
        <tr>
          <th scope="col">Size</th>
          <th scope="col">Where</th>
          <th scope="col">Casks</th>
          <th scope="col" class="h">Due back</th>
          <th scope="col">State</th>
          <th scope="col"><span class="skip">Book in</span></th>
        </tr>
      </thead>
      <tbody data-board></tbody>
    </table>
    <div data-empty></div>
    <p class="status" role="status" data-status></p>

    <h2>Booked in this week</h2>
    <table class="log">
      <thead><tr><th scope="col">When</th><th scope="col">Size</th><th scope="col">Where</th>
        <th scope="col">Casks</th><th scope="col">Condition</th><th scope="col">Ullage</th></tr></thead>
      <tbody data-log><tr><td colspan="6" style="color:var(--ink-3)">Nothing booked in yet this week.</td></tr></tbody>
    </table>
  </main>

  <footer>
    <p>Stalbridge Brewery cask desk. A fictional brewery, built as a design pilot. Casks, gyles
      and accounts here are invented; the duty rules they follow are not.</p>
  </footer>
</div>

<script>
/* Casks out on trade. In a real cellar these come from the delivery notes; the shape is what
   matters — every consignment has a size, a pub, a count and a date it is due back, and a
   cask cannot go back on the filling line until it has been through the wash. */
const OUT = [
  { id:'F-214-FE', pub:'The Feathers, Marram', gyle:214, size:'kilderkin', qty:4, due:0 },
  { id:'F-212-SO', pub:'Sowerby Arms', gyle:212, size:'firkin', qty:2, due:-3 },
  { id:'F-214-KA', pub:'Kell & Anchor', gyle:214, size:'firkin', qty:6, due:4 },
  { id:'F-209-BR', pub:'The Bridge, Halloughton', gyle:209, size:'kilderkin', qty:3, due:0 },
];
const CASK_SVG = { firkin: \`${FK.replace(/`/g, '\\`')}\`, kilderkin: \`${KK.replace(/`/g, '\\`')}\` };
const MAX_ULLAGE = { firkin: 9, kilderkin: 18 };

const board = document.querySelector('[data-board]');
const emptyBox = document.querySelector('[data-empty]');
const statusEl = document.querySelector('[data-status]');
const captionEl = document.querySelector('[data-caption]');
const onTradeEl = document.querySelector('[data-on-trade]');
const logBody = document.querySelector('[data-log]');
const filters = [...document.querySelectorAll('[data-filter]')];

let filter = 'all';
const booked = [];

const dueWord = (d) => d < 0 ? \`\${Math.abs(d)} d late\` : d === 0 ? 'Today' : \`+\${d} d\`;
const stateOf = (c) => c.due < 0 ? ['late', 'Overdue'] : c.due === 0 ? ['due', 'Due today'] : ['out', 'On trade'];
const visible = () => OUT.filter(c => filter === 'all' ||
  (filter === 'due' && c.due === 0) || (filter === 'late' && c.due < 0));

function render(message) {
  const rows = visible();
  onTradeEl.textContent = String(OUT.reduce((s, c) => s + c.qty, 0));
  captionEl.textContent = \`\${rows.length} of \${OUT.length} consignments · \` +
    \`\${rows.reduce((s, c) => s + c.qty, 0)} casks\`;
  board.innerHTML = '';

  if (!rows.length) {
    emptyBox.innerHTML = OUT.length
      ? \`<div class="empty"><strong>Nothing matches that filter.</strong> Everything still out
           is on the full board — press <em>Everything</em> to see it.</div>\`
      : \`<div class="empty"><strong>The cellar is clear.</strong> Every cask is back and washed.
           New consignments appear here as the dray goes out.</div>\`;
    return;
  }
  emptyBox.innerHTML = '';

  for (const c of rows) {
    const [cls, word] = stateOf(c);
    const tr = document.createElement('tr');
    tr.className = 'row';
    tr.innerHTML = \`
      <td>\${CASK_SVG[c.size]}</td>
      <td><span class="pub">\${c.pub}</span><span class="gyle">Gyle \${c.gyle} · \${c.size}</span></td>
      <td><span class="qty">\${c.qty}</span></td>
      <td class="h"><span class="due">\${dueWord(c.due)}</span></td>
      <td><span class="state s-\${cls}">\${word}</span></td>
      <td></td>\`;
    const btn = document.createElement('button');
    btn.className = 'act';
    btn.type = 'button';
    btn.textContent = 'Book in';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'bk-' + c.id);
    tr.lastElementChild.append(btn);
    board.append(tr);

    const bk = document.createElement('tr');
    bk.className = 'book';
    bk.id = 'bk-' + c.id;
    bk.innerHTML = \`
      <td colspan="6">
        <div class="bk">
          <fieldset>
            <legend>How many came back</legend>
            <div class="num-field">
              <label class="skip" for="q-\${c.id}">Casks returned</label>
              <input id="q-\${c.id}" type="number" min="1" max="\${c.qty}" step="1" value="\${c.qty}"
                     inputmode="numeric" aria-describedby="qh-\${c.id}">
              <p class="hint" id="qh-\${c.id}">\${c.qty} went out. Book in fewer if some stayed.</p>
            </div>
          </fieldset>
          <fieldset>
            <legend>Condition</legend>
            <div class="opts">
              <label class="opt"><input type="radio" name="cond-\${c.id}" value="empty" checked> Empty</label>
              <label class="opt"><input type="radio" name="cond-\${c.id}" value="wet"> Returned wet</label>
              <label class="opt"><input type="radio" name="cond-\${c.id}" value="condemned"> Condemned</label>
            </div>
          </fieldset>
          <fieldset data-ullage hidden>
            <legend>Ullage</legend>
            <div class="num-field">
              <label class="skip" for="u-\${c.id}">Ullage in pints</label>
              <input id="u-\${c.id}" type="number" min="1" max="\${MAX_ULLAGE[c.size] * 8}" step="1"
                     inputmode="numeric" aria-describedby="uh-\${c.id}">
              <p class="hint" id="uh-\${c.id}">Pints left in the cask, measured before tipping.
                A \${c.size} holds \${MAX_ULLAGE[c.size] * 8}.</p>
            </div>
          </fieldset>
          <button class="confirm" type="button">Book in</button>
        </div>
        <p class="err" role="alert"></p>
      </td>\`;
    board.append(bk);

    const qty = bk.querySelector(\`#q-\${c.id}\`);
    const ullageSet = bk.querySelector('[data-ullage]');
    const ullage = bk.querySelector(\`#u-\${c.id}\`);
    const err = bk.querySelector('.err');
    const confirm = bk.querySelector('.confirm');
    const conds = [...bk.querySelectorAll(\`input[name="cond-\${c.id}"]\`)];

    const chosen = () => conds.find(r => r.checked).value;

    function validate() {
      const n = Number(qty.value);
      if (!Number.isInteger(n) || n < 1 || n > c.qty) {
        err.textContent = \`\${c.qty} went out to \${c.pub}. You cannot book in more than that.\`;
        qty.setAttribute('aria-invalid', 'true');
        confirm.disabled = true;
        return null;
      }
      qty.removeAttribute('aria-invalid');

      if (chosen() === 'wet') {
        const u = Number(ullage.value);
        if (!ullage.value.trim() || !Number.isInteger(u) || u < 1 || u > MAX_ULLAGE[c.size] * 8) {
          err.textContent = 'A cask back wet is not empty. Measure the ullage before it is tipped — duty is worked out from it.';
          ullage.setAttribute('aria-invalid', 'true');
          confirm.disabled = true;
          return null;
        }
        ullage.removeAttribute('aria-invalid');
      }
      err.textContent = '';
      confirm.disabled = false;
      return { n, cond: chosen(), ullage: chosen() === 'wet' ? Number(ullage.value) : null };
    }

    conds.forEach(r => r.addEventListener('change', () => {
      ullageSet.hidden = chosen() !== 'wet';
      validate();
    }));
    qty.addEventListener('input', validate);
    ullage.addEventListener('input', validate);

    btn.addEventListener('click', () => {
      const open = bk.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Cancel' : 'Book in';
      if (open) { validate(); qty.focus(); } else btn.focus();
    });

    confirm.addEventListener('click', () => {
      const v = validate();
      if (!v) return;
      c.qty -= v.n;
      booked.unshift({ when: 'Thu 06:4' + (booked.length % 10), size: c.size, pub: c.pub,
                       n: v.n, cond: v.cond, ullage: v.ullage });
      if (c.qty === 0) OUT.splice(OUT.indexOf(c), 1);
      renderLog();
      const note = v.cond === 'wet' ? \`, \${v.ullage} pints ullage\`
                 : v.cond === 'condemned' ? ', condemned' : '';
      render(\`\${v.n} \${c.size}\${v.n > 1 ? 's' : ''} booked in from \${c.pub}\${note}. \` +
             \`They go to the wash before they can be filled again.\`);
      document.querySelector('[data-filter="' + filter + '"]').focus();
    });
  }
  if (message) statusEl.textContent = message;
}

function renderLog() {
  logBody.innerHTML = booked.length
    ? booked.map(b => \`<tr><td>\${b.when}</td><td>\${CASK_SVG[b.size]}</td><td>\${b.pub}</td>
        <td>\${b.n}</td><td>\${b.cond}</td><td>\${b.ullage ?? '—'}</td></tr>\`).join('')
    : '<tr><td colspan="6" style="color:var(--ink-3)">Nothing booked in yet this week.</td></tr>';
}

filters.forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.filter;
  filters.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
  render();
}));

render();
</script>
</body>
</html>
`;

await writeFile('site/index.html', html);
console.log('site written');
