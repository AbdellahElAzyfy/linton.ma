import styles from "./LineMark.module.css";

// HTML version of the LINTON wordmark, with an optional business-line
// suffix ("/ID", "/Cloud", "/Media"). Mirrors public/logo-wordmark.svg:
// Poppins bold, mint "I", smaller medium-weight mint suffix.
export function LineMark({ suffix, className = "" }) {
  return (
    <span className={[styles.mark, className].filter(Boolean).join(" ")}>
      L<span className={styles.accent}>I</span>NTON
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </span>
  );
}
