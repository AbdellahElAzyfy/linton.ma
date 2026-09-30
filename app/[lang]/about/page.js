import { getDictionary } from "../dictionaries";
import { PageHeader } from "@/components/home/PageHeader";
import { LinesGrid } from "@/components/home/LinesGrid";
import { Values } from "@/components/home/Values";
import { ContactBand } from "@/components/home/ContactBand";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { localizedAlternates } from "@/lib/site";
import styles from "../Home.module.css";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { about } = await getDictionary(lang);
  return {
    title: about.metaTitle,
    description: about.metaDescription,
    alternates: localizedAlternates(lang, "/about"),
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { about } = dict;

  return (
    <>
      <PageHeader lang={lang} dict={dict} {...about.header} />

      <section className={styles.section} aria-labelledby="story-title">
        <div className={`shell ${styles.storyLayout}`}>
          <Reveal as="div">
            <Eyebrow>{about.story.eyebrow}</Eyebrow>
            <h2 id="story-title" className={styles.sectionTitle}>
              {about.story.title}
            </h2>
          </Reveal>
          <Reveal as="div" delay={80} className={styles.storyBody}>
            {about.story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <div className={`shell ${styles.figures}`}>
          {about.figures.map((figure, index) => (
            <Reveal as="div" key={figure.label} delay={index * 80} className={styles.figure}>
              <span className={styles.figureValue}>{figure.value}</span>
              <span className={styles.figureLabel}>{figure.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="about-lines-title">
        <div className="shell">
          <Reveal as="div" className={styles.sectionHeadingSimple}>
            <Eyebrow>{dict.home.lines.eyebrow}</Eyebrow>
            <h2 id="about-lines-title" className={styles.sectionTitle}>
              {about.linesTitle}
            </h2>
          </Reveal>
          <LinesGrid lang={lang} dict={dict} />
        </div>
      </section>

      <Values values={dict.home.values} />
      <ContactBand lang={lang} contact={dict.contact} />
    </>
  );
}
