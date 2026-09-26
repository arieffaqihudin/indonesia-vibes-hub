import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { adminHead } from "@/lib/admin/head";
import { useCollections, type EditorialCollection } from "@/lib/collections";
import { newId, slugify, useCms } from "@/lib/cms/store";
import { EditorFrame, type SaveState } from "@/components/cms/EditorFrame";
import { AddSearch, ImageField, OrderedList } from "@/components/cms/pickers";
import { Field, Panel, Select, TextArea, TextInput, Toggle } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/collections/$id")({
  head: adminHead("Edit collection", "Edit a curated collection."),
  component: CollectionEditor,
});

function CollectionEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const cms = useCms();
  const [items, setItems] = useCollections();
  const existing = items.find((c) => c.id === id);
  const [draft, setDraft] = useState<EditorialCollection | null>(null);
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const created = useRef(false);

  useEffect(() => {
    if (draft) return;
    if (existing) { setDraft(existing); created.current = true; }
    else if (id === "new") setDraft({ id: newId("co"), slug: "", title: "", introduction: "", longIntroduction: "", image: "", storyIds: [], formIds: [], status: "Draft", featured: false, updatedAt: new Date().toISOString() });
  }, [existing, id, draft]);
  if (!draft) return <p className="py-20 text-center text-sm text-muted-foreground">Collection not found.</p>;

  const commit = (next: EditorialCollection) => {
    const record = { ...next, slug: next.slug || slugify(next.title), updatedAt: new Date().toISOString() };
    let list = created.current ? items.map((c) => (c.id === record.id ? record : c)) : [record, ...items];
    if (record.featured) list = list.map((c) => (c.id === record.id ? c : { ...c, featured: false }));
    setItems(list);
    setSave("saved");
    if (!created.current) { created.current = true; void navigate({ to: "/admin/collections/$id", params: { id: record.id }, replace: true }); }
  };
  const change = (patch: Partial<EditorialCollection>) => {
    const next = { ...draft, ...patch };
    setDraft(next); setSave("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), 700);
  };
  const articles = cms.byType("article");
  const options = articles.filter((a) => !draft.storyIds.includes(a.id)).map((a) => ({ id: a.id, label: a.title, meta: a.status }));
  const status = draft.status === "Published" ? "Published" : draft.status === "Archived" ? "Archived" : "Draft";

  return <EditorFrame backTo="/admin/collections" backLabel="Collections" title={draft.title} status={status} saveState={save}
    onSaveDraft={() => { clearTimeout(timer.current); const n = { ...draft, status: "Draft" as const }; setDraft(n); commit(n); toast.success("Draft saved"); }}
    onPreview={() => { clearTimeout(timer.current); commit(draft); window.open(`/understand-indonesia/collections/${draft.slug || slugify(draft.title)}`, "_blank"); }}
    onPublish={() => { if (!draft.title.trim()) { toast.error("Add a title first."); return; } if (draft.storyIds.length < 2) { toast.error("Add at least two stories before publishing."); return; } clearTimeout(timer.current); const n = { ...draft, status: "Published" as const }; setDraft(n); commit(n); toast.success("Published"); }}
    main={<div className="mx-auto max-w-3xl">
      <textarea aria-label="Title" rows={1} value={draft.title} placeholder="Collection title" onChange={(e) => change({ title: e.target.value })} className="w-full resize-none border-0 bg-transparent p-0 text-3xl font-semibold text-ink outline-none placeholder:text-muted-foreground/50 md:text-4xl" />
      <textarea aria-label="Introduction" rows={2} value={draft.introduction} placeholder="Introduction — what this journey is about" onChange={(e) => change({ introduction: e.target.value })} className="mt-4 w-full resize-none border-0 bg-transparent p-0 text-lg text-muted-foreground outline-none placeholder:text-muted-foreground/50" />
      <div className="mt-4"><TextArea value={draft.longIntroduction} onChange={(v) => change({ longIntroduction: v })} rows={3} placeholder="Longer introduction shown on the collection page (optional)" /></div>
      <div className="mt-6 max-w-md"><ImageField value={draft.image} onChange={(image) => change({ image })} /></div>
      <section className="mt-10">
        <h2 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">Stories in this collection</h2>
        <AddSearch options={options} onAdd={(sid) => change({ storyIds: [...draft.storyIds, sid] })} placeholder="Search existing articles to add…" />
        <div className="mt-3">{draft.storyIds.length ? <OrderedList items={draft.storyIds} onChange={(storyIds) => change({ storyIds })} render={(sid) => { const a = cms.getRecord(sid); return { title: a?.title ?? "Missing article", meta: a?.author, image: a?.image }; }} /> : <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">No stories yet. Search above to add articles in reading order.</p>}</div>
      </section>
    </div>}
    sidebar={<>
      <Panel title="Status"><Field label="Status" htmlFor="st"><Select id="st" value={draft.status} onChange={(v) => change({ status: v as EditorialCollection["status"] })} options={["Draft", "Published", "Archived"]} /></Field></Panel>
      <Panel title="Details">
        <Toggle label="Featured on homepage" checked={draft.featured} onChange={(featured) => change({ featured })} />
        <Field label="Slug" htmlFor="slug"><TextInput id="slug" value={draft.slug} placeholder={slugify(draft.title)} onChange={(v) => change({ slug: slugify(v) })} /></Field>
      </Panel>
    </>} />;
}
