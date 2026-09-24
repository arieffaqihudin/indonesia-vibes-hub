import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeading, StatusPill, Table, Td, abtn, field } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { TOPIC_CATEGORIES, readTopics, useTopics, type TopicDefinition } from "@/lib/topics";
import type { ThemeId } from "@/types/content";

export const Route = createFileRoute("/admin/topics/$slug")({ component: TopicEditor });

const blank = (): TopicDefinition => ({ id: "" as ThemeId, slug: "", intro: "", category: "Arts & Expression", aliases: [], status: "Draft", updatedAt: new Date().toISOString() });

function TopicEditor() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const admin = useAdmin();
  const [topics, setTopics] = useTopics();
  const [draft, setDraft] = useState<TopicDefinition | null>(null);
  useEffect(() => setDraft(slug === "new" ? blank() : readTopics().find((item) => item.slug === slug) ?? null), [slug]);
  if (!draft) return <><PageHeading eyebrow="Understand Indonesia / Topics" title="Topic not found" /><Link to="/admin/topics" className={abtn.secondary}>Back to Topics</Link></>;
  const update = (patch: Partial<TopicDefinition>) => setDraft({ ...draft, ...patch });
  const articles = admin.content.filter((item) => item.kind === "story" && item.topics?.includes(draft.id));
  const related = admin.content.filter((item) => item.kind !== "story" && item.themes.includes(draft.id));
  const save = () => {
    const next = { ...draft, id: draft.id.trim() as ThemeId, slug: draft.slug.trim() || draft.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), updatedAt: new Date().toISOString() };
    setTopics(topics.some((item) => item.slug === slug) ? topics.map((item) => item.slug === slug ? next : item) : [...topics, next]);
    navigate({ to: "/admin/topics/$slug", params: { slug: next.slug }, replace: true });
  };
  return <>
    <PageHeading eyebrow="Understand Indonesia / Topics" title={slug === "new" ? "New Topic" : draft.id} description="Catalogue details and automatically connected records." actions={<Link to="/admin/topics" className={abtn.secondary}>Back to Topics</Link>} />
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <label className="block text-sm font-medium text-ink">Topic name<input required className={`${field} mt-2`} value={draft.id} onChange={(event) => update({ id: event.target.value as ThemeId })} /></label>
        <label className="block text-sm font-medium text-ink">Short description<textarea required rows={4} className={`${field} mt-2`} value={draft.intro} onChange={(event) => update({ intro: event.target.value })} /></label>
        <label className="block text-sm font-medium text-ink">Aliases and related keywords<input className={`${field} mt-2`} value={draft.aliases.join(", ")} onChange={(event) => update({ aliases: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="batik, ikat, weaving" /></label>
        <label className="block text-sm font-medium text-ink">Optional thumbnail URL<input className={`${field} mt-2`} value={draft.image ?? ""} onChange={(event) => update({ image: event.target.value })} /></label>
        <button className={abtn.primary}>Save Topic</button>
      </form>
      <aside className="space-y-5 border-t border-border pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
        <label className="block text-xs text-muted-foreground">Category<select className={`${field} mt-1`} value={draft.category} onChange={(event) => update({ category: event.target.value as TopicDefinition["category"] })}>{TOPIC_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="block text-xs text-muted-foreground">Status<select className={`${field} mt-1`} value={draft.status} onChange={(event) => update({ status: event.target.value as TopicDefinition["status"] })}>{["Draft", "Published", "Archived"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="block text-xs text-muted-foreground">Slug<input className={`${field} mt-1`} value={draft.slug} onChange={(event) => update({ slug: event.target.value })} /></label>
        <label className="flex min-h-10 items-center gap-2 text-sm text-ink"><input type="checkbox" checked={draft.featured ?? false} onChange={(event) => update({ featured: event.target.checked })} /> Featured topic</label>
      </aside>
    </div>
    <section className="mt-10 border-t border-border pt-6"><h2 className="text-sm font-semibold text-ink">Automatically connected Articles</h2><p className="mt-1 text-xs text-muted-foreground">These records reference this Topic. Manage the relationship from each Article.</p><div className="mt-4"><Table head={["Article", "Status", "Updated"]}>{articles.map((item) => <tr key={item.id}><Td><Link to="/admin/content/$id" params={{ id: item.id }} className="font-medium hover:text-primary">{item.title}</Link></Td><Td><StatusPill status={item.status} /></Td><Td>{new Date(item.updatedAt).toLocaleDateString("en-GB")}</Td></tr>)}</Table></div></section>
    {related.length ? <section className="mt-8 border-t border-border pt-6"><h2 className="text-sm font-semibold text-ink">Related people, organisations, events, places and collections</h2><ul className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">{related.map((item) => <li key={item.id} className="bg-card p-4 text-sm text-ink">{item.title}<span className="ml-2 text-xs text-muted-foreground">{item.kind}</span></li>)}</ul></section> : null}
  </>;
}