/**
 * Words from two elements running together with nothing between them. Original work, MIT.
 *
 * The build that lost rendered pilot 02 shipped this masthead on every page at every width:
 *
 *   <a class="wordmark">Damgaard Estrik<small>Udtørring og estrik, Lemvig</small></a>
 *
 * `display: flex`, `gap: normal`. Flex drops the whitespace that would have separated the two
 * runs in ordinary inline flow, so the page reads "Damgaard EstrikUdtørring og estrik,
 * Lemvig". The gate ran six rounds, from 51 refused defects to none, and never looked for it.
 *
 * The obvious rule — flag any two text runs with no gap — is unusable. `2.400` beside `kr.`,
 * `1` beside `ste`, `H` beside `2` beside `O`, `Site` beside `Smith`: abutting text is
 * ordinary typesetting, and a check that refuses it would refuse every page with a
 * superscript on it.
 *
 * So the rule is narrower, and it is the thing that actually went wrong: **two phrases**, each
 * carrying a space of its own, whose ink touches across an element boundary with a word
 * character on either side of the join. A phrase running into a phrase is a layout mistake. A
 * token beside a token is typography.
 *
 * What it deliberately does not look at: drawings, icons, decorative boxes, anything without
 * text. Overlapping ink is composition unless it is words on words.
 */

/* Runs inside the page. Passed to `page.evaluate`, so it closes over nothing. */
export function collidingText() {
  /* Sub-pixel layout and font hinting move a glyph edge by a fraction between platforms.
     Anything under this is touching. */
  const TOL = 1

  const WORD = /[\p{L}\p{N}]/u
  const out = []

  /* The visible ink of one node's text, as a rectangle. A Range gives the text's own box
     rather than its element's, which is what "do these words touch" is about. */
  const inkOf = (node) => {
    const r = document.createRange()
    r.selectNodeContents(node)
    const rects = [...r.getClientRects()].filter((b) => b.width > 0 && b.height > 0)
    if (!rects.length) return null
    const raw = node.textContent ?? ''
    return {
      first: rects[0],
      last: rects[rects.length - 1],
      text: raw.replace(/\s+/g, ' ').trim(),
      /* Kept untrimmed on purpose. The space that separates two runs almost always belongs to
         one of them — `Alle priser er <strong>ekskl. moms</strong>` puts it at the end of the
         first text node — and trimming it away makes ordinary prose look like a collision.
         Measured before this was here: 41 hits over 28 real page renders, nearly all of them
         sentences with an emphasis in the middle. */
      endsOpen: !/\s$/.test(raw),
      startsOpen: !/^\s/.test(raw),
    }
  }

  const visible = (el) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false
    return true
  }

  for (const parent of document.querySelectorAll('body *')) {
    if (!visible(parent)) continue
    /* Text inside a drawing is placed at coordinates the author wrote, not flowed, so two
       labels one under the other are not "running together" whatever their boxes do. Measured
       on the frozen pilot 02 build: the two annotation lines of its cross-section diagram were
       reported as a collision by the first version of this check. Whether a label fits inside
       its drawing is a different question, and clipping.mjs answers it. */
    if (parent.ownerSVGElement || parent.tagName.toLowerCase() === 'svg') continue
    const kids = [...parent.childNodes].filter((n) =>
      (n.nodeType === 3 && n.textContent.trim()) || (n.nodeType === 1 && n.textContent.trim()))
    if (kids.length < 2) continue

    for (let i = 0; i < kids.length - 1; i += 1) {
      const a = kids[i]
      const b = kids[i + 1]
      if (a.nodeType === 1 && !visible(a)) continue
      if (b.nodeType === 1 && !visible(b)) continue
      /* One of the two carries no words of its own — an icon, a rule, a decorative box. There
         is nothing to misread. */
      if (a.nodeType === 1 && !a.textContent.trim()) continue
      if (b.nodeType === 1 && !b.textContent.trim()) continue

      const ia = inkOf(a)
      const ib = inkOf(b)
      if (!ia || !ib) continue

      /* Both sides have to be phrases. A token abutting a token is typesetting: a numeral and
         its unit, an ordinal suffix, a subscript, a compound name. A phrase abutting a phrase
         is two things that were meant to be read apart. */
      if (!/\s/.test(ia.text) || !/\s/.test(ib.text)) continue

      /* Neither side may be offering a space at the join. If the source separated them, the
         page is not running them together, whatever the boxes measure — and a line wrap eats
         exactly that space, which is how ordinary prose read as a collision. */
      if (!ia.endsOpen || !ib.startsOpen) continue

      /* The join itself: the last character of one and the first of the other. Punctuation on
         either side means the join reads, so only letter-against-letter counts. */
      const lastChar = ia.text[ia.text.length - 1]
      const firstChar = ib.text[0]
      if (!WORD.test(lastChar) || !WORD.test(firstChar)) continue

      /* Same line, and touching, and in that order.
         Both halves earn their place. Without the first, two stacked blocks — a heading above
         its paragraph, a spec line above a product name — read as a collision, because the
         second starts at the container's left edge and the arithmetic says "well to the left
         of where the first ended". Without the second, any wrap qualifies. Measured: these two
         conditions are what took the remaining fourteen false positives to zero across the
         benchmark set and both pilot builds. */
      const left = ia.last
      const right = ib.first
      const overlap = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top)
      if (overlap < 0.5 * Math.min(left.height, right.height)) continue

      const gap = right.left - left.right
      if (gap > TOL || gap < -TOL) continue

      out.push({
        selector: parent.id ? `#${parent.id}` : parent.tagName.toLowerCase()
          + (parent.className && typeof parent.className === 'string'
            ? `.${parent.className.trim().split(/\s+/)[0]}` : ''),
        id: parent.id || null,
        gap: Math.round(gap * 10) / 10,
        reads: `${ia.text.slice(-24)}${ib.text.slice(0, 24)}`,
      })
    }
  }

  return out
}
