import { createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { RecordEditor } from "@/components/cms/RecordEditor";

export const Route = createFileRoute("/admin/collaborations/$id")({
  head: adminHead("Edit collaboration", "Edit a collaboration."),
  component: () => <RecordEditor id={Route.useParams().id} type="collaboration" />,
});
