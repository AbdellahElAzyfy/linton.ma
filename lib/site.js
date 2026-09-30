export const SITE_URL = "https://linton.ma";

// Canonical + hreflang alternates for a page, given its path without the
// locale ("" for home, "/about", …). Set per page: in the layout it would
// make every page canonicalize to the home page.
export function localizedAlternates(lang, path = "") {
  return {
    canonical: `/${lang}${path}`,
    languages: { fr: `/fr${path}`, en: `/en${path}`, "x-default": `/fr${path}` },
  };
}
