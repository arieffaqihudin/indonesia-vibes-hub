import { createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/studio/head";
import { RecordEditor } from "@/components/cms/RecordEditor";

export const Route = createFileRoute("/studio/articles/$id")({
  head: adminHead("Edit article", "Write and publish an article."),
  component: () => <RecordEditor id={Route.useParams().id} type="article" />,
});
