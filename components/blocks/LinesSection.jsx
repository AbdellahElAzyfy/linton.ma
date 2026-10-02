import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { LinesGrid } from "@/components/home/LinesGrid";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

// The three business-line cards under a section heading. With a lead the
// heading uses the two-column layout (home), without one the compact one.
export function LinesSection({ lang, dict, section, id = "lines" }) {
  return (
    <section
      className={`${styles.section} ${section.altBackground ? styles.sectionAlt : ""}`}
      id="lines"
      aria-labelledby={`${id}-title`}
    >
      <div className="shell">
        <Reveal as="div" className={section.lead ? styles.sectionHeading : styles.sectionHeadingSimple}>
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 id={`${id}-title`} className={styles.sectionTitle}>
            {section.title}
          </h2>
          {section.lead && <p>{section.lead}</p>}
        </Reveal>
        <LinesGrid lang={lang} dict={dict} />
      </div>
    </section>
  );
}
