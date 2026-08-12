// ASSET-MANIFEST.md: diagram-area. Two concentric rings around Lemvig: the 40 km
// radius where driving is included, and the 75 km service-area limit, with the
// surcharge zone between them. Schematic, not a claim of geographic precision.
import { COMPANY } from "@/lib/content.js";

const CX = 160;
const CY = 148;
const R_OUTER = 128;

export function AreaDiagram() {
  const rInner = (COMPANY.freeKm / COMPANY.areaKm) * R_OUTER;

  return (
    <figure>
      <svg
        data-diagram="area"
        data-asset="diagram-area"
        viewBox="0 0 320 300"
        role="img"
        aria-labelledby="area-diagram-title area-diagram-desc"
      >
        <title id="area-diagram-title">Arbejdsområde fra Lemvig</title>
        <desc id="area-diagram-desc">
          {`To cirkler omkring Lemvig: ${COMPANY.freeKm} km, hvor kørsel er inkluderet, og ${COMPANY.areaKm} km, som er grænsen for arbejdsområdet. Mellem de to koster kørsel ${COMPANY.kmRate} kr. pr. km.`}
        </desc>

        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="var(--line)" strokeWidth="1.5" />
        <circle
          cx={CX}
          cy={CY}
          r={rInner}
          fill="none"
          stroke="var(--ink-2)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
        <circle cx={CX} cy={CY} r="4" fill="var(--accent)" />
        <text x={CX} y={CY + 20} textAnchor="middle" className="diagram-label-strong">Lemvig</text>

        <text x={CX} y={CY - rInner - 8} textAnchor="middle" className="diagram-figure">
          {COMPANY.freeKm} km
        </text>
        <text x={CX} y={CY - R_OUTER - 8} textAnchor="middle" className="diagram-figure">
          {COMPANY.areaKm} km
        </text>
      </svg>
      <p className="diagram-caption">
        Kørsel er inkluderet inden for {COMPANY.freeKm} km. Derefter {COMPANY.kmRate} kr. pr.
        km, op til grænsen på {COMPANY.areaKm} km fra Lemvig.
      </p>
    </figure>
  );
}
