"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import en from "@/dictionaries/en.json";
import fr from "@/dictionaries/fr.json";
import styles from "./Home.module.css";

// not-found.js receives no props, so the locale is read from the URL. The
// dictionary JSON is imported directly (not the server-only getDictionary)
// since this must be a client component to use usePathname().
export default function NotFound() {
  const pathname = usePathname();
  const lang = pathname?.startsWith("/en") ? "en" : "fr";
  const copy = (lang === "en" ? en : fr).notFound;

  return (
    <section className={styles.notFound}>
      <div className={`grid-lines ${styles.gridLines}`} aria-hidden="true" />
      <div className={`shell ${styles.notFoundInner}`}>
        <p className={styles.notFoundCode} aria-hidden="true">
          404
        </p>
        <Eyebrow onInverted dot>
          {copy.eyebrow}
        </Eyebrow>
        <h1 className={styles.pageHeaderTitle}>{copy.title}</h1>
        <p className={styles.pageHeaderLead}>{copy.body}</p>
        <Button href={`/${lang}`}>{copy.backHome}</Button>
      </div>
    </section>
  );
}
