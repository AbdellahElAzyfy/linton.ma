import type { Block } from "payload";
import { locText } from "./fields";

export const TextBlock: Block = {
  slug: "text",
  labels: { singular: "Text", plural: "Texts" },
  admin: { group: "Text" },
  fields: [
    {
      name: "sections",
      type: "array",
      labels: { singular: "Text section", plural: "Text sections" },
      minRows: 1,
      admin: {
        description: "A column of titled text sections — used for the legal notice, and for any long-form text.",
      },
      fields: [
        locText("title", { description: "Optional heading for this section." }),
        {
          name: "body",
          type: "richText",
          localized: true,
          required: true,
          admin: { description: "Paragraphs, lists, links, bold and italic." },
        },
      ],
    },
  ],
};
