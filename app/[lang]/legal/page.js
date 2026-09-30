import { getDictionary } from "../dictionaries";
import { PageHeader } from "@/components/home/PageHeader";
import { localizedAlternates } from "@/lib/site";
import styles from "../Home.module.css";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { legal } = await getDictionary(lang);
  return {
    title: legal.metaTitle,
    alternates: localizedAlternates(lang, "/legal"),
  };
}

export default async function LegalPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { legal } = dict;

  return (
    <>
      <PageHeader lang={lang} dict={dict} {...legal.header} />
      <section className={styles.section}>
        <div className={`shell ${styles.legalBody}`}>
          {legal.sections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
