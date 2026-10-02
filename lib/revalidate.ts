import { revalidatePath } from "next/cache";

// Pages are cached and served static; any save in the admin must refresh
// them. The site is small and nearly every page shows the navigation, the
// business lines and the site settings, so everything is refreshed at once.
//
// revalidatePath only works inside the Next server. Saves from a script
// (npm run seed) run outside it and throw here; there's no cache to refresh
// then anyway.
export function revalidateSite() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // outside Next (seed script)
  }
}

export const revalidateAfterChange = <T>({ doc }: { doc: T }): T => {
  revalidateSite();
  return doc;
};

export const revalidateAfterDelete = <T>({ doc }: { doc: T }): T => {
  revalidateSite();
  return doc;
};
