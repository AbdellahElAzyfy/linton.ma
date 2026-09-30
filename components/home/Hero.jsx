import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/home/HeroVisual";
import styles from "@/app/[lang]/Home.module.css";

export function Hero({ lang, hero, lines }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`grid-lines ${styles.gridLines}`} aria-hidden="true" />
      <div className={`shell ${styles.heroLayout}`}>
        <div className={styles.heroCopy}>
          <Eyebrow onInverted dot>
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" className={styles.headline}>
            {hero.headlineLine1}
            <span className={styles.headlineAccent}>{hero.headlineLine2}</span>
          </h1>
          <p className={styles.lead}>{hero.lead}</p>
          <div className={styles.actions}>
            <Button href="#lines">{hero.primaryCta}</Button>
            <Button href={`/${lang}/contact`} variant="outline-inverted">
              {hero.secondaryCta}
            </Button>
          </div>
          <div className={styles.note}>
            <span className={styles.noteLine} aria-hidden="true" />
            <span>{hero.note}</span>
          </div>
        </div>

        <HeroVisual hero={hero} lines={lines} />
      </div>
    </section>
  );
}
