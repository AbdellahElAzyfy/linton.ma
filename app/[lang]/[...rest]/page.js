import { notFound } from "next/navigation";

// Catches every unknown path under /fr or /en so it renders the localized
// not-found.js inside the site layout (header, footer, theme) with a real 404.
export default function CatchAll() {
  notFound();
}
