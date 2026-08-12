import Link from "next/link";
import { DisclosureStrip } from "./DisclosureStrip";
import { COMPANY } from "@/lib/content.js";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>
          <h2>{COMPANY.name}</h2>
          <address>
            {COMPANY.legalName}
            <br />
            CVR {COMPANY.cvr}, stiftet {COMPANY.founded}
            <br />
            {COMPANY.street}
            <br />
            {COMPANY.zip} {COMPANY.city}
          </address>
          <p className="field__hint" style={{ marginTop: "var(--space-3)" }}>
            Fem ansatte: {COMPANY.staff.join(", ")}.
          </p>
        </div>
        <div>
          <h2>Kontakt og åbningstid</h2>
          <ul>
            <li>
              <a className="figure" href={COMPANY.phoneHref}>
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>Telefonen besvares {COMPANY.phoneHours}.</li>
            {COMPANY.siteHours.map((h) => (
              <li key={h.days}>
                {h.days}: <span className="figure">{h.hours}</span>
              </li>
            ))}
            <li>{COMPANY.noDutyNote}</li>
            <li>Arbejdsområde: op til {COMPANY.areaKm} km fra Lemvig.</li>
          </ul>
        </div>
        <div>
          <h2>Sider</h2>
          <ul>
            <li>
              <Link href="/">Forside</Link>
            </li>
            <li>
              <Link href="/priser">Priser</Link>
            </li>
            <li>
              <Link href="/bestil">Book en fugtgennemgang</Link>
            </li>
          </ul>
        </div>
      </div>
      <DisclosureStrip />
    </footer>
  );
}
