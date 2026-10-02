import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { fr } from "@payloadcms/translations/languages/fr";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Submissions } from "./collections/Submissions";
import { SiteSettings } from "./globals/SiteSettings";
import { Navigation } from "./globals/Navigation";
import { BusinessLines } from "./globals/BusinessLines";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " — LINTON admin" },
    components: {
      views: {
        documentation: {
          Component: "/components/admin/DocumentationView#DocumentationView",
          path: "/documentation",
          meta: { title: "Documentation" },
        },
      },
      afterNavLinks: ["/components/admin/DocsNavLink#DocsNavLink"],
    },
  },
  collections: [Pages, Media, Submissions, Users],
  globals: [Navigation, BusinessLines, SiteSettings],
  editor: lexicalEditor(),
  // Admin *interface* language (buttons, labels). Each user picks theirs on
  // their Account page. Separate from `localization` (the site content).
  i18n: {
    supportedLanguages: { fr, en },
    fallbackLanguage: "fr",
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
    connectOptions: {
      // Fail within seconds when the VPS is unreachable instead of hanging
      // until Passenger's startup timeout.
      serverSelectionTimeoutMS: 8000,
    },
  }),
  sharp,
  // Content languages. An English field left empty shows the French text.
  localization: {
    locales: [
      { code: "fr", label: "Français" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "fr",
    fallback: true,
  },
});
