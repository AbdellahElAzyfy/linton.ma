import type { AdminViewServerProps } from "payload";
import React from "react";
import { redirect } from "next/navigation";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { DocumentationBody } from "./DocumentationBody";

export async function DocumentationView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props;

  // Custom admin views registered under `admin.components.views` are treated
  // by Payload's RootPage as implicitly public (see `isCustomAdminView`) —
  // unlike collection/global views, they are NOT auth-gated automatically.
  // Must check the session ourselves or this page is reachable by anyone.
  if (!initPageResult.req.user) {
    redirect(`/admin/login`);
  }

  // Used only as the page's *initial* language — the visible language toggle
  // in DocumentationBody lets the viewer override it directly, since relying
  // solely on the admin account's language setting proved unreliable here
  // (the account-level switch didn't consistently reach this custom view).
  const initialLang = initPageResult.req.i18n.language === "fr" ? "fr" : "en";

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user ?? undefined}
      viewType="documentation"
      visibleEntities={initPageResult.visibleEntities}
    >
      <DocumentationBody initialLang={initialLang} />
    </DefaultTemplate>
  );
}
