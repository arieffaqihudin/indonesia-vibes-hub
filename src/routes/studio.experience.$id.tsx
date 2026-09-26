import { createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/studio/head";
import { RecordEditor } from "@/components/cms/RecordEditor";

export const Route = createFileRoute("/studio/experience/$id")({
  validateSearch: (s: Record<string, unknown>): { type?: "event" | "place" } => (s["type"] === "event" || s["type"] === "place" ? { type: s["type"] } : {}),
  head: adminHead("Edit event or place", "Edit an event or place."),
  component: Editor,
});

function Editor() {
  const { id } = Route.useParams();
  const { type } = Route.useSearch();
  return <RecordEditor id={id} type={type ?? "event"} />;
}
