// ASSET-MANIFEST.md: diagram-depth. Illustrates the one stated measuring rule --
// kernemåling in a borehole, at 40% of the construction's depth -- as a schematic
// cross-section. Proportions are illustrative of the rule, not a real floor's
// millimetres (no such figures exist in BRIEF.md).
import { TIMELINE } from "@/lib/content.js";

const TOP = 30;
const BOTTOM = 190;
const LEFT = 70;
const RIGHT = 270;
const HEIGHT = BOTTOM - TOP;
const MID_X = (LEFT + RIGHT) / 2;
const DEPTH_Y = TOP + (TIMELINE.boreholeDepthPct / 100) * HEIGHT;

export function DepthDiagram() {
  return (
    <figure>
      <svg
        data-diagram="depth"
        data-asset="diagram-depth"
        viewBox="0 0 400 240"
        role="img"
        aria-labelledby="depth-diagram-title depth-diagram-desc"
      >
        <title id="depth-diagram-title">Kernemåling i borehul</title>
        <desc id="depth-diagram-desc">
          {`Gulvkonstruktion set i snit, med et lodret borehul der når ${TIMELINE.boreholeDepthPct}% ned i konstruktionens dybde. Det er her kernemålingen tages.`}
        </desc>

        {/* the construction, in cross-section */}
        <rect
          x={LEFT}
          y={TOP}
          width={RIGHT - LEFT}
          height={HEIGHT}
          fill="none"
          stroke="var(--line)"
          strokeWidth="1.5"
        />
        <line
          x1={LEFT}
          y1={TOP + HEIGHT * 0.16}
          x2={RIGHT}
          y2={TOP + HEIGHT * 0.16}
          stroke="var(--line)"
          strokeWidth="1"
        />

        {/* depth scale */}
        <text x={LEFT - 10} y={TOP + 4} textAnchor="end">0 %</text>
        <text x={LEFT - 10} y={BOTTOM + 4} textAnchor="end">100 %</text>
        <line x1={LEFT - 6} y1={TOP} x2={LEFT} y2={TOP} stroke="var(--ink-2)" strokeWidth="1" />
        <line x1={LEFT - 6} y1={BOTTOM} x2={LEFT} y2={BOTTOM} stroke="var(--ink-2)" strokeWidth="1" />

        {/* the borehole */}
        <line
          x1={MID_X}
          y1={TOP}
          x2={MID_X}
          y2={DEPTH_Y}
          stroke="var(--ink)"
          strokeWidth="2"
          strokeDasharray="3 4"
        />
        <line
          x1={LEFT}
          y1={DEPTH_Y}
          x2={RIGHT}
          y2={DEPTH_Y}
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <circle cx={MID_X} cy={DEPTH_Y} r="5" fill="var(--accent)" />

        <text x={MID_X + 12} y={TOP - 10} className="diagram-label-strong">Borehul</text>
        <text x={MID_X + 12} y={DEPTH_Y - 8} className="diagram-figure">
          {TIMELINE.boreholeDepthPct}% dybde
        </text>
      </svg>
      <p className="diagram-caption">
        Kernemåling sker i borehul i {TIMELINE.boreholeDepthPct} % af konstruktionens dybde.
      </p>
    </figure>
  );
}
