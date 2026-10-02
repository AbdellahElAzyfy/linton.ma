import React from "react";
import Link from "next/link";
import styles from "./DocsNavLink.module.css";

// "Documentation" is spelled identically in English and French, so no
// translation branching is needed here — see DocumentationView.tsx for the
// actual bilingual page content.
export function DocsNavLink() {
  return (
    <div className={styles.wrapper}>
      <Link href="/admin/documentation" className={styles.link}>
        Documentation
      </Link>
    </div>
  );
}
