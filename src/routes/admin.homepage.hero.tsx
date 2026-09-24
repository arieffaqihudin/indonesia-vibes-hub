import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeading, SummaryStrip, RowLinkAction, abtn, field } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { HERO_LIMIT_MESSAGE, useHomepageSettings } from "@/lib/homepage";

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
  const update = (hero: typeof settings.hero) => setSettings({ ...settings, hero });
  const move = (index: number, delta: number) => {
    const next = [...settings.hero];
    const target = index + delta;
    if (!next[target]) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    update(next);
  };

  return <>
    <PageHeading eyebrow="Homepage / Hero" title="Homepage Hero" description="Choose one strong lead article and up to four supporting slides." actions={<Link to="/" className={abtn.secondary}>Preview homepage ↗</Link>} />
    <SummaryStrip items={[{ label: "Active", value: settings.hero.length }, { label: "Available slots", value: 5 - settings.hero.length }, { label: "Limit", value: 5 }]} />
    <div className="mb-6 flex flex-col items-stretch gap-3 border-b border-border pb-5 sm:flex-row sm:items-end">
      <label className="min-w-0 flex-1 text-xs text-muted-foreground sm:max-w-md"><span className="mb-1 block">Published article</span><select className={field} value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">Choose an article</option>{published.filter((item) => !settings.hero.some((hero) => hero.articleId === item.id || `c-${hero.articleId}` === item.id)).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      <button className={abtn.primary} disabled={!selected} onClick={() => { if (settings.hero.length >= 5) { setError(HERO_LIMIT_MESSAGE); return; } update([...settings.hero, { articleId: selected }]); setSelected(""); setError(""); }}>Add to Hero</button>
    </div>
    {error ? <p role="alert" className="mb-4 border-l-2 border-primary bg-blush p-3 text-sm text-clay">{error}</p> : null}
    <div className="border-y border-border">
      {settings.hero.map((hero, index) => {
        const item = admin.getContent(hero.articleId) ?? admin.getContent(`c-${hero.articleId}`);
        const setOverride = (key: "headline" | "summary" | "image" | "cta", value: string) => update(settings.hero.map((entry) => entry.articleId === hero.articleId ? { ...entry, [key]: value } : entry));
        return <section key={hero.articleId} className="grid gap-4 border-b border-border px-0 py-5 last:border-b-0 md:grid-cols-[3rem_minmax(11rem,.8fr)_minmax(18rem,1.4fr)_auto_2rem] md:items-start md:px-4">
          <p className="text-xs text-muted-foreground"><span className="md:hidden">Order </span>{index + 1}</p>
          <div><p className="mb-1 text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase md:hidden">Article</p><p className="font-medium text-ink">{item?.title ?? "Missing article"}</p></div>
          <div className="grid gap-2"><p className="text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase md:hidden">Overrides</p><input className={field} aria-label="Headline override" placeholder="Headline override" value={hero.headline ?? ""} onChange={(event) => setOverride("headline", event.target.value)} /><input className={field} aria-label="Summary override" placeholder="Summary override" value={hero.summary ?? ""} onChange={(event) => setOverride("summary", event.target.value)} /><input className={field} aria-label="Image URL override" placeholder="Image URL override" value={hero.image ?? ""} onChange={(event) => setOverride("image", event.target.value)} /><input className={field} aria-label="CTA override" placeholder="CTA override" value={hero.cta ?? ""} onChange={(event) => setOverride("cta", event.target.value)} /></div>
          <div><p className="mb-1 text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase md:hidden">Actions</p><div className="flex flex-wrap gap-2"><button className={abtn.quiet} disabled={index === 0} onClick={() => move(index, -1)}>Move up</button><button className={abtn.quiet} disabled={index === settings.hero.length - 1} onClick={() => move(index, 1)}>Move down</button><button className={abtn.danger} onClick={() => update(settings.hero.filter((entry) => entry.articleId !== hero.articleId))}>Remove</button></div></div>
          <div>{item ? <RowLinkAction to="/admin/content/$id" params={{ id: item.id }} label={`Open ${item.title}`} /> : null}</div>
        </section>;
      })}
    </div>
  </>;
}