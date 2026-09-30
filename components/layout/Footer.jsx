import Image from "next/image";
import Link from "next/link";
import { LineMark } from "@/components/brand/LineMark";
import { LINES, lineUrl } from "@/lib/lines";
import styles from "./Footer.module.css";

export function Footer({ lang, dict }) {
  const year = new Date().getFullYear();
  const company = [
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
    { href: `/${lang}/legal`, label: dict.footer.legal },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`grid-lines ${styles.gridLinesFaint}`} aria-hidden="true" />
      <div className={`shell ${styles.main}`}>
        <div className={styles.brandCol}>
          <Link href={`/${lang}`} aria-label={dict.meta.siteName} className={styles.logoFrame}>
            <Image src="/logo.svg" alt={dict.meta.siteName} width={374} height={236} className={styles.logo} />
          </Link>
          <p className={styles.description}>{dict.footer.description}</p>
        </div>

        <div>
          <p className={styles.columnTitle}>{dict.footer.columns.lines}</p>
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

        <div>
          <p className={styles.columnTitle}>{dict.footer.columns.company}</p>
          <ul className={styles.linkList}>
            {company.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`shell ${styles.bottom}`}>
        <span>
          © {year} {dict.meta.siteName}
        </span>
        <span>{dict.footer.location}</span>
        <span>{dict.footer.rights}</span>
      </div>
    </footer>
  );
}
