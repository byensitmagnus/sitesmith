import type { Metadata } from "next";
import { BookingForm } from "./BookingForm";
import { COMPANY, PRICES, THREE_REFUSALS } from "@/lib/content.js";

export const metadata: Metadata = {
  title: "Book en fugtgennemgang",
  description:
    "Bestil en fugtgennemgang med kernemåling. Én formular, intet login, ingen betaling på siden.",
};

export default function BookPage() {
  return (
    <section className="section">
      <div className="container grid-2">
        <div className="stack">
          <div>
            <p className="eyebrow">Én formular, ingen login</p>
            <h1>Book en fugtgennemgang</h1>
            <p className="lead">
              Du får et sagsnummer, en pris og en liste over hvad du skal gøre indtil vi
              kommer.
            </p>
          </div>

          <div className="form-intro">
            <p>
              <strong className="figure">
                {PRICES.review.amount.toLocaleString("da-DK")} kr.
              </strong>{" "}
              <span className="vat-note">{PRICES.vatNote}</span> for{" "}
              {PRICES.review.label.toLowerCase()}. Trækkes fra ved en ordre over{" "}
              {PRICES.review.deductedOverAmount.toLocaleString("da-DK")} kr.
            </p>
            <p style={{ marginTop: "var(--space-3)" }}>
              Vi kører kun ud i op til {COMPANY.areaKm} km fra Lemvig.
            </p>
            <ul className="refusal-list" style={{ marginTop: "var(--space-4)" }}>
              {THREE_REFUSALS.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}.</strong> {item.body}
                </li>
              ))}
            </ul>
            <p className="field__hint">
              Falder du uden for et af disse, behøver du ikke udfylde formularen — ring{" "}
              <a className="figure" href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>,{" "}
              {COMPANY.phoneHours}.
            </p>
          </div>
        </div>

        <div>
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
