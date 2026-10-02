import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description:
          "Describes the image for screen readers and search engines. Not shown on the page, but required for accessibility.",
      },
    },
  ],
  upload: {
    // Uploads are written to public/media on the server's disk. On cPanel
    // that folder must survive deploys: see DEPLOY.md. MEDIA_DIR can move it
    // elsewhere (an absolute path) without code changes.
    staticDir: process.env.MEDIA_DIR || path.resolve(dirname, "../public/media"),
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 900 },
      { name: "full", width: 1920 },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
};
