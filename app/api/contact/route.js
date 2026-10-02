import { NextResponse } from "next/server";
import { notifyEnquiry } from "@/lib/notify";
import { getPayloadClient } from "@/lib/content";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 5000;

function reference() {
  return `LNT-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (body.website) {
    return NextResponse.json({ ok: true, reference: reference() });
  }

  const fields = ["name", "company", "email", "need", "message"];
  const values = Object.fromEntries(fields.map((key) => [key, typeof body[key] === "string" ? body[key].trim() : ""]));

  if (fields.some((key) => !values[key])) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  if (fields.some((key) => values[key].length > MAX_LENGTH)) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 400 });
  }

  if (!EMAIL_RE.test(values.email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const ref = reference();
  const lang = body.lang === "en" ? "en" : "fr";

  // Saved first, so the message is in the admin (Messages) even when the
  // e-mail fails; then e-mailed. Either one is enough not to lose it.
  let saved = null;
  try {
    const payload = await getPayloadClient();
    saved = await payload.create({
      collection: "submissions",
      data: { reference: ref, status: "new", emailed: false, ...values, lang },
    });
  } catch (err) {
    console.error("[enquiry] could not save to the database", err);
  }

  const result = await notifyEnquiry({
    type: "enquiry",
    reference: ref,
    ...values,
    lang,
    receivedAt: new Date().toISOString(),
  });

  if (saved && result.delivered) {
    try {
      const payload = await getPayloadClient();
      await payload.update({ collection: "submissions", id: saved.id, data: { emailed: true } });
    } catch (err) {
      console.error("[enquiry] could not mark as e-mailed", err);
    }
  }

  // Neither stored nor sent: the visitor must know, rather than believe it
  // went through. (Without SMTP configured, e.g. in local dev, the enquiry is
  // at least written to the server log.)
  if (!saved && !result.delivered && result.configured !== false) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, reference: ref });
}
