import { createFileRoute, Link } from "@tanstack/react-router";
import { GripVertical, Plus, Star, Layers, Eye, EyeOff, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { useState, type DragEvent } from "react";
import { PageHeading, Card, Table, Td, abtn, field, Tag, InlineNote } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { HERO_LIMIT_MESSAGE, useHomepageSettings, type HeroItem, type HomepageSection } from "@/lib/homepage";
import { publicFormat } from "@/lib/editorial";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/homepage/")({
  head: () => ({ meta: [
    { title: "Homepage Curation — Indonesia Vibes CMS" },
    { name: "description", content: "Manage the hero showcase and section visibility." }
  ] }),
  component: HomepageManager,
});

function HomepageManager() {
  const admin = useAdmin();
  const published = admin.content.filter((item) => item.kind === "story" && item.status === "published");
  const publishedIds = published.map((item) => item.id);
  const [settings, setSettings] = useHomepageSettings(publishedIds);
  const [heroArticleId, setHeroArticleId] = useState("");
  const [heroError, setHeroError] = useState("");
  const [draggedHero, setDraggedHero] = useState<number | null>(null);

  // Hero Actions
  const updateHero = (hero: HeroItem[]) => setSettings({ ...settings, hero });
  const moveHero = (index: number, delta: number) => {
    const next = [...settings.hero];
    const target = index + delta;
    if (!next[target]) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    updateHero(next);
  };
  const dropHero = (event: DragEvent<HTMLElement>, target: number) => {
    event.preventDefault();
    if (draggedHero === null || draggedHero === target) return;
    const next = [...settings.hero];
    const [entry] = next.splice(draggedHero, 1);
    if (!entry) return;
    next.splice(target, 0, entry);
    updateHero(next);
    setDraggedHero(null);
  };

  // Section Actions
  const updateSections = (sections: HomepageSection[]) => setSettings({ ...settings, sections });
  const moveSection = (index: number, delta: number) => {
    const ordered = [...settings.sections].sort((a, b) => a.order - b.order);
    const target = index + delta;
    if (!ordered[target]) return;
    [ordered[index], ordered[target]] = [ordered[target]!, ordered[index]!];
    updateSections(ordered.map((s, i) => ({ ...s, order: i })));
  };

  return (
    <div className="space-y-10">
      <PageHeading 
        eyebrow="Curation" 
        title="Homepage" 
        description="Design the visitor experience by curating the hero showcase and adjusting section priorities." 
        actions={<Link to="/" className={abtn.secondary}>Preview homepage <ExternalLink className="ml-1 h-3 w-3" /></Link>} 
      />

      {/* Hero Showcase */}
      <Card title="Hero Showcase" description="Choose 3–5 featured articles for the top-of-page carousel. Overrides allow for custom headlines or images.">
        <div className="mb-6 flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Add Published Article</label>
            <select 
              className={field} 
              value={heroArticleId} 
              onChange={(e) => setHeroArticleId(e.target.value)}
            >
              <option value="">Choose an article...</option>
              {published.filter(p => !settings.hero.some(h => h.articleId === p.id)).map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <button 
            className={abtn.primary} 
            disabled={!heroArticleId}
            onClick={() => {
              if (settings.hero.length >= 5) {
                setHeroError(HERO_LIMIT_MESSAGE);
                return;
              }
              updateHero([...settings.hero, { articleId: heroArticleId }]);
              setHeroArticleId("");
              setHeroError("");
            }}
          >
            <Plus className="h-4 w-4" /> Add to Hero
          </button>
        </div>

        {heroError && <InlineNote tone="attention">{heroError}</InlineNote>}

        <div className="divide-y divide-border border-y border-border bg-sand/20">
          {settings.hero.map((hero, index) => {
            const article = admin.getContent(hero.articleId) || admin.getContent(`c-${hero.articleId}`);
            const setOverride = (key: keyof HeroItem, value: string) => 
              updateHero(settings.hero.map(h => h.articleId === hero.articleId ? { ...h, [key]: value } : h));

            return (
              <div 
                key={hero.articleId}
                draggable
                onDragStart={() => setDraggedHero(index)}
                onDragEnd={() => setDraggedHero(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => dropHero(e, index)}
                className={cn(
                  "grid gap-4 p-4 md:grid-cols-[auto_1fr_1.5fr_auto]",
                  draggedHero === index && "bg-blush/40 opacity-50"
                )}
              >
                <div className="flex flex-col items-center gap-2 pt-1 text-muted-foreground">
                  <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
                  <span className="text-[0.65rem] font-bold">{index + 1}</span>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold tracking-wider text-clay uppercase">Source Article</p>
                  <p className="mt-1 font-medium text-ink">{article?.title || "Missing Article"}</p>
                  {article && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {publicFormat(article)} • {article.topics?.[0] || "No topic"}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button className={abtn.quiet} onClick={() => moveHero(index, -1)} disabled={index === 0}><ArrowUp className="h-3 w-3" /></button>
                    <button className={abtn.quiet} onClick={() => moveHero(index, 1)} disabled={index === settings.hero.length - 1}><ArrowDown className="h-3 w-3" /></button>
                    <button className={abtn.danger} onClick={() => updateHero(settings.hero.filter(h => h.articleId !== hero.articleId))}>Remove</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                   <div>
                     <label className="mb-1 block text-[0.6rem] text-muted-foreground uppercase">Headline Override</label>
                     <input className={cn(field, "h-8 text-xs")} placeholder="Use original headline" value={hero.headline || ""} onChange={e => setOverride("headline", e.target.value)} />
                   </div>
                   <div>
                     <label className="mb-1 block text-[0.6rem] text-muted-foreground uppercase">CTA Label</label>
                     <input className={cn(field, "h-8 text-xs")} placeholder="Read story" value={hero.cta || ""} onChange={e => setOverride("cta", e.target.value)} />
                   </div>
                   <div className="sm:col-span-2">
                     <label className="mb-1 block text-[0.6rem] text-muted-foreground uppercase">Summary Override</label>
                     <textarea className={cn(field, "min-h-16 py-1 text-xs")} placeholder="Use original summary" value={hero.summary || ""} onChange={e => setOverride("summary", e.target.value)} />
                   </div>
                </div>

                <div className="flex items-start">
                   {article ? <Link to="/admin/content/$id" params={{ id: article.id }} className={abtn.quiet} title="Edit article"><ExternalLink className="h-4 w-4" /></Link> : null}
                </div>
              </div>
            );
          })}
          {settings.hero.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground italic">No articles selected for hero showcase.</div>
          )}
        </div>
      </Card>

      {/* Homepage Sections */}
      <Card title="Page Sections" description="Toggle visibility and reorder the content modules on the homepage.">
        <Table head={["Order", "Section", "Status", "Featured Record", "Actions"]}>
          {[...settings.sections].sort((a, b) => a.order - b.order).map((section, index) => (
            <tr key={section.id} className="group">
              <Td className="w-16 font-mono text-xs text-muted-foreground">{index + 1}</Td>
              <Td className="font-medium text-ink">{section.label}</Td>
              <Td>
                <button 
                  onClick={() => updateSections(settings.sections.map(s => s.id === section.id ? { ...s, visible: !s.visible } : s))}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium transition-colors",
                    section.visible ? "bg-clay/10 text-clay hover:bg-clay/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {section.visible ? <><Eye className="h-3 w-3" /> Visible</> : <><EyeOff className="h-3 w-3" /> Hidden</>}
                </button>
              </Td>
              <Td>
                <input 
                  className={cn(field, "h-8 max-w-[200px] text-xs")} 
                  placeholder="Optional ID override..." 
                  value={section.featuredId || ""} 
                  onChange={e => updateSections(settings.sections.map(s => s.id === section.id ? { ...s, featuredId: e.target.value } : s))}
                />
              </Td>
              <Td>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className={abtn.quiet} onClick={() => moveSection(index, -1)} disabled={index === 0}><ArrowUp className="h-3 w-3" /></button>
                  <button className={abtn.quiet} onClick={() => moveSection(index, 1)} disabled={index === settings.sections.length - 1}><ArrowDown className="h-3 w-3" /></button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* In Focus Overrides (Formerly separate) */}
      <Card title="In Focus Priorities" description="In Focus is usually automated, but you can pin specific records or hide them here. These apply when the 'In Focus' section is visible above.">
        <div className="rounded-md border border-border bg-blush/10 p-4">
          <p className="text-xs text-muted-foreground">
            Homepage overrides for In Focus are currently managed via the <strong>Featured Record</strong> field in the Page Sections table above for the primary highlight. For granular multi-item overrides, use the global curation tools.
          </p>
        </div>
      </Card>
    </div>
  );
}
