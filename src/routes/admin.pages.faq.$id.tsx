import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { adminHead } from "@/lib/admin/head";
import { FAQ_CATEGORIES, FAQ_PLACEMENTS, FAQ_STATUSES, readFaqs, useFaqs, type Faq, type FaqPlacement } from "@/lib/faq";
import { EditorFrame, type SaveState } from "@/components/cms/EditorFrame";
import { RichText } from "@/components/cms/LazyRichText";
import { Field, Panel, Select } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/pages/faq/$id")({
  head: adminHead("Edit FAQ", "Edit a question and answer."),
  component: FaqEditor,
});

function FaqEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useFaqs();
  const [draft, setDraft] = useState<Faq | null>(null);
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const created = useRef(false);

  useEffect(() => {
    if (draft) return;
    const all = readFaqs();
    const found = all.find((f) => f.id === id);
    if (found) { setDraft(found); created.current = true; }
    else if (id === "new") setDraft({ id: `faq-${Date.now().toString(36)}`, question: "", answer: "", category: "Collaboration", status: "Draft", order: all.length + 1, placements: ["faq"], updatedAt: new Date().toISOString() });
  }, [id, draft]);
  if (!draft) return <p className="py-20 text-center text-sm text-muted-foreground">Question not found.</p>;

  const commit = (next: Faq) => {
    const record = { ...next, updatedAt: new Date().toISOString() };
    const all = readFaqs();
    setFaqs(all.some((f) => f.id === record.id) ? all.map((f) => (f.id === record.id ? record : f)) : [...all, record]);
    setSave("saved");
    if (!created.current) { created.current = true; void navigate({ to: "/admin/pages/faq/$id", params: { id: record.id }, replace: true }); }
  };
  const change = (patch: Partial<Faq>) => {
    const next = { ...draft, ...patch };
    setDraft(next); setSave("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), 700);
  };
  const toggle = (p: FaqPlacement) => change({ placements: draft.placements.includes(p) ? draft.placements.filter((x) => x !== p) : [...draft.placements, p] });
  void faqs;

  return <EditorFrame backTo="/admin/pages/faq" backLabel="FAQ" title={draft.question || "New question"} status={draft.status} saveState={save}
    onSaveDraft={() => { clearTimeout(timer.current); const n = { ...draft, status: "Draft" as const }; setDraft(n); commit(n); toast.success("Draft saved"); }}
    onPreview={() => window.open("/faq", "_blank")}
    onPublish={() => { if (!draft.question.trim()) { toast.error("Add a question first."); return; } clearTimeout(timer.current); const n = { ...draft, status: "Published" as const }; setDraft(n); commit(n); toast.success("Published"); }}
    main={<div className="mx-auto max-w-2xl">
      <textarea aria-label="Question" rows={1} value={draft.question} placeholder="Question" onChange={(e) => change({ question: e.target.value })} className="w-full resize-none border-0 bg-transparent p-0 text-2xl font-semibold text-ink outline-none placeholder:text-muted-foreground/50" />
      <div className="mt-6"><RichText value={draft.answer} onChange={(answer) => change({ answer })} placeholder="Answer — keep it short and clear" minimal /></div>
    </div>}
    sidebar={<>
      <Panel title="Status"><Field label="Status" htmlFor="st"><Select id="st" value={draft.status} onChange={(v) => change({ status: v as Faq["status"] })} options={[...FAQ_STATUSES]} /></Field></Panel>
      <Panel title="Details">
        <Field label="Category" htmlFor="cat"><Select id="cat" value={draft.category} onChange={(v) => change({ category: v as Faq["category"] })} options={[...FAQ_CATEGORIES]} /></Field>
        <fieldset className="space-y-1.5"><legend className="mb-1 text-xs font-medium text-ink">Placement</legend>
          {FAQ_PLACEMENTS.map((p) => <label key={p.id} className="flex min-h-8 items-center gap-2 text-sm text-ink"><input type="checkbox" checked={draft.placements.includes(p.id)} onChange={() => toggle(p.id)} className="h-4 w-4 accent-primary" />{p.label}</label>)}
        </fieldset>
      </Panel>
    </>} />;
}
