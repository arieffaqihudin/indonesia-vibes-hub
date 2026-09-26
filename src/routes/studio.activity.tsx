import { createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { adminHead } from "@/lib/studio/head";
import { deviceLabel } from "@/lib/cms/activity";
import { Modal, fmtDateTime } from "@/components/cms/Modal";
import { FilterBar } from "@/components/cms/FilterBar";
import { EmptyState, PageHeader, btn } from "@/components/cms/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio/activity")({
  head: adminHead("Activity", "A read-only record of important CMS actions."),
  component: ActivityPage,
});

const PAGE = 50;
const MODULES = ["Account", "Articles", "Heritage", "People & Organisations", "Experience", "Collaborations", "Homepage", "Pages", "Topics", "Collections", "Users", "Access"];
const ACTIONS = ["Login", "Logout", "Create", "Publish", "Unpublish", "Archive", "Delete", "User Created", "User Updated", "User Disabled", "User Enabled", "User Deleted", "Invitation Sent", "Access Role Created", "Access Role Updated", "Access Role Deleted", "Homepage Updated"];
const RANGES = [{ value: "1", label: "Last 24 hours" }, { value: "7", label: "Last 7 days" }, { value: "30", label: "Last 30 days" }, { value: "90", label: "Last 90 days" }];

type Row = { id: string; created_at: string; actor_name: string; action: string; module: string; item: string; detail: unknown; device: string };

function ActivityPage() {
  const [q, setQ] = useState("");
  const [range, setRange] = useState("30");
  const [user, setUser] = useState("");
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<Row | null>(null);

  const { data: people = [] } = useQuery({ queryKey: ["cms-activity-people"], queryFn: async () => (await supabase.from("cms_users").select("name").is("deleted_at", null).order("name")).data?.map((u) => u.name) ?? [] });
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["cms-activity", q, range, user, module, action, page],
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      let query = supabase.from("cms_activity").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1).abortSignal(signal);
      if (range) query = query.gte("created_at", new Date(Date.now() - Number(range) * 86400000).toISOString());
      if (user) query = query.eq("actor_name", user);
      if (module) query = query.eq("module", module);
      if (action) query = query.eq("action", action);
      const t = q.trim().replace(/[%,()]/g, "");
      if (t) query = query.or(`item.ilike.%${t}%,actor_name.ilike.%${t}%,action.ilike.%${t}%`);
      const { data: rows, count, error } = await query;
      if (error) throw error;
      return { rows: (rows ?? []) as Row[], count: count ?? 0 };
    },
  });
  const reset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(0); };
  const rows = data?.rows ?? [];
  const pages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE));
  const cols = "md:grid-cols-[10rem_minmax(0,0.9fr)_minmax(0,0.9fr)_8rem_minmax(0,1.2fr)_8rem]";

  return <div>
    <PageHeader title="Activity" description="A read-only record of important actions in the CMS." />
    <FilterBar search={{ value: q, onChange: reset(setQ), placeholder: "Search activity…", label: "Search activity" }} filters={[
      { label: "Time", value: range, onChange: reset(setRange), options: RANGES, emptyLabel: "Any time" },
      { label: "User", value: user, onChange: reset(setUser), options: people, emptyLabel: "All users" },
      { label: "Module", value: module, onChange: reset(setModule), options: MODULES, emptyLabel: "All modules" },
      { label: "Activity", value: action, onChange: reset(setAction), options: ACTIONS, emptyLabel: "All activity" },
    ]} />
    {isLoading ? <p className="py-8 text-sm text-muted-foreground">Loading…</p> : !rows.length ? <EmptyState filtered={Boolean(q || range || user || module || action)} title="No activity found" text={q || range || user || module || action ? "Try a longer date range or clear the filters." : "Activity will appear here as changes are made."} /> :
      <div className={cn("divide-y divide-border border-y border-border transition-opacity", isFetching && "opacity-70")}>
        <div className={cn("hidden gap-4 px-2 py-2 text-xs font-medium text-muted-foreground md:grid", cols)}><span>Time</span><span>User</span><span>Activity</span><span>Module</span><span>Item</span><span>Device</span></div>
        {rows.map((r) => <button key={r.id} type="button" onClick={() => setOpen(r)} className={cn("grid w-full gap-0.5 px-2 py-2.5 text-left text-sm transition-colors hover:bg-sand active:bg-blush md:items-center md:gap-4", cols)}>
          <span className="order-last text-xs text-muted-foreground md:order-none md:text-sm">{fmtDateTime(r.created_at)}</span>
          <span className="truncate font-medium text-ink md:font-normal">{r.actor_name || "—"} <span className="font-normal text-muted-foreground md:hidden">· {r.action}</span></span>
          <span className="hidden truncate text-ink md:block">{r.action}</span>
          <span className="hidden truncate text-muted-foreground md:block">{r.module}</span>
          <span className="truncate text-ink">{r.item || "—"}</span>
          <span className="hidden truncate text-xs text-muted-foreground md:block">{deviceLabel(r.device)}</span>
        </button>)}
      </div>}
    {pages > 1 ? <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>Page {page + 1} of {pages}</span><div className="flex gap-2"><button type="button" className={btn.secondary} disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><button type="button" className={btn.secondary} disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</button></div></div> : null}
    {open ? <Modal title="Activity details" onClose={() => setOpen(null)}>
      <dl className="grid gap-x-4 gap-y-2.5 text-sm sm:grid-cols-[8rem_1fr]">
        <dt className="text-muted-foreground">User</dt><dd className="text-ink">{open.actor_name || "—"}</dd>
        <dt className="text-muted-foreground">Action</dt><dd className="text-ink">{open.action}</dd>
        <dt className="text-muted-foreground">Date & Time</dt><dd className="text-ink">{fmtDateTime(open.created_at)}</dd>
        <dt className="text-muted-foreground">Module</dt><dd className="text-ink">{open.module}</dd>
        <dt className="text-muted-foreground">Item</dt><dd className="text-ink">{open.item || "—"}</dd>
        {Object.entries((open.detail ?? {}) as Record<string, string>).map(([k, v]) => <Fragment key={k}><dt className="text-muted-foreground">{k}</dt><dd className="text-ink">{String(v)}</dd></Fragment>)}
        <dt className="text-muted-foreground">Device</dt><dd className="text-ink">{deviceLabel(open.device)}</dd>
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">Activity records can't be edited or deleted.</p>
    </Modal> : null}
  </div>;
}
