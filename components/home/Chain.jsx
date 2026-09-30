import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { LineMark } from "@/components/brand/LineMark";
import { LINES } from "@/lib/lines";
import styles from "@/app/[lang]/Home.module.css";

const SUFFIX = Object.fromEntries(LINES.map((line) => [line.key, line.suffix]));

// Capture → use → protect: how the three business lines chain together.
export function Chain({ chain }) {
  return (
    <section className={`${styles.section} ${styles.sectionInverted}`} aria-labelledby="chain-title">
      <div className={`grid-lines ${styles.gridLinesFaint}`} aria-hidden="true" />
      <div className={`shell ${styles.sectionInner}`}>
        <Reveal as="div" className={styles.sectionHeading}>
          <Eyebrow onInverted>{chain.eyebrow}</Eyebrow>
          <h2 id="chain-title" className={styles.sectionTitle}>
            {chain.title}
          </h2>
          <p>{chain.lead}</p>
        </Reveal>

        <ol className={styles.chainList}>
          {chain.steps.map((step, index) => (
            <Reveal as="li" key={step.code} delay={index * 120} className={styles.chainStep}>
              <span className={styles.chainCode}>{step.code}</span>
              <h3>{step.verb}</h3>
              <LineMark suffix={SUFFIX[step.line]} className={styles.chainMark} />
              <p>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
