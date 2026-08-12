"use client";

import { useActionState } from "react";
import { bookAction, type BookingState } from "./actions";
import {
  AARSAG_OPTIONS,
  GULVTYPE_OPTIONS,
  JA_NEJ_VED_IKKE_OPTIONS,
} from "@/lib/content.js";

const initialState: BookingState = {
  values: {},
  errors: {},
  submitted: false,
  attempt: 0,
};

const FIELD_LABELS: Record<string, string> = {
  navn: "Navn",
  telefon: "Telefon",
  email: "E-mail",
  adresse: "Adresse på skadestedet",
  postnummer: "Postnummer",
  skadedato: "Skadedato",
  aarsag: "Årsag",
  kloakvand: "Er der kloakvand eller spildevand involveret?",
  gulvtype: "Gulvtype",
  gulvvarme: "Er der gulvvarme?",
  m2: "Cirka antal m² der er berørt",
  skadenummer: "Skadenummer fra forsikringen",
};

type TextFieldProps = {
  name: string;
  type?: string;
  hint?: string;
  required?: boolean;
  state: BookingState;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  max?: string;
};

function TextField({
  name,
  type = "text",
  hint,
  required = true,
  state,
  inputMode,
  autoComplete,
  max,
}: TextFieldProps) {
  const error = state.errors[name];
  const hasError = Boolean(error);
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = hasError ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      <label htmlFor={name}>
        {FIELD_LABELS[name]}
        {required ? "" : " (valgfri)"}
      </label>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="input"
        defaultValue={state.values[name] ?? ""}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        autoFocus={state.errorFocusField === name}
        inputMode={inputMode}
        autoComplete={autoComplete}
        max={max}
        required={required}
      />
      {hasError && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type RadioGroupProps = {
  name: string;
  options: { value: string; label: string }[];
  state: BookingState;
  hint?: string;
};

function RadioGroup({ name, options, state, hint }: RadioGroupProps) {
  const error = state.errors[name];
  const hasError = Boolean(error);
  const errorId = hasError ? `${name}-error` : undefined;

  return (
    <fieldset id={name} className="field" aria-describedby={errorId} tabIndex={-1}>
      <legend>{FIELD_LABELS[name]}</legend>
      {hint && <p className="field__hint">{hint}</p>}
      <div className="radio-group">
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = state.values[name] === opt.value;
          return (
            <label key={opt.value} htmlFor={id} className="radio-option">
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                defaultChecked={checked}
                autoFocus={state.errorFocusField === name && checked}
                aria-describedby={errorId}
                required
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
      {hasError && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function BookingForm() {
  const [state, formAction] = useActionState(bookAction, initialState);
  const errorFields = Object.keys(state.errors);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="stack">
      {state.submitted && errorFields.length > 0 && (
        <div className="error-summary" role="alert">
          <p>
            {errorFields.length === 1
              ? "Der er ét problem med udfyldelsen:"
              : `Der er ${errorFields.length} problemer med udfyldelsen:`}
          </p>
          <ul>
            {errorFields.map((field) => (
              <li key={field}>
                <a href={`#${field}`}>{FIELD_LABELS[field] ?? field}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* key forces a remount per submission attempt, so defaultValue/defaultChecked
          and autoFocus -- both mount-time-only React behaviours -- re-apply correctly
          whether the round trip happened via a full page load (no JS) or useActionState
          (JS enabled). */}
      <form action={formAction} className="booking-form" key={state.attempt} noValidate>
        <TextField name="navn" state={state} autoComplete="name" />
        <TextField name="telefon" type="tel" state={state} inputMode="tel" autoComplete="tel" />
        <TextField name="email" type="email" state={state} inputMode="email" autoComplete="email" />
        <TextField name="adresse" state={state} autoComplete="street-address" />
        <TextField
          name="postnummer"
          state={state}
          inputMode="numeric"
          autoComplete="postal-code"
          hint="4 cifre."
        />
        <TextField name="skadedato" type="date" state={state} max={today} />

        <RadioGroup name="aarsag" options={AARSAG_OPTIONS} state={state} />
        <RadioGroup name="kloakvand" options={JA_NEJ_VED_IKKE_OPTIONS} state={state} />
        <RadioGroup name="gulvtype" options={GULVTYPE_OPTIONS} state={state} />
        <RadioGroup name="gulvvarme" options={JA_NEJ_VED_IKKE_OPTIONS} state={state} />

        <TextField
          name="m2"
          state={state}
          inputMode="decimal"
          hint="Cirka areal i m² er nok."
        />
        <TextField
          name="skadenummer"
          state={state}
          required={false}
          hint="Har du endnu ikke et skadenummer, må feltet stå tomt."
        />

        <button type="submit" className="btn btn--primary">
          Send booking
        </button>
      </form>
    </div>
  );
}
