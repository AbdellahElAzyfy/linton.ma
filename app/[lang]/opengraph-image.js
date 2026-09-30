import { ImageResponse } from "next/og";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { SIGNAL_BARS, SIGNAL_ACCENTS } from "@/components/brand/SignalBars";
import { LINES } from "@/lib/lines";

export const alt = "LINTON";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : "fr");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(135deg, #000038 0%, #050530 55%, #000420 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "36px" }}>
          {SIGNAL_BARS.map((height, i) => (
            <div
              key={i}
              style={{
                width: "16px",
                height: `${Math.round(height * 70)}px`,
                borderRadius: "8px",
                background: SIGNAL_ACCENTS.includes(i) ? "#00ff91" : "#f8f8f8",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "132px",
            fontWeight: 800,
            letterSpacing: "-3px",
            color: "#f8f8f8",
            lineHeight: 1,
          }}
        >
          L<span style={{ color: "#00ff91" }}>I</span>NTON
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "30px",
            fontWeight: 600,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#00c9ff",
          }}
        >
          {dict.meta.tagline}
        </div>
        <div style={{ display: "flex", gap: "20px", marginTop: "56px" }}>
          {LINES.map((line) => (
            <div
              key={line.key}
              style={{
                display: "flex",
                padding: "12px 22px",
                border: "1px solid rgba(0, 255, 145, 0.5)",
                borderRadius: "999px",
                fontSize: "24px",
                color: "#f8f8f8",
              }}
            >
              {line.domain}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
