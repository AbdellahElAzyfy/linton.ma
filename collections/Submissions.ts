import type { CollectionConfig } from "payload";

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

// Contact-form messages. Created only by app/api/contact (with the local API,
// which bypasses access control); never through the public REST API.
export const Submissions: CollectionConfig = {
  slug: "submissions",
  labels: { singular: "Message", plural: "Messages" },
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "status", "name", "company", "need", "createdAt"],
    group: "Contact",
  },
  access: {
    create: () => false,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      admin: { readOnly: true, description: "Tracking code shown to the visitor after sending, e.g. LNT-MBX3K2." },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      admin: { position: "sidebar", description: "For your own follow-up only. Visitors never see it." },
      options: [
        { label: "New", value: "new" },
        { label: "In progress", value: "in_progress" },
        { label: "Answered", value: "answered" },
        { label: "Closed", value: "closed" },
      ],
    },
    {
      name: "emailed",
      type: "checkbox",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Whether the notification e-mail was sent. If not, this message only exists here.",
      },
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", admin: { readOnly: true } },
        { name: "company", type: "text", admin: { readOnly: true } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "email", type: "email", admin: { readOnly: true } },
        { name: "lang", type: "text", label: "Language", admin: { readOnly: true } },
      ],
    },
    { name: "need", type: "text", label: "Business line", admin: { readOnly: true } },
    { name: "message", type: "textarea", admin: { readOnly: true } },
    { name: "notes", type: "textarea", admin: { description: "Internal notes, e.g. who is handling it." } },
  ],
  timestamps: true,
};
