import type { Metadata } from "next";
import Link from "next/link";
import {
  CASE_NUMBER,
  COMPANY,
  PRICES,
  TIMELINE,
  UNTIL_ARRIVAL_LEAD,
  UNTIL_ARRIVAL_REST,
} from "@/lib/content.js";

export const metadata: Metadata = {
  title: "Kvittering",
  description:
    "Bekræftelse på en booket fugtgennemgang: sagsnummer, pris og hvad du skal gøre indtil vi kommer.",
};

function kr(amount: number) {
  return amount.toLocaleString("da-DK");
}

export default function ReceiptPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="receipt-panel">
          <p className="eyebrow">Booking modtaget</p>
          <p className="receipt-panel__case">{CASE_NUMBER}</p>
          <h1>Tak — vi har din fugtgennemgang</h1>

          <dl>
            <div>
              <dt>Pris for fugtgennemgangen</dt>
              <dd>
                {kr(PRICES.review.amount)} kr. <span className="vat-note">{PRICES.vatNote}</span>
                {" "}— trækkes fra ved en ordre over {kr(PRICES.review.deductedOverAmount)} kr.
              </dd>
            </div>
            <div>
              <dt>Hvornår</dt>
              <dd>
                Bookes typisk {TIMELINE.bookingNotice.minDays}–{TIMELINE.bookingNotice.maxDays}{" "}
                hverdage frem
              </dd>
            </div>
            <div>
              <dt>Måling</dt>
              <dd>Kernemåling i borehul</dd>
            </div>
          </dl>

          <div className="until-arrival">
            <p>
              <strong>{UNTIL_ARRIVAL_LEAD}</strong> {UNTIL_ARRIVAL_REST}
            </p>
          </div>

          <p className="field__hint" style={{ marginTop: "var(--space-5)" }}>
            Spørgsmål inden da? Ring{" "}
            <a className="figure" href={COMPANY.phoneHref}>
              {COMPANY.phoneDisplay}
            </a>
            , telefonen besvares {COMPANY.phoneHours}.
          </p>
        </div>

        <p style={{ marginTop: "var(--space-6)" }}>
          <Link href="/">Til forsiden</Link>
        </p>
      </div>
    </section>
  );
}
