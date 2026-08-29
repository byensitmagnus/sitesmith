/**
 * Colour, enough of it to check a contract. Original work, MIT.
 *
 * Parses hex, rgb, hsl, oklch and oklab to sRGB, and reports WCAG contrast.
 *
 * OKLCH is here because the contract asks for it. A perceptual space is the right one to
 * pick a ramp in: equal steps in lightness look like equal steps, which sRGB and HSL do not
 * give you, and a palette built by eye in hex tends to have one step that jumps. The
 * contract therefore wants the authored value **and** a rendered fallback, and the only way
 * to check that the fallback is the same colour is to convert.
 *
 * `gate.mjs` deliberately still returns null for oklch and withholds its verdict. Changing
 * that would change what an existing refusal class decides, on builds that were measured
 * under the old behaviour. This module is used by the contract validator only, and the two
 * converge when the gate's colour handling is next revisited on purpose rather than as a
 * side effect. Same maths, one copy, when that happens.
 */

/* ── parsing ─────────────────────────────────────────────────────────────── */

const NAMED = new Map(Object.entries({
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff',
  gray: '#808080', grey: '#808080', silver: '#c0c0c0', maroon: '#800000', olive: '#808000',
  lime: '#00ff00', aqua: '#00ffff', cyan: '#00ffff', teal: '#008080', navy: '#000080',
  fuchsia: '#ff00ff', magenta: '#ff00ff', purple: '#800080', yellow: '#ffff00',
  orange: '#ffa500', transparent: null,
}));

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** OKLab to linear sRGB, then to sRGB bytes. Björn Ottosson's matrices. */
function oklabToRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  const lin = [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
  const enc = (c) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(clamp01(c), 1 / 2.4) - 0.055;
    return Math.round(clamp01(v) * 255);
  };
  return { r: enc(lin[0]), g: enc(lin[1]), b: enc(lin[2]) };
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((((h % 360) + 360) % 360 / 60) % 2 - 1));
  const m = l - c / 2;
  const hh = ((h % 360) + 360) % 360;
  const [r, g, b] = hh < 60 ? [c, x, 0] : hh < 120 ? [x, c, 0] : hh < 180 ? [0, c, x]
    : hh < 240 ? [0, x, c] : hh < 300 ? [x, 0, c] : [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

/** A number, a percentage of `full`, or `none`. CSS Color 4 spells all three. */
function num(raw, full = 1) {
  const s = String(raw).trim();
  if (s === 'none') return 0;
  if (s.endsWith('%')) return (parseFloat(s) / 100) * full;
  return parseFloat(s);
}

/**
 * @returns {{r:number,g:number,b:number,space:string}|null} null when it is not a colour
 * this can resolve, which the caller must report rather than treat as black.
 */
export function parse(value) {
  if (value === null || value === undefined) return null;
  let v = String(value).trim().toLowerCase();
  if (NAMED.has(v)) {
    const hex = NAMED.get(v);
    return hex === null ? null : { ...parse(hex), space: 'named' };
  }

  let m = v.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    const n = parseInt(h.slice(0, 6), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255,
             a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1, space: 'hex' };
  }

  m = v.match(/^rgba?\(([^)]*)\)$/);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean);
    if (p.length < 3) return null;
    return { r: Math.round(num(p[0], 255)), g: Math.round(num(p[1], 255)), b: Math.round(num(p[2], 255)),
             a: p[3] === undefined ? 1 : num(p[3], 1), space: 'rgb' };
  }

  m = v.match(/^hsla?\(([^)]*)\)$/);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean);
    if (p.length < 3) return null;
    return { ...hslToRgb(parseFloat(p[0]), num(p[1], 1), num(p[2], 1)),
             a: p[3] === undefined ? 1 : num(p[3], 1), space: 'hsl' };
  }

  /* oklch(L C H) and oklab(L a b). L is 0 to 1 or a percentage of it; C in oklch is an
     absolute chroma, conventionally under about 0.4, and a percentage there means percent
     of 0.4 by the spec. */
  m = v.match(/^oklch\(([^)]*)\)$/);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean);
    if (p.length < 3) return null;
    const L = num(p[0], 1), C = num(p[1], 0.4), H = parseFloat(p[2]) || 0;
    const rad = (H * Math.PI) / 180;
    return { ...oklabToRgb(L, C * Math.cos(rad), C * Math.sin(rad)),
             a: p[3] === undefined ? 1 : num(p[3], 1), space: 'oklch' };
  }

  m = v.match(/^oklab\(([^)]*)\)$/);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean);
    if (p.length < 3) return null;
    return { ...oklabToRgb(num(p[0], 1), num(p[1], 0.4), num(p[2], 0.4)), space: 'oklab' };
  }

  return null;
}

/* ── contrast ────────────────────────────────────────────────────────────── */

const channel = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export function luminance(rgb) {
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/**
 * WCAG 2 contrast ratio, or null when either side could not be resolved. Null is the
 * honest answer and the caller says so; returning 1 would read as a failure and returning
 * 21 would read as a pass, and both would be inventions.
 */
export function contrast(a, b) {
  const ca = typeof a === 'string' ? parse(a) : a;
  const cb = typeof b === 'string' ? parse(b) : b;
  if (!ca || !cb) return null;
  /* Composite the foreground over the background when it is not opaque. A hairline at
     34 per cent is a real colour on the page and a different one in the file, and treating
     the file's value as opaque reports a contrast the visitor never sees. The background
     itself is taken as opaque: what is behind it is the page, and if the background is
     translucent the pair needs a third colour and the contract has to say which. */
  const fg = ca.a === undefined || ca.a >= 1 ? ca : over(ca, cb);
  const l1 = luminance(fg), l2 = luminance(cb);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/** Source-over composite, straight alpha. */
export function over(fg, bg) {
  const a = fg.a ?? 1;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    space: fg.space,
  };
}

/**
 * Composite a stack of colours, back to front, into one opaque colour.
 *
 * This exists because the pilot found it. Its error message is red chalk on red chalk at
 * nine per cent, and that ground is itself over a white at fifty-five per cent, which is
 * over the page. Measured as written, the pair reads 1:1 and looks like a total failure.
 * Measured as painted it is legible. Neither number is knowable without the stack, so the
 * contract has to carry it and this has to be able to flatten it.
 *
 * The first entry must be opaque, or there is nothing behind the page.
 * @returns the flattened colour, or null when a layer will not resolve or the base has alpha
 */
export function flatten(layers) {
  const parsed = layers.map((l) => (typeof l === 'string' ? parse(l) : l));
  if (!parsed.length || parsed.some((p) => !p)) return null;
  if ((parsed[0].a ?? 1) < 1) return null;
  return parsed.reduce((base, layer) => ((layer.a ?? 1) >= 1 ? layer : over(layer, base)));
}

/** The AA floor for a pair, given what it is. Large text is 24px, or 18.66px bold. */
export const AA = { text: 4.5, largeText: 3, nonText: 3 };

export const hex = (rgb) => `#${[rgb.r, rgb.g, rgb.b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

/** How far apart two colours are, as a share of 255 per channel. Used to check that a
    fallback is the same colour as the value it stands in for rather than a different one. */
export function distance(a, b) {
  const ca = typeof a === 'string' ? parse(a) : a;
  const cb = typeof b === 'string' ? parse(b) : b;
  if (!ca || !cb) return null;
  return Math.round(Math.max(Math.abs(ca.r - cb.r), Math.abs(ca.g - cb.g), Math.abs(ca.b - cb.b)) / 255 * 1000) / 1000;
}
