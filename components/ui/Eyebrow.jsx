export function Eyebrow({ onInverted = false, dot = false, children, className = "" }) {
  const classes = ["eyebrow", onInverted && "eyebrow-on-inverted", dot && "eyebrow-dot", className]
    .filter(Boolean)
    .join(" ");

  return (
    <p className={classes}>
      {dot && <span className="signal-dot" aria-hidden="true" />}
      {children}
    </p>
  );
}
