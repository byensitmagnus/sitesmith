// journeys/book-a-review.spec.mjs -- the one thing this site exists to do.
// BRIEF.md, "The one journey the site exists for": book a fugtgennemgang.
//
// Run against a running `next start` server:
//   BASE=http://localhost:3417 node journeys/book-a-review.spec.mjs
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3000";
const problems = [];
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ": " + detail : ""}`);
  if (!ok) problems.push(`${name}${detail ? ": " + detail : ""}`);
};

const VALID = {
  navn: "Mette Holm",
  telefon: "20304050",
  email: "mette@example.dk",
  adresse: "Havnegade 3",
  postnummer: "7600",
  skadedato: "2026-08-01",
  m2: "18",
};

async function fillCommonFields(page, overrides = {}) {
  const values = { ...VALID, ...overrides };
  await page.fill("#navn", values.navn);
  await page.fill("#telefon", values.telefon);
  await page.fill("#email", values.email);
  await page.fill("#adresse", values.adresse);
  await page.fill("#postnummer", values.postnummer);
  await page.fill("#skadedato", values.skadedato);
  await page.check("#aarsag-sprunget-roer");
  await page.check(`#kloakvand-${overrides.kloakvand ?? "nej"}`);
  await page.check("#gulvtype-traegulv");
  await page.check("#gulvvarme-nej");
  await page.fill("#m2", values.m2);
}

// A native <input type=date> has multiple internally-tabbable segments (month, day,
// year) that Chromium handles without moving document.activeElement away from the
// input -- confirmed empirically (4 Tab presses to fully exit an empty one). Tabbing a
// fixed single step off the date field is therefore unreliable; step until the focused
// element's id actually changes.
async function tabUntilFocusChanges(page, maxTabs = 6) {
  const before = await page.evaluate(() => document.activeElement?.id ?? null);
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press("Tab");
    const now = await page.evaluate(() => document.activeElement?.id ?? null);
    if (now !== before) return now;
  }
  return null;
}

async function waitForBodyText(page, substring, timeout = 5000) {
  await page.waitForFunction((needle) => document.body.innerText.includes(needle), substring, {
    timeout,
  });
}

async function outlineIsVisible(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const s = getComputedStyle(el);
    return s.outlineStyle !== "none" && s.outlineWidth !== "0px";
  });
}

const browser = await chromium.launch();

// --- 1. Tom state -----------------------------------------------------
{
  const page = await browser.newPage();
  await page.goto(`${base}/bestil`, { waitUntil: "networkidle" });
  const navnValue = await page.inputValue("#navn");
  check("Tom: navn starts empty", navnValue === "", `got "${navnValue}"`);
  const priceVisible = await page.getByText("2.400 kr.").first().isVisible();
  check("Tom: price (2.400 kr.) readable without filling anything", priceVisible);
  const areaVisible = await page.getByText(/75 km/).first().isVisible();
  check("Tom: 75 km area limit readable without filling anything", areaVisible);
  const refusalsVisible = await page.getByText("Kloakvand eller spildevand").first().isVisible();
  check("Tom: refusals readable without filling anything", refusalsVisible);
  await page.close();
}

// --- 2. Fejl: postnummer 2200 -----------------------------------------
{
  const page = await browser.newPage();
  await page.goto(`${base}/bestil`, { waitUntil: "networkidle" });
  await fillCommonFields(page, { postnummer: "2200" });
  const requiredText =
    "2200 København N ligger uden for de 75 km fra Lemvig. Vi kører ikke derover, heller " +
    "ikke mod ekstra kørsel. Ring 97 00 41 20 mandag til fredag 07:00–14:00, så siger vi " +
    "hvem der dækker området.";
  await page.click('button[type="submit"]');
  await waitForBodyText(page, requiredText).catch(() => {});

  const bodyText = await page.locator("body").innerText();
  check("Fejl(postnummer): exact required text present", bodyText.includes(requiredText));

  const focused = await page.evaluate(() => document.activeElement?.id);
  check("Fejl(postnummer): focus moved to postnummer field", focused === "postnummer", `focused #${focused}`);

  const ariaInvalid = await page.getAttribute("#postnummer", "aria-invalid");
  check("Fejl(postnummer): field marked aria-invalid", ariaInvalid === "true");

  const navnPreserved = await page.inputValue("#navn");
  check("Fejl(postnummer): other field (navn) preserved", navnPreserved === VALID.navn, `got "${navnPreserved}"`);
  const adressePreserved = await page.inputValue("#adresse");
  check("Fejl(postnummer): other field (adresse) preserved", adressePreserved === VALID.adresse);
  const aarsagPreserved = await page.isChecked("#aarsag-sprunget-roer");
  check("Fejl(postnummer): other field (aarsag radio) preserved", aarsagPreserved === true);

  await page.close();
}

// --- 3. Fejl: kloakvand = ja --------------------------------------------
{
  const page = await browser.newPage();
  await page.goto(`${base}/bestil`, { waitUntil: "networkidle" });
  await fillCommonFields(page, { kloakvand: "ja" });
  const requiredText =
    "Er der kloakvand eller spildevand i konstruktionen, må vi ikke røre den. Det er en " +
    "skadeservice-opgave, ikke vores. Ring 97 00 41 20, så henviser vi videre samme dag.";
  await page.click('button[type="submit"]');
  await waitForBodyText(page, requiredText).catch(() => {});

  const bodyText = await page.locator("body").innerText();
  check("Fejl(kloakvand): exact required text present", bodyText.includes(requiredText));

  const focused = await page.evaluate(() => document.activeElement?.id);
  check("Fejl(kloakvand): focus moved to the kloakvand=ja radio", focused === "kloakvand-ja", `focused #${focused}`);

  const navnPreserved = await page.inputValue("#navn");
  check("Fejl(kloakvand): other field (navn) preserved", navnPreserved === VALID.navn);

  await page.close();
}

// --- 4. Happy path -> Kvittering, then keyboard-only repeat ------------
{
  const page = await browser.newPage();
  await page.goto(`${base}/bestil`, { waitUntil: "networkidle" });
  await fillCommonFields(page);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/kvittering", { timeout: 5000 }).catch(() => {});

  check("Success: URL is /kvittering", page.url().endsWith("/kvittering"), page.url());
  const bodyText = await page.locator("body").innerText();
  check("Success: case number DE-2026-0318 present", bodyText.includes("DE-2026-0318"));
  check("Success: until-arrival text present verbatim", bodyText.includes(
    "Indtil vi kommer: luk for vandet hvis det stadig løber, flyt løsøre op fra gulvet, " +
    "tag billeder til din forsikring. Lad være med at lægge nyt gulv, lad være med at " +
    "skrue varmen i vejret, og lad være med at lukke rummet helt af."
  ));
  await page.close();
}

// --- 5. Keyboard-only: reach and submit the form without a mouse -------
{
  const page = await browser.newPage();
  await page.goto(`${base}/bestil`, { waitUntil: "networkidle" });

  await page.locator("#navn").focus();
  const visibleAtStart = await outlineIsVisible(page);
  check("Keyboard: focus outline visible on a text field", visibleAtStart);

  await page.keyboard.type(VALID.navn);
  await page.keyboard.press("Tab");
  await page.keyboard.type(VALID.telefon);
  await page.keyboard.press("Tab");
  await page.keyboard.type(VALID.email);
  await page.keyboard.press("Tab");
  await page.keyboard.type(VALID.adresse);
  await page.keyboard.press("Tab");
  await page.keyboard.type(VALID.postnummer);
  await page.keyboard.press("Tab"); // -> skadedato, a native date input
  // Native <input type=date> keyboard editing is segmented (month/day/year, order set
  // by OS locale) and unreliable to drive with raw digit keystrokes in an automated
  // script. The field is still reached and left purely by keyboard (Tab); .fill() only
  // stands in for the OS-specific segment-typing a real keyboard user would do.
  await page.fill("#skadedato", VALID.skadedato);
  await tabUntilFocusChanges(page); // exit the date field's internal segments -> aarsag group
  await page.keyboard.press("ArrowDown"); // skybrud -> stormflod (checks it)
  await page.keyboard.press("ArrowDown"); // -> sprunget-roer (checks it)
  await page.keyboard.press("Tab"); // into kloakvand group (ja focused, not yet checked)
  await page.keyboard.press("ArrowDown"); // ja -> nej (checks it)
  await page.keyboard.press("Tab"); // into gulvtype group (traegulv focused, not yet checked)
  await page.keyboard.press("Space"); // check traegulv without moving off it
  await page.keyboard.press("Tab"); // into gulvvarme group (ja focused, not yet checked)
  await page.keyboard.press("ArrowDown"); // ja -> nej (checks it)
  await page.keyboard.press("Tab"); // -> m2
  await page.keyboard.type(VALID.m2);
  await page.keyboard.press("Tab"); // -> skadenummer
  await page.keyboard.press("Tab"); // -> submit button

  const onSubmit = await page.evaluate(() => document.activeElement?.getAttribute("type"));
  check("Keyboard: tab order reaches the submit button", onSubmit === "submit", `landed on type=${onSubmit}`);

  await page.keyboard.press("Enter");
  await page.waitForURL("**/kvittering", { timeout: 5000 }).catch(() => {});
  check("Keyboard: submitting with Enter reaches /kvittering", page.url().endsWith("/kvittering"), page.url());

  await page.close();
}

// --- 6. Reduced motion removes animation entirely -----------------------
{
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const anim = await page.evaluate(() => {
    const el = document.querySelector(".hero__title");
    if (!el) return null;
    const s = getComputedStyle(el);
    return { animationName: s.animationName, transitionDuration: s.transitionDuration };
  });
  check(
    "Reduced motion: hero animation fully removed (not just shortened)",
    anim && anim.animationName === "none",
    JSON.stringify(anim)
  );
  await context.close();
}

// --- 7. Disclosure line present on every page, not behind an interaction
{
  const page = await browser.newPage();
  for (const path of ["/", "/priser", "/bestil", "/kvittering"]) {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    const strip = page.locator(".disclosure-strip__inner").first();
    const visible = await strip.isVisible();
    const text = await strip.innerText().catch(() => "");
    check(
      `Disclosure: visible on ${path} without interaction`,
      visible && /opdigtet/i.test(text) && /beslutning/i.test(text),
      text.slice(0, 60)
    );
  }
  await page.close();
}

await browser.close();

console.log(
  problems.length
    ? `\nFAIL (${problems.length})\n  ${problems.join("\n  ")}`
    : "\nok — book-a-review journey: all checks passed"
);
process.exit(problems.length ? 1 : 0);
