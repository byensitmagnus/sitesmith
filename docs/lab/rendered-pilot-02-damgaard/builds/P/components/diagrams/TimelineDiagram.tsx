// ASSET-MANIFEST.md: diagram-timeline. Shows the measuring cadence (every 7th day)
// against the typical 18-45 day range, and lists the three drying thresholds
// separately -- not plotted at a day, because BRIEF.md is explicit that Damgaard
// cannot say in advance which day a threshold will be reached.
import { TIMELINE } from "@/lib/content.js";

const DAY_MAX = 49;
const AXIS_LEFT = 46;
const AXIS_RIGHT = 440;
const AXIS_Y = 74;

function xForDay(day: number) {
  return AXIS_LEFT + (day / DAY_MAX) * (AXIS_RIGHT - AXIS_LEFT);
}

export function TimelineDiagram() {
  const ticks: number[] = [];
  for (let d = TIMELINE.measureEveryDays; d <= 42; d += TIMELINE.measureEveryDays) {
    ticks.push(d);
  }
  const bandStart = xForDay(TIMELINE.minDays);
  const bandEnd = xForDay(TIMELINE.maxDays);

  return (
    <figure>
      <svg
        data-diagram="timeline"
        data-asset="diagram-timeline"
        viewBox="0 0 480 150"
        role="img"
        aria-labelledby="timeline-diagram-title timeline-diagram-desc"
      >
        <title id="timeline-diagram-title">Måling og tørretid</title>
        <desc id="timeline-diagram-desc">
          {`Tidslinje fra dag 0. Der måles hver ${TIMELINE.measureEveryDays}. døgn. Et forløb varer typisk ${TIMELINE.minDays} til ${TIMELINE.maxDays} døgn, markeret som et bånd på tidslinjen.`}
        </desc>

        <rect
          x={bandStart}
          y={AXIS_Y - 16}
          width={bandEnd - bandStart}
          height="32"
          fill="var(--surface-2)"
          stroke="var(--line)"
        />
        <text x={(bandStart + bandEnd) / 2} y={AXIS_Y - 24} textAnchor="middle" className="diagram-label-strong">
          {`Typisk ${TIMELINE.minDays}–${TIMELINE.maxDays} døgn`}
        </text>

        <line x1={AXIS_LEFT} y1={AXIS_Y} x2={AXIS_RIGHT} y2={AXIS_Y} stroke="var(--ink-2)" strokeWidth="1.5" />

        {/* Tick marks only, no per-tick day numbers: at this width, six 7-day ticks
            plus the 18/45 band-boundary labels crowd into unreadable "18.21." pairs.
            The cadence is stated in words below; the marks carry the rhythm. */}
        {ticks.map((d) => (
          <line
            key={d}
            x1={xForDay(d)}
            y1={AXIS_Y - 6}
            x2={xForDay(d)}
            y2={AXIS_Y + 6}
            stroke="var(--ink-2)"
            strokeWidth="1.5"
          />
        ))}
        <line x1={bandStart} y1={AXIS_Y - 8} x2={bandStart} y2={AXIS_Y + 8} stroke="var(--accent)" strokeWidth="2" />
        <line x1={bandEnd} y1={AXIS_Y - 8} x2={bandEnd} y2={AXIS_Y + 8} stroke="var(--accent)" strokeWidth="2" />

        <text x={bandStart} y={AXIS_Y + 26} textAnchor="start" className="diagram-figure">
          {TIMELINE.minDays}. døgn
        </text>
        <text x={bandEnd} y={AXIS_Y + 26} textAnchor="end" className="diagram-figure">
          {TIMELINE.maxDays}. døgn
        </text>

        <text x={AXIS_LEFT} y={AXIS_Y + 46} className="diagram-label-strong">
          {`Måling hver ${TIMELINE.measureEveryDays}. døgn`}
        </text>
      </svg>

      <ul className="threshold-legend">
        {TIMELINE.thresholds.map((t) => (
          <li key={t.material}>
            <span className="diagram-label-strong">{t.material}</span> {t.verb}{" "}
            <span className="figure">{t.rule}</span>.
          </li>
        ))}
      </ul>
      <p className="diagram-caption">
        Ingen tærskel er knyttet til en bestemt dag på tidslinjen — hvornår den nås, kan
        Damgaard ikke sige på forhånd.
      </p>
    </figure>
  );
}
