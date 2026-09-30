import Link from "next/link";
import { Loader } from "./Loader";

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="m7 4 6 6-6 6" />
  </svg>
);

export function Button({
  href,
  variant,
  compact = false,
  icon = true,
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}) {
  const classes = [
    "button",
    variant === "dark" && "button-dark",
    variant === "outline" && "button-outline",
    variant === "outline-inverted" && "button-outline-inverted",
    compact && "button-compact",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {loading ? <Loader size="sm" /> : icon && <ArrowIcon />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
