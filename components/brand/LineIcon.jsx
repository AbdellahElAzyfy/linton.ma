// Stroke icons for the three business lines. Sized and colored by the parent
// (fill: none; stroke: currentColor), same convention as the button arrow.
const ICONS = {
  // Barcode inside scanner viewfinder corners. Bars vary in width like a
  // real symbology instead of an even comb.
  id: (
    <>
      <path d="M3 7.5V4.5A1.5 1.5 0 0 1 4.5 3h3M16.5 3h3A1.5 1.5 0 0 1 21 4.5v3M21 16.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M7.5 21h-3A1.5 1.5 0 0 1 3 19.5v-3" />
      <g fill="currentColor" stroke="none">
        <rect x="6.75" y="8" width="1.5" height="8" rx=".4" />
        <rect x="9.75" y="8" width="1" height="8" rx=".4" />
        <rect x="12.25" y="8" width="2.5" height="8" rx=".4" />
        <rect x="16.25" y="8" width="1" height="8" rx=".4" />
      </g>
    </>
  ),
  // Cloud with two connected nodes below: apps and services talking together.
  cloud: (
    <>
      <path d="M7.5 15.5a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.4 3.3 3.3 0 0 1-.7 6.6Z" />
      <path d="M9 15.5v3M15 15.5v3M9 18.5h6" />
    </>
  ),
  // Shield with a play mark: security and media.
  media: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.1 7.5 9.5 4.4-1.4 7.5-5.1 7.5-9.5V6Z" />
      <path d="m10.2 9.2 4.4 2.8-4.4 2.8Z" />
    </>
  ),
};

export function LineIcon({ line, className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {ICONS[line]}
    </svg>
  );
}
