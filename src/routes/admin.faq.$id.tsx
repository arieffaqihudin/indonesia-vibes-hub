import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { FaqAnswerEditor } from "@/components/admin/FaqAnswerEditor";
import { PageHeading, abtn, field } from "@/components/admin/primitives";
import { adminHead } from "@/lib/admin/head";
import { FAQ_CATEGORIES, FAQ_PLACEMENTS, FAQ_STATUSES, readFaqs, useFaqs, type Faq, type FaqPlacement } from "@/lib/faq";

export const Route = createFileRoute("/admin/faq/$id")({
  head: adminHead("Edit FAQ", "Write a clear question and short answer, and choose where it appears."),
  component: FaqEditor,
});

const blank = (order: number): Faq => ({
  id: `faq-${Date.now().toString(36)}`, question: "", answer: "", category: "Collaboration", status: "Draft",
  order, placements: ["faq"], updatedAt: new Date().toISOString(),
});

function FaqEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useFaqs();
  const [draft, setDraft] = useState<Faq | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const all = readFaqs();
    setDraft(id === "new" ? blank(all.length + 1) : all.find((f) => f.id === id) ?? null);
  }, [id]);

  if (!draft) {
    return <><PageHeading eyebrow="About / FAQ" title="FAQ not found" description="This question may have been removed." /><Link to="/admin/faq" className={abtn.secondary}>Back to FAQ</Link></>;
  }

  const update = (patch: Partial<Faq>) => { setDraft({ ...draft, ...patch }); setSaved(false); };
  const togglePlacement = (p: FaqPlacement) => update({ placements: draft.placements.includes(p) ? draft.placements.filter((x) => x !== p) : [...draft.placements, p] });
  const save = () => {
    const next = { ...draft, question: draft.question.trim(), updatedAt: new Date().toISOString() };
    const exists = faqs.some((f) => f.id === next.id);
    setFaqs(exists ? faqs.map((f) => (f.id === next.id ? next : f)) : [...faqs, next]);
    setSaved(true);
    if (id === "new") navigate({ to: "/admin/faq/$id", params: { id: next.id }, replace: true });
  };

  return (
    <>
      <PageHeading
        eyebrow="About / FAQ"
        title={id === "new" ? "New FAQ" : "Edit FAQ"}
        description="One question, used everywhere it is placed. Editing it here updates every page."
        actions={<Link to="/admin/faq" className={abtn.secondary}>Back to FAQ</Link>}
      />
      <form className="grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="space-y-6">
          <label className="block text-sm font-medium text-ink">Question
            <input required className={`${field} mt-2`} value={draft.question} onChange={(e) => update({ question: e.target.value })} placeholder="Who can collaborate with Indonesia Vibes?" />
          </label>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Answer</p>
            <FaqAnswerEditor value={draft.answer} onChange={(answer) => update({ answer })} />
            <p className="mt-1.5 text-xs text-muted-foreground">Keep it short, clear and human.</p>
          </div>
        </div>
        <aside className="space-y-5 border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <label className="block text-xs text-muted-foreground">Category
            <select className={`${field} mt-1`} value={draft.category} onChange={(e) => update({ category: e.target.value as Faq["category"] })}>{FAQ_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className="block text-xs text-muted-foreground">Status
            <select className={`${field} mt-1`} value={draft.status} onChange={(e) => update({ status: e.target.value as Faq["status"] })}>{FAQ_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <span className="mt-1 block text-[0.68rem]">Only Published questions appear on the site.</span>
          </label>
          <label className="block text-xs text-muted-foreground">Display order
            <input type="number" min={1} className={`${field} mt-1`} value={draft.order} onChange={(e) => update({ order: Number(e.target.value) || 1 })} />
            <span className="mt-1 block text-[0.68rem]">You can also drag rows in the FAQ list.</span>
          </label>
          <fieldset className="space-y-1">
            <legend className="mb-1 text-xs text-muted-foreground">Show on</legend>
            {FAQ_PLACEMENTS.map((p) => (
              <label key={p.id} className="flex min-h-9 items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={draft.placements.includes(p.id)} onChange={() => togglePlacement(p.id)} /> {p.label}
              </label>
            ))}
          </fieldset>
          <label className="block text-xs text-muted-foreground">Related page (optional)
            <input className={`${field} mt-1`} value={draft.relatedPage ?? ""} onChange={(e) => update({ relatedPage: e.target.value })} placeholder="/collaborate" />
          </label>
          <div className="flex items-center gap-3">
            <button className={abtn.primary} disabled={!draft.question.trim()}>Save FAQ</button>
            {saved ? <span className="text-sm text-muted-foreground" aria-live="polite">Saved</span> : null}
          </div>
        </aside>
      </form>
    </>
  );
}
