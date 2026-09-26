import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Info, PlugZap } from "lucide-react";
import { useState, type ReactNode } from "react";

import { events as sourceEvents, stories } from "@/data/content";
import { supabase } from "@/integrations/supabase/client";
import { adminHead } from "@/lib/studio/head";
import { seedRecords, seedRequests } from "@/lib/cms/seed";
import { useHomepageSettings } from "@/lib/homepage";
import { useCms } from "@/lib/cms/store";
import { btn, inputClass } from "@/components/cms/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio/dashboard")({
  head: adminHead("Dashboard", "Overview of Indonesia Vibes performance and activity."),
  component: Dashboard,
});

type Period = "7" | "30" | "90" | "year" | "custom";
const PERIODS: { value: Period; label: string }[] = [
  { value: "7", label: "Last 7 Days" }, { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" }, { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];
const METRICS = [
  { label: "Unique Visitors", tip: "Distinct visitors during the selected period." },
  { label: "Page Views", tip: "Total pages viewed during the selected period." },
  { label: "Avg. Engaged Time", tip: "Average time visitors actively interacted with content." },
  { label: "Returning Visitors", tip: "Share of visitors who came back during the selected period." },
];
const exampleRecordIds = new Set(seedRecords().map((record) => record.id));
const exampleRequestIds = new Set(seedRequests().map((request) => request.id));

function Section({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn("min-w-0", className)}>
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 pb-3">
      <h2 className="min-w-0 text-base font-semibold text-ink">{title}</h2>{action}
    </header>
    {children}
  </section>;
}

function EmptyAnalytics({ message = "Analytics data is not connected yet." }: { message?: string }) {
  return <div className="flex min-h-28 flex-col justify-center gap-1 py-5">
    <p className="flex items-center gap-2 text-sm font-medium text-ink"><PlugZap aria-hidden className="h-4 w-4 text-primary" />{message}</p>
    <p className="text-xs text-muted-foreground">Audience figures will appear when a visitor analytics source is connected.</p>
  </div>;
}

function MoreLink({ to, children, search }: { to: "/studio/activity" | "/studio/experience"; children: ReactNode; search?: Record<string, string> }) {
  return <Link to={to} search={search as never} className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:text-deep-red">{children}<ArrowRight aria-hidden className="h-3.5 w-3.5" /></Link>;
}

function Dashboard() {
  const cms = useCms();
  const [homepage] = useHomepageSettings(stories.map((story) => story.id));
  const [period, setPeriod] = useState<Period>("30");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trend, setTrend] = useState<"Visitors" | "Page Views">("Visitors");
  const articles = cms.byType("article").filter((record) => !exampleRecordIds.has(record.id));
  const events = cms.byType("event").filter((record) => !exampleRecordIds.has(record.id));
  const today = new Date().toISOString().slice(0, 10);
  const sevenDays = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
  // The sample calendar rolls forward; show only editorially fixed, verified events or complete new records.
  const upcoming = events.filter((record) => {
    const source = sourceEvents.find((event) => event.id === record.id);
    const date = record.fields["startDate"] ?? "";
    return record.status === "Published" && date >= today && /^\d{4}-\d{2}-\d{2}$/.test(date)
      && Boolean(record.title && record.fields["location"] && record.fields["country"])
      && (!source || Boolean(source.fixedDate && !source.needsVerification?.length && source.datePrecision !== "month"));
  }).sort((a, b) => (a.fields["startDate"] ?? "").localeCompare(b.fields["startDate"] ?? "")).slice(0, 4);
  const heroIncomplete = homepage.hero.filter((item) => {
    const article = cms.getRecord(item.articleId) ?? cms.getRecord(`c-${item.articleId}`);
    return !article || article.status !== "Published" || !(item.image || article.image);
  }).length;
  const attention = [
    { n: cms.requests.filter((request) => !exampleRequestIds.has(request.id) && request.status === "New").length, label: "new collaboration requests", to: "/studio/collaborations", search: { tab: "requests" } },
    { n: articles.filter((article) => article.status === "In Review").length, label: "articles waiting for review", to: "/studio/articles", search: { status: "In Review" } },
    { n: events.filter((event) => event.status === "Published" && (event.fields["startDate"] ?? "") >= today && (event.fields["startDate"] ?? "") <= sevenDays && (event.fields["missing"] || !event.image || !event.summary)).length, label: "upcoming events missing information", to: "/studio/experience", search: { tab: "events", missing: "1" } },
    { n: heroIncomplete, label: "homepage hero items incomplete", to: "/studio/homepage", search: {} },
    { n: cms.byType("heritage").filter((record) => !exampleRecordIds.has(record.id) && record.status === "Published" && !record.image).length, label: "published heritage pages missing a cover", to: "/studio/heritage", search: {} },
  ].filter((item) => item.n > 0);
  const { data: activity, isLoading: activityLoading, isError: activityError } = useQuery({
    queryKey: ["cms-dashboard-activity"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_activity").select("id,actor_name,action,module,item,created_at").order("created_at", { ascending: false }).limit(5);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });
  const row = "flex min-w-0 items-center gap-3 rounded-[var(--btn-radius-sm)] px-2 py-3 transition-colors hover:bg-sand";

  return <div className="mx-auto max-w-[1280px] space-y-9 pb-12 sm:space-y-11">
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 pt-1 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0"><h1 className="text-2xl font-semibold text-ink sm:text-3xl">Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">Overview of Indonesia Vibes performance and activity.</p></div>
      <div className="min-w-0 sm:text-right">
        <div className="relative inline-flex items-center">
          <select aria-label="Analytics period" value={period} onChange={(event) => setPeriod(event.target.value as Period)} className={cn(inputClass, "h-[var(--btn-h)] w-36 cursor-pointer appearance-none rounded-[var(--btn-radius)] border-btn-border bg-sand/40 pr-8 text-xs font-medium sm:w-40")}>{PERIODS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      {period === "custom" ? <div className="col-span-2 flex flex-wrap items-center gap-2 sm:w-full sm:justify-end"><input type="date" aria-label="From" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} className={cn(inputClass, "h-10 w-auto rounded-[var(--btn-radius)]")} /><span className="text-muted-foreground">–</span><input type="date" aria-label="To" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} className={cn(inputClass, "h-10 w-auto rounded-[var(--btn-radius)]")} /></div> : null}
    </header>

    <section aria-label="Audience performance">
      <div className="mb-3"><p className="text-[0.6875rem] font-semibold uppercase text-muted-foreground">Audience performance</p></div>
      <div className="grid grid-cols-2 border-y border-border/70 md:grid-cols-4">
        {METRICS.map(({ label, tip }, index) => <div key={label} className={cn("min-w-0 py-5", index % 2 ? "pl-4" : "pr-4", index < 2 && "border-b border-border/70 md:border-b-0", index % 2 === 1 && "border-l border-border/70", index > 1 && "md:border-l md:border-border/70 md:pl-5", index === 1 && "md:border-l md:border-border/70 md:pl-5")}>
          <p className="text-3xl font-semibold tabular-nums text-ink">—</p><p className="mt-2 flex items-center gap-1 text-xs font-medium text-ink sm:text-sm">{label}<span title={tip} aria-label={tip}><Info className="h-3 w-3 text-muted-foreground" /></span></p><p className="mt-1 text-xs text-muted-foreground">Not connected</p>
        </div>)}
      </div>
    </section>

    <Section title="Audience Trend" action={<div role="group" aria-label="Trend metric" className="flex rounded-[var(--btn-radius)] border border-btn-border bg-sand/50 p-0.5">{(["Visitors", "Page Views"] as const).map((metric) => <button key={metric} type="button" onClick={() => setTrend(metric)} aria-pressed={trend === metric} className={cn(btn.ghost, "h-8 rounded-[var(--btn-radius-sm)] px-2.5 text-xs", trend === metric && "bg-background text-deep-red")}>{metric}</button>)}</div>}>
      <div className="flex min-h-52 items-center justify-center sm:min-h-72"><EmptyAnalytics /></div>
    </Section>

    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
      <Section title="What People Are Reading" className="order-2 lg:order-1"><EmptyAnalytics message="Content performance is not connected yet." /></Section>
      <Section title="Needs Attention" className="order-1 lg:order-2">
        <ul className="divide-y divide-border/60">{attention.map((item) => <li key={item.label}><Link to={item.to as never} search={item.search as never} className={row}><span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span className="min-w-0 flex-1 text-sm text-ink"><strong className="font-semibold tabular-nums">{item.n}</strong> {item.label}</span><ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-primary" /></Link></li>)}</ul>
        {!attention.length ? <p className="py-6 text-sm text-muted-foreground">Nothing needs attention right now.</p> : null}
      </Section>
    </div>

    <div className="grid gap-10 md:grid-cols-2">
      <Section title="Audience Interest"><EmptyAnalytics message="Cultural interest data is not connected yet." /></Section>
      <Section title="Global Audience"><EmptyAnalytics message="Country-level audience data is not connected yet." /></Section>
    </div>

    <div className="grid gap-10 md:grid-cols-2">
      <Section title="How People Find Indonesia Vibes"><EmptyAnalytics message="Traffic source data is not connected yet." /></Section>
      <Section title="Coming Up" action={<MoreLink to="/studio/experience" search={{ tab: "events" }}>View Experience</MoreLink>}>
        {upcoming.length ? <ul className="divide-y divide-border/60">{upcoming.map((event) => { const date = new Date(`${event.fields["startDate"]}T12:00:00Z`); return <li key={event.id}><Link to="/studio/experience/$id" params={{ id: event.id }} className={row}><span className="w-11 shrink-0 text-center text-xs font-semibold uppercase text-primary"><span className="block text-lg leading-none tabular-nums text-ink">{date.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "UTC" })}</span>{date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}</span><span className="min-w-0 border-l border-border pl-3"><span className="block truncate text-sm font-medium text-ink">{event.title}</span><span className="block truncate text-xs text-muted-foreground">{[event.fields["location"], event.fields["country"]].filter(Boolean).join(", ")}</span></span></Link></li>; })}</ul> : <p className="py-6 text-sm text-muted-foreground">No verified upcoming events to show.</p>}
      </Section>
    </div>

    <Section title="Recent Activity" action={<MoreLink to="/studio/activity">View Activity Log</MoreLink>}>
      {activityLoading ? <div aria-label="Loading recent activity" className="space-y-3 py-5">{[1, 2, 3].map((index) => <div key={index} className="h-8 animate-pulse rounded-[var(--btn-radius-sm)] bg-muted/60" />)}</div> : activityError ? <p className="py-6 text-sm text-muted-foreground">Recent activity is unavailable right now.</p> : activity?.length ? <ol className="divide-y divide-border/60">{activity.map((entry) => <li key={entry.id} className="flex min-w-0 items-start justify-between gap-4 py-3 text-sm"><span className="min-w-0 text-ink"><span className="font-medium">{entry.actor_name || "A team member"}</span> {entry.action.toLowerCase()} <span className="font-medium">{entry.item || entry.module}</span></span><time dateTime={entry.created_at} className="shrink-0 text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</time></li>)}</ol> : <p className="py-6 text-sm text-muted-foreground">No activity recorded yet.</p>}
    </Section>
  </div>;
}
