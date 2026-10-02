import type { UIFieldServerProps } from "payload";
import React from "react";

// Help text at the top of a block in the editor. The text is set on the
// field itself: `admin: { components: { Field: ".../BlockNote#BlockNote" },
// custom: { note: "..." } }`.
export function BlockNote({ field }: UIFieldServerProps) {
  const note = field?.admin?.custom?.note;
  if (!note) return null;

  return (
    <p
      style={{
        margin: "0 0 var(--base)",
        padding: "0.75rem 1rem",
        borderLeft: "3px solid var(--theme-success-500)",
        background: "var(--theme-elevation-50)",
        color: "var(--theme-elevation-800)",
        fontSize: "0.85rem",
        lineHeight: 1.5,
      }}
    >
      {note}
    </p>
  );
}
