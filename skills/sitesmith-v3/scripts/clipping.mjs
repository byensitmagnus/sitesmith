/**
 * Which elements are hiding their own content. Original work, MIT.
 *
 * A build shipped with `<input type="number" style="width: 7ch; padding: 0.6em">` holding a
 * four-digit year. Four digits, two paddings and the browser's own spinner do not fit in
 * seven characters, so `1958` rendered as `195`, on every page, at every width, on a site
 * whose whole premise was getting years exactly right. Nothing in this package saw it.
 *
 * The measurement it got past looked at eight tag names, none of them a control, and compared
 * `scrollHeight` against `clientHeight`. So it could not see a value cut off sideways inside
 * the one control the page's journey ran through. This is that measurement, widened along the
 * two axes it was blind on, and no further.
 *
 * The rule it is widened to, and it is a narrower rule than "anything that overflows":
 *
 *   a control that renders a single value shows all of it, and an element that hides its
 *   overflow is not hiding its own words.
 *
 * A region built to scroll is not a defect. `overflow: auto` and `overflow: scroll` are an
 * author saying so and handing the reader a way through; only `hidden` and `clip` take the
 * content away with nothing offered in return. A textarea scrolls by definition. Getting that
 * distinction wrong would refuse working builds, which is worse than the miss this fixes.
 */

/* Runs inside the page. It is passed to `page.evaluate`, so it may not close over anything
   from this module: every constant it needs is declared inside it. */
export function clippedElements() {
  /* Browsers round sub-pixel layout, and a control's own chrome moves by a pixel between
     platforms. Two pixels is the same tolerance the original measurement used. */
  const TOL = 2

  /* Input types that render one value the reader is meant to read. A checkbox, a radio, a
     range, a colour swatch or a file button has no text of its own to cut off. */
  const SINGLE_LINE = new Set(['text', 'number', 'search', 'tel', 'url', 'email', 'password',
    'date', 'month', 'week', 'time', 'datetime-local'])

  const WATCHED = 'h1, h2, h3, h4, h5, h6, p, li, label, button, a, td, th, dt, dd, figcaption, summary, input, select'
  const out = []

  for (const el of document.querySelectorAll(WATCHED)) {
    const s = getComputedStyle(el)

    /* Not visible is not visible content. `offsetParent` is null for `display: none` and for
       anything inside it, and also for fixed positioning, which is visible, so that one case
       is asked about separately. */
    if (el.offsetParent === null && s.position !== 'fixed') continue
    if (s.visibility === 'hidden' || Number(s.opacity) === 0) continue

    const box = el.getBoundingClientRect()
    if (box.width < 1 || box.height < 1) continue
    /* Off to the side of the document on purpose, which is how a skip link or a
       screen-reader-only label is written. */
    if (box.right < 0 || box.bottom < 0) continue

    const tag = el.tagName.toLowerCase()
    const wide = el.scrollWidth > el.clientWidth + TOL
    const tall = el.scrollHeight > el.clientHeight + TOL
    const push = (axis, need) => out.push({
      id: el.id || null, tag, axis,
      selector: el.id ? `#${el.id}` : tag,
      shows: Math.round(axis === 'horizontal' ? el.clientWidth : el.clientHeight),
      needs: Math.round(need),
      text: (el.value ?? el.textContent ?? '').toString().trim().slice(0, 60),
    })

    if (tag === 'input') {
      const type = (el.getAttribute('type') || 'text').toLowerCase()
      if (!SINGLE_LINE.has(type)) continue
      /* A control clips its own value whatever its overflow property says, so the property is
         not consulted here. The reader can scroll inside a focused input, and that does not
         help the reader scanning the page, who sees 195 where 1958 was written. */
      if (wide) push('horizontal', el.scrollWidth)
      continue
    }

    if (tag === 'select') {
      if (wide) push('horizontal', el.scrollWidth)
      continue
    }

    /* Everything else. Only `hidden` and `clip` count: those remove the content with nothing
       offered in its place. `auto` and `scroll` are a scroll region, which is a decision, not
       a defect. */
    const cut = (v) => v === 'hidden' || v === 'clip'
    if (cut(s.overflowX) && wide) push('horizontal', el.scrollWidth)
    else if (cut(s.overflowY) && tall) push('vertical', el.scrollHeight)
  }

  return out
}
