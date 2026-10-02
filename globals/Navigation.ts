import type { GlobalConfig } from "payload";
import { ctaGroup, HREF_HELP, hrefField, locText, locTextarea } from "../collections/blocks/fields";
import { revalidateAfterChange } from "../lib/revalidate";

const isLinesMenu = (_: unknown, sibling: { type?: string }) => sibling?.type === "linesMenu";
const isLink = (_: unknown, sibling: { type?: string }) => sibling?.type !== "linesMenu";

export const Navigation: GlobalConfig = {
  slug: "navigation",
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
          name: "header",
          label: "Header",
          fields: [
            {
              name: "items",
              type: "array",
              labels: { singular: "Menu item", plural: "Menu items" },
              admin: {
                description:
                  "Header menu, left to right (top to bottom on phones). Drag to reorder. The LINTON logo always links to the homepage.",
              },
              fields: [
                {
                  name: "type",
                  type: "radio",
                  defaultValue: "link",
                  options: [
                    { label: "Link to a page", value: "link" },
                    { label: "'Our businesses' drop-down (the three LINTON sites)", value: "linesMenu" },
                  ],
                },
                locText("label", { required: true, description: "Text shown in the menu." }),
                {
                  name: "href",
                  type: "text",
                  label: "Link",
                  // Required for links only; a drop-down has no address.
                  validate: (value: unknown, { siblingData }: { siblingData: { type?: string } }) =>
                    siblingData?.type === "linesMenu" || (typeof value === "string" && value.trim() !== "")
                      ? true
                      : "A link needs an address.",
                  admin: { description: HREF_HELP, condition: isLink },
                },
                locTextarea("intro", {
                  description: "Sentence at the top of the drop-down panel.",
                  admin: { condition: isLinesMenu },
                }),
              ],
            },
            ctaGroup("cta", "Green button on the right of the header (and at the bottom of the phone menu)."),
          ],
        },
        {
          name: "footer",
          label: "Footer",
          fields: [
            locText("linesTitle", {
              required: true,
              description: "Title of the column listing the three LINTON sites (filled automatically from Business lines).",
            }),
            locText("linksTitle", { required: true, description: "Title of the links column." }),
            {
              name: "links",
              type: "array",
              labels: { singular: "Link", plural: "Links" },
              fields: [
                {
                  type: "row",
                  fields: [locText("label", { required: true }), hrefField()],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
