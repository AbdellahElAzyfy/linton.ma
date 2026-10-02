import type { Block } from "payload";
import { locText, locTextarea } from "./fields";

export const ContactBandBlock: Block = {
  slug: "contactBand",
  labels: { singular: "Contact band (opens the form)", plural: "Contact bands" },
  admin: { group: "Contact" },
  fields: [
    locText("eyebrow"),
    locText("title", { required: true }),
    locTextarea("body"),
    locText("cta", {
      required: true,
      label: "Button text",
      description: "The button opens the contact form in a pop-up. The form's texts are in Globals → Site settings → Contact form.",
    }),
  ],
};
