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
  return <section className={cn("rounded-lg border border-border bg-background", className)}>
    <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"><h2 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>{action}</header>
    {children}
  </section>;
}

function NotConnected({ compact = false }: { compact?: boolean }) {
  return <div className={cn("flex flex-col items-center justify-center gap-2 px-6 text-center", compact ? "py-8" : "py-14")}>
    <PlugZap className="h-5 w-5 text-muted-foreground" aria-hidden />
    <p className="text-sm font-medium text-ink">Analytics not connected</p>
    <Link to="/admin/settings" search={{ tab: "analytics" }} className="text-sm font-medium text-primary hover:underline">Connect Analytics</Link>
  </div>;
}

function Stat({ label, value, delta, tip, muted }: { label: string; value: string; delta?: number | null; tip: string; muted?: boolean }) {
  return <div className="min-w-0 px-4 py-3" title={tip}>
    <p className="flex items-center gap-1 text-xs text-muted-foreground">{label}<Info className="h-3 w-3 opacity-60" aria-label={tip} /></p>
    <p className={cn("mt-1 text-2xl font-semibold tabular-nums", muted ? "text-muted-foreground/60" : "text-ink")}>{value}</p>
    {delta !== undefined && delta !== null ? <p className={cn("text-xs tabular-nums", delta >= 0 ? "text-primary" : "text-deep-red")}>{delta >= 0 ? "+" : ""}{delta.toFixed(1)}% vs previous</p> : <p className="text-xs text-muted-foreground">{muted ? "Not connected" : " "}</p>}
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
    { n: articles.filter((a) => a.status === "Draft").length, label: "Draft Articles", to: "/admin/articles", search: { status: "Draft" } },
    { n: articles.filter((a) => a.status === "In Review").length, label: "Articles in Review", to: "/admin/articles", search: { status: "In Review" } },
    { n: events.filter((e) => e.status !== "Archived" && (e.fields["missing"] || !e.image || !e.summary)).length, label: "Events missing information", to: "/admin/experience", search: { tab: "events", missing: "1" } },
    { n: cms.byType("heritage").filter((h) => !h.image).length, label: "Heritage records missing image", to: "/admin/heritage", search: {} },
    { n: cms.requests.filter((r) => r.status === "New").length, label: "Collaboration Requests unread", to: "/admin/collaborations", search: { tab: "requests" } },
  ].filter((i) => i.n > 0);
  const heroShort = hp.hero.length < 5;

  const recent = [...cms.records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 8);
  const recentRequests = [...cms.requests].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)).slice(0, 5);

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Period" className="flex rounded-md border border-border p-0.5">
          {(["7", "30", "90", "custom"] as Period[]).map((p) => <button key={p} type="button" aria-pressed={period === p} onClick={() => setPeriod(p)} className={cn("h-8 rounded px-2.5 text-xs font-medium transition", period === p ? "bg-blush text-primary" : "text-muted-foreground hover:text-ink")}>{p === "custom" ? "Custom" : `Last ${p} days`}</button>)}
        </div>
        {period === "custom" ? <span className="flex items-center gap-1"><input type="date" aria-label="From" value={from} onChange={(e) => setFrom(e.target.value)} className={cn(inputClass, "h-9 w-auto")} /><span className="text-xs text-muted-foreground">–</span><input type="date" aria-label="To" value={to} onChange={(e) => setTo(e.target.value)} className={cn(inputClass, "h-9 w-auto")} /></span> : null}
        <label className="flex h-9 items-center gap-2 px-1 text-xs text-muted-foreground"><input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="h-4 w-4 accent-primary" />Compare to previous period</label>
      </div>
    </div>

    <div className="grid grid-cols-2 divide-border rounded-lg border border-border bg-background sm:grid-cols-3 xl:grid-cols-6 [&>*]:border-border [&>*:not(:last-child)]:border-b sm:[&>*]:border-b-0 sm:[&>*:nth-child(-n+3)]:border-b xl:[&>*]:!border-b-0 xl:[&>*:not(:last-child)]:border-r">
      <Stat label="Views" value={NO_DATA} muted tip="Total page views." />
      <Stat label="Visitors" value={NO_DATA} muted tip="Unique people who visited during the selected period." />
      <Stat label="Avg. Engaged Time" value={NO_DATA} muted tip="Average active reading or interaction time." />
      <Stat label="Articles Published" value={String(published)} delta={delta(published, publishedPrev)} tip="Articles first published in this period." />
      <Stat label="Collaboration Requests" value={String(requests)} delta={delta(requests, requestsPrev)} tip="Requests received through the Collaborate page in this period." />
      <Stat label="Upcoming Events" value={String(upcoming.length)} tip="Events starting today or later." />
    </div>

    <Section title="Traffic overview" action={<div className="flex rounded-md border border-border p-0.5 opacity-50" aria-disabled><span className="rounded bg-blush px-2 py-0.5 text-xs text-primary">Views</span><span className="px-2 py-0.5 text-xs text-muted-foreground">Visitors</span></div>}>
      <NotConnected />
    </Section>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Section title="Top content"><NotConnected compact /></Section>
      <Section title="Needs attention">
        <ul className="divide-y divide-border">
          {attention.map((i) => <li key={i.label}><Link to={i.to as never} search={i.search as never} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-sand"><span className="w-8 text-right font-semibold tabular-nums text-primary">{i.n}</span><span className="flex-1 text-ink">{i.label}</span><ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /></Link></li>)}
          {heroShort ? <li><Link to="/admin/homepage" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-sand"><span className="w-8 text-right font-semibold tabular-nums text-primary">{hp.hero.length}/5</span><span className="flex-1 text-ink">Homepage Hero articles</span><ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /></Link></li> : null}
          {!attention.length && !heroShort ? <li className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing needs attention right now.</li> : null}
        </ul>
      </Section>
    </div>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Section title="Recent content">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-[0.6875rem] uppercase tracking-wide text-muted-foreground"><th className="px-4 py-2 font-medium">Title</th><th className="hidden px-3 py-2 font-medium sm:table-cell">Type</th><th className="px-3 py-2 font-medium">Status</th><th className="hidden px-3 py-2 font-medium md:table-cell">Updated</th><th className="hidden px-3 py-2 font-medium lg:table-cell">Editor</th></tr></thead>
          <tbody>{recent.map((r) => <tr key={r.id} onClick={() => void navigate({ to: editPath(r.type), params: { id: r.id } } as never)} className="cursor-pointer border-b border-border last:border-0 hover:bg-sand">
            <td className="max-w-[16rem] truncate px-4 py-2.5 font-medium text-ink">{r.title || "Untitled"}</td>
            <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell">{TYPE_LABEL[r.type].one}</td>
            <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
            <td className="hidden px-3 py-2.5 text-muted-foreground md:table-cell">{formatWhen(r.updatedAt)}</td>
            <td className="hidden px-3 py-2.5 text-muted-foreground lg:table-cell">{r.updatedBy}</td>
          </tr>)}</tbody>
        </table></div>
      </Section>
      <Section title="Upcoming events" action={<Link to="/admin/experience" className="text-xs font-medium text-primary hover:underline">View Experience →</Link>}>
        <ul className="divide-y divide-border">{upcoming.slice(0, 6).map((e) => <li key={e.id}><Link to="/admin/experience/$id" params={{ id: e.id }} className="flex items-start gap-3 px-4 py-2.5 hover:bg-sand">
          <span className="w-14 shrink-0 text-xs font-medium text-primary">{new Date(e.fields["startDate"]!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          <span className="min-w-0"><span className="block truncate text-sm text-ink">{e.title}</span><span className="block truncate text-xs text-muted-foreground">{[e.fields["location"], e.fields["country"]].filter(Boolean).join(", ")}</span></span>
        </Link></li>)}
        {!upcoming.length ? <li className="px-4 py-8 text-center text-sm text-muted-foreground">No upcoming events.</li> : null}</ul>
      </Section>
    </div>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Section title="Recent collaboration requests" action={<Link to="/admin/collaborations" search={{ tab: "requests" }} className="text-xs font-medium text-primary hover:underline">View Requests →</Link>}>
        <ul className="divide-y divide-border">{recentRequests.map((r) => <li key={r.id}><Link to="/admin/collaborations/requests/$id" params={{ id: r.id }} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 px-4 py-2.5 hover:bg-sand sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto]">
          <span className="min-w-0"><span className="block truncate text-sm text-ink">{r.name}</span><span className="block truncate text-xs text-muted-foreground">{r.organisation}</span></span>
          <span className="hidden truncate text-sm text-muted-foreground sm:block">{r.country}</span>
          <span className="hidden truncate text-sm text-muted-foreground sm:block">{r.intent}</span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">{r.status === "New" ? <StatusBadge status="New" /> : null}{formatWhen(r.receivedAt)}</span>
        </Link></li>)}</ul>
      </Section>
      <Section title="Top countries"><NotConnected compact /></Section>
    </div>
  </div>;
}
