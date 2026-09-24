import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeading, RowActions, SearchInput, SelectFilter, FilterToolbar, Table, Td, abtn, relative } from "@/components/admin/primitives";
import { previewAttribution } from "@/components/admin/article/AttributionSettings";
import { useAdmin } from "@/lib/admin/store";
import { contentSourceOf, CONTENT_SOURCES } from "@/lib/editorial";
import { useHomepageSettings, HERO_LIMIT_MESSAGE } from "@/lib/homepage";
import { simpleStatus } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/articles")({
  head: () => ({ meta: [
    { title: "Articles — Indonesia Vibes CMS" },
    { name: "description", content: "Find, create, edit and publish Indonesia Vibes articles." },
    { property: "og:title", content: "Articles — Indonesia Vibes CMS" },
    { property: "og:description", content: "Find, create, edit and publish Indonesia Vibes articles." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Articles,
});

function Articles() {
  const admin = useAdmin();
  const navigate = useNavigate();
  const rows = admin.content.filter((item) => item.kind === "story");
  const [homepage, setHomepage] = useHomepageSettings(rows.filter((item) => item.status === "published").map((item) => item.id));
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const topics = useMemo(() => [...new Set(rows.flatMap((item) => item.topics ?? []))].sort(), [rows]);
  const visible = rows.filter((item) => `${item.title} ${item.fields["standfirst"] ?? ""} ${previewAttribution(item).primary}`.toLowerCase().includes(query.toLowerCase()) && (!topic || item.topics?.includes(topic)) && (!source || contentSourceOf(item) === source) && (!status || simpleStatus(item.status) === status));
  const isHero = (id: string) => homepage.hero.some((hero) => hero.articleId === id || `c-${hero.articleId}` === id);
  const toggleHero = (id: string) => {
    if (isHero(id)) return setHomepage({ ...homepage, hero: homepage.hero.filter((hero) => hero.articleId !== id && `c-${hero.articleId}` !== id) });
    const item = admin.getContent(id);
    if (item?.status !== "published") return window.alert("Publish this article before adding it to Homepage Hero.");
    if (homepage.hero.length >= 5) return window.alert(HERO_LIMIT_MESSAGE);
    setHomepage({ ...homepage, hero: [...homepage.hero, { articleId: id }] });
  };
  const duplicate = (id: string) => {
    const item = admin.getContent(id); if (!item) return;
    const nextId = `c-copy-${Math.random().toString(36).slice(2, 8)}`;
    const { publishedAt: _publishedAt, scheduledFor: _scheduledFor, ...copy } = item;
    admin.createContent({ ...copy, id: nextId, title: `${item.title} — Copy`, slug: "", status: "draft", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), versions: [] });
    navigate({ to: "/admin/content/$id", params: { id: nextId } });
  };

  return <>
    <PageHeading title="Articles" description="Write, edit and publish stories for Understand Indonesia." actions={<Link to="/admin/content/new" search={{ kind: "story" }} className={abtn.primary}>+ New Article</Link>} />
    <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search articles" placeholder="Search articles…" />}>
      <SelectFilter label="Status" value={status} onChange={setStatus} options={["Draft", "In review", "Scheduled", "Published", "Archived"]} />
      <SelectFilter label="Topic" value={topic} onChange={setTopic} options={topics} />
      <SelectFilter label="Source" value={source} onChange={setSource} options={[...CONTENT_SOURCES]} />
    </FilterToolbar>
    <p className="mb-3 text-xs text-muted-foreground">{visible.length} article{visible.length === 1 ? "" : "s"}</p>
    <Table caption="Articles" head={["Article", "Author", "Topic", "Hero", "Status", "Updated", "Action"]}>
      {visible.map((item) => {
        const cover = item.fields["heroMedia"];
        return <tr key={item.id} className="group hover:bg-muted/35">
          <Td><div className="flex min-w-64 items-center gap-3">{cover ? <img src={cover} alt="" className="h-12 w-16 shrink-0 rounded-sm object-cover" /> : <span className="h-12 w-16 shrink-0 rounded-sm bg-muted" />}<div className="min-w-0"><Link to="/admin/content/$id" params={{ id: item.id }} className="block truncate font-medium text-ink hover:text-primary">{item.title}</Link><span className="block text-xs text-muted-foreground">{simpleStatus(item.status)}{item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : ""} · {item.deliveryType === "Knowledge" ? "Essentials" : item.deliveryType === "Pragmatic" ? "Perspectives" : "Deep Dive"}</span></div></div></Td>
          <Td className="text-xs text-muted-foreground">{previewAttribution(item).primary.replace(/^By /, "")}</Td>
          <Td className="text-xs text-muted-foreground">{item.topics?.[0] ?? "—"}</Td>
          <Td><button type="button" onClick={() => toggleHero(item.id)} aria-label={isHero(item.id) ? `Remove ${item.title} from Homepage Hero` : `Feature ${item.title} in Homepage Hero`} title={isHero(item.id) ? "Homepage Hero" : "Add to Homepage Hero"} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-blush hover:text-primary"><Star className="h-4 w-4" fill={isHero(item.id) ? "currentColor" : "none"} /></button></Td>
          <Td className="text-xs">{simpleStatus(item.status)}</Td>
          <Td className="text-xs text-muted-foreground">{relative(item.updatedAt)}</Td>
          <Td><RowActions label={`Actions for ${item.title}`} actions={[
            { label: "Edit", onSelect: () => navigate({ to: "/admin/content/$id", params: { id: item.id } }) },
            { label: "Preview", onSelect: () => navigate({ to: "/admin/content/$id/preview", params: { id: item.id } }) },
            { label: "Duplicate", onSelect: () => duplicate(item.id) },
            { label: "Archive", danger: true, onSelect: () => admin.transition(item.id, "archived") },
          ]} /></Td>
        </tr>;
      })}
    </Table>
  </>;
}