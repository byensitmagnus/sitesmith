import Link from "next/link";
import { DepthDiagram } from "@/components/diagrams/DepthDiagram";
import { TimelineDiagram } from "@/components/diagrams/TimelineDiagram";
import { AreaDiagram } from "@/components/diagrams/AreaDiagram";
import {
  COMPANY,
  EQUIPMENT,
  PRICES,
  RULES,
  THREE_REFUSALS,
  TIMELINE,
} from "@/lib/content.js";

export default function HomePage() {
  return (
    <>
      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="hero__kicker">Udtørring og reetablering af gulvkonstruktioner</p>
            <h1 className="hero__title">
              Vådt gulv efter skybrud, stormflod eller sprunget rør?
            </h1>
            <p className="lead hero__lede">
              Vi måler gulvet i borehul, før vi siger noget om det. Så ved du hvad der skal
              ske, og hvad det koster, før vi rører noget.
            </p>
            <div className="hero__actions">
              <Link href="/bestil" className="btn btn--primary">
                Book en fugtgennemgang
              </Link>
              <Link href="/priser" className="btn btn--secondary">
                Se priser
              </Link>
            </div>
            <p className="field__hint" style={{ marginTop: "var(--space-5)" }}>
              Vi kører ud i op til {COMPANY.areaKm} km fra Lemvig.{" "}
              <a className="figure" href={COMPANY.phoneHref}>
                {COMPANY.phoneDisplay}
              </a>
              , telefonen besvares {COMPANY.phoneHours}.
            </p>
          </div>
          <div className="hero__diagram-wrap">
            <DepthDiagram />
          </div>
        </div>
      </section>

      <section className="section section--bordered section--tight">
        <div className="container">
          <h2>Hvem vi ikke kan hjælpe</h2>
          <p className="lead" style={{ marginBottom: "var(--space-6)" }}>
            Ring endelig og hør — men disse tre siger vi nej til, hver dag.
          </p>
          <div className="grid-3" style={{ marginBottom: "var(--space-7)" }}>
            {THREE_REFUSALS.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <div className="grid-2">
            <div className="hero__diagram-wrap">
              <AreaDiagram />
            </div>
            <div className="stack">
              <h3>Er du inden for området?</h3>
              <p>
                Arbejdsområdet er {COMPANY.areaKm} km fra Lemvig. Kørsel er inkluderet inden
                for de første {COMPANY.freeKm} km — derefter {COMPANY.kmRate} kr. pr. km, op
                til grænsen.
              </p>
              <p>{COMPANY.noDutyNote} Telefonen besvares {COMPANY.phoneHours}.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--bordered">
        <div className="container">
          <h2>Sådan arbejder vi</h2>
          <p className="lead" style={{ marginBottom: "var(--space-6)" }}>
            Vi tørrer ikke et gulv vi ikke selv har målt først. Der måles hver{" "}
            {TIMELINE.measureEveryDays}. døgn, og {TIMELINE.logNote.toLowerCase()}
          </p>
          <div className="grid-2">
            <div className="hero__diagram-wrap">
              <TimelineDiagram />
            </div>
            <div className="stack">
              <h3>Regler vi ikke fraviger</h3>
              <ul className="rule-list">
                {RULES.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="field__hint" style={{ marginTop: "var(--space-6)" }}>
            Udstyr: {EQUIPMENT.adsorptionCount} adsorptionsaffugtere á{" "}
            {EQUIPMENT.adsorptionCapacity}, {EQUIPMENT.condensationCount} kondensaffugtere,{" "}
            {EQUIPMENT.sideBlowerCount} sideblæsere. Maksimalt {EQUIPMENT.maxConcurrentSites}{" "}
            samtidige skadesteder — {EQUIPMENT.capacityNote.toLowerCase()}
          </p>
        </div>
      </section>

      <section className="section section--bordered section--tight">
        <div className="container grid-2">
          <div>
            <h2>Hvad koster en fugtgennemgang</h2>
            <p className="lead">
              <span className="figure">{PRICES.review.amount.toLocaleString("da-DK")} kr.</span>{" "}
              <span className="vat-note">{PRICES.vatNote}</span> for {PRICES.review.label.toLowerCase()}.
              Trækkes fra prisen ved en ordre over{" "}
              <span className="figure">{PRICES.review.deductedOverAmount.toLocaleString("da-DK")} kr.</span>
            </p>
            <p>
              Fugtgennemgang bookes typisk med {TIMELINE.bookingNotice.minDays} til{" "}
              {TIMELINE.bookingNotice.maxDays} hverdages varsel — se den fulde prisliste for
              opbrydning, ny estrik, affugtning og sideindblæsning.
            </p>
            <Link href="/priser" className="btn btn--secondary">
              Se alle priser
            </Link>
          </div>
          <div className="card">
            <h3>Book en gennemgang</h3>
            <p>
              Én formular, ingen login og ingen betaling på siden. Du får et sagsnummer og en
              liste over hvad du skal gøre indtil vi kommer.
            </p>
            <Link href="/bestil" className="btn btn--primary">
              Book en fugtgennemgang
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
