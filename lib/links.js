// Links typed in the admin are written without the language ("/about"), so
// one link works on both the French and English sites.
const ABSOLUTE = /^(https?:|mailto:|tel:)/i;

export const isExternalHref = (href) => ABSOLUTE.test(href ?? "");

export function localizeHref(href, lang) {
  if (!href) return `/${lang}`;
  if (isExternalHref(href) || href.startsWith("#")) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  // "/fr/…" or "/en/…" typed by hand is kept as-is.
  if (/^\/(fr|en)(\/|$|#)/.test(path)) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}
