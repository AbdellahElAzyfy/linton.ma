import { getDictionary } from "./dictionaries";
import { Hero } from "@/components/home/Hero";
import { LinesGrid } from "@/components/home/LinesGrid";
import { Chain } from "@/components/home/Chain";
import { Values } from "@/components/home/Values";
import { ContactBand } from "@/components/home/ContactBand";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Home.module.css";

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { home } = dict;

  return (
    <>
      <Hero lang={lang} hero={home.hero} lines={dict.lines} />

      <section className={styles.section} id="lines" aria-labelledby="lines-title">
        <div className="shell">
          <Reveal as="div" className={styles.sectionHeading}>
            <Eyebrow>{home.lines.eyebrow}</Eyebrow>
            <h2 id="lines-title" className={styles.sectionTitle}>
              {home.lines.title}
            </h2>
            <p>{home.lines.lead}</p>
          </Reveal>
          <LinesGrid lang={lang} dict={dict} />
        </div>
      </section>

      <Chain chain={home.chain} />
      <Values values={home.values} />
      <ContactBand lang={lang} contact={dict.contact} />
    </>
  );
}
