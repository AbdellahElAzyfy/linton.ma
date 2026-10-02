import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

// getPayload keeps one instance (and one database connection) per process.
export const getPayloadClient = () => getPayload({ config });

const values = (list) => (list ?? []).map((entry) => entry.value);

// Navigation, business lines and site settings for one language: what the
// layout, header, footer and several blocks share. cache() dedupes the
// queries within one render (layout + metadata + page).
export const getSiteData = cache(async (lang) => {
  const payload = await getPayloadClient();
  const [settings, navigation, lines] = await Promise.all([
    payload.findGlobal({ slug: "site-settings", locale: lang, depth: 0 }),
    payload.findGlobal({ slug: "navigation", locale: lang, depth: 0 }),
    payload.findGlobal({ slug: "business-lines", locale: lang, depth: 0 }),
  ]);

  return {
    settings: {
      ...settings,
      contact: settings.contact ?? {},
      footer: settings.footer ?? {},
      contactForm: { ...settings.contactForm, needOptions: values(settings.contactForm?.needOptions) },
    },
    navigation: {
      header: navigation.header ?? { items: [] },
      footer: navigation.footer ?? { links: [] },
    },
    // Same shape the components used with the dictionaries: lines.id.name…
    // (stored as idLine, cloudLine, mediaLine — see globals/BusinessLines.ts)
    lines: Object.fromEntries(
      ["id", "cloud", "media"].map((key) => {
        const line = lines[`${key}Line`] ?? {};
        return [key, { ...line, capabilities: values(line.capabilities) }];
      })
    ),
  };
});

// Interface labels (dictionaries) + the business lines and site name from the
// admin, in the shape the components read: dict.nav.external, dict.lines.id…
export const mergeDict = (ui, site) => ({ ...ui, lines: site.lines, meta: { siteName: site.settings.siteName } });

// Published pages only: this is the public site, so the access rule on Pages
// applies (the local API would skip it by default).
export const getPage = cache(async (lang, slug) => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    locale: lang,
    depth: 1,
    limit: 1,
    overrideAccess: false,
  });
  return result.docs[0] ?? null;
});

export async function getPublishedSlugs() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: { _status: { equals: "published" } },
    depth: 0,
    limit: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
    overrideAccess: false,
  });
  return result.docs;
}
