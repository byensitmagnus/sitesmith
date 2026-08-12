// The drawn mark (ASSET-MANIFEST.md: mark-depth). A viewfinder-style frame around a
// vertical shaft (the borehole) with one accent tick at 40% depth -- the one rule most
// specific to how this company works. No stock icon, no filled rounded rectangle.
type MarkProps = {
  size?: number;
  className?: string;
};

export function Mark({ size = 28, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
      data-asset="mark-depth"
    >
      <path d="M2 9 L2 2 L9 2" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <path d="M30 23 L30 30 L23 30" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <line x1="16" y1="4" x2="16" y2="28" stroke="var(--ink)" strokeWidth="1.5" />
      <line
        x1="9"
        y1="13.6"
        x2="23"
        y2="13.6"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
