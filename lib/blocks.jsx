import { Fragment } from "react";
import { Hero } from "@/components/home/Hero";
import { PageHeader } from "@/components/home/PageHeader";
import { Chain } from "@/components/home/Chain";
import { Values } from "@/components/home/Values";
import { ContactBand } from "@/components/home/ContactBand";
import { LinesSection } from "@/components/blocks/LinesSection";
import { Story } from "@/components/blocks/Story";
import { ContactSection } from "@/components/blocks/ContactSection";
import { TextSection } from "@/components/blocks/TextSection";

// One entry per block type in collections/Pages.ts. `id` keeps heading ids
// unique when an editor uses the same block twice on a page.
const registry = {
  hero: ({ block, lang, dict }) => <Hero lang={lang} hero={block} lines={dict.lines} />,
  pageHeader: ({ block, lang, dict }) => (
    <PageHeader lang={lang} dict={dict} eyebrow={block.eyebrow} title={block.title} lead={block.lead} />
  ),
  linesGrid: ({ block, lang, dict, id }) => <LinesSection lang={lang} dict={dict} section={block} id={id} />,
  chain: ({ block, id }) => <Chain chain={{ ...block, steps: block.steps ?? [] }} id={id} />,
  values: ({ block, id }) => <Values values={{ ...block, items: block.items ?? [] }} alt={block.altBackground} id={id} />,
  story: ({ block, id }) => <Story story={block} id={id} />,
  contactBand: ({ block, lang, site, id }) => (
    <ContactBand lang={lang} contact={block} form={site.settings.contactForm} id={id} />
  ),
  contactSection: ({ block, lang, dict, site }) => (
    <ContactSection lang={lang} dict={dict} section={block} settings={site.settings} />
  ),
  text: ({ block }) => <TextSection text={block} />,
};

export function Blocks({ layout, lang, dict, site }) {
  return (layout ?? []).map((block, index) => {
    const render = registry[block.blockType];
    if (!render) return null;
    const key = block.id ?? index;
    return <Fragment key={key}>{render({ block, lang, dict, site, id: `b-${key}` })}</Fragment>;
  });
}
