import type { Block } from "payload";
import { altBackground, locText, locTextarea, sectionTitle } from "./fields";

export const ValuesBlock: Block = {
  slug: "values",
  labels: { singular: "Values (cards)", plural: "Values" },
  admin: { group: "Sections" },
  fields: [
    locText("eyebrow"),
    sectionTitle(),
    locTextarea("lead"),
    {
      name: "items",
      type: "array",
      labels: { singular: "Card", plural: "Cards" },
      minRows: 1,
      admin: { description: "Four cards fill one row on wide screens." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "code", type: "text", admin: { description: "Small code above the title, e.g. V-01.", width: "30%" } },
            locText("title", { required: true, admin: { width: "70%" } }),
          ],
        },
        locTextarea("body", { required: true }),
      ],
    },
    altBackground,
  ],
};
