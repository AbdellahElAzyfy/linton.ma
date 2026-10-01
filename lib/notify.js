import "server-only";
import nodemailer from "nodemailer";

// Single integration point for enquiry delivery, so swapping the provider
// only ever means editing this file. Without SMTP credentials (local dev) the
// enquiry is only logged.
const TYPE_LABELS = {
  enquiry: "General enquiry",
};

const SKIP_KEYS = new Set(["type", "reference", "receivedAt", "lang", "message"]);

let transporter;
function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // 465 = implicit TLS; other ports (587) upgrade with STARTTLS.
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

function renderText(enquiry) {
  const lines = [];
  for (const [key, value] of Object.entries(enquiry)) {
    if (SKIP_KEYS.has(key) || !value) continue;
    lines.push(`${key}: ${value}`);
  }
  if (enquiry.message) lines.push("", "Message:", enquiry.message);
  return lines.join("\n");
}

export async function notifyEnquiry(enquiry) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log("[enquiry]", JSON.stringify(enquiry));
    return { delivered: false, configured: false };
  }

  const label = TYPE_LABELS[enquiry.type] || "Website enquiry";
  try {
    await getTransporter().sendMail({
      from: `"linton.ma" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: enquiry.email,
      subject: `[${label}] ${enquiry.reference} — ${enquiry.company || enquiry.name}`,
      text: renderText(enquiry),
    });
    return { delivered: true };
  } catch (err) {
    console.error("[enquiry] delivery failed", err);
    console.log("[enquiry]", JSON.stringify(enquiry));
    return { delivered: false };
  }
}
