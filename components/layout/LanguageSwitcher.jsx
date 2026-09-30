"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import styles from "./LanguageSwitcher.module.css";

// Switching locale re-fetches Payload data (nav, dictionary, footer labels)
// inside app/(frontend)/[lang]/layout.js — but Next's loading.js explicitly
// does NOT cover the layout in its own segment folder, only page.js and
// nested layouts below it, so the route-level loading.js can never mask
// this delay. useLinkStatus's `pending` still correctly reflects the whole
// blocked navigation, so it drives a full-page overlay here instead.
// Rendered via a portal to document.body (not just position:fixed in place)
// because the header applies backdrop-filter while scrolled, which — like
// any transform/filter — creates a containing block for fixed descendants,
// the same gotcha already hit once for the mobile nav overlay.
function FullPageLoadingOverlay() {
  const { pending } = useLinkStatus();
  const [mounted, setMounted] = useState(false);

  // Portals need a real document, which doesn't exist during SSR/hydration —
  // this one-time mount flag can't be derived from a prop, so it genuinely
  // needs an effect (not the "adjust state during render" pattern).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!pending || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} role="status" aria-live="polite">
      <Loader size="lg" />
    </div>,
    document.body
  );
}

export function LanguageSwitcher({ lang, label }) {
  const pathname = usePathname();
  const otherLang = lang === "fr" ? "en" : "fr";
  const segments = pathname.split("/");
  segments[1] = otherLang;
  const target = segments.join("/") || `/${otherLang}`;

  return (
    <Link href={target} lang={otherLang} className="language-switch" hrefLang={otherLang} prefetch={false}>
      {otherLang.toUpperCase()}
      <span className="sr-only">{label}</span>
      <FullPageLoadingOverlay />
    </Link>
  );
}
