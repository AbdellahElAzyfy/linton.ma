import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

export function Story({ story, id = "story" }) {
  const paragraphs = story.paragraphs ?? [];
  const figures = story.figures ?? [];

  return (
    <section className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={`shell ${styles.storyLayout}`}>
        <Reveal as="div">
          {story.eyebrow && <Eyebrow>{story.eyebrow}</Eyebrow>}
          <h2 id={`${id}-title`} className={styles.sectionTitle}>
            {story.title}
          </h2>
        </Reveal>
        <Reveal as="div" delay={80} className={styles.storyBody}>
          {paragraphs.map((paragraph, index) => (
            <p key={paragraph.id ?? index}>{paragraph.text}</p>
          ))}
        </Reveal>
      </div>

      {figures.length > 0 && (
        <div className={`shell ${styles.figures}`}>
          {figures.map((figure, index) => (
            <Reveal as="div" key={figure.id ?? index} delay={index * 80} className={styles.figure}>
              <span className={styles.figureValue}>{figure.value}</span>
              <span className={styles.figureLabel}>{figure.label}</span>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
