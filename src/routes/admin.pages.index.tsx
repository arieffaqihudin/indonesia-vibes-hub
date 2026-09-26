import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { adminHead } from "@/lib/admin/head";
import { useFaqs } from "@/lib/faq";
import { formatWhen, useCms } from "@/lib/cms/store";
import { PageHeader, StatusBadge } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/pages/")({
  head: adminHead("Pages", "Edit About, Editorial Standards, FAQ and Contact."),
  component: Pages,
});

function Pages() {
  const { pages } = useCms();
  const [faqs] = useFaqs();
  const page = (id: string) => pages.find((p) => p.id === id)!;
  const rows = [
    { to: "/admin/pages/$page", params: { page: "about" }, title: "About Indonesia Vibes", meta: "Who we are, mission, approach, our team", status: page("about").status, updated: page("about").updatedAt },
    { to: "/admin/pages/$page", params: { page: "editorial-standards" }, title: "Editorial Standards", meta: "How content is checked and credited", status: page("editorial-standards").status, updated: page("editorial-standards").updatedAt },
    { to: "/admin/pages/faq", params: {}, title: "FAQ", meta: `${faqs.length} questions`, status: "Published", updated: faqs.map((f) => f.updatedAt).sort().at(-1) },
    { to: "/admin/pages/$page", params: { page: "contact" }, title: "Contact", meta: "Contact details and page text", status: page("contact").status, updated: page("contact").updatedAt },
  ];
  return <>
    <PageHeader title="Pages" />
    <ul className="divide-y divide-border rounded-lg border border-border bg-background">
      {rows.map((r) => <li key={r.title}><Link to={r.to as never} params={r.params as never} className="flex items-center gap-4 px-4 py-3.5 hover:bg-sand">
        <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-ink">{r.title}</span><span className="block truncate text-xs text-muted-foreground">{r.meta}</span></span>
        <StatusBadge status={r.status} /><span className="hidden w-28 text-right text-xs text-muted-foreground sm:block">{formatWhen(r.updated)}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link></li>)}
    </ul>
  </>;
}
