import { SITE_URL } from "@/lib/site";

const LOCALES = ["fr", "en"];
const PATHS = ["", "/about", "/contact", "/legal"];

export default function sitemap() {
  return PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((other) => [other, `${SITE_URL}/${other}${path}`])),
      },
    }))
  );
}
