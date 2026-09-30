import styles from "./Loader.module.css";

// Relative bar heights, tallest-to-shortest silhouette matching the brand
// reference (a soundwave/equalizer shape) — index 1 and 4 are the mint
// accent bars, the rest use currentColor so this reads correctly whether
// it's dropped on a light or dark background.
const BARS = [0.32, 0.58, 0.85, 0.42, 1, 0.6, 0.85, 0.36, 0.66];
const ACCENT_INDEXES = [1, 4];

export function Loader({ size = "md", label, className = "" }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={[styles.loader, styles[`size-${size}`], className].filter(Boolean).join(" ")}
    >
      <span className={styles.bars} aria-hidden="true">
        {BARS.map((height, index) => (
          <span
            key={index}
            className={`${styles.bar} ${ACCENT_INDEXES.includes(index) ? styles.barAccent : ""}`}
            style={{ "--bar-height": height, "--bar-delay": `${index * 90}ms` }}
          />
        ))}
      </span>
      {label ? <span className={styles.label}>{label}</span> : <span className="sr-only">Loading…</span>}
    </span>
  );
}
