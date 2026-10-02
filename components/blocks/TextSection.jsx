import { RichText } from "@payloadcms/richtext-lexical/react";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

// Column of titled rich-text sections (legal notice, long-form text).
export function TextSection({ text }) {
  return (
    <section className={styles.section}>
      <div className={`shell ${styles.legalBody}`}>
        {(text.sections ?? []).map((section, index) => (
          <article key={section.id ?? index}>
            {section.title && <h2>{section.title}</h2>}
            {section.body && <RichText data={section.body} className={styles.prose} />}
          </article>
        ))}
      </div>
    </section>
  );
}
