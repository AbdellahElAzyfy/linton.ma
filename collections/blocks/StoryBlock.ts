import type { Block } from "payload";
import { locText, locTextarea, sectionTitle } from "./fields";

export const StoryBlock: Block = {
  slug: "story",
  labels: { singular: "Story & key figures", plural: "Stories" },
  admin: { group: "Sections" },
  fields: [
    locText("eyebrow"),
    sectionTitle(),
    {
      name: "paragraphs",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: { description: "Shown to the right of the title, in this order." },
      fields: [locTextarea("text", { required: true })],
    },
    {
      name: "figures",
      type: "array",
      labels: { singular: "Figure", plural: "Figures" },
      maxRows: 4,
      admin: { description: "Optional row of big numbers under the story, e.g. '3' + 'métiers complémentaires'." },
      fields: [
        {
          type: "row",
          fields: [
            locText("value", { required: true, admin: { width: "30%" } }),
            locText("label", { required: true, admin: { width: "70%" } }),
          ],
        },
      ],
    },
  ],
};
