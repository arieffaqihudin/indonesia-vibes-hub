import { ArrowLeft, Eye, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { FaqAnswerEditor } from "./FaqAnswerEditor";
import { abtn, field, SettingsSection } from "./primitives";

export function SimplePageEditor({ page, title, description, defaults }: { page: string; title: string; description: string; defaults: { heading: string; introduction: string; body: string } }) {
  const key = `iv-page-${page}`;
  const [state, setState] = useState(defaults);
  const [saved, setSaved] = useState("Saved");
  useEffect(() => { try { const raw = localStorage.getItem(key); if (raw) setState(JSON.parse(raw)); } catch { /* use defaults */ } }, [key]);
  const update = (patch: Partial<typeof state>) => { setState({ ...state, ...patch }); setSaved("Unsaved changes"); };
  const save = () => { localStorage.setItem(key, JSON.stringify(state)); setSaved("Saved"); };
  return <div className="-mx-4 -my-6 min-h-[calc(100vh-3.75rem)] bg-card sm:-mx-6 lg:-mx-7">
    <header className="sticky top-0 z-20 flex min-h-14 items-center gap-2 border-b border-border bg-card/95 px-3 py-2 backdrop-blur-sm sm:px-5"><Link to="/admin/dashboard" className="flex h-9 items-center gap-2 rounded-md px-2 text-sm text-ink hover:bg-muted"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Dashboard</span></Link><strong className="text-sm font-medium text-ink">Edit {title}</strong><span className="text-xs text-muted-foreground">{saved}</span><div className="ml-auto flex gap-2"><a href={page === "about" ? "/about" : page === "editorial-standards" ? "/editorial-standards" : "/contact"} target="_blank" rel="noreferrer" className={abtn.secondary}><Eye className="h-4 w-4" /> Preview</a><button type="button" className={abtn.primary} onClick={save}><Save className="h-4 w-4" /> Update</button></div></header>
    <div className="grid xl:grid-cols-[minmax(0,1fr)_320px]"><main className="min-w-0 px-5 py-10 sm:px-10 lg:px-14"><div className="mx-auto max-w-4xl"><input aria-label="Page heading" className="w-full border-0 bg-transparent text-4xl font-semibold text-ink outline-none placeholder:text-muted-foreground/45" value={state.heading} onChange={(event) => update({ heading: event.target.value })} placeholder="Add page title" /><textarea aria-label="Introduction" rows={3} className="mt-5 w-full resize-none border-0 bg-transparent text-xl leading-relaxed text-muted-foreground outline-none placeholder:text-muted-foreground/45" value={state.introduction} onChange={(event) => update({ introduction: event.target.value })} placeholder="Write a short introduction…" /><div className="mt-8"><FaqAnswerEditor value={state.body} onChange={(body) => update({ body })} /></div></div></main><aside className="border-t border-border bg-background px-5 xl:border-t-0 xl:border-l"><h2 className="border-b border-border py-4 text-sm font-semibold text-ink">Page Settings</h2><SettingsSection title="Publication" open><label className="block text-xs text-muted-foreground">Status<select className={`${field} mt-1`}><option>Published</option><option>Draft</option></select></label><p className="text-xs text-muted-foreground">{description}</p></SettingsSection></aside></div>
  </div>;
}