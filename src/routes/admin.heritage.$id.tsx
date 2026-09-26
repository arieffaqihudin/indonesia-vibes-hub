import { createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { RecordEditor } from "@/components/cms/RecordEditor";

export const Route = createFileRoute("/admin/heritage/$id")({
  head: adminHead("Edit heritage", "Edit a heritage record."),
  component: () => <RecordEditor id={Route.useParams().id} type="heritage" />,
});
