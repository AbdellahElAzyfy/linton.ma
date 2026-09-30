import { getDictionary } from "../dictionaries";
import { PageHeader } from "@/components/home/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { LineMark } from "@/components/brand/LineMark";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LINES, lineUrl } from "@/lib/lines";
import { localizedAlternates } from "@/lib/site";
import styles from "../Home.module.css";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { contactPage } = await getDictionary(lang);
  return {
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
    alternates: localizedAlternates(lang, "/contact"),
  };
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { contactPage } = dict;
  const { details } = contactPage;

  const rows = [
    { label: details.addressLabel, value: details.address },
    { label: details.emailLabel, value: details.email, href: `mailto:${details.email}` },
    { label: details.phoneLabel, value: details.phone, href: `tel:${details.phone.replace(/\s/g, "")}` },
    { label: details.hoursLabel, value: details.hours },
  ];

  return (
    <>
      <PageHeader lang={lang} dict={dict} {...contactPage.header} />

      <section className={styles.section}>
        <div className={`shell ${styles.contactPageLayout}`}>
          <div className={styles.formCard}>
            <Eyebrow>{dict.contact.form.eyebrow}</Eyebrow>
            <h2 className={styles.formTitle}>{dict.contact.form.title}</h2>
            <ContactForm lang={lang} dict={dict.contact.form} />
          </div>

          <aside className={styles.contactAside}>
            <div className={styles.detailsCard}>
              <h2>{details.title}</h2>
              <dl>
                {rows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.href ? <a href={row.href}>{row.value}</a> : row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.directCard}>
              <h2>{contactPage.direct.title}</h2>
              <p>{contactPage.direct.body}</p>
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
          </aside>
        </div>
      </section>
    </>
  );
}
