import { createFileRoute } from "@tanstack/react-router";

import { ArticleEditorWorkspace } from "@/components/admin/article/ArticleEditorWorkspace";
import { GenericContentEditor } from "@/components/admin/GenericContentEditor";
import { EmptyState } from "@/components/admin/primitives";
import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/content/$id")({
  head: adminHead("Edit content", "Edit and publish an Indonesia Vibes record."),
  component: ContentEditor,
});

function ContentEditor() {
  const { id } = Route.useParams();
  const item = useAdmin().getContent(id);
  if (!item) return <EmptyState title="This record could not be found." hint="Return to its content list and choose another record." />;
  return item.kind === "story" ? <ArticleEditorWorkspace id={id} /> : <GenericContentEditor id={id} />;
}