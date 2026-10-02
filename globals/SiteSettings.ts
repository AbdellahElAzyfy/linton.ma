import type { GlobalConfig } from "payload";
import { locText, locTextarea } from "../collections/blocks/fields";
import { revalidateAfterChange } from "../lib/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "General & SEO",
          fields: [
            locText("siteName", { required: true, description: "Brand name, added after every page title: 'Contact — LINTON'." }),
            locText("tagline", { description: "Shown on the link-preview image, e.g. 'Traçabilité · Digitalisation · IA'." }),
            locText("defaultTitle", { required: true, description: "Browser-tab and search title for pages without their own SEO title." }),
            locTextarea("defaultDescription", { description: "Search snippet for pages without their own SEO description." }),
          ],
        },
        {
          name: "contact",
          label: "Contact details",
          description: "Shown by the 'Contact form & details' block. The e-mail is also used in the form's error message.",
          fields: [
            locText("address"),
            { name: "email", type: "email" },
            { name: "phone", type: "text", admin: { description: "Written as it should be shown, e.g. +212 5 39 00 00 00." } },
            locText("hours", { description: "e.g. Lundi – vendredi · 9 h – 18 h" }),
          ],
        },
        {
          name: "contactForm",
          label: "Contact form",
          description: "Texts of the contact form, on the contact page and in the pop-up opened by contact bands.",
          fields: [
            {
              type: "row",
              fields: [locText("eyebrow"), locText("title")],
            },
            {
              type: "collapsible",
              label: "Field labels",
              fields: [
                {
                  type: "row",
                  fields: [locText("name"), locText("company"), locText("email")],
                },
                {
                  type: "row",
                  fields: [locText("need"), locText("needPlaceholder", { label: "Need — empty choice" })],
                },
                {
                  type: "row",
                  fields: [locText("message"), locText("messagePlaceholder", { label: "Message — hint text" })],
                },
              ],
            },
            {
              name: "needOptions",
              type: "array",
              label: "Choices for the 'business line' field",
              labels: { singular: "Choice", plural: "Choices" },
              minRows: 1,
              admin: { description: "The visitor's choice is shown in the message you receive." },
              fields: [locText("value", { required: true, label: "Choice" })],
            },
            {
              type: "collapsible",
              label: "Buttons & messages",
              fields: [
                {
                  type: "row",
                  fields: [locText("submit", { label: "Send button" }), locText("submitting", { label: "Send button while sending" }), locText("close", { label: "Close button" })],
                },
                locText("successTitle"),
                locTextarea("successBody", { description: "{reference} is replaced by the message's tracking code." }),
                locTextarea("errorBody", { description: "Shown when sending fails." }),
              ],
            },
          ],
        },
        {
          name: "footer",
          label: "Footer",
          description: "Footer links and column titles are in Globals → Navigation.",
          fields: [
            locTextarea("description", { description: "Text under the logo." }),
            {
              type: "row",
              fields: [locText("location", { description: "e.g. Tanger, Maroc" }), locText("rights", { description: "e.g. Tous droits réservés." })],
            },
          ],
        },
      ],
    },
  ],
};
