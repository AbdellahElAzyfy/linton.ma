import type { Field, GlobalConfig } from "payload";
import { locText, locTextarea } from "../collections/blocks/fields";
import { revalidateAfterChange } from "../lib/revalidate";

// The three sister sites are fixed (domain, logo suffix and colour live in
// lib/lines.js); only how they're described is editable. Groups are named
// <key>Line because a field can't be called "id".
const line = (name: string, label: string): Field => ({
  name,
  type: "group",
  label,
  fields: [
    {
      type: "row",
      fields: [
        locText("name", { required: true, description: "Full name, e.g. Identification & traçabilité." }),
        locText("short", { required: true, description: "Short name for small spaces (footer, hero badges)." }),
      ],
    },
    locTextarea("pitch", { required: true, description: "Paragraph on the business-line cards." }),
    {
      name: "capabilities",
      type: "array",
      labels: { singular: "Capability", plural: "Capabilities" },
      admin: { description: "Tags on the card. Five fit well." },
      fields: [locText("value", { required: true, label: "Capability" })],
    },
  ],
});

export const BusinessLines: GlobalConfig = {
  slug: "business-lines",
  label: "Business lines",
  admin: {
    description:
      "The three LINTON sites, as shown in the 'Our businesses' menu, the business-lines grids, the footer and the hero. Each card links to its site.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    line("idLine", "LINTON/ID — linton-id.com"),
    line("cloudLine", "LINTON/Cloud — linton-cloud.com"),
    line("mediaLine", "LINTON/Media — linton-media.com"),
  ],
};
