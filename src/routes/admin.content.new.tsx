import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ArticleEditorWorkspace } from "@/components/admin/article/ArticleEditorWorkspace";
import { GenericContentEditor } from "@/components/admin/GenericContentEditor";
import { useAdmin } from "@/lib/admin/store";
import { emptyRelationships, type ContentKind } from "@/lib/admin/types";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/content/new")({
  head: adminHead("New article", "Write and publish a new Indonesia Vibes article."),
  validateSearch: (search: Record<string, unknown>) => ({ kind: (search["kind"] as ContentKind) || "story" }),
  component: NewContent,
});

function NewContent() {
  const { kind } = Route.useSearch();
  const admin = useAdmin();
  const [id] = useState(() => `c-new-${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    if (admin.content.some((item) => item.id === id)) return;
    const now = new Date().toISOString();
    admin.createContent({
      id, kind, ...(kind === "story" ? { deliveryType: "Knowledge" as const, contentSource: "Internal" as const, topics: [] } : {}),
      title: kind === "story" ? "Untitled article" : "Untitled",
      slug: "", status: "draft", priority: "Normal", assignedTo: admin.user.name,
      themes: [], countries: ["Indonesia"], createdAt: now, updatedAt: now, stageSince: now,
      fields: kind === "story" ? { title: "", standfirst: "", narrative: "", author: admin.user.name, heroMedia: "" } : {},
      relationships: emptyRelationships(), culturalReview: { flags: [] }, languageReview: { complete: false },
      feedback: [], notes: [], versions: [], prototype: true,
    });
  }, [admin, id, kind]);

  if (!admin.content.some((item) => item.id === id)) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Opening editor…</div>;
  return kind === "story" ? <ArticleEditorWorkspace id={id} /> : <GenericContentEditor id={id} />;
}