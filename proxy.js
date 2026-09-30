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
// redirected to the visitor's preferred one; unknown paths under a locale are
// answered by app/[lang]/[...rest] with a localized 404.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (/^\/(en|fr)(\/|$)/.test(pathname)) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\..*).*)"],
};
