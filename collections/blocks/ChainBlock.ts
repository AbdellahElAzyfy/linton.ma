import type { Block } from "payload";
import { LINE_OPTIONS, locText, locTextarea, sectionTitle } from "./fields";

export const ChainBlock: Block = {
  slug: "chain",
  labels: { singular: "Chain (dark, numbered steps)", plural: "Chains" },
  admin: { group: "Sections" },
  fields: [
    locText("eyebrow"),
    sectionTitle(),
    locTextarea("lead"),
    {
      name: "steps",
      type: "array",
      labels: { singular: "Step", plural: "Steps" },
      minRows: 1,
      maxRows: 4,
      admin: { description: "Shown side by side, in this order. Three works best." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "code", type: "text", required: true, admin: { description: "e.g. 01", width: "20%" } },
            locText("verb", { required: true, description: "Step title, e.g. Capturer.", admin: { width: "40%" } }),
            {
              name: "line",
              type: "select",
              required: true,
              options: LINE_OPTIONS,
              admin: { description: "Which LINTON/… logo is shown.", width: "40%" },
            },
          ],
        },
        locTextarea("body", { required: true }),
      ],
    },
  ],
};
