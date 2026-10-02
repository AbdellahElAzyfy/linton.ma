import { getPublishedSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const LOCALES = ["fr", "en"];

// Published pages from the admin, in both languages. Refreshed hourly; a new
// page shows up here within the hour.
export const revalidate = 3600;

export default async function sitemap() {
  const pages = await getPublishedSlugs();

  return pages.flatMap(({ slug, updatedAt }) => {
    const path = slug === "home" ? "" : `/${slug}`;
    return LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: updatedAt,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((other) => [other, `${SITE_URL}/${other}${path}`])),
      },
    }));
  });
}
