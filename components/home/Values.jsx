import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

export function Values({ values, alt = false, id = "values" }) {
  return (
    <section className={`${styles.section} ${alt ? styles.sectionAlt : ""}`} aria-labelledby={`${id}-title`}>
      <div className="shell">
        <Reveal as="div" className={styles.sectionHeading}>
          <Eyebrow>{values.eyebrow}</Eyebrow>
          <h2 id={`${id}-title`} className={styles.sectionTitle}>
            {values.title}
          </h2>
          <p>{values.lead}</p>
        </Reveal>

        <div className={styles.valuesGrid}>
          {values.items.map((item, index) => (
            <Reveal as="article" key={item.code} delay={index * 70} className={styles.valueCard}>
              <p className={styles.valueCode}>{item.code}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
