import { bookFugtgennemgang } from './actions'

export type BookingValues = {
  navn: string
  telefon: string
  email: string
  adresse: string
  postnummer: string
  skadedato: string
  aarsag: string
  kloakvand: string
  gulvtype: string
  gulvvarme: string
  kvm: string
  skadenummer: string
}

export type BookingError = {
  felt?: string
  feltbesked?: string
}

const EMPTY_VALUES: BookingValues = {
  navn: '',
  telefon: '',
  email: '',
  adresse: '',
  postnummer: '',
  skadedato: '',
  aarsag: '',
  kloakvand: '',
  gulvtype: '',
  gulvvarme: '',
  kvm: '',
  skadenummer: '',
}

function TextField({
  id,
  label,
  type,
  value,
  error,
  autoFocus,
  hint,
  required = true,
  ...rest
}: {
  id: keyof BookingValues
  label: string
  type: string
  value: string
  error?: string
  autoFocus?: boolean
  hint?: string
  required?: boolean
  min?: string
  step?: string
  pattern?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'search' | 'decimal' | 'none' | 'url'
}) {
  const errorId = error ? `${id}-fejl` : undefined
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {hint ? <span className="hint" id={`${id}-hint`}>{hint}</span> : null}
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={value}
        required={required}
        autoFocus={autoFocus}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      {error ? (
        <p className="field-error" id={errorId} role="alert">
          Fejl: {error}
        </p>
      ) : null}
    </div>
  )
}

function SelectField({
  id,
  label,
  value,
  error,
  autoFocus,
  options,
  emptyOptionLabel,
}: {
  id: keyof BookingValues
  label: string
  value: string
  error?: string
  autoFocus?: boolean
  options: Array<{ value: string; label: string }>
  emptyOptionLabel: string
}) {
  const errorId = error ? `${id}-fejl` : undefined
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        defaultValue={value}
        required
        autoFocus={autoFocus}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
      >
        <option value="" disabled hidden>
          {emptyOptionLabel}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="field-error" id={errorId} role="alert">
          Fejl: {error}
        </p>
      ) : null}
    </div>
  )
}

function RadioGroup({
  id,
  legend,
  value,
  error,
  autoFocusValue,
  options,
}: {
  id: keyof BookingValues
  legend: string
  value: string
  error?: string
  autoFocusValue?: string
  options: Array<{ value: string; label: string }>
}) {
  const errorId = error ? `${id}-fejl` : undefined
  return (
    <fieldset className={error ? 'has-error' : undefined} aria-describedby={errorId}>
      <legend>{legend}</legend>
      <div className="radio-group">
        {options.map((o) => (
          <label className="radio-option" key={o.value}>
            <input
              type="radio"
              name={id}
              value={o.value}
              defaultChecked={value === o.value}
              autoFocus={autoFocusValue !== undefined ? autoFocusValue === o.value : false}
              required
            />
            {o.label}
          </label>
        ))}
      </div>
      {error ? (
        <p className="field-error" id={errorId} role="alert">
          Fejl: {error}
        </p>
      ) : null}
    </fieldset>
  )
}

export function BookingForm({
  values = EMPTY_VALUES,
  error,
}: {
  values?: BookingValues
  error?: BookingError
}) {
  const errorOn = (field: string) => (error?.felt === field ? error.feltbesked : undefined)
  const autoFocusOn = (field: string) => error?.felt === field

  return (
    <form id="booking-form" action={bookFugtgennemgang}>
      <TextField id="navn" label="1. Navn" type="text" value={values.navn} error={errorOn('navn')} autoFocus={autoFocusOn('navn')} />
      <TextField id="telefon" label="2. Telefon" type="tel" value={values.telefon} error={errorOn('telefon')} autoFocus={autoFocusOn('telefon')} />
      <TextField id="email" label="3. E-mail" type="email" value={values.email} error={errorOn('email')} autoFocus={autoFocusOn('email')} />
      <TextField id="adresse" label="4. Adresse på skadestedet" type="text" value={values.adresse} error={errorOn('adresse')} autoFocus={autoFocusOn('adresse')} />
      <TextField
        id="postnummer"
        label="5. Postnummer"
        type="text"
        value={values.postnummer}
        error={errorOn('postnummer')}
        autoFocus={autoFocusOn('postnummer')}
        hint="Fire cifre, f.eks. 7620"
        inputMode="numeric"
        pattern="[0-9]{4}"
      />
      <TextField id="skadedato" label="6. Skadedato" type="date" value={values.skadedato} error={errorOn('skadedato')} autoFocus={autoFocusOn('skadedato')} />
      <SelectField
        id="aarsag"
        label="7. Årsag"
        value={values.aarsag}
        error={errorOn('aarsag')}
        autoFocus={autoFocusOn('aarsag')}
        emptyOptionLabel="Vælg årsag"
        options={[
          { value: 'skybrud', label: 'Skybrud' },
          { value: 'stormflod', label: 'Stormflod' },
          { value: 'sprunget-roer', label: 'Sprunget rør' },
          { value: 'ved-ikke', label: 'Ved ikke' },
        ]}
      />
      <RadioGroup
        id="kloakvand"
        legend="8. Er der kloakvand eller spildevand involveret?"
        value={values.kloakvand}
        error={errorOn('kloakvand')}
        autoFocusValue={error?.felt === 'kloakvand' ? (values.kloakvand || 'ja') : undefined}
        options={[
          { value: 'ja', label: 'Ja' },
          { value: 'nej', label: 'Nej' },
          { value: 'ved-ikke', label: 'Ved ikke' },
        ]}
      />
      <SelectField
        id="gulvtype"
        label="9. Gulvtype"
        value={values.gulvtype}
        error={errorOn('gulvtype')}
        autoFocus={autoFocusOn('gulvtype')}
        emptyOptionLabel="Vælg gulvtype"
        options={[
          { value: 'traegulv', label: 'Trægulv' },
          { value: 'klinker', label: 'Klinker' },
          { value: 'vinyl-linoleum', label: 'Vinyl eller linoleum' },
          { value: 'beton-uden-belaegning', label: 'Beton uden belægning' },
          { value: 'ved-ikke', label: 'Ved ikke' },
        ]}
      />
      <RadioGroup
        id="gulvvarme"
        legend="10. Er der gulvvarme?"
        value={values.gulvvarme}
        error={errorOn('gulvvarme')}
        autoFocusValue={error?.felt === 'gulvvarme' ? (values.gulvvarme || 'ja') : undefined}
        options={[
          { value: 'ja', label: 'Ja' },
          { value: 'nej', label: 'Nej' },
          { value: 'ved-ikke', label: 'Ved ikke' },
        ]}
      />
      <TextField
        id="kvm"
        label="11. Cirka antal m² der er berørt"
        type="number"
        value={values.kvm}
        error={errorOn('kvm')}
        autoFocus={autoFocusOn('kvm')}
        min="1"
        step="1"
      />
      <TextField
        id="skadenummer"
        label="12. Skadenummer fra forsikringen"
        type="text"
        value={values.skadenummer}
        error={errorOn('skadenummer')}
        autoFocus={autoFocusOn('skadenummer')}
        hint="Kan stå tomt"
        required={false}
      />
      <div className="form-actions">
        <button type="submit" className="cta--book">
          Bestil en fugtgennemgang
        </button>
      </div>
    </form>
  )
}
