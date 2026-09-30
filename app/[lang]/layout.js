import { Barlow_Condensed, IBM_Plex_Mono, Manrope, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { themeInitScript } from "@/components/theme/theme-script";
import { MotionReady } from "@/components/motion/MotionReady";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL, localizedAlternates } from "@/lib/site";
import "@/app/globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Only for the HTML LINTON/<suffix> wordmarks (LineMark) — the SVG logos
// embed their own copy of Poppins.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    title: {
      default: dict.meta.title,
      template: `%s — ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    metadataBase: new URL(SITE_URL),
    alternates: localizedAlternates(lang),
    openGraph: {
      siteName: dict.meta.siteName,
      locale: lang === "fr" ? "fr_MA" : "en_US",
    },
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const fontVars = [barlowCondensed, manrope, plexMono, poppins].map((font) => font.variable).join(" ");

  return (
    <html lang={lang} className={fontVars} suppressHydrationWarning>
      <head>
        {/* Plain inline script, per Next 16's "preventing flash before
            hydration" guide: sets data-theme before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: `(${themeInitScript.toString()})();` }} />
      </head>
      <body>
        <ThemeProvider>
          <MotionReady />
          <a className="skip-link" href="#main-content">
            {lang === "fr" ? "Aller au contenu" : "Skip to content"}
          </a>
          <Header lang={lang} dict={dict} />
          <main id="main-content">{children}</main>
          <Footer lang={lang} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
