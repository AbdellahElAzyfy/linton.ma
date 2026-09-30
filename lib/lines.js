// The three specialised LINTON sites. Copy (names, pitches, capabilities)
// lives in the dictionaries under `lines.<key>`; this file only holds what
// doesn't change between languages.
export const LINES = [
  { key: "id", suffix: "/ID", domain: "linton-id.com", accent: "mint" },
  { key: "cloud", suffix: "/Cloud", domain: "linton-cloud.com", accent: "cyan" },
  { key: "media", suffix: "/Media", domain: "linton-media.com", accent: "mix" },
];

// Every sister site is bilingual with the same /fr and /en prefixes, so the
// visitor lands in the language they are already reading.
export const lineUrl = (line, lang) => `https://${line.domain}/${lang}`;
