import { createFileRoute, Link } from "@tanstack/react-router";
import { GripVertical, Plus } from "lucide-react";
import { useState, type DragEvent } from "react";
import { PageHeading, RowLinkAction, abtn, field } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin/store";
import { HERO_LIMIT_MESSAGE, useHomepageSettings } from "@/lib/homepage";
import { publicFormat } from "@/lib/editorial";

export const Route = createFileRoute("/admin/homepage/hero")({
  head: () => ({ meta: [
    { title: "Homepage Hero — Indonesia Vibes CMS" },
    { name: "description", content: "Choose and order up to five published articles for the homepage Hero." },
    { property: "og:title", content: "Homepage Hero — Indonesia Vibes CMS" },
    { property: "og:description", content: "Choose and order up to five published articles for the homepage Hero." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Hero,
});

function Hero() {
  const admin = useAdmin();
  const published = admin.content.filter((item) => item.kind === "story" && item.status === "published");
  const [settings, setSettings] = useHomepageSettings(published.map((item) => item.id));
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [dragged, setDragged] = useState<number | null>(null);
  const update = (hero: typeof settings.hero) => setSettings({ ...settings, hero });
  const move = (index: number, delta: number) => {
    const next = [...settings.hero];
    const target = index + delta;
    if (!next[target]) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    update(next);
  };
  const dropAt = (event: DragEvent<HTMLElement>, target: number) => {
    event.preventDefault();
    if (dragged === null || dragged === target) return;
    const next = [...settings.hero];
    const [entry] = next.splice(dragged, 1);
    if (!entry) return;
    next.splice(target, 0, entry);
    update(next);
    setDragged(null);
  };

  return <>
    <PageHeading eyebrow="Homepage / Hero" title="Homepage Hero" description="Choose and order the featured articles shown in the homepage showcase. Three to five works best." actions={<Link to="/" className={abtn.secondary}>Preview homepage ↗</Link>} />
    <p className="mb-5 border-y border-border py-3 text-sm text-ink"><strong>{settings.hero.length} / 5</strong> articles selected</p>
    <div className="mb-6 flex flex-col items-stretch gap-3 border-b border-border pb-5 sm:flex-row sm:items-end">
      <label className="min-w-0 flex-1 text-xs text-muted-foreground sm:max-w-md"><span className="mb-1 block">Published article</span><select className={field} value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">Choose an article</option>{published.filter((item) => !settings.hero.some((hero) => hero.articleId === item.id || `c-${hero.articleId}` === item.id)).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      <Button className="min-h-11 rounded-none" disabled={!selected} onClick={() => { if (settings.hero.length >= 5) { setError(HERO_LIMIT_MESSAGE); return; } update([...settings.hero, { articleId: selected }]); setSelected(""); setError(""); }}><Plus /> Add Article</Button>
    </div>
    {error ? <p role="alert" className="mb-4 border-l-2 border-primary bg-blush p-3 text-sm text-clay">{error}</p> : null}
    <div className="border-y border-border">
      {settings.hero.map((hero, index) => {
        const item = admin.getContent(hero.articleId) ?? admin.getContent(`c-${hero.articleId}`);
        const previewStory = item?.slug ? { slug: item.slug } : undefined;
        const setOverride = (key: "headline" | "summary" | "image" | "cta" | "focalPoint", value: string) => update(settings.hero.map((entry) => entry.articleId === hero.articleId ? { ...entry, [key]: value } : entry));
        return <section key={hero.articleId} draggable onDragStart={() => setDragged(index)} onDragEnd={() => setDragged(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropAt(event, index)} className={`grid gap-4 border-b border-border px-0 py-5 last:border-b-0 md:grid-cols-[3rem_minmax(16rem,1fr)_minmax(18rem,1.25fr)_auto_2rem] md:items-start md:px-4 ${dragged === index ? "bg-blush opacity-60" : ""}`}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><GripVertical className="h-4 w-4 cursor-grab" aria-hidden="true" /><span><span className="md:hidden">Order </span>{index + 1}</span></div>
          <div><p className="mb-1 text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase md:hidden">Article</p><div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">{item?.fields["heroMedia"] ? <img src={item.fields["heroMedia"]} alt="" className="aspect-[4/3] w-full object-cover" /> : <div className="aspect-[4/3] bg-muted" aria-hidden="true" />}<div className="min-w-0"><p className="font-medium text-ink">{item?.title ?? "Missing article"}</p>{item ? <><p className="mt-2 text-xs text-muted-foreground">{publicFormat(item)} · {item.topics?.[0] ?? "No topic"}</p><p className="mt-1 text-[0.68rem] font-semibold uppercase text-primary">Published</p>{previewStory ? <Link to="/stories/$slug" params={previewStory} target="_blank" className="mt-2 inline-flex min-h-11 items-center text-xs font-medium text-ink underline underline-offset-4">Preview story ↗</Link> : null}</> : null}</div></div></div>
          <div className="grid gap-2"><p className="text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase md:hidden">Overrides</p><input className={field} aria-label="Headline override" placeholder="Headline override" value={hero.headline ?? ""} onChange={(event) => setOverride("headline", event.target.value)} /><input className={field} aria-label="Summary override" placeholder="Summary override" value={hero.summary ?? ""} onChange={(event) => setOverride("summary", event.target.value)} /><input className={field} aria-label="Image URL override" placeholder="Image URL override" value={hero.image ?? ""} onChange={(event) => setOverride("image", event.target.value)} /><select className={field} aria-label="Image focal point" value={hero.focalPoint ?? "Center"} onChange={(event) => setOverride("focalPoint", event.target.value)}><option>Center</option><option>Top</option><option>Bottom</option><option>Left</option><option>Right</option></select><input className={field} aria-label="CTA override" placeholder="CTA override" value={hero.cta ?? ""} onChange={(event) => setOverride("cta", event.target.value)} /></div>
          <div><p className="mb-1 text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase md:hidden">Actions</p><div className="flex flex-wrap gap-2"><button className={abtn.quiet} disabled={index === 0} onClick={() => move(index, -1)}>Move up</button><button className={abtn.quiet} disabled={index === settings.hero.length - 1} onClick={() => move(index, 1)}>Move down</button><button className={abtn.danger} disabled={settings.hero.length <= 3} onClick={() => { if (settings.hero.length <= 3) { setError("Homepage Hero must contain at least three published articles."); return; } update(settings.hero.filter((entry) => entry.articleId !== hero.articleId)); }}>Remove</button></div></div>
          <div>{item ? <RowLinkAction to="/admin/content/$id" params={{ id: item.id }} label={`Open ${item.title}`} /> : null}</div>
        </section>;
      })}
    </div>
  </>;
}