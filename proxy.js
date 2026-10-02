import { NextResponse } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "fr";

function getLocale(request) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());

  return preferred.find((lang) => locales.includes(lang)) ?? defaultLocale;
}

// Every page lives under /fr or /en. Anything without a locale prefix is
// redirected to the visitor's preferred one; unknown paths under a locale get
// the localized 404 (app/(frontend)/[lang]/not-found.js).
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // The admin has no language prefix: /fr/admin/… and /en/admin/… go to /admin/….
  const admin = pathname.match(/^\/(?:en|fr)(\/admin(?:\/.*)?)$/);
  if (admin) {
    request.nextUrl.pathname = admin[1];
    return NextResponse.redirect(request.nextUrl);
  }

  if (/^\/(en|fr)(\/|$)/.test(pathname)) return;

  // nextUrl keeps the query string; the redirect must be absolute (Next's
  // proxy layer throws "Invalid URL" on a relative Location).
  request.nextUrl.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skips Next internals, the API, the Payload admin and any path with a file
  // extension (static files in /public, robots.txt, sitemap.xml). The
  // backslash is doubled because this is a plain JS string, not a regex
  // literal.
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
};
