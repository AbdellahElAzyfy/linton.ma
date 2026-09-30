import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "@/app/[lang]/Home.module.css";

// Dark title band at the top of inner pages.
export function PageHeader({ lang, dict, eyebrow, title, lead }) {
  return (
    <section className={styles.pageHeader} aria-labelledby="page-title">
      <div className={`grid-lines ${styles.gridLines}`} aria-hidden="true" />
      <div className={`shell ${styles.pageHeaderInner}`}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={`/${lang}`}>{dict.nav.home}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <Eyebrow onInverted>{eyebrow}</Eyebrow>
        <h1 id="page-title" className={styles.pageHeaderTitle}>
          {title}
        </h1>
        {lead && <p className={styles.pageHeaderLead}>{lead}</p>}
      </div>
    </section>
  );
}
