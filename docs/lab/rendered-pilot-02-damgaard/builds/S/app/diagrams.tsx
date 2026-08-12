// Both diagrams are original inline SVG, drawn here. No photograph of Damgaard Estrik
// exists and none is implied; see ASSET-MANIFEST.md. Every paint value is a design-system
// custom property via `style`, not a literal hex, so the drawing moves if the tokens do.

const ink = { fill: 'var(--blaek)' }
const inkStroke = { stroke: 'var(--blaek)' }
const papirFill = { fill: 'var(--papir)' }
const overfladeFill = { fill: 'var(--overflade)' }
const betonFill = { fill: 'var(--beton)' }

export function InstrumentDiagram() {
  return (
    <svg
      viewBox="0 0 400 260"
      role="img"
      aria-labelledby="instrument-title instrument-desc"
      data-asset="instrument-borehul"
    >
      <title id="instrument-title">Tværsnit af en gulvkonstruktion med et borehul</title>
      <desc id="instrument-desc">
        Et lodret snit gennem fire lag, gulvbelægning, afretningslag, isolering og terrændæk,
        med et borehul der går ned til 40 procent af konstruktionens dybde, hvor kernemålingen
        tages.
      </desc>
      <g style={inkStroke} strokeWidth="1.5" fill="none">
        <rect x="40" y="20" width="180" height="14" style={papirFill} />
        <rect x="40" y="34" width="180" height="34" style={overfladeFill} />
        <rect x="40" y="68" width="180" height="70" fill="none" strokeDasharray="3 3" />
        <rect x="40" y="138" width="180" height="80" style={betonFill} />
      </g>
      <line x1="128" y1="20" x2="128" y2="138" style={inkStroke} strokeWidth="6" />
      <circle cx="128" cy="86" r="6" style={{ ...papirFill, ...inkStroke }} strokeWidth="2" />
      <line x1="128" y1="86" x2="240" y2="86" style={inkStroke} strokeWidth="1" />
      <text x="244" y="82" fontSize="12" style={ink}>40 % af konstruktionens</text>
      <text x="244" y="96" fontSize="12" style={ink}>dybde: kernemåling tages her</text>
      <g fontSize="11" style={ink}>
        <text x="228" y="30">Gulvbelægning</text>
        <text x="228" y="54">Afretningslag / estrik</text>
        <text x="228" y="106">Isolering</text>
        <text x="228" y="182">Terrændæk</text>
      </g>
    </svg>
  )
}

export function RaekkeviddeDiagram() {
  return (
    <svg
      viewBox="0 0 400 260"
      role="img"
      aria-labelledby="raekkevidde-title raekkevidde-desc"
      data-asset="raekkevidde-cirkler"
    >
      <title id="raekkevidde-title">Arbejdsområdet regnet fra Lemvig</title>
      <desc id="raekkevidde-desc">
        To cirkler ud fra Vestre Havnevej 11 i Lemvig: en ved 40 kilometer, hvor
        kilometerprisen begynder, og en ved 75 kilometer, hvor arbejdsområdet slutter.
        Postnummer 2200 København N markeres uden for begge.
      </desc>
      <g fill="none" style={inkStroke}>
        <circle cx="130" cy="140" r="95" strokeWidth="1.5" />
        <circle cx="130" cy="140" r="55" strokeWidth="1.5" strokeDasharray="4 3" />
      </g>
      <circle cx="130" cy="140" r="4" style={ink} />
      <text x="138" y="136" fontSize="12" style={ink} fontWeight="700">Lemvig</text>
      <text x="130" y="41" fontSize="11" textAnchor="middle" style={ink}>75 km, arbejdsområdets grænse</text>
      <text x="130" y="81" fontSize="11" textAnchor="middle" style={ink}>40 km, fri kørsel til her</text>
      <g>
        <circle cx="352" cy="52" r="4" fill="none" style={inkStroke} strokeWidth="1.5" />
        <line x1="222" y1="66" x2="347" y2="54" style={inkStroke} strokeWidth="1" strokeDasharray="2 3" />
        <text x="300" y="30" fontSize="11" textAnchor="middle" style={ink}>2200 København N,</text>
        <text x="300" y="44" fontSize="11" textAnchor="middle" style={ink}>uden for</text>
      </g>
    </svg>
  )
}
