import type { Block } from "payload";
import { ctaGroup, locText, locTextarea } from "./fields";

export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Heroes" },
  admin: { group: "Page top" },
  fields: [
    locText("eyebrow", { description: "Small label above the headline, e.g. 'Groupe LINTON · Maroc'." }),
    {
      type: "row",
      fields: [
        locText("headlineLine1", { required: true, label: "Headline — line 1", description: "Shown in white." }),
        locText("headlineLine2", { label: "Headline — line 2", description: "Shown in the green accent colour." }),
      ],
    },
    locTextarea("lead", { description: "Paragraph under the headline." }),
    {
      type: "row",
      fields: [
        ctaGroup("primaryCta", "Main (green) button."),
        ctaGroup("secondaryCta", "Second (outlined) button. Leave both fields empty to hide it.", false),
      ],
    },
    locText("note", { description: "Short line under the buttons, e.g. '3 métiers · 1 seul interlocuteur'." }),
    {
      name: "visual",
      type: "group",
      label: "Animated visual — description for screen readers",
      admin: {
        description:
          "The orbit animation on the right isn't editable, but blind visitors hear this title and description instead of seeing it.",
      },
      fields: [locText("title"), locTextarea("description")],
    },
  ],
};
