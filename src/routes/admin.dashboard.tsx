import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeading, relative } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { simpleStatus } from "@/lib/admin/types";
import { useHomepageSettings } from "@/lib/homepage";
import { useFaqs } from "@/lib/faq";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/")({ head: adminHead("Dashboard", "Recent content and items needing editorial attention."), component: Dashboard });

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="border-t border-border pt-4"><header className="mb-2 flex items-center justify-between gap-3"><h2 className="text-xs font-semibold uppercase text-muted-foreground">{title}</h2>{action}</header>{children}</section>;
}

function Dashboard() {
  const admin = useAdmin();
  const articles = admin.content.filter((item) => item.kind === "story");
  const events = admin.content.filter((item) => item.kind === "event");
  const [homepage] = useHomepageSettings(articles.filter((item) => item.status === "published").map((item) => item.id));
  const [faqs] = useFaqs();
  const recent = [...admin.content].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const attention = [
    { count: articles.filter((item) => simpleStatus(item.status) === "In review").length, label: "articles need review", to: "/admin/articles" },
    { count: events.filter((item) => !item.fields["dates"] || !item.location).length, label: "events are missing information", to: "/admin/events-places" },
    { count: Math.max(0, 5 - homepage.hero.length), label: "Homepage Hero slots available", to: "/admin/homepage/hero" },
    { count: admin.inquiries.filter((item) => ["New", "Under review"].includes(item.status)).length, label: "collaboration requests need a response", to: "/admin/collaborations" },
    { count: faqs.filter((item) => item.status === "Draft").length, label: "FAQ drafts need publishing", to: "/admin/faq" },
  ].filter((item) => item.count > 0);

  return <div className="max-w-6xl">
    <PageHeading title="Dashboard" description="What needs your attention today." />
    <dl className="mb-8 grid grid-cols-2 border-y border-border sm:grid-cols-3 lg:grid-cols-6">{[
      [articles.length, "Articles"], [articles.filter((item) => item.status === "published").length, "Published"], [articles.filter((item) => item.status === "draft").length, "Draft"], [articles.filter((item) => simpleStatus(item.status) === "In review").length, "In Review"], [`${homepage.hero.length} / 5`, "Hero"], [events.filter((item) => item.status !== "archived").length, "Upcoming Events"],
    ].map(([value, label]) => <div key={label} className="border-r border-border px-4 py-3 last:border-r-0"><dd className="text-lg font-semibold text-ink">{value}</dd><dt className="text-xs text-muted-foreground">{label}</dt></div>)}</dl>

    <div className="grid gap-9 lg:grid-cols-2">
      <Section title="Needs Attention">{attention.length ? <ul>{attention.map((item) => <li key={item.label} className="flex items-center gap-3 border-b border-border py-3"><strong className="w-6 text-base text-primary">{item.count}</strong><span className="flex-1 text-sm text-ink">{item.label}</span><Link to={item.to} className="text-xs text-primary">Open →</Link></li>)}</ul> : <p className="py-4 text-sm text-muted-foreground">Nothing needs attention right now.</p>}</Section>
      <Section title="Recent Content" action={<Link to="/admin/articles" className="text-xs text-primary">View all →</Link>}><ul>{recent.map((item) => <li key={item.id} className="flex items-center gap-3 border-b border-border py-3"><Link to="/admin/content/$id" params={{ id: item.id }} className="min-w-0 flex-1 truncate text-sm font-medium text-ink hover:text-primary">{item.title}</Link><span className="text-xs text-muted-foreground">{simpleStatus(item.status)} · {relative(item.updatedAt)}</span></li>)}</ul></Section>
      <Section title="Homepage Hero" action={<Link to="/admin/homepage/hero" className="text-xs text-primary">Manage Hero →</Link>}><ol>{homepage.hero.map((hero, index) => { const item = admin.getContent(hero.articleId) ?? admin.getContent(`c-${hero.articleId}`); return <li key={hero.articleId} className="flex gap-3 border-b border-border py-3 text-sm"><span className="w-5 text-muted-foreground">{index + 1}.</span><span className="text-ink">{item?.title ?? "Missing article"}</span></li>; })}</ol></Section>
      <Section title="Coming Events" action={<Link to="/admin/events-places" className="text-xs text-primary">Manage →</Link>}><ul>{events.slice(0, 5).map((item) => <li key={item.id} className="flex items-center gap-3 border-b border-border py-3"><span className="w-28 text-xs text-muted-foreground">{item.fields["dates"] ?? "Date needed"}</span><Link to="/admin/content/$id" params={{ id: item.id }} className="text-sm text-ink hover:text-primary">{item.title}</Link></li>)}</ul></Section>
      <Section title="Recent Activity"><ul>{admin.activity.filter((item) => !item.sensitive).slice(0, 6).map((item) => <li key={item.id} className="flex gap-3 border-b border-border py-3 text-sm"><span className="w-24 shrink-0 text-xs text-muted-foreground">{relative(item.date)}</span><span className="text-ink">{item.actor} {item.action}</span></li>)}</ul></Section>
    </div>
  </div>;
}