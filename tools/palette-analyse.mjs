#!/usr/bin/env node
// Measures the palette corpus so the judgement calls in PALETTE-ANALYSIS.md rest on
// numbers rather than on how the swatches look in a screenshot.
//
// Reports, per palette: relative luminance and role of each colour, WCAG contrast for
// every ordered pair, whether a usable body-text pair exists at AA (4.5), whether a
// large-text/UI pair exists at AA-large (3.0), and the lightness spread.
//
//   node tools/palette-analyse.mjs            # table
//   node tools/palette-analyse.mjs --json     # machine-readable

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const corpus = JSON.parse(readFileSync(join(root, 'docs/rebuild/PALETTE-CORPUS.json'), 'utf8'))

const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)

// WCAG 2.x relative luminance.
function luminance(hex) {
  const [r, g, b] = srgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

// Rough hue/saturation, only used to say "this one is the chromatic accent".
function hsl(hex) {
  const [r, g, b] = srgb(hex)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (!d) return { h: 0, s: 0, l }
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: h * 360, s, l }
}

function analyse(p) {
  const cols = p.hexes.map((hex) => ({ hex, lum: luminance(hex), ...hsl(hex) }))
  const byLum = [...cols].sort((a, b) => a.lum - b.lum)

  // Role assignment is mechanical: darkest and lightest are the two ground colours,
  // the remaining one is the accent. With three colours that is unambiguous.
  const darkest = byLum[0]
  const lightest = byLum[byLum.length - 1]
  const accent = cols.find((c) => c !== darkest && c !== lightest) ?? byLum[1]

  const pairs = []
  for (const a of cols) {
    for (const b of cols) {
      if (a.hex === b.hex) continue
      pairs.push({ fg: a.hex, bg: b.hex, ratio: Number(contrast(a.hex, b.hex).toFixed(2)) })
    }
  }
  pairs.sort((x, y) => y.ratio - x.ratio)

  const best = pairs[0]
  const bodyPairs = pairs.filter((x) => x.ratio >= 4.5)
  const uiPairs = pairs.filter((x) => x.ratio >= 3 && x.ratio < 4.5)

  // Does the accent work as a button fill with either ground colour on top of it?
  const accentOnDark = Number(contrast(accent.hex, darkest.hex).toFixed(2))
  const accentOnLight = Number(contrast(accent.hex, lightest.hex).toFixed(2))

  return {
    id: p.id,
    hexes: p.hexes,
    roles: { ground: darkest.hex, surface: lightest.hex, accent: accent.hex },
    lightnessSpread: Number((lightest.lum - darkest.lum).toFixed(3)),
    accentSaturation: Number(accent.s.toFixed(2)),
    accentHue: Math.round(accent.h),
    bestPair: best,
    bodyTextPairs: bodyPairs.length / 2,
    largeTextOnlyPairs: uiPairs.length / 2,
    accentOnGround: accentOnDark,
    accentOnSurface: accentOnLight,
    accentUsableAsTextOn: [
      accentOnDark >= 4.5 ? 'ground(body)' : accentOnDark >= 3 ? 'ground(large only)' : null,
      accentOnLight >= 4.5 ? 'surface(body)' : accentOnLight >= 3 ? 'surface(large only)' : null,
    ].filter(Boolean),
    pairs,
  }
}

const rows = corpus.palettes.map(analyse)

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ generatedFrom: 'docs/rebuild/PALETTE-CORPUS.json', rows }, null, 2))
} else {
  const pad = (s, n) => String(s).padEnd(n)
  console.log(
    pad('id', 5) + pad('ground', 9) + pad('surface', 9) + pad('accent', 9) +
    pad('best', 7) + pad('AA-body', 9) + pad('AA-large', 10) + pad('acc/ground', 12) + pad('acc/surface', 12) + 'accent usable as text on',
  )
  for (const r of rows) {
    console.log(
      pad(r.id, 5) + pad(r.roles.ground, 9) + pad(r.roles.surface, 9) + pad(r.roles.accent, 9) +
      pad(r.bestPair.ratio, 7) + pad(r.bodyTextPairs, 9) + pad(r.largeTextOnlyPairs, 10) +
      pad(r.accentOnGround, 12) + pad(r.accentOnSurface, 12) + (r.accentUsableAsTextOn.join(', ') || 'nothing'),
    )
  }
  console.log('\nAA-body counts unordered pairs at ratio >= 4.5. AA-large counts pairs in [3.0, 4.5).')
}
