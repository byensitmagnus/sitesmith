#!/usr/bin/env node
/**
 * Draws the plate. Falkner & Vane, benchmark 10.
 *
 *   node tools/draw-plate.mjs          # prints the six <div class="row"> blocks
 *   node tools/draw-plate.mjs --cal    # prints the calendar row geometry as percentages
 *
 * Every number below comes from BRIEF.md "What is true" and nothing else. The drawing is a
 * rendering of measured values: the height of each strip is its thickness at a fixed scale,
 * the overhang at the right hand end is the temper column turned into an ordering, and the
 * dash rhythm on the top edge is the grain column turned into a notation. The last two are
 * notations and the page says so; the first is a measurement and the rules prove it.
 *
 * No <path> elements: the curves are sampled into <polygon> and <polyline> points, which is
 * also how a section is drawn on paper.
 */

const MM = 22;          // units per millimetre in the row viewBox
const BASE = 84;        // the baseline every strip stands on
const X0 = 56;          // where the cut edge is
const XFLAT = 372;      // where the flat run ends and the overhang begins
const X1 = 470;         // the far end
const W = 560, H = 132;

/** Temper, as an ordering rather than a measurement. Five words, five drops. */
const DROP = { 'very firm': 4, firm: 10, medium: 20, soft: 32, 'very soft': 44 };

/** Grain, as a dash rhythm on the top edge. Five words, five rhythms. */
const GRAIN = {
  'fine, close': '2 3',
  fine: '2 3',
  'pronounced, irregular': '6 4 2 8 4 3',
  coarse: '9 6',
  'loose, stretchy': '14 8',
  smooth: null,           // solid: there is nothing to notate
};

/* The six, ordered by thickness, thinnest first, because the two a binder actually weighs
   against each other are 1.2 and 1.4 and they have to end up adjacent. */
const LEATHERS = [
  { id: 'sheep',    name: 'Oak-tanned sheep',            mm: 0.8, temper: 'very soft', grain: 'smooth',                use: 'endpapers, doublures',    lead: '5 months' },
  { id: 'goat',     name: 'Oak-tanned goat',             mm: 1.2, temper: 'soft',      grain: 'pronounced, irregular', use: 'full-leather bindings',   lead: '11 months' },
  { id: 'mimosa',   name: 'Mimosa calf',                 mm: 1.3, temper: 'medium',    grain: 'fine',                  use: 'repair work, matching',   lead: '3 weeks' },
  { id: 'calf',     name: 'Oak-tanned calf',             mm: 1.4, temper: 'firm',      grain: 'fine, close',           use: 'book boards, spines',     lead: '4 weeks' },
  { id: 'belly',    name: 'Bark-tanned cowhide, belly',  mm: 2.4, temper: 'soft',      grain: 'loose, stretchy',       use: 'linings, gussets',        lead: '6 weeks' },
  { id: 'shoulder', name: 'Bark-tanned cowhide, shoulder', mm: 3.2, temper: 'very firm', grain: 'coarse',              use: 'saddlery, belts',         lead: '6 weeks' },
];

const r = (n) => Math.round(n * 10) / 10;

/** Quadratic sampled into points, so the shape needs no <path>. */
function quad(p0, p1, p2, steps = 8) {
  const out = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    out.push([
      u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
      u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    ]);
  }
  return out;
}

function row(L) {
  const t = L.mm * MM;
  const top = BASE - t;
  const drop = DROP[L.temper];
  const upper = [[X0, top], [XFLAT, top], ...quad([XFLAT, top], [428, top], [X1, top + drop])];
  const lower = [[X1, BASE + drop], ...quad([X1, BASE + drop], [428, BASE], [XFLAT, BASE]), [X0, BASE]];
  const pts = (a) => a.map(([x, y]) => `${r(x)},${r(y)}`).join(' ');
  const dash = GRAIN[L.grain];

  const label = `${L.name}, drawn in section: ${L.mm} millimetres thick, ${L.temper} temper, ` +
    `${L.grain} grain. The overhang at the right hand end is the temper, drawn as an ordering.`;

  return `        <div class="row" data-row="${L.id}">
          <div class="row__id">
            <b>${L.name}</b>
            <span class="row__use">${L.use}</span>
            <span class="row__tag" data-tag="${L.id}" hidden></span>
          </div>
          <svg class="sec" viewBox="0 0 ${W} ${H}" role="img" data-asset="plate-sections"
               aria-label="${label}">
            <g class="sec__rule">
              <line x1="${X0 - 16}" y1="${BASE - MM}" x2="${XFLAT}" y2="${BASE - MM}"/>
              <line x1="${X0 - 16}" y1="${BASE - MM * 2}" x2="${XFLAT}" y2="${BASE - MM * 2}"/>
              <line x1="${X0 - 16}" y1="${BASE - MM * 3}" x2="${XFLAT}" y2="${BASE - MM * 3}"/>
            </g>
            <polyline class="sec__base" points="${X0 - 16},${BASE} ${XFLAT},${BASE} ${XFLAT},${BASE + 15}"/>
            <polygon class="sec__body" points="${pts([...upper, ...lower])}"/>
            <polyline class="sec__grain" points="${pts(upper)}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>
            <rect class="sec__halo" data-ghost="${L.id}" x="${X0}" width="${XFLAT - X0}" y="0" height="0"/>
            <rect class="sec__ghost" data-ghost="${L.id}" x="${X0}" width="${XFLAT - X0}" y="0" height="0"/>
          </svg>
          <div class="row__fig">
            <span class="mm">${L.mm}<i> mm</i></span>
            <span class="row__temper">${L.temper}</span>
          </div>
        </div>`;
}

/* ── the calendar ─────────────────────────────────────────────────────────
   Axis: August 2025 to July 2027 inclusive of the start, 24 months. Today is July 2026,
   month 11. Weeks are converted at 30.44 days to the month, which is arithmetic and is
   stated on the page. */
const SPAN = 24;
const NOW = 11;
const pc = (m) => r((m / SPAN) * 100);
const WEEK = 7 / 30.44;

const CAL = [
  { id: 'mimosa',   name: 'Mimosa calf',                  lead: 3 * WEEK, label: '3 weeks',   from: 'stock' },
  { id: 'calf',     name: 'Oak-tanned calf',              lead: 4 * WEEK, label: '4 weeks',   from: 'stock' },
  { id: 'shoulder', name: 'Bark-tanned cowhide, shoulder', lead: 6 * WEEK, label: '6 weeks',  from: 'stock' },
  { id: 'belly',    name: 'Bark-tanned cowhide, belly',   lead: 6 * WEEK, label: '6 weeks',   from: 'stock' },
  { id: 'sheep',    name: 'Oak-tanned sheep',             lead: 5,        label: '5 months',  pit: 6,  pitLabel: 'in pit since February 2026' },
  { id: 'goat',     name: 'Oak-tanned goat',              lead: 11,       label: '11 months', pit: 0,  pitLabel: 'in pit since August 2025' },
];

function calendar() {
  const lines = [`  now line at ${pc(NOW)}%`];
  for (const c of CAL) {
    const bar = `lead ${pc(NOW)}% .. ${pc(NOW + c.lead)}%  (w ${r((c.lead / SPAN) * 100)}%)`;
    const pit = c.pit === undefined ? '' :
      `  | pit ${pc(c.pit)}% .. ${pc(NOW)}%  | window ${pc(c.pit + 9)}% .. ${pc(c.pit + 14)}%`;
    lines.push(`  ${c.id.padEnd(9)} ${bar}${pit}`);
  }
  return lines.join('\n');
}

/* ── the yard ─────────────────────────────────────────────────────────────
   Twenty-eight pits, nineteen of them in use. Four rows of seven is a count, not a survey:
   the arrangement of the real yard is not given anywhere and is not invented here. */
function yard() {
  const COLS = 7, ROWS = 4, PW = 26, PH = 24, GAP = 6, IN_USE = 19;
  const out = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const x = (i % COLS) * (PW + GAP) + 1;
    const y = Math.floor(i / COLS) * (PH + GAP) + 1;
    const cls = i < IN_USE ? 'yard__down' : 'yard__open';
    out.push(`    <rect class="${cls}" x="${x}" y="${y}" width="${PW}" height="${PH}"/>`);
  }
  const w = COLS * (PW + GAP) - GAP + 2, h = ROWS * (PH + GAP) - GAP + 2;
  return `  <svg class="yard" viewBox="0 0 ${w} ${h}" role="img" data-asset="plan-yard"
       aria-label="Twenty-eight pits drawn as a count, in four rows of seven. Nineteen are inked to show they are in use and nine are left open.">
${out.join('\n')}
  </svg>`;
}

if (process.argv.includes('--cal')) console.log(calendar());
else if (process.argv.includes('--yard')) console.log(yard());
else console.log(LEATHERS.map(row).join('\n'));
