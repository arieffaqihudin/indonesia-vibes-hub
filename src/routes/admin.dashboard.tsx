import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Info, PlugZap } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { stories } from "@/data/content";
import { adminHead } from "@/lib/admin/head";
import { useHomepageSettings } from "@/lib/homepage";
import { formatWhen, useCms } from "@/lib/cms/store";
import { TYPE_LABEL, editPath } from "@/lib/cms/types";
import { StatusBadge, NO_DATA, inputClass } from "@/components/cms/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard")({
  head: adminHead("Dashboard", "Website performance, content that needs attention and what is coming up."),
  component: Dashboard,
});

const DAY = 86_400_000;
type Period = "7" | "30" | "90" | "custom";

function Section({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn("min-w-0", className)}>
    <header className="flex items-baseline justify-between gap-3 border-b border-border/70 pb-2.5"><h2 className="text-base font-semibold text-ink">{title}</h2>{action}</header>
    {children}
  </section>;
}

function TextLink({ children, ...props }: { children: ReactNode } & Record<string, unknown>) {
  return <Link {...(props as { to: "/admin/articles" })} className="group inline-flex items-center gap-1 text-[0.8125rem] font-medium text-primary transition-colors duration-200 hover:text-deep-red">{children}<ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" /></Link>;
}

function NotConnected({ compact = false }: { compact?: boolean }) {
  return <div className={cn("flex flex-col items-start gap-1.5", compact ? "py-6" : "py-10")}>
    <p className="flex items-center gap-2 text-sm text-ink"><PlugZap className="h-4 w-4 text-muted-foreground" aria-hidden />Analytics not connected</p>
    <span className="text-[0.8125rem] text-muted-foreground">Ask your developer to connect a visitor-tracking service.</span>
  </div>;
}

function Stat({ label, value, delta, tip, muted }: { label: string; value: string; delta?: number | null; tip: string; muted?: boolean }) {
  return <div className="min-w-0 py-4 pr-4 sm:px-5 first:sm:pl-0" title={tip}>
    <p className="flex items-center gap-1 text-xs text-muted-foreground">{label}<Info className="h-3 w-3 opacity-50" aria-label={tip} /></p>
    <p className={cn("mt-1.5 text-[1.875rem] leading-none font-semibold tracking-tight tabular-nums", muted ? "text-muted-foreground/50" : "text-ink")}>{value}</p>
    {delta !== undefined && delta !== null ? <p className={cn("mt-1.5 text-xs tabular-nums", delta >= 0 ? "text-primary" : "text-deep-red")}>{delta >= 0 ? "+" : ""}{delta.toFixed(1)}%</p> : <p className="mt-1.5 text-xs text-muted-foreground/80">{muted ? "Not connected" : "\u00a0"}</p>}
  </div>;
}

function Dashboard() {
  const cms = useCms();
  const navigate = useNavigate();
  const [hp] = useHomepageSettings(stories.map((s) => s.id));
  const [period, setPeriod] = useState<Period>("30");
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * DAY).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [compare, setCompare] = useState(true);

  const range = useMemo(() => {
    const end = period === "custom" ? new Date(to).getTime() + DAY : Date.now();
    const start = period === "custom" ? new Date(from).getTime() : end - Number(period) * DAY;
    return { start, end, prevStart: start - (end - start) };
  }, [period, from, to]);

  const articles = cms.byType("article");
  const events = cms.byType("event");
  const inRange = (iso: string | undefined, a: number, b: number) => { if (!iso) return false; const t = new Date(iso).getTime(); return t >= a && t < b; };
  const delta = (cur: number, prev: number) => (!compare ? null : prev === 0 ? (cur === 0 ? 0 : null) : ((cur - prev) / prev) * 100);

  const published = articles.filter((a) => a.status === "Published" && inRange(a.publishedAt, range.start, range.end)).length;
  const publishedPrev = articles.filter((a) => a.status === "Published" && inRange(a.publishedAt, range.prevStart, range.start)).length;
  const requests = cms.requests.filter((r) => inRange(r.receivedAt, range.start, range.end)).length;
  const requestsPrev = cms.requests.filter((r) => inRange(r.receivedAt, range.prevStart, range.start)).length;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.status !== "Archived" && (e.fields["startDate"] ?? "") >= today).sort((a, b) => (a.fields["startDate"] ?? "").localeCompare(b.fields["startDate"] ?? ""));

  const attention = [
    { n: articles.filter((a) => a.status === "Draft").length, label: "Draft Articles", cta: "Review drafts", to: "/admin/articles", search: { status: "Draft" } },
    { n: articles.filter((a) => a.status === "In Review").length, label: "Articles in Review", cta: "Review", to: "/admin/articles", search: { status: "In Review" } },
    { n: events.filter((e) => e.status !== "Archived" && (e.fields["missing"] || !e.image || !e.summary)).length, label: "Events missing information", cta: "Complete data", to: "/admin/experience", search: { tab: "events", missing: "1" } },
    { n: cms.byType("heritage").filter((h) => !h.image).length, label: "Heritage records missing image", cta: "Add images", to: "/admin/heritage", search: {} },
    { n: cms.requests.filter((r) => r.status === "New").length, label: "Collaboration Requests unread", cta: "Review requests", to: "/admin/collaborations", search: { tab: "requests" } },
  ].filter((i) => i.n > 0);
  const heroShort = hp.hero.length < 5;

  const recent = [...cms.records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 8);
  const recentRequests = [...cms.requests].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)).slice(0, 5);

  const row = "flex items-center gap-3 py-3 text-sm transition-colors duration-200 hover:bg-background/70 -mx-2 px-2 rounded-md";
  return <div className="mx-auto max-w-[1280px] space-y-10 pb-10">
    <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
      <div><h1 className="text-[1.875rem] leading-tight font-semibold tracking-tight text-ink">Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">Overview of Indonesia Vibes performance and activity.</p></div>
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Period" className="flex rounded-lg bg-muted/70 p-0.5">
          {(["7", "30", "90", "custom"] as Period[]).map((p) => <button key={p} type="button" aria-pressed={period === p} onClick={() => setPeriod(p)} className={cn("h-8 rounded-md px-3 text-xs font-medium transition-all duration-200", period === p ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>{p === "custom" ? "Custom" : `${p} days`}</button>)}
        </div>
        {period === "custom" ? <span className="flex items-center gap-1"><input type="date" aria-label="From" value={from} onChange={(e) => setFrom(e.target.value)} className={cn(inputClass, "h-8 w-auto")} /><span className="text-xs text-muted-foreground">–</span><input type="date" aria-label="To" value={to} onChange={(e) => setTo(e.target.value)} className={cn(inputClass, "h-8 w-auto")} /></span> : null}
        <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="h-3.5 w-3.5 accent-primary" />Compare to previous period</label>
      </div>
    </div>

    <div className="grid grid-cols-2 border-y border-border/70 sm:grid-cols-3 xl:grid-cols-6 sm:[&>*]:border-border/70 sm:[&>*:not(:nth-child(3n))]:border-r xl:[&>*]:!border-r xl:[&>*:last-child]:!border-r-0 [&>*:nth-child(-n+4)]:border-b [&>*:nth-child(-n+4)]:border-border/50 sm:[&>*:nth-child(-n+4)]:border-b-0 sm:[&>*:nth-child(-n+3)]:!border-b xl:[&>*]:!border-b-0">
      <Stat label="Views" value={NO_DATA} muted tip="Total page views." />
      <Stat label="Visitors" value={NO_DATA} muted tip="Unique people who visited during the selected period." />
      <Stat label="Avg. Engaged Time" value={NO_DATA} muted tip="Average active reading or interaction time." />
      <Stat label="Published" value={String(published)} delta={delta(published, publishedPrev)} tip="Articles first published in this period." />
      <Stat label="Collaboration Requests" value={String(requests)} delta={delta(requests, requestsPrev)} tip="Requests received through the Collaborate page in this period." />
      <Stat label="Upcoming Events" value={String(upcoming.length)} tip="Events starting today or later." />
    </div>

    <Section title="Traffic overview" action={<div className="flex gap-3 text-xs opacity-50" aria-disabled><span className="font-medium text-ink underline decoration-primary decoration-2 underline-offset-4">Views</span><span className="text-muted-foreground">Visitors</span></div>}>
      <NotConnected />
    </Section>

    <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Section title="Top content" className="order-2 lg:order-1"><NotConnected compact /></Section>
      <Section title="Needs attention" className="order-1 lg:order-2">
        <ul className="divide-y divide-border/60">
          {attention.map((i) => <li key={i.label}><Link to={i.to as never} search={i.search as never} className={cn(row, "group items-start")}>
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span className="min-w-0 flex-1"><span className="block text-ink"><span className="font-semibold tabular-nums">{i.n}</span> {i.label}</span><span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-primary">{i.cta}<ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" /></span></span>
          </Link></li>)}
          {heroShort ? <li><Link to="/admin/homepage" className={cn(row, "group items-start")}><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden /><span className="min-w-0 flex-1"><span className="block text-ink">Homepage Hero has <span className="font-semibold tabular-nums">{hp.hero.length} / 5</span> Articles</span><span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-primary">Edit Homepage<ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" /></span></span></Link></li> : null}
          {!attention.length && !heroShort ? <li className="py-6 text-sm text-muted-foreground">Nothing needs attention right now.</li> : null}
        </ul>
      </Section>
    </div>

    <Section title="Recent content" action={<TextLink to="/admin/articles">View all</TextLink>}>
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-muted-foreground"><th className="py-2.5 pr-3 font-normal">Title</th><th className="hidden px-3 py-2.5 font-normal sm:table-cell">Type</th><th className="px-3 py-2.5 font-normal">Status</th><th className="hidden px-3 py-2.5 font-normal md:table-cell">Updated</th><th className="hidden py-2.5 pl-3 font-normal lg:table-cell">Editor</th></tr></thead>
        <tbody>{recent.map((r) => <tr key={r.id} onClick={() => void navigate({ to: editPath(r.type), params: { id: r.id } } as never)} className="cursor-pointer border-t border-border/50 transition-colors duration-200 hover:bg-background/70">
          <td className="max-w-[22rem] truncate py-3 pr-3 font-medium text-ink">{r.title || "Untitled"}</td>
          <td className="hidden px-3 py-3 text-muted-foreground sm:table-cell">{TYPE_LABEL[r.type].one}</td>
          <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
          <td className="hidden px-3 py-3 text-[0.8125rem] text-muted-foreground md:table-cell">{formatWhen(r.updatedAt)}</td>
          <td className="hidden py-3 pl-3 text-[0.8125rem] text-muted-foreground lg:table-cell">{r.updatedBy}</td>
        </tr>)}</tbody>
      </table></div>
    </Section>

    <div className="grid gap-10 lg:grid-cols-2">
      <Section title="Upcoming events" action={<TextLink to="/admin/experience">View Experience</TextLink>}>
        <ul>{upcoming.slice(0, 6).map((e) => { const d = new Date(e.fields["startDate"]!); return <li key={e.id}><Link to="/admin/experience/$id" params={{ id: e.id }} className={cn(row, "items-start gap-4")}>
          <span className="w-10 shrink-0 text-center leading-none"><span className="block text-lg font-semibold tabular-nums text-ink">{d.toLocaleDateString("en-GB", { day: "2-digit" })}</span><span className="mt-0.5 block text-[0.625rem] font-semibold tracking-wider text-primary uppercase">{d.toLocaleDateString("en-GB", { month: "short" })}</span></span>
          <span className="min-w-0 border-l border-border/70 pl-4"><span className="block truncate text-sm font-medium text-ink">{e.title}</span><span className="block truncate text-xs text-muted-foreground">{[e.fields["location"], e.fields["country"]].filter(Boolean).join(", ")}</span></span>
        </Link></li>; })}
        {!upcoming.length ? <li className="py-6 text-sm text-muted-foreground">No upcoming events. <Link to="/admin/experience" className="font-medium text-primary">Add an Event →</Link></li> : null}</ul>
      </Section>
      <Section title="Recent collaboration requests" action={<TextLink to="/admin/collaborations" search={{ tab: "requests" }}>View Requests</TextLink>}>
        <ul className="divide-y divide-border/50">{recentRequests.map((r) => <li key={r.id}><Link to="/admin/collaborations/requests/$id" params={{ id: r.id }} className={cn(row, "items-start")}>
          <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="truncate text-sm font-medium text-ink">{r.organisation || r.name}</span>{r.status === "New" ? <StatusBadge status="New" /> : null}</span><span className="block truncate text-xs text-muted-foreground">{[r.name, r.country, r.intent].filter(Boolean).join(" · ")}</span></span>
          <span className="shrink-0 text-xs text-muted-foreground">{formatWhen(r.receivedAt)}</span>
        </Link></li>)}
        {!recentRequests.length ? <li className="py-6 text-sm text-muted-foreground">No collaboration requests yet.</li> : null}</ul>
      </Section>
      <Section title="Top countries"><NotConnected compact /></Section>
    </div>
  </div>;
}
