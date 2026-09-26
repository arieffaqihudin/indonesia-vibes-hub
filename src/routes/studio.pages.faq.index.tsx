import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { useKept } from "@/lib/cms/kept";
import { adminHead } from "@/lib/studio/head";
import { FAQ_CATEGORIES, FAQ_PLACEMENTS, FAQ_STATUSES, sortFaqs, useFaqs, type Faq } from "@/lib/faq";
import { formatWhen } from "@/lib/cms/store";
import { matches } from "@/lib/cms/search";
import { DataList, type Column } from "@/components/cms/DataList";
import { EmptyState, PageHeader, StatusBadge, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/studio/pages/faq/")({
  head: adminHead("FAQ", "Manage frequently asked questions."),
  component: FaqList,
});

const placementLabel = (id: string) => FAQ_PLACEMENTS.find((p) => p.id === id)?.label ?? id;

function FaqList() {
  const [faqs] = useFaqs();
  const navigate = useNavigate();
  const [q, setQ] = useKept("admin.pages.faq.index:21", "");
  const [category, setCategory] = useKept("admin.pages.faq.index:22", "");
  const [status, setStatus] = useKept("admin.pages.faq.index:23", "");
  const rows = sortFaqs(faqs).filter((f) => (!q || matches(f.question, q)) && (!category || f.category === category) && (!status || f.status === status));
  const columns: Column<Faq>[] = [
    { key: "q", label: "Question", render: (f) => f.question || "Untitled question" },
    { key: "cat", label: "Category", render: (f) => f.category, priority: 2 },
    { key: "used", label: "Used on", render: (f) => <span className="line-clamp-1 whitespace-normal">{f.placements.map(placementLabel).join(", ")}</span>, priority: 3 },
    { key: "status", label: "Status", render: (f) => <StatusBadge status={f.status} /> },
    { key: "updated", label: "Updated", render: (f) => formatWhen(f.updatedAt), priority: 3 },
  ];
  return <>
    <Link to="/studio/pages" className={`${btn.ghost} -ml-2 mb-2`}><ArrowLeft className="h-4 w-4" />Pages</Link>
    <PageHeader title="FAQ" actions={<Link to="/studio/pages/faq/$id" params={{ id: "new" }} className={btn.primary}><Plus className="h-4 w-4" />New FAQ</Link>} />
    <DataList rows={rows} columns={columns} onOpen={(f) => void navigate({ to: "/studio/pages/faq/$id", params: { id: f.id } })} search={q} onSearch={setQ} searchPlaceholder="Search questions…"
      filters={[{ label: "Category", value: category, options: [...FAQ_CATEGORIES], onChange: setCategory }, { label: "Status", value: status, options: [...FAQ_STATUSES], onChange: setStatus }]}
      empty={<EmptyState filtered={Boolean(faqs.length)} title={faqs.length ? "No questions match these filters." : "No questions yet."} text={faqs.length ? "Try another search or adjust your filters." : "Add your first question."} />} />
  </>;
}
