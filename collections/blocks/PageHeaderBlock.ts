import type { Block } from "payload";
import { locText, locTextarea } from "./fields";

export const PageHeaderBlock: Block = {
  slug: "pageHeader",
  labels: { singular: "Page header", plural: "Page headers" },
  admin: { group: "Page top" },
  fields: [
    locText("eyebrow", { description: "Small label above the title." }),
    locText("title", {
      required: true,
      description: "The page's large title. Also used as the last step of the breadcrumb (Accueil / …).",
    }),
    locTextarea("lead", { description: "Optional paragraph under the title." }),
  ],
};
