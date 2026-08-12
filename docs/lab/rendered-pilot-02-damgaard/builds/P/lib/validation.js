// Pure validation for the booking form (BRIEF.md, "The one journey the site exists for").
// No framework import here on purpose: this file is unit-tested by plain `node` in
// validation.test.mjs, and reused as-is by the server action in app/bestil/actions.ts.

const {
  FORM_FIELD_ORDER, AARSAG_OPTIONS, JA_NEJ_VED_IKKE_OPTIONS, GULVTYPE_OPTIONS,
  ERROR_TEXT_OUT_OF_AREA_2200, ERROR_TEXT_SEWAGE,
} = require('./content.js');

const AARSAG_VALUES = AARSAG_OPTIONS.map((o) => o.value);
const JA_NEJ_VED_IKKE_VALUES = JA_NEJ_VED_IKKE_OPTIONS.map((o) => o.value);
const GULVTYPE_VALUES = GULVTYPE_OPTIONS.map((o) => o.value);

// Postal-code prefixes (first two digits) treated as inside the ~75 km service radius
// from Lemvig (7620) -- a conservative allowlist of real West/Central Jutland postal
// districts (Holstebro 75xx, Lemvig/Struer/Thyholm 76xx, Thisted 77xx, Skive/Vinderup
// 78xx, Ringkøbing/Skjern/Ulfborg 69xx, Herning/Vildbjerg 74xx), not a precise per-code
// distance table. Borderline towns (Viborg 88xx, Aars 96xx) are deliberately excluded:
// the brief's only required scenario is postnummer 2200, and erring toward "ring and
// ask" is safer than a geo-table this build can't independently verify.
// ponytail: allowlist by 2-digit prefix, not real distance math -- upgrade to a real
// postal-code/coordinate table if the business ever needs edge-of-radius precision.
const AREA_PREFIXES = new Set(['75', '76', '77', '78', '69', '74']);

function outOfAreaMessage(code) {
  if (code === '2200') return ERROR_TEXT_OUT_OF_AREA_2200;
  return (
    `Postnummer ${code} ligger uden for de 75 km fra Lemvig. Vi kører ikke derover, heller ` +
    'ikke mod ekstra kørsel. Ring 97 00 41 20 mandag til fredag 07:00–14:00, så siger vi ' +
    'hvem der dækker området.'
  );
}

function required(value, message) {
  return value && String(value).trim() ? null : message;
}

/**
 * @param {Record<string, string>} values raw, trimmed form values keyed by field name
 * @returns {{ errors: Record<string,string>, errorFocusField: string|undefined, isValid: boolean }}
 */
function validate(values) {
  const errors = {};

  errors.navn = required(values.navn, 'Udfyld navn.');

  if (!values.telefon || !values.telefon.trim()) {
    errors.telefon = 'Udfyld telefon.';
  } else if (values.telefon.replace(/\D/g, '').length < 8) {
    errors.telefon = 'Angiv et telefonnummer med mindst 8 cifre.';
  } else {
    errors.telefon = null;
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Udfyld e-mail.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Angiv en gyldig e-mailadresse.';
  } else {
    errors.email = null;
  }

  errors.adresse = required(values.adresse, 'Udfyld adressen på skadestedet.');

  const postnummer = (values.postnummer || '').trim();
  if (!postnummer) {
    errors.postnummer = 'Udfyld postnummer.';
  } else if (!/^\d{4}$/.test(postnummer)) {
    errors.postnummer = 'Postnummer skal være 4 cifre.';
  } else if (!AREA_PREFIXES.has(postnummer.slice(0, 2))) {
    errors.postnummer = outOfAreaMessage(postnummer);
  } else {
    errors.postnummer = null;
  }

  if (!values.skadedato) {
    errors.skadedato = 'Udfyld skadedato.';
  } else {
    const d = new Date(`${values.skadedato}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(d.getTime())) {
      errors.skadedato = 'Angiv en gyldig dato.';
    } else if (d.getTime() > today.getTime()) {
      errors.skadedato = 'Skadedato kan ikke ligge i fremtiden.';
    } else {
      errors.skadedato = null;
    }
  }

  errors.aarsag = AARSAG_VALUES.includes(values.aarsag) ? null : 'Vælg en årsag.';

  if (!JA_NEJ_VED_IKKE_VALUES.includes(values.kloakvand)) {
    errors.kloakvand = 'Svar på om der er kloakvand eller spildevand involveret.';
  } else if (values.kloakvand === 'ja') {
    errors.kloakvand = ERROR_TEXT_SEWAGE;
  } else {
    errors.kloakvand = null;
  }

  errors.gulvtype = GULVTYPE_VALUES.includes(values.gulvtype) ? null : 'Vælg en gulvtype.';
  errors.gulvvarme = JA_NEJ_VED_IKKE_VALUES.includes(values.gulvvarme)
    ? null
    : 'Svar på om der er gulvvarme.';

  const m2raw = (values.m2 || '').trim();
  if (!m2raw) {
    errors.m2 = 'Udfyld det berørte areal.';
  } else if (!/^\d+([.,]\d+)?$/.test(m2raw) || Number(m2raw.replace(',', '.')) <= 0) {
    errors.m2 = 'Angiv et areal i m² som et positivt tal.';
  } else {
    errors.m2 = null;
  }

  errors.skadenummer = null; // optional field, always valid

  for (const key of Object.keys(errors)) {
    if (errors[key] == null) delete errors[key];
  }

  const errorFocusField = FORM_FIELD_ORDER.find((f) => errors[f]);

  return { errors, errorFocusField, isValid: Object.keys(errors).length === 0 };
}

module.exports = {
  AREA_PREFIXES,
  outOfAreaMessage,
  validate,
};
