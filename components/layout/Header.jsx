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
import { isExternalHref, localizeHref } from "@/lib/links";
import styles from "./Header.module.css";

function NavLink({ item, lang, dict, className, isActive }) {
  const href = localizeHref(item.href, lang);
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener">
        {item.label}
        <span className="sr-only"> ({dict.nav.external})</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-current={isActive?.(href) ? "page" : undefined}>
      {item.label}
    </Link>
  );
}

// Menu items, their order and the button come from the admin (Navigation
// global). A "linesMenu" item is the drop-down of the three LINTON sites.
export function Header({ lang, dict, nav }) {
  const items = nav?.items ?? [];
  const linesMenu = items.find((item) => item.type === "linesMenu");
  const cta = nav?.cta;
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
          {items.map((item, index) =>
            item.type === "linesMenu" ? (
              <LinesMenu
                key={item.id ?? index}
                lang={lang}
                dict={dict}
                label={item.label}
                intro={item.intro}
                onOpenChange={setLinesOpen}
              />
            ) : (
              <NavLink key={item.id ?? index} item={item} lang={lang} dict={dict} className={styles.navLink} isActive={isActive} />
            )
          )}
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher lang={lang} label={dict.language.switchTo} />
          <ThemeToggle dict={dict} />
          {cta?.label && (
            <Button href={localizeHref(cta.href, lang)} compact className={styles.cta}>
              {cta.label}
            </Button>
          )}
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
        {items
          .filter((item) => item.type !== "linesMenu")
          .map((item, index) => (
            <NavLink key={item.id ?? index} item={item} lang={lang} dict={dict} className={styles.mobileNavLink} />
          ))}

        {linesMenu && (
          <>
            <p className={styles.mobileLinesTitle}>{linesMenu.label}</p>
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
          </>
        )}

        {cta?.label && (
          <div className={styles.mobileActions}>
            <Button href={localizeHref(cta.href, lang)}>{cta.label}</Button>
          </div>
        )}
      </nav>
    </header>
  );
}
