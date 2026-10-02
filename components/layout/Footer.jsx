import Image from "next/image";
import Link from "next/link";
import { LineMark } from "@/components/brand/LineMark";
import { LINES, lineUrl } from "@/lib/lines";
import { isExternalHref, localizeHref } from "@/lib/links";
import styles from "./Footer.module.css";

// Column titles and links come from the Navigation global, the texts from
// Site settings → Footer.
export function Footer({ lang, dict, nav, footer }) {
  const year = new Date().getFullYear();
  const links = nav?.links ?? [];

  return (
    <footer className={styles.footer}>
      <div className={`grid-lines ${styles.gridLinesFaint}`} aria-hidden="true" />
      <div className={`shell ${styles.main}`}>
        <div className={styles.brandCol}>
          <Link href={`/${lang}`} aria-label={dict.meta.siteName} className={styles.logoFrame}>
            <Image src="/logo.svg" alt={dict.meta.siteName} width={374} height={236} className={styles.logo} />
          </Link>
          {footer?.description && <p className={styles.description}>{footer.description}</p>}
        </div>

        <div>
          <p className={styles.columnTitle}>{nav?.linesTitle}</p>
          <ul className={styles.linkList}>
            {LINES.map((line) => (
              <li key={line.key}>
                <a href={lineUrl(line, lang)} target="_blank" rel="noopener" className={styles.lineLink}>
                  <LineMark suffix={line.suffix} className={styles.lineMark} />
                  <span>{dict.lines[line.key].short}</span>
                  <span className="sr-only">({dict.nav.external})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {links.length > 0 && (
          <div>
            <p className={styles.columnTitle}>{nav.linksTitle}</p>
            <ul className={styles.linkList}>
              {links.map((item, index) => {
                const href = localizeHref(item.href, lang);
                return (
                  <li key={item.id ?? index}>
                    {isExternalHref(href) ? (
                      <a href={href} target="_blank" rel="noopener">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={href}>{item.label}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className={`shell ${styles.bottom}`}>
        <span>
          © {year} {dict.meta.siteName}
        </span>
        {footer?.location && <span>{footer.location}</span>}
        {footer?.rights && <span>{footer.rights}</span>}
      </div>
    </footer>
  );
}
