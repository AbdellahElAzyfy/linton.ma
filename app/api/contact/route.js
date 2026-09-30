import { NextResponse } from "next/server";
import { notifyEnquiry } from "@/lib/notify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 5000;

function reference() {
  return `LNT-${Date.now().toString(36).toUpperCase()}`;
}

// No database on this site: an enquiry is only delivered by email (or
// written to the server log when SMTP isn't configured — see lib/notify.js).
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
  const result = await notifyEnquiry({
    type: "enquiry",
    reference: ref,
    ...values,
    lang: body.lang === "en" ? "en" : "fr",
    receivedAt: new Date().toISOString(),
  });

  // With nowhere else to keep it, an enquiry that failed to send must be
  // reported to the visitor rather than silently dropped.
  if (result.configured !== false && !result.delivered) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, reference: ref });
}
