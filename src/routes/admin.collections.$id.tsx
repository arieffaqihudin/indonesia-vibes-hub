import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Eye, GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeading, StatusIndicator, abtn, field } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { stories } from "@/data/content";
import { readCollections, useCollections, type EditorialCollection } from "@/lib/collections";
import { publicFormat } from "@/lib/editorial";
import { TOPICS } from "@/lib/topics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/collections/$id")({
  head: () => ({ meta: [{ title: "Collection editor — Indonesia Vibes CMS" }, { name: "description", content: "Curate and order a collection of published Articles." }, { property: "og:title", content: "Collection editor — Indonesia Vibes CMS" }, { property: "og:description", content: "Curate and order a collection of published Articles." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: CollectionEditor,
});

const blank = (): EditorialCollection => ({ id: `co-${Date.now().toString(36)}`, slug: "", title: "", introduction: "", longIntroduction: "", image: "", storyIds: [], formIds: [], status: "Draft", featured: false, updatedAt: new Date().toISOString() });

function CollectionEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [collections, setCollections] = useCollections();
  const [draft, setDraft] = useState<EditorialCollection | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [articleQuery, setArticleQuery] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => setDraft(id === "new" ? blank() : readCollections().find((item) => item.id === id) ?? null), [id]);

  if (!draft) return <><PageHeading eyebrow="Understand Indonesia / Collections" title="Collection not found" /><Link to="/admin/collections" className={abtn.secondary}>Back to Collections</Link></>;
  const update = (patch: Partial<EditorialCollection>) => { setDraft({ ...draft, ...patch }); setSaved(false); };
  const move = (storyId: string, delta: number) => {
    const from = draft.storyIds.indexOf(storyId); const to = from + delta;
    if (from < 0 || to < 0 || to >= draft.storyIds.length) return;
    const next = [...draft.storyIds]; [next[from], next[to]] = [next[to] as string, next[from] as string]; update({ storyIds: next });
  };
  const dropAt = (targetId: string) => {
    if (!dragId || dragId === targetId) return setDragId(null);
    const next = draft.storyIds.filter((storyId) => storyId !== dragId);
    next.splice(next.indexOf(targetId), 0, dragId); update({ storyIds: next }); setDragId(null);
  };
  const save = () => {
    const next = { ...draft, slug: draft.slug.trim() || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), updatedAt: new Date().toISOString() };
    setCollections(collections.some((item) => item.id === next.id) ? collections.map((item) => item.id === next.id ? next : item) : [...collections, next]);
    setSaved(true); if (id === "new") navigate({ to: "/admin/collections/$id", params: { id: next.id }, replace: true });
  };
  const selectedStories = draft.storyIds.map((storyId) => stories.find((story) => story.id === storyId)).filter((story) => story !== undefined);
  const available = stories.filter((story) => !draft.storyIds.includes(story.id) && (!articleQuery.trim() || `${story.title} ${story.dek} ${story.topics?.join(" ")}`.toLowerCase().includes(articleQuery.toLowerCase())));

  return <>
    <PageHeading eyebrow="Understand Indonesia / Collections" title={id === "new" ? "New Collection" : draft.title} description="Build a reading journey from existing published Articles. The order below controls the public sequence." actions={<><Link to="/admin/collections" className={abtn.secondary}>Back to Collections</Link>{draft.status === "Published" && draft.slug ? <Link to="/understand-indonesia/collections/$slug" params={{ slug: draft.slug }} className={abtn.secondary}><Eye className="h-4 w-4" /> Preview</Link> : null}<Button type="button" onClick={save} disabled={!draft.title.trim()}>Save Collection</Button></>} />
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="min-w-0 space-y-9">
        <section className="space-y-5 border-t border-border pt-6">
          <input aria-label="Collection title" className="w-full border-0 border-b border-border bg-transparent px-0 pb-3 text-3xl font-medium text-ink outline-none placeholder:text-muted-foreground focus:border-primary md:text-4xl" value={draft.title} onChange={(event) => update({ title: event.target.value })} placeholder="Collection title" />
          <label className="block text-sm font-medium text-ink">Short introduction<textarea rows={3} className={`${field} mt-2`} value={draft.introduction} onChange={(event) => update({ introduction: event.target.value })} placeholder="A concise invitation into this journey." /></label>
          <label className="block text-sm font-medium text-ink">Long introduction<textarea rows={6} className={`${field} mt-2`} value={draft.longIntroduction} onChange={(event) => update({ longIntroduction: event.target.value })} placeholder="Explain why these stories belong together and how to approach the sequence." /></label>
          <label className="block text-sm font-medium text-ink">Cover image URL<input className={`${field} mt-2`} value={draft.image} onChange={(event) => update({ image: event.target.value })} /></label>
          {draft.image ? <img src={draft.image} alt="Collection cover preview" className="aspect-[16/7] w-full object-cover" /> : null}
        </section>

        <section className="border-t border-border pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-clay">Stories in this collection</p><h2 className="mt-2 text-2xl font-semibold text-ink">Curated sequence</h2><p className="mt-1 text-sm text-muted-foreground">Drag stories or use the arrow controls. Articles are referenced, never duplicated.</p></div><Button type="button" variant="outline" onClick={() => setPickerOpen((open) => !open)}><Plus className="h-4 w-4" /> Add Article</Button></div>
          {pickerOpen ? <div className="mt-5 border-y border-border bg-sand p-4"><input type="search" className={field} value={articleQuery} onChange={(event) => setArticleQuery(event.target.value)} placeholder="Search published Articles" aria-label="Search published Articles" /><ul className="mt-3 max-h-72 divide-y divide-border overflow-y-auto">{available.map((story) => <li key={story.id} className="flex items-center justify-between gap-4 py-3"><span className="min-w-0"><span className="block truncate text-sm font-medium text-ink">{story.title}</span><span className="text-xs text-muted-foreground">{publicFormat(story)} · {story.topics?.[0] ?? "No topic"}</span></span><Button type="button" variant="ghost" size="sm" onClick={() => update({ storyIds: [...draft.storyIds, story.id] })}>Add</Button></li>)}</ul></div> : null}
          <ol className="mt-6 border-t border-border">
            {selectedStories.map((story, index) => <li key={story.id} draggable onDragStart={() => setDragId(story.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropAt(story.id)} className={cn("grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-4", dragId === story.id && "opacity-50")}>
              <span className="text-lg font-semibold text-primary tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0"><span className="flex items-center gap-2"><GripVertical aria-hidden className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" /><span className="truncate text-sm font-medium text-ink">{story.title}</span></span><span className="mt-1 block pl-6 text-xs text-muted-foreground">{publicFormat(story)} · {story.topics?.[0] ?? "No topic"}</span></span>
              <span className="flex items-center"><Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => move(story.id, -1)} aria-label={`Move ${story.title} up`}><ArrowUp className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon" disabled={index === selectedStories.length - 1} onClick={() => move(story.id, 1)} aria-label={`Move ${story.title} down`}><ArrowDown className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon" onClick={() => update({ storyIds: draft.storyIds.filter((storyId) => storyId !== story.id) })} aria-label={`Remove ${story.title}`}><Trash2 className="h-4 w-4" /></Button></span>
            </li>)}
          </ol>
          {!selectedStories.length ? <p className="border-b border-border py-10 text-center text-sm text-muted-foreground">No stories yet. Add published Articles to begin the journey.</p> : null}
        </section>
      </div>
      <aside className="space-y-5 border-t border-border pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
        <label className="block text-xs text-muted-foreground">Status<select className={`${field} mt-1`} value={draft.status} onChange={(event) => update({ status: event.target.value as EditorialCollection["status"] })}>{["Draft", "Published", "Archived"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <StatusIndicator attention={draft.status !== "Published"}>{draft.status}</StatusIndicator>
        <label className="flex min-h-10 items-center gap-2 text-sm text-ink"><input type="checkbox" checked={draft.featured} onChange={(event) => update({ featured: event.target.checked })} /> Featured Collection</label>
        <label className="block text-xs text-muted-foreground">Primary Topic (optional)<select className={`${field} mt-1`} value={draft.primaryTopic ?? ""} onChange={(event) => update({ primaryTopic: event.target.value })}><option value="">None</option>{TOPICS.map((topic) => <option key={topic.id}>{topic.id}</option>)}</select></label>
        <label className="block text-xs text-muted-foreground">Slug<input className={`${field} mt-1`} value={draft.slug} onChange={(event) => update({ slug: event.target.value })} /></label>
        <div className="border-t border-border pt-4"><p className="text-xs text-muted-foreground">{draft.storyIds.length} stories in manual order</p>{saved ? <p className="mt-2 text-xs font-medium text-clay" aria-live="polite">Saved</p> : null}</div>
      </aside>
    </div>
  </>;
}