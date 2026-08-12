'use server'

import { redirect } from 'next/navigation'
import { isValidPostnummerFormat, isWithinServiceArea, outOfAreaMessage } from '@/lib/postnummer'
import { appendSubmission } from '@/lib/submissions'

// Every successful booking on this fictional build gets the sagsnummer the brief pins
// for the Kvittering state, DE-2026-0318, so the state is the same reviewable route every
// time rather than a number that only appears once. A real deployment would issue a
// sequential number instead; see PRODUCTION-REPORT.md.
const SAGSNUMMER = 'DE-2026-0318'

const REQUIRED_IN_ORDER: Array<{ field: string; label: string }> = [
  { field: 'navn', label: 'Navn' },
  { field: 'telefon', label: 'Telefon' },
  { field: 'email', label: 'E-mail' },
  { field: 'adresse', label: 'Adresse på skadestedet' },
  { field: 'postnummer', label: 'Postnummer' },
  { field: 'skadedato', label: 'Skadedato' },
  { field: 'aarsag', label: 'Årsag' },
  { field: 'kloakvand', label: 'Kloakvand eller spildevand' },
  { field: 'gulvtype', label: 'Gulvtype' },
  { field: 'gulvvarme', label: 'Gulvvarme' },
  { field: 'kvm', label: 'Antal m² berørt' },
]

// The exact option sets the form itself offers. A <select required> or a required radio
// group blocks the browser from submitting anything else, but the request is what the
// server actually sees, so the same set is enforced again here.
const ENUMS: Record<string, string[]> = {
  aarsag: ['skybrud', 'stormflod', 'sprunget-roer', 'ved-ikke'],
  kloakvand: ['ja', 'nej', 'ved-ikke'],
  gulvtype: ['traegulv', 'klinker', 'vinyl-linoleum', 'beton-uden-belaegning', 'ved-ikke'],
  gulvvarme: ['ja', 'nej', 'ved-ikke'],
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : ''
}

// Every field the visitor already typed, carried back on the query string so a failed
// submission can re-render with all eleven other answers exactly as entered, with no
// server-side session and no client JavaScript required to do it.
function echo(fields: Record<string, string>): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(fields)) {
    if (value) params.set(key, value)
  }
  return params
}

export async function bookFugtgennemgang(formData: FormData): Promise<void> {
  const fields = {
    navn: str(formData.get('navn')),
    telefon: str(formData.get('telefon')),
    email: str(formData.get('email')),
    adresse: str(formData.get('adresse')),
    postnummer: str(formData.get('postnummer')),
    skadedato: str(formData.get('skadedato')),
    aarsag: str(formData.get('aarsag')),
    kloakvand: str(formData.get('kloakvand')),
    gulvtype: str(formData.get('gulvtype')),
    gulvvarme: str(formData.get('gulvvarme')),
    kvm: str(formData.get('kvm')),
    skadenummer: str(formData.get('skadenummer')),
  }
  const params = echo(fields)

  // Trust boundary: everything above came from an HTTP request, not from a validated
  // client. Re-check every required field server-side regardless of the type="..." and
  // required attributes already on the inputs.
  for (const { field, label } of REQUIRED_IN_ORDER) {
    if (!fields[field as keyof typeof fields]) {
      params.set('fejl', 'validering')
      params.set('felt', field)
      params.set('feltnavn', label)
      params.set('feltbesked', `${label} skal udfyldes.`)
      redirect(`/?${params.toString()}`)
    }
  }

  for (const [field, allowed] of Object.entries(ENUMS)) {
    const value = fields[field as keyof typeof fields]
    if (!allowed.includes(value)) {
      params.set('fejl', 'validering')
      params.set('felt', field)
      params.set('feltbesked', 'Vælg en af de viste muligheder.')
      redirect(`/?${params.toString()}`)
    }
  }

  if (!isValidPostnummerFormat(fields.postnummer)) {
    params.set('fejl', 'validering')
    params.set('felt', 'postnummer')
    params.set('feltnavn', 'Postnummer')
    params.set('feltbesked', 'Skriv et rigtigt firecifret postnummer.')
    redirect(`/?${params.toString()}`)
  }

  const kvmNumber = Number(fields.kvm.replace(',', '.'))
  if (!Number.isFinite(kvmNumber) || kvmNumber <= 0) {
    params.set('fejl', 'validering')
    params.set('felt', 'kvm')
    params.set('feltnavn', 'Antal m² berørt')
    params.set('feltbesked', 'Skriv et antal kvadratmeter større end 0.')
    redirect(`/?${params.toString()}`)
  }

  // The two business refusals the brief names. Postnummer is field 5, kloakvand is
  // field 8; where both would fail, the earlier field in the form wins, so the error is
  // never printed on a field the visitor has not reached yet.
  if (!isWithinServiceArea(fields.postnummer)) {
    params.set('fejl', 'postnummer')
    params.set('felt', 'postnummer')
    params.set('feltbesked', outOfAreaMessage(fields.postnummer))
    redirect(`/?${params.toString()}`)
  }

  if (fields.kloakvand === 'ja') {
    params.set('fejl', 'kloakvand')
    params.set('felt', 'kloakvand')
    params.set(
      'feltbesked',
      'Er der kloakvand eller spildevand i konstruktionen, må vi ikke røre den. Det er en skadeservice-opgave, ikke vores. Ring 97 00 41 20, så henviser vi videre samme dag.',
    )
    redirect(`/?${params.toString()}`)
  }

  await appendSubmission({ sagsnummer: SAGSNUMMER, ...fields })
  redirect('/kvittering')
}
