// Single source of truth for every fact rendered on the site. Every value here is
// transcribed from BRIEF.md. If a fact is not here, it must not appear on a page --
// that is the whole discipline this file exists to enforce.
//
// Plain JS (not .ts): this module has no framework dependency and is imported both by
// the Next.js app and by lib/validation.test.mjs, so it must load under plain `node`.

const COMPANY = {
  name: 'Damgaard Estrik',
  legalName: 'Damgaard Estrik ApS',
  cvr: '41 55 08 12',
  founded: 2016,
  street: 'Vestre Havnevej 11',
  zip: '7620',
  city: 'Lemvig',
  phoneDisplay: '97 00 41 20',
  phoneHref: 'tel:+4597004120',
  phoneHours: 'mandag til fredag 07:00–14:00',
  siteHours: [
    { days: 'Mandag til torsdag', hours: '06:30–15:00' },
    { days: 'Fredag', hours: '06:30–12:00' },
  ],
  noDutyNote: 'Der er ingen døgnvagt og ingen weekendvagt.',
  areaKm: 75,
  freeKm: 40,
  kmRate: 14,
  // "Fem" is spelled out on the page (matching BRIEF.md's own wording) rather than
  // interpolated from a count, since this is the only place it is used.
  staff: [
    'Jens Damgaard (ejer)',
    'to måleteknikere',
    'to estriklæggere',
  ],
};

const EQUIPMENT = {
  adsorptionCount: 2,
  adsorptionCapacity: '900 m³/t',
  condensationCount: 12,
  sideBlowerCount: 40,
  maxConcurrentSites: 3,
  capacityNote:
    'Er der tre i gang, siger de nej til det fjerde og oplyser hvornår der bliver plads.',
  circuitNote:
    'Hver adsorptionsaffugter kræver en dokumenteret 16 A gruppe for sig selv. Kan strømmen ikke dokumenteres, sættes maskinen ikke op.',
};

const PRICES = {
  vatNote: 'ekskl. moms',
  review: {
    amount: 2400,
    label: 'Fugtgennemgang med kernemåling i borehul',
    deductedOverAmount: 15000,
  },
  dryingPerRoomPerDay: { amount: 285, label: 'Affugtning pr. rum pr. døgn' },
  sideInjection: {
    amount: 620,
    label: 'Sideindblæsning i sandbælte, pr. borehul',
    note: 'Der bores hul for hver 1,2 m.',
  },
  newScreed: {
    amount: 985,
    label: 'Opbrydning og ny cementestrik, 50–70 mm',
    unit: 'kr. pr. m²',
  },
  topLayer: {
    amount: 420,
    label: 'Slidlag i flydemørtel',
    unit: 'kr. pr. m²',
  },
  controlMeasurement: {
    amount: 950,
    label: 'Kontrolmåling undervejs',
    unit: 'kr. pr. gang',
  },
  minJob: { m2: 12, price: 9800 },
  payment:
    'Forsikringsselskabet faktureres direkte når der foreligger et skadenummer. Ellers privat betaling, 8 dage netto.',
};

const TIMELINE = {
  minDays: 18,
  maxDays: 45,
  measureEveryDays: 7,
  boreholeDepthPct: 40,
  logNote: 'Hver måling skrives ned med dato, punkt og værdi.',
  thresholds: [
    { material: 'Trægulv', verb: 'lægges først når konstruktionen måler', rule: 'under 65 % RF' },
    { material: 'Klinker', verb: 'lægges først', rule: 'under 85 % RF' },
    { material: 'Cementestrik', verb: 'regnes tør ved', rule: 'under 2,0 CM%' },
  ],
  handheldNote:
    'Håndholdt overflademåler bruges udelukkende til at vælge borepunkter. Den bruges aldrig som dokumentation, og dens tal kommer ikke i rapporten.',
  bookingNotice: { minDays: 3, maxDays: 9 },
};

const RULES = [
  'De tørrer ikke et gulv de ikke selv har målt først.',
  'Der skal være adgang til strøm, og adgang til rummet i hele forløbet.',
  'Affugtere og blæsere må ikke slukkes af kunden undervejs. Slukkes de, starter forløbet forfra, og døgnprisen løber alligevel.',
  'Der lægges ikke nyt gulv før måleværdierne er nået, uanset hvad kunden ønsker.',
];

const REFUSALS = [
  'De rører ikke skader med kloakvand eller andet spildevand i kategori 3. Den opgave henvises videre samme dag.',
  'De rører ikke gulvbelægninger eller lim fra før 1990 uden en analyse for asbest og PCB, som kunden bestiller og betaler.',
  'De laver ikke skimmelsanering og udtaler sig ikke om skimmel.',
  'De laver ikke el, VVS eller gulvvarmeslanger, og de udbedrer ikke den utæthed der gav skaden.',
  'De giver ingen garanti for at et eksisterende trægulv kan reddes, og de tager ikke en opgave hvor betalingen afhænger af at det lykkes.',
];

// "de tre ting de nægter" (Required states / Tom) reads back to the three refusals
// named in "The problem the page must solve": callers outside the 75 km area, callers
// with sewage water, and callers who want drying without a measured review first.
const THREE_REFUSALS = [
  {
    title: 'Uden for 75 km fra Lemvig',
    body: 'Vi kører ikke ud over 75 km fra Lemvig — heller ikke mod ekstra kørselsbetaling.',
  },
  {
    title: 'Kloakvand eller spildevand',
    body: 'Rører skaden kloakvand eller andet spildevand i kategori 3, tager vi den ikke. Vi henviser videre samme dag.',
  },
  {
    title: '”Bare tørret lidt” uden måling',
    body: 'Vi tørrer ikke et gulv vi ikke selv har målt først — også selvom du kun vil have en hurtig løsning.',
  },
];

const UNKNOWNS = [
  'De kan ikke sige før målingen hvor langt vandet er nået ud i isoleringen eller ind under skillevægge. Første måling er også første gang de ved det.',
  'De ved ikke om der er skimmel. Prøver sendes til laboratorium, som fakturerer kunden direkte, og de tolker ikke svaret.',
  'De kan ikke sige om forsikringen dækker. Det afgør taksator, ikke dem.',
  'De kan ikke sige på forhånd om et forløb bliver 18 eller 45 døgn.',
];

const CASE_NUMBER = 'DE-2026-0318';

// The exact required texts. Character-for-character from BRIEF.md -- do not edit these
// without re-checking against the brief.
const ERROR_TEXT_OUT_OF_AREA_2200 =
  '2200 København N ligger uden for de 75 km fra Lemvig. Vi kører ikke derover, heller ' +
  'ikke mod ekstra kørsel. Ring 97 00 41 20 mandag til fredag 07:00–14:00, så siger vi ' +
  'hvem der dækker området.';

const ERROR_TEXT_SEWAGE =
  'Er der kloakvand eller spildevand i konstruktionen, må vi ikke røre den. Det er en ' +
  'skadeservice-opgave, ikke vores. Ring 97 00 41 20, så henviser vi videre samme dag.';

// Rendered as ONE contiguous text node on the Kvittering page (a single <p>), not split
// across <li> elements: a plain DOM textContent read does not insert whitespace between
// block-level siblings, so a <ul><li> split risks the words running together for any
// checker that reads raw textContent instead of layout-aware innerText. Verbatim
// correctness on this exact quote matters more than list markup -- see BRIEF.md,
// Required states / Kvittering. UNTIL_ARRIVAL_LEAD is pulled out only so the page can
// bold it inline; LEAD + " " + REST reproduces UNTIL_ARRIVAL_TEXT exactly (checked in
// lib/validation.test.mjs).
const UNTIL_ARRIVAL_LEAD = 'Indtil vi kommer:';
const UNTIL_ARRIVAL_REST =
  'luk for vandet hvis det stadig løber, flyt løsøre op fra gulvet, tag billeder til din ' +
  'forsikring. Lad være med at lægge nyt gulv, lad være med at skrue varmen i vejret, og ' +
  'lad være med at lukke rummet helt af.';
const UNTIL_ARRIVAL_TEXT = `${UNTIL_ARRIVAL_LEAD} ${UNTIL_ARRIVAL_REST}`;

const DISCLOSURE_TEXT =
  'Damgaard Estrik er opdigtet til en byggeøvelse og findes ikke i virkeligheden. Intet på denne side er ægte, og intet må bruges som grundlag for en beslutning.';

// Constraints / "Må aldrig påstås" (BRIEF.md) -- kept as a comment, not runtime data,
// since it is a checklist for whoever edits this file next, not something rendered:
// - døgnvagt, akutberedskab eller weekendudkald
// - samarbejde med eller godkendelse af forsikringsselskaber
// - autorisation, certificering, branchegodkendelse eller medlemskab
// - erfaring i antal sager, kunder eller år ud over "stiftet 2016"
// - kompetence inden for skimmel
// - garanti for tørretid, for at et gulv kan reddes, eller for at forsikringen dækker
// - anmeldelser, udtalelser eller stjerner

const FORM_FIELD_ORDER = [
  'navn', 'telefon', 'email', 'adresse', 'postnummer', 'skadedato',
  'aarsag', 'kloakvand', 'gulvtype', 'gulvvarme', 'm2', 'skadenummer',
];

const AARSAG_OPTIONS = [
  { value: 'skybrud', label: 'Skybrud' },
  { value: 'stormflod', label: 'Stormflod' },
  { value: 'sprunget-roer', label: 'Sprunget rør' },
  { value: 'ved-ikke', label: 'Ved ikke' },
];

const JA_NEJ_VED_IKKE_OPTIONS = [
  { value: 'ja', label: 'Ja' },
  { value: 'nej', label: 'Nej' },
  { value: 'ved-ikke', label: 'Ved ikke' },
];

const GULVTYPE_OPTIONS = [
  { value: 'traegulv', label: 'Trægulv' },
  { value: 'klinker', label: 'Klinker' },
  { value: 'vinyl-linoleum', label: 'Vinyl eller linoleum' },
  { value: 'beton-uden-belaegning', label: 'Beton uden belægning' },
  { value: 'ved-ikke', label: 'Ved ikke' },
];

module.exports = {
  COMPANY, EQUIPMENT, PRICES, TIMELINE, RULES, REFUSALS, THREE_REFUSALS,
  UNKNOWNS, CASE_NUMBER, ERROR_TEXT_OUT_OF_AREA_2200, ERROR_TEXT_SEWAGE,
  UNTIL_ARRIVAL_LEAD, UNTIL_ARRIVAL_REST, UNTIL_ARRIVAL_TEXT, DISCLOSURE_TEXT,
  FORM_FIELD_ORDER, AARSAG_OPTIONS, JA_NEJ_VED_IKKE_OPTIONS, GULVTYPE_OPTIONS,
};
