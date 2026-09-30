"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./ContactForm.module.css";

const initialForm = { name: "", company: "", email: "", need: "", message: "", website: "" };

// The enquiry form, used inline on /contact and inside ContactDialog.
// `onClose` is only passed by the dialog, which adds a close button to the
// success state.
export function ContactForm({ lang, dict, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [reference, setReference] = useState(null);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setStatus("error");
        return;
      }

      setReference(data.reference);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <h3>{dict.successTitle}</h3>
        <p>{dict.successBody.replace("{reference}", reference ?? "")}</p>
        {onClose ? (
          <Button
            type="button"
            compact
            onClick={() => {
              setStatus("idle");
              onClose();
            }}
          >
            {dict.close}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label>
          <span>{dict.name}</span>
          <input name="name" autoComplete="name" required value={form.name} onChange={update("name")} />
        </label>
        <label>
          <span>{dict.company}</span>
          <input name="company" autoComplete="organization" required value={form.company} onChange={update("company")} />
        </label>
        <label>
          <span>{dict.email}</span>
          <input type="email" name="email" autoComplete="email" required value={form.email} onChange={update("email")} />
        </label>
        <label>
          <span>{dict.need}</span>
          <select name="need" required value={form.need} onChange={update("need")}>
            <option value="" disabled>
              {dict.needPlaceholder}
            </option>
            {dict.needOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span>{dict.message}</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder={dict.messagePlaceholder}
          value={form.message}
          onChange={update("message")}
        />
      </label>

      <label className={styles.honeypot} aria-hidden="true">
        <span>Website</span>
        <input tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={update("website")} />
      </label>

      <div className={styles.submitRow}>
        {status === "error" && (
          <p className={styles.errorText} role="alert">
            {dict.errorBody}
          </p>
        )}
        <Button type="submit" loading={status === "submitting"}>
          {status === "submitting" ? dict.submitting : dict.submit}
        </Button>
      </div>
    </form>
  );
}
