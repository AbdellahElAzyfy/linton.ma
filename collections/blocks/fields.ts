import type { Field } from "payload";

type Overrides = Record<string, unknown> & { description?: string; admin?: Record<string, unknown> };

// Folds a `description` shorthand into `admin.description`, so call sites can
// write `locText("eyebrow", { description: "..." })`.
const withDescription = ({ description, admin, ...rest }: Overrides) => {
  if (!description) return admin ? { admin, ...rest } : rest;
  return { ...rest, admin: { ...admin, description } };
};

export const locText = (name: string, overrides: Overrides = {}): Field =>
  ({ name, type: "text", localized: true, ...withDescription(overrides) }) as Field;

export const locTextarea = (name: string, overrides: Overrides = {}): Field =>
  ({ name, type: "textarea", localized: true, ...withDescription(overrides) }) as Field;

// Section titles are rendered with `white-space: pre-line`, so a line break
// typed here shows on the site. A text input would silently drop it.
export const sectionTitle = (description = "Section title. Press Enter to force a line break."): Field =>
  locTextarea("title", { required: true, description, admin: { rows: 2 } });

export const HREF_HELP =
  "Path without the language, e.g. /about or /contact — /fr or /en is added automatically. " +
  "#lines jumps to a section on the same page. Full https://, mailto: and tel: links are used as-is.";

export const hrefField = (name = "href", required = true): Field => ({
  name,
  type: "text",
  label: "Link",
  required,
  admin: { description: HREF_HELP },
});

// Label + link pair for buttons.
export const ctaGroup = (name: string, description: string, required = true): Field => ({
  name,
  type: "group",
  admin: { description },
  fields: [locText("label", { required, description: "Button text." }), hrefField("href", required)],
});

// Light sections can alternate with a tinted background to separate
// neighbouring blocks.
export const altBackground: Field = {
  name: "altBackground",
  type: "checkbox",
  label: "Tinted background",
  defaultValue: false,
  admin: { description: "Use the tinted background, to separate this section from the one above it." },
};

export const LINE_OPTIONS = [
  { label: "LINTON/ID — Identification & traceability", value: "id" },
  { label: "LINTON/Cloud — Development, Odoo & MS365", value: "cloud" },
  { label: "LINTON/Media — Cybersecurity & media", value: "media" },
];
