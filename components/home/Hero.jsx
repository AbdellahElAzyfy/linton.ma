import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/home/HeroVisual";
import { localizeHref } from "@/lib/links";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

export function Hero({ lang, hero, lines }) {
  const { primaryCta, secondaryCta } = hero;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`grid-lines ${styles.gridLines}`} aria-hidden="true" />
      <div className={`shell ${styles.heroLayout}`}>
        <div className={styles.heroCopy}>
          {hero.eyebrow && (
            <Eyebrow onInverted dot>
              {hero.eyebrow}
            </Eyebrow>
          )}
          <h1 id="hero-title" className={styles.headline}>
            {hero.headlineLine1}
            {hero.headlineLine2 && <span className={styles.headlineAccent}>{hero.headlineLine2}</span>}
          </h1>
          {hero.lead && <p className={styles.lead}>{hero.lead}</p>}
          <div className={styles.actions}>
            {primaryCta?.label && <Button href={localizeHref(primaryCta.href, lang)}>{primaryCta.label}</Button>}
            {secondaryCta?.label && (
              <Button href={localizeHref(secondaryCta.href, lang)} variant="outline-inverted">
                {secondaryCta.label}
              </Button>
            )}
          </div>
          {hero.note && (
            <div className={styles.note}>
              <span className={styles.noteLine} aria-hidden="true" />
              <span>{hero.note}</span>
            </div>
          )}
        </div>

        <HeroVisual visual={hero.visual ?? {}} lines={lines} />
      </div>
    </section>
  );
}
