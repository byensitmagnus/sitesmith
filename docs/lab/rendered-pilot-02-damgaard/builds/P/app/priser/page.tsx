import type { Metadata } from "next";
import Link from "next/link";
import { AreaDiagram } from "@/components/diagrams/AreaDiagram";
import { TimelineDiagram } from "@/components/diagrams/TimelineDiagram";
import {
  COMPANY,
  EQUIPMENT,
  PRICES,
  REFUSALS,
  TIMELINE,
  UNKNOWNS,
} from "@/lib/content.js";

export const metadata: Metadata = {
  title: "Priser og dækningsområde",
  description:
    "Fuld prisliste for fugtgennemgang, affugtning, sideindblæsning, ny estrik og slidlag — ekskl. moms. Dækningsområde 75 km fra Lemvig.",
};

function kr(amount: number) {
  return amount.toLocaleString("da-DK");
}

export default function PricesPage() {
  return (
    <>
      <section className="section section--tight">
        <div className="container">
          <p className="eyebrow">Skrevet overslag</p>
          <h1>Priser og dækningsområde</h1>
          <p className="lead">
            Alle priser er {PRICES.vatNote} og gælder uanset om regningen går til dig eller
            til et forsikringsselskab.
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="rule-table-scroll">
            <table className="rule-table">
              <caption>Priser {PRICES.vatNote}</caption>
              <thead>
                <tr>
                  <th scope="col">Ydelse</th>
                  <th scope="col" className="amount">Pris</th>
                  <th scope="col">Note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{PRICES.review.label}</th>
                  <td className="amount figure">{kr(PRICES.review.amount)} kr.</td>
                  <td>Fratrækkes ved ordre over {kr(PRICES.review.deductedOverAmount)} kr.</td>
                </tr>
                <tr>
                  <th scope="row">{PRICES.dryingPerRoomPerDay.label}</th>
                  <td className="amount figure">{kr(PRICES.dryingPerRoomPerDay.amount)} kr.</td>
                  <td>—</td>
                </tr>
                <tr>
                  <th scope="row">{PRICES.sideInjection.label}</th>
                  <td className="amount figure">{kr(PRICES.sideInjection.amount)} kr.</td>
                  <td>{PRICES.sideInjection.note}</td>
                </tr>
                <tr>
                  <th scope="row">{PRICES.newScreed.label}</th>
                  <td className="amount figure">
                    {kr(PRICES.newScreed.amount)} {PRICES.newScreed.unit}
                  </td>
                  <td>—</td>
                </tr>
                <tr>
                  <th scope="row">{PRICES.topLayer.label}</th>
                  <td className="amount figure">
                    {kr(PRICES.topLayer.amount)} {PRICES.topLayer.unit}
                  </td>
                  <td>—</td>
                </tr>
                <tr>
                  <th scope="row">{PRICES.controlMeasurement.label}</th>
                  <td className="amount figure">
                    {kr(PRICES.controlMeasurement.amount)} {PRICES.controlMeasurement.unit}
                  </td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="field__hint" style={{ marginTop: "var(--space-4)" }}>
            Mindste opgave {PRICES.minJob.m2} m². Mindstepris{" "}
            <span className="figure">{kr(PRICES.minJob.price)} kr.</span> {PRICES.vatNote}
          </p>
          <p className="field__hint">{PRICES.payment}</p>
        </div>
      </section>

      <section className="section section--bordered">
        <div className="container grid-2">
          <div className="hero__diagram-wrap">
            <AreaDiagram />
          </div>
          <div className="stack">
            <h2>Dækningsområde og kørsel</h2>
            <p>
              Arbejdsområdet er {COMPANY.areaKm} km fra Lemvig. Kørsel er inkluderet inden
              for de første {COMPANY.freeKm} km. Derefter koster kørsel{" "}
              <span className="figure">{COMPANY.kmRate} kr.</span> pr. km, op til grænsen på{" "}
              {COMPANY.areaKm} km.
            </p>
            <p>
              Arbejdstid på pladsen: {COMPANY.siteHours.map((h) => `${h.days} ${h.hours}`).join(", ")}.{" "}
              {COMPANY.noDutyNote}
            </p>
            <p>
              Telefonen besvares {COMPANY.phoneHours} på{" "}
              <a className="figure" href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>.
            </p>
            <p className="field__hint">
              Maksimalt {EQUIPMENT.maxConcurrentSites} samtidige skadesteder. {EQUIPMENT.capacityNote}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--bordered">
        <div className="container">
          <h2>Tider og måletal</h2>
          <TimelineDiagram />
          <p className="field__hint" style={{ marginTop: "var(--space-4)" }}>
            {TIMELINE.handheldNote}
          </p>
          <p className="field__hint">{EQUIPMENT.circuitNote}</p>
        </div>
      </section>

      <section className="section section--bordered">
        <div className="container grid-2">
          <div>
            <h2>Hvad vi nægter</h2>
            <ul className="refusal-list">
              {REFUSALS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Hvad vi ikke ved på forhånd</h2>
            <ul className="unknown-list">
              {UNKNOWNS.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--bordered section--tight">
        <div className="container">
          <div className="card">
            <h3>Klar til at booke?</h3>
            <p>Én formular. Du får et sagsnummer og en pris med det samme.</p>
            <Link href="/bestil" className="btn btn--primary">
              Book en fugtgennemgang
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
