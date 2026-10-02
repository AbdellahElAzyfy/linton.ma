import { ContactForm } from "@/components/contact/ContactForm";
import { LineMark } from "@/components/brand/LineMark";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LINES, lineUrl } from "@/lib/lines";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

// Inline contact form + contact details card. The details and the form texts
// come from Site settings, so they match the pop-up form and the footer.
export function ContactSection({ lang, dict, section, settings }) {
  const { contact, contactForm } = settings;
  const labels = section.labels ?? {};

  const rows = [
    { label: labels.address, value: contact.address },
    { label: labels.email, value: contact.email, href: contact.email && `mailto:${contact.email}` },
    { label: labels.phone, value: contact.phone, href: contact.phone && `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
    { label: labels.hours, value: contact.hours },
  ].filter((row) => row.value);

  return (
    <section className={styles.section}>
      <div className={`shell ${styles.contactPageLayout}`}>
        <div className={styles.formCard}>
          {contactForm.eyebrow && <Eyebrow>{contactForm.eyebrow}</Eyebrow>}
          <h2 className={styles.formTitle}>{contactForm.title}</h2>
          <ContactForm lang={lang} dict={contactForm} />
        </div>

        <aside className={styles.contactAside}>
          {rows.length > 0 && (
            <div className={styles.detailsCard}>
              <h2>{section.detailsTitle}</h2>
              <dl>
                {rows.map((row) => (
                  <div key={row.label ?? row.value}>
                    <dt>{row.label}</dt>
                    <dd>{row.href ? <a href={row.href}>{row.value}</a> : row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {section.showDirect && (
            <div className={styles.directCard}>
              <h2>{section.directTitle}</h2>
              {section.directBody && <p>{section.directBody}</p>}
              <ul>
                {LINES.map((line) => (
                  <li key={line.key}>
                    <a href={lineUrl(line, lang)} target="_blank" rel="noopener">
                      <LineMark suffix={line.suffix} className={styles.directMark} />
                      <span>{line.domain}</span>
                      <span aria-hidden="true">↗</span>
                      <span className="sr-only">({dict.nav.external})</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
