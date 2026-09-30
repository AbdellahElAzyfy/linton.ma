"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LineMark } from "@/components/brand/LineMark";
import { LineIcon } from "@/components/brand/LineIcon";
import { LINES, lineUrl } from "@/lib/lines";
import styles from "./LinesMenu.module.css";

const CLOSE_DELAY = 160;

// "Our businesses" dropdown: an inset panel under the header linking out to
// the three specialised sites. Opens on hover for fine pointers (with a short
// close delay so the pointer can travel from trigger to panel) and on click
// for everyone; Escape, outside clicks and navigation close it.
export function LinesMenu({ lang, dict, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const timer = useRef(0);
  const openedByHover = useRef(false);
  const pathname = usePathname();

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const hoverOpen = (event) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(timer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };

  // With a mouse, hovering already opened the panel by the time the click
  // lands — that first click must keep it open rather than toggle it shut.
  const onTriggerClick = () => {
    if (openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    setOpen((current) => !current);
  };

  const hoverClose = (event) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      openedByHover.current = false;
      setOpen(false);
    }, CLOSE_DELAY);
  };

  const onBlur = (event) => {
    if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onTriggerClick}
      >
        {dict.nav.lines}
        <svg viewBox="0 0 10 6" aria-hidden="true" className={styles.chevron}>
          <path d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {open && <div className={styles.scrim} aria-hidden="true" />}

      <div id={panelId} className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        <p className={styles.intro}>{dict.nav.linesIntro}</p>
        <ul className={styles.grid}>
          {LINES.map((line) => {
            const copy = dict.lines[line.key];
            return (
              <li key={line.key}>
                <a
                  href={lineUrl(line, lang)}
                  target="_blank"
                  rel="noopener"
                  className={styles.card}
                  data-accent={line.accent}
                >
                  <span className={styles.cardTop}>
                    <span className={styles.icon}>
                      <LineIcon line={line.key} />
                    </span>
                    <LineMark suffix={line.suffix} className={styles.mark} />
                  </span>
                  <span className={styles.name}>{copy.name}</span>
                  <span className={styles.domain}>
                    {line.domain}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">({dict.nav.external})</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
