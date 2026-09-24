import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp } from "lucide-react";

import { PageHeading, SettingsSection, abtn, field } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { people, places, stories, worldNodes } from "@/data/content";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";
import { useCollections } from "@/lib/collections";
import { useHomepageSettings, type HomepageSettings } from "@/lib/homepage";
import { useTopics } from "@/lib/topics";

export const Route = createFileRoute("/admin/homepage/sections")({
  head: () => ({ meta: [
    { title: "Homepage Sections — Indonesia Vibes CMS" },
    { name: "description", content: "Choose the records and order used by the Indonesia Vibes homepage." },
    { property: "og:title", content: "Homepage Sections — Indonesia Vibes CMS" },
    { property: "og:description", content: "Choose the records and order used by the Indonesia Vibes homepage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Sections,
});

function CheckList({ options, selected, limit, onChange }: { options: { id: string; label: string }[]; selected: string[]; limit: number; onChange: (ids: string[]) => void }) {
  return <div className="grid gap-1 sm:grid-cols-2">{options.map((option) => {
    const checked = selected.includes(option.id);
    return <label key={option.id} className="grid min-h-10 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-sm text-ink"><input type="checkbox" checked={checked} disabled={!checked && selected.length >= limit} onChange={() => onChange(checked ? selected.filter((id) => id !== option.id) : [...selected, option.id])} /><span className="truncate">{option.label}</span></label>;
  })}</div>;
}

function Sections() {
  const [settings, setSettings] = useHomepageSettings(stories.map((item) => item.id));
  const [topics] = useTopics();
  const [collections] = useCollections();
  const ordered = [...settings.sections].sort((a, b) => a.order - b.order);
  const update = (patch: Partial<HomepageSettings>) => setSettings({ ...settings, ...patch });
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (!ordered[target]) return;
    [ordered[index], ordered[target]] = [ordered[target]!, ordered[index]!];
    update({ sections: ordered.map((item, order) => ({ ...item, order })) });
  };

  const profileOptions = [
    ...people.map((item) => ({ id: item.id, label: `${item.name} — ${item.entity === "community" ? "Community" : item.role}` })),
    ...institutions.map((item) => ({ id: item.id, label: `${item.name} — ${item.type}` })),
  ];

  return <div className="max-w-5xl">
    <PageHeading eyebrow="Homepage / Sections" title="Homepage Sections" description="Control the five approved homepage sections. Every selection references an existing record." actions={<Link to="/" className={abtn.secondary}>Preview homepage ↗</Link>} />
    <div className="border-y border-border">
      {ordered.map((section, index) => <section key={section.id} className="border-b border-border px-1 py-4 last:border-b-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex">
          <div className="min-w-0 sm:flex-1"><p className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</p><h2 className="truncate text-base font-semibold text-ink">{section.label}</h2></div>
          <label className="flex shrink-0 items-center gap-2 text-sm text-ink"><input type="checkbox" checked={section.visible} onChange={(event) => update({ sections: settings.sections.map((item) => item.id === section.id ? { ...item, visible: event.target.checked } : item) })} /> Show</label>
          <div className="col-span-2 flex shrink-0 gap-1 sm:col-span-1"><Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${section.label} up`}><ArrowUp /></Button><Button type="button" variant="ghost" size="icon" disabled={index === ordered.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${section.label} down`}><ArrowDown /></Button></div>
        </div>

        {section.id === "understand" ? <div className="mt-4 grid gap-6 border-t border-border pt-4 lg:grid-cols-2">
          <SettingsSection title="Topics" open><p className="text-xs text-muted-foreground">Choose up to 10. Featured published topics are used when none are selected.</p><CheckList options={topics.filter((item) => item.status === "Published").map((item) => ({ id: item.id, label: item.id }))} selected={settings.featuredTopicIds} limit={10} onChange={(featuredTopicIds) => update({ featuredTopicIds })} /></SettingsSection>
          <div><SettingsSection title="Featured Collection" open><select className={field} value={settings.featuredCollectionId ?? ""} onChange={(event) => update({ featuredCollectionId: event.target.value })}><option value="">Use featured collection</option>{collections.filter((item) => item.status === "Published").map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></SettingsSection><SettingsSection title="People & Organisations" open><p className="text-xs text-muted-foreground">Choose up to 6. Featured records are used when none are selected.</p><CheckList options={profileOptions} selected={settings.featuredProfileIds} limit={6} onChange={(featuredProfileIds) => update({ featuredProfileIds })} /></SettingsSection></div>
        </div> : null}

        {section.id === "latest" ? <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Number of articles<select className={`${field} mt-1`} value={settings.latestArticleLimit} onChange={(event) => update({ latestArticleLimit: Number(event.target.value) })}>{[4, 5, 6, 7, 8].map((count) => <option key={count}>{count}</option>)}</select></label><label className="flex min-h-10 items-center gap-2 text-sm text-ink"><input type="checkbox" checked={settings.excludeHeroFromLatest} onChange={(event) => update({ excludeHeroFromLatest: event.target.checked })} /> Exclude Hero articles</label></div> : null}

        {section.id === "experience" ? <div className="mt-4 border-t border-border pt-4"><SettingsSection title="Places to Discover" open><p className="text-xs text-muted-foreground">Choose up to 5. Upcoming events are selected automatically by date.</p><CheckList options={places.filter((item) => item.country === "Indonesia" && item.type && !["City", "Cultural Region"].includes(item.type)).map((item) => ({ id: item.id, label: `${item.name} — ${item.type}` }))} selected={settings.featuredPlaceIds} limit={5} onChange={(featuredPlaceIds) => update({ featuredPlaceIds })} /></SettingsSection></div> : null}

        {section.id === "around-world" ? <div className="mt-4 border-t border-border pt-4"><SettingsSection title="Country highlights" open><p className="text-xs text-muted-foreground">Choose up to 6 existing international records.</p><CheckList options={worldNodes.filter((item) => item.country !== "Indonesia" && item.status !== "Archive").map((item) => ({ id: item.id, label: `${item.country} — ${item.programme}` }))} selected={settings.featuredWorldIds} limit={6} onChange={(featuredWorldIds) => update({ featuredWorldIds })} /></SettingsSection></div> : null}

        {section.id === "collaborate" ? <div className="mt-4 grid gap-6 border-t border-border pt-4 lg:grid-cols-2"><SettingsSection title="Featured Collaborations" open><CheckList options={collaborations.map((item) => ({ id: item.id, label: item.title }))} selected={settings.featuredCollaborationIds} limit={2} onChange={(featuredCollaborationIds) => update({ featuredCollaborationIds })} /></SettingsSection><SettingsSection title="Section copy" open><label className="block text-xs text-muted-foreground">Headline<input className={`${field} mt-1`} value={settings.collaborateHeadline ?? ""} onChange={(event) => update({ collaborateHeadline: event.target.value })} /></label><label className="block text-xs text-muted-foreground">Introduction<textarea rows={3} className={`${field} mt-1`} value={settings.collaborateIntroduction ?? ""} onChange={(event) => update({ collaborateIntroduction: event.target.value })} /></label><label className="block text-xs text-muted-foreground">Primary button label<input className={`${field} mt-1`} value={settings.collaborateCtaLabel ?? ""} onChange={(event) => update({ collaborateCtaLabel: event.target.value })} /></label></SettingsSection></div> : null}
      </section>)}
    </div>
  </div>;
}