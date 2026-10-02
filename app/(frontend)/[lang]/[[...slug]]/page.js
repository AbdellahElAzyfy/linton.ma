import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { getPage, getPublishedSlugs, getSiteData, mergeDict } from "@/lib/content";
import { Blocks } from "@/lib/blocks";
import { localizedAlternates } from "@/lib/site";

const HOME_SLUG = "home";

// Every page of the site, as built in the admin (Pages collection). Pages
// are prerendered and cached; saving in the admin refreshes them (see
// lib/revalidate.ts). Pages published after the build render on first visit.
// The layout sets dynamicParams = false for the language; slugs must stay open.
export const dynamicParams = true;
// Safety net in case an admin save ever misses a cached copy (e.g. a second
// server process): cached pages are re-checked at most every 10 minutes.
export const revalidate = 600;

export async function generateStaticParams() {
  const pages = await getPublishedSlugs();
  return pages.map(({ slug }) => ({ slug: slug === HOME_SLUG ? [] : slug.split("/") }));
}

const toSlug = (segments) => (segments?.length ? segments.join("/") : HOME_SLUG);
const toPath = (slug) => (slug === HOME_SLUG ? "" : `/${slug}`);

export async function generateMetadata({ params }) {
  const { lang, slug: segments } = await params;
  const slug = toSlug(segments);
  const page = await getPage(lang, slug);
  if (!page) return {};

  const meta = page.meta ?? {};
  // A key that's present (even undefined) replaces the layout's value, so
  // empty fields are left out to inherit the site defaults.
  const result = { alternates: localizedAlternates(lang, toPath(slug)) };
  if (meta.title) result.title = meta.title;
  else if (slug !== HOME_SLUG) result.title = page.title;
  if (meta.description) result.description = meta.description;

  // openGraph is merged shallowly with the layout's, so siteName and locale
  // are filled in again when the page brings its own preview image.
  if (meta.image?.url) {
    const { settings } = await getSiteData(lang);
    result.openGraph = {
      siteName: settings.siteName,
      locale: lang === "fr" ? "fr_MA" : "en_US",
      images: [{ url: meta.image.url, alt: meta.image.alt ?? "" }],
    };
  }
  return result;
}

export default async function Page({ params }) {
  const { lang, slug: segments } = await params;
  const page = await getPage(lang, toSlug(segments));
  if (!page) notFound();

  const [ui, site] = await Promise.all([getDictionary(lang), getSiteData(lang)]);
  return <Blocks layout={page.layout} lang={lang} dict={mergeDict(ui, site)} site={site} />;
}
