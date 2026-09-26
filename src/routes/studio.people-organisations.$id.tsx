import { createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { RecordEditor } from "@/components/cms/RecordEditor";
import type { CmsType } from "@/lib/cms/types";

const TYPES = ["person", "community", "organisation"];

export const Route = createFileRoute("/studio/people-organisations/$id")({
  validateSearch: (s: Record<string, unknown>): { type?: string } => (typeof s["type"] === "string" && TYPES.includes(s["type"]) ? { type: s["type"] } : {}),
  head: adminHead("Edit profile", "Edit a person, community or organisation."),
  component: Editor,
});

function Editor() {
  const { id } = Route.useParams();
  const { type } = Route.useSearch();
  return <RecordEditor id={id} type={(type as CmsType | undefined) ?? "person"} />;
}
