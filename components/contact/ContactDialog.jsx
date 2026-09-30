"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "./ContactForm";
import styles from "./ContactForm.module.css";

export function ContactDialog({ lang, dict, triggerLabel }) {
  const dialogRef = useRef(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button type="button" onClick={() => dialogRef.current?.showModal()}>
        {triggerLabel}
      </Button>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="contact-dialog-title">
        <div className={styles.shell}>
          <div className={styles.head}>
            <div>
              <Eyebrow>{dict.eyebrow}</Eyebrow>
              <h2 id="contact-dialog-title">{dict.title}</h2>
            </div>
            <button type="button" className={styles.close} aria-label={dict.close} onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <ContactForm lang={lang} dict={dict} onClose={close} />
        </div>
      </dialog>
    </>
  );
}
