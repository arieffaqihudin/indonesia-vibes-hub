import { createFileRoute, Link } from "@tanstack/react-router";
import { GripVertical } from "lucide-react";
import { useState } from "react";

import { FilterToolbar, PageHeading, RowLinkAction, SearchInput, SelectFilter, Table, Td, abtn, relative } from "@/components/admin/primitives";
import { adminHead } from "@/lib/admin/head";
import { FAQ_CATEGORIES, FAQ_PLACEMENTS, FAQ_STATUSES, faqText, sortFaqs, useFaqs, type Faq } from "@/lib/faq";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/faq/")({
  head: adminHead("FAQ", "Manage frequently asked questions shown across Indonesia Vibes."),
  component: FaqAdmin,
});

const placementLabel = (id: string) => FAQ_PLACEMENTS.find((p) => p.id === id)?.label.replace("Main FAQ Page", "FAQ") ?? id;

function FaqAdmin() {
  const [faqs, setFaqs] = useFaqs();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [context, setContext] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const visible = sortFaqs(faqs).filter((f) =>
    (!q || `${f.question} ${faqText(f.answer)}`.toLowerCase().includes(q)) &&
    (!category || f.category === category) && (!status || f.status === status) &&
    (!context || f.placements.some((p) => placementLabel(p) === context)),
  );

  /** Drag-and-drop reorders within the same category only. */
  const drop = (target: Faq) => {
    const source = faqs.find((f) => f.id === dragId);
    setDragId(null);
    if (!source || source.id === target.id || source.category !== target.category) return;
    const group = sortFaqs(faqs.filter((f) => f.category === source.category)).filter((f) => f.id !== source.id);
    group.splice(group.findIndex((f) => f.id === target.id), 0, source);
    const order = new Map(group.map((f, i) => [f.id, i + 1]));
    setFaqs(faqs.map((f) => (order.has(f.id) ? { ...f, order: order.get(f.id)! } : f)));
  };

  return (
    <>
      <PageHeading
        eyebrow="About / FAQ"
        title="FAQ"
        description="Manage frequently asked questions shown across Indonesia Vibes."
        actions={<Link to="/admin/faq/$id" params={{ id: "new" }} className={abtn.primary}>+ New FAQ</Link>}
      />
      <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search FAQ" placeholder="Search questions and answers" />}>
        <SelectFilter label="Category" value={category} onChange={setCategory} options={[...FAQ_CATEGORIES]} />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={[...FAQ_STATUSES]} />
        <SelectFilter label="Context" value={context} onChange={setContext} options={FAQ_PLACEMENTS.map((p) => placementLabel(p.id))} />
      </FilterToolbar>
      <p className="mb-3 text-xs text-muted-foreground">{visible.length} question{visible.length === 1 ? "" : "s"} · Drag rows to reorder within a category.</p>
      <Table caption="FAQ" head={["Question", "Category", "Used On", "Status", "Updated", "Action"]}>
        {visible.map((f) => (
          <tr
            key={f.id}
            draggable
            onDragStart={() => setDragId(f.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(f)}
            className={cn("hover:bg-muted/35", dragId === f.id && "opacity-50")}
          >
            <Td>
              <span className="flex items-center gap-2">
                <GripVertical aria-hidden className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                <Link to="/admin/faq/$id" params={{ id: f.id }} className="font-medium hover:text-primary">{f.question}</Link>
              </span>
            </Td>
            <Td>{f.category}</Td>
            <Td>{f.placements.map(placementLabel).join(", ") || "—"}</Td>
            <Td>{f.status}</Td>
            <Td>{relative(f.updatedAt)}</Td>
            <Td><RowLinkAction to="/admin/faq/$id" params={{ id: f.id }} label={`Edit ${f.question}`} /></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
