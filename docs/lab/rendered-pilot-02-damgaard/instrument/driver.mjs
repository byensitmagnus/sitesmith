/**
 * One definition of "fill this site's booking form", shared by the checker and the packet.
 *
 * Pilot 01 photographed the two sites and then declared their interaction states NOT
 * COMPARABLE because they used different controls. That left the one journey the brief exists
 * for out of both the measurement and the pictures. The fix is not to guess which selectors
 * each site chose; it is to fill every control by what it is — a select takes one of its own
 * options, a number field takes a number, a date field takes a past date — and let each site
 * route that answer through whatever it built.
 *
 * Only two answers come from the brief: the postcode and the sewage question, because those
 * are the two the brief requires a refusal for. Nothing here names a route, a class or a field
 * of either build.
 *
 * These run inside the page, so they close over nothing.
 */

export const FILL_IN_PAGE = (w) => {
  const norm = (s) => (s || '').toLowerCase()
  const describe = (el) => {
    const lab = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null
    const wrap = el.closest('label')
    return norm([lab?.textContent, wrap?.textContent, el.name, el.placeholder,
      el.getAttribute('aria-label'), el.id].filter(Boolean).join(' '))
  }
  const fire = (el) => {
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }

  const controls = [...document.querySelectorAll('form input, form select, form textarea')]
    .filter((el) => !['hidden', 'submit', 'button', 'reset', 'image'].includes(norm(el.type)))

  /* radios first, so a group is answered once and as a group */
  const doneGroups = new Set()
  for (const el of controls.filter((e) => norm(e.type) === 'radio')) {
    if (doneGroups.has(el.name)) continue
    doneGroups.add(el.name)
    const opts = [...document.querySelectorAll(`form input[type=radio][name="${CSS.escape(el.name)}"]`)]
    const wantsYes = /kloak|spildevand|sewage/.test(describe(el)) && w.sewage === 'ja'
    const pick = opts.find((o) => {
      const own = `${describe(o)} ${norm(o.value)}`
      return wantsYes ? /\bja\b/.test(own) : /\bnej\b/.test(own)
    }) ?? opts[wantsYes ? 0 : opts.length - 1]
    if (pick) { pick.checked = true; fire(pick) }
  }

  for (const el of controls) {
    const type = norm(el.type)
    if (type === 'radio') continue
    const key = describe(el)
    const sewageField = /kloak|spildevand|sewage/.test(key)

    if (type === 'checkbox') { el.checked = true; fire(el); continue }

    if (el.tagName === 'SELECT') {
      const real = [...el.options].find((o) => {
        if (!o.value.trim()) return false
        if (!sewageField) return true
        const own = `${o.textContent} ${o.value}`
        return w.sewage === 'ja' ? /\bja\b/i.test(own) : /\bnej\b/i.test(own)
      }) ?? [...el.options].find((o) => o.value.trim())
      if (real) { el.value = real.value; fire(el) }
      continue
    }

    let v
    if (type === 'date') v = w.pastDate
    else if (type === 'email' || /e-?mail/.test(key)) v = 'test@example.com'
    else if (type === 'tel' || /telefon|phone|tlf/.test(key)) v = '20202020'
    else if (/postnummer|postnr|post code|zip/.test(key)) v = w.postcode
    else if (sewageField) v = w.sewage
    else if (type === 'number' || norm(el.inputMode) === 'numeric'
      || /m²|m2|areal|antal|kvadrat/.test(key)) v = '12'
    else if (/navn|name/.test(key)) v = 'Test Testesen'
    else if (/adresse|address|vej|gade/.test(key)) v = 'Testvej 1'
    else if (/dato|date/.test(key)) v = w.pastDate
    else if (el.tagName === 'TEXTAREA') v = 'Vand fra en sprunget slange under vasken.'
    else v = 'Testsvar'

    el.value = v
    fire(el)
  }

  return controls.filter((el) => (['radio', 'checkbox'].includes(norm(el.type)) ? el.checked : String(el.value).trim().length > 0)).length
}

export const SNAPSHOT_IN_PAGE = () => ({
  text: document.body.innerText,
  focused: document.activeElement
    ? (document.activeElement.id || document.activeElement.name || document.activeElement.tagName.toLowerCase())
    : null,
  answers: [...document.querySelectorAll('form input, form select, form textarea')]
    .filter((el) => !['hidden', 'submit', 'button', 'reset', 'image'].includes((el.type || '').toLowerCase()))
    .filter((el) => (['radio', 'checkbox'].includes((el.type || '').toLowerCase()) ? el.checked : String(el.value).trim().length > 0))
    .map((el) => `${el.name || el.id}`),
  /* whatever the site itself shows as a problem, in its own words */
  problems: [...document.querySelectorAll('[role=alert], [aria-live], .error, [class*="error"], [id*="error"]')]
    .map((n) => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 12),
  url: location.pathname,
})

/* The route with the most form controls. Neither site is told what to call it. */
export const findBookingPath = async (browser, base, paths) => {
  let best = 0; let found = null
  for (const path of paths) {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    const ok = await page.goto(base + path, { waitUntil: 'networkidle' }).then((r) => r && r.status() < 400).catch(() => false)
    if (ok) {
      const n = await page.evaluate(() => document.querySelectorAll('form input:not([type=hidden]), form select, form textarea').length)
      if (n > best) { best = n; found = path }
    }
    await ctx.close()
  }
  return found
}

export const crawl = async (browser, base) => {
  const seen = new Set(['/'])
  const queue = ['/']
  while (queue.length) {
    const path = queue.shift()
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    const resp = await page.goto(base + path, { waitUntil: 'networkidle' }).catch(() => null)
    if (resp && resp.status() < 400) {
      for (const h of await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))) {
        if (!h || /^(#|mailto:|tel:|https?:)/.test(h)) continue
        const p = new URL(h, base + path).pathname
        if (!seen.has(p) && p.startsWith('/')) { seen.add(p); queue.push(p) }
      }
    }
    await ctx.close()
  }
  return [...seen]
}

export const PAST_DATE = '2026-08-03'
