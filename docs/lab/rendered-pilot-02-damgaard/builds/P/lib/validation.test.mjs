// Runnable self-check: `node lib/validation.test.mjs`
// Covers the brief's two required Fejl scenarios verbatim, the happy path, the
// generic required-field path, and the verbatim-concatenation invariant for the
// Kvittering "indtil vi kommer" list.

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { validate } = require('./validation.js');
const {
  ERROR_TEXT_OUT_OF_AREA_2200, ERROR_TEXT_SEWAGE,
  UNTIL_ARRIVAL_LEAD, UNTIL_ARRIVAL_REST, UNTIL_ARRIVAL_TEXT,
} = require('./content.js');

const validBase = {
  navn: 'Mette Holm',
  telefon: '20 30 40 50',
  email: 'mette@example.dk',
  adresse: 'Havnegade 3',
  postnummer: '7600',
  skadedato: '2026-08-01',
  aarsag: 'sprunget-roer',
  kloakvand: 'nej',
  gulvtype: 'traegulv',
  gulvvarme: 'nej',
  m2: '18',
  skadenummer: '',
};

// 1. Happy path
{
  const { isValid, errors } = validate(validBase);
  assert.equal(isValid, true, `expected valid submission to pass, got errors: ${JSON.stringify(errors)}`);
}

// 2. Required Fejl scenario: postnummer 2200, everything else valid
{
  const { isValid, errors, errorFocusField } = validate({ ...validBase, postnummer: '2200' });
  assert.equal(isValid, false);
  assert.equal(errors.postnummer, ERROR_TEXT_OUT_OF_AREA_2200, 'postnummer error text must match BRIEF.md verbatim');
  assert.equal(errorFocusField, 'postnummer');
  // the other eleven fields must carry no error of their own
  const otherErrors = Object.keys(errors).filter((k) => k !== 'postnummer');
  assert.deepEqual(otherErrors, [], `expected only postnummer to error, got: ${otherErrors.join(', ')}`);
}

// 3. Required Fejl scenario: kloakvand = ja, everything else valid
{
  const { isValid, errors, errorFocusField } = validate({ ...validBase, kloakvand: 'ja' });
  assert.equal(isValid, false);
  assert.equal(errors.kloakvand, ERROR_TEXT_SEWAGE, 'kloakvand error text must match BRIEF.md verbatim');
  assert.equal(errorFocusField, 'kloakvand');
  const otherErrors = Object.keys(errors).filter((k) => k !== 'kloakvand');
  assert.deepEqual(otherErrors, [], `expected only kloakvand to error, got: ${otherErrors.join(', ')}`);
}

// 4. Fully empty submission: every required field errors, focus goes to the first
//    field in canonical order (navn), skadenummer stays valid because it is optional.
{
  const empty = Object.fromEntries(Object.keys(validBase).map((k) => [k, '']));
  const { isValid, errors, errorFocusField } = validate(empty);
  assert.equal(isValid, false);
  assert.equal(errorFocusField, 'navn');
  assert.ok(!('skadenummer' in errors), 'skadenummer is optional and must never error');
  assert.ok(Object.keys(errors).length >= 8, 'expected most required fields to error on an empty submission');
}

// 5. A postal code outside the allowlist but not the literal brief example gets the
//    generic (not the 2200-specific) message, and does not invent a town name.
{
  const { errors } = validate({ ...validBase, postnummer: '8000' });
  assert.ok(errors.postnummer.startsWith('Postnummer 8000 '), 'generic out-of-area message must not claim a town name');
  assert.notEqual(errors.postnummer, ERROR_TEXT_OUT_OF_AREA_2200);
}

// 6. A postal code inside the allowlist passes.
{
  const { errors } = validate({ ...validBase, postnummer: '7620' });
  assert.ok(!errors.postnummer, 'the company\'s own postal code (Lemvig) must be inside its own service area');
}

// 7. Verbatim-concatenation invariant for the Kvittering lead/rest split.
{
  const rebuilt = `${UNTIL_ARRIVAL_LEAD} ${UNTIL_ARRIVAL_REST}`;
  assert.equal(rebuilt, UNTIL_ARRIVAL_TEXT);
  assert.equal(
    UNTIL_ARRIVAL_TEXT,
    'Indtil vi kommer: luk for vandet hvis det stadig løber, flyt løsøre op fra gulvet, ' +
    'tag billeder til din forsikring. Lad være med at lægge nyt gulv, lad være med at ' +
    'skrue varmen i vejret, og lad være med at lukke rummet helt af.',
    'must match BRIEF.md Kvittering quote character for character'
  );
}

console.log('ok — validation.test.mjs: 7/7 checks passed');
