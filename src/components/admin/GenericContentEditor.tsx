import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useState } from "react";

import { abtn, EmptyState, field, SettingsSection } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { CONTENT_FIELDS, CONTENT_STATUS, kindLabel, type ContentStatus } from "@/lib/admin/types";
import { TOPICS } from "@/lib/topics";

const statusOptions: { label: string; value: ContentStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "In Review", value: "editorial_review" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

function backPath(kind: string) {
  if (["person", "community", "institution"].includes(kind)) return "/admin/people-organisations";
  if (["event", "place"].includes(kind)) return "/admin/events-places";
  if (kind === "collaboration") return "/admin/collaborations";
  return "/admin";
}

export function GenericContentEditor({ id }: { id: string }) {
  const admin = useAdmin();
  const item = admin.getContent(id);
  const [saved, setSaved] = useState("Saved");
  if (!item) return <EmptyState title="This record could not be found." />;

  const titleField = CONTENT_FIELDS[item.kind][0]?.name ?? "title";
  const patchField = (name: string, value: string) => {
    setSaved("Saving…");
    admin.updateContent(id, {
      ...(name === titleField ? { title: value || `Untitled ${kindLabel(item.kind).toLowerCase()}` } : {}),
      fields: { ...item.fields, [name]: value },
    });
    window.setTimeout(() => setSaved("Saved"), 350);
  };
  const publishLabel = item.status === "published" ? "Update" : "Publish";

  return <div className="-mx-4 -my-6 min-h-[calc(100vh-3.75rem)] bg-card sm:-mx-6 lg:-mx-7">
    <header className="sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-2 border-b border-border bg-card/95 px-3 py-2 backdrop-blur-sm sm:px-5">
      <Link to={backPath(item.kind)} className="inline-flex min-h-9 items-center gap-2 rounded-md px-2 text-sm text-ink hover:bg-muted"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span></Link>
      <span className="hidden h-5 border-l border-border sm:block" />
      <strong className="text-sm font-medium text-ink">{item.title || `New ${kindLabel(item.kind)}`}</strong>
      <span className="text-xs text-muted-foreground" aria-live="polite">{saved}</span>
      <div className="ml-auto flex items-center gap-1.5">
        <Link to="/admin/content/$id/preview" params={{ id }} className={abtn.secondary}><Eye className="h-4 w-4" /><span className="hidden sm:inline">Preview</span></Link>
        <button type="button" className={abtn.secondary} onClick={() => { setSaved("Saved"); admin.updateContent(id, {}, "saved the draft"); }}><Save className="h-4 w-4" /><span className="hidden md:inline">Save Draft</span></button>
        <button type="button" className={abtn.primary} onClick={() => admin.transition(id, "published")}>{publishLabel}</button>
      </div>
    </header>

    <div className="grid min-h-[calc(100vh-7.25rem)] xl:grid-cols-[minmax(0,1fr)_320px]">
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12">
        <div className="max-w-4xl space-y-7">
          {CONTENT_FIELDS[item.kind].map((definition, index) => {
            const value = item.fields[definition.name] ?? (index === 0 ? item.title : "");
            const shared = { id: `content-${definition.name}`, value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => patchField(definition.name, event.target.value) };
            return <label key={definition.name} htmlFor={shared.id} className="block">
              <span className={index === 0 ? "sr-only" : "mb-1.5 block text-xs font-medium text-ink"}>{definition.label}</span>
              {index === 0 ? <input {...shared} placeholder={`Add ${kindLabel(item.kind).toLowerCase()} title`} className="w-full border-0 border-b border-border bg-transparent px-0 pb-4 text-3xl font-semibold text-ink outline-none placeholder:text-muted-foreground/45 focus:border-primary sm:text-4xl" /> : definition.type === "text" ? <input {...shared} className={field} /> : <textarea {...shared} rows={definition.type === "longform" ? 12 : 4} className={field} />}
            </label>;
          })}
        </div>
      </main>
      <aside className="border-t border-border bg-background px-5 pb-10 xl:border-t-0 xl:border-l">
        <div className="sticky top-14">
          <h2 className="border-b border-border py-4 text-sm font-semibold text-ink">{kindLabel(item.kind)} Settings</h2>
          <SettingsSection title="Publication" open>
            <label className="block text-xs text-muted-foreground">Status<select className={`${field} mt-1`} value={item.status} onChange={(event) => admin.updateContent(id, { status: event.target.value as ContentStatus })}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="block text-xs text-muted-foreground">Slug<input className={`${field} mt-1`} value={item.slug ?? ""} onChange={(event) => admin.updateContent(id, { slug: event.target.value })} /></label>
          </SettingsSection>
          <SettingsSection title="Image" open>
            <label className="block text-xs text-muted-foreground">Cover image URL<input className={`${field} mt-1`} value={item.fields["heroMedia"] ?? item.fields["image"] ?? ""} onChange={(event) => patchField("heroMedia", event.target.value)} /></label>
          </SettingsSection>
          <SettingsSection title="Topic & location">
            <label className="block text-xs text-muted-foreground">Related topic<select className={`${field} mt-1`} value={item.topics?.[0] ?? ""} onChange={(event) => admin.updateContent(id, { topics: event.target.value ? [event.target.value] : [] })}><option value="">No topic selected</option>{TOPICS.map((topic) => <option key={topic.id} value={topic.id}>{topic.id}</option>)}</select></label>
            <label className="block text-xs text-muted-foreground">Location<input className={`${field} mt-1`} value={item.location ?? ""} onChange={(event) => admin.updateContent(id, { location: event.target.value })} /></label>
          </SettingsSection>
          <SettingsSection title="Connected content">
            <p className="text-xs text-muted-foreground">{Object.values(item.relationships).reduce((sum, values) => sum + values.length, 0)} connected records. Existing relationships remain attached.</p>
          </SettingsSection>
          <p className="pt-4 text-xs text-muted-foreground">{CONTENT_STATUS[item.status].label} · Last updated automatically</p>
        </div>
      </aside>
    </div>
  </div>;
}