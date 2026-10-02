import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ContactDialog } from "@/components/contact/ContactDialog";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

export function ContactBand({ lang, contact, form, id = "contact" }) {
  return (
    <section className={styles.contactSection} id="contact" aria-labelledby={`${id}-title`}>
      <div className={`grid-lines ${styles.gridLinesFaint}`} aria-hidden="true" />
      <Reveal as="div" className={`shell ${styles.contactLayout}`}>
        <div>
          <Eyebrow onInverted>{contact.eyebrow}</Eyebrow>
          <h2 id={`${id}-title`}>{contact.title}</h2>
        </div>
        <div className={styles.contactAction}>
          <p>{contact.body}</p>
          <ContactDialog lang={lang} dict={form} triggerLabel={contact.cta} />
        </div>
      </Reveal>
    </section>
  );
}
