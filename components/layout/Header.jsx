"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { LinesMenu } from "@/components/layout/LinesMenu";
import { LineMark } from "@/components/brand/LineMark";
import { LINES, lineUrl } from "@/lib/lines";
import styles from "./Header.module.css";

export function Header({ lang, dict }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation (adjusted during render rather than
  // in an effect, React's pattern for resetting state when a prop changes).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  // Next 16's <Link> preserves scroll position on navigation instead of
  // resetting to the top. Deferred a frame so it runs after Next's own
  // scroll restoration; "instant" overrides the global smooth scrolling.
  // Hash links (#lines on the home page) keep their native jump.
  useEffect(() => {
    if (window.location.hash) return;
    const id = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Close the mobile menu once the viewport grows past the breakpoint where
  // its toggle disappears, or the overlay would be stuck open.
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 61rem)");
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener("change", onChange);
    return () => desktopQuery.removeEventListener("change", onChange);
  }, []);

  const isActive = (href) => pathname === href;

  return (
    <header
      className={`${styles.header} ${
        menuOpen || linesOpen ? styles.headerMenuOpen : scrolled ? styles.headerScrolled : ""
      }`}
    >
      <div className={`shell ${styles.inner}`}>
        <Link href={`/${lang}`} className={styles.brand} aria-label={dict.meta.siteName}>
          <Image src="/logo-wordmark.svg" alt="" width={340} height={120} className={styles.brandLogo} priority />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link
            href={`/${lang}/about`}
            className={styles.navLink}
            aria-current={isActive(`/${lang}/about`) ? "page" : undefined}
          >
            {dict.nav.about}
          </Link>
          <LinesMenu lang={lang} dict={dict} onOpenChange={setLinesOpen} />
          <Link
            href={`/${lang}/contact`}
            className={styles.navLink}
            aria-current={isActive(`/${lang}/contact`) ? "page" : undefined}
          >
            {dict.nav.contact}
          </Link>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher lang={lang} label={dict.language.switchTo} />
          <ThemeToggle dict={dict} />
          <Button href={`/${lang}/contact`} compact className={styles.cta}>
            {dict.nav.cta}
          </Button>
          <button
            type="button"
            className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation-mobile"
            aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav
        id="primary-navigation-mobile"
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
        aria-label="Primary mobile"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <Link href={`/${lang}`} className={styles.mobileNavLink}>
          {dict.nav.home}
        </Link>
        <Link href={`/${lang}/about`} className={styles.mobileNavLink}>
          {dict.nav.about}
        </Link>
        <Link href={`/${lang}/contact`} className={styles.mobileNavLink}>
          {dict.nav.contact}
        </Link>

        <p className={styles.mobileLinesTitle}>{dict.nav.lines}</p>
        <ul className={styles.mobileLines}>
          {LINES.map((line) => (
            <li key={line.key}>
              <a href={lineUrl(line, lang)} target="_blank" rel="noopener" className={styles.mobileLine}>
                <LineMark suffix={line.suffix} className={styles.mobileLineMark} />
                <span className={styles.mobileLineName}>{dict.lines[line.key].name}</span>
                <span className={styles.mobileLineArrow} aria-hidden="true">
                  ↗
                </span>
                <span className="sr-only">({dict.nav.external})</span>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.mobileActions}>
          <Button href={`/${lang}/contact`}>{dict.nav.cta}</Button>
        </div>
      </nav>
    </header>
  );
}
