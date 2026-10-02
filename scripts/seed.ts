// One-time import of the original site content (scripts/seed/fr.json and
// en.json, the dictionaries the site used before Payload) into the database:
// the home, about, contact and legal pages, the navigation, the business
// lines and the site settings.
//
//   npm run seed
//
// Safe to re-run: anything that already exists is left alone, so editors'
// changes are never overwritten. SEED_FORCE=1 overwrites the globals and the
// four pages with the original content.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "../payload.config";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const read = (lang: string) => JSON.parse(fs.readFileSync(path.join(dirname, "seed", `${lang}.json`), "utf8"));
const force = process.env.SEED_FORCE === "1";

type Data = Record<string, any>;

// Plain text → Lexical rich text, one paragraph per line.
function richText(text: string) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: text.split("\n").map((line) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        textStyle: "",
        children: [{ type: "text", text: line, format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
      })),
    },
  };
}

const values = (list: string[]) => list.map((value) => ({ value }));

// Arrays and blocks are shared by both languages; only the fields inside them
// are translated. Saving the English version must therefore reuse the row ids
// of the French one, or Payload would treat them as new rows.
function withIds(data: any, saved: any): any {
  if (Array.isArray(data)) {
    return data.map((item, index) => {
      const savedItem = Array.isArray(saved) ? saved[index] : undefined;
      const merged = withIds(item, savedItem);
      return savedItem?.id && merged && typeof merged === "object" ? { ...merged, id: savedItem.id } : merged;
    });
  }
  if (data && typeof data === "object" && !("root" in data)) {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, withIds(value, saved?.[key])]));
  }
  return data;
}

function globals(d: Data): Record<string, Data> {
  const details = d.contactPage.details;
  return {
    "site-settings": {
      siteName: d.meta.siteName,
      tagline: d.meta.tagline,
      defaultTitle: d.meta.title,
      defaultDescription: d.meta.description,
      contact: { address: details.address, email: details.email, phone: details.phone, hours: details.hours },
      contactForm: { ...d.contact.form, needOptions: values(d.contact.form.needOptions) },
      footer: { description: d.footer.description, location: d.footer.location, rights: d.footer.rights },
    },
    navigation: {
      header: {
        items: [
          { type: "link", label: d.nav.about, href: "/about" },
          { type: "linesMenu", label: d.nav.lines, intro: d.nav.linesIntro },
          { type: "link", label: d.nav.contact, href: "/contact" },
        ],
        cta: { label: d.nav.cta, href: "/contact" },
      },
      footer: {
        linesTitle: d.footer.columns.lines,
        linksTitle: d.footer.columns.company,
        links: [
          { label: d.nav.about, href: "/about" },
          { label: d.nav.contact, href: "/contact" },
          { label: d.footer.legal, href: "/legal" },
        ],
      },
    },
    "business-lines": Object.fromEntries(
      ["id", "cloud", "media"].map((key) => {
        const line = d.lines[key];
        return [`${key}Line`, { name: line.name, short: line.short, pitch: line.pitch, capabilities: values(line.capabilities) }];
      })
    ),
  };
}

function pages(d: Data): Data[] {
  const contactBand = {
    blockType: "contactBand",
    eyebrow: d.contact.eyebrow,
    title: d.contact.title,
    body: d.contact.body,
    cta: d.contact.cta,
  };
  const valuesBlock = { blockType: "values", ...d.home.values };
  const hero = d.home.hero;

  return [
    {
      slug: "home",
      title: d.nav.home,
      layout: [
        {
          blockType: "hero",
          eyebrow: hero.eyebrow,
          headlineLine1: hero.headlineLine1,
          headlineLine2: hero.headlineLine2,
          lead: hero.lead,
          primaryCta: { label: hero.primaryCta, href: "#lines" },
          secondaryCta: { label: hero.secondaryCta, href: "/contact" },
          note: hero.note,
          visual: { title: hero.visualTitle, description: hero.visualDesc },
        },
        { blockType: "linesGrid", ...d.home.lines },
        { blockType: "chain", ...d.home.chain },
        valuesBlock,
        contactBand,
      ],
    },
    {
      slug: "about",
      title: d.about.metaTitle,
      meta: { title: d.about.metaTitle, description: d.about.metaDescription },
      layout: [
        { blockType: "pageHeader", ...d.about.header },
        {
          blockType: "story",
          eyebrow: d.about.story.eyebrow,
          title: d.about.story.title,
          paragraphs: d.about.story.paragraphs.map((text: string) => ({ text })),
          figures: d.about.figures,
        },
        { blockType: "linesGrid", eyebrow: d.home.lines.eyebrow, title: d.about.linesTitle, altBackground: true },
        valuesBlock,
        contactBand,
      ],
    },
    {
      slug: "contact",
      title: d.contactPage.metaTitle,
      meta: { title: d.contactPage.metaTitle, description: d.contactPage.metaDescription },
      layout: [
        { blockType: "pageHeader", ...d.contactPage.header },
        {
          blockType: "contactSection",
          detailsTitle: d.contactPage.details.title,
          labels: {
            address: d.contactPage.details.addressLabel,
            email: d.contactPage.details.emailLabel,
            phone: d.contactPage.details.phoneLabel,
            hours: d.contactPage.details.hoursLabel,
          },
          showDirect: true,
          directTitle: d.contactPage.direct.title,
          directBody: d.contactPage.direct.body,
        },
      ],
    },
    {
      slug: "legal",
      title: d.legal.metaTitle,
      meta: { title: d.legal.metaTitle },
      layout: [
        { blockType: "pageHeader", ...d.legal.header },
        {
          blockType: "text",
          sections: d.legal.sections.map((s: Data) => ({ title: s.title, body: richText(s.body) })),
        },
      ],
    },
  ];
}

const payload = await getPayload({ config });
const fr = read("fr");
const en = read("en");

const frGlobals = globals(fr);
const enGlobals = globals(en);
for (const slug of Object.keys(frGlobals)) {
  const existing = await payload.findGlobal({ slug: slug as any, locale: "fr", depth: 0 });
  const isEmpty = !existing?.updatedAt;
  if (!isEmpty && !force) {
    console.log(`global ${slug}: already set, skipped`);
    continue;
  }
  const saved = await payload.updateGlobal({ slug: slug as any, locale: "fr", data: structuredClone(frGlobals[slug]), depth: 0 });
  await payload.updateGlobal({ slug: slug as any, locale: "en", data: withIds(enGlobals[slug], saved), depth: 0 });
  console.log(`global ${slug}: imported (fr + en)`);
}

const enPages = pages(en);
for (const [index, frPage] of pages(fr).entries()) {
  const found = await payload.find({ collection: "pages", where: { slug: { equals: frPage.slug } }, limit: 1, depth: 0 });
  const existing = found.docs[0];
  if (existing && !force) {
    console.log(`page ${frPage.slug}: already exists, skipped`);
    continue;
  }

  // Cloned: Payload may add ids to the objects it's given, and the home and
  // about pages share some of them.
  // The page data is built from untyped JSON, hence the `any`.
  const data: any = structuredClone({ ...frPage, _status: "published" });
  const saved = existing
    ? await payload.update({ collection: "pages", id: existing.id, locale: "fr", data, depth: 0 })
    : await payload.create({ collection: "pages", locale: "fr", data, depth: 0 });
  await payload.update({
    collection: "pages",
    id: saved.id,
    locale: "en",
    data: { ...withIds(enPages[index], saved), _status: "published" } as any,
    depth: 0,
  });
  console.log(`page ${frPage.slug}: imported (fr + en)`);
}

console.log("Seed done.");
process.exit(0);
