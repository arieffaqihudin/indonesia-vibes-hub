import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { adminHead } from "@/lib/admin/head";
import { TOPIC_CATEGORIES, useTopics, type TopicDefinition } from "@/lib/topics";
import { slugify, useCms } from "@/lib/cms/store";
import type { ThemeId } from "@/types/content";
import { EditorFrame, type SaveState } from "@/components/cms/EditorFrame";
import { ImageField } from "@/components/cms/pickers";
import { Field, Panel, Select, TextArea, TextInput } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/topics/$id")({
  head: adminHead("Edit topic", "Edit a topic."),
  component: TopicEditor,
});

function TopicEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const cms = useCms();
  const [topics, setTopics] = useTopics();
  const existing = topics.find((t) => t.slug === id);
  const [draft, setDraft] = useState<TopicDefinition | null>(null);
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isNew = id === "new";

  useEffect(() => {
    if (draft) return;
    if (existing) setDraft(existing);
    else if (isNew) setDraft({ id: "" as ThemeId, slug: "", intro: "", category: TOPIC_CATEGORIES[0], aliases: [], status: "Draft", updatedAt: new Date().toISOString() });
  }, [existing, isNew, draft]);
  if (!draft) return <p className="py-20 text-center text-sm text-muted-foreground">Topic not found.</p>;

  const commit = (next: TopicDefinition) => {
    if (!next.id) return;
    const record = { ...next, slug: next.slug || slugify(next.id), updatedAt: new Date().toISOString() };
    const exists = topics.some((t) => t.slug === (existing?.slug ?? record.slug));
    setTopics(exists ? topics.map((t) => (t.slug === (existing?.slug ?? record.slug) ? record : t)) : [...topics, record]);
    setSave("saved");
    if (isNew) void navigate({ to: "/admin/topics/$id", params: { id: record.slug }, replace: true });
  };
  const change = (patch: Partial<TopicDefinition>) => {
    const next = { ...draft, ...patch };
    setDraft(next); setSave("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), 700);
  };
  const articles = cms.records.filter((r) => r.type === "article" && (r.relations.topics ?? []).includes(draft.id)).length;

  return <EditorFrame backTo="/admin/topics" backLabel="Topics" title={draft.id || "New topic"} status={draft.status === "Published" ? "Published" : draft.status === "Archived" ? "Archived" : "Draft"} saveState={save}
    onSaveDraft={() => { clearTimeout(timer.current); commit({ ...draft, status: "Draft" }); setDraft({ ...draft, status: "Draft" }); toast.success("Saved"); }}
    onPreview={draft.slug ? () => window.open(`/understand-indonesia/topics/${draft.slug}`, "_blank") : undefined}
    onPublish={() => { if (!draft.id) { toast.error("Add a name first."); return; } clearTimeout(timer.current); const next = { ...draft, status: "Published" as const }; setDraft(next); commit(next); toast.success("Published"); }}
    main={<div className="mx-auto max-w-2xl space-y-6">
      <Field label="Name" htmlFor="name" hint={isNew ? undefined : "Names stay fixed so existing articles keep their topic."}>{isNew ? <TextInput id="name" value={draft.id} onChange={(v) => change({ id: v as ThemeId })} placeholder="e.g. Textiles" /> : <p className="text-2xl font-semibold text-ink">{draft.id}</p>}</Field>
      <Field label="Description" htmlFor="intro"><TextArea id="intro" rows={4} value={draft.intro} onChange={(v) => change({ intro: v })} /></Field>
      <div className="max-w-sm"><ImageField value={draft.image ?? ""} onChange={(image) => change({ image })} label="Image (optional)" /></div>
      <p className="text-sm text-muted-foreground">{articles} articles use this topic. Articles are connected from the article editor.</p>
    </div>}
    sidebar={<>
      <Panel title="Status"><Field label="Status" htmlFor="st"><Select id="st" value={draft.status} onChange={(v) => change({ status: v as TopicDefinition["status"] })} options={["Draft", "Published", "Archived"]} /></Field></Panel>
      <Panel title="Details">
        <Field label="Group" htmlFor="cat"><Select id="cat" value={draft.category} onChange={(v) => change({ category: v as TopicDefinition["category"] })} options={[...TOPIC_CATEGORIES]} /></Field>
        <Field label="Slug" htmlFor="slug"><TextInput id="slug" value={draft.slug} placeholder={slugify(draft.id)} onChange={(v) => change({ slug: slugify(v) })} /></Field>
      </Panel>
    </>} />;
}
