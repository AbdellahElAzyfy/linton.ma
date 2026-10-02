import type { Block } from "payload";
import { altBackground, locText, locTextarea, sectionTitle } from "./fields";

export const LinesGridBlock: Block = {
  slug: "linesGrid",
  labels: { singular: "Business lines grid", plural: "Business lines grids" },
  admin: { group: "Sections" },
  fields: [
    {
      name: "help",
      type: "ui",
      admin: {
        components: { Field: "/components/admin/BlockNote#BlockNote" },
        custom: {
          note: "The three cards (LINTON/ID, /Cloud, /Media) come from Globals → Business lines. Edit them there and every grid on the site updates. A link to #lines jumps to this section.",
        },
      },
    },
    locText("eyebrow"),
    sectionTitle(),
    locTextarea("lead", { description: "Optional. Shown on the right of the title on wide screens." }),
    altBackground,
  ],
};
