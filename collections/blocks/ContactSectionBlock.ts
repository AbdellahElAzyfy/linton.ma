import type { Block } from "payload";
import { locText, locTextarea } from "./fields";

export const ContactSectionBlock: Block = {
  slug: "contactSection",
  labels: { singular: "Contact form & details", plural: "Contact forms & details" },
  admin: { group: "Contact" },
  fields: [
    {
      name: "help",
      type: "ui",
      admin: {
        components: { Field: "/components/admin/BlockNote#BlockNote" },
        custom: {
          note: "The address, e-mail, phone and opening hours, and every text of the form, come from Globals → Site settings, so they stay identical everywhere on the site. Only the headings are set here.",
        },
      },
    },
    locText("detailsTitle", { required: true, description: "Heading of the contact details card, e.g. Coordonnées." }),
    {
      name: "labels",
      type: "group",
      admin: { description: "Labels in front of each contact detail." },
      fields: [
        {
          type: "row",
          fields: [locText("address"), locText("email"), locText("phone"), locText("hours")],
        },
      ],
    },
    {
      name: "showDirect",
      type: "checkbox",
      label: "Show the 'go straight to a business site' card",
      defaultValue: true,
    },
    locText("directTitle", { admin: { condition: (_: unknown, s: { showDirect?: boolean }) => Boolean(s?.showDirect) } }),
    locTextarea("directBody", { admin: { condition: (_: unknown, s: { showDirect?: boolean }) => Boolean(s?.showDirect) } }),
  ],
};
