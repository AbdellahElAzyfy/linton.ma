import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "../lib/revalidate";
import { HeroBlock } from "./blocks/HeroBlock";
import { PageHeaderBlock } from "./blocks/PageHeaderBlock";
import { LinesGridBlock } from "./blocks/LinesGridBlock";
import { ChainBlock } from "./blocks/ChainBlock";
import { ValuesBlock } from "./blocks/ValuesBlock";
import { StoryBlock } from "./blocks/StoryBlock";
import { ContactBandBlock } from "./blocks/ContactBandBlock";
import { ContactSectionBlock } from "./blocks/ContactSectionBlock";
import { TextBlock } from "./blocks/TextBlock";

export const HOME_SLUG = "home";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
  },
  // Drafts alone don't hide unpublished pages from a plain find(); this rule
  // does. Logged-in editors (the admin, previews) still see everything.
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Page name in the admin. Also the browser-tab title when no SEO title is set below.",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "The page's address, without the language: 'about' → linton.ma/fr/about. Lowercase letters, digits and hyphens; use / for sub-pages ('about/team'). The homepage is 'home'.",
      },
      validate: (value: unknown) =>
        typeof value === "string" && SLUG_RE.test(value)
          ? true
          : "Use lowercase letters, digits and hyphens, with / between levels — e.g. about or about/team.",
    },
    {
      name: "meta",
      type: "group",
      label: "SEO & sharing",
      admin: {
        description: "Search results and social previews. Empty fields fall back to Globals → Site settings.",
      },
      fields: [
        {
          name: "title",
          type: "text",
          localized: true,
          admin: { description: "Browser tab and search-result title. ' — LINTON' is added automatically." },
        },
        {
          name: "description",
          type: "textarea",
          localized: true,
          admin: { description: "The snippet under the title in Google, and in link previews (~155 characters)." },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { description: "Image for link previews (1200 × 630). Without one, the LINTON preview image is used." },
        },
      ],
    },
    {
      name: "layout",
      type: "blocks",
      admin: {
        description:
          "The page content, top to bottom. Add, reorder, duplicate or remove blocks. Start with a Hero (homepage) or a Page header (other pages).",
      },
      blocks: [
        HeroBlock,
        PageHeaderBlock,
        LinesGridBlock,
        ChainBlock,
        ValuesBlock,
        StoryBlock,
        ContactBandBlock,
        ContactSectionBlock,
        TextBlock,
      ],
    },
  ],
};
