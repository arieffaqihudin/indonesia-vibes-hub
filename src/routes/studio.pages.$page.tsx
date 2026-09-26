import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { adminHead } from "@/lib/studio/head";
import { newId, useCms } from "@/lib/cms/store";
import { useOptions } from "@/lib/cms/options";
import { CMS_STATUSES, type CmsPage, type CmsTeamMember, type PageId } from "@/lib/cms/types";
import { EditorFrame, type SaveState } from "@/components/cms/EditorFrame";
import { RichText } from "@/components/cms/LazyRichText";
import { ImageField, OrderedList } from "@/components/cms/pickers";
import { Field, Panel, Select, TextArea, TextInput, btn } from "@/components/cms/ui";

const PUBLIC: Record<PageId, string> = { about: "/about", "editorial-standards": "/editorial-standards", contact: "/contact" };

export const Route = createFileRoute("/studio/pages/$page")({
  head: adminHead("Edit page", "Edit a website page."),
  component: PageEditor,
});

function PageEditor() {
  const { page: pageId } = Route.useParams();
  const cms = useCms();
  const page = cms.pages.find((p) => p.id === pageId);
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  if (!page) return <p className="py-20 text-center text-sm text-muted-foreground">Page not found.</p>;

  const change = (patch: Partial<CmsPage>) => {
    setSave("saving");
    cms.updatePage(page.id, patch);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSave("saved"), 500);
  };
  const setField = (k: string, v: string) => change({ fields: { ...page.fields, [k]: v } });

  return <EditorFrame backTo="/studio/pages" backLabel="Pages" title={page.title} status={page.status} saveState={save}
    onSaveDraft={() => { change({ status: "Draft" }); toast.success("Draft saved"); }}
    onPreview={() => window.open(PUBLIC[page.id], "_blank")}
    onPublish={() => { change({ status: "Published" }); toast.success("Page updated"); }}
    main={<div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold text-ink">{page.title}</h1>
      <div className="mt-8"><RichText value={page.body} onChange={(body) => change({ body })} placeholder="Write the page…" /></div>
      {page.id === "about" ? <TeamEditor /> : null}
    </div>}
    sidebar={<>
      <Panel title="Status"><Field label="Status" htmlFor="st"><Select id="st" value={page.status} onChange={(v) => change({ status: v as CmsPage["status"] })} options={CMS_STATUSES.filter((s) => s !== "Scheduled")} /></Field></Panel>
      {page.id === "contact" ? <Panel title="Contact details">
        <Field label="Email" htmlFor="em"><TextInput id="em" value={page.fields["email"] ?? ""} onChange={(v) => setField("email", v)} /></Field>
        <Field label="Address" htmlFor="ad"><TextArea id="ad" value={page.fields["address"] ?? ""} onChange={(v) => setField("address", v)} /></Field>
        <Field label="Response time" htmlFor="rt"><TextInput id="rt" value={page.fields["responseTime"] ?? ""} onChange={(v) => setField("responseTime", v)} /></Field>
        <p className="text-xs text-muted-foreground">Collaboration requests are handled in Collaborations → Requests.</p>
      </Panel> : null}
    </>} />;
}

/** Our Team is separate from People & Organisations. A profile link is optional and explicit. */
function TeamEditor() {
  const cms = useCms();
  const options = useOptions();
  const team = [...cms.team].sort((a, b) => a.order - b.order);
  const [editing, setEditing] = useState<string | null>(null);
  const update = (id: string, patch: Partial<CmsTeamMember>) => cms.setTeam(cms.team.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const current = team.find((m) => m.id === editing);
  return <section className="mt-12 border-t border-border pt-8">
    <div className="mb-3 flex items-center justify-between"><h2 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">Our Team</h2>
      <button type="button" className={btn.secondary} onClick={() => { const m: CmsTeamMember = { id: newId("tm"), name: "New team member", role: "", bio: "", photo: "", order: team.length + 1 }; cms.setTeam([...cms.team, m]); setEditing(m.id); }}><Plus className="h-4 w-4" />Add member</button></div>
    <OrderedList items={team.map((m) => m.id)} onChange={(ids) => cms.setTeam(ids.map((id, i) => ({ ...cms.team.find((m) => m.id === id)!, order: i + 1 })))} render={(id) => { const m = team.find((t) => t.id === id)!; return { title: m.name, meta: m.role, image: m.photo }; }} />
    <div className="mt-2 flex flex-wrap gap-2">{team.map((m) => <button key={m.id} type="button" onClick={() => setEditing(m.id)} className="text-xs text-primary hover:underline">Edit {m.name.split(" ")[0]}</button>)}</div>
    {current ? <div className="mt-4 rounded-lg border border-border bg-sand/40 p-4">
      <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-ink">{current.name}</p><button type="button" onClick={() => setEditing(null)} className={btn.icon} aria-label="Close"><X className="h-4 w-4" /></button></div>
      <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <ImageField value={current.photo} onChange={(photo) => update(current.id, { photo })} label="Photo" />
        <div className="space-y-3">
          <Field label="Name" htmlFor="tn"><TextInput id="tn" value={current.name} onChange={(v) => update(current.id, { name: v })} /></Field>
          <Field label="Role" htmlFor="tr"><TextInput id="tr" value={current.role} onChange={(v) => update(current.id, { role: v })} /></Field>
          <Field label="Short bio" htmlFor="tb"><TextArea id="tb" value={current.bio} onChange={(v) => update(current.id, { bio: v })} /></Field>
          <Field label="Cultural profile link (optional)" htmlFor="tp" hint="Only if this person already has a profile in People & Organisations."><Select id="tp" value={current.personId ?? ""} onChange={(v) => update(current.id, v ? { personId: v } : { personId: undefined })} options={options.people.map((p) => ({ value: p.id, label: p.label }))} placeholder="No profile" /></Field>
          <button type="button" onClick={() => { cms.setTeam(cms.team.filter((m) => m.id !== current.id)); setEditing(null); }} className="text-xs text-deep-red hover:underline">Remove from team</button>
        </div>
      </div>
    </div> : null}
  </section>;
}
