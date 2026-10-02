import { LineMark } from "@/components/brand/LineMark";
import { LineIcon } from "@/components/brand/LineIcon";
import { Reveal } from "@/components/ui/Reveal";
import { LINES, lineUrl } from "@/lib/lines";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

// The three business-line cards. Each whole card links out to its site: the
// hub pitches, the specialised site carries the detail.
export function LinesGrid({ lang, dict }) {
  return (
    <div className={styles.linesGrid}>
      {LINES.map((line, index) => {
        const copy = dict.lines[line.key];
        return (
          <Reveal as="article" key={line.key} delay={index * 90} className={styles.lineCard} data-accent={line.accent}>
            <a href={lineUrl(line, lang)} target="_blank" rel="noopener" className={styles.lineCardLink}>
              <div className={styles.lineBand}>
                <div className={`grid-lines ${styles.lineBandGrid}`} aria-hidden="true" />
                <span className={styles.lineScan} aria-hidden="true" />
                <div className={styles.lineBandTop}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{line.domain}</span>
                </div>
                <div className={styles.lineBandBrand}>
                  <span className={styles.lineIcon}>
                    <LineIcon line={line.key} />
                  </span>
                  <LineMark suffix={line.suffix} className={styles.lineMark} />
                </div>
              </div>

              <div className={styles.lineBody}>
                <h3>{copy.name}</h3>
                <p>{copy.pitch}</p>
                <ul className={styles.tagList}>
                  {copy.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
                <span className={styles.lineVisit}>
                  {dict.common.visit.replace("{domain}", line.domain)}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">({dict.nav.external})</span>
                </span>
              </div>
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}
